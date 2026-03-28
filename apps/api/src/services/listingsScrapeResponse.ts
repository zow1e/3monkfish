import type { NormalizedProductListing, TinyFishScrapeJobResult } from '@petcare/types';

export interface ListingsScrapeApiResponse {
  keywords: string;
  requestedSites: string[];
  status: TinyFishScrapeJobResult['status'];
  products: Array<{
    name: string | null;
    image: string | null;
    price: number | null;
    rating: number | null;
    reviews: number | null;
    in_stock: boolean | null;
    listing_url: string | null;
    shipping_fee: number | null;
    delivery_countries: string[];
    description_text: string | null;
    review_text: string | null;
    product_keywords: string[];
    source_site: string;
  }>;
  files: TinyFishScrapeJobResult['files'];
  siteOutcomes: TinyFishScrapeJobResult['site_outcomes'];
  startedAt: string;
  completedAt: string;
}

const serializeProduct = (product: NormalizedProductListing) => ({
  name: product.name,
  image: product.image,
  price: product.price,
  rating: product.rating,
  reviews: product.reviews,
  in_stock: product.in_stock,
  listing_url: product.listing_url,
  shipping_fee: product.shipping_fee,
  delivery_countries: product.delivery_countries,
  description_text: product.description_text,
  review_text: product.review_text,
  product_keywords: product.product_keywords,
  source_site: product.source_site,
});

export const buildListingsScrapeResponse = (
  result: TinyFishScrapeJobResult,
): ListingsScrapeApiResponse => ({
  keywords: result.keywords,
  requestedSites: result.requestedSites,
  status: result.status,
  products: result.normalized_results.map(serializeProduct),
  files: result.files,
  siteOutcomes: result.site_outcomes,
  startedAt: result.started_at,
  completedAt: result.completed_at,
});
