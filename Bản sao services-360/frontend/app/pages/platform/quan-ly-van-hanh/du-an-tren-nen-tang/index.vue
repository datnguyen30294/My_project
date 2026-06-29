<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  PlatformProjectListResource,
  ListPlatformProjectIndexParams,
  CreatePlatformProjectPayload
} from '~/composables/api/usePlatformProjects'
import {
  useListPlatformProjects,
  apiCreatePlatformProject,
  apiToggleProjectService,
  PROJECT_STATUS_OPTIONS
} from '~/composables/api/usePlatformProjects'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Dự án trên nền tảng - Thần Nông' })

const router = useRouter()
const toast = useToast()

const DETAIL_BASE = '/platform/quan-ly-van-hanh/du-an-tren-nen-tang'

function detailTo(row: PlatformProjectListResource): string {
  return `${DETAIL_BASE}/${row.id}?tenant=${row.tenant.id}`
}

// ─── Filters ──────────────────────────────────────────────────────
const params = reactive<ListPlatformProjectIndexParams>({
  search: undefined,
  status: undefined,
  organization_id: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const statusItems = [
  { value: 'all', label: 'Tất cả trạng thái' },
  ...PROJECT_STATUS_OPTIONS
]
const statusFilter = ref<string>('all')
watch(statusFilter, (value) => {
  params.status = value === 'all' ? undefined : value as ListPlatformProjectIndexParams['status']
  page.value = 1
})

const tenantFilter = ref<string | null>(null)
watch(tenantFilter, (value) => {
  params.organization_id = value || undefined
  page.value = 1
})

const hasFilters = computed(() =>
  !!searchInput.value || statusFilter.value !== 'all' || !!tenantFilter.value
)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  statusFilter.value = 'all'
  params.status = undefined
  tenantFilter.value = null
  params.organization_id = undefined
  page.value = 1
}

// ─── List + stats ─────────────────────────────────────────────────
const { data, status, error, refresh } = useListPlatformProjects(
  computed(() => ({ ...params, page: page.value }))
)

const projects = computed<PlatformProjectListResource[]>(() => data.value?.data ?? [])
const stats = computed(() => data.value?.stats ?? null)

const columns: TableColumn<PlatformProjectListResource>[] = [
  { accessorKey: 'code', header: 'Mã dự án' },
  { accessorKey: 'name', header: 'Tên dự án' },
  { accessorKey: 'address', header: 'Địa chỉ' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'tenant', header: 'Công ty vận hành' },
  { id: 'tenant_active', header: 'Tenant' },
  { id: 'platform_service', header: 'Dịch vụ platform' },
  stickyRight<PlatformProjectListResource>({ id: 'actions', header: 'Thao tác' }, { width: 'w-[150px] min-w-[150px]' })
]

// ─── Create ───────────────────────────────────────────────────────
const showCreateModal = ref(false)
const isCreating = ref(false)
const createApiErrors = ref<Record<string, string[]>>({})
const createErrorMessage = ref<string | null>(null)

function openCreateModal() {
  createApiErrors.value = {}
  createErrorMessage.value = null
  showCreateModal.value = true
}

async function handleCreate(payload: CreatePlatformProjectPayload) {
  createApiErrors.value = {}
  createErrorMessage.value = null
  isCreating.value = true
  try {
    const { organization_id, ...data } = payload
    const res = await apiCreatePlatformProject(organization_id, data)
    toast.add({ title: 'Tạo dự án thành công', color: 'success', icon: 'i-lucide-check-circle' })
    showCreateModal.value = false
    await router.push(`${DETAIL_BASE}/${res.data.id}?tenant=${organization_id}`)
  } catch (err) {
    const errors = getApiValidationErrors(err)
    if (errors) {
      createApiErrors.value = errors
    } else {
      createErrorMessage.value = getApiErrorMessage(err, 'Không thể tạo dự án')
    }
  } finally {
    isCreating.value = false
  }
}

// ─── Toggle platform service ──────────────────────────────────────
const toggleTarget = ref<PlatformProjectListResource | null>(null)
const showToggleConfirm = ref(false)
const isToggling = ref(false)

const toggleEnable = computed(() => !(toggleTarget.value?.platform_service_enabled ?? true))

function openToggleConfirm(item: PlatformProjectListResource) {
  toggleTarget.value = item
  showToggleConfirm.value = true
}

async function confirmToggle() {
  if (!toggleTarget.value) return
  isToggling.value = true
  try {
    await apiToggleProjectService(toggleTarget.value.tenant.id, toggleTarget.value.id, toggleEnable.value)
    toast.add({
      title: toggleEnable.value ? 'Đã bật cung cấp dịch vụ' : 'Đã ngừng cung cấp dịch vụ',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    showToggleConfirm.value = false
    await refresh()
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Không thể cập nhật trạng thái dịch vụ'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isToggling.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Dự án trên nền tảng
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Tổng hợp toàn bộ dự án trên nền tảng — mỗi dự án thuộc một công ty vận hành. Thêm dự án mới, xem chi tiết và cấu hình phí nền tảng riêng theo dự án.
      </p>
    </div>

    <PlatformProjectStatsBar
      :stats="stats"
      :pending="status === 'pending' && !data"
    />

    <!-- Search + Filters + Actions -->
    <div class="mb-4 flex items-center gap-3 flex-wrap">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo mã, tên, địa chỉ, công ty VH..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />

      <USelect
        v-model="statusFilter"
        :items="statusItems"
        value-key="value"
        label-key="label"
        size="sm"
        class="w-44"
      />

      <div class="w-56">
        <SharedOrganizationSelect
          v-model="tenantFilter"
          placeholder="Lọc theo công ty VH"
        />
      </div>

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
        label="Thêm dự án"
        @click="openCreateModal"
      />
    </div>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải danh sách dự án. Dữ liệu gộp từ nhiều công ty vận hành có thể tải chậm — vui lòng thử lại."
      class="mb-4"
    />

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="projects"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #code-cell="{ row }">
          <NuxtLink
            :to="detailTo(row.original)"
            class="font-mono text-primary-600 hover:underline"
          >
            {{ row.original.code }}
          </NuxtLink>
        </template>

        <template #name-cell="{ row }">
          <NuxtLink
            :to="detailTo(row.original)"
            class="font-medium text-slate-900 hover:text-primary-600 hover:underline"
          >
            {{ row.original.name }}
          </NuxtLink>
        </template>

        <template #address-cell="{ row }">
          <span
            v-if="row.original.address"
            class="text-sm text-slate-700"
          >{{ row.original.address }}</span>
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status.value === 'managing' ? 'success' : 'neutral'"
            variant="subtle"
            :label="row.original.status.label"
          />
        </template>

        <template #tenant-cell="{ row }">
          <NuxtLink
            :to="`/platform/tenants/${row.original.tenant.id}`"
            class="text-sm text-slate-700 hover:text-primary-600 hover:underline"
          >
            <span class="font-mono">{{ row.original.tenant.code }}</span> — {{ row.original.tenant.name }}
          </NuxtLink>
        </template>

        <template #tenant_active-cell="{ row }">
          <UBadge
            :color="row.original.tenant.is_active ? 'success' : 'warning'"
            variant="subtle"
            :label="row.original.tenant.is_active ? 'Hoạt động' : 'Vô hiệu'"
          />
        </template>

        <template #platform_service-cell="{ row }">
          <UBadge
            :color="row.original.platform_service_enabled ? 'success' : 'warning'"
            variant="subtle"
            :label="row.original.platform_service_enabled ? 'Đang cung cấp' : 'Ngừng cung cấp'"
          />
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center justify-end gap-1">
            <UButton
              :to="detailTo(row.original)"
              icon="i-lucide-eye"
              color="neutral"
              variant="ghost"
              size="sm"
              title="Xem chi tiết"
            />
            <UButton
              :to="`/platform/tenants/${row.original.tenant.id}`"
              icon="i-lucide-building-2"
              color="neutral"
              variant="ghost"
              size="sm"
              title="Xem công ty vận hành"
            />
            <UButton
              :icon="row.original.platform_service_enabled ? 'i-lucide-power-off' : 'i-lucide-power'"
              color="neutral"
              variant="ghost"
              size="sm"
              :class="row.original.platform_service_enabled ? 'hover:!text-amber-600 hover:!bg-amber-50' : 'hover:!text-emerald-600 hover:!bg-emerald-50'"
              :title="row.original.platform_service_enabled ? 'Ngừng cung cấp dịch vụ' : 'Bật cung cấp dịch vụ'"
              @click="openToggleConfirm(row.original)"
            />
          </div>
        </template>

        <template #empty>
          <UEmpty
            icon="i-lucide-folder-kanban"
            title="Chưa có dự án nào"
            description="Thêm dự án mới và gán vào một công ty vận hành để bắt đầu."
          />
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>

    <PlatformProjectCreateModal
      v-model:open="showCreateModal"
      :loading="isCreating"
      :api-errors="createApiErrors"
      :error-message="createErrorMessage"
      @submit="handleCreate"
    />

    <UModal
      v-model:open="showToggleConfirm"
      :title="toggleEnable ? 'Bật cung cấp dịch vụ' : 'Ngừng cung cấp dịch vụ'"
    >
      <template #body>
        <div class="space-y-3 text-sm text-slate-700">
          <p v-if="toggleEnable">
            Bật cung cấp dịch vụ nền tảng cho dự án
            <strong>{{ toggleTarget?.name }}</strong>?
          </p>
          <p v-else>
            Ngừng cung cấp dịch vụ nền tảng cho dự án
            <strong>{{ toggleTarget?.name }}</strong>?
            Phí nền tảng theo dự án vẫn được giữ nguyên, có thể bật lại sau.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Huỷ"
            color="neutral"
            variant="ghost"
            :disabled="isToggling"
            @click="showToggleConfirm = false"
          />
          <UButton
            :label="toggleEnable ? 'Bật cung cấp' : 'Ngừng cung cấp'"
            :color="toggleEnable ? 'primary' : 'warning'"
            :loading="isToggling"
            @click="confirmToggle"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
