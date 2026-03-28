import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
config({ path: path.resolve(repoRoot, '.env') });

/** Defaults so `readTinyFishEnv()` succeeds when `.env` omits these (Zod requires non-empty strings). */
function ensureTinyFishDataDirs() {
  const rawDefault = path.join(repoRoot, 'data/tinyfish/raw');
  const normDefault = path.join(repoRoot, 'data/tinyfish/normalized');
  if (!process.env.TINYFISH_RAW_DATA_DIR?.trim()) {
    process.env.TINYFISH_RAW_DATA_DIR = rawDefault;
  }
  if (!process.env.TINYFISH_NORMALIZED_DATA_DIR?.trim()) {
    process.env.TINYFISH_NORMALIZED_DATA_DIR = normDefault;
  }
}
ensureTinyFishDataDirs();

/** pnpm runs the API from `apps/api`; `.env` paths like `./data/tinyfish/raw` must be repo-root relative. */
function resolveTinyFishDataDirs() {
  const raw = process.env.TINYFISH_RAW_DATA_DIR;
  const norm = process.env.TINYFISH_NORMALIZED_DATA_DIR;
  if (raw && !path.isAbsolute(raw)) {
    process.env.TINYFISH_RAW_DATA_DIR = path.resolve(repoRoot, raw);
  }
  if (norm && !path.isAbsolute(norm)) {
    process.env.TINYFISH_NORMALIZED_DATA_DIR = path.resolve(repoRoot, norm);
  }
}
resolveTinyFishDataDirs();

const app = createApp();
const port = Number(process.env.API_PORT ?? 4000);

app.listen(port, () => {
  console.log(`[api] listening on :${port}`);
});
