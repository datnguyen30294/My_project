<script setup lang="ts">
import type { ShiftResource } from '#api/generated/laravel'
import type { SlotSummary } from '~/composables/api/useScheduleSlots'

interface Props {
  shift: ShiftResource
  summary?: SlotSummary | null
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  summary: null,
  compact: false
})

defineEmits<{
  click: []
}>()

const { shiftColor, shiftShortLabel, indicatorExternal, indicatorTicket } = useScheduleColors()

const hasExternal = computed(() => !!props.summary?.ext)
const ticketCount = computed(() => props.summary?.tkt ?? null)
const hasTicket = computed(() => (ticketCount.value ?? 0) > 0)
const isEmpty = computed(() => !hasExternal.value && !hasTicket.value)
</script>

<template>
  <button
    type="button"
    class="w-full flex items-center gap-1 rounded px-1.5 text-left transition-colors hover:bg-slate-100"
    :class="compact ? 'py-0.5 text-[11px] leading-none' : 'py-1 text-xs'"
    @click="$emit('click')"
  >
    <UBadge
      :color="shiftColor(shift.code)"
      variant="subtle"
      size="sm"
      class="font-mono shrink-0"
      :label="shiftShortLabel(shift.code)"
    />
    <span
      v-if="hasExternal"
      :class="indicatorExternal"
      class="inline-flex items-center"
    >
      <UIcon
        name="i-lucide-building-2"
        class="size-3"
      />
    </span>
    <span
      v-if="hasTicket"
      :class="indicatorTicket"
      class="inline-flex items-center gap-0.5"
    >
      <UIcon
        name="i-lucide-ticket"
        class="size-3"
      />
      <span class="font-semibold">{{ ticketCount }}</span>
    </span>
    <span
      v-if="isEmpty"
      class="text-slate-300"
    >—</span>
  </button>
</template>
