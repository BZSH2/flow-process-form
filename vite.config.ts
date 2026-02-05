import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createViteProxy } from './build'
import globConfig from './src/config/index'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const viteEnv: ImportMetaEnv = loadEnv(mode, process.cwd()) as any

  return {
    base: viteEnv.VITE_BASE_URL, // 将根路径换成相对路径
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        // 设置 d.ts 文件输出路径
        dts: 'src/types/auto-imports.d.ts', // 指定路径
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        // 设置 d.ts 文件输出路径
        dts: 'src/types/components.d.ts', // 指定路径
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      port: globConfig.devPort,
      host: true,
      proxy: command === 'serve' ? createViteProxy() : undefined,
    },
  }
})
