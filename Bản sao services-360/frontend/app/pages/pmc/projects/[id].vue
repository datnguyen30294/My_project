<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { DepartmentResource, ProjectResource, ProjectResourceAccountsItem } from '#api/generated/laravel'
import type { SlotDetailParams, TeamScheduleParams } from '~/composables/api/useScheduleSlots'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = computed(() => Number(route.params.id))
const toast = useToast()

const { data, status, error, refresh } = useProjectDetail(id)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => data.value?.data?.name ?? null))

const project = computed(() => data.value?.data ?? null)

const accounts = computed(() => project.value?.accounts ?? [])

const accountColumns: TableColumn<ProjectResourceAccountsItem>[] = [
  { accessorKey: 'employee_code', header: 'Mã NV' },
  { accessorKey: 'full_name', header: 'Họ tên' },
  { accessorKey: 'email', header: 'Email' },
  { id: 'department', header: 'Phòng ban' },
  { id: 'job_title', header: 'Chức danh' }
]

// --- CRUD ---
const crud = useCrudModals<ProjectResource>()
const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget, openDeleteModal } = crud
const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: { code: string, name: string, address: string | null, status: string }) {
  submitForm(
    null,
    () => apiUpdateProject(editTarget.value!.id, { name: formData.name, address: formData.address, status: formData.status as 'managing' | 'stopped' }),
    { update: 'Cập nhật dự án thành công' }
  )
}

function handleDelete() {
  submitDelete(
    () => apiDeleteProject(deleteTarget.value!.id),
    { message: 'Đã xoá dự án', navigateAfter: '/pmc/projects' }
  )
}

// --- Sync Members ---
const showMemberModal = ref(false)
const selectedAccountIds = ref<number[]>([])
const isSyncing = ref(false)

function openMemberModal() {
  selectedAccountIds.value = accounts.value.map(a => a.id)
  showMemberModal.value = true
}

async function handleSyncMembers() {
  isSyncing.value = true
  try {
    await apiSyncProjectMembers(id.value, selectedAccountIds.value)
    showMemberModal.value = false
    toast.add({ title: 'Cập nhật nhân viên thành công', color: 'success' })
    refresh()
  } catch {
    toast.add({ title: 'Có lỗi xảy ra', color: 'error' })
  } finally {
    isSyncing.value = false
  }
}

// --- Phòng ban (scoped to current project) ---
const departmentParams = computed(() => ({
  project_id: id.value,
  per_page: SELECT_ALL_PER_PAGE
}))

const {
  data: departmentData,
  status: departmentStatus,
  error: departmentError,
  refresh: refreshDepartments
} = useDepartmentList(departmentParams)

const departments = computed(() => departmentData.value?.data ?? [])

const departmentColumns: TableColumn<DepartmentResource>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'name', header: 'Tên phòng ban' },
  { id: 'parent', header: 'Phòng ban cha' },
  { accessorKey: 'description', header: 'Mô tả' },
  stickyRight<DepartmentResource>({ id: 'actions', header: 'Thao tác' })
]

const departmentCrud = useCrudModals<DepartmentResource>()
const {
  showFormModal: showDepartmentFormModal,
  formMode: departmentFormMode,
  editTarget: departmentEditTarget,
  formApiErrors: departmentFormApiErrors,
  openCreateModal: openCreateDepartmentModal,
  openEditModal: openEditDepartmentModal,
  showDeleteModal: showDepartmentDeleteModal,
  deleteTarget: departmentDeleteTarget,
  openDeleteModal: openDeleteDepartmentModal
} = departmentCrud
const {
  isSubmitting: isSubmittingDepartment,
  submitForm: submitDepartmentForm,
  isDeleting: isDeletingDepartment,
  submitDelete: submitDepartmentDelete
} = useCrudSubmit(departmentCrud, refreshDepartments)

function handleDepartmentSubmit(formData: { project_id: number | null, code: string, name: string, parent_id: number | null, description: string | null }) {
  submitDepartmentForm(
    () => apiCreateDepartment({ ...formData, project_id: id.value }),
    () => apiUpdateDepartment(departmentEditTarget.value!.id, {
      project_id: id.value,
      name: formData.name,
      parent_id: formData.parent_id,
      description: formData.description
    }),
    { create: 'Thêm phòng ban thành công', update: 'Cập nhật phòng ban thành công' }
  )
}

