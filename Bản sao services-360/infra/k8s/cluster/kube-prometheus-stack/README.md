# kube-prometheus-stack — Metrics + Grafana + Alertmanager

- **Chart**: `prometheus-community/kube-prometheus-stack`
- **Version**: `83.6.0`
- **Source**: https://github.com/prometheus-community/helm-charts
- **Namespace**: `monitoring`

## Setup (first time)

1. Copy secrets template and set a strong password:
   ```bash
   cp values.secret.example.yaml values.secret.yaml
   # Edit values.secret.yaml — set grafana.adminPassword
   ```
2. Install:
   ```bash
   ./install.sh
   ```

`values.secret.yaml` is gitignored via the `infra/k8s/cluster/*/values.secret.yaml` pattern.

## Access

```bash
# Grafana (admin + password from values.secret.yaml)
kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80
open http://localhost:3000

# Prometheus (no auth)
kubectl -n monitoring port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090
open http://localhost:9090

# Alertmanager
kubectl -n monitoring port-forward svc/monitoring-kube-prometheus-alertmanager 9093:9093
open http://localhost:9093
```

## Storage

- Prometheus TSDB: 20Gi (retention 15d, size-capped 18GB)
- Alertmanager: 2Gi
- Grafana: 5Gi

All PVCs use the `longhorn` StorageClass.

## What's enabled / disabled

Enabled:
- Prometheus Operator + CRDs
- Prometheus server (1 replica)
- Alertmanager (1 replica)
- Grafana (default K8s dashboards auto-loaded via sidecar)
- node-exporter (DaemonSet) + kube-state-metrics

Disabled (RKE2-specific):
- `kubeControllerManager`, `kubeScheduler`, `kubeEtcd` — embedded in RKE2, scrape targets not exposed by default. Enable later with custom TLS if needed.
- `kubeProxy` — Cilium provides kube-proxy-replacement; no kube-proxy to scrape.

## Upgrade

```bash
# Bump CHART_VERSION in install.sh, re-run
./install.sh
```

CRDs may require manual upgrade step when bumping major chart versions — check upstream release notes.

## Uninstall

```bash
helm uninstall monitoring -n monitoring
kubectl delete ns monitoring
# Optional: drop CRDs (affects any other Prometheus Operator resources)
kubectl get crd -o name | grep monitoring.coreos.com | xargs kubectl delete
```
