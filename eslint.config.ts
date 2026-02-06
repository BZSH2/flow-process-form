import pluginVue from 'eslint-plugin-vue'
import unocss from '@unocss/eslint-config/flat'
import vueParser from 'vue-eslint-parser'
import { defineConfig, globalIgnores } from 'eslint/config'
import pluginJsonc from 'eslint-plugin-jsonc'
import jsoncParser from 'jsonc-eslint-parser'
import typeScriptParser from '@typescript-eslint/parser'


export default defineConfig([
  unocss as any,
  // ...pluginJsonc.configs['flat/recommended-with-jsonc'],
  // ...pluginVue.configs['flat/recommended'],
  // Package.json 专用配置
  {
    files: ['**/package.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    name: 'jsonc/package-json',
    plugins: {
      jsonc: pluginJsonc as any,
    },
    rules: {
      'jsonc/sort-array-values': [
        'error',
        {
          order: { type: 'asc' },
          pathPattern: '^files$',
        },
      ],
      'jsonc/sort-keys': [
        'error',
        {
          order: [
            'publisher',
            'name',
            'displayName',
            'type',
            'version',
            'private',
            'packageManager',
            'description',
            'author',
            'contributors',
            'license',
            'funding',
            'homepage',
            'repository',
            'bugs',
            'keywords',
            'categories',
            'sideEffects',
            'imports',
            'exports',
            'main',
            'module',
            'unpkg',
            'jsdelivr',
            'types',
            'typesVersions',
            'bin',
            'icon',
            'files',
            'engines',
            'activationEvents',
            'contributes',
            'scripts',
            'peerDependencies',
            'peerDependenciesMeta',
            'dependencies',
            'optionalDependencies',
            'devDependencies',
            'pnpm',
            'overrides',
            'resolutions',
            'husky',
            'simple-git-hooks',
            'lint-staged',
            'eslintConfig',
          ],
          pathPattern: '^$',
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$',
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(?:resolutions|overrides|pnpm.overrides)$',
        },
        {
          order: ['types', 'import', 'require', 'default'],
          pathPattern: '^exports.*$',
        },
        {
          order: [
            'pre-commit',
            'prepare-commit-msg',
            'commit-msg',
            'post-commit',
            'pre-rebase',
            'post-rewrite',
            'post-checkout',
            'post-merge',
            'pre-push',
            'pre-auto-gc',
          ],
          pathPattern: '^(?:gitHooks|husky|simple-git-hooks)$',
        },
      ],
    },
  },
  // Vue 和 JavaScript 配置
  {
    files: ['**/*.vue', '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    name: 'vue/javascript',
    plugins: {
      vue: pluginVue,
    },
    rules: {
      'no-console': 'off',
      'max-lines-per-function': ['warn', {
        max: 60,           // 增加到60行
        skipComments: true, // 跳过注释行
        skipBlankLines: true // 跳过空行
      }],
      'vue/sort-keys': ['off'],
      'vue/v-on-event-hyphenation': [
        'error',
        'always',
        {
          autofix: true,
          ignore: [],
        },
      ],
      'vue/require-explicit-emits': ['error'],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: ['solt', 'micro-app'],
        },
      ],
      'vue/custom-event-name-casing': [
        'error',
        'kebab-case',
        {
          ignores: [],
        },
      ],
      'vue/no-unused-vars': [
        'error',
        {
          ignorePattern: '^_',
        },
      ],
      'vue/define-emits-declaration': ['error', 'type-literal'],
      'vue/next-tick-style': ['error', 'promise'],
      'vue/no-multiple-objects-in-class': ['error'],
      'vue/no-ref-object-reactivity-loss': ['error'],
      'vue/no-use-v-else-with-v-for': ['error'],
      'vue/require-explicit-slots': ['error'],
      'vue/require-macro-variable-name': [
        'error',
        {
          defineProps: 'props',
          defineEmits: 'emit',
          defineSlots: 'slots',
          useSlots: 'slots',
          useAttrs: 'attrs',
        },
      ],
      'vue/require-typed-ref': ['error'],
      'vue/return-in-computed-property': ['off'],
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],
      'vue/array-bracket-spacing': ['error', 'never'],
      'vue/arrow-spacing': ['error', { after: true, before: true }],
      'vue/block-spacing': ['error', 'always'],
      'vue/block-tag-newline': [
        'error',
        {
          multiline: 'always',
          singleline: 'always',
        },
      ],
      'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
      'vue/comma-dangle': ['error', 'always-multiline'],
      'vue/comma-spacing': ['error', { after: true, before: false }],
      'vue/comma-style': ['error', 'last'],
      'vue/html-comment-content-spacing': [
        'error',
        'always',
        {
          exceptions: ['-'],
        },
      ],
      'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
      'vue/keyword-spacing': ['error', { after: true, before: true }],
      'vue/object-curly-newline': 'off',
      'vue/object-curly-spacing': ['error', 'always'],
      'vue/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      'vue/operator-linebreak': ['error', 'before'],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/quote-props': ['error', 'consistent-as-needed'],
      'vue/space-in-parens': ['error', 'never'],
      'vue/template-curly-spacing': 'error',
      'vue/component-options-name-casing': ['error', 'PascalCase'],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        },
      ],
      'vue/dot-location': ['error', 'property'],
      'vue/dot-notation': ['error', { allowKeywords: true }],
      'vue/eqeqeq': ['error', 'smart'],
      'vue/html-indent': ['error', 2],
      'vue/html-quotes': ['error', 'double'],
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-dupe-keys': 'off',
      'vue/no-empty-pattern': 'error',
      'vue/no-irregular-whitespace': 'error',
      'vue/no-loss-of-precision': 'error',
      'vue/no-restricted-syntax': [
        'error',
        'DebuggerStatement',
        'LabeledStatement',
        'WithStatement',
      ],
      'vue/no-restricted-v-bind': ['error', '/^v-/'],
      'vue/no-setup-props-reactivity-loss': 'off',
      'vue/no-sparse-arrays': 'error',
      'vue/no-unused-refs': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/no-v-html': 'off',
      'vue/object-shorthand': [
        'error',
        'always',
        {
          avoidQuotes: true,
          ignoreConstructors: false,
        },
      ],
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-template': 'error',
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
      'vue/space-infix-ops': 'error',
      'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
    },
    languageOptions: {
      parser: vueParser,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.vue'],
        parser: typeScriptParser,
        sourceType: 'module',
      },
    },
  },
  globalIgnores([
    'dist/*',
    'node_modules/*',
    '**/src/assets/*',
    '**/src/api/*',
    '**/public/*',
    '**/src/plugins/vxeTable/*',
    '**/ylwiconfont/*',
    '**/auto-imports.d.ts',
    '**/components.d.ts',
  ]),
])
