<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { SlaByProjectResource, SlaByStaffResource, SlaByTicketResource } from '~/composables/api/useSlaReports'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Báo cáo SLA' })

// ─── Project filter ───

const selectedProjectId = ref<number | undefined>(undefined)
const ticketPage = ref(1)

const { isInitFromUrl } = useUrlFilters({
  project_id: { ref: selectedProjectId, type: 'number' },
  page: { ref: ticketPage, type: 'number', defaultValue: 1 }
})

const filterProjectId = computed(() => selectedProjectId.value || undefined)
const hasFilters = computed(() => selectedProjectId.value != null)

// ─── Data fetching ───

const { data: summaryData, status: summaryStatus, error: summaryError } = useSlaSummary()
const summary = computed(() => summaryData.value?.data ?? null)

const {
  data: trendData,
  status: trendStatus,
  error: trendError,
  refresh: refreshTrend
} = useSlaTrend()
const trend = computed(() => trendData.value?.data ?? [])

const tabParams = computed(() => ({
  project_id: filterProjectId.value
}))

const {
  data: byProjectData,
  status: byProjectStatus,
  error: byProjectError,
  refresh: refreshByProject
} = useSlaByProject(tabParams)
const byProjectRows = computed<SlaByProjectResource[]>(() => byProjectData.value?.data ?? [])

const {
  data: byStaffData,
  status: byStaffStatus,
  error: byStaffError,
  refresh: refreshByStaff
} = useSlaByStaff(tabParams)
const byStaffRows = computed<SlaByStaffResource[]>(() => byStaffData.value?.data ?? [])

watch(selectedProjectId, () => {
  if (!isInitFromUrl.value) {
    ticketPage.value = 1
  }
})

const ticketParams = computed(() => ({
  project_id: filterProjectId.value,
  per_page: DEFAULT_PER_PAGE,
  page: ticketPage.value
}))

const {
  data: byTicketData,
  status: byTicketStatus,
  error: byTicketError,
  refresh: refreshByTicket
} = useSlaByTicket(ticketParams)
const byTicketRows = computed<SlaByTicketResource[]>(() => byTicketData.value?.data ?? [])
const ticketMeta = computed(() => byTicketData.value?.meta ?? null)

function clearFilters() {
  selectedProjectId.value = undefined
  ticketPage.value = 1
}

// ─── Active tab ───

const activeTab = ref('project')
const tabs = [
  { label: 'Theo dự án', value: 'project', icon: 'i-lucide-building-2' },
  { label: 'Theo nhân viên', value: 'staff', icon: 'i-lucide-users' },
  { label: 'Theo ticket', value: 'ticket', icon: 'i-lucide-ticket' }
]

// ─── SVG Trend Chart ───

const chartArea = { left: 48, right: 604, top: 36, bottom: 200 }

const slaTargetPercent = computed(() => summary.value?.sla_target_percent ?? 90)

const yScale = computed(() => {
  const rates = trend.value.map(m => m.on_time_rate)
  const lo = Math.min(...rates, slaTargetPercent.value)
  const hi = Math.max(...rates, slaTargetPercent.value)
  const pad = Math.max(0.5, (hi - lo) * 0.2)
  const min = Math.max(0, Math.floor((lo - pad) * 10) / 10)
  const max = Math.min(100, Math.ceil((hi + pad) * 10) / 10)
  return { min, max }
})

const yMidLabel = computed(() => {
  const { min, max } = yScale.value
  return Math.round(((min + max) / 2) * 10) / 10
})

function rateToY(rate: number): number {
  const { min, max } = yScale.value
  const span = max - min || 1
  const t = Math.min(1, Math.max(0, (rate - min) / span))
  return chartArea.bottom - t * (chartArea.bottom - chartArea.top)
}

const linePoints = computed(() => {
  const pts = trend.value
  const n = pts.length
  if (n === 0) return ''
  const w = (chartArea.right - chartArea.left) / n
  return pts
    .map((m, i) => {
      const cx = chartArea.left + w * i + w / 2
      return `${cx},${rateToY(m.on_time_rate)}`
    })
    .join(' ')
})

