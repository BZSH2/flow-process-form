import Cookies from 'js-cookies'

const cookiesApi =
  ((Cookies as unknown as { default?: Cookie.JsCookiesLike }).default as
    | Cookie.JsCookiesLike
    | undefined) ?? (Cookies as unknown as Cookie.JsCookiesLike)

export function setCookie(
  key: Cookie.Key,
  value: Cookie.Value<Cookie.Key>,
  options: Cookie.CookieOptions = {}
) {
  cookiesApi.setItem(
    key,
    value,
    options.expires,
    options.path ?? '/',
    options.domain,
    options.secure
  )
}

export function getCookie(key: Cookie.Key): Cookie.Value<Cookie.Key> | null {
  return cookiesApi.getItem(key)
}

export function removeCookie(key: Cookie.Key, options: Omit<Cookie.CookieOptions, 'expires'> = {}) {
  cookiesApi.removeItem(key, options.path ?? '/', options.domain)
}
