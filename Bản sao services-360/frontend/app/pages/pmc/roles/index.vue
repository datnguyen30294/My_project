<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  RoleResource,
  RolesIndexParams
} from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

// --- Permissions (for form modal, fetched lazily) ---
const { data: permissionsData, execute: fetchPermissions } = usePermissionList({ immediate: false })
const permissionsFetched = ref(false)
const permissions = computed(() => permissionsData.value?.data ?? [])

// --- List ---
const params = reactive<RolesIndexParams>({
  search: undefined,
  type: undefined,
  is_active: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value
  page.value = 1
})

const typeOptions = [
  { label: 'Mặc định', value: 'default' },
  { label: 'Tùy chỉnh', value: 'custom' }
]

const selectedType = ref<string | undefined>(undefined)

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  type: { ref: selectedType, type: 'string', onInit: (v) => { params.type = v as RolesIndexParams['type'] } },
  page: { ref: page, type: 'number', defaultValue: 1 }
})

watch(selectedType, (val) => {
  if (isInitFromUrl.value) return
  params.type = (val || undefined) as RolesIndexParams['type']
  page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || !!selectedType.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedType.value = undefined
  page.value = 1
}

const { data, status, error, refresh } = useRoleList(
  computed(() => ({ ...params, page: page.value }))
)

const roles = computed(() => data.value?.data ?? [])

const columns: TableColumn<RoleResource>[] = [
  { accessorKey: 'name', header: 'Tên vai trò' },
  { id: 'type', header: 'Loại' },
  { id: 'department', header: 'Phòng ban' },
  { id: 'job_title', header: 'Chức danh' },
  { id: 'is_active', header: 'Trạng thái' },
  { accessorKey: 'description', header: 'Mô tả' },
  stickyRight<RoleResource>({ id: 'actions', header: 'Thao tác' })
]

// --- CRUD ---
const crud = useCrudModals<RoleResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

// Fetch permissions lazily on first modal open
watch(showFormModal, (open) => {
  if (open && !permissionsFetched.value) {
    permissionsFetched.value = true
    fetchPermissions()
  }
})

function handleFormSubmit(formData: { name?: string, description: string | null, is_active: boolean, permission_ids: number[] }) {
  submitForm(
    () => apiCreateRole({ name: formData.name!, description: formData.description, is_active: formData.is_active, permission_ids: formData.permission_ids }),
    () => apiUpdateRole(editTarget.value!.id, { name: formData.name, description: formData.description, is_active: formData.is_active, permission_ids: formData.permission_ids }),
    { create: 'Thêm vai trò thành công', update: 'Cập nhật vai trò thành công' }
  )
}

// --- Delete ---
const { deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  deleteFn: apiDeleteRole,
  successMessage: 'Đã xoá vai trò',
  errorFallback: 'Không thể xoá vai trò này'
})
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Vai trò"
      description="Quản lý vai trò và phân quyền"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Thêm vai trò"
          @click="openCreateModal"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Filters -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm kiếm vai trò..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="selectedType"
        :items="typeOptions"
        placeholder="Loại vai trò"
        class="w-40"
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
          :data="roles"
          :columns="columns"
        >
          <template #type-cell="{ row }">
            <UBadge
              :color="row.original.type?.value === 'default' ? 'info' : 'neutral'"
              variant="subtle"
            >
              {{ row.original.type?.label }}
            </UBadge>
          </template>

          <template #department-cell="{ row }">
            <NuxtLink
              v-if="row.original.department"
              :to="`/pmc/departments/${row.original.department.id}`"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {{ row.original.department.name }}
            </NuxtLink>
            <span v-else>—</span>
          </template>

          <template #job_title-cell="{ row }">
            <NuxtLink
              v-if="row.original.job_title"
              :to="`/pmc/job-titles/${row.original.job_title.id}`"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {{ row.original.job_title.name }}
            </NuxtLink>
            <span v-else>—</span>
          </template>

          <template #is_active-cell="{ row }">
            <SharedStatusBadge
              :active="Boolean(row.original.is_active)"
              inactive-label="Tắt"
            />
          </template>

          <template #description-cell="{ row }">
            {{ row.original.description ?? '—' }}
          </template>

          <template #actions-cell="{ row }">
            <SharedCrudTableActions
              :detail-to="`/pmc/roles/${row.original.id}`"
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

    <RoleFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      :permissions="permissions"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá vai trò"
      :item-name="deleteTarget?.name"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
