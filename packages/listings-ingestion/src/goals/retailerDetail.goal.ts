export interface RetailerDetailGoalInput {
  retailer: string;
  listingUrl: string;
  productName?: string;
}

export const retailerDetailGoal = {
  name: 'retailer-detail',
  systemPrompt:
    'You extract retailer listing detail from first-party websites. Return structured JSON only with product facts, stock signals, merchant metadata, and the canonical page URL.',
  buildUserPrompt: (input: RetailerDetailGoalInput) =>
    `Visit the retailer page for ${input.retailer} at ${input.listingUrl}. Extract product detail for ${input.productName ?? 'the requested item'} and preserve enough raw page structure for downstream cleanup.`,
} as const;
