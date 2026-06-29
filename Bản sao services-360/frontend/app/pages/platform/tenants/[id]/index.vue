<script setup lang="ts">
definePageMeta({ layout: 'platform' })

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))

const { data, status, error, refresh } = usePlatformTenantDetail(id)
const tenant = computed(() => data.value?.data ?? null)

useSeoMeta({
  title: computed(() => tenant.value
    ? `${tenant.value.name} - Công ty vận hành`
    : 'Chi tiết công ty vận hành')
})

const notFound = computed(() => {
  if (!error.value) return false
  return getApiErrorStatus(error.value) === 404
})

// ─── Tabs ──────────────────────────────────────────────────────

type TabId = 'info' | 'accounts' | 'services' | 'config'
const tabIds: TabId[] = ['info', 'accounts', 'services', 'config']
const tabItems = [
  { value: 'info' as TabId, label: 'Thông tin chung', icon: 'i-lucide-info' },
  { value: 'accounts' as TabId, label: 'Quản lý tài khoản', icon: 'i-lucide-users' },
  { value: 'services' as TabId, label: 'Quản lý dịch vụ', icon: 'i-lucide-layout-grid' },
  { value: 'config' as TabId, label: 'Cấu hình', icon: 'i-lucide-settings' }
]

const activeTab = ref<TabId>(
  tabIds.includes(route.query.tab as TabId) ? route.query.tab as TabId : 'info'
)

watch(activeTab, (v) => {
  router.replace({ query: { ...route.query, tab: v === 'info' ? undefined : v } })
})

// ─── Toggle active ─────────────────────────────────────────────

const {
  showActiveConfirm, activating, isTogglingActive,
  openActiveConfirm, confirmToggleActive
} = useTenantToggleActive(refresh)

async function handleUpdated() {
  await refresh()
}
</script>

<template>
  <div>
    <!-- Loading -->
    <div
      v-if="status === 'pending' && !tenant"
      class="flex flex-col gap-4"
    >
      <div class="h-24 bg-slate-100 rounded-xl animate-pulse" />
      <div class="h-48 bg-slate-100 rounded-xl animate-pulse" />
    </div>

    <!-- Not found -->
    <div
      v-else-if="notFound"
      class="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center"
    >
      <UIcon
        name="i-lucide-building-2"
        class="size-12 text-slate-300 mx-auto"
      />
      <h2 class="mt-4 text-lg font-semibold text-slate-900">
        Không tìm thấy công ty vận hành
      </h2>
      <p class="mt-1 text-sm text-slate-500">
        Công ty không tồn tại hoặc đã bị xoá khỏi hệ thống.
      </p>
      <UButton
        icon="i-lucide-arrow-left"
        label="Quay về danh sách"
        class="mt-5"
        to="/platform/tenants"
      />
    </div>

    <UAlert
      v-else-if="error && !tenant"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      description="Không tải được thông tin công ty vận hành."
    />

    <div
      v-else-if="tenant"
      class="flex flex-col gap-6"
    >
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <UButton
          icon="i-lucide-arrow-left"
          label="Danh sách công ty vận hành"
          color="neutral"
          variant="ghost"
          size="xs"
          to="/platform/tenants"
          class="mb-3"
        />
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex items-start gap-4 min-w-0 flex-1">
            <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50">
              <UIcon
                name="i-lucide-building-2"
                class="size-6 text-primary-600"
              />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-xl font-bold text-slate-900">
                  {{ tenant.name }}
                </h1>
                <UBadge
                  :color="tenant.is_active ? 'success' : 'warning'"
                  variant="subtle"
                  :label="tenant.is_active ? 'Hoạt động' : 'Vô hiệu'"
                />
              </div>
              <p class="mt-1 text-sm text-slate-500 font-mono">
                {{ tenant.id }}
              </p>
            </div>
          </div>
          <UButton
            :icon="tenant.is_active ? 'i-lucide-power-off' : 'i-lucide-power'"
            :label="tenant.is_active ? 'Vô hiệu hoá' : 'Kích hoạt lại'"
            :color="tenant.is_active ? 'warning' : 'primary'"
            variant="solid"
            @click="openActiveConfirm(tenant)"
          />
        </div>
      </div>

      <!-- Tổng quan kinh doanh -->
      <TenantBusinessSummaryCard :tenant-id="tenant.id" />

      <!-- Tabs -->
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        variant="link"
        :content="false"
        class="w-full"
      />

      <TenantInfoTab
        v-if="activeTab === 'info'"
        :tenant="tenant"
        @updated="handleUpdated"
      />

      <TenantAccountsTab
        v-if="activeTab === 'accounts'"
        :tenant-id="tenant.id"
      />

      <TenantModulesTab
        v-if="activeTab === 'services'"
        :tenant="tenant"
        @updated="handleUpdated"
      />

      <TenantConfigTab
        v-if="activeTab === 'config'"
        :tenant="tenant"
        @updated="handleUpdated"
      />

      <TenantToggleActiveModal
        v-model:open="showActiveConfirm"
        :tenant-name="tenant.name"
        :activating="activating"
        :loading="isTogglingActive"
        @confirm="confirmToggleActive"
      />
    </div>
  </div>
</template>
