variable "zone_id" {
  description = "Cloudflare Zone ID for the domain"
  type        = string
  nullable    = false
}

variable "records" {
  description = "List of DNS records to create"
  type = list(object({
    name    = string
    content = string
    type    = optional(string, "A")
    ttl     = optional(number, 1)
    proxied = optional(bool, true)
    comment = optional(string, "")
  }))
}
