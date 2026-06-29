import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack'

/**
 * Build API base URL từ hostname hiện tại.
 *
 * Prod (không có port ở URL hiện tại → prepend `api.` vào hostname):
 *   service360.demego.vn  → https://api.service360.demego.vn/api/v1
 *   pse.demego.vn         → https://api.pse.demego.vn/api/v1
 *
 * Local dev (URL có port → giữ hostname, đổi port sang BE port suy từ NUXT_PUBLIC_API_URL):
 *   tnp.residential.test:3000 → http://tnp.residential.test:8000/api/v1
 *
 * Hostname dạng IP / localhost → fallback về NUXT_PUBLIC_API_URL.
 */
export function getApiBaseUrl(): string {
  const config = useRuntimeConfig()

  // SSR trong container: dùng URL nội bộ, tenant được nhận diện qua Host header forward ở onRequest.
  if (import.meta.server) {
    const internalUrl = config.apiInternalUrl as string
    if (internalUrl) return internalUrl
  }

  const requestUrl = import.meta.server ? useRequestURL() : null
  const hostname = import.meta.server ? requestUrl!.hostname : window.location.hostname
  const currentPort = import.meta.server ? requestUrl!.port : window.location.port
  const protocol = (import.meta.server ? requestUrl!.protocol : window.location.protocol).replace(':', '')

  const isIpOrLocal = /^(\d+\.\d+\.\d+\.\d+|\[.*\]|localhost)$/.test(hostname)
  if (isIpOrLocal) {
    return config.public.apiUrl as string
  }

  // Dev: URL có port → giữ nguyên hostname, đổi port sang BE port suy từ apiUrl.
  if (currentPort) {
    const apiPort = extractPortFromUrl(config.public.apiUrl as string)
    return apiPort
      ? `${protocol}://${hostname}:${apiPort}/api/v1`
      : `${protocol}://${hostname}/api/v1`
  }

  // Prod: không port → prepend `api.`
  return `${protocol}://api.${hostname}/api/v1`
}

function extractPortFromUrl(url: string): string | null {
  // Regex tránh lỗi khi URL env bị thiếu hostname (ví dụ "http://.test:8000/...").
  const match = url.match(/:(\d+)(?:\/|$)/)
  return match && match[1] ? match[1] : null
}

function getAuthHeaders(): Record<string, string> {
  if (import.meta.client) {
    const token = localStorage.getItem('access_token')
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
  }
  return {}
}

function getPlatformAuthHeaders(): Record<string, string> {
  if (import.meta.client) {
    const token = localStorage.getItem('platform_access_token')
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
  }
  return {}
}

function handleUnauthorized() {
  if (import.meta.client) {
    localStorage.removeItem('access_token')
    useState('auth-token').value = null
    useState('auth-user').value = null
    navigateTo('/login')
  }
}

function handlePlatformUnauthorized() {
  if (import.meta.client) {
    localStorage.removeItem('platform_access_token')
    useState('platform-auth-token').value = null
    useState('platform-auth-user').value = null
    navigateTo('/login')
  }
}

function isAuthEndpoint(url: string): boolean {
  const authMutationPaths = ['/auth/login', '/auth/register', '/auth/logout', '/platform/auth/login', '/platform/auth/logout']
  return authMutationPaths.some(path => url.includes(path))
}

/** Tenant bị platform vô hiệu hoá → BE trả 403 TENANT_DISABLED trên mọi API tenant. */
function isTenantDisabledResponse(data: unknown): boolean {
  return typeof data === 'object'
    && data !== null
    && (data as { error_code?: string }).error_code === 'TENANT_DISABLED'
}

