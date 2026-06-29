<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AccountResource, AccountsIndexParams } from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

// --- List ---
const params = reactive<AccountsIndexParams & { page?: number }>({
  search: undefined,
  department_id: undefined,
  job_title_id: undefined,
  project_id: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value
  page.value = 1
})

// --- Filter dropdowns ---
const filterDepartmentId = ref<number | null>(null)
const filterJobTitleId = ref<number | null>(null)
const filterProjectId = ref<number | null>(null)

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  department_id: { ref: filterDepartmentId, type: 'number', onInit: (v) => { params.department_id = v as number } },
  job_title_id: { ref: filterJobTitleId, type: 'number', onInit: (v) => { params.job_title_id = v as number } },
  project_id: { ref: filterProjectId, type: 'number', onInit: (v) => { params.project_id = v as number } }
})

watch(filterDepartmentId, (val) => {
  params.department_id = val ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

watch(filterJobTitleId, (val) => {
  params.job_title_id = val ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

watch(filterProjectId, (val) => {
  params.project_id = val ?? undefined
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() =>
  !!searchInput.value
  || !!filterDepartmentId.value
  || !!filterJobTitleId.value
  || !!filterProjectId.value
)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  filterDepartmentId.value = null
  filterJobTitleId.value = null
  filterProjectId.value = null
  page.value = 1
}

// --- Data ---
const { data, status, error, refresh } = useAccountList(
  computed(() => ({ ...params, page: page.value }))
)

const accounts = computed(() => data.value?.data ?? [])

const columns: TableColumn<AccountResource>[] = [
  { id: 'avatar', header: 'Avatar' },
  { accessorKey: 'employee_code', header: 'Mã NV' },
  { accessorKey: 'name', header: 'Họ tên' },
  { accessorKey: 'email', header: 'Email' },
  { id: 'gender', header: 'Giới tính' },
  { id: 'department', header: 'Phòng ban' },
  { id: 'job_title', header: 'Chức danh' },
  { id: 'role', header: 'Role' },
  { id: 'is_active', header: 'Trạng thái' },
  { id: 'capability_rating', header: 'Năng lực' },
  { id: 'assignment_status', header: 'Đang giao việc' },
  { id: 'projects', header: 'Dự án' },
  stickyRight<AccountResource>({ id: 'actions', header: 'Thao tác' }, { width: 'w-[160px] min-w-[160px]' })
]

// --- CRUD ---
const crud = useCrudModals<AccountResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget, openDeleteModal
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

// --- Change Password Modal ---
const showPasswordModal = ref(false)
const passwordTarget = ref<AccountResource | null>(null)
const passwordApiErrors = ref<Record<string, string[]>>({})

function openPasswordModal(item: AccountResource) {
  passwordTarget.value = item
  passwordApiErrors.value = {}
  showPasswordModal.value = true
}

// --- Form Submit ---
function handleFormSubmit(formData: {
  email: string
  name: string
  employee_code: string
  gender: string | undefined
  department_ids: number[]
  job_title_id: number | null
  role_id: number | null
  project_ids: number[]
  is_active: boolean
  password: string
  bank_bin: string
  bank_label: string
  bank_account_number: string
  bank_account_name: string
  capability_rating: number | null
}) {
  const bankPayload = {
    bank_bin: formData.bank_bin || null,
    bank_label: formData.bank_label || null,
    bank_account_number: formData.bank_account_number || null,
    bank_account_name: formData.bank_account_name || null
  }

  const ratingPayload = {
    capability_rating: formData.capability_rating != null ? Number(formData.capability_rating) : null
  }

  submitForm(
    () => apiCreateAccount({
      email: formData.email,
      name: formData.name,
      employee_code: formData.employee_code,
      gender: (formData.gender as 'male' | 'female' | 'other') ?? null,
      department_ids: formData.department_ids,
      job_title_id: formData.job_title_id!,
      role_id: formData.role_id!,
      project_ids: formData.project_ids.length ? formData.project_ids : null,
      is_active: formData.is_active,
      password: formData.password || null,
      ...bankPayload,
      ...ratingPayload
    }),
    () => apiUpdateAccount(editTarget.value!.id, {
      name: formData.name,
      gender: (formData.gender as 'male' | 'female' | 'other') ?? null,
      department_ids: formData.department_ids,
      job_title_id: formData.job_title_id!,
      role_id: formData.role_id!,
      project_ids: formData.project_ids.length ? formData.project_ids : null,
      is_active: formData.is_active,
      ...bankPayload,
      ...ratingPayload
    }),
    { create: 'Tạo tài khoản thành công', update: 'Cập nhật tài khoản thành công' }
  )
}

// --- Change Password Submit ---
const toast = useToast()
const isChangingPassword = ref(false)

async function handlePasswordSubmit(formData: { password: string, password_confirmation: string }) {
  passwordApiErrors.value = {}
  if (!passwordTarget.value) return

  isChangingPassword.value = true
  try {
    await apiChangeAccountPassword(passwordTarget.value.id, formData)
    toast.add({ title: 'Đổi mật khẩu thành công', color: 'success' })
    showPasswordModal.value = false
  } catch (err) {
    const errors = getApiValidationErrors(err)
    if (errors) {
      passwordApiErrors.value = errors
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Đổi mật khẩu thất bại'), color: 'error' })
    }
  } finally {
    isChangingPassword.value = false
  }
}

// --- Delete ---
function handleDelete() {
  submitDelete(
    () => apiDeleteAccount(deleteTarget.value!.id),
    { message: 'Xoá tài khoản thành công' }
  )
}
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Tài khoản"
      description="Quản lý tài khoản nhân viên"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Thêm tài khoản"
          @click="openCreateModal"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Tìm kiếm & Lọc -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm kiếm tên, email, mã NV..."
        class="max-w-sm"
        autocomplete="nope"
        @update:model-value="onSearch"
      />
      <div class="w-48">
        <SharedDepartmentSelect
          v-model="filterDepartmentId"
          placeholder="Tất cả phòng ban"
        />
      </div>
      <div class="w-48">
        <SharedJobTitleSelect
          v-model="filterJobTitleId"
          placeholder="Tất cả chức danh"
        />
      </div>
      <div class="w-48">
        <SharedProjectSelect
          v-model="filterProjectId"
          placeholder="Tất cả dự án"
        />
      </div>
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
          :data="accounts"
          :columns="columns"
        >
          <template #avatar-cell="{ row }">
            <UAvatar
              :src="row.original.avatar_url ?? undefined"
              :alt="row.original.name"
              size="sm"
            />
          </template>

          <template #gender-cell="{ row }">
            {{ row.original.gender?.label ?? '—' }}
          </template>

          <template #department-cell="{ row }">
            <div
              v-if="row.original.departments?.length"
              class="flex flex-wrap gap-1"
            >
              <NuxtLink
                v-for="dept in row.original.departments"
                :key="dept.id"
                :to="`/pmc/departments/${dept.id}`"
              >
                <UBadge
                  :label="dept.name"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  class="cursor-pointer hover:opacity-80"
                />
              </NuxtLink>
            </div>
            <span
              v-else
              class="text-(--ui-text-muted)"
            >—</span>
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

          <template #role-cell="{ row }">
            <NuxtLink
              v-if="row.original.role"
              :to="`/pmc/roles/${row.original.role.id}`"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {{ row.original.role.name }}
            </NuxtLink>
            <span v-else>—</span>
          </template>

          <template #is_active-cell="{ row }">
            <SharedStatusBadge :active="Boolean(row.original.is_active)" />
          </template>

          <template #capability_rating-cell="{ row }">
            <SharedCapabilityRatingBadge
              :rating="row.original.capability_rating"
              show-when-null
              null-label="—"
            />
          </template>

          <template #assignment_status-cell="{ row }">
            <UTooltip
              v-if="row.original.has_active_assignment"
              :text="`Đang xử lý ${row.original.active_assignment_count} ticket chưa hoàn thành`"
            >
              <UBadge
                :label="`Đang xử lý (${row.original.active_assignment_count})`"
                color="warning"
                variant="subtle"
                size="sm"
                icon="i-lucide-loader-circle"
              />
            </UTooltip>
            <UBadge
              v-else
              label="Rảnh"
              color="neutral"
              variant="subtle"
              size="sm"
            />
          </template>

          <template #projects-cell="{ row }">
            <div
              v-if="row.original.projects?.length"
              class="flex flex-wrap gap-1"
            >
              <NuxtLink
                v-for="project in row.original.projects"
                :key="project.id"
                :to="`/pmc/projects/${project.id}`"
              >
                <UBadge
                  :label="project.name"
                  color="primary"
                  variant="subtle"
                  size="sm"
                  class="cursor-pointer hover:opacity-80"
                />
              </NuxtLink>
            </div>
            <span
              v-else
              class="text-(--ui-text-muted)"
            >—</span>
          </template>

          <template #actions-cell="{ row }">
            <SharedCrudTableActions
              :detail-to="`/pmc/accounts/${row.original.id}`"
              @edit="openEditModal(row.original)"
              @delete="openDeleteModal(row.original)"
            >
              <template #extra>
                <UButton
                  icon="i-lucide-key-round"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  title="Đổi mật khẩu"
                  @click="openPasswordModal(row.original)"
                />
              </template>
            </SharedCrudTableActions>
          </template>
        </UTable>

        <SharedCrudTablePagination
          v-model:page="page"
          :meta="data?.meta"
        />
      </div>
    </SharedCrudTableWrapper>

    <!-- Modals -->
    <AccountFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
      @avatar-changed="refresh()"
    />

    <AccountChangePasswordModal
      v-model:open="showPasswordModal"
      :item="passwordTarget"
      :loading="isChangingPassword"
      :api-errors="passwordApiErrors"
      @submit="handlePasswordSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá tài khoản"
      :item-name="deleteTarget?.name"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
