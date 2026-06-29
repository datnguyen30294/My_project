import type {
  AppModulesPlatformAuthResourcesAuthResource,
  ModulesPlatformAuthAuthLogin200
} from '#api/generated/laravel'

export type PlatformUser = AppModulesPlatformAuthResourcesAuthResource

export const usePlatformAuth = () => {
  const user = useState<PlatformUser | null>('platform-auth-user', () => null)
  const token = useState<string | null>('platform-auth-token', () => null)
  const isAuthenticated = computed(() => !!token.value)

  const init = () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('platform_access_token')
      if (storedToken && !token.value) {
        token.value = storedToken
      }
    }
  }

  const setAuth = (data: ModulesPlatformAuthAuthLogin200['data']) => {
    token.value = data.token
    user.value = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email
    }
    if (import.meta.client) {
      localStorage.setItem('platform_access_token', data.token)
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('platform_access_token')
    }
  }

  const fetchUser = async () => {
    try {
      const response = await apiPlatformMe()
      user.value = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email
      }
    } catch {
      clearAuth()
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    init,
    setAuth,
    clearAuth,
    fetchUser
  }
}
