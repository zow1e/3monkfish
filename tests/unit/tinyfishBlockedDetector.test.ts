import { describe, expect, it } from 'vitest';
import { detectBlockedResult } from '../../packages/listings-ingestion/src/utils/blocked';

describe('detectBlockedResult', () => {
  it('flags obvious blocked payloads', () => {
    expect(
      detectBlockedResult({
        blocked_reason: 'Access denied. Please complete CAPTCHA.',
        products: [],
      }),
    ).toBe(true);
  });

  it('does not flag a populated result', () => {
    expect(
      detectBlockedResult({
        products: [
          {
            name: 'Cat Brush',
            listing_url: 'https://example.com/product',
          },
        ],
      }),
    ).toBe(false);
  });
});
