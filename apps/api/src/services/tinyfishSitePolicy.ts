import type { SupportedSite, TinyFishSearchType } from '@petcare/types';

export const AMAZON_ONLY_PRODUCT_SITES: SupportedSite[] = ['amazon'];

const dedupeSites = (sites: readonly SupportedSite[]): SupportedSite[] => [...new Set(sites)];

export const resolveSitesForSearchType = (
  searchType: TinyFishSearchType | undefined,
  requestedSites: readonly SupportedSite[] | undefined,
): SupportedSite[] => {
  if (searchType === undefined || searchType === 'product') {
    return AMAZON_ONLY_PRODUCT_SITES;
  }

  if (!requestedSites || requestedSites.length === 0) {
    // TODO: replace this fallback once dedicated service sources are implemented.
    return AMAZON_ONLY_PRODUCT_SITES;
  }

  return dedupeSites(requestedSites);
};
