const normalizeKeyword = (value: string) => value.trim().toLowerCase();

export const buildKeywordSet = (...groups: Array<readonly string[] | undefined>): string[] =>
  [...new Set(groups.flatMap((group) => (group ?? []).map(normalizeKeyword)).filter(Boolean))];

export const keywordMatches = (haystack: string, keywords: readonly string[]): boolean => {
  const normalizedHaystack = haystack.toLowerCase();
  return keywords.some((keyword) => normalizedHaystack.includes(normalizeKeyword(keyword)));
};
