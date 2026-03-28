import type { ChatbotKeywordScrapeRequest } from '@petcare/types';

const DEFAULT_CHATBOT_KEYWORDS = ['cat shedding brush', 'sensitive skin shampoo'];

export const getPlaceholderChatbotKeywords = async (
  request: ChatbotKeywordScrapeRequest,
): Promise<string[]> => request.placeholderKeywords ?? DEFAULT_CHATBOT_KEYWORDS;
