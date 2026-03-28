import type { TinyFishScrapeRequest } from '@petcare/types';

export interface TinyFishScrapeQueueMessage {
  id: string;
  createdAt: string;
  request: TinyFishScrapeRequest;
}

export const enqueueTinyFishScrape = async (
  request: TinyFishScrapeRequest,
): Promise<TinyFishScrapeQueueMessage> => ({
  id: `tinyfish-${Date.now()}`,
  createdAt: new Date().toISOString(),
  request,
});
