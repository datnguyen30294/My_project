// Types match BE Resources at app/Modules/Marketplace/src/Partner/Resources/.
// Defined inline (not via Orval) since this is a new module and types are stable.

export type PartnerStatusValue = 'pending' | 'active' | 'suspended' | 'terminated'

export interface PartnerStatusOption {
  value: PartnerStatusValue
  label: string
}

/** Nuxt UI badge color for a vendor status (FE spec §3.2). */
export function partnerStatusBadgeColor(
  value: PartnerStatusValue
): 'warning' | 'success' | 'neutral' | 'error' {
  switch (value) {
    case 'pending': return 'warning'
    case 'active': return 'success'
    case 'terminated': return 'error'
    default: return 'neutral'
  }
}

export interface PartnerOwnerSourceOption {
  value: 'platform' | 'tenant'
  label: string
}

export interface PartnerListItem {
  id: number
  slug: string
  tenant_id: string | null
  name: string
  display_name: string | null
  status: PartnerStatusOption
  custom_domain: string | null
  categories: string[]
  logo_url: string | null
  is_provisioned: boolean
  owner_tenant_id: string | null
  owner_source: PartnerOwnerSourceOption
  created_at: string | null
  updated_at: string | null
  /**
   * Only present in the catalog response: whether the current tenant already
   * uses this vendor in at least one of its projects.
   */
  is_linked?: boolean
  // ─── Console aggregate fields (only with `?include=stats`) ───
  project_count?: number
  offer_count?: number
  order_count?: number
  /** Resident rating aggregate from resi_mart reviews; null when no published reviews. */
  rating?: { avg: number, count: number } | null
  owner_tenant?: { id: string, name: string | null } | null
}

/** Active commission for a (vendor × tenant × project) scope. */
export interface PartnerProjectCommission {
  contract_id: number
  mode: { value: CommissionModeLikeValue, label: string }
  terms: Record<string, unknown>
  revenue_recipient: { value: string, label: string }
  is_override: boolean
}

export type CommissionModeLikeValue = 'per_order' | 'revenue_share' | 'subscription'

/** A project the vendor is linked to, with its current commission (console). */
export interface PartnerProjectRow {
  project_id: number
  project_name: string
  tenant_id: string
  tenant_name: string | null
  is_vendor_enabled: boolean
  commission: PartnerProjectCommission | null
}

export interface PartnerDetail extends PartnerListItem {
  owner_email: string
  owner_phone: string | null
  description: string | null
  project_ids: number[]
  created_by: number | null
  updated_by: number | null
  /**
   * Whether the vendor belongs to the current tenant. Shared (platform /
   * other-tenant) vendors are read-only — edit/delete must be hidden.
   * Always false in platform context.
   */
  is_owned: boolean
  /** Per-project commission table — only on the console detail endpoint. */
  projects?: PartnerProjectRow[]
}

