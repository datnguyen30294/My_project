<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type {
  OperatingProfitByProjectResource,
  OperatingProfitMonthlyResource
} from '~/composables/api/useOperatingProfitReports'
import type { DonutSlice } from '~/components/shared/report/DonutChart.vue'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Lợi nhuận công ty vận hành (Vật tư + Hoa hồng)' })

// ─── Colors ───

const MATERIAL_COLOR = '#f59e0b'
const COMMISSION_COLOR = '#2563eb'

// ─── Filters ───

const {
  dateRange,
  dateFromRef,
  dateToRef,
  defaultFrom,
  defaultTo,
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

const { closingPeriodOptions } = useClosingPeriodOptions()

// ─── Data ───

const {
  data: summaryData,
  status: summaryStatus,
  error: summaryError
} = useOperatingProfitSummary(filterParams)
const summary = computed(() => summaryData.value?.data ?? null)

const {
  data: monthlyData,
  status: monthlyStatus
} = useOperatingProfitMonthly(filterParams)
const monthly = computed<OperatingProfitMonthlyResource[]>(() => monthlyData.value?.data ?? [])

const {
  data: byProjectData,
  status: byProjectStatus
} = useOperatingProfitByProject(filterParams)
const byProject = computed<OperatingProfitByProjectResource[]>(() => byProjectData.value?.data ?? [])

// ─── Helpers ───

const isLoading = (status: string) => status === 'pending'

function toNum(value: string | number | null | undefined): number {
  if (value == null) return 0
  return typeof value === 'string' ? parseFloat(value) || 0 : value
}

function signed(value: number, fractionDigits = 1): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(fractionDigits)}%`
}

const totalProfit = computed(() => toNum(summary.value?.total_profit))
const materialProfit = computed(() => toNum(summary.value?.material_profit))
const commissionProfit = computed(() => toNum(summary.value?.commission_profit))
const totalIsProfit = computed(() => totalProfit.value > 0)
const totalIsLoss = computed(() => totalProfit.value < 0)

// ─── Donut: material vs commission ───

const breakdownSlices = computed<DonutSlice[]>(() => {
  const items: DonutSlice[] = []
  if (materialProfit.value > 0) {
    items.push({ label: 'Vật tư', value: materialProfit.value, color: MATERIAL_COLOR })
  }
  if (commissionProfit.value > 0) {
    items.push({ label: 'Hoa hồng VH', value: commissionProfit.value, color: COMMISSION_COLOR })
  }
  return items
})

// ─── Stacked bar chart (6 months) ───

const chartInner = { left: 56, right: 600, top: 28, bottom: 220 }

const absMaxMonthly = computed(() => {
  const list = monthly.value
  if (list.length === 0) return 1
  let max = 0
  for (const m of list) {
    const mat = toNum(m.material_profit)
    const com = toNum(m.commission_profit)
    const positive = Math.max(0, mat) + Math.max(0, com)
    const negative = Math.min(0, mat) + Math.min(0, com)
    max = Math.max(max, Math.abs(positive), Math.abs(negative))
  }
  return max > 0 ? max : 1
})

const zeroLineY = computed(() => (chartInner.top + chartInner.bottom) / 2)

interface StackBar {
  cx: number
  x: number
  w: number
  label: string
  total: number
  matRect: { y: number, h: number } | null
  comRect: { y: number, h: number } | null
  matNegRect: { y: number, h: number } | null
  comNegRect: { y: number, h: number } | null
  totalShort: string
  totalY: number
}

const monthlyBars = computed<StackBar[]>(() => {
  const list = monthly.value
  const n = list.length
  if (n === 0) return []
  const w = (chartInner.right - chartInner.left) / n
  const barW = Math.min(48, w * 0.56)
  const halfHeight = (chartInner.bottom - chartInner.top) / 2
  const scale = halfHeight * 0.92 / absMaxMonthly.value

  return list.map((m, i): StackBar => {
    const cx = chartInner.left + w * i + w / 2
    const x = cx - barW / 2
    const mat = toNum(m.material_profit)
    const com = toNum(m.commission_profit)
    const total = mat + com

    let matRect: { y: number, h: number } | null = null
    let comRect: { y: number, h: number } | null = null
    let matNegRect: { y: number, h: number } | null = null
    let comNegRect: { y: number, h: number } | null = null

    // Positive stack grows UP from zero line
    if (mat > 0 || com > 0) {
      let cursor = zeroLineY.value
      if (mat > 0) {
        const h = mat * scale
        cursor -= h
        matRect = { y: cursor, h }
      }
      if (com > 0) {
        const h = com * scale
        cursor -= h
        comRect = { y: cursor, h }
      }
    }
    // Negative stack grows DOWN from zero line
    if (mat < 0 || com < 0) {
      let cursor = zeroLineY.value
      if (mat < 0) {
        const h = Math.abs(mat) * scale
        matNegRect = { y: cursor, h }
        cursor += h
      }
      if (com < 0) {
        const h = Math.abs(com) * scale
        comNegRect = { y: cursor, h }
      }
    }

    const totalBn = total / 1_000_000_000
    const totalMn = total / 1_000_000
    const totalShort = total !== 0
      ? (Math.abs(totalBn) >= 1 ? `${totalBn.toFixed(2)}B` : `${totalMn.toFixed(1)}M`)
      : ''

    let totalY = zeroLineY.value - 8
    if (total > 0 && matRect) {
      totalY = (comRect?.y ?? matRect.y) - 6
    } else if (total < 0 && matNegRect) {
      const bottomRect = comNegRect ?? matNegRect
      totalY = bottomRect.y + bottomRect.h + 12
    }

    return {
      cx,
      x,
      w: barW,
      label: m.month,
      total,
      matRect,
      comRect,
      matNegRect,
      comNegRect,
      totalShort,
      totalY
    }
  })
})

const chartYLabel = computed(() => {
  const mxBn = absMaxMonthly.value / 1_000_000_000
  if (mxBn >= 1) return `${mxBn.toFixed(1)}B`
  return `${(absMaxMonthly.value / 1_000_000).toFixed(0)}M`
})

// ─── Project bar list ───

interface ProjectBarRow {
  project_id: number
  project_name: string
  material_profit: number
  commission_profit: number
  total_profit: number
  share_percent: number
  matPct: number
  comPct: number
}

const projectBars = computed<ProjectBarRow[]>(() => {
  return byProject.value.map((row): ProjectBarRow => {
    const mat = Math.max(0, toNum(row.material_profit))
    const com = Math.max(0, toNum(row.commission_profit))
    const totalPositive = mat + com
    return {
      project_id: row.project_id,
      project_name: row.project_name,
      material_profit: toNum(row.material_profit),
      commission_profit: toNum(row.commission_profit),
      total_profit: toNum(row.total_profit),
      share_percent: row.share_percent,
      matPct: totalPositive > 0 ? (mat / totalPositive) * 100 : 0,
      comPct: totalPositive > 0 ? (com / totalPositive) * 100 : 0
    }
  })
})

const projectColumns: TableColumn<ProjectBarRow>[] = [
  { accessorKey: 'project_name', header: 'Dự án' },
  {
    accessorKey: 'material_profit',
    header: 'LN Vật tư',
    cell: ({ row }: { row: { original: ProjectBarRow } }) =>
      h('span', {
        class: row.original.material_profit >= 0
          ? 'tabular-nums text-amber-700 font-medium'
          : 'tabular-nums text-red-600 font-medium'
      }, formatCurrency(row.original.material_profit))
  },
  {
    accessorKey: 'commission_profit',
    header: 'LN Hoa hồng VH',
    cell: ({ row }: { row: { original: ProjectBarRow } }) =>
      h('span', {
        class: row.original.commission_profit >= 0
          ? 'tabular-nums text-blue-700 font-medium'
          : 'tabular-nums text-red-600 font-medium'
      }, formatCurrency(row.original.commission_profit))
  },
  {
    accessorKey: 'total_profit',
    header: 'Tổng LN',
    cell: ({ row }: { row: { original: ProjectBarRow } }) =>
      h('span', {
        class: row.original.total_profit >= 0
          ? 'tabular-nums font-bold text-emerald-600'
          : 'tabular-nums font-bold text-red-600'
      }, formatCurrency(row.original.total_profit))
  },
  {
    accessorKey: 'share_percent',
    header: '% đóng góp',
    cell: ({ row }: { row: { original: ProjectBarRow } }) =>
      h('span', { class: 'tabular-nums' }, `${row.original.share_percent.toFixed(1)}%`)
  }
]
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Lợi nhuận công ty vận hành"
      description="Mổ xẻ lợi nhuận theo hai nguồn: Vật tư (markup) + Hoa hồng công ty vận hành nhận được"
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
                format="dd/MM/yyyy"
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

      <!-- ═══ HERO — Đang lãi bao nhiêu? ═══ -->
      <div
        class="relative mb-6 overflow-hidden rounded-xl border p-6 sm:p-8"
        :class="[
          totalIsProfit ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-50 to-white' : '',
          totalIsLoss ? 'border-red-200 bg-gradient-to-br from-red-50 via-red-50 to-white' : '',
          !totalIsProfit && !totalIsLoss ? 'border-slate-200 bg-slate-50' : ''
        ]"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div class="min-w-0">
            <p
              class="text-xs font-semibold tracking-wider uppercase mb-2"
              :class="totalIsProfit ? 'text-emerald-700' : (totalIsLoss ? 'text-red-700' : 'text-slate-500')"
            >
              <UIcon
                :name="totalIsProfit ? 'i-lucide-trending-up' : (totalIsLoss ? 'i-lucide-trending-down' : 'i-lucide-minus')"
                class="size-4 align-[-3px] mr-1"
              />
              {{ totalIsProfit ? 'Đang lãi' : (totalIsLoss ? 'Đang lỗ' : 'Hòa vốn') }} — {{ summary?.period_label }}
            </p>
            <template v-if="isLoading(summaryStatus)">
              <USkeleton class="h-14 w-72 mb-3" />
              <USkeleton class="h-4 w-96" />
            </template>
            <template v-else-if="summary">
              <p
                class="text-4xl sm:text-5xl font-extrabold tabular-nums leading-tight"
                :class="totalIsProfit ? 'text-emerald-700' : (totalIsLoss ? 'text-red-700' : 'text-slate-700')"
              >
                {{ formatCurrency(totalProfit) }}
              </p>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm">
                <UBadge
                  :color="summary.mom_total_percent >= 0 ? 'success' : 'error'"
                  variant="subtle"
                  size="md"
                >
                  <UIcon
                    :name="summary.mom_total_percent >= 0 ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'"
                    class="size-3.5 mr-1"
                  />
                  {{ signed(summary.mom_total_percent) }}
                </UBadge>
                <span class="text-slate-600">
                  so với {{ summary.prev_month_label || 'tháng trước' }}
                  ({{ summary.last_month_label || '—' }})
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-3">
                TB 6 tháng gần nhất: <strong class="text-slate-700 tabular-nums">{{ formatCurrency(summary.avg_profit_6_months) }}</strong> ·
                QoQ: <strong :class="summary.qoq_total_percent >= 0 ? 'text-emerald-600' : 'text-red-600'">{{ signed(summary.qoq_total_percent) }}</strong>
              </p>
            </template>
          </div>

          <!-- Split bar: Material vs Commission -->
          <template v-if="summary && totalIsProfit">
            <div class="w-full md:w-[340px] shrink-0">
              <p class="text-xs text-slate-500 mb-2">
                Cơ cấu đóng góp
              </p>
              <div class="h-8 w-full flex rounded-lg overflow-hidden border border-slate-200 bg-white">
                <div
                  class="h-full flex items-center justify-center text-white text-[11px] font-medium transition-all"
                  :style="{ width: `${summary.material_share_percent}%`, backgroundColor: MATERIAL_COLOR }"
                >
                  {{ summary.material_share_percent >= 12 ? `${summary.material_share_percent.toFixed(0)}%` : '' }}
                </div>
                <div
                  class="h-full flex items-center justify-center text-white text-[11px] font-medium transition-all"
                  :style="{ width: `${summary.commission_share_percent}%`, backgroundColor: COMMISSION_COLOR }"
                >
                  {{ summary.commission_share_percent >= 12 ? `${summary.commission_share_percent.toFixed(0)}%` : '' }}
                </div>
              </div>
              <div class="flex justify-between mt-2 text-[11px] text-slate-600">
                <span class="flex items-center gap-1.5">
                  <span
                    class="inline-block size-2.5 rounded-sm"
                    :style="{ backgroundColor: MATERIAL_COLOR }"
                  />
                  Vật tư
                </span>
                <span class="flex items-center gap-1.5">
                  Hoa hồng VH
                  <span
                    class="inline-block size-2.5 rounded-sm"
                    :style="{ backgroundColor: COMMISSION_COLOR }"
                  />
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ═══ Two-source cards ═══ -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <!-- Material card -->
        <SharedSectionCard
          title="Lợi nhuận từ Vật tư"
          icon="i-lucide-package"
          compact
        >
          <template #header-actions>
            <UBadge
              variant="subtle"
              color="warning"
            >
              Markup vật tư
            </UBadge>
          </template>

          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-40 mb-2" />
            <USkeleton class="h-4 w-56" />
          </template>
          <template v-else-if="summary">
            <p
              class="text-3xl font-bold tabular-nums"
              :class="materialProfit >= 0 ? 'text-amber-700' : 'text-red-600'"
            >
              {{ formatCurrency(materialProfit) }}
            </p>
            <div class="flex items-center gap-2 mt-2 text-xs">
              <UBadge
                :color="summary.mom_material_percent >= 0 ? 'success' : 'error'"
                variant="subtle"
                size="sm"
              >
                {{ signed(summary.mom_material_percent) }}
              </UBadge>
              <span class="text-slate-500">so với tháng trước</span>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p class="text-slate-500">
                  Doanh thu VT
                </p>
                <p class="font-semibold tabular-nums text-slate-800 mt-0.5">
                  {{ formatCurrency(summary.material_revenue) }}
                </p>
              </div>
              <div>
                <p class="text-slate-500">
                  CP mua vào
                </p>
                <p class="font-semibold tabular-nums text-slate-800 mt-0.5">
                  {{ formatCurrency(summary.material_cost) }}
                </p>
              </div>
            </div>
          </template>
        </SharedSectionCard>

        <!-- Commission card -->
        <SharedSectionCard
          title="Lợi nhuận từ Hoa hồng"
          icon="i-lucide-coins"
          compact
        >
          <template #header-actions>
            <UBadge
              variant="subtle"
              color="info"
            >
              Hoa hồng VH nhận
            </UBadge>
          </template>

          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-40 mb-2" />
            <USkeleton class="h-4 w-56" />
          </template>
          <template v-else-if="summary">
            <p
              class="text-3xl font-bold tabular-nums"
              :class="commissionProfit >= 0 ? 'text-blue-700' : 'text-red-600'"
            >
              {{ formatCurrency(commissionProfit) }}
            </p>
            <div class="flex items-center gap-2 mt-2 text-xs">
              <UBadge
                :color="summary.mom_commission_percent >= 0 ? 'success' : 'error'"
                variant="subtle"
                size="sm"
              >
                {{ signed(summary.mom_commission_percent) }}
              </UBadge>
              <span class="text-slate-500">so với tháng trước</span>
            </div>
            <p class="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 leading-relaxed">
              Phần hoa hồng công ty vận hành giữ lại sau khi phân bổ (recipient_type
              <code class="text-[10px] bg-slate-100 px-1 rounded">operating_company</code>).
              Xem chi tiết phân bổ tại
              <NuxtLink
                to="/reports/commission"
                class="text-primary-600 hover:underline"
              >
                báo cáo Phân bổ hoa hồng →
              </NuxtLink>
            </p>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ Insights ═══ -->
      <UAlert
        v-if="summary && summary.insights.length > 0"
        :color="totalIsLoss ? 'warning' : 'info'"
        variant="subtle"
        :icon="totalIsLoss ? 'i-lucide-alert-triangle' : 'i-lucide-lightbulb'"
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

      <!-- ═══ 6-month trend (stacked bar) ═══ -->
      <SharedSectionCard
        title="Xu hướng 6 tháng — LN ghép khối (Vật tư + Hoa hồng)"
        compact
        class="mb-6"
      >
        <template #header-actions>
          <div class="flex flex-wrap gap-4 text-xs">
            <span class="flex items-center gap-1.5">
              <span
                class="inline-block size-2.5 rounded-sm"
                :style="{ backgroundColor: MATERIAL_COLOR }"
              />
              Vật tư
            </span>
            <span class="flex items-center gap-1.5">
              <span
                class="inline-block size-2.5 rounded-sm"
                :style="{ backgroundColor: COMMISSION_COLOR }"
              />
              Hoa hồng VH
            </span>
          </div>
        </template>

        <template v-if="isLoading(monthlyStatus)">
          <USkeleton class="h-[280px] w-full" />
        </template>
        <template v-else-if="monthly.length === 0 || absMaxMonthly === 1">
          <p class="py-12 text-center text-sm text-slate-500">
            Chưa có dữ liệu trong kỳ đã chọn
          </p>
        </template>
        <template v-else>
          <p class="text-xs text-slate-500 mb-3">
            Cột ghép: Vật tư xếp dưới, Hoa hồng VH xếp trên. Số trên đỉnh = tổng LN tháng. Cột hướng xuống = lỗ.
          </p>
          <div class="w-full overflow-x-auto">
            <svg
              class="min-w-[520px] w-full h-[300px] text-slate-500"
              viewBox="0 0 640 300"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Biểu đồ lợi nhuận công ty vận hành 6 tháng"
            >
              <line
                x1="56"
                :y1="zeroLineY"
                x2="600"
                :y2="zeroLineY"
                stroke="currentColor"
                stroke-opacity="0.35"
                stroke-width="1.5"
              />
              <line
                x1="56"
                :y1="chartInner.top"
                x2="600"
                :y2="chartInner.top"
                stroke="currentColor"
                stroke-opacity="0.08"
                stroke-dasharray="3,3"
              />
              <line
                x1="56"
                :y1="chartInner.bottom"
                x2="600"
                :y2="chartInner.bottom"
                stroke="currentColor"
                stroke-opacity="0.08"
                stroke-dasharray="3,3"
              />

              <!-- Y axis labels -->
              <text
                x="8"
                :y="chartInner.top + 12"
                class="fill-current text-[10px]"
              >
                +{{ chartYLabel }}
              </text>
              <text
                x="8"
                :y="zeroLineY + 4"
                class="fill-current text-[10px]"
              >
                0
              </text>
              <text
                x="8"
                :y="chartInner.bottom - 2"
                class="fill-current text-[10px]"
              >
                -{{ chartYLabel }}
              </text>

              <!-- Bars -->
              <g
                v-for="(b, i) in monthlyBars"
                :key="'bar-' + i"
              >
                <rect
                  v-if="b.matRect"
                  :x="b.x"
                  :y="b.matRect.y"
                  :width="b.w"
                  :height="b.matRect.h"
                  :fill="MATERIAL_COLOR"
                  rx="2"
                />
                <rect
                  v-if="b.comRect"
                  :x="b.x"
                  :y="b.comRect.y"
                  :width="b.w"
                  :height="b.comRect.h"
                  :fill="COMMISSION_COLOR"
                  rx="2"
                />
                <rect
                  v-if="b.matNegRect"
                  :x="b.x"
                  :y="b.matNegRect.y"
                  :width="b.w"
                  :height="b.matNegRect.h"
                  :fill="MATERIAL_COLOR"
                  fill-opacity="0.6"
                  rx="2"
                />
                <rect
                  v-if="b.comNegRect"
                  :x="b.x"
                  :y="b.comNegRect.y"
                  :width="b.w"
                  :height="b.comNegRect.h"
                  :fill="COMMISSION_COLOR"
                  fill-opacity="0.6"
                  rx="2"
                />
                <text
                  :x="b.cx"
                  :y="chartInner.bottom + 22"
                  text-anchor="middle"
                  class="fill-current text-[11px]"
                >
                  {{ b.label }}
                </text>
                <text
                  v-if="b.totalShort"
                  :x="b.cx"
                  :y="b.totalY"
                  text-anchor="middle"
                  class="fill-current text-[10px] font-semibold"
                  :class="b.total >= 0 ? 'text-emerald-700' : 'text-red-600'"
                >
                  {{ b.totalShort }}
                </text>
              </g>
            </svg>
          </div>
        </template>
      </SharedSectionCard>

      <!-- ═══ Donut breakdown ═══ -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <SharedSectionCard
          title="Cơ cấu LN theo nguồn"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-[220px] w-full" />
          </template>
          <template v-else-if="breakdownSlices.length === 0">
            <p class="py-12 text-center text-sm text-slate-500">
              Chưa có lợi nhuận dương trong kỳ
            </p>
          </template>
          <template v-else>
            <SharedReportDonutChart
              title="Lợi nhuận theo nguồn"
              :slices="breakdownSlices"
              center-label="Tổng LN"
              value-suffix=" đ"
            />
          </template>
        </SharedSectionCard>

        <!-- Quick P&L bridge -->
        <SharedSectionCard
          title="Luồng tạo LN công ty vận hành"
          compact
        >
          <template v-if="isLoading(summaryStatus) || !summary">
            <USkeleton class="h-40" />
          </template>
          <template v-else>
            <div class="space-y-3">
              <!-- Material bridge -->
              <div class="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
                <div class="rounded-lg border border-amber-200 bg-amber-50 p-2.5">
                  <p class="text-[10px] text-slate-500 mb-0.5">
                    DT Vật tư
                  </p>
                  <p class="text-xs font-bold tabular-nums text-slate-800">
                    {{ formatCurrency(summary.material_revenue) }}
                  </p>
                </div>
                <UIcon
                  name="i-lucide-minus"
                  class="size-4 text-slate-400"
                />
                <div class="rounded-lg border border-red-200 bg-red-50 p-2.5">
                  <p class="text-[10px] text-slate-500 mb-0.5">
                    CP mua
                  </p>
                  <p class="text-xs font-bold tabular-nums text-slate-800">
                    {{ formatCurrency(summary.material_cost) }}
                  </p>
                </div>
                <UIcon
                  name="i-lucide-equal"
                  class="size-4 text-slate-400"
                />
                <div class="rounded-lg border border-amber-300 bg-amber-100 p-2.5">
                  <p class="text-[10px] text-slate-500 mb-0.5">
                    LN Vật tư
                  </p>
                  <p class="text-xs font-bold tabular-nums text-amber-800">
                    {{ formatCurrency(summary.material_profit) }}
                  </p>
                </div>
              </div>

              <!-- Plus sign separator -->
              <div class="flex justify-center">
                <span class="inline-flex items-center justify-center size-8 rounded-full bg-slate-100 text-slate-600 font-bold text-lg">+</span>
              </div>

              <!-- Commission row -->
              <div class="rounded-lg border border-blue-200 bg-blue-50 p-3 flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-500 mb-0.5">
                    Hoa hồng VH nhận (snapshot)
                  </p>
                  <p class="text-xs text-slate-600">
                    = {{ formatCurrency(summary.commission_profit) }}
                  </p>
                </div>
                <p class="text-sm font-bold tabular-nums text-blue-800">
                  {{ formatCurrency(summary.commission_profit) }}
                </p>
              </div>

              <!-- Total -->
              <div
                class="rounded-lg border p-3 flex items-center justify-between"
                :class="totalIsProfit ? 'border-emerald-300 bg-emerald-50' : (totalIsLoss ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50')"
              >
                <p
                  class="text-sm font-semibold"
                  :class="totalIsProfit ? 'text-emerald-700' : (totalIsLoss ? 'text-red-700' : 'text-slate-600')"
                >
                  = Tổng LN công ty vận hành
                </p>
                <p
                  class="text-lg font-extrabold tabular-nums"
                  :class="totalIsProfit ? 'text-emerald-700' : (totalIsLoss ? 'text-red-700' : 'text-slate-700')"
                >
                  {{ formatCurrency(summary.total_profit) }}
                </p>
              </div>
            </div>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ Project table ═══ -->
      <SharedSectionCard
        title="Theo dự án — đóng góp LN"
        compact
        class="mb-6"
      >
        <template #header-actions>
          <span class="text-xs text-slate-500 hidden sm:inline">
            Sắp xếp theo tổng LN giảm dần
          </span>
        </template>

        <template v-if="isLoading(byProjectStatus)">
          <USkeleton class="h-40 w-full" />
        </template>
        <template v-else-if="projectBars.length === 0">
          <p class="py-12 text-center text-sm text-slate-500">
            Không có dự án trong kỳ
          </p>
        </template>
        <template v-else>
          <UTable
            :data="projectBars"
            :columns="projectColumns"
            :empty-state="{ icon: 'i-lucide-inbox', label: 'Không có dự án trong kỳ' }"
          />

          <!-- Composition bars below table (visual quick-read) -->
          <div class="mt-6 space-y-3">
            <p class="text-xs text-slate-500 mb-1">
              Cơ cấu Vật tư vs Hoa hồng VH của từng dự án (chỉ phần lãi dương):
            </p>
            <div
              v-for="row in projectBars.slice(0, 5)"
              :key="row.project_id"
              class="text-xs"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-slate-700 truncate max-w-[60%]">{{ row.project_name }}</span>
                <span
                  class="tabular-nums font-semibold"
                  :class="row.total_profit >= 0 ? 'text-emerald-600' : 'text-red-600'"
                >{{ formatCurrency(row.total_profit) }}</span>
              </div>
              <div class="h-2 w-full flex rounded-full overflow-hidden bg-slate-100">
                <div
                  v-if="row.matPct > 0"
                  class="h-full transition-all"
                  :style="{ width: `${row.matPct}%`, backgroundColor: MATERIAL_COLOR }"
                />
                <div
                  v-if="row.comPct > 0"
                  class="h-full transition-all"
                  :style="{ width: `${row.comPct}%`, backgroundColor: COMMISSION_COLOR }"
                />
              </div>
            </div>
          </div>
        </template>
      </SharedSectionCard>
    </template>
  </div>
</template>
