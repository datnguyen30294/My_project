#!/usr/bin/env bash
# Bootstrap all cluster-wide infra components in dependency order.
# Idempotent — safe to rerun.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==================================================="
echo "Cluster context: $(kubectl config current-context)"
echo "==================================================="
read -p "Continue bootstrapping this cluster? [y/N] " -n 1 -r
echo
[[ $REPLY =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }

# Order matters: storage first (downstream components need PVCs)
COMPONENTS=(
  longhorn
  rancher
  kube-prometheus-stack
  # loki                  # M3
)

for c in "${COMPONENTS[@]}"; do
  echo ""
  echo ">>> Installing: $c"
  "$SCRIPT_DIR/$c/install.sh"
done

echo ""
echo "==> All components bootstrapped."
