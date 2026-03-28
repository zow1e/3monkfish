export interface MarketplaceDetailGoalInput {
  marketplace: string;
  listingUrl: string;
  title?: string;
}

export const marketplaceDetailGoal = {
  name: 'marketplace-detail',
  systemPrompt:
    'You extract rich listing detail from marketplace pages. Return structured JSON only, keeping merchant, pricing, variants, ratings, and fulfillment details when present.',
  buildUserPrompt: (input: MarketplaceDetailGoalInput) =>
    `Open the ${input.marketplace} listing at ${input.listingUrl} and extract all relevant detail for normalization. Known title: ${input.title ?? 'unknown'}. Include a faithful raw payload summary that downstream normalizers can reuse.`,
} as const;
