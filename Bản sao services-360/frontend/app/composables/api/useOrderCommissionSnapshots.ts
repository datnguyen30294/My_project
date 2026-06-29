// ─── Types ───

export interface OrderCommissionSnapshotItem {
  id: number
  order_id: number
  closing_period_id: number
  closing_period_name: string | null
  closing_period_status: string | null
  recipient_type: { value: string, label: string }
  account_id: number | null
  recipient_name: string
  value_type: { value: string, label: string } | null
  percent: string | null
  value_fixed: string | null
  amount: string
  resolved_from: string
  payout_status: { value: string, label: string } | null
}

export interface OrderCommissionSnapshotData {
  success: boolean
  data: OrderCommissionSnapshotItem[]
}

// ─── Queries ───

export function useOrderCommissionSnapshots(orderId: MaybeRefOrGetter<number>) {
  return useApiFetch<OrderCommissionSnapshotData>(
    computed(() => `/pmc/orders/${toValue(orderId)}/commission-snapshot`),
    { watch: [() => toValue(orderId)] }
  )
}
