export interface OpenAiErrorShape {
  message: string;
  code?: string;
  status?: number;
}

export interface ChatCompletionInput {
  systemPrompt: string;
  userPrompt: string;
}

export interface EmbeddingInput {
  input: string;
}
