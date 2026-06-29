/**
 * Detects whether the current host is the platform or a tenant domain.
 *
 * Platform: hostname === NUXT_PUBLIC_PLATFORM_DOMAIN (ví dụ service360.demego.vn)
 * Tenant:   mọi hostname khác kết thúc bằng `.${NUXT_PUBLIC_BASE_DOMAIN}` (ví dụ pse.demego.vn)
 *
 * `tenantSubdomain` strip `.${baseDomain}` suffix để lấy slug tổ chức (ví dụ "pse").
 * Giá trị này chỉ dùng cho filter/hiển thị — tenant identification ở BE match full FQDN qua bảng domains.
 */
export function useAppContext() {
  const config = useRuntimeConfig()
  const platformDomain = config.public.platformDomain as string
  const baseDomain = config.public.baseDomain as string

  function getHostname(): string {
    if (import.meta.server) {
      return useRequestURL().hostname
    }
    return window.location.hostname
  }

  const isPlatformDomain = computed(() => getHostname() === platformDomain)

  const isTenantDomain = computed(() => {
    const hostname = getHostname()
    if (hostname === platformDomain) return false
    return hostname.endsWith(`.${baseDomain}`) || hostname !== baseDomain
  })

  const tenantSubdomain = computed(() => {
    const hostname = getHostname()
    if (hostname === platformDomain) return null
    const suffix = `.${baseDomain}`
    if (hostname.endsWith(suffix)) {
      return hostname.slice(0, -suffix.length)
    }
    return null
  })

  return {
    isTenantDomain,
    isPlatformDomain,
    tenantSubdomain
  }
}
