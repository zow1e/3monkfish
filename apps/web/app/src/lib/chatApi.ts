function apiBase(): string {
  return import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
}

/** GET target to verify the API is up (proxied in dev the same way as chat). */
export function apiHealthUrl(): string {
  const base = apiBase();
  if (base) return `${base}/api/health`;
  return '/api/health';
}

/** POST target for RAG chat. Default: `/api/chat` (Vite dev proxies to the Express API on port 4000). */
export function chatPostUrl(): string {
  const base = apiBase();
  if (base) return `${base}/api/chat`;
  return '/api/chat';
}

/** POST TinyFish listings scrape (existing `listingsScrapeController` — body unchanged). */
export function listingsScrapeUrl(): string {
  const base = apiBase();
  if (base) return `${base}/api/listings/scrape`;
  return '/api/listings/scrape';
}
