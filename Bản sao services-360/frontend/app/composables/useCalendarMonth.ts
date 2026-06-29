import type { DayMeta } from '~/composables/api/useScheduleSlots'

export interface CalendarCell {
  date: string | null
  dayNumber: number | null
  weekday: number
  isCurrentMonth: boolean
  isWeekend: boolean
  isToday: boolean
}

export type CalendarWeek = CalendarCell[]

function parseYearMonth(yearMonth: string): { year: number, month: number } {
  const [y, m] = yearMonth.split('-').map(Number)
  return { year: y!, month: m! }
}

function formatISODate(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

export function useCalendarMonth(yearMonth: MaybeRefOrGetter<string>, days: MaybeRefOrGetter<DayMeta[]>) {
  return computed<CalendarWeek[]>(() => {
    const ym = toValue(yearMonth)
    const meta = toValue(days)
    if (!ym) return []

    const { year, month } = parseYearMonth(ym)
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()

    // Monday-first layout: shift so CN (0) becomes index 6, T2 (1) becomes 0, ...
    const rawWeekday = firstDay.getDay() // 0=CN, 1=T2, ...
    const leadingBlanks = (rawWeekday + 6) % 7

    const metaByDate = new Map(meta.map(d => [d.date, d]))

    const cells: CalendarCell[] = []
    for (let i = 0; i < leadingBlanks; i++) {
      cells.push({ date: null, dayNumber: null, weekday: i, isCurrentMonth: false, isWeekend: false, isToday: false })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatISODate(year, month, d)
      const dm = metaByDate.get(dateStr)
      const wd = dm?.weekday ?? new Date(year, month - 1, d).getDay()
      cells.push({
        date: dateStr,
        dayNumber: d,
        weekday: wd,
        isCurrentMonth: true,
        isWeekend: dm?.is_weekend ?? (wd === 0 || wd === 6),
        isToday: dm?.is_today ?? false
      })
    }
    while (cells.length % 7 !== 0) {
      cells.push({ date: null, dayNumber: null, weekday: cells.length % 7, isCurrentMonth: false, isWeekend: false, isToday: false })
    }

    const weeks: CalendarWeek[] = []
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7))
    }
    return weeks
  })
}
