import { z } from 'zod';

export const tinyFishMarketplaceSchema = z.enum(['shopee', 'lazada', 'tiktok-shop', 'generic-retailer']);

export const rawTinyFishListingTypeSchema = z.enum(['provider', 'product', 'service']);

export const rawTinyFishListingSchema = z.object({
  source: z.string().min(1),
  marketplace: tinyFishMarketplaceSchema.optional(),
  retailer: z.string().optional(),
  listingType: rawTinyFishListingTypeSchema,
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  price: z.number().nonnegative().optional(),
  currency: z.string().min(1).optional(),
  location: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
  scrapedAt: z.string(),
  payload: z.record(z.unknown()).default({}),
});

export const rawTinyFishBatchSchema = z.array(rawTinyFishListingSchema);

export type RawTinyFishListing = z.infer<typeof rawTinyFishListingSchema>;
export type RawTinyFishBatch = z.infer<typeof rawTinyFishBatchSchema>;
export type TinyFishMarketplace = z.infer<typeof tinyFishMarketplaceSchema>;
