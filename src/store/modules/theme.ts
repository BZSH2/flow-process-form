import { create, type StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { useEffect, useState } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedThemeMode = 'light' | 'dark'
export type ThemeComponentSize = 'small' | 'middle' | 'large'

export type ThemeState = {
  mode: ThemeMode
  primaryColor: string
  componentSize: ThemeComponentSize
  changeTheme: (mode: ThemeMode) => void
  changePrimaryColor: (color: string) => void
  changeComponentSize: (size: ThemeComponentSize) => void
  toggleTheme: () => void
}

const createSlice: StateCreator<ThemeState> = (set, get) => ({
  mode: 'system',
  primaryColor: '#1677ff',
  componentSize: 'middle',
  changeTheme: (mode: ThemeMode): void => {
    if (get().mode === mode) {
      return
    }
    set(() => ({
      mode,
    }))
  },
  changePrimaryColor: (color: string): void => {
    if (get().primaryColor === color) {
      return
    }
    set(() => ({
      primaryColor: color,
    }))
  },
  changeComponentSize: (size: ThemeComponentSize): void => {
    if (get().componentSize === size) {
      return
    }
    set(() => ({
      componentSize: size,
    }))
  },
  toggleTheme: (): void => {
    set((state) => ({
      mode:
        state.mode === 'system'
          ? resolveThemeMode('system') === 'dark'
            ? 'light'
            : 'dark'
          : state.mode === 'light'
            ? 'dark'
            : 'light',
    }))
  },
})

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(createSlice, {
      // 主题保持 zustand persist 默认结构，便于后续扩展更多主题相关字段
      name: 'theme-storage',
      partialize: (state) => ({
        mode: state.mode,
        primaryColor: state.primaryColor,
        componentSize: state.componentSize,
      }),
      merge: (persistedState, currentState) => {
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

export function getSystemThemeMode(): ResolvedThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveThemeMode(mode: ThemeMode): ResolvedThemeMode {
  return mode === 'system' ? getSystemThemeMode() : mode
}

export function useResolvedThemeMode(): ResolvedThemeMode {
  const mode = useThemeStore((state) => state.mode)
  const [systemMode, setSystemMode] = useState<ResolvedThemeMode>(() => getSystemThemeMode())

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      setSystemMode(event.matches ? 'dark' : 'light')
    }
    setSystemMode(mediaQuery.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', onChange)
    return () => {
      mediaQuery.removeEventListener('change', onChange)
    }
  }, [])

  return mode === 'system' ? systemMode : mode
}

export default createSlice
