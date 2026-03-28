import { z } from 'zod';

export const openAiEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1),
  OPENAI_EMBEDDING_MODEL: z.string().min(1),
});

export type OpenAiEnv = z.infer<typeof openAiEnvSchema>;
