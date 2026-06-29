#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LONGHORN_VERSION="1.11.1"

echo "==> Adding Longhorn Helm repo"
helm repo add longhorn https://charts.longhorn.io 2>/dev/null || true
helm repo update longhorn

echo "==> Installing/upgrading Longhorn $LONGHORN_VERSION"
helm upgrade --install longhorn longhorn/longhorn \
  --namespace longhorn-system \
  --create-namespace \
  --version "$LONGHORN_VERSION" \
  --values "$SCRIPT_DIR/values.yaml" \
  --wait --timeout 10m

echo "==> Waiting for Longhorn components"
kubectl -n longhorn-system rollout status ds/longhorn-manager --timeout=5m
kubectl -n longhorn-system rollout status deploy/longhorn-ui --timeout=5m

echo ""
echo "==> StorageClass:"
kubectl get storageclass

echo ""
echo "==> Longhorn pods:"
kubectl -n longhorn-system get pods

echo ""
echo "==> Done. Access Longhorn UI:"
echo "  kubectl -n longhorn-system port-forward svc/longhorn-frontend 8080:80"
echo "  open http://localhost:8080"
