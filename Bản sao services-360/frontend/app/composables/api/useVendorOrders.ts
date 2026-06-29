// Vendor orders & PMC commission — đọc cross-DB từ resi_mart qua BE.
// Tenant-scoped: backend tự inject current tenant từ subdomain.

export type VendorOrderStatusValue = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type VendorOrderPaymentStatusValue = 'unpaid' | 'partially_paid' | 'paid' | 'refunded'

export interface VendorOrderEnumOption<V extends string = string> {
  value: V
  label: string
}

export interface VendorOrderCustomer {
  id: number
  name: string | null
  phone: string | null
  email?: string | null
}

export interface VendorOrderContact {
  name: string | null
  phone: string | null
  email: string | null
  apartment_code: string | null
  shipping_address: string | null
}

export interface VendorOrderAmounts {
  subtotal: number
  deposit_total: number
  shipping_fee: number
  discount_total: number
  total: number
  total_overridden: boolean
}

export interface VendorOrderTimeline {
  ordered_at: string | null
  confirmed_at: string | null
  completed_at: string | null
  cancelled_at: string | null
}

export interface VendorOrderItem {
  id: number
  item_type: string
  product_name: string
  variant_name: string | null
  sku: string
  cover_url: string | null
  quantity: number
  unit_price: number
  discount_amount: number
  subtotal: number
}

export interface VendorOrderCommissionFormula {
  fixed: number
  percent: number
  remainder_after_fixed: number
  percent_amount: number
  total: number
  capped_at_total: boolean
}

/** Nguồn hoa hồng hiển thị: theo hợp đồng, gán thủ công, hoặc mặc định 0đ. */
export type CommissionSource = 'contract' | 'manual' | 'default'

export interface VendorOrderCommission {
  contract: {
    id: number
    code: string
    mode: VendorOrderEnumOption<'per_order' | 'revenue_share' | 'subscription'>
    revenue_recipient?: VendorOrderEnumOption<'platform' | 'operating_company'>
  } | null
  is_manual: boolean
  source: CommissionSource
  override_id: number | null
  revenue_recipient: VendorOrderEnumOption<'platform' | 'operating_company'> | null
  applied_at: string | null
  formula: VendorOrderCommissionFormula
  amount: number
  currency: string
}

export interface VendorOrderListCommission {
  contract_id: number | null
  contract_code: string | null
  source: CommissionSource
  is_manual: boolean
  amount: number
  currency: string
}

export interface VendorOrderVendorRef {
  id: number
  name: string
  slug: string
}

export interface VendorOrderTenantRef {
  id: string
  name: string | null
}

export interface VendorOrderListItem {
  id: number
  code: string
  vendor: VendorOrderVendorRef | null
  tenant?: VendorOrderTenantRef | null
  project_id: number
  project_name: string
  customer: VendorOrderCustomer | null
  items_count: number
  first_item_name: string | null
  total: number
  status: VendorOrderEnumOption<VendorOrderStatusValue>
  completed_at: string | null
  commission: VendorOrderListCommission
}

export interface VendorOrderDetail {
  id: number
  code: string
  tenant?: VendorOrderTenantRef | null
  project: { id: number, name: string }
  customer: VendorOrderCustomer | null
  contact: VendorOrderContact
  status: VendorOrderEnumOption<VendorOrderStatusValue>
  payment_status: VendorOrderEnumOption<VendorOrderPaymentStatusValue>
  payment_method: string | null
  amounts: VendorOrderAmounts
  timeline: VendorOrderTimeline
  items: VendorOrderItem[]
  commission: VendorOrderCommission | null
}

export interface VendorOrderWarnings {
  orphan_orders_count: number
  non_per_order_orders_count: number
  schema_missing: boolean
}

export interface VendorOrderSummary {
  from: string
  to: string
  orders_count: number
  revenue_total: number
  commission_total: number
  average_commission_per_order: number
  currency: string
  vendors_count?: number
  warnings: VendorOrderWarnings
}

export interface ListVendorOrdersParams {
  from?: string
  to?: string
  project_id?: number
  search?: string
  page?: number
  per_page?: number
}

