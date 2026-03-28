import { describe, expect, it } from 'vitest';
import { rawTinyfishSiteResultSchema } from '../../packages/listings-ingestion/src/schemas/rawTinyfishSchema';

describe('rawTinyfishSiteResultSchema', () => {
  it('validates minimal TinyFish product results', () => {
    const result = rawTinyfishSiteResultSchema.safeParse({
      products: [
        {
          name: 'Rabbit Treats',
          image: 'https://example.com/image.jpg',
          source_site: 'amazon',
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
