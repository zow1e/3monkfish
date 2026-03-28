import type { TinyFishClient } from '../clients/tinyfishClient';
import { marketplaceDetailGoal, type MarketplaceDetailGoalInput } from '../goals/marketplaceDetail.goal';
import { retailerDetailGoal, type RetailerDetailGoalInput } from '../goals/retailerDetail.goal';
import { rawTinyFishListingSchema, type RawTinyFishListing } from '../schemas/rawTinyFish';

type ScrapeListingDetailInput =
  | ({ client: TinyFishClient; mode: 'marketplace' } & MarketplaceDetailGoalInput)
  | ({ client: TinyFishClient; mode: 'retailer' } & RetailerDetailGoalInput);

export const scrapeListingDetail = async (input: ScrapeListingDetailInput): Promise<RawTinyFishListing> => {
  if (input.mode === 'retailer') {
    const { client, mode: _mode, ...goalInput } = input;
    return client.runSync(
      {
        goal: retailerDetailGoal.name,
        input: {
          ...goalInput,
          prompt: retailerDetailGoal.buildUserPrompt(goalInput),
        },
      },
      rawTinyFishListingSchema,
    );
  }

  const { client, mode: _mode, ...goalInput } = input;
  return client.runSync(
    {
      goal: marketplaceDetailGoal.name,
      input: {
        ...goalInput,
        prompt: marketplaceDetailGoal.buildUserPrompt(goalInput),
      },
    },
    rawTinyFishListingSchema,
  );
};
