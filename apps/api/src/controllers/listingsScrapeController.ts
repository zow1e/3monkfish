import { ZodError } from 'zod';
import { ListingsScrapeService } from '../services/listingsScrapeService';
import { buildListingsScrapeResponse } from '../services/listingsScrapeResponse';

const listingsScrapeService = new ListingsScrapeService();

export const scrapeListingsController = async (req: any, res: any) => {
  try {
    const result = await listingsScrapeService.execute(req.body);
    res.status(200).json(buildListingsScrapeResponse(result));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        status: 'invalid_request',
        errors: error.flatten(),
      });
      return;
    }

    const message = error instanceof Error ? error.message : 'Unknown scrape error.';
    res.status(500).json({
      status: 'failed',
      error: message,
    });
  }
};
