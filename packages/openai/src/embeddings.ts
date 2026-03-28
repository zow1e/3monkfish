import { createOpenAiClient } from './client';

export const createEmbedding = async (input: string): Promise<number[]> => {
  const client = createOpenAiClient();
  const model = process.env.OPENAI_EMBEDDING_MODEL!;
  const response = await client.embeddings.create({ model, input });
  return response.data[0]?.embedding ?? [];
};
