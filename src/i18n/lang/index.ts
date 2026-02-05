// 自动导入所有语言文件
const modules = import.meta.glob('./**/*.json', { eager: true })

// 支持的语言列表
export const languages = ['zh-CN', 'en', 'ja'] as const
export type LanguageType = typeof languages[number]

// 默认语言
export const defaultLang = 'zh-CN' as const

// 合并所有语言文件
export const messages = languages.reduce((acc, lang) => {
  const langModules = Object.keys(modules)
    .filter(key => key.includes(`/${lang}/`))
    .reduce((langAcc, key) => {
      const module = modules[key] as Record<string, any>
      const path = key
        .replace(`./${lang}/`, '')
        .replace('.json', '')
        .split('/')

      // 深度合并
      let current = langAcc
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {current[path[i]] = {}}
        current = current[path[i]]
      }
      current[path[path.length - 1]] = module.default || module

      return langAcc
    }, {})

  acc[lang] = langModules
  return acc
}, {} as Record<string, any>)
