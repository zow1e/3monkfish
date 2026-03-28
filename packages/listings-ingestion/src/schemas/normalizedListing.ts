import { z } from 'zod';

export const normalizedListingSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  marketplace: z.string().optional(),
  retailer: z.string().optional(),
  listingType: z.enum(['provider', 'product', 'service']),
  title: z.string().min(1),
  description: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  price: z.number().nonnegative().optional(),
  currency: z.string().min(1).optional(),
  location: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
  searchKeywords: z.array(z.string()).default([]),
  discoveredAt: z.string(),
  normalizedAt: z.string(),
  freshnessTimestamp: z.string(),
  raw: z.record(z.unknown()).default({}),
});

export const normalizedListingBatchSchema = z.array(normalizedListingSchema);

export type NormalizedListing = z.infer<typeof normalizedListingSchema>;
export type NormalizedListingBatch = z.infer<typeof normalizedListingBatchSchema>;
