declare namespace Cookie {
  interface ValueMap {
    TOKEN: string
    REFRESH_TOKEN: string
    LANGUAGE: string
  }

  type CookieOptions = {
    path?: string
    domain?: string
    secure?: boolean
    expires?: number | string | Date
  }

  interface JsCookiesLike {
    getItem: (key: string) => string | null
    setItem: (
      key: string,
      value: string,
      expires?: number | string | Date,
      path?: string,
      domain?: string,
      secure?: boolean
    ) => boolean
    removeItem: (key: string, path?: string, domain?: string) => boolean
  }

  type Key = keyof ValueMap

  type Value<K extends Key> = ValueMap[K]
}

declare module 'js-cookies' {
  interface JsCookies {
    getItem: (key: string) => string | null
    setItem: (
      key: string,
      value: string,
      expires?: number | string | Date,
      path?: string,
      domain?: string,
      secure?: boolean
    ) => boolean
    removeItem: (key: string, path?: string, domain?: string) => boolean
    hasItem: (key: string) => boolean
    keys: () => string[]
  }

  const Cookies: JsCookies
  export default Cookies
}
