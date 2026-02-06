#!/usr/bin/env node
import { I18nExtractor } from './extract.js'
import fs from 'fs'
import path from 'path'
import { languages } from '../src/config/index.ts'

const extractor = new I18nExtractor()
const keys = extractor.scanVueFiles()

console.log(`找到 ${keys.length} 个国际化键值`)

// 生成示例语言文件
const localesDir = path.resolve('./src/i18n/lang')

const generate = async () => {
  // 删除旧文件
  try {
    await fs.promises.rm(localesDir, { recursive: true, force: true});
  } catch (err) {
    console.error('删除失败:', err);
  }
  for (const lang of languages) {
    const langDir = path.join(localesDir)
    await extractor.generateLangFile(lang, langDir)
  }
  console.log('语言文件已生成！')
}

generate()
