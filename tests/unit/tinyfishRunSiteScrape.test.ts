import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { TinyFishEnv } from '../../packages/config/src/env';
import { runSiteScrape } from '../../packages/listings-ingestion/src/pipelines/runSiteScrape';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map(async (dir) => {
      await rm(dir, { recursive: true, force: true });
    }),
  );
});

describe('runSiteScrape', () => {
  it('processes a TinyFish rabbit treat scrape into raw and normalized product outputs', async () => {
    const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'tinyfish-rabbit-treat-'));
    tempDirs.push(tempRoot);

    const env: TinyFishEnv = {
      TINYFISH_API_KEY: 'test-key',
      TINYFISH_DEFAULT_TIMEOUT_MS: 30000,
      TINYFISH_DEFAULT_MAX_PRODUCTS: 3,
      TINYFISH_PROXY_COUNTRY_CODE: 'SG',
      TINYFISH_USE_STEALTH_FALLBACK: true,
      TINYFISH_RAW_DATA_DIR: path.join(tempRoot, 'raw'),
      TINYFISH_NORMALIZED_DATA_DIR: path.join(tempRoot, 'normalized'),
    };

    const client = {
      runSync: async () => ({
        products: [
          {
            name: '(85g) Oxbow Natural Baked Treats (Apple & Banana)',
            image: 'https://m.media-amazon.com/images/I/81RR+ZCI58L._AC_UL320_.jpg',
            price: 9.9,
            rating: 4.7,
            reviews: 2603,
            in_stock: true,
            listing_url: 'https://www.amazon.com/example-rabbit-treats',
            shipping_fee: null,
            delivery_countries: ['SG'],
            description_text: 'Natural baked rabbit treats with apple and banana flavor.',
            review_text: 'Owners say rabbits love the flavor and the bag lasts well.',
            source_site: 'amazon',
          },
        ],
      }),
    } as any;

    const result = await runSiteScrape(
      {
        keywords: 'rabbit treat',
        site: 'amazon',
        maxProductsPerSite: 3,
      },
      {
        client,
        env,
        timestamp: '2026-03-28T12:00:00.000Z',
      },
    );

    expect(result.status).toBe('partial');
    expect(result.normalized_results).toHaveLength(1);
    expect(result.normalized_results[0]).toMatchObject({
      name: '(85g) Oxbow Natural Baked Treats (Apple & Banana)',
      image: 'https://m.media-amazon.com/images/I/81RR+ZCI58L._AC_UL320_.jpg',
      price: 9.9,
      source_site: 'amazon',
    });
    expect(result.normalized_results[0].product_keywords).toContain('rabbit');
    expect(result.normalized_results[0].product_keywords.some((keyword) => keyword.startsWith('treat'))).toBe(true);

    const rawFile = JSON.parse(await readFile(result.raw_file_path!, 'utf8'));
    const normalizedFile = JSON.parse(await readFile(result.normalized_file_path!, 'utf8'));

    expect(rawFile.products[0].image).toBe('https://m.media-amazon.com/images/I/81RR+ZCI58L._AC_UL320_.jpg');
    expect(normalizedFile.products[0].name).toBe('(85g) Oxbow Natural Baked Treats (Apple & Banana)');
    expect(normalizedFile.products[0].image).toBe('https://m.media-amazon.com/images/I/81RR+ZCI58L._AC_UL320_.jpg');
  });
});
