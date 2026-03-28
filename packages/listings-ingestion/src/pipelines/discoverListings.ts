import { rawTinyFishBatchSchema, type RawTinyFishBatch } from '../schemas/rawTinyFish';
import { marketplaceDiscoveryGoal, type MarketplaceDiscoveryGoalInput } from '../goals/marketplaceDiscovery.goal';
import { buildKeywordSet } from '../utils/keywords';
import type { TinyFishClient } from '../clients/tinyfishClient';

export interface DiscoverListingsInput extends MarketplaceDiscoveryGoalInput {
  client: TinyFishClient;
}

export const discoverListings = async (input: DiscoverListingsInput): Promise<RawTinyFishBatch> => {
  const { client, ...goalInput } = input;
  const keywords = buildKeywordSet(input.keywords);
  return client.runSync(
    {
      goal: marketplaceDiscoveryGoal.name,
      input: {
        ...goalInput,
        keywords,
        prompt: marketplaceDiscoveryGoal.buildUserPrompt({ ...goalInput, keywords }),
      },
    },
    rawTinyFishBatchSchema,
  );
};