function handleDepartmentDelete() {
  submitDepartmentDelete(
    () => apiDeleteDepartment(departmentDeleteTarget.value!.id),
    { message: 'Đã xoá phòng ban' }
  )
}

// --- Lịch ca kíp (timesheet of this project) ---
const scheduleMonth = ref(currentYearMonth())

const scheduleParams = computed<TeamScheduleParams>(() => ({
  month: scheduleMonth.value,
  project_id: id.value,
  strict_project: true
}))

const {
  data: scheduleData,
  status: scheduleStatus,
  error: scheduleError
} = useTeamSchedule(scheduleParams)

const schedulePayload = computed(() => scheduleData.value?.data ?? null)

const slotDrawerOpen = ref(false)
const slotDrawerParams = ref<SlotDetailParams | null>(null)

function openSlotDrawer(params: { account_id: number, date: string, shift_id: number }) {
  slotDrawerParams.value = params
  slotDrawerOpen.value = true
}

// --- BQT bank modal ---
const showBqtBankModal = ref(false)
</script>

<template>
  <div>
    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="space-y-4"
    >
      <USkeleton class="h-8 w-48" />
      <USkeleton class="h-64 w-full" />
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <!-- Content -->
    <div v-else-if="project">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            @click="navigateTo('/pmc/projects')"
          />
          <div>
            <h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">
              {{ project.name }}
            </h1>
            <p class="mt-1 text-sm text-[var(--ui-text-muted)]">
              Mã: {{ project.code }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-pencil"
            label="Sửa"
            variant="outline"
            @click="openEditModal(project)"
          />
          <UButton
            icon="i-lucide-trash-2"
            label="Xoá"
            color="error"
            variant="outline"
            @click="openDeleteModal(project)"
          />
        </div>
      </div>

      <!-- Project Info -->
      <div class="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6 space-y-4">
        <SharedFieldDisplay label="Mã dự án">
          <span class="font-medium">{{ project.code }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Tên dự án">
          <span class="font-medium">{{ project.name }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Địa chỉ">
          <span class="font-medium">{{ project.address ?? '—' }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Trạng thái">
          <UBadge
            :label="project.status.label"
            :color="project.status.value === 'managing' ? 'success' : 'error'"
            variant="subtle"
            size="sm"
          />
        </SharedFieldDisplay>
      </div>

      <!-- BQT Bank Account -->
      <div class="mt-6 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold text-[var(--ui-text-highlighted)]">
              Tài khoản Ban quản trị
            </h2>
            <p class="mt-0.5 text-xs text-[var(--ui-text-muted)]">
              Dùng để in QR chuyển khoản hoa hồng BQT trên trang Tổng hợp hoa hồng.
            </p>
          </div>
          <UButton
            icon="i-lucide-pencil"
            :label="project.bqt_bank ? 'Sửa' : 'Cấu hình'"
            variant="outline"
            @click="showBqtBankModal = true"
          />
        </div>

        <template v-if="project.bqt_bank">
          <SharedFieldDisplay label="Ngân hàng">
            <span class="font-medium">{{ project.bqt_bank.label || '—' }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Số tài khoản">
            <span class="font-mono">{{ project.bqt_bank.account_number }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Chủ tài khoản">
            <span class="uppercase">{{ project.bqt_bank.account_name }}</span>
          </SharedFieldDisplay>
        </template>
        <p
          v-else
          class="text-sm text-[var(--ui-text-muted)] italic"
        >
          Chưa cấu hình tài khoản BQT cho dự án này.
        </p>
      </div>

      <!-- Employee List -->
      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-[var(--ui-text-highlighted)]">
            Danh sách nhân viên
          </h2>
          <UButton
            icon="i-lucide-user-plus"
            label="Quản lý nhân viên"
            variant="outline"
            @click="openMemberModal"
          />
        </div>

        <template v-if="accounts.length > 0">
          <UTable
            :data="accounts"
            :columns="accountColumns"
            class="border border-[var(--ui-border)] rounded-lg"
          >
            <template #employee_code-cell="{ row }">
              {{ row.original.employee_code ?? '—' }}
            </template>

            <template #full_name-cell="{ row }">
              {{ row.original.full_name ?? '—' }}
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
          </UTable>
        </template>

        <p
          v-else
          class="text-sm text-[var(--ui-text-muted)] italic"
        >
          Chưa có nhân viên nào trong dự án.
        </p>
      </div>

      <!-- Phòng ban -->
      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-[var(--ui-text-highlighted)]">
            Phòng ban
          </h2>
          <UButton
            icon="i-lucide-plus"
            label="Thêm phòng ban"
            @click="openCreateDepartmentModal"
          />
        </div>

        <UAlert
          v-if="departmentError"
          color="error"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="Không tải được danh sách phòng ban"
          :description="departmentError.message"
        />

        <div
          v-else-if="departmentStatus === 'pending'"
          class="space-y-2"
        >
          <USkeleton
            v-for="n in 3"
            :key="n"
            class="h-10 w-full"
          />
        </div>

        <template v-else-if="departments.length > 0">
          <UTable
            :data="departments"
            :columns="departmentColumns"
            class="border border-[var(--ui-border)] rounded-lg"
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

            <template #description-cell="{ row }">
              {{ row.original.description ?? '—' }}
            </template>

            <template #actions-cell="{ row }">
              <SharedCrudTableActions
                :detail-to="`/pmc/departments/${row.original.id}`"
                @edit="openEditDepartmentModal(row.original)"
                @delete="openDeleteDepartmentModal(row.original)"
              />
            </template>
          </UTable>
        </template>

        <p
          v-else
          class="text-sm text-[var(--ui-text-muted)] italic"
        >
          Chưa có phòng ban nào trong dự án.
        </p>
      </div>

      <!-- Lịch ca kíp -->
      <div class="mt-8 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-[var(--ui-text-highlighted)]">
              Lịch ca kíp
            </h2>
            <p class="mt-0.5 text-sm text-[var(--ui-text-muted)]">
              Ma trận ca × ngày của nhân sự thuộc dự án này trong tháng
            </p>
          </div>
          <UFormField label="Tháng">
            <ScheduleMonthPicker v-model="scheduleMonth" />
          </UFormField>
        </div>

        <UAlert
          v-if="scheduleError"
          color="error"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="Không tải được lịch ca kíp"
          :description="scheduleError.message"
        />

        <div
          v-else-if="scheduleStatus === 'pending'"
          class="flex flex-col gap-1 rounded-xl border border-[var(--ui-border)] bg-white p-2"
        >
          <USkeleton
            v-for="n in 4"
            :key="n"
            class="h-[72px] w-full"
          />
        </div>

        <ScheduleTeamMatrixTable
          v-else
          :payload="schedulePayload"
          @click-slot="openSlotDrawer"
        />

        <ScheduleSlotDetailDrawer
          v-model:open="slotDrawerOpen"
          :params="slotDrawerParams"
        />
      </div>
    </div>

    <ProjectFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isUpdating"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <ProjectBqtBankModal
      v-if="project"
      v-model:open="showBqtBankModal"
      :project-id="id"
      :initial="{
        bqt_bank_bin: project.bqt_bank?.bin ?? null,
        bqt_bank_name: project.bqt_bank?.label ?? null,
        bqt_account_number: project.bqt_bank?.account_number ?? null,
        bqt_account_holder: project.bqt_bank?.account_name ?? null
      }"
      @saved="refresh()"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá dự án"
      :item-name="deleteTarget?.name"
      description="Tất cả nhân viên đã gán vào dự án này cũng sẽ bị gỡ khỏi dự án."
      :loading="isDeleting"
      @confirm="handleDelete"
    />

    <DepartmentFormModal
      v-model:open="showDepartmentFormModal"
      :mode="departmentFormMode"
      :item="departmentEditTarget"
      :loading="isSubmittingDepartment"
      :api-errors="departmentFormApiErrors"
      :locked-project-id="id"
      @submit="handleDepartmentSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDepartmentDeleteModal"
      title="Xoá phòng ban"
      :item-name="departmentDeleteTarget?.name"
      :loading="isDeletingDepartment"
      @confirm="handleDepartmentDelete"
    />

    <!-- Sync Members Modal -->
    <UModal
      v-model:open="showMemberModal"
      title="Quản lý nhân viên"
      :ui="{ content: 'sm:max-w-lg' }"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-[var(--ui-text-muted)]">
            Chọn nhân viên để gán vào dự án. Nhân viên không được chọn sẽ bị gỡ khỏi dự án.
          </p>
          <SharedAccountMultiSelect v-model="selectedAccountIds" />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Huỷ"
            color="neutral"
            variant="outline"
            @click="showMemberModal = false"
          />
          <UButton
            label="Lưu"
            :loading="isSyncing"
            @click="handleSyncMembers"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
