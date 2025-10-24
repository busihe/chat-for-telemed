/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // Add other environment variables here
  // readonly VITE_OTHER_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
