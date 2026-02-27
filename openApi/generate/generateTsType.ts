import {
  isReferenceObject,
  isSchemaObject,
  type ComponentsObject,
  type SchemaObject,
  type ReferenceObject
} from 'openapi3-ts/oas31'
import { resolveTypeName } from './utils'
import genFileFromTemplate from './generateTemplate'

// 扩展 SchemaObject 以包含 nullable
type ExtendedSchemaObject = SchemaObject & { nullable?: boolean }


export interface TemplateType {
  type: 'interface' | 'enum' | 'union' | 'intersection' | 'array' | 'typeAlias' | 'basic'
  typeName: string
  description?: string
  // 接口属性
  properties?: TemplateProperty[]
  // 枚举值
  enumValues?: (string | number)[]
  valueType?: 'string' | 'number'
  // 联合类型
  unionTypes?: string[]
  // 交叉类型
  intersectionTypes?: string[]
  // 数组类型
  itemType?: string
  // 类型别名
  typeDefinition?: string
  // 基础类型
  dataType?: string
  format?: string
  // 扩展信息
  isExport?: boolean
  isReadonly?: boolean
  isNullable?: boolean
  example?: any
}

export interface TemplateProperty {
  name: string
  description?: string
  type: string
  required: boolean
  isReadonly?: boolean
  isIndexSignature?: boolean
  keyType?: string
  example?: any
}

/**
 * 生成 d.ts 文件核心方法
 *
 * 此方法负责将 OpenAPI 的 components.schemas 转换为 TypeScript 类型定义。
 * 它执行以下步骤：
 * 1. 解析所有 Schema 并转换为中间表示 TemplateType。
 * 2. 构建依赖图并进行拓扑排序，以确保生成的类型顺序正确（被依赖的类型先生成）。
 * 3. 使用模板引擎生成最终的 d.ts 文件。
 *
 * @param output 文件输出路径
 * @param components openapi.component 数据
 * @param namespace 命名空间
 */
export default function generateTsType(
  output: string,
  components?: ComponentsObject,
  namespace?: string
): void {
  const list = getTemplateTypes(components || {})

  // 生成所有类型的依赖关系图，确保正确的生成顺序
  const sortedList = sortTypesByDependency(list)

  genFileFromTemplate('typings.d.ts', 'interface', output, {
    namespace,
    list: sortedList,
    disableTypeCheck: false,
  })
}

/**
 * 获取模板类型列表（完整版）
 *
 * 遍历 components.schemas 中的所有定义，将其转换为 TemplateType 对象列表。
 * 会自动处理类型名称的规范化（resolveTypeName）。
 */
function getTemplateTypes(components: ComponentsObject): TemplateType[] {
  const schemas = components.schemas || {}
  const templateTypes: TemplateType[] = []
  const processedTypes = new Set<string>()

  Object.entries(schemas).forEach(([typeName, schema]) => {
    const name = resolveTypeName(typeName)
    if (!processedTypes.has(name)) {
      const templateType = resolveToTemplateType(schema, name, schemas)
      if (templateType) {
        templateTypes.push(templateType)
        processedTypes.add(name)
      }
    }
  })

  return templateTypes
}

/**
 * 获取 Schema 是否可为空
 * @param schema Schema 对象
 */
function getNullable(schema: SchemaObject | ReferenceObject): boolean | undefined {
  return (schema as ExtendedSchemaObject).nullable
}

/**
 * 获取 Schema 的描述信息
 * @param schema Schema 对象
 */
function getDescription(schema: SchemaObject): string | undefined {
  return [schema.title, schema.description].filter(Boolean).join(' ') || undefined
}

/**
 * 将 OpenAPI Schema 转换为模板类型
 *
 * 这是一个递归函数，根据 Schema 的类型（引用、枚举、组合、数组、对象、基本类型）
 * 生成对应的 TemplateType。
 *
 * @param schema 当前处理的 Schema 对象
 * @param typeName 类型名称
 * @param allSchemas 所有可用的 Schema 定义（用于解析引用）
 * @param context 上下文信息，包含已访问的引用集合（防止循环引用）和命名空间
 */
