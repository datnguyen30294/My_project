<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { OrganizationListResource, OrganizationIndexParams, CreateOrganizationRequest, TenantFormPayload } from '~/composables/api/useTenants'
import { SERVICE_PLAN_OPTIONS } from '~/composables/api/useTenants'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Công ty vận hành - Thần Nông' })

// --- Stats ---
const { data: statsData, status: statsStatus, refresh: refreshStats } = usePlatformTenantStats()
const stats = computed(() => statsData.value?.data ?? null)

// --- List ---
const params = reactive<OrganizationIndexParams>({
  search: undefined,
  is_active: undefined,
  service_plan: undefined,
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

const servicePlanItems = [
  { value: 'all', label: 'Tất cả gói' },
  ...SERVICE_PLAN_OPTIONS
]
const servicePlanFilter = ref<string>('all')
watch(servicePlanFilter, (value) => {
  params.service_plan = value === 'all' ? undefined : value as OrganizationIndexParams['service_plan']
  page.value = 1
})

const hasFilters = computed(() => !!searchInput.value || activeFilter.value !== 'all' || servicePlanFilter.value !== 'all')

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  activeFilter.value = 'all'
  params.is_active = undefined
  servicePlanFilter.value = 'all'
  params.service_plan = undefined
  page.value = 1
}

const { data, status, error, refresh } = usePlatformTenantList(
  computed(() => ({ ...params, page: page.value }))
)

const tenants = computed<OrganizationListResource[]>(() => data.value?.data ?? [])

async function refreshAll() {
  await Promise.all([refresh(), refreshStats()])
}

const columns: TableColumn<OrganizationListResource>[] = [
  { accessorKey: 'id', header: 'Mã' },
  { accessorKey: 'name', header: 'Tên công ty' },
  { accessorKey: 'tax_code', header: 'MST' },
  { id: 'service_plan', header: 'Gói DV' },
  { id: 'contact', header: 'Liên hệ' },
  { id: 'domains', header: 'Domains' },
  { id: 'vendor_feature', header: 'Gói vendor' },
  { id: 'is_active', header: 'Trạng thái' },
  stickyRight<OrganizationListResource>({ id: 'actions', header: 'Thao tác' }, { width: 'w-[160px] min-w-[160px]' })
]

// ─── Toggle vendor feature ───────────────────────────────
const toast = useToast()
const toggleTarget = ref<OrganizationListResource | null>(null)
const toggleTargetEnable = ref(false)
const showToggleConfirm = ref(false)
const isToggling = ref(false)

function openToggleConfirm(item: OrganizationListResource, nextValue: boolean) {
  toggleTarget.value = item
  toggleTargetEnable.value = nextValue
  showToggleConfirm.value = true
}

async function confirmToggle() {
  if (!toggleTarget.value) return
  isToggling.value = true
  try {
    await apiToggleTenantVendorFeature(toggleTarget.value.id, toggleTargetEnable.value)
    toast.add({
      title: toggleTargetEnable.value
        ? 'Đã bật gói vendor cho tenant'
        : 'Đã tắt gói vendor cho tenant',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    showToggleConfirm.value = false
    await refresh()
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Không thể cập nhật gói vendor'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isToggling.value = false
  }
}

// ─── Toggle active (vô hiệu hoá / kích hoạt lại) ─────────
const {
  showActiveConfirm, activeTarget, activating, isTogglingActive,
  openActiveConfirm, confirmToggleActive
} = useTenantToggleActive(refreshAll)

// --- CRUD ---
const crud = useCrudModals<OrganizationListResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal
} = crud
const { isSubmitting, submitForm } = useCrudSubmit(crud, refreshAll)

function handleFormSubmit(formData: TenantFormPayload) {
  const isCreate = formMode.value === 'create'
  const { id, domains, ...profile } = formData

  submitForm(
    isCreate
      ? () => apiCreateTenant({
          id: id!,
          ...profile,
          ...(domains.length ? { domains } : {})
        } as CreateOrganizationRequest)
      : null,
    isCreate
      ? null
      : () => apiUpdateTenant(editTarget.value!.id, { ...profile, domains }),
    { create: 'Đăng ký công ty vận hành thành công', update: 'Cập nhật công ty vận hành thành công' }
  )
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Công ty vận hành
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Quản lý các công ty vận hành (tenant) trên hệ thống — mỗi công ty có schema dữ liệu riêng.
      </p>
    </div>

    <TenantStatsBar
      :stats="stats"
      :pending="statsStatus === 'pending'"
    />

    <!-- Search + Filters + Actions -->
    <div class="mb-4 flex items-center gap-3 flex-wrap">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo mã, tên, MST, email..."
        class="max-w-sm"
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

      <USelect
        v-model="servicePlanFilter"
        :items="servicePlanItems"
        value-key="value"
        label-key="label"
        size="sm"
        class="w-36"
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
        label="Đăng ký công ty VH"
        @click="openCreateModal"
      />
    </div>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải dữ liệu. Vui lòng thử lại."
      class="mb-4"
    />

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="tenants"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #id-cell="{ row }">
          <NuxtLink
            :to="`/platform/tenants/${row.original.id}`"
            class="font-mono text-primary-600 hover:underline"
          >
            {{ row.original.id }}
          </NuxtLink>
        </template>

        <template #name-cell="{ row }">
          <NuxtLink
            :to="`/platform/tenants/${row.original.id}`"
            class="font-medium text-slate-900 hover:text-primary-600 hover:underline"
          >
            {{ row.original.name }}
          </NuxtLink>
        </template>

        <template #tax_code-cell="{ row }">
          <span
            v-if="row.original.tax_code"
            class="font-mono text-sm"
          >{{ row.original.tax_code }}</span>
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #service_plan-cell="{ row }">
          <UBadge
            v-if="row.original.service_plan"
            color="info"
            variant="subtle"
            size="sm"
            :label="row.original.service_plan.label"
          />
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #contact-cell="{ row }">
          <div
            v-if="row.original.representative_name || row.original.contact_email"
            class="text-sm"
          >
            <div
              v-if="row.original.representative_name"
              class="text-slate-900"
            >
              {{ row.original.representative_name }}
            </div>
            <div
              v-if="row.original.contact_email"
              class="text-xs text-slate-500"
            >
              {{ row.original.contact_email }}
            </div>
          </div>
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #domains-cell="{ row }">
          <div class="flex flex-wrap gap-1">
            <UBadge
              v-for="domain in row.original.domains"
              :key="domain"
              variant="subtle"
              color="info"
              :label="domain"
              size="xs"
            />
            <span
              v-if="!row.original.domains?.length"
              class="text-xs text-gray-400"
            >—</span>
          </div>
        </template>

        <template #vendor_feature-cell="{ row }">
          <USwitch
            :model-value="row.original.is_vendor_enabled"
            :label="row.original.is_vendor_enabled ? 'Đã bật' : 'Tắt'"
            @update:model-value="(v) => openToggleConfirm(row.original, v)"
          />
        </template>

        <template #is_active-cell="{ row }">
          <UBadge
            :color="row.original.is_active ? 'success' : 'warning'"
            variant="subtle"
            :label="row.original.is_active ? 'Hoạt động' : 'Vô hiệu'"
          />
        </template>

        <template #actions-cell="{ row }">
          <SharedCrudTableActions
            :detail-to="`/platform/tenants/${row.original.id}`"
            :show-delete="false"
            @edit="openEditModal(row.original)"
          >
            <template #extra>
              <UButton
                :icon="row.original.is_active ? 'i-lucide-power-off' : 'i-lucide-power'"
                color="neutral"
                variant="ghost"
                size="sm"
                :class="row.original.is_active ? 'hover:!text-amber-600 hover:!bg-amber-50' : 'hover:!text-emerald-600 hover:!bg-emerald-50'"
                :title="row.original.is_active ? 'Vô hiệu hoá' : 'Kích hoạt lại'"
                @click="openActiveConfirm(row.original)"
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

    <TenantFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <TenantToggleActiveModal
      v-model:open="showActiveConfirm"
      :tenant-name="activeTarget?.name"
      :activating="activating"
      :loading="isTogglingActive"
      @confirm="confirmToggleActive"
    />

    <UModal
      v-model:open="showToggleConfirm"
      :title="toggleTargetEnable ? 'Bật gói vendor' : 'Tắt gói vendor'"
    >
      <template #body>
        <div class="space-y-3 text-sm text-slate-700">
          <p v-if="toggleTargetEnable">
            Bật gói vendor cho tenant
            <strong>{{ toggleTarget?.name }}</strong>?
            Tenant sẽ thấy menu "Vendor của tôi" sau khi đăng nhập lại và có thể tự đăng ký vendor riêng.
          </p>
          <p v-else>
            Tắt gói vendor cho tenant
            <strong>{{ toggleTarget?.name }}</strong>?
            Các vendor đã đăng ký vẫn giữ nguyên trong hệ thống, nhưng tenant sẽ mất quyền chỉnh sửa.
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
            :label="toggleTargetEnable ? 'Bật gói vendor' : 'Tắt gói vendor'"
            :color="toggleTargetEnable ? 'primary' : 'warning'"
            :loading="isToggling"
            @click="confirmToggle"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
