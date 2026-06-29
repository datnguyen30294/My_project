<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type {
  RevenueProfitByProjectResource,
  RevenueProfitByServiceCategoryResource,
  RevenueProfitMonthlyResource
} from '~/composables/api/useRevenueProfitReports'
import type { DonutSlice } from '~/components/shared/report/DonutChart.vue'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Báo cáo Doanh thu & Lợi nhuận' })

// ─── Filters (URL-synced) ───

const {
  dateRange,
  dateFromRef,
  dateToRef,
  defaultFrom,
  defaultTo,
  formatDateRange,
  syncRangeFromRefs,
  resetToDefault
} = useReportDateRange()
const selectedProjectId = ref<number | undefined>(undefined)
const selectedClosingPeriodId = ref<number | undefined>(undefined)

useUrlFilters({
  date_from: { ref: dateFromRef, type: 'string' },
  date_to: { ref: dateToRef, type: 'string' },
  project_id: { ref: selectedProjectId, type: 'number' },
  closing_period_id: { ref: selectedClosingPeriodId, type: 'number' }
})

syncRangeFromRefs()

const isClosingPeriodSelected = computed(() => selectedClosingPeriodId.value != null)

const hasFilters = computed(() =>
  selectedProjectId.value != null
  || selectedClosingPeriodId.value != null
  || (dateFromRef.value && dateFromRef.value !== defaultFrom())
  || (dateToRef.value && dateToRef.value !== defaultTo())
)

function clearFilters() {
  selectedProjectId.value = undefined
  selectedClosingPeriodId.value = undefined
  resetToDefault()
}

const filterParams = computed(() => {
  if (selectedClosingPeriodId.value != null) {
    return { closing_period_id: selectedClosingPeriodId.value }
  }
  return {
    date_from: dateFromRef.value || undefined,
    date_to: dateToRef.value || undefined,
    project_id: selectedProjectId.value || undefined
  }
})

// ─── Closing periods (for select) ───

const { closingPeriodOptions } = useClosingPeriodOptions()

// ─── Data fetching ───

const {
  data: summaryData,
  status: summaryStatus,
  error: summaryError
} = useRevenueProfitSummary(filterParams)
const summary = computed(() => summaryData.value?.data ?? null)

const {
  data: monthlyData,
  status: monthlyStatus
} = useRevenueProfitMonthly(filterParams)
const monthly = computed<RevenueProfitMonthlyResource[]>(() => monthlyData.value?.data ?? [])

const {
  data: byProjectData,
  status: byProjectStatus
} = useRevenueProfitByProject(filterParams)
const byProject = computed<RevenueProfitByProjectResource[]>(() => byProjectData.value?.data ?? [])

const {
  data: byServiceData,
  status: byServiceStatus
} = useRevenueProfitByServiceCategory(filterParams)
const byService = computed<RevenueProfitByServiceCategoryResource[]>(() => byServiceData.value?.data ?? [])

// ─── Display helpers ───

const isLoading = (status: string) => status === 'pending'

function toNum(value: string | number | null | undefined): number {
  if (value == null) return 0
  return typeof value === 'string' ? parseFloat(value) || 0 : value
}

