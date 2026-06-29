<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const toast = useToast()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useTenantPartnerDetail(id)
const vendor = computed(() => data.value?.data ?? null)

async function refreshVendor() {
  clearTenantPartnerCache(id.value)
  await refresh()
}

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => vendor.value?.display_name ?? vendor.value?.name ?? null))

useSeoMeta({
  title: computed(() => vendor.value
    ? `${vendor.value.display_name ?? vendor.value.name} - Vendor`
    : 'Chi tiết vendor')
})

// Handle 404 / 403 redirects
watch(error, (e) => {
  if (!e) return
  const apiErr = e as { data?: { error_code?: string }, status?: number, statusCode?: number }
  const status = apiErr?.status ?? apiErr?.statusCode
  if (status === 404) {
    toast.add({
      title: 'Không tìm thấy vendor',
      description: 'Vendor không tồn tại hoặc không thuộc tenant của bạn.',
      color: 'error'
    })
    router.replace('/pmc/vendors')
  } else if (status === 403 && apiErr?.data?.error_code === 'VENDOR_FEATURE_DISABLED') {
    toast.add({
      title: 'Tenant chưa kích hoạt gói vendor',
      color: 'warning'
    })
    router.replace('/pmc/dashboard')
  }
})

// ─── Delete ────────────────────────────────────────────
const crud = useCrudModals<NonNullable<typeof vendor.value>>()
const { showDeleteModal, deleteTarget, openDeleteModal } = crud
const { isDeleting, submitDelete } = useCrudSubmit(crud, async () => {
  await refresh()
})

function onDeleteClick() {
  if (!vendor.value) return
  openDeleteModal(vendor.value)
}

