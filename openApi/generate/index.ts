import path from 'path'
import url from 'url'
import { isArray, isObject } from 'lodash-es'
import { generatorFolder, resolveTypeName, isOpenAPI } from './utils'
import GenerateTsType from './generateTsType'
import GenerateRequest from './generateRequest'
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

interface APIDataType {
  [key: string]: OpenAPIObject[] | APIDataType | APIDataType[];
  [index: number]: OpenAPIObject[] | APIDataType | APIDataType[];
}


export default class ApiGenerator {
  /** 输出的文件夹路径 */
  private output: string
  /** 输入的 openapi 3.0.1 数据 */
  private openAPIData: APIDataType

  constructor(
    config: OpenApiConfig,
    openAPIData: APIDataType
  ) {
    this.output = config.output
    this.openAPIData = openAPIData
  }

  // 核心生成文件
  public generator() {
    this.generateApi(this.openAPIData, this.output)
  }

  private generateApi(apiData: APIDataType, outputFolder: string) {
    if (isArray(apiData)) {
      apiData.forEach(item => {
        if (isOpenAPI(item)) {
          this.generateMain(item as OpenAPIObject, outputFolder)
        } else {
          // 如果 item 是对象但不是 OpenAPIObject，可能是嵌套的结构
          if (isObject(item)) {
             this.generateApi(item as APIDataType, outputFolder)
          }
        }
      })
    } else if (isObject(apiData)) {
      // 检查是否是 OpenAPIObject
      if (isOpenAPI(apiData)) {
          this.generateMain(apiData as unknown as OpenAPIObject, outputFolder)
      } else {
          for (const key of Object.keys(apiData)) {
            const value = (apiData as any)[key];
            if (isObject(value)) {
              const filePath = path.resolve(outputFolder, key)
              generatorFolder(filePath)
              this.generateApi(value as APIDataType, filePath)
            }
          }
      }
    }
  }

  private generateMain(apiData: OpenAPIObject, output: string) {
    const { info, components } = apiData
    const name = resolveTypeName(info.title|| 'default_api')
    // 创建 api 文件夹
    const outputFolder = path.resolve(output, name)
    generatorFolder(outputFolder)

    // 生成ts类型
    GenerateTsType(outputFolder, components, name)

    // 生成接口相关
    GenerateRequest(outputFolder, apiData, name)
  }
}