function resolveToTemplateType(
  schema: SchemaObject | ReferenceObject,
  typeName: string,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  context: {
    visitedRefs?: Set<string>
    namespace?: string
  } = {}
): TemplateType | null {
  const visitedRefs = context.visitedRefs || new Set<string>()

  // 避免循环引用
  if (visitedRefs.has(typeName)) {
    return {
      type: 'basic',
      typeName,
      dataType: 'any',
      description: `循环引用类型: ${typeName}`
    }
  }

  visitedRefs.add(typeName)

  try {
    // 1. 处理引用类型
    if (isReferenceObject(schema)) {
      return handleReferenceType(schema, typeName, {
        allSchemas,
        context,
        visitedRefs
      })
    }

    if (!isSchemaObject(schema)) {
      return {
        type: 'basic',
        typeName,
        dataType: 'any',
        description: '无效的 Schema 类型'
      }
    }

    // 2. 处理枚举类型
    if (schema.enum && schema.enum.length > 0) {
      return handleEnumType(schema, typeName)
    }

    // 3. 处理组合类型
    const combinationType = handleCombinationType(schema, typeName, allSchemas, context)
    if (combinationType) {return combinationType}

    // 4. 处理数组类型
    if (schema.type === 'array' && schema.items) {
      return handleArrayType(schema, typeName, allSchemas, context)
    }

    // 5. 处理对象类型
    if (schema.type === 'object' || schema.properties) {
      return handleObjectType(schema, typeName, allSchemas, context)
    }

    // 6. 处理基本类型
    if (schema.type) {
      return handleBasicType(schema, typeName, allSchemas, context)
    }

    // 7. 处理 any 类型
    return {
      type: 'basic',
      typeName,
      dataType: 'any',
      description: getDescription(schema),
      isNullable: getNullable(schema)
    }

  } finally {
    visitedRefs.delete(typeName)
  }
}

interface ReferenceTypeOptions {
  allSchemas: Record<string, SchemaObject | ReferenceObject>
  context: any
  visitedRefs: Set<string>
}

function handleReferenceType(
  schema: ReferenceObject,
  typeName: string,
  options: ReferenceTypeOptions
): TemplateType | null {
  const { allSchemas, context, visitedRefs } = options
  const refName = getRefName(schema.$ref)
  if (refName !== typeName && allSchemas[refName]) {
    const refSchema = allSchemas[refName]
    return resolveToTemplateType(refSchema, refName, allSchemas, {
      ...context,
      visitedRefs: new Set(visitedRefs)
    })
  }
  return {
    type: 'typeAlias',
    typeName,
    typeDefinition: refName,
    description: `引用类型: ${refName}`
  }
}

function handleEnumType(schema: SchemaObject, typeName: string): TemplateType {
  const valueType = schema.type === 'integer' || schema.type === 'number' ? 'number' : 'string'
  return {
    type: 'enum',
    typeName,
    description: getDescription(schema),
    enumValues: schema.enum,
    valueType,
    example: schema.example
  }
}

function handleCombinationType(
  schema: SchemaObject,
  typeName: string,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  context: any
): TemplateType | null {
  if (schema.allOf && schema.allOf.length > 0) {
    const intersectionTypes = schema.allOf
      .map(item => getTypeString(item, allSchemas, context))
      .filter(Boolean) as string[]

    if (intersectionTypes.length > 0) {
      return {
        type: 'intersection',
        typeName,
        description: getDescription(schema),
        intersectionTypes,
        example: schema.example,
        isNullable: getNullable(schema)
      }
    }
  }

  if (schema.oneOf && schema.oneOf.length > 0) {
    const unionTypes = schema.oneOf
      .map(item => getTypeString(item, allSchemas, context))
      .filter(Boolean) as string[]

    if (unionTypes.length > 0) {
      return {
        type: 'union',
        typeName,
        description: getDescription(schema),
        unionTypes,
        example: schema.example,
        isNullable: getNullable(schema)
      }
    }
  }

  if (schema.anyOf && schema.anyOf.length > 0) {
    const unionTypes = schema.anyOf
      .map(item => getTypeString(item, allSchemas, context))
      .filter(Boolean) as string[]

    if (unionTypes.length > 0) {
      return {
        type: 'union',
        typeName,
        description: getDescription(schema),
        unionTypes,
        example: schema.example,
        isNullable: getNullable(schema)
      }
    }
  }
  return null
}

