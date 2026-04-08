#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
: "${DEPLOY_IMAGE:?DEPLOY_IMAGE is required}"

COMPOSE_FILE="${DEPLOY_PATH}/docker-compose.prod.yml"
HOST_PORT="${HOST_PORT:-25002}"
APP_DOMAIN="${APP_DOMAIN:-process.bzsh.fun}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://127.0.0.1:${HOST_PORT}/healthz}"
DEPLOY_IMAGE_ARCHIVE="${DEPLOY_IMAGE_ARCHIVE:-}"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Compose file not found: $COMPOSE_FILE" >&2
  exit 1
fi

cd "$DEPLOY_PATH"

if [ -n "$DEPLOY_IMAGE_ARCHIVE" ] && [ -f "$DEPLOY_IMAGE_ARCHIVE" ]; then
  gunzip -c "$DEPLOY_IMAGE_ARCHIVE" | docker load
fi

if ! docker image inspect "$DEPLOY_IMAGE" >/dev/null 2>&1; then
  echo "Image not found after load: $DEPLOY_IMAGE" >&2
  exit 1
fi

export DEPLOY_IMAGE CONTAINER_NAME HOST_PORT

docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

for _ in $(seq 1 30); do
  if curl -fsS "$HEALTHCHECK_URL" >/dev/null; then
    echo "Deploy succeeded: flow-process-form is responding on ${HEALTHCHECK_URL}."
    echo "Suggested public URL: https://${APP_DOMAIN}"
    rm -f "$DEPLOY_IMAGE_ARCHIVE"
    exit 0
  fi
  sleep 2
done

echo "Health check failed, dumping container state..." >&2
docker compose -f "$COMPOSE_FILE" ps >&2 || true
docker compose -f "$COMPOSE_FILE" logs --no-color --tail=200 >&2 || true
rm -f "$DEPLOY_IMAGE_ARCHIVE"
exit 1
