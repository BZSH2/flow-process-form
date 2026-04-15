import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { message } from 'antd'
import { clearAuthTokens, getAccessToken } from '@/utils/auth'

type ResponseEnvelope<T = unknown> = {
  code?: number
  statusCode?: number
  success?: boolean
  message?: string
  msg?: string
  data?: T
}

export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  withToken?: boolean
  skipErrorMessage?: boolean
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

// 401 时统一回跳登录页；若后续做路由解耦，可改为外部注入回调处理。
const LOGIN_PATH = '/login'
const DEFAULT_ERROR_MESSAGE = '请求失败'
const DEFAULT_NETWORK_ERROR_MESSAGE = '网络异常，请稍后重试'
const SUCCESS_CODES = new Set([0, 200])

const DEFAULT_TIMEOUT = 10000
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? DEFAULT_TIMEOUT)

function trimEndSlash(value: string) {
  return value.replace(/\/+$/, '')
}

// 规范化 baseURL，避免出现缺少 /api 前缀导致请求落到 /auth/* 的问题。
// 支持三类输入：
// 1) 空值 -> /api
// 2) 相对路径 -> 保留原路径（去尾斜杠）
// 3) 绝对地址 -> 若 pathname 为空则补 /api
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

const API_BASE_URL = normalizeBaseURL(import.meta.env.VITE_API_BASE_URL)

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

// 兼容两类返回：
// 1) 标准业务包裹 { code/statusCode/success/message/data }
// 2) 原始数据（文件流、第三方接口等）
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

// 保留当前页面作为 redirect，登录成功后可回跳。
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

function getErrorRequestConfig(error: unknown): RequestConfig | undefined {
  if (!axios.isAxiosError(error)) {
    return undefined
  }
  return error.config as RequestConfig | undefined
}

function createRequestInstance() {
  const instance = axios.create({
    baseURL: getBaseURL(),
    timeout: getTimeout(),
  })

  // 默认自动带 token，可通过 withToken=false 关闭（如登录接口）。
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const requestConfig = getRequestConfig(config)
    if (requestConfig.withToken === false) {
      return config
    }

    const token = getAccessToken()
    if (!token) {
      return config
    }

    const headers = AxiosHeaders.from(config.headers)
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    config.headers = headers
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      const requestError = normalizeError(error)

      // 未授权统一清理凭证并跳登录，避免使用过期 token 死循环请求。
      if (requestError.code === 401 || requestError.status === 401) {
        clearAuthTokens()
        redirectToLogin()
      }

      const config = getErrorRequestConfig(error)
      const isCanceled = axios.isAxiosError(error) && error.code === 'ERR_CANCELED'
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
