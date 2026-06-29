/**
 * Format Vietnamese phone digits into groups for display.
 * "0912345678" → "0912 345 678"
 * Keeps non-digit chars (e.g. "+84") untouched at the prefix.
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '—'
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 9) return phone

  if (digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  return phone
}

/** Strip all non-digit characters for sending to BE. */
export function stripPhone(phone: string | null | undefined): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}
