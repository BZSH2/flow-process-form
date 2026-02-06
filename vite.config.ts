import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createViteProxy } from './build'
import globConfig from './src/config/index'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

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
        // 指定组件位置，默认是 src/components
        dirs: ['src/icons'],
        // 组件的有效文件扩展名
        extensions: ['vue'],
        // 设置 d.ts 文件输出路径
        dts: 'src/types/components.d.ts', // 指定路径
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
       VueI18nPlugin({
        include: [
          path.resolve(process.cwd(), 'src/i18n/lang/**/*.json'), // 语言文件路径
        ],
        runtimeOnly: false,
        compositionOnly: true,
        fullInstall: true,
        defaultSFCLang: 'yaml', // 支持SFC自定义块
        globalSFCScope: true
      })
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
