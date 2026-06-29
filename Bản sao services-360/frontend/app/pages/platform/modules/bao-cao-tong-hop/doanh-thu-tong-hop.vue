<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { RevenueByTenant } from '~/composables/api/usePlatformReports'
import { useRevenueReport } from '~/composables/api/usePlatformReports'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Doanh thu nền tảng - Báo cáo tổng hợp' })

const months = ref(6)
const { data, status, error } = useRevenueReport(computed(() => ({ months: months.value })))

const report = computed(() => data.value?.data ?? null)
const kpis = computed(() => report.value?.kpis ?? null)
const isLoading = computed(() => status.value === 'pending')

const chartPoints = computed(() =>
  (report.value?.analytics_months ?? []).map(m => ({
    label: m.month_label,
    bar: m.tenant_revenue,
    line: m.order_count,
    dash: m.platform_revenue
  }))
)

const tenantColumns: TableColumn<RevenueByTenant>[] = [
  { accessorKey: 'company_name', header: 'Công ty vận hành' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'project_count', header: 'Dự án' },
  { id: 'order_count', header: 'Số đơn vận hành' },
  { id: 'tenant_revenue', header: 'Doanh số vận hành (tham khảo)' },
  { id: 'platform_revenue', header: 'Tổng thu nền tảng' }
]
</script>

<template>
  <div>
    <PlatformReportPageHeader
      title="Doanh thu nền tảng"
      description="Phí nền tảng thu được theo từng công ty vận hành và theo thời gian."
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
      description="Đã xảy ra lỗi khi tải báo cáo doanh thu. Vui lòng thử lại."
      class="mb-6"
    />

    <template v-else>
      <!-- 4 KPI -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <PlatformReportKpiCard
          label="Tổng thu nền tảng"
          :value="formatCurrency(kpis?.total_platform_revenue ?? 0)"
          sub="Hoa hồng marketplace + phí vận hành"
          icon="i-lucide-banknote"
          accent="success"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="GMV marketplace"
          :value="formatCurrency(kpis?.marketplace_gmv ?? 0)"
          :sub="`${formatNumber(kpis?.order_count ?? 0)} đơn`"
          icon="i-lucide-shopping-cart"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Phí platform marketplace"
          :value="formatCurrency(kpis?.marketplace_platform_fee ?? 0)"
          :sub="`VH nhận ${formatCurrency(kpis?.marketplace_vh_share ?? 0)}`"
          icon="i-lucide-split"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Phí nền tảng (đơn vận hành)"
          :value="formatCurrency(kpis?.pmc_platform_fee ?? 0)"
          sub="Thu trên đơn dịch vụ vận hành"
          icon="i-lucide-landmark"
          :pending="isLoading"
        />
      </div>

      <!-- Chart xu hướng kinh doanh vận hành -->
      <SharedSectionCard
        title="Xu hướng kinh doanh theo công ty vận hành"
        icon="i-lucide-trending-up"
        class="mb-6"
      >
        <USkeleton
          v-if="isLoading"
          class="h-[280px] w-full"
        />
        <SharedDualAxisChart
          v-else
          :points="chartPoints"
          bar-label="Doanh số vận hành"
          line-label="Số đơn"
          dash-label="Phí nền tảng"
          line-unit=" đơn"
        />
      </SharedSectionCard>

      <!-- Bảng thu platform theo công ty VH -->
      <SharedSectionCard
        title="Thu platform theo công ty vận hành"
        icon="i-lucide-building-2"
        compact
      >
        <UTable
          :data="report?.by_tenant ?? []"
          :columns="tenantColumns"
          :loading="isLoading"
        >
          <template #company_name-cell="{ row }">
            <span class="font-medium text-slate-900">{{ row.original.company_name }}</span>
          </template>
          <template #status-cell="{ row }">
            <UBadge
              :color="row.original.status.value === 'active' ? 'success' : 'neutral'"
              variant="subtle"
              :label="row.original.status.label"
            />
          </template>
          <template #project_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.project_count) }}</span>
          </template>
          <template #order_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.order_count) }}</span>
          </template>
          <template #tenant_revenue-cell="{ row }">
            <span
              class="tabular-nums text-slate-500"
              title="Doanh số đơn vận hành của công ty — không tính vào tổng thu nền tảng"
            >{{ formatCurrency(row.original.tenant_revenue) }}</span>
          </template>
          <template #platform_revenue-cell="{ row }">
            <span class="tabular-nums font-bold text-slate-900">{{ formatCurrency(row.original.platform_revenue) }}</span>
          </template>
          <template #empty>
            <div class="py-8 text-center text-sm text-slate-500">
              Chưa có công ty vận hành phát sinh doanh thu.
            </div>
          </template>
        </UTable>
      </SharedSectionCard>
    </template>
  </div>
</template>
