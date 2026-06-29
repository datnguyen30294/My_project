<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  ProjectResource,
  ProjectsIndexParams
} from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

// --- List ---
const params = reactive<ProjectsIndexParams>({
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

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  status: { ref: selectedStatus, type: 'string', onInit: (v) => { params.status = v as ProjectsIndexParams['status'] } }
})

watch(selectedStatus, (val) => {
  params.status = (val || undefined) as ProjectsIndexParams['status']
  if (!isInitFromUrl.value) page.value = 1
})

const statusFilterOptions = [
  { label: 'Đang quản lý', value: 'managing' },
  { label: 'Đã dừng', value: 'stopped' }
]

const hasFilters = computed(() => !!searchInput.value || !!selectedStatus.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedStatus.value = undefined
  page.value = 1
}

const { data, status, error, refresh } = useProjectList(
  computed(() => ({ ...params, page: page.value }))
)

const projects = computed(() => data.value?.data ?? [])

const columns: TableColumn<ProjectResource>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'name', header: 'Tên' },
  { id: 'address', header: 'Địa chỉ' },
  { id: 'status', header: 'Trạng thái' },
  stickyRight<ProjectResource>({ id: 'actions', header: 'Thao tác' })
]

// --- CRUD ---
const crud = useCrudModals<ProjectResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget, openDeleteModal
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: { code: string, name: string, address: string | null, status: string }) {
  submitForm(
    () => apiCreateProject({ code: formData.code, name: formData.name, address: formData.address, status: formData.status as 'managing' | 'stopped' }),
    () => apiUpdateProject(editTarget.value!.id, { name: formData.name, address: formData.address, status: formData.status as 'managing' | 'stopped' }),
    { create: 'Thêm dự án thành công', update: 'Cập nhật dự án thành công' }
  )
}

function handleDelete() {
  submitDelete(
    () => apiDeleteProject(deleteTarget.value!.id),
    { message: 'Đã xoá dự án' }
  )
}
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Dự án"
      description="Quản lý danh mục dự án (khu đô thị)"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Thêm dự án"
          @click="openCreateModal"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Tìm kiếm & Lọc -->
    <div class="mb-4 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm kiếm dự án..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="selectedStatus"
        :items="statusFilterOptions"
        placeholder="Trạng thái"
        class="w-48"
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
          :data="projects"
          :columns="columns"
        >
          <template #address-cell="{ row }">
            {{ row.original.address ?? '—' }}
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :label="row.original.status.label"
              :color="row.original.status.value === 'managing' ? 'success' : 'error'"
              variant="subtle"
              size="sm"
            />
          </template>

          <template #actions-cell="{ row }">
            <SharedCrudTableActions
              :detail-to="`/pmc/projects/${row.original.id}`"
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

    <ProjectFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá dự án"
      :item-name="deleteTarget?.name"
      description="Tất cả nhân viên đã gán vào dự án này cũng sẽ bị gỡ khỏi dự án."
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
