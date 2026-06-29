<script setup lang="ts">
import type { TeamScheduleResponse } from '~/composables/api/useScheduleSlots'

interface Props {
  payload: TeamScheduleResponse | null
  onlyConflicts?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  onlyConflicts: false
})

defineEmits<{
  'click-slot': [payload: { account_id: number, date: string, shift_id: number }]
  'click-unscheduled': [payload: { account_id: number, date: string }]
}>()

const days = computed(() => props.payload?.days ?? [])
const allAccounts = computed(() => props.payload?.accounts ?? [])
const dayCardsByAccount = computed(() => props.payload?.day_cards_by_account ?? {})
const unscheduledByAccount = computed(() => props.payload?.unscheduled_cards_by_account ?? {})

const accountsWithConflict = computed(() => {
  const result = new Set<number>()
  for (const account of allAccounts.value) {
    const byDate = dayCardsByAccount.value[account.id]
    if (!byDate) continue
    for (const date of Object.keys(byDate)) {
      if (detectShiftConflicts(byDate[date] ?? []).size > 0) {
        result.add(account.id)
        break
      }
    }
  }
  return result
})

const accounts = computed(() => {
  if (!props.onlyConflicts) return allAccounts.value
  return allAccounts.value.filter(a => accountsWithConflict.value.has(a.id))
})

function dayHeaderLabel(date: string): string {
  const d = new Date(date)
  return String(d.getDate()).padStart(2, '0')
}

function dayHeaderWeekday(weekday: number): string {
  return WEEKDAY_LABELS_VI[weekday] ?? ''
}

function cardsFor(accountId: number, date: string) {
  return dayCardsByAccount.value[accountId]?.[date] ?? []
}

function unscheduledFor(accountId: number, date: string) {
  return unscheduledByAccount.value[accountId]?.[date] ?? []
}

function conflictsFor(accountId: number, date: string): Set<string> {
  return detectShiftConflicts(cardsFor(accountId, date))
}

function overlapOffsetsFor(accountId: number, date: string): Map<string, number> {
  return computeOverlapOffsets(cardsFor(accountId, date))
}
</script>

<template>
  <div class="overflow-auto rounded-xl border border-neutral-200 bg-white shadow-sm max-h-[calc(100vh-260px)]">
    <table class="border-collapse text-xs w-max">
      <thead>
        <tr class="bg-neutral-50">
          <th class="sticky top-0 left-0 z-30 border-b border-r border-neutral-200 bg-neutral-50 px-3 py-2 text-left text-[12px] font-semibold text-neutral-700 min-w-[180px]">
            Nhân viên
          </th>
          <th
            v-for="day in days"
            :key="day.date"
            class="sticky top-0 z-20 border-b border-r border-neutral-200 px-2 py-1 text-center font-semibold min-w-[220px]"
            :class="[
              day.is_weekend ? 'bg-rose-50/60 text-rose-500' : 'bg-neutral-50 text-neutral-700',
              day.is_today ? 'bg-primary/10 text-primary' : ''
            ]"
          >
            <div class="leading-tight">
              <div class="text-[13px]">
                {{ dayHeaderLabel(day.date) }}
              </div>
              <div class="text-[10px] font-normal">
                {{ dayHeaderWeekday(day.weekday) }}
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="account in accounts"
          :key="account.id"
          class="hover:bg-neutral-50/50"
        >
          <td class="sticky left-0 z-10 border-b border-r border-neutral-200 bg-white px-3 py-2 min-w-[180px]">
            <div class="font-medium text-neutral-900 text-[13px]">
              {{ account.name }}
            </div>
            <div class="font-mono text-[11px] text-neutral-500">
              {{ account.employee_code }}
            </div>
          </td>
          <td
            v-for="day in days"
            :key="day.date"
            class="border-b border-r border-neutral-200 align-top p-1.5 min-w-[220px]"
            :class="day.is_weekend ? 'bg-rose-50/30' : ''"
          >
            <div class="flex flex-col gap-1.5">
              <SchedulePersonalShiftCard
                v-for="card in cardsFor(account.id, day.date)"
                :key="cardConflictKey(card)"
                :card="card"
                :conflict="conflictsFor(account.id, day.date).has(cardConflictKey(card))"
                :overlap-offset-px="overlapOffsetsFor(account.id, day.date).get(cardConflictKey(card)) ?? 0"
                @click="$emit('click-slot', { account_id: account.id, date: day.date, shift_id: card.shift.id })"
              />
              <ScheduleUnscheduledTicketList
                :tickets="unscheduledFor(account.id, day.date)"
                @click="$emit('click-unscheduled', { account_id: account.id, date: day.date })"
              />
            </div>
          </td>
        </tr>
        <tr v-if="accounts.length === 0">
          <td
            :colspan="days.length + 1"
            class="px-4 py-6 text-center text-neutral-400"
          >
            {{ onlyConflicts
              ? 'Không có nhân sự nào bị chồng chéo lịch trong tháng.'
              : 'Không có nhân viên nào khớp tiêu chí.' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
