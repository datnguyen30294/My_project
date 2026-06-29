<script setup lang="ts">
import type { DayCard, ScheduleUnscheduledTicket } from '~/composables/api/useScheduleSlots'
import type { CalendarCell } from '~/composables/useCalendarMonth'

interface Props {
  day: CalendarCell
  cards?: DayCard[]
  unscheduled?: ScheduleUnscheduledTicket[]
}

const props = withDefaults(defineProps<Props>(), {
  cards: () => [],
  unscheduled: () => []
})

const hasContent = computed(() => props.cards.length > 0 || props.unscheduled.length > 0)

defineEmits<{
  'click-slot': [shiftId: number]
  'click-unscheduled': []
}>()

const conflictKeys = computed(() => detectShiftConflicts(props.cards))
const overlapOffsets = computed(() => computeOverlapOffsets(props.cards))

const cellClasses = computed(() => {
  if (!props.day.isCurrentMonth) return 'bg-neutral-50/50 opacity-60'
  if (conflictKeys.value.size > 0) return 'ring-2 ring-rose-400 bg-rose-50/60'
  if (props.day.isToday) return 'ring-2 ring-primary/60 bg-primary-50/60'
  if (props.day.isWeekend) return 'bg-rose-50/40'
  return 'bg-neutral-50/50'
})

const dayNumberClasses = computed(() => {
  if (props.day.isToday) return 'text-primary font-bold'
  if (props.day.isWeekend) return 'text-rose-500'
  return 'text-neutral-600'
})
</script>

<template>
  <div
    class="min-h-[110px] rounded-lg border border-neutral-100 p-2"
    :class="cellClasses"
  >
    <template v-if="day.isCurrentMonth && day.dayNumber !== null">
      <div
        class="mb-1.5 text-right text-sm font-medium"
        :class="dayNumberClasses"
      >
        {{ day.dayNumber }}
      </div>
      <div
        v-if="hasContent"
        class="space-y-1.5"
      >
        <SchedulePersonalShiftCard
          v-for="card in cards"
          :key="cardConflictKey(card)"
          :card="card"
          :conflict="conflictKeys.has(cardConflictKey(card))"
          :overlap-offset-px="overlapOffsets.get(cardConflictKey(card)) ?? 0"
          @click="$emit('click-slot', card.shift.id)"
        />
        <ScheduleUnscheduledTicketList
          :tickets="unscheduled"
          @click="$emit('click-unscheduled')"
        />
      </div>
      <p
        v-else
        class="text-xs text-muted"
      >
        —
      </p>
    </template>
  </div>
</template>
