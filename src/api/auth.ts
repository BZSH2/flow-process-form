import type { RequestConfig } from '@/utils/request'
import { post } from '@/utils/request'

export interface LoginPayload {
  phoneNumber: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
}

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
