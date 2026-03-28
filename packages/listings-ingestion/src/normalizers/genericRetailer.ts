import type { RawTinyFishListing } from '../schemas/rawTinyFish';
import { normalizedListingSchema, type NormalizedListing } from '../schemas/normalizedListing';
import { buildKeywordSet } from '../utils/keywords';
import { resolveFreshnessTimestamp } from '../utils/freshness';

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const normalizeGenericRetailerListing = (listing: RawTinyFishListing): NormalizedListing =>
  normalizedListingSchema.parse({
    id: listing.id ?? `${listing.source}-${slugify(listing.title ?? 'untitled')}`,
    source: listing.source,
    marketplace: listing.marketplace,
    retailer: listing.retailer,
    listingType: listing.listingType,
    title: listing.title?.trim() || 'Untitled',
    description: listing.description?.trim(),
    canonicalUrl: listing.url,
    price: listing.price,
    currency: listing.currency?.toUpperCase(),
    location: listing.location?.trim(),
    rating: listing.rating,
    reviewCount: listing.reviewCount,
    searchKeywords: buildKeywordSet(
      [listing.title ?? ''],
      [listing.retailer ?? ''],
      [listing.marketplace ?? ''],
    ),
    discoveredAt: listing.scrapedAt,
    normalizedAt: new Date().toISOString(),
    freshnessTimestamp: resolveFreshnessTimestamp(listing.scrapedAt),
    raw: listing.payload,
  });
