import { ConfigProvider, theme as antdTheme } from 'antd'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { useResolvedThemeMode, useTheme } from './store'

export default function App() {
  const resolvedMode = useResolvedThemeMode()
  const { primaryColor } = useTheme()
  const isDark = resolvedMode === 'dark'

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = resolvedMode
    root.style.colorScheme = resolvedMode
    root.style.setProperty('--app-primary-color', primaryColor)
  }, [resolvedMode, primaryColor])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}
