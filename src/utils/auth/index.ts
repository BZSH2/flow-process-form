import { getCookie, removeCookie, setCookie } from '@/utils/cookies'

const ACCESS_TOKEN_KEY: Cookie.Key = 'TOKEN'
const REFRESH_TOKEN_KEY: Cookie.Key = 'REFRESH_TOKEN'

function normalizeToken(token: string) {
  return token.trim()
}

function canUseBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function getLocalToken(key: string) {
  if (!canUseBrowserStorage()) {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function setLocalToken(key: string, value: string) {
  if (!canUseBrowserStorage()) {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore storage write failures in restrictive environments
  }
}

function removeLocalToken(key: string) {
  if (!canUseBrowserStorage()) {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore storage remove failures in restrictive environments
  }
}

function getTokenWithFallback(cookieKey: Cookie.Key, storageKey: string) {
  const cookieToken = getCookie(cookieKey)?.trim() || null
  const localToken = getLocalToken(storageKey)?.trim() || null

  if (localToken && (!cookieToken || cookieToken !== localToken)) {
    setCookie(cookieKey, localToken)
    return localToken
  }

  if (cookieToken && !localToken) {
    setLocalToken(storageKey, cookieToken)
    return cookieToken
  }

  return localToken || cookieToken
}

export function getAccessToken() {
  return getTokenWithFallback(ACCESS_TOKEN_KEY, ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return getTokenWithFallback(REFRESH_TOKEN_KEY, REFRESH_TOKEN_KEY)
}

export function setAuthToken(accessToken: string) {
  const tokenValue = normalizeToken(accessToken)
  if (!tokenValue) {
    return
  }

  const normalizedAccessToken = tokenValue.startsWith('Bearer ')
    ? tokenValue
    : `Bearer ${tokenValue}`

  setCookie(ACCESS_TOKEN_KEY, normalizedAccessToken)
  setLocalToken(ACCESS_TOKEN_KEY, normalizedAccessToken)
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  setAuthToken(accessToken)

  const nextRefreshToken = refreshToken?.trim()
  if (nextRefreshToken) {
    setCookie(REFRESH_TOKEN_KEY, nextRefreshToken)
    setLocalToken(REFRESH_TOKEN_KEY, nextRefreshToken)
  }
}

export function clearAuthTokens() {
  removeCookie(ACCESS_TOKEN_KEY)
  removeCookie(REFRESH_TOKEN_KEY)
  removeLocalToken(ACCESS_TOKEN_KEY)
  removeLocalToken(REFRESH_TOKEN_KEY)
}
