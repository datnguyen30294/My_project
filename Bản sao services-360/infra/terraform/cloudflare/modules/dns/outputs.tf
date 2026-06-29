output "records" {
  description = "Map of created DNS records"
  value = {
    for k, r in cloudflare_record.this : k => {
      hostname = r.hostname
      content  = r.content
      type     = r.type
      proxied  = r.proxied
    }
  }
}
