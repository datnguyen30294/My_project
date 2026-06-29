import type { OgTicketLifecycleSegment } from '~/composables/api/useOgTickets'
import type { QuoteDetailResource } from '#api/generated/laravel'

export interface StepVisit {
  segment: OgTicketLifecycleSegment
  cycle: number
  isActive: boolean
  durationMs: number
  durationLabel: string
}

export interface StepData {
  visits: StepVisit[]
  totalVisits: number
  latestVisit: StepVisit | null
  quotes?: QuoteDetailResource[]
  orders?: Array<{ id: number, code: string, status: { value: string, label: string } }>
}

export function useOgTicketLifecycle(
  segments: Ref<OgTicketLifecycleSegment[]>,
  quoteVersions: Ref<QuoteDetailResource[]>
) {
  const stepDataMap = computed<Map<string, StepData>>(() => {
    const map = new Map<string, StepData>()
    const segs = segments.value

    for (const seg of segs) {
      const status = seg.status.value
      if (!map.has(status)) {
        map.set(status, { visits: [], totalVisits: 0, latestVisit: null })
      }

      const now = Date.now()
      const startMs = new Date(seg.started_at).getTime()
      const endMs = seg.ended_at ? new Date(seg.ended_at).getTime() : now
      const durationMs = endMs - startMs

      const visit: StepVisit = {
        segment: seg,
        cycle: seg.cycle,
        isActive: seg.ended_at === null,
        durationMs,
        durationLabel: formatDuration(durationMs)
      }

      const step = map.get(status)!
      step.visits.push(visit)
      step.totalVisits = step.visits.length
      step.latestVisit = visit
    }

    // Attach quote versions to "quoted" step
    const quotedStep = map.get('quoted')
    if (quotedStep) {
      quotedStep.quotes = quoteVersions.value
    }

    // Attach quote versions to "approved" step
    const approvedStep = map.get('approved')
    if (approvedStep) {
      approvedStep.quotes = quoteVersions.value
    }

    // Attach orders to "ordered" step
    const orderedStep = map.get('ordered')
    if (orderedStep) {
      const orders: StepData['orders'] = []
      for (const q of quoteVersions.value) {
        if (q.order) {
          orders.push({
            id: q.order.id,
            code: q.order.code,
            status: q.order.status
          })
        }
      }
      orderedStep.orders = orders
    }

    return map
  })

  function getStepVisits(status: string): StepVisit[] {
    return stepDataMap.value.get(status)?.visits ?? []
  }

  function getStepData(status: string): StepData | undefined {
    return stepDataMap.value.get(status)
  }

  const backtracks = computed<Array<{ from: number, to: number, cycle: number }>>(() => {
    const result: Array<{ from: number, to: number, cycle: number }> = []
    const segs = segments.value

    for (let i = 1; i < segs.length; i++) {
      const prev = segs[i - 1]!
      const curr = segs[i]!
      // Chỉ vẽ đường phát sinh khi cycle tăng VÀ cycle đã confirmed
      if (curr.cycle > prev.cycle && curr.cycle_confirmed) {
        const fromIdx = OG_TICKET_WORKFLOW_STEPS.findIndex(s => s.value === prev.status.value)
        const toIdx = OG_TICKET_WORKFLOW_STEPS.findIndex(s => s.value === curr.status.value)
        if (fromIdx >= 0 && toIdx >= 0) {
          result.push({ from: fromIdx, to: toIdx, cycle: curr.cycle })
        }
      }
    }

    return result
  })

  return { stepDataMap, getStepVisits, getStepData, backtracks }
}
