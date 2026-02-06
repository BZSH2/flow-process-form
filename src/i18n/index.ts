// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import { messages } from './merge.ts'
import { defaultLang, type LanguageType } from '@/config'


// 获取用户浏览器首选语言
function getBrowserLocale() {
  const navigatorLocale = navigator.language
  return null
}

// 保存语言设置
export function saveLocale(locale: LanguageType) {
  try {
    localStorage.setItem('locale', locale)
    document.documentElement.setAttribute('lang', locale)
  } catch (e) {
    console.error('Failed to save locale:', e)
  }
}

// 加载语言设置
function loadLocale() {
  try {
    return localStorage.getItem('locale') || getBrowserLocale() || defaultLang
  } catch (e) {
    console.error('Failed to load locale:', e)
    return defaultLang
  }
}

// 导出切换语言的方法
export function setLang(lang: LanguageType) {
  if (i18n.global.availableLocales.includes(lang)) {
    i18n.global.locale.value = lang
    saveLocale(lang)
    return true
  }
  console.warn(`Lang "${lang}" is not available`)
  return false
}

// 获取当前语言
export function getCurrentLang() {
  return i18n.global.locale.value
}

// 获取可用语言列表
export function getAvailableLocales() {
  return i18n.global.availableLocales
}

// 监听语言变化
export function onLangChange(callback: (lang: LanguageType) => void) {
  const watchStop = watch(
    () => i18n.global.locale.value,
    (newLang) => {
      callback(newLang as LanguageType)
    }
  )
  return watchStop
}


// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: loadLocale(), // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages,
  globalInjection: true, // 全局注入 $t 等方法
})

export default i18n
