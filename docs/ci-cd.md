# 自动发布（CI/CD）

## 目标

当代码推送到主分支后，自动构建并部署到阿里云 ECS。

## 流程

1. GitHub Actions 执行工作流：`.github/workflows/deploy-aliyun-ecs.yml`
2. 构建 Docker 镜像（`Dockerfile`）
3. 上传镜像归档到 ECS
4. ECS 执行部署脚本：`.github/deploy/deploy.sh`
5. 使用 `docker-compose.prod.yml` 拉起新版本
6. 由 Caddy/Nginx 对外提供服务

## 必要配置

仓库设置路径：`Settings -> Secrets and variables -> Actions`

### Secrets

- `ALIYUN_ECS_HOST`
- `ALIYUN_ECS_USER`
- `ALIYUN_ECS_SSH_KEY`

### Variables

- `ALIYUN_ECS_PORT`
- `ALIYUN_DEPLOY_PATH`
- `ALIYUN_HOST_PORT`
- `ALIYUN_CONTAINER_NAME`
- `ALIYUN_APP_DOMAIN`

## 关联

- [阿里云 ECS 部署明细](./deploy-aliyun-ecs.md)
