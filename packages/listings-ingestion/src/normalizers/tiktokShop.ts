import type { RawTinyFishListing } from '../schemas/rawTinyFish';
import type { NormalizedListing } from '../schemas/normalizedListing';
import { normalizeGenericRetailerListing } from './genericRetailer';

export const normalizeTikTokShopListing = (listing: RawTinyFishListing): NormalizedListing =>
  normalizeGenericRetailerListing({
    ...listing,
    marketplace: 'tiktok-shop',
    source: listing.source || 'tiktok-shop',
    retailer: listing.retailer ?? 'TikTok Shop seller',
  });
