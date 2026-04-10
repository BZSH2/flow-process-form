import { useEffect, useState, useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 628
const TABLET_BREAKPOINT = 1324
export type DeviceType = 'desktop' | 'tablet' | 'mobile'

/**
 * 统一订阅视口变化：
 * - window.resize 覆盖常规窗口缩放
 * - visualViewport.resize 覆盖移动端缩放/软键盘等场景
 */
function subscribeViewportResize(callback: () => void) {
  window.addEventListener('resize', callback)
  window.visualViewport?.addEventListener('resize', callback)
  return () => {
    window.removeEventListener('resize', callback)
    window.visualViewport?.removeEventListener('resize', callback)
  }
}

function getViewportWidthSnapshot() {
  return window.visualViewport?.width ?? window.innerWidth
}

function getDeviceSnapshot(): DeviceType {
  const viewportWidth = getViewportWidthSnapshot()
  if (viewportWidth < MOBILE_BREAKPOINT) {
    return 'mobile'
  }
  if (viewportWidth < TABLET_BREAKPOINT) {
    return 'tablet'
  }
  return 'desktop'
}

/**
 * 默认折叠策略：
 * - desktop: 展开
 * - tablet/mobile: 收起
 */
function getDefaultCollapseByDevice(deviceType: DeviceType) {
  return deviceType !== 'desktop'
}

/**
 * useSyncExternalStore 的服务端快照兜底。
 * 当前项目主要运行在浏览器，这里仅用于无 window 环境下的默认值。
 */
function getServerDeviceSnapshot(): DeviceType {
  return 'desktop'
}

/**
 * useSyncExternalStore 的服务端宽度兜底。
 * 选择桌面宽度，保证首帧默认按 desktop 语义计算。
 */
function getServerViewportWidthSnapshot() {
  return 1920
}

/**
 * Layout 响应式状态入口：
 * 1) 基于宽度计算 mobile / tablet / desktop
 * 2) 维护导航折叠（支持手动覆盖）
 * 3) 维护移动端抽屉开关
 */
export function useResize() {
  const deviceType = useSyncExternalStore(
    subscribeViewportResize,
    getDeviceSnapshot,
    getServerDeviceSnapshot
  )
  const viewportWidth = useSyncExternalStore(
    subscribeViewportResize,
    getViewportWidthSnapshot,
    getServerViewportWidthSnapshot
  )
  const [manualCollapse, setManualCollapse] = useState<boolean | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setManualCollapse(null)
  }, [viewportWidth])

  const collapse = manualCollapse ?? getDefaultCollapseByDevice(deviceType)

  const onToggleCollapse = () => {
    setManualCollapse(!collapse)
  }
  const onOpenMobileMenu = () => {
    setMobileMenuOpen(true)
  }
  const onCloseMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    collapse,
    onToggleCollapse,
    mobileMenuOpen,
    onOpenMobileMenu,
    onCloseMobileMenu,
  }
}
