import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import { createResolver } from 'unplugin-react-components'
import Components from 'unplugin-react-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET
  const antdResolver = await createResolver({
    module: 'antd',
    prefix: '',
    style: false,
    exclude: (name) => !['App', 'Avatar', 'Collapse'].includes(name),
  })()

  return {
    base: env.VITE_APP_BASE || '/',
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
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
