import { i18n } from '@/lang'

// 导出全局可直接调用的翻译函数，便于结合 auto-import 在任意模块中直接使用 t('key')
// 通过 bind 固定 this 指向 i18n 实例，避免函数脱离对象后 this 丢失导致取词异常
export const t = i18n.t.bind(i18n)
// 兼容部分场景下偏好的 $t 命名，功能与 t 完全一致
export const $t = t
