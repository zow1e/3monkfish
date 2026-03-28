import { runScrapeJob } from '@petcare/listings-ingestion';
import type { SearchPageScrapeResult } from '@petcare/types';
import { searchPageScrapeRequestSchema } from '@petcare/validations';
import { resolveSitesForSearchType } from './tinyfishSitePolicy';

export class SearchPageListingsScrapeService {
  async execute(input: unknown): Promise<SearchPageScrapeResult> {
    const request = searchPageScrapeRequestSchema.parse(input);
    const combinedKeywords = request.searchInput.trim();
    const sites = resolveSitesForSearchType(request.searchType, request.sites);
    const result = await runScrapeJob({
      keywords: combinedKeywords,
      sites,
      maxProductsPerSite: request.maxProductsPerSite,
      countryCode: request.countryCode,
      searchType: request.searchType,
      requestSource: 'search-page',
      filenameTag: request.searchType,
    });

    return {
      ...result,
      requestSource: 'search-page',
      searchType: request.searchType,
      combinedKeywords,
    };
  }
}
