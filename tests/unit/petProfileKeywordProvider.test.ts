import { describe, expect, it } from 'vitest';
import { buildCombinedPetProfileQuery } from '../../apps/api/src/services/petProfileKeywordProvider';

describe('buildCombinedPetProfileQuery', () => {
  it('combines pet preset keywords with search input for product scraping', () => {
    const result = buildCombinedPetProfileQuery({
      petProfile: {
        petId: 'pet-123',
        petName: 'Mochi',
        species: 'rabbit',
        breed: 'Holland Lop',
        allergies: ['sensitive skin'],
        productKeywords: ['gentle grooming', 'rabbit treats'],
        serviceKeywords: ['small animal vet'],
      },
      searchType: 'product',
      searchInput: 'banana treats',
      sites: ['amazon'],
    });

    expect(result.presetKeywords).toEqual(
      expect.arrayContaining(['rabbit', 'Holland Lop', 'sensitive skin', 'gentle grooming', 'rabbit treats']),
    );
    expect(result.combinedKeywords).toContain('banana treats');
    expect(result.combinedKeywords).toContain('rabbit treats');
  });

  it('switches to service keywords when the search type is service', () => {
    const result = buildCombinedPetProfileQuery({
      petProfile: {
        petId: 'pet-456',
        petName: 'Nori',
        species: 'cat',
        productKeywords: ['cat shampoo'],
        serviceKeywords: ['mobile groomer', 'cat grooming'],
      },
      searchType: 'service',
      searchInput: 'near me',
      sites: ['petlovers'],
    });

    expect(result.presetKeywords).toEqual(expect.arrayContaining(['mobile groomer', 'cat grooming']));
    expect(result.presetKeywords).not.toContain('cat shampoo');
    expect(result.combinedKeywords).toContain('near me');
  });
});
