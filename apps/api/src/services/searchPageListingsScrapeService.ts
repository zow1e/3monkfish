import { runScrapeJob } from '@petcare/listings-ingestion';
import type { SearchPageScrapeRequest, SearchPageScrapeResult } from '@petcare/types';
import { searchPageScrapeRequestSchema } from '@petcare/validations';
import { buildCombinedPetProfileQuery } from './petProfileKeywordProvider';

export class SearchPageListingsScrapeService {
  async execute(input: unknown): Promise<SearchPageScrapeResult> {
    const request = searchPageScrapeRequestSchema.parse(input);
    const { presetKeywords, combinedKeywords } = buildCombinedPetProfileQuery(request);
    const result = await runScrapeJob({
      keywords: combinedKeywords,
      sites: request.sites,
      maxProductsPerSite: request.maxProductsPerSite,
      countryCode: request.countryCode,
      searchType: request.searchType,
      requestSource: 'search-page',
      filenameTag: request.petProfile.petId,
    });

    return {
      ...result,
      requestSource: 'search-page',
      searchType: request.searchType,
      petProfile: {
        petId: request.petProfile.petId,
        petName: request.petProfile.petName,
        species: request.petProfile.species,
        breed: request.petProfile.breed,
      },
      presetKeywords,
      combinedKeywords,
    };
  }
}
