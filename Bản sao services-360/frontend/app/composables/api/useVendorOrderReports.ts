import type {
  VendorOrderReportSummaryResource,
  VendorOrderReportByVendorResource,
  VendorOrderReportByProjectResource,
  VendorOrderReportTrendResource,
  VendorOrderReportSummary200,
  VendorOrderReportByVendor200,
  VendorOrderReportByProject200,
  VendorOrderReportTrend200,
  VendorOrderReportSummaryParams,
  VendorOrderReportByVendorParams,
  VendorOrderReportByProjectParams,
  VendorOrderReportTrendParams
} from '#api/generated/laravel'

// ─── Re-export generated types for pages ───

export type {
  VendorOrderReportSummaryResource,
  VendorOrderReportByVendorResource,
  VendorOrderReportByProjectResource,
  VendorOrderReportTrendResource,
  VendorOrderReportSummary200,
  VendorOrderReportByVendor200,
  VendorOrderReportByProject200,
  VendorOrderReportTrend200,
  VendorOrderReportSummaryParams,
  VendorOrderReportByVendorParams,
  VendorOrderReportByProjectParams,
  VendorOrderReportTrendParams
}

// ─── Queries ───

export function useVendorOrderReportSummary(params?: MaybeRefOrGetter<VendorOrderReportSummaryParams>) {
  return useApiFetch<VendorOrderReportSummary200>('/pmc/reports/vendor-order/summary', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useVendorOrderReportByVendor(params?: MaybeRefOrGetter<VendorOrderReportByVendorParams>) {
  return useApiFetch<VendorOrderReportByVendor200>('/pmc/reports/vendor-order/by-vendor', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useVendorOrderReportByProject(params?: MaybeRefOrGetter<VendorOrderReportByProjectParams>) {
  return useApiFetch<VendorOrderReportByProject200>('/pmc/reports/vendor-order/by-project', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useVendorOrderReportTrend(params?: MaybeRefOrGetter<VendorOrderReportTrendParams>) {
  return useApiFetch<VendorOrderReportTrend200>('/pmc/reports/vendor-order/trend', {
    query: params,
    watch: params ? [params] : undefined
  })
}
