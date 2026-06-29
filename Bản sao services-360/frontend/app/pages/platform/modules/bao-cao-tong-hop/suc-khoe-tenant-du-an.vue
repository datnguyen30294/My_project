<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { TenantHealthByCompany, TenantHealthByProject } from '~/composables/api/usePlatformReports'
import { useTenantHealthReport } from '~/composables/api/usePlatformReports'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Sức khỏe công ty vận hành & dự án - Báo cáo tổng hợp' })

const months = ref(6)
// Lọc công ty thực hiện client-side để giữ đầy đủ danh sách lựa chọn từ 1 lần
// fetch (by_company chứa toàn bộ công ty + by_project có company_name để khớp).
const companyId = ref<string | undefined>(undefined)

const { data, status, error } = useTenantHealthReport(computed(() => ({ months: months.value })))

const report = computed(() => data.value?.data ?? null)
const isLoading = computed(() => status.value === 'pending')

const companyItems = computed(() => [
  { value: undefined, label: 'Tất cả công ty vận hành' },
  ...(report.value?.by_company ?? []).map(c => ({ value: c.company_id, label: c.company_name }))
])

const selectedCompanyName = computed(() =>
  companyId.value
    ? report.value?.by_company.find(c => c.company_id === companyId.value)?.company_name ?? null
    : null
)

const filteredCompanies = computed(() =>
  companyId.value
    ? (report.value?.by_company ?? []).filter(c => c.company_id === companyId.value)
    : report.value?.by_company ?? []
)

const filteredProjects = computed(() =>
  selectedCompanyName.value
    ? (report.value?.by_project ?? []).filter(p => p.company_name === selectedCompanyName.value)
    : report.value?.by_project ?? []
)

function trendLabel(trend: number): string {
  return trend > 0 ? `+${trend}` : String(trend)
}
function trendClass(trend: number): string {
  if (trend > 0) return 'text-emerald-600'
  if (trend < 0) return 'text-red-600'
  return 'text-slate-400'
}

const companyColumns: TableColumn<TenantHealthByCompany>[] = [
  { accessorKey: 'company_name', header: 'Công ty vận hành' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'project_count', header: 'Dự án' },
  { id: 'order_count', header: 'Số đơn OG' },
  { id: 'revenue', header: 'Doanh thu OG' },
  { id: 'platform_fee', header: 'Phí nền tảng' },
  { id: 'csat', header: 'CSAT' },
  { id: 'order_trend', header: 'Δ đơn T-1' }
]

const projectColumns: TableColumn<TenantHealthByProject>[] = [
  { accessorKey: 'project_name', header: 'Dự án' },
  { accessorKey: 'company_name', header: 'Công ty vận hành' },
  { id: 'order_count', header: 'Số đơn OG' },
  { id: 'revenue', header: 'Doanh thu OG' },
  { id: 'platform_fee', header: 'Phí nền tảng' },
  { id: 'csat', header: 'CSAT' }
]
</script>

<template>
  <div>
    <PlatformReportPageHeader
      title="Sức khỏe công ty vận hành & dự án"
      description="Hiệu suất từng công ty vận hành theo đơn vận hành OG (số đơn/doanh thu/phí nền tảng/CSAT) và chi tiết theo dự án, kèm thay đổi số đơn tháng gần nhất."
    >
      <template #filters>
        <USelect
          v-model="companyId"
          :items="companyItems"
          value-key="value"
          icon="i-lucide-building-2"
          class="min-w-[200px]"
        />
        <PlatformReportPeriodSelect v-model="months" />
      </template>
    </PlatformReportPageHeader>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      title="Không tải được báo cáo"
      description="Đã xảy ra lỗi khi tải sức khỏe công ty vận hành & dự án. Vui lòng thử lại."
      class="mb-6"
    />

    <template v-else>
      <!-- Sức khỏe theo công ty VH -->
      <SharedSectionCard
        title="Sức khỏe theo công ty vận hành"
        icon="i-lucide-building-2"
        compact
        class="mb-6"
      >
        <UTable
          :data="filteredCompanies"
          :columns="companyColumns"
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
          <template #revenue-cell="{ row }">
            <span class="tabular-nums">{{ formatCurrency(row.original.revenue) }}</span>
          </template>
          <template #platform_fee-cell="{ row }">
            <span class="tabular-nums">{{ formatCurrency(row.original.platform_fee) }}</span>
          </template>
          <template #csat-cell="{ row }">
            <span class="tabular-nums">{{ residentRatingAvgLabel(row.original.avg_rating, row.original.rated_count) }}</span>
          </template>
          <template #order_trend-cell="{ row }">
            <span
              class="tabular-nums font-medium"
              :class="trendClass(row.original.order_trend)"
            >{{ trendLabel(row.original.order_trend) }}</span>
          </template>
          <template #empty>
            <div class="py-8 text-center text-sm text-slate-500">
              Chưa có công ty vận hành / đơn trong kỳ.
            </div>
          </template>
        </UTable>
      </SharedSectionCard>

      <!-- Chi tiết theo dự án -->
      <SharedSectionCard
        title="Chi tiết theo dự án"
        icon="i-lucide-folder-kanban"
        compact
      >
        <UTable
          :data="filteredProjects"
          :columns="projectColumns"
          :loading="isLoading"
        >
          <template #project_name-cell="{ row }">
            <span class="font-medium text-slate-900">{{ row.original.project_name }}</span>
          </template>
          <template #order_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.order_count) }}</span>
          </template>
          <template #revenue-cell="{ row }">
            <span class="tabular-nums">{{ formatCurrency(row.original.revenue) }}</span>
          </template>
          <template #platform_fee-cell="{ row }">
            <span class="tabular-nums">{{ formatCurrency(row.original.platform_fee) }}</span>
          </template>
          <template #csat-cell="{ row }">
            <span class="tabular-nums">{{ residentRatingAvgLabel(row.original.avg_rating, row.original.rated_count) }}</span>
          </template>
          <template #empty>
            <div class="py-8 text-center text-sm text-slate-500">
              Chưa có dự án phát sinh đơn OG.
            </div>
          </template>
        </UTable>
      </SharedSectionCard>
    </template>
  </div>
</template>
