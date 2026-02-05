/**
 *后台服务的环境类型
 * - dev: 后台开发环境
 * - test: 后台测试环境
 * - uat: 后台测试环境
 * - prod: 后台生产环境
 */
import type { ComputedRef, Ref } from 'vue'

type ServiceEnvType = 'dev' | 'test' | 'uat' | 'prod'

/**
 *编译环境
 * - build: 打包编译
 * - serve: 开发编译
 */
type CommandType = 'build' | 'serve'

type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>
}

type GlobEnvConfig = {
  VITE_DEV_PROXY: string
  VITE_DEV_LOGIN: boolean
  VITE_LOGIN_URL: string
  VITE_COOKIE_DOMAIN: string
  VITE_LOGIN_URL_PORT: string
  VITE_SYSTEM_KEY: string
}

type GlobConfig = {
  devProxy: string
  devLogin: boolean | string
  loginUrl: string
  loginPort: number
  loginCookieDomain: string
  systemKey: string
}

export { DynamicProps, GlobEnvConfig, GlobConfig, ServiceEnvType, CommandType }
