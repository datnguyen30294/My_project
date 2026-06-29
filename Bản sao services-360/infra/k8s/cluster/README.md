# Cluster infrastructure

Helm-based, cluster-wide components. Install once per cluster, upgrade occasionally.

## Install order

1. `longhorn/` — default StorageClass (block storage)
2. `rancher/` *(planned)* — cluster UI
3. `kube-prometheus-stack/` *(planned)* — metrics + Grafana + alerting
4. `loki/` *(planned)* — logs
5. `sentry/` *(planned, optional)* — self-host Sentry if not using cloud

Run all in order:

```bash
./bootstrap.sh
```

Or one at a time:

```bash
cd longhorn && ./install.sh
```

## Per-component layout

```
<component>/
├── values.yaml    # Helm values (overrides only, not full chart)
├── install.sh     # helm repo add + helm upgrade --install (idempotent)
└── README.md      # version, source, preflight, upgrade/uninstall notes
```

## Prerequisites

- `helm` >= 3.18 on caller machine
- `kubectl` context pointing at the target cluster (`rke2-demego` for dev)
- SSH tunnel to RKE2 API: `make tunnel-up`

## Cluster vs app

- `infra/k8s/cluster/` — platform components (this directory)
- `infra/k8s/app/<env>/` — application workloads (backend, frontend, postgres, redis, worker)
