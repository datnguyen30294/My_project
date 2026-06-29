#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RANCHER_VERSION="2.13.3"

echo "==> Adding Rancher Helm repo"
helm repo add rancher-stable https://releases.rancher.com/server-charts/stable 2>/dev/null || true
helm repo update rancher-stable

echo "==> Creating namespace (if not exists)"
kubectl create namespace cattle-system --dry-run=client -o yaml | kubectl apply -f -

echo "==> Installing/upgrading Rancher $RANCHER_VERSION"
helm upgrade --install rancher rancher-stable/rancher \
  --namespace cattle-system \
  --version "$RANCHER_VERSION" \
  --values "$SCRIPT_DIR/values.yaml" \
  --wait --timeout 15m

echo "==> Waiting for rancher deployment"
kubectl -n cattle-system rollout status deployment/rancher --timeout=10m

echo "==> Applying NodePort service for external access"
kubectl apply -f "$SCRIPT_DIR/nodeport.yaml"

echo "==> Setting server-url to match hostname"
HOSTNAME_VALUE="$(grep '^hostname:' "$SCRIPT_DIR/values.yaml" | awk '{print $2}')"
kubectl patch settings.management.cattle.io server-url --type=merge \
  -p "{\"value\":\"https://${HOSTNAME_VALUE}\"}" || true

echo ""
echo "==> Deployed. Bootstrap password:"
kubectl -n cattle-system get secret bootstrap-secret \
  -o go-template='{{ .data.bootstrapPassword | base64decode }}{{ "\n" }}' || \
  echo "  (secret bootstrap-secret not found yet — run again in ~30s)"

echo ""
echo "==> Access UI:"
echo "    Public  : https://${HOSTNAME_VALUE:-<configured-hostname>}/dashboard/"
echo "    Private : kubectl -n cattle-system port-forward svc/rancher 8080:80"
echo "              open http://localhost:8080/dashboard/?setup=<password-above>"
