export const TIMEZONE = 'Asia/Ho_Chi_Minh'
const LOCALE = 'vi-VN'
const VN_OFFSET_MS = 7 * 60 * 60 * 1000 // UTC+7

export const WEEKDAY_LABELS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const

export function formatMonthTitle(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)
  return `Tháng ${m}/${y}`
}

export function currentYearMonth(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString(LOCALE, {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: TIMEZONE
  })
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString(LOCALE, {
    day: '2-digit', month: '2-digit', year: 'numeric',
    timeZone: TIMEZONE
  })
}

export function formatTime(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString(LOCALE, {
    hour: '2-digit', minute: '2-digit',
    timeZone: TIMEZONE
  })
}

export function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}

export function formatDuration(ms: number): string {
  if (ms < 60_000) return '< 1 phút'
  const minutes = Math.floor(ms / 60_000)
  if (minutes < 60) return `${minutes} phút`
  const hours = Math.floor(minutes / 60)
  const restMin = minutes % 60
  if (hours < 48) return restMin ? `${hours} giờ ${restMin} phút` : `${hours} giờ`
  const days = Math.floor(hours / 24)
  return `${days} ngày`
}

export function formatShortDateTime(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE
  })
}

export function formatDurationMinutes(minutes: string | number): string {
  const m = typeof minutes === 'number' ? minutes : parseInt(minutes, 10)
  if (isNaN(m) || m <= 0) return ''
  if (m < 60) return `${m} phút`
  const h = Math.floor(m / 60)
  const remain = m % 60
  if (remain === 0) return `${h} giờ`
  return `${h} giờ ${remain} phút`
}

/**
 * Convert naive datetime from VueDatePicker ("yyyy-MM-dd HH:mm:ss", Vietnam local)
 * to UTC string for backend ("yyyy-MM-dd HH:mm:ss").
 *
 * User picks 18:13 VN → sends 11:13 UTC to backend.
 */
export function localToUtc(dateStr: string | null): string | null {
  if (!dateStr) return null
  const local = new Date(dateStr.replace(' ', 'T') + '+07:00')
  const y = local.getUTCFullYear()
  const mo = String(local.getUTCMonth() + 1).padStart(2, '0')
  const d = String(local.getUTCDate()).padStart(2, '0')
  const h = String(local.getUTCHours()).padStart(2, '0')
  const mi = String(local.getUTCMinutes()).padStart(2, '0')
  const s = String(local.getUTCSeconds()).padStart(2, '0')
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`
}

/**
 * Convert UTC ISO8601 string from backend ("2026-03-15T11:13:00+00:00")
 * to naive Vietnam datetime for VueDatePicker ("yyyy-MM-dd HH:mm:ss").
 *
 * Backend returns 11:13 UTC → VueDatePicker shows 18:13 VN.
 */
export function utcToLocal(isoStr: string | null): string | null {
  if (!isoStr) return null
  const utc = new Date(isoStr)
  const local = new Date(utc.getTime() + VN_OFFSET_MS)
  const y = local.getUTCFullYear()
  const mo = String(local.getUTCMonth() + 1).padStart(2, '0')
  const d = String(local.getUTCDate()).padStart(2, '0')
  const h = String(local.getUTCHours()).padStart(2, '0')
  const mi = String(local.getUTCMinutes()).padStart(2, '0')
  const s = String(local.getUTCSeconds()).padStart(2, '0')
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`
}
