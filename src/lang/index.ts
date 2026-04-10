import { createInstance } from 'i18next'
import type { InitOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import { defaultLanguage, getDetectedLanguage, langCodes } from '../config/lang.config'
import { getCookie } from '@/utils/cookies'

// 创建独立 i18n 实例，避免直接污染默认全局实例
export const i18n = createInstance()
// 初始化链路：
// 1) React 适配器：让 useTranslation 等 hooks 可用
// 2) 语言检测：优先从 localStorage 读取，其次使用浏览器语言
// 3) HTTP 后端：按 loadPath 拉取 public/locales 下的语言包
// 使用 void 明确忽略 init Promise，避免 no-floating-promises 规则报错
const options: InitOptions = {
  supportedLngs: langCodes,
  fallbackLng: defaultLanguage,
  lng: getCookie('LANGUAGE') || undefined,
  load: 'currentOnly',
  debug: import.meta.env.DEV,
  backend: {
    loadPath: '/locales/{{lng}}.json',
  },
  detection: {
    order: ['cookie', 'navigator'],
    lookupCookie: 'LANGUAGE',
    caches: [], // 交给 store 来接管 cookie 的同步
    convertDetectedLanguage: getDetectedLanguage,
  },
  interpolation: {
    escapeValue: false,
  },
}

void i18n.use(initReactI18next).use(LanguageDetector).use(HttpApi).init(options)
