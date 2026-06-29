<script setup lang="ts">
import { usePlatformPartnerRevenueTrend } from '~/composables/api/usePartners'

interface Props {
  partnerId: number | string
}

const props = defineProps<Props>()

const { data, status, error } = usePlatformPartnerRevenueTrend(() => props.partnerId, () => 6)

const trend = computed(() => data.value?.data ?? null)
const months = computed(() => trend.value?.months ?? [])
const schemaMissing = computed(() => trend.value?.warnings?.schema_missing ?? false)

const totals = computed(() => {
  return months.value.reduce(
    (acc, m) => ({
      revenue: acc.revenue + m.revenue,
      orders: acc.orders + m.order_count,
      commission: acc.commission + m.commission
    }),
    { revenue: 0, orders: 0, commission: 0 }
  )
})

const hasActivity = computed(() => totals.value.revenue > 0 || totals.value.orders > 0)

/** 'YYYY-MM' → 'T6/2026'. */
function monthLabel(ym: string): string {
  const [year, month] = ym.split('-')
  return `T${Number(month)}/${year}`
}

const points = computed(() =>
  months.value.map(m => ({
    label: monthLabel(m.month),
    bar: m.revenue,
    line: m.order_count,
    dash: m.commission
  }))
)
</script>

<template>
  <SharedSectionCard
    title="Doanh thu 6 tháng gần nhất"
    icon="i-lucide-trending-up"
  >
    <template #header-actions>
      <div class="flex items-center gap-4 text-xs text-slate-500">
        <span class="flex items-center gap-1.5">
          <span class="inline-block size-2.5 rounded-sm bg-emerald-400" /> Doanh thu
        </span>
        <span class="flex items-center gap-1.5">
          <span class="inline-block h-0.5 w-4 rounded bg-amber-500" /> Số đơn
        </span>
        <span class="flex items-center gap-1.5">
          <span class="inline-block w-4 border-t-2 border-dashed border-emerald-600" /> Hoa hồng
        </span>
      </div>
    </template>

    <div
      v-if="status === 'pending' && !trend"
      class="h-64 bg-slate-50 rounded-lg animate-pulse"
    />

    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      description="Không tải được dữ liệu doanh thu."
    />

    <template v-else>
      <UAlert
        v-if="schemaMissing"
        color="warning"
        variant="subtle"
        icon="i-lucide-database"
        title="Chưa có dữ liệu bán hàng"
        description="Vendor chưa được kết nối với gian hàng trên resi_mart nên chưa có số liệu doanh thu."
        class="mb-4"
      />

      <!-- KPI tiles -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div class="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
          <div class="text-sm text-slate-500">
            Doanh thu gộp
          </div>
          <div class="mt-1 text-xl font-bold text-slate-900">
            {{ formatCurrency(totals.revenue) }}
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
          <div class="text-sm text-slate-500">
            Số đơn hoàn thành
          </div>
          <div class="mt-1 text-xl font-bold text-slate-900">
            {{ formatNumber(totals.orders) }}
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
          <div class="text-sm text-slate-500">
            Hoa hồng thu về
          </div>
          <div class="mt-1 text-xl font-bold text-primary-700">
            {{ formatCurrency(totals.commission) }}
          </div>
        </div>
      </div>

      <SharedDualAxisChart
        v-if="hasActivity"
        :points="points"
        bar-label="Doanh thu"
        line-label="Số đơn"
        dash-label="Hoa hồng"
        line-unit=" đơn"
      />
      <div
        v-else
        class="py-10 text-center text-sm text-slate-500"
      >
        Chưa có đơn hoàn thành trong 6 tháng gần nhất.
      </div>
    </template>
  </SharedSectionCard>
</template>
