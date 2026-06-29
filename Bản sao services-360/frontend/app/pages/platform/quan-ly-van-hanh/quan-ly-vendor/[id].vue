<script setup lang="ts">
import type { CreatePartnerPayload, UpdatePartnerPayload } from '~/composables/api/usePartners'
import {
  apiProvisionPartner,
  apiUpdatePartner,
  partnerStatusBadgeColor,
  usePlatformPartnerDetail
} from '~/composables/api/usePartners'
import type { VendorActionType } from '~/composables/useVendorActions'

definePageMeta({ layout: 'platform' })

const route = useRoute()
const router = useRouter()
const toast = useToast()

const LIST_ROUTE = '/platform/quan-ly-van-hanh/quan-ly-vendor'

const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = usePlatformPartnerDetail(id)
const vendor = computed(() => data.value?.data ?? null)

useSeoMeta({
  title: computed(() => vendor.value ? `${vendor.value.name} - Vendor` : 'Chi tiết vendor')
})

watch(error, (e) => {
  if (!e) return
  if (getApiErrorStatus(e) === 404) {
    toast.add({ title: 'Không tìm thấy vendor', color: 'error' })
    router.replace(LIST_ROUTE)
  }
})

function firstChar(name: string | null | undefined): string {
  const trimmed = (name ?? '').trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?'
}

// ─── Header action (status-driven) ─────────────────────────────

const headerAction = computed<{ type: VendorActionType, label: string, icon: string, color: 'success' | 'warning' | 'primary' } | null>(() => {
  switch (vendor.value?.status.value) {
    case 'pending': return { type: 'approve', label: 'Duyệt', icon: 'i-lucide-check-circle', color: 'success' }
    case 'active': return { type: 'deactivate', label: 'Vô hiệu hoá', icon: 'i-lucide-ban', color: 'warning' }
    case 'suspended': return { type: 'reactivate', label: 'Kích hoạt lại', icon: 'i-lucide-power', color: 'primary' }
    default: return null
  }
})

const { runVendorAction } = useVendorActions()
const actionType = ref<VendorActionType | null>(null)
const actionLoading = ref(false)
const showActionModal = ref(false)

function askAction(type: VendorActionType): void {
  actionType.value = type
  showActionModal.value = true
}

async function confirmAction(): Promise<void> {
  if (!actionType.value || !vendor.value) return
  actionLoading.value = true
  const ok = await runVendorAction(actionType.value, vendor.value.id)
  actionLoading.value = false
  if (ok) {
    showActionModal.value = false
    await refresh()
  }
}

// ─── Provision (resi_mart) ─────────────────────────────────────

const provisioning = ref(false)

async function handleProvision(): Promise<void> {
  if (!vendor.value) return
  provisioning.value = true
  try {
    await apiProvisionPartner(vendor.value.id)
    toast.add({
      title: 'Đã provision tenant ở resi_mart',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    await refresh()
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Provision thất bại — resi_mart không phản hồi'),
      description: 'Hãy chắc chắn resi_mart đang chạy và env RESI_MART_INTERNAL_URL/TOKEN đã cấu hình.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    provisioning.value = false
  }
}

// ─── Edit ──────────────────────────────────────────────────────

const showEditModal = ref(false)
const isEditing = ref(false)
const editApiErrors = ref<Record<string, string[]>>({})

function openEdit(): void {
  editApiErrors.value = {}
  showEditModal.value = true
}

async function handleEditSubmit(formData: CreatePartnerPayload & { id?: number }): Promise<void> {
  if (!vendor.value) return
  editApiErrors.value = {}
  isEditing.value = true
  const { id: _omit, slug: _slug, ...payload } = formData
  void _omit
  void _slug
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([key, val]) => {
      if (key === 'owner_email' && (val === '' || val == null)) return false
      return true
    })
  ) as UpdatePartnerPayload
  try {
    await apiUpdatePartner(vendor.value.id, cleanPayload)
    toast.add({ title: 'Cập nhật vendor thành công', color: 'success', icon: 'i-lucide-check-circle' })
    showEditModal.value = false
    await refresh()
  } catch (err) {
    const errs = getApiValidationErrors(err)
    if (errs) {
      editApiErrors.value = errs
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Cập nhật vendor thất bại'), color: 'error', icon: 'i-lucide-alert-circle' })
    }
  } finally {
    isEditing.value = false
  }
}

// ─── Tabs ──────────────────────────────────────────────────────

