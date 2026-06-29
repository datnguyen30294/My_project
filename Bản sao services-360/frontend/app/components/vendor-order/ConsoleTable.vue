<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { OrganizationItem } from '~/composables/api/useOrganizations'
import type { PartnerListItem } from '~/composables/api/usePartners'
import type {
  ListVendorOrderConsoleParams,
  VendorOrderConsoleListItem,
  VendorOrderStatusValue,
  VendorOrderTypeValue
} from '~/composables/api/useVendorOrders'
import {
  revenueRecipientColor,
  usePlatformVendorOrderConsoleList,
  usePlatformVendorOrderConsoleSummary,
  vendorOrderStatusColor,
  VENDOR_ORDER_STATUS_OPTIONS,
  VENDOR_ORDER_TYPE_OPTIONS
} from '~/composables/api/useVendorOrders'

interface Props {
  /** Khoá danh sách vào 1 vendor — ẩn bộ lọc + cột Vendor (dùng cho tab đơn ở trang chi tiết vendor). */
  lockedPartnerId?: number
}

const props = defineProps<Props>()

const isLocked = computed(() => props.lockedPartnerId !== undefined)

const DETAIL_BASE = '/platform/quan-ly-don-hang/don-hang-vendor'
const VENDOR_BASE = '/platform/quan-ly-van-hanh/quan-ly-vendor'
const PROJECT_BASE = '/platform/quan-ly-van-hanh/du-an-tren-nen-tang'

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
  partner_id: undefined as number | undefined,
  tenant_id: undefined as string | undefined,
  project_id: undefined as number | null | undefined,
  type: undefined as VendorOrderTypeValue | undefined,
  status: undefined as VendorOrderStatusValue | undefined
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  searchTerm.value = value ?? ''
  page.value = 1
})
const searchTerm = ref('')

// Vendor hiệu lực: ưu tiên prop khoá, ngược lại lấy từ bộ lọc.
const effectivePartnerId = computed(() => props.lockedPartnerId ?? filters.partner_id)

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

const { data: vendorsData } = usePlatformPartnerList(
  computed(() => ({ provisioned: true, per_page: SELECT_ALL_PER_PAGE, sort_by: 'name' as const, sort_direction: 'asc' as const }))
)
const vendorOptions = computed(() => [
  { label: 'Tất cả vendor', value: undefined as number | undefined },
  ...((vendorsData.value?.data ?? []) as PartnerListItem[]).map(v => ({ label: v.name, value: v.id }))
])

const { data: tenantsData } = usePlatformOrganizationList(
  computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
)
const tenantOptions = computed(() => [
  { label: 'Tất cả công ty VH', value: undefined as string | undefined },
  ...((tenantsData.value?.data ?? []) as OrganizationItem[]).map(o => ({ label: `${o.name} (${o.id})`, value: o.id }))
])

const typeOptions: { label: string, value: VendorOrderTypeValue | undefined }[] = [
  { label: 'Loại: Tất cả', value: undefined },
  ...VENDOR_ORDER_TYPE_OPTIONS.map(t => ({ label: t.label, value: t.value }))
]

const statusOptions: { label: string, value: VendorOrderStatusValue | undefined }[] = [
  { label: 'Trạng thái: Tất cả', value: undefined },
  ...VENDOR_ORDER_STATUS_OPTIONS.map(s => ({ label: s.label, value: s.value }))
]

watch([
  () => filters.partner_id,
  () => filters.tenant_id,
  () => filters.project_id,
  () => filters.type,
  () => filters.status
], () => {
  page.value = 1
})

// Đổi công ty VH → reset dự án đã chọn.
watch(() => filters.tenant_id, () => {
  filters.project_id = undefined
})

const hasFilters = computed(() =>
  !!searchTerm.value
  || (!isLocked.value && filters.partner_id !== undefined)
  || filters.tenant_id !== undefined
  || (filters.project_id !== undefined && filters.project_id !== null)
  || filters.type !== undefined || filters.status !== undefined
)

function clearFilters(): void {
  searchInput.value = ''
  searchTerm.value = ''
  if (!isLocked.value) {
    filters.partner_id = undefined
  }
  filters.tenant_id = undefined
  filters.project_id = undefined
  filters.type = undefined
  filters.status = undefined
  Object.assign(filters, defaultRange())
  page.value = 1
}

// ─── Data ──────────────────────────────────────────────────────

const summaryParams = computed<Omit<ListVendorOrderConsoleParams, 'page' | 'per_page'>>(() => ({
  from: filters.from,
  to: filters.to,
  partner_id: effectivePartnerId.value,
  tenant_id: filters.tenant_id,
  project_id: filters.project_id ?? undefined,
  type: filters.type,
  status: filters.status,
  search: searchTerm.value || undefined
}))

const listParams = computed<ListVendorOrderConsoleParams>(() => ({
  ...summaryParams.value,
  page: page.value,
  per_page: DEFAULT_PER_PAGE
}))

const { data: summaryData, status: summaryStatus } = usePlatformVendorOrderConsoleSummary(summaryParams)
const { data: listData, status: listStatus, error: listError } = usePlatformVendorOrderConsoleList(listParams)

const orders = computed<VendorOrderConsoleListItem[]>(() => listData.value?.data ?? [])

