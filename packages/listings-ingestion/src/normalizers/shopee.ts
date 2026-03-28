import type { RawTinyFishListing } from '../schemas/rawTinyFish';
import type { NormalizedListing } from '../schemas/normalizedListing';
import { normalizeGenericRetailerListing } from './genericRetailer';

export const normalizeShopeeListing = (listing: RawTinyFishListing): NormalizedListing =>
  normalizeGenericRetailerListing({
    ...listing,
    marketplace: 'shopee',
    source: listing.source || 'shopee',
    retailer: listing.retailer ?? 'Shopee seller',
  });
