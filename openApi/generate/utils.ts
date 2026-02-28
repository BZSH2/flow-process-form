import fs from 'fs'
import path from 'path'
import ReservedDict from 'reserved-words'
import * as prettier from 'prettier'
import  pinyin from '../../src/utils/pinyin'

/** 写入文件 格式化 配置 */
const prettierConfig: prettier.Options = {
  tabWidth: 2,
  semi: false,
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'es5',
  quoteProps: 'consistent',
  htmlWhitespaceSensitivity: 'strict',
  vueIndentScriptAndStyle: false,
  bracketSameLine: false,
  arrowParens: 'avoid',
  stylelintIntegration: true,
  parser: 'typescript',
}

// 判断文件夹是否存在 不存在则创建
export function generatorFolder(output: string) {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
  }
}

/**
 * 解析并规范化类型名称
 * 主要用于处理从后端接口获取的原始模型名，将其转换为合法且可读的 TypeScript 类型名称
 * 处理规则包括：JavaScript 关键字转义、数字开头处理、中文字符转拼音等
 *
 * @param name - 待处理的原始类型名称字符串
 * @returns 处理后的合法类型名称字符串
 */
export function resolveTypeName(name: string) {
  // 判断是否为 JavaScript 关键字，是则添加前缀避免冲突
  if (ReservedDict.check(name)) { return `__openAPI__${name}` }

  // 处理以下划线开头或纯数字的名称（常见于中文模型名的错误转换）
  if (name === '_' || /^\d$/.test(name)) {
    console.log('⚠️  models 不能以数字开头，原因可能是 Model 定义名称为中文，建议联系后台修改')
    return `Pinyin_${name}`
  }

  // 如果名称不包含中文字符且不是纯数字，则直接返回原名称
  if (!/[\u3220-\uFA29]/.test(name) && !/^\d$/.test(name)) {
    return name.replace(/[^a-zA-Z0-9_$]/g, '_')
  }

  // 处理包含中文字符的情况：移除所有空格后转换为拼音（采用驼峰风格）
  // 同时也替换掉可能的非法字符
  return pinyin(name.replace(/\s/g, '').replace(/[^a-zA-Z0-9_$\u3220-\uFA29]/g, '_'), { style: 'name' })
}

/**
 * 使用 Prettier 格式化代码字符串
 * @param content - 待格式化的原始代码字符串
 * @returns 返回一个 Promise，解析为包含两个元素的元组：
 *          - 第一个元素（string）：格式化后的代码字符串；若格式化失败，则返回原始内容
 *          - 第二个元素（boolean）：是否在格式化过程中发生错误（true 表示出错）
 */
export async function prettierFile(content: string): Promise<[string, boolean]> {
  let result = content
  let hasError = false
  try {
    result = await prettier.format(content, prettierConfig)
  } catch (error) {
    console.error(`prettierFile error:${error}`)
    hasError = true
  }
  return [result, hasError]
}

/**
 * 将内容写入指定文件
 * 此函数用于在指定的文件夹路径下创建（或覆盖）一个文件，并将给定的内容写入该文件。
 * 如果目标文件夹路径不存在，函数会自动创建该路径下的所有目录。
 * @param folderPath - 目标文件夹的路径（可以是相对路径或绝对路径）
 * @param fileName - 要创建的文件名（包含扩展名，如 "example.txt"）
 * @param content - 要写入文件的字符串内容
 * @example
 * 将 "Hello World" 写入 ./output 目录下的 example.txt 文件
 * await writeFile('./output', 'example.txt', 'Hello World')
 * @throws 如果文件写入过程中发生错误（如磁盘空间不足、权限问题等），会抛出异常
 */
export async function writeFile(folderPath: string, fileName: string, content: string) {

  const filePath = path.join(folderPath, fileName)
  // 确保文件所在的目录结构存在
  generatorFolder(path.dirname(filePath))
  const [prettierContent, hasError] = await prettierFile(content)
  fs.writeFileSync(filePath, prettierContent, {
    encoding: 'utf8',
  })
  return hasError
}

/**
 * 检查是否为 OpenAPI 3.0.1 基本规范
 * @param obj - 待检查的对象，通常是 OpenAPI 3.0.1 规范的 JSON 数据
 * @returns 如果符合 OpenAPI 3.0.1 基本规范，返回 true；否则返回 false
 */
export function isOpenAPI(obj: any): boolean {
  if (!obj || typeof obj !== 'object') {return false;}

  // 1. 检查 openapi 版本
  if (!obj.openapi) {
    return false; // OpenAPI 3.0.1 的版本号是 3.0.1
  }

  // 2. 检查 info 对象
  if (!obj.info || typeof obj.info !== 'object') {
    return false;
  }

  // info 必须包含 title 和 version
  if (!obj.info.title || typeof obj.info.title !== 'string') {
    return false;
  }

  if (!obj.info.version || typeof obj.info.version !== 'string') {
    return false;
  }

  // 3. 检查 paths
  if (!obj.paths || typeof obj.paths !== 'object') {
    return false;
  }

  return true;
}