function handleArrayType(
  schema: SchemaObject,
  typeName: string,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  context: any
): TemplateType {
  const itemType = getTypeString(schema.items!, allSchemas, context)
  return {
    type: 'array',
    typeName,
    description: getDescription(schema),
    itemType: itemType || 'any',
    example: schema.example,
    isNullable: getNullable(schema)
  }
}

function handleObjectType(
  schema: SchemaObject,
  typeName: string,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  context: any
): TemplateType {
  const properties = getProperties(schema, allSchemas, context)

  // 处理 additionalProperties
  if (schema.additionalProperties) {
    let additionalPropsType: string;
    if (typeof schema.additionalProperties === 'boolean') {
      additionalPropsType = 'any';
    } else {
      additionalPropsType = getTypeString(
        schema.additionalProperties,
        allSchemas,
        context
      );
    }

    properties.push({
      name: '[key: string]',
      type: additionalPropsType || 'any',
      required: false,
      isIndexSignature: true,
      keyType: 'string'
    })
  }

  return {
    type: 'interface',
    typeName,
    description: getDescription(schema),
    properties,
    example: schema.example,
    isNullable: getNullable(schema),
    isReadonly: schema.readOnly
  }
}

function handleBasicType(
  schema: SchemaObject,
  typeName: string,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  context: any
): TemplateType {
  const dataType = getTypeString(schema, allSchemas, context)
  return {
    type: 'basic',
    typeName,
    description: getDescription(schema),
    dataType: dataType || 'any',
    format: schema.format,
    example: schema.example,
    isNullable: getNullable(schema)
  }
}

/**
 * 获取对象属性
 */
function getProperties(
  schema: SchemaObject,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  context: any
): TemplateProperty[] {
  const properties: TemplateProperty[] = []
  const required = new Set(schema.required || [])

  if (schema.properties) {
    Object.entries(schema.properties).forEach(([propName, propSchema]) => {
      const propType = getTypeString(propSchema, allSchemas, context)

      properties.push({
        name: propName,
        description: isSchemaObject(propSchema)
          ? getDescription(propSchema)
          : undefined,
        type: propType || 'any',
        required: required.has(propName),
        isReadonly: isSchemaObject(propSchema) ? propSchema.readOnly : false,
        example: isSchemaObject(propSchema) ? propSchema.example : undefined
      })
    })
  }

  return properties
}

/**
 * 获取类型字符串（支持嵌套和引用）
 */
function getTypeString(
  schema: SchemaObject | ReferenceObject,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  context: any
): string {
  // 处理引用类型
  if (isReferenceObject(schema)) {
    return handleRefTypeString(schema, context)
  }

  if (!isSchemaObject(schema)) {
    return 'any'
  }

  // 处理枚举
  if (schema.enum && schema.enum.length > 0) {
    return handleEnumTypeString(schema)
  }

  // 处理组合类型
  const combinationType = handleCombinationTypeString(schema, allSchemas, context)
  if (combinationType) {return combinationType}

  // 处理数组
  if (schema.type === 'array' && schema.items) {
    return handleArrayTypeString(schema, allSchemas, context)
  }

  // 处理对象
  if (schema.type === 'object' || schema.properties) {
    return handleObjectTypeString(schema, allSchemas, context)
  }

  // 处理基本类型
  if (schema.type) {
    return handleBasicTypeString(schema)
  }

  return 'any'
}

function handleRefTypeString(schema: ReferenceObject, context: any): string {
  const refName = getRefName(schema.$ref)
  // 如果是当前命名空间的类型，直接使用类型名
  if (context.namespace) {
    return `${context.namespace}.${refName}`
  }
  return refName
}

function handleEnumTypeString(schema: SchemaObject): string {
  const values = schema.enum!.map(value =>
    typeof value === 'string' ? `"${value}"` : String(value)
  )
  return values.join(' | ')
}

