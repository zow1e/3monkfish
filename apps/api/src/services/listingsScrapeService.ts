import { runScrapeJob } from '@petcare/listings-ingestion';
import type { TinyFishScrapeJobResult } from '@petcare/types';
import { tinyFishScrapeRequestSchema } from '@petcare/validations';
import { resolveSitesForSearchType } from './tinyfishSitePolicy';

export class ListingsScrapeService {
  async execute(input: unknown): Promise<TinyFishScrapeJobResult> {
    const request = tinyFishScrapeRequestSchema.parse(input);
    const searchType = request.searchType ?? 'product';
    if (!process.env.TINYFISH_API_KEY?.trim()) {
      throw new Error(
        'TINYFISH_API_KEY is not set in .env (repo root). Get a key from TinyFish and set TINYFISH_API_KEY=... then restart the API.',
      );
    }
    return runScrapeJob({
      ...request,
      searchType,
      sites: resolveSitesForSearchType(searchType, request.sites),
    });
  }
}
