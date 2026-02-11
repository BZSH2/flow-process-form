import { ElMessage } from 'element-plus'

/**
 * @description: 提示Message
 * @param message 消息内容
 * @param type 消息类型
 * @param {number} duration 消息显示时间
 * @param {object} options 消息配置项
 * @return {*}
 */
export function $baseMessage(
  message: string
): void {
  ElMessage({
    message
  })
}
