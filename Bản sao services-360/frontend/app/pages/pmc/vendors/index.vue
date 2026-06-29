<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { PartnerListItem, ListTenantPartnersParams } from '~/composables/api/usePartners'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Vendor của tôi - Thần Nông' })

const router = useRouter()
const toast = useToast()

// ─── List ─────────────────────────────────────────────
const params = reactive<ListTenantPartnersParams>({
  search: undefined,
  status: undefined,
  provisioned: undefined,
  category: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

type StatusFilter = 'all' | 'active' | 'suspended' | 'terminated'
const statusFilter = ref<StatusFilter>('all')
function applyStatusFilter(value: StatusFilter) {
  statusFilter.value = value
  params.status = value === 'all' ? undefined : value
  page.value = 1
}

type ProvisionFilter = 'all' | 'provisioned' | 'pending'
const provisionFilter = ref<ProvisionFilter>('all')
function applyProvisionFilter(value: ProvisionFilter) {
  provisionFilter.value = value
  params.provisioned = value === 'all' ? undefined : value === 'provisioned'
  page.value = 1
}

const hasFilters = computed(() =>
  !!searchInput.value || statusFilter.value !== 'all' || provisionFilter.value !== 'all'
)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  statusFilter.value = 'all'
  params.status = undefined
  provisionFilter.value = 'all'
  params.provisioned = undefined
  page.value = 1
}

const { data, status, error, refresh } = useTenantPartnerList(
  computed(() => ({ ...params, page: page.value }))
)

// Redirect when tenant chưa bật gói vendor (BR-01)
watch(error, (e) => {
  if (!e) return
  const apiErr = e as { data?: { error_code?: string }, status?: number, statusCode?: number }
  const code = apiErr?.data?.error_code
  const status = apiErr?.status ?? apiErr?.statusCode
  if (code === 'VENDOR_FEATURE_DISABLED' || status === 403) {
    toast.add({
      title: 'Tenant chưa kích hoạt gói vendor',
      description: 'Liên hệ Platform admin để bật gói vendor cho tenant của bạn.',
      color: 'warning',
      icon: 'i-lucide-shield-off'
    })
    router.replace('/pmc/dashboard')
  }
}, { immediate: true })

const vendors = computed<PartnerListItem[]>(() => data.value?.data ?? [])

const columns: TableColumn<PartnerListItem>[] = [
  { id: 'logo', header: '' },
  { id: 'name', header: 'Tên hiển thị' },
  { accessorKey: 'slug', header: 'Slug' },
  { id: 'categories', header: 'Danh mục' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'provisioned', header: 'Provision' },
  { accessorKey: 'created_at', header: 'Ngày tạo' },
  stickyRight<PartnerListItem>({ id: 'actions', header: 'Thao tác' }, { width: 'w-[120px] min-w-[120px]' })
]

function goDetail(item: PartnerListItem) {
  router.push(`/pmc/vendors/${item.id}`)
}

function goEdit(item: PartnerListItem) {
  router.push(`/pmc/vendors/${item.id}/edit`)
}

// ─── Delete ───────────────────────────────────────────
const crud = useCrudModals<PartnerListItem>()
const { showDeleteModal, deleteTarget, openDeleteModal } = crud
const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleDelete() {
  submitDelete(
    () => apiDeleteTenantPartner(deleteTarget.value!.id),
    {
      message: 'Đã xoá vendor.',
      onError: (err) => {
        const apiErr = err as { data?: { error_code?: string, message?: string }, status?: number }
        if (apiErr?.data?.error_code === 'VENDOR_ALREADY_PROVISIONED') {
          toast.add({
            title: 'Không thể xoá vendor đã kích hoạt',
            description: 'Vendor đã được kích hoạt. Vui lòng liên hệ Platform admin để xoá.',
            color: 'warning',
            icon: 'i-lucide-shield-alert'
          })
          showDeleteModal.value = false
          return true
        }
        return false
      }
    }
  )
}

function firstChar(name: string | null | undefined): string {
  const trimmed = (name ?? '').trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?'
}

// ─── Retry provision ──────────────────────────────────
const provisioningId = ref<number | null>(null)
async function retryProvision(item: PartnerListItem) {
  provisioningId.value = item.id
  try {
    await apiProvisionTenantPartner(item.id)
    toast.add({
      title: 'Đã kích hoạt shop trên resi_mart',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    await refresh()
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Kích hoạt shop thất bại — resi_mart không phản hồi'),
      description: 'Vui lòng thử lại sau ít phút. Nếu vẫn lỗi, liên hệ Platform admin.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    provisioningId.value = null
  }
}
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Vendor của tôi"
      description="Quản lý các vendor (đối tác marketplace) mà tenant của bạn đăng ký."
      create-to="/pmc/vendors/tao-moi"
      create-label="Đăng ký vendor"
    />

    <!-- Search + Filters -->
    <div class="mb-4 flex items-center gap-3 flex-wrap">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo tên, slug, email..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />

      <USelect
        :model-value="statusFilter"
        :items="[
          { label: 'Trạng thái: Tất cả', value: 'all' },
          { label: 'Đang hoạt động', value: 'active' },
          { label: 'Tạm khoá', value: 'suspended' },
          { label: 'Đã chấm dứt', value: 'terminated' }
        ]"
        class="min-w-[180px]"
        @update:model-value="(v) => applyStatusFilter(v as StatusFilter)"
      />

      <USelect
        v-model="provisionFilter"
        :items="[
          { label: 'Provision: Tất cả', value: 'all' },
          { label: 'Đã kích hoạt', value: 'provisioned' },
          { label: 'Chờ provision', value: 'pending' }
        ]"
        class="min-w-[180px]"
        @update:model-value="(v) => applyProvisionFilter(v as ProvisionFilter)"
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
    </div>

    <UAlert
      v-if="error && (error as { status?: number }).status !== 403"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải dữ liệu. Vui lòng thử lại."
      class="mb-4"
    />

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="vendors"
        :columns="columns"
        :loading="status === 'pending'"
        empty="Chưa có vendor nào. Đăng ký vendor đầu tiên để bắt đầu bán trên marketplace."
      >
        <template #logo-cell="{ row }">
          <UAvatar
            :src="row.original.logo_url ?? undefined"
            :alt="row.original.name"
            :text="firstChar(row.original.display_name ?? row.original.name)"
            size="sm"
          />
        </template>

        <template #name-cell="{ row }">
          <button
            type="button"
            class="text-left font-medium text-primary-700 hover:underline"
            @click="goDetail(row.original)"
          >
            {{ row.original.display_name ?? row.original.name }}
          </button>
        </template>

        <template #slug-cell="{ row }">
          <span class="font-mono text-xs text-slate-600">{{ row.original.slug }}</span>
        </template>

        <template #categories-cell="{ row }">
          <div class="flex flex-wrap gap-1">
            <UBadge
              v-for="cat in row.original.categories.slice(0, 3)"
              :key="cat"
              variant="subtle"
              color="info"
              :label="cat"
              size="xs"
            />
            <UBadge
              v-if="row.original.categories.length > 3"
              variant="subtle"
              color="neutral"
              :label="`+${row.original.categories.length - 3}`"
              size="xs"
            />
            <span
              v-if="!row.original.categories?.length"
              class="text-xs text-gray-400"
            >—</span>
          </div>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status.value === 'active' ? 'success'
              : row.original.status.value === 'suspended' ? 'warning' : 'neutral'"
            variant="subtle"
            :label="row.original.status.label"
          />
        </template>

        <template #provisioned-cell="{ row }">
          <UBadge
            v-if="row.original.is_provisioned"
            color="success"
            variant="subtle"
            label="Đã kích hoạt"
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
          {{ row.original.created_at ? formatDate(row.original.created_at) : '—' }}
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-1">
            <UTooltip
              v-if="!row.original.is_provisioned"
              text="Thử kích hoạt lại shop trên resi_mart"
            >
              <UButton
                icon="i-lucide-rocket"
                color="warning"
                variant="ghost"
                size="xs"
                :loading="provisioningId === row.original.id"
                aria-label="Retry provision"
                @click="retryProvision(row.original)"
              />
            </UTooltip>
            <UTooltip text="Hợp đồng hoa hồng">
              <UButton
                icon="i-lucide-handshake"
                color="neutral"
                variant="ghost"
                size="xs"
                aria-label="Hợp đồng hoa hồng"
                :to="`/pmc/vendors/${row.original.id}?tab=contracts`"
              />
            </UTooltip>
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="xs"
              aria-label="Chỉnh sửa"
              @click="goEdit(row.original)"
            />
            <UButton
              v-if="!row.original.is_provisioned"
              icon="i-lucide-trash-2"
              color="neutral"
              variant="ghost"
              size="xs"
              class="hover:text-red-500 hover:bg-red-50"
              aria-label="Xoá vendor"
              @click="openDeleteModal(row.original)"
            />
            <UTooltip
              v-else
              text="Liên hệ Platform admin để xoá vendor đã kích hoạt."
            >
              <UButton
                icon="i-lucide-trash-2"
                color="neutral"
                variant="ghost"
                size="xs"
                disabled
              />
            </UTooltip>
          </div>
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá vendor"
      :item-name="deleteTarget?.display_name ?? deleteTarget?.name"
      :loading="isDeleting"
      description="Vendor sẽ bị xoá (soft-delete). Hành động này chỉ áp dụng cho vendor chưa được kích hoạt shop trên resi_mart."
      @confirm="handleDelete"
    />
  </div>
</template>
