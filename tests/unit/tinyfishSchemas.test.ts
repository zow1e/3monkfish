import { describe, expect, it } from 'vitest';
import {
  normalizedProductListingSchema,
  rawTinyFishProductSchema,
  tinyFishScrapeRequestSchema,
} from '../../packages/validations/src/schemas';

describe('tinyfish schemas', () => {
  it('validates a scrape request', () => {
    const result = tinyFishScrapeRequestSchema.safeParse({
      keywords: 'cat shedding brush',
      sites: ['amazon', 'petmall'],
      maxProductsPerSite: 5,
    });

    expect(result.success).toBe(true);
  });

  it('validates a raw tinyfish product payload', () => {
    const result = rawTinyFishProductSchema.safeParse({
      name: 'Cat Slicker Brush',
      image: 'https://example.com/image.jpg',
      price: 19.9,
      rating: 4.8,
      reviews: 1200,
      in_stock: true,
      listing_url: 'https://example.com/product',
      source_site: 'amazon',
      shipping_fee: null,
      delivery_countries: ['SG'],
      description_text: null,
      review_text: null,
    });

    expect(result.success).toBe(true);
  });

  it('validates a normalized product listing', () => {
    const result = normalizedProductListingSchema.safeParse({
      id: 'abc123',
      source_site: 'petmall',
      search_keywords: 'cat shedding brush',
      name: 'Cat Slicker Brush',
      image: 'https://example.com/image.jpg',
      price: 19.9,
      rating: 4.5,
      reviews: 123,
      in_stock: true,
      listing_url: 'https://example.com/product',
      shipping_fee: null,
      delivery_countries: ['SG'],
      product_keywords: ['brush', 'cat', 'fur'],
      description_text: 'Soft grooming brush for cats.',
      review_text: 'Removes fur quickly.',
    });

    expect(result.success).toBe(true);
  });
});
