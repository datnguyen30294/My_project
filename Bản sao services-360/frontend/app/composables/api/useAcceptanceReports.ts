import type {
  AcceptanceReportResource,
  AcceptanceReportShow200,
  AcceptanceReportUpdate200,
  AcceptanceReportRegenerate200,
  AcceptanceReportDestroy200,
  PublicAcceptanceReportShow200,
  PublicAcceptanceReportUpdate200,
  UpdateAcceptanceReportRequest
} from '#api/generated/laravel'

export type AcceptanceReport = AcceptanceReportResource
export type UpdateAcceptanceReportPayload = UpdateAcceptanceReportRequest

export const ACCEPTANCE_REPORT_PLACEHOLDERS: { token: string, label: string }[] = [
  { token: '{{order_code}}', label: 'Mã đơn hàng' },
  { token: '{{order_total}}', label: 'Tổng giá trị đơn' },
  { token: '{{order_date}}', label: 'Ngày tạo đơn' },
  { token: '{{today}}', label: 'Ngày hôm nay' },
  { token: '{{customer_name}}', label: 'Họ tên khách hàng' },
  { token: '{{customer_phone}}', label: 'Điện thoại khách hàng' },
  { token: '{{customer_address}}', label: 'Địa chỉ khách hàng' },
  { token: '{{ticket_subject}}', label: 'Nội dung yêu cầu' },
  { token: '{{project_name}}', label: 'Tên dự án' },
  { token: '{{organization_name}}', label: 'Tên đơn vị thi công' },
  { token: '{{order_lines_table}}', label: 'Bảng chi tiết hạng mục' },
  { token: '{{note}}', label: 'Ghi chú đơn' }
]

// ─── Admin queries ───

export function useAcceptanceReport(
  orderId: MaybeRefOrGetter<number | string>,
  opts: { immediate?: boolean } = {}
) {
  return useApiFetch<AcceptanceReportShow200>(
    computed(() => `/pmc/orders/${toValue(orderId)}/acceptance-report`),
    {
      watch: [() => toValue(orderId)],
      immediate: opts.immediate ?? true
    }
  )
}

// ─── Admin mutations ───

export function apiUpdateAcceptanceReport(orderId: number | string, data: UpdateAcceptanceReportPayload) {
  return $api<AcceptanceReportUpdate200>(
    `/pmc/orders/${orderId}/acceptance-report`,
    { method: 'PUT', body: data }
  )
}

export function apiDeleteAcceptanceReport(orderId: number | string) {
  return $api<AcceptanceReportDestroy200>(
    `/pmc/orders/${orderId}/acceptance-report`,
    { method: 'DELETE' }
  )
}

export function apiRegenerateAcceptanceReport(orderId: number | string) {
  return $api<AcceptanceReportRegenerate200>(
    `/pmc/orders/${orderId}/acceptance-report/regenerate`,
    { method: 'POST' }
  )
}

// ─── Admin signed-file upload ───

export interface AcceptanceReportSignedResponse {
  data: AcceptanceReportResource
  success: boolean
}

export function apiUploadSignedAcceptanceReport(orderId: number | string, file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return $api<AcceptanceReportSignedResponse>(
    `/pmc/orders/${orderId}/acceptance-report/signed`,
    { method: 'POST', body: formData }
  )
}

export function apiDeleteSignedAcceptanceReport(orderId: number | string) {
  return $api<AcceptanceReportSignedResponse>(
    `/pmc/orders/${orderId}/acceptance-report/signed`,
    { method: 'DELETE' }
  )
}

// ─── Public (token-based, no auth) ───

export function usePublicAcceptanceReport(token: MaybeRefOrGetter<string>) {
  const baseUrl = getApiBaseUrl()
  return useFetch<PublicAcceptanceReportShow200>(
    computed(() => `${baseUrl}/public/acceptance-reports/${toValue(token)}`),
    { watch: [() => toValue(token)] }
  )
}

export function apiUpdatePublicAcceptanceReport(token: string, data: UpdateAcceptanceReportPayload) {
  const baseUrl = getApiBaseUrl()
  return $fetch<PublicAcceptanceReportUpdate200>(
    `${baseUrl}/public/acceptance-reports/${token}`,
    { method: 'PATCH', body: data }
  )
}

export interface ConfirmAcceptanceReportPayload {
  signature_name: string
  note?: string
}

export function apiConfirmPublicAcceptanceReport(token: string, data: ConfirmAcceptanceReportPayload) {
  const baseUrl = getApiBaseUrl()
  return $fetch<AcceptanceReportSignedResponse>(
    `${baseUrl}/public/acceptance-reports/${token}/confirm`,
    { method: 'POST', body: data }
  )
}
