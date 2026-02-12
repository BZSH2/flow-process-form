/* eslint-disable max-lines-per-function */
/**
 * api 文件生成 相关
 */
import { type OpenApiConfig } from './index'
import { generatorFolder } from './utils'
import  pinyin from '../../src/utils/pinyin'
import path from 'path'
import fs from 'fs'
import url from 'url'
import ReservedDict from 'reserved-words'
import * as nunjucks from 'nunjucks'
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

export type APIDataType = {
  path: string
  method: string
} & OperationObject

export type TypescriptFileType =
  | 'interface'
  | 'serviceController'
  | 'serviceIndex'
  | 'financeCenter'
  | 'uniapptemplate'

export type TagAPIDataType = Record<string, APIDataType[]>

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default class ApiGenerator {
  protected apiData: TagAPIDataType = {}
  private output: string // 输出的文件夹路径
  private openAPIData: OpenAPIObject[]
  private methods = ['get', 'put', 'post', 'delete', 'patch']
  private templatesFolder: string = path.join(__dirname, 'templates')

  constructor(
    config: OpenApiConfig,
    openAPIData: OpenAPIObject[]
  ) {
    this.output = config.output
    this.openAPIData = openAPIData
  }

  // 类型声明过滤关键字
  private resolveTypeName(name: string) {
    // 判断是不是js关键字
    if (ReservedDict.check(name)) {return `__openAPI__${name}`}

    // 当model名称是number开头的时候，ts会报错。这种场景一般发生在后端定义的名称是中文
    if (name === '_' || /^\d$/.test(name)) {
      console.log('⚠️  models不能以number开头，原因可能是Model定义名称为中文, 建议联系后台修改')
      return `Pinyin_${name}`
    }
    // 不包含字符并且不是纯数字
    if (!/[\u3220-\uFA29]/.test(name) && !/^\d$/.test(name)) {return name}

    // 返回去除空格后的 拼音名称
    return pinyin(name.replace(/\s/g, ''), { style: 'name' })
  }

  private resolveObject(schema: SchemaObject | ReferenceObject) {
     // 判断一个 OpenAPI 对象是否是一个 $ref 引用对象（Reference Object）
    if (isReferenceObject(schema) && schema.$ref) {
      // return this.resolveRefObject(schema)
    }

    // 枚举类型
    if (isSchemaObject(schema) && schema.enum) {
      // return this.resolveEnumObject(schemaObject)
    }

    // 继承类型
    if (isSchemaObject(schema) && schema.allOf && schema.allOf.length) {

    }
      // return this.resolveAllOfObject(schemaObject)

    // 对象类型
    if (isSchemaObject(schema) && schema.properties)
      {return this.resolveProperties(schema)}

    // 数组类型
    if (isSchemaObject(schema) && schema.items && schema.type === 'array') {}
      // return this.resolveArray(schemaObject)
  }

  private resolveProperties(schema:SchemaObject) {
    return {
      props: [this.getProps(schema)],
    }
  }

 getRefName(refObject: any): string {
  if (typeof refObject !== 'object' || !refObject.$ref) {return refObject}

  const refPaths = refObject.$ref.split('/')
  return this.resolveTypeName(refPaths[refPaths.length - 1]) as string
}

    // 获取 TS 类型的属性列表
  getProps(schemaObject: SchemaObject) {
    const requiredPropKeys = schemaObject?.required ?? false
    const a = isSchemaObject(schemaObject.properties) ? schemaObject.properties : []
    return a
      ? Object.keys(schemaObject.properties).map(propName => {
          const schema: SchemaObject = (a && a[propName]) || DEFAULT_SCHEMA
          return {
            ...schema,
            name: propName,
            type: this.getType(schema),
            desc: [schema.title, schema.description].filter(s => s).join(' '),
            // 如果没有 required 信息，默认全部是非必填
            required: requiredPropKeys ? requiredPropKeys.includes(propName) : false,
          }
        })
      : []
  }

  getType(
  schemaObject: SchemaObject | ReferenceObject | undefined,
  namespace: string = ''
): string {
  if (schemaObject === undefined || schemaObject === null) {return 'any'}

  if (typeof schemaObject !== 'object') {return schemaObject}
  // 判断schemaObject是否是ReferenceObject类型
  // if (schemaObject.$ref)
  if (isReferenceObject(schemaObject))
    {return [namespace, this.getRefName(schemaObject)].filter(s => s).join('.')}

  let { type } = schemaObject as any

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

  // if (numberEnum.includes(schemaObject.format)) {
  //   type = 'number';
  // }

  if (schemaObject.enum) {type = 'enum'}

  if (numberEnum.includes(type)) {return 'number'}

  if (dateEnum.includes(type)) {return 'Date'}

  if (stringEnum.includes(type)) {return 'string'}

  if (type === 'boolean') {return 'boolean'}

  if (type === 'array') {
    const { items } = schemaObject
    // if (schemaObject.schema)
    //   items = schemaObject.schema.items

    if (Array.isArray(items)) {
      const arrayItemType = (items as any)
        .map(subType => this.getType(subType.schema || subType, namespace))
        .toString()
      return `[${arrayItemType}]`
    }
    const arrayType = this.getType(items as SchemaObject, namespace)
    return arrayType.includes(' | ') ? `(${arrayType})[]` : `${arrayType}[]`
  }

  if (type === 'enum') {
    return Array.isArray(schemaObject.enum)
      ? Array.from(
          new Set(
            schemaObject.enum.map(v =>
              typeof v === 'string' ? `"${v.replace(/"/g, '"')}"` : this.getType(v)
            )
          )
        ).join(' | ')
      : 'string'
  }

  if (schemaObject.oneOf && schemaObject.oneOf.length)
    {return schemaObject.oneOf.map(item => this.getType(item, namespace)).join(' | ')}

  if (schemaObject.allOf && schemaObject.allOf.length)
    {return `(${schemaObject.allOf.map(item => this.getType(item, namespace)).join(' & ')})`}

  if (schemaObject.type === 'object' || schemaObject.properties) {
    if (!Object.keys(schemaObject.properties || {}).length) {return 'Record<string, any>'}

    return `{ ${Object.keys(schemaObject.properties)
      .map(key => {
        const required =
          'required' in (schemaObject.properties[key] || {})
            ? ((schemaObject.properties[key] || {}) as any).required
            : false
        /**
         * 将类型属性变为字符串，兼容错误格式如：
         * 3d_tile(数字开头)等错误命名，
         * 在后面进行格式化的时候会将正确的字符串转换为正常形式，
         * 错误的继续保留字符串。
         */
        return `'${key}'${required ? '' : '?'}: ${this.getType(schemaObject.properties && schemaObject.properties[key], namespace)}; `
      })
      .join('')}}`
  }
  return 'any'
}



  private getInterfaceTP(components?: ComponentsObject) {
    if (!components) {return}
    const schemas = components.schemas || {}
    for (const schemaName in schemas) {
      const name = this.resolveTypeName(schemaName)

      const result = this.resolveObject(schemas[schemaName])

      console.log(result)
    }
  }

  // 获取 nunjucks模版
  private getTemplate(type: TypescriptFileType): string {
    return fs.readFileSync(path.join(this.templatesFolder, `${type}.njk`), 'utf8')
  }

  private async genFileFromTemplate(
    fileName: string,
    type: any,
    params: Record<string, any>
  ): Promise<boolean> {
    try {
      const template:string = this.getTemplate(type)
      // 设置输出不转义
      nunjucks.configure({
        autoescape: false,
      })
      fs.writeFile(params.output, fileName, nunjucks.renderString(template))
      return true
      // await fs.writeFile(this.output, fileName, params)
    } catch (error) {
      console.error('[GenSDK] file gen fail:', fileName, 'type:', type)
      throw error
    }
  }

  // 根据 openapi 生成 d.ts文件
  private generatorTsType({components, output}: {
    components?: ComponentsObject, // openapi.component 数据
    output: string // 输出文件夹
  }) {
    this.genFileFromTemplate('typing.d.ts', 'interface', {
      output
    })
  }

  // 核心生成文件
  public async generator() {
    const apiData = this.openAPIData
    for (const spec of apiData) {
      const { info, paths, components } = spec
      // 创建 api 文件夹
      const outputFolder = path.resolve(this.output, this.resolveTypeName(info.title|| 'default_api'))
      generatorFolder(outputFolder)

      // 生成ts类型
      this.generatorTsType({
        components,
        output: outputFolder
      })

      // Object.keys(paths || {}).forEach((p: string) => {
      //   const pathItem: PathItemObject = paths![p]

      //   this.methods.forEach(method => {
      //     const operationObject: OperationObject = pathItem[method] as unknown as OperationObject
      //     if (!operationObject) return

      //     const tags = operationObject.tags || [operationObject.operationId]

      //     tags.forEach(tagString => {
      //       const tag = pinyin(tagString || '', { style: 'name' })
      //       if (!this.apiData[tag]) this.apiData[tag] = []

      //       this.apiData[tag].push({
      //         path: outputFolder,
      //         method,
      //         ...operationObject
      //       })
      //     })
      //   })
      // })

      // fs.writeFileSync(path.resolve(this.output, 'text.txt'))
      // this.genFileFromTemplate('typings.d.ts', 'interface', {
      //   namespace: '',
      //   nullable: '',
      //   // namespace: 'API',
      //   list: ,
      //   disableTypeCheck: false,
      // })

      // console.log(this.apiData)

    }
  }
}
