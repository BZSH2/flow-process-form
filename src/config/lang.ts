

export const languages = ['zh-CN', 'en', 'ja'] as const // 支持的语言列表

export const defaultLang = 'zh-CN' as const // 默认语言

export type LanguageType = typeof languages[number]

