
export const langDict: Lang.LangDist[] = [
  { code: 'zh-CN', name: '中文(简体)', flag: '🇨🇳' },
  { code: 'zh-TW', name: '中文(繁體)', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
]

export const languages = langDict.map(item => item.code) // 支持的语言列表

export const defaultLang = languages[0] // 默认语言

export type LanguageType = typeof languages[number]

