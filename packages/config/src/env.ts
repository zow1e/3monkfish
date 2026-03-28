import { z } from 'zod';

const booleanishSchema = z.preprocess((value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }

  return value;
}, z.boolean());

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string(),
  OPENAI_EMBEDDING_MODEL: z.string(),
  PGVECTOR_ENABLED: z.enum(['true', 'false']).default('false'),
  TINYFISH_API_KEY: z.string().default(''),
  TINYFISH_DEFAULT_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  TINYFISH_DEFAULT_MAX_PRODUCTS: z.coerce.number().int().min(1).max(10).default(5),
  TINYFISH_PROXY_COUNTRY_CODE: z.string().trim().min(2).max(2).optional(),
  TINYFISH_USE_STEALTH_FALLBACK: booleanishSchema.default(true),
  TINYFISH_RAW_DATA_DIR: z.string(),
  TINYFISH_NORMALIZED_DATA_DIR: z.string(),
});

export type AppEnv = z.infer<typeof envSchema>;

export const readEnv = (source: NodeJS.ProcessEnv = process.env): AppEnv => envSchema.parse(source);

export const tinyFishEnvSchema = envSchema.pick({
  TINYFISH_API_KEY: true,
  TINYFISH_DEFAULT_TIMEOUT_MS: true,
  TINYFISH_DEFAULT_MAX_PRODUCTS: true,
  TINYFISH_PROXY_COUNTRY_CODE: true,
  TINYFISH_USE_STEALTH_FALLBACK: true,
  TINYFISH_RAW_DATA_DIR: true,
  TINYFISH_NORMALIZED_DATA_DIR: true,
});

export type TinyFishEnv = z.infer<typeof tinyFishEnvSchema>;

export const readTinyFishEnv = (source: NodeJS.ProcessEnv = process.env): TinyFishEnv =>
  tinyFishEnvSchema.parse(source);
