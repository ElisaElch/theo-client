/// <reference types="vite/client" />

// Our own VITE_ environment variables
interface ImportMetaEnv {
  readonly VITE_CARTO_KEY: string; // CARTO map tiles key (public by design)
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