const dots = computed(() => {
  const pts = trend.value
  const n = pts.length
  if (n === 0) return []
  const w = (chartArea.right - chartArea.left) / n
  return pts.map((m, i) => ({
    x: chartArea.left + w * i + w / 2,
    y: rateToY(m.on_time_rate),
    month: m.month,
    rate: m.on_time_rate
  }))
})

const targetLineY = computed(() => {
  const { min, max } = yScale.value
  const t = (slaTargetPercent.value - min) / (max - min || 1)
  if (t < 0 || t > 1) return null
  return chartArea.bottom - t * (chartArea.bottom - chartArea.top)
})

// ─── Table columns ───

const projectColumns: TableColumn<SlaByProjectResource>[] = [
  { accessorKey: 'project_name', header: 'Dự án' },
  { accessorKey: 'tickets_closed', header: 'Đã đóng' },
  {
    accessorKey: 'on_time_rate',
    header: 'Đúng hạn %',
    cell: ({ row }: { row: { original: SlaByProjectResource } }) => `${row.original.on_time_rate}%`
  },
  { accessorKey: 'breached', header: 'Vi phạm' },
  {
    accessorKey: 'avg_hours',
    header: 'TB (giờ)',
    cell: ({ row }: { row: { original: SlaByProjectResource } }) => `${row.original.avg_hours} h`
  }
]

const staffColumns: TableColumn<SlaByStaffResource>[] = [
  { accessorKey: 'project_name', header: 'Dự án' },
  { accessorKey: 'staff_name', header: 'Nhân viên' },
  { accessorKey: 'tickets_handled', header: 'Ticket xử lý' },
  {
    accessorKey: 'on_time_rate',
    header: 'Đúng hạn %',
    cell: ({ row }: { row: { original: SlaByStaffResource } }) => `${row.original.on_time_rate}%`
  },
  { accessorKey: 'breached', header: 'Vi phạm' },
  {
    accessorKey: 'avg_resolution_hours',
    header: 'TB (giờ)',
    cell: ({ row }: { row: { original: SlaByStaffResource } }) => `${row.original.avg_resolution_hours} h`
  }
]

const ticketColumns: TableColumn<SlaByTicketResource>[] = [
  {
    accessorKey: 'ticket_code',
    header: 'Mã ticket',
    cell: ({ row }: { row: { original: SlaByTicketResource } }) =>
      h('span', { class: 'font-mono text-sm' }, row.original.ticket_code ?? '—')
  },
  { accessorKey: 'project_name', header: 'Dự án' },
  {
    accessorKey: 'categories',
    header: 'Danh mục',
    cell: ({ row }: { row: { original: SlaByTicketResource } }) => {
      if (!row.original.categories || row.original.categories.length === 0) return '—'
      return h('div', { class: 'flex flex-wrap gap-1' },
        row.original.categories.map(category =>
          h(resolveComponent('UBadge'), { label: category, color: 'neutral', variant: 'subtle', size: 'sm' })
        )
      )
    }
  },
  { accessorKey: 'phase', header: 'Giai đoạn SLA' },
  {
    accessorKey: 'sla_target_hours',
    header: 'Mục tiêu (h)',
    cell: ({ row }: { row: { original: SlaByTicketResource } }) =>
      row.original.sla_target_hours != null ? `${row.original.sla_target_hours} h` : '—'
  },
  {
    accessorKey: 'actual_hours',
    header: 'Thực tế (h)',
    cell: ({ row }: { row: { original: SlaByTicketResource } }) =>
      row.original.actual_hours != null ? `${row.original.actual_hours} h` : '—'
  },
  {
    accessorKey: 'result',
    header: 'Kết quả',
    cell: ({ row }: { row: { original: SlaByTicketResource } }) => {
      const isOnTime = row.original.result.value === 'on_time'
      return h(
        resolveComponent('UBadge'),
        { color: isOnTime ? 'success' : 'error', variant: 'subtle', size: 'sm' },
        () => row.original.result.label
      )
    }
  }
]

