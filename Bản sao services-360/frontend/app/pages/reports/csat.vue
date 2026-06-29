<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { CsatByProjectResource, CsatTrendResource } from '~/composables/api/useCsatReports'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Báo cáo Hài lòng khách hàng' })

// ─── Project filter ───

const selectedProjectId = ref<number | undefined>(undefined)

useUrlFilters({
  project_id: { ref: selectedProjectId, type: 'number' }
})

const hasFilters = computed(() => selectedProjectId.value != null)

const filterParams = computed(() => ({
  project_id: selectedProjectId.value || undefined
}))

// ─── Data fetching ───

const {
  data: summaryData,
  status: summaryStatus,
  error: summaryError
} = useCsatSummary(filterParams)
const summary = computed(() => summaryData.value?.data ?? null)

const {
  data: trendData,
  status: trendStatus,
  error: trendError,
  refresh: refreshTrend
} = useCsatTrend(filterParams)
const trend = computed<CsatTrendResource[]>(() => trendData.value?.data ?? [])

const {
  data: byProjectData,
  status: byProjectStatus,
  error: byProjectError,
  refresh: refreshByProject
} = useCsatByProject(filterParams)
const byProjectRows = computed<CsatByProjectResource[]>(() => byProjectData.value?.data ?? [])

function clearFilters() {
  selectedProjectId.value = undefined
}

// ─── Display helpers ───

const isLoading = (status: string) => status === 'pending'

function formatScore(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return value.toFixed(2)
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${value}%`
}

function formatNps(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  const rounded = Number.isInteger(value) ? value : Math.round(value * 10) / 10
  const sign = rounded > 0 ? '+' : rounded < 0 ? '' : '+'
  return `${sign}${rounded}`
}

function scoreBarWidth(score: number | null | undefined, maxScore: number): number {
  if (score === null || score === undefined || maxScore <= 0) return 0
  return Math.max(0, Math.min(100, (score / maxScore) * 100))
}

// ─── Table columns ───

const projectColumns: TableColumn<CsatByProjectResource>[] = [
  {
    accessorKey: 'project_name',
    header: 'Dự án',
    cell: ({ row }: { row: { original: CsatByProjectResource } }) =>
      row.original.project_name ?? '—'
  },
  {
    accessorKey: 'responses',
    header: 'Số phản hồi',
    cell: ({ row }: { row: { original: CsatByProjectResource } }) =>
      row.original.responses.toLocaleString('vi-VN')
  },
  {
    accessorKey: 'avg_score',
    header: 'Điểm TB',
    cell: ({ row }: { row: { original: CsatByProjectResource } }) => formatScore(row.original.avg_score)
  },
  {
    accessorKey: 'warranty_rate',
    header: 'Tỷ lệ bảo hành',
    cell: ({ row }: { row: { original: CsatByProjectResource } }) =>
      `${formatPercent(row.original.warranty_rate)} (${row.original.warranty_count}/${row.original.completed_count})`
  }
]

const maxScore = computed(() => summary.value?.max_score ?? 5)
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Báo cáo Hài lòng khách hàng"
      description="Mức độ hài lòng của cư dân sau khi ticket hoàn thành"
    />

    <!-- Page-level error (summary failed) -->
    <SharedCrudPageError
      v-if="summaryError"
      :error="summaryError"
    />

    <template v-else>
      <!-- ═══ KPI Cards ═══ -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <SharedSectionCard
          title="Điểm TB"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-24 mb-1" />
            <USkeleton class="h-4 w-28" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold text-emerald-600 tabular-nums">
              {{ formatScore(summary.avg_score) }}
              <span class="text-base font-semibold text-slate-400">/ {{ summary.max_score }}</span>
            </p>
            <span class="text-xs text-slate-500">{{ summary.rated_count }} phản hồi</span>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Tỷ lệ phản hồi"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-20 mb-1" />
            <USkeleton class="h-4 w-28" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ formatPercent(summary.response_rate) }}
            </p>
            <span class="text-xs text-slate-500">
              {{ summary.rated_count }} / {{ summary.completed_count }} ticket
            </span>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Chỉ số gợi ý (NPS-style)"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-16 mb-1" />
            <USkeleton class="h-4 w-32" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold text-primary tabular-nums">
              {{ formatNps(summary.nps_style) }}
            </p>
            <span class="text-xs text-slate-500">Suy diễn từ thang 1-5</span>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Tỷ lệ bảo hành"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-20 mb-1" />
            <USkeleton class="h-4 w-28" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold text-amber-600 tabular-nums">
              {{ formatPercent(summary.warranty_rate) }}
            </p>
            <span class="text-xs text-slate-500">
              {{ summary.warranty_count }} / {{ summary.completed_count }} ticket
            </span>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Kỳ"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-6 w-32 mb-1" />
          </template>
          <template v-else-if="summary">
            <p class="text-base font-semibold text-slate-900">
              {{ summary.period_label }}
            </p>
            <span class="text-xs text-slate-500">
              {{ summary.completed_count }} ticket hoàn thành
            </span>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ Project Filter ═══ -->
      <SharedSectionCard
        title="Lọc báo cáo"
        compact
        class="mb-6"
      >
        <div class="flex flex-wrap items-end gap-3">
          <UFormField
            label="Dự án"
            class="max-w-xs"
          >
            <SharedProjectSelect
              v-model="selectedProjectId"
              placeholder="Tất cả dự án"
            />
          </UFormField>
          <UButton
            v-if="hasFilters"
            icon="i-lucide-x"
            label="Xóa bộ lọc"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="clearFilters"
          />
        </div>
        <p class="text-xs text-slate-500 mt-2">
          Áp dụng cho xu hướng theo tháng và bảng theo dự án bên dưới.
        </p>
      </SharedSectionCard>

      <!-- ═══ Trend Section ═══ -->
      <SharedSectionCard
        title="Xu hướng điểm TB"
        compact
        class="mb-6"
      >
        <SharedCrudTableWrapper
          :status="trendStatus"
          :error="trendError"
          :data="trendData"
          :refresh="refreshTrend"
        >
          <template v-if="trend.length > 0">
            <div class="space-y-3">
              <div
                v-for="row in trend"
                :key="row.month"
                class="flex items-center gap-3 text-sm"
              >
                <span class="w-10 shrink-0 font-medium text-slate-600">{{ row.month }}</span>
                <div class="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-emerald-500 transition-all"
                    :style="{ width: `${scoreBarWidth(row.avg_score, maxScore)}%` }"
                  />
                </div>
                <span class="w-14 text-right font-semibold tabular-nums text-slate-900">
                  {{ formatScore(row.avg_score) }}
                </span>
              </div>
            </div>
          </template>
          <template v-else>
            <p class="text-sm text-slate-500 py-8 text-center">
              Chưa có dữ liệu xu hướng
            </p>
          </template>
        </SharedCrudTableWrapper>
      </SharedSectionCard>

      <!-- ═══ By Project Table ═══ -->
      <SharedSectionCard
        title="Theo dự án"
        compact
      >
        <SharedCrudTableWrapper
          :status="byProjectStatus"
          :error="byProjectError"
          :data="byProjectData"
          :refresh="refreshByProject"
        >
          <UTable
            :data="byProjectRows"
            :columns="projectColumns"
            :empty-state="{
              icon: 'i-lucide-inbox',
              label: 'Không có dữ liệu'
            }"
          />
        </SharedCrudTableWrapper>
      </SharedSectionCard>
    </template>
  </div>
</template>
