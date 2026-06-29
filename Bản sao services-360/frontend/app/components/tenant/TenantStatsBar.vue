<script setup lang="ts">
import type { OrganizationStats200 } from '#api/generated/laravel'

type TenantStats = OrganizationStats200['data']

interface Props {
  stats: TenantStats | null
  pending?: boolean
}

withDefaults(defineProps<Props>(), {
  pending: false
})

interface StatItem {
  key: keyof TenantStats
  label: string
  icon: string
  color: string
}

const items: StatItem[] = [
  { key: 'total', label: 'Tổng công ty', icon: 'i-lucide-building-2', color: 'text-primary' },
  { key: 'active', label: 'Đang hoạt động', icon: 'i-lucide-circle-check', color: 'text-emerald-600' },
  { key: 'inactive', label: 'Đã vô hiệu hoá', icon: 'i-lucide-circle-pause', color: 'text-amber-600' }
]
</script>

<template>
  <div
    role="group"
    aria-label="Thống kê công ty vận hành"
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
