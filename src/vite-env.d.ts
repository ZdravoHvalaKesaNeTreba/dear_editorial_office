/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YANDEX_CLIENT_ID: string
  readonly VITE_YANDEX_REDIRECT_URI: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.webp'
