export type ApiError = {
  data?: { message?: string, error_code?: string, errors?: Record<string, string[]> }
  status?: number
  statusCode?: number
}

export function getApiValidationErrors(error: unknown): Record<string, string[]> | null {
  const apiError = error as ApiError
  const raw = apiError?.data?.errors
  if (!raw || typeof raw !== 'object') return null

  // BE trả lỗi nghiệp vụ (BusinessException) với errors rỗng → không phải validation
  if (Object.keys(raw).length === 0) return null

  const isValidationShape = Object.values(raw).every(
    v => Array.isArray(v) && v.every(item => typeof item === 'string')
  )

  return isValidationShape ? raw : null
}

export function getApiErrorMessage(error: unknown, fallback = 'Thao tác thất bại'): string {
  const apiError = error as ApiError
  return apiError?.data?.message ?? fallback
}

export function getApiErrorStatus(error: unknown): number | undefined {
  const apiError = error as ApiError
  return apiError?.status ?? apiError?.statusCode
}

/**
 * Mã lỗi nghiệp vụ (BusinessException) từ BE — vd: 'EMAIL_ALREADY_EXISTS',
 * 'ACCOUNT_LIMIT_REACHED'. Dùng để map sang lỗi inline theo từng trường.
 */
export function getApiErrorCode(error: unknown): string | undefined {
  const apiError = error as ApiError
  return apiError?.data?.error_code
}

const STATUS_MESSAGES: Record<number, { title: string, description: string }> = {
  403: { title: 'Không có quyền truy cập', description: 'Bạn không có quyền xem nội dung này. Vui lòng liên hệ quản trị viên.' },
  404: { title: 'Không tìm thấy', description: 'Nội dung bạn tìm không tồn tại hoặc đã bị xoá.' },
  500: { title: 'Lỗi hệ thống', description: 'Đã xảy ra lỗi từ máy chủ. Vui lòng thử lại sau.' },
  503: { title: 'Hệ thống đang bảo trì', description: 'Vui lòng thử lại sau ít phút.' }
}

export function formatPageError(error: unknown): { title: string, description: string } {
  const status = getApiErrorStatus(error)
  if (status && STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status]
  }
  return { title: 'Lỗi', description: 'Không thể tải dữ liệu. Vui lòng thử lại sau.' }
}
