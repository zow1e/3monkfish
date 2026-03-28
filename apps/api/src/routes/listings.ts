import { Router } from 'express';
import { scrapeListingsController } from '../controllers/listingsScrapeController';
import { buildListingsScrapeResponse } from '../services/listingsScrapeResponse';
import { ChatbotListingsScrapeService } from '../services/chatbotListingsScrapeService';
import { SearchPageListingsScrapeService } from '../services/searchPageListingsScrapeService';

export const listingsRouter = Router();
const chatbotListingsScrapeService = new ChatbotListingsScrapeService();
const searchPageListingsScrapeService = new SearchPageListingsScrapeService();

listingsRouter.get('/', async (_req, res) => {
  res.status(200).json({ route: 'listings', status: 'ok', todo: 'Implement controller/service wiring.' });
});

listingsRouter.post('/scrape', scrapeListingsController);

listingsRouter.post('/scrape/chatbot', async (req, res) => {
  try {
    const result = await chatbotListingsScrapeService.execute(req.body);
    res.status(200).json({
      requestSource: result.requestSource,
      keywordSets: result.keywordSets,
      runs: result.runs.map(buildListingsScrapeResponse),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown chatbot scrape error.';
    res.status(400).json({ status: 'failed', error: message });
  }
});

listingsRouter.post('/scrape/search-page', async (req, res) => {
  try {
    const result = await searchPageListingsScrapeService.execute(req.body);
    res.status(200).json({
      ...buildListingsScrapeResponse(result),
      requestSource: result.requestSource,
      searchType: result.searchType,
      petProfile: result.petProfile,
      presetKeywords: result.presetKeywords,
      combinedKeywords: result.combinedKeywords,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown search-page scrape error.';
    res.status(400).json({ status: 'failed', error: message });
  }
});
