import { useCallback, useState } from 'react';
import {
  Search, SlidersHorizontal, ChevronDown, LayoutGrid, List,
  Sparkles, Star, Package, Loader2, AlertCircle,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { searchPageListingsScrapeUrl } from '../lib/chatApi';
import { buildSearchPageScrapeBody, type TinyfishFrontendSearchType } from '../lib/tinyfishScrapeRequest';

interface Product {
  id?: string;
  source_site: string;
  search_keywords?: string;
  name: string | null;
  image: string | null;
  price: number | null;
  rating: number | null;
  reviews: number | null;
  in_stock: boolean | null;
  listing_url: string | null;
  shipping_fee: number | null;
  delivery_countries: string[];
  product_keywords: string[];
  description_text: string | null;
  review_text: string | null;
}

interface SearchResponse {
  products: Product[];
}

type SearchMode = 'products' | 'services';

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; products: Product[] }
  | { status: 'error'; message: string };

const MAX_PRODUCTS_PER_SEARCH = 5;

const MODE_CONFIG: Record<SearchMode, { label: string; placeholder: string; icon: string }> = {
  products: {
    label: 'Products',
    placeholder: 'e.g. rabbit treats, hay, accessories...',
    icon: '🛍️',
  },
  services: {
    label: 'Services',
    placeholder: 'e.g. grooming, vet clinic, pet boarding...',
    icon: '🏥',
  },
};

const toSearchType = (mode: SearchMode): TinyfishFrontendSearchType =>
  mode === 'products' ? 'product' : 'service';

const sourceBadgeColors: Record<string, string> = {
  amazon: 'bg-[#FF9900]/10 text-[#B35900]',
  petmall: 'bg-[#0B7A75]/10 text-[#0B7A75]',
  petlovers: 'bg-[#166534]/10 text-[#166534]',
};

const getFallbackImage = (site: string, width: number, height: number) =>
  `https://placehold.co/${width}x${height}/e8e8e8/5b5d70?text=${encodeURIComponent(site)}`;

const formatPrice = (price: number | null): string => (price != null ? `$${price.toFixed(2)}` : '—');

const formatRating = (rating: number | null, reviews: number | null): string => {
  if (rating == null || reviews == null) {
    return 'No rating yet';
  }

  return `${rating.toFixed(1)} (${reviews.toLocaleString()})`;
};

function useSearch() {
  const [state, setState] = useState<SearchState>({ status: 'idle' });

  const search = useCallback(async (query: string, mode: SearchMode) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setState({ status: 'loading' });

    try {
      const response = await fetch(searchPageListingsScrapeUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          buildSearchPageScrapeBody({
            searchType: toSearchType(mode),
            searchInput: trimmedQuery,
            maxProductsPerSite: MAX_PRODUCTS_PER_SEARCH,
          }),
        ),
      });

      const data: unknown = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          typeof (data as { error?: unknown }).error === 'string'
            ? (data as { error: string }).error
            : 'Search failed.';
        throw new Error(message);
      }

      const products =
        typeof data === 'object' &&
        data !== null &&
        Array.isArray((data as { products?: unknown }).products)
          ? ((data as SearchResponse).products)
          : [];

      setState({ status: 'success', products });
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Search failed.',
      });
    }
  }, []);

  return { state, search };
}

