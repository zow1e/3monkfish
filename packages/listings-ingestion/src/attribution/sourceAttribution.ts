export const buildSourceAttribution = (source: string, scrapedAt: string) => ({
  sourceName: source,
  freshnessTimestamp: scrapedAt,
});
