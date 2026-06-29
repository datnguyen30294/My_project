import type {
  RolesIndex200,
  RolesIndexParams,
  RolesShow200,
  RolesStore201,
  RolesUpdate200,
  RolesDestroy200,
  CreateRoleRequest,
  UpdateRoleRequest,
  PermissionsIndex200
} from '#api/generated/laravel'

export function useRoleList(params: MaybeRefOrGetter<RolesIndexParams & { page?: number }>) {
  return useApiFetch<RolesIndex200>('/pmc/roles', {
    query: params,
    watch: [params]
  })
}

export function useRoleDetail(id: MaybeRefOrGetter<number>) {
  return useApiFetch<RolesShow200>(
    computed(() => `/pmc/roles/${toValue(id)}`),
    {
      watch: [() => toValue(id)]
    }
  )
}

export function apiGetRole(id: number) {
  return $api<RolesShow200>(`/pmc/roles/${id}`)
}

export function apiSearchRoles(search: string) {
  return $api<RolesIndex200>('/pmc/roles', { query: { search, per_page: 1 } })
}

export function apiCreateRole(data: CreateRoleRequest) {
  return $api<RolesStore201>('/pmc/roles', { method: 'POST', body: data })
}

export function apiUpdateRole(id: number, data: UpdateRoleRequest) {
  return $api<RolesUpdate200>(`/pmc/roles/${id}`, { method: 'PUT', body: data })
}

export function apiDeleteRole(id: number) {
  return $api<RolesDestroy200>(`/pmc/roles/${id}`, { method: 'DELETE' })
}

export function usePermissionList(options?: { immediate?: boolean }) {
  return useApiFetch<PermissionsIndex200>('/pmc/permissions', {
    immediate: options?.immediate
  })
}
