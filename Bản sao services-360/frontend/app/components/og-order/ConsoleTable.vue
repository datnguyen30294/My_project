<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { OrganizationItem } from '~/composables/api/useOrganizations'
import type {
  ListOgOrderConsoleParams,
  OgOrderConsoleListItem,
  OgOrderStatusValue
} from '~/composables/api/useOgOrders'
import {
  ogOrderStatusColor,
  OG_ORDER_STATUS_OPTIONS,
  usePlatformOgOrderConsoleList,
  usePlatformOgOrderConsoleSummary
} from '~/composables/api/useOgOrders'

const MAX_RANGE_DAYS = 90

// ─── Filter state ──────────────────────────────────────────────

function defaultRange(): { from: string, to: string } {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) }
}

const filters = reactive({
  ...defaultRange(),
  tenant_id: undefined as string | undefined,
  status: undefined as OgOrderStatusValue | undefined
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  searchTerm.value = value ?? ''
  page.value = 1
})
const searchTerm = ref('')

// Kẹp khoảng thời gian tối đa 90 ngày (BE cũng kẹp).
watch(() => [filters.from, filters.to], () => {
  if (!filters.from || !filters.to) return
  const from = new Date(filters.from)
  const to = new Date(filters.to)
  const diffDays = (to.getTime() - from.getTime()) / 86_400_000
  if (diffDays > MAX_RANGE_DAYS) {
    const clamped = new Date(to)
    clamped.setDate(clamped.getDate() - MAX_RANGE_DAYS)
    filters.from = clamped.toISOString().slice(0, 10)
  }
})

// ─── Filter options ────────────────────────────────────────────

const { data: tenantsData } = usePlatformOrganizationList(
  computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
)
const tenantOptions = computed(() => [
  { label: 'Tất cả công ty VH', value: undefined as string | undefined },
  ...((tenantsData.value?.data ?? []) as OrganizationItem[]).map(o => ({ label: `${o.name} (${o.id})`, value: o.id }))
])

const statusOptions: { label: string, value: OgOrderStatusValue | undefined }[] = [
  { label: 'Trạng thái: Tất cả', value: undefined },
  ...OG_ORDER_STATUS_OPTIONS.map(s => ({ label: s.label, value: s.value }))
]

watch([
  () => filters.tenant_id,
  () => filters.status
], () => {
  page.value = 1
})

const hasFilters = computed(() =>
  !!searchTerm.value
  || filters.tenant_id !== undefined
  || filters.status !== undefined
)

function clearFilters(): void {
  searchInput.value = ''
  searchTerm.value = ''
  filters.tenant_id = undefined
  filters.status = undefined
  Object.assign(filters, defaultRange())
  page.value = 1
}

// ─── Data ──────────────────────────────────────────────────────

const summaryParams = computed<Omit<ListOgOrderConsoleParams, 'page' | 'per_page'>>(() => ({
  from: filters.from,
  to: filters.to,
  tenant_id: filters.tenant_id,
  status: filters.status,
  search: searchTerm.value || undefined
}))

const listParams = computed<ListOgOrderConsoleParams>(() => ({
  ...summaryParams.value,
  page: page.value,
  per_page: DEFAULT_PER_PAGE
}))

const { data: summaryData, status: summaryStatus } = usePlatformOgOrderConsoleSummary(summaryParams)
const { data: listData, status: listStatus, error: listError } = usePlatformOgOrderConsoleList(listParams)

const orders = computed<OgOrderConsoleListItem[]>(() => listData.value?.data ?? [])

const columns = computed<TableColumn<OgOrderConsoleListItem>[]>(() => [
  { accessorKey: 'code', header: 'Mã đơn' },
  { id: 'subject', header: 'Nội dung' },
  { id: 'project', header: 'Dự án' },
  { id: 'tenant', header: 'Công ty VH' },
  { id: 'customer', header: 'Khách hàng' },
  { id: 'total', header: 'GMV' },
  { id: 'platform_fee', header: 'Phí nền tảng' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'created_at', header: 'Ngày tạo' }
])
</script>

<template>
  <div>
    <OgOrderConsoleSummary
      :summary="summaryData?.data ?? null"
      :loading="summaryStatus === 'pending' && !summaryData"
      class="mb-4"
    />

    <!-- Filters -->
    <div class="mb-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 flex-wrap">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm mã đơn / nội dung..."
        class="max-w-xs"
        @update:model-value="onSearch"
      />
      <USelectMenu
        v-model="filters.tenant_id"
        :items="tenantOptions"
        value-key="value"
        searchable
        class="min-w-[200px]"
      />
      <USelect
        v-model="filters.status"
        :items="statusOptions"
        value-key="value"
        class="min-w-[170px]"
      />
      <div class="flex items-center gap-2">
        <span class="text-sm text-slate-600">Từ</span>
        <UInput
          v-model="filters.from"
          type="date"
        />
        <span class="text-sm text-slate-600">đến</span>
        <UInput
          v-model="filters.to"
          type="date"
        />
      </div>
      <UButton
        v-if="hasFilters"
        icon="i-lucide-x"
        label="Xoá bộ lọc"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="clearFilters"
      />
    </div>

    <UAlert
      v-if="listError"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải danh sách đơn hàng. Vui lòng thử lại."
      class="mb-4"
    />

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="orders"
        :columns="columns"
        :loading="listStatus === 'pending'"
      >
        <template #code-cell="{ row }">
          <span class="font-mono font-semibold text-slate-900">{{ row.original.code }}</span>
        </template>

        <template #subject-cell="{ row }">
          <span class="text-sm text-slate-700">{{ row.original.subject ?? '—' }}</span>
        </template>

        <template #project-cell="{ row }">
          <span class="text-sm text-slate-700">{{ row.original.project_name ?? '—' }}</span>
        </template>

        <template #tenant-cell="{ row }">
          <span class="text-sm text-slate-700">{{ row.original.tenant?.name ?? row.original.tenant?.id ?? '—' }}</span>
        </template>

        <template #customer-cell="{ row }">
          <div class="flex flex-col gap-0.5">
            <span class="text-sm text-slate-900">{{ row.original.customer_name ?? '—' }}</span>
            <span
              v-if="row.original.customer_phone"
              class="text-[11px] text-slate-400 tabular-nums"
            >{{ row.original.customer_phone }}</span>
          </div>
        </template>

        <template #total-cell="{ row }">
          <span class="tabular-nums">{{ formatCurrency(row.original.total_amount) }}</span>
        </template>

        <template #platform_fee-cell="{ row }">
          <span class="tabular-nums font-semibold text-emerald-600">{{ formatCurrency(row.original.platform_fee) }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="ogOrderStatusColor(row.original.status.value)"
            variant="subtle"
            :label="row.original.status.label"
          />
        </template>

        <template #created_at-cell="{ row }">
          <span class="text-sm text-slate-600">{{ row.original.created_at ? formatDate(row.original.created_at) : '—' }}</span>
        </template>

        <template #empty>
          <div class="py-8 text-center text-sm text-slate-500">
            Không có đơn hàng — thử đổi bộ lọc hoặc khoảng thời gian.
          </div>
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="listData?.meta"
      />
    </div>
  </div>
</template>
