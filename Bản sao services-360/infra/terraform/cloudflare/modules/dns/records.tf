resource "cloudflare_record" "this" {
  for_each = { for r in var.records : r.name => r }

  zone_id = var.zone_id
  name    = each.value.name
  content = each.value.content
  type    = each.value.type
  ttl     = each.value.ttl
  proxied = each.value.proxied
  comment = each.value.comment
}
