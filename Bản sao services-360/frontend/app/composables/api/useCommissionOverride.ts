// ─── Types ───

export type CommissionOverrideRecipientType = 'operating_company' | 'board_of_directors' | 'staff'

export interface CommissionOverrideItem {
  id?: number
  recipient_type: { value: CommissionOverrideRecipientType, label: string }
  account: { id: number, name: string, employee_code: string | null } | null
  amount: string
}

export interface CommissionOverrideData {
  success: boolean
  data: {
    has_overrides: boolean
    commissionable_total: string
    platform_amount: string
    overrides: CommissionOverrideItem[]
  }
}

// ─── Form types (FE-only) ───

export interface OverrideFormItem {
  recipient_type: CommissionOverrideRecipientType
  account_id: number | null
  account_name: string
  amount: number | null
}

// ─── Constants ───

export const OVERRIDE_RECIPIENT_LABELS: Record<CommissionOverrideRecipientType, string> = {
  operating_company: 'Công ty vận hành',
  board_of_directors: 'Ban quản trị',
  staff: 'Nhân viên'
}

// ─── Queries ───

export function useCommissionOverride(orderId: MaybeRefOrGetter<number>) {
  return useApiFetch<CommissionOverrideData>(
    computed(() => `/pmc/orders/${toValue(orderId)}/commission-override`),
    { watch: [() => toValue(orderId)] }
  )
}

// ─── Mutations ───

export function apiSaveCommissionOverride(orderId: number, data: {
  overrides: {
    recipient_type: CommissionOverrideRecipientType
    account_id: number | null
    amount: number
  }[]
}) {
  return $api<CommissionOverrideData>(`/pmc/orders/${orderId}/commission-override`, {
    method: 'PUT',
    body: data
  })
}

export function apiDeleteCommissionOverride(orderId: number) {
  return $api<{ success: boolean }>(`/pmc/orders/${orderId}/commission-override`, {
    method: 'DELETE'
  })
}
