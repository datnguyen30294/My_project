import type {
  TenantAccountResource,
  TenantAccountIndex200,
  TenantAccountIndexParams,
  TenantAccountOptions200,
  TenantAccountStore201,
  TenantAccountUpdate200,
  CreateTenantAccountRequest,
  UpdateTenantAccountRequest
} from '#api/generated/laravel'

export type {
  TenantAccountResource,
  TenantAccountIndexParams,
  CreateTenantAccountRequest,
  UpdateTenantAccountRequest
}

export function useTenantAccountList(
  tenantId: MaybeRefOrGetter<string>,
  params: MaybeRefOrGetter<TenantAccountIndexParams & { page?: number }>
) {
  const url = computed(() => {
    const id = toValue(tenantId)
    const p = toValue(params)
    const query = new URLSearchParams()
    if (p.search) query.set('search', p.search)
    if (p.is_active !== undefined && p.is_active !== null) query.set('is_active', p.is_active ? '1' : '0')
    if (p.sort_by) query.set('sort_by', p.sort_by)
    if (p.sort_direction) query.set('sort_direction', p.sort_direction)
    if (p.page) query.set('page', String(p.page))
    if (p.per_page) query.set('per_page', String(p.per_page))
    const qs = query.toString()
    return `/platform/tenants/${id}/accounts${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<TenantAccountIndex200>(url)
}

export function useTenantAccountOptions(tenantId: MaybeRefOrGetter<string>) {
  const url = computed(() => `/platform/tenants/${toValue(tenantId)}/accounts/options`)
  return usePlatformApiFetch<TenantAccountOptions200>(url)
}

export function apiCreateTenantAccount(tenantId: string, data: CreateTenantAccountRequest) {
  return $platformApi<TenantAccountStore201>(`/platform/tenants/${tenantId}/accounts`, {
    method: 'POST',
    body: data
  })
}

export function apiUpdateTenantAccount(tenantId: string, accountId: number, data: UpdateTenantAccountRequest) {
  return $platformApi<TenantAccountUpdate200>(`/platform/tenants/${tenantId}/accounts/${accountId}`, {
    method: 'PUT',
    body: data
  })
}
