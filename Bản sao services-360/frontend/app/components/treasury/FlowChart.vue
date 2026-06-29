<script setup lang="ts">
import type { TreasuryKpiResource } from '~/composables/api/useTreasury'

const props = defineProps<{
  kpi: TreasuryKpiResource
}>()

interface CategoryRow {
  category: string
  amount: number
  count: number
}

const inflowCategories = computed<CategoryRow[]>(() => {
  try {
    return JSON.parse(props.kpi.inflow_by_category as string) ?? []
  } catch {
    return []
  }
})

const outflowCategories = computed<CategoryRow[]>(() => {
  try {
    return JSON.parse(props.kpi.outflow_by_category as string) ?? []
  } catch {
    return []
  }
})

const totalInflow = computed(() => parseFloat(props.kpi.total_inflow) || 0)
const totalOutflow = computed(() => parseFloat(props.kpi.total_outflow) || 0)
const maxAmount = computed(() => Math.max(totalInflow.value, totalOutflow.value, 1))

function barWidth(amount: number): string {
  return `${Math.round((amount / maxAmount.value) * 100)}%`
}

function categoryLabel(value: string): string {
  const labels: Record<string, string> = {
    manual_topup: 'Nạp thủ công',
    manual_withdraw: 'Rút thủ công',
    receivable_collection: 'Thu công nợ',
    customer_refund: 'Hoàn tiền',
    commission_payout: 'Chi hoa hồng'
  }
  return labels[value] ?? value
}

const hasData = computed(() => totalInflow.value > 0 || totalOutflow.value > 0)
</script>

<template>
  <SharedSectionCard
    title="Dòng tiền theo danh mục"
    compact
  >
    <template v-if="!hasData">
      <div class="text-sm text-slate-400 text-center py-6">
        Không có giao dịch trong khoảng thời gian này
      </div>
    </template>

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Inflow breakdown -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="size-2.5 rounded-full bg-slate-900" />
            <span class="text-sm font-semibold text-slate-900">Tiền vào</span>
            <span class="ml-auto text-sm font-bold tabular-nums text-slate-900">
              +{{ formatCurrency(kpi.total_inflow) }}
            </span>
          </div>
          <div class="space-y-2">
            <template v-if="inflowCategories.length === 0">
              <div class="text-xs text-slate-400">
                Không có
              </div>
            </template>
            <div
              v-for="row in inflowCategories"
              :key="row.category"
              class="space-y-0.5"
            >
              <div class="flex items-center justify-between text-xs text-slate-600">
                <span>{{ categoryLabel(row.category) }}</span>
                <span class="tabular-nums font-medium">{{ formatCurrency(String(row.amount)) }}</span>
              </div>
              <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  class="h-full rounded-full bg-slate-900 transition-all duration-500"
                  :style="{ width: barWidth(row.amount) }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Outflow breakdown -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="size-2.5 rounded-full bg-rose-800" />
            <span class="text-sm font-semibold text-rose-800">Tiền ra</span>
            <span class="ml-auto text-sm font-bold tabular-nums text-rose-800">
              -{{ formatCurrency(kpi.total_outflow) }}
            </span>
          </div>
          <div class="space-y-2">
            <template v-if="outflowCategories.length === 0">
              <div class="text-xs text-slate-400">
                Không có
              </div>
            </template>
            <div
              v-for="row in outflowCategories"
              :key="row.category"
              class="space-y-0.5"
            >
              <div class="flex items-center justify-between text-xs text-slate-600">
                <span>{{ categoryLabel(row.category) }}</span>
                <span class="tabular-nums font-medium">{{ formatCurrency(String(row.amount)) }}</span>
              </div>
              <div class="h-2 rounded-full bg-rose-50 overflow-hidden">
                <div
                  class="h-full rounded-full bg-rose-800 transition-all duration-500"
                  :style="{ width: barWidth(row.amount) }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </SharedSectionCard>
</template>
