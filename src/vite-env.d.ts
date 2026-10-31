/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YOUCAM_API_KEY?: string;
  readonly VITE_YOUCAM_BASE_URL?: string;
  readonly VITE_YOUCAM_MOCK_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
