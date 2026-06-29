locals {
  environment = "prod"
  domain      = "nathen.io.vn"
  zone_id     = "ae95870dfcf189e09a36c1dc215656b4"
  account_id  = "c940836064b1347e11c37eba6382636e"

  # NPM reverse proxy host (CentOS 8, demego-server)
  # NPM terminates SSL, forwards HTTP to RKE2 NodePort on VM 10.200.0.32
  npm_host_ip = "115.146.126.158"

  # DNS records — all DNS-only (grey cloud).
  # NPM handles Let's Encrypt (wildcard via Cloudflare DNS-01).
  # Temporary `prod.` prefix while running parallel with legacy cluster.
  # Can collapse to root (api.nathen.io.vn) once legacy cluster is retired.
  dns_records = [
    # Central domains
    { name = "api.prod", content = local.npm_host_ip, proxied = false, ttl = 300, comment = "prod: central API. Managed by Terraform" },
    { name = "app.prod", content = local.npm_host_ip, proxied = false, ttl = 300, comment = "prod: central frontend. Managed by Terraform" },

    # Wildcard tenant domains
    { name = "*.api.prod", content = local.npm_host_ip, proxied = false, ttl = 300, comment = "prod: wildcard tenant API. Managed by Terraform" },
    { name = "*.app.prod", content = local.npm_host_ip, proxied = false, ttl = 300, comment = "prod: wildcard tenant frontend. Managed by Terraform" },
  ]

  # R2 bucket for prod cluster (isolated from other envs)
  r2_bucket_name = "residential-management-prod"
}
