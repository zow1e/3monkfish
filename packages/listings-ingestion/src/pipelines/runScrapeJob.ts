import { readTinyFishEnv, type TinyFishEnv } from '@petcare/config';
import type { TinyFishScrapeJobResult, TinyFishScrapeRequest } from '@petcare/types';
import { writeJsonFile } from '../io/writeJson';
import { buildTinyFishFilePath } from '../utils/filenames';
import { runSiteScrape } from './runSiteScrape';

export interface RunScrapeJobOptions {
  env?: TinyFishEnv;
}

export const runScrapeJob = async (
  request: TinyFishScrapeRequest,
  options: RunScrapeJobOptions = {},
): Promise<TinyFishScrapeJobResult> => {
  const env = options.env ?? readTinyFishEnv();
  const startedAt = new Date().toISOString();

  const siteOutcomes = await Promise.all(
    request.sites.map((site) =>
      runSiteScrape(
        {
          keywords: request.keywords,
          site,
          maxProductsPerSite: request.maxProductsPerSite,
          countryCode: request.countryCode,
        },
        {
          env,
          timestamp: startedAt,
        },
      ),
    ),
  );

  const normalizedResults = siteOutcomes.flatMap((outcome) => outcome.normalized_results);
  const aggregateFilePath =
    request.sites.length > 1
      ? await writeJsonFile(
          buildTinyFishFilePath(env.TINYFISH_NORMALIZED_DATA_DIR, startedAt, 'all-sites', request.keywords),
          { products: normalizedResults },
        )
      : undefined;

  const rawFiles = siteOutcomes.flatMap((outcome) => (outcome.raw_file_path ? [outcome.raw_file_path] : []));
  const normalizedFiles = [
    ...siteOutcomes.flatMap((outcome) => (outcome.normalized_file_path ? [outcome.normalized_file_path] : [])),
    ...(aggregateFilePath ? [aggregateFilePath] : []),
  ];

  const status =
    siteOutcomes.every((outcome) => outcome.status === 'completed')
      ? 'completed'
      : siteOutcomes.some((outcome) => outcome.status === 'failed')
        ? 'failed'
        : siteOutcomes.some((outcome) => outcome.status === 'blocked')
          ? 'blocked'
          : 'partial';

  return {
    keywords: request.keywords,
    requestedSites: request.sites,
    status,
    site_outcomes: siteOutcomes,
    normalized_results: normalizedResults,
    files: {
      raw: rawFiles,
      normalized: normalizedFiles,
    },
    started_at: startedAt,
    completed_at: new Date().toISOString(),
  };
};
