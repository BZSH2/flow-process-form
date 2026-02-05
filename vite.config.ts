import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 将根路径换成相对路径
  root: '.', // 保持根目录为项目根目录
  // 但需要配置 Rollup
  build: {
    rollupOptions: {
      input: './public/index.html'
    }
  },
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
})
