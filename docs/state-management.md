# 统一状态管理机制

## 目标

统一全局状态管理方式，避免状态分散、重复持久化和跨模块行为不一致。

## 当前方案

- 状态库：`zustand`
- 入口导出：`src/store/index.ts`
- 模块：
  - `language`：语言状态与 i18n 同步
  - `theme`：主题状态与本地持久化

## 设计约定

- 每个状态模块只暴露最小必要的 state 和 action。
- action 内先做幂等判断，状态未变化时直接返回。
- 持久化策略按模块区分，避免一刀切：
  - `language`：业务手动写入 `LANGUAGESTORAGE`
  - `theme`：使用 `persist` 中间件持久化 `mode`
- 跨系统副作用（如 `i18n.changeLanguage`）统一放在对应 action 内执行。

## 使用方式

```ts
import { useLang, useTheme } from '@/store'
```

- 语言切换：`useLang().changeLanguage('en-US')`
- 主题切换：`useTheme().toggleTheme()`

## 扩展流程

1. 在 `src/store/modules` 新建模块。
2. 定义 `State` 类型与 `createSlice`。
3. 如需持久化，明确 `partialize` 和 `merge` 策略。
4. 在 `src/store/index.ts` 统一导出。
5. 更新根目录 `README.md` 文档导航。
