import type {
  SubmitTicketRequest,
  SubmitTicketRequestChannel,
  TicketResource,
  TicketRatingInfoResource,
  TicketIndexParams,
  TicketIndex200,
  TicketShow200,
  AttachmentResource
} from '#api/generated/laravel'

export interface PmcProcessingInfo {
  status: { value: string, label: string }
  priority: { value: string, label: string }
  received_at: string | null
  received_by: { id: number, name: string } | null
  assignees: { id: number, name: string }[]
  sla_due_at: string | null
}

export interface TicketDetailResource extends Omit<TicketResource, 'pmc_processing'> {
  pmc_processing: PmcProcessingInfo | null
  apartment_name?: string | null
  project_id?: number | null
}

export interface TicketDetailShow200 {
  data: TicketDetailResource
  success: boolean
}

// Re-export generated types for use in pages
export type { SubmitTicketRequest, SubmitTicketRequestChannel, TicketResource, TicketRatingInfoResource, AttachmentResource, TicketIndexParams, TicketIndex200, TicketShow200 }

function getPublicFetch() {
  return <T>(url: string, opts?: Parameters<typeof $fetch>[1]) =>
    $fetch<T>(url, { baseURL: getApiBaseUrl(), ...opts })
}

export function usePlatformTicketList(params: MaybeRefOrGetter<TicketIndexParams>) {
  return usePlatformApiFetch<TicketIndex200>('/platform/tickets', {
    query: computed(() => toValue(params))
  })
}

export function usePlatformTicketDetail(id: MaybeRefOrGetter<number | string>) {
  const url = computed(() => `/platform/tickets/${toValue(id)}`)
  return usePlatformApiFetch<TicketDetailShow200>(url)
}

export interface SubmitTicketData {
  requester_name: string
  requester_phone: string
  requester_email?: string
  subject: string
  description?: string
  channel?: SubmitTicketRequestChannel
  project_id?: number | null
  claimed_by_org_id?: string
  address?: string
  latitude?: number | null
  longitude?: number | null
  attachments?: File[]
}

export interface TicketLookupResult {
  org_name: string | null
  project_name: string | null
}

export async function apiTicketLookup(orgId?: string, projectId?: number): Promise<TicketLookupResult> {
  const publicFetch = getPublicFetch()
  const query = new URLSearchParams()
  if (orgId) query.set('org_id', orgId)
  if (projectId != null) query.set('project_id', String(projectId))
  const qs = query.toString()
  const res = await publicFetch<{ data: TicketLookupResult }>(`/tickets/lookup${qs ? `?${qs}` : ''}`)
  return res.data
}

// --- Public Ticket Info (Rating + Quote) ---

export interface PublicQuoteLineItem {
  name: string
  quantity: number
  unit: string
  unit_price: string
  line_amount: string
  line_type: { value: string, label: string }
}

export interface PublicQuoteInfo {
  code: string
  status: { value: string, label: string }
  total_amount: string
  lines: PublicQuoteLineItem[]
  is_resident_actionable: boolean
  manager_approved_at: string | null
  note: string | null
}

export interface PublicWarrantyAttachment {
  id: number
  url: string | null
  original_name: string
  mime_type: string
  size_bytes: number
}

export interface PublicWarrantyRequest {
  id: number
  subject: string
  description: string
  requester_name: string
  created_at: string | null
  attachments: PublicWarrantyAttachment[]
}

export interface PublicAcceptanceReportInfo {
  share_token: string
  public_url: string
  is_confirmed: boolean
  confirmed_at: string | null
  confirmed_signature_name: string | null
  is_confirmable: boolean
  has_signed_file: boolean
  signed_file_url: string | null
  signed_file_original_name: string | null
  signed_uploaded_at: string | null
}

export interface PublicTicketInfo extends TicketRatingInfoResource {
  quote: PublicQuoteInfo | null
  warranty_requests: PublicWarrantyRequest[]
  can_request_warranty: boolean
  acceptance_report: PublicAcceptanceReportInfo | null
}

export interface SubmitWarrantyData {
  subject: string
  description: string
  attachments?: File[]
}

export function usePublicTicketInfo(code: MaybeRefOrGetter<string>) {
  const url = computed(() => `/tickets/${toValue(code)}/rating`)

  return useFetch<{ success: boolean, data: PublicTicketInfo }>(url, {
    baseURL: getApiBaseUrl()
  })
}

export interface SubmitRatingData {
  resident_rating: number
  resident_rating_comment?: string
}

export interface SubmitQuoteDecisionData {
  action: 'approve' | 'reject'
  reason?: string
}

export async function apiSubmitQuoteDecision(code: string, data: SubmitQuoteDecisionData): Promise<{ success: boolean, message: string }> {
  const publicFetch = getPublicFetch()
  return publicFetch<{ success: boolean, message: string }>(`/tickets/${code}/quote-decision`, {
    method: 'POST',
    body: data
  })
}

export async function apiSubmitTicketRating(code: string, data: SubmitRatingData): Promise<{ success: boolean, message: string }> {
  const publicFetch = getPublicFetch()
  return publicFetch<{ success: boolean, message: string }>(`/tickets/${code}/rating`, {
    method: 'POST',
    body: data
  })
}

export async function apiSubmitWarrantyRequest(code: string, data: SubmitWarrantyData): Promise<{ success: boolean, message: string }> {
  const publicFetch = getPublicFetch()

  const formData = new FormData()
  formData.append('subject', data.subject)
  formData.append('description', data.description)
  if (data.attachments) {
    data.attachments.forEach((file) => {
      formData.append('attachments[]', file)
    })
  }

  return publicFetch<{ success: boolean, message: string }>(`/tickets/${code}/warranty`, {
    method: 'POST',
    body: formData
  })
}

// --- Submit Ticket ---

export function apiSubmitTicket(data: SubmitTicketData): Promise<{ data: TicketResource }> {
  const publicFetch = getPublicFetch()

  const formData = new FormData()
  formData.append('requester_name', data.requester_name)
  formData.append('requester_phone', data.requester_phone)
  if (data.requester_email) formData.append('requester_email', data.requester_email)
  formData.append('subject', data.subject)
  if (data.description) formData.append('description', data.description)
  if (data.address) formData.append('address', data.address)
  if (data.latitude != null) formData.append('latitude', String(data.latitude))
  if (data.longitude != null) formData.append('longitude', String(data.longitude))
  if (data.channel) formData.append('channel', data.channel)
  if (data.project_id != null) formData.append('project_id', String(data.project_id))
  if (data.claimed_by_org_id) formData.append('claimed_by_org_id', data.claimed_by_org_id)
  if (data.attachments) {
    data.attachments.forEach((file) => {
      formData.append('attachments[]', file)
    })
  }

  return publicFetch<{ data: TicketResource }>('/tickets', {
    method: 'POST',
    body: formData
  })
}
