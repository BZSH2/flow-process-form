# flow-process-form · Docker 自动发布到阿里云 ECS

当前仓库已调整为和 `next-admin` 一致的 **Docker 化部署方式**：

- **GitHub Actions**：构建 Docker 镜像并导出镜像归档
- **阿里云 ECS**：接收镜像归档并通过 `docker compose` 启动容器
- **外层 Caddy**：反向代理 `process.bzsh.fun` 到容器端口

> 当前工作流：`.github/workflows/deploy-aliyun-ecs.yml`

---

## 一、当前部署结构

部署链路如下：

1. GitHub Actions 执行 `docker build`
2. 将镜像 `docker save | gzip` 导出为归档
3. 通过 `scp` 上传到 ECS
4. 服务器执行 `.github/deploy/deploy.sh`
5. `docker compose -f docker-compose.prod.yml up -d`
6. 外层 Caddy 将 `process.bzsh.fun` 转发到 `127.0.0.1:25002`

---

## 二、为什么 CI 不再跑 lint

当前仓库已经在 `commit` 阶段通过：

- `husky`
- `lint-staged`

做了提交前格式化和增量 lint。

因此部署工作流里不再重复执行 `pnpm lint`，避免发布链路重复消耗时间。部署 CI 只保留与上线直接相关的构建、上传、部署动作。

> 如果后面需要补更严格的门禁，建议单独拆一条质量工作流，而不是把 lint 混进生产发布流程。

---

## 三、GitHub Actions 触发规则

当前工作流会在以下情况自动触发：

- push 到 `main`
- push 到 `master`
- 手动触发 `workflow_dispatch`

并且只在部署相关文件或业务源码变更时触发自动发布。

---

## 四、GitHub 需要配置的 Secrets / Vars

进入仓库：`Settings -> Secrets and variables -> Actions`

### Secrets

- `ALIYUN_ECS_HOST`
  - 示例：`1.2.3.4`
- `ALIYUN_ECS_USER`
  - 示例：`root` 或部署用户
- `ALIYUN_ECS_SSH_KEY`
  - 私钥全文，建议使用单独部署 key

### Variables

- `ALIYUN_ECS_PORT`
  - 可选，默认 `22`
- `ALIYUN_DEPLOY_PATH`
  - 可选，默认 `/opt/flow-process-form`
- `ALIYUN_HOST_PORT`
  - 可选，默认 `25002`
- `ALIYUN_CONTAINER_NAME`
  - 可选，默认 `flow-process-form`
- `ALIYUN_APP_DOMAIN`
  - 可选，默认 `process.bzsh.fun`

---

## 五、服务器首次准备

确保 ECS 已安装：

- Docker
- Docker Compose Plugin（`docker compose`）

并准备部署目录：

```bash
mkdir -p /opt/flow-process-form
```

如果不是用 `root` 部署，记得保证部署用户对该目录有写权限。

---

## 六、外层 Caddy 配置

仓库里已提供模板：

- `deploy/Caddyfile.example`

当前推荐方式不是直接用 Caddy 读静态目录，而是：

- Caddy 对外接入 `process.bzsh.fun`
- Caddy 反代到容器端口 `127.0.0.1:25002`

示例：

```caddyfile
process.bzsh.fun {
  encode zstd gzip

  reverse_proxy 127.0.0.1:25002 {
    header_up Host {host}
    header_up X-Real-IP {remote_host}
    header_up X-Forwarded-For {remote_host}
    header_up X-Forwarded-Proto {scheme}
  }
}
```

改完后 reload Caddy。

---

## 七、容器内静态站行为

镜像构建完成后，容器内部由 Nginx 提供静态资源访问：

- 静态目录：`/usr/share/nginx/html`
- SPA 路由回退：`try_files $uri $uri/ /index.html`
- 健康检查：`/healthz`

对应配置文件：

- `deploy/nginx.conf`

---

## 八、推荐部署检查顺序

### 1. 推送代码到 `main` / `master`

GitHub Actions 会自动开始构建镜像并部署。

### 2. 服务器验证容器状态

```bash
docker ps | grep flow-process-form
docker compose -f /opt/flow-process-form/docker-compose.prod.yml ps
```

### 3. 本机端口验证

```bash
curl -I http://127.0.0.1:25002/healthz
curl -I http://127.0.0.1:25002/
```

### 4. 域名验证

重点检查：

- 首页是否正常打开
- 路由直达是否正常
- 页面刷新后是否还能正常进入，不出现 404

---

## 九、已知注意事项

### 1. 当前仓库存在被 Git 跟踪的 `.env`

虽然已经补了 `.gitignore`，但如果 `.env` 已经被 Git 跟踪，仍需手动移出版本控制：

```bash
git rm --cached .env
```

### 2. 当前发布链路不做 lint

这是刻意调整，不是遗漏。

如果后面你想保留质量门禁，可以单独新增例如：

- `quality.yml`：只做 lint / typecheck
- `deploy-aliyun-ecs.yml`：只做构建发布

这样职责会更清晰。
