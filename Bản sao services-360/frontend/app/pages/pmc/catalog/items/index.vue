<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  CatalogItemResource,
  ItemsIndexParams,
  CatalogItemType,
  CatalogStatus
} from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

// --- Tabs ---
const tabs = [
  { label: 'Vật tư', value: 'material' },
  { label: 'Dịch vụ', value: 'service' },
  { label: 'Dịch vụ tùy chọn', value: 'adhoc' }
]
const activeTab = ref('material')

// --- List ---
const params = reactive<ItemsIndexParams>({
  search: undefined,
  type: 'material' as CatalogItemType,
  supplier_id: undefined,
  service_category_id: undefined,
  status: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value
  page.value = 1
})

const selectedStatus = ref<string | undefined>(undefined)
const selectedSupplierId = ref<number | undefined>(undefined)
const selectedCategoryId = ref<number | undefined>(undefined)
const statusOptions = ACTIVE_STATUS_OPTIONS

// --- Service Categories for filter ---
const { data: categoriesData } = useServiceCategoryList(computed(() => ({ per_page: SELECT_ALL_PER_PAGE, status: 'active' })))
const categoryFilterOptions = computed(() =>
  (categoriesData.value?.data ?? []).map(c => ({ label: c.name, value: c.id }))
)

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  type: { ref: activeTab, type: 'string', onInit: (v) => { params.type = (v as CatalogItemType) || undefined } },
  status: { ref: selectedStatus, type: 'string', onInit: (v) => { params.status = v as CatalogStatus } },
  supplier_id: { ref: selectedSupplierId, type: 'number', onInit: (v) => { params.supplier_id = v as number } }
})

