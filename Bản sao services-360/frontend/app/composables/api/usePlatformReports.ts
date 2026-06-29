/**
 * API composable cho cụm "Báo cáo tổng hợp" platform (8 endpoint read-only,
 * tổng hợp cross-tenant). Mọi URL của cụm định nghĩa tại đây — page KHÔNG gọi
 * `useApiFetch`/`$fetch` với URL thô.
 *
 * BE trả `{ success, data }`, key snake_case, tiền là số nguyên đồng (VND),
 * enum dạng `{ value, label }`, tỷ lệ (%) là số nguyên đã làm tròn. Các endpoint
 * này build mảng thủ công trong Service (không qua Eloquent Resource) nên type
 * khai báo tay tại đây thay vì dùng Orval generated.
 */

// ─── Shared shapes ────────────────────────────────────────────────

export interface ReportEnum {
  value: string
  label: string
}

interface ApiData<T> {
  success: boolean
  data: T
}

export interface ReportParams {
  months?: number
}

/**
 * Dựng URL kèm query string từ tham số (bỏ qua giá trị rỗng). URL là computed
 * nên `usePlatformApiFetch` tự refetch khi đổi kỳ/bộ lọc — không cần `watch`.
 */
function buildReportUrl(path: string, params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  }
  const qs = query.toString()
  return qs ? `${path}?${qs}` : path
}

// ─── #0 Hub — overview ────────────────────────────────────────────

export interface ReportOverviewKpis {
  total_platform_revenue: number
  marketplace_gmv: number
  avg_rating: number
  rated_count: number
  active_residents: number
  total_residents: number
  vendor_count: number
  tenant_count: number
}

export interface ReportCard {
  key: string
  route: string
  title: string
  blurb: string
  kpi: number
  sub: string
}

export interface ReportOverview {
  kpis: ReportOverviewKpis
  report_cards: ReportCard[]
}

export function useReportOverview(params: MaybeRefOrGetter<ReportParams>) {
  const url = computed(() => buildReportUrl('/platform/reports/overview', { months: toValue(params).months }))
  return usePlatformApiFetch<ApiData<ReportOverview>>(url)
}

// ─── #1 Doanh thu — revenue ───────────────────────────────────────

export interface RevenueReportKpis {
  total_platform_revenue: number
  pmc_platform_fee: number
  marketplace_gmv: number
  order_count: number
  marketplace_platform_fee: number
  marketplace_vh_share: number
}

export interface RevenueByTenant {
  company_id: string
  company_name: string
  status: ReportEnum
  project_count: number
  order_count: number
  tenant_revenue: number
  platform_revenue: number
}

export interface RevenueAnalyticsMonth {
  month: string
  month_label: string
  order_count: number
  tenant_revenue: number
  platform_revenue: number
}

export interface RevenueReport {
  kpis: RevenueReportKpis
  by_tenant: RevenueByTenant[]
  analytics_months: RevenueAnalyticsMonth[]
  monthly_marketplace: { month: string, month_label: string, gmv: number, platform_fee: number }[]
}

export function useRevenueReport(params: MaybeRefOrGetter<ReportParams>) {
  const url = computed(() => buildReportUrl('/platform/reports/revenue', { months: toValue(params).months }))
  return usePlatformApiFetch<ApiData<RevenueReport>>(url)
}

// ─── #2 Chất lượng & CSAT — csat ──────────────────────────────────

export interface CsatReportKpis {
  avg_rating: number | null
  rated_count: number
  total_orders: number
  completion_rate: number
  cancel_rate: number
  response_rate: number
}

export interface CsatStarBucket {
  star: number
  count: number
}

export interface CsatByVendor {
  partner_id: number
  partner_name: string
  order_count: number
  completed_count: number
  cancel_count: number
  avg_rating: number | null
  rated_count: number
}

export interface CsatByProject {
  project_id: number
  project_name: string
  order_count: number
  avg_rating: number | null
  rated_count: number
}

export interface CsatLowRating {
  partner_name: string
  project_name: string
  resident_name: string | null
  resident_rating: number
  resident_rating_comment: string | null
}

export interface CsatReport {
  kpis: CsatReportKpis
  star_buckets: CsatStarBucket[]
  by_vendor: CsatByVendor[]
  by_project: CsatByProject[]
  low_ratings: CsatLowRating[]
  warnings: { schema_missing: boolean, skipped_orders: number }
}

export function useCsatReport(params: MaybeRefOrGetter<ReportParams>) {
  const url = computed(() => buildReportUrl('/platform/reports/csat', { months: toValue(params).months }))
  return usePlatformApiFetch<ApiData<CsatReport>>(url)
}

// ─── #3 Xu hướng dịch vụ — service-adoption ───────────────────────

export interface ServiceAdoptionKpis {
  total_offers: number
  top_offer: { title: string, order_count: number } | null
  product_share: number
  service_share: number
}

export interface ServiceAdoptionByType {
  type: ReportEnum
  order_count: number
  gmv: number
}

