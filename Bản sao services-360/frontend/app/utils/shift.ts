import type { BadgeColor } from './badge'

export const SHIFT_TYPE_SUGGESTIONS = [
  'Ngày thường',
  'Cuối tuần',
  'Ngày lễ',
  'Cả tuần'
] as const

export const WORK_GROUP_SUGGESTIONS = [
  'Làm việc',
  'Nghỉ phép',
  'Tăng ca',
  'Đào tạo',
  'Chờ việc'
] as const

export const SHIFT_STATUS_OPTIONS = [
  { value: 'active', label: 'Đang sử dụng' },
  { value: 'inactive', label: 'Tạm ẩn' }
] as const

export const SHIFT_STATUS_BADGE_COLOR: Record<string, BadgeColor> = {
  active: 'success',
  inactive: 'neutral'
}

export function computeWorkHours(
  startTime: string,
  endTime: string,
  breakHours: number
): number {
  const toSeconds = (time: string): number => {
    const [h = '0', m = '0'] = time.split(':')
    return Number(h) * 3600 + Number(m) * 60
  }

  const start = toSeconds(startTime)
  const end = toSeconds(endTime)
  const spanSeconds = end > start ? end - start : 24 * 3600 - start + end
  const hours = spanSeconds / 3600 - breakHours

  return Math.max(0, Number(hours.toFixed(2)))
}
