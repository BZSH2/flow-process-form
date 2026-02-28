import path from 'path'
import genFileFromTemplate from './generateTemplate'
import {
  type OpenAPIObject,
  type OperationObject,
  type ParameterObject,
  type SchemaObject,
  type ReferenceObject,
  type ResponsesObject,
  type PathItemObject,
  isReferenceObject
} from 'openapi3-ts/oas31'
import { resolveTypeName } from './utils'

/**
 * API 参数接口定义
 */
interface ApiParam {
  /** 参数名称 */
  name: string
  /** 参数类型 (TypeScript) */
  type: string
  /** 是否必填 */
  required: boolean
  /** 参数描述 */
  description?: string
  /** 参数别名（用于 path 参数解构等场景） */
  alias?: string
}

/**
 * API 请求体接口定义
 */
interface ApiBody {
  /** 请求体类型 */
  type: string
  /** 属性列表（备用，目前主要直接使用 type） */
  propertiesList?: {
    key: string
    schema: { type: string; description?: string; required?: boolean }
  }[]
}

/**
 * API 文件上传接口定义
 */
interface ApiFile {
  /** 文件字段名 */
  title: string
  /** 是否必传 */
  required: boolean
}

/**
 * API 操作对象接口定义
 * 包含生成一个 API 函数所需的所有信息
 */
interface ApiOperation {
  /** 生成的函数名称 */
  functionName: string
  /** HTTP 方法 (GET, POST, etc.) */
  method: string
  /** 请求路径 (模板字符串格式, e.g., `/pets/${id}`) */
  path: string
  /** 原始路径 (注释用, e.g., `/pets/{id}`) */
  pathInComment: string
  /** 接口描述 */
  desc?: string
  /** 是否存在参数 (query/path/header) */
  hasParams: boolean
  /** 参数集合 */
  params?: {
    query?: ApiParam[]
    path?: ApiParam[]
    header?: ApiParam[]
  }
  /** 请求体信息 */
  body?: ApiBody
  /** 文件上传信息 */
  file?: ApiFile[]
  /** 是否为 FormData 请求 */
  hasFormData?: boolean
  /** 响应类型 (TypeScript) */
  responseType: string
}

/**
 * parseOperation 函数的入参对象
 */
interface ParseOperationOptions {
  method: string
  url: string
  op: OperationObject
  functionName: string
  namespace?: string
}

/**
 * 生成请求代码的核心入口函数
 *
 * 遍历 OpenAPI 对象中的 paths，解析每个操作（Operation），
 * 并按 Tag 分组生成对应的 Service Controller 文件。
 *
 * @param output - 输出目录的绝对路径
 * @param apiData - OpenAPI 完整对象数据
 * @param namespace - 类型定义的命名空间（用于生成类型引用）
 */
export default function GenerateRequest(
  output: string,
  apiData: OpenAPIObject,
  namespace?: string
) {
  if (!apiData.paths) {return}

  // 用于存储按 Tag 分组的 API 操作列表
  const controllerMap = new Map<string, ApiOperation[]>()

  // 遍历所有路径
  for (const [url, pathItem] of Object.entries(apiData.paths)) {
    if (!pathItem) {continue}

    const methods = ['get', 'post', 'put', 'delete', 'patch'] as const

    // 遍历所有 HTTP 方法
    for (const method of methods) {
      const operation = pathItem[method] as OperationObject
      if (!operation) {continue}

      // 1. 获取 Tag（用于文件分组）
      const tag = getTag(operation)

      // 2. 生成函数名
      const functionName = getFunctionName(method, url, operation.operationId, tag)

      // 3. 合并 Path 级别和 Operation 级别的参数
      // OpenAPI 允许在 PathItem 上定义所有方法共用的参数
      const mergedParameters = mergeParameters(
        (pathItem as PathItemObject).parameters,
        operation.parameters
      )

      // 4. 解析操作详情
      const apiOp = parseOperation({
        method,
        url,
        op: { ...operation, parameters: mergedParameters } as OperationObject,
        functionName,
        namespace
      })

      // 5. 添加到 Map 中
      if (!controllerMap.has(tag)) {
        controllerMap.set(tag, [])
      }
      controllerMap.get(tag)!.push(apiOp)
    }
  }

  // 生成文件
  controllerMap.forEach((list, tag) => {
    // 处理多级 Tag 目录结构 (e.g. "auth/admin" -> auth 目录下 admin.ts)
    const tagParts = tag.split('/')
    const fileName = tagParts.pop() || 'index'
    const subDir = tagParts.join('/')
    const fileOutput = path.join(output, subDir)

    // 调用模板引擎生成文件
    genFileFromTemplate(`${resolveTypeName(fileName)}.ts`, 'serviceController', fileOutput, {
      genType: 'ts',
      requestImportStatement: "import request from '@/utils/request'", // TODO: 可配置化
      list
    })
  })
}

