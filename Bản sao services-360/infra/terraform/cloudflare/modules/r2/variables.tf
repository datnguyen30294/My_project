variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
  nullable    = false
}

variable "bucket_name" {
  description = "R2 bucket name"
  type        = string
  nullable    = false
}

variable "location" {
  description = "R2 bucket location hint (e.g. APAC, WNAM, ENAM, WEUR, EEUR)"
  type        = string
  default     = "APAC"
}
