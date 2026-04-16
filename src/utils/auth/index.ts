import { getCookie, removeCookie } from '@/utils/cookies'

const ACCESS_TOKEN_KEY: Cookie.Key = 'TOKEN'
const REFRESH_TOKEN_KEY: Cookie.Key = 'REFRESH_TOKEN'

function canUseBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function normalizeStoredToken(token?: string | null) {
  const trimmedToken = token?.trim()
  if (!trimmedToken) {
    return null
  }

  return trimmedToken.replace(/^Bearer\s+/i, '').trim() || null
}

function getLocalToken(key: string) {
  if (!canUseBrowserStorage()) {
    return null
  }

  try {
    return normalizeStoredToken(window.localStorage.getItem(key))
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

function migrateLegacyCookieToken(cookieKey: Cookie.Key, storageKey: string) {
  const cookieToken = normalizeStoredToken(getCookie(cookieKey))
  if (!cookieToken) {
    return null
  }

  setLocalToken(storageKey, cookieToken)
  removeCookie(cookieKey)
  return cookieToken
}

function getStoredToken(cookieKey: Cookie.Key, storageKey: string) {
  const localToken = getLocalToken(storageKey)
  if (localToken) {
    return localToken
  }

  return migrateLegacyCookieToken(cookieKey, storageKey)
}

export function getAccessToken() {
  return getStoredToken(ACCESS_TOKEN_KEY, ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return getStoredToken(REFRESH_TOKEN_KEY, REFRESH_TOKEN_KEY)
}

export function setAuthToken(accessToken: string) {
  const normalizedAccessToken = normalizeStoredToken(accessToken)
  if (!normalizedAccessToken) {
    return
  }

  setLocalToken(ACCESS_TOKEN_KEY, normalizedAccessToken)
  removeCookie(ACCESS_TOKEN_KEY)
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  setAuthToken(accessToken)

  const normalizedRefreshToken = normalizeStoredToken(refreshToken)
  if (normalizedRefreshToken) {
    setLocalToken(REFRESH_TOKEN_KEY, normalizedRefreshToken)
    removeCookie(REFRESH_TOKEN_KEY)
  }
}

export function clearAuthTokens() {
  removeLocalToken(ACCESS_TOKEN_KEY)
  removeLocalToken(REFRESH_TOKEN_KEY)
  removeCookie(ACCESS_TOKEN_KEY)
  removeCookie(REFRESH_TOKEN_KEY)
}
