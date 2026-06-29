<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { VendorScorecardRow } from '~/composables/api/usePlatformReports'
import { useVendorScorecardReport } from '~/composables/api/usePlatformReports'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Hiệu suất vendor - Báo cáo tổng hợp' })

const VENDOR_DETAIL_BASE = '/platform/quan-ly-van-hanh/quan-ly-vendor'

const months = ref(6)
const { data, status, error } = useVendorScorecardReport(computed(() => ({ months: months.value })))

const report = computed(() => data.value?.data ?? null)
const vendors = computed(() => report.value?.vendors ?? [])
const isLoading = computed(() => status.value === 'pending')

const columns: TableColumn<VendorScorecardRow>[] = [
  { accessorKey: 'partner_name', header: 'Vendor' },
  { id: 'order_count', header: 'Đơn' },
  { id: 'gmv', header: 'GMV' },
  { id: 'platform_fee', header: 'Phí platform' },
  { id: 'completion_rate', header: 'Hoàn tất' },
  { id: 'cancel_rate', header: 'Huỷ' },
  { id: 'csat', header: 'CSAT' },
  { id: 'mix', header: 'SP / DV' }
]
</script>

<template>
  <div>
    <PlatformReportPageHeader
      title="Hiệu suất vendor"
      description="Scorecard so sánh chéo toàn bộ vendor (đối tác B3) có phát sinh đơn marketplace, xếp giảm dần theo GMV."
    >
      <template #filters>
        <PlatformReportPeriodSelect v-model="months" />
      </template>
      <template #actions>
        <UButton
          :to="VENDOR_DETAIL_BASE"
          icon="i-lucide-store"
          label="Quản lý vendor"
          color="neutral"
          variant="subtle"
        />
      </template>
    </PlatformReportPageHeader>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      title="Không tải được báo cáo"
      description="Đã xảy ra lỗi khi tải hiệu suất vendor. Vui lòng thử lại."
      class="mb-6"
    />

    <SharedSectionCard
      v-else
      title="Scorecard đối tác B3"
      icon="i-lucide-store"
      compact
    >
      <template #header-actions>
        <span class="text-xs text-slate-500">Xếp theo GMV — click vendor để xem chi tiết vận hành.</span>
      </template>

      <UTable
        :data="vendors"
        :columns="columns"
        :loading="isLoading"
      >
        <template #partner_name-cell="{ row }">
          <NuxtLink
            :to="`${VENDOR_DETAIL_BASE}/${row.original.partner_id}`"
            class="font-semibold text-primary hover:underline"
          >
            {{ row.original.partner_name }}
          </NuxtLink>
        </template>
        <template #order_count-cell="{ row }">
          <span class="tabular-nums">{{ formatNumber(row.original.order_count) }}</span>
        </template>
        <template #gmv-cell="{ row }">
          <span class="tabular-nums">{{ formatCurrency(row.original.gmv) }}</span>
        </template>
        <template #platform_fee-cell="{ row }">
          <span class="tabular-nums">{{ formatCurrency(row.original.platform_fee) }}</span>
        </template>
        <template #completion_rate-cell="{ row }">
          <span class="tabular-nums">{{ row.original.completion_rate }}%</span>
        </template>
        <template #cancel_rate-cell="{ row }">
          <span
            class="tabular-nums"
            :class="row.original.cancel_rate > 10 ? 'text-red-600 font-medium' : ''"
          >{{ row.original.cancel_rate }}%</span>
        </template>
        <template #csat-cell="{ row }">
          <span class="tabular-nums">{{ residentRatingAvgLabel(row.original.avg_rating, row.original.rated_count) }}</span>
        </template>
        <template #mix-cell="{ row }">
          <span class="tabular-nums text-slate-600">{{ row.original.product_count }} / {{ row.original.service_count }}</span>
        </template>
        <template #empty>
          <div class="py-10 text-center">
            <UIcon
              name="i-lucide-store"
              class="size-8 text-slate-300 mx-auto"
            />
            <p class="mt-2 text-sm font-medium text-slate-700">
              Chưa có vendor có đơn
            </p>
            <p class="text-xs text-slate-500">
              Chưa có đối tác nào phát sinh đơn marketplace trong kỳ.
            </p>
          </div>
        </template>
      </UTable>
    </SharedSectionCard>
  </div>
</template>
