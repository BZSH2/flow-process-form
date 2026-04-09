import js from '@eslint/js'
import globals from 'globals'
import jsoncParser from 'jsonc-eslint-parser'
import pluginImport from 'eslint-plugin-import'
import pluginJsonc from 'eslint-plugin-jsonc'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import { readFileSync } from 'node:fs'

const eslintIgnores = JSON.parse(
  readFileSync(new URL('./.eslintignore.json', import.meta.url), 'utf-8')
)

export default defineConfig([
  globalIgnores(eslintIgnores),
  {
    files: ['**/package.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      jsonc: pluginJsonc,
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
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.disableTypeChecked,
      pluginImport.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parser: tseslint.parser,
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
      'import/no-default-export': 'off',
      'import/no-named-as-default': 'off',
      'import/no-unresolved': 'off',
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      pluginImport.flatConfigs.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        Icon: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-undef': ['error', { allowGlobals: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'import/no-unresolved': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.config.ts', 'uno.config.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.disableTypeChecked,
      pluginImport.flatConfigs.recommended,
      pluginImport.flatConfigs.typescript,
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parser: tseslint.parser,
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
      'import/no-unresolved': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.config.ts', 'uno.config.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended, // 回退到基础推荐配置
      pluginImport.flatConfigs.recommended,
      pluginImport.flatConfigs.typescript,
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        Icon: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn', // 放宽到 warn
      'object-shorthand': ['warn', 'always'], // 放宽到 warn
      'import/no-unresolved': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn', // 放宽到 warn
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'off', // 允许 any
      '@typescript-eslint/no-floating-promises': 'off', // 允许不加 void 的 promise
      '@typescript-eslint/no-misused-promises': 'off', // 允许各种 promise 使用场景
      '@typescript-eslint/no-non-null-assertion': 'off', // 允许 ! 断言
      '@typescript-eslint/ban-ts-comment': 'off', // 允许 @ts-ignore
      '@typescript-eslint/no-unsafe-assignment': 'off', // 允许不安全的赋值
      '@typescript-eslint/no-unsafe-member-access': 'off', // 允许不安全的成员访问
      '@typescript-eslint/no-unsafe-return': 'off', // 允许不安全的返回
      '@typescript-eslint/no-unsafe-argument': 'off', // 允许不安全的传参
      '@typescript-eslint/no-unsafe-call': 'off', // 允许不安全的调用
      '@typescript-eslint/restrict-template-expressions': 'off', // 允许模板字符串任意类型
      '@typescript-eslint/no-unused-vars': [
        'warn', // 未使用变量放宽为 warn
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
])
