import { rawTinyFishProductSchema, rawTinyFishSiteResultSchema } from '@petcare/validations';

export const rawTinyfishProductSchema = rawTinyFishProductSchema;
export const rawTinyfishSiteResultSchema = rawTinyFishSiteResultSchema;
export const rawTinyfishBatchSchema = rawTinyFishSiteResultSchema.shape.products;

// Legacy alias kept temporarily for compatibility inside the monorepo.
export const rawTinyfishListingSchema = rawTinyfishProductSchema;
