<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type {
  RevenueTicketByCategoryResource,
  RevenueTicketByStaffResource,
  RevenueTicketDailyResource,
  RevenueTicketDetailResource
} from '~/composables/api/useRevenueTicketReports'
import type { DonutSlice } from '~/components/shared/report/DonutChart.vue'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Báo cáo Doanh thu (ticket)' })

// ─── Filters ───

const {
  dateRange,
  dateFromRef,
  dateToRef,
  formatDateRange,
  syncRangeFromRefs,
  clearRange
} = useReportDateRange({ withDefault: false })
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

const { data: summaryData, status: summaryStatus, error: summaryError } = useRevenueTicketSummary(filterParams)
const summary = computed(() => summaryData.value?.data ?? null)

const {
  data: byCategoryData,
  status: byCategoryStatus,
  error: byCategoryError,
  refresh: refreshByCategory
} = useRevenueTicketByCategory(filterParams)
const byCategoryRows = computed<RevenueTicketByCategoryResource[]>(() => byCategoryData.value?.data ?? [])

const {
  data: byStaffData,
  status: byStaffStatus,
  error: byStaffError,
  refresh: refreshByStaff
} = useRevenueTicketByStaff(filterParams)
const byStaffRows = computed<RevenueTicketByStaffResource[]>(() => byStaffData.value?.data ?? [])

const {
  data: dailyData,
  status: dailyStatus,
  error: dailyError,
  refresh: refreshDaily
} = useRevenueTicketDaily(filterParams)
const dailyRows = computed<RevenueTicketDailyResource[]>(() => dailyData.value?.data ?? [])

const {
  data: detailsData,
  status: detailsStatus,
  error: detailsError,
  refresh: refreshDetails
} = useRevenueTicketDetails(filterParams)
const detailRows = computed<RevenueTicketDetailResource[]>(() => detailsData.value?.data ?? [])

// ─── Display helpers ───

const isLoading = (status: string) => status === 'pending'

const categorySlices = computed<DonutSlice[]>(() =>
  byCategoryRows.value.map(row => ({
    label: row.category_label,
    value: row.ticket_count
  }))
)

const staffSlices = computed<DonutSlice[]>(() =>
  byStaffRows.value.map(row => ({
    label: row.staff_name,
    value: row.ticket_count
  }))
)

// ─── Line chart: daily × project ───

interface LinePoint {
  x: number
  y: number
  value: number
  tooltip: string
}

interface LineSeries {
  projectKey: string
  label: string
  color: string
  polyline: string
  points: LinePoint[]
}

const LINE_COLORS = [
  '#16a34a',
  '#2563eb',
  '#d97706',
  '#7c3aed',
  '#0d9488',
  '#dc2626',
  '#64748b'
] as const

function dateShort(d: string): string {
  const [, m, day] = d.split('-')
  return m && day ? `${day}/${m}` : d
}

const ticketLineChart = computed(() => {
  const rows = dailyRows.value
  const dates = [...new Set(rows.map(r => r.date))].sort()

  if (dates.length === 0) {
    return {
      dates: [] as string[],
      series: [] as LineSeries[],
      maxY: 0,
      xAt: (_i: number) => 330
    }
  }

  const projectKeyOf = (row: RevenueTicketDailyResource) =>
    row.project_id !== null ? String(row.project_id) : 'null'

  const keyToName = new Map<string, string>()
  for (const row of rows) {
    keyToName.set(projectKeyOf(row), row.project_name)
  }

  const projectKeys = [...keyToName.keys()].sort()

  const byDateProj = new Map<string, Map<string, { count: number, revenue: string }>>()
  for (const row of rows) {
    const m = byDateProj.get(row.date) ?? new Map()
    m.set(projectKeyOf(row), { count: row.ticket_count, revenue: row.revenue })
    byDateProj.set(row.date, m)
  }

  let maxY = 1
  for (const d of dates) {
    const m = byDateProj.get(d)!
    for (const key of projectKeys) {
      const v = m.get(key)?.count ?? 0
      if (v > maxY) maxY = v
    }
  }

  const inner = { left: 52, right: 608, top: 28, bottom: 200 }
  const w = inner.right - inner.left
  const h = inner.bottom - inner.top
  const n = dates.length

  const xAt = (i: number) => inner.left + (n <= 1 ? w / 2 : (i / (n - 1)) * w)
  const yAt = (v: number) => inner.bottom - (v / maxY) * h * 0.92

  const series: LineSeries[] = projectKeys.map((key, idx) => {
    const points: LinePoint[] = dates.map((d, i) => {
      const cell = byDateProj.get(d)?.get(key)
      const count = cell?.count ?? 0
      const revenue = cell ? formatCurrency(cell.revenue) : '0 đ'
      return {
        x: xAt(i),
        y: yAt(count),
        value: count,
        tooltip: `${keyToName.get(key) ?? key} · ${dateShort(d)}: ${count} ticket · ${revenue}`
      }
    })
    return {
      projectKey: key,
      label: keyToName.get(key) ?? 'Chưa gán dự án',
      color: LINE_COLORS[idx % LINE_COLORS.length]!,
      polyline: points.map(p => `${p.x},${p.y}`).join(' '),
      points
    }
  })

  return { dates, series, maxY, xAt }
})

