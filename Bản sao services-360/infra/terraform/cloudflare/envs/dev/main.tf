module "dns" {
  source = "./../../modules/dns"

  zone_id = local.zone_id
  records = local.dns_records
}

module "r2" {
  source = "./../../modules/r2"

  account_id  = local.account_id
  bucket_name = local.r2_bucket_name
}
