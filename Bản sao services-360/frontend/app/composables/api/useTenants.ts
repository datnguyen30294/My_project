import type {
  OrganizationListResource,
  OrganizationDetailResource,
  OrganizationIndex200,
  OrganizationIndexParams,
  OrganizationStats200,
  OrganizationStore201,
  OrganizationShow200,
  OrganizationUpdate200,
  OrganizationDestroy200,
  OrganizationToggleActive200,
  OrganizationUpdateConfig200,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  UpdateTenantConfigRequest,
  TenantConfigResource,
  TenantProjectResource,
  TenantProjectIndex200,
  TenantProjectIndexParams,
  TenantResidentRatingResource,
  TenantResidentRatingIndex200,
  TenantResidentRatingIndexParams
} from '#api/generated/laravel'
import { ServicePlan, TenantFeeMode, SubscriptionCycle, UpdateTenantConfigRequestEnabledModulesItem as TenantModule } from '#api/generated/laravel'

export type {
  OrganizationListResource,
  OrganizationDetailResource,
  OrganizationIndexParams,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  UpdateTenantConfigRequest,
  TenantConfigResource,
  TenantProjectResource,
  TenantProjectIndexParams,
  TenantResidentRatingResource,
  TenantResidentRatingIndexParams
}

export { ServicePlan, TenantFeeMode, SubscriptionCycle, TenantModule }

export interface TenantFormPayload {
  id?: string
  name: string
  tax_code: string | null
  representative_name: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  service_plan: CreateOrganizationRequest['service_plan']
  notes: string | null
  domains: string[]
}

export const SERVICE_PLAN_OPTIONS = [
  { value: ServicePlan.starter, label: 'Starter' },
  { value: ServicePlan.business, label: 'Business' },
  { value: ServicePlan.enterprise, label: 'Enterprise' }
] as const

export const TENANT_FEE_MODE_OPTIONS = [
  { value: TenantFeeMode.none, label: 'Không thu', description: 'Tenant không bị tính phí nền tảng theo đơn hàng.' },
  { value: TenantFeeMode.subscription, label: 'Thu theo gói tháng/năm', description: 'Thu phí cố định theo chu kỳ gói, không tính thêm trên từng đơn.' },
  { value: TenantFeeMode.fixed_per_order, label: 'Thu tiền mặt theo đơn hàng', description: 'Mỗi đơn hàng thu một khoản cố định (đ/đơn).' },
  { value: TenantFeeMode.percent_per_order, label: 'Thu theo % đơn hàng', description: 'Mỗi đơn hàng thu theo phần trăm giá trị đơn.' },
  { value: TenantFeeMode.both, label: 'Thu theo cả 2', description: 'Vừa thu cố định/đơn vừa thu % trên giá trị đơn hàng.' }
] as const

export const TENANT_SUBSCRIPTION_CYCLE_OPTIONS = [
  { value: SubscriptionCycle.monthly, label: 'Theo tháng' },
  { value: SubscriptionCycle.yearly, label: 'Theo năm' }
] as const

export const TENANT_MODULE_OPTIONS = [
  { value: TenantModule.hrm, label: 'HRM', description: 'Quản lý tài khoản, phòng ban, chức danh, dự án', icon: 'i-lucide-users' },
  { value: TenantModule['quan-ly-ticket'], label: 'Quản lý ticket', description: 'Tiếp nhận và xử lý yêu cầu của cư dân', icon: 'i-lucide-ticket' },
  { value: TenantModule['quan-ly-cong-viec'], label: 'Quản lý công việc', description: 'Phân ca, lịch làm việc, điều phối nhân sự', icon: 'i-lucide-calendar-check' },
  { value: TenantModule['quan-ly-don-hang'], label: 'Quản lý đơn hàng', description: 'Báo giá, đơn hàng dịch vụ, nghiệm thu', icon: 'i-lucide-shopping-cart' },
  { value: TenantModule['kho-va-dich-vu'], label: 'Kho và dịch vụ', description: 'Danh mục vật tư, nhà cung cấp, dịch vụ', icon: 'i-lucide-package' },
  { value: TenantModule['ke-toan-tai-chinh'], label: 'Kế toán tài chính', description: 'Công nợ, thu chi, đối soát, kỳ khoá sổ', icon: 'i-lucide-wallet' },
  { value: TenantModule['bao-cao'], label: 'Báo cáo', description: 'Báo cáo vận hành, doanh thu, SLA, CSAT', icon: 'i-lucide-bar-chart-3' },
  { value: TenantModule['cai-dat'], label: 'Cài đặt', description: 'Cấu hình hệ thống, hoa hồng, chính sách', icon: 'i-lucide-settings' }
] as const

