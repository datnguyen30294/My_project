type ShiftBadgeColor = 'primary' | 'warning' | 'neutral'

export function useScheduleColors() {
  function shiftColor(code: string): ShiftBadgeColor {
    if (code === 'SANG') return 'primary'
    if (code === 'CHIEU') return 'warning'
    return 'neutral'
  }

  function shiftShortLabel(code: string): string {
    if (code === 'SANG') return 'S'
    if (code === 'CHIEU') return 'C'
    if (code === 'TOI') return 'T'
    return code.slice(0, 1)
  }

  return {
    shiftColor,
    shiftShortLabel,
    indicatorExternal: 'text-blue-600 dark:text-blue-400',
    indicatorTicket: 'text-orange-600 dark:text-orange-400'
  }
}
