import { describe, expect, it } from 'vitest';
import { buildTinyFishFilename } from '../../packages/listings-ingestion/src/utils/filenames';

describe('buildTinyFishFilename', () => {
  it('generates deterministic filenames', () => {
    const filename = buildTinyFishFilename(
      '2026-03-28T12-00-00-000Z',
      'amazon',
      'Cat Shedding Brush!!!',
    );

    expect(filename).toBe('2026-03-28T12-00-00-000Z__amazon__cat-shedding-brush.json');
  });

  it('includes request metadata variants in filenames when provided', () => {
    const filename = buildTinyFishFilename(
      '2026-03-28T12:00:00.000Z',
      'amazon',
      'rabbit treats',
      'search-page__product__pet-123',
    );

    expect(filename).toBe(
      '2026-03-28T12-00-00-000Z__search-page__product__pet-123__amazon__rabbit-treats.json',
    );
  });
});
