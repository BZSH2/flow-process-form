#!/usr/bin/env node

import { I18nExtractor } from './extract.js'
import fs from 'fs'
import path from 'path'

const extractor = new I18nExtractor()
const keys = extractor.scanVueFiles()

console.log(`找到 ${keys.length} 个国际化键值`)

// 生成示例语言文件
const localesDir = path.resolve('./src/i18n/lang')
const languages = ['zh-CN', 'en', 'ja']

languages.forEach(lang => {
  const langDir = path.join(localesDir)
  // if (!fs.existsSync(langDir)) {
  //   fs.mkdirSync(langDir, { recursive: true })
  // }
  extractor.generateLangFile(lang, langDir)
})

console.log('语言文件已生成！')
