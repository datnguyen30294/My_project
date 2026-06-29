import type {
  CommissionSummaryIndex200,
  CommissionSummaryIndex200DataByRecipientItem,
  CommissionSummaryIndex200DataSnapshotsItem,
  CommissionSummaryIndex200DataStats
} from '#api/generated/laravel'
import type { BadgeColor } from '~/utils/badge'

// ─── Types ───

export type ClosingPeriodStatusValue = 'open' | 'closed'

export interface ClosingPeriodListItem {
  id: number
  project: { id: number, name: string } | null
  name: string
  period_start: string
  period_end: string
  status: { value: ClosingPeriodStatusValue, label: string }
  orders_count: number
  total_receivable: string
  total_commission: string
  total_platform_fee: string
  closed_at: string | null
  closed_by: { id: number, name: string } | null
  created_at: string
}

export interface ClosingPeriodDetail {
  id: number
  project: { id: number, name: string } | null
  name: string
  period_start: string
  period_end: string
  status: { value: ClosingPeriodStatusValue, label: string }
  closed_at: string | null
  closed_by: { id: number, name: string } | null
  note: string | null
  total_platform_fee: string
  orders: ClosingPeriodOrderItem[]
  created_at: string
  updated_at: string
}

/** Phí nền tảng đã đóng băng cho 1 đơn trong kỳ. `mode` là value enum TenantFeeMode (vd: 'percent_per_order'). */
export interface PlatformFeeInfo {
  amount: string
  mode: string | null
  fixed: string
  percent: string
}

export interface ClosingPeriodOrderItem {
  id: number
  order: { id: number, code: string }
  frozen_receivable_amount: string
  frozen_commission_total: string
  platform_fee: PlatformFeeInfo
  snapshots: CommissionSnapshotItem[]
}

export interface CommissionSnapshotItem {
  id: number
  recipient_type: string
  recipient_name: string
  account_id: number | null
  value_type: string
  percent: string | null
  value_fixed: string | null
  amount: string
  resolved_from: string
}

export interface EligibleOrderItem {
  id: number
  code: string
  total_amount: string
  receivable_amount: string | null
  estimated_platform_fee: string
  project: { id: number, name: string } | null
}

export interface ClosingPeriodListFilters {
  search?: string
  status?: string
  project_id?: number
  sort_by?: string
  sort_direction?: string
  per_page?: number
}

// ─── Status helpers ───

export function closingPeriodStatusColor(value: string): BadgeColor {
  return value === 'closed' ? 'success' : 'primary'
}

export const CLOSING_PERIOD_STATUS_OPTIONS = [
  { label: 'Đang mở', value: 'open' },
  { label: 'Đã chốt', value: 'closed' }
] as const

// ─── Queries ───

export function useClosingPeriodList(params: MaybeRefOrGetter<ClosingPeriodListFilters & { page?: number }>) {
  return useApiFetch<{ success: boolean, data: ClosingPeriodListItem[], meta: { total: number, per_page: number, from?: number | null, to?: number | null } }>(
    '/pmc/closing-periods',
    { query: params, watch: [params] }
  )
}

const CLOSING_PERIOD_DETAIL_KEY = (id: number | string) => `closing-period-detail-${id}`

export function useClosingPeriodDetail(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<{ success: boolean, data: ClosingPeriodDetail }>(
    computed(() => `/pmc/closing-periods/${toValue(id)}`),
    { key: computed(() => CLOSING_PERIOD_DETAIL_KEY(toValue(id))), watch: [() => toValue(id)] }
  )
}

export function clearClosingPeriodCache(id: number | string) {
  clearNuxtData(CLOSING_PERIOD_DETAIL_KEY(id))
}

export function useEligibleOrders(periodId: MaybeRefOrGetter<number | string>) {
  return useApiFetch<{ success: boolean, data: EligibleOrderItem[] }>(
    computed(() => `/pmc/closing-periods/${toValue(periodId)}/eligible-orders`),
    { immediate: false, watch: false }
  )
}

// ─── Commission Summary (types from Orval) ───

