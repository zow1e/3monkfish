import { useState, useCallback } from 'react';
import {
  Search, SlidersHorizontal, ChevronDown, LayoutGrid, List,
  Sparkles, Star, Package, Loader2, AlertCircle,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  source_site: string;
  search_keywords: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  in_stock: boolean;
  listing_url: string;
  shipping_fee: number | null;
  delivery_countries: string[];
  product_keywords: string[];
  description_text: string;
  review_text: string;
}

interface SearchResponse {
  products: Product[];
}

type SearchMode = 'products' | 'services';

// ─── Search hook ──────────────────────────────────────────────────────────────

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; products: Product[] }
  | { status: 'error'; message: string };

function useSearch() {
  const [state, setState] = useState<SearchState>({ status: 'idle' });

  const search = useCallback(async (query: string, mode: SearchMode) => {
    if (!query.trim()) return;
    setState({ status: 'loading' });

    try {
      // ── TODO: replace this block with your search script ──────────────────
      // Your script receives both the query string and the mode ('products' |
      // 'services') so it can hit the right scraper for each type.
      // Example:
      //   const data: SearchResponse = await mySearchScript(query, mode);
      //
      // For now, this calls a placeholder that returns mock data.
      const data: SearchResponse = await mockSearch(query, mode);
      // ─────────────────────────────────────────────────────────────────────

      setState({ status: 'success', products: data.products });
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Search failed.',
      });
    }
  }, []);

  return { state, search };
}

