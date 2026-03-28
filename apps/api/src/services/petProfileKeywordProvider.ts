import type {
  PetProfileKeywordPreset,
  SearchPageScrapeRequest,
  TinyFishSearchType,
} from '@petcare/types';

const dedupeKeywords = (keywords: string[]): string[] =>
  [...new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean))];

export const getPetProfilePresetKeywords = (
  petProfile: PetProfileKeywordPreset,
  searchType: TinyFishSearchType,
): string[] => {
  const searchTypeKeywords = searchType === 'product' ? petProfile.productKeywords : petProfile.serviceKeywords;

  return dedupeKeywords([
    petProfile.species,
    petProfile.breed ?? '',
    ...(petProfile.allergies ?? []),
    ...(petProfile.sensitivities ?? []),
    ...searchTypeKeywords,
  ]);
};

export const buildCombinedPetProfileQuery = (request: SearchPageScrapeRequest) => {
  const presetKeywords = getPetProfilePresetKeywords(request.petProfile, request.searchType);
  const combinedKeywords = dedupeKeywords([...presetKeywords, request.searchInput]).join(' ');

  return {
    presetKeywords,
    combinedKeywords,
  };
};