export type CommissionSummaryStats = CommissionSummaryIndex200DataStats
export type CommissionSummaryRecipient = CommissionSummaryIndex200DataByRecipientItem
export type CommissionSummarySnapshot = CommissionSummaryIndex200DataSnapshotsItem

export interface CommissionSummaryFilters {
  closing_period_id: string
  project_id?: number
  recipient_type?: string
  resolved_from?: string
}

// Only terminal recipients appear in the commission summary — Management
// and Department are intermediary distribution buckets and are filtered
// server-side in getCommissionSummary().
export const SNAPSHOT_RECIPIENT_TYPE_OPTIONS = [
  { label: 'Platform', value: 'platform' },
  { label: 'Công ty vận hành', value: 'operating_company' },
  { label: 'Ban quản trị', value: 'board_of_directors' },
  { label: 'Nhân viên', value: 'staff' }
] as const

export const RESOLVED_FROM_OPTIONS = [
  { label: 'Config', value: 'config' },
  { label: 'Override', value: 'override' }
] as const

export function recipientTypeBadgeColor(value: string): BadgeColor {
  const map: Record<string, BadgeColor> = {
    platform: 'info',
    operating_company: 'primary',
    board_of_directors: 'secondary',
    management: 'warning',
    department: 'neutral',
    staff: 'success'
  }
  return map[value] ?? 'neutral'
}

export function useCommissionSummary(params: MaybeRefOrGetter<CommissionSummaryFilters>) {
  return useApiFetch<CommissionSummaryIndex200>(
    '/pmc/commission-summary',
    { query: params, watch: [params] }
  )
}

// ─── Mutations ───

export function apiCreateClosingPeriod(data: { name: string, period_start: string, period_end: string, project_id?: number | null }) {
  return $api<{ success: boolean, data: ClosingPeriodDetail }>(
    '/pmc/closing-periods',
    { method: 'POST', body: data }
  )
}

export function apiAddOrders(periodId: number, data: { order_ids: number[] }) {
  return $api<{ success: boolean, data: ClosingPeriodDetail }>(
    `/pmc/closing-periods/${periodId}/add-orders`,
    { method: 'POST', body: data }
  )
}

export function apiRemoveOrder(periodId: number, orderId: number) {
  return $api<{ success: boolean, data: ClosingPeriodDetail }>(
    `/pmc/closing-periods/${periodId}/orders/${orderId}`,
    { method: 'DELETE' }
  )
}

export function apiClosePeriod(periodId: number, data: { note?: string | null }) {
  return $api<{ success: boolean, data: ClosingPeriodDetail }>(
    `/pmc/closing-periods/${periodId}/close`,
    { method: 'POST', body: data }
  )
}

export function apiReopenPeriod(periodId: number, data: { note?: string | null }) {
  return $api<{ success: boolean, data: ClosingPeriodDetail }>(
    `/pmc/closing-periods/${periodId}/reopen`,
    { method: 'POST', body: data }
  )
}

export const PAYOUT_STATUS_OPTIONS = [
  { label: 'Chưa thanh toán', value: 'unpaid' },
  { label: 'Đã thanh toán', value: 'paid' }
] as const

export function payoutStatusBadgeColor(value: string): BadgeColor {
  const map: Record<string, BadgeColor> = {
    unpaid: 'warning',
    paid: 'success',
    partial: 'neutral'
  }
  return map[value] ?? 'neutral'
}

export function payoutStatusLabel(value: string): string {
  const map: Record<string, string> = {
    unpaid: 'Chưa thanh toán',
    paid: 'Đã thanh toán',
    partial: 'Một phần'
  }
  return map[value] ?? value
}

export function apiUpdatePayoutStatus(data: { snapshot_ids: number[], payout_status: 'paid' | 'unpaid' }) {
  return $api<{ success: boolean, message: string, updated_count: number }>(
    '/pmc/commission-summary/payout',
    { method: 'PATCH', body: data }
  )
}

export function apiDeleteClosingPeriod(periodId: number) {
  return $api<{ message: string }>(
    `/pmc/closing-periods/${periodId}`,
    { method: 'DELETE' }
  )
}
