import OpenAI from 'openai';
import { openAiEnvSchema } from './env';

export const createOpenAiClient = (source: NodeJS.ProcessEnv = process.env) => {
  const env = openAiEnvSchema.parse(source);
  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
};
