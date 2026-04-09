import { create, type StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'

export type ThemeState = {
  mode: ThemeMode
  changeTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const createSlice: StateCreator<ThemeState> = (set, get) => ({
  mode: 'light',
  changeTheme: (mode: ThemeMode): void => {
    if (get().mode === mode) {
      return
    }
    set(() => ({
      mode,
    }))
  },
  toggleTheme: (): void => {
    set((state) => ({
      mode: state.mode === 'light' ? 'dark' : 'light',
    }))
  },
})

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(createSlice, {
      // 主题保持 zustand persist 默认结构，便于后续扩展更多主题相关字段
      name: 'theme-storage',
      partialize: (state) => ({
        // 当前仅持久化 mode，避免把行为函数或无关字段写入存储
        mode: state.mode,
      }),
      merge: (persistedState, currentState) => {
        // 反序列化后与当前 state 合并，保证新增字段有默认值
        const typedPersistedState = persistedState as Partial<ThemeState>
        return {
          ...currentState,
          ...typedPersistedState,
        }
      },
    })
  )
)

export const useTheme = () => useThemeStore()

export default createSlice
