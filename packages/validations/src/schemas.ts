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

export const supportedSiteSchema = z.enum(['amazon', 'petmall', 'petlovers']);
export const tinyFishSearchTypeSchema = z.enum(['product', 'service']);
export const tinyFishRequestSourceSchema = z.enum(['direct', 'chatbot', 'search-page']);

/**
 * POST /listings/scrape — matches TinyFish `runScrapeJob` / `runSiteScrape`:
 * - `keywords`: one search string (spaces OK; used in goal text and URL encoding for Amazon/PetMall).
 * - `sites`: unique `amazon` | `petmall` | `petlovers`.
 */
export const tinyFishScrapeRequestSchema = z.object({
  keywords: z.preprocess(
    (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : v),
    z.string().min(1),
  ),
  sites: z
    .array(supportedSiteSchema)
    .min(1)
    .transform((sites) => [...new Set(sites)]),
  maxProductsPerSite: z.coerce.number().int().min(1).max(10).optional(),
  countryCode: z.preprocess(
    (v) => {
      if (v === undefined || v === null || v === '') return undefined;
      return typeof v === 'string' ? v.trim().toUpperCase() : v;
    },
    z.string().length(2).optional(),
  ),
  searchType: tinyFishSearchTypeSchema.optional(),
  requestSource: tinyFishRequestSourceSchema.optional(),
  filenameTag: z.string().trim().min(1).optional(),
});

const nullableTextSchema = z.string().trim().min(1).nullable().optional();

export const rawTinyFishProductSchema = z.object({
  name: z.string().trim().min(1).optional(),
  image: z.string().trim().min(1).optional(),
  price: z.number().nonnegative().nullable().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
  reviews: z.number().int().nonnegative().nullable().optional(),
  in_stock: z.boolean().nullable().optional(),
  listing_url: z.string().trim().min(1).optional(),
  shipping_fee: z.number().nonnegative().nullable().optional(),
  delivery_countries: z.array(z.string().trim().min(1)).nullable().optional(),
  description_text: nullableTextSchema,
  review_text: nullableTextSchema,
  product_keywords: z.array(z.string().trim().min(1)).optional(),
  source_site: supportedSiteSchema,
});

export const rawTinyFishSiteResultSchema = z.object({
  products: z.array(rawTinyFishProductSchema),
  blocked_reason: z.string().trim().min(1).nullable().optional(),
  notes: z.string().trim().min(1).nullable().optional(),
});

export const normalizedProductListingSchema = z.object({
  id: z.string().min(1),
  source_site: supportedSiteSchema,
  search_keywords: z.string().trim().min(1),
  name: z.string().trim().min(1).nullable(),
  image: z.string().trim().min(1).nullable(),
  price: z.number().nonnegative().nullable(),
  rating: z.number().min(0).max(5).nullable(),
  reviews: z.number().int().nonnegative().nullable(),
  in_stock: z.boolean().nullable(),
  listing_url: z.string().trim().min(1).nullable(),
  shipping_fee: z.number().nonnegative().nullable(),
  delivery_countries: z.array(z.string().trim().min(1)),
  product_keywords: z.array(z.string().trim().min(1)),
  description_text: z.string().nullable(),
  review_text: z.string().nullable(),
});

export const normalizedProductListingBatchSchema = z.array(normalizedProductListingSchema);

export const tinyFishRunOutcomeSchema = z.object({
  status: z.enum(['completed', 'failed', 'blocked', 'partial']),
  source_site: supportedSiteSchema,
  raw_result: z.unknown(),
  normalized_results: normalizedProductListingBatchSchema,
  error_message: z.string().optional(),
  used_stealth_fallback: z.boolean().optional(),
  raw_file_path: z.string().optional(),
  normalized_file_path: z.string().optional(),
});

export const chatbotKeywordScrapeRequestSchema = z.object({
  sites: z.array(supportedSiteSchema).min(1),
  maxProductsPerSite: z.coerce.number().int().min(1).max(10).optional(),
  countryCode: z.string().trim().min(2).max(2).optional(),
  placeholderKeywords: z.array(z.string().trim().min(1)).optional(),
  searchType: tinyFishSearchTypeSchema.optional(),
});

export const searchPageScrapeRequestSchema = z.object({
  searchType: tinyFishSearchTypeSchema,
  searchInput: z.string().trim().min(1),
  sites: z.array(supportedSiteSchema).min(1),
  maxProductsPerSite: z.coerce.number().int().min(1).max(10).optional(),
  countryCode: z.string().trim().min(2).max(2).optional(),
});
