<script setup lang="ts">
import type { TreasuryKpiResource } from '~/composables/api/useTreasury'

defineProps<{
  kpi: TreasuryKpiResource
}>()

function netFlowClass(netFlow: string): string {
  return parseFloat(netFlow) < 0 ? 'text-rose-800' : 'text-slate-900'
}
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    <!-- Total inflow -->
    <UCard>
      <div class="text-xs text-slate-500 mb-1 flex items-center gap-1">
        <UIcon
          name="i-lucide-trending-up"
          class="size-3.5 text-slate-700"
        />
        Tổng thu
      </div>
      <div class="text-lg font-bold text-slate-900 tabular-nums">
        +{{ formatCurrency(kpi.total_inflow) }}
      </div>
    </UCard>

    <!-- Total outflow -->
    <UCard>
      <div class="text-xs text-slate-500 mb-1 flex items-center gap-1">
        <UIcon
          name="i-lucide-trending-down"
          class="size-3.5 text-rose-700"
        />
        Tổng chi
      </div>
      <div class="text-lg font-bold text-rose-800 tabular-nums">
        -{{ formatCurrency(kpi.total_outflow) }}
      </div>
    </UCard>

    <!-- Net flow -->
    <UCard>
      <div class="text-xs text-slate-500 mb-1 flex items-center gap-1">
        <UIcon
          name="i-lucide-activity"
          class="size-3.5 text-slate-400"
        />
        Dòng tiền ròng
      </div>
      <div
        class="text-lg font-bold tabular-nums"
        :class="netFlowClass(kpi.net_flow)"
      >
        {{ parseFloat(kpi.net_flow) >= 0 ? '+' : '' }}{{ formatCurrency(kpi.net_flow) }}
      </div>
    </UCard>

    <!-- Transaction count -->
    <UCard>
      <div class="text-xs text-slate-500 mb-1 flex items-center gap-1">
        <UIcon
          name="i-lucide-receipt"
          class="size-3.5 text-slate-400"
        />
        Số giao dịch
      </div>
      <div class="text-lg font-bold text-slate-900">
        {{ kpi.transaction_count }}
      </div>
    </UCard>
  </div>
</template>
