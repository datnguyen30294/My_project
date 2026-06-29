locals {
  environment = "dev"
  domain      = "nathen.io.vn"
  zone_id     = "ae95870dfcf189e09a36c1dc215656b4"
  account_id  = "c940836064b1347e11c37eba6382636e"

  # K8s Ingress Controller external IP
  k8s_ingress_ip = "157.66.80.14"

  # DNS records
  dns_records = [
    # Central domains (proxied)
    { name = "api", content = local.k8s_ingress_ip, comment = "Central API 2. Managed by Terraform" },
    { name = "app", content = local.k8s_ingress_ip, comment = "Central frontend. Managed by Terraform" },

    # Tenant domains
    { name = "tnp.api", content = local.k8s_ingress_ip, proxied = false, comment = "TNP API. Managed by Terraform" },
    { name = "tnp.app", content = local.k8s_ingress_ip, proxied = false, comment = "TNP frontend. Managed by Terraform" },
    { name = "abc.api", content = local.k8s_ingress_ip, proxied = false, comment = "ABC API. Managed by Terraform" },
    { name = "abc.app", content = local.k8s_ingress_ip, proxied = false, comment = "ABC frontend. Managed by Terraform" },

    # # Wildcard domains for multi-tenant (DNS-only, not proxied)
    # { name = "*.api", content = local.k8s_ingress_ip, proxied = false, ttl = 300, comment = "Wildcard tenant API" },
    # { name = "*.app", content = local.k8s_ingress_ip, proxied = false, ttl = 300, comment = "Wildcard tenant frontend" },
  ]

  # R2
  r2_bucket_name = "residential-management"
}
