import type {
  QuoteListResource,
  QuoteDetailResource,
  QuoteLineResource,
  QuotesIndex200,
  QuotesShow200,
  QuotesStore201,
  QuotesDestroy200,
  QuoteCheckActive200,
  QuoteCheckDelete200,
  QuoteTransition200,
  QuotesIndexParams,
  CreateQuoteRequest,
  UpdateQuoteRequest,
  TransitionQuoteRequest
} from '#api/generated/laravel'

// ─── Status helpers ───

import type { BadgeColor } from '~/utils/badge'

// ─── Re-export generated types with app-friendly names ───

export type QuoteListItem = QuoteListResource
export type QuoteDetail = QuoteDetailResource
export type QuoteLine = QuoteLineResource
export type QuoteStatus = 'draft' | 'sent' | 'manager_approved' | 'approved' | 'manager_rejected' | 'resident_rejected'
export type QuoteLineType = 'material' | 'service' | 'adhoc'
export type QuoteListFilters = QuotesIndexParams
export type CreateQuotePayload = CreateQuoteRequest
export type UpdateQuotePayload = UpdateQuoteRequest
export type TransitionQuotePayload = TransitionQuoteRequest

export function quoteStatusColor(value: string): BadgeColor {
  switch (value) {
    case 'draft': return 'neutral'
    case 'sent': return 'primary'
    case 'manager_approved': return 'warning'
    case 'approved': return 'success'
    case 'manager_rejected':
    case 'resident_rejected':
    case 'cancelled': return 'error'
    default: return 'neutral'
  }
}

export function isQuoteRejected(value: string): boolean {
  return value === 'manager_rejected' || value === 'resident_rejected'
}

export const QUOTE_STATUS_OPTIONS = [
  { label: 'Nháp', value: 'draft' },
  { label: 'Đã gửi', value: 'sent' },
  { label: 'QL đã duyệt', value: 'manager_approved' },
  { label: 'Đã chấp thuận', value: 'approved' },
  { label: 'QL từ chối', value: 'manager_rejected' },
  { label: 'Cư dân từ chối', value: 'resident_rejected' },
  { label: 'Đã huỷ', value: 'cancelled' }
]

export const QUOTE_ACTIVE_OPTIONS = [
  { label: 'Còn hiệu lực', value: 'true' },
  { label: 'Đã thay thế', value: 'false' }
]

export const QUOTE_LINE_TYPE_OPTIONS = [
  { label: 'Vật tư', value: 'material' },
  { label: 'Dịch vụ', value: 'service' },
  { label: 'Dịch vụ tùy chọn', value: 'adhoc' }
]

export const QUOTE_LINE_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  QUOTE_LINE_TYPE_OPTIONS.map(o => [o.value, o.label])
)

export const QUOTE_CREATE_STATUS_OPTIONS = [
  { label: 'Nháp', value: 'draft' },
  { label: 'Gửi luôn (Chờ QL duyệt)', value: 'sent' }
]

export const QUOTE_WORKFLOW_STEPS = [
  { value: 'draft', title: 'Nháp', description: 'Đang soạn báo giá', icon: 'i-lucide-file-edit' },
  { value: 'sent', title: 'Đã gửi', description: 'Chờ quản lý duyệt', icon: 'i-lucide-send' },
  { value: 'manager_approved', title: 'QL duyệt', description: 'Chờ cư dân chấp thuận', icon: 'i-lucide-user-check' },
  { value: 'approved', title: 'Chấp thuận', description: 'Cư dân đã đồng ý', icon: 'i-lucide-check-circle' }
]

// ─── Queries ───

export function useQuoteList(params: MaybeRefOrGetter<QuoteListFilters & { page?: number }>) {
  return useApiFetch<QuotesIndex200>(
    '/pmc/quotes',
    { query: params, watch: [params] }
  )
}

export const QUOTE_DETAIL_KEY = (id: number | string) => `quote-detail-${id}`
export const QUOTE_AUDITS_KEY = (id: number | string) => `quote-audits-${id}`

export function useQuoteDetail(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<QuotesShow200>(
    computed(() => `/pmc/quotes/${toValue(id)}`),
    { key: computed(() => QUOTE_DETAIL_KEY(toValue(id))), watch: [() => toValue(id)] }
  )
}

export function clearQuoteCache(id: number | string) {
  clearNuxtData(QUOTE_DETAIL_KEY(id))
  clearNuxtData(QUOTE_AUDITS_KEY(id))
}

export function useQuoteVersions(ogTicketId: MaybeRefOrGetter<number | null | undefined>) {
  const url = computed(() => {
    const id = toValue(ogTicketId)
    return id ? `/pmc/quotes/versions/${id}` : ''
  })

  return useApiFetch<{ success: boolean, data: QuoteDetailResource[] }>(
    url,
    { watch: [url] }
  )
}

export function useQuoteCheckActive(ogTicketId: MaybeRefOrGetter<number | null | undefined>) {
  return useApiFetch<QuoteCheckActive200>(
    '/pmc/quotes/check-active',
    {
      query: computed(() => {
        const id = toValue(ogTicketId)
        return id ? { og_ticket_id: id } : {}
      }),
      watch: [() => toValue(ogTicketId)],
      immediate: false
    }
  )
}

// ─── Audit (no generated type — backend returns untyped JsonResponse) ───

export interface QuoteAudit {
  id: number
  event: 'created' | 'updated' | 'deleted' | 'restored'
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  user: { id: number, name: string } | null
  created_at: string | null
}

export function useQuoteAudits(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<{ success: boolean, data: QuoteAudit[] }>(
    computed(() => `/pmc/quotes/${toValue(id)}/audits`),
    { key: computed(() => QUOTE_AUDITS_KEY(toValue(id))), watch: [() => toValue(id)] }
  )
}

export function apiGetQuoteVersions(ogTicketId: number) {
  return $api<{ success: boolean, data: QuoteDetailResource[] }>(`/pmc/quotes/versions/${ogTicketId}`)
}

// ─── Mutations ───

export function apiCreateQuote(data: CreateQuotePayload) {
  return $api<QuotesStore201>('/pmc/quotes', {
    method: 'POST',
    body: data
  })
}

export function apiUpdateQuote(id: number, data: UpdateQuotePayload) {
  return $api<QuotesShow200>(`/pmc/quotes/${id}`, {
    method: 'PUT',
    body: data
  })
}

export function apiCheckDeleteQuote(id: number) {
  return $api<QuoteCheckDelete200>(`/pmc/quotes/${id}/check-delete`)
}

export function apiDeleteQuote(id: number) {
  return $api<QuotesDestroy200>(`/pmc/quotes/${id}`, {
    method: 'DELETE'
  })
}

export function apiTransitionQuote(id: number, data: TransitionQuotePayload) {
  return $api<QuoteTransition200>(`/pmc/quotes/${id}/transition`, {
    method: 'POST',
    body: data
  })
}
