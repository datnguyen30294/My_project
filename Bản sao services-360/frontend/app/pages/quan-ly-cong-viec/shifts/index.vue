<script setup lang="ts">
import type {
  CreateShiftRequest,
  ShiftResource,
  ShiftsIndexParams,
  ShiftsIndexStatus
} from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

useHead({ title: 'Quản lý ca làm việc — TNP Service' })

const params = reactive<ShiftsIndexParams & { page?: number }>({
  search: undefined,
  status: undefined,
  type: undefined,
  work_group: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value
  page.value = 1
})

const statusFilter = ref<ShiftsIndexStatus | null>(null)
watch(statusFilter, (val) => {
  params.status = val ?? undefined
  page.value = 1
})

const typeFilter = ref<string | null>(null)
watch(typeFilter, (val) => {
  params.type = val ?? undefined
  page.value = 1
})

const hasFilters = computed(() =>
  !!searchInput.value || !!statusFilter.value || !!typeFilter.value
)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  statusFilter.value = null
  typeFilter.value = null
  page.value = 1
}

interface FilterItem<T> {
  value: T | null
  label: string
}

const statusFilterItems: FilterItem<ShiftsIndexStatus>[] = [
  { value: null, label: 'Tất cả trạng thái' },
  ...SHIFT_STATUS_OPTIONS.map(o => ({ value: o.value as ShiftsIndexStatus, label: o.label }))
]

const typeFilterItems: FilterItem<string>[] = [
  { value: null, label: 'Tất cả kiểu ca' },
  ...SHIFT_TYPE_SUGGESTIONS.map(t => ({ value: t as string, label: t }))
]

const { data, status, error, refresh } = useShiftList(
  computed(() => ({ ...params, page: page.value }))
)
const { data: statsData, pending: statsPending, refresh: refreshStats } = useShiftStats()

const shifts = computed<ShiftResource[]>(() => data.value?.data ?? [])
const stats = computed(() => statsData.value?.data ?? null)

const crud = useCrudModals<ShiftResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors, formErrorMessage,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget
} = crud

async function refreshAll() {
  await Promise.all([refresh(), refreshStats()])
}

const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refreshAll)

function handleFormSubmit(payload: CreateShiftRequest) {
  submitForm(
    () => apiCreateShift(payload),
    () => apiUpdateShift(editTarget.value!.id, payload),
    { create: 'Thêm ca thành công', update: 'Cập nhật ca thành công' }
  )
}

const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  deleteFn: apiDeleteShift,
  successMessage: 'Đã xoá ca',
  errorFallback: 'Không thể xoá ca này'
})
</script>

<template>
  <div class="space-y-4">
    <SharedCrudPageHeader
      title="Quản lý ca làm việc"
      description="Tạo và quản lý các ca làm việc template áp dụng cho lịch việc của nhân sự."
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Thêm ca mới"
          @click="openCreateModal"
        />
      </template>
    </SharedCrudPageHeader>

    <SharedShiftStatsBar
      :stats="stats"
      :pending="statsPending"
    />

    <div class="flex flex-wrap items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo mã hoặc tên ca..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <USelectMenu
        v-model="statusFilter"
        :items="statusFilterItems"
        value-key="value"
        placeholder="Trạng thái"
        class="w-48"
      />
      <USelectMenu
        v-model="typeFilter"
        :items="typeFilterItems"
        value-key="value"
        placeholder="Kiểu ca"
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
        <SharedShiftTable
          :shifts="shifts"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />

        <SharedCrudTablePagination
          v-model:page="page"
          :meta="data?.meta"
        />
      </div>
    </SharedCrudTableWrapper>

    <SharedShiftFormDialog
      v-model:open="showFormModal"
      :mode="formMode"
      :shift="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      :error-message="formErrorMessage"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá ca làm việc"
      :item-name="deleteTarget ? `${deleteTarget.code} — ${deleteTarget.name}` : ''"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      :checking="isCheckingDelete"
      @confirm="handleDelete"
    />
  </div>
</template>
