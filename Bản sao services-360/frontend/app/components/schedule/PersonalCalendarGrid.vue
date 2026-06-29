<script setup lang="ts">
import type { PersonalScheduleResponse } from '~/composables/api/useScheduleSlots'

interface Props {
  payload: PersonalScheduleResponse | null
  month: string
  monthTitle: string
}

const props = defineProps<Props>()

defineEmits<{
  'click-slot': [payload: { date: string, shift_id: number }]
  'click-unscheduled': [date: string]
}>()

const days = computed(() => props.payload?.days ?? [])
const dayCards = computed(() => props.payload?.day_cards ?? {})
const unscheduledCards = computed(() => props.payload?.unscheduled_cards ?? {})

const weeks = useCalendarMonth(() => props.month, days)
</script>

<template>
  <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="border-b border-neutral-200 px-4 py-3 text-center font-semibold text-neutral-800">
      {{ monthTitle }}
    </div>
    <div class="overflow-x-auto p-4">
      <div class="min-w-[840px] grid grid-cols-7 gap-px text-center text-xs font-medium text-muted">
        <div class="py-2">
          T2
        </div>
        <div class="py-2">
          T3
        </div>
        <div class="py-2">
          T4
        </div>
        <div class="py-2">
          T5
        </div>
        <div class="py-2">
          T6
        </div>
        <div class="py-2 text-rose-500">
          T7
        </div>
        <div class="py-2 text-rose-500">
          CN
        </div>
      </div>
      <div
        v-for="(week, wi) in weeks"
        :key="wi"
        class="min-w-[840px] grid grid-cols-7 gap-px"
      >
        <SchedulePersonalDayCell
          v-for="(cell, ci) in week"
          :key="ci"
          :day="cell"
          :cards="cell.date ? (dayCards[cell.date] ?? []) : []"
          :unscheduled="cell.date ? (unscheduledCards[cell.date] ?? []) : []"
          @click-slot="(shiftId) => cell.date && $emit('click-slot', { date: cell.date, shift_id: shiftId })"
          @click-unscheduled="cell.date && $emit('click-unscheduled', cell.date)"
        />
      </div>
    </div>
  </div>
</template>
