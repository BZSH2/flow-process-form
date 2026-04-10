import { create, type StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const HOME_PATH = '/dashboard'

export interface TabItem {
  path: string
  title: string
  noClosable?: boolean
}

export type TabsState = {
  activePath: string
  visitedTabs: TabItem[]
  accessHistory: string[]
  visitTab: (tab: TabItem) => void
  closeTab: (path: string) => string
  closeOtherTabs: (path: string) => string
  closeAllTabs: () => string
}

function uniquePush(list: string[], value: string) {
  return [...list.filter((item) => item !== value), value]
}

function findNextPath(
  activePath: string,
  removedPath: string,
  remainingTabs: TabItem[],
  history: string[]
) {
  if (activePath !== removedPath) {
    return activePath
  }
  const fallbackFromHistory = [...history]
    .reverse()
    .find((path) => path !== removedPath && remainingTabs.some((tab) => tab.path === path))
  if (fallbackFromHistory) {
    return fallbackFromHistory
  }
  if (remainingTabs.length > 0) {
    return remainingTabs[remainingTabs.length - 1].path
  }
  return HOME_PATH
}

const createSlice: StateCreator<TabsState> = (set, get) => ({
  activePath: HOME_PATH,
  visitedTabs: [{ path: HOME_PATH, title: 'Dashboard', noClosable: true }],
  accessHistory: [HOME_PATH],
  visitTab: (tab) => {
    const state = get()
    const existed = state.visitedTabs.some((item) => item.path === tab.path)
    const visitedTabs = existed
      ? state.visitedTabs.map((item) => (item.path === tab.path ? { ...item, ...tab } : item))
      : [...state.visitedTabs, tab]
    const accessHistory = uniquePush(state.accessHistory, tab.path)
    set(() => ({
      visitedTabs,
      activePath: tab.path,
      accessHistory,
    }))
  },
  closeTab: (path) => {
    const state = get()
    const current = state.visitedTabs.find((item) => item.path === path)
    if (!current || current.noClosable) {
      return state.activePath
    }
    const visitedTabs = state.visitedTabs.filter((item) => item.path !== path)
    const nextPath = findNextPath(state.activePath, path, visitedTabs, state.accessHistory)
    const accessHistory = uniquePush(
      state.accessHistory.filter((item) => item !== path),
      nextPath
    )
    set(() => ({
      visitedTabs,
      activePath: nextPath,
      accessHistory,
    }))
    return nextPath
  },
  closeOtherTabs: (path) => {
    const state = get()
    const keepCurrent = state.visitedTabs.find((item) => item.path === path)
    const keepHome = state.visitedTabs.find((item) => item.path === HOME_PATH)
    const visitedTabs = [keepHome, keepCurrent].filter(Boolean).filter((item, index, list) => {
      return list.findIndex((target) => target?.path === item?.path) === index
    }) as TabItem[]
    const nextPath = keepCurrent?.path ?? keepHome?.path ?? HOME_PATH
    const accessHistory = uniquePush(
      state.accessHistory.filter((item) => visitedTabs.some((tab) => tab.path === item)),
      nextPath
    )
    set(() => ({
      visitedTabs,
      activePath: nextPath,
      accessHistory,
    }))
    return nextPath
  },
  closeAllTabs: () => {
    set(() => ({
      activePath: HOME_PATH,
      visitedTabs: [{ path: HOME_PATH, title: 'Dashboard', noClosable: true }],
      accessHistory: [HOME_PATH],
    }))
    return HOME_PATH
  },
})

export const useTabsStore = create<TabsState>()(
  devtools(
    persist(createSlice, {
      name: 'tabs-storage',
      partialize: (state) => ({
        activePath: state.activePath,
        visitedTabs: state.visitedTabs,
        accessHistory: state.accessHistory,
      }),
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<TabsState>
        return {
          ...currentState,
          ...typedPersistedState,
        }
      },
    })
  )
)

export const useTabs = () => useTabsStore()

export default createSlice
