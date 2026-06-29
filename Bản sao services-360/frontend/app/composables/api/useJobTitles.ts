import type {
  JobTitlesIndex200,
  JobTitlesIndexParams,
  JobTitlesShow200,
  JobTitlesStore201,
  JobTitlesUpdate200,
  JobTitlesDestroy200,
  JobTitleCheckDelete200,
  CreateJobTitleRequest,
  UpdateJobTitleRequest
} from '#api/generated/laravel'

export function useJobTitleList(params: MaybeRefOrGetter<JobTitlesIndexParams & { page?: number }>) {
  return useApiFetch<JobTitlesIndex200>('/pmc/job-titles', {
    query: params,
    watch: [params]
  })
}

export function useJobTitleDetail(id: MaybeRefOrGetter<number>) {
  return useApiFetch<JobTitlesShow200>(
    computed(() => `/pmc/job-titles/${toValue(id)}`),
    {
      watch: [() => toValue(id)]
    }
  )
}

export function apiGetJobTitle(id: number) {
  return $api<JobTitlesShow200>(`/pmc/job-titles/${id}`)
}

export function apiCreateJobTitle(data: CreateJobTitleRequest) {
  return $api<JobTitlesStore201>('/pmc/job-titles', { method: 'POST', body: data })
}

export function apiUpdateJobTitle(id: number, data: UpdateJobTitleRequest) {
  return $api<JobTitlesUpdate200>(`/pmc/job-titles/${id}`, { method: 'PUT', body: data })
}

export function apiDeleteJobTitle(id: number) {
  return $api<JobTitlesDestroy200>(`/pmc/job-titles/${id}`, { method: 'DELETE' })
}

export function apiCheckDeleteJobTitle(id: number) {
  return $api<JobTitleCheckDelete200>(`/pmc/job-titles/${id}/check-delete`)
}
