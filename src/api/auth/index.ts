import { clearAuthTokens, getRefreshToken } from '@/utils/auth'
import { get, post, request, RequestError, type RequestConfig } from '@/utils/request'

export type LoginPayload = Auth.LoginPayload
export type AuthTokens = Auth.Tokens
export type LoginResult = Auth.LoginResult
export type OperationMessage = Auth.OperationMessage
export type AuthProfile = Record<string, unknown>

function toBearerToken(token: string) {
  const trimmedToken = token.trim()
  return /^Bearer\s+/i.test(trimmedToken) ? trimmedToken : `Bearer ${trimmedToken}`
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

/**
 * 退出登录
 * Swagger: POST /api/auth/logout
 */
export function logoutApi(config?: RequestConfig) {
  return post<OperationMessage>('/auth/logout', undefined, config)
}

/**
 * 获取当前登录用户信息
 * Swagger: GET /api/auth/profile
 */
export function getProfileApi(config?: RequestConfig) {
  return get<AuthProfile>('/auth/profile', config)
}

/**
 * 刷新 Token
 * Swagger: POST /api/auth/refresh
 */
export async function refreshTokenApi(config?: RequestConfig) {
  const refreshToken = getRefreshToken()?.trim()
  if (!refreshToken) {
    return Promise.reject(new RequestError('登录状态已失效，请重新登录', { status: 401 }))
  }

  try {
    return await request<AuthTokens>({
      ...config,
      url: '/auth/refresh',
      method: 'POST',
      withToken: false,
      skipAuthRefresh: true,
      headers: {
        ...config?.headers,
        Authorization: toBearerToken(refreshToken),
      },
    })
  } catch (error) {
    clearAuthTokens()
    throw error
  }
}
