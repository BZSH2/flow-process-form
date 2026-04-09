import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import collectTranslationKeys from './collectTranslationKeys'
import translateWithBaidu from './translateWithBaidu'
import { defaultLanguage, languages } from '../../src/config/lang.config'

type LocaleDictionary = Record<string, string>
type LanguageItem = (typeof languages)[number]
const localesDirectory = join(process.cwd(), 'public', 'locales')

// 默认语言包直接使用 key 本身作为文案，保证无翻译服务时也可完整生成。
function buildDefaultLocale(keys: string[]): LocaleDictionary {
  return Object.fromEntries(keys.map((key) => [key, key] as const))
}

// 翻译语言包按 src->dst 回填，缺失翻译时兜底 key，避免产生空值。
function buildTranslatedLocale(keys: string[], translated: { src: string; dst: string }[]): LocaleDictionary {
  const translatedMap = new Map(translated.map((item) => [item.src, item.dst]))
  return Object.fromEntries(keys.map((key) => [key, translatedMap.get(key) ?? key] as const))
}

function resolveSourceTranslateCode(): string {
  const sourceLanguage = languages.find((item) => item.code === defaultLanguage)
  return sourceLanguage?.translateCode || process.env.BAIDU_TRANSLATE_FROM || 'auto'
}

function resolveTargetTranslateCode(language: LanguageItem): string {
  return language.translateCode || language.detectCode
}

function writeLocaleFile(languageCode: string, localeDictionary: LocaleDictionary) {
  const filePath = join(localesDirectory, `${languageCode}.json`)
  writeFileSync(filePath, JSON.stringify(localeDictionary, null, 2))
  process.stdout.write(`📄 已输出：public/locales/${languageCode}.json\n`)
}

// 逐语言生成：默认语言直接回写 key，其它语言调用翻译接口后落盘。
async function generateLocaleFile(keys: string[], language: LanguageItem, sourceTranslateCode: string) {
  if (language.code === defaultLanguage) {
    writeLocaleFile(language.code, buildDefaultLocale(keys))
    return
  }

  const translated = await translateWithBaidu(keys, {
    from: sourceTranslateCode,
    to: resolveTargetTranslateCode(language),
  })
  writeLocaleFile(language.code, buildTranslatedLocale(keys, translated))
}

async function main() {
  const { keys } = collectTranslationKeys()
  process.stdout.write(`🌐 开始生成多语言文件...\n🔎 已识别翻译 key：${keys.length} 条\n`)
  mkdirSync(localesDirectory, {
    recursive: true,
  })
  const sourceTranslateCode = resolveSourceTranslateCode()
  for (const language of languages) {
    await generateLocaleFile(keys, language, sourceTranslateCode)
  }
  process.stdout.write(`✅ 已完成 ${languages.length} 个语言文件输出\n`)
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`❌ 生成失败：${message}\n`)
  process.exitCode = 1
})
