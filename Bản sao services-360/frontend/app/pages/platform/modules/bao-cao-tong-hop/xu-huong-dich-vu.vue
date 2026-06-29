<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ServiceAdoptionMonth, ServiceAdoptionOffer } from '~/composables/api/usePlatformReports'
import { useServiceAdoptionReport } from '~/composables/api/usePlatformReports'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Xu hướng dịch vụ - Báo cáo tổng hợp' })

const months = ref(6)
const { data, status, error } = useServiceAdoptionReport(computed(() => ({ months: months.value })))

const report = computed(() => data.value?.data ?? null)
const kpis = computed(() => report.value?.kpis ?? null)
const isLoading = computed(() => status.value === 'pending')

const byTypeTotal = computed(() =>
  (report.value?.by_type ?? []).reduce((sum, t) => sum + t.order_count, 0)
)
function typeSharePct(orderCount: number): number {
  return byTypeTotal.value > 0 ? Math.round((orderCount / byTypeTotal.value) * 100) : 0
}

function typeColor(value: string): 'primary' | 'info' {
  return value === 'product' ? 'primary' : 'info'
}

const offerColumns: TableColumn<ServiceAdoptionOffer>[] = [
  { accessorKey: 'title', header: 'Tên offer' },
  { id: 'type', header: 'Loại' },
  { accessorKey: 'partner_name', header: 'Vendor' },
  { id: 'order_count', header: 'Đơn' },
  { id: 'gmv', header: 'GMV' }
]

const monthlyColumns: TableColumn<ServiceAdoptionMonth>[] = [
  { accessorKey: 'month_label', header: 'Tháng' },
  { id: 'order_count', header: 'Tổng đơn' },
  { id: 'product_count', header: 'SP' },
  { id: 'service_count', header: 'DV' },
  { id: 'gmv', header: 'GMV' }
]
</script>

<template>
  <div>
    <PlatformReportPageHeader
      title="Xu hướng dịch vụ"
      description="Mức độ tiêu thụ sản phẩm/dịch vụ trên đơn marketplace vendor: offer hot, tỷ trọng theo số đơn và xu hướng theo tháng."
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
      description="Đã xảy ra lỗi khi tải xu hướng dịch vụ. Vui lòng thử lại."
      class="mb-6"
    />

    <template v-else>
      <!-- 4 KPI -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <PlatformReportKpiCard
          label="Offer/DV đang active"
          :value="formatNumber(kpis?.total_offers ?? 0)"
          sub="Bộ vendor + loại + tên"
          icon="i-lucide-package"
          accent="primary"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Offer hot nhất"
          :value="kpis?.top_offer?.title ?? '—'"
          :sub="kpis?.top_offer ? `${formatNumber(kpis.top_offer.order_count)} đơn` : ''"
          icon="i-lucide-flame"
          accent="warning"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Tỷ trọng sản phẩm"
          :value="`${kpis?.product_share ?? 0}%`"
          sub="Theo số đơn"
          icon="i-lucide-box"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Tỷ trọng dịch vụ"
          :value="`${kpis?.service_share ?? 0}%`"
          sub="Theo số đơn"
          icon="i-lucide-wrench"
          :pending="isLoading"
        />
      </div>

      <!-- Mix SP vs DV -->
      <SharedSectionCard
        title="Mix sản phẩm vs dịch vụ"
        icon="i-lucide-pie-chart"
        compact
        class="mb-6"
      >
        <USkeleton
          v-if="isLoading"
          class="h-28 w-full"
        />
        <div
          v-else-if="(report?.by_type.length ?? 0) === 0"
          class="py-8 text-center text-sm text-slate-500"
        >
          Chưa có đơn dịch vụ trong kỳ.
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div
            v-for="bucket in report?.by_type ?? []"
            :key="bucket.type.value"
            class="rounded-lg border border-slate-200 p-4"
          >
            <div class="flex items-center justify-between">
              <span class="font-semibold text-slate-900">{{ bucket.type.label }}</span>
              <UBadge
                :color="typeColor(bucket.type.value)"
                variant="subtle"
                :label="`${formatNumber(bucket.order_count)} đơn`"
              />
            </div>
            <div class="mt-2 text-lg font-bold text-slate-900 tabular-nums">
              {{ formatCurrency(bucket.gmv) }}
            </div>
            <UProgress
              :model-value="typeSharePct(bucket.order_count)"
              :color="typeColor(bucket.type.value)"
              class="mt-3"
            />
            <div class="mt-1 text-xs text-slate-500">
              {{ typeSharePct(bucket.order_count) }}% số đơn
            </div>
          </div>
        </div>
      </SharedSectionCard>

      <!-- Top offer -->
      <SharedSectionCard
        title="Top offer / dịch vụ (theo số đơn)"
        icon="i-lucide-list-ordered"
        compact
        class="mb-6"
      >
        <UTable
          :data="report?.offers ?? []"
          :columns="offerColumns"
          :loading="isLoading"
        >
          <template #title-cell="{ row }">
            <span class="font-medium text-slate-900">{{ row.original.title || '—' }}</span>
          </template>
          <template #type-cell="{ row }">
            <UBadge
              :color="typeColor(row.original.type.value)"
              variant="subtle"
              :label="row.original.type.label"
            />
          </template>
          <template #order_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.order_count) }}</span>
          </template>
          <template #gmv-cell="{ row }">
            <span class="tabular-nums">{{ formatCurrency(row.original.gmv) }}</span>
          </template>
          <template #empty>
            <div class="py-8 text-center text-sm text-slate-500">
              Chưa có đơn dịch vụ trong kỳ.
            </div>
          </template>
        </UTable>
      </SharedSectionCard>

      <!-- Đơn theo tháng -->
      <SharedSectionCard
        title="Đơn theo tháng — SP vs DV"
        icon="i-lucide-calendar-range"
        compact
      >
        <UTable
          :data="report?.monthly ?? []"
          :columns="monthlyColumns"
          :loading="isLoading"
        >
          <template #order_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.order_count) }}</span>
          </template>
          <template #product_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.product_count) }}</span>
          </template>
          <template #service_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.service_count) }}</span>
          </template>
          <template #gmv-cell="{ row }">
            <span class="tabular-nums">{{ formatCurrency(row.original.gmv) }}</span>
          </template>
        </UTable>
      </SharedSectionCard>
    </template>
  </div>
</template>
