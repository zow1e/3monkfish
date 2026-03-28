import { createOpenAiClient } from './client';
import type { ChatCompletionInput } from './types';

export const runChatCompletion = async (input: ChatCompletionInput): Promise<string> => {
  const client = createOpenAiClient();
  const model = process.env.OPENAI_MODEL!;
  const response = await client.responses.create({
    model,
    input: [
      { role: 'system', content: input.systemPrompt },
      { role: 'user', content: input.userPrompt },
    ],
  });

  return response.output_text;
};
