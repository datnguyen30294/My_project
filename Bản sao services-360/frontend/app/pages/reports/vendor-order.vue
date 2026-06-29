<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type {
  VendorOrderReportByVendorResource,
  VendorOrderReportByProjectResource,
  VendorOrderReportTrendResource
} from '~/composables/api/useVendorOrderReports'
import type {
  StackedColumnSeries,
  StackedColumnCategory
} from '~/components/shared/report/StackedColumnChart.vue'
import type {
  LineChartSeries,
  LineChartPoint
} from '~/components/shared/report/LineChart.vue'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Báo cáo Đơn hàng vendor' })

// ─── Filters (URL-synced) ───

const {
  dateRange,
  dateFromRef,
  dateToRef,
  formatDateRange,
  syncRangeFromRefs,
  clearRange
} = useReportDateRange()
const selectedProjectId = ref<number | undefined>(undefined)

useUrlFilters({
  date_from: { ref: dateFromRef, type: 'string' },
  date_to: { ref: dateToRef, type: 'string' },
  project_id: { ref: selectedProjectId, type: 'number' }
})

syncRangeFromRefs()

const hasFilters = computed(() =>
  selectedProjectId.value != null || !!dateFromRef.value || !!dateToRef.value
)

function clearFilters() {
  selectedProjectId.value = undefined
  clearRange()
}

const filterParams = computed(() => ({
  date_from: dateFromRef.value || undefined,
  date_to: dateToRef.value || undefined,
  project_id: selectedProjectId.value || undefined
}))

// ─── Data fetching ───

const {
  data: summaryData,
  status: summaryStatus,
  error: summaryError
} = useVendorOrderReportSummary(filterParams)
const summary = computed(() => summaryData.value?.data ?? null)

const { data: byVendorData, status: byVendorStatus } = useVendorOrderReportByVendor(filterParams)
const byVendorRows = computed<VendorOrderReportByVendorResource[]>(() => byVendorData.value?.data ?? [])

const { data: byProjectData, status: byProjectStatus } = useVendorOrderReportByProject(filterParams)
const byProjectRows = computed<VendorOrderReportByProjectResource[]>(() => byProjectData.value?.data ?? [])

const { data: trendData, status: trendStatus } = useVendorOrderReportTrend(filterParams)
const trendRows = computed<VendorOrderReportTrendResource[]>(() => trendData.value?.data ?? [])

// ─── Display helpers ───

const isLoading = (status: string) => status === 'pending'

function toNum(value: string | null | undefined): number {
  if (value == null) return 0
  return parseFloat(value) || 0
}

const hasNonPerOrderContractOrders = computed(() =>
  !!summary.value && summary.value.warnings.non_per_order_orders_count > 0
)

// ─── Charts (doanh thu + hoa hồng) ───

const REVENUE_SERIES: StackedColumnSeries[] = [
  { key: 'revenue', label: 'Doanh thu', color: '#2563eb' },
  { key: 'commission', label: 'Hoa hồng', color: '#16a34a' }
]

const chartByVendor = computed<StackedColumnCategory[]>(() =>
  byVendorRows.value.map(r => ({
    label: r.vendor_name,
    values: { revenue: toNum(r.revenue_total), commission: toNum(r.commission_total) }
  }))
)

const chartByProject = computed<StackedColumnCategory[]>(() =>
  byProjectRows.value.map(r => ({
    label: r.project_name,
    values: { revenue: toNum(r.revenue_total), commission: toNum(r.commission_total) }
  }))
)

const TREND_LINE_SERIES: LineChartSeries[] = [
  { key: 'revenue', label: 'Doanh thu', color: '#f97316', fill: true },
  { key: 'commission', label: 'Hoa hồng', color: '#10b981', fill: true }
]

const trendPoints = computed<LineChartPoint[]>(() =>
  trendRows.value.map(r => ({
    label: r.date,
    values: { revenue: toNum(r.revenue_total), commission: toNum(r.commission_total) }
  }))
)

// ─── Tables ───

const vendorColumns = [
  { accessorKey: 'vendor_name', header: 'Vendor' },
  { accessorKey: 'orders_count', header: 'Số đơn' },
  { accessorKey: 'revenue_total', header: 'Doanh thu' },
  { accessorKey: 'commission_total', header: 'Hoa hồng' }
]

