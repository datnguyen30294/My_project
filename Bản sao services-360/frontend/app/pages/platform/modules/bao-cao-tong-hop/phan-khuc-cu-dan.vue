<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ResidentSegmentTopResident } from '~/composables/api/usePlatformReports'
import { useResidentSegmentReport } from '~/composables/api/usePlatformReports'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Phân khúc cư dân - Báo cáo tổng hợp' })

const months = ref(6)
const { data, status, error } = useResidentSegmentReport(computed(() => ({ months: months.value })))

const report = computed(() => data.value?.data ?? null)
const kpis = computed(() => report.value?.kpis ?? null)
const isLoading = computed(() => status.value === 'pending')

function segmentColor(value: string): 'primary' | 'neutral' {
  return value === 'project' ? 'primary' : 'neutral'
}

const residentColumns: TableColumn<ResidentSegmentTopResident>[] = [
  { id: 'resident_name', header: 'Khách hàng' },
  { id: 'order_count', header: 'Số đơn' },
  { id: 'gmv', header: 'GMV' },
  { id: 'csat', header: 'CSAT' }
]
</script>

<template>
  <div>
    <PlatformReportPageHeader
      title="Phân khúc cư dân"
      description="Phân khúc theo nguồn khách: cư dân dự án vs khách vãng lai, trên miền đơn marketplace vendor."
    >
      <template #filters>
        <PlatformReportPeriodSelect v-model="months" />
      </template>
    </PlatformReportPageHeader>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      title="Không tải được báo cáo"
      description="Đã xảy ra lỗi khi tải phân khúc cư dân. Vui lòng thử lại."
      class="mb-6"
    />

    <template v-else>
      <!-- 4 KPI -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <PlatformReportKpiCard
          label="Cư dân có đơn"
          :value="`${formatNumber(kpis?.active_residents ?? 0)} / ${formatNumber(kpis?.total_residents ?? 0)}`"
          sub="Có phát sinh đơn / tổng danh bạ"
          icon="i-lucide-users"
          accent="primary"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Đơn cư dân dự án"
          :value="`${kpis?.project_order_share ?? 0}%`"
          sub="Theo số đơn"
          icon="i-lucide-building-2"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Đơn khách vãng lai"
          :value="`${kpis?.walk_in_order_share ?? 0}%`"
          sub="Theo số đơn"
          icon="i-lucide-user-round"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="GMV cư dân dự án"
          :value="formatCurrency(kpis?.project_gmv ?? 0)"
          :sub="`Vãng lai ${formatCurrency(kpis?.walk_in_gmv ?? 0)}`"
          icon="i-lucide-banknote"
          accent="success"
          :pending="isLoading"
        />
      </div>

      <!-- 2 segment cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <template v-if="isLoading">
          <USkeleton
            v-for="i in 2"
            :key="i"
            class="h-36 w-full rounded-xl"
          />
        </template>
        <UCard
          v-for="segment in report?.segments ?? []"
          v-else
          :key="segment.source.value"
          :ui="{ body: 'px-5 py-4' }"
        >
          <div class="flex items-center justify-between">
            <span class="font-semibold text-slate-900">{{ segment.source.label }}</span>
            <UBadge
              :color="segmentColor(segment.source.value)"
              variant="subtle"
              :label="`${formatNumber(segment.order_count)} đơn`"
            />
          </div>
          <div class="mt-3 text-2xl font-bold text-slate-900 tabular-nums">
            {{ formatCurrency(segment.gmv) }}
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <UIcon
              name="i-lucide-star"
              class="size-4 text-amber-500"
            />
            <span>CSAT {{ residentRatingAvgLabel(segment.avg_rating, segment.rated_count) }}</span>
          </div>
        </UCard>
      </div>

      <!-- Top khách hàng -->
      <SharedSectionCard
        title="Top khách hàng theo số đơn"
        icon="i-lucide-trophy"
        compact
      >
        <UTable
          :data="report?.top_residents ?? []"
          :columns="residentColumns"
          :loading="isLoading"
        >
          <template #resident_name-cell="{ row }">
            <span class="font-medium text-slate-900">{{ row.original.resident_name ?? '—' }}</span>
          </template>
          <template #order_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.order_count) }}</span>
          </template>
          <template #gmv-cell="{ row }">
            <span class="tabular-nums">{{ formatCurrency(row.original.gmv) }}</span>
          </template>
          <template #csat-cell="{ row }">
            <span class="tabular-nums">{{ residentRatingAvgLabel(row.original.avg_rating, row.original.rated_count) }}</span>
          </template>
          <template #empty>
            <div class="py-8 text-center text-sm text-slate-500">
              Chưa có dữ liệu cư dân trong kỳ.
            </div>
          </template>
        </UTable>
      </SharedSectionCard>
    </template>
  </div>
</template>