/**
 * 获取操作的 Tag，默认为 'default'
 */
function getTag(operation: OperationObject): string {
  return (operation.tags && operation.tags.length > 0) ? operation.tags[0] : 'default'
}

/**
 * 生成标准化的函数名称
 * 优先使用 operationId，否则基于 method + tag + url 生成
 */
function getFunctionName(
  method: string,
  url: string,
  operationId?: string,
  tag: string = 'default'
): string {
  let name = operationId || `${method}${tag}${url.replace(/[\W_]+/g, '')}`

  // 转换为驼峰命名，并移除非法字符
  name = name
    .replace(/[^a-zA-Z0-9_$]/g, '-')
    .replace(/[-_]+(.)/g, (_, c) => c.toUpperCase())

  // 确保首字母小写
  return name.charAt(0).toLowerCase() + name.slice(1)
}

/**
 * 合并 Path 级别和 Operation 级别的参数，并去重
 *
 * 规则：如果 Operation 级别定义了相同的参数（name 和 in 相同），则覆盖 Path 级别的参数。
 */
function mergeParameters(
  pathParams: (ParameterObject | ReferenceObject)[] | undefined,
  opParams: (ParameterObject | ReferenceObject)[] | undefined
): (ParameterObject | ReferenceObject)[] {
  const pParams = Array.isArray(pathParams) ? pathParams : []
  const oParams = Array.isArray(opParams) ? opParams : []

  const combined = [...pParams, ...oParams]

  // 去重逻辑
  return combined.filter((p, index, arr) => {
    const key = getParameterKey(p)
    // 检查是否是当前 key 的最后一次出现（实现覆盖效果，或者简单的保留唯一性）
    // 这里简单的逻辑是：保留第一个出现的？不，应该是 Operation 覆盖 Path。
    // 由于我们是 [...path, ...op]，如果要 Op 覆盖 Path，应该保留 *最后一个* 出现的同名参数？
    // 或者简单的去重：只保留第一次出现的？
    // 标准行为是：Operation 覆盖 Path。
    // 我们可以使用 Map 来辅助去重，以 key 为键，后面的覆盖前面的
    return index === arr.findIndex(item => getParameterKey(item) === key)
  })
}

/**
 * 获取参数的唯一标识 Key
 */
function getParameterKey(p: ParameterObject | ReferenceObject): string {
  if (isReferenceObject(p)) {
    return `ref:${p.$ref}`
  }
  return `${p.in}:${p.name}`
}


/**
 * 解析单个 Operation 对象，提取生成代码所需的信息
 */
