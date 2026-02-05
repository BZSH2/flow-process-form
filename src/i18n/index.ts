import { createI18n } from 'vue-i18n'
import { messages, defaultLang } from './lang'
// import { LanguageType } from './lang'
type LanguageType = any

// 从localStorage获取或使用浏览器语言
const getBrowserLang = (): LanguageType => {
  const lang = navigator.language.split('-')[0]
  return ['zh', 'en', 'ja'].includes(lang) ? lang as LanguageType : defaultLang
}

const savedLang = localStorage.getItem('app_lang') as LanguageType
const initialLang = savedLang || getBrowserLang()

export const i18n = createI18n({
  legacy: false, // 使用Composition API
  locale: initialLang,
  fallbackLocale: defaultLang,
  messages,
  silentTranslationWarn: true,
  missingWarn: false,
  fallbackWarn: false
})

// 切换语言
export const setLocale = (lang: LanguageType) => {
  i18n.global.locale.value = lang
  localStorage.setItem('app_lang', lang)
  document.documentElement.lang = lang
}

// 语言切换监听
export const watchLocale = () => {
  watch(() => i18n.global.locale.value, (lang) => {
    localStorage.setItem('app_lang', lang)
    document.documentElement.lang = lang
  })
}

export default i18n
