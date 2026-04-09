import { createHash, randomUUID } from 'node:crypto'

export type BaiduTranslateItem = {
  src: string
  dst: string
}

type BaiduTranslateSuccess = {
  from: string
  to: string
  trans_result: BaiduTranslateItem[]
}

type BaiduTranslateError = {
  error_code: string
  error_msg: string
}

type TranslateOptions = {
  from?: string
  to?: string
}

const BAIDU_TRANSLATE_ENDPOINT = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
const MAX_RETRY_TIMES = 3
const RETRY_DELAY_MS = 1200

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function createRequestBody(
  q: string,
  from: string,
  to: string,
  appid: string,
  appkey: string
): URLSearchParams {
  const salt = randomUUID().replaceAll('-', '')
  const sign = createHash('md5')
    .update(`${appid}${q}${salt}${appkey}`)
    .digest('hex')
  return new URLSearchParams({
    q,
    from,
    to,
    appid,
    salt,
    sign,
  })
}

function isErrorResponse(data: BaiduTranslateSuccess | BaiduTranslateError): data is BaiduTranslateError {
  return 'error_code' in data
}

// 百度 54003 为限流，短暂等待后重试；52003 为鉴权失败，直接抛出明确提示。
function buildErrorMessage(data: BaiduTranslateError): string {
  if (data.error_code === '52003') {
    return 'Baidu Translate Error 52003: UNAUTHORIZED USER（请检查 BAIDU_TRANSLATE_APPID / BAIDU_TRANSLATE_APPKEY，且确认已开通通用翻译 API）'
  }
  return `Baidu Translate Error ${data.error_code}: ${data.error_msg}`
}

// 单次翻译请求只负责请求与解析，不做重试控制，便于主流程复用。
async function requestTranslate(
  q: string,
  from: string,
  to: string,
  appid: string,
  appkey: string
): Promise<BaiduTranslateSuccess | BaiduTranslateError> {
  const body = createRequestBody(q, from, to, appid, appkey)
  const response = await fetch(BAIDU_TRANSLATE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  return (await response.json()) as BaiduTranslateSuccess | BaiduTranslateError
}

export default async function translateWithBaidu(keys: string[], options: TranslateOptions = {}) {
  if (!keys.length) {
    return [] as BaiduTranslateItem[]
  }
  const appid = process.env.BAIDU_TRANSLATE_APPID || ''
  const appkey = process.env.BAIDU_TRANSLATE_APPKEY || ''
  const from = options.from || process.env.BAIDU_TRANSLATE_FROM || 'auto'
  const to = options.to || process.env.BAIDU_TRANSLATE_TO || 'en'

  if (!appid || !appkey) {
    process.stdout.write('⚠️ 未检测到 BAIDU_TRANSLATE_APPID / BAIDU_TRANSLATE_APPKEY，跳过翻译请求。\n')
    return []
  }

  const q = keys.join('\n')
  for (let retryCount = 0; retryCount < MAX_RETRY_TIMES; retryCount += 1) {
    const data = await requestTranslate(q, from, to, appid, appkey)
    if (!isErrorResponse(data)) {
      return data.trans_result
    }
    if (data.error_code !== '54003' || retryCount >= MAX_RETRY_TIMES - 1) {
      throw new Error(buildErrorMessage(data))
    }
    await sleep(RETRY_DELAY_MS)
  }

  return []
}