function handleCombinationTypeString(
  schema: SchemaObject,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  context: any
): string | null {
  if (schema.allOf && schema.allOf.length > 0) {
    const types = schema.allOf
      .map(item => getTypeString(item, allSchemas, context))
      .filter(Boolean)
    return `(${types.join(' & ')})`
  }

  if (schema.oneOf && schema.oneOf.length > 0) {
    const types = schema.oneOf
      .map(item => getTypeString(item, allSchemas, context))
      .filter(Boolean)
    return types.join(' | ')
  }

  if (schema.anyOf && schema.anyOf.length > 0) {
    const types = schema.anyOf
      .map(item => getTypeString(item, allSchemas, context))
      .filter(Boolean)
    return types.join(' | ')
  }
  return null
}

function handleArrayTypeString(
  schema: SchemaObject,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  context: any
): string {
  const itemType = getTypeString(schema.items!, allSchemas, context)
  const wrappedType = itemType.includes('|') ? `(${itemType})` : itemType
  return `${wrappedType}[]`
}

function handleObjectTypeString(
  schema: SchemaObject,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  context: any
): string {
  if (!schema.properties || Object.keys(schema.properties).length === 0) {
    if (schema.additionalProperties) {
      let additionalType: string;
      if (typeof schema.additionalProperties === 'boolean') {
        additionalType = 'any';
      } else {
        additionalType = getTypeString(
          schema.additionalProperties,
          allSchemas,
          context
        );
      }
      return `Record<string, ${additionalType || 'any'}>`
    }
    return 'Record<string, any>'
  }

  const properties = getProperties(schema, allSchemas, context)
  const propStrings = properties.map(prop => {
    const optional = prop.required ? '' : '?'
    const readonly = prop.isReadonly ? 'readonly ' : ''
    return `  ${readonly}${prop.name}${optional}: ${prop.type};`
  })

  return `{\n${propStrings.join('\n')}\n}`
}

function handleBasicTypeString(schema: SchemaObject): string {
  const baseType = mapOpenApiTypeToTs(schema.type as string, schema.format)

  // 处理 nullable
  if ((schema as ExtendedSchemaObject).nullable && baseType !== 'any' && baseType !== 'null') {
    return `${baseType} | null`
  }

  return baseType
}

const NUMBER_TYPES = new Set([
  'int64', 'integer', 'long', 'float', 'double', 'number', 'int',
  'int32', 'int64', 'decimal'
])

const STRING_TYPES = new Set([
  'string', 'email', 'password', 'uri', 'url', 'uuid', 'byte', 'binary',
  'hostname', 'ipv4', 'ipv6', 'date', 'date-time', 'datetime'
])

/**
 * 映射 OpenAPI 类型到 TypeScript 类型
 */
function mapOpenApiTypeToTs(openApiType: string, format?: string): string {
  if (NUMBER_TYPES.has(openApiType)) {
    return 'number'
  }

  if (STRING_TYPES.has(openApiType)) {
    if (format === 'date' || format === 'date-time') {
      return 'string | Date'
    }
    return 'string'
  }

  if (openApiType === 'boolean') {
    return 'boolean'
  }

  // 处理联合类型字符串
  if (typeof openApiType === 'string' && openApiType.includes('|')) {
    const types = openApiType.split('|').map(t => mapOpenApiTypeToTs(t.trim(), format))
    return [...new Set(types)].join(' | ')
  }

  // 处理数组类型字符串
  if (typeof openApiType === 'string' && openApiType.endsWith('[]')) {
    const itemType = openApiType.slice(0, -2)
    const mappedItemType = mapOpenApiTypeToTs(itemType, format)
    return `${mappedItemType}[]`
  }

  return 'any'
}

/**
 * 根据依赖关系排序类型
 */
function sortTypesByDependency(types: TemplateType[]): TemplateType[] {
  const { typeMap, dependencies } = buildDependencyGraph(types)
  return topologicalSort(types, typeMap, dependencies)
}

