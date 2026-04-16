import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import { createResolver } from 'unplugin-react-components'
import Components from 'unplugin-react-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import UnoCSS from 'unocss/vite'

const DEFAULT_PROXY_TARGET = 'https://nest.admin.bzsh.fun'

function normalizeProxyTarget(rawTarget?: string) {
  const value = rawTarget?.trim() || DEFAULT_PROXY_TARGET

  try {
    return new URL(value).origin
  } catch {
    return value.replace(/\/api(?:\/+)?$/i, '').replace(/\/+$/, '') || DEFAULT_PROXY_TARGET
  }
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawProxyTarget = env.VITE_PROXY_TARGET
  const proxyTarget = normalizeProxyTarget(rawProxyTarget)

  if (rawProxyTarget?.trim() && rawProxyTarget.trim() !== proxyTarget) {
    console.warn(`[vite] normalized VITE_PROXY_TARGET from ${rawProxyTarget} to ${proxyTarget}`)
  }

  const antdResolver = await createResolver({
    module: 'antd',
    prefix: '',
    style: false,
    exclude: (name) => !['App', 'Avatar', 'Collapse'].includes(name),
  })()

  return {
    base: env.VITE_APP_BASE || '/',
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          // Follow upstream 30x in dev so stale local env values like
          // http://host/api do not leak an extra redirect back to localhost.
          followRedirects: true,
        },
      },
    },
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      react(),
      UnoCSS(),
      AutoImport({
        include: [/\.[tj]sx?$/],
        dts: 'src/types/auto-imports.d.ts',
        imports: ['react', 'react-router-dom', { '@/utils/lang/t': ['t'] }],
      }),
      Components({
        dts: {
          filename: 'src/types/components',
        },
        resolvers: [
          antdResolver,
          () => [{ name: 'Icon', from: '/src/icons', type: 'ExportDefault', originalName: 'Icon' }],
        ],
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  }
})
