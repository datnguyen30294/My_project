export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return `${new Intl.NumberFormat('vi-VN').format(num || 0)} đ`
}

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '0'
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('vi-VN').format(num || 0)
}

/**
 * Format money compactly for chart axes: 6_030_000_000 → "6 tỷ", 52_800_000 → "53 tr".
 */
export function formatCurrencyShort(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '0'
  const num = typeof value === 'string' ? parseFloat(value) : value
  const n = num || 0
  if (Math.abs(n) >= 1_000_000_000) return `${parseFloat((n / 1_000_000_000).toFixed(1))} tỷ`
  if (Math.abs(n) >= 1_000_000) return `${Math.round(n / 1_000_000)} tr`
  return new Intl.NumberFormat('vi-VN').format(Math.round(n))
}

/**
 * Format percent: "30.00" → "30%", "5.50" → "5.5%"
 */
export function formatPercent(value: number | string | null): string {
  if (value == null) return '0%'
  const num = typeof value === 'string' ? parseFloat(value) : value
  return `${parseFloat(num.toFixed(2))}%`
}
