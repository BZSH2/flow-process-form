# 自动国际化（openI18n）

## 目标

通过 `pnpm openI18n` 自动提取项目中的 `t('key')`，并输出多语言文件到 `public/locales`。

## 命令

```bash
pnpm openI18n
```

## 流程

1. 扫描 `src` 下的 `t(...)` 与 `$t(...)` 调用，提取翻译 key。
2. 读取 `src/config/lang.config.ts` 的 `languages` 作为语言来源。
3. 默认语言（`defaultLanguage`）直接写入 `key -> key`。
4. 其他语言调用百度通用翻译 API 批量翻译。
5. 输出到 `public/locales/{语言code}.json`。

## 环境变量

文件：`.env.i18n`

```env
BAIDU_TRANSLATE_APPID=
BAIDU_TRANSLATE_APPKEY=
BAIDU_TRANSLATE_FROM=zh
```

## 常见报错

- `52003 UNAUTHORIZED USER`：`APPID` / `APPKEY` 错误，或服务未开通。
- `54003 Invalid Access Limit`：调用频率受限，稍后重试。

## 注意

- `APPID` 与 `APPKEY` 需要你自己到百度翻译开放平台注册并开通通用翻译 API 后获取。
- 不要把真实密钥提交到仓库。
