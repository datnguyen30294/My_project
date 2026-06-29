<script setup lang="ts">
import type { ScheduleUnscheduledTicket } from '~/composables/api/useScheduleSlots'

interface Props {
  tickets?: ScheduleUnscheduledTicket[]
}

const props = withDefaults(defineProps<Props>(), {
  tickets: () => []
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    v-if="props.tickets.length"
    type="button"
    class="w-full rounded border border-dashed border-neutral-300 bg-neutral-50/80 px-1.5 py-1 text-left transition-all cursor-pointer hover:border-neutral-400 hover:bg-neutral-100 hover:shadow-sm"
    @click="$emit('click')"
  >
    <div class="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-neutral-500">
      <UIcon
        name="i-lucide-ticket"
        class="size-3"
      />
      Không thuộc ca
    </div>
    <div class="flex flex-col gap-1">
      <div
        v-for="ticket in props.tickets"
        :key="ticket.id"
        class="flex items-center justify-between gap-1"
      >
        <span class="line-clamp-1 flex-1 text-[11px] text-neutral-700">{{ ticket.subject }}</span>
        <UBadge
          :color="ogTicketPriorityColor(ticket.priority.value)"
          variant="subtle"
          size="sm"
        >
          {{ ticket.priority.label }}
        </UBadge>
      </div>
    </div>
  </button>
</template>
