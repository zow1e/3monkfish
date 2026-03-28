import type { RawTinyFishListing } from '../schemas/rawTinyFish';
import type { NormalizedListing } from '../schemas/normalizedListing';
import { normalizeGenericRetailerListing } from './genericRetailer';

export const normalizeLazadaListing = (listing: RawTinyFishListing): NormalizedListing =>
  normalizeGenericRetailerListing({
    ...listing,
    marketplace: 'lazada',
    source: listing.source || 'lazada',
    retailer: listing.retailer ?? 'Lazada seller',
  });
