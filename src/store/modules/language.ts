import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { defaultLanguage } from '@/config/lang.config'
import { i18n } from '@/lang'
import { setStorage, getStorage } from '@/utils/storage'

export type LanguageState = {
  lang: string
  changeLanguage: (lang: string) => void
}

// 语言由业务侧手动持久化为纯字符串，避免使用 persist 后生成对象结构
const initialLanguage = getStorage('LANGUAGESTORAGE') || defaultLanguage
// 启动时先把语言同步到 i18n，确保首屏渲染即使用正确语言包
void i18n.changeLanguage(initialLanguage)

const createSlice: StateCreator<LanguageState> = (set, get) => ({
  lang: initialLanguage,
  changeLanguage: (lang: string): void => {
    if (get().lang === lang) {
      return
    }
    set(() => ({
      lang,
    }))
    // 仅写入语言值本身，不包裹额外 JSON 对象
    setStorage('LANGUAGESTORAGE', lang)
    void i18n.changeLanguage(lang)
  },
})

export const useLanguageStore = create<LanguageState>()(devtools(createSlice))

export const useLang = () => useLanguageStore()

export default createSlice
