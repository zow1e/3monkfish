import { readTinyFishEnv, type TinyFishEnv } from '@petcare/config';
import type { RawTinyFishProduct, RawTinyFishSiteResult, SupportedSite, TinyFishRunOutcome } from '@petcare/types';
import { rawTinyFishSiteResultSchema } from '@petcare/validations';
import { TinyFishClient, type TinyFishAutomationRequest } from '../clients/tinyfishClient';
import { buildProductSearchGoal } from '../goals/productSearchGoal';
import { writeJsonFile } from '../io/writeJson';
import { normalizeProductListing } from '../normalizers/productListing';
import { getSiteSearchStrategy } from '../strategies/siteStrategies';
import { detectBlockedResult } from '../utils/blocked';
import { buildTinyFishFilePath } from '../utils/filenames';

export interface RunSiteScrapeInput {
  keywords: string;
  site: SupportedSite;
  maxProductsPerSite?: number;
  countryCode?: string;
}

export interface RunSiteScrapeOptions {
  client?: TinyFishClient;
  env?: TinyFishEnv;
  timestamp?: string;
}

const asOptionalString = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined);
const asOptionalNumber = (value: unknown): number | null | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : value === null ? null : undefined;

const extractProducts = (payload: unknown, site: SupportedSite): RawTinyFishProduct[] => {
  if (typeof payload !== 'object' || payload === null) {
    return [];
  }

  const candidate = payload as Record<string, unknown>;
  const products = Array.isArray(candidate.products) ? candidate.products : [];

  return products
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((product) => ({
      name: asOptionalString(product.name),
      image: asOptionalString(product.image),
      price: asOptionalNumber(product.price),
      rating: asOptionalNumber(product.rating),
      reviews: asOptionalNumber(product.reviews),
      in_stock: typeof product.in_stock === 'boolean' ? product.in_stock : product.in_stock === null ? null : undefined,
      listing_url: asOptionalString(product.listing_url),
      shipping_fee: asOptionalNumber(product.shipping_fee),
      delivery_countries: Array.isArray(product.delivery_countries)
        ? product.delivery_countries.filter((value): value is string => typeof value === 'string')
        : [],
      description_text: asOptionalString(product.description_text),
      review_text: asOptionalString(product.review_text),
      product_keywords: Array.isArray(product.product_keywords)
        ? product.product_keywords.filter((value): value is string => typeof value === 'string')
        : undefined,
      source_site: site,
    }));
};

const parseSiteResult = (payload: unknown, site: SupportedSite): RawTinyFishSiteResult => {
  const candidate = typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : {};
  const resultPayload =
    (typeof candidate.resultJson === 'object' && candidate.resultJson !== null && candidate.resultJson) ||
    (typeof candidate.result === 'object' && candidate.result !== null && candidate.result) ||
    payload;

  const parsed = rawTinyFishSiteResultSchema.safeParse(resultPayload);
  if (parsed.success) {
    return parsed.data;
  }

  return rawTinyFishSiteResultSchema.parse({
    products: extractProducts(resultPayload, site),
    blocked_reason: detectBlockedResult(payload) ? 'Blocked or empty TinyFish result detected.' : null,
    notes: parsed.error.message,
  });
};

export const runSiteScrape = async (
  input: RunSiteScrapeInput,
  options: RunSiteScrapeOptions = {},
): Promise<TinyFishRunOutcome> => {
  const env = options.env ?? readTinyFishEnv();
  const client = options.client ?? new TinyFishClient({ env });
  const strategy = getSiteSearchStrategy(input.site);
  const maxProducts = input.maxProductsPerSite ?? env.TINYFISH_DEFAULT_MAX_PRODUCTS;
  const timestamp = options.timestamp ?? new Date().toISOString();
  const proxyCountryCode = input.countryCode ?? env.TINYFISH_PROXY_COUNTRY_CODE;
  const goal = buildProductSearchGoal({
    keyword: input.keywords,
    site: input.site,
    maxProductCount: maxProducts,
  });

  const baseRequest: Omit<TinyFishAutomationRequest, 'browser_profile'> = {
    url: strategy.buildStartUrl(input.keywords),
    goal,
    timeout_ms: env.TINYFISH_DEFAULT_TIMEOUT_MS,
    proxy_config: proxyCountryCode ? { enabled: true, country_code: proxyCountryCode } : undefined,
  };

  let payload = await client.runSync({ ...baseRequest, browser_profile: 'lite' });
  let usedStealthFallback = false;

  if (
    detectBlockedResult(payload) &&
    env.TINYFISH_USE_STEALTH_FALLBACK &&
    strategy.supportsStealthFallback
  ) {
    usedStealthFallback = true;
    payload = await client.runSync({
      ...baseRequest,
      browser_profile: 'stealth',
      proxy_config: proxyCountryCode ? { enabled: true, country_code: proxyCountryCode } : { enabled: true },
    });
  }

  const parsedSiteResult = parseSiteResult(payload, input.site);
  const normalizedResults = parsedSiteResult.products.map((product) =>
    normalizeProductListing(product, input.keywords),
  );
  const filenameVariant = [input.requestSource, input.searchType, input.filenameTag].filter(Boolean).join('__');

  const rawFilePath = await writeJsonFile(
    buildTinyFishFilePath(
      env.TINYFISH_RAW_DATA_DIR,
      timestamp,
      input.site,
      input.keywords,
      filenameVariant || undefined,
    ),
    payload,
  );

  const normalizedFilePath = await writeJsonFile(
    buildTinyFishFilePath(
      env.TINYFISH_NORMALIZED_DATA_DIR,
      timestamp,
      input.site,
      input.keywords,
      filenameVariant || undefined,
    ),
    { products: normalizedResults },
  );

  const blocked = detectBlockedResult(payload);
  const status: TinyFishRunOutcome['status'] =
    blocked
      ? 'blocked'
      : normalizedResults.length === 0
        ? 'failed'
        : normalizedResults.length < maxProducts
          ? 'partial'
          : 'completed';

  return {
    status,
    source_site: input.site,
    raw_result: payload,
    normalized_results: normalizedResults,
    error_message: blocked ? parsedSiteResult.blocked_reason ?? 'Blocked or challenged result.' : undefined,
    used_stealth_fallback: usedStealthFallback,
    raw_file_path: rawFilePath,
    normalized_file_path: normalizedFilePath,
  };
};
