import { normalizeListings as normalizeProductListings } from '@petcare/listings-ingestion';
import type { RawTinyFishProduct } from '@petcare/types';

export const normalizeListings = async (
  listings: RawTinyFishProduct[],
  searchKeywords: string,
): Promise<void> => {
  normalizeProductListings(listings, searchKeywords);
};
