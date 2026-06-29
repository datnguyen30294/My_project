export interface ClosingPeriodOption {
  label: string
  value: number
}

/**
 * Fetch all closing periods (newest first) and map them into
 * { label, value } options suitable for USelectMenu on report pages.
 */
export function useClosingPeriodOptions() {
  const { data } = useClosingPeriodList(() => ({
    per_page: SELECT_ALL_PER_PAGE,
    sort_by: 'period_end',
    sort_direction: 'desc'
  }))

  const closingPeriodOptions = computed<ClosingPeriodOption[]>(() => {
    const items = data.value?.data ?? []
    return items.map(p => ({
      label: `${p.name}${p.project ? ` — ${p.project.name}` : ''}${p.status.value === 'open' ? ' (đang mở)' : ''}`,
      value: p.id
    }))
  })

  return { closingPeriodOptions }
}