type TabId = 'info' | 'orders' | 'offers' | 'ratings'
const tabIds: TabId[] = ['info', 'orders', 'offers', 'ratings']
const tabItems = [
  { value: 'info' as TabId, label: 'Thông tin & Phí', icon: 'i-lucide-info' },
  { value: 'orders' as TabId, label: 'Đơn hàng', icon: 'i-lucide-shopping-cart' },
  { value: 'offers' as TabId, label: 'Sản phẩm', icon: 'i-lucide-package' },
  { value: 'ratings' as TabId, label: 'Đánh giá cư dân', icon: 'i-lucide-star' }
]

const activeTab = ref<TabId>(
  tabIds.includes(route.query.tab as TabId) ? route.query.tab as TabId : 'info'
)

watch(activeTab, (v) => {
  router.replace({ query: { ...route.query, tab: v === 'info' ? undefined : v } })
})
</script>

<template>
  <div>
    <!-- Loading -->
    <div
      v-if="status === 'pending' && !vendor"
      class="flex flex-col gap-4"
    >
      <div class="h-24 bg-slate-100 rounded-xl animate-pulse" />
      <div class="h-48 bg-slate-100 rounded-xl animate-pulse" />
    </div>

    <UAlert
      v-else-if="error && !vendor"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      description="Không tải được thông tin vendor."
    />

    <div
      v-else-if="vendor"
      class="flex flex-col gap-6"
    >
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <UButton
          icon="i-lucide-arrow-left"
          label="Danh sách vendor"
          color="neutral"
          variant="ghost"
          size="xs"
          :to="LIST_ROUTE"
          class="mb-3"
        />
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex items-start gap-4 min-w-0 flex-1">
            <UAvatar
              :src="vendor.logo_url ?? undefined"
              :alt="vendor.name"
              :text="firstChar(vendor.name)"
              size="lg"
            />
            <div class="min-w-0">
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-xl font-bold text-slate-900">
                  {{ vendor.name }}
                </h1>
                <UBadge
                  :color="partnerStatusBadgeColor(vendor.status.value)"
                  variant="subtle"
                  :label="vendor.status.label"
                />
                <UBadge
                  :color="vendor.owner_source.value === 'platform' ? 'primary' : 'neutral'"
                  variant="subtle"
                  :label="vendor.owner_source.label"
                />
                <UBadge
                  v-if="vendor.is_provisioned"
                  color="success"
                  variant="subtle"
                  label="Đã provision"
                  icon="i-lucide-check"
                />
                <UBadge
                  v-else
                  color="warning"
                  variant="subtle"
                  label="Chờ provision"
                  icon="i-lucide-clock"
                />
              </div>
              <p class="mt-1 text-sm text-slate-500 font-mono">
                {{ vendor.slug }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              v-if="!vendor.is_provisioned"
              icon="i-lucide-rocket"
              label="Provision resi_mart"
              color="warning"
              variant="outline"
              :loading="provisioning"
              @click="handleProvision"
            />
            <UButton
              icon="i-lucide-pencil"
              label="Sửa"
              color="neutral"
              variant="outline"
              @click="openEdit"
            />
            <UButton
              v-if="headerAction"
              :icon="headerAction.icon"
              :label="headerAction.label"
              :color="headerAction.color"
              @click="askAction(headerAction.type)"
            />
          </div>
        </div>
      </div>

      <!-- Revenue chart -->
      <VendorConsoleRevenueCard :partner-id="vendor.id" />

      <!-- Tabs -->
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        variant="link"
        :content="false"
        class="w-full"
      />

      <VendorConsoleInfoTab
        v-if="activeTab === 'info'"
        :vendor="vendor"
        @changed="refresh"
      />

      <VendorOrderPlatformOrdersPanel
        v-else-if="activeTab === 'orders'"
        :partner-id="vendor.id"
      />

      <VendorConsoleOffersTab
        v-else-if="activeTab === 'offers'"
        :partner-id="vendor.id"
      />

      <VendorConsoleRatingsTab
        v-else-if="activeTab === 'ratings'"
        :partner-id="vendor.id"
      />
    </div>

    <VendorConsoleActionConfirmModal
      v-model:open="showActionModal"
      :action="actionType"
      :vendor-name="vendor?.name"
      :loading="actionLoading"
      @confirm="confirmAction"
    />

    <PartnerFormModal
      v-if="vendor"
      v-model:open="showEditModal"
      mode="edit"
      :item="vendor"
      :initial-project-ids="vendor.project_ids"
      :loading="isEditing"
      :api-errors="editApiErrors"
      @submit="handleEditSubmit"
    />
  </div>
</template>
