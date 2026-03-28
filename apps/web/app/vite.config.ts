import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forwards e.g. /api/chat → http://127.0.0.1:4000/api/chat (Express mounts chatRouter there).
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        /** TinyFish scrapes can run for several minutes; default proxy timeouts are too short. */
        timeout: 600_000,
        proxyTimeout: 600_000,
      },
    },
  },
});
