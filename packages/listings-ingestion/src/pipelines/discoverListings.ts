import type { TinyFishScrapeJobResult, TinyFishScrapeRequest } from '@petcare/types';
import { runScrapeJob } from './runScrapeJob';

export const discoverListings = async (input: TinyFishScrapeRequest): Promise<TinyFishScrapeJobResult> =>
  runScrapeJob(input);
