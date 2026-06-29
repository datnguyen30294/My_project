import type {
  ProjectsIndex200,
  ProjectsIndexParams,
  ProjectsShow200,
  ProjectsStore201,
  ProjectsUpdate200,
  ProjectsDestroy200,
  CreateProjectRequest,
  UpdateProjectRequest
} from '#api/generated/laravel'

export function useProjectList(params: MaybeRefOrGetter<ProjectsIndexParams & { page?: number }>) {
  return useApiFetch<ProjectsIndex200>('/pmc/projects', {
    query: params,
    watch: [params]
  })
}

export function useProjectDetail(id: MaybeRefOrGetter<number>) {
  return useApiFetch<ProjectsShow200>(
    computed(() => `/pmc/projects/${toValue(id)}`),
    {
      watch: [() => toValue(id)]
    }
  )
}

export function apiGetProject(id: number) {
  return $api<ProjectsShow200>(`/pmc/projects/${id}`)
}

export function apiCreateProject(data: CreateProjectRequest) {
  return $api<ProjectsStore201>('/pmc/projects', { method: 'POST', body: data })
}

export function apiUpdateProject(id: number, data: UpdateProjectRequest) {
  return $api<ProjectsUpdate200>(`/pmc/projects/${id}`, { method: 'PUT', body: data })
}

export function apiDeleteProject(id: number) {
  return $api<ProjectsDestroy200>(`/pmc/projects/${id}`, { method: 'DELETE' })
}

export function apiSyncProjectMembers(id: number, accountIds: number[]) {
  return $api<ProjectsShow200>(`/pmc/projects/${id}/sync-members`, {
    method: 'PUT',
    body: { account_ids: accountIds }
  })
}
