import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { message } from 'antd'
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '@/utils/auth'

type ResponseEnvelope<T = unknown> = {
  code?: number
  statusCode?: number
  success?: boolean
  message?: string
  msg?: string
  data?: T
}

type AuthTokenPair = {
  accessToken: string
  refreshToken?: string
}

export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  withToken?: boolean
  token?: string
  skipErrorMessage?: boolean
  skipAuthRefresh?: boolean
  _retry?: boolean
}

export class RequestError extends Error {
  code?: number
  status?: number

  constructor(messageText: string, options: { code?: number; status?: number } = {}) {
    super(messageText)
    this.name = 'RequestError'
    this.code = options.code
    this.status = options.status
  }
}

const LOGIN_PATH = '/login'
const DEFAULT_ERROR_MESSAGE = '请求失败'
const DEFAULT_NETWORK_ERROR_MESSAGE = '网络异常，请稍后重试'
const DEFAULT_AUTH_EXPIRED_MESSAGE = '登录状态已失效，请重新登录'
const SUCCESS_CODES = new Set([0, 200])

const DEFAULT_TIMEOUT = 10000
const DEFAULT_API_BASE_URL = 'https://nest.admin.bzsh.fun/api'
const DEV_API_BASE_URL = '/api'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? DEFAULT_TIMEOUT)

let refreshAccessTokenPromise: Promise<string> | null = null

function trimEndSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function normalizeBaseURL(rawBaseURL?: string) {
  const value = rawBaseURL?.trim()
  if (!value) {
    return '/api'
  }

  if (value.startsWith('/')) {
    return trimEndSlash(value) || '/api'
  }

  try {
    const url = new URL(value)
    const normalizedPath = trimEndSlash(url.pathname)
    url.pathname = normalizedPath && normalizedPath !== '/' ? normalizedPath : '/api'
    return url.toString().replace(/\/+$/, '')
  } catch {
    return trimEndSlash(value)
  }
}

const API_BASE_URL = import.meta.env.DEV
  ? DEV_API_BASE_URL
  : normalizeBaseURL(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL)

function getBaseURL() {
  return API_BASE_URL
}

function getTimeout() {
  return Number.isNaN(API_TIMEOUT) ? DEFAULT_TIMEOUT : API_TIMEOUT
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getEnvelopeCode(payload: ResponseEnvelope) {
  if (typeof payload.code === 'number') {
    return payload.code
  }
  if (typeof payload.statusCode === 'number') {
    return payload.statusCode
  }
  return undefined
}

function getEnvelopeMessage(payload: ResponseEnvelope) {
  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }
  if (typeof payload.msg === 'string' && payload.msg.trim()) {
    return payload.msg
  }
  return DEFAULT_ERROR_MESSAGE
}

function isEnvelopePayload(payload: unknown): payload is ResponseEnvelope {
  return isObject(payload) && ('data' in payload || 'code' in payload || 'statusCode' in payload)
}

function resolveResponseData<T>(payload: unknown): T {
  if (!isEnvelopePayload(payload)) {
    return payload as T
  }

  const code = getEnvelopeCode(payload)
  const successByCode = typeof code === 'number' ? SUCCESS_CODES.has(code) : undefined
  const success = successByCode ?? payload.success ?? true

  if (!success) {
    throw new RequestError(getEnvelopeMessage(payload), { code })
  }

  if ('data' in payload) {
    return payload.data as T
  }

  return payload as T
}

function normalizeError(error: unknown): RequestError {
  if (error instanceof RequestError) {
    return error
  }

  if (!axios.isAxiosError(error)) {
    return new RequestError(DEFAULT_NETWORK_ERROR_MESSAGE)
  }

  const axiosError = error as AxiosError<unknown>
  const responseData = axiosError.response?.data
  const status = axiosError.response?.status

  if (isEnvelopePayload(responseData)) {
    return new RequestError(getEnvelopeMessage(responseData), {
      code: getEnvelopeCode(responseData),
      status,
    })
  }

  const fallbackMessage = axiosError.message || DEFAULT_ERROR_MESSAGE
  return new RequestError(fallbackMessage, { status })
}

function redirectToLogin() {
  if (typeof window === 'undefined') {
    return
  }
  const isLoginPage = window.location.pathname === LOGIN_PATH
  if (isLoginPage) {
    return
  }
  const redirectPath = `${window.location.pathname}${window.location.search}`
  window.location.href = `${LOGIN_PATH}?redirect=${encodeURIComponent(redirectPath)}`
}

