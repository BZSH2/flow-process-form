import type { RequestConfig } from '@/utils/request'
import { post } from '@/utils/request'

/**
 * 用户登录
 * Swagger: POST /api/auth/login
 */
export function loginApi(payload: Auth.LoginPayload, config?: RequestConfig<Auth.LoginPayload>) {
  return post<Auth.LoginResult, Auth.LoginPayload>('/auth/login', payload, {
    ...config,
    withToken: false,
  })
}
