import { z } from 'zod';

export const ownerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  preferredArea: z.string().optional(),
  preferredVet: z.string().optional(),
  preferredGroomer: z.string().optional(),
  budgetRange: z.string().optional(),
  notificationPreferences: z.record(z.boolean()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const tinyfishRawListingSchema = z.object({
  source: z.string(),
  listingType: z.enum(['provider', 'product', 'service']),
  payload: z.record(z.unknown()),
  scrapedAt: z.string(),
});

export const chatbotResponseSchema = z.object({
  answerSummary: z.string(),
  possibleCommonCauses: z.array(z.string()),
  homeCareTips: z.array(z.string()),
  whenToSeeAVet: z.array(z.string()),
  urgentRedFlags: z.array(z.string()),
  recommendedServices: z.array(z.string()),
  recommendedProducts: z.array(z.string()),
  citations: z.array(z.object({ id: z.string(), label: z.string(), sourceType: z.string() })),
  disclaimer: z.string(),
});