const projectColumns = [
  { accessorKey: 'project_name', header: 'Dự án' },
  { accessorKey: 'orders_count', header: 'Số đơn' },
  { accessorKey: 'revenue_total', header: 'Doanh thu' },
  { accessorKey: 'commission_total', header: 'Hoa hồng' }
]
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Báo cáo Đơn hàng vendor"
      description="Tổng hợp đơn hàng hoàn thành từ các vendor Marketplace (đúng tenant & dự án) — doanh thu và hoa hồng theo vendor, dự án, thời gian"
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
                class="w-64"
              />
            </ClientOnly>
          </UFormField>
          <UFormField label="Dự án">
            <SharedProjectSelect
              v-model="selectedProjectId"
              placeholder="Tất cả dự án"
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

      <!-- ═══ Thông tin đơn dùng hợp đồng không tính theo đơn ═══ -->
      <UAlert
        v-if="hasNonPerOrderContractOrders"
        color="info"
        variant="subtle"
        icon="i-lucide-info"
        title="Một số đơn dùng hợp đồng không tính theo đơn"
        :description="`Có ${summary?.warnings.non_per_order_orders_count} đơn thuộc hợp đồng chia doanh thu / thuê bao — hoa hồng = 0đ ở số liệu theo đơn bên dưới.`"
        class="mb-6"
      />

      <!-- ═══ KPI Cards ═══ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SharedSectionCard
          title="Tổng đơn hoàn thành"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-24 mb-2" />
            <USkeleton class="h-4 w-40" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ formatNumber(summary.orders_count) }}
            </p>
            <p class="text-xs text-slate-500 mt-2">
              {{ summary.vendors_count }} vendor · {{ summary.projects_count }} dự án
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Tổng doanh thu"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-2" />
            <USkeleton class="h-4 w-40" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums text-blue-600">
              {{ formatCurrency(summary.revenue_total) }}
            </p>
            <p class="text-xs text-slate-500 mt-2">
              Đơn hoàn thành trong kỳ
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Tổng hoa hồng"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-2" />
            <USkeleton class="h-4 w-40" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums text-emerald-600">
              {{ formatCurrency(summary.commission_total) }}
            </p>
            <p class="text-xs text-slate-500 mt-2">
              Theo hợp đồng hoa hồng vendor
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Hoa hồng TB / đơn"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-2" />
            <USkeleton class="h-4 w-40" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ formatCurrency(summary.average_commission_per_order) }}
            </p>
            <p class="text-xs text-slate-500 mt-2">
              Trung bình mỗi đơn hoàn thành
            </p>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ Biểu đồ ═══ -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <SharedSectionCard
          title="Doanh thu & hoa hồng theo vendor"
          compact
        >
          <template v-if="isLoading(byVendorStatus)">
            <USkeleton class="h-[320px] w-full" />
          </template>
          <template v-else>
            <SharedReportStackedColumnChart
              :categories="chartByVendor"
              :series="REVENUE_SERIES"
              :max-bars="12"
              value-suffix=" đ"
              empty-text="Chưa có đơn hoàn thành trong kỳ đã chọn"
            />
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Doanh thu & hoa hồng theo dự án"
          compact
        >
          <template v-if="isLoading(byProjectStatus)">
            <USkeleton class="h-[320px] w-full" />
          </template>
          <template v-else>
            <SharedReportStackedColumnChart
              :categories="chartByProject"
              :series="REVENUE_SERIES"
              :max-bars="12"
              value-suffix=" đ"
              empty-text="Chưa có đơn hoàn thành trong kỳ đã chọn"
            />
          </template>
        </SharedSectionCard>
      </div>

      <SharedSectionCard
        title="Doanh thu & hoa hồng theo ngày"
        compact
        class="mb-6"
      >
        <template v-if="isLoading(trendStatus)">
          <USkeleton class="h-[320px] w-full" />
        </template>
        <template v-else>
          <SharedReportLineChart
            :points="trendPoints"
            :series="TREND_LINE_SERIES"
            value-suffix=" đ"
            empty-text="Chưa có đơn hoàn thành trong kỳ đã chọn"
          />
        </template>
      </SharedSectionCard>

      <!-- ═══ Bảng theo vendor ═══ -->
      <SharedSectionCard
        title="Chi tiết theo vendor"
        compact
        class="mb-6"
      >
        <template v-if="isLoading(byVendorStatus)">
          <USkeleton class="h-8 w-full mb-2" />
          <USkeleton class="h-8 w-full mb-2" />
          <USkeleton class="h-8 w-full" />
        </template>
        <UTable
          v-else
          :data="byVendorRows"
          :columns="vendorColumns"
          :empty-state="{ icon: 'i-lucide-inbox', label: 'Không có dữ liệu' }"
        >
          <template #orders_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.orders_count) }}</span>
          </template>
          <template #revenue_total-cell="{ row }">
            <span class="tabular-nums font-medium">{{ formatCurrency(row.original.revenue_total) }}</span>
          </template>
          <template #commission_total-cell="{ row }">
            <span class="tabular-nums text-emerald-600">{{ formatCurrency(row.original.commission_total) }}</span>
          </template>
        </UTable>
      </SharedSectionCard>

      <!-- ═══ Bảng theo dự án ═══ -->
      <SharedSectionCard
        title="Chi tiết theo dự án"
        compact
        class="mb-6"
      >
        <template v-if="isLoading(byProjectStatus)">
          <USkeleton class="h-8 w-full mb-2" />
          <USkeleton class="h-8 w-full mb-2" />
          <USkeleton class="h-8 w-full" />
        </template>
        <UTable
          v-else
          :data="byProjectRows"
          :columns="projectColumns"
          :empty-state="{ icon: 'i-lucide-inbox', label: 'Không có dữ liệu' }"
        >
          <template #orders_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.orders_count) }}</span>
          </template>
          <template #revenue_total-cell="{ row }">
            <span class="tabular-nums font-medium">{{ formatCurrency(row.original.revenue_total) }}</span>
          </template>
          <template #commission_total-cell="{ row }">
            <span class="tabular-nums text-emerald-600">{{ formatCurrency(row.original.commission_total) }}</span>
          </template>
        </UTable>
      </SharedSectionCard>
    </template>
  </div>
</template>
