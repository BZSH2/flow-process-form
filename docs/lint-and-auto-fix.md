# Lint 规则与自动修复

## 目标

统一代码质量校验入口，确保在提交前自动发现并修复可修复问题。

## 命令

```bash
pnpm lint
pnpm lint:eslint
pnpm lint:stylelint
pnpm format
pnpm format:check
pnpm typecheck
```

## 执行顺序

1. `pnpm format`：先做格式统一。
2. `pnpm lint`：检查 ESLint 与 Stylelint 规则。
3. `pnpm typecheck`：做 TypeScript 类型检查。
4. `pnpm build`：上线前做一次完整构建验证。

## 常见处理

- ESLint 问题优先修代码逻辑，不建议通过关闭规则规避。
- 样式问题优先使用 `pnpm format` 与 `pnpm lint:stylelint` 修复。
- TypeScript 报错优先补类型，不建议使用 `any` 兜底。

## 注意

- 仓库已配置 `husky + lint-staged`，`git commit` 时会执行增量检查。
