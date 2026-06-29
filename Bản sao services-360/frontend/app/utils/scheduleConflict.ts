export interface ConflictCheckCard {
  shift: {
    id: number
    start_time: string
    end_time: string
    is_overnight: boolean
  }
  project?: { id: number } | null
}

export function cardConflictKey(card: ConflictCheckCard): string {
  return `${card.shift.id}-${card.project?.id ?? 'np'}`
}

function toMinutes(time: string): number {
  const [h = '0', m = '0'] = time.split(':')
  return Number(h) * 60 + Number(m)
}

interface Interval {
  key: string
  start: number
  end: number
}

function toInterval(card: ConflictCheckCard): Interval | null {
  const start = toMinutes(card.shift.start_time)
  let end = toMinutes(card.shift.end_time)
  if (Number.isNaN(start) || Number.isNaN(end)) return null
  if (card.shift.is_overnight || end <= start) {
    end += 24 * 60
  }
  return { key: cardConflictKey(card), start, end }
}

export function detectShiftConflicts(cards: ConflictCheckCard[]): Set<string> {
  const conflicted = new Set<string>()
  if (cards.length < 2) return conflicted

  const intervals = cards
    .map(toInterval)
    .filter((i): i is Interval => i !== null)

  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const a = intervals[i]!
      const b = intervals[j]!
      if (a.start < b.end && b.start < a.end) {
        conflicted.add(a.key)
        conflicted.add(b.key)
      }
    }
  }
  return conflicted
}

const OVERLAP_MAX_PX = 64
const OVERLAP_PEEK_PX = 14

export function computeOverlapOffsets(cards: ConflictCheckCard[]): Map<string, number> {
  const offsets = new Map<string, number>()
  if (cards.length < 2) return offsets

  const intervals: (Interval | null)[] = cards.map(toInterval)

  for (let i = 1; i < cards.length; i++) {
    const current = intervals[i]
    if (!current) continue
    let maxRatio = 0
    for (let j = 0; j < i; j++) {
      const prev = intervals[j]
      if (!prev) continue
      const overlap = Math.min(current.end, prev.end) - Math.max(current.start, prev.start)
      if (overlap <= 0) continue
      const refDuration = Math.min(current.end - current.start, prev.end - prev.start)
      if (refDuration <= 0) continue
      const ratio = Math.min(1, overlap / refDuration)
      if (ratio > maxRatio) maxRatio = ratio
    }
    if (maxRatio > 0) {
      const px = Math.min(maxRatio * OVERLAP_MAX_PX, OVERLAP_MAX_PX - OVERLAP_PEEK_PX)
      offsets.set(cardConflictKey(cards[i]!), Math.round(px))
    }
  }
  return offsets
}
