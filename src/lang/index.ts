import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'

// 创建独立 i18n 实例，避免直接污染默认全局实例
const i18n = createInstance()
const detectedLanguageMap: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en-US',
  ja: 'ja-JP',
}
// 初始化链路：
// 1) React 适配器：让 useTranslation 等 hooks 可用
// 2) 语言检测：优先从 localStorage 读取，其次使用浏览器语言
// 3) HTTP 后端：按 loadPath 拉取 public/locales 下的语言包
// 使用 void 明确忽略 init Promise，避免 no-floating-promises 规则报错
export default void i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    // 项目支持的语言列表
    supportedLngs: ['zh-CN', 'en-US', 'ja-JP'],
    // 未命中或加载失败时回退语言
    fallbackLng: 'zh-CN',
    // 开发环境输出调试日志
    debug: import.meta.env.DEV,
    backend: {
      // 语言包路径：{{lng}} 会被替换为语言代码
      loadPath: '/locales/{{lng}}.json',
    },
    detection: {
      // 检测优先级：先缓存再浏览器
      order: ['localStorage', 'navigator'],
      // 切换后写回 localStorage，刷新后可保持语言
      caches: ['localStorage'],
      // 将浏览器简写语言映射到项目支持的完整语言代码，避免 supportedLngs 校验告警
      convertDetectedLanguage: (lng) => detectedLanguageMap[lng] ?? lng,
    },
    interpolation: {
      // React 已默认处理 XSS 转义，这里保持 false
      escapeValue: false,
    },
  })
