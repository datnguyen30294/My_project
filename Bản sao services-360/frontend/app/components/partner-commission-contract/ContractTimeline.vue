<script setup lang="ts">
import type { ContractDetail } from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  contract: ContractDetail
}

interface TimelineEntry {
  label: string
  at: string | null
  description?: string
  color: 'neutral' | 'info' | 'success' | 'warning' | 'error'
  icon: string
}

const props = defineProps<Props>()

const entries = computed<TimelineEntry[]>(() => {
  const c = props.contract
  const items: TimelineEntry[] = []

  items.push({
    label: 'Tạo hợp đồng nháp',
    at: c.created_at,
    color: 'neutral',
    icon: 'i-lucide-file-edit'
  })

  if (c.signed_at) {
    items.push({
      label: 'Đã ký',
      at: c.signed_at,
      color: 'info',
      icon: 'i-lucide-file-signature'
    })
  }

  if (c.activated_at) {
    items.push({
      label: 'Kích hoạt',
      at: c.activated_at,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  }

  if (c.replaced_at) {
    items.push({
      label: c.replaced_by_contract_id
        ? `Đã bị thay thế bởi hợp đồng #${c.replaced_by_contract_id}`
        : 'Đã bị thay thế',
      at: c.replaced_at,
      color: 'neutral',
      icon: 'i-lucide-arrow-right-left'
    })
  }

  if (c.cancelled_at) {
    items.push({
      label: c.status.value === 'revoked' ? 'Thu hồi' : 'Huỷ hợp đồng',
      at: c.cancelled_at,
      description: c.cancellation_reason ?? undefined,
      color: 'error',
      icon: 'i-lucide-x-circle'
    })
  }

  return items
})

const colorClass: Record<TimelineEntry['color'], string> = {
  neutral: 'bg-slate-100 text-slate-600',
  info: 'bg-blue-100 text-blue-600',
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  error: 'bg-red-100 text-red-600'
}
</script>

<template>
  <ol class="relative space-y-5 border-l border-slate-200 ml-3 pl-6">
    <li
      v-for="(entry, idx) in entries"
      :key="idx"
      class="relative"
    >
      <span
        class="absolute -left-9 flex size-7 items-center justify-center rounded-full ring-4 ring-white"
        :class="colorClass[entry.color]"
      >
        <UIcon
          :name="entry.icon"
          class="size-4"
        />
      </span>
      <div>
        <p class="text-sm font-semibold text-slate-900">
          {{ entry.label }}
        </p>
        <p class="text-xs text-slate-500 mt-0.5">
          {{ entry.at ? formatDateTime(entry.at) : '—' }}
        </p>
        <p
          v-if="entry.description"
          class="text-sm text-slate-700 mt-1 italic"
        >
          "{{ entry.description }}"
        </p>
      </div>
    </li>
  </ol>
</template>
