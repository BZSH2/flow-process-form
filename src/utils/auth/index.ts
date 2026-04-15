import { getCookie, removeCookie, setCookie } from '@/utils/cookies'

const ACCESS_TOKEN_KEY: Cookie.Key = 'TOKEN'

export function getAccessToken() {
  return getCookie(ACCESS_TOKEN_KEY)
}

export function setAuthToken(accessToken: string) {
  // Bearer + token在登录获取的时候就拼接
  const tokenValue = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`
  setCookie(ACCESS_TOKEN_KEY, tokenValue)
}

export function clearAuthTokens() {
  removeCookie(ACCESS_TOKEN_KEY)
}
