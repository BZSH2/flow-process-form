/// <reference types="vite/client" />

type HttpUrl = `http://${string}` | `https://${string}`
type AppPath = `/${string}`

interface ImportMetaEnv {
  /** 应用部署基础路径，例如 / 或 /admin/ */
  readonly VITE_APP_BASE: AppPath
  /** API 基础地址，可为相对路径（/api）或完整域名（https://xxx/api） */
  readonly VITE_API_BASE_URL: AppPath | HttpUrl
  /** 请求超时时间（毫秒），.env 中以字符串形式提供 */
  readonly VITE_API_TIMEOUT: `${number}`
  /** 本地开发代理目标地址（建议填域名根，如 https://example.com） */
  readonly VITE_PROXY_TARGET: HttpUrl
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
