<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  CreatePartnerPayload,
  ListPartnersParams,
  PartnerListItem,
  PartnerStatusValue,
  UpdatePartnerPayload
} from '~/composables/api/usePartners'
import {
  apiCreatePartner,
  apiDeletePartner,
  apiProvisionPartner,
  apiUpdatePartner,
  partnerStatusBadgeColor,
  usePlatformPartnerList,
  usePlatformPartnerStats
} from '~/composables/api/usePartners'
import type { VendorActionType } from '~/composables/useVendorActions'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Quản lý Vendor - Thần Nông' })

const DETAIL_BASE = '/platform/quan-ly-van-hanh/quan-ly-vendor'

// ─── List + filters ────────────────────────────────────────────

const params = reactive<ListPartnersParams>({
  search: undefined,
  status: undefined,
  owner_source: undefined,
  include: 'stats',
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const statusItems: { label: string, value: PartnerStatusValue | undefined }[] = [
  { label: 'Trạng thái: Tất cả', value: undefined },
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đang hoạt động', value: 'active' },
  { label: 'Đã vô hiệu', value: 'suspended' }
]

const ownerSourceItems: { label: string, value: 'platform' | 'tenant' | undefined }[] = [
  { label: 'Người tạo: Tất cả', value: undefined },
  { label: 'Platform TNP', value: 'platform' },
  { label: 'Công ty vận hành', value: 'tenant' }
]

watch(() => params.status, () => {
  page.value = 1
})
watch(() => params.owner_source, () => {
  page.value = 1
})

const hasFilters = computed(() =>
  !!searchInput.value || !!params.status || !!params.owner_source
)

function clearFilters(): void {
  searchInput.value = ''
  params.search = undefined
  params.status = undefined
  params.owner_source = undefined
  page.value = 1
}

const { data, status, error, refresh } = usePlatformPartnerList(
  computed(() => ({ ...params, page: page.value }))
)

const vendors = computed<PartnerListItem[]>(() => data.value?.data ?? [])

const { data: statsData, status: statsStatus, refresh: refreshStats } = usePlatformPartnerStats()
const stats = computed(() => statsData.value?.data ?? null)

const columns: TableColumn<PartnerListItem>[] = [
  { accessorKey: 'slug', header: 'Mã vendor' },
  { accessorKey: 'name', header: 'Tên vendor' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'owner', header: 'Người tạo' },
  { id: 'project_count', header: 'Dự án' },
  { id: 'rating', header: 'Đánh giá CD' },
  { id: 'offer_count', header: 'Gói DV' },
  { id: 'provisioned', header: 'Resi_mart' },
  { accessorKey: 'created_at', header: 'Ngày tạo' },
  stickyRight<PartnerListItem>({ id: 'actions', header: 'Thao tác' }, { width: 'w-[210px] min-w-[210px]' })
]

// ─── Create vendor ─────────────────────────────────────────────

const toast = useToast()
const showCreateModal = ref(false)
const isCreating = ref(false)
const createApiErrors = ref<Record<string, string[]>>({})

function openCreate(): void {
  createApiErrors.value = {}
  showCreateModal.value = true
}

async function handleCreate(formData: CreatePartnerPayload & { id?: number }): Promise<void> {
  createApiErrors.value = {}
  isCreating.value = true
  const { id: _omit, ...payload } = formData
  void _omit
  try {
    const res = await apiCreatePartner(payload as CreatePartnerPayload)
    toast.add({ title: 'Tạo vendor thành công', color: 'success', icon: 'i-lucide-check-circle' })
    showCreateModal.value = false
    await navigateTo(`${DETAIL_BASE}/${res.data.id}`)
  } catch (err) {
    const errs = getApiValidationErrors(err)
    if (errs) {
      createApiErrors.value = errs
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Tạo vendor thất bại'), color: 'error', icon: 'i-lucide-alert-circle' })
    }
  } finally {
    isCreating.value = false
  }
}

// ─── Approval lifecycle actions ────────────────────────────────

const { runVendorAction } = useVendorActions()
const actionTarget = ref<PartnerListItem | null>(null)
const actionType = ref<VendorActionType | null>(null)
const actionLoading = ref(false)
const showActionModal = ref(false)

function askAction(type: VendorActionType, vendor: PartnerListItem): void {
  actionType.value = type
  actionTarget.value = vendor
  showActionModal.value = true
}

async function confirmAction(): Promise<void> {
  if (!actionType.value || !actionTarget.value) return
  actionLoading.value = true
  const ok = await runVendorAction(actionType.value, actionTarget.value.id)
  actionLoading.value = false
  if (ok) {
    showActionModal.value = false
    await Promise.all([refresh(), refreshStats()])
  }
}

async function refreshAll(): Promise<void> {
  await Promise.all([refresh(), refreshStats()])
}

// ─── Provision (resi_mart) ─────────────────────────────────────

const provisioningId = ref<number | null>(null)

async function handleProvision(vendor: PartnerListItem): Promise<void> {
  provisioningId.value = vendor.id
  try {
    await apiProvisionPartner(vendor.id)
    toast.add({
      title: 'Đã provision tenant ở resi_mart',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    await refreshAll()
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Provision thất bại — resi_mart không phản hồi'),
      description: 'Hãy chắc chắn resi_mart đang chạy và env RESI_MART_INTERNAL_URL/TOKEN đã cấu hình.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    provisioningId.value = null
  }
}

// ─── Edit + Delete ─────────────────────────────────────────────

const crud = useCrudModals<PartnerListItem>()
const {
  showFormModal, editTarget, formApiErrors,
  openEditModal,
  showDeleteModal, deleteTarget, openDeleteModal
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refreshAll)

// Prefill project_ids from detail when opening the edit modal.
const editProjectIds = ref<number[]>([])
async function openEdit(vendor: PartnerListItem): Promise<void> {
  editProjectIds.value = []
  openEditModal(vendor)
  if (vendor.owner_tenant_id) {
    try {
      const res = await $platformApi<{ data: { project_ids: number[] } }>(
        `/platform/partners/${vendor.id}`
      )
      editProjectIds.value = res.data.project_ids ?? []
    } catch {
      editProjectIds.value = []
    }
  }
}

function handleEditSubmit(formData: CreatePartnerPayload & { id?: number }): void {
  const { id: _omit, slug: _slug, ...payload } = formData
  void _omit
  void _slug
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([key, val]) => {
      if (key === 'owner_email' && (val === '' || val == null)) return false
      return true
    })
  ) as UpdatePartnerPayload

  submitForm(
    null,
    () => apiUpdatePartner(editTarget.value!.id, cleanPayload),
    { update: 'Cập nhật vendor thành công' }
  )
}

function handleDelete(): void {
  submitDelete(
    () => apiDeletePartner(deleteTarget.value!.id),
    { message: 'Đã xoá vendor' }
  )
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Quản lý Vendor
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Quản lý toàn bộ vendor (đối tác) trên nền tảng: duyệt, vô hiệu, cấu hình hoa hồng và theo dõi đơn hàng.
      </p>
    </div>

    <VendorConsoleStatsCards
      :stats="stats"
      :pending="statsStatus === 'pending' && !statsData"
    />

    <!-- Search + Filters + Actions -->
    <div class="mb-4 flex items-center gap-3 flex-wrap">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm mã/tên vendor, người tạo..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="params.status"
        :items="statusItems"
        value-key="value"
        class="min-w-[180px]"
      />
      <USelect
        v-model="params.owner_source"
        :items="ownerSourceItems"
        value-key="value"
        class="min-w-[180px]"
      />
      <UButton
        v-if="hasFilters"
        icon="i-lucide-x"
        label="Xoá bộ lọc"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="clearFilters"
      />

      <div class="flex-1" />

      <UButton
        icon="i-lucide-plus"
        label="Tạo vendor"
        @click="openCreate"
      />
    </div>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải danh sách vendor. Vui lòng thử lại."
      class="mb-4"
    />

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="vendors"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #slug-cell="{ row }">
          <NuxtLink
            :to="`${DETAIL_BASE}/${row.original.id}`"
            class="font-mono font-semibold text-primary-700 hover:underline"
          >
            {{ row.original.slug }}
          </NuxtLink>
        </template>

        <template #name-cell="{ row }">
          <span class="font-medium text-slate-900">{{ row.original.name }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="partnerStatusBadgeColor(row.original.status.value)"
            variant="subtle"
            :label="row.original.status.label"
          />
        </template>

        <template #owner-cell="{ row }">
          <div class="flex flex-col gap-0.5">
            <UBadge
              :color="row.original.owner_source.value === 'platform' ? 'primary' : 'neutral'"
              variant="subtle"
              size="xs"
              class="w-fit"
              :label="row.original.owner_source.label"
            />
            <span
              v-if="row.original.owner_tenant"
              class="text-xs text-slate-500"
            >
              {{ row.original.owner_tenant.name ?? row.original.owner_tenant.id }}
            </span>
          </div>
        </template>

        <template #project_count-cell="{ row }">
          <span class="tabular-nums">{{ row.original.project_count ?? 0 }}</span>
        </template>

        <template #rating-cell="{ row }">
          <div
            v-if="row.original.rating"
            class="flex items-center gap-1 text-sm"
          >
            <UIcon
              name="i-lucide-star"
              class="size-3.5 text-amber-500"
            />
            <span class="font-medium text-slate-900">{{ row.original.rating.avg.toFixed(1) }}</span>
            <span class="text-slate-400">({{ row.original.rating.count }})</span>
          </div>
          <span
            v-else
            class="text-slate-400"
          >—</span>
        </template>

        <template #offer_count-cell="{ row }">
          <span class="tabular-nums">{{ row.original.offer_count ?? 0 }}</span>
        </template>

        <template #provisioned-cell="{ row }">
          <UBadge
            v-if="row.original.is_provisioned"
            color="success"
            variant="subtle"
            label="Đã provision"
            icon="i-lucide-check"
            size="xs"
          />
          <UBadge
            v-else
            color="warning"
            variant="subtle"
            label="Chờ provision"
            icon="i-lucide-clock"
            size="xs"
          />
        </template>

        <template #created_at-cell="{ row }">
          <span class="text-sm">{{ row.original.created_at ? formatDate(row.original.created_at) : '—' }}</span>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center justify-end gap-1">
            <UButton
              icon="i-lucide-eye"
              color="neutral"
              variant="ghost"
              size="xs"
              :to="`${DETAIL_BASE}/${row.original.id}`"
              aria-label="Xem chi tiết"
            />
            <UButton
              v-if="row.original.status.value === 'pending'"
              icon="i-lucide-check"
              color="success"
              variant="ghost"
              size="xs"
              aria-label="Duyệt"
              @click="askAction('approve', row.original)"
            />
            <UButton
              v-else-if="row.original.status.value === 'active'"
              icon="i-lucide-ban"
              color="warning"
              variant="ghost"
              size="xs"
              aria-label="Vô hiệu hoá"
              @click="askAction('deactivate', row.original)"
            />
            <UButton
              v-else-if="row.original.status.value === 'suspended'"
              icon="i-lucide-power"
              color="primary"
              variant="ghost"
              size="xs"
              aria-label="Kích hoạt lại"
              @click="askAction('reactivate', row.original)"
            />
            <UButton
              v-if="!row.original.is_provisioned"
              icon="i-lucide-rocket"
              color="warning"
              variant="ghost"
              size="xs"
              aria-label="Provision tenant ở resi_mart"
              title="Provision tenant ở resi_mart"
              :loading="provisioningId === row.original.id"
              @click="handleProvision(row.original)"
            />
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="xs"
              aria-label="Sửa"
              title="Sửa"
              @click="openEdit(row.original)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="neutral"
              variant="ghost"
              size="xs"
              class="hover:!text-red-500 hover:!bg-red-50"
              aria-label="Xoá"
              title="Xoá"
              @click="openDeleteModal(row.original)"
            />
          </div>
        </template>

        <template #empty>
          <div class="py-8 text-center text-sm text-slate-500">
            Chưa có vendor nào.
          </div>
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>

    <PartnerFormModal
      v-model:open="showCreateModal"
      mode="create"
      :loading="isCreating"
      :api-errors="createApiErrors"
      @submit="handleCreate"
    />

    <PartnerFormModal
      v-model:open="showFormModal"
      mode="edit"
      :item="editTarget"
      :initial-project-ids="editProjectIds"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleEditSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá vendor"
      :item-name="deleteTarget?.name"
      :loading="isDeleting"
      description="Soft-delete vendor. Schema tenant ở resi_mart KHÔNG bị xoá — dữ liệu vẫn còn nguyên cho audit."
      @confirm="handleDelete"
    />

    <VendorConsoleActionConfirmModal
      v-model:open="showActionModal"
      :action="actionType"
      :vendor-name="actionTarget?.name"
      :loading="actionLoading"
      @confirm="confirmAction"
    />
  </div>
</template>
