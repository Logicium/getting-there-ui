/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CMS_URL: string
  readonly VITE_SQUARE_APP_ID: string
  readonly VITE_SQUARE_LOCATION_ID: string
  readonly VITE_GOOGLE_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
