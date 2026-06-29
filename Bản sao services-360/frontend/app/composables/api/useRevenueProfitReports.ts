import type {
  RevenueProfitSummaryResource,
  RevenueProfitMonthlyResource,
  RevenueProfitByProjectResource,
  RevenueProfitByServiceCategoryResource,
  RevenueProfitReportSummary200,
  RevenueProfitReportMonthly200,
  RevenueProfitReportByProject200,
  RevenueProfitReportByServiceCategory200,
  RevenueProfitReportSummaryParams,
  RevenueProfitReportMonthlyParams,
  RevenueProfitReportByProjectParams,
  RevenueProfitReportByServiceCategoryParams
} from '#api/generated/laravel'

// ─── Re-export generated types for pages ───

export type {
  RevenueProfitMonthlyResource,
  RevenueProfitByProjectResource,
  RevenueProfitByServiceCategoryResource,
  RevenueProfitReportSummaryParams
}

// Tighten `insights` from `unknown[]` (Scramble can't infer item type) to `string[]`.
export type RevenueProfitSummary = Omit<RevenueProfitSummaryResource, 'insights'> & {
  insights: string[]
}

export type RevenueProfitSummaryResponse = Omit<RevenueProfitReportSummary200, 'data'> & {
  data: RevenueProfitSummary
}

// Filters shared across all four endpoints.
export type RevenueProfitFilters = RevenueProfitReportSummaryParams
  & RevenueProfitReportMonthlyParams
  & RevenueProfitReportByProjectParams
  & RevenueProfitReportByServiceCategoryParams

// ─── Queries ───

export function useRevenueProfitSummary(params?: MaybeRefOrGetter<RevenueProfitFilters>) {
  return useApiFetch<RevenueProfitSummaryResponse>('/pmc/reports/revenue-profit/summary', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useRevenueProfitMonthly(params?: MaybeRefOrGetter<RevenueProfitFilters>) {
  return useApiFetch<RevenueProfitReportMonthly200>('/pmc/reports/revenue-profit/monthly', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useRevenueProfitByProject(params?: MaybeRefOrGetter<RevenueProfitFilters>) {
  return useApiFetch<RevenueProfitReportByProject200>('/pmc/reports/revenue-profit/by-project', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useRevenueProfitByServiceCategory(params?: MaybeRefOrGetter<RevenueProfitFilters>) {
  return useApiFetch<RevenueProfitReportByServiceCategory200>(
    '/pmc/reports/revenue-profit/by-service-category',
    { query: params, watch: params ? [params] : undefined }
  )
}
