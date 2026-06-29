<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type { CashFlowSummary, CashFlowDaily, CashFlowTransaction } from '~/composables/api/useCashFlowReports'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Báo cáo Dòng tiền' })

// ─── Filters (URL-synced via useUrlFilters) ───
const {
  dateRange,
  dateFromRef,
  dateToRef,
  formatDateRange,
  syncRangeFromRefs
} = useReportDateRange()
const selectedProjectId = ref<number | undefined>(undefined)

useUrlFilters({
  date_from: { ref: dateFromRef, type: 'string' },
  date_to: { ref: dateToRef, type: 'string' },
  project_id: { ref: selectedProjectId, type: 'number' }
})

syncRangeFromRefs()

const isProjectFiltered = computed(() => selectedProjectId.value != null)

// ─── Shared filter params ───
const filterParams = computed(() => ({
  date_from: dateFromRef.value || undefined,
  date_to: dateToRef.value || undefined,
  project_id: selectedProjectId.value || undefined
}))

// ─── Data fetching ───
const { data: summaryData, status: summaryStatus, error: summaryError } = useCashFlowSummary(filterParams)
const summary = computed<CashFlowSummary | null>(() => summaryData.value?.data ?? null)

const {
  data: dailyData,
  status: dailyStatus,
  error: dailyError,
  refresh: refreshDaily
} = useCashFlowDaily(filterParams)
const dailyRows = computed<CashFlowDaily[]>(() => dailyData.value?.data ?? [])

const txPage = ref(1)
watch(filterParams, () => {
  txPage.value = 1
})

const txParams = computed(() => ({
  ...filterParams.value,
  per_page: DEFAULT_PER_PAGE,
  page: txPage.value
}))
const {
  data: txData,
  status: txStatus,
  error: txError,
  refresh: refreshTransactions
} = useCashFlowTransactions(txParams)
const txRows = computed<CashFlowTransaction[]>(() => txData.value?.data ?? [])
const txMeta = computed(() => txData.value?.meta ?? null)

// ─── Category breakdown rows ───
interface CategoryRow {
  key: string
  category: string
  direction: 'inflow' | 'outflow'
  amount: string
  count: number
}

const categoryRows = computed<CategoryRow[]>(() => {
  if (!summary.value) return []
  const inflow = summary.value.inflow_by_category.map((row, i) => ({
    key: `in-${i}`,
    category: row.category.label,
    direction: 'inflow' as const,
    amount: row.amount,
    count: row.count
  }))
  const outflow = summary.value.outflow_by_category.map((row, i) => ({
    key: `out-${i}`,
    category: row.category.label,
    direction: 'outflow' as const,
    amount: row.amount,
    count: row.count
  }))
  return [...inflow, ...outflow]
})

// ─── Value helpers ───
function isNegative(val: string): boolean {
  return parseFloat(val) < 0
}

function formatKpi(val: string): string {
  return formatCurrency(val)
}

function netClass(val: string): string {
  return isNegative(val) ? 'text-red-600 font-semibold tabular-nums' : 'text-emerald-600 font-semibold tabular-nums'
}

// ─── Table columns ───
const categoryColumns: TableColumn<CategoryRow>[] = [
  { accessorKey: 'category', header: 'Danh mục' },
  {
    accessorKey: 'direction',
    header: 'Chiều',
    cell: ({ row }: { row: { original: CategoryRow } }) =>
      h(
        resolveComponent('UBadge'),
        {
          color: row.original.direction === 'inflow' ? 'success' : 'error',
          variant: 'subtle',
          size: 'sm'
        },
        () => row.original.direction === 'inflow' ? 'Tiền vào' : 'Tiền ra'
      )
  },
  {
    accessorKey: 'amount',
    header: 'Số tiền',
    cell: ({ row }: { row: { original: CategoryRow } }) =>
      h('span', { class: 'tabular-nums' }, formatCurrency(row.original.amount))
  },
  { accessorKey: 'count', header: 'Số GD' }
]

const dailyColumns: TableColumn<CashFlowDaily>[] = [
  {
    accessorKey: 'date',
    header: 'Ngày',
    cell: ({ row }: { row: { original: CashFlowDaily } }) => formatDate(row.original.date)
  },
  {
    accessorKey: 'total_inflow',
    header: 'Tiền vào',
    cell: ({ row }: { row: { original: CashFlowDaily } }) =>
      h('span', { class: 'text-emerald-600 tabular-nums' }, formatCurrency(row.original.total_inflow))
  },
  {
    accessorKey: 'total_outflow',
    header: 'Tiền ra',
    cell: ({ row }: { row: { original: CashFlowDaily } }) =>
      h('span', { class: 'text-red-600 tabular-nums' }, formatCurrency(row.original.total_outflow))
  },
  {
    accessorKey: 'net',
    header: 'Ròng',
    cell: ({ row }: { row: { original: CashFlowDaily } }) =>
      h('span', { class: netClass(row.original.net) }, formatCurrency(row.original.net))
  }
]

