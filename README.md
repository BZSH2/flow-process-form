# flow-process-form

基于 **React + TypeScript + Vite** 的流程表单前端项目。

## 本地开发

```bash
pnpm install
pnpm dev
```

## 本地质量检查

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## 提交前约束

当前仓库已经通过 **husky + lint-staged** 在 `commit` 阶段执行格式化与增量 lint。

因此生产部署用的 GitHub Actions **不再重复跑 lint**，CI 侧只负责：

1. 构建 Docker 镜像
2. 上传镜像归档到阿里云 ECS
3. 在服务器上用 `docker compose` 拉起新版本

## 自动发布到阿里云 ECS

当前仓库已切到和 `next-admin` 一致的 **Docker 化部署风格**：

- GitHub Actions 本地构建 Docker 镜像
- 上传镜像归档到阿里云 ECS
- ECS 上用 `docker-compose.prod.yml` 启动容器
- 外层 Caddy 反代到容器端口

### 已集成内容

- 工作流：`.github/workflows/deploy-aliyun-ecs.yml`
- Docker 镜像构建：`Dockerfile`
- 生产编排：`docker-compose.prod.yml`
- 服务器部署脚本：`.github/deploy/deploy.sh`
- 容器内静态站配置：`deploy/nginx.conf`
- 外层 Caddy 反代模板：`deploy/Caddyfile.example`
- 部署说明：`docs/deploy-aliyun-ecs.md`

### GitHub 需要配置的 Secrets

仓库 `Settings -> Secrets and variables -> Actions`：

**Secrets**

- `ALIYUN_ECS_HOST`
- `ALIYUN_ECS_USER`
- `ALIYUN_ECS_SSH_KEY`

**Variables**

- `ALIYUN_ECS_PORT`（默认 `22`）
- `ALIYUN_DEPLOY_PATH`（默认 `/opt/flow-process-form`）
- `ALIYUN_HOST_PORT`（默认 `25002`）
- `ALIYUN_CONTAINER_NAME`（默认 `flow-process-form`）
- `ALIYUN_APP_DOMAIN`（默认 `process.bzsh.fun`）

### 更多部署细节

详见：

- `docs/deploy-aliyun-ecs.md`

## 环境变量

示例文件：`.env.example`

当前已预留：

- `VITE_APP_BASE`
- `VITE_API_BASE_URL`

## 注意事项

当前已在 `.gitignore` 中忽略 `.env` 相关文件。若仓库里已有被 Git 跟踪的 `.env`，建议移出版本控制：

```bash
git rm --cached .env
```
