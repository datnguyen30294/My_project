<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Báo cáo Tổng quan' })

// ─── Filters (URL-synced) ───

const {
  dateRange,
  dateFromRef,
  dateToRef,
  defaultFrom,
  defaultTo,
  formatDateRange,
  syncRangeFromRefs,
  resetToDefault
} = useReportDateRange()
const selectedProjectId = ref<number | undefined>(undefined)
const selectedClosingPeriodId = ref<number | undefined>(undefined)

useUrlFilters({
  date_from: { ref: dateFromRef, type: 'string' },
  date_to: { ref: dateToRef, type: 'string' },
  project_id: { ref: selectedProjectId, type: 'number' },
  closing_period_id: { ref: selectedClosingPeriodId, type: 'number' }
})

syncRangeFromRefs()

const isClosingPeriodSelected = computed(() => selectedClosingPeriodId.value != null)

const hasFilters = computed(() =>
  selectedProjectId.value != null
  || selectedClosingPeriodId.value != null
  || (dateFromRef.value && dateFromRef.value !== defaultFrom())
  || (dateToRef.value && dateToRef.value !== defaultTo())
)

function clearFilters() {
  selectedProjectId.value = undefined
  selectedClosingPeriodId.value = undefined
  resetToDefault()
}

const filterParams = computed(() => {
  if (selectedClosingPeriodId.value != null) {
    return { closing_period_id: selectedClosingPeriodId.value }
  }
  return {
    date_from: dateFromRef.value || undefined,
    date_to: dateToRef.value || undefined,
    project_id: selectedProjectId.value || undefined
  }
})

// ─── Closing periods (for select) ───

const { closingPeriodOptions } = useClosingPeriodOptions()

// ─── Data fetching ───

const {
  data: summaryData,
  status: summaryStatus,
  error: summaryError
} = useOverviewSummary(filterParams)
const summary = computed(() => summaryData.value?.data ?? null)

// ─── Display helpers ───

const isLoading = (status: string) => status === 'pending'

function formatScore(value: number | null | undefined): string {
  if (value == null) return '0'
  return value.toFixed(1)
}

// ─── KPI cards meta ───

interface OverviewKpiCard {
  to: string
  icon: string
  title: string
}

const kpiCards: OverviewKpiCard[] = [
  { to: '/reports/sla', icon: 'i-lucide-gauge', title: 'SLA' },
  { to: '/reports/revenue-profit', icon: 'i-lucide-trending-up', title: 'Doanh thu & LN' },
  { to: '/reports/csat', icon: 'i-lucide-smile-plus', title: 'Hài lòng KH' },
  { to: '/reports/commission', icon: 'i-lucide-coins', title: 'Phân bổ hoa hồng' }
]

const supplementaryReports = [
  { to: '/reports/operating-profit', label: 'LN VH (Vật tư + HH)' },
  { to: '/reports/revenue-ticket', label: 'Doanh thu (ticket)' },
  { to: '/reports/cashflow', label: 'Dòng tiền' },
  { to: '/reports/vendor-order', label: 'Đơn hàng vendor (Marketplace)' }
]

const businessReferences = [
  { to: '/pmc/og-tickets', label: 'OG Ticket / SLA vi phạm' },
  { to: '/pmc/finance/commission-summary', label: 'Tổng hợp hoa hồng' }
]
</script>

