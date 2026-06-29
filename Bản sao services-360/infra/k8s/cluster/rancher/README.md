# Rancher — Cluster management UI

- **Chart**: `rancher-stable/rancher`
- **Version**: `2.13.3` (supports K8s >= 1.30, including 1.34)
- **Source**: https://github.com/rancher/rancher
- **Docs**: https://ranchermanager.docs.rancher.com

## Install / Upgrade

```bash
./install.sh
```

Prerequisites:
- `helm` >= 3.18
- `kubectl` context pointing at target cluster
- Longhorn installed (Rancher state is durable without PV but embedded leader-election benefits from stable storage)

## First-time login

1. Grab the auto-generated bootstrap password:
   ```bash
   kubectl -n cattle-system get secret bootstrap-secret \
     -o go-template='{{ .data.bootstrapPassword | base64decode }}'
   ```
2. Port-forward the service:
   ```bash
   kubectl -n cattle-system port-forward svc/rancher 8080:80
   ```
3. Open `http://localhost:8080/dashboard/?setup=<password>` in a browser.
   - Follow the first-run wizard, set a new admin password.

## Configuration choices (dev)

- `tls: external` — Rancher serves HTTP only; TLS is terminated upstream (NPM when public, browser port-forward when private).
- `ingress.enabled: false` — this cluster has no ingress controller; NPM on the host handles public routing.
- `hostname: rancher.demego.vn` — must match the public URL used by NPM.

## External access path

```
Internet → demego-server:443 (NPM, Let's Encrypt TLS)
        → rke2-vm:30083 (NodePort service `rancher-nodeport`)
        → cattle-system/rancher pods :80 (HTTP, tls: external)
```

`nodeport.yaml` is applied by `install.sh` alongside the Helm release. NPM on
demego-server must be configured with:

- Proxy host: `rancher.demego.vn` → `http://<rke2-vm-ip>:30083`
- **Websockets Support: ON** (Rancher UI kubectl/shell uses WS)
- Force SSL + HTTP/2, LE cert
- Custom header: `X-Forwarded-Proto: https`

DNS: A record `rancher.demego.vn` → demego-server public IP.

## Uninstall

```bash
kubectl delete -f nodeport.yaml --ignore-not-found
helm uninstall rancher -n cattle-system
kubectl delete ns cattle-system
```

Note: many `cattle.io` / `management.cattle.io` CRDs persist after uninstall. Remove with:
```bash
kubectl get crd -o name | grep cattle.io | xargs kubectl delete
```
