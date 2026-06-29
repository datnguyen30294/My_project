<script setup lang="ts">
import type { DayCard } from '~/composables/api/useScheduleSlots'

interface Props {
  card: DayCard
  conflict?: boolean
  overlapOffsetPx?: number
}

const props = withDefaults(defineProps<Props>(), {
  conflict: false,
  overlapOffsetPx: 0
})

const overlapStyle = computed(() => {
  if (!props.conflict || props.overlapOffsetPx <= 0) return undefined
  return {
    marginTop: `-${props.overlapOffsetPx}px`
  }
})

defineEmits<{
  click: []
}>()

const { shiftColor } = useScheduleColors()

const timeRange = computed(() => {
  const s = props.card.shift.start_time?.slice(0, 5) ?? ''
  const e = props.card.shift.end_time?.slice(0, 5) ?? ''
  if (!s || !e) return '—'
  if (props.card.shift.is_overnight) return `${s} – ${e} · qua đêm`
  return `${s} – ${e}`
})

const cardClasses = computed(() => {
  if (props.conflict) {
    return 'border-rose-400 bg-rose-50 text-rose-900 hover:bg-rose-100 hover:border-rose-500 ring-1 ring-rose-300'
  }
  const color = shiftColor(props.card.shift.code)
  if (color === 'primary') {
    return 'border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 hover:border-sky-400'
  }
  if (color === 'warning') {
    return 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:border-amber-400'
  }
  return 'border-violet-300 bg-violet-50 text-violet-900 hover:bg-violet-100 hover:border-violet-400'
})

const ticketCount = computed(() => props.card.ticket_count)
const hasHr = computed(() => props.card.has_workschedule)
const projectName = computed(() => props.card.project?.name ?? '')
</script>

<template>
  <button
    type="button"
    class="shift-card relative block w-full rounded border px-2 py-1.5 text-left text-xs transition-all cursor-pointer hover:shadow-xl hover:ring-2 hover:ring-rose-500 hover:brightness-105"
    :class="[cardClasses, conflict && overlapOffsetPx > 0 ? 'shadow-md' : '']"
    :style="overlapStyle"
    @click="$emit('click')"
  >
    <span
      v-if="hasHr"
      class="absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 rounded bg-white/70 px-1 py-[1px] text-[9px] font-bold tracking-wide"
      title="Đã đăng ký từ HR"
    >
      <UIcon
        name="i-lucide-building-2"
        class="size-2.5"
      />
      HR
    </span>
    <div class="font-semibold leading-tight pr-8">
      {{ card.shift.name }}
    </div>
    <div class="mt-0.5 font-mono text-[10px] opacity-75">
      {{ timeRange }}
    </div>
    <div
      v-if="conflict"
      class="mt-0.5 flex items-center gap-1 rounded bg-rose-100 px-1 py-[1px] text-[10px] font-semibold text-rose-700"
      title="Ca này bị chồng chéo thời gian với ca khác trong cùng ngày"
    >
      <UIcon
        name="i-lucide-triangle-alert"
        class="size-3"
      />
      Chồng chéo thời gian
    </div>
    <div
      v-if="projectName"
      class="mt-0.5 flex items-start gap-1 text-[11px] leading-snug"
    >
      <UIcon
        name="i-lucide-briefcase"
        class="mt-px size-3 shrink-0 opacity-70"
      />
      <span class="line-clamp-2">{{ projectName }}</span>
    </div>
    <div
      v-if="!hasHr"
      class="mt-0.5 text-[10px] italic opacity-70"
    >
      Chỉ có ticket (chưa đăng ký HR)
    </div>
    <div class="mt-1 text-[10px] leading-snug opacity-80">
      Số ticket xử lý:
      <span
        class="ml-0.5 font-semibold tabular-nums"
        :class="ticketCount > 0 ? 'underline underline-offset-2' : ''"
      >
        {{ ticketCount }}
      </span>
    </div>
  </button>
</template>

<style scoped>
.shift-card {
  z-index: 1;
}
.shift-card:hover {
  z-index: 60;
}
</style>
