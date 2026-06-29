import type {
  AttachmentResource,
  OgTicketDetailResource,
  OgTicketDetailResourceTicket,
  OgTicketListResource,
  PoolTicketResource,
  OgTicketPool200,
  OgTicketIndex200,
  OgTicketShow200,
  OgTicketUpdate200,
  OgTicketClaim201,
  OgTicketStore201,
  OgTicketDestroy200,
  OgTicketRelease200,
  OgTicketIndexParams,
  OgTicketPoolParams,
  CreateOgTicketRequest,
  UpdateOgTicketRequest
} from '#api/generated/laravel'

// ─── Status / Priority helpers ───

import type { BadgeColor } from '~/utils/badge'

// ─── Re-export generated types with app-friendly names ───

export type PoolTicket = PoolTicketResource
export type OgTicketItem = OgTicketListResource
export type OgTicketDetail = OgTicketDetailResource & {
  warranty_requests?: OgTicketWarrantyRequest[]
}
export type TicketAttachment = AttachmentResource
export type TicketSnapshot = NonNullable<OgTicketDetailResourceTicket>
export type OgTicketFilters = OgTicketIndexParams
export type PoolFilters = OgTicketPoolParams

// ─── Warranty request ───

export interface OgTicketWarrantyRequest {
  id: number
  subject: string
  description: string
  requester_name: string
  attachments: TicketAttachment[]
  created_at: string | null
}

// ─── Lifecycle segment ───

export interface OgTicketLifecycleSegment {
  id: number
  status: { value: string, label: string }
  cycle: number
  cycle_confirmed: boolean
  started_at: string
  ended_at: string | null
  note: string | null
  assignee: { id: number, name: string } | null
}

// ─── Audit (no generated type — backend returns untyped JsonResponse) ───

export interface OgTicketAudit {
  id: number
  event: 'created' | 'updated' | 'deleted' | 'restored'
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  user: { id: number, name: string } | null
  created_at: string
}

// ─── Payload (extend generated, add file upload fields) ───

export interface UpdateOgTicketPayload extends Omit<UpdateOgTicketRequest, 'status'> {
  sla_quote_due_at?: string | null
  attachments?: File[]
  delete_attachment_ids?: number[]
}

export interface CreateOgTicketPayload extends Omit<CreateOgTicketRequest, 'attachments'> {
  attachments?: File[]
}

export function ogTicketStatusColor(value: string): BadgeColor {
  switch (value) {
    case 'received': return 'info'
    case 'assigned': return 'primary'
    case 'surveying': return 'warning'
    case 'quoted': return 'warning'
    case 'approved': return 'success'
    case 'rejected': return 'error'
    case 'ordered': return 'success'
    case 'in_progress': return 'info'
    case 'accepted': return 'success'
    case 'completed': return 'success'
    case 'cancelled': return 'error'
    default: return 'neutral'
  }
}

export function ogTicketPriorityColor(value: string): BadgeColor {
  switch (value) {
    case 'low': return 'neutral'
    case 'normal': return 'info'
    case 'high': return 'warning'
    case 'urgent': return 'error'
    default: return 'neutral'
  }
}

export const OG_TICKET_STATUS_OPTIONS = [
  { label: 'Đã tiếp nhận', value: 'received' },
  { label: 'Đã phân công', value: 'assigned' },
  { label: 'Đang khảo sát', value: 'surveying' },
  { label: 'Đã báo giá', value: 'quoted' },
  { label: 'Đã chấp thuận', value: 'approved' },
  { label: 'Từ chối', value: 'rejected' },
  { label: 'Đã lên đơn', value: 'ordered' },
  { label: 'Đang thực hiện', value: 'in_progress' },
  { label: 'Đã nghiệm thu', value: 'accepted' },
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Đã hủy', value: 'cancelled' }
]

export const OG_TICKET_PRIORITY_OPTIONS = [
  { label: 'Thấp', value: 'low' },
  { label: 'Bình thường', value: 'normal' },
  { label: 'Cao', value: 'high' },
  { label: 'Khẩn cấp', value: 'urgent' }
]

export const OG_TICKET_WORKFLOW_STEPS = [
  { value: 'received', title: 'Tiếp nhận', description: 'Ticket đã được nhận', icon: 'i-lucide-inbox' },
  { value: 'assigned', title: 'Phân công', description: 'Đã gán người xử lý', icon: 'i-lucide-user-check' },
  { value: 'surveying', title: 'Khảo sát', description: 'Đang khảo sát hiện trường', icon: 'i-lucide-search' },
  { value: 'quoted', title: 'Báo giá', description: 'Đã gửi báo giá', icon: 'i-lucide-file-text' },
  { value: 'approved', title: 'Chấp thuận', description: 'Cư dân đã đồng ý', icon: 'i-lucide-check-circle' },
  { value: 'ordered', title: 'Lên đơn', description: 'Đã tạo đơn hàng', icon: 'i-lucide-shopping-cart' },
  { value: 'in_progress', title: 'Thực hiện', description: 'Đang thi công', icon: 'i-lucide-hammer' },
  { value: 'accepted', title: 'Nghiệm thu', description: 'Đã nghiệm thu', icon: 'i-lucide-clipboard-check' },
  { value: 'completed', title: 'Hoàn thành', description: 'Đã hoàn tất', icon: 'i-lucide-circle-check-big' }
]

