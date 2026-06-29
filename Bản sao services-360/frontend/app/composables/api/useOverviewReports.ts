import type {
  OverviewSummaryResource,
  OverviewReportSummary200,
  OverviewReportSummaryParams
} from '#api/generated/laravel'

// ─── Re-export generated types for pages ───

export type {
  OverviewSummaryResource,
  OverviewReportSummary200,
  OverviewReportSummaryParams
}

// ─── Queries ───

export function useOverviewSummary(params?: MaybeRefOrGetter<OverviewReportSummaryParams>) {
  return useApiFetch<OverviewReportSummary200>('/pmc/reports/overview/summary', {
    query: params,
    watch: params ? [params] : undefined
  })
}
