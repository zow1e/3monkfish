import { runScrapeJob } from '@petcare/listings-ingestion';
import type { TinyFishScrapeRequest } from '@petcare/types';

export const ingestTinyfishListings = async (request: TinyFishScrapeRequest): Promise<void> => {
  await runScrapeJob(request);
};
