import type { RetrievalItem } from '../types';

export interface RetrievalQuery {
  query: string;
  petId?: string;
  ownerId?: string;
  filters?: Record<string, unknown>;
}

export interface Retriever {
  retrieve(input: RetrievalQuery): Promise<RetrievalItem[]>;
}
