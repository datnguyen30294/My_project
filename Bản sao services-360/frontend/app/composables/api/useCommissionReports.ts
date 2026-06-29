import type {
  CommissionSummaryResource,
  CommissionByStaffResource,
  CommissionReportSummary200,
  CommissionReportByStaff200,
  CommissionReportSummaryParams,
  CommissionReportByStaffParams
} from '#api/generated/laravel'

// ─── Re-export generated types for pages ───

export type {
  CommissionSummaryResource,
  CommissionByStaffResource,
  CommissionReportSummary200,
  CommissionReportByStaff200,
  CommissionReportSummaryParams,
  CommissionReportByStaffParams
}

// ─── Queries ───

export function useCommissionReportSummary(params?: MaybeRefOrGetter<CommissionReportSummaryParams>) {
  return useApiFetch<CommissionReportSummary200>('/pmc/reports/commission/summary', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useCommissionReportByStaff(params?: MaybeRefOrGetter<CommissionReportByStaffParams>) {
  return useApiFetch<CommissionReportByStaff200>('/pmc/reports/commission/by-staff', {
    query: params,
    watch: params ? [params] : undefined
  })
}
