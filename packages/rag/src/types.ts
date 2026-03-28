import { z } from 'zod';

export interface RetrievalItem {
  id: string;
  sourceType: 'faq' | 'medical_record' | 'pet_profile' | 'listing';
  score: number;
  text: string;
  metadata?: Record<string, unknown>;
}

export const chatbotStructuredResponseSchema = z.object({
  answerSummary: z.string(),
  possibleCommonCauses: z.array(z.string()),
  homeCareTips: z.array(z.string()),
  whenToSeeAVet: z.array(z.string()),
  urgentRedFlags: z.array(z.string()),
  recommendedServices: z.array(z.string()),
  recommendedProducts: z.array(z.string()),
  citations: z.array(z.object({ id: z.string(), sourceType: z.string(), label: z.string() })),
  disclaimer: z.string(),
});
