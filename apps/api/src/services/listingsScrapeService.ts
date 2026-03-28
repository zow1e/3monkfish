import { runScrapeJob } from '@petcare/listings-ingestion';
import type { TinyFishScrapeJobResult } from '@petcare/types';
import { tinyFishScrapeRequestSchema } from '@petcare/validations';

export class ListingsScrapeService {
  async execute(input: unknown): Promise<TinyFishScrapeJobResult> {
    const request = tinyFishScrapeRequestSchema.parse(input);
    return runScrapeJob(request);
  }
}
