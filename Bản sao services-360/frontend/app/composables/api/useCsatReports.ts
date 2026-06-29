import type {
  CsatSummaryResource,
  CsatTrendResource,
  CsatByProjectResource,
  CsatReportSummary200,
  CsatReportTrend200,
  CsatReportByProject200,
  CsatReportSummaryParams,
  CsatReportTrendParams,
  CsatReportByProjectParams
} from '#api/generated/laravel'

// ─── Re-export generated types for pages ───

export type {
  CsatSummaryResource,
  CsatTrendResource,
  CsatByProjectResource,
  CsatReportSummary200,
  CsatReportTrend200,
  CsatReportByProject200,
  CsatReportSummaryParams,
  CsatReportTrendParams,
  CsatReportByProjectParams
}

// ─── Queries ───

export function useCsatSummary(params?: MaybeRefOrGetter<CsatReportSummaryParams>) {
  return useApiFetch<CsatReportSummary200>('/pmc/reports/csat/summary', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useCsatTrend(params?: MaybeRefOrGetter<CsatReportTrendParams>) {
  return useApiFetch<CsatReportTrend200>('/pmc/reports/csat/trend', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useCsatByProject(params?: MaybeRefOrGetter<CsatReportByProjectParams>) {
  return useApiFetch<CsatReportByProject200>('/pmc/reports/csat/by-project', {
    query: params,
    watch: params ? [params] : undefined
  })
}
