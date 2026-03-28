import type { RetrievalItem } from '../types';
import type { RetrievalQuery } from '../retrieval/interfaces';

export const hybridSearch = async (_query: RetrievalQuery): Promise<RetrievalItem[]> => {
  // TODO: combine keyword and vector retrieval.
  return [];
};
