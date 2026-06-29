<script setup lang="ts">
import type { ScheduleUnscheduledTicket } from '~/composables/api/useScheduleSlots'

const open = defineModel<boolean>('open', { default: false })

interface Props {
  date: string | null
  tickets?: ScheduleUnscheduledTicket[]
  accountName?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  tickets: () => [],
  accountName: null
})

const formattedDate = computed(() => {
  if (!props.date) {
    return ''
  }
  const [y, m, d] = props.date.split('-')
  return `${d}/${m}/${y}`
})
</script>

<template>
  <USlideover
    v-model:open="open"
    side="right"
    :ui="{ content: 'max-w-md' }"
  >
    <template #header>
      <div class="flex items-start justify-between w-full gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-ticket"
              class="size-4 text-primary"
            />
            <h3 class="font-bold text-slate-900 text-base truncate">
              Không thuộc ca
              <span
                v-if="formattedDate"
                class="font-normal text-slate-500"
              >· {{ formattedDate }}</span>
            </h3>
          </div>
          <div
            v-if="accountName"
            class="mt-1 text-xs text-slate-500"
          >
            {{ accountName }}
          </div>
        </div>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="open = false"
        />
      </div>
    </template>

    <template #body>
      <SharedSectionCard
        :title="`Ticket không thuộc ca (${tickets.length})`"
        icon="i-lucide-ticket"
        compact
      >
        <UAlert
          v-if="tickets.length === 0"
          color="neutral"
          variant="subtle"
          icon="i-lucide-info"
          description="Không có ticket nào không thuộc ca trong ngày này."
        />
        <div
          v-else
          class="flex flex-col gap-2"
        >
          <div
            v-for="ticket in tickets"
            :key="ticket.id"
            class="rounded-lg border border-border-gray p-3"
          >
            <div class="flex items-start justify-between gap-2">
              <NuxtLink
                :to="`/pmc/og-tickets/${ticket.id}`"
                class="font-medium text-sm text-primary hover:underline"
              >
                #{{ ticket.id }} · {{ ticket.subject }}
              </NuxtLink>
              <UBadge
                :label="ticket.priority.label"
                :color="ogTicketPriorityColor(ticket.priority.value)"
                variant="subtle"
                size="sm"
              />
            </div>
            <div class="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span>Trạng thái:</span>
              <UBadge
                :label="ticket.status.label"
                :color="ogTicketStatusColor(ticket.status.value)"
                variant="subtle"
                size="sm"
              />
            </div>
          </div>
        </div>
      </SharedSectionCard>
    </template>
  </USlideover>
</template>
