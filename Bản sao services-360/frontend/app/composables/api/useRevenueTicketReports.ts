import type {
  RevenueTicketSummaryResource,
  RevenueTicketByCategoryResource,
  RevenueTicketByStaffResource,
  RevenueTicketDailyResource,
  RevenueTicketDetailResource,
  RevenueTicketReportSummary200,
  RevenueTicketReportByCategory200,
  RevenueTicketReportByStaff200,
  RevenueTicketReportDaily200,
  RevenueTicketReportDetails200,
  RevenueTicketReportSummaryParams,
  RevenueTicketReportByCategoryParams,
  RevenueTicketReportByStaffParams,
  RevenueTicketReportDailyParams,
  RevenueTicketReportDetailsParams
} from '#api/generated/laravel'

// ─── Re-export generated types for pages ───

export type {
  RevenueTicketSummaryResource,
  RevenueTicketByCategoryResource,
  RevenueTicketByStaffResource,
  RevenueTicketDailyResource,
  RevenueTicketDetailResource,
  RevenueTicketReportSummary200,
  RevenueTicketReportByCategory200,
  RevenueTicketReportByStaff200,
  RevenueTicketReportDaily200,
  RevenueTicketReportDetails200,
  RevenueTicketReportSummaryParams,
  RevenueTicketReportByCategoryParams,
  RevenueTicketReportByStaffParams,
  RevenueTicketReportDailyParams,
  RevenueTicketReportDetailsParams
}

// ─── Queries ───

export function useRevenueTicketSummary(params?: MaybeRefOrGetter<RevenueTicketReportSummaryParams>) {
  return useApiFetch<RevenueTicketReportSummary200>('/pmc/reports/revenue-ticket/summary', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useRevenueTicketByCategory(params?: MaybeRefOrGetter<RevenueTicketReportByCategoryParams>) {
  return useApiFetch<RevenueTicketReportByCategory200>('/pmc/reports/revenue-ticket/by-category', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useRevenueTicketByStaff(params?: MaybeRefOrGetter<RevenueTicketReportByStaffParams>) {
  return useApiFetch<RevenueTicketReportByStaff200>('/pmc/reports/revenue-ticket/by-staff', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useRevenueTicketDaily(params?: MaybeRefOrGetter<RevenueTicketReportDailyParams>) {
  return useApiFetch<RevenueTicketReportDaily200>('/pmc/reports/revenue-ticket/daily', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useRevenueTicketDetails(params?: MaybeRefOrGetter<RevenueTicketReportDetailsParams>) {
  return useApiFetch<RevenueTicketReportDetails200>('/pmc/reports/revenue-ticket/details', {
    query: params,
    watch: params ? [params] : undefined
  })
}
