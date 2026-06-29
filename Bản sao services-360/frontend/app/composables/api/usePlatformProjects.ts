import type {
  PlatformProjectListResource,
  PlatformProjectDetailResource,
  ProjectOrderResource,
  ProjectFeeConfigResource,
  ListPlatformProjectIndex200,
  ListPlatformProjectIndex200Stats,
  ListPlatformProjectIndexParams,
  PlatformProjectOrderIndex200,
  PlatformProjectOrderIndexParams,
  PlatformProjectResidentRatingIndex200,
  PlatformProjectResidentRatingIndexParams,
  PlatformProjectFeeConfigShow200,
  PlatformProjectFeeConfigUpdate200,
  PlatformProjectStore201,
  PlatformProjectShow200,
  CreatePlatformProjectRequest,
  UpdateProjectFeeConfigRequest
} from '#api/generated/laravel'
import { CreatePlatformProjectRequestStatus as ProjectStatus } from '#api/generated/laravel'
import type { TenantBusinessSummaryResponse } from '~/composables/api/useTenants'

export type {
  PlatformProjectListResource,
  PlatformProjectDetailResource,
  ProjectOrderResource,
  ProjectFeeConfigResource,
  ListPlatformProjectIndex200Stats,
  ListPlatformProjectIndexParams,
  PlatformProjectOrderIndexParams,
  PlatformProjectResidentRatingIndexParams,
  CreatePlatformProjectRequest,
  UpdateProjectFeeConfigRequest
}

export { ProjectStatus }

export const PROJECT_STATUS_OPTIONS = [
  { value: ProjectStatus.managing, label: 'Đang quản lý' },
  { value: ProjectStatus.stopped, label: 'Đã dừng' }
] as const

/**
 * Payload riêng cho form tạo dự án ở cổng platform: kèm `organization_id`
 * (công ty vận hành sẽ chứa dự án) để biết ghi vào schema tenant nào.
 */
export interface CreatePlatformProjectPayload extends CreatePlatformProjectRequest {
  organization_id: string
}

/**
 * Vendor (đối tác resi_mart) hoạt động trên 1 dự án nền tảng. Endpoint trả
 * dạng tổng hợp (gồm số gói/số đơn đọc cross-DB), nên type khai báo thủ công
 * theo tiền lệ `TenantBusinessSummaryResponse`.
 */
export interface ProjectVendorResource {
  partner_id: number
  code: string
  name: string
  status: { value: string, label: string }
  enabled: boolean
  offer_count: number
  order_count: number
}

export interface ProjectVendorListResponse {
  success: boolean
  data: ProjectVendorResource[]
  stats: { total: number, enabled_count: number }
  warnings: { schema_missing: boolean }
}

// ─── Queries ──────────────────────────────────────────────────────