// ─── Tabs ───

const activeTab = ref('category')
const tabs = [
  { label: 'Theo category', value: 'category', icon: 'i-lucide-layers' },
  { label: 'Theo nhân viên', value: 'staff', icon: 'i-lucide-users' }
]

// ─── Table columns ───

const categoryColumns: TableColumn<RevenueTicketByCategoryResource>[] = [
  { accessorKey: 'category_label', header: 'Category ticket' },
  {
    accessorKey: 'revenue',
    header: 'Doanh thu',
    cell: ({ row }: { row: { original: RevenueTicketByCategoryResource } }) =>
      h('span', { class: 'tabular-nums' }, formatCurrency(row.original.revenue))
  },
  {
    accessorKey: 'ticket_count',
    header: 'Số ticket',
    cell: ({ row }: { row: { original: RevenueTicketByCategoryResource } }) =>
      h('span', { class: 'tabular-nums' }, row.original.ticket_count.toLocaleString('vi-VN'))
  },
  {
    accessorKey: 'ticket_share_percent',
    header: 'Tỷ trọng',
    cell: ({ row }: { row: { original: RevenueTicketByCategoryResource } }) =>
      h('span', { class: 'tabular-nums text-slate-500' }, `${row.original.ticket_share_percent}%`)
  }
]

const staffColumns: TableColumn<RevenueTicketByStaffResource>[] = [
  { accessorKey: 'staff_name', header: 'Nhân viên' },
  {
    accessorKey: 'revenue',
    header: 'Doanh thu',
    cell: ({ row }: { row: { original: RevenueTicketByStaffResource } }) =>
      h('span', { class: 'tabular-nums' }, formatCurrency(row.original.revenue))
  },
  {
    accessorKey: 'ticket_count',
    header: 'Số ticket',
    cell: ({ row }: { row: { original: RevenueTicketByStaffResource } }) =>
      h('span', { class: 'tabular-nums' }, row.original.ticket_count.toLocaleString('vi-VN'))
  },
  {
    accessorKey: 'ticket_share_percent',
    header: 'Tỷ trọng',
    cell: ({ row }: { row: { original: RevenueTicketByStaffResource } }) =>
      h('span', { class: 'tabular-nums text-slate-500' }, `${row.original.ticket_share_percent}%`)
  }
]

