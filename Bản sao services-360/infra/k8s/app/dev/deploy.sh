#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
NAMESPACE="residential-management-dev"

# Load .env
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Copy .env.example to .env and fill in values."
  exit 1
fi
set -a; source "$ENV_FILE"; set +a

# Validate required vars
for var in DOCKERHUB_USERNAME DOCKERHUB_TOKEN REGISTRY_IMAGE APP_KEY DB_PASSWORD \
           AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_ENDPOINT NUXT_PUBLIC_API_URL \
           MAIL_USERNAME MAIL_PASSWORD; do
  if [ -z "${!var:-}" ]; then
    echo "ERROR: $var is not set in .env"
    exit 1
  fi
done

echo "==> Deploying to namespace: $NAMESPACE"
echo "==> Registry: $REGISTRY_IMAGE"

# --- Infra base ---
echo ""
echo "--- Applying infra base ---"
kubectl apply -f "$SCRIPT_DIR/namespace.yaml"

# Docker Hub pull secret
kubectl create secret docker-registry dockerhub-credentials \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username="$DOCKERHUB_USERNAME" \
  --docker-password="$DOCKERHUB_TOKEN" \
  --namespace="$NAMESPACE" \
  --dry-run=client -o yaml | kubectl apply -f -

envsubst < "$SCRIPT_DIR/secrets.yaml" | kubectl apply -f -
kubectl apply -f "$SCRIPT_DIR/configmap.yaml"

# --- Database & Redis ---
echo ""
echo "--- Applying database & redis ---"
kubectl apply -f "$SCRIPT_DIR/postgres-statefulset.yaml"
kubectl apply -f "$SCRIPT_DIR/postgres-service.yaml"
kubectl apply -f "$SCRIPT_DIR/redis-deployment.yaml"
kubectl apply -f "$SCRIPT_DIR/redis-service.yaml"

# --- Services & Ingress ---
echo ""
echo "--- Applying services & ingress ---"
kubectl apply -f "$SCRIPT_DIR/backend-service.yaml"
kubectl apply -f "$SCRIPT_DIR/frontend-service.yaml"
kubectl apply -f "$SCRIPT_DIR/ingress.yaml"

# --- Deployments (always latest) ---
echo ""
echo "--- Deploying backend (${REGISTRY_IMAGE}:backend-dev-latest) ---"
envsubst < "$SCRIPT_DIR/backend-deployment.yaml" | kubectl apply -f -
envsubst < "$SCRIPT_DIR/queue-worker-deployment.yaml" | kubectl apply -f -

echo ""
echo "--- Deploying frontend (${REGISTRY_IMAGE}:frontend-dev-latest) ---"
envsubst < "$SCRIPT_DIR/frontend-deployment.yaml" | kubectl apply -f -

# --- Verify rollouts ---
echo ""
echo "--- Verifying rollouts ---"
kubectl rollout status deployment/backend --namespace "$NAMESPACE" --timeout=120s
kubectl rollout status deployment/frontend --namespace "$NAMESPACE" --timeout=120s

echo ""
echo "==> Deploy complete!"
