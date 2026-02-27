import path from 'path'
import url from 'url'
import { generatorFolder, resolveTypeName } from './utils'
import GenerateTsType from './generateTsType'
import {
  type OpenAPIObject
} from 'openapi3-ts/oas31'

export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export interface OpenApiConfig {
  /** 输出文件位置 */
  output: string
  /** 是否生成d.ts文件 */
  isTs?: boolean
}


export default class ApiGenerator {
  /** 输出的文件夹路径 */
  private output: string
  /** 输入的 openapi 3.0.1 数据 */
  private openAPIData: OpenAPIObject[]

  constructor(
    config: OpenApiConfig,
    openAPIData: OpenAPIObject[]
  ) {
    this.output = config.output
    this.openAPIData = openAPIData
  }

  // 核心生成文件
  public generator() {
    const apiData = this.openAPIData
    for (const spec of apiData) {
      const { info, components } = spec
      const name = resolveTypeName(info.title|| 'default_api')
      // 创建 api 文件夹
      const outputFolder = path.resolve(this.output, name)
      generatorFolder(outputFolder)

      // 生成ts类型
      GenerateTsType(outputFolder, components, name)

    }
  }
}
