terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket = "terraform-state"
    key    = "residential/cloudflare/dev.tfstate"
    region = "us-east-1"

    # Cloudflare R2 endpoint
    endpoints = {
      s3 = "https://c940836064b1347e11c37eba6382636e.r2.cloudflarestorage.com"
    }

    # R2 does not support these S3 features
    skip_credentials_validation = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
  }
}

provider "cloudflare" {
  email   = var.cloudflare_email
  api_key = var.cloudflare_api_key
}

variable "cloudflare_email" {
  description = "Cloudflare account email"
  type        = string
}

variable "cloudflare_api_key" {
  description = "Cloudflare Global API Key (full admin access)"
  type        = string
  sensitive   = true
}
