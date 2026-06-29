export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const { isAuthenticated, init, fetchUser, user } = useAuth()
  const { isAuthenticated: isPlatformAuthenticated, init: initPlatform, fetchUser: fetchPlatformUser, user: platformUser } = usePlatformAuth()
  const { isTenantDomain } = useAppContext()

  init()
  initPlatform()

  const publicRoutes = ['/', '/login', '/ticket', '/dich-vu', '/chinh-sach', '/chinh-sach-bao-mat']
  // /tickets/{code}: trang public cư dân xem yêu cầu + duyệt báo giá (QR/email link).
  const publicPrefixes = ['/dich-vu/', '/acceptance-report/', '/tickets/']
  const isPublicRoute = publicRoutes.includes(to.path) || publicPrefixes.some(p => to.path.startsWith(p))
  const isPlatformRoute = to.path.startsWith('/platform')

  // Redirect from login if already authenticated
  if (to.path === '/login') {
    if (isTenantDomain.value) {
      // Tenant domain: only check PMC auth
      if (isAuthenticated.value) return navigateTo('/pmc/dashboard')
    } else {
      // Platform domain: only check Platform auth
      if (isPlatformAuthenticated.value) return navigateTo('/platform')
    }
    return
  }

  // Platform protected routes
  if (isPlatformRoute) {
    if (!isPlatformAuthenticated.value) return navigateTo('/login')
    if (!platformUser.value) {
      await fetchPlatformUser()
      if (!platformUser.value) return navigateTo('/login')
    }
    return
  }

  // PMC protected routes
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/login')
  }

  if (isAuthenticated.value && !user.value) {
    await fetchUser()
    if (!user.value) return navigateTo('/login')
  }
})
