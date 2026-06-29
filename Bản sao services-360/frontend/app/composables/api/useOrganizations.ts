interface OrganizationItem {
  id: string
  name: string
}

interface OrganizationListResponse {
  success: boolean
  data: OrganizationItem[]
}

export type { OrganizationItem }

export function usePlatformOrganizationList(params: MaybeRefOrGetter<Record<string, unknown>>) {
  const url = computed(() => {
    const p = toValue(params)
    const query = new URLSearchParams()
    if (p.search) query.set('search', String(p.search))
    const qs = query.toString()
    return `/platform/organizations${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<OrganizationListResponse>(url)
}

export async function apiGetOrganizationProjects(
  orgId: string,
  search?: string
): Promise<OrganizationItem[]> {
  const query = new URLSearchParams()
  if (search) query.set('search', search)
  const qs = query.toString()
  const res = await $platformApi<OrganizationListResponse>(
    `/platform/organizations/${orgId}/projects${qs ? `?${qs}` : ''}`
  )
  return res.data
}
