import { languages } from '@/config/index.ts'

// 自动导入所有语言文件
const modules = import.meta.glob('./**/*.json', { eager: true })
const modulesKeys = Object.keys(modules)

// 合并所有语言文件
export const messages = languages.reduce((acc, lang) => {
  const module = modulesKeys.filter(key => key.includes(`/${lang}.json`))[0] || ''
  const modelDefault = (modules[module] as { default?: Record<string, any> })?.default || {}
  if (!modelDefault) {
    console.warn(`多语言文件类型${lang}缺失，运行 "pnpm openI18n" 初始化`)
  }
  acc[lang] = modelDefault
  return acc
}, {} as Record<string, any>)
