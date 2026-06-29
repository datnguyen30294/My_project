import type {
  CreateShiftRequest,
  ShiftStats200,
  ShiftsIndex200,
  ShiftsIndexParams,
  ShiftsShow200,
  ShiftsStore201,
  ShiftsUpdate200,
  UpdateShiftRequest
} from '#api/generated/laravel'

export function useShiftList(
  params: MaybeRefOrGetter<ShiftsIndexParams & { page?: number }> = () => ({})
) {
  return useApiFetch<ShiftsIndex200>('/pmc/shifts', {
    query: params,
    watch: [params]
  })
}

export function useShiftDetail(id: MaybeRefOrGetter<number>) {
  return useApiFetch<ShiftsShow200>(
    computed(() => `/pmc/shifts/${toValue(id)}`),
    { watch: [() => toValue(id)] }
  )
}

export function useShiftStats() {
  return useApiFetch<ShiftStats200>('/pmc/shifts/stats')
}

export function apiCreateShift(data: CreateShiftRequest) {
  return $api<ShiftsStore201>('/pmc/shifts', { method: 'POST', body: data })
}

export function apiUpdateShift(id: number, data: UpdateShiftRequest) {
  return $api<ShiftsUpdate200>(`/pmc/shifts/${id}`, { method: 'PUT', body: data })
}

export function apiDeleteShift(id: number) {
  return $api<{ success: boolean, message: string }>(`/pmc/shifts/${id}`, { method: 'DELETE' })
}
