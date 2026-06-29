<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { CustomerDetailResource, CustomerListResource, CustomersIndexParams } from '~/composables/api/useCustomers'
import type { CustomerFormValues } from '~/components/customer/CustomerForm.vue'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Khách hàng - Thần Nông' })

type SortOption = 'created_desc' | 'last_contacted_desc' | 'full_name_asc'

const DEFAULT_SORT: SortOption = 'created_desc'

const SORT_OPTIONS: { label: string, value: SortOption }[] = [
  { label: 'Ngày tạo mới nhất', value: 'created_desc' },
  { label: 'Liên hệ gần nhất', value: 'last_contacted_desc' },
  { label: 'Tên A–Z', value: 'full_name_asc' }
]

function sortToParams(v: SortOption): Pick<CustomersIndexParams, 'sort_by' | 'sort_direction'> {
  switch (v) {
    case 'full_name_asc':
      return { sort_by: 'full_name', sort_direction: 'asc' }
    case 'last_contacted_desc':
      return { sort_by: 'last_contacted_at', sort_direction: 'desc' }
    case 'created_desc':
    default:
      return { sort_by: 'created_at', sort_direction: 'desc' }
  }
}

const sortValue = ref<SortOption>(DEFAULT_SORT)
const page = ref(1)
const params = reactive<CustomersIndexParams>({
  search: undefined,
  per_page: DEFAULT_PER_PAGE,
  ...sortToParams(sortValue.value)
})

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value
  page.value = 1
})

const { isInitFromUrl } = useUrlFilters({
  search: {
    ref: toRef(params, 'search'),
    type: 'string',
    onInit: (v) => { searchInput.value = String(v) }
  },
  sort: {
    ref: sortValue,
    type: 'string',
    defaultValue: DEFAULT_SORT,
    onInit: (v) => { Object.assign(params, sortToParams(v as SortOption)) }
  },
  page: { ref: page, type: 'number', defaultValue: 1 }
})

watch(sortValue, (next) => {
  Object.assign(params, sortToParams(next))
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || sortValue.value !== DEFAULT_SORT)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  sortValue.value = DEFAULT_SORT
  page.value = 1
}

const { data, status, error, refresh } = useCustomerList(
  computed(() => ({ ...params, page: page.value }))
)

const customers = computed<CustomerListResource[]>(() => data.value?.data ?? [])

const columns: TableColumn<CustomerListResource>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'full_name', header: 'Họ tên' },
  { id: 'phone', header: 'SĐT' },
  { id: 'email', header: 'Email' },
  { id: 'ticket_count', header: 'Số ticket' },
  { id: 'avg_rating', header: 'CSAT TB' },
  { id: 'last_contacted_at', header: 'Liên hệ gần nhất' },
  stickyRight<CustomerListResource>({ id: 'actions', header: 'Thao tác' })
]

// --- CRUD ---
const crud = useCrudModals<CustomerListResource | CustomerDetailResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors, formErrorMessage,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

const isLoadingEdit = ref(false)
const toast = useToast()

async function handleEditClick(row: CustomerListResource) {
  isLoadingEdit.value = true
  try {
    const res = await apiGetCustomer(row.id)
    openEditModal(res.data)
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Không thể tải khách hàng'), color: 'error' })
  } finally {
    isLoadingEdit.value = false
  }
}

function handleFormSubmit(values: CustomerFormValues) {
  submitForm(
    () => apiCreateCustomer({
      full_name: values.full_name,
      phone: values.phone,
      email: values.email || null,
      note: values.note || null
    }),
    () => apiUpdateCustomer(editTarget.value!.id, {
      full_name: values.full_name,
      phone: values.phone,
      email: values.email || null,
      note: values.note || null
    }),
    { create: 'Đã tạo khách hàng', update: 'Đã cập nhật khách hàng' }
  )
}

const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteCustomer,
  deleteFn: apiDeleteCustomer,
  successMessage: 'Đã xoá khách hàng',
  errorFallback: 'Không thể xoá khách hàng này'
})
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Khách hàng"
      description="Danh bạ cư dân — tra cứu, xem lịch sử ticket và đơn hàng."
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Thêm khách"
          @click="openCreateModal"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Tìm kiếm & sắp xếp -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm tên, SĐT, email, mã khách..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="sortValue"
        :items="SORT_OPTIONS"
        class="w-56"
      />
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

    <SharedCrudTableWrapper
      :status="status"
      :error="error"
      :data="data"
      :refresh="refresh"
    >
      <div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm">
        <UTable
          :data="customers"
          :columns="columns"
        >
          <template #code-cell="{ row }">
            <NuxtLink
              :to="`/pmc/customers/${row.original.id}`"
              class="font-mono text-primary-600 hover:text-primary-800 hover:underline"
            >
              {{ row.original.code ?? '—' }}
            </NuxtLink>
          </template>

          <template #full_name-cell="{ row }">
            <NuxtLink
              :to="`/pmc/customers/${row.original.id}`"
              class="font-medium text-slate-900 hover:text-primary-700 hover:underline"
            >
              {{ row.original.full_name }}
            </NuxtLink>
          </template>

          <template #phone-cell="{ row }">
            <span class="font-mono">{{ formatPhone(row.original.phone) }}</span>
          </template>

          <template #email-cell="{ row }">
            {{ row.original.email ?? '—' }}
          </template>

          <template #ticket_count-cell="{ row }">
            <UBadge
              :label="String(row.original.ticket_count)"
              color="primary"
              variant="subtle"
              size="sm"
            />
          </template>

          <template #avg_rating-cell="{ row }">
            <span
              v-if="row.original.avg_rating !== null"
              class="inline-flex items-center gap-1"
            >
              <UIcon
                name="i-lucide-star"
                class="size-4 text-amber-400"
              />
              <span class="font-medium">{{ row.original.avg_rating.toFixed(1) }}</span>
              <span class="text-xs text-[var(--ui-text-muted)]">/ 5</span>
            </span>
            <span
              v-else
              class="text-[var(--ui-text-muted)]"
            >—</span>
          </template>

          <template #last_contacted_at-cell="{ row }">
            <span
              v-if="row.original.last_contacted_at"
              :title="formatDateTime(row.original.last_contacted_at)"
            >
              {{ timeAgo(row.original.last_contacted_at) }}
            </span>
            <span
              v-else
              class="text-[var(--ui-text-muted)]"
            >—</span>
          </template>

          <template #actions-cell="{ row }">
            <SharedCrudTableActions
              :detail-to="`/pmc/customers/${row.original.id}`"
              @edit="handleEditClick(row.original)"
              @delete="openDeleteModal(row.original)"
            />
          </template>
        </UTable>

        <SharedCrudTablePagination
          v-model:page="page"
          :meta="data?.meta"
        />
      </div>
    </SharedCrudTableWrapper>

    <CustomerFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting || isLoadingEdit"
      :api-errors="formApiErrors"
      :error-message="formErrorMessage"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá khách hàng"
      :item-name="deleteTarget?.full_name"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      :checking="isCheckingDelete"
      @confirm="handleDelete"
    />
  </div>
</template>
