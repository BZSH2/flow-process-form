declare namespace Storage {
  /** 可选的浏览器存储容器类型 */
  type StorageType = 'localStorage' | 'sessionStorage'

  /**
   * 业务存储键值映射表 使用storage需要先在这里定义类型
   * - key: 允许写入的存储键
   * - value: 该键对应的值类型
   */
  interface ValueMap {
    /** 当前系统语言标识，例如 zh-CN / en-US */
    LANGUAGESTORAGE: string
  }

  /** 仅允许使用 ValueMap 中定义的键 */
  type Key = keyof ValueMap

  /** 根据传入 key 推导该 key 对应的 value 类型 */
  type Value<K extends Key> = ValueMap[K]
}
