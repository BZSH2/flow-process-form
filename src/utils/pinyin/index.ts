// utils/pinyin.ts
import { pinyin as pinyinUtil } from 'pinyin-pro'

/**
 * 中文转拼音工具函数（基于 pinyin-pro）
 *
 * @param text - 要转换的字符串（支持中英文混合）
 * @param options - 转换配置
 * @returns 转换后的拼音字符串
 *
 * @example
 * pinyinUtil('张三') // 'zhang san'
 * pinyinUtil('张三', { style: 'username' }) // 'zhangsan'
 * pinyinUtil('李四', { style: 'initials' }) // 'ls'
 */
export default function pinyin(
  text: string,
  options?: {
    /**
     * 预设风格：
     * - 'normal': 默认带空格（"zhang san"）
     * - 'username': 连续无空格（"zhangsan"）
     * - 'initials': 首字母小写（"zs"）
     */
    style?: 'normal' | 'name' | 'initials'
    /**
     * 透传给 pinyin-pro 的原始配置（可选）
     * 例如：{ toneType: 'symbol', multiple: 'all' }
     */
    config?: Parameters<typeof pinyin>[1]
  }
): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  // 根据 style 设置默认行为
  const baseConfig = (() => {
    switch (options?.style) {
      case 'name':
        return {
          nonZh: 'consecutive',
          separator: '',
          toneType: 'none',
        } as const
      case 'initials':
        return {
          pattern: 'first',
          nonZh: 'removed',
          separator: '',
          toneType: 'none',
        } as const
      case 'normal':
      default:
        return {
          nonZh: 'split',
          separator: ' ',
          toneType: 'none',
        } as const
    }
  })()

  // 合并用户自定义配置
  const finalConfig = {
    ...baseConfig,
    ...(options?.config || {}),
  }

  try {
    return pinyinUtil(text, (finalConfig as any)).trim()
  } catch (error) {
    console.warn('[pinyin] 转换失败，返回原文:', text)
    return text
  }
}