function getRequestConfig(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig & RequestConfig {
  return config as InternalAxiosRequestConfig & RequestConfig
}

function normalizeAuthorizationToken(token: string) {
  const trimmedToken = token.trim()
  if (!trimmedToken) {
    return ''
  }
  return /^Bearer\s+/i.test(trimmedToken) ? trimmedToken : `Bearer ${trimmedToken}`
}

function getErrorRequestConfig(
  error: unknown
): (InternalAxiosRequestConfig & RequestConfig) | undefined {
  if (!axios.isAxiosError(error) || !error.config) {
    return undefined
  }
  return error.config as InternalAxiosRequestConfig & RequestConfig
}

function getRequestToken(config: RequestConfig) {
  if (config.withToken === false) {
    return ''
  }

  if (typeof config.token === 'string') {
    return config.token.trim()
  }

  return getAccessToken()?.trim() || ''
}

function applyAuthorizationHeader(
  config: InternalAxiosRequestConfig | (InternalAxiosRequestConfig & RequestConfig),
  token: string
) {
  const normalizedToken = normalizeAuthorizationToken(token)
  if (!normalizedToken) {
    return config
  }

  const headers = AxiosHeaders.from(config.headers)
  headers.set('Authorization', normalizedToken)
  config.headers = headers
  return config
}

function shouldTryRefreshToken(
  error: unknown,
  config?: InternalAxiosRequestConfig & RequestConfig
) {
  if (!axios.isAxiosError(error) || error.response?.status !== 401) {
    return false
  }

  if (!config || config.withToken === false || config.skipAuthRefresh || config._retry) {
    return false
  }

  const refreshToken = getRefreshToken()?.trim()
  if (!refreshToken) {
    return false
  }

  const requestToken = typeof config.token === 'string' ? config.token.trim() : ''
  return requestToken !== refreshToken
}

function shouldLogoutOnRefreshFailure(error: RequestError) {
  return error.status === 401 || error.status === 403
}

async function requestAccessTokenByRefreshToken(refreshToken: string) {
  try {
    const response = await axios.request<unknown>({
      baseURL: getBaseURL(),
      timeout: getTimeout(),
      url: '/auth/refresh',
      method: 'POST',
      headers: {
        Authorization: normalizeAuthorizationToken(refreshToken),
      },
    })

    const tokens = resolveResponseData<AuthTokenPair>(response.data)
    const nextAccessToken = tokens.accessToken?.trim()
    if (!nextAccessToken) {
      throw new RequestError(DEFAULT_AUTH_EXPIRED_MESSAGE, { status: 401 })
    }

    setAuthTokens(nextAccessToken, tokens.refreshToken?.trim() || undefined)
    return nextAccessToken
  } catch (error) {
    throw normalizeError(error)
  }
}

function refreshAccessToken() {
  if (refreshAccessTokenPromise) {
    return refreshAccessTokenPromise
  }

  const refreshToken = getRefreshToken()?.trim()
  if (!refreshToken) {
    return Promise.reject(new RequestError(DEFAULT_AUTH_EXPIRED_MESSAGE, { status: 401 }))
  }

  refreshAccessTokenPromise = requestAccessTokenByRefreshToken(refreshToken).finally(() => {
    refreshAccessTokenPromise = null
  })

  return refreshAccessTokenPromise
}

function createRequestInstance() {
  const instance = axios.create({
    baseURL: getBaseURL(),
    timeout: getTimeout(),
  })

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const requestConfig = getRequestConfig(config)
    const token = getRequestToken(requestConfig)
    if (!token) {
      return config
    }

    applyAuthorizationHeader(config, token)
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const config = getErrorRequestConfig(error)
      const isCanceled = axios.isAxiosError(error) && error.code === 'ERR_CANCELED'

      if (config && shouldTryRefreshToken(error, config)) {
        try {
          const nextAccessToken = await refreshAccessToken()
          config._retry = true
          applyAuthorizationHeader(config, nextAccessToken)
          return instance.request(config)
        } catch (refreshError) {
          const requestError = normalizeError(refreshError)
          if (shouldLogoutOnRefreshFailure(requestError)) {
            clearAuthTokens()
            redirectToLogin()
          }
          if (!config.skipErrorMessage && !isCanceled) {
            message.error(requestError.message)
          }
          return Promise.reject(requestError)
        }
      }

      const requestError = normalizeError(error)

      if (requestError.code === 401 || requestError.status === 401) {
        clearAuthTokens()
        redirectToLogin()
      }

      if (!config?.skipErrorMessage && !isCanceled) {
        message.error(requestError.message)
      }

      return Promise.reject(requestError)
    }
  )

  return instance
}

export const requestInstance: AxiosInstance = createRequestInstance()

export async function request<T = unknown, D = unknown>(config: RequestConfig<D>): Promise<T> {
  const response: AxiosResponse<unknown, D> = await requestInstance.request(config)
  return resolveResponseData<T>(response.data)
}

export function get<T = unknown>(url: string, config?: RequestConfig) {
  return request<T>({ ...config, url, method: 'GET' })
}

function createRequestWithBody(method: 'POST' | 'PUT' | 'PATCH') {
  return function withBody<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ) {
    return request<T, D>({ ...config, url, data, method })
  }
}

export function post<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>) {
  return createRequestWithBody('POST')<T, D>(url, data, config)
}

export function put<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>) {
  return createRequestWithBody('PUT')<T, D>(url, data, config)
}

export function patch<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>) {
  return createRequestWithBody('PATCH')<T, D>(url, data, config)
}

export function del<T = unknown>(url: string, config?: RequestConfig) {
  return request<T>({ ...config, url, method: 'DELETE' })
}

const http = {
  request,
  get,
  post,
  put,
  patch,
  del,
}

export default http
