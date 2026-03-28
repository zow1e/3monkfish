import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, Sparkles, ListChecks, Phone, ShoppingBag } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { apiHealthUrl, chatPostUrl, listingsScrapeUrl } from '../lib/chatApi';
import { extractKeywordsFromPlainText, ragAnswerToPlainText } from '../lib/ragKeywords';
import {
  parseAllProductsFromListingsResponse,
  scrapeJobStatus,
  type ScrapedProduct,
} from '../lib/listingsScrapeResponse';
import { buildListingsScrapeBody, buildTinyfishKeywordsString } from '../lib/tinyfishScrapeRequest';
import { loadPets } from '../lib/petStore';
import { HOLLAND_LOP_FAQ_QUESTIONS } from '../data/hollandLopFaq';

type Message = { role: 'ai' | 'user'; text: string };

const TINYFISH_SITES = ['amazon'] as const;
/** Max allowed by `tinyFishScrapeRequestSchema` — request as many products per site as the API permits. */
const MAX_PRODUCTS_PER_SITE = 10;

function formatSpecies(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Human-readable lines for the TinyFish debug panel (matches `ListingsScrapeApiResponse` keys). */
function linesFromScrapeResponse(data: unknown): string[] {
  const lines: string[] = [];
  if (typeof data !== 'object' || data === null) {
    return ['(response is not a JSON object)'];
  }
  const d = data as Record<string, unknown>;
  if (typeof d.status === 'string') lines.push(`aggregate job status: ${d.status}`);
  if (typeof d.keywords === 'string') lines.push(`keywords echoed: ${d.keywords}`);
  if (Array.isArray(d.requestedSites)) {
    lines.push(`sites: ${d.requestedSites.map(String).join(', ')}`);
  }
  if (typeof d.startedAt === 'string' && typeof d.completedAt === 'string') {
    lines.push('server window:');
    lines.push(`  startedAt: ${d.startedAt}`);
    lines.push(`  completedAt: ${d.completedAt}`);
  }
  if (Array.isArray(d.products)) {
    lines.push(`normalized products (top-level array): ${d.products.length}`);
  }
  const outcomes = d.siteOutcomes;
  if (Array.isArray(outcomes) && outcomes.length > 0) {
    lines.push('per-site:');
    for (const o of outcomes) {
      if (typeof o !== 'object' || o === null) continue;
      const r = o as Record<string, unknown>;
      const site = typeof r.source_site === 'string' ? r.source_site : '?';
      const st = typeof r.status === 'string' ? r.status : '?';
      const nr = r.normalized_results;
      const n = Array.isArray(nr) ? nr.length : 0;
      const stealth = r.used_stealth_fallback === true ? ' · stealth fallback' : '';
      let row = `  ${site}: ${st} · ${n} product(s)${stealth}`;
      if (typeof r.error_message === 'string' && r.error_message.trim()) {
        row += ` · ${r.error_message}`;
      }
      lines.push(row);
    }
  }
  const files = d.files;
  if (files && typeof files === 'object' && files !== null) {
    const f = files as { raw?: unknown; normalized?: unknown };
    const rawC = Array.isArray(f.raw) ? f.raw.length : 0;
    const normC = Array.isArray(f.normalized) ? f.normalized.length : 0;
    lines.push(`files on API host: raw=${rawC} · normalized=${normC}`);
  }
  return lines;
}

export default function AIChat() {
  const location = useLocation();
  const pets = useMemo(() => loadPets(), [location.pathname, location.key]);

  const [msgs, setMsgs] = useState<Message[]>([
    {
      role: 'ai',
      text: "Hello! I'm your PetCare Copilot. Choose a Holland Lop FAQ below, or type your own question. Answers are educational only—not a substitute for a veterinarian.",
    },
  ]);
  const [input, setInput] = useState('');
  const [active, setActive] = useState(0);
  const [pending, setPending] = useState(false);
  /** null = not checked yet; false = API unreachable (Vite proxy will fail chat). */
  const [apiReachable, setApiReachable] = useState<boolean | null>(null);

  /** Up to 15 tokens from the latest RAG plain-text answer (for TinyFish `keywords` string). */
  const [lastKeywords, setLastKeywords] = useState<string[]>([]);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<ScrapedProduct[]>([]);
  const [lastScrapeStatus, setLastScrapeStatus] = useState<string | null>(null);
  /** TinyFish scrape: request/response trace for debugging (shown below the button). */
  const [scrapeDebugLines, setScrapeDebugLines] = useState<string[]>([]);
  const [scrapeElapsedLabel, setScrapeElapsedLabel] = useState('0.0s');
  const scrapeStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!scrapeLoading) return;
    const id = window.setInterval(() => {
      const t0 = scrapeStartedAtRef.current;
      if (t0 != null) setScrapeElapsedLabel(`${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }, 250);
    return () => window.clearInterval(id);
  }, [scrapeLoading]);

  useEffect(() => {
    let cancelled = false;
    fetch(apiHealthUrl())
      .then((r) => {
        if (!cancelled) setApiReachable(r.ok);
      })
      .catch(() => {
        if (!cancelled) setApiReachable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (pets.length === 0) return;
    setActive((i) => Math.min(i, pets.length - 1));
  }, [pets.length]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setMsgs((m) => [...m, { role: 'user', text: trimmed }]);
    setInput('');
    setPending(true);
    try {
      const petId = pets[active]?.id;
      const res = await fetch(chatPostUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          ...(petId ? { petId } : {}),
        }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        let detail = `Request failed (${res.status})`;
        if (
          typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          typeof (data as { error: unknown }).error === 'string'
        ) {
          detail = (data as { error: string }).error;
        } else if (res.status === 502 || res.status === 504) {
          detail =
            'Cannot reach the PetCare API (nothing listening on port 4000). From the repo root run: pnpm --filter @petcare/api dev — or pnpm dev to start API + web together. Then reload this page.';
        }
        setMsgs((m) => [...m, { role: 'ai', text: `Sorry — ${detail}` }]);
        return;
      }
      const answer =
        typeof data === 'object' &&
        data !== null &&
        'answer' in data &&
        typeof (data as { answer: unknown }).answer === 'string'
          ? (data as { answer: string }).answer
          : '';
      const plain = ragAnswerToPlainText(answer.trim() || 'No answer returned.');
      let kws = extractKeywordsFromPlainText(plain, 15);
      if (kws.length === 0) {
        kws = extractKeywordsFromPlainText(trimmed, 15);
      }
      if (kws.length === 0) {
        kws = ['pet', 'care'];
      }
      setLastKeywords(kws);
      setRecommendedProducts([]);
      setScrapeError(null);
      setMsgs((m) => [...m, { role: 'ai', text: plain }]);
    } catch (e) {
      const hint =
        e instanceof TypeError && e.message === 'Failed to fetch'
          ? ' (Is the API running on port 4000? Run pnpm --filter @petcare/api dev from the repo root.)'
          : '';
      setMsgs((m) => [
        ...m,
        {
          role: 'ai',
          text: `Sorry — ${e instanceof Error ? e.message : 'Network error'}${hint}`,
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function onSendClick() {
    void sendMessage(input);
  }

  function onFaqClick(question: string) {
    setInput(question);
  }

  async function runTinyfishProductSearch() {
    if (lastKeywords.length === 0 || scrapeLoading) return;
    const keywordsStr = buildTinyfishKeywordsString(lastKeywords);
    if (!keywordsStr) {
      setScrapeError('No valid keywords to send to TinyFish.');
      return;
    }
    setScrapeLoading(true);
    setScrapeError(null);
    setLastScrapeStatus(null);
    const url = listingsScrapeUrl();
    const body = buildListingsScrapeBody({
      keywords: keywordsStr,
      maxProductsPerSite: MAX_PRODUCTS_PER_SITE,
      sites: TINYFISH_SITES,
      searchType: 'product',
    });
    scrapeStartedAtRef.current = Date.now();
    setScrapeElapsedLabel('0.0s');
    setScrapeDebugLines([
      `[${new Date().toISOString()}] POST ${url}`,
      `keywords: ${keywordsStr}`,
      `sites: ${TINYFISH_SITES.join(', ')} · maxProductsPerSite: ${MAX_PRODUCTS_PER_SITE}`,
      'Waiting for API (TinyFish runs remotely; this often takes 1–5+ minutes)…',
    ]);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const elapsedMs = scrapeStartedAtRef.current != null ? Date.now() - scrapeStartedAtRef.current : 0;
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        if (typeof data === 'object' && data !== null) {
          const d = data as {
            error?: unknown;
            errors?: unknown;
            status?: unknown;
          };
          if (typeof d.error === 'string' && d.error.trim()) {
            msg = d.error;
          } else if (d.errors !== undefined) {
            msg = `${msg}: ${JSON.stringify(d.errors)}`;
          } else if (d.status === 'invalid_request') {
            msg = `${msg}: ${JSON.stringify(data)}`;
          }
        }
        setScrapeDebugLines((prev) => [
          ...prev,
          `HTTP ${res.status} ${res.statusText} · ${(elapsedMs / 1000).toFixed(1)}s`,
          ...(typeof data === 'object' && data !== null
            ? [`response body: ${JSON.stringify(data).slice(0, 800)}${JSON.stringify(data).length > 800 ? '…' : ''}`]
            : ['(could not parse JSON body)']),
        ]);
        setScrapeError(msg);
        setRecommendedProducts([]);
        setLastScrapeStatus(null);
        return;
      }
      setScrapeDebugLines((prev) => [
        ...prev,
        `HTTP 200 OK · ${(elapsedMs / 1000).toFixed(1)}s`,
        ...linesFromScrapeResponse(data),
      ]);
      setLastScrapeStatus(scrapeJobStatus(data));
      const all = parseAllProductsFromListingsResponse(data);
      setRecommendedProducts(all);
    } catch (e) {
      const elapsedMs = scrapeStartedAtRef.current != null ? Date.now() - scrapeStartedAtRef.current : 0;
      const errText = e instanceof Error ? e.message : 'Product search failed';
      setScrapeDebugLines((prev) => [
        ...prev,
        `Network / client error after ${(elapsedMs / 1000).toFixed(1)}s: ${errText}`,
      ]);
      setScrapeError(errText);
      setRecommendedProducts([]);
      setLastScrapeStatus(null);
    } finally {
      setScrapeLoading(false);
    }
  }

  return (
    <div className="h-screen min-h-0 bg-surface flex flex-col overflow-hidden">
      <div className="shrink-0">
        <Header />
      </div>

      {apiReachable === false && (
        <div
          className="shrink-0 bg-surface-container-low border-b border-outline-variant/25 px-4 py-3 text-center text-sm text-on-secondary-fixed"
          role="status"
        >
          API unreachable (nothing on port 4000). From the repo root run{' '}
          <code className="text-xs bg-surface-container-low px-1.5 py-0.5 rounded">pnpm dev:stack</code> or{' '}
          <code className="text-xs bg-surface-container-low px-1.5 py-0.5 rounded">pnpm dev:api</code> in a second
          terminal, then refresh.
        </div>
      )}

      <div className="flex flex-1 min-h-0 max-w-[1200px] mx-auto w-full overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-outline-variant/15 flex flex-col px-4 py-6 min-h-0">
          <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4 px-2">
            Your pets
          </h2>

          {pets.length === 0 ? (
            <p className="text-xs text-secondary px-2 leading-relaxed">
              No pets yet. Add one from the Dashboard to see them listed here.
            </p>
          ) : (
            <ul className="space-y-2 flex-1">
              {pets.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-[1.5rem] text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
                      active === i
                        ? 'bg-primary-fixed text-primary'
                        : 'text-secondary hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-display font-semibold text-secondary text-sm shrink-0">
                      {p.name[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-on-secondary-fixed truncate">{p.name}</p>
                      <p className="text-xs text-secondary truncate">
                        {[p.breed?.trim(), formatSpecies(p.species), p.ageText].filter(Boolean).join(' · ') ||
                          '—'}
                      </p>
                    </div>
                    {active === i && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="shrink-0 flex items-center justify-center py-4 border-b border-outline-variant/10">
            <span className="bg-surface-container-low text-secondary text-xs font-semibold px-4 py-1.5 rounded-full">
              Holland Lop FAQ
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-5">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'ai' && (
                  <div className="w-9 h-9 rounded-full bg-primary-container/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                )}

                <div className={`max-w-[75%] space-y-3 ${m.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                  {m.role === 'ai' && (
                    <p className="text-[11px] font-semibold text-secondary uppercase tracking-widest">Copilot AI</p>
                  )}

                  <div
                    className={`px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-primary text-on-primary rounded-tr-sm shadow-[0_4px_16px_rgba(154,67,69,0.2)]'
                        : 'bg-surface-container-lowest text-on-secondary-fixed shadow-[0_2px_12px_-2px_rgba(67,70,88,0.08)] rounded-tl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex gap-3 justify-start">
                <div className="w-9 h-9 rounded-full bg-primary-container/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={16} className="text-primary animate-pulse" />
                </div>
                <div className="px-5 py-4 rounded-[1.5rem] text-sm text-secondary bg-surface-container-lowest/80 rounded-tl-sm">
                  Answering…
                </div>
              </div>
            )}
          </div>

          {lastKeywords.length > 0 && (
            <div className="shrink-0 px-6 pb-4 border-t border-outline-variant/10 space-y-3 bg-surface">
              <p className="text-[10px] font-semibold text-secondary uppercase tracking-widest">
                Keywords for product search (from last answer)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {lastKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-secondary-fixed"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => void runTinyfishProductSearch()}
                disabled={scrapeLoading || apiReachable === false}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-[0_4px_12px_rgba(154,67,69,0.25)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                <ShoppingBag size={16} />
                {scrapeLoading ? `Searching TinyFish… (${scrapeElapsedLabel})` : 'Find recommended products'}
              </button>
              {(scrapeLoading || scrapeDebugLines.length > 0) && (
                <div
                  className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-low/80 px-3 py-2 text-[10px] leading-relaxed font-mono text-on-secondary-fixed/90 whitespace-pre-wrap break-all"
                  aria-live="polite"
                >
                  {scrapeLoading && (
                    <p className="text-secondary mb-1.5 border-b border-outline-variant/15 pb-1.5">
                      Elapsed: {scrapeElapsedLabel} — request in flight to your API; TinyFish work happens server-side.
                    </p>
                  )}
                  {scrapeDebugLines.join('\n')}
                </div>
              )}
              {scrapeError && (
                <p className="text-xs text-red-600 dark:text-red-400">{scrapeError}</p>
              )}
              {!scrapeLoading && !scrapeError && lastScrapeStatus && (
                <p className="text-[11px] text-secondary">
                  TinyFish job: <span className="font-semibold">{lastScrapeStatus}</span>
                  {recommendedProducts.length > 0
                    ? ` · ${recommendedProducts.length} product${recommendedProducts.length === 1 ? '' : 's'}`
                    : ' · no products in normalized results'}
                </p>
              )}
              {recommendedProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {recommendedProducts.map((p, idx) => (
                    <a
                      key={p.id ?? p.listing_url ?? `${p.name ?? 'p'}-${p.source_site}-${idx}`}
                      href={p.listing_url ?? undefined}
                      target={p.listing_url ? '_blank' : undefined}
                      rel={p.listing_url ? 'noreferrer noopener' : undefined}
                      className={`block rounded-[1.25rem] border border-outline-variant/15 bg-surface-container-lowest overflow-hidden text-left ${
                        p.listing_url ? 'hover:border-primary/30 transition-colors' : 'pointer-events-none opacity-80'
                      }`}
                    >
                      {p.image && (
                        <img
                          src={p.image}
                          alt=""
                          className="w-full h-28 object-cover bg-surface-container-low"
                        />
                      )}
                      <div className="p-3 space-y-1">
                        <p className="text-xs font-semibold text-on-secondary-fixed line-clamp-2">
                          {p.name ?? 'Product'}
                        </p>
                        <p className="text-[11px] text-secondary">
                          {p.price != null ? `$${p.price.toFixed(2)}` : '—'} · {p.source_site}
                        </p>
                        {p.rating != null && (
                          <p className="text-[10px] text-secondary">★ {p.rating.toFixed(1)}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="shrink-0 px-6 pb-3">
            <p className="text-[10px] font-semibold text-secondary uppercase tracking-widest mb-2">
              FAQ questions
            </p>
            <div className="flex flex-col gap-2">
              {HOLLAND_LOP_FAQ_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onFaqClick(q)}
                  className="text-left text-xs text-on-secondary-fixed bg-surface-container-low border border-outline-variant/20 rounded-[1.25rem] px-4 py-3 hover:bg-primary-fixed/50 hover:border-primary/20 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 px-6 pb-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] flex items-center px-5 py-3 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.08)]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !pending && onSendClick()}
                placeholder="Ask anything about your pet's health..."
                className="flex-1 bg-transparent outline-none text-on-secondary-fixed text-sm placeholder:text-secondary/50 font-sans"
              />
              <div className="flex items-center gap-2 ml-3">
                <button
                  type="button"
                  className="p-1.5 text-secondary hover:text-on-secondary-fixed transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
                  aria-label="Checklist"
                >
                  <ListChecks size={16} />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-secondary hover:text-on-secondary-fixed transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
                  aria-label="Phone"
                >
                  <Phone size={16} />
                </button>
                <button
                  type="button"
                  onClick={onSendClick}
                  disabled={pending}
                  className="w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-[0_4px_12px_rgba(154,67,69,0.25)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Send"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-secondary/50 mt-2">
              AI Assistant · educational only · consult a professional for serious concerns
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
