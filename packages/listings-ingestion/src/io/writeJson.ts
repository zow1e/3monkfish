import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const writeJsonFile = async (filePath: string, payload: unknown): Promise<string> => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return filePath;
};
