
import genFileFromTemplate from './generateTemplate'
import {
  type OpenAPIObject
} from 'openapi3-ts/oas31'

/**
 * 从 OpenAPI 数据中解析出请求体
 * @param openApi OpenAPI 完整对象
 * @returns 解析后的所有请求
 */
export default function GenerateRequest(
  output: string,
  apiData?: OpenAPIObject,
) {
  // 生成所有类型的依赖关系图，确保正确的生成顺序
  const sortedList = sortTypesByDependency(list)

  genFileFromTemplate('typings.d.ts', 'interface', output, {
    namespace,
    list: sortedList,
    disableTypeCheck: false,
  })
}
