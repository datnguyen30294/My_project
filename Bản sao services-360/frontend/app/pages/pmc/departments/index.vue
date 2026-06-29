<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  DepartmentResource,
  DepartmentsIndexParams
} from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

// --- List ---
const params = reactive<DepartmentsIndexParams>({
  project_id: undefined,
  search: undefined,
  parent_id: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value
  page.value = 1
})

const selectedProjectId = ref<number | null>(null)
const selectedParentId = ref<number | null>(null)

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  project_id: { ref: selectedProjectId, type: 'number', onInit: (v) => { params.project_id = v as number } },
  parent_id: { ref: selectedParentId, type: 'number', onInit: (v) => { params.parent_id = v as number } }
})

watch(selectedProjectId, (val) => {
  params.project_id = val ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedParentId, (val) => {
  params.parent_id = val ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || !!selectedProjectId.value || !!selectedParentId.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedProjectId.value = null
  selectedParentId.value = null
  page.value = 1
}

const { data, status, error, refresh } = useDepartmentList(
  computed(() => ({ ...params, page: page.value }))
)

const departments = computed(() => data.value?.data ?? [])

const columns: TableColumn<DepartmentResource>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'name', header: 'Tên phòng ban' },
  { id: 'parent', header: 'Phòng ban cha' },
  { id: 'project', header: 'Dự án' },
  { accessorKey: 'description', header: 'Mô tả' },
  stickyRight<DepartmentResource>({ id: 'actions', header: 'Thao tác' })
]

// --- CRUD ---
const crud = useCrudModals<DepartmentResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget, openDeleteModal
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: { project_id: number | null, code: string, name: string, parent_id: number | null, description: string | null }) {
  submitForm(
    () => apiCreateDepartment(formData),
    () => apiUpdateDepartment(editTarget.value!.id, { project_id: formData.project_id, name: formData.name, parent_id: formData.parent_id, description: formData.description }),
    { create: 'Thêm phòng ban thành công', update: 'Cập nhật phòng ban thành công' }
  )
}

function handleDelete() {
  submitDelete(
    () => apiDeleteDepartment(deleteTarget.value!.id),
    { message: 'Đã xoá phòng ban' }
  )
}
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Phòng ban"
      description="Quản lý danh sách phòng ban"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Thêm phòng ban"
          @click="openCreateModal"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Tìm kiếm -->
    <div class="mb-4 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm kiếm phòng ban..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <SharedProjectSelect
        v-model="selectedProjectId"
        placeholder="Lọc dự án"
        class="w-56"
      />
      <SharedDepartmentParentSelect
        v-model="selectedParentId"
        class="w-56"
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
          :data="departments"
          :columns="columns"
        >
          <template #parent-cell="{ row }">
            <NuxtLink
              v-if="row.original.parent"
              :to="`/pmc/departments/${row.original.parent.id}`"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {{ row.original.parent.name }}
            </NuxtLink>
            <span v-else>—</span>
          </template>

          <template #project-cell="{ row }">
            <NuxtLink
              v-if="row.original.project"
              :to="`/pmc/projects/${row.original.project.id}`"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {{ row.original.project.name }}
            </NuxtLink>
            <span v-else>—</span>
          </template>

          <template #description-cell="{ row }">
            {{ row.original.description ?? '—' }}
          </template>

          <template #actions-cell="{ row }">
            <SharedCrudTableActions
              :detail-to="`/pmc/departments/${row.original.id}`"
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

    <DepartmentFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá phòng ban"
      :item-name="deleteTarget?.name"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
