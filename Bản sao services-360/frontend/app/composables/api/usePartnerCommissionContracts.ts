// Types match BE Resources at
// app/Modules/Marketplace/src/PartnerCommissionContract/Resources/.
// Defined inline (not via Orval) — terms shape is mode-dependent, easier to
// keep typed unions here than to coerce through generated schemas.

import type { RouteLocationRaw } from 'vue-router'

export type CommissionModeValue = 'per_order' | 'revenue_share' | 'subscription'

export type ContractStatusValue
  = | 'draft'
    | 'pending'
    | 'active'
    | 'replaced'
    | 'cancelled'
    | 'expired'
    | 'revoked'

export type BillingPeriodValue = 'monthly' | 'quarterly'
export type SubscriptionCycleValue = 'monthly' | 'quarterly' | 'yearly'

export type ContractCreatedScopeValue = 'platform' | 'tenant'

export type RevenueRecipientValue = 'platform' | 'operating_company'

export interface EnumOption<V extends string = string> {
  value: V
  label: string
}

export interface ContractStatusOption {
  value: ContractStatusValue
  label: string
  color: string
}

export interface PartnerRef {
  id: number
  name: string
  slug: string
}

// ─── Terms shapes ───────────────────────────────────────────────

export interface PerOrderTerms {
  percent?: number | null
  fixed?: number | null
}

export interface RevenueShareTier {
  min_gmv: number
  max_gmv: number | null
  percent: number
}

export interface RevenueShareTerms {
  billing_period: BillingPeriodValue
  tiers: RevenueShareTier[]
}

export interface SubscriptionTerms {
  amount: number
  cycle: SubscriptionCycleValue
}

export type ContractTerms
  = | PerOrderTerms
    | RevenueShareTerms
    | SubscriptionTerms
    | Record<string, unknown>

// ─── Resource shapes ────────────────────────────────────────────

export interface ContractListItem {
  id: number
  contract_code: string
  partner?: PartnerRef
  partner_id: number
  tenant_id: string
  tenant_name?: string | null
  project_id: number
  project_name?: string | null
  commission_mode: EnumOption<CommissionModeValue>
  revenue_recipient: EnumOption<RevenueRecipientValue>
  status: ContractStatusOption
  created_scope: EnumOption<ContractCreatedScopeValue>
  starts_at: string | null
  ends_at: string | null
  activated_at: string | null
  signed_at: string | null
}

export interface ContractDetail extends ContractListItem {
  terms: ContractTerms
  replaced_at: string | null
  replaced_by_contract_id: number | null
  cancelled_at: string | null
  cancelled_by: number | null
  cancellation_reason: string | null
  signed_by: number | null
  notes: string | null
  created_by: number | null
  updated_by: number | null
  created_at: string | null
  updated_at: string | null
}

// ─── Request payloads ───────────────────────────────────────────

export interface ListContractsParams {
  partner_id?: number
  tenant_id?: string
  project_id?: number
  status?: ContractStatusValue
  commission_mode?: CommissionModeValue
  search?: string
  sort_by?: 'created_at' | 'updated_at' | 'starts_at' | 'ends_at' | 'contract_code' | 'status'
  sort_direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export interface CreateContractDraftPayload {
  partner_id: number
  tenant_id: string
  project_id: number
  commission_mode: CommissionModeValue
  revenue_recipient: RevenueRecipientValue
  starts_at: string
  ends_at?: string | null
  notes?: string | null
  contract_code?: string | null
  terms: ContractTerms
}

export type UpdateContractDraftPayload = Partial<CreateContractDraftPayload>

/**
 * Apply a single commission terms set across every project the vendor is
 * linked to (one draft contract per scope). Partner id comes from the route.
 */
export interface BulkApplyCommissionPayload {
  commission_mode: CommissionModeValue
  revenue_recipient: RevenueRecipientValue
  starts_at: string
  ends_at?: string | null
  notes?: string | null
  terms: ContractTerms
  /** When true (default) scopes with a live contract are skipped (no override). */
  skip_existing?: boolean
}

export interface UpdateContractPendingPayload {
  contract_code?: string | null
  notes?: string | null
}

// ─── Response wrappers ──────────────────────────────────────────

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
}

interface DetailResponse<T> {
  success: true
  data: T
}

interface MutationResponse<T> {
  data: T
}

// ─── Constants — option arrays for UI ───────────────────────────

export const COMMISSION_MODE_OPTIONS: { value: CommissionModeValue, label: string }[] = [
  { value: 'per_order', label: 'Chiết khấu mỗi đơn' },
  { value: 'revenue_share', label: 'Chia doanh thu' },
  { value: 'subscription', label: 'Thuê bao' }
]

