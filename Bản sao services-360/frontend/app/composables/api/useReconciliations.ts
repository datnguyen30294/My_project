import type { ReconciliationIndexParams, ReconciliationSummary200Data } from '#api/generated/laravel'
import type { BadgeColor } from '~/utils/badge'

// ─── Types ───
// NOTE: Hand-written types for list/detail because Orval generates `unknown[] | null`
// for nested receivable/payment_receipt objects due to PHPDoc `@return array|null`.
// Once BE PHPDocs are improved, these can be replaced with generated types.

export type ReconciliationStatusValue = 'pending' | 'reconciled' | 'rejected'

export type ReconciliationSourceType = 'receivable' | 'manual_cash'

export interface ReconciliationSourceCashTransaction {
  id: number
  code: string
  category: { value: string, label: string }
  direction: { value: string, label: string }
  amount: string
  transaction_date: string | null
  note: string | null
  created_by: { id: number, name: string } | null
}

export interface ReconciliationListItem {
  id: number
  source: {
    type: ReconciliationSourceType
    cash_transaction: ReconciliationSourceCashTransaction | null
  }
  amount: string
  receivable: {
    id: number
    order_code: string | null
    requester_name: string | null
    apartment_name: string | null
    customer: { id: number, code: string | null, full_name: string, phone: string } | null
    amount: string
    paid_amount: string
    status: { value: string, label: string }
  } | null
  project: { id: number, name: string } | null
  payment_receipt: {
    id: number
    type: { value: string, label: string }
    amount: string
    payment_method: { value: string, label: string }
    collected_by: { id: number, name: string } | null
    paid_at: string
  } | null
  status: { value: ReconciliationStatusValue, label: string }
  reconciled_at: string | null
  reconciled_by: { id: number, name: string } | null
  note: string | null
  created_at: string
  cash_transaction: { id: number, code: string } | null
}

export type ReconciliationSummary = ReconciliationSummary200Data

export interface ReconciliationDetail {
  id: number
  source: {
    type: ReconciliationSourceType
    cash_transaction: ReconciliationSourceCashTransaction | null
  }
  amount: string
  receivable: {
    id: number
    order: { id: number, code: string } | null
    og_ticket: {
      id: number
      subject: string
      requester_name: string
      requester_phone: string | null
      apartment_name: string | null
      customer: { id: number, code: string | null, full_name: string, phone: string } | null
    } | null
    project: { id: number, name: string } | null
    amount: string
    paid_amount: string
    status: { value: string, label: string }
  } | null
  payment_receipt: {
    id: number
    type: { value: string, label: string }
    amount: string
    payment_method: { value: string, label: string }
    collected_by: { id: number, name: string } | null
    note: string | null
    paid_at: string
  } | null
  status: { value: ReconciliationStatusValue, label: string }
  reconciled_at: string | null
  reconciled_by: { id: number, name: string } | null
  note: string | null
  created_at: string
  updated_at: string
}

export type ReconciliationListFilters = ReconciliationIndexParams & {
  source?: ReconciliationSourceType
}

// ─── Status helpers ───

export function reconciliationStatusColor(value: string): BadgeColor {
  if (value === 'reconciled') return 'success'
  if (value === 'rejected') return 'error'
  return 'warning'
}

export function reconciliationSourceColor(value: string): BadgeColor {
  return value === 'manual_cash' ? 'secondary' : 'primary'
}

export const RECONCILIATION_STATUS_OPTIONS = [
  { label: 'Chờ đối soát', value: 'pending' },
  { label: 'Đã đối soát', value: 'reconciled' },
  { label: 'Từ chối', value: 'rejected' }
]

export const RECONCILIATION_SOURCE_OPTIONS = [
  { label: 'Công nợ', value: 'receivable' },
  { label: 'Quỹ thủ công', value: 'manual_cash' }
]

export function reconciliationSourceLabel(value: string): string {
  return value === 'manual_cash' ? 'Quỹ thủ công' : 'Công nợ'
}

export const PAYMENT_TYPE_FILTER_OPTIONS = [
  { label: 'Thu tiền', value: 'collection' },
  { label: 'Hoàn trả', value: 'refund' }
]

// ─── Queries ───

export function useReconciliationList(params: MaybeRefOrGetter<ReconciliationListFilters & { page?: number }>) {
  return useApiFetch<{ success: boolean, data: ReconciliationListItem[], meta: { total: number, per_page: number, from?: number | null, to?: number | null } }>(
    '/pmc/reconciliations',
    { query: params, watch: [params] }
  )
}

export function useReconciliationSummary(params: MaybeRefOrGetter<ReconciliationListFilters>) {
  return useApiFetch<{ success: boolean, data: ReconciliationSummary }>(
    '/pmc/reconciliations/summary',
    { query: params, watch: [params] }
  )
}

export const RECONCILIATION_DETAIL_KEY = (id: number | string) => `reconciliation-detail-${id}`

export function useReconciliationDetail(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<{ success: boolean, data: ReconciliationDetail }>(
    computed(() => `/pmc/reconciliations/${toValue(id)}`),
    { key: computed(() => RECONCILIATION_DETAIL_KEY(toValue(id))), watch: [() => toValue(id)] }
  )
}

export function clearReconciliationCache(id: number | string) {
  clearNuxtData(RECONCILIATION_DETAIL_KEY(id))
}

// ─── Mutations ───

export function apiReconcile(id: number, data: { note?: string | null }) {
  return $api<{ success: boolean, data: ReconciliationDetail }>(
    `/pmc/reconciliations/${id}/reconcile`,
    { method: 'POST', body: data }
  )
}

export function apiRejectReconcile(id: number, data: { reason: string }) {
  return $api<{ success: boolean, data: ReconciliationDetail }>(
    `/pmc/reconciliations/${id}/reject`,
    { method: 'POST', body: data }
  )
}

export function apiBatchReconcile(data: { ids: number[], note?: string | null }) {
  return $api<{ success: boolean, data: { reconciled_count: number, skipped_count: number } }>(
    '/pmc/reconciliations/batch-reconcile',
    { method: 'POST', body: data }
  )
}
