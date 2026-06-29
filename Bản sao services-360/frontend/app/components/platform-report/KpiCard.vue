<script setup lang="ts">
/**
 * Thẻ KPI dùng chung cho cụm Báo cáo tổng hợp platform: nhãn + giá trị (đã
 * format sẵn ở page) + dòng phụ tuỳ chọn + icon. `accent` tô màu giá trị/icon.
 */
type Accent = 'primary' | 'success' | 'error' | 'warning' | 'neutral'

interface Props {
  label: string
  value: string | number
  sub?: string
  icon?: string
  accent?: Accent
  pending?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sub: undefined,
  icon: undefined,
  accent: 'neutral',
  pending: false
})

const ACCENT_TEXT: Record<Accent, string> = {
  primary: 'text-primary',
  success: 'text-emerald-600',
  error: 'text-red-600',
  warning: 'text-amber-600',
  neutral: 'text-slate-900'
}

const valueClass = computed(() => ACCENT_TEXT[props.accent])
const iconClass = computed(() => (props.accent === 'neutral' ? 'text-primary' : ACCENT_TEXT[props.accent]))
</script>

<template>
  <UCard :ui="{ body: 'px-5 py-4' }">
    <div class="flex items-center gap-4">
      <div
        v-if="icon"
        class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50"
      >
        <UIcon
          :name="icon"
          class="size-5"
          :class="iconClass"
        />
      </div>
      <div class="min-w-0">
        <div class="text-sm text-[var(--ui-text-muted)]">
          {{ label }}
        </div>
        <USkeleton
          v-if="pending"
          class="mt-1 h-7 w-20"
        />
        <div
          v-else
          class="mt-1 text-2xl font-bold tracking-tight truncate"
          :class="valueClass"
        >
          {{ value }}
        </div>
        <div
          v-if="sub && !pending"
          class="text-xs text-slate-500 mt-0.5 truncate"
        >
          {{ sub }}
        </div>
      </div>
    </div>
  </UCard>
</template>
