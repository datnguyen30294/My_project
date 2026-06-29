<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  TenantAccountResource,
  TenantAccountIndexParams,
  TenantAccountOptions200Data,
  CreateTenantAccountRequest,
  UpdateTenantAccountRequest
} from '#api/generated/laravel'
import type { TenantAccountFormPayload } from '~/components/tenant/TenantAccountFormModal.vue'
import {
  useTenantAccountList,
  useTenantAccountOptions,
  apiCreateTenantAccount,
  apiUpdateTenantAccount
} from '~/composables/api/useTenantAccounts'

interface Props {
  tenantId: string
}

const props = defineProps<Props>()

const tenantId = computed(() => props.tenantId)

// ─── List ──────────────────────────────────────────────────────
const params = reactive<TenantAccountIndexParams>({
  search: undefined,
  is_active: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const activeFilter = ref<'all' | 'active' | 'inactive'>('all')
function applyActiveFilter(value: 'all' | 'active' | 'inactive') {
  activeFilter.value = value
  params.is_active = value === 'all' ? undefined : value === 'active'
  page.value = 1
}

const { data, status, error, refresh } = useTenantAccountList(
  tenantId,
  computed(() => ({ ...params, page: page.value }))
)

const accounts = computed<TenantAccountResource[]>(() => data.value?.data ?? [])

// ─── Form options (riêng từng tenant) ──────────────────────────
const { data: optionsData } = useTenantAccountOptions(tenantId)

const formOptions = computed<TenantAccountOptions200Data>(() =>
  optionsData.value?.data ?? { departments: [], job_titles: [], roles: [] }
)

// ─── Table ─────────────────────────────────────────────────────
const columns: TableColumn<TenantAccountResource>[] = [
  { accessorKey: 'name', header: 'Họ tên' },
  { accessorKey: 'email', header: 'Email' },
  { id: 'departments', header: 'Phòng ban' },
  { id: 'job_title', header: 'Chức danh' },
  { id: 'role', header: 'Vai trò' },
  { id: 'is_active', header: 'Trạng thái' },
  { id: 'actions', header: 'Thao tác' }
]

function departmentLabel(account: TenantAccountResource): string {
  return (account.departments ?? []).map(d => d.name).join(', ')
}

// ─── CRUD ──────────────────────────────────────────────────────
const crud = useCrudModals<TenantAccountResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal
} = crud

const toast = useToast()
const isSubmitting = ref(false)

/**
 * Map mã lỗi nghiệp vụ (BusinessException) sang lỗi inline theo trường.
 * BE không dùng được Rule::unique/exists (chạy ở central context) nên
 * email trùng / FK không tồn tại trả về dưới dạng error_code.
 */
const BUSINESS_ERROR_FIELDS: Record<string, { field: string, message: string }> = {
  EMAIL_ALREADY_EXISTS: { field: 'email', message: 'Email đã tồn tại.' },
  DEPARTMENT_NOT_FOUND: { field: 'department_ids', message: 'Phòng ban không tồn tại.' },
  JOB_TITLE_NOT_FOUND: { field: 'job_title_id', message: 'Chức danh không tồn tại.' },
  ROLE_NOT_FOUND: { field: 'role_id', message: 'Vai trò không tồn tại.' }
}

function handleSubmitError(err: unknown) {
  const validationErrors = getApiValidationErrors(err)
  if (validationErrors) {
    formApiErrors.value = validationErrors
    return
  }

  const code = getApiErrorCode(err)
  const mapped = code ? BUSINESS_ERROR_FIELDS[code] : undefined
  if (mapped) {
    formApiErrors.value = { [mapped.field]: [mapped.message] }
    return
  }

  toast.add({
    title: getApiErrorMessage(err, 'Lưu tài khoản thất bại'),
    color: 'error',
    icon: 'i-lucide-alert-circle'
  })
}

async function handleFormSubmit(formData: TenantAccountFormPayload) {
  const isCreate = formMode.value === 'create'
  formApiErrors.value = {}
  isSubmitting.value = true

  try {
    if (isCreate) {
      await apiCreateTenantAccount(tenantId.value, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department_ids: formData.department_ids,
        job_title_id: formData.job_title_id!,
        role_id: formData.role_id!,
        is_active: formData.is_active
      } as CreateTenantAccountRequest)
      toast.add({ title: 'Thêm tài khoản thành công', color: 'success' })
    } else {
      await apiUpdateTenantAccount(tenantId.value, editTarget.value!.id, {
        name: formData.name,
        email: formData.email,
        department_ids: formData.department_ids,
        job_title_id: formData.job_title_id!,
        role_id: formData.role_id!,
        is_active: formData.is_active,
        ...(formData.password ? { password: formData.password } : {})
      } as UpdateTenantAccountRequest)
      toast.add({ title: 'Cập nhật tài khoản thành công', color: 'success' })
    }
    await refresh()
    showFormModal.value = false
  } catch (err) {
    handleSubmitError(err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <SharedSectionCard title="Quản lý tài khoản">
    <template #header-actions>
      <UButton
        icon="i-lucide-plus"
        label="Thêm tài khoản"
        size="sm"
        @click="openCreateModal"
      />
    </template>

    <!-- Search + Filters -->
    <div class="mb-4 flex items-center gap-3 flex-wrap">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo họ tên, email..."
        class="max-w-xs"
        @update:model-value="onSearch"
      />

      <UButtonGroup>
        <UButton
          :color="activeFilter === 'all' ? 'primary' : 'neutral'"
          :variant="activeFilter === 'all' ? 'solid' : 'outline'"
          size="sm"
          label="Tất cả"
          @click="applyActiveFilter('all')"
        />
        <UButton
          :color="activeFilter === 'active' ? 'primary' : 'neutral'"
          :variant="activeFilter === 'active' ? 'solid' : 'outline'"
          size="sm"
          label="Hoạt động"
          @click="applyActiveFilter('active')"
        />
        <UButton
          :color="activeFilter === 'inactive' ? 'primary' : 'neutral'"
          :variant="activeFilter === 'inactive' ? 'solid' : 'outline'"
          size="sm"
          label="Đã tắt"
          @click="applyActiveFilter('inactive')"
        />
      </UButtonGroup>
    </div>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải danh sách tài khoản. Vui lòng thử lại."
      class="mb-4"
    >
      <template #actions>
        <UButton
          label="Thử lại"
          color="error"
          variant="soft"
          size="xs"
          icon="i-lucide-refresh-cw"
          @click="refresh()"
        />
      </template>
    </UAlert>

    <div class="border border-slate-200 rounded-xl overflow-hidden">
      <UTable
        :data="accounts"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #departments-cell="{ row }">
          <span
            v-if="departmentLabel(row.original)"
            class="text-sm text-slate-700"
          >{{ departmentLabel(row.original) }}</span>
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #job_title-cell="{ row }">
          <span
            v-if="row.original.job_title"
            class="text-sm text-slate-700"
          >{{ row.original.job_title.name }}</span>
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #role-cell="{ row }">
          <span
            v-if="row.original.role"
            class="text-sm text-slate-700"
          >{{ row.original.role.name }}</span>
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #is_active-cell="{ row }">
          <UBadge
            :color="row.original.is_active ? 'success' : 'neutral'"
            variant="subtle"
            :label="row.original.is_active ? 'Hoạt động' : 'Tắt'"
          />
        </template>

        <template #actions-cell="{ row }">
          <UButton
            icon="i-lucide-pencil"
            label="Sửa"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="openEditModal(row.original)"
          />
        </template>

        <template #empty>
          <div class="flex flex-col items-center gap-3 py-8">
            <UIcon
              name="i-lucide-users"
              class="size-10 text-slate-300"
            />
            <p class="text-sm text-slate-500">
              Tenant chưa có tài khoản nào.
            </p>
            <UButton
              icon="i-lucide-plus"
              label="Thêm tài khoản"
              size="sm"
              @click="openCreateModal"
            />
          </div>
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>

    <TenantAccountFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :options="formOptions"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />
  </SharedSectionCard>
</template>
