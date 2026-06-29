<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  CommissionByProject,
  CommissionByRecipient,
  CommissionByVendor
} from '~/composables/api/usePlatformReports'
import { useCommissionAllocationReport } from '~/composables/api/usePlatformReports'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Hoa hồng & phân bổ - Báo cáo tổng hợp' })

const months = ref(6)
const { data, status, error } = useCommissionAllocationReport(computed(() => ({ months: months.value })))

const report = computed(() => data.value?.data ?? null)
const kpis = computed(() => report.value?.kpis ?? null)
const isLoading = computed(() => status.value === 'pending')

const recipientColumns: TableColumn<CommissionByRecipient>[] = [
  { accessorKey: 'label', header: 'Đối tượng nhận' },
  { id: 'order_count', header: 'Số đơn' },
  { id: 'amount', header: 'Số tiền' }
]

const vendorColumns: TableColumn<CommissionByVendor>[] = [
  { accessorKey: 'partner_name', header: 'Vendor' },
  { id: 'order_count', header: 'Đơn' },
  { id: 'commission', header: 'Hoa hồng' },
  { id: 'platform_share', header: 'Platform' },
  { id: 'vh_share', header: 'VH' }
]

const projectColumns: TableColumn<CommissionByProject>[] = [
  { accessorKey: 'project_name', header: 'Dự án' },
  { id: 'order_count', header: 'Đơn' },
  { id: 'platform_share', header: 'Platform' },
  { id: 'vh_share', header: 'VH' }
]
</script>

<template>
  <div>
    <PlatformReportPageHeader
      title="Hoa hồng & phân bổ"
      description="Tổng hoa hồng vendor toàn nền tảng và cách chia về Platform (TNP) vs công ty vận hành — chỉ tính trên đơn marketplace."
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
      description="Đã xảy ra lỗi khi tải hoa hồng & phân bổ. Vui lòng thử lại."
      class="mb-6"
    />

    <template v-else>
      <!-- 4 KPI -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <PlatformReportKpiCard
          label="Tổng hoa hồng / phí"
          :value="formatCurrency(kpis?.commission_total ?? 0)"
          sub="Toàn bộ đơn active"
          icon="i-lucide-coins"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Platform nhận"
          :value="formatCurrency(kpis?.platform_total ?? 0)"
          :sub="`${kpis?.platform_share_pct ?? 0}% tổng hoa hồng`"
          icon="i-lucide-landmark"
          accent="success"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="VH nhận"
          :value="formatCurrency(kpis?.vh_total ?? 0)"
          :sub="`${kpis?.vh_share_pct ?? 0}% tổng hoa hồng`"
          icon="i-lucide-building-2"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Tỷ lệ platform"
          :value="`${kpis?.platform_share_pct ?? 0}%`"
          sub="Phần nền tảng giữ"
          icon="i-lucide-percent"
          accent="success"
          :pending="isLoading"
        />
      </div>

      <!-- Phân bổ theo đối tượng nhận -->
      <SharedSectionCard
        title="Phân bổ theo đối tượng nhận"
        icon="i-lucide-split"
        compact
        class="mb-6"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div class="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
            <div class="text-sm text-slate-600">
              Platform
            </div>
            <div class="mt-1 text-2xl font-bold text-emerald-600 tabular-nums">
              {{ formatCurrency(kpis?.platform_total ?? 0) }}
            </div>
            <div class="text-xs text-slate-500 mt-0.5">
              {{ kpis?.platform_share_pct ?? 0 }}% tổng hoa hồng
            </div>
          </div>
          <div class="rounded-lg border border-slate-200 p-4">
            <div class="text-sm text-slate-600">
              Công ty VH
            </div>
            <div class="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
              {{ formatCurrency(kpis?.vh_total ?? 0) }}
            </div>
            <div class="text-xs text-slate-500 mt-0.5">
              {{ kpis?.vh_share_pct ?? 0 }}% tổng hoa hồng
            </div>
          </div>
        </div>

        <UTable
          :data="report?.by_recipient ?? []"
          :columns="recipientColumns"
          :loading="isLoading"
        >
          <template #label-cell="{ row }">
            <span class="font-medium text-slate-900">{{ row.original.label }}</span>
          </template>
          <template #order_count-cell="{ row }">
            <span class="tabular-nums">{{ formatNumber(row.original.order_count) }}</span>
          </template>
          <template #amount-cell="{ row }">
            <span class="tabular-nums">{{ formatCurrency(row.original.amount) }}</span>
          </template>
          <template #empty>
            <div class="py-8 text-center text-sm text-slate-500">
              Chưa có hoa hồng phát sinh trong kỳ.
            </div>
          </template>
        </UTable>
      </SharedSectionCard>

      <!-- Theo vendor + dự án -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SharedSectionCard
          title="Theo vendor"
          icon="i-lucide-store"
          compact
        >
          <UTable
            :data="report?.by_vendor ?? []"
            :columns="vendorColumns"
            :loading="isLoading"
          >
            <template #partner_name-cell="{ row }">
              <span class="font-medium text-slate-900">{{ row.original.partner_name }}</span>
            </template>
            <template #order_count-cell="{ row }">
              <span class="tabular-nums">{{ formatNumber(row.original.order_count) }}</span>
            </template>
            <template #commission-cell="{ row }">
              <span class="tabular-nums">{{ formatCurrency(row.original.commission) }}</span>
            </template>
            <template #platform_share-cell="{ row }">
              <span class="tabular-nums text-emerald-600">{{ formatCurrency(row.original.platform_share) }}</span>
            </template>
            <template #vh_share-cell="{ row }">
              <span class="tabular-nums">{{ formatCurrency(row.original.vh_share) }}</span>
            </template>
            <template #empty>
              <div class="py-8 text-center text-sm text-slate-500">
                Chưa có vendor phát sinh hoa hồng.
              </div>
            </template>
          </UTable>
        </SharedSectionCard>

        <SharedSectionCard
          title="Theo dự án"
          icon="i-lucide-folder-kanban"
          compact
        >
          <UTable
            :data="report?.by_project ?? []"
            :columns="projectColumns"
            :loading="isLoading"
          >
            <template #project_name-cell="{ row }">
              <span class="font-medium text-slate-900">{{ row.original.project_name }}</span>
            </template>
            <template #order_count-cell="{ row }">
              <span class="tabular-nums">{{ formatNumber(row.original.order_count) }}</span>
            </template>
            <template #platform_share-cell="{ row }">
              <span class="tabular-nums text-emerald-600">{{ formatCurrency(row.original.platform_share) }}</span>
            </template>
            <template #vh_share-cell="{ row }">
              <span class="tabular-nums">{{ formatCurrency(row.original.vh_share) }}</span>
            </template>
            <template #empty>
              <div class="py-8 text-center text-sm text-slate-500">
                Chưa có dự án phát sinh hoa hồng.
              </div>
            </template>
          </UTable>
        </SharedSectionCard>
      </div>
    </template>
  </div>
</template>
