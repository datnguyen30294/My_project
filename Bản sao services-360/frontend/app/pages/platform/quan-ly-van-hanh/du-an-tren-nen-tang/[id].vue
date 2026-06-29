<script setup lang="ts">
import { usePlatformProjectDetail } from '~/composables/api/usePlatformProjects'

definePageMeta({ layout: 'platform' })

const route = useRoute()
const router = useRouter()

const LIST_ROUTE = '/platform/quan-ly-van-hanh/du-an-tren-nen-tang'

const projectId = computed(() => Number(route.params.id))
const tenantId = computed(() => String(route.query.tenant ?? ''))

const { data, status, error } = usePlatformProjectDetail(tenantId, projectId)
const project = computed(() => data.value?.data ?? null)

useSeoMeta({
  title: computed(() => project.value
    ? `${project.value.name} - Dự án trên nền tảng`
    : 'Chi tiết dự án')
})

const notFound = computed(() => {
  if (!tenantId.value) return true
  if (!error.value) return false
  return getApiErrorStatus(error.value) === 404
})

// ─── Tabs ──────────────────────────────────────────────────────
type TabId = 'info' | 'orders' | 'vendors' | 'config'
const tabIds: TabId[] = ['info', 'orders', 'vendors', 'config']
const tabItems = [
  { value: 'info' as TabId, label: 'Thông tin chung', icon: 'i-lucide-info' },
  { value: 'orders' as TabId, label: 'Đơn hàng', icon: 'i-lucide-shopping-cart' },
  { value: 'vendors' as TabId, label: 'Vendor', icon: 'i-lucide-store' },
  { value: 'config' as TabId, label: 'Cấu hình', icon: 'i-lucide-settings' }
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
      v-if="status === 'pending' && !project && !notFound"
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
        name="i-lucide-folder-x"
        class="size-12 text-slate-300 mx-auto"
      />
      <h2 class="mt-4 text-lg font-semibold text-slate-900">
        Không tìm thấy dự án
      </h2>
      <p class="mt-1 text-sm text-slate-500">
        Dự án không tồn tại, đã bị xoá, hoặc liên kết truy cập không hợp lệ.
      </p>
      <UButton
        icon="i-lucide-arrow-left"
        label="Quay về danh sách"
        class="mt-5"
        :to="LIST_ROUTE"
      />
    </div>

    <UAlert
      v-else-if="error && !project"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      description="Không tải được thông tin dự án."
    />

    <div
      v-else-if="project"
      class="flex flex-col gap-6"
    >
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <UButton
          icon="i-lucide-arrow-left"
          label="Danh sách dự án trên nền tảng"
          color="neutral"
          variant="ghost"
          size="xs"
          :to="LIST_ROUTE"
          class="mb-3"
        />
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex items-start gap-4 min-w-0 flex-1">
            <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50">
              <UIcon
                name="i-lucide-folder-kanban"
                class="size-6 text-primary-600"
              />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-xl font-bold text-slate-900">
                  {{ project.name }}
                </h1>
                <UBadge
                  :color="project.status.value === 'managing' ? 'success' : 'neutral'"
                  variant="subtle"
                  :label="project.status.label"
                />
              </div>
              <div class="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <span class="font-mono">{{ project.code }}</span>
                <span>·</span>
                <NuxtLink
                  :to="`/platform/tenants/${project.tenant.id}`"
                  class="hover:text-primary-600 hover:underline"
                >
                  <span class="font-mono">{{ project.tenant.code }}</span> — {{ project.tenant.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Biểu đồ kinh doanh dự án -->
      <TenantBusinessSummaryCard
        :tenant-id="tenantId"
        :project-id="projectId"
      />

      <!-- Đánh giá của cư dân -->
      <TenantResidentRatingsCard
        :tenant-id="tenantId"
        :project-id="projectId"
      />

      <!-- Tabs -->
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        variant="link"
        :content="false"
        class="w-full"
      />

      <PlatformProjectInfoTab
        v-if="activeTab === 'info'"
        :project="project"
      />

      <PlatformProjectOrdersTab
        v-else-if="activeTab === 'orders'"
        :tenant-id="tenantId"
        :project-id="projectId"
      />

      <PlatformProjectVendorTab
        v-else-if="activeTab === 'vendors'"
        :tenant-id="tenantId"
        :project-id="projectId"
      />

      <PlatformProjectFeeConfigTab
        v-else-if="activeTab === 'config'"
        :tenant-id="tenantId"
        :project-id="projectId"
      />
    </div>
  </div>
</template>