function buildDependencyGraph(types: TemplateType[]) {
  const typeMap = new Map<string, TemplateType>()
  const dependencies = new Map<string, Set<string>>()

  types.forEach(type => {
    typeMap.set(type.typeName, type)
    dependencies.set(type.typeName, new Set())

    // 收集依赖
    if (type.type === 'interface' && type.properties) {
      type.properties.forEach(prop => {
        const deps = extractDependenciesFromType(prop.type)
        deps.forEach(dep => dependencies.get(type.typeName)!.add(dep))
      })
    } else if (type.type === 'typeAlias' && type.typeDefinition) {
      const deps = extractDependenciesFromType(type.typeDefinition)
      deps.forEach(dep => dependencies.get(type.typeName)!.add(dep))
    } else if (type.type === 'union' && type.unionTypes) {
      type.unionTypes.forEach(unionType => {
        const deps = extractDependenciesFromType(unionType)
        deps.forEach(dep => dependencies.get(type.typeName)!.add(dep))
      })
    } else if (type.type === 'intersection' && type.intersectionTypes) {
      type.intersectionTypes.forEach(intersectionType => {
        const deps = extractDependenciesFromType(intersectionType)
        deps.forEach(dep => dependencies.get(type.typeName)!.add(dep))
      })
    } else if (type.type === 'array' && type.itemType) {
      const deps = extractDependenciesFromType(type.itemType)
      deps.forEach(dep => dependencies.get(type.typeName)!.add(dep))
    }
  })

  return { typeMap, dependencies }
}

function topologicalSort(
  types: TemplateType[],
  typeMap: Map<string, TemplateType>,
  dependencies: Map<string, Set<string>>
): TemplateType[] {
  const visited = new Set<string>()
  const temp = new Set<string>()
  const result: TemplateType[] = []

  function visit(typeName: string) {
    if (temp.has(typeName)) {
      throw new Error(`检测到循环依赖: ${typeName}`)
    }

    if (!visited.has(typeName)) {
      temp.add(typeName)

      const deps = dependencies.get(typeName) || new Set()
      deps.forEach(dep => {
        if (typeMap.has(dep)) {
          visit(dep)
        }
      })

      temp.delete(typeName)
      visited.add(typeName)

      const type = typeMap.get(typeName)
      if (type) {
        result.push(type)
      }
    }
  }

  types.forEach(type => {
    if (!visited.has(type.typeName)) {
      visit(type.typeName)
    }
  })

  return result
}

/**
 * 从类型字符串中提取依赖
 */
function extractDependenciesFromType(typeString: string): string[] {
  const dependencies: string[] = []

  // 匹配类型引用（大写字母开头的标识符）
  const typeRefRegex = /\b([A-Z][a-zA-Z0-9_$]*)\b/g
  const matches = typeString.match(typeRefRegex) || []

  // 过滤掉基础类型
  const baseTypes = ['string', 'number', 'boolean', 'any', 'unknown', 'never', 'void', 'null', 'undefined', 'Date', 'Record', 'Array']

  matches.forEach(match => {
    if (!baseTypes.includes(match) && !dependencies.includes(match)) {
      dependencies.push(match)
    }
  })

  return dependencies
}

/**
 * 从 $ref 路径中提取类型名称
 */
function getRefName(ref: string): string {
  if (!ref.includes('#')) {
    return ref.split('/').pop() || 'any'
  }

  const refPaths = ref.split('/')
  const lastPath = refPaths[refPaths.length - 1]

  // 移除可能的特殊字符
  return lastPath.replace(/[^a-zA-Z0-9_$]/g, '')
}

/**
 * 生成类型文件的辅助函数
 */
export function generateAllTypes(
  components: ComponentsObject,
  _namespace?: string
): { interfaces: TemplateType[]; enums: TemplateType[]; typeAliases: TemplateType[] } {
  const list = getTemplateTypes(components)
  const sortedList = sortTypesByDependency(list)

  const interfaces = sortedList.filter(t => t.type === 'interface')
  const enums = sortedList.filter(t => t.type === 'enum')
  const typeAliases = sortedList.filter(
    t => ['union', 'intersection', 'array', 'basic', 'typeAlias'].includes(t.type)
  )

  return { interfaces, enums, typeAliases }
}

// 导出旧版本的兼容函数
export function getInterfaceTP(components: ComponentsObject) {
  const { interfaces } = generateAllTypes(components)

  return interfaces.map(interfaceData => ({
    typeName: interfaceData.typeName,
    type: 'interface',
    description: interfaceData.description,
    required: interfaceData.properties?.filter(p => p.required).map(p => p.name) || [],
    props: interfaceData.properties?.map(prop => ({
      name: prop.name,
      type: prop.type,
      description: prop.description,
      required: prop.required
    })) || []
  }))
}
