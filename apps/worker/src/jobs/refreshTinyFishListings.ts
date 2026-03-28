import type { TinyFishScrapeRequest } from '@petcare/types';
import { enqueueTinyFishScrape } from './enqueueTinyFishScrape';

export const refreshTinyFishListings = async (request: TinyFishScrapeRequest): Promise<void> => {
  await enqueueTinyFishScrape(request);
};
