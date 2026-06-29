<script setup lang="ts">
import type { ReportCard } from '~/composables/api/usePlatformReports'
import { useReportOverview } from '~/composables/api/usePlatformReports'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Báo cáo tổng hợp - Thần Nông' })

const months = ref(6)
const { data, status, error } = useReportOverview(computed(() => ({ months: months.value })))

const overview = computed(() => data.value?.data ?? null)
const kpis = computed(() => overview.value?.kpis ?? null)
const cards = computed<ReportCard[]>(() => overview.value?.report_cards ?? [])

const csatPending = computed(() => (kpis.value?.rated_count ?? 0) === 0)

const csatHeadline = computed(() => {
  if (!kpis.value || csatPending.value) return '—'
  return kpis.value.avg_rating.toFixed(1)
})

// Icon + cách format headline cho từng thẻ điều hướng (theo card.key từ BE).
const CARD_META: Record<string, { icon: string, format: 'money' | 'rating' | 'count' }> = {
  'revenue': { icon: 'i-lucide-banknote', format: 'money' },
  'csat': { icon: 'i-lucide-smile', format: 'rating' },
  'service-adoption': { icon: 'i-lucide-trending-up', format: 'money' },
  'resident-segments': { icon: 'i-lucide-users', format: 'count' },
  'tenant-health': { icon: 'i-lucide-building-2', format: 'count' },
  'commission-allocation': { icon: 'i-lucide-split', format: 'money' },
  'vendor-scorecard': { icon: 'i-lucide-store', format: 'count' }
}

function cardIcon(key: string): string {
  return CARD_META[key]?.icon ?? 'i-lucide-bar-chart-3'
}

function cardKpi(card: ReportCard): string {
  const fmt = CARD_META[card.key]?.format ?? 'count'
  if (fmt === 'money') return formatCurrency(card.kpi)
  if (fmt === 'rating') return card.kpi > 0 ? card.kpi.toFixed(1) : '—'
  return formatNumber(card.kpi)
}
</script>

<template>
  <div>
    <PlatformReportPageHeader
      title="Báo cáo tổng hợp"
      description="Tổng hợp xuyên toàn bộ công ty vận hành để theo dõi doanh thu, chất lượng và hiệu suất nền tảng."
      hide-hub
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
      description="Đã xảy ra lỗi khi tải dữ liệu tổng quan. Vui lòng thử lại."
      class="mb-6"
    />

    <template v-else>
      <!-- 4 KPI tổng -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <PlatformReportKpiCard
          label="Doanh thu nền tảng"
          :value="formatCurrency(kpis?.total_platform_revenue ?? 0)"
          sub="Hoa hồng marketplace + phí vận hành"
          icon="i-lucide-banknote"
          accent="success"
          :pending="status === 'pending'"
        />
        <PlatformReportKpiCard
          label="GMV marketplace"
          :value="formatCurrency(kpis?.marketplace_gmv ?? 0)"
          sub="Tách biệt doanh thu nền tảng"
          icon="i-lucide-shopping-cart"
          :pending="status === 'pending'"
        />
        <PlatformReportKpiCard
          label="CSAT trung bình"
          :value="csatHeadline"
          :sub="`${formatNumber(kpis?.rated_count ?? 0)} đơn đánh giá`"
          icon="i-lucide-smile"
          accent="warning"
          :pending="status === 'pending'"
        />
        <PlatformReportKpiCard
          label="Cư dân có đơn"
          :value="`${formatNumber(kpis?.active_residents ?? 0)} / ${formatNumber(kpis?.total_residents ?? 0)}`"
          sub="Cư dân phát sinh đơn / tổng danh bạ"
          icon="i-lucide-users"
          accent="primary"
          :pending="status === 'pending'"
        />
      </div>

      <UAlert
        v-if="csatPending && status !== 'pending'"
        icon="i-lucide-info"
        color="info"
        variant="subtle"
        title="Chưa có đánh giá trong kỳ"
        description="Chưa có lượt đánh giá nào của cư dân cho đơn marketplace trong khoảng thời gian này. Điểm hài lòng sẽ hiển thị khi có đánh giá."
        class="mb-6"
      />

      <!-- 7 thẻ điều hướng -->
      <div
        v-if="status === 'pending'"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <USkeleton
          v-for="i in 7"
          :key="i"
          class="h-32 w-full rounded-xl"
        />
      </div>

      <div
        v-else
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="card in cards"
          :key="card.key"
          :to="card.route"
          class="block"
        >
          <UCard
            class="h-full transition hover:border-primary/60 hover:shadow-md"
            :ui="{ body: 'px-5 py-4' }"
          >
            <div class="flex items-start gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <UIcon
                  :name="cardIcon(card.key)"
                  class="size-5 text-primary"
                />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-slate-900">
                  {{ card.title }}
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ card.blurb }}
                </p>
                <div class="mt-3 flex items-baseline gap-2">
                  <span class="text-xl font-bold text-slate-900 tracking-tight">{{ cardKpi(card) }}</span>
                  <span class="text-xs text-slate-400">{{ card.sub }}</span>
                </div>
              </div>
              <UIcon
                name="i-lucide-chevron-right"
                class="size-5 text-slate-300 shrink-0"
              />
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
