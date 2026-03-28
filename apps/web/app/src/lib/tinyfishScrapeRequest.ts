/**
 * Build the single `keywords` string TinyFish expects (see `tinyFishScrapeRequestSchema` + `buildStartUrl`).
 * Uses lowercase tokens and single spaces so `encodeURIComponent` in site strategies stays predictable.
 */
export function buildTinyfishKeywordsString(tokens: string[]): string {
  return tokens
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Stable JSON body for `POST .../listings/scrape` (validated by `tinyFishScrapeRequestSchema` on the API). */
export function buildListingsScrapeBody(params: {
  keywords: string;
  maxProductsPerSite: number;
  sites?: readonly string[];
}) {
  const keywords = params.keywords.replace(/\s+/g, ' ').trim();
  const sites = params.sites ?? (['amazon', 'petmall', 'petlovers'] as const);
  return {
    keywords,
    sites: [...sites],
    maxProductsPerSite: Math.min(10, Math.max(1, Math.floor(Number(params.maxProductsPerSite)))),
  };
}
