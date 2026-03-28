import type { NormalizedProductListing, RawTinyFishProduct } from '@petcare/types';
import { normalizedProductListingBatchSchema } from '@petcare/validations';
import { normalizeProductListing } from '../normalizers/productListing';
import { dedupeByKey } from '../utils/dedupe';

export const normalizeListing = (
  listing: RawTinyFishProduct,
  searchKeywords: string,
): NormalizedProductListing => normalizeProductListing(listing, searchKeywords);

export const normalizeListings = (
  listings: readonly RawTinyFishProduct[],
  searchKeywords: string,
): NormalizedProductListing[] =>
  normalizedProductListingBatchSchema.parse(
    dedupeByKey(
      listings.map((listing) => normalizeListing(listing, searchKeywords)),
      (listing) => listing.id,
    ),
  );
