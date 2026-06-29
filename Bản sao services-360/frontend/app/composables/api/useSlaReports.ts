import type {
  SlaSummaryResource,
  SlaTrendResource,
  SlaByProjectResource,
  SlaByStaffResource,
  SlaByTicketResource,
  SlaReportSummary200,
  SlaReportTrend200,
  SlaReportByProject200,
  SlaReportByStaff200,
  SlaReportByTicket200,
  SlaReportSummaryParams,
  SlaReportTrendParams,
  SlaReportByProjectParams,
  SlaReportByStaffParams,
  SlaReportByTicketParams
} from '#api/generated/laravel'

// ─── Re-export generated types for pages ───

export type {
  SlaSummaryResource,
  SlaTrendResource,
  SlaByProjectResource,
  SlaByStaffResource,
  SlaByTicketResource,
  SlaReportSummary200,
  SlaReportTrend200,
  SlaReportByProject200,
  SlaReportByStaff200,
  SlaReportByTicket200,
  SlaReportSummaryParams,
  SlaReportByTicketParams
}

export type SlaReportParams = SlaReportSummaryParams & { page?: number }

// ─── Queries ───

export function useSlaSummary() {
  return useApiFetch<SlaReportSummary200>('/pmc/reports/sla/summary')
}

export function useSlaTrend(params?: MaybeRefOrGetter<SlaReportTrendParams>) {
  return useApiFetch<SlaReportTrend200>('/pmc/reports/sla/trend', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useSlaByProject(params: MaybeRefOrGetter<SlaReportByProjectParams>) {
  return useApiFetch<SlaReportByProject200>('/pmc/reports/sla/by-project', {
    query: params,
    watch: [params]
  })
}

export function useSlaByStaff(params: MaybeRefOrGetter<SlaReportByStaffParams>) {
  return useApiFetch<SlaReportByStaff200>('/pmc/reports/sla/by-staff', {
    query: params,
    watch: [params]
  })
}

export function useSlaByTicket(params: MaybeRefOrGetter<SlaReportByTicketParams & { page?: number }>) {
  return useApiFetch<SlaReportByTicket200>('/pmc/reports/sla/by-ticket', {
    query: params,
    watch: [params]
  })
}
