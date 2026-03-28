import { type ZodType, type z } from 'zod';

export interface TinyFishRequest<TInput = unknown> {
  goal: string;
  input: TInput;
  metadata?: Record<string, string>;
}

export interface TinyFishAsyncJob<TOutput = unknown> {
  id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: TOutput;
  error?: string;
}

export interface TinyFishStreamEvent<TChunk = unknown> {
  type: 'message' | 'done' | 'error';
  chunk?: TChunk;
  error?: string;
}

export interface TinyFishTransport {
  sync<TInput>(request: TinyFishRequest<TInput>): Promise<unknown>;
  stream<TInput>(request: TinyFishRequest<TInput>): AsyncIterable<unknown>;
  submitAsync<TInput>(request: TinyFishRequest<TInput>): Promise<{ id: string; status?: TinyFishAsyncJob['status'] }>;
  getAsyncResult(jobId: string): Promise<unknown>;
}

const parseWithSchema = <TSchema extends ZodType>(schema: TSchema, payload: unknown): z.infer<TSchema> =>
  schema.parse(payload);

export class TinyFishClient {
  constructor(private readonly transport: TinyFishTransport) {}

  async runSync<TSchema extends ZodType, TInput>(
    request: TinyFishRequest<TInput>,
    schema: TSchema,
  ): Promise<z.infer<TSchema>> {
    const response = await this.transport.sync(request);
    return parseWithSchema(schema, response);
  }

  async *runStream<TSchema extends ZodType, TInput>(
    request: TinyFishRequest<TInput>,
    schema: TSchema,
  ): AsyncGenerator<TinyFishStreamEvent<z.infer<TSchema>>> {
    for await (const event of this.transport.stream(request)) {
      yield {
        type: 'message',
        chunk: parseWithSchema(schema, event),
      };
    }

    yield { type: 'done' };
  }

  async runAsync<TSchema extends ZodType, TInput>(
    request: TinyFishRequest<TInput>,
    schema: TSchema,
  ): Promise<TinyFishAsyncJob<z.infer<TSchema>>> {
    const submitted = await this.transport.submitAsync(request);
    const result = await this.transport.getAsyncResult(submitted.id);

    return {
      id: submitted.id,
      status: 'completed',
      result: parseWithSchema(schema, result),
    };
  }
}
