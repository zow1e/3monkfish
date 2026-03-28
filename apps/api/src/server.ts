import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../../../.env') });

const app = createApp();
const port = Number(process.env.API_PORT ?? 4000);

app.listen(port, () => {
  console.log(`[api] listening on :${port}`);
});
