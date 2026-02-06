// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import { messages } from './merge.ts'


// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('locale') || 'ja', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages,
})

export default i18n
