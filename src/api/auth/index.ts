import type { RequestConfig } from '@/utils/request'
import { post } from '@/utils/request'
import type { LoginPayload, LoginResult } from './typings'

export type { LoginPayload, LoginResult } from './typings'

/**
 * 用户登录
 * Swagger: POST /api/auth/login
 */
export function loginApi(payload: LoginPayload, config?: RequestConfig<LoginPayload>) {
  return post<LoginResult, LoginPayload>('/auth/login', payload, {
    ...config,
    withToken: false,
  })
}
