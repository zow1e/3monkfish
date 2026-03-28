import { readFile } from 'node:fs/promises';

export const readRawJson = async <T>(path: string): Promise<T> => {
  const data = await readFile(path, 'utf8');
  return JSON.parse(data) as T;
};
