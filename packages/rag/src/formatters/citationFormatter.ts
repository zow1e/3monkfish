import type { RetrievalItem } from '../types';

export const formatCitations = (items: RetrievalItem[]) =>
  items.map((item) => ({ id: item.id, label: `${item.sourceType}:${item.id}`, sourceType: item.sourceType }));
