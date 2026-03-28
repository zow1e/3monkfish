export interface MarketplaceDiscoveryGoalInput {
  marketplace: string;
  category: string;
  keywords: string[];
  region?: string;
  limit?: number;
}

export const marketplaceDiscoveryGoal = {
  name: 'marketplace-discovery',
  systemPrompt:
    'You discover marketplace listings. Return structured JSON only and preserve source links, merchant names, price, rating, and scrape timestamps whenever available.',
  buildUserPrompt: (input: MarketplaceDiscoveryGoalInput) => {
    const limit = input.limit ?? 20;
    const keywordText = input.keywords.join(', ');
    const regionText = input.region ? ` in ${input.region}` : '';
    return `Discover up to ${limit} ${input.category} listings on ${input.marketplace}${regionText}. Prioritize these keywords: ${keywordText}. Return normalized JSON-ready fields and include the original payload details needed for follow-up scraping.`;
  },
} as const;