export function usePlatformTenantList(params: MaybeRefOrGetter<OrganizationIndexParams & { page?: number }>) {
  const url = computed(() => {
    const p = toValue(params)
    const query = new URLSearchParams()
    if (p.search) query.set('search', p.search)
    if (p.is_active !== undefined && p.is_active !== null) query.set('is_active', p.is_active ? '1' : '0')
    if (p.service_plan) query.set('service_plan', p.service_plan)
    if (p.sort_by) query.set('sort_by', p.sort_by)
    if (p.sort_direction) query.set('sort_direction', p.sort_direction)
    if (p.page) query.set('page', String(p.page))
    if (p.per_page) query.set('per_page', String(p.per_page))
    const qs = query.toString()
    return `/platform/tenants${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<OrganizationIndex200>(url)
}

export function usePlatformTenantStats() {
  return usePlatformApiFetch<OrganizationStats200>('/platform/tenants/stats')
}

export function usePlatformTenantDetail(id: MaybeRefOrGetter<string>) {
  const url = computed(() => `/platform/tenants/${toValue(id)}`)
  return usePlatformApiFetch<OrganizationShow200>(url)
}

export function useTenantProjects(
  tenantId: MaybeRefOrGetter<string>,
  params: MaybeRefOrGetter<TenantProjectIndexParams & { page?: number }>
) {
  const url = computed(() => {
    const id = toValue(tenantId)
    const p = toValue(params)
    const query = new URLSearchParams()
    if (p.search) query.set('search', p.search)
    if (p.status) query.set('status', p.status)
    if (p.sort_by) query.set('sort_by', p.sort_by)
    if (p.sort_direction) query.set('sort_direction', p.sort_direction)
    if (p.page) query.set('page', String(p.page))
    if (p.per_page) query.set('per_page', String(p.per_page))
    const qs = query.toString()
    return `/platform/tenants/${id}/projects${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<TenantProjectIndex200>(url)
}

export function useTenantResidentRatings(
  tenantId: MaybeRefOrGetter<string>,
  params: MaybeRefOrGetter<TenantResidentRatingIndexParams>
) {
  const url = computed(() => {
    const id = toValue(tenantId)
    const p = toValue(params)
    const query = new URLSearchParams()
    if (p.rating) query.set('rating', String(p.rating))
    if (p.page) query.set('page', String(p.page))
    if (p.per_page) query.set('per_page', String(p.per_page))
    const qs = query.toString()
    return `/platform/tenants/${id}/resident-ratings${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<TenantResidentRatingIndex200>(url)
}

export interface TenantBusinessSummaryMonth {
  month: string
  label: string
  order_count: number
  tenant_revenue: number
  platform_fee: number
}

export interface TenantBusinessSummaryData {
  summary: {
    tenant_revenue: number
    order_count: number
    platform_revenue: number
  }
  months: TenantBusinessSummaryMonth[]
}

export interface TenantBusinessSummaryResponse {
  success: boolean
  data: TenantBusinessSummaryData
}

export function useTenantBusinessSummary(tenantId: MaybeRefOrGetter<string>, months = 6) {
  const url = computed(() => `/platform/tenants/${toValue(tenantId)}/business-summary?months=${months}`)
  return usePlatformApiFetch<TenantBusinessSummaryResponse>(url)
}

export function apiGetTenant(id: string) {
  return $platformApi<OrganizationShow200>(`/platform/tenants/${id}`)
}

export function apiCreateTenant(data: CreateOrganizationRequest) {
  return $platformApi<OrganizationStore201>('/platform/tenants', {
    method: 'POST',
    body: data
  })
}

export function apiUpdateTenant(id: string, data: UpdateOrganizationRequest) {
  return $platformApi<OrganizationUpdate200>(`/platform/tenants/${id}`, {
    method: 'PUT',
    body: data
  })
}

export function apiDeleteTenant(id: string) {
  return $platformApi<OrganizationDestroy200>(`/platform/tenants/${id}`, {
    method: 'DELETE'
  })
}

export function apiToggleTenantVendorFeature(id: string, isVendorEnabled: boolean) {
  return $platformApi<OrganizationShow200>(`/platform/tenants/${id}/vendor-feature`, {
    method: 'PUT',
    body: { is_vendor_enabled: isVendorEnabled }
  })
}

export function apiToggleTenantActive(id: string, isActive: boolean) {
  return $platformApi<OrganizationToggleActive200>(`/platform/tenants/${id}/toggle-active`, {
    method: 'PUT',
    body: { is_active: isActive }
  })
}

export function apiUpdateTenantConfig(id: string, data: UpdateTenantConfigRequest) {
  return $platformApi<OrganizationUpdateConfig200>(`/platform/tenants/${id}/config`, {
    method: 'PUT',
    body: data
  })
}
