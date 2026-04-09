# flow-process-form

基于 **React + TypeScript + Vite** 的流程表单前端项目。

## 文档导航

- [自动国际化（openI18n）](./docs/auto-i18n.md)
- [自动发布（CI/CD）](./docs/ci-cd.md)
- [Lint 规则与自动修复](./docs/lint-and-auto-fix.md)
- [代码样式规范](./docs/code-style.md)
- [企业工程规范](./docs/engineering-standards.md)
- [统一状态管理机制](./docs/state-management.md)
- [阿里云 ECS 部署明细](./docs/deploy-aliyun-ecs.md)

## 快速开始

```bash
pnpm install
pnpm dev
```

## 质量检查

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## 环境变量

- 前端变量示例：`.env.example`
- 自动国际化变量：`.env.i18n`

## 补充说明

- 提交前会由 `husky + lint-staged` 执行增量质量检查。
- 自动发布、Lint 规则、代码样式、工程规范均已拆分到 docs 专题文档。
