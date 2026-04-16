import { getRefreshToken } from '@/utils/auth'
import { post, RequestError, type RequestConfig } from '@/utils/request'

export type LoginPayload = Auth.LoginPayload
export type AuthTokens = Auth.Tokens
export type LoginResult = Auth.LoginResult
export type OperationMessage = Auth.OperationMessage

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

/**
 * 退出登录
 * Swagger: POST /api/auth/logout
 */
export function logoutApi(config?: RequestConfig) {
  return post<OperationMessage>('/auth/logout', undefined, config)
}

/**
 * 刷新 Token
 * Swagger: POST /api/auth/refresh
 */
export function refreshTokenApi(config?: RequestConfig) {
  const refreshToken = getRefreshToken()?.trim()
  if (!refreshToken) {
    return Promise.reject(new RequestError('登录状态已失效，请重新登录', { status: 401 }))
  }

  return post<AuthTokens>('/auth/refresh', undefined, {
    ...config,
    token: refreshToken,
    skipAuthRefresh: true,
  })
}
