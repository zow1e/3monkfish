import type { SupportedSite } from '@petcare/types';

export interface SiteSearchStrategy {
  site: SupportedSite;
  displayName: string;
  antiBotRisk: 'low' | 'medium' | 'high';
  supportsStealthFallback: boolean;
  buildStartUrl: (keywords: string) => string;
  listingGoalHint: string;
  notes?: string;
}

export const siteSearchStrategies: Record<SupportedSite, SiteSearchStrategy> = {
  amazon: {
    site: 'amazon',
    displayName: 'Amazon',
    antiBotRisk: 'high',
    supportsStealthFallback: true,
    buildStartUrl: (keywords) => `https://www.amazon.com/s?k=${encodeURIComponent(keywords)}`,
    listingGoalHint:
      'Focus on the visible Amazon search result cards and pull the product image URL directly from each visible card image.',
    notes: 'Stay on the search results page and keep extraction shallow for the 30 second target.',
  },
  petmall: {
    site: 'petmall',
    displayName: 'PetMall',
    antiBotRisk: 'medium',
    supportsStealthFallback: true,
    buildStartUrl: (keywords) =>
      `https://petmall.sg/shop/?s=${encodeURIComponent(keywords)}&post_type=product`,
    listingGoalHint:
      'Focus on the current PetMall product grid and capture the product image URL from the visible listing-card image without deep navigation.',
    notes: 'TODO: re-check PetMall search URL format if the site changes its WooCommerce query structure.',
  },
  petlovers: {
    site: 'petlovers',
    displayName: 'Pet Lovers Centre',
    antiBotRisk: 'medium',
    supportsStealthFallback: false,
    buildStartUrl: () => 'https://www.petloverscentre.com/',
    listingGoalHint:
      'Focus on the visible Pet Lovers Centre listing cards on the current page and extract the card image URL where possible.',
    notes: 'TODO: replace homepage entry with a direct search URL once the exact production pattern is confirmed.',
  },
};

export const getSiteSearchStrategy = (site: SupportedSite): SiteSearchStrategy => siteSearchStrategies[site];