export interface ListPlatformVendorOrdersParams extends ListVendorOrdersParams {
  tenant_id?: string
}

export interface ListAllVendorOrdersParams extends ListVendorOrdersParams {
  partner_id?: number
}

interface ListResponse<T> {
  success: true
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from?: number | null
    to?: number | null
  }
  warnings?: VendorOrderWarnings
}

interface DetailResponse<T> {
  success: true
  data: T
}

function buildQuery(p: Record<string, unknown>): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(p)) {
    if (v === undefined || v === null || v === '') continue
    q.set(k, String(v))
  }
  return q.toString()
}

function partnerBase(partnerId: number | string): string {
  return `/pmc/partners/${partnerId}/orders`
}

export function useVendorOrderList(
  partnerId: MaybeRefOrGetter<number | string>,
  params: MaybeRefOrGetter<ListVendorOrdersParams> = () => ({})
) {
  const url = computed(() => {
    const qs = buildQuery(toValue(params) as Record<string, unknown>)
    return `${partnerBase(toValue(partnerId))}${qs ? `?${qs}` : ''}`
  })
  return useApiFetch<ListResponse<VendorOrderListItem>>(url, {
    watch: [() => toValue(partnerId), () => toValue(params)]
  })
}

export function useVendorOrderDetail(
  partnerId: MaybeRefOrGetter<number | string>,
  orderId: MaybeRefOrGetter<number | string | null | undefined>
) {
  const url = computed(() => {
    const oid = toValue(orderId)
    return oid ? `${partnerBase(toValue(partnerId))}/${oid}` : ''
  })
  return useApiFetch<DetailResponse<VendorOrderDetail>>(url, {
    immediate: false,
    watch: [() => toValue(partnerId), () => toValue(orderId)]
  })
}

export function useVendorOrderSummary(
  partnerId: MaybeRefOrGetter<number | string>,
  params: MaybeRefOrGetter<{ from?: string, to?: string }> = () => ({})
) {
  const url = computed(() => {
    const qs = buildQuery(toValue(params) as Record<string, unknown>)
    return `${partnerBase(toValue(partnerId))}/summary${qs ? `?${qs}` : ''}`
  })
  return useApiFetch<DetailResponse<VendorOrderSummary>>(url, {
    watch: [() => toValue(partnerId), () => toValue(params)]
  })
}

// ─── Aggregate: tất cả vendor của tenant ───────────────────────

const ALL_ORDERS_BASE = '/pmc/vendor-orders'

export function useAllVendorOrderList(
  params: MaybeRefOrGetter<ListAllVendorOrdersParams> = () => ({})
) {
  const url = computed(() => {
    const qs = buildQuery(toValue(params) as Record<string, unknown>)
    return `${ALL_ORDERS_BASE}${qs ? `?${qs}` : ''}`
  })
  return useApiFetch<ListResponse<VendorOrderListItem>>(url, {
    watch: [() => toValue(params)]
  })
}

export function useAllVendorOrderSummary(
  params: MaybeRefOrGetter<{ from?: string, to?: string, partner_id?: number, project_id?: number }> = () => ({})
) {
  const url = computed(() => {
    const qs = buildQuery(toValue(params) as Record<string, unknown>)
    return `${ALL_ORDERS_BASE}/summary${qs ? `?${qs}` : ''}`
  })
  return useApiFetch<DetailResponse<VendorOrderSummary>>(url, {
    watch: [() => toValue(params)]
  })
}

// ─── Platform scope: 1 vendor across MỌI PMC tenant ────────────

function platformPartnerBase(partnerId: number | string): string {
  return `/platform/partners/${partnerId}/orders`
}