export function ogTicketStatusToStepIndex(status: string): number {
  const index = OG_TICKET_WORKFLOW_STEPS.findIndex(s => s.value === status)
  return index >= 0 ? index : 0
}

// ─── Queries ───

export function usePoolTicketList(params: MaybeRefOrGetter<PoolFilters & { page?: number }>) {
  return useApiFetch<OgTicketPool200>('/pmc/og-tickets/pool', {
    query: params,
    watch: [params]
  })
}

export function useOgTicketList(params: MaybeRefOrGetter<OgTicketFilters & { page?: number }>) {
  return useApiFetch<OgTicketIndex200>('/pmc/og-tickets', {
    query: params,
    watch: [params]
  })
}

export function useOgTicketDetail(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<OgTicketShow200>(
    computed(() => `/pmc/og-tickets/${toValue(id)}`),
    { watch: [() => toValue(id)] }
  )
}

export function useOgTicketAudits(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<{ success: boolean, data: OgTicketAudit[] }>(
    computed(() => `/pmc/og-tickets/${toValue(id)}/audits`),
    { watch: [() => toValue(id)] }
  )
}

// ─── Mutations ───

export function apiClaimTicket(data: { ticket_id: number }): Promise<OgTicketClaim201> {
  return $api<OgTicketClaim201>('/pmc/og-tickets/claim', {
    method: 'POST',
    body: data
  })
}

export function apiCreateOgTicket(data: CreateOgTicketPayload): Promise<OgTicketStore201> {
  const formData = new FormData()

  formData.append('requester_name', data.requester_name)
  formData.append('requester_phone', data.requester_phone)
  formData.append('subject', data.subject)
  formData.append('channel', data.channel)
  formData.append('priority', data.priority)

  if (data.description != null) formData.append('description', data.description)
  if (data.address != null) formData.append('address', data.address)
  if (data.apartment_name != null) formData.append('apartment_name', data.apartment_name)
  if (data.latitude != null) formData.append('latitude', String(data.latitude))
  if (data.longitude != null) formData.append('longitude', String(data.longitude))
  if (data.project_id != null) formData.append('project_id', String(data.project_id))
  if (data.internal_note != null) formData.append('internal_note', data.internal_note)
  if (data.received_by_id != null) formData.append('received_by_id', String(data.received_by_id))

  if (data.assigned_to_ids) {
    data.assigned_to_ids.forEach(id => formData.append('assigned_to_ids[]', String(id)))
  }
  if (data.category_ids) {
    data.category_ids.forEach(id => formData.append('category_ids[]', String(id)))
  }
  if (data.attachments) {
    data.attachments.forEach(file => formData.append('attachments[]', file))
  }

  return $api<OgTicketStore201>('/pmc/og-tickets', {
    method: 'POST',
    body: formData
  })
}

export function apiUpdateOgTicket(
  id: number,
  data: UpdateOgTicketPayload
): Promise<OgTicketUpdate200> {
  const formData = new FormData()
  formData.append('_method', 'PUT')

  formData.append('priority', data.priority)
  if (data.received_by_id != null) formData.append('received_by_id', String(data.received_by_id))
  if (data.assigned_to_ids) {
    data.assigned_to_ids.forEach(id => formData.append('assigned_to_ids[]', String(id)))
  }
  if (data.sla_quote_due_at) formData.append('sla_quote_due_at', data.sla_quote_due_at)
  if (data.sla_completion_due_at) formData.append('sla_completion_due_at', data.sla_completion_due_at)
  if (data.internal_note != null) formData.append('internal_note', data.internal_note)

  // requester_name/requester_phone là snapshot — không gửi trong update.
  if (data.subject) formData.append('subject', data.subject)
  if (data.description != null) formData.append('description', data.description ?? '')
  if (data.address != null) formData.append('address', data.address ?? '')
  if (data.latitude != null) formData.append('latitude', String(data.latitude))
  if (data.longitude != null) formData.append('longitude', String(data.longitude))
  if (data.apartment_name != null) formData.append('apartment_name', data.apartment_name ?? '')
  if (data.project_id != null) formData.append('project_id', String(data.project_id))

  if (data.attachments) {
    data.attachments.forEach(file => formData.append('attachments[]', file))
  }
  if (data.delete_attachment_ids) {
    data.delete_attachment_ids.forEach(id => formData.append('delete_attachment_ids[]', String(id)))
  }

  return $api<OgTicketUpdate200>(`/pmc/og-tickets/${id}`, {
    method: 'POST',
    body: formData
  })
}

export function apiCheckDeleteOgTicket(id: number): Promise<{ can_delete: boolean, message: string }> {
  return $api<{ can_delete: boolean, message: string }>(`/pmc/og-tickets/${id}/check-delete`)
}

export function apiDeleteOgTicket(id: number): Promise<OgTicketDestroy200> {
  return $api<OgTicketDestroy200>(`/pmc/og-tickets/${id}`, {
    method: 'DELETE'
  })
}

export function apiTransitionOgTicket(
  id: number,
  data: { target_status: string, note?: string }
): Promise<OgTicketShow200> {
  return $api<OgTicketShow200>(`/pmc/og-tickets/${id}/transition`, {
    method: 'PUT',
    body: data
  })
}

export function apiReleaseOgTicket(
  id: number,
  data?: { note?: string }
): Promise<OgTicketRelease200> {
  return $api<OgTicketRelease200>(`/pmc/og-tickets/${id}/release`, {
    method: 'PUT',
    body: data ?? {}
  })
}
