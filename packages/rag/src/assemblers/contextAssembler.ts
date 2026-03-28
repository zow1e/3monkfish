import type { RetrievalItem } from '../types';

export const assembleContext = (items: RetrievalItem[]): string =>
  items.map((item) => `[${item.sourceType}] ${item.text}`).join('\n\n');
