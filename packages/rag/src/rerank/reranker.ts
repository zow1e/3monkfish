import type { RetrievalItem } from '../types';

export const rerank = async (items: RetrievalItem[]): Promise<RetrievalItem[]> => {
  // TODO: integrate model-based reranker.
  return items;
};
