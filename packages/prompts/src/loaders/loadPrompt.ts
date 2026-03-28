import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const loadPromptTemplate = async (filename: string, version = 'v1') => {
  const filePath = join(import.meta.dirname, '..', 'templates', version, filename);
  return readFile(filePath, 'utf8');
};
