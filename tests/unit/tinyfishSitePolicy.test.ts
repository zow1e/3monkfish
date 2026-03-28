import { describe, expect, it } from 'vitest';
import { resolveSitesForSearchType } from '../../apps/api/src/services/tinyfishSitePolicy';

describe('resolveSitesForSearchType', () => {
  it('forces product searches to Amazon only', () => {
    expect(resolveSitesForSearchType('product', ['amazon', 'petmall', 'petlovers'])).toEqual(['amazon']);
  });

  it('defaults direct searches without a search type to Amazon only', () => {
    expect(resolveSitesForSearchType(undefined, ['petmall'])).toEqual(['amazon']);
  });

  it('keeps service sites intact while service scraping remains separate', () => {
    expect(resolveSitesForSearchType('service', ['petmall', 'petlovers', 'petmall'])).toEqual([
      'petmall',
      'petlovers',
    ]);
  });
});
