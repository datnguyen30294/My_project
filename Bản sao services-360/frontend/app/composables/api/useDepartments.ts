import type {
  DepartmentsIndex200,
  DepartmentsIndexParams,
  DepartmentsShow200,
  DepartmentsStore201,
  DepartmentsUpdate200,
  DepartmentsDestroy200,
  CreateDepartmentRequest,
  UpdateDepartmentRequest
} from '#api/generated/laravel'

export function useDepartmentList(params: MaybeRefOrGetter<DepartmentsIndexParams & { page?: number }>) {
  return useApiFetch<DepartmentsIndex200>('/pmc/departments', {
    query: params,
    watch: [params]
  })
}

export function useDepartmentDetail(id: MaybeRefOrGetter<number>, options: { immediate?: boolean } = {}) {
  return useApiFetch<DepartmentsShow200>(
    computed(() => `/pmc/departments/${toValue(id)}`),
    {
      watch: options.immediate === false ? false : [() => toValue(id)],
      immediate: options.immediate ?? true
    }
  )
}

export function apiGetDepartment(id: number) {
  return $api<DepartmentsShow200>(`/pmc/departments/${id}`)
}

export function apiCreateDepartment(data: CreateDepartmentRequest) {
  return $api<DepartmentsStore201>('/pmc/departments', { method: 'POST', body: data })
}

export function apiUpdateDepartment(id: number, data: UpdateDepartmentRequest) {
  return $api<DepartmentsUpdate200>(`/pmc/departments/${id}`, { method: 'PUT', body: data })
}

export function apiDeleteDepartment(id: number) {
  return $api<DepartmentsDestroy200>(`/pmc/departments/${id}`, { method: 'DELETE' })
}

/**
 * Get self + all descendant IDs for a department from backend API.
 */
export async function apiGetSelfAndDescendantIds(departmentId: number): Promise<number[]> {
  const res = await $api<{ data: number[] }>(`/pmc/departments/${departmentId}/descendant-ids`)
  return [departmentId, ...res.data]
}
