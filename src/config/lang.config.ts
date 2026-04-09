/** 默认回退语言（当检测语言未命中或资源加载失败时使用） */
export const defaultLanguage = 'zh-CN'

/**
 * 系统支持的语言列表
 * - code: i18next 使用的标准语言代码
 * - detectCode: 浏览器语言简写映射码，用于语言检测阶段
 */
export const languages: Language.Status[] = [
  {
    code: 'zh-CN',
    name: '中文',
    nativeName: '简体中文',
    region: 'China',
    flag: '🇨🇳',
    antCode: 'zhCN',
    translateCode: 'zh',
    detectCode: 'zh',
  },
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    region: 'United States',
    flag: '🇺🇸',
    antCode: 'enUS',
    translateCode: 'en',
    detectCode: 'en',
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    region: 'Japan',
    flag: '🇯🇵',
    antCode: 'jaJP',
    translateCode: 'jp',
    detectCode: 'ja',
  },
  {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    region: 'Korea',
    flag: '🇰🇷',
    antCode: 'koKR',
    translateCode: 'kor',
    detectCode: 'ko',
  },
  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    region: 'France',
    flag: '🇫🇷',
    antCode: 'frFR',
    translateCode: 'fra',
    detectCode: 'fr',
  },
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'Germany',
    flag: '🇩🇪',
    antCode: 'deDE',
    translateCode: 'de',
    detectCode: 'de',
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Spain',
    flag: '🇪🇸',
    antCode: 'esES',
    translateCode: 'spa',
    detectCode: 'es',
  },
  {
    code: 'pt-BR',
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'Brazil',
    flag: '🇧🇷',
    antCode: 'ptBR',
    translateCode: 'pt',
    detectCode: 'pt',
  },
  {
    code: 'ru-RU',
    name: 'Russian',
    nativeName: 'Русский',
    region: 'Russia',
    flag: '🇷🇺',
    antCode: 'ruRU',
    translateCode: 'ru',
    detectCode: 'ru',
  },
]

/** 仅提取受支持的语言 code，供 i18next supportedLngs 使用 */
export const langCodes: string[] = languages.map((item) => item.code)

/** 将浏览器检测到的语言（如 zh/en）映射为系统支持的完整语言 code（如 zh-CN/en-US） */
export function getDetectedLanguage(lng: string): string {
  return languages.find((item) => item.detectCode === lng)?.detectCode ?? lng
}