function StarRating({ rating }: { rating: number | null }) {
  const safeRating = rating ?? 0;
  const full = Math.floor(safeRating);
  const partial = safeRating - full;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="relative w-3.5 h-3.5">
          <Star size={14} className="text-surface-container-highest absolute inset-0" fill="currentColor" />
          {i < full && (
            <Star size={14} className="text-primary absolute inset-0" fill="currentColor" />
          )}
          {i === full && partial > 0 && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${partial * 100}%` }}
            >
              <Star size={14} className="text-primary" fill="currentColor" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SourceBadge({ site }: { site: string }) {
  const label = site.charAt(0).toUpperCase() + site.slice(1);

  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${sourceBadgeColors[site] ?? 'bg-surface-container text-secondary'}`}>
      {label}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const productName = product.name ?? 'Product';
  const imageSrc = product.image ?? getFallbackImage(product.source_site, 320, 176);

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_4px_20px_-4px_rgba(67,70,88,0.08)] hover:-translate-y-1 hover:shadow-[0_12px_32px_-4px_rgba(67,70,88,0.12)] transition-[transform,box-shadow] duration-200 flex flex-col">
      <div className="relative bg-surface-container-low">
        <img
          src={imageSrc}
          alt={productName}
          className="w-full h-44 object-contain p-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackImage(product.source_site, 320, 176);
          }}
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <SourceBadge site={product.source_site} />
        </div>
        {product.in_stock === false && (
          <div className="absolute inset-0 bg-surface/60 flex items-center justify-center rounded-t-[2rem]">
            <span className="bg-surface-container-lowest text-secondary text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="px-5 py-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-on-secondary-fixed text-sm leading-snug flex-1">
            {productName}
          </h3>
          <span className="font-display font-bold text-primary text-base shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-secondary">
            {formatRating(product.rating, product.reviews)}
          </span>
        </div>

        <p className="text-secondary text-xs leading-relaxed mb-3 flex-1">
          {product.description_text ?? 'No description available.'}
        </p>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-xs text-secondary">
            <Package size={11} />
            {product.shipping_fee === null
              ? <span className="text-tertiary font-medium">Free shipping</span>
              : <span>${product.shipping_fee.toFixed(2)} shipping</span>}
          </div>
          {product.in_stock && (
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block" title="In stock" />
          )}
        </div>

        {product.product_keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.product_keywords.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="bg-surface-container text-secondary text-[10px] font-medium px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          {product.listing_url ? (
            <a
              href={product.listing_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-full border border-outline-variant/30 text-on-secondary-fixed text-xs font-semibold text-center hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
            >
              View
            </a>
          ) : (
            <span className="flex-1 py-2.5 rounded-full border border-outline-variant/30 text-secondary text-xs font-semibold text-center cursor-not-allowed">
              No link
            </span>
          )}
          <button className="flex-1 py-2.5 btn-primary text-xs shadow-[0_4px_12px_rgba(154,67,69,0.15)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
            Ask Assistant
          </button>
        </div>
      </div>
    </div>
  );
}

