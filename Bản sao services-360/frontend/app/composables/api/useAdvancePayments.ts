import type { AdvancePaymentHistoryResource } from '#api/generated/laravel'

// ─── Types ───

export interface AdvancePaymentRow {
  key: number
  order_line_id: number
  order_id: number
  order_code: string
  line_name: string
  quantity: number
  unit: string
  purchase_price: string | null
  advance_amount: string
  project_id: number | null
  is_paid: boolean
  paid_at: string | null
  advance_payer: {
    id: number
    name: string
    employee_code: string | null
    bank_info: {
      bin: string
      label: string
      account_number: string
      account_name: string
    } | null
  } | null
}

export interface AdvancePaymentStats {
  total_advanced: string
  total_pending: string
  total_paid: string
  account_count: number
}

export interface AdvancePaymentListFilters {
  status?: 'all' | 'pending' | 'paid'
  project_id?: number
  account_id?: number
  search?: string
}

export const ADVANCE_PAYMENT_LIST_KEY = 'advance-payments-list'
export const ADVANCE_PAYMENT_STATS_KEY = 'advance-payments-stats'
export const ADVANCE_PAYMENT_HISTORY_KEY = 'advance-payments-history'

// ─── Queries ───

export function useAdvancePaymentList(filters: MaybeRefOrGetter<AdvancePaymentListFilters>) {
  return useApiFetch<{ success: true, data: AdvancePaymentRow[] }>(
    '/pmc/advance-payments',
    {
      key: ADVANCE_PAYMENT_LIST_KEY,
      query: filters,
      watch: [filters]
    }
  )
}

export function useAdvancePaymentStats() {
  return useApiFetch<{ success: true, data: AdvancePaymentStats }>(
    '/pmc/advance-payments/stats',
    { key: ADVANCE_PAYMENT_STATS_KEY }
  )
}

export function useAdvancePaymentHistory() {
  return useApiFetch<{ success: true, data: AdvancePaymentHistoryResource[] }>(
    '/pmc/advance-payments/history',
    { key: ADVANCE_PAYMENT_HISTORY_KEY }
  )
}

export function clearAdvancePaymentCache() {
  clearNuxtData(ADVANCE_PAYMENT_LIST_KEY)
  clearNuxtData(ADVANCE_PAYMENT_STATS_KEY)
  clearNuxtData(ADVANCE_PAYMENT_HISTORY_KEY)
}

// ─── Mutations ───

export interface CreateSingleAdvancePayload {
  order_line_id: number
  note?: string | null
  paid_at?: string | null
}

export interface CreateBatchAdvancePayload {
  order_line_ids: number[]
  note?: string | null
  paid_at?: string | null
}

export function apiCreateAdvancePayment(data: CreateSingleAdvancePayload) {
  return $api<{ success: true, message: string, data: AdvancePaymentHistoryResource }>(
    '/pmc/advance-payments',
    { method: 'POST', body: data }
  )
}

export function apiCreateBatchAdvancePayment(data: CreateBatchAdvancePayload) {
  return $api<{ success: true, message: string, data: { count: number, batch_id: string | null } }>(
    '/pmc/advance-payments/batch',
    { method: 'POST', body: data }
  )
}

export function apiDeleteAdvancePayment(id: number) {
  return $api<{ success: true, message: string }>(
    `/pmc/advance-payments/${id}`,
    { method: 'DELETE' }
  )
}
