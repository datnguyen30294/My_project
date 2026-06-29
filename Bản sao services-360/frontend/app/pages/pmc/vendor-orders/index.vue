<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { VendorOrderListItem } from '~/composables/api/useVendorOrders'
import {
  useAllVendorOrderList,
  useAllVendorOrderSummary
} from '~/composables/api/useVendorOrders'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Đơn hàng vendor - Thần Nông' })

// ─── Filter state ──────────────────────────────────────────────

function defaultRange(): { from: string, to: string } {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10)
  }
}

const range = reactive(defaultRange())
const vendorFilter = ref<number | undefined>(undefined)
const projectFilter = ref<number | undefined>(undefined)
const searchValue = ref('')
const page = ref(1)
const { searchInput, onSearch } = useTableSearch((v) => {
  searchValue.value = v ?? ''
  page.value = 1
})

// ─── Vendor options ────────────────────────────────────────────

const { data: vendorsData } = useTenantPartnerList(
  computed(() => ({ provisioned: true, per_page: SELECT_ALL_PER_PAGE }))
)
const vendorOptions = computed(() => [
  { label: 'Tất cả vendor', value: undefined as number | undefined },
  ...(vendorsData.value?.data ?? []).map(v => ({ label: v.name, value: v.id }))
])

// ─── Project options ───────────────────────────────────────────

const { data: projectsData } = useProjectList(
  computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
)
const projectOptions = computed(() => [
  { label: 'Tất cả dự án', value: undefined as number | undefined },
  ...(projectsData.value?.data ?? []).map(p => ({ label: p.name, value: p.id }))
])

// ─── Summary ───────────────────────────────────────────────────

const { data: summaryData, status: summaryStatus, refresh: refreshSummary } = useAllVendorOrderSummary(
  computed(() => ({
    from: range.from,
    to: range.to,
    partner_id: vendorFilter.value,
    project_id: projectFilter.value
  }))
)

// ─── List ──────────────────────────────────────────────────────

const listParams = computed(() => ({
  from: range.from,
  to: range.to,
  partner_id: vendorFilter.value,
  project_id: projectFilter.value,
  search: searchValue.value || undefined,
  page: page.value,
  per_page: 20
}))

const { data: listData, status: listStatus, error: listError, refresh: refreshList } = useAllVendorOrderList(listParams)

const orders = computed<VendorOrderListItem[]>(() => listData.value?.data ?? [])

watch([() => range.from, () => range.to, vendorFilter, projectFilter], async () => {
  page.value = 1
  await Promise.all([refreshList(), refreshSummary()])
})

// ─── Drawer state ──────────────────────────────────────────────

const drawerOpen = ref(false)
const selectedOrderId = ref<number | null>(null)
const selectedPartnerId = ref<number | null>(null)

function openDrawer(row: VendorOrderListItem) {
  selectedOrderId.value = row.id
  selectedPartnerId.value = row.vendor?.id ?? null
  drawerOpen.value = true
}

// ─── Table columns ─────────────────────────────────────────────

