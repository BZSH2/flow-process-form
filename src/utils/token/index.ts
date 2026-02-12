import Cookies from 'js-cookie'

const ADMIN_TOKEN = 'admin_token'

/** 设置 token */
export function setToken(token: string) {
  return Cookies.set(ADMIN_TOKEN, token)
}

/** 获取 token */
export function getToken() {
  return Cookies.get(ADMIN_TOKEN)
}

/** 移除 token */
export function clearToken() {
  return Cookies.remove(ADMIN_TOKEN)
}
