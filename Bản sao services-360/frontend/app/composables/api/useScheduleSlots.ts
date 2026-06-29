import type { ShiftResource } from '#api/generated/laravel'

export interface SlotSummary {
  ext: boolean
  proj: number[]
  tkt: number | null
}

export interface DayMeta {
  date: string
  weekday: number
  is_weekend: boolean
  is_today: boolean
}

export interface ScheduleAccount {
  id: number
  employee_code: string
  name: string
}

export interface ScheduleProjectRef {
  id: number
  code?: string | null
  name: string
}

export interface ScheduleShiftSummary {
  id: number
  project_id: number
  code: string
  name: string
  start_time: string
  end_time: string
  is_overnight: boolean
  sort_order: number
}

export interface DayCard {
  shift: ScheduleShiftSummary
  project: ScheduleProjectRef | null
  has_workschedule: boolean
  ticket_count: number
}

export interface ScheduleUnscheduledTicket {
  id: number
  subject: string
  priority: { value: string, label: string }
  status: { value: string, label: string }
}

export interface PersonalScheduleResponse {
  month: string
  account: ScheduleAccount
  days: DayMeta[]
  day_cards: Record<string, DayCard[]>
  unscheduled_cards: Record<string, ScheduleUnscheduledTicket[]>
}

export interface TeamScheduleResponse {
  month: string
  project_id: number | null
  accounts: ScheduleAccount[]
  days: DayMeta[]
  day_cards_by_account: Record<number, Record<string, DayCard[]>>
  unscheduled_cards_by_account: Record<number, Record<string, ScheduleUnscheduledTicket[]>>
}

export interface SlotExternalEntry {
  id: number
  project: ScheduleProjectRef
  note: string | null
  external_ref: string | null
}

export interface SlotTicketEntry {
  id: number
  subject: string
  project: ScheduleProjectRef
  priority: { value: string, label: string }
  assigned_at: string
  status_at_slot: { value: string, label: string }
  status_now: { value: string, label: string }
  is_status_changed: boolean
}

export interface SlotDetailResponse {
  account: ScheduleAccount
  date: string
  shift: ShiftResource
  shift_window: { start: string, end: string }
  external: SlotExternalEntry[]
  tickets: SlotTicketEntry[]
}

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

export interface PersonalScheduleParams {
  account_id: number
  month: string
}

export interface TeamScheduleParams {
  month: string
  project_id?: number
  account_ids?: number[]
  strict_project?: boolean
}

export interface SlotDetailParams {
  account_id: number
  date: string
  shift_id: number
}

export function usePersonalSchedule(
  params: MaybeRefOrGetter<PersonalScheduleParams | null>,
  opts: { immediate?: boolean } = {}
) {
  return useApiFetch<ApiEnvelope<PersonalScheduleResponse>>('/pmc/schedule-slots/personal', {
    query: computed(() => toValue(params) ?? {}),
    watch: [() => toValue(params)],
    immediate: opts.immediate ?? false
  })
}

export function useTeamSchedule(params: MaybeRefOrGetter<TeamScheduleParams>) {
  const requestUrl = computed(() => {
    const p = toValue(params)
    const qs = new URLSearchParams()
    qs.set('month', p.month)
    if (p.project_id != null) qs.set('project_id', String(p.project_id))
    if (p.account_ids?.length) {
      for (const id of p.account_ids) qs.append('account_ids[]', String(id))
    }
    if (p.strict_project) qs.set('strict_project', '1')
    return `/pmc/schedule-slots/team?${qs.toString()}`
  })
  return useApiFetch<ApiEnvelope<TeamScheduleResponse>>(requestUrl, {
    watch: [requestUrl]
  })
}

export function useSlotDetail(params: MaybeRefOrGetter<SlotDetailParams | null>) {
  return useApiFetch<ApiEnvelope<SlotDetailResponse>>('/pmc/schedule-slots/detail', {
    query: computed(() => toValue(params) ?? {}),
    watch: [() => toValue(params)],
    immediate: false
  })
}