export function usePlatformVendorOrderList(
  partnerId: MaybeRefOrGetter<number | string>,
  params: MaybeRefOrGetter<ListPlatformVendorOrdersParams> = () => ({})
) {
  const url = computed(() => {
    const qs = buildQuery(toValue(params) as Record<string, unknown>)
    return `${platformPartnerBase(toValue(partnerId))}${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<ListResponse<VendorOrderListItem>>(url, {
    watch: [() => toValue(partnerId), () => toValue(params)]
  })
}

export function usePlatformVendorOrderDetail(
  partnerId: MaybeRefOrGetter<number | string>,
  orderId: MaybeRefOrGetter<number | string | null | undefined>
) {
  const url = computed(() => {
    const oid = toValue(orderId)
    return oid ? `${platformPartnerBase(toValue(partnerId))}/${oid}` : ''
  })
  return usePlatformApiFetch<DetailResponse<VendorOrderDetail>>(url, {
    immediate: false,
    watch: [() => toValue(partnerId), () => toValue(orderId)]
  })
}

export function usePlatformVendorOrderSummary(
  partnerId: MaybeRefOrGetter<number | string>,
  params: MaybeRefOrGetter<{ from?: string, to?: string }> = () => ({})
) {
  const url = computed(() => {
    const qs = buildQuery(toValue(params) as Record<string, unknown>)
    return `${platformPartnerBase(toValue(partnerId))}/summary${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<DetailResponse<VendorOrderSummary>>(url, {
    watch: [() => toValue(partnerId), () => toValue(params)]
  })
}

// ─── Console gộp: ĐỌC-CHỈ cross-vendor + cross-tenant ───────────

export type VendorOrderTypeValue = 'product' | 'service' | 'mixed'

// Tái dùng `RevenueRecipientValue` từ composable hợp đồng (tránh trùng auto-import).
type RevenueRecipientValue = 'platform' | 'operating_company'

export interface VendorOrderConsoleListCommission {
  contract_id: number | null
  contract_code: string | null
  override_id: number | null
  is_manual: boolean
  source: CommissionSource
  amount: number
  currency: string
  revenue_recipient: VendorOrderEnumOption<RevenueRecipientValue>
}

export interface VendorOrderConsoleListItem {
  id: number
  code: string
  type: VendorOrderEnumOption<VendorOrderTypeValue>
  vendor: VendorOrderVendorRef | null
  tenant: VendorOrderTenantRef | null
  project_id: number
  project_name: string
  customer: VendorOrderCustomer | null
  customer_source: VendorOrderEnumOption | null
  items_count: number
  first_item_name: string | null
  total: number
  status: VendorOrderEnumOption<VendorOrderStatusValue>
  completed_at: string | null
  created_at: string | null
  commission: VendorOrderConsoleListCommission | null
  resident_rating: number | null
}

export interface VendorOrderConsoleSummary {
  from: string
  to: string
  orders_count: number
  product_count: number
  service_count: number
  gmv: number
  commission_platform: number
  commission_operating_company: number
  commission_total: number
  vendors_count: number
  currency: string
  warnings: VendorOrderWarnings
}

export interface ListVendorOrderConsoleParams {
  from?: string
  to?: string
  partner_id?: number
  tenant_id?: string
  project_id?: number
  type?: VendorOrderTypeValue
  status?: VendorOrderStatusValue
  search?: string
  page?: number
  per_page?: number
}

const CONSOLE_ORDERS_BASE = '/platform/vendor-orders'

export function usePlatformVendorOrderConsoleList(
  params: MaybeRefOrGetter<ListVendorOrderConsoleParams> = () => ({})
) {
  const url = computed(() => {
    const qs = buildQuery(toValue(params) as Record<string, unknown>)
    return `${CONSOLE_ORDERS_BASE}${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<ListResponse<VendorOrderConsoleListItem>>(url, {
    watch: [() => toValue(params)]
  })
}

export function usePlatformVendorOrderConsoleSummary(
  params: MaybeRefOrGetter<Omit<ListVendorOrderConsoleParams, 'page' | 'per_page'>> = () => ({})
) {
  const url = computed(() => {
    const qs = buildQuery(toValue(params) as Record<string, unknown>)
    return `${CONSOLE_ORDERS_BASE}/summary${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<DetailResponse<VendorOrderConsoleSummary>>(url, {
    watch: [() => toValue(params)]
  })
}

export type CommissionOverrideSource = 'contract' | 'manual'

export interface AssignCommissionOverridePayload {
  source: CommissionOverrideSource
  contract_id?: number
  fixed?: number
  percent?: number
  revenue_recipient?: RevenueRecipientValue
  note?: string | null
}

/** Gán/cập nhật hoa hồng thủ công cho 1 đơn vendor mồ côi. Trả về detail mới. */
export function apiAssignVendorOrderCommission(
  partnerId: number | string,
  orderId: number | string,
  payload: AssignCommissionOverridePayload
) {
  return $platformApi<DetailResponse<VendorOrderDetail>>(
    `/platform/partners/${partnerId}/orders/${orderId}/commission-override`,
    { method: 'PUT', body: payload }
  )
}

/** Gỡ hoa hồng gán thủ công khỏi 1 đơn vendor. */
export function apiRemoveVendorOrderCommission(
  partnerId: number | string,
  orderId: number | string
) {
  return $platformApi<{ success: true }>(
    `/platform/partners/${partnerId}/orders/${orderId}/commission-override`,
    { method: 'DELETE' }
  )
}

export interface UpdateVendorOrderStatusPayload {
  status: VendorOrderStatusValue
  reason?: string | null
}

/** Override trạng thái 1 đơn vendor (any→any) — ghi qua S2S resi_mart. Trả về detail mới. */
export function apiUpdateVendorOrderStatus(
  partnerId: number | string,
  orderId: number | string,
  payload: UpdateVendorOrderStatusPayload
) {
  return $platformApi<DetailResponse<VendorOrderDetail>>(
    `/platform/partners/${partnerId}/orders/${orderId}/status`,
    { method: 'PATCH', body: payload }
  )
}

export const VENDOR_ORDER_TYPE_OPTIONS: { value: VendorOrderTypeValue, label: string }[] = [
  { value: 'product', label: 'Sản phẩm' },
  { value: 'service', label: 'Dịch vụ' },
  { value: 'mixed', label: 'Hỗn hợp' }
]

/** Map trạng thái → token màu UBadge hợp lệ. */
export function vendorOrderStatusColor(value: VendorOrderStatusValue): 'warning' | 'info' | 'success' | 'error' {
  switch (value) {
    case 'confirmed': return 'info'
    case 'completed': return 'success'
    case 'cancelled': return 'error'
    default: return 'warning'
  }
}

/** "Thuộc về" hoa hồng → màu badge: Platform (success) / Công ty VH (primary). */
export function revenueRecipientColor(value: RevenueRecipientValue): 'success' | 'primary' {
  return value === 'operating_company' ? 'primary' : 'success'
}

/**
 * Suy ra loại đơn từ dòng đơn (trang chi tiết — resource detail không trả `type`).
 * Toàn dịch vụ → service, toàn sản phẩm → product, lẫn lộn → mixed.
 */
export function vendorOrderTypeOption(
  items: { item_type: string }[]
): VendorOrderEnumOption<VendorOrderTypeValue> {
  const hasService = items.some(i => i.item_type === 'service')
  const hasProduct = items.some(i => i.item_type !== 'service')
  const value: VendorOrderTypeValue = hasService && hasProduct
    ? 'mixed'
    : hasService ? 'service' : 'product'
  return { value, label: VENDOR_ORDER_TYPE_OPTIONS.find(o => o.value === value)?.label ?? 'Sản phẩm' }
}

export const VENDOR_ORDER_STATUS_OPTIONS: { value: VendorOrderStatusValue, label: string, color: string }[] = [
  { value: 'pending', label: 'Chờ xử lý', color: 'amber' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'info' },
  { value: 'completed', label: 'Hoàn thành', color: 'success' },
  { value: 'cancelled', label: 'Đã huỷ', color: 'error' }
]

export const VENDOR_ORDER_PAYMENT_STATUS_OPTIONS: { value: VendorOrderPaymentStatusValue, label: string }[] = [
  { value: 'unpaid', label: 'Chưa thanh toán' },
  { value: 'partially_paid', label: 'Thanh toán một phần' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'refunded', label: 'Đã hoàn' }
]
