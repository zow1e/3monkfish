const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'this',
  'to',
  'with',
  'your',
  'you',
  'pet',
  'pets',
  'our',
  'their',
  'was',
  'were',
]);

const normalizeKeyword = (value: string) => value.trim().toLowerCase();

export const buildKeywordSet = (...groups: Array<readonly string[] | undefined>): string[] =>
  [...new Set(groups.flatMap((group) => (group ?? []).map(normalizeKeyword)).filter(Boolean))];

export const keywordMatches = (haystack: string, keywords: readonly string[]): boolean => {
  const normalizedHaystack = haystack.toLowerCase();
  return keywords.some((keyword) => normalizedHaystack.includes(normalizeKeyword(keyword)));
};

export const extractProductKeywords = (
  descriptionText: string | null | undefined,
  reviewText: string | null | undefined,
  searchKeywords: string,
  limit = 8,
): string[] => {
  const combined = [descriptionText, reviewText, searchKeywords].filter(Boolean).join(' ').toLowerCase();
  const tokens = combined
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && token.length <= 24 && !STOPWORDS.has(token));

  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([token]) => token);
};
