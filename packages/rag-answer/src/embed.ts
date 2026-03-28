import type { RagEnv } from "./config.js";

/** Avoids duplicate OpenAI class types when callers import `openai` from another copy in the tree. */
export type EmbeddingsClient = {
  embeddings: {
    create(args: { model: string; input: string[] }): Promise<{
      data: Array<{ index: number; embedding: number[] }>;
    }>;
  };
};

export async function embedTexts(
  env: RagEnv,
  client: EmbeddingsClient,
  inputs: string[],
): Promise<number[][]> {
  const model = env.OPENAI_EMBEDDING_MODEL;
  const res = await client.embeddings.create({
    model,
    input: inputs,
  });

  const out = res.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);

  for (const vec of out) {
    if (vec.length !== env.EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Embedding length ${vec.length} !== EMBEDDING_DIMENSIONS ${env.EMBEDDING_DIMENSIONS}`,
      );
    }
  }
  return out;
}
