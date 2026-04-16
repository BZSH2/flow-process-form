import { getCookie, removeCookie, setCookie } from '@/utils/cookies'

const ACCESS_TOKEN_KEY: Cookie.Key = 'TOKEN'
const REFRESH_TOKEN_KEY: Cookie.Key = 'REFRESH_TOKEN'

function normalizeToken(token: string) {
  return token.trim()
}

export function getAccessToken() {
  return getCookie(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return getCookie(REFRESH_TOKEN_KEY)
}

export function setAuthToken(accessToken: string) {
  const tokenValue = normalizeToken(accessToken)
  if (!tokenValue) {
    return
  }

  setCookie(
    ACCESS_TOKEN_KEY,
    tokenValue.startsWith('Bearer ') ? tokenValue : `Bearer ${tokenValue}`
  )
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  setAuthToken(accessToken)

  const nextRefreshToken = refreshToken?.trim()
  if (nextRefreshToken) {
    setCookie(REFRESH_TOKEN_KEY, nextRefreshToken)
  }
}

export function clearAuthTokens() {
  removeCookie(ACCESS_TOKEN_KEY)
  removeCookie(REFRESH_TOKEN_KEY)
}