const detailColumns: TableColumn<RevenueTicketDetailResource>[] = [
  {
    accessorKey: 'date',
    header: 'Ngày',
    cell: ({ row }: { row: { original: RevenueTicketDetailResource } }) => formatDate(row.original.date)
  },
  {
    accessorKey: 'project_name',
    header: 'Dự án'
  },
  {
    accessorKey: 'category_label',
    header: 'Category'
  },
  {
    accessorKey: 'staff_name',
    header: 'NV'
  },
  {
    accessorKey: 'ticket_count',
    header: 'Ticket',
    cell: ({ row }: { row: { original: RevenueTicketDetailResource } }) =>
      h('span', { class: 'tabular-nums' }, row.original.ticket_count.toLocaleString('vi-VN'))
  },
  {
    accessorKey: 'revenue',
    header: 'Doanh thu',
    cell: ({ row }: { row: { original: RevenueTicketDetailResource } }) =>
      h('span', { class: 'tabular-nums font-medium' }, formatCurrency(row.original.revenue))
  }
]
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Báo cáo Doanh thu (ticket)"
      description="Doanh thu gắn luồng ticket → đơn hàng, nhìn theo category và nhân viên xử lý"
    />

    <!-- Error state (summary failed) -->
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
                placeholder="Toàn thời gian"
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
        <p class="text-xs text-slate-500 mt-3">
          Doanh thu gắn luồng <strong>ticket → đơn hàng → công nợ</strong>. Chỉ tính ticket có order hoàn thành và công nợ đã thu.
          Để trống ngày = toàn thời gian.
        </p>
      </SharedSectionCard>

      <!-- ═══ KPI Cards ═══ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SharedSectionCard
          title="Tổng doanh thu"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-1" />
            <USkeleton class="h-4 w-24" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold text-emerald-600 tabular-nums">
              {{ formatCurrency(summary.total_revenue) }}
            </p>
            <span class="text-xs text-slate-500">{{ summary.period_label }}</span>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Số ticket"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-16 mb-1" />
            <USkeleton class="h-4 w-24" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ summary.ticket_count.toLocaleString('vi-VN') }}
            </p>
            <span class="text-xs text-slate-500">Ticket có phát sinh doanh thu</span>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Số dòng ghi nhận"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-16 mb-1" />
            <USkeleton class="h-4 w-28" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ summary.record_count.toLocaleString('vi-VN') }}
            </p>
            <span class="text-xs text-slate-500">Dòng aggregate trong bảng chi tiết</span>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Category khác nhau"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-16 mb-1" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ summary.category_count.toLocaleString('vi-VN') }}
            </p>
            <span class="text-xs text-slate-500">Số category ticket trong kỳ</span>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ 2 Donut Charts ═══ -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SharedSectionCard
          title="Tỷ suất theo category ticket"
          compact
        >
          <SharedCrudTableWrapper
            :status="byCategoryStatus"
            :error="byCategoryError"
            :data="byCategoryData"
            :refresh="refreshByCategory"
          >
            <SharedReportDonutChart
              v-if="categorySlices.length"
              title="Cơ cấu ticket theo category"
              :slices="categorySlices"
              center-label="Tổng ticket"
              value-suffix=" ticket"
            />
            <UEmpty
              v-else
              title="Chưa có dữ liệu"
              description="Đổi bộ lọc hoặc khoảng ngày để xem biểu đồ."
              icon="i-lucide-pie-chart"
            />
          </SharedCrudTableWrapper>
        </SharedSectionCard>

        <SharedSectionCard
          title="Tỷ suất theo nhân viên xử lý"
          compact
        >
          <SharedCrudTableWrapper
            :status="byStaffStatus"
            :error="byStaffError"
            :data="byStaffData"
            :refresh="refreshByStaff"
          >
            <SharedReportDonutChart
              v-if="staffSlices.length"
              title="Cơ cấu ticket theo nhân viên"
              :slices="staffSlices"
              center-label="Tổng ticket"
              value-suffix=" ticket"
            />
            <UEmpty
              v-else
              title="Chưa có dữ liệu"
              description="Đổi bộ lọc hoặc khoảng ngày để xem biểu đồ."
              icon="i-lucide-pie-chart"
            />
          </SharedCrudTableWrapper>
        </SharedSectionCard>
      </div>

      <!-- ═══ Line chart: daily × project ═══ -->
      <SharedSectionCard
        title="Số ticket theo ngày và theo dự án"
        compact
        class="mb-6"
      >
        <template #header-actions>
          <div class="flex flex-wrap gap-3 text-xs">
            <span
              v-for="s in ticketLineChart.series"
              :key="s.projectKey"
              class="flex items-center gap-1.5"
            >
              <span
                class="inline-block w-4 h-0.5 rounded-full shrink-0"
                :style="{ backgroundColor: s.color }"
              />
              <span class="text-slate-700">{{ s.label }}</span>
            </span>
          </div>
        </template>

        <SharedCrudTableWrapper
          :status="dailyStatus"
          :error="dailyError"
          :data="dailyData"
          :refresh="refreshDaily"
        >
          <div
            v-if="ticketLineChart.dates.length"
            class="w-full overflow-x-auto"
          >
            <svg
              class="min-w-[520px] w-full h-[260px] text-slate-400"
              viewBox="0 0 640 260"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Biểu đồ đường số ticket theo dự án theo ngày"
            >
              <line
                x1="52"
                y1="200"
                x2="608"
                y2="200"
                stroke="currentColor"
                stroke-opacity="0.3"
              />
              <line
                x1="52"
                y1="120"
                x2="608"
                y2="120"
                stroke="currentColor"
                stroke-opacity="0.1"
              />
              <line
                x1="52"
                y1="40"
                x2="608"
                y2="40"
                stroke="currentColor"
                stroke-opacity="0.1"
              />
              <g
                v-for="(s, si) in ticketLineChart.series"
                :key="'line-' + s.projectKey"
              >
                <polyline
                  :points="s.polyline"
                  fill="none"
                  :stroke="s.color"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <g
                  v-for="(pt, pi) in s.points"
                  :key="'pt-' + si + '-' + pi"
                >
                  <title>{{ pt.tooltip }}</title>
                  <circle
                    :cx="pt.x"
                    :cy="pt.y"
                    r="4"
                    :fill="s.color"
                    class="hover:opacity-90"
                  />
                </g>
              </g>
              <g
                v-for="(d, i) in ticketLineChart.dates"
                :key="'dx-' + i"
              >
                <text
                  :x="ticketLineChart.xAt(i)"
                  y="232"
                  text-anchor="middle"
                  class="fill-slate-500 text-[10px]"
                >
                  {{ dateShort(d) }}
                </text>
              </g>
              <text
                x="8"
                y="44"
                class="fill-slate-500 text-[10px]"
              >
                {{ ticketLineChart.maxY }}
              </text>
              <text
                x="8"
                y="200"
                class="fill-slate-500 text-[10px]"
              >
                0
              </text>
            </svg>
          </div>
          <UEmpty
            v-else
            title="Chưa có điểm dữ liệu theo ngày"
            description="Chọn khoảng ngày hoặc dự án khác — hoặc không có ticket hoàn thành trong khoảng đã chọn."
            icon="i-lucide-line-chart"
          />
        </SharedCrudTableWrapper>
      </SharedSectionCard>

      <!-- ═══ Tabs: by-category / by-staff ═══ -->
      <UTabs
        v-model="activeTab"
        :items="tabs"
        class="w-full mb-6"
        value-key="value"
      >
        <template #content="{ item }">
          <div class="pt-4">
            <SharedSectionCard
              v-if="item.value === 'category'"
              title="Doanh thu theo category ticket"
              compact
            >
              <SharedCrudTableWrapper
                :status="byCategoryStatus"
                :error="byCategoryError"
                :data="byCategoryData"
                :refresh="refreshByCategory"
              >
                <UTable
                  :data="byCategoryRows"
                  :columns="categoryColumns"
                  :empty-state="{ icon: 'i-lucide-inbox', label: 'Không có dữ liệu' }"
                />
              </SharedCrudTableWrapper>
            </SharedSectionCard>

            <SharedSectionCard
              v-if="item.value === 'staff'"
              title="Doanh thu theo nhân viên xử lý"
              compact
            >
              <SharedCrudTableWrapper
                :status="byStaffStatus"
                :error="byStaffError"
                :data="byStaffData"
                :refresh="refreshByStaff"
              >
                <UTable
                  :data="byStaffRows"
                  :columns="staffColumns"
                  :empty-state="{ icon: 'i-lucide-inbox', label: 'Không có dữ liệu' }"
                />
              </SharedCrudTableWrapper>
            </SharedSectionCard>
          </div>
        </template>
      </UTabs>

      <!-- ═══ Detail table ═══ -->
      <SharedSectionCard
        title="Chi tiết dòng (đã lọc)"
        compact
        class="mb-6"
      >
        <SharedCrudTableWrapper
          :status="detailsStatus"
          :error="detailsError"
          :data="detailsData"
          :refresh="refreshDetails"
        >
          <UTable
            :data="detailRows"
            :columns="detailColumns"
            :empty-state="{ icon: 'i-lucide-inbox', label: 'Không có dữ liệu' }"
          />
          <p class="text-xs text-slate-500 mt-3">
            Đây là bảng tổng hợp theo <strong>ngày × dự án × category × nhân viên</strong>, không phải từng ticket raw.
          </p>
        </SharedCrudTableWrapper>
      </SharedSectionCard>
    </template>
  </div>
</template>