// ── Placeholder — delete when you wire up the real script ────────────────────
async function mockSearch(_query: string, _mode: SearchMode): Promise<SearchResponse> {
  await new Promise(r => setTimeout(r, 800)); // simulate network
  return {
    products: [
      {
        id: 'a1b2c3d4e5f67890',
        source_site: 'amazon',
        search_keywords: _query,
        name: '(85g) Oxbow Natural Baked Treats (Apple & Banana)',
        image: 'https://m.media-amazon.com/images/I/81RR+ZCI58L._AC_UL320_.jpg',
        price: 9.90,
        rating: 4.7,
        reviews: 2603,
        in_stock: true,
        listing_url: 'https://www.amazon.com',
        shipping_fee: null,
        delivery_countries: ['SG'],
        product_keywords: ['rabbit', 'treats', 'oxbow', 'apple', 'banana'],
        description_text: 'Natural baked rabbit treats with apple and banana flavor.',
        review_text: 'Owners say rabbits love the flavor and the bag lasts well.',
      },
      {
        id: 'b2c3d4e5f6789012',
        source_site: 'amazon',
        search_keywords: _query,
        name: 'Kaytee Timothy Biscuits Baked Treat for Rabbits',
        image: 'https://placehold.co/320x320/e8e8e8/5b5d70?text=Timothy+Biscuits',
        price: 7.49,
        rating: 4.5,
        reviews: 1182,
        in_stock: true,
        listing_url: 'https://www.amazon.com',
        shipping_fee: 2.99,
        delivery_countries: ['SG', 'US'],
        product_keywords: ['rabbit', 'timothy', 'hay', 'biscuit', 'treat'],
        description_text: 'Oven-baked timothy hay biscuits enriched with DHA for healthy brain function.',
        review_text: 'Great for dental health. Rabbits chew enthusiastically.',
      },
      {
        id: 'c3d4e5f678901234',
        source_site: 'lazada',
        search_keywords: _query,
        name: 'Versele-Laga Cuni Complete Rabbit Food 8kg',
        image: 'https://placehold.co/320x320/dddef5/5b5d70?text=Cuni+Complete',
        price: 34.90,
        rating: 4.9,
        reviews: 541,
        in_stock: false,
        listing_url: 'https://www.lazada.sg',
        shipping_fee: null,
        delivery_countries: ['SG'],
        product_keywords: ['rabbit', 'food', 'pellet', 'complete', 'diet'],
        description_text: 'Complete pelleted food for adult rabbits with optimal fibre and vitamins.',
        review_text: 'Vet-recommended. Rabbits maintain healthy weight on this diet.',
      },
    ],
  };
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating - full;
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
  const colors: Record<string, string> = {
    amazon: 'bg-[#FF9900]/10 text-[#B35900]',
    lazada: 'bg-[#0F146D]/10 text-[#0F146D]',
    shopee: 'bg-[#EE4D2D]/10 text-[#C43F26]',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${colors[site] ?? 'bg-surface-container text-secondary'}`}>
      {label}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_4px_20px_-4px_rgba(67,70,88,0.08)] hover:-translate-y-1 hover:shadow-[0_12px_32px_-4px_rgba(67,70,88,0.12)] transition-[transform,box-shadow] duration-200 flex flex-col">
      {/* Image */}
      <div className="relative bg-surface-container-low">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-contain p-4"
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/320x176/e8e8e8/5b5d70?text=${encodeURIComponent(product.source_site)}`; }}
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <SourceBadge site={product.source_site} />
        </div>
        {!product.in_stock && (
          <div className="absolute inset-0 bg-surface/60 flex items-center justify-center rounded-t-[2rem]">
            <span className="bg-surface-container-lowest text-secondary text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex flex-col flex-1">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-on-secondary-fixed text-sm leading-snug flex-1">
            {product.name}
          </h3>
          <span className="font-display font-bold text-primary text-base shrink-0">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-secondary">
            {product.rating.toFixed(1)} ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Description */}
        <p className="text-secondary text-xs leading-relaxed mb-3 flex-1">
          {product.description_text}
        </p>

        {/* Shipping + stock */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-xs text-secondary">
            <Package size={11} />
            {product.shipping_fee === null
              ? <span className="text-tertiary font-medium">Free shipping</span>
              : <span>${product.shipping_fee.toFixed(2)} shipping</span>
            }
          </div>
          {product.in_stock && (
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block" title="In stock" />
          )}
        </div>

        {/* Keyword tags */}
        {product.product_keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.product_keywords.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="bg-surface-container text-secondary text-[10px] font-medium px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <a
            href={product.listing_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-full border border-outline-variant/30 text-on-secondary-fixed text-xs font-semibold text-center hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
          >
            View
          </a>
          <button className="flex-1 py-2.5 btn-primary text-xs shadow-[0_4px_12px_rgba(154,67,69,0.15)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
            Ask Assistant
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const MODE_CONFIG: Record<SearchMode, { label: string; placeholder: string; icon: string }> = {
  products: {
    label: 'Products',
    placeholder: 'e.g. rabbit treats, hay, accessories…',
    icon: '🛍️',
  },
  services: {
    label: 'Services',
    placeholder: 'e.g. grooming, vet clinic, pet boarding…',
    icon: '🏥',
  },
};

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
        {/* Page title */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-on-secondary-fixed tracking-tight">
            {state.status === 'success' && query
              ? `Results for "${query}"`
              : 'Explore for your pet'}
          </h1>
          <p className="text-secondary text-sm mt-1">
            Personalized results based on your pet profile
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 mb-4 bg-surface-container-low p-1 rounded-full w-fit">
          {(Object.keys(MODE_CONFIG) as SearchMode[]).map(m => (
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

        {/* Search bar + controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          {/* Search bar */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
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

          {/* Filter + view controls */}
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

        {/* Result count */}
        {state.status === 'success' && (
          <p className="text-secondary text-sm mb-6">
            {resultCount} {resultCount === 1 ? 'result' : 'results'} found
          </p>
        )}

        {/* ── States ── */}

        {/* Idle */}
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
                ? 'Find treats, food, toys, accessories and more from across the web.'
                : 'Find vets, groomers, boarding, training and other local services.'}
            </p>
          </div>
        )}

        {/* Loading */}
        {state.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 size={32} className="text-primary animate-spin mb-4" />
            <p className="text-secondary text-sm">Searching for the best options…</p>
          </div>
        )}

        {/* Error */}
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

        {/* Empty */}
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

        {/* Results grid / list */}
        {state.status === 'success' && resultCount > 0 && (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {state.products.map(p => (
                <ListCard key={p.id} product={p} />
              ))}
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}

// ─── List view card ───────────────────────────────────────────────────────────

function ListCard({ product }: { product: Product }) {
  return (
    <div className="bg-surface-container-lowest rounded-[1.5rem] overflow-hidden shadow-[0_2px_12px_-2px_rgba(67,70,88,0.06)] hover:shadow-[0_8px_24px_-4px_rgba(67,70,88,0.10)] transition-shadow duration-200 flex gap-0">
      {/* Image */}
      <div className="relative bg-surface-container-low w-32 shrink-0 flex items-center justify-center p-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-24 object-contain"
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/128x96/e8e8e8/5b5d70?text=${encodeURIComponent(product.source_site)}`; }}
        />
        {!product.in_stock && (
          <div className="absolute inset-0 bg-surface/60 flex items-center justify-center">
            <span className="text-[9px] text-secondary font-semibold">Out of stock</span>
          </div>
        )}
      </div>

      {/* Content */}
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
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={product.rating} />
            <span className="text-xs text-secondary">{product.rating.toFixed(1)} ({product.reviews.toLocaleString()})</span>
          </div>
          <p className="text-secondary text-xs leading-relaxed mt-1.5 line-clamp-2">
            {product.description_text}
          </p>
        </div>

        {/* Price + actions */}
        <div className="shrink-0 flex flex-col items-end gap-3">
          <span className="font-display font-bold text-primary text-lg">
            ${product.price.toFixed(2)}
          </span>
          <div className="text-xs text-secondary">
            {product.shipping_fee === null
              ? <span className="text-tertiary font-medium">Free shipping</span>
              : <span>+${product.shipping_fee.toFixed(2)} ship</span>
            }
          </div>
          <div className="flex gap-2">
            <a
              href={product.listing_url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-full border border-outline-variant/30 text-on-secondary-fixed text-xs font-semibold text-center hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
            >
              View
            </a>
            <button className="py-2 px-4 btn-primary text-xs shadow-[0_4px_12px_rgba(154,67,69,0.15)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
