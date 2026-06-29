<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  CatalogSupplierResource,
  SuppliersIndexParams,
  SupplierStatus
} from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

// --- List ---
const params = reactive<SuppliersIndexParams>({
  search: undefined,
  status: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value
  page.value = 1
})

const selectedStatus = ref<string | undefined>(undefined)
const statusOptions = ACTIVE_STATUS_OPTIONS

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  status: { ref: selectedStatus, type: 'string', onInit: (v) => { params.status = v as SupplierStatus } }
})

watch(selectedStatus, (val) => {
  params.status = (val as SupplierStatus) ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || !!selectedStatus.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedStatus.value = undefined
  page.value = 1
}

const { data, status, error, refresh } = useCatalogSupplierList(
  computed(() => ({ ...params, page: page.value }))
)

const suppliers = computed(() => data.value?.data ?? [])

const columns: TableColumn<CatalogSupplierResource>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'name', header: 'Tên NCC' },
  { accessorKey: 'contact', header: 'Liên hệ' },
  { accessorKey: 'phone', header: 'SĐT' },
  { id: 'commission_rate', header: 'Hoa hồng (%)' },
  { id: 'status', header: 'Trạng thái' },
  stickyRight<CatalogSupplierResource>({ id: 'actions', header: 'Thao tác' })
]

// --- CRUD ---
const crud = useCrudModals<CatalogSupplierResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: {
  name: string
  code: string
  contact: string | null
  phone: string | null
  address: string | null
  email: string | null
  commission_rate: number | null
  status?: string
}) {
  submitForm(
    () => apiCreateCatalogSupplier(formData),
    () => apiUpdateCatalogSupplier(editTarget.value!.id, {
      name: formData.name,
      contact: formData.contact,
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      commission_rate: formData.commission_rate,
      status: formData.status as 'active' | 'inactive'
    }),
    { create: 'Thêm nhà cung cấp thành công', update: 'Cập nhật nhà cung cấp thành công' }
  )
}

// --- Delete with pre-check ---
const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteCatalogSupplier,
  deleteFn: apiDeleteCatalogSupplier,
  successMessage: 'Đã xoá nhà cung cấp',
  errorFallback: 'Không thể xoá nhà cung cấp này'
})
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Nhà cung cấp"
      description="Quản lý danh sách nhà cung cấp"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Thêm NCC"
          @click="openCreateModal"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Filters -->
    <div class="mb-4 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm kiếm NCC..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="selectedStatus"
        :items="statusOptions"
        placeholder="Trạng thái"
        class="w-48"
        value-key="value"
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
          :data="suppliers"
          :columns="columns"
        >
          <template #contact-cell="{ row }">
            {{ row.original.contact ?? '—' }}
          </template>

          <template #phone-cell="{ row }">
            {{ row.original.phone ?? '—' }}
          </template>

          <template #commission_rate-cell="{ row }">
            {{ row.original.commission_rate ? `${row.original.commission_rate}%` : '—' }}
          </template>

          <template #status-cell="{ row }">
            <SharedStatusBadge :active="row.original.status.value === 'active'" />
          </template>

          <template #actions-cell="{ row }">
            <SharedCrudTableActions
              :detail-to="`/pmc/catalog/suppliers/${row.original.id}`"
              @edit="openEditModal(row.original)"
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

    <CatalogSupplierFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá nhà cung cấp"
      :item-name="deleteTarget?.name"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      :checking="isCheckingDelete"
      @confirm="handleDelete"
    />
  </div>
</template>
