import { readRawJson } from '../io/readRawJson';
import { normalizeListings } from '../pipeline/normalize';

export const importTinyfishJsonFile = async (path: string) => {
  const raw = await readRawJson<unknown>(path);
  return normalizeListings(raw);
};