function handleDelete() {
  submitDelete(
    () => apiDeleteTenantPartner(deleteTarget.value!.id),
    {
      message: 'Đã xoá vendor.',
      navigateAfter: '/pmc/vendors',
      onError: (err) => {
        const apiErr = err as { data?: { error_code?: string } }
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

function customDomainUrl(domain: string): string {
  return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`
}

// ─── Tabs ──────────────────────────────────────────────
type TabId = 'info' | 'contracts' | 'orders'
const tabItems = [
  { value: 'info' as TabId, label: 'Thông tin', icon: 'i-lucide-info' },
  { value: 'contracts' as TabId, label: 'Hợp đồng hoa hồng', icon: 'i-lucide-handshake' },
  { value: 'orders' as TabId, label: 'Đơn hàng', icon: 'i-lucide-shopping-bag' }
]

const activeTab = ref<TabId>(
  (['contracts', 'orders'] as const).includes(route.query.tab as TabId)
    ? (route.query.tab as TabId)
    : 'info'
)

watch(activeTab, (v) => {
  router.replace({ query: { ...route.query, tab: v === 'info' ? undefined : v } })
})

// ─── Retry provision ──────────────────────────────────
const isProvisioning = ref(false)
async function retryProvision() {
  if (!vendor.value) return
  isProvisioning.value = true
  try {
    await apiProvisionTenantPartner(vendor.value.id)
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
    isProvisioning.value = false
  }
}
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

    <!-- Error fallback (non-redirected) -->
    <UAlert
      v-else-if="error && !vendor"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      description="Không tải được thông tin vendor."
    />

    <!-- Content -->
    <div
      v-else-if="vendor"
      class="flex flex-col gap-6"
    >
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex items-start gap-4 min-w-0 flex-1">
            <UAvatar
              :src="vendor.logo_url ?? undefined"
              :alt="vendor.name"
              :text="firstChar(vendor.display_name ?? vendor.name)"
              size="lg"
            />
            <div class="min-w-0">
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-xl font-bold text-slate-900">
                  {{ vendor.display_name ?? vendor.name }}
                </h1>
                <UBadge
                  :color="vendor.status.value === 'active' ? 'success'
                    : vendor.status.value === 'suspended' ? 'warning' : 'neutral'"
                  variant="subtle"
                  :label="vendor.status.label"
                />
                <UBadge
                  v-if="vendor.is_provisioned"
                  color="success"
                  variant="subtle"
                  label="Đã kích hoạt"
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

          <div
            v-if="vendor.is_owned"
            class="flex items-center gap-2 shrink-0"
          >
            <UButton
              icon="i-lucide-pencil"
              label="Chỉnh sửa"
              variant="soft"
              color="primary"
              :to="`/pmc/vendors/${vendor.id}/edit`"
            />
            <UButton
              v-if="!vendor.is_provisioned"
              icon="i-lucide-trash-2"
              variant="soft"
              color="error"
              aria-label="Xoá vendor"
              @click="onDeleteClick"
            />
          </div>
          <UBadge
            v-else
            color="neutral"
            variant="subtle"
            icon="i-lucide-store"
            label="Vendor dùng chung"
            class="shrink-0"
          />
        </div>
      </div>

      <!-- Tabs -->
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        variant="link"
        :content="false"
        class="w-full"
      />

      <PartnerCommissionContractTenantContractsPanel
        v-if="activeTab === 'contracts'"
        :partner-id="vendor.id"
        :project-ids="vendor.project_ids ?? []"
      />

      <VendorOrderOrdersPanel
        v-if="activeTab === 'orders'"
        :partner-id="vendor.id"
      />

      <template v-if="activeTab === 'info'">
        <UAlert
          v-if="vendor.is_owned && !vendor.is_provisioned"
          color="warning"
          variant="subtle"
          icon="i-lucide-clock"
          title="Vendor chưa kích hoạt shop trên resi_mart"
          description="Lần tạo trước, hệ thống không liên hệ được resi_mart. Bạn có thể bấm 'Thử kích hoạt lại'; nếu vẫn lỗi, liên hệ Platform admin."
        >
          <template #actions>
            <UButton
              icon="i-lucide-rocket"
              color="warning"
              label="Thử kích hoạt lại"
              size="sm"
              :loading="isProvisioning"
              @click="retryProvision"
            />
          </template>
        </UAlert>
        <UAlert
          v-else-if="vendor.is_provisioned"
          color="info"
          variant="subtle"
          icon="i-lucide-info"
          title="Vendor đã được kích hoạt"
          description="Vendor đã có shop trên resi_mart. Để xoá vendor, vui lòng liên hệ Platform admin."
        />

        <SharedSectionCard title="Thông tin cơ bản">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SharedFieldDisplay label="Tên đầy đủ">
              <span class="font-medium">{{ vendor.name }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tên hiển thị">
              {{ vendor.display_name ?? '—' }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Slug">
              <span class="font-mono">{{ vendor.slug }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Trạng thái">
              <UBadge
                :color="vendor.status.value === 'active' ? 'success'
                  : vendor.status.value === 'suspended' ? 'warning' : 'neutral'"
                variant="subtle"
                :label="vendor.status.label"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay
              label="Danh mục"
              class="sm:col-span-2"
            >
              <div
                v-if="vendor.categories.length"
                class="flex flex-wrap gap-1.5"
              >
                <UBadge
                  v-for="cat in vendor.categories"
                  :key="cat"
                  color="info"
                  variant="subtle"
                  :label="cat"
                  size="xs"
                />
              </div>
              <span
                v-else
                class="text-slate-400"
              >—</span>
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <SharedSectionCard title="Liên hệ">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SharedFieldDisplay label="Email chủ sở hữu">
              {{ vendor.owner_email }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="SĐT chủ sở hữu">
              <span
                v-if="vendor.owner_phone"
                class="font-mono"
              >{{ formatPhone(vendor.owner_phone) }}</span>
              <span v-else>—</span>
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <SharedSectionCard title="Trang shop">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SharedFieldDisplay label="Custom domain">
              <a
                v-if="vendor.custom_domain && vendor.is_provisioned"
                :href="customDomainUrl(vendor.custom_domain)"
                target="_blank"
                rel="noopener"
                class="text-primary-600 hover:underline inline-flex items-center gap-1"
              >
                {{ vendor.custom_domain }}
                <UIcon
                  name="i-lucide-external-link"
                  class="size-3.5"
                />
              </a>
              <span v-else>{{ vendor.custom_domain ?? '—' }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Trạng thái provision">
              <UBadge
                v-if="vendor.is_provisioned"
                color="success"
                variant="subtle"
                label="Đã kích hoạt"
                icon="i-lucide-check"
                size="sm"
              />
              <UBadge
                v-else
                color="warning"
                variant="subtle"
                label="Chờ provision"
                icon="i-lucide-clock"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="vendor.is_provisioned"
              label="Tenant ID resi_mart"
            >
              <span class="font-mono text-sm">{{ vendor.tenant_id ?? '—' }}</span>
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <VendorProjectsCard
          :vendor="vendor"
          @changed="refreshVendor"
        />

        <SharedSectionCard
          v-if="vendor.description"
          title="Mô tả"
        >
          <p class="whitespace-pre-line text-slate-700">
            {{ vendor.description }}
          </p>
        </SharedSectionCard>

        <SharedSectionCard
          title="Audit"
          compact
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <SharedFieldDisplay label="Ngày tạo">
              {{ vendor.created_at ? formatDateTime(vendor.created_at) : '—' }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Cập nhật lần cuối">
              {{ vendor.updated_at ? formatDateTime(vendor.updated_at) : '—' }}
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>
      </template>
    </div>

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá vendor"
      :item-name="deleteTarget?.display_name ?? deleteTarget?.name"
      :loading="isDeleting"
      description="Vendor sẽ bị xoá (soft-delete). Chỉ áp dụng cho vendor chưa được kích hoạt shop."
      @confirm="handleDelete"
    />
  </div>
</template>
