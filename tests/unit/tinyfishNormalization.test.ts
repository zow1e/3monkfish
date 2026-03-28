import { describe, expect, it } from 'vitest';
import { normalizeProductListing } from '../../packages/listings-ingestion/src/normalizers/productListing';

describe('normalizeProductListing', () => {
  it('normalizes product fields into the shared schema', () => {
    const normalized = normalizeProductListing(
      {
        name: '  Cat Slicker Brush  ',
        image: 'https://example.com/image.jpg',
        price: 19.9,
        rating: 4.6,
        reviews: 98,
        in_stock: true,
        listing_url: 'https://example.com/product',
        shipping_fee: null,
        delivery_countries: ['SG', ' MY '],
        description_text: 'Soft brush for grooming cats.',
        review_text: 'Great for loose fur.',
        source_site: 'petlovers',
      },
      'cat shedding brush',
    );

    expect(normalized.name).toBe('Cat Slicker Brush');
    expect(normalized.image).toBe('https://example.com/image.jpg');
    expect(normalized.price).toBe(19.9);
    expect(normalized.delivery_countries).toEqual(['SG', 'MY']);
    expect(normalized.product_keywords.length).toBeGreaterThan(0);
  });
});
