<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  JobTitleResource,
  JobTitlesIndexParams
} from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

// --- List ---
const params = reactive<JobTitlesIndexParams>({
  project_id: undefined,
  search: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value
  page.value = 1
})

const selectedProjectId = ref<number | null>(null)

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  project_id: { ref: selectedProjectId, type: 'number', onInit: (v) => { params.project_id = v as number } }
})

watch(selectedProjectId, (val) => {
  params.project_id = val ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || !!selectedProjectId.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedProjectId.value = null
  page.value = 1
}

const { data, status, error, refresh } = useJobTitleList(
  computed(() => ({ ...params, page: page.value }))
)

const jobTitles = computed(() => data.value?.data ?? [])

const columns: TableColumn<JobTitleResource>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'name', header: 'Tên' },
  { id: 'project', header: 'Dự án' },
  { accessorKey: 'description', header: 'Mô tả' },
  stickyRight<JobTitleResource>({ id: 'actions', header: 'Thao tác' })
]

// --- CRUD ---
const crud = useCrudModals<JobTitleResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: { project_id: number | null, code: string, name: string, description: string | null }) {
  submitForm(
    () => apiCreateJobTitle(formData),
    () => apiUpdateJobTitle(editTarget.value!.id, { project_id: formData.project_id, name: formData.name, description: formData.description }),
    { create: 'Thêm chức danh thành công', update: 'Cập nhật chức danh thành công' }
  )
}

// --- Delete with pre-check ---
const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteJobTitle,
  deleteFn: apiDeleteJobTitle,
  successMessage: 'Đã xoá chức danh',
  errorFallback: 'Không thể xoá chức danh này'
})
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Chức danh"
      description="Quản lý danh mục chức danh"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Thêm chức danh"
          @click="openCreateModal"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Tìm kiếm -->
    <div class="mb-4 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm kiếm chức danh..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <SharedProjectSelect
        v-model="selectedProjectId"
        placeholder="Lọc dự án"
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
          :data="jobTitles"
          :columns="columns"
        >
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
              :detail-to="`/pmc/job-titles/${row.original.id}`"
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

    <JobTitleFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá chức danh"
      :item-name="deleteTarget?.name"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      :checking="isCheckingDelete"
      @confirm="handleDelete"
    />
  </div>
</template>
