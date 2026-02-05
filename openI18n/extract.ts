import fs from 'fs'
import path from 'path'
import { parse } from '@vue/compiler-sfc'
import * as glob from 'glob'

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
      this.extractFromScript(descriptor.script.content, filePath)
    }

    // 提取SFC自定义块
    if (descriptor.customBlocks) {
      descriptor.customBlocks.forEach(block => {
        if (block.type === 'i18n') {
          this.extractFromCustomBlock(block.content, filePath)
        }
      })
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
  generateLangFile(lang: string, outputDir: string) {
    const langData: Record<string, any> = {}

    this.keys.forEach(({ key }) => {
      const keys = key.split('.')
      let current = langData

      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          current[k] = key // 可以改为从翻译服务获取
        } else {
          if (!current[k]) {current[k] = {}}
          current = current[k]
        }
      })
    })

    const outputPath = path.join(outputDir, `${lang}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(langData, null, 2), 'utf-8')
  }
}
