import { describe, expect, it } from 'vitest';
import { extractProductKeywords } from '../../packages/listings-ingestion/src/utils/keywords';

describe('extractProductKeywords', () => {
  it('returns deduped useful terms from description, review, and search keywords', () => {
    const keywords = extractProductKeywords(
      'Soft slicker brush for cats with self cleaning button and gentle pins.',
      'Reviewers say the brush removes fur fast and works well on long hair cats.',
      'cat shedding brush',
      6,
    );

    expect(keywords.length).toBeLessThanOrEqual(6);
    expect(new Set(keywords).size).toBe(keywords.length);
    expect(keywords).toContain('brush');
    expect(keywords).toContain('cats');
  });
});
