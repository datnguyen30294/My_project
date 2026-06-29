<script setup lang="ts">
import type { OgOrderConsoleSummary } from '~/composables/api/useOgOrders'

interface Props {
  summary: OgOrderConsoleSummary | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { loading: false })

const tenantsFailed = computed(() => props.summary?.warnings?.tenants_failed ?? 0)
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <!-- Tổng đơn -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p class="text-xs text-slate-500 mb-1">
          Tổng đơn
        </p>
        <p
          v-if="loading"
          class="h-7 bg-slate-100 rounded animate-pulse"
        />
        <p
          v-else
          class="text-xl font-bold text-slate-900"
        >
          {{ formatNumber(summary?.orders_count ?? 0) }}
        </p>
      </div>

      <!-- GMV -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p class="text-xs text-slate-500 mb-1">
          Giá trị giao dịch (GMV)
        </p>
        <p
          v-if="loading"
          class="h-7 bg-slate-100 rounded animate-pulse"
        />
        <p
          v-else
          class="text-xl font-bold text-slate-900 tabular-nums"
        >
          {{ formatCurrency(summary?.gmv ?? 0) }}
        </p>
      </div>

      <!-- Phí nền tảng -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p class="text-xs text-slate-500 mb-1">
          Phí nền tảng (đã chốt)
        </p>
        <p
          v-if="loading"
          class="h-7 bg-slate-100 rounded animate-pulse"
        />
        <p
          v-else
          class="text-xl font-bold text-emerald-600 tabular-nums"
        >
          {{ formatCurrency(summary?.platform_fee ?? 0) }}
        </p>
      </div>

      <!-- Số công ty VH -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p class="text-xs text-slate-500 mb-1">
          Công ty VH có đơn
        </p>
        <p
          v-if="loading"
          class="h-7 bg-slate-100 rounded animate-pulse"
        />
        <p
          v-else
          class="text-xl font-bold text-primary-600"
        >
          {{ formatNumber(summary?.tenants_count ?? 0) }}
        </p>
      </div>
    </div>

    <UAlert
      v-if="tenantsFailed > 0"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-octagon"
      title="Thiếu dữ liệu một số công ty VH"
      :description="`${tenantsFailed} công ty vận hành không đọc được dữ liệu đơn — số liệu có thể chưa đầy đủ.`"
    />
  </div>
</template>
