import type {
  OrderListResource,
  OrderDetailResource,
  OrderLineResource,
  OrdersIndex200,
  OrdersShow200,
  OrdersStore201,
  OrdersUpdate200,
  OrdersDestroy200,
  OrderTransition200,
  OrderAvailableQuotes200,
  OrderCheckDelete200,
  OrdersIndexParams,
  CreateOrderRequest,
  UpdateOrderRequest,
  TransitionOrderRequest
} from '#api/generated/laravel'

// ─── Status helpers ───

import type { BadgeColor } from '~/utils/badge'

// ─── Re-export generated types with app-friendly names ───

export type OrderListItem = OrderListResource
export type OrderDetail = OrderDetailResource
export type OrderLine = OrderLineResource
export type OrderStatus = 'draft' | 'confirmed' | 'in_progress' | 'accepted' | 'completed' | 'cancelled'
export type OrderListFilters = OrdersIndexParams
export type CreateOrderPayload = CreateOrderRequest
export type UpdateOrderPayload = UpdateOrderRequest
export type TransitionOrderPayload = TransitionOrderRequest

export function orderStatusColor(value: string): BadgeColor {
  switch (value) {
    case 'draft': return 'neutral'
    case 'confirmed': return 'primary'
    case 'in_progress': return 'warning'
    case 'accepted': return 'success'
    case 'completed': return 'success'
    case 'cancelled': return 'error'
    default: return 'neutral'
  }
}

export const ORDER_STATUS_OPTIONS = [
  { label: 'Nháp', value: 'draft' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Đang thực hiện', value: 'in_progress' },
  { label: 'Đã nghiệm thu', value: 'accepted' },
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Đã hủy', value: 'cancelled' }
]

export const ORDER_WORKFLOW_STEPS = [
  { value: 'draft', title: 'Nháp', description: 'Đơn hàng mới tạo', icon: 'i-lucide-file-edit' },
  { value: 'confirmed', title: 'Đã xác nhận', description: 'Chờ thực hiện', icon: 'i-lucide-check-circle' },
  { value: 'in_progress', title: 'Đang thực hiện', description: 'Đang thi công', icon: 'i-lucide-loader' },
  { value: 'accepted', title: 'Đã nghiệm thu', description: 'Đã nghiệm thu', icon: 'i-lucide-clipboard-check' },
  { value: 'completed', title: 'Hoàn thành', description: 'Đã hoàn tất', icon: 'i-lucide-circle-check-big' }
]

export const ORDER_STATUS_ALERT: Record<string, { title: string, color: BadgeColor, icon: string }> = {
  draft: { title: 'Đơn hàng đang ở trạng thái nháp.', color: 'neutral', icon: 'i-lucide-file-edit' },
  confirmed: { title: 'Đơn hàng đã xác nhận.', color: 'info', icon: 'i-lucide-check-circle' },
  in_progress: { title: 'Đơn hàng đang thực hiện.', color: 'warning', icon: 'i-lucide-loader' },
  accepted: { title: 'Đơn hàng đã nghiệm thu.', color: 'success', icon: 'i-lucide-clipboard-check' },
  completed: { title: 'Đơn hàng đã hoàn thành.', color: 'success', icon: 'i-lucide-circle-check-big' },
  cancelled: { title: 'Đơn hàng đã bị hủy.', color: 'error', icon: 'i-lucide-x-circle' }
}

// ─── Queries ───

export function useOrderList(params: MaybeRefOrGetter<OrderListFilters & { page?: number }>) {
  return useApiFetch<OrdersIndex200>(
    '/pmc/orders',
    { query: params, watch: [params] }
  )
}

export const ORDER_DETAIL_KEY = (id: number | string) => `order-detail-${id}`

export function useOrderDetail(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<OrdersShow200>(
    computed(() => `/pmc/orders/${toValue(id)}`),
    { key: computed(() => ORDER_DETAIL_KEY(toValue(id))), watch: [() => toValue(id)] }
  )
}

export function clearOrderCache(id: number | string) {
  clearNuxtData(ORDER_DETAIL_KEY(id))
}

export function useAvailableQuotes() {
  return useApiFetch<OrderAvailableQuotes200>('/pmc/orders/available-quotes')
}

export function apiCheckDeleteOrder(id: number) {
  return $api<OrderCheckDelete200>(`/pmc/orders/${id}/check-delete`)
}

// ─── Mutations ───

export function apiCreateOrder(data: CreateOrderPayload) {
  return $api<OrdersStore201>('/pmc/orders', {
    method: 'POST',
    body: data
  })
}

export function apiUpdateOrder(id: number, data: { note?: string | null }) {
  return $api<OrdersUpdate200>(`/pmc/orders/${id}`, {
    method: 'PUT',
    body: data
  })
}

export function apiDeleteOrder(id: number) {
  return $api<OrdersDestroy200>(`/pmc/orders/${id}`, {
    method: 'DELETE'
  })
}

export function apiTransitionOrder(id: number, data: TransitionOrderPayload) {
  return $api<OrderTransition200>(`/pmc/orders/${id}/transition`, {
    method: 'POST',
    body: data
  })
}

// ─── Advance payer ───

export type OrderAdvanceStatus = 'none' | 'pending' | 'paid'

export const ADVANCE_STATUS_LABELS: Record<OrderAdvanceStatus, string> = {
  none: 'Chưa gán',
  pending: 'Chưa hoàn',
  paid: 'Đã hoàn'
}

export function advanceStatusColor(status: string): BadgeColor {
  switch (status) {
    case 'paid': return 'success'
    case 'pending': return 'warning'
    default: return 'neutral'
  }
}

/**
 * List active accounts (candidates for advance payer selection) with optional server-side search.
 * Results are capped server-side (top 50 matches). Returns raw AccountResource[] via success wrapper.
 */
export function useOrderActiveAccounts(search: MaybeRefOrGetter<string | undefined> = undefined) {
  const params = computed(() => ({ search: toValue(search) || undefined }))
  return useApiFetch<{ success: true, data: Array<{ id: number, name: string, employee_code: string | null }> }>(
    '/pmc/orders/active-accounts',
    {
      query: params,
      watch: [params],
      immediate: false
    }
  )
}

export function apiSetOrderLineAdvancePayer(
  orderId: number,
  lineId: number,
  advancePayerId: number | null
) {
  return $api<{ success: true, data: OrderDetailResource }>(
    `/pmc/orders/${orderId}/lines/${lineId}/advance-payer`,
    {
      method: 'PATCH',
      body: { advance_payer_id: advancePayerId }
    }
  )
}

export function apiUpdateOrderLinePrices(
  orderId: number,
  lineId: number,
  data: { unit_price: number, purchase_price: number | null }
) {
  return $api<{ success: true, data: OrderDetailResource }>(
    `/pmc/orders/${orderId}/lines/${lineId}/prices`,
    {
      method: 'PATCH',
      body: data
    }
  )
}
