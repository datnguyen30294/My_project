import type { ModulesPmcAccountAuthLogin200Data, AuthRegister201Data } from '#api/generated/laravel'

export interface AuthUser {
  id: number
  name: string
  email: string
  avatar_url: string | null
}

export interface AuthTenant {
  id: string | null
  is_vendor_enabled: boolean
  /** Module nghiệp vụ platform bật cho tenant — null khi chưa fetch. */
  enabled_modules: string[] | null
}

type AuthData = ModulesPmcAccountAuthLogin200Data | AuthRegister201Data

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const tenant = useState<AuthTenant | null>('auth-tenant', () => null)
  const token = useState<string | null>('auth-token', () => null)
  const isAuthenticated = computed(() => !!token.value)

  const init = () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('access_token')
      if (storedToken && !token.value) {
        token.value = storedToken
      }
    }
  }

  const setAuth = (data: AuthData) => {
    token.value = data.token

    user.value = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      avatar_url: data.user.avatar_url ?? null
    }

    if (import.meta.client) {
      localStorage.setItem('access_token', data.token)
    }
  }

  const clearAuth = () => {
    user.value = null
    tenant.value = null
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('access_token')
    }
  }

  const fetchUser = async () => {
    try {
      const response = await apiMe()

      user.value = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        avatar_url: response.data.avatar_url ?? null
      }

      tenant.value = response.data.tenant
        ? {
            id: response.data.tenant.id ?? null,
            is_vendor_enabled: !!response.data.tenant.is_vendor_enabled,
            enabled_modules: response.data.tenant.enabled_modules ?? null
          }
        : null
    } catch {
      clearAuth()
    }
  }

  return {
    user: readonly(user),
    tenant: readonly(tenant),
    token: readonly(token),
    isAuthenticated,
    init,
    setAuth,
    clearAuth,
    fetchUser
  }
}
