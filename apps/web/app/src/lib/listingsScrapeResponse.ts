/**
 * Normalized product row from `POST /api/listings/scrape` (TinyFish aggregate + per-site).
 */
export type ScrapedProduct = {
  id?: string;
  name: string | null;
  image: string | null;
  price: number | null;
  rating: number | null;
  reviews: number | null;
  listing_url: string | null;
  source_site: string;
};

type SiteOutcome = {
  normalized_results?: unknown;
};

/**
 * Collects every normalized product: top-level `products` plus each `siteOutcomes[].normalized_results`,
 * deduped by `id`, then `listing_url`, then name+site.
 */
export function parseAllProductsFromListingsResponse(data: unknown): ScrapedProduct[] {
  if (typeof data !== 'object' || data === null) return [];
  const d = data as Record<string, unknown>;
  const fromTop = Array.isArray(d.products) ? d.products : [];
  const outcomes = Array.isArray(d.siteOutcomes) ? d.siteOutcomes : [];
  const fromOutcomes = outcomes.flatMap((o) => {
    if (typeof o !== 'object' || o === null) return [];
    const nr = (o as SiteOutcome).normalized_results;
    return Array.isArray(nr) ? nr : [];
  });
  const merged: unknown[] = [...fromTop, ...fromOutcomes];
  const seen = new Set<string>();
  const out: ScrapedProduct[] = [];
  for (const raw of merged) {
    if (typeof raw !== 'object' || raw === null) continue;
    const row = raw as ScrapedProduct;
    const key =
      (row.id && String(row.id)) ||
      (row.listing_url && String(row.listing_url)) ||
      `${row.name ?? ''}-${row.source_site ?? ''}-${out.length}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

export function scrapeJobStatus(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null;
  const s = (data as { status?: unknown }).status;
  return typeof s === 'string' ? s : null;
}