export function useApiFetch<T>(
  url: MaybeRefOrGetter<string>,
  options: Parameters<typeof useFetch<T, NitroFetchRequest>>[1] = {}
) {
  const baseURL = getApiBaseUrl()

  return useFetch<T>(url, {
    baseURL,
    onRequest({ options: reqOptions }) {
      // Prevent browser HTTP cache from returning stale API responses on refresh()
      if (import.meta.client) {
        reqOptions.cache = 'no-store'
      }
      const headers = new Headers(reqOptions.headers as HeadersInit)
      // Forward Host header on SSR when using Docker-internal URL.
      // BE match tenant theo API FQDN (api.<hostname>) trong bảng domains.
      if (import.meta.server && (useRuntimeConfig().apiInternalUrl as string)) {
        headers.set('Host', `api.${useRequestURL().hostname}`)
      }
      const authHeaders = getAuthHeaders()
      for (const [key, value] of Object.entries(authHeaders)) {
        headers.set(key, value)
      }
      reqOptions.headers = headers
    },
    onResponseError({ request, response }) {
      if (response.status === 401 && import.meta.client) {
        const reqUrl = typeof request === 'string' ? request : request.url
        if (!isAuthEndpoint(reqUrl)) {
          handleUnauthorized()
        }
      }
      if (response.status === 403 && import.meta.client && isTenantDisabledResponse(response._data)) {
        handleUnauthorized()
      }
    },
    ...options
  } as Parameters<typeof useFetch<T, NitroFetchRequest>>[1])
}

type ApiRequestOptions = NitroFetchOptions<NitroFetchRequest>

export function usePlatformApiFetch<T>(
  url: MaybeRefOrGetter<string>,
  options: Parameters<typeof useFetch<T, NitroFetchRequest>>[1] = {}
) {
  const baseURL = getApiBaseUrl()

  return useFetch<T>(url, {
    baseURL,
    onRequest({ options: reqOptions }) {
      if (import.meta.client) {
        reqOptions.cache = 'no-store'
      }
      const headers = new Headers(reqOptions.headers as HeadersInit)
      const authHeaders = getPlatformAuthHeaders()
      for (const [key, value] of Object.entries(authHeaders)) {
        headers.set(key, value)
      }
      reqOptions.headers = headers
    },
    onResponseError({ request, response }) {
      if (response.status === 401 && import.meta.client) {
        const reqUrl = typeof request === 'string' ? request : request.url
        if (!isAuthEndpoint(reqUrl)) {
          handlePlatformUnauthorized()
        }
      }
    },
    ...options
  } as Parameters<typeof useFetch<T, NitroFetchRequest>>[1])
}

export async function $platformApi<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const baseURL = getApiBaseUrl()

  const mergeHeaders = (extra: Record<string, string>): HeadersInit => {
    const headers = new Headers(options.headers as HeadersInit)
    for (const [key, value] of Object.entries(extra)) {
      headers.set(key, value)
    }
    return headers
  }

  try {
    return await $fetch<T>(url, {
      ...options,
      baseURL,
      headers: mergeHeaders(getPlatformAuthHeaders())
    })
  } catch (error: unknown) {
    const fetchError = error as { status?: number }

    if (fetchError.status === 401 && import.meta.client && !isAuthEndpoint(url)) {
      handlePlatformUnauthorized()
    }

    throw error
  }
}

export async function $api<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const baseURL = getApiBaseUrl()

  const mergeHeaders = (extra: Record<string, string>): HeadersInit => {
    const headers = new Headers(options.headers as HeadersInit)
    for (const [key, value] of Object.entries(extra)) {
      headers.set(key, value)
    }
    return headers
  }

  try {
    return await $fetch<T>(url, {
      ...options,
      baseURL,
      headers: mergeHeaders(getAuthHeaders())
    })
  } catch (error: unknown) {
    const fetchError = error as { status?: number, data?: unknown }

    if (fetchError.status === 401 && import.meta.client && !isAuthEndpoint(url)) {
      handleUnauthorized()
    }

    if (fetchError.status === 403 && import.meta.client && isTenantDisabledResponse(fetchError.data)) {
      handleUnauthorized()
    }

    throw error
  }
}