function signed(value: number, fractionDigits = 1): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(fractionDigits)}%`
}

// ─── Trend chart (SVG column + line) ───

const chartInner = { left: 56, right: 600, top: 32, bottom: 220 }

const maxRevenue = computed(() => {
  const max = Math.max(0, ...monthly.value.map(m => toNum(m.revenue)))
  return max > 0 ? max : 1
})

const chartBars = computed(() => {
  const list = monthly.value
  const n = list.length
  if (n === 0) return []
  const w = (chartInner.right - chartInner.left) / n
  const barW = Math.min(44, w * 0.62)
  return list.map((m, i) => {
    const cx = chartInner.left + w * i + w / 2
    const x = cx - barW / 2
    const rev = toNum(m.revenue)
    const h = ((rev / maxRevenue.value) * (chartInner.bottom - chartInner.top)) * 0.92
    const y = chartInner.bottom - h
    const revBn = rev / 1_000_000_000
    return {
      x,
      y,
      w: barW,
      h,
      cx,
      label: m.month,
      revShort: rev > 0 ? `${revBn.toFixed(2)}B` : ''
    }
  })
})

const marginBounds = computed(() => {
  const margins = monthly.value.map(m => m.margin_percent).filter(v => v > 0)
  if (margins.length === 0) return { min: 0, max: 50 }
  const minVal = Math.min(...margins)
  const maxVal = Math.max(...margins)
  const padding = Math.max(2, (maxVal - minVal) * 0.25)
  return {
    min: Math.max(0, Math.floor(minVal - padding)),
    max: Math.ceil(maxVal + padding)
  }
})

const marginPoints = computed(() => {
  const list = monthly.value
  const n = list.length
  if (n === 0) return []
  const w = (chartInner.right - chartInner.left) / n
  const { min, max } = marginBounds.value
  const range = max - min || 1
  return list.map((m, i) => {
    const t = (m.margin_percent - min) / range
    const clamped = Math.min(1, Math.max(0, t))
    const x = chartInner.left + w * i + w / 2
    const y = chartInner.bottom - clamped * (chartInner.bottom - chartInner.top)
    return { x, y, hasValue: m.margin_percent > 0 }
  })
})

const marginLinePoints = computed(() => marginPoints.value
  .filter(p => p.hasValue)
  .map(p => `${p.x},${p.y}`)
  .join(' '))

const chartYLabels = computed(() => {
  const mxBn = maxRevenue.value / 1_000_000_000
  return [`${(mxBn * 0.66).toFixed(1)}B`, `${(mxBn * 0.33).toFixed(1)}B`]
})

// ─── P&L bridge ───

const bridge = computed(() => {
  if (!summary.value) return null
  return {
    revenue: toNum(summary.value.revenue),
    estimatedCost: toNum(summary.value.estimated_cost),
    grossProfit: toNum(summary.value.gross_profit),
    externalCommission: toNum(summary.value.external_commission),
    materialCost: toNum(summary.value.material_cost)
  }
})

// ─── Donut slices ───

const SERVICE_COLORS = ['#16a34a', '#2563eb', '#d97706', '#7c3aed', '#0d9488', '#dc2626'] as const
const ADJUSTMENT_KEY = 'internal-adjustment'

const serviceDonutSlices = computed<DonutSlice[]>(() => {
  // Donut RING shows positive contributions only. Adjustment slice (often negative)
  // is excluded from the ring; spec lists it in the legend separately below.
  let colorIdx = 0
  return byService.value
    .filter(row => row.category_key !== ADJUSTMENT_KEY && toNum(row.profit) > 0)
    .map((row): DonutSlice => ({
      label: row.category_label,
      value: toNum(row.profit),
      color: SERVICE_COLORS[(colorIdx++) % SERVICE_COLORS.length]
    }))
})

const projectDonutSlices = computed<DonutSlice[]>(() => byProject.value
  .filter(row => toNum(row.gross_profit) > 0)
  .map((row, i): DonutSlice => ({
    label: row.project_name,
    value: toNum(row.gross_profit),
    color: SERVICE_COLORS[i % SERVICE_COLORS.length]
  })))

// ─── Project table ───

const projectColumns: TableColumn<RevenueProfitByProjectResource>[] = [
  { accessorKey: 'project_name', header: 'Dự án' },
  {
    accessorKey: 'share_of_revenue_percent',
    header: '% đóng góp DT',
    cell: ({ row }: { row: { original: RevenueProfitByProjectResource } }) =>
      h('span', { class: 'tabular-nums' }, `${row.original.share_of_revenue_percent.toFixed(1)}%`)
  },
  {
    accessorKey: 'revenue',
    header: 'Doanh thu',
    cell: ({ row }: { row: { original: RevenueProfitByProjectResource } }) =>
      h('span', { class: 'tabular-nums' }, formatCurrency(row.original.revenue))
  },
  {
    accessorKey: 'estimated_cost',
    header: 'Chi phí ước',
    cell: ({ row }: { row: { original: RevenueProfitByProjectResource } }) =>
      h('span', { class: 'tabular-nums' }, formatCurrency(row.original.estimated_cost))
  },
  {
    accessorKey: 'gross_profit',
    header: 'LN gộp',
    cell: ({ row }: { row: { original: RevenueProfitByProjectResource } }) =>
      h('span', { class: 'tabular-nums font-medium text-emerald-600' }, formatCurrency(row.original.gross_profit))
  },
  {
    accessorKey: 'margin_percent',
    header: 'Margin %',
    cell: ({ row }: { row: { original: RevenueProfitByProjectResource } }) =>
      h('span', { class: 'tabular-nums' }, `${row.original.margin_percent.toFixed(1)}%`)
  },
  {
    accessorKey: 'margin_alert',
    header: 'Cảnh báo',
    cell: ({ row }: { row: { original: RevenueProfitByProjectResource } }) => {
      const alert = row.original.margin_alert
      return h(
        resolveComponent('UBadge'),
        {
          color: alert ? 'warning' : 'success',
          variant: 'subtle',
          size: 'sm'
        },
        () => alert ? 'Dưới ngưỡng' : 'Ổn định'
      )
    }
  }
]

const marginAlertThreshold = computed(() => summary.value?.margin_alert_threshold ?? 31)
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Báo cáo Doanh thu & Lợi nhuận"
      description="Tổng hợp doanh thu (trước/sau KM), chi phí ước, LN gộp và margin theo kỳ chốt — góc nhìn công ty vận hành"
    />

    <SharedCrudPageError
      v-if="summaryError"
      :error="summaryError"
    />

    <template v-else>
      <!-- ═══ Filters ═══ -->
      <SharedSectionCard
        title="Bộ lọc"
        compact
        class="mb-6"
      >
        <div class="flex flex-wrap gap-4 items-end">
          <UFormField label="Kỳ chốt">
            <USelectMenu
              v-model="selectedClosingPeriodId"
              :items="closingPeriodOptions"
              value-key="value"
              placeholder="Tất cả kỳ"
              class="w-72"
              searchable
              :search-input="{ placeholder: 'Tìm kỳ chốt...', icon: 'i-lucide-search' }"
            />
          </UFormField>
          <UFormField label="Khoảng thời gian">
            <ClientOnly>
              <VueDatePicker
                v-model="dateRange"
                range
                :partial-range="false"
                :time-config="{ enableTimePicker: false }"
                model-type="yyyy-MM-dd"
                :format="formatDateRange"
                auto-apply
                :max-date="new Date()"
                input-class-name="dp-custom-input"
                :teleport="true"
                :disabled="isClosingPeriodSelected"
                class="w-64"
              />
            </ClientOnly>
          </UFormField>
          <UFormField label="Dự án">
            <SharedProjectSelect
              v-model="selectedProjectId"
              placeholder="Tất cả dự án"
              :disabled="isClosingPeriodSelected"
              class="w-48"
            />
          </UFormField>
          <UButton
            v-if="hasFilters"
            icon="i-lucide-x"
            label="Xóa bộ lọc"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="clearFilters"
          />
        </div>
        <p
          v-if="summary"
          class="text-xs text-slate-500 mt-3"
        >
          <UIcon
            name="i-lucide-calendar"
            class="size-3.5 align-[-2px]"
          />
          {{ summary.period_label }}
        </p>
      </SharedSectionCard>

      <!-- ═══ KPI cards ═══ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <SharedSectionCard
          title="Doanh thu"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-40 mb-2" />
            <USkeleton class="h-4 w-48" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ formatCurrency(summary.revenue) }}
            </p>
            <p class="text-xs text-slate-500 mt-2">
              Tổng thu thực tế của các đơn trong kỳ chốt
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="LN gộp (ước)"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-40 mb-2" />
            <USkeleton class="h-4 w-48" />
          </template>
          <template v-else-if="summary">
            <p
              class="text-2xl font-bold tabular-nums"
              :class="toNum(summary.gross_profit) >= 0 ? 'text-emerald-600' : 'text-red-600'"
            >
              {{ formatCurrency(summary.gross_profit) }}
            </p>
            <p class="text-xs text-slate-500 mt-2">
              CP ước:
              <strong class="text-slate-700 tabular-nums">{{ formatCurrency(summary.estimated_cost) }}</strong>
              ·
              <NuxtLink
                to="/reports/commission"
                class="text-primary-600 hover:underline"
              >
                Xem HH theo NV →
              </NuxtLink>
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Margin gộp"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-2" />
            <USkeleton class="h-4 w-44" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ summary.margin_percent.toFixed(1) }}%
            </p>
            <p class="text-xs text-slate-500 mt-2">
              TB 6 tháng: ~{{ summary.avg_margin_6_months.toFixed(1) }}%
            </p>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ Comparison cards (MoM/QoQ) ═══ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <SharedSectionCard
          title="MoM — Doanh thu"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-7 w-24 mb-1" />
            <USkeleton class="h-4 w-40" />
          </template>
          <template v-else-if="summary">
            <p
              class="text-xl font-bold tabular-nums"
              :class="summary.mom_revenue_percent >= 0 ? 'text-emerald-600' : 'text-red-600'"
            >
              {{ signed(summary.mom_revenue_percent) }}
            </p>
            <p class="text-xs text-slate-500 mt-1">
              {{ summary.last_month_label || '—' }} vs {{ summary.prev_month_label || '—' }}
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="MoM — LN gộp"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-7 w-24 mb-1" />
            <USkeleton class="h-4 w-40" />
          </template>
          <template v-else-if="summary">
            <p
              class="text-xl font-bold tabular-nums"
              :class="summary.mom_profit_percent >= 0 ? 'text-emerald-600' : 'text-red-600'"
            >
              {{ signed(summary.mom_profit_percent) }}
            </p>
            <p class="text-xs text-slate-500 mt-1">
              {{ summary.last_month_label || '—' }} vs {{ summary.prev_month_label || '—' }}
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="QoQ — DT / LN gộp"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-7 w-40 mb-1" />
            <USkeleton class="h-4 w-32" />
          </template>
          <template v-else-if="summary">
            <p class="text-base font-semibold tabular-nums">
              <span :class="summary.qoq_revenue_percent >= 0 ? 'text-emerald-600' : 'text-red-600'">
                DT {{ signed(summary.qoq_revenue_percent) }}
              </span>
              <span class="text-slate-400 mx-1.5">·</span>
              <span :class="summary.qoq_profit_percent >= 0 ? 'text-emerald-600' : 'text-red-600'">
                LN {{ signed(summary.qoq_profit_percent) }}
              </span>
            </p>
            <p class="text-xs text-slate-500 mt-1">
              So với quý liền trước
            </p>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ 6-month trend chart ═══ -->
      <SharedSectionCard
        title="Xu hướng 6 tháng"
        compact
        class="mb-6"
      >
        <template #header-actions>
          <div class="flex flex-wrap gap-4 text-xs">
            <span class="flex items-center gap-1.5">
              <span class="inline-block size-2.5 rounded-sm bg-primary-500" />
              Doanh thu
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block w-4 h-0.5 bg-amber-500 rounded-full" />
              Margin %
            </span>
          </div>
        </template>

        <template v-if="isLoading(monthlyStatus)">
          <USkeleton class="h-[280px] w-full" />
        </template>
        <template v-else-if="monthly.length === 0">
          <p class="py-12 text-center text-sm text-slate-500">
            Chưa có dữ liệu trong kỳ đã chọn
          </p>
        </template>
        <template v-else>
          <p class="text-xs text-slate-500 mb-3">
            Cột: doanh thu sau KM (tỷ đồng) · Đường: margin gộp % (trục phải)
          </p>
          <div class="w-full overflow-x-auto">
            <svg
              class="min-w-[520px] w-full h-[280px] text-slate-500"
              viewBox="0 0 640 280"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Biểu đồ doanh thu và margin theo tháng"
            >
              <line
                x1="56"
                y1="220"
                x2="600"
                y2="220"
                stroke="currentColor"
                stroke-opacity="0.2"
              />
              <line
                x1="56"
                y1="160"
                x2="600"
                y2="160"
                stroke="currentColor"
                stroke-opacity="0.08"
              />
              <line
                x1="56"
                y1="100"
                x2="600"
                y2="100"
                stroke="currentColor"
                stroke-opacity="0.08"
              />
              <g
                v-for="(b, i) in chartBars"
                :key="'bar-' + i"
              >
                <rect
                  :x="b.x"
                  :y="b.y"
                  :width="b.w"
                  :height="b.h"
                  class="fill-primary-500/85"
                  rx="3"
                />
                <text
                  :x="b.cx"
                  y="238"
                  text-anchor="middle"
                  class="fill-current text-[11px]"
                >
                  {{ b.label }}
                </text>
                <text
                  v-if="b.revShort"
                  :x="b.cx"
                  :y="b.y - 6"
                  text-anchor="middle"
                  class="fill-current text-[10px] font-medium"
                >
                  {{ b.revShort }}
                </text>
              </g>
              <polyline
                v-if="marginLinePoints"
                :points="marginLinePoints"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                class="text-amber-500"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g
                v-for="(pt, i) in marginPoints"
                :key="'mpt-' + i"
              >
                <circle
                  v-if="pt.hasValue"
                  :cx="pt.x"
                  :cy="pt.y"
                  r="4"
                  class="fill-amber-500"
                />
              </g>
              <text
                x="8"
                y="100"
                class="fill-current text-[10px]"
              >
                {{ chartYLabels[0] }}
              </text>
              <text
                x="8"
                y="160"
                class="fill-current text-[10px]"
              >
                {{ chartYLabels[1] }}
              </text>
              <text
                x="8"
                y="218"
                class="fill-current text-[10px]"
              >
                0
              </text>
              <text
                x="608"
                y="104"
                text-anchor="end"
                class="fill-current text-[10px]"
              >
                {{ marginBounds.max }}%
              </text>
              <text
                x="608"
                y="224"
                text-anchor="end"
                class="fill-current text-[10px]"
              >
                {{ marginBounds.min }}%
              </text>
            </svg>
          </div>
        </template>
      </SharedSectionCard>

      <!-- ═══ P&L bridge ═══ -->
      <SharedSectionCard
        title="Luồng tạo LN gộp (ước — cùng kỳ báo cáo)"
        compact
        class="mb-6"
      >
        <template v-if="isLoading(summaryStatus) || !bridge">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <USkeleton
              v-for="i in 3"
              :key="i"
              class="h-24"
            />
          </div>
        </template>
        <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div class="rounded-lg border border-primary-300 bg-primary-50 p-3">
              <p class="text-[11px] text-slate-500 mb-1">
                Doanh thu
              </p>
              <p class="font-bold tabular-nums text-sm text-primary-700">
                {{ formatCurrency(bridge.revenue) }}
              </p>
            </div>
            <div class="rounded-lg border border-red-200 bg-red-50/60 p-3 flex flex-col justify-center">
              <p class="text-red-700 text-sm font-bold">
                − CP ước
              </p>
              <p class="text-[11px] text-slate-600 tabular-nums">
                {{ formatCurrency(bridge.estimatedCost) }}
              </p>
              <p class="text-[10px] text-slate-500 mt-1">
                HH ngoài: {{ formatCurrency(bridge.externalCommission) }} · Vật tư: {{ formatCurrency(bridge.materialCost) }}
              </p>
            </div>
            <div class="rounded-lg border border-emerald-300 bg-emerald-50 p-3">
              <p class="text-[11px] text-slate-500 mb-1">
                LN gộp
              </p>
              <p
                class="font-bold tabular-nums text-sm"
                :class="bridge.grossProfit >= 0 ? 'text-emerald-700' : 'text-red-700'"
              >
                {{ formatCurrency(bridge.grossProfit) }}
              </p>
            </div>
          </div>
          <p class="text-xs text-slate-500 mt-3 leading-relaxed">
            Đơn vị: đồng. Mục đích: cho BGĐ thấy nhanh DT → chi phí → LN gộp.
            <strong>LN gộp KHÔNG trừ phần HH công ty VH</strong> (VH giữ lại).
          </p>
        </template>
      </SharedSectionCard>

      <!-- ═══ Insights alert ═══ -->
      <UAlert
        v-if="summary && summary.insights.length > 0"
        color="neutral"
        variant="subtle"
        icon="i-lucide-lightbulb"
        title="Nhận định nhanh"
        class="mb-6"
      >
        <template #description>
          <ul class="list-disc pl-5 text-sm space-y-1.5 mt-1">
            <li
              v-for="(line, idx) in summary.insights"
              :key="idx"
            >
              {{ line }}
            </li>
          </ul>
        </template>
      </UAlert>

      <!-- ═══ Donut breakdowns ═══ -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <SharedSectionCard
          title="Cơ cấu LN gộp theo loại dịch vụ"
          compact
        >
          <template #header-actions>
            <span class="text-xs text-slate-500 hidden sm:inline">Tỷ trọng theo nhóm dịch vụ</span>
          </template>

          <template v-if="isLoading(byServiceStatus)">
            <USkeleton class="h-[220px] w-full" />
          </template>
          <template v-else-if="byService.length === 0">
            <p class="py-12 text-center text-sm text-slate-500">
              Chưa có dữ liệu
            </p>
          </template>
          <template v-else>
            <SharedReportDonutChart
              title="Lợi nhuận theo loại dịch vụ"
              :slices="serviceDonutSlices"
              center-label="Tổng LN"
              value-suffix=" đ"
            />
            <ul class="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <li
                v-for="row in byService.filter(r => r.category_key === ADJUSTMENT_KEY)"
                :key="row.category_key"
                class="flex items-start gap-2 text-slate-500"
              >
                <span class="mt-1 size-2 rounded-sm bg-slate-300" />
                <div class="flex-1">
                  <span>{{ row.category_label }}</span>
                  <span class="ml-1 tabular-nums">
                    — {{ formatCurrency(row.profit) }} ({{ row.share_percent.toFixed(1) }}%)
                  </span>
                </div>
              </li>
            </ul>
            <p class="text-xs text-slate-500 mt-3 leading-relaxed">
              Hai biểu đồ (dịch vụ + dự án) cùng tổng = LN gộp kỳ. Dòng "Điều chỉnh nội bộ" là phần HH chưa phân bổ được xuống line.
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Cơ cấu LN gộp theo dự án"
          compact
        >
          <template v-if="isLoading(byProjectStatus)">
            <USkeleton class="h-[220px] w-full" />
          </template>
          <template v-else-if="projectDonutSlices.length === 0">
            <p class="py-12 text-center text-sm text-slate-500">
              Chưa có dữ liệu
            </p>
          </template>
          <template v-else>
            <SharedReportDonutChart
              title="Lợi nhuận theo dự án"
              :slices="projectDonutSlices"
              center-label="Tổng LN"
              value-suffix=" đ"
            />
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ Project table ═══ -->
      <SharedSectionCard
        title="Theo dự án — cơ cấu & cảnh báo margin"
        compact
        class="mb-6"
      >
        <template #header-actions>
          <span class="text-xs text-slate-500 hidden sm:inline">
            % đóng góp DT trên tổng. Cảnh báo khi margin &lt; {{ marginAlertThreshold }}%
          </span>
        </template>

        <template v-if="isLoading(byProjectStatus)">
          <USkeleton class="h-40 w-full" />
        </template>
        <template v-else>
          <UTable
            :data="byProject"
            :columns="projectColumns"
            :empty-state="{ icon: 'i-lucide-inbox', label: 'Không có dự án trong kỳ' }"
          />
        </template>
      </SharedSectionCard>
    </template>
  </div>
</template>
