import type {
  OperatingProfitSummaryResource,
  OperatingProfitMonthlyResource,
  OperatingProfitByProjectResource,
  OperatingProfitReportSummary200,
  OperatingProfitReportMonthly200,
  OperatingProfitReportByProject200,
  OperatingProfitReportSummaryParams,
  OperatingProfitReportMonthlyParams,
  OperatingProfitReportByProjectParams
} from '#api/generated/laravel'

export type {
  OperatingProfitMonthlyResource,
  OperatingProfitByProjectResource,
  OperatingProfitReportSummaryParams
}

export type OperatingProfitSummary = Omit<OperatingProfitSummaryResource, 'insights'> & {
  insights: string[]
}

export type OperatingProfitSummaryResponse = Omit<OperatingProfitReportSummary200, 'data'> & {
  data: OperatingProfitSummary
}

export type OperatingProfitFilters = OperatingProfitReportSummaryParams
  & OperatingProfitReportMonthlyParams
  & OperatingProfitReportByProjectParams

export function useOperatingProfitSummary(params?: MaybeRefOrGetter<OperatingProfitFilters>) {
  return useApiFetch<OperatingProfitSummaryResponse>('/pmc/reports/operating-profit/summary', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useOperatingProfitMonthly(params?: MaybeRefOrGetter<OperatingProfitFilters>) {
  return useApiFetch<OperatingProfitReportMonthly200>('/pmc/reports/operating-profit/monthly', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useOperatingProfitByProject(params?: MaybeRefOrGetter<OperatingProfitFilters>) {
  return useApiFetch<OperatingProfitReportByProject200>('/pmc/reports/operating-profit/by-project', {
    query: params,
    watch: params ? [params] : undefined
  })
}