const columns: TableColumn<VendorOrderListItem>[] = [
  { accessorKey: 'code', header: 'Mã đơn' },
  { id: 'vendor', header: 'Vendor' },
  { id: 'customer', header: 'Khách hàng' },
  { id: 'project', header: 'Dự án' },
  { id: 'products', header: 'Sản phẩm' },
  { accessorKey: 'total', header: 'Tổng tiền' },
  { id: 'commission', header: 'Hoa hồng PMC' },
  { accessorKey: 'completed_at', header: 'Hoàn thành' }
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Đơn hàng vendor
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Tổng hợp đơn hàng hoàn thành và hoa hồng PMC của tất cả vendor mà tenant đang quản lý.
      </p>
    </div>

    <div class="space-y-4">
      <!-- Summary -->
      <VendorOrderSummaryCard
        :summary="summaryData?.data ?? null"
        :loading="summaryStatus === 'pending'"
      />

      <!-- Filters -->
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 flex-wrap shadow-sm">
        <USelect
          v-model="vendorFilter"
          :items="vendorOptions"
          value-key="value"
          class="min-w-[180px]"
        />

        <USelect
          v-model="projectFilter"
          :items="projectOptions"
          value-key="value"
          class="min-w-[180px]"
        />

        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-600">Từ</span>
          <UInput
            v-model="range.from"
            type="date"
          />
          <span class="text-sm text-slate-600">đến</span>
          <UInput
            v-model="range.to"
            type="date"
          />
        </div>

        <UInput
          v-model="searchInput"
          icon="i-lucide-search"
          placeholder="Tìm mã đơn..."
          class="max-w-xs"
          @update:model-value="onSearch"
        />
      </div>

      <!-- List -->
      <UAlert
        v-if="listError"
        icon="i-lucide-alert-circle"
        color="error"
        variant="subtle"
        description="Không thể tải danh sách đơn hàng."
      />

      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <UTable
          :data="orders"
          :columns="columns"
          :loading="listStatus === 'pending'"
        >
          <template #code-cell="{ row }">
            <button
              type="button"
              class="font-mono font-semibold text-primary-700 hover:underline"
              @click="openDrawer(row.original)"
            >
              {{ row.original.code }}
            </button>
          </template>

          <template #vendor-cell="{ row }">
            <NuxtLink
              v-if="row.original.vendor"
              :to="`/pmc/vendors/${row.original.vendor.id}`"
              class="text-sm font-medium text-slate-900 hover:text-primary-700 hover:underline"
            >
              {{ row.original.vendor.name }}
            </NuxtLink>
            <span
              v-else
              class="text-sm text-slate-400"
            >—</span>
          </template>

          <template #customer-cell="{ row }">
            <div>
              <p class="font-medium text-slate-900">
                {{ row.original.customer?.name ?? '—' }}
              </p>
              <p
                v-if="row.original.customer?.phone"
                class="text-xs text-slate-500 font-mono"
              >
                {{ row.original.customer.phone }}
              </p>
            </div>
          </template>

          <template #project-cell="{ row }">
            <span class="text-sm">{{ row.original.project_name }}</span>
          </template>

          <template #products-cell="{ row }">
            <div class="text-sm">
              <p class="line-clamp-1">
                {{ row.original.first_item_name ?? '—' }}
              </p>
              <p
                v-if="row.original.items_count > 1"
                class="text-xs text-slate-500"
              >
                (+{{ row.original.items_count - 1 }} sản phẩm khác)
              </p>
            </div>
          </template>

          <template #total-cell="{ row }">
            <span class="font-medium">{{ formatCurrency(row.original.total) }}</span>
          </template>

          <template #commission-cell="{ row }">
            <div class="flex flex-col gap-0.5">
              <span class="font-semibold text-primary-700">
                {{ formatCurrency(row.original.commission.amount) }}
              </span>
              <NuxtLink
                v-if="row.original.vendor"
                :to="tenantContractLocation(row.original.vendor.id, row.original.project_id, row.original.commission.contract_id)"
                class="font-mono text-xs text-slate-500 hover:text-primary-700 hover:underline"
                @click.stop
              >
                {{ row.original.commission.contract_code }}
              </NuxtLink>
              <span
                v-else
                class="font-mono text-xs text-slate-500"
              >
                {{ row.original.commission.contract_code }}
              </span>
            </div>
          </template>

          <template #completed_at-cell="{ row }">
            <span class="text-sm">
              {{ row.original.completed_at ? formatDateTime(row.original.completed_at) : '—' }}
            </span>
          </template>
        </UTable>

        <SharedCrudTablePagination
          v-model:page="page"
          :meta="listData?.meta"
        />
      </div>

      <!-- Detail Drawer -->
      <VendorOrderDetailDrawer
        v-if="selectedPartnerId"
        v-model:open="drawerOpen"
        :partner-id="selectedPartnerId"
        :order-id="selectedOrderId"
      />
    </div>
  </div>
</template>
