import { rawTinyfishBatchSchema } from '../schemas/rawTinyfishSchema';

export const normalizeListings = (input: unknown) => {
  const parsed = rawTinyfishBatchSchema.parse(input);
  return parsed.map((entry) => ({
    id: entry.id ?? `${entry.source}-${entry.title ?? 'unknown'}`,
    listingType: entry.listingType,
    title: entry.title ?? 'Untitled',
    source: entry.source,
    freshnessTimestamp: entry.scrapedAt,
    payload: entry.payload,
  }));
};
