import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

type MatchFunction = 't' | '$t'

type TranslationMatch = {
  key: string
  fn: MatchFunction
  filePath: string
}

type TranslationScanConfig = {
  targetDirectories: string[]
  targetFunctions: MatchFunction[]
  scanExtensions: string[]
  ignoredDirectories: string[]
}

// 翻译提取默认配置：
// - 只扫描 src 目录
// - 默认识别 t('...') 与 $t('...')
// - 仅匹配字符串字面量参数，动态表达式（如 t(foo)）不会被收集
const defaultScanConfig: TranslationScanConfig = {
  targetDirectories: ['src'],
  targetFunctions: ['t', '$t'],
  scanExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  ignoredDirectories: ['node_modules', 'dist', '.git', '.idea', '.vscode'],
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function stripComments(content: string): string {
  return content.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')
}

// 递归收集目标目录下可扫描文件：
// - 跳过 ignoredDirectories 中声明的目录
// - 仅保留 scanExtensions 中声明的文件后缀
function collectFiles(directoryPath: string, config: TranslationScanConfig): string[] {
  const entries = readdirSync(directoryPath)
  const files: string[] = []

  for (const entry of entries) {
    if (config.ignoredDirectories.includes(entry)) {
      continue
    }

    const fullPath = join(directoryPath, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...collectFiles(fullPath, config))
      continue
    }

    if (!config.scanExtensions.includes(extname(fullPath))) {
      continue
    }

    files.push(fullPath)
  }

  return files
}

// 从单文件中提取翻译调用：
// - 支持单引号、双引号、模板字符串字面量
// - 函数名由 targetFunctions 动态控制，便于扩展
function extractFromFile(filePath: string, config: TranslationScanConfig): TranslationMatch[] {
  const content = stripComments(readFileSync(filePath, 'utf8'))
  const matches: TranslationMatch[] = []
  const fnPattern = config.targetFunctions.map((fn) => escapeRegExp(fn)).join('|')
  const pattern = new RegExp(
    `(?:^|[^\\w$])(${fnPattern})\\s*\\(\\s*(['"\`])((?:\\\\.|(?!\\2)[\\s\\S])*?)\\2`,
    'gm'
  )

  let result = pattern.exec(content)
  while (result) {
    const fn = result[1] as MatchFunction
    const key = result[3]

    if (key.trim()) {
      matches.push({
        key,
        fn,
        filePath,
      })
    }

    result = pattern.exec(content)
  }

  return matches
}

// 扫描入口：
// - projectRootPath: 项目根目录，默认当前进程目录
// - partialConfig: 用于覆盖默认扫描策略
// 返回去重后的 keys、命中详情 matches 与最终生效配置 config
export default function collectTranslationKeys(
  projectRootPath: string = process.cwd(),
  partialConfig: Partial<TranslationScanConfig> = {}
) {
  const config: TranslationScanConfig = {
    ...defaultScanConfig,
    ...partialConfig,
  }

  const targetRootDirectories = config.targetDirectories
    .map((directory) => join(projectRootPath, directory))
    .filter((directory) => existsSync(directory))
  const files = targetRootDirectories.flatMap((directory) => collectFiles(directory, config))
  const allMatches = files.flatMap((filePath) => extractFromFile(filePath, config))
  const keys = [...new Set(allMatches.map((item) => item.key))].sort((a, b) => a.localeCompare(b))

  return {
    keys,
    matches: allMatches,
    config,
  }
}
