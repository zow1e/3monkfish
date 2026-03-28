/** POST target for RAG chat. Default: `/api/chat` (Vite dev proxies to the Express API). */
export function chatPostUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
  if (base) return `${base}/api/chat`;
  return '/api/chat';
}