function parseOperation(options: ParseOperationOptions): ApiOperation {
  const { method, url, op, functionName, namespace } = options
  const params: ApiOperation['params'] = { query: [], path: [], header: [] }
  let hasParams = false

  // 1. 解析 Parameters (Query, Path, Header)
  if (op.parameters) {
    // 使用 Map 去重，确保 Operation 级别的参数覆盖 Path 级别的参数（如果存在重复）
    // 注意：前面的 mergeParameters 可能已经做了一次，这里再次确保安全
    const paramMap = new Map<string, ParameterObject>()

    op.parameters.forEach(param => {
      if (isReferenceObject(param)) {return} // TODO: 暂不支持 Reference 类型的参数解析
      paramMap.set(`${param.in}:${param.name}`, param as ParameterObject)
    })

    for (const p of paramMap.values()) {
      const apiParam: ApiParam = {
        name: p.name,
        type: getParamType(p.schema, namespace),
        required: p.required || false,
        description: p.description,
        alias: p.name
      }

      if (p.in === 'query') {
        params.query!.push(apiParam)
        hasParams = true
      } else if (p.in === 'path') {
        apiParam.alias = p.name
        params.path!.push(apiParam)
        hasParams = true
      } else if (p.in === 'header') {
        params.header!.push(apiParam)
        hasParams = true
      }
    }
  }

  // 2. 解析 Request Body
  const { body, file, hasFormData } = parseRequestBody(op, namespace)

  return {
    functionName,
    method,
    // 将 URL 中的 {id} 转换为模板字符串格式 ${id}
    path: url.replace(/{([^}]+)}/g, '${$1}'),
    pathInComment: url,
    desc: op.summary || op.description,
    hasParams,
    params,
    body,
    file,
    hasFormData,
    responseType: getResponseType(op.responses, namespace)
  }
}

/**
 * 解析 Request Body
 */
function parseRequestBody(op: OperationObject, namespace?: string) {
  let body: ApiBody | undefined
  let file: ApiFile[] | undefined
  let hasFormData = false

  if (op.requestBody && !isReferenceObject(op.requestBody)) {
    const content = op.requestBody.content
    if (content) {
      // 优先处理 JSON
      if (content['application/json']) {
        const schema = content['application/json'].schema
        body = {
          type: getParamType(schema, namespace)
        }
      }
      // 处理 FormData (文件上传)
      else if (content['multipart/form-data']) {
        hasFormData = true
        const schema = content['multipart/form-data'].schema
        if (schema && !isReferenceObject(schema) && schema.properties) {
           file = parseFormDataFile(schema)
        }
      }
    }
  }
  return { body, file, hasFormData }
}

/**
 * 解析 FormData 中的文件字段
 */
function parseFormDataFile(schema: SchemaObject): ApiFile[] {
  const file: ApiFile[] = []
  if (!schema.properties) {return file}

  for(const [key, prop] of Object.entries(schema.properties)) {
     // 识别二进制字段
     if(!isReferenceObject(prop) && prop.type === 'string' && prop.format === 'binary') {
        file.push({
          title: key,
          required: schema.required?.includes(key) || false
        })
     }
  }
  return file
}

/**
 * 解析 Response Type
 * 优先取 200/201/default 的 JSON 响应
 */
function getResponseType(responses?: ResponsesObject, namespace?: string): string {
  if (!responses) {return 'any'}

  const success = responses['200'] || responses['201'] || responses['default']
  if (success && !isReferenceObject(success)) {
    if (success.content && success.content['application/json']) {
       return getParamType(success.content['application/json'].schema, namespace)
    }
  }
  return 'any'
}

/**
 * 将 OpenAPI Schema 类型映射为 TypeScript 类型字符串
 */
function getParamType(schema?: SchemaObject | ReferenceObject, namespace?: string): string {
  if (!schema) {return 'any'}

  // 处理引用类型
  if (isReferenceObject(schema)) {
    const typeName = resolveTypeName(getRefName(schema.$ref))
    return namespace ? `${namespace}.${typeName}` : typeName
  }

  // 处理数组
  if (schema.type === 'array' && schema.items) {
    return `${getParamType(schema.items, namespace)}[]`
  }

  // 映射基本类型
  const typeMap: Record<string, string> = {
    integer: 'number',
    string: 'string',
    boolean: 'boolean',
    number: 'number',
    object: 'any' // 对于未定义的 object，暂且用 any，或者可以尝试递归生成 interface
  }

  if (schema.type && typeof schema.type === 'string' && typeMap[schema.type]) {
    // 特殊处理：枚举 enum
    if (schema.enum) {
       // 简化的枚举处理：联合类型
       return schema.enum.map(e => typeof e === 'string' ? `'${e}'` : e).join(' | ')
    }
    return typeMap[schema.type]
  }

  return 'any'
}

/**
 * 从 Ref 路径中提取类型名称
 * e.g., "#/components/schemas/Pet" -> "Pet"
 */
function getRefName(ref: string): string {
  const parts = ref.split('/')
  return parts[parts.length - 1]
}
