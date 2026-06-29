import type {
  CashAccountResource,
  CashTransactionListResource,
  CashTransactionDetailResource,
  TreasuryKpiResource,
  CashTransactionIndexParams,
  TreasurySummaryIndexParams
} from '#api/generated/laravel'
import type { BadgeColor } from '~/utils/badge'

// ─── Re-export generated types ───

export type { CashAccountResource, CashTransactionListResource, CashTransactionDetailResource, TreasuryKpiResource }

export type TreasuryListFilters = CashTransactionIndexParams

// ─── Direction / Category helpers ───

export function cashTransactionDirectionColor(value: string): BadgeColor {
  return value === 'inflow' ? 'success' : 'warning'
}

export function manualReconciliationStatusColor(value: string): BadgeColor {
  if (value === 'reconciled') return 'success'
  if (value === 'rejected') return 'error'
  return 'warning'
}

export function cashTransactionCategoryColor(value: string): BadgeColor {
  const map: Record<string, BadgeColor> = {
    manual_topup: 'success',
    manual_withdraw: 'warning',
    receivable_collection: 'primary',
    customer_refund: 'secondary',
    commission_payout: 'neutral'
  }
  return map[value] ?? 'neutral'
}

export const CASH_TRANSACTION_DIRECTION_OPTIONS = [
  { label: 'Tiền vào', value: 'inflow' },
  { label: 'Tiền ra', value: 'outflow' }
]

export const CASH_TRANSACTION_CATEGORY_OPTIONS = [
  { label: 'Nạp tiền thủ công', value: 'manual_topup' },
  { label: 'Rút tiền thủ công', value: 'manual_withdraw' },
  { label: 'Thu công nợ', value: 'receivable_collection' },
  { label: 'Hoàn tiền khách', value: 'customer_refund' },
  { label: 'Chi hoa hồng', value: 'commission_payout' }
]

export const CASH_TRANSACTION_INCLUDE_DELETED_OPTIONS = [
  { label: 'Ẩn đã xoá', value: 'none' },
  { label: 'Chỉ xoá thủ công', value: 'manual' },
  { label: 'Chỉ xoá tự động', value: 'auto' },
  { label: 'Tất cả (kể cả đã xoá)', value: 'all' }
]

// ─── Queries ───

export function useCashAccountDefault() {
  return useApiFetch<{ success: boolean, data: CashAccountResource }>(
    '/pmc/treasury/cash-accounts/default',
    { key: 'treasury-cash-account-default' }
  )
}

export function useCashTransactionList(params: MaybeRefOrGetter<TreasuryListFilters & { page?: number }>) {
  return useApiFetch<{
    success: boolean
    data: CashTransactionListResource[]
    meta: { total: number, per_page: number, from?: number | null, to?: number | null }
  }>(
    '/pmc/treasury/transactions',
    { query: params, watch: [params] }
  )
}

export const CASH_TRANSACTION_DETAIL_KEY = (id: number | string) => `cash-transaction-detail-${id}`

export function useCashTransactionDetail(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<{ success: boolean, data: CashTransactionDetailResource }>(
    computed(() => `/pmc/treasury/transactions/${toValue(id)}`),
    {
      key: computed(() => CASH_TRANSACTION_DETAIL_KEY(toValue(id))),
      watch: [() => toValue(id)]
    }
  )
}

export function useTreasuryKpi(params: MaybeRefOrGetter<TreasurySummaryIndexParams>) {
  return useApiFetch<{ success: boolean, data: TreasuryKpiResource }>(
    '/pmc/treasury/summary',
    { query: params, watch: [params] }
  )
}

// ─── Mutations ───

export function apiManualTopup(data: {
  cash_account_id: number
  amount: number
  transaction_date: string
  note?: string | null
}) {
  return $api<{ success: boolean, data: CashTransactionDetailResource }>(
    '/pmc/treasury/transactions/manual-topup',
    { method: 'POST', body: data }
  )
}

export function apiManualWithdraw(data: {
  cash_account_id: number
  amount: number
  transaction_date: string
  note?: string | null
}) {
  return $api<{ success: boolean, data: CashTransactionDetailResource }>(
    '/pmc/treasury/transactions/manual-withdraw',
    { method: 'POST', body: data }
  )
}

export function apiDeleteCashTransaction(id: number | string, reason: string) {
  return $api<{ success: boolean, data: CashTransactionDetailResource }>(
    `/pmc/treasury/transactions/${id}`,
    { method: 'DELETE', body: { reason } }
  )
}
