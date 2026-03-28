import { describe, expect, it } from 'vitest';
import { rawTinyfishListingSchema } from '../../packages/listings-ingestion/src/schemas/rawTinyfishSchema';

describe('rawTinyfishListingSchema', () => {
  it('validates minimal listing', () => {
    const result = rawTinyfishListingSchema.safeParse({
      source: 'tinyfish',
      listingType: 'provider',
      payload: {},
      scrapedAt: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });
});
