<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ReceivableListResource, ReceivablesIndexStatus } from '#api/generated/laravel'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Công nợ phải thu - Thần Nông' })

// ─── Filters ───
const params = reactive<{ search?: string, status?: ReceivablesIndexStatus, project_id?: number | null, per_page: number }>({
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const selectedStatus = ref<string | undefined>(undefined)
const selectedProjectId = ref<number | undefined>(undefined)

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  status: { ref: selectedStatus, type: 'string', onInit: (v) => { params.status = String(v) as ReceivablesIndexStatus } },
  project_id: { ref: selectedProjectId, type: 'number', onInit: (v) => { selectedProjectId.value = Number(v); params.project_id = Number(v) } }
})

watch(selectedStatus, (val) => {
  params.status = (val || undefined) as ReceivablesIndexStatus | undefined
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedProjectId, (val) => {
  params.project_id = val || undefined
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || !!selectedStatus.value || selectedProjectId.value != null)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedStatus.value = undefined
  selectedProjectId.value = undefined
  page.value = 1
}

// ─── Data ───
const { data, status, error, refresh } = useReceivableList(
  computed(() => ({ ...params, page: page.value }))
)
const receivables = computed<ReceivableListResource[]>(() => data.value?.data ?? [])

// ─── Summary ───
const summaryParams = computed(() => ({
  project_id: selectedProjectId.value ?? undefined
}))
const { data: summaryData } = useReceivableSummary(summaryParams)
const kpi = computed(() => summaryData.value?.data?.kpi as { total_amount: string, total_paid: string, total_outstanding: string, count: number } | undefined)
const aging = computed(() => (summaryData.value?.data?.aging ?? []) as { bucket: string, label: string, total: string, count: number }[])

// ─── Table ───
const columns: TableColumn<ReceivableListResource>[] = [
  { id: 'order_info', header: 'Đơn hàng' },
  { id: 'project', header: 'Dự án' },
  { id: 'amount', header: 'Phải thu' },
  { id: 'paid_amount', header: 'Đã thu' },
  { id: 'outstanding', header: 'Còn nợ' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'due_date', header: 'Hạn TT' },
  { id: 'aging', header: 'Tuổi nợ' },
  stickyRight<ReceivableListResource>({ id: 'actions', header: 'Thao tác' }, { width: 'w-[80px] min-w-[80px]' })
]
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Công nợ phải thu"
      description="Quản lý công nợ phải thu từ đơn hàng"
    >
      <template #actions>
        <span />
      </template>
    </SharedCrudPageHeader>

    <!-- KPI Cards -->
    <div
      v-if="kpi"
      class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6"
    >
      <UCard>
        <div class="text-xs text-slate-500 mb-1">
          Tổng phải thu
        </div>
        <div class="text-lg font-bold text-slate-900">
          {{ formatCurrency(kpi.total_amount) }}
        </div>
      </UCard>
      <UCard>
        <div class="text-xs text-slate-500 mb-1">
          Đã thu
        </div>
        <div class="text-lg font-bold text-[var(--ui-success)]">
          {{ formatCurrency(kpi.total_paid) }}
        </div>
      </UCard>
      <UCard>
        <div class="text-xs text-slate-500 mb-1">
          Còn nợ
        </div>
        <div class="text-lg font-bold text-[var(--ui-warning)]">
          {{ formatCurrency(kpi.total_outstanding) }}
        </div>
      </UCard>
      <UCard>
        <div class="text-xs text-slate-500 mb-1">
          Số khoản
        </div>
        <div class="text-lg font-bold text-slate-900">
          {{ kpi.count }}
        </div>
      </UCard>
    </div>

    <!-- Aging Summary Cards -->
    <div
      v-if="aging.length > 0"
      class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6"
    >
      <UCard
        v-for="bucket in aging"
        :key="bucket.bucket"
      >
        <div class="text-xs text-slate-500 mb-1">
          {{ bucket.label }}
        </div>
        <div class="text-sm font-bold text-slate-900">
          {{ formatCurrency(bucket.total) }}
        </div>
        <div class="text-xs text-slate-400">
          {{ bucket.count }} khoản
        </div>
      </UCard>
    </div>

    <!-- Filters -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo mã đơn, khách hàng..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="selectedStatus"
        :items="RECEIVABLE_STATUS_OPTIONS"
        placeholder="Trạng thái"
        class="w-44"
      />
      <SharedProjectSelect
        v-model="selectedProjectId"
        placeholder="Dự án"
        class="w-48"
      />
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

    <SharedCrudTableWrapper
      :status="status"
      :error="error"
      :data="data"
      :refresh="refresh"
    >
      <div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm">
        <UTable
          :data="receivables"
          :columns="columns"
        >
          <template #order_info-cell="{ row }">
            <div class="flex flex-col gap-0.5">
              <div class="flex items-center gap-1.5">
                <NuxtLink
                  v-if="row.original.order"
                  :to="`/pmc/receivables/${row.original.id}`"
                  class="text-primary hover:underline font-mono text-xs font-semibold"
                >
                  {{ row.original.order.code }}
                </NuxtLink>
              </div>
              <NuxtLink
                v-if="row.original.og_ticket?.subject"
                :to="`/pmc/receivables/${row.original.id}`"
                class="text-xs text-slate-700 line-clamp-1 hover:text-primary-700 hover:underline"
              >
                {{ row.original.og_ticket.subject }}
              </NuxtLink>
              <span
                v-if="row.original.og_ticket?.customer?.full_name ?? row.original.og_ticket?.requester_name"
                class="text-[11px] text-slate-400"
              >
                {{ row.original.og_ticket?.customer?.full_name ?? row.original.og_ticket?.requester_name }}
                <template v-if="row.original.og_ticket?.apartment_name"> · {{ row.original.og_ticket.apartment_name }}</template>
              </span>
            </div>
          </template>

          <template #project-cell="{ row }">
            {{ row.original.project?.name ?? '—' }}
          </template>

          <template #amount-cell="{ row }">
            {{ formatCurrency(row.original.amount) }}
          </template>

          <template #paid_amount-cell="{ row }">
            {{ formatCurrency(row.original.paid_amount) }}
          </template>

          <template #outstanding-cell="{ row }">
            <span :class="{ 'font-bold': parseFloat(row.original.outstanding) > 0 }">
              {{ formatCurrency(row.original.outstanding) }}
            </span>
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :label="row.original.status.label"
              :color="receivableStatusColor(row.original.status.value)"
              variant="subtle"
              size="sm"
            />
          </template>

          <template #due_date-cell="{ row }">
            {{ formatDate(row.original.due_date) }}
          </template>

          <template #aging-cell="{ row }">
            {{ formatAgingDays(row.original.aging_days, row.original.status.value) }}
          </template>

          <template #actions-cell="{ row }">
            <UButton
              icon="i-lucide-eye"
              color="neutral"
              variant="ghost"
              size="sm"
              title="Chi tiết"
              :to="`/pmc/receivables/${row.original.id}`"
            />
          </template>
        </UTable>

        <SharedCrudTablePagination
          v-model:page="page"
          :meta="data?.meta"
        />
      </div>
    </SharedCrudTableWrapper>
  </div>
</template>
