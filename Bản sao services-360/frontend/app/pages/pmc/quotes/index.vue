<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { QuoteListResource, QuotesIndexStatus, QuotesIndexIsActive } from '#api/generated/laravel'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Báo giá - Thần Nông' })

// ─── Filters ───
const params = reactive<{ search?: string, status?: QuotesIndexStatus, is_active?: QuotesIndexIsActive, per_page: number }>({
  is_active: 'true' as QuotesIndexIsActive,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const selectedStatus = ref<string | undefined>(undefined)
const selectedActive = ref<string | undefined>('true')

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  status: { ref: selectedStatus, type: 'string' },
  is_active: { ref: selectedActive, type: 'string' }
}, params)

watch(selectedStatus, (val) => {
  params.status = (val || undefined) as QuotesIndexStatus | undefined
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedActive, (val) => {
  params.is_active = (val || undefined) as QuotesIndexIsActive | undefined
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || !!selectedStatus.value || (!!selectedActive.value && selectedActive.value !== 'true'))

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedStatus.value = undefined
  selectedActive.value = 'true'
  page.value = 1
}

// ─── Data ───
const { data, status, error, refresh } = useQuoteList(
  computed(() => ({ ...params, page: page.value }))
)

const quotes = computed<QuoteListResource[]>(() => data.value?.data ?? [])

const columns: TableColumn<QuoteListResource>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { id: 'og_ticket', header: 'Ticket' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'is_active', header: 'Active' },
  { id: 'total_amount', header: 'Tổng tiền' },
  { accessorKey: 'lines_count', header: 'Số dòng' },
  { id: 'created_at', header: 'Tạo lúc' },
  stickyRight<QuoteListResource>({ id: 'actions', header: '' })
]

// ─── CRUD (delete with check) ───
const crud = useCrudModals<QuoteListResource>()
const { showDeleteModal, deleteTarget } = crud
const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteQuote,
  deleteFn: apiDeleteQuote,
  successMessage: 'Đã xoá báo giá'
})
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Báo giá"
      description="Danh sách báo giá cho các ticket nội bộ"
      create-to="/pmc/quotes/create"
      create-label="Tạo báo giá"
    />

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
        :items="QUOTE_STATUS_OPTIONS"
        placeholder="Trạng thái"
        class="w-44"
      />
      <USelect
        v-model="selectedActive"
        :items="QUOTE_ACTIVE_OPTIONS"
        placeholder="Hiệu lực"
        class="w-36"
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
          :data="quotes"
          :columns="columns"
        >
          <template #code-cell="{ row }">
            <span class="font-mono text-xs font-semibold">{{ row.original.code }}</span>
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
              :color="quoteStatusColor(row.original.status.value)"
              variant="subtle"
              size="sm"
            />
          </template>

          <template #is_active-cell="{ row }">
            <UBadge
              :label="row.original.is_active ? 'Active' : 'Inactive'"
              :color="row.original.is_active ? 'success' : 'neutral'"
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
                :to="`/pmc/quotes/${row.original.id}`"
              />
              <UButton
                v-if="row.original.is_active && row.original.status.value !== 'approved'"
                icon="i-lucide-pencil"
                color="neutral"
                variant="ghost"
                size="sm"
                title="Chỉnh sửa"
                :to="`/pmc/quotes/${row.original.id}/edit`"
              />
              <UButton
                v-if="row.original.is_active"
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

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá báo giá"
      :item-name="deleteTarget?.code"
      description="Báo giá sẽ bị ngưng hiệu lực."
      :checking="isCheckingDelete"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
