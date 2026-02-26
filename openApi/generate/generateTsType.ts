import {
  isReferenceObject,
  isSchemaObject,
  type OpenAPIObject,
  type PathItemObject,
  type OperationObject,
  type ComponentsObject,
  type SchemaObject,
  type ReferenceObject
} from 'openapi3-ts/oas31'
import { resolveTypeName } from './utils'
import genFileFromTemplate from './generateTemplate'

const DEFAULT_SCHEMA: SchemaObject = {
  type: 'object',
  properties: { id: { type: 'number' } },
}

/**
 * 生成 d.ts 文件核心方法
 * @param output 文件输出路径
 * @param components openapi.component 数据
 * @param name 所属模块
 */
export default function GenerateTsType(output: string, components?: ComponentsObject, namespace?: string) {
  genFileFromTemplate('typings.d.ts', 'interface', output, {
    namespace,
    // namespace: 'API',
    list: getInterfaceTP(components || {}),
    disableTypeCheck: false,
  })
}

function getInterfaceTP(components: ComponentsObject) {
  return Object.keys(components.schemas || {}).map(typeName => {
    const name = resolveTypeName(typeName)
    const result = resolveObject(components.schemas?.[typeName] || {}, name)
    console.log('zzzzzzzzzzzzzzz', result)
    return result
  })
}

/**
 * 解析 OpenAPI Schema 对象，根据不同类型进行相应处理
 * 处理优先级：引用 > 枚举 > 组合类型 > 数组 > 对象 > 基本类型
*/
function resolveObject(schema: SchemaObject | ReferenceObject, name: string) {
  // 1. 引用类型
  if (isReferenceObject(schema)) {
    return {}
  }

  // 确保是 SchemaObject
  if (!isSchemaObject(schema)) {
    return {};
  }

  // 2. 枚举类型
  if (schema.enum && schema.enum.length > 0) {
    return {};
  }

  // 3. 组合类型
  if (schema.allOf && schema.allOf.length > 0) {
    return {}
  }

  if (schema.oneOf && schema.oneOf.length > 0) {
    return {}
  }

  if (schema.anyOf && schema.anyOf.length > 0) {
    return {}
  }

  // 4. 数组类型
  if (schema.type === 'array' && schema.items) {
    return {}
  }

  // 5. 对象类型
  if (schema.type === 'object' || schema.properties) {
    return getProps(schema, name)
  }

  // 6. 基本类型
  if (schema.type) {
    const baseType = Array.isArray(schema.type)
      ? schema.type.join('|')
      : schema.type as string;

    return {
      type: 'basic',
      dataType: baseType,
      format: schema.format,
      schema: schema
    };
  }

  // 7. 未识别类型
  console.warn('未识别的 Schema 类型:', schema);
  return {
    type: 'unknown',
    schema: schema
  };
}

  // 获取 TS 类型的属性列表
function getProps(schema: SchemaObject, name: string) {
  const a = isSchemaObject(schema.properties || {}) ? schema.properties : []
  return {
    ...schema,
    typeName: name,
    type: getType(schema),
    description: [schema.title, schema.description].filter(s => s).join(' '),
    // 如果没有 required 信息，默认全部是非必填
    required: schema?.required ?? false,
  }
}

function getRefName(refObject: any): string {
  if (typeof refObject !== 'object' || !refObject.$ref)
    {return refObject}

  const refPaths = refObject.$ref.split('/')
  return resolveTypeName(refPaths[refPaths.length - 1]) as string
}

// eslint-disable-next-line max-lines-per-function
function getType(
  schema?: SchemaObject | ReferenceObject | undefined,
  namespace: string = '',
): string {
  if (schema === undefined || schema === null)
    {return 'any'}

  if (typeof schema !== 'object')
    {return schema}
  // 判断schemaObject是否是ReferenceObject类型
  if (isReferenceObject(schema))
    {return [namespace, getRefName(schema)].filter(s => s).join('.')}

  let { type } = schema as any

  const numberEnum = [
    'int64',
    'integer',
    'long',
    'float',
    'double',
    'number',
    'int',
    'float',
    'double',
    'int32',
    'int64',
  ]

  const dateEnum = ['Date', 'date', 'dateTime', 'date-time', 'datetime']

  const stringEnum = ['string', 'email', 'password', 'url', 'byte', 'binary']

  if (schema.enum)
    {type = 'enum'}

  if (numberEnum.includes(type))
    {return 'number'}

  if (dateEnum.includes(type))
    {return 'Date'}

  if (stringEnum.includes(type))
    {return 'string'}

  if (type === 'boolean')
    {return 'boolean'}

  if (type === 'array') {
    const { items } = schema

    if (Array.isArray(items)) {
      const arrayItemType = (items as any)
        .map((subType: any) => getType(subType.schema || subType, namespace))
        .toString()
      return `[${arrayItemType}]`
    }
    const arrayType = getType(items as SchemaObject, namespace)
    return arrayType.includes(' | ') ? `(${arrayType})[]` : `${arrayType}[]`
  }

  if (type === 'enum') {
    return Array.isArray(schema.enum)
      ? Array.from(
          new Set(
            schema.enum.map((v: any) =>
              typeof v === 'string' ? `"${v.replace(/"/g, '"')}"` : getType(v),
            ),
          ),
        ).join(' | ')
      : 'string'
  }

  if (schema.oneOf && schema.oneOf.length)
    {return schema.oneOf.map(item => getType(item, namespace)).join(' | ')}

  if (schema.allOf && schema.allOf.length)
    {return `(${schema.allOf.map(item => getType(item, namespace)).join(' & ')})`}

  if (schema.type === 'object' || schema.properties) {
    if (!Object.keys(schema.properties || {}).length)
      {return 'Record<string, any>'}

    return `{ ${Object.keys(schema.properties || {})
      .map((key) => {
        const required
          = 'required' in (schema.properties?.[key] || {})
            ? ((schema.properties?.[key] || {}) as any).required
            : false
        /**
         * 将类型属性变为字符串，兼容错误格式如：
         * 3d_tile(数字开头)等错误命名，
         * 在后面进行格式化的时候会将正确的字符串转换为正常形式，
         * 错误的继续保留字符串。
         */
        return `'${key}'${required ? '' : '?'}: ${getType(schema.properties && schema.properties[key], namespace)}; `
      })
      .join('')}}`
  }
  return 'any'
}