const txColumns: TableColumn<CashFlowTransaction>[] = [
  {
    accessorKey: 'transaction_date',
    header: 'Ngày',
    cell: ({ row }: { row: { original: CashFlowTransaction } }) => formatDate(row.original.transaction_date)
  },
  {
    accessorKey: 'code',
    header: 'Mã GD',
    cell: ({ row }: { row: { original: CashFlowTransaction } }) =>
      h('span', { class: 'font-mono text-sm' }, row.original.code)
  },
  {
    accessorKey: 'project_name',
    header: 'Dự án',
    cell: ({ row }: { row: { original: CashFlowTransaction } }) => row.original.project_name ?? '—'
  },
  {
    accessorKey: 'direction',
    header: 'Chiều',
    cell: ({ row }: { row: { original: CashFlowTransaction } }) =>
      h(
        resolveComponent('UBadge'),
        {
          color: row.original.direction.value === 'inflow' ? 'success' : 'error',
          variant: 'subtle',
          size: 'sm'
        },
        () => row.original.direction.label
      )
  },
  {
    accessorKey: 'category',
    header: 'Danh mục',
    cell: ({ row }: { row: { original: CashFlowTransaction } }) => row.original.category.label
  },
  {
    accessorKey: 'amount',
    header: 'Số tiền',
    cell: ({ row }: { row: { original: CashFlowTransaction } }) =>
      h('span', { class: 'tabular-nums' }, formatCurrency(row.original.amount))
  },
  {
    accessorKey: 'note',
    header: 'Ghi chú',
    cell: ({ row }: { row: { original: CashFlowTransaction } }) => row.original.note ?? '—'
  }
]

const isLoading = (status: string) => status === 'pending'
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Báo cáo Dòng tiền"
      description="Tổng hợp tiền vào/ra và số dư tài khoản quỹ"
    />

    <!-- Error state -->
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
        </div>
        <UAlert
          v-if="isProjectFiltered"
          color="warning"
          variant="subtle"
          class="mt-3"
          description="Khi lọc theo dự án, giao dịch nạp/rút thủ công không thuộc dự án sẽ không hiển thị."
        />
      </SharedSectionCard>

      <!-- ═══ KPI Cards ═══ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Số dư hiện tại -->
        <SharedSectionCard
          title="Số dư hiện tại"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-1" />
            <USkeleton class="h-4 w-24" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ formatKpi(summary.current_balance) }}
            </p>
            <span class="text-xs text-slate-500">Số dư thực tế</span>
          </template>
        </SharedSectionCard>

        <!-- Tổng tiền vào -->
        <SharedSectionCard
          title="Tổng tiền vào"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-1" />
            <USkeleton class="h-4 w-28" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold text-emerald-600 tabular-nums">
              +{{ formatKpi(summary.total_inflow) }}
            </p>
            <span class="text-xs text-slate-500">{{ summary.period_label }}</span>
          </template>
        </SharedSectionCard>

        <!-- Tổng tiền ra -->
        <SharedSectionCard
          title="Tổng tiền ra"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-1" />
            <USkeleton class="h-4 w-28" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold text-red-600 tabular-nums">
              -{{ formatKpi(summary.total_outflow) }}
            </p>
            <span class="text-xs text-slate-500">{{ summary.period_label }}</span>
          </template>
        </SharedSectionCard>

        <!-- Dòng tiền ròng -->
        <SharedSectionCard
          title="Dòng tiền ròng"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-1" />
            <USkeleton class="h-4 w-28" />
          </template>
          <template v-else-if="summary">
            <p
              class="text-2xl font-bold tabular-nums"
              :class="isNegative(summary.net_flow) ? 'text-red-600' : 'text-emerald-600'"
            >
              {{ isNegative(summary.net_flow) ? '' : '+' }}{{ formatKpi(summary.net_flow) }}
            </p>
            <span class="text-xs text-slate-500">{{ summary.period_label }}</span>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ Tiền vào/ra theo danh mục ═══ -->
      <SharedSectionCard
        title="Tiền vào/ra theo danh mục"
        compact
        class="mb-6"
      >
        <template v-if="isLoading(summaryStatus)">
          <USkeleton class="h-48 w-full" />
        </template>
        <UTable
          v-else
          :data="categoryRows"
          :columns="categoryColumns"
          :loading="false"
        />
      </SharedSectionCard>

      <!-- ═══ Dòng tiền theo ngày ═══ -->
      <SharedSectionCard
        title="Dòng tiền theo ngày"
        compact
        class="mb-6"
      >
        <SharedCrudTableWrapper
          :status="dailyStatus"
          :error="dailyError"
          :data="dailyData"
          :refresh="refreshDaily"
        >
          <UTable
            :data="dailyRows"
            :columns="dailyColumns"
          />
        </SharedCrudTableWrapper>
      </SharedSectionCard>

      <!-- ═══ Chi tiết giao dịch ═══ -->
      <SharedSectionCard
        title="Chi tiết giao dịch"
        compact
        class="mb-6"
      >
        <template #header-actions>
          <NuxtLink
            to="/pmc/finance/treasury"
            class="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Quản lý quỹ →
          </NuxtLink>
        </template>

        <SharedCrudTableWrapper
          :status="txStatus"
          :error="txError"
          :data="txData"
          :refresh="refreshTransactions"
        >
          <UTable
            :data="txRows"
            :columns="txColumns"
          />

          <div
            v-if="txMeta && txMeta.last_page > 1"
            class="flex items-center justify-between pt-4 border-t border-slate-100 mt-4"
          >
            <p class="text-sm text-slate-500">
              Hiển thị {{ txRows.length }} / {{ txMeta.total }} giao dịch
            </p>
            <UPagination
              v-model:page="txPage"
              :total="txMeta.total"
              :items-per-page="txMeta.per_page ?? DEFAULT_PER_PAGE"
              :max="5"
              size="sm"
            />
          </div>
        </SharedCrudTableWrapper>
      </SharedSectionCard>
    </template>
  </div>
</template>
