<script setup lang="ts">
import type { ShiftStatsResource } from '#api/generated/laravel'

interface Props {
  stats: ShiftStatsResource | null
  pending?: boolean
}

withDefaults(defineProps<Props>(), {
  pending: false
})

interface StatItem {
  key: keyof ShiftStatsResource
  label: string
  icon: string
  color: string
}

const items: StatItem[] = [
  { key: 'total', label: 'Tổng số ca', icon: 'i-lucide-clock', color: 'text-primary' },
  { key: 'active', label: 'Đang sử dụng', icon: 'i-lucide-circle-check', color: 'text-emerald-600' },
  { key: 'inactive', label: 'Tạm ẩn', icon: 'i-lucide-circle-pause', color: 'text-slate-500' }
]
</script>

<template>
  <div
    role="group"
    aria-label="Thống kê ca làm việc"
    class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6"
  >
    <UCard
      v-for="item in items"
      :key="item.key"
      :ui="{ body: 'px-5 py-4' }"
    >
      <div class="flex items-center gap-4">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50">
          <UIcon
            :name="item.icon"
            class="size-5"
            :class="item.color"
          />
        </div>
        <div class="min-w-0">
          <div class="text-sm text-[var(--ui-text-muted)]">
            {{ item.label }}
          </div>
          <USkeleton
            v-if="pending"
            class="mt-1 h-7 w-10"
          />
          <div
            v-else
            class="mt-1 text-2xl font-bold text-slate-900"
          >
            {{ stats?.[item.key] ?? 0 }}
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
