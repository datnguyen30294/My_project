<script setup lang="ts">
import { useTenantBusinessSummary } from '~/composables/api/useTenants'
import { useProjectBusinessSummary } from '~/composables/api/usePlatformProjects'

interface Props {
  tenantId: string
  /** Khi có: lọc số liệu theo một dự án thay vì toàn tenant. */
  projectId?: number
}

const props = defineProps<Props>()

const isProjectScope = props.projectId != null

const { data, status, error, refresh } = isProjectScope
  ? useProjectBusinessSummary(() => props.tenantId, () => props.projectId!)
  : useTenantBusinessSummary(() => props.tenantId)

const scopeWord = isProjectScope ? 'dự án' : 'công ty vận hành'
const cardTitle = isProjectScope ? 'Biểu đồ kinh doanh dự án (6 tháng)' : 'Tổng quan kinh doanh (6 tháng)'
const introText = `Doanh thu, số đơn hàng và phí nền tảng thực thu từ các đơn hàng đã hoàn thành của ${scopeWord} trong 6 tháng gần nhất.`
const emptyDescription = `Biểu đồ sẽ hiển thị khi ${scopeWord} có đơn hàng hoàn thành trong kỳ.`

const summary = computed(() => data.value?.data?.summary ?? {
  tenant_revenue: 0,
  order_count: 0,
  platform_revenue: 0
})
const months = computed(() => data.value?.data?.months ?? [])

const hasActivity = computed(() => summary.value.order_count > 0)
const isLoading = computed(() => status.value === 'pending' && !data.value)

const tiles = computed(() => [
  { label: isProjectScope ? 'Doanh thu dự án' : 'Doanh thu', value: formatCurrency(summary.value.tenant_revenue), accent: 'text-slate-900' },
  { label: 'Số đơn hàng', value: formatNumber(summary.value.order_count), accent: 'text-slate-900' },
  { label: 'Phí platform thu về', value: formatCurrency(summary.value.platform_revenue), accent: 'text-emerald-600' }
])

const legend = [
  { label: 'Doanh thu', class: 'inline-block size-2.5 rounded-sm bg-emerald-400' },
  { label: 'Số đơn hàng', class: 'inline-block h-0.5 w-4 rounded-full bg-amber-500' },
  { label: 'Phí platform', class: 'inline-block h-0.5 w-4 rounded-full bg-emerald-600' }
]
</script>

<template>
  <SharedSectionCard
    :title="cardTitle"
    icon="i-lucide-chart-column"
  >
    <template #header-actions>
      <div class="flex flex-wrap gap-3 text-xs text-slate-500">
        <span
          v-for="item in legend"
          :key="item.label"
          class="flex items-center gap-1.5"
        >
          <span :class="item.class" />
          {{ item.label }}
        </span>
      </div>
    </template>

    <p class="text-sm text-slate-500 mb-4">
      {{ introText }}
    </p>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      title="Không tải được dữ liệu kinh doanh"
      description="Đã xảy ra lỗi khi tải số liệu. Vui lòng thử lại."
    >
      <template #actions>
        <UButton
          label="Thử lại"
          color="error"
          variant="soft"
          size="xs"
          icon="i-lucide-refresh-cw"
          @click="refresh()"
        />
      </template>
    </UAlert>

    <template v-else>
      <!-- Loading -->
      <div v-if="isLoading">
        <div class="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3">
          <USkeleton
            v-for="i in 3"
            :key="i"
            class="h-20 w-full rounded-lg"
          />
        </div>
        <USkeleton class="h-[280px] w-full rounded-lg" />
      </div>

      <template v-else>
        <!-- Stat tiles -->
        <div class="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3">
          <div
            v-for="tile in tiles"
            :key="tile.label"
            class="rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"
          >
            <p class="text-sm text-slate-500">
              {{ tile.label }}
            </p>
            <p
              class="mt-1 text-xl font-semibold tabular-nums"
              :class="tile.accent"
            >
              {{ tile.value }}
            </p>
          </div>
        </div>

        <!-- Monthly chart -->
        <TenantBusinessChart
          v-if="hasActivity"
          :months="months"
        />
        <UEmpty
          v-else
          icon="i-lucide-chart-column"
          title="Chưa có dữ liệu kinh doanh"
          :description="emptyDescription"
        />
      </template>
    </template>
  </SharedSectionCard>
</template>