function ListCard({ product }: { product: Product }) {
  const productName = product.name ?? 'Product';
  const imageSrc = product.image ?? getFallbackImage(product.source_site, 128, 96);

  return (
    <div className="bg-surface-container-lowest rounded-[1.5rem] overflow-hidden shadow-[0_2px_12px_-2px_rgba(67,70,88,0.06)] hover:shadow-[0_8px_24px_-4px_rgba(67,70,88,0.10)] transition-shadow duration-200 flex gap-0">
      <div className="relative bg-surface-container-low w-32 shrink-0 flex items-center justify-center p-3">
        <img
          src={imageSrc}
          alt={productName}
          className="w-full h-24 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackImage(product.source_site, 128, 96);
          }}
        />
        {product.in_stock === false && (
          <div className="absolute inset-0 bg-surface/60 flex items-center justify-center">
            <span className="text-[9px] text-secondary font-semibold">Out of stock</span>
          </div>
        )}
      </div>

      <div className="flex-1 px-5 py-4 flex items-center gap-6 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SourceBadge site={product.source_site} />
            {product.in_stock && (
              <span className="flex items-center gap-1 text-[10px] text-tertiary font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> In stock
              </span>
            )}
          </div>
          <h3 className="font-display font-semibold text-on-secondary-fixed text-sm leading-snug truncate">
            {productName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={product.rating} />
            <span className="text-xs text-secondary">{formatRating(product.rating, product.reviews)}</span>
          </div>
          <p className="text-secondary text-xs leading-relaxed mt-1.5 line-clamp-2">
            {product.description_text ?? 'No description available.'}
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-3">
          <span className="font-display font-bold text-primary text-lg">
            {formatPrice(product.price)}
          </span>
          <div className="text-xs text-secondary">
            {product.shipping_fee === null
              ? <span className="text-tertiary font-medium">Free shipping</span>
              : <span>+${product.shipping_fee.toFixed(2)} ship</span>}
          </div>
          <div className="flex gap-2">
            {product.listing_url ? (
              <a
                href={product.listing_url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 rounded-full border border-outline-variant/30 text-on-secondary-fixed text-xs font-semibold text-center hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
              >
                View
              </a>
            ) : (
              <span className="py-2 px-4 rounded-full border border-outline-variant/30 text-secondary text-xs font-semibold text-center cursor-not-allowed">
                No link
              </span>
            )}
            <button className="py-2 px-4 btn-primary text-xs shadow-[0_4px_12px_rgba(154,67,69,0.15)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchResults() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('products');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { state, search } = useSearch();

  const handleSearch = () => search(query, mode);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleModeChange = (next: SearchMode) => {
    setMode(next);
    setQuery('');
  };

  const resultCount = state.status === 'success' ? state.products.length : 0;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-10 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-on-secondary-fixed tracking-tight">
            {state.status === 'success' && query
              ? `Results for "${query}"`
              : 'Explore for your pet'}
          </h1>
          <p className="text-secondary text-sm mt-1">
            Search products or services with TinyFish
          </p>
        </div>

        <div className="flex items-center gap-1 mb-4 bg-surface-container-low p-1 rounded-full w-fit">
          {(Object.keys(MODE_CONFIG) as SearchMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95 ${
                mode === m
                  ? 'bg-surface-container-lowest text-on-secondary-fixed shadow-[0_2px_8px_-2px_rgba(67,70,88,0.12)]'
                  : 'text-secondary hover:text-on-secondary-fixed'
              }`}
            >
              <span className="text-base leading-none">{MODE_CONFIG[m].icon}</span>
              {MODE_CONFIG[m].label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder={MODE_CONFIG[mode].placeholder}
              className="w-full bg-surface-container-lowest rounded-full pl-11 pr-36 py-3.5 text-on-secondary-fixed text-sm outline-none shadow-[0_2px_12px_-2px_rgba(67,70,88,0.08)] border border-outline-variant/15 focus:border-primary/20 transition-colors placeholder:text-secondary/50"
            />
            <button
              onClick={handleSearch}
              disabled={state.status === 'loading'}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm shadow-[0_4px_12px_rgba(154,67,69,0.2)] flex items-center gap-1.5 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
            >
              <Sparkles size={13} />
              Search
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-secondary text-sm font-medium hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
              Featured <ChevronDown size={13} />
            </button>
            <button className="p-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-secondary hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
              <SlidersHorizontal size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95 ${viewMode === 'grid' ? 'bg-primary-fixed text-primary' : 'bg-surface-container-lowest border border-outline-variant/20 text-secondary hover:bg-surface-container-low'}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95 ${viewMode === 'list' ? 'bg-primary-fixed text-primary' : 'bg-surface-container-lowest border border-outline-variant/20 text-secondary hover:bg-surface-container-low'}`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {state.status === 'success' && (
          <p className="text-secondary text-sm mb-6">
            {resultCount} {resultCount === 1 ? 'result' : 'results'} found
          </p>
        )}

        {state.status === 'idle' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-4 text-2xl">
              {MODE_CONFIG[mode].icon}
            </div>
            <h2 className="font-display text-xl font-semibold text-on-secondary-fixed mb-2">
              Search {MODE_CONFIG[mode].label.toLowerCase()} for your pet
            </h2>
            <p className="text-secondary text-sm max-w-xs">
              {mode === 'products'
                ? 'Find treats, food, toys, accessories and more from Amazon using your search keywords.'
                : 'Keep service mode wired to the API while dedicated service scraping sources are still being finished.'}
            </p>
          </div>
        )}

        {state.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 size={32} className="text-primary animate-spin mb-4" />
            <p className="text-secondary text-sm">Searching for the best options...</p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-primary" />
            </div>
            <h2 className="font-display text-lg font-semibold text-on-secondary-fixed mb-2">
              Something went wrong
            </h2>
            <p className="text-secondary text-sm max-w-xs">{state.message}</p>
            <button
              onClick={handleSearch}
              className="mt-6 btn-primary px-6 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
            >
              Try again
            </button>
          </div>
        )}

        {state.status === 'success' && resultCount === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-4">
              <Package size={24} className="text-secondary" />
            </div>
            <h2 className="font-display text-lg font-semibold text-on-secondary-fixed mb-2">
              No results found
            </h2>
            <p className="text-secondary text-sm max-w-xs">
              Try different keywords or broaden your search.
            </p>
          </div>
        )}

        {state.status === 'success' && resultCount > 0 && (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.products.map((p, index) => (
                <ProductCard key={p.id ?? p.listing_url ?? `${p.source_site}-${p.name ?? 'product'}-${index}`} product={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {state.products.map((p, index) => (
                <ListCard key={p.id ?? p.listing_url ?? `${p.source_site}-${p.name ?? 'product'}-${index}`} product={p} />
              ))}
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}
