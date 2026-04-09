declare namespace Language {
  interface Status {
    /** BCP 47 语言代码，例如 zh-CN、en-US */
    code: string
    /** 英文名或通用名，用于后台配置与日志 */
    name: string
    /** 本地化展示名，例如 简体中文、日本語 */
    nativeName?: string
    /** 国家或地区信息，例如 China、Japan */
    region?: string
    /** 旗帜 Emoji 或自定义图标标识 */
    flag?: string
    /** antd 对应 locale 标识，例如 zhCN、enUS */
    antCode?: string
    /** 翻译服务使用的语言代码，例如 zh-Hans、en */
    translateCode?: string
    /** 浏览器语言简写映射代码，例如 zh、en */
    detectCode: string
  }
}
