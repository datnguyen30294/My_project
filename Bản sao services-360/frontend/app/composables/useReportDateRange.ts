export interface UseReportDateRangeOptions {
  /**
   * Initialize date refs to the last 30 days. Set to false when the page should
   * start with no date filter (URL may populate it later).
   */
  withDefault?: boolean
}

export function useReportDateRange(options: UseReportDateRangeOptions = {}) {
  const { withDefault = true } = options

  function toDateParam(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  function defaultFrom(): string {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return toDateParam(d)
  }

  function defaultTo(): string {
    return toDateParam(new Date())
  }

  function formatDateRange(dates: Date[]): string {
    if (!dates || dates.length < 2) return ''
    const [from, to] = dates
    if (!from || !to) return ''
    const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
    return `${fmt(from)} - ${fmt(to)}`
  }

  const dateFromRef = ref<string>(withDefault ? defaultFrom() : '')
  const dateToRef = ref<string>(withDefault ? defaultTo() : '')
  const dateRange = ref<[string, string] | null>(
    withDefault ? [defaultFrom(), defaultTo()] : null
  )

  // After useUrlFilters() has hydrated the refs from the URL, mirror their
  // values back into the picker so the input displays the URL-provided range.
  function syncRangeFromRefs(): void {
    if (dateFromRef.value && dateToRef.value) {
      dateRange.value = [dateFromRef.value, dateToRef.value]
    }
  }

  watch(dateRange, (val) => {
    if (val && val[0] && val[1]) {
      dateFromRef.value = val[0]
      dateToRef.value = val[1]
    } else {
      dateFromRef.value = ''
      dateToRef.value = ''
    }
  })

  function resetToDefault(): void {
    dateRange.value = withDefault ? [defaultFrom(), defaultTo()] : null
  }

  function clearRange(): void {
    dateRange.value = null
  }

  return {
    dateFromRef,
    dateToRef,
    dateRange,
    toDateParam,
    defaultFrom,
    defaultTo,
    formatDateRange,
    syncRangeFromRefs,
    resetToDefault,
    clearRange
  }
}
