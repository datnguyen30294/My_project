<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  ServiceCategoryResource,
  ServiceCategoriesIndexParams,
  CatalogStatus
} from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

// --- List ---
const params = reactive<ServiceCategoriesIndexParams & { page?: number }>({
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
const statusOptions = [
  { label: 'Đang sử dụng', value: 'active' },
  { label: 'Ngưng sử dụng', value: 'inactive' }
]

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  status: { ref: selectedStatus, type: 'string', onInit: (v) => { params.status = v as CatalogStatus } }
})

watch(selectedStatus, (val) => {
  params.status = (val as CatalogStatus) ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || !!selectedStatus.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedStatus.value = undefined
  page.value = 1
}

const { data, status, error, refresh } = useServiceCategoryList(
  computed(() => ({ ...params, page: page.value }))
)

const categories = computed(() => data.value?.data ?? [])

const columns: TableColumn<ServiceCategoryResource>[] = [
  { id: 'image', header: 'Ảnh' },
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'name', header: 'Tên loại dịch vụ' },
  { accessorKey: 'description', header: 'Mô tả' },
  { accessorKey: 'sort_order', header: 'Thứ tự' },
  { id: 'items_count', header: 'Số dịch vụ' },
  { id: 'status', header: 'Trạng thái' },
  stickyRight<ServiceCategoryResource>({ id: 'actions', header: 'Thao tác' })
]

// --- CRUD ---
const crud = useCrudModals<ServiceCategoryResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: {
  name: string
  code: string
  description: string | null
  sort_order: number | null
  status?: string
}) {
  submitForm(
    () => apiCreateServiceCategory({
      name: formData.name,
      code: formData.code,
      description: formData.description,
      sort_order: formData.sort_order
    }),
    () => apiUpdateServiceCategory(editTarget.value!.id, {
      name: formData.name,
      description: formData.description,
      sort_order: formData.sort_order,
      status: formData.status as CatalogStatus
    }),
    { create: 'Thêm loại dịch vụ thành công', update: 'Cập nhật loại dịch vụ thành công' }
  )
}

// --- Delete with pre-check ---
const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteServiceCategory,
  deleteFn: apiDeleteServiceCategory,
  successMessage: 'Đã xoá loại dịch vụ',
  errorFallback: 'Không thể xoá loại dịch vụ này'
})
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Loại dịch vụ"
      description="Quản lý danh mục loại dịch vụ"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Thêm loại dịch vụ"
          @click="openCreateModal"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Filters -->
    <div class="mb-4 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm kiếm tên, mã..."
        class="max-w-sm"
        autocomplete="nope"
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
          :data="categories"
          :columns="columns"
        >
          <template #image-cell="{ row }">
            <div class="size-10 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] flex items-center justify-center overflow-hidden">
              <img
                v-if="row.original.image_url"
                :src="row.original.image_url"
                :alt="row.original.name"
                class="size-full object-cover"
              >
              <UIcon
                v-else
                name="i-lucide-image"
                class="size-5 text-[var(--ui-text-dimmed)]"
              />
            </div>
          </template>

          <template #description-cell="{ row }">
            {{ row.original.description || '—' }}
          </template>

          <template #items_count-cell="{ row }">
            {{ row.original.items_count ?? 0 }}
          </template>

          <template #status-cell="{ row }">
            <SharedStatusBadge :active="row.original.status.value === 'active'" />
          </template>

          <template #actions-cell="{ row }">
            <SharedCrudTableActions
              :detail-to="`/pmc/catalog/categories/${row.original.id}`"
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

    <CatalogServiceCategoryFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá loại dịch vụ"
      :item-name="deleteTarget?.name"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      :checking="isCheckingDelete"
      @confirm="handleDelete"
    />
  </div>
</template>
