import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import type { DebouncedFunc, DebounceSettings, ThrottleSettings } from 'lodash'

type AnyFunction = (...args: any[]) => any

/**
 * 防抖：在连续触发结束后，仅执行最后一次调用
 */
export function Debounce<T extends AnyFunction>(
  fn: T,
  wait = 300,
  options?: DebounceSettings
): DebouncedFunc<T> {
  return debounce(fn, wait, options)
}

/**
 * 节流：在持续触发期间，按固定时间间隔执行
 */
export function Throttle<T extends AnyFunction>(
  fn: T,
  wait = 300,
  options?: ThrottleSettings
): DebouncedFunc<T> {
  return throttle(fn, wait, options)
}

/**
 * 生成唯一ID：基于当前时间戳及随机数
 */
export function generateUniqueId(prefix = ''): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${prefix}${timestamp}-${randomStr}`
}