export interface ServiceAdoptionOffer {
  title: string
  type: ReportEnum
  partner_name: string
  order_count: number
  gmv: number
}

export interface ServiceAdoptionMonth {
  month: string
  month_label: string
  order_count: number
  product_count: number
  service_count: number
  gmv: number
}

export interface ServiceAdoptionReport {
  kpis: ServiceAdoptionKpis
  by_type: ServiceAdoptionByType[]
  offers: ServiceAdoptionOffer[]
  monthly: ServiceAdoptionMonth[]
}

export function useServiceAdoptionReport(params: MaybeRefOrGetter<ReportParams>) {
  const url = computed(() => buildReportUrl('/platform/reports/service-adoption', { months: toValue(params).months }))
  return usePlatformApiFetch<ApiData<ServiceAdoptionReport>>(url)
}

// ─── #4 Phân khúc cư dân — resident-segments ──────────────────────

export interface ResidentSegmentKpis {
  active_residents: number
  total_residents: number
  project_order_share: number
  walk_in_order_share: number
  project_gmv: number
  walk_in_gmv: number
}

export interface ResidentSegment {
  source: ReportEnum
  order_count: number
  gmv: number
  avg_rating: number | null
  rated_count: number
}

export interface ResidentSegmentTopResident {
  resident_name: string | null
  order_count: number
  gmv: number
  avg_rating: number | null
  rated_count: number
}

export interface ResidentSegmentReport {
  kpis: ResidentSegmentKpis
  segments: ResidentSegment[]
  top_residents: ResidentSegmentTopResident[]
}

export function useResidentSegmentReport(params: MaybeRefOrGetter<ReportParams>) {
  const url = computed(() => buildReportUrl('/platform/reports/resident-segments', { months: toValue(params).months }))
  return usePlatformApiFetch<ApiData<ResidentSegmentReport>>(url)
}

// ─── #5 Sức khỏe tenant & dự án — tenant-health ───────────────────

export interface TenantHealthParams extends ReportParams {
  company_id?: string
}

export interface TenantHealthByCompany {
  company_id: string
  company_name: string
  status: ReportEnum
  project_count: number
  order_count: number
  revenue: number
  platform_fee: number
  avg_rating: number | null
  rated_count: number
  last_month_orders: number
  order_trend: number
}

export interface TenantHealthByProject {
  project_id: number
  project_name: string
  company_name: string
  order_count: number
  revenue: number
  platform_fee: number
  avg_rating: number | null
  rated_count: number
}

export interface TenantHealthReport {
  by_company: TenantHealthByCompany[]
  by_project: TenantHealthByProject[]
}

export function useTenantHealthReport(params: MaybeRefOrGetter<TenantHealthParams>) {
  const url = computed(() => {
    const p = toValue(params)
    return buildReportUrl('/platform/reports/tenant-health', { months: p.months, company_id: p.company_id })
  })
  return usePlatformApiFetch<ApiData<TenantHealthReport>>(url)
}

// ─── #6 Hoa hồng & phân bổ — commission-allocation ────────────────

export interface CommissionAllocationKpis {
  commission_total: number
  platform_total: number
  vh_total: number
  platform_share_pct: number
  vh_share_pct: number
}

export interface CommissionByRecipient {
  recipient_id: string
  label: string
  order_count: number
  amount: number
}

export interface CommissionByVendor {
  partner_id: number
  partner_name: string
  order_count: number
  gmv: number
  commission: number
  platform_share: number
  vh_share: number
}

export interface CommissionByProject {
  project_id: number
  project_name: string
  order_count: number
  platform_share: number
  vh_share: number
}

export interface CommissionAllocationReport {
  kpis: CommissionAllocationKpis
  by_recipient: CommissionByRecipient[]
  by_vendor: CommissionByVendor[]
  by_project: CommissionByProject[]
  warnings: { schema_missing: boolean, skipped_orders: number }
}

export function useCommissionAllocationReport(params: MaybeRefOrGetter<ReportParams>) {
  const url = computed(() => buildReportUrl('/platform/reports/commission-allocation', { months: toValue(params).months }))
  return usePlatformApiFetch<ApiData<CommissionAllocationReport>>(url)
}

// ─── #7 Hiệu suất vendor — vendor-scorecard ───────────────────────

export interface VendorScorecardRow {
  partner_id: number
  partner_name: string
  status: ReportEnum
  order_count: number
  active_count: number
  completed_count: number
  cancel_count: number
  completion_rate: number
  cancel_rate: number
  gmv: number
  commission: number
  platform_fee: number
  avg_rating: number | null
  rated_count: number
  product_count: number
  service_count: number
}

export interface VendorScorecardReport {
  months: number
  vendors: VendorScorecardRow[]
}

export function useVendorScorecardReport(params: MaybeRefOrGetter<ReportParams>) {
  const url = computed(() => buildReportUrl('/platform/reports/vendor-scorecard', { months: toValue(params).months }))
  return usePlatformApiFetch<ApiData<VendorScorecardReport>>(url)
}
