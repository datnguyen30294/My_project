<script setup lang="ts">
import type { VendorOrderConsoleSummary, VendorOrderWarnings } from '~/composables/api/useVendorOrders'

interface Props {
  summary: VendorOrderConsoleSummary | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { loading: false })

const warnings = computed<VendorOrderWarnings | null>(() => props.summary?.warnings ?? null)

const ordersSub = computed(() => {
  const s = props.summary
  if (!s) return ''
  return `${formatNumber(s.product_count)} SP · ${formatNumber(s.service_count)} DV`
})
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <!-- Tổng đơn -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p class="text-xs text-slate-500 mb-1">
          Tổng đơn
        </p>
        <p
          v-if="loading"
          class="h-7 bg-slate-100 rounded animate-pulse"
        />
        <template v-else>
          <p class="text-xl font-bold text-slate-900">
            {{ formatNumber(summary?.orders_count ?? 0) }}
          </p>
          <p class="text-xs text-slate-500 mt-0.5">
            {{ ordersSub }}
          </p>
        </template>
      </div>

      <!-- GMV -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p class="text-xs text-slate-500 mb-1">
          Giá trị giao dịch (GMV)
        </p>
        <p
          v-if="loading"
          class="h-7 bg-slate-100 rounded animate-pulse"
        />
        <p
          v-else
          class="text-xl font-bold text-slate-900 tabular-nums"
        >
          {{ formatCurrency(summary?.gmv ?? 0) }}
        </p>
      </div>

      <!-- Hoa hồng → Platform -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p class="text-xs text-slate-500 mb-1">
          Hoa hồng → Platform
        </p>
        <p
          v-if="loading"
          class="h-7 bg-slate-100 rounded animate-pulse"
        />
        <p
          v-else
          class="text-xl font-bold text-emerald-600 tabular-nums"
        >
          {{ formatCurrency(summary?.commission_platform ?? 0) }}
        </p>
      </div>

      <!-- Hoa hồng → Công ty VH -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p class="text-xs text-slate-500 mb-1">
          Hoa hồng → Công ty VH
        </p>
        <p
          v-if="loading"
          class="h-7 bg-slate-100 rounded animate-pulse"
        />
        <p
          v-else
          class="text-xl font-bold text-primary-600 tabular-nums"
        >
          {{ formatCurrency(summary?.commission_operating_company ?? 0) }}
        </p>
      </div>
    </div>

    <UAlert
      v-if="warnings?.schema_missing"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-octagon"
      title="Thiếu dữ liệu vendor"
      description="Một số vendor chưa được provision schema trên resi_mart — số liệu có thể chưa đầy đủ."
    />
    <UAlert
      v-if="warnings && warnings.non_per_order_orders_count > 0"
      color="neutral"
      variant="subtle"
      icon="i-lucide-info"
      :description="`${warnings.non_per_order_orders_count} đơn hoàn thành thuộc hợp đồng chia doanh thu / thuê bao — không tính hoa hồng theo đơn.`"
    />
  </div>
</template>
