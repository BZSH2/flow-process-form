import { i18n } from '@/lang'
import { useSyncExternalStore } from 'react'

export function t(key: string, options?: Record<string, unknown>) {
  const currentLang = i18n.resolvedLanguage ?? i18n.language
  return i18n.t(key, { ...options, lng: currentLang })
}

export const $t = t

export function useI18nRefresh() {
  return useSyncExternalStore(
    (onStoreChange) => {
      i18n.on('languageChanged', onStoreChange)
      return () => {
        i18n.off('languageChanged', onStoreChange)
      }
    },
    () => i18n.resolvedLanguage ?? i18n.language,
    () => i18n.resolvedLanguage ?? i18n.language
  )
}
