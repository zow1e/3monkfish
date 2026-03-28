/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full origin of the Express API (no trailing slash). If unset, the app uses `/api` (Vite proxy in dev). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
