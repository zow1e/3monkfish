import { z } from 'zod';

export const rawTinyfishListingSchema = z.object({
  source: z.string(),
  listingType: z.enum(['provider', 'product', 'service']),
  id: z.string().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
  location: z.string().optional(),
  rating: z.number().optional(),
  payload: z.record(z.unknown()).default({}),
  scrapedAt: z.string(),
});

export const rawTinyfishBatchSchema = z.array(rawTinyfishListingSchema);
