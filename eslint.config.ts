import antfu from '@antfu/eslint-config'

export default antfu({
  // 1. 基本配置
  type: 'lib', // 表示当前项目是一个库（library），而不是应用（app）
  // 2. 代码风格配置（Stylistic）
  // stylistic: true,
  // 或者你可以更加细粒度的设置
  stylistic: {
    indent: 2, // 缩进 2 个空格, 2 | 4 | 'tab'
    quotes: 'single', // 使用双引号, single | 'double'
    semi: true, // 强制分号结尾, true | false
    // braceStyle: "1tbs", // 大括号换行风格（One True Brace Style）
    // commaDangle: "never", // 禁止尾随逗号
    jsx: true, // 支持 JSX 语法
    // blockSpacing: true, // 代码块内加空格，如 `function foo() {}`
    // multilineComments: true, // 多行注释风格
    // preferArrowFunctions: true, // 优先使用箭头函数

    // spaceBeforeFunctionParen: "always", // 函数名和参数括号间加空格
    // spaceInParens: "never", // 括号内不加空格
    // spacesInAngles: true, // 尖括号内加空格
    // computedPropertySpacing: true, // 计算属性方括号内加空格
    // restSpreadSpacing: true, // Rest/Spread 操作符周围加空格
  },
  // 3. 格式化工具
  formatters: true, // 使用外部格式化工具（如 Prettier）

  // 4. 支持的语言特性
  typescript: true, // 启用 TypeScript 支持

  vue: {
    // Vue 文件的规则
    overrides: {
      // 强制 Vue 文件的顺序为 <template> -> <script> -> <style>
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
    },
  },

  // 5. 规则覆盖（Rules）
  /**
   * 规则 https://www.wenjiangs.com/docs/eslint，vue规则：https://eslint.vuejs.org/rules/
   * 主要有如下的设置规则，可以设置字符串也可以设置数字，两者效果一致
   * 'off' 或 0 - 关闭规则
   * 'warn' 或 1 - 开启警告规则，使用警告级别的错误：warn (不会导致程序退出),
   * 'error' 或 2 - 开启错误规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  rules: {
    'no-console': 'off', // 允许 console
    // "no-debugger": "off", // 允许 debugger
    'prefer-arrow-callback': 'off', // 允许传统函数回调
    // "func-style": "off", // 允许非箭头函数
    // "@typescript-eslint/prefer-function-declarations": "off", // 关闭顶级函数必须用 function 声明的规则
  },

  // 6. 忽略文件（Ignores）
  // 9x版本 忽略文件这种配置方式 废弃掉eslintignore
  // 【注意：ignores 是 @antfu/eslint-config 的配置方式，替代了传统的 .eslintignore 文件】
  ignores: [
    '*.sh',
    'node_modules',
    '*.md',
    '*.woff',
    '*.ttf',
    '.vscode',
    '.idea',
    '/public',
    '/docs',
    '.husky',
    '.local',
    '/bin',
    'Dockerfile',
    '/dist',
    '/src/libs',
    'src/mock',
    '*.min.js',
    '/*.json',
  ],
  // 7. 其他配置
  // 关闭对 JSON 和 YAML 的支持
  jsonc: false, // 关闭 JSON 支持
  yaml: false, // 关闭 YAML 支持
  // isInEditor: false, // 保存删除未引入的代码
  // unocss: true, // unocss 检测&格式化 暂时注释 等配置了unocss再开放为true
})