const columns = computed<TableColumn<VendorOrderConsoleListItem>[]>(() => [
  { accessorKey: 'code', header: 'Mã đơn' },
  { id: 'type', header: 'Loại' },
  ...(isLocked.value ? [] : [{ id: 'vendor', header: 'Vendor' }]),
  { id: 'project', header: 'Dự án' },
  { id: 'tenant', header: 'Công ty VH' },
  { id: 'customer', header: 'Khách hàng' },
  { id: 'total', header: 'GMV' },
  { id: 'commission', header: 'Hoa hồng' },
  { id: 'recipient', header: 'Thuộc về' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'rating', header: 'Đánh giá CD' },
  { id: 'created_at', header: 'Ngày tạo' }
])

function orderKey(row: VendorOrderConsoleListItem): string {
  return `${row.vendor?.id ?? props.lockedPartnerId ?? 0}-${row.id}`
}
</script>

<template>
  <div>
    <VendorOrderConsoleSummary
      :summary="summaryData?.data ?? null"
      :loading="summaryStatus === 'pending' && !summaryData"
      class="mb-4"
    />

    <!-- Filters -->
    <div class="mb-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 flex-wrap">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm mã đơn..."
        class="max-w-xs"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="filters.type"
        :items="typeOptions"
        value-key="value"
        class="min-w-[150px]"
      />
      <USelectMenu
        v-if="!isLocked"
        v-model="filters.partner_id"
        :items="vendorOptions"
        value-key="value"
        searchable
        class="min-w-[180px]"
      />
      <USelectMenu
        v-model="filters.tenant_id"
        :items="tenantOptions"
        value-key="value"
        searchable
        class="min-w-[200px]"
      />
      <div class="w-52">
        <SharedOrganizationProjectSelect
          v-model="filters.project_id"
          :organization-id="filters.tenant_id ?? null"
          placeholder="Tất cả dự án"
          :disabled="!filters.tenant_id"
        />
      </div>
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
          <NuxtLink
            :to="`${DETAIL_BASE}/${orderKey(row.original)}`"
            class="font-mono font-semibold text-primary-700 hover:underline"
          >
            {{ row.original.code }}
          </NuxtLink>
        </template>

        <template #type-cell="{ row }">
          <span class="text-sm">{{ row.original.type.label }}</span>
        </template>

        <template #vendor-cell="{ row }">
          <NuxtLink
            v-if="row.original.vendor"
            :to="`${VENDOR_BASE}/${row.original.vendor.id}`"
            class="text-slate-900 hover:text-primary-700 hover:underline"
          >
            {{ row.original.vendor.name }}
          </NuxtLink>
          <span
            v-else
            class="text-slate-400"
          >—</span>
        </template>

        <template #project-cell="{ row }">
          <NuxtLink
            v-if="row.original.project_id && row.original.tenant?.id"
            :to="`${PROJECT_BASE}/${row.original.project_id}?tenant=${row.original.tenant.id}`"
            class="text-slate-700 hover:text-primary-700 hover:underline"
          >
            {{ row.original.project_name }}
          </NuxtLink>
          <span
            v-else-if="row.original.project_id"
            class="text-slate-700"
          >{{ row.original.project_name }}</span>
          <span
            v-else
            class="text-slate-400"
          >—</span>
        </template>

        <template #tenant-cell="{ row }">
          <span class="text-sm text-slate-700">{{ row.original.tenant?.name ?? row.original.tenant?.id ?? '—' }}</span>
        </template>

        <template #customer-cell="{ row }">
          <span class="text-sm text-slate-900">{{ row.original.customer?.name ?? '—' }}</span>
        </template>

        <template #total-cell="{ row }">
          <span class="tabular-nums">{{ formatCurrency(row.original.total) }}</span>
        </template>

        <template #commission-cell="{ row }">
          <div
            v-if="row.original.commission"
            class="flex flex-col gap-0.5"
          >
            <span class="tabular-nums font-semibold text-primary-700">{{ formatCurrency(row.original.commission.amount) }}</span>
            <span
              v-if="row.original.commission.is_manual"
              class="text-[11px] text-amber-600"
            >Gán thủ công</span>
            <NuxtLink
              v-else-if="row.original.commission.source === 'default'"
              :to="`${DETAIL_BASE}/${orderKey(row.original)}`"
              :title="'Hoa hồng mặc định 0đ (chưa có hợp đồng) — bấm để gán'"
            >
              <UBadge
                color="neutral"
                variant="subtle"
                size="sm"
                label="Mặc định"
                class="cursor-pointer"
              />
            </NuxtLink>
          </div>
          <span
            v-else
            class="text-slate-400"
          >—</span>
        </template>

        <template #recipient-cell="{ row }">
          <UBadge
            v-if="row.original.commission && row.original.commission.source !== 'default'"
            :color="revenueRecipientColor(row.original.commission.revenue_recipient.value)"
            variant="subtle"
            size="sm"
            :label="row.original.commission.revenue_recipient.label"
          />
          <span
            v-else
            class="text-slate-400"
          >—</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="vendorOrderStatusColor(row.original.status.value)"
            variant="subtle"
            :label="row.original.status.label"
          />
        </template>

        <template #rating-cell>
          <span class="text-slate-400">—</span>
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
