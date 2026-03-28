import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string(),
  OPENAI_EMBEDDING_MODEL: z.string(),
  PGVECTOR_ENABLED: z.enum(['true', 'false']).default('false'),
  TINYFISH_RAW_DATA_DIR: z.string(),
  TINYFISH_NORMALIZED_DATA_DIR: z.string(),
});

export type AppEnv = z.infer<typeof envSchema>;

export const readEnv = (source: NodeJS.ProcessEnv = process.env): AppEnv => envSchema.parse(source);
