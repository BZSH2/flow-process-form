
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
import nunjucks from 'nunjucks'
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

export type TagAPIDataType = Record<string, APIDataType[]>

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_SCHEMA: SchemaObject = {
  type: 'object',
  properties: { id: { type: 'number' } },
}


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

  // 获取 nunjucks模版
  private getTemplate(type: TypescriptFileType): string {
    return fs.readFileSync(path.join(this.templatesFolder, `${type}.njk`), 'utf8')
  }

  // 名称声明过滤关键字
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

  // d.ts文件生成
  private async genFileFromTemplate(
    fileName: string,
    type: any,
    output: string,
    params: Record<string, any>
  ): Promise<boolean> {
    try {
      // 获取 nunjucks 文件模版
      const template:string = this.getTemplate(type)
      // 设置输出不转义
      nunjucks.configure({
        autoescape: false,
      })

      console.log('aaaaaaaaa', nunjucks.renderString(template, params))
      fs.writeFileSync(`${output}/${fileName}`, nunjucks.renderString(template, params), 'utf8')
      return true
    } catch (error) {
      console.error('[GenSDK] file gen fail:', fileName, 'type:', type)
      throw error
    }
  }

  /**
 * 解析 OpenAPI Schema 对象，根据不同类型进行相应处理
 * 处理优先级：引用 > 枚举 > 组合类型 > 数组 > 对象 > 基本类型
 */
// eslint-disable-next-line max-lines-per-function
private resolveObject(schema: SchemaObject | ReferenceObject) {
  // 1. 引用类型
  if (isReferenceObject(schema)) {
    console.log(`引用类型: ${schema.$ref}`);
    return {
      type: 'reference',
      ref: schema.$ref,
      schema: schema
    };
  }

  // 确保是 SchemaObject
  if (!isSchemaObject(schema)) {
    return {
      type: 'unknown',
      schema: schema
    };
  }

  // 2. 枚举类型
  if (schema.enum && schema.enum.length > 0) {
    console.log(`枚举类型: ${JSON.stringify(schema.enum)}`);
    return {
      type: 'enum',
      enumValues: schema.enum,
      schema: schema
    };
  }

  // 3. 组合类型
  if (schema.allOf && schema.allOf.length > 0) {
    console.log(`组合类型(allOf): ${schema.allOf.length} 个子模式`);
    return {
      type: 'allOf',
      subSchemas: schema.allOf,
      schema: schema
    };
  }

  if (schema.oneOf && schema.oneOf.length > 0) {
    console.log(`组合类型(oneOf): ${schema.oneOf.length} 个选项`);
    return {
      type: 'oneOf',
      subSchemas: schema.oneOf,
      schema: schema
    };
  }

  if (schema.anyOf && schema.anyOf.length > 0) {
    console.log(`组合类型(anyOf): ${schema.anyOf.length} 个选项`);
    return {
      type: 'anyOf',
      subSchemas: schema.anyOf,
      schema: schema
    };
  }

  // 4. 数组类型
  if (schema.type === 'array' && schema.items) {
    console.log('数组类型');
    return {
      type: 'array',
      items: schema.items,
      schema: schema
    };
  }

  // 5. 对象类型
  if (schema.type === 'object' || schema.properties) {
    console.log(`对象类型: ${Object.keys(schema.properties || {}).length} 个属性`);
    return {
      type: 'object',
      props: this.getProps(schema)
    }
  }

  // 6. 基本类型
  if (schema.type) {
    const baseType = Array.isArray(schema.type)
      ? schema.type.join('|')
      : schema.type as string;

    console.log(`基本类型: ${baseType}${schema.format ? `(${schema.format})` : ''}`);

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
  private getProps(schema: SchemaObject) {
    const requiredPropKeys = schema?.required ?? false
    const a = isSchemaObject(schema.properties || {}) ? schema.properties : []
    return a
      ? Object.keys(schema.properties || {}).map((propName) => {
          const schema: SchemaObject = (a && a[propName]) || DEFAULT_SCHEMA
          return {
            ...schema,
            name: propName,
            // type: getType(schema),
            desc: [schema.title, schema.description].filter(s => s).join(' '),
            // 如果没有 required 信息，默认全部是非必填
            required: requiredPropKeys ? requiredPropKeys.includes(propName) : false,
          }
        })
      : []
  }




  // 生成 d.ts 文件
  private getInterfaceTP(components: ComponentsObject) {
    for (const typeName of Object.keys(components.schemas || {})) {
      const name = this.resolveTypeName(typeName)
      const result = this.resolveObject(components.schemas?.[typeName] || {})
      console.log('aaaaaaaaaaaaaaaaaa', result)
      return result
    }
  }

  // 根据 openapi 生成 d.ts文件
  private generatorTsType({components, output}: {
    components?: ComponentsObject, // openapi.component 数据
    output: string // 输出文件夹
  }) {
    this.genFileFromTemplate('typing.d.ts', 'interface', output, {
      list: this.getInterfaceTP(components || {}),
      disableTypeCheck: false,
      namespace: 'ceshi111'
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

    }
  }
}
