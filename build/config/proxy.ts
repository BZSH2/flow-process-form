import type { ProxyOptions } from 'vite'

/**
 * 本地接口服务代理
 * @returns 返回一个对象，包含代理配置
 *  */
export function createViteProxy(): Record<string, string | ProxyOptions> | undefined {
  return {
    '/apiPets': {
      target: 'https://m1.apifoxmock.com/m1/7814952-7562684-default',
      changeOrigin: true, //  target是域名的话，需要这个参数，
      secure: false,
      rewrite: (path) => path.replace(/^\/apiPets/, ''),
    },
    '/setList': {
      target: 'https://localhost:3352/',
      changeOrigin: true, //  target是域名的话，需要这个参数，
      secure: false,
    },
  }
}