export interface ListPartnersParams {
  search?: string
  status?: PartnerStatusValue
  category?: string
  provisioned?: boolean
  owner_source?: 'platform' | 'tenant'
  /** Pass `stats` to decorate rows with project/offer/order counts + rating. */
  include?: string
  sort_by?: 'created_at' | 'updated_at' | 'name' | 'slug' | 'status'
  sort_direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export type ListTenantPartnersParams = Omit<ListPartnersParams, 'owner_source'>

export interface CreatePartnerPayload {
  slug: string
  name: string
  display_name?: string | null
  status?: PartnerStatusValue
  custom_domain?: string | null
  categories?: string[]
  owner_email: string
  owner_phone?: string | null
  logo_url?: string | null
  description?: string | null
  /**
   * Platform side: assign vendor to a specific PMC tenant. Tenant side
   * ignores this — owner_tenant_id is forced to current tenant.
   */
  owner_tenant_id?: string | null
  /**
   * Project IDs the vendor is allowed to serve. Required (BE-side) when
   * owner_tenant_id is set on platform create.
   */
  project_ids?: number[]
}

export type UpdatePartnerPayload = Omit<Partial<CreatePartnerPayload>, 'slug'>

interface ListResponse<T> {
  success: true
  data: T[]
  meta?: { current_page: number, last_page: number, per_page: number, total: number }
}

interface DetailResponse<T> {
  success: true
  data: T
}

function buildListQuery(p: ListPartnersParams): string {
  const query = new URLSearchParams()
  if (p.search) query.set('search', p.search)
  if (p.status) query.set('status', p.status)
  if (p.category) query.set('category', p.category)
  if (p.provisioned !== undefined && p.provisioned !== null) {
    query.set('provisioned', p.provisioned ? '1' : '0')
  }
  if (p.owner_source) query.set('owner_source', p.owner_source)
  if (p.include) query.set('include', p.include)
  if (p.sort_by) query.set('sort_by', p.sort_by)
  if (p.sort_direction) query.set('sort_direction', p.sort_direction)
  if (p.per_page) query.set('per_page', String(p.per_page))
  if (p.page) query.set('page', String(p.page))
  return query.toString()
}

// ─── Platform side ───────────────────────────────────────────

export function usePlatformPartnerList(params: MaybeRefOrGetter<ListPartnersParams>) {
  const url = computed(() => {
    const qs = buildListQuery(toValue(params))
    return `/platform/partners${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<ListResponse<PartnerListItem>>(url)
}

export function usePlatformPartnerDetail(id: MaybeRefOrGetter<number | string>) {
  const url = computed(() => `/platform/partners/${toValue(id)}`)
  return usePlatformApiFetch<DetailResponse<PartnerDetail>>(url)
}

export function apiCreatePartner(data: CreatePartnerPayload) {
  return $platformApi<DetailResponse<PartnerDetail>>('/platform/partners', {
    method: 'POST',
    body: data
  })
}

export function apiUpdatePartner(id: number | string, data: UpdatePartnerPayload) {
  return $platformApi<DetailResponse<PartnerDetail>>(`/platform/partners/${id}`, {
    method: 'PUT',
    body: data
  })
}

export function apiDeletePartner(id: number | string) {
  return $platformApi<{ success: true }>(`/platform/partners/${id}`, {
    method: 'DELETE'
  })
}

/**
 * Retry resi_mart provisioning for a partner whose create-time provision
 * failed (is_provisioned === false). Idempotent on resi_mart side.
 */
export function apiProvisionPartner(id: number | string) {
  return $platformApi<DetailResponse<PartnerDetail>>(`/platform/partners/${id}/provision`, {
    method: 'POST'
  })
}

// ─── Console: stats cards ────────────────────────────────────

export interface PartnerConsoleStats {
  total: number
  active: number
  pending: number
  inactive: number
}

export function usePlatformPartnerStats() {
  return usePlatformApiFetch<{ success: true, data: PartnerConsoleStats }>(
    '/platform/partners/stats'
  )
}

// ─── Console: approval lifecycle ─────────────────────────────

export function apiApprovePartner(id: number | string) {
  return $platformApi<DetailResponse<PartnerDetail>>(`/platform/partners/${id}/approve`, {
    method: 'POST'
  })
}

export function apiDeactivatePartner(id: number | string) {
  return $platformApi<DetailResponse<PartnerDetail>>(`/platform/partners/${id}/deactivate`, {
    method: 'POST'
  })
}

export function apiReactivatePartner(id: number | string) {
  return $platformApi<DetailResponse<PartnerDetail>>(`/platform/partners/${id}/reactivate`, {
    method: 'POST'
  })
}

// ─── Console: revenue trend (6 tháng) ────────────────────────

export interface PartnerRevenueTrendMonth {
  month: string
  revenue: number
  order_count: number
  commission: number
}

export interface PartnerRevenueTrend {
  months: PartnerRevenueTrendMonth[]
  currency: string
  warnings: { schema_missing: boolean }
}

export function usePlatformPartnerRevenueTrend(
  partnerId: MaybeRefOrGetter<number | string>,
  months: MaybeRefOrGetter<number> = () => 6
) {
  const url = computed(() =>
    `/platform/partners/${toValue(partnerId)}/revenue-trend?months=${toValue(months)}`
  )
  return usePlatformApiFetch<{ success: true, data: PartnerRevenueTrend }>(url, {
    watch: [() => toValue(partnerId), () => toValue(months)]
  })
}

// ─── Console: vendor offers (sản phẩm) ───────────────────────

export type VendorOfferTypeValue = 'sale' | 'rental' | 'service'
export type VendorOfferStatusValue = 'draft' | 'published' | 'out_of_stock' | 'archived'

export interface PartnerOffer {
  id: number
  name: string
  sku: string
  type: { value: VendorOfferTypeValue, label: string }
  price: number
  unit: string | null
  status: { value: VendorOfferStatusValue, label: string, color: string }
  published_at: string | null
  /**
   * Listing scope — the offers list is flattened to one row per
   * (product × project). These come from the `product_project` pivot in the
   * vendor's resi_mart schema; null when the product is not yet published to
   * any project. `tenant_*` is the PMC operating company, `project_*` the
   * project, `is_active` whether the offer is active in that project.
   */
  tenant_id: string | null
  tenant_name: string | null
  project_id: number | null
  project_name: string | null
  is_active: boolean | null
}

export interface ListPartnerOffersParams {
  search?: string
  type?: VendorOfferTypeValue
  status?: VendorOfferStatusValue
  page?: number
  per_page?: number
}

interface PaginatedResponse<T> {
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
  warnings?: { schema_missing?: boolean, deferred?: boolean }
}

function buildSimpleQuery(p: Record<string, unknown>): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(p)) {
    if (v === undefined || v === null || v === '') continue
    q.set(k, String(v))
  }
  return q.toString()
}

export function usePlatformPartnerOffers(
  partnerId: MaybeRefOrGetter<number | string>,
  params: MaybeRefOrGetter<ListPartnerOffersParams> = () => ({})
) {
  const url = computed(() => {
    const qs = buildSimpleQuery(toValue(params) as Record<string, unknown>)
    return `/platform/partners/${toValue(partnerId)}/offers${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<PaginatedResponse<PartnerOffer>>(url, {
    watch: [() => toValue(partnerId), () => toValue(params)]
  })
}

// ─── Console: resident ratings (resi_mart order_reviews, cross-DB) ────────────

export interface PartnerRating {
  order_code: string
  order_type: { value: string, label: string }
  project: { id: number, name: string }
  resident_name: string
  score: number
  comment: string | null
  rated_at: string | null
}

export interface ListPartnerRatingsParams {
  search?: string
  rating?: number
  project_id?: number
  page?: number
  per_page?: number
}

export function usePlatformPartnerRatings(
  partnerId: MaybeRefOrGetter<number | string>,
  params: MaybeRefOrGetter<ListPartnerRatingsParams> = () => ({})
) {
  const url = computed(() => {
    const qs = buildSimpleQuery(toValue(params) as Record<string, unknown>)
    return `/platform/partners/${toValue(partnerId)}/ratings${qs ? `?${qs}` : ''}`
  })
  return usePlatformApiFetch<
    PaginatedResponse<PartnerRating> & { summary: { average: number | null, count: number } }
  >(url, {
    watch: [() => toValue(partnerId), () => toValue(params)]
  })
}

// ─── PMC tenant side ─────────────────────────────────────────

export function useTenantPartnerList(params: MaybeRefOrGetter<ListTenantPartnersParams>) {
  const url = computed(() => {
    const qs = buildListQuery(toValue(params))
    return `/pmc/partners${qs ? `?${qs}` : ''}`
  })
  return useApiFetch<ListResponse<PartnerListItem>>(url)
}

export const TENANT_PARTNER_DETAIL_KEY = (id: number | string) => `tenant-partner-${id}`

export function useTenantPartnerDetail(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<DetailResponse<PartnerDetail>>(
    computed(() => `/pmc/partners/${toValue(id)}`),
    {
      key: computed(() => TENANT_PARTNER_DETAIL_KEY(toValue(id))),
      watch: [() => toValue(id)]
    }
  )
}

export function clearTenantPartnerCache(id: number | string) {
  clearNuxtData(TENANT_PARTNER_DETAIL_KEY(id))
}

export function apiCreateTenantPartner(data: CreatePartnerPayload) {
  return $api<DetailResponse<PartnerDetail>>('/pmc/partners', {
    method: 'POST',
    body: data
  })
}

export function apiUpdateTenantPartner(id: number | string, data: UpdatePartnerPayload) {
  return $api<DetailResponse<PartnerDetail>>(`/pmc/partners/${id}`, {
    method: 'PUT',
    body: data
  })
}

export function apiDeleteTenantPartner(id: number | string) {
  return $api<{ success: true }>(`/pmc/partners/${id}`, {
    method: 'DELETE'
  })
}

/**
 * Retry resi_mart provisioning when create-time provision failed
 * (is_provisioned === false). Idempotent on resi_mart side.
 */
export function apiProvisionTenantPartner(id: number | string) {
  return $api<DetailResponse<PartnerDetail>>(`/pmc/partners/${id}/provision`, {
    method: 'POST'
  })
}

/**
 * Catalog of every active vendor the tenant can add to its projects — including
 * vendors owned by other PMCs or the platform. Each row carries `is_linked`.
 */
export function useTenantPartnerCatalog(params: MaybeRefOrGetter<ListTenantPartnersParams>) {
  const url = computed(() => {
    const qs = buildListQuery(toValue(params))
    return `/pmc/partners/catalog${qs ? `?${qs}` : ''}`
  })
  return useApiFetch<ListResponse<PartnerListItem>>(url)
}

/**
 * Link an existing vendor to one or more of the tenant's projects. Works for
 * vendors the tenant does not own (shared marketplace catalog).
 */
export function apiAttachTenantPartner(id: number | string, projectIds: number[]) {
  return $api<DetailResponse<PartnerDetail>>(`/pmc/partners/${id}/attach`, {
    method: 'POST',
    body: { project_ids: projectIds }
  })
}

/**
 * Unlink a vendor from one or more of the tenant's projects. Fails with
 * `PARTNER_HAS_ACTIVE_CONTRACT` (409) when a targeted project still has an
 * active commission contract — cancel the contract first.
 */
export function apiDetachTenantPartner(id: number | string, projectIds: number[]) {
  return $api<DetailResponse<PartnerDetail>>(`/pmc/partners/${id}/detach`, {
    method: 'POST',
    body: { project_ids: projectIds }
  })
}
