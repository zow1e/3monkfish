import { describe, expect, it } from 'vitest';
import { buildListingsScrapeResponse } from '../../apps/api/src/services/listingsScrapeResponse';

describe('buildListingsScrapeResponse', () => {
  it('preserves TinyFish-style top-level products output', () => {
    const response = buildListingsScrapeResponse({
      keywords: 'rabbit treats',
      requestedSites: ['amazon'],
      status: 'completed',
      site_outcomes: [],
      normalized_results: [
        {
          id: 'abc123',
          source_site: 'amazon',
          search_keywords: 'rabbit treats',
          name: 'Rabbit Treats',
          image: 'https://example.com/image.jpg',
          price: 9.9,
          rating: 4.7,
          reviews: 2603,
          in_stock: true,
          listing_url: 'https://example.com/product',
          shipping_fee: null,
          delivery_countries: [],
          description_text: null,
          review_text: null,
          product_keywords: ['rabbit', 'treats'],
        },
      ],
      files: {
        raw: ['raw.json'],
        normalized: ['normalized.json'],
      },
      started_at: '2026-03-28T12:00:00.000Z',
      completed_at: '2026-03-28T12:00:20.000Z',
    });

    expect(response.products).toHaveLength(1);
    expect(response.products[0]).toMatchObject({
      name: 'Rabbit Treats',
      image: 'https://example.com/image.jpg',
      price: 9.9,
      rating: 4.7,
      reviews: 2603,
      in_stock: true,
      source_site: 'amazon',
    });
  });
});
