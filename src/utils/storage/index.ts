/**
 * 根据存储类型获取浏览器存储实例
 */
function getStorageFun(type: Storage.StorageType): Storage {
  return type === 'localStorage' ? localStorage : sessionStorage
}

/**
 * 写入指定 key 的值
 * - key 仅允许为 Storage.ValueMap 中声明的键
 * - value 仅允许传入对应 key 的值类型
 */
export function setStorage(
  key: Storage.Key,
  value: Storage.Value<Storage.Key>,
  type: Storage.StorageType = 'localStorage'
) {
  const storage = getStorageFun(type)
  storage.setItem(key, value)
}

/**
 * 读取指定 key 的值，不存在时返回 null
 */
export function getStorage(
  key: Storage.Key,
  type: Storage.StorageType = 'localStorage'
): Storage.Value<Storage.Key> | null {
  const storage = getStorageFun(type)
  return storage.getItem(key)
}

/**
 * 删除指定 key
 */
export function removeStorage(key: Storage.Key, type: Storage.StorageType = 'localStorage') {
  const storage = getStorageFun(type)
  storage.removeItem(key)
}
