<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { CsatByProject, CsatByVendor, CsatLowRating } from '~/composables/api/usePlatformReports'
import { useCsatReport } from '~/composables/api/usePlatformReports'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Chất lượng & CSAT - Báo cáo tổng hợp' })

const months = ref(6)
const { data, status, error } = useCsatReport(computed(() => ({ months: months.value })))

const report = computed(() => data.value?.data ?? null)
const kpis = computed(() => report.value?.kpis ?? null)
const isLoading = computed(() => status.value === 'pending')

const avgValue = computed(() =>
  kpis.value?.avg_rating == null ? '—' : `${kpis.value.avg_rating.toFixed(1)} / 5`
)

const qualityLabel = computed(() => {
  const a = kpis.value?.avg_rating
  if (a == null) return 'Chưa có đánh giá'
  if (a >= 4.5) return 'Rất tốt'
  if (a >= 4) return 'Tốt'
  if (a >= 3) return 'Khá'
  return 'Cần cải thiện'
})

const avgAccent = computed<'success' | 'warning' | 'error' | 'neutral'>(() => {
  const a = kpis.value?.avg_rating
  if (a == null) return 'neutral'
  if (a >= 4) return 'success'
  if (a >= 3) return 'warning'
  return 'error'
})

const cancelAccent = computed<'error' | 'neutral'>(() =>
  (kpis.value?.cancel_rate ?? 0) > 10 ? 'error' : 'neutral'
)

const hasRatings = computed(() => (kpis.value?.rated_count ?? 0) > 0)
const maxStarCount = computed(() =>
  Math.max(1, ...(report.value?.star_buckets ?? []).map(b => b.count))
)
function starPct(count: number): number {
  return Math.round((count / maxStarCount.value) * 100)
}

function lowRatingColor(rating: number): 'error' | 'warning' {
  return rating <= 2 ? 'error' : 'warning'
}

const vendorColumns: TableColumn<CsatByVendor>[] = [
  { accessorKey: 'partner_name', header: 'Vendor' },
  { id: 'order_count', header: 'Đơn' },
  { id: 'csat', header: 'CSAT' },
  { id: 'cancel_count', header: 'Huỷ' }
]

const projectColumns: TableColumn<CsatByProject>[] = [
  { accessorKey: 'project_name', header: 'Dự án' },
  { id: 'order_count', header: 'Đơn' },
  { id: 'csat', header: 'CSAT' }
]

const lowRatingColumns: TableColumn<CsatLowRating>[] = [
  { accessorKey: 'partner_name', header: 'Vendor' },
  { accessorKey: 'project_name', header: 'Dự án' },
  { id: 'resident_name', header: 'Cư dân' },
  { id: 'resident_rating', header: 'Sao' },
  { id: 'resident_rating_comment', header: 'Nhận xét' }
]
</script>

