import type { RawTinyFishListing } from '../schemas/rawTinyFish';
import { normalizedListingBatchSchema, type NormalizedListing, type NormalizedListingBatch } from '../schemas/normalizedListing';
import { normalizeGenericRetailerListing } from '../normalizers/genericRetailer';
import { normalizeLazadaListing } from '../normalizers/lazada';
import { normalizeShopeeListing } from '../normalizers/shopee';
import { normalizeTikTokShopListing } from '../normalizers/tiktokShop';
import { dedupeByKey } from '../utils/dedupe';

const normalizers = {
  lazada: normalizeLazadaListing,
  shopee: normalizeShopeeListing,
  'tiktok-shop': normalizeTikTokShopListing,
  'generic-retailer': normalizeGenericRetailerListing,
} as const;

export const normalizeListing = (listing: RawTinyFishListing): NormalizedListing => {
  const normalizer =
    (listing.marketplace && normalizers[listing.marketplace as keyof typeof normalizers]) ??
    normalizeGenericRetailerListing;

  return normalizer(listing);
};

export const normalizeListings = (listings: readonly RawTinyFishListing[]): NormalizedListingBatch =>
  normalizedListingBatchSchema.parse(dedupeByKey(listings.map(normalizeListing), (listing) => listing.id));