export function useListPlatformProjects(
  params: MaybeRefOrGetter<ListPlatformProjectIndexParams & { page?: number }>
) {
  const url = computed(() => {
    const p = toValue(params)
    const query = new URLSearchParams()
    if (p.search) query.set('search', p.search)
    if (p.status) query.set('status', p.status)
    if (p.organization_id) query.set('organization_id', p.organization_id)
    if (p.platform_service_enabled !== undefined && p.platform_service_enabled !== null) {
      query.set('platform_service_enabled', p.platform_service_enabled ? '1' : '0')
    }
    if (p.sort_by) query.set('sort_by', p.sort_by)
    if (p.sort_direction) query.set('sort_direction', p.sort_direction)
    if (p.page) query.set('page', String(p.page))
    if (p.per_page) query.set('per_page', String(p.per_page))
    const qs = query.toString()
    return `/platform/projects${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<ListPlatformProjectIndex200>(url)
}

export function usePlatformProjectDetail(
  tenantId: MaybeRefOrGetter<string>,
  projectId: MaybeRefOrGetter<string | number>
) {
  const url = computed(() => `/platform/tenants/${toValue(tenantId)}/projects/${toValue(projectId)}`)
  return usePlatformApiFetch<PlatformProjectShow200>(url)
}

export function useProjectBusinessSummary(
  tenantId: MaybeRefOrGetter<string>,
  projectId: MaybeRefOrGetter<string | number>,
  months = 6
) {
  const url = computed(
    () => `/platform/tenants/${toValue(tenantId)}/projects/${toValue(projectId)}/business-summary?months=${months}`
  )
  return usePlatformApiFetch<TenantBusinessSummaryResponse>(url)
}

export function useProjectOrders(
  tenantId: MaybeRefOrGetter<string>,
  projectId: MaybeRefOrGetter<string | number>,
  params: MaybeRefOrGetter<PlatformProjectOrderIndexParams & { page?: number }>
) {
  const url = computed(() => {
    const p = toValue(params)
    const query = new URLSearchParams()
    if (p.search) query.set('search', p.search)
    if (p.status) query.set('status', p.status)
    if (p.page) query.set('page', String(p.page))
    if (p.per_page) query.set('per_page', String(p.per_page))
    const qs = query.toString()
    return `/platform/tenants/${toValue(tenantId)}/projects/${toValue(projectId)}/orders${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<PlatformProjectOrderIndex200>(url)
}

export function useProjectResidentRatings(
  tenantId: MaybeRefOrGetter<string>,
  projectId: MaybeRefOrGetter<string | number>,
  params: MaybeRefOrGetter<PlatformProjectResidentRatingIndexParams>
) {
  const url = computed(() => {
    const p = toValue(params)
    const query = new URLSearchParams()
    if (p.rating) query.set('rating', String(p.rating))
    if (p.page) query.set('page', String(p.page))
    if (p.per_page) query.set('per_page', String(p.per_page))
    const qs = query.toString()
    return `/platform/tenants/${toValue(tenantId)}/projects/${toValue(projectId)}/resident-ratings${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<PlatformProjectResidentRatingIndex200>(url)
}

export function useProjectFeeConfig(
  tenantId: MaybeRefOrGetter<string>,
  projectId: MaybeRefOrGetter<string | number>
) {
  const url = computed(() => `/platform/tenants/${toValue(tenantId)}/projects/${toValue(projectId)}/fee-config`)
  return usePlatformApiFetch<PlatformProjectFeeConfigShow200>(url)
}

export function useProjectVendors(
  tenantId: MaybeRefOrGetter<string>,
  projectId: MaybeRefOrGetter<string | number>
) {
  const url = computed(() => `/platform/tenants/${toValue(tenantId)}/projects/${toValue(projectId)}/vendors`)
  return usePlatformApiFetch<ProjectVendorListResponse>(url)
}

// ─── Mutations ────────────────────────────────────────────────────

export function apiCreatePlatformProject(tenantId: string, data: CreatePlatformProjectRequest) {
  return $platformApi<PlatformProjectStore201>(`/platform/tenants/${tenantId}/projects`, {
    method: 'POST',
    body: data
  })
}

export function apiUpdateProjectFeeConfig(
  tenantId: string,
  projectId: number | string,
  data: UpdateProjectFeeConfigRequest
) {
  return $platformApi<PlatformProjectFeeConfigUpdate200>(
    `/platform/tenants/${tenantId}/projects/${projectId}/fee-config`,
    { method: 'PUT', body: data }
  )
}

/**
 * Bật/tắt cung cấp dịch vụ platform cho dự án mà không đụng các trường phí khác:
 * đọc cấu hình hiện tại rồi gửi lại nguyên vẹn với cờ dịch vụ đã đảo. Dùng cho
 * menu thao tác ở danh sách (nơi không có sẵn toàn bộ cấu hình phí).
 */
export async function apiToggleProjectService(
  tenantId: string,
  projectId: number | string,
  enabled: boolean
) {
  const current = await $platformApi<PlatformProjectFeeConfigShow200>(
    `/platform/tenants/${tenantId}/projects/${projectId}/fee-config`
  )
  const config = current.data

  return apiUpdateProjectFeeConfig(tenantId, projectId, {
    inherit_default: config.inherit_default,
    fee_mode: config.override.fee_mode?.value as UpdateProjectFeeConfigRequest['fee_mode'],
    fixed_fee_per_order: Number(config.override.fixed_fee_per_order),
    percent_fee_per_order: Number(config.override.percent_fee_per_order),
    subscription_amount: Number(config.override.subscription_amount),
    subscription_cycle: config.override.subscription_cycle?.value as UpdateProjectFeeConfigRequest['subscription_cycle'],
    platform_service_enabled: enabled,
    notes: config.notes
  })
}

/**
 * Bật/tắt cho phép vendor cung cấp dịch vụ trên 1 dự án (tạm dừng — giữ liên kết).
 */
export function apiToggleProjectVendor(
  tenantId: string,
  projectId: number | string,
  partnerId: number,
  enabled: boolean
) {
  return $platformApi<{ success: boolean, data: { partner_id: number, enabled: boolean } }>(
    `/platform/tenants/${tenantId}/projects/${projectId}/vendors/${partnerId}/toggle`,
    { method: 'PUT', body: { enabled } }
  )
}
