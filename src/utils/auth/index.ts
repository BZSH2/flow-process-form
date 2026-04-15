import { getCookie, removeCookie, setCookie } from '@/utils/cookies'

const ACCESS_TOKEN_KEY: Cookie.Key = 'TOKEN'
const REFRESH_TOKEN_KEY: Cookie.Key = 'REFRESH_TOKEN'

export function getAccessToken() {
  return getCookie(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return getCookie(REFRESH_TOKEN_KEY)
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  setCookie(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) {
    setCookie(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearAuthTokens() {
  removeCookie(ACCESS_TOKEN_KEY)
  removeCookie(REFRESH_TOKEN_KEY)
}
