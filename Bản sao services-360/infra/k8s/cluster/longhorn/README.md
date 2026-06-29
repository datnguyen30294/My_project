# Longhorn — Distributed block storage

- **Chart**: `longhorn/longhorn`
- **Version**: `1.11.1`
- **Source**: https://github.com/longhorn/longhorn
- **K8s requirement**: >= 1.25

## Preflight (per-node, one-time)

Longhorn needs the following on every node where volumes will attach:

```bash
sudo systemctl disable --now multipathd multipathd.socket
sudo systemctl mask multipathd.service multipathd.socket
sudo systemctl enable --now iscsid
sudo modprobe iscsi_tcp
echo iscsi_tcp | sudo tee /etc/modules-load.d/iscsi_tcp.conf
```

Already applied on `rke2-vm` during cluster bootstrap.

## Install / Upgrade

```bash
./install.sh
```

Idempotent — bump `LONGHORN_VERSION` in `install.sh` and rerun to upgrade.

## Uninstall

```bash
helm uninstall longhorn -n longhorn-system
kubectl delete ns longhorn-system
```

Volumes must be deleted first if desired, otherwise PVs remain orphaned.

## Notes (single-node dev)

- `defaultReplicaCount: 1` — no redundancy (acceptable for dev). Bump to 3 when cluster grows.
- `backupTarget: ""` — backups disabled. Configure S3/NFS in `values.yaml` when needed.
- UI not exposed publicly — access via `kubectl port-forward` or Rancher UI.