watch(activeTab, (val) => {
  params.type = (val as CatalogItemType) || undefined
  if (val === 'service' || val === 'adhoc') {
    selectedSupplierId.value = undefined
    params.supplier_id = undefined
  }
  if (val !== 'service') {
    selectedCategoryId.value = undefined
    params.service_category_id = undefined
  }
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedCategoryId, (val) => {
  params.service_category_id = val ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedStatus, (val) => {
  params.status = (val as CatalogStatus) ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedSupplierId, (val) => {
  params.supplier_id = val ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || !!selectedStatus.value || !!selectedSupplierId.value || !!selectedCategoryId.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedStatus.value = undefined
  selectedSupplierId.value = undefined
  selectedCategoryId.value = undefined
  page.value = 1
}

const { data, status, error, refresh } = useCatalogItemList(
  computed(() => ({ ...params, page: page.value }))
)

const items = computed(() => (data.value?.data ?? []) as CatalogItemResource[])

const showMaterialFields = computed(() => activeTab.value !== 'service' && activeTab.value !== 'adhoc')

const columns = computed<TableColumn<CatalogItemResource>[]>(() => {
  const cols: TableColumn<CatalogItemResource>[] = [
    { id: 'product', header: 'Sản phẩm' },
    { accessorKey: 'unit', header: 'Đơn vị' },
    { id: 'unit_price', header: showMaterialFields.value ? 'Giá bán' : 'Đơn giá' }
  ]
  if (showMaterialFields.value) {
    cols.push({ id: 'purchase_price', header: 'Giá mua' })
    cols.push({ id: 'supplier', header: 'NCC' })
    cols.push({ id: 'commission_rate', header: 'Hoa Hồng (%)' })
  }
  if (activeTab.value === 'service') {
    cols.push({ id: 'service_category', header: 'Danh mục' })
  }
  cols.push({ id: 'status', header: 'Trạng thái' })
  cols.push({ id: 'is_published', header: 'Công bố' })
  cols.push(stickyRight<CatalogItemResource>({ id: 'actions', header: 'Thao tác' }))
  return cols
})

// --- CRUD ---
const crud = useCrudModals<CatalogItemResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget, openDeleteModal
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

/** Default type for form based on active tab */
const formDefaultType = computed<CatalogItemType | null>(() => {
  if (activeTab.value === 'material' || activeTab.value === 'service') {
    return activeTab.value
  }
  return null
})

function handleFormSubmit(formData: {
  type: CatalogItemType
  code: string
  name: string
  unit: string
  unit_price: number
  purchase_price: number | null
  commission_rate: number | null
  supplier_id: number | null
  service_category_id: number | null
  description: string | null
  content: string | null
  sort_order: number
  price_note: string | null
  is_published: boolean
  is_featured: boolean
}) {
  const categoryId = formData.service_category_id != null ? String(formData.service_category_id) : null
  submitForm(
    () => apiCreateCatalogItem({ ...formData, service_category_id: categoryId }),
    () => apiUpdateCatalogItem(editTarget.value!.id, {
      code: formData.code,
      name: formData.name,
      unit: formData.unit,
      unit_price: formData.unit_price,
      purchase_price: formData.purchase_price,
      commission_rate: formData.commission_rate,
      supplier_id: formData.supplier_id,
      service_category_id: categoryId,
      description: formData.description,
      content: formData.content,
      sort_order: formData.sort_order,
      price_note: formData.price_note,
      is_published: formData.is_published,
      is_featured: formData.is_featured
    }),
    { create: 'Thêm danh mục hàng thành công', update: 'Cập nhật danh mục hàng thành công' }
  )
}

function handleDelete() {
  submitDelete(
    () => apiDeleteCatalogItem(deleteTarget.value!.id),
    { message: 'Đã xoá danh mục hàng' }
  )
}
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Danh mục hàng"
      description="Quản lý vật tư và dịch vụ"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Thêm mới"
          @click="openCreateModal"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Tabs -->
    <div class="mb-4 flex gap-2">
      <UButton
        v-for="tab in tabs"
        :key="tab.value"
        :label="tab.label"
        :variant="activeTab === tab.value ? 'solid' : 'ghost'"
        :color="activeTab === tab.value ? 'primary' : 'neutral'"
        size="sm"
        @click="activeTab = tab.value"
      />
    </div>

    <!-- Filters -->
    <div class="mb-4 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm kiếm..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <SharedCatalogSupplierSelect
        v-if="showMaterialFields"
        v-model="selectedSupplierId"
        placeholder="Lọc NCC"
        class="w-56"
      />
      <USelect
        v-if="activeTab === 'service'"
        v-model="selectedCategoryId"
        :items="categoryFilterOptions"
        value-key="value"
        placeholder="Lọc danh mục"
        class="w-56"
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
          :data="items"
          :columns="columns"
        >
          <template #product-cell="{ row }">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="row.original.image_url ?? undefined"
                :alt="row.original.name"
                size="md"
                icon="i-lucide-package"
              />
              <div class="min-w-0">
                <div class="font-medium text-sm text-gray-900 truncate">
                  {{ row.original.name }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ row.original.code }}
                </div>
              </div>
            </div>
          </template>

          <template #unit_price-cell="{ row }">
            {{ Number(row.original.unit_price).toLocaleString('vi-VN') }}
          </template>

          <template #purchase_price-cell="{ row }">
            {{ row.original.purchase_price ? Number(row.original.purchase_price).toLocaleString('vi-VN') : '—' }}
          </template>

          <template #supplier-cell="{ row }">
            {{ row.original.supplier?.name ?? '—' }}
          </template>

          <template #commission_rate-cell="{ row }">
            {{ row.original.commission_rate ? `${row.original.commission_rate}%` : '—' }}
          </template>

          <template #service_category-cell="{ row }">
            {{ row.original.service_category?.name ?? '—' }}
          </template>

          <template #status-cell="{ row }">
            <SharedStatusBadge :active="row.original.status.value === 'active'" />
          </template>

          <template #is_published-cell="{ row }">
            <UBadge
              :label="row.original.is_published ? 'Đã công bố' : 'Chưa công bố'"
              :color="row.original.is_published ? 'success' : 'neutral'"
              variant="subtle"
              size="sm"
            />
          </template>

          <template #actions-cell="{ row }">
            <SharedCrudTableActions
              :detail-to="`/pmc/catalog/items/${row.original.id}`"
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

    <CatalogItemFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :default-type="formDefaultType"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
      @image-changed="refresh()"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá danh mục hàng"
      :item-name="deleteTarget?.name"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
