export const MOBILE_BREAKPOINT = 768
export const TABLET_BREAKPOINT = 1024

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

/**
 * 订阅视口宽度变化。
 * 同时监听 window 与 visualViewport，保证浏览器缩放或移动端软键盘场景下状态同步。
 */
export function subscribeViewportResize(callback: () => void) {
  window.addEventListener('resize', callback)
  window.visualViewport?.addEventListener('resize', callback)
  return () => {
    window.removeEventListener('resize', callback)
    window.visualViewport?.removeEventListener('resize', callback)
  }
}

/**
 * 基于当前视口宽度返回设备类型：
 * - < 768: mobile
 * - 768 ~ 1023: tablet
 * - >= 1024: desktop
 */
export function getDeviceSnapshot(): DeviceType {
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth
  if (viewportWidth < MOBILE_BREAKPOINT) {
    return 'mobile'
  }
  if (viewportWidth < TABLET_BREAKPOINT) {
    return 'tablet'
  }
  return 'desktop'
}
