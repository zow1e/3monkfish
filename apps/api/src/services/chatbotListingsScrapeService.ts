import { runScrapeJob } from '@petcare/listings-ingestion';
import type { ChatbotKeywordScrapeRequest, ChatbotKeywordScrapeResult } from '@petcare/types';
import { chatbotKeywordScrapeRequestSchema } from '@petcare/validations';
import { getPlaceholderChatbotKeywords } from './chatbotKeywordProvider';
import { resolveSitesForSearchType } from './tinyfishSitePolicy';

export class ChatbotListingsScrapeService {
  async execute(input: unknown): Promise<ChatbotKeywordScrapeResult> {
    const request = chatbotKeywordScrapeRequestSchema.parse(input);
    const keywordSets = await getPlaceholderChatbotKeywords(request);
    const searchType = request.searchType ?? 'product';
    const sites = resolveSitesForSearchType(searchType, request.sites);

    const runs = await Promise.all(
      keywordSets.map((keywords) =>
        runScrapeJob({
          keywords,
          sites,
          maxProductsPerSite: request.maxProductsPerSite,
          countryCode: request.countryCode,
          searchType,
          requestSource: 'chatbot',
          filenameTag: 'chatbot',
        }),
      ),
    );

    return {
      requestSource: 'chatbot',
      keywordSets,
      runs,
    };
  }
}
