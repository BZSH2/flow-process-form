// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    // 基础预设
    presetUno(),
    // 属性化模式：class="m-1" 可以写成 m-1
    presetAttributify(),
    // 图标预设
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
  ],
  // 自定义规则
  rules: [],
  // 快捷方式
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'btn': 'py-2 px-4 rounded bg-blue-500 text-white',
  },
  // 主题
  theme: {
    colors: {
      primary: '#1890ff',
    }
  }
})
