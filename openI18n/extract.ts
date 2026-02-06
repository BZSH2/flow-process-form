import fs from 'fs'
import path from 'path'
import { parse } from '@vue/compiler-sfc'
import * as glob from 'glob'
import { translate } from 'google-translate-api-x'

interface I18nKey {
  key: string
  value: string
  file: string
  line: number
}

export class I18nExtractor {
  private keys: Map<string, I18nKey> = new Map()
  private regex = {
    // 匹配 $t('key')
    functionCall: /\$t\(\s*['"]([^'"]+)['"]\s*\)/g,
    // 匹配 v-t="'key'"
    directive: /v-t="['"]([^'"]+)['"]/g,
    // 匹配 {{ $t('key') }}
    interpolation: /\{\{\s*\$t\(\s*['"]([^'"]+)['"]\s*\)\s*\}\}/g
  }

  // 扫描Vue文件
  scanVueFiles(pattern: string = 'src/**/*.vue'): I18nKey[] {
    const files = glob.sync(pattern)

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8')
      this.extractFromVueFile(content, file)
    })

    return Array.from(this.keys.values())
  }

  private extractFromVueFile(content: string, filePath: string) {
    const { descriptor } = parse(content)

    // 提取template
    if (descriptor.template?.content) {
      this.extractFromTemplate(descriptor.template.content, filePath)
    }

    // 提取script
    if (descriptor.script?.content) {
      // 暂时跳过 script 中的提取，后续如需实现可在此添加逻辑
      // this.extractFromScript(descriptor.script.content, filePath)
    }

    // 提取SFC自定义块
    if (descriptor.customBlocks) {
      // descriptor.customBlocks.forEach(block => {
      //   if (block.type === 'i18n') {
      //     this.extractFromCustomBlock(block.content, filePath)
      //   }
      // })
    }
  }

  private extractFromTemplate(content: string, filePath: string) {
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      // 匹配各种使用方式
      const matches = [
        ...line.matchAll(this.regex.functionCall),
        ...line.matchAll(this.regex.directive),
        ...line.matchAll(this.regex.interpolation)
      ]

      matches.forEach(match => {
        const key = match[1]
        if (key && !this.keys.has(key)) {
          this.keys.set(key, {
            key,
            value: key, // 初始值设为key本身
            file: filePath,
            line: index + 1
          })
        }
      })
    })
  }

  // 生成语言文件
  async generateLangFile(lang: string, outputDir: string) {
    // 1. 创建输出目录
    try {
      fs.mkdirSync(outputDir, { recursive: true })
    } catch (e) {
      console.error(`Error creating directory ${outputDir}:`, e)
    }

    const outputPath = path.join(outputDir, `${lang}.json`)
    let existingData: Record<string, any> = {}

    // 2. 构建新数据
    const newData: Record<string, any> = {}

    // 遍历所有key
    for (const { key } of this.keys.values()) {
      // 检查key是否已存在于现有翻译中
      if (this.hasKey(existingData, key)) {
        continue
      }

      const keys = key.split('.')
      let current = newData

      let translatedText = key
      // 尝试翻译
      try {
        // 如果不是中文环境，且key包含中文（简单判断），或者是英文环境...
        // 这里简单粗暴：只要是不存在的key，都尝试翻译
        // 注意：翻译服务可能需要时间，且有速率限制
        // 这里假设源语言是自动检测
        const res = await translate(key, { to: lang })
        translatedText = res.text
      } catch (e) {
        // 翻译失败降级为key
        // console.error(`Translation failed for ${key}:`, e)
      }

      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          current[k] = translatedText
        } else {
          if (!current[k]) {current[k] = {}}
          current = current[k]
        }
      })
    }

    // 合并数据（保留已有翻译）
    // 注意：这里我们将newData合并到existingData中，但deepMerge逻辑需要调整以确保newData（新翻译）被添加
    // 其实上面我们只收集了*不存在*的key到newData，所以直接合并即可
    const mergedData = this.deepMerge(existingData, newData)

    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), 'utf-8')
    console.log(`Generated ${lang} file at ${outputPath}`)
  }

  private hasKey(obj: any, key: string): boolean {
    const keys = key.split('.')
    let current = obj
    for (const k of keys) {
      if (current === undefined || current === null) {return false}
      current = current[k]
    }
    return current !== undefined
  }

  // 深度合并对象
  private deepMerge(target: any, source: any): any {
    if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
      return source
    }

    const result = { ...target }

    Object.keys(source).forEach(key => {
      if (key in target) {
        result[key] = this.deepMerge(target[key], source[key])
      } else {
        result[key] = source[key]
      }
    })

    return result
  }
}
