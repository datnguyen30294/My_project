<script setup lang="ts">
import type { VendorOrderSummary, VendorOrderWarnings } from '~/composables/api/useVendorOrders'

interface Props {
  summary: VendorOrderSummary | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { loading: false })

const kpis = computed(() => {
  const s = props.summary
  return [
    {
      key: 'count',
      label: 'Số đơn thành công',
      value: s?.orders_count ?? 0,
      format: 'number' as const
    },
    {
      key: 'revenue',
      label: 'Tổng doanh thu vendor',
      value: s?.revenue_total ?? 0,
      format: 'currency' as const
    },
    {
      key: 'commission',
      label: 'Tổng hoa hồng PMC',
      value: s?.commission_total ?? 0,
      format: 'currency' as const
    },
    {
      key: 'average',
      label: 'TB hoa hồng / đơn',
      value: s?.average_commission_per_order ?? 0,
      format: 'currency' as const
    }
  ]
})

const warnings = computed<VendorOrderWarnings | null>(() => props.summary?.warnings ?? null)

function fmt(v: number, kind: 'number' | 'currency'): string {
  if (kind === 'number') return String(v)
  return formatCurrency(v)
}
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div
        v-for="k in kpis"
        :key="k.key"
        class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
      >
        <p class="text-xs text-slate-500 mb-1">
          {{ k.label }}
        </p>
        <p
          v-if="loading"
          class="h-7 bg-slate-100 rounded animate-pulse"
        />
        <p
          v-else
          class="text-xl font-bold text-slate-900"
        >
          {{ fmt(k.value, k.format) }}
        </p>
      </div>
    </div>

    <UAlert
      v-if="warnings?.schema_missing"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-octagon"
      title="Vendor chưa active"
      description="Vendor chưa được kích hoạt trên hệ thống marketplace. Liên hệ admin để provision."
    />
    <UAlert
      v-if="warnings && warnings.non_per_order_orders_count > 0"
      color="neutral"
      variant="subtle"
      icon="i-lucide-info"
      :description="`${warnings.non_per_order_orders_count} đơn thuộc dự án dùng hợp đồng chia doanh thu / thuê bao — xem ở mục thống kê theo tháng (sắp ra mắt).`"
    />
  </div>
</template>
