# Loki + Promtail — Log aggregation

- **Charts**: `grafana/loki`, `grafana/promtail`
- **Versions**: Loki `6.45.0`, Promtail `6.17.0`
- **Namespace**: `monitoring` (colocated with kube-prometheus-stack)

## Install / Upgrade

```bash
./install.sh
```

Idempotent — bump `LOKI_VERSION` / `PROMTAIL_VERSION` in `install.sh` and rerun.

## Architecture

```
Node (rke2-vm)
 └─ Promtail (DaemonSet)  → tail /var/log/pods/*/*.log
                          → push to http://loki:3100/loki/api/v1/push
 └─ Loki (StatefulSet, SingleBinary)
    └─ filesystem storage (Longhorn PVC 10Gi, 7d retention)
```

## Access logs

- Via Grafana **Explore → Loki**:
  ```
  {namespace="residential-management-prod"}
  {namespace="residential-management-prod", pod=~"backend-.*"} |= "error"
  ```

## Storage & retention

- Loki PVC 10Gi on Longhorn
- Retention 7 days (configure `loki.limits_config.retention_period` in `values-loki.yaml`)

## Upgrade considerations

- Loki schema changes require careful config migration (chart docs).
- Keep `schemaConfig.configs` entries intact — `from:` date marks schema boundary. When schema changes, **append** a new entry with a future `from:` date; do not modify existing entries.

## Uninstall

```bash
helm uninstall promtail -n monitoring
helm uninstall loki -n monitoring
kubectl delete configmap grafana-loki-datasource -n monitoring
# Optional: delete PVC for Loki data
kubectl delete pvc -n monitoring -l app.kubernetes.io/name=loki
```
