import path from 'node:path';
import type { SupportedSite } from '@petcare/types';

export const slugifyKeywords = (keywords: string): string =>
  keywords
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'keywords';

export const sanitizeTimestampForFilename = (timestamp: string): string =>
  timestamp.replace(/[:.]/g, '-');

export const buildTinyFishFilename = (
  timestamp: string,
  site: SupportedSite | 'all-sites',
  keywords: string,
): string => `${sanitizeTimestampForFilename(timestamp)}__${site}__${slugifyKeywords(keywords)}.json`;

export const buildTinyFishFilePath = (
  baseDir: string,
  timestamp: string,
  site: SupportedSite | 'all-sites',
  keywords: string,
): string => path.join(baseDir, buildTinyFishFilename(timestamp, site, keywords));
