#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOKI_VERSION="6.45.0"
PROMTAIL_VERSION="6.17.0"

echo "==> Adding Grafana Helm repo"
helm repo add grafana https://grafana.github.io/helm-charts 2>/dev/null || true
helm repo update grafana

echo "==> Installing/upgrading Loki $LOKI_VERSION"
helm upgrade --install loki grafana/loki \
  --namespace monitoring \
  --create-namespace \
  --version "$LOKI_VERSION" \
  --values "$SCRIPT_DIR/values-loki.yaml" \
  --wait --timeout 10m

echo "==> Installing/upgrading Promtail $PROMTAIL_VERSION"
helm upgrade --install promtail grafana/promtail \
  --namespace monitoring \
  --version "$PROMTAIL_VERSION" \
  --values "$SCRIPT_DIR/values-promtail.yaml" \
  --wait --timeout 5m

echo "==> Registering Loki as Grafana datasource"
kubectl apply -f "$SCRIPT_DIR/grafana-datasource.yaml"

echo ""
echo "==> Pods:"
kubectl -n monitoring get pods -l 'app.kubernetes.io/name in (loki,promtail)'

echo ""
echo "==> Loki is now a Grafana datasource (sidecar picks up ConfigMap in ~30s)."
echo "    Open Grafana → Explore → select Loki → query {namespace=\"residential-management-prod\"}"
