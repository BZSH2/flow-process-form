/**
 * 这个文件 用于 告诉后端 需要更新哪些模块的哪些服务
 *
 * 给我们返回对应的 openapi 数据
 *
 * prefix 模块名称 - 比如 我们的后端 分为了中台 财务 等模块
 * service 服务名称 - 比如 我们的后端 分为了 新增 删除 更新 查询 等服务
 *
 */

export default {
  prefix: 'pets',
  service: [
    // '*',
    // 'add'
  ],
}
