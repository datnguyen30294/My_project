import type {
  ApiClientResource,
  ApiClientIndex200,
  ApiClientIndexParams,
  ApiClientStore201,
  ApiClientShow200,
  ApiClientUpdate200,
  ApiClientDestroy200,
  ApiClientRegenerateSecret200,
  CreateApiClientRequest,
  UpdateApiClientRequest
} from '#api/generated/laravel'

// Re-export for pages
export type { ApiClientResource, ApiClientIndexParams, CreateApiClientRequest, UpdateApiClientRequest }

export function usePlatformApiClientList(params: MaybeRefOrGetter<ApiClientIndexParams>) {
  const url = computed(() => {
    const p = toValue(params)
    const query = new URLSearchParams()
    if (p.search) query.set('search', p.search)
    if (p.organization_id) query.set('organization_id', p.organization_id)
    if (p.is_active !== undefined && p.is_active !== null) query.set('is_active', p.is_active ? '1' : '0')
    if (p.page) query.set('page', String(p.page))
    if (p.per_page) query.set('per_page', String(p.per_page))
    const qs = query.toString()
    return `/platform/api-clients${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<ApiClientIndex200>(url)
}

export function usePlatformApiClientDetail(id: MaybeRefOrGetter<string>) {
  const url = computed(() => `/platform/api-clients/${toValue(id)}`)
  return usePlatformApiFetch<ApiClientShow200>(url)
}

export function apiCreateApiClient(data: CreateApiClientRequest) {
  return $platformApi<ApiClientStore201>('/platform/api-clients', {
    method: 'POST',
    body: data
  })
}

export function apiUpdateApiClient(id: string, data: UpdateApiClientRequest) {
  return $platformApi<ApiClientUpdate200>(`/platform/api-clients/${id}`, {
    method: 'PUT',
    body: data
  })
}

export function apiDeleteApiClient(id: string) {
  return $platformApi<ApiClientDestroy200>(`/platform/api-clients/${id}`, {
    method: 'DELETE'
  })
}

export function apiRegenerateSecret(id: string) {
  return $platformApi<ApiClientRegenerateSecret200>(`/platform/api-clients/${id}/regenerate-secret`, {
    method: 'POST'
  })
}
