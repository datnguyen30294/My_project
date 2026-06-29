import type {
  WorkforceCapacityIndex200,
  WorkforceCapacityIndexParams
} from '#api/generated/laravel'

export type WorkforceCapacityRow = WorkforceCapacityIndex200['data']['rows'][number]
export type WorkforceCapacitySummary = WorkforceCapacityIndex200['data']['summary']

export interface WorkforceCapacityFilters {
  projectId?: number | null
  search?: string | null
}

export function useWorkforceCapacityList(
  filters: MaybeRefOrGetter<WorkforceCapacityFilters>
) {
  const query = computed(() => {
    const f = toValue(filters)
    const params: WorkforceCapacityIndexParams = {}
    if (f.projectId != null) params.project_id = f.projectId
    if (f.search && f.search.trim() !== '') params.search = f.search.trim()
    return params
  })

  return useApiFetch<WorkforceCapacityIndex200>('/pmc/workforce/capacity', {
    query,
    watch: [query]
  })
}
