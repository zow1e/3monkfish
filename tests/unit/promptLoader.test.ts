import { describe, expect, it } from 'vitest';
import { loadPromptTemplate } from '../../packages/prompts/src/loaders/loadPrompt';

describe('loadPromptTemplate', () => {
  it('loads chatbot system prompt', async () => {
    const prompt = await loadPromptTemplate('chatbot-system.md');
    expect(prompt.length).toBeGreaterThan(10);
  });
});
