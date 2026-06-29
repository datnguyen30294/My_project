<script setup lang="ts">
import type { ShiftResource } from '#api/generated/laravel'
import type { SlotSummary } from '~/composables/api/useScheduleSlots'
import type { CalendarCell } from '~/composables/useCalendarMonth'

interface Props {
  day: CalendarCell
  shifts: ShiftResource[]
  slotsByShift?: Record<number, SlotSummary>
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  slotsByShift: () => ({}),
  compact: false
})

defineEmits<{
  'click-slot': [shiftId: number]
}>()

const cellBg = computed(() => {
  if (!props.day.isCurrentMonth) return 'bg-slate-50/50 text-slate-300'
  if (props.day.isToday) return 'bg-primary/5 ring-1 ring-primary/40'
  if (props.day.isWeekend) return 'bg-slate-50'
  return 'bg-white'
})

const visibleShifts = computed(() => {
  return props.shifts.filter((shift) => {
    const s = props.slotsByShift[shift.id]
    if (!s) return false
    const hasTicket = (s.tkt ?? 0) > 0
    return s.ext || hasTicket
  })
})
</script>

<template>
  <div
    class="flex flex-col gap-0.5 rounded-md border border-border-gray p-1.5 min-h-[88px]"
    :class="[cellBg, compact ? 'min-h-[70px] p-1' : '']"
  >
    <div
      class="flex items-center justify-between text-[11px] font-semibold"
      :class="day.isToday ? 'text-primary' : 'text-slate-500'"
    >
      <span>{{ day.dayNumber ?? '' }}</span>
    </div>
    <template v-if="day.isCurrentMonth">
      <ScheduleShiftRow
        v-for="shift in visibleShifts"
        :key="shift.id"
        :shift="shift"
        :summary="slotsByShift[shift.id]"
        :compact="compact"
        @click="$emit('click-slot', shift.id)"
      />
    </template>
  </div>
</template>
