// Đơn hàng OG (đơn dịch vụ vận hành sinh từ ticket OG) — console Platform
// ĐỌC-CHỈ gộp cross-tenant. Backend lặp mọi công ty vận hành, đọc đơn trong
// schema từng tenant rồi gom + phân trang trong bộ nhớ.

export type OgOrderStatusValue = 'draft' | 'confirmed' | 'in_progress' | 'accepted' | 'completed' | 'cancelled'

export interface OgOrderEnumOption<V extends string = string> {
  value: V
  label: string
}

export interface OgOrderTenantRef {
  id: string
  name: string
}

export interface OgOrderConsoleListItem {
  id: number
  code: string
  subject: string | null
  project_id: number | null
  project_name: string | null
  customer_name: string | null
  customer_phone: string | null
  total_amount: string
  platform_fee: string
  status: OgOrderEnumOption<OgOrderStatusValue>
  created_at: string | null
  completed_at: string | null
  tenant: OgOrderTenantRef | null
}

export interface OgOrderWarnings {
  tenants_failed: number
}

export interface OgOrderConsoleSummary {
  from: string
  to: string
  orders_count: number
  gmv: number
  platform_fee: number
  tenants_count: number
  currency: string
  warnings: OgOrderWarnings
}

export interface ListOgOrderConsoleParams {
  from?: string
  to?: string
  tenant_id?: string
  status?: OgOrderStatusValue
  search?: string
  page?: number
  per_page?: number
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
  warnings?: OgOrderWarnings
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

const OG_ORDERS_BASE = '/platform/og-orders'

export function usePlatformOgOrderConsoleList(
  params: MaybeRefOrGetter<ListOgOrderConsoleParams> = () => ({})
) {
  const url = computed(() => {
    const qs = buildQuery(toValue(params) as Record<string, unknown>)
    return `${OG_ORDERS_BASE}${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<ListResponse<OgOrderConsoleListItem>>(url, {
    watch: [() => toValue(params)]
  })
}

export function usePlatformOgOrderConsoleSummary(
  params: MaybeRefOrGetter<Omit<ListOgOrderConsoleParams, 'page' | 'per_page'>> = () => ({})
) {
  const url = computed(() => {
    const qs = buildQuery(toValue(params) as Record<string, unknown>)
    return `${OG_ORDERS_BASE}/summary${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<DetailResponse<OgOrderConsoleSummary>>(url, {
    watch: [() => toValue(params)]
  })
}

/** Map trạng thái đơn OG → token màu UBadge hợp lệ. */
export function ogOrderStatusColor(
  value: OgOrderStatusValue
): 'neutral' | 'warning' | 'info' | 'success' | 'error' {
  switch (value) {
    case 'draft': return 'neutral'
    case 'confirmed': return 'info'
    case 'in_progress': return 'warning'
    case 'accepted': return 'info'
    case 'completed': return 'success'
    case 'cancelled': return 'error'
    default: return 'neutral'
  }
}

export const OG_ORDER_STATUS_OPTIONS: { value: OgOrderStatusValue, label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'in_progress', label: 'Đang thực hiện' },
  { value: 'accepted', label: 'Đã nghiệm thu' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
]
