import fs from 'fs'
import path from 'path'
import url from 'url'
import nunjucks from 'nunjucks'
import { writeFile } from '../utils'

export type TypescriptFileType =
  | 'interface'
  | 'serviceController'
  | 'serviceIndex'
  | 'financeCenter'

// 获取 nunjucks模版
function getTemplate(type: TypescriptFileType): string {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatesFolder: string = path.join(__dirname, 'templates')
  return fs.readFileSync(path.join(templatesFolder, `${type}.njk`), 'utf8')
}

/**
 * 根据 Nunjucks 模板生成文件
 *
 * 此函数基于指定的模板类型获取对应的 Nunjucks 模板文件，使用提供的参数渲染模板内容
 *
 * @param fileName - 生成的目标文件名（包含扩展名，如 "UserService.ts"）
 * @param type - 模板类型标识符，用于从模板库中获取对应的模板文件
 * @param output - 文件输出目录路径（相对或绝对路径）
 * @param params - 模板渲染所需的参数对象，键值对将被注入到模板变量中
 * @throws {Error} 当模板获取失败、模板渲染错误或文件写入失败时抛出异常，
 *                 并在控制台输出详细的错误日志，包含文件名和模板类型信息。
 */
export default function genFileFromTemplate(
  fileName: string,
  type: any,
  output: string,
  params: Record<string, any>
) {
  try {
    // 根据模板类型标识符获取对应的 Nunjucks 模板内容
    const template: string = getTemplate(type)

    // 配置 Nunjucks 环境，关闭自动转义以支持生成代码等原始内容
    nunjucks.configure({
      autoescape: false,
    })

    // 渲染模板字符串，并将结果写入目标文件
    writeFile(output, fileName, nunjucks.renderString(template, params))
  } catch (error) {
    // 输出详细的错误日志，包含上下文信息便于问题排查
    console.error('[GenSDK] file gen fail:', fileName, 'type:', type)

    // 重新抛出错误，确保调用方能够捕获并处理该异常
    throw error
  }
}
