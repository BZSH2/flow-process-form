export * from './utils'
export * from './apiGenerator'

// openapi 入参
export interface OpenApiConfig {
  /** 输出文件位置 */
  output: string
  /** 是否生成d.ts文件 */
  isTs?: boolean
}