export const REVENUE_RECIPIENT_OPTIONS: { value: RevenueRecipientValue, label: string }[] = [
  { value: 'platform', label: 'Platform TNP' },
  { value: 'operating_company', label: 'Công ty vận hành' }
]

export const CONTRACT_STATUS_OPTIONS: { value: ContractStatusValue, label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'pending', label: 'Chờ kích hoạt' },
  { value: 'active', label: 'Đang hiệu lực' },
  { value: 'replaced', label: 'Đã bị thay thế' },
  { value: 'cancelled', label: 'Đã huỷ' },
  { value: 'expired', label: 'Đã hết hạn' },
  { value: 'revoked', label: 'Đã thu hồi' }
]

export const BILLING_PERIOD_OPTIONS: { value: BillingPeriodValue, label: string }[] = [
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'quarterly', label: 'Hàng quý' }
]

export const SUBSCRIPTION_CYCLE_OPTIONS: { value: SubscriptionCycleValue, label: string }[] = [
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'quarterly', label: 'Hàng quý' },
  { value: 'yearly', label: 'Hàng năm' }
]

export function statusBadgeColor(
  value: ContractStatusValue
): 'neutral' | 'warning' | 'success' | 'error' | 'info' {
  switch (value) {
    case 'draft': return 'neutral'
    case 'pending': return 'warning'
    case 'active': return 'success'
    case 'replaced':
    case 'expired': return 'neutral'
    case 'cancelled':
    case 'revoked': return 'error'
    default: return 'neutral'
  }
}

// ─── Per-project contract health (rail) ─────────────────────────

export type ProjectContractHealth = 'active' | 'pending' | 'draft' | 'none'

export interface ProjectContractSummary {
  projectId: number
  projectName: string
  health: ProjectContractHealth
  /** Mode of the live contract, for the rail subtitle (null when no active). */
  activeMode: EnumOption<CommissionModeValue> | null
  pendingCount: number
  draftCount: number
  historyCount: number
}

export interface ProjectHealthMeta {
  label: string
  /** Semantic color for badges/icons. */
  color: 'success' | 'warning' | 'neutral' | 'error'
  icon: string
  /** Tailwind text/icon tone, tinted by health so gaps catch the eye. */
  tone: string
}

export const PROJECT_HEALTH_META: Record<ProjectContractHealth, ProjectHealthMeta> = {
  active: { label: 'Đang hiệu lực', color: 'success', icon: 'i-lucide-circle-check', tone: 'text-emerald-600' },
  pending: { label: 'Chờ kích hoạt', color: 'warning', icon: 'i-lucide-clock', tone: 'text-amber-600' },
  draft: { label: 'Bản nháp', color: 'neutral', icon: 'i-lucide-file-pen-line', tone: 'text-slate-500' },
  none: { label: 'Chưa có hợp đồng', color: 'error', icon: 'i-lucide-circle-alert', tone: 'text-red-600' }
}

const HEALTH_SORT_PRIORITY: Record<ProjectContractHealth, number> = {
  none: 0,
  pending: 1,
  draft: 2,
  active: 3
}

const TERMINAL_STATUSES: ContractStatusValue[] = ['replaced', 'cancelled', 'expired', 'revoked']

/**
 * Roll a flat list of a vendor's contracts (all projects, all statuses) into a
 * per-project health summary for the picker rail. The project universe is the
 * union of the vendor's served projects and any project that owns a contract,
 * so served-but-uncontracted projects (the order-blocking gaps) still appear.
 *
 * Sorted problems-first (none → pending → draft → active), then by name, so the
 * rows that need attention rise to the top.
 *
 * @param contracts        All contracts of the vendor (no project/status filter).
 * @param projects         Tenant projects, for resolving names.
 * @param servedProjectIds Projects the vendor is linked to.
 */
export function summarizeProjectContracts(
  contracts: ContractListItem[],
  projects: { id: number, name: string }[],
  servedProjectIds: number[]
): ProjectContractSummary[] {
  const nameById = new Map<number, string>()
  for (const p of projects) {
    nameById.set(p.id, p.name)
  }

  const byProject = new Map<number, ContractListItem[]>()
  for (const c of contracts) {
    const bucket = byProject.get(c.project_id) ?? []
    bucket.push(c)
    byProject.set(c.project_id, bucket)
  }

  const projectIds = new Set<number>(servedProjectIds)
  for (const c of contracts) {
    projectIds.add(c.project_id)
  }

  const summaries: ProjectContractSummary[] = []
  for (const id of projectIds) {
    const list = byProject.get(id) ?? []
    const active = list.find(c => c.status.value === 'active') ?? null
    const pendingCount = list.filter(c => c.status.value === 'pending').length
    const draftCount = list.filter(c => c.status.value === 'draft').length
    const historyCount = list.filter(c => TERMINAL_STATUSES.includes(c.status.value)).length

    const health: ProjectContractHealth = active
      ? 'active'
      : pendingCount > 0
        ? 'pending'
        : draftCount > 0
          ? 'draft'
          : 'none'

    summaries.push({
      projectId: id,
      projectName: nameById.get(id) ?? list[0]?.project_name ?? `Dự án #${id}`,
      health,
      activeMode: active?.commission_mode ?? null,
      pendingCount,
      draftCount,
      historyCount
    })
  }

  return summaries.sort((a, b) => {
    const diff = HEALTH_SORT_PRIORITY[a.health] - HEALTH_SORT_PRIORITY[b.health]
    return diff !== 0 ? diff : a.projectName.localeCompare(b.projectName, 'vi')
  })
}

