<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { OrderListResource, OrdersIndexStatus } from '#api/generated/laravel'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Đơn hàng - Thần Nông' })

// ─── Filters ───
const params = reactive<{ search?: string, status?: OrdersIndexStatus, per_page: number }>({
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const selectedStatus = ref<string | undefined>(undefined)

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  status: { ref: selectedStatus, type: 'string', onInit: (v) => { params.status = String(v) as OrdersIndexStatus } }
})

watch(selectedStatus, (val) => {
  params.status = (val || undefined) as OrdersIndexStatus | undefined
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || !!selectedStatus.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedStatus.value = undefined
  page.value = 1
}

// ─── Data ───
const { data, status, error, refresh } = useOrderList(
  computed(() => ({ ...params, page: page.value }))
)

const orders = computed<OrderListResource[]>(() => data.value?.data ?? [])

const columns: TableColumn<OrderListResource>[] = [
  { accessorKey: 'code', header: 'Mã đơn' },
  { id: 'quote', header: 'Báo giá' },
  { id: 'og_ticket', header: 'Ticket' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'total_amount', header: 'Tổng tiền' },
  { accessorKey: 'lines_count', header: 'Số dòng' },
  { id: 'created_at', header: 'Tạo lúc' },
  stickyRight<OrderListResource>({ id: 'actions', header: 'Thao tác' })
]

// ─── Create modal ───
const showCreateModal = ref(false)

function handleCreated(newId: number) {
  navigateTo(`/pmc/orders/${newId}`)
}

// ─── Delete (with check) ───
const crud = useCrudModals<OrderListResource>()
const { showDeleteModal, deleteTarget } = crud
const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteOrder,
  deleteFn: apiDeleteOrder,
  successMessage: 'Đã xoá đơn hàng'
})
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Đơn hàng"
      description="Quản lý danh sách đơn hàng"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Tạo đơn hàng"
          @click="showCreateModal = true"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Filters -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo mã, tên ticket..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="selectedStatus"
        :items="ORDER_STATUS_OPTIONS"
        placeholder="Trạng thái"
        class="w-44"
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
          :data="orders"
          :columns="columns"
        >
          <template #code-cell="{ row }">
            <span class="font-mono text-xs font-semibold">{{ row.original.code }}</span>
          </template>

          <template #quote-cell="{ row }">
            <NuxtLink
              v-if="row.original.quote"
              :to="`/pmc/quotes/${row.original.quote.id}`"
              class="text-primary hover:underline font-mono text-xs"
            >
              {{ row.original.quote.code }}
            </NuxtLink>
            <span
              v-else
              class="text-slate-400"
            >—</span>
          </template>

          <template #og_ticket-cell="{ row }">
            <NuxtLink
              v-if="row.original.og_ticket"
              :to="`/pmc/og-tickets/${row.original.og_ticket.id}`"
              class="text-primary hover:underline text-sm"
            >
              {{ row.original.og_ticket.subject }}
            </NuxtLink>
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :label="row.original.status.label"
              :color="orderStatusColor(row.original.status.value)"
              variant="subtle"
              size="sm"
            />
          </template>

          <template #total_amount-cell="{ row }">
            <span class="font-medium">{{ formatCurrency(row.original.total_amount) }}</span>
          </template>

          <template #created_at-cell="{ row }">
            {{ formatDateTime(row.original.created_at) }}
          </template>

          <template #actions-cell="{ row }">
            <div class="flex items-center justify-end gap-1">
              <UButton
                icon="i-lucide-eye"
                color="neutral"
                variant="ghost"
                size="sm"
                title="Xem chi tiết"
                :to="`/pmc/orders/${row.original.id}`"
              />
              <UButton
                v-if="row.original.status.value === 'draft'"
                icon="i-lucide-trash-2"
                color="neutral"
                variant="ghost"
                size="sm"
                class="hover:!text-red-500 hover:!bg-red-50"
                title="Xoá"
                @click="openDeleteModal(row.original)"
              />
            </div>
          </template>
        </UTable>

        <SharedCrudTablePagination
          v-model:page="page"
          :meta="data?.meta"
        />
      </div>
    </SharedCrudTableWrapper>

    <!-- Create modal -->
    <OrderCreateModal
      v-model:open="showCreateModal"
      @created="handleCreated"
    />

    <!-- Delete modal -->
    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá đơn hàng"
      :item-name="deleteTarget?.code"
      description="Đơn hàng sẽ bị xoá vĩnh viễn."
      :checking="isCheckingDelete"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
