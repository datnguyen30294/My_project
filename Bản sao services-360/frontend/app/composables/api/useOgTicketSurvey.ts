export interface OgTicketSurveyAttachment {
  id: number
  file_path: string
  original_name: string
  mime_type: string
  size_bytes: number
  url: string | null
}

export interface OgTicketSurvey {
  id: number
  og_ticket_id: number
  note: string | null
  surveyed_by: number | null
  surveyor: { id: number, name: string } | null
  surveyed_at: string | null
  attachments: OgTicketSurveyAttachment[]
  created_at: string | null
  updated_at: string | null
}

export interface OgTicketSurveyResponse {
  data: OgTicketSurvey
  success: boolean
}

export const SURVEY_MAX_FILES = 20
export const SURVEY_MAX_FILE_BYTES = 100 * 1024 * 1024
export const SURVEY_ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
]

export function useOgTicketSurvey(
  ogTicketId: MaybeRefOrGetter<number | string>,
  opts: { immediate?: boolean } = {}
) {
  return useApiFetch<OgTicketSurveyResponse>(
    computed(() => `/pmc/og-tickets/${toValue(ogTicketId)}/survey`),
    {
      watch: [() => toValue(ogTicketId)],
      immediate: opts.immediate ?? true
    }
  )
}

export function apiUpsertOgTicketSurvey(
  ogTicketId: number | string,
  payload: { note?: string | null, attachments?: File[] }
) {
  const formData = new FormData()
  if (payload.note !== undefined && payload.note !== null) {
    formData.append('note', payload.note)
  }
  for (const file of payload.attachments ?? []) {
    formData.append('attachments[]', file)
  }

  return $api<OgTicketSurveyResponse>(
    `/pmc/og-tickets/${ogTicketId}/survey`,
    { method: 'POST', body: formData }
  )
}

export function apiDeleteOgTicketSurveyAttachment(
  ogTicketId: number | string,
  attachmentId: number | string
) {
  return $api<OgTicketSurveyResponse>(
    `/pmc/og-tickets/${ogTicketId}/survey/attachments/${attachmentId}`,
    { method: 'DELETE' }
  )
}

// ─── Public (token-less, ticket code based) ───

export function usePublicOgTicketSurvey(code: MaybeRefOrGetter<string>) {
  const baseURL = getApiBaseUrl()
  return useFetch<OgTicketSurveyResponse>(
    computed(() => `${baseURL}/public/tickets/${toValue(code)}/survey`),
    { watch: [() => toValue(code)] }
  )
}

export function apiUpsertPublicOgTicketSurvey(
  code: string,
  payload: { note?: string | null, attachments?: File[] }
) {
  const baseURL = getApiBaseUrl()
  const formData = new FormData()
  if (payload.note !== undefined && payload.note !== null) {
    formData.append('note', payload.note)
  }
  for (const file of payload.attachments ?? []) {
    formData.append('attachments[]', file)
  }

  return $fetch<OgTicketSurveyResponse>(
    `${baseURL}/public/tickets/${code}/survey`,
    { method: 'POST', body: formData }
  )
}

export function apiDeletePublicOgTicketSurveyAttachment(
  code: string,
  attachmentId: number | string
) {
  const baseURL = getApiBaseUrl()
  return $fetch<OgTicketSurveyResponse>(
    `${baseURL}/public/tickets/${code}/survey/attachments/${attachmentId}`,
    { method: 'DELETE' }
  )
}