<template>
  <div>
    <SharedCrudPageHeader title="Báo cáo Tổng quan" />

    <SharedCrudPageError
      v-if="summaryError"
      :error="summaryError"
    />

    <template v-else>
      <!-- ═══ Filters ═══ -->
      <SharedSectionCard
        title="Bộ lọc"
        compact
        class="mb-6"
      >
        <div class="flex flex-wrap gap-4 items-end">
          <UFormField label="Kỳ chốt">
            <USelectMenu
              v-model="selectedClosingPeriodId"
              :items="closingPeriodOptions"
              value-key="value"
              placeholder="Tất cả kỳ"
              class="w-72"
              searchable
              :search-input="{ placeholder: 'Tìm kỳ chốt...', icon: 'i-lucide-search' }"
            />
          </UFormField>
          <UFormField label="Khoảng thời gian">
            <ClientOnly>
              <VueDatePicker
                v-model="dateRange"
                range
                :partial-range="false"
                :time-config="{ enableTimePicker: false }"
                model-type="yyyy-MM-dd"
                :format="formatDateRange"
                auto-apply
                :max-date="new Date()"
                input-class-name="dp-custom-input"
                :teleport="true"
                :disabled="isClosingPeriodSelected"
                class="w-64"
              />
            </ClientOnly>
          </UFormField>
          <UFormField label="Dự án">
            <SharedProjectSelect
              v-model="selectedProjectId"
              placeholder="Tất cả dự án"
              :disabled="isClosingPeriodSelected"
              class="w-48"
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
        <p
          v-if="summary"
          class="text-xs text-slate-500 mt-3"
        >
          <UIcon
            name="i-lucide-calendar"
            class="size-3.5 align-[-2px]"
          />
          {{ summary.period_label }}
        </p>
      </SharedSectionCard>

      <!-- ═══ 4 KPI cards ═══ -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <NuxtLink
          v-for="card in kpiCards"
          :key="card.to"
          :to="card.to"
          class="block group"
        >
          <SharedSectionCard
            :title="card.title"
            :icon="card.icon"
            compact
            class="h-full transition-all group-hover:ring-2 group-hover:ring-primary"
          >
            <template #header-actions>
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-primary opacity-70 group-hover:opacity-100"
              />
            </template>
            <template v-if="isLoading(summaryStatus)">
              <USkeleton class="h-7 w-32 mb-2" />
              <USkeleton class="h-4 w-48" />
            </template>
            <template v-else>
              <!-- SLA -->
              <template v-if="card.title === 'SLA'">
                <template v-if="summary?.sla">
                  <p class="text-xl font-bold tabular-nums">
                    {{ summary.sla.on_time_rate }}%
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    {{ summary.sla.breached_count }} ticket vi phạm · {{ summary.period_label }}
                  </p>
                </template>
                <template v-else>
                  <p class="text-xl font-bold text-slate-400">
                    —
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    Chưa có dữ liệu · {{ summary?.period_label }}
                  </p>
                </template>
              </template>

              <!-- Doanh thu & LN -->
              <template v-else-if="card.title === 'Doanh thu & LN'">
                <template v-if="summary?.revenue">
                  <p class="text-xl font-bold tabular-nums">
                    {{ formatCurrency(summary.revenue.revenue) }}
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    Margin gộp ~{{ summary.revenue.margin_percent }}% · {{ summary.period_label }}
                  </p>
                </template>
                <template v-else>
                  <p class="text-xl font-bold text-slate-400">
                    —
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    Chưa có dữ liệu · {{ summary?.period_label }}
                  </p>
                </template>
              </template>

              <!-- Hài lòng KH -->
              <template v-else-if="card.title === 'Hài lòng KH'">
                <template v-if="summary?.csat">
                  <p class="text-xl font-bold tabular-nums">
                    {{ formatScore(summary.csat.avg_score) }} / {{ summary.csat.max_score }}
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    {{ summary.csat.response_rate }}% phản hồi · {{ summary.period_label }}
                  </p>
                </template>
                <template v-else>
                  <p class="text-xl font-bold text-slate-400">
                    —
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    Chưa có dữ liệu · {{ summary?.period_label }}
                  </p>
                </template>
              </template>

              <!-- Phân bổ hoa hồng -->
              <template v-else-if="card.title === 'Phân bổ hoa hồng'">
                <template v-if="summary?.commission">
                  <p class="text-xl font-bold tabular-nums">
                    {{ formatCurrency(summary.commission.total_all_parties) }}
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    Platform {{ formatCurrency(summary.commission.party_totals.platform) }} · {{ summary.period_label }}
                  </p>
                </template>
                <template v-else>
                  <p class="text-xl font-bold text-slate-400">
                    —
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    Chưa có dữ liệu · {{ summary?.period_label }}
                  </p>
                </template>
              </template>
            </template>
          </SharedSectionCard>
        </NuxtLink>
      </div>

      <!-- ═══ Supplementary + Business references ═══ -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SharedSectionCard
          title="Báo cáo bổ sung"
          compact
        >
          <ul class="text-sm space-y-3">
            <li
              v-for="item in supplementaryReports"
              :key="item.to"
            >
              <NuxtLink
                :to="item.to"
                class="text-primary font-medium hover:underline"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </SharedSectionCard>

        <SharedSectionCard
          title="Liên kết nghiệp vụ"
          compact
        >
          <ul class="text-sm space-y-3 list-disc pl-5">
            <li
              v-for="item in businessReferences"
              :key="item.to"
            >
              <NuxtLink
                :to="item.to"
                class="text-primary font-medium hover:underline"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </SharedSectionCard>
      </div>
    </template>
  </div>
</template>