// ─── Helpers ───

const isLoading = (status: string) => status === 'pending'
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Báo cáo SLA"
      description="Hiệu suất xử lý ticket theo cam kết SLA"
    />

    <!-- Error state -->
    <SharedCrudPageError
      v-if="summaryError"
      :error="summaryError"
    />

    <template v-else>
      <!-- ═══ KPI Cards ═══ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SharedSectionCard
          title="Tỷ lệ đúng hạn"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-20 mb-1" />
            <USkeleton class="h-4 w-28" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold text-emerald-600 tabular-nums">
              {{ summary.on_time_rate }}%
            </p>
            <span class="text-xs text-slate-500">{{ summary.period_label }}</span>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Ticket vi phạm"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-16 mb-1" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold text-red-600 tabular-nums">
              {{ summary.breached_count }}
            </p>
            <span class="text-xs text-slate-500">{{ summary.period_label }}</span>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Thời gian xử lý (median)"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-20 mb-1" />
            <USkeleton class="h-4 w-28" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ summary.median_resolution_hours }} h
            </p>
            <span class="text-xs text-slate-500">{{ summary.period_label }}</span>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Tỷ lệ mở lại"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-20 mb-1" />
            <USkeleton class="h-4 w-28" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ summary.reopened_rate }}%
            </p>
            <span class="text-xs text-slate-500">{{ summary.period_label }}</span>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ Project Filter ═══ -->
      <SharedSectionCard
        title="Lọc bảng chi tiết"
        compact
        class="mb-6"
      >
        <div class="flex flex-wrap items-end gap-3">
          <UFormField
            label="Dự án"
            class="max-w-xs"
          >
            <SharedProjectSelect
              v-model="selectedProjectId"
              placeholder="Tất cả dự án"
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
        <p class="text-xs text-slate-500 mt-2">
          Áp dụng cho các tab <strong>Theo dự án</strong>, <strong>Theo nhân viên</strong>, <strong>Theo ticket</strong> bên dưới.
        </p>
      </SharedSectionCard>

      <!-- ═══ Trend Chart ═══ -->
      <SharedSectionCard
        title="Xu hướng SLA theo tháng"
        compact
        class="mb-6"
      >
        <template #header-actions>
          <div class="flex flex-wrap gap-4 text-xs text-slate-600">
            <span class="flex items-center gap-1.5">
              <span class="inline-block w-5 h-0.5 bg-emerald-500 rounded-full" />
              Đúng hạn %
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block w-5 h-0 border-t-2 border-dashed border-amber-500 opacity-80" />
              Mục tiêu {{ slaTargetPercent }}%
            </span>
          </div>
        </template>

        <SharedCrudTableWrapper
          :status="trendStatus"
          :error="trendError"
          :data="trendData"
          :refresh="refreshTrend"
        >
          <template v-if="trend.length > 0">
            <div class="w-full overflow-x-auto">
              <svg
                class="min-w-[520px] w-full h-[260px] text-slate-400"
                viewBox="0 0 640 260"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Biểu đồ xu hướng tỷ lệ đúng hạn SLA theo tháng"
              >
                <!-- Grid lines -->
                <line
                  x1="48"
                  y1="200"
                  x2="604"
                  y2="200"
                  stroke="currentColor"
                  stroke-opacity="0.22"
                />
                <line
                  x1="48"
                  y1="140"
                  x2="604"
                  y2="140"
                  stroke="currentColor"
                  stroke-opacity="0.08"
                />
                <line
                  x1="48"
                  y1="80"
                  x2="604"
                  y2="80"
                  stroke="currentColor"
                  stroke-opacity="0.08"
                />

                <!-- SLA target dashed line -->
                <line
                  v-if="targetLineY !== null"
                  x1="48"
                  :y1="targetLineY"
                  x2="604"
                  :y2="targetLineY"
                  stroke="#f59e0b"
                  stroke-width="1.5"
                  stroke-dasharray="6 5"
                  stroke-opacity="0.85"
                />

                <!-- Trend line -->
                <polyline
                  :points="linePoints"
                  fill="none"
                  stroke="#10b981"
                  stroke-width="2.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <!-- Data points -->
                <g
                  v-for="(pt, i) in dots"
                  :key="'pt-' + i"
                >
                  <circle
                    :cx="pt.x"
                    :cy="pt.y"
                    r="4.5"
                    class="fill-emerald-500"
                    stroke="white"
                    stroke-width="1.5"
                  />
                  <text
                    :x="pt.x"
                    :y="pt.y - 12"
                    text-anchor="middle"
                    class="fill-slate-700 text-[10px] font-semibold"
                  >
                    {{ pt.rate }}%
                  </text>
                  <text
                    :x="pt.x"
                    :y="222"
                    text-anchor="middle"
                    class="fill-slate-500 text-[11px]"
                  >
                    {{ pt.month }}
                  </text>
                </g>

                <!-- Y axis labels -->
                <text
                  x="6"
                  y="84"
                  class="fill-slate-500 text-[10px]"
                >
                  {{ yScale.max }}%
                </text>
                <text
                  x="6"
                  y="144"
                  class="fill-slate-500 text-[10px]"
                >
                  {{ yMidLabel }}%
                </text>
                <text
                  x="6"
                  y="204"
                  class="fill-slate-500 text-[10px]"
                >
                  {{ yScale.min }}%
                </text>
              </svg>
            </div>
          </template>
          <template v-else>
            <p class="text-sm text-slate-500 py-8 text-center">
              Chưa có dữ liệu xu hướng
            </p>
          </template>
        </SharedCrudTableWrapper>
      </SharedSectionCard>

      <!-- ═══ Detail Tabs ═══ -->
      <UTabs
        v-model="activeTab"
        :items="tabs"
        class="mb-6"
      />

      <!-- Tab: By Project -->
      <template v-if="activeTab === 'project'">
        <SharedSectionCard
          title="Theo dự án"
          compact
        >
          <template #header-actions>
            <NuxtLink
              to="/pmc/og-tickets?sla=breached"
              class="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Mở SLA / Vi phạm (chi tiết ticket)
            </NuxtLink>
          </template>
          <SharedCrudTableWrapper
            :status="byProjectStatus"
            :error="byProjectError"
            :data="byProjectData"
            :refresh="refreshByProject"
          >
            <UTable
              :data="byProjectRows"
              :columns="projectColumns"
            />
          </SharedCrudTableWrapper>
        </SharedSectionCard>
      </template>

      <!-- Tab: By Staff -->
      <template v-if="activeTab === 'staff'">
        <SharedSectionCard
          title="Theo nhân viên"
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
            />
          </SharedCrudTableWrapper>
        </SharedSectionCard>
      </template>

      <!-- Tab: By Ticket -->
      <template v-if="activeTab === 'ticket'">
        <SharedSectionCard
          title="Theo ticket"
          compact
        >
          <SharedCrudTableWrapper
            :status="byTicketStatus"
            :error="byTicketError"
            :data="byTicketData"
            :refresh="refreshByTicket"
          >
            <UTable
              :data="byTicketRows"
              :columns="ticketColumns"
            />
            <div
              v-if="ticketMeta && ticketMeta.last_page > 1"
              class="flex items-center justify-between pt-4 border-t border-slate-100 mt-4"
            >
              <p class="text-sm text-slate-500">
                Hiển thị {{ byTicketRows.length }} / {{ ticketMeta.total }} dòng SLA
              </p>
              <UPagination
                v-model:page="ticketPage"
                :total="ticketMeta.total"
                :items-per-page="ticketMeta.per_page ?? DEFAULT_PER_PAGE"
                :max="5"
                size="sm"
              />
            </div>
          </SharedCrudTableWrapper>
        </SharedSectionCard>
      </template>
    </template>
  </div>
</template>
