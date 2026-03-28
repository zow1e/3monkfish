import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  // postgresql://… (passwords may include characters z.string().url() rejects)
  DATABASE_URL: z.string().min(1),
  OPENAI_EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
  EMBEDDING_DIMENSIONS: z.coerce.number().default(1536),
  OPENAI_CHAT_MODEL: z.string().default("gpt-4o-mini"),
});

export type RagEnv = z.infer<typeof envSchema>;

export function loadRagEnv(): RagEnv {
  return envSchema.parse(process.env);
}