<template>
  <div>
    <PlatformReportPageHeader
      title="Chất lượng & CSAT"
      description="Điểm hài lòng cư dân trên toàn bộ đơn marketplace vendor: CSAT, tỷ lệ phản hồi/hoàn tất/huỷ và đánh giá thấp cần theo dõi."
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
      title="Không tải được báo cáo CSAT"
      description="Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại."
      class="mb-6"
    />

    <template v-else>
      <!-- 4 KPI -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <PlatformReportKpiCard
          label="Điểm trung bình"
          :value="avgValue"
          :sub="qualityLabel"
          icon="i-lucide-star"
          :accent="avgAccent"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Tỷ lệ phản hồi"
          :value="`${kpis?.response_rate ?? 0}%`"
          :sub="`${formatNumber(kpis?.rated_count ?? 0)} / ${formatNumber(kpis?.total_orders ?? 0)} đơn`"
          icon="i-lucide-message-square"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Hoàn tất"
          :value="`${kpis?.completion_rate ?? 0}%`"
          icon="i-lucide-circle-check"
          accent="success"
          :pending="isLoading"
        />
        <PlatformReportKpiCard
          label="Huỷ đơn"
          :value="`${kpis?.cancel_rate ?? 0}%`"
          icon="i-lucide-circle-x"
          :accent="cancelAccent"
          :pending="isLoading"
        />
      </div>

      <!-- Phân bố sao -->
      <SharedSectionCard
        title="Phân bố đánh giá theo sao"
        icon="i-lucide-bar-chart-3"
        compact
        class="mb-6"
      >
        <USkeleton
          v-if="isLoading"
          class="h-40 w-full"
        />
        <div
          v-else-if="!hasRatings"
          class="py-8 text-center text-sm text-slate-500"
        >
          Chưa có dữ liệu đánh giá.
        </div>
        <div
          v-else
          class="space-y-3"
        >
          <div
            v-for="bucket in report?.star_buckets ?? []"
            :key="bucket.star"
            class="flex items-center gap-3"
          >
            <div class="flex w-12 shrink-0 items-center gap-1 text-sm font-medium text-slate-700">
              {{ bucket.star }}
              <UIcon
                name="i-lucide-star"
                class="size-3.5 text-amber-500"
              />
            </div>
            <UProgress
              :model-value="starPct(bucket.count)"
              color="warning"
              class="flex-1"
            />
            <div class="w-10 shrink-0 text-right text-sm tabular-nums text-slate-600">
              {{ formatNumber(bucket.count) }}
            </div>
          </div>
        </div>
      </SharedSectionCard>

      <!-- CSAT theo vendor + dự án -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SharedSectionCard
          title="CSAT theo vendor"
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
            <template #csat-cell="{ row }">
              <span class="tabular-nums">{{ residentRatingAvgLabel(row.original.avg_rating, row.original.rated_count) }}</span>
            </template>
            <template #cancel_count-cell="{ row }">
              <span class="tabular-nums">{{ formatNumber(row.original.cancel_count) }}</span>
            </template>
            <template #empty>
              <div class="py-8 text-center text-sm text-slate-500">
                Chưa có đơn vendor trong kỳ.
              </div>
            </template>
          </UTable>
        </SharedSectionCard>

        <SharedSectionCard
          title="CSAT theo dự án"
          icon="i-lucide-building-2"
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
            <template #csat-cell="{ row }">
              <span class="tabular-nums">{{ residentRatingAvgLabel(row.original.avg_rating, row.original.rated_count) }}</span>
            </template>
            <template #empty>
              <div class="py-8 text-center text-sm text-slate-500">
                Chưa có dự án phát sinh đơn trong kỳ.
              </div>
            </template>
          </UTable>
        </SharedSectionCard>
      </div>

      <!-- Đánh giá thấp cần theo dõi -->
      <SharedSectionCard
        title="Đánh giá thấp cần theo dõi (≤ 3 sao)"
        icon="i-lucide-alert-triangle"
        compact
      >
        <UAlert
          v-if="!isLoading && (report?.low_ratings.length ?? 0) === 0"
          icon="i-lucide-thumbs-up"
          color="success"
          variant="subtle"
          title="Không có đánh giá thấp trong kỳ"
          description="Toàn bộ đánh giá cư dân trong kỳ đều từ 4 sao trở lên."
        />
        <UTable
          v-else
          :data="report?.low_ratings ?? []"
          :columns="lowRatingColumns"
          :loading="isLoading"
        >
          <template #resident_name-cell="{ row }">
            <span>{{ row.original.resident_name ?? '—' }}</span>
          </template>
          <template #resident_rating-cell="{ row }">
            <UBadge
              :color="lowRatingColor(row.original.resident_rating)"
              variant="subtle"
              :label="`${row.original.resident_rating} ★`"
            />
          </template>
          <template #resident_rating_comment-cell="{ row }">
            <span class="text-slate-600">{{ row.original.resident_rating_comment || '—' }}</span>
          </template>
        </UTable>
      </SharedSectionCard>
    </template>
  </div>
</template>
