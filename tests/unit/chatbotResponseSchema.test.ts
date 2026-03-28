import { describe, expect, it } from 'vitest';
import { chatbotStructuredResponseSchema } from '../../packages/rag/src/types';

describe('chatbotStructuredResponseSchema', () => {
  it('validates expected chatbot payload shape', () => {
    const result = chatbotStructuredResponseSchema.safeParse({
      answerSummary: 'summary',
      possibleCommonCauses: [],
      homeCareTips: [],
      whenToSeeAVet: [],
      urgentRedFlags: [],
      recommendedServices: [],
      recommendedProducts: [],
      citations: [],
      disclaimer: 'not medical advice',
    });
    expect(result.success).toBe(true);
  });
});
