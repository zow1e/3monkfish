import { describe, expect, it } from 'vitest';
import { getPlaceholderChatbotKeywords } from '../../apps/api/src/services/chatbotKeywordProvider';

describe('getPlaceholderChatbotKeywords', () => {
  it('returns default placeholder chatbot keywords when none are provided', async () => {
    const result = await getPlaceholderChatbotKeywords({
      sites: ['amazon'],
    });

    expect(result).toEqual(['cat shedding brush', 'sensitive skin shampoo']);
  });

  it('returns caller-provided placeholder keywords when supplied', async () => {
    const result = await getPlaceholderChatbotKeywords({
      sites: ['amazon'],
      placeholderKeywords: ['rabbit treats', 'hay feeder'],
    });

    expect(result).toEqual(['rabbit treats', 'hay feeder']);
  });
});
