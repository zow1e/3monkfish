import { useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, LayoutGrid, List, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loadPets } from '../lib/petStore';

const products = [
  {
    img: 'https://placehold.co/400x240/e2e2e2/5b5d70?text=Grooming+Session',
    badge: 'EXPERT PICK',
    name: 'Eco-friendly Grooming',
    price: '$45.00',
    description: 'Organic lavender-infused spa treatment perfect for sensitive skin and seasonal coats.',
    tags: ['friendly stuff', 'natural scents'],
  },
  {
    img: 'https://placehold.co/400x240/eeeeee/5b5d70?text=Shedding+Brush',
    badge: null,
    name: 'Premium Shedding Brush',
    price: '$32.00',
    description: 'Designed to help manage dense undercoats and seasonal shedding.',
    tags: ['good for shedding', 'ergonomic'],
  },
  {
    img: 'https://placehold.co/400x240/dbc0bf/9a4345?text=Botanicals+Shampoo',
    badge: null,
    name: 'Deep Clean Botanicals',
    price: '$18.99',
    description: 'A gentle but effective botanical blend that lifts loose hair and nourishes the coat.',
    tags: ['aloe vera', 'vegan'],
  },
];

export default function SearchResults() {
  const location = useLocation();
  const firstPet = useMemo(() => loadPets()[0], [location.pathname, location.key]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-10 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-on-secondary-fixed tracking-tight">
            Search
          </h1>
          <p className="text-secondary text-sm mt-1">Browse products and services (demo listings)</p>
        </div>

        {/* Controls row */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          {/* Search bar */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search products and services..."
              className="w-full bg-surface-container-lowest rounded-full pl-11 pr-28 py-3.5 text-on-secondary-fixed text-sm outline-none shadow-[0_2px_12px_-2px_rgba(67,70,88,0.08)] border border-outline-variant/15 focus:border-primary/20 transition-colors placeholder:text-secondary/50"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm shadow-[0_4px_12px_rgba(154,67,69,0.2)] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
              <Sparkles size={13} />
              Ask AI
            </button>
          </div>

          {/* Filter controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-secondary text-sm font-medium hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
              Featured <ChevronDown size={13} />
            </button>
            <button className="p-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-secondary hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
              <SlidersHorizontal size={15} />
            </button>
            <button className="p-2.5 bg-primary-fixed rounded-full text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
              <LayoutGrid size={15} />
            </button>
            <button className="p-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-secondary hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
              <List size={15} />
            </button>
          </div>
        </div>

        {firstPet && (
          <div className="bg-surface-container-lowest rounded-[1.5rem] px-4 py-3 mb-8 inline-flex items-center gap-3 shadow-[0_2px_12px_-2px_rgba(67,70,88,0.06)] border border-outline-variant/10">
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-display font-semibold text-secondary text-sm">
              {firstPet.name[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-semibold text-on-secondary-fixed text-sm">{firstPet.name}</p>
              <p className="text-secondary text-xs">
                {[firstPet.breed, firstPet.species, firstPet.ageText].filter(Boolean).join(' · ') || 'Pet profile'}
              </p>
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.name}
              className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_4px_20px_-4px_rgba(67,70,88,0.08)] hover:-translate-y-1 hover:shadow-[0_12px_32px_-4px_rgba(67,70,88,0.12)] transition-[transform,box-shadow] duration-200"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                {p.badge && (
                  <span className="absolute top-3 left-3 bg-tertiary-container text-tertiary text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="px-5 py-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-semibold text-on-secondary-fixed text-base leading-tight">{p.name}</h3>
                  <span className="font-display font-semibold text-primary text-base shrink-0 ml-2">{p.price}</span>
                </div>
                <p className="text-secondary text-xs leading-relaxed mb-4">{p.description}</p>

                {/* Tag chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-surface-container-low text-secondary text-[10px] font-medium px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-full border border-outline-variant/30 text-on-secondary-fixed text-sm font-medium hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
                    View
                  </button>
                  <button className="flex-1 py-2.5 btn-primary text-sm shadow-[0_4px_12px_rgba(154,67,69,0.15)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
                    Ask Assistant
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
