import type {
  ReceivableListResource,
  ReceivableDetailResource,
  PaymentReceiptResource,
  ReceivablesIndex200,
  ReceivablesShow200,
  ReceivableSummary200,
  ReceivableRecordPayment200,
  ReceivableUpdatePayment200,
  ReceivableWriteOff200,
  ReceivablesIndexParams,
  CreatePaymentReceiptRequest,
  UpdatePaymentReceiptRequest,
  WriteOffReceivableRequest
} from '#api/generated/laravel'

import type { BadgeColor } from '~/utils/badge'

// ─── Re-export types ───

export type ReceivableListItem = ReceivableListResource
export type ReceivableDetail = ReceivableDetailResource
export type PaymentReceipt = PaymentReceiptResource
export type ReceivableListFilters = ReceivablesIndexParams
export type CreatePaymentPayload = CreatePaymentReceiptRequest
export type UpdatePaymentPayload = UpdatePaymentReceiptRequest
export type WriteOffPayload = WriteOffReceivableRequest

export type ReceivableStatus = 'unpaid' | 'partial' | 'paid' | 'overpaid' | 'overdue' | 'completed' | 'written_off'
export type PaymentMethodValue = 'cash' | 'transfer'
export type PaymentReceiptTypeValue = 'collection' | 'refund'

// ─── Status helpers ───

export function receivableStatusColor(value: string): BadgeColor {
  switch (value) {
    case 'unpaid': return 'neutral'
    case 'partial': return 'warning'
    case 'paid': return 'success'
    case 'overpaid': return 'info'
    case 'overdue': return 'error'
    case 'completed': return 'success'
    case 'written_off': return 'neutral'
    default: return 'neutral'
  }
}

export const RECEIVABLE_STATUS_OPTIONS = [
  { label: 'Chưa thu', value: 'unpaid' },
  { label: 'Thu một phần', value: 'partial' },
  { label: 'Đã thu đủ', value: 'paid' },
  { label: 'Thu thừa', value: 'overpaid' },
  { label: 'Quá hạn', value: 'overdue' },
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Xóa nợ', value: 'written_off' }
]

export const PAYMENT_METHOD_OPTIONS = [
  { label: 'Tiền mặt', value: 'cash' },
  { label: 'Chuyển khoản', value: 'transfer' }
]

export function paymentReceiptTypeColor(value: string): BadgeColor {
  return value === 'refund' ? 'warning' : 'success'
}

// ─── Aging display ───

export function formatAgingDays(agingDays: number | null, status: string): string {
  if (status === 'paid' || status === 'overpaid' || status === 'completed' || status === 'written_off') return '—'
  if (agingDays === null || agingDays === 0) return 'Chưa đến hạn'
  return `${agingDays} ngày`
}

// ─── Refund / Complete payload types ───

export interface CreateRefundPayload {
  amount: number
  payment_method: PaymentMethodValue
  note?: string | null
  paid_at: string
}

// ─── Queries ───

export function useReceivableList(params: MaybeRefOrGetter<ReceivableListFilters & { page?: number }>) {
  return useApiFetch<ReceivablesIndex200>(
    '/pmc/receivables',
    { query: params, watch: [params] }
  )
}

export function useReceivableSummary(params: MaybeRefOrGetter<{ project_id?: number | null }>) {
  return useApiFetch<ReceivableSummary200>(
    '/pmc/receivables/summary',
    { query: params, watch: [params] }
  )
}

export const RECEIVABLE_DETAIL_KEY = (id: number | string) => `receivable-detail-${id}`

export function useReceivableDetail(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<ReceivablesShow200>(
    computed(() => `/pmc/receivables/${toValue(id)}`),
    { key: computed(() => RECEIVABLE_DETAIL_KEY(toValue(id))), watch: [() => toValue(id)] }
  )
}

export function clearReceivableCache(id: number | string) {
  clearNuxtData(RECEIVABLE_DETAIL_KEY(id))
}

// ─── Audits ───

export interface ReceivableAudit {
  id: number
  event: string
  auditable_type: 'receivable' | 'payment_receipt'
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  user: { id: number, name: string } | null
  created_at: string | null
}

export function useReceivableAudits(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<{ success: boolean, data: ReceivableAudit[] }>(
    computed(() => `/pmc/receivables/${toValue(id)}/audits`),
    { watch: [() => toValue(id)] }
  )
}

// ─── Mutations ───

export function apiCreatePayment(receivableId: number, data: CreatePaymentPayload) {
  return $api<ReceivableRecordPayment200>(`/pmc/receivables/${receivableId}/payments`, {
    method: 'POST',
    body: data
  })
}

export function apiUpdatePayment(receivableId: number, paymentId: number, data: UpdatePaymentPayload) {
  return $api<ReceivableUpdatePayment200>(`/pmc/receivables/${receivableId}/payments/${paymentId}`, {
    method: 'PUT',
    body: data
  })
}

export function apiWriteOffReceivable(receivableId: number, data: WriteOffPayload) {
  return $api<ReceivableWriteOff200>(`/pmc/receivables/${receivableId}/write-off`, {
    method: 'POST',
    body: data
  })
}

export function apiCreateRefund(receivableId: number, data: CreateRefundPayload) {
  return $api<ReceivableRecordPayment200>(`/pmc/receivables/${receivableId}/refund`, {
    method: 'POST',
    body: data
  })
}

export function apiMarkCompleted(receivableId: number) {
  return $api<ReceivableRecordPayment200>(`/pmc/receivables/${receivableId}/complete`, {
    method: 'POST'
  })
}
