#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHART_VERSION="83.6.0"
SECRET_FILE="$SCRIPT_DIR/values.secret.yaml"

if [ ! -f "$SECRET_FILE" ]; then
  echo "ERROR: $SECRET_FILE not found."
  echo "Copy values.secret.example.yaml → values.secret.yaml and set a strong password."
  exit 1
fi

echo "==> Adding Prometheus community Helm repo"
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts 2>/dev/null || true
helm repo update prometheus-community

echo "==> Installing/upgrading kube-prometheus-stack $CHART_VERSION"
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --version "$CHART_VERSION" \
  --values "$SCRIPT_DIR/values.yaml" \
  --values "$SECRET_FILE" \
  --wait --timeout 15m

echo ""
echo "==> Waiting for rollouts"
kubectl -n monitoring rollout status statefulset/prometheus-monitoring-kube-prometheus-prometheus --timeout=10m
kubectl -n monitoring rollout status statefulset/alertmanager-monitoring-kube-prometheus-alertmanager --timeout=5m
kubectl -n monitoring rollout status deployment/monitoring-grafana --timeout=5m

echo ""
echo "==> Pods:"
kubectl -n monitoring get pods

echo ""
echo "==> Access Grafana:"
echo "    kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80"
echo "    open http://localhost:3000  (user: admin, password from values.secret.yaml)"