function buildListQuery(p: ListContractsParams): string {
  const query = new URLSearchParams()
  if (p.partner_id) query.set('partner_id', String(p.partner_id))
  if (p.tenant_id) query.set('tenant_id', p.tenant_id)
  if (p.project_id) query.set('project_id', String(p.project_id))
  if (p.status) query.set('status', p.status)
  if (p.commission_mode) query.set('commission_mode', p.commission_mode)
  if (p.search) query.set('search', p.search)
  if (p.sort_by) query.set('sort_by', p.sort_by)
  if (p.sort_direction) query.set('sort_direction', p.sort_direction)
  if (p.per_page) query.set('per_page', String(p.per_page))
  if (p.page) query.set('page', String(p.page))
  return query.toString()
}

// ─── Platform side ──────────────────────────────────────────────

export function usePlatformContractList(
  params: MaybeRefOrGetter<ListContractsParams>
) {
  const url = computed(() => {
    const qs = buildListQuery(toValue(params))
    return `/platform/partner-commission-contracts${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<ListResponse<ContractListItem>>(url)
}

/**
 * Deep-link to a platform contract: opens the vendor detail page on the
 * contracts tab with the given contract drawer pre-opened.
 */
export function platformContractLocation(
  partnerId: number | string,
  contractId: number | string
): RouteLocationRaw {
  return {
    path: `/platform/partners/${partnerId}`,
    query: { tab: 'contracts', contract: String(contractId) }
  }
}

export function usePlatformContractDetail(id: MaybeRefOrGetter<number | string | null | undefined>) {
  const url = computed(() => {
    const v = toValue(id)
    return v ? `/platform/partner-commission-contracts/${v}` : ''
  })
  return usePlatformApiFetch<DetailResponse<ContractDetail>>(url, {
    immediate: false,
    watch: [() => toValue(id)]
  })
}

export function apiCreatePlatformContract(data: CreateContractDraftPayload) {
  return $platformApi<MutationResponse<ContractDetail>>(
    '/platform/partner-commission-contracts',
    { method: 'POST', body: data }
  )
}

/**
 * Apply a default commission across every project the vendor is linked to —
 * fan-out one draft contract per (tenant × project) scope.
 */
export function apiBulkApplyPlatformCommission(
  partnerId: number | string,
  data: BulkApplyCommissionPayload
) {
  return $platformApi<{ success: true, data: { created: number, skipped: number } }>(
    `/platform/partners/${partnerId}/commission-contracts/bulk`,
    { method: 'POST', body: data }
  )
}

export function apiUpdatePlatformContractDraft(
  id: number | string,
  data: UpdateContractDraftPayload
) {
  return $platformApi<MutationResponse<ContractDetail>>(
    `/platform/partner-commission-contracts/${id}`,
    { method: 'PUT', body: data }
  )
}

export function apiUpdatePlatformContractNotes(
  id: number | string,
  data: UpdateContractPendingPayload
) {
  return $platformApi<MutationResponse<ContractDetail>>(
    `/platform/partner-commission-contracts/${id}/notes`,
    { method: 'PATCH', body: data }
  )
}

export function apiDeletePlatformContractDraft(id: number | string) {
  return $platformApi<{ success: true }>(
    `/platform/partner-commission-contracts/${id}`,
    { method: 'DELETE' }
  )
}

export function apiSignPlatformContract(id: number | string) {
  return $platformApi<MutationResponse<ContractDetail>>(
    `/platform/partner-commission-contracts/${id}/sign`,
    { method: 'POST' }
  )
}

export function apiRevokePlatformContract(id: number | string, cancellationReason: string) {
  return $platformApi<MutationResponse<ContractDetail>>(
    `/platform/partner-commission-contracts/${id}/revoke`,
    { method: 'POST', body: { cancellation_reason: cancellationReason } }
  )
}

export function apiCancelPlatformContract(id: number | string, cancellationReason: string) {
  return $platformApi<MutationResponse<ContractDetail>>(
    `/platform/partner-commission-contracts/${id}/cancel`,
    { method: 'POST', body: { cancellation_reason: cancellationReason } }
  )
}

// ─── Tenant side — flat URL, auto-scoped to current tenant ──────

const TENANT_BASE = '/pmc/partner-commission-contracts'

/**
 * Deep-link to a tenant contract: opens the vendor detail page on the
 * contracts tab with the given contract drawer pre-opened.
 */
export function tenantContractLocation(
  vendorId: number | string,
  projectId: number | string,
  contractId: number | string
): RouteLocationRaw {
  return {
    path: `/pmc/vendors/${vendorId}`,
    query: { tab: 'contracts', project: String(projectId), contract: String(contractId) }
  }
}

export function useTenantContractList(
  params: MaybeRefOrGetter<ListContractsParams> = () => ({})
) {
  const url = computed(() => {
    const qs = buildListQuery(toValue(params))
    return `${TENANT_BASE}${qs ? `?${qs}` : ''}`
  })
  return useApiFetch<ListResponse<ContractListItem>>(url)
}

export function useTenantContractDetail(id: MaybeRefOrGetter<number | string | null | undefined>) {
  const url = computed(() => {
    const v = toValue(id)
    return v ? `${TENANT_BASE}/${v}` : ''
  })
  return useApiFetch<DetailResponse<ContractDetail>>(url, {
    immediate: false,
    watch: [() => toValue(id)]
  })
}

export function useTenantContractHistory(
  partnerId: MaybeRefOrGetter<number | string | null | undefined>,
  projectId: MaybeRefOrGetter<number | string | null | undefined>
) {
  const url = computed(() => {
    const pid = toValue(partnerId)
    const pjid = toValue(projectId)
    if (!pid || !pjid) return ''
    return `${TENANT_BASE}/history?partner_id=${pid}&project_id=${pjid}`
  })
  return useApiFetch<ListResponse<ContractListItem>>(url, {
    immediate: false,
    watch: [() => toValue(partnerId), () => toValue(projectId)]
  })
}

export function apiCreateTenantContract(data: CreateContractDraftPayload) {
  return $api<MutationResponse<ContractDetail>>(
    TENANT_BASE,
    { method: 'POST', body: data }
  )
}

export function apiUpdateTenantContractDraft(
  id: number | string,
  data: UpdateContractDraftPayload
) {
  return $api<MutationResponse<ContractDetail>>(
    `${TENANT_BASE}/${id}`,
    { method: 'PUT', body: data }
  )
}

export function apiUpdateTenantContractNotes(
  id: number | string,
  data: UpdateContractPendingPayload
) {
  return $api<MutationResponse<ContractDetail>>(
    `${TENANT_BASE}/${id}/notes`,
    { method: 'PATCH', body: data }
  )
}

export function apiDeleteTenantContractDraft(id: number | string) {
  return $api<{ success: true }>(
    `${TENANT_BASE}/${id}`,
    { method: 'DELETE' }
  )
}

export function apiSignTenantContract(id: number | string) {
  return $api<MutationResponse<ContractDetail>>(
    `${TENANT_BASE}/${id}/sign`,
    { method: 'POST' }
  )
}

export function apiRevokeTenantContract(id: number | string, cancellationReason: string) {
  return $api<MutationResponse<ContractDetail>>(
    `${TENANT_BASE}/${id}/revoke`,
    { method: 'POST', body: { cancellation_reason: cancellationReason } }
  )
}

export function apiSwitchTenantContract(id: number | string) {
  return $api<MutationResponse<ContractDetail>>(
    `${TENANT_BASE}/${id}/switch`,
    { method: 'POST' }
  )
}

export function apiCancelTenantContract(id: number | string, cancellationReason: string) {
  return $api<MutationResponse<ContractDetail>>(
    `${TENANT_BASE}/${id}/cancel`,
    { method: 'POST', body: { cancellation_reason: cancellationReason } }
  )
}

// ─── Term builders / defaults ───────────────────────────────────

export function defaultPerOrderTerms(): PerOrderTerms {
  return {
    percent: 10,
    fixed: null
  }
}

export function defaultRevenueShareTerms(): RevenueShareTerms {
  return {
    billing_period: 'monthly',
    tiers: [
      { min_gmv: 0, max_gmv: null, percent: 10 }
    ]
  }
}

export function defaultSubscriptionTerms(): SubscriptionTerms {
  return {
    amount: 500_000,
    cycle: 'monthly'
  }
}

export function defaultTermsFor(mode: CommissionModeValue): ContractTerms {
  switch (mode) {
    case 'per_order': return defaultPerOrderTerms()
    case 'revenue_share': return defaultRevenueShareTerms()
    case 'subscription': return defaultSubscriptionTerms()
  }
}
