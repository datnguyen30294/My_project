<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type { CommissionByStaffResource } from '~/composables/api/useCommissionReports'
import { recipientTypeBadgeColor } from '~/composables/api/useClosingPeriods'
import type {
  StackedColumnSeries,
  StackedColumnCategory
} from '~/components/shared/report/StackedColumnChart.vue'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Báo cáo Phân bổ hoa hồng' })

// ─── Filters (URL-synced) ───

const {
  dateRange,
  dateFromRef,
  dateToRef,
  formatDateRange,
  syncRangeFromRefs,
  clearRange
} = useReportDateRange()
const selectedProjectId = ref<number | undefined>(undefined)

useUrlFilters({
  date_from: { ref: dateFromRef, type: 'string' },
  date_to: { ref: dateToRef, type: 'string' },
  project_id: { ref: selectedProjectId, type: 'number' }
})

syncRangeFromRefs()

const hasFilters = computed(() =>
  selectedProjectId.value != null || !!dateFromRef.value || !!dateToRef.value
)

function clearFilters() {
  selectedProjectId.value = undefined
  clearRange()
}

const filterParams = computed(() => ({
  date_from: dateFromRef.value || undefined,
  date_to: dateToRef.value || undefined,
  project_id: selectedProjectId.value || undefined
}))

// ─── Data fetching ───

const {
  data: summaryData,
  status: summaryStatus,
  error: summaryError
} = useCommissionReportSummary(filterParams)
const summary = computed(() => summaryData.value?.data ?? null)

const {
  data: byStaffData,
  status: byStaffStatus
} = useCommissionReportByStaff(filterParams)
const allStaffRows = computed<CommissionByStaffResource[]>(() => byStaffData.value?.data ?? [])

// ─── Display helpers ───

const isLoading = (status: string) => status === 'pending'

// ─── Chart data (aggregated client-side from allStaffRows) ───

const COMMISSION_SERIES: StackedColumnSeries[] = [
  { key: 'operating_company', label: 'HH VH', color: '#2563eb' },
  { key: 'board_of_directors', label: 'BQT', color: '#d97706' },
  { key: 'management', label: 'BQL', color: '#16a34a' },
  { key: 'platform', label: 'Platform', color: '#7c3aed' }
]

function toNum(value: string | null | undefined): number {
  if (value == null) return 0
  return parseFloat(value) || 0
}

function aggregateBy(
  rows: CommissionByStaffResource[],
  keyFn: (r: CommissionByStaffResource) => string | null | undefined
): StackedColumnCategory[] {
  const map = new Map<string, StackedColumnCategory>()
  for (const r of rows) {
    const k = keyFn(r)
    if (!k) continue
    let cat = map.get(k)
    if (!cat) {
      cat = {
        label: k,
        values: {
          operating_company: 0,
          board_of_directors: 0,
          management: 0,
          platform: 0
        }
      }
      map.set(k, cat)
    }
    cat.values.operating_company! += toNum(r.operating_company)
    cat.values.board_of_directors! += toNum(r.board_of_directors)
    cat.values.management! += toNum(r.management)
    cat.values.platform! += toNum(r.platform)
  }
  return [...map.values()]
}

const chartByProject = computed<StackedColumnCategory[]>(() =>
  aggregateBy(allStaffRows.value, r => r.project_name)
)

const chartByDepartment = computed<StackedColumnCategory[]>(() =>
  aggregateBy(allStaffRows.value, r => r.department_name)
)

const chartByStaff = computed<StackedColumnCategory[]>(() =>
  aggregateBy(allStaffRows.value, r => r.staff_name)
)

// ─── By-recipient table (aggregated from summary + allStaffRows) ───

interface ByRecipientRow {
  name: string
  type: string
  typeLabel: string
  amount: number
}

const PARTY_LABELS: Record<string, string> = {
  platform: 'Platform',
  operating_company: 'Công ty vận hành',
  board_of_directors: 'Ban quản trị',
  staff: 'Nhân viên'
}

const byRecipient = computed<ByRecipientRow[]>(() => {
  const rows: ByRecipientRow[] = []

  if (summary.value) {
    const t = summary.value.party_totals
    for (const [type, label] of Object.entries(PARTY_LABELS)) {
      if (type === 'staff') continue
      rows.push({ name: label, type, typeLabel: label, amount: toNum(t[type as keyof typeof t]) })
    }
  }

  // Group staff by account_id (or staff_name as fallback), sum management
  const staffMap = new Map<string | number, ByRecipientRow>()
  for (const r of allStaffRows.value) {
    const key = r.account_id ?? r.staff_name
    const existing = staffMap.get(key)
    if (existing) {
      existing.amount += toNum(r.management)
    } else {
      staffMap.set(key, {
        name: r.staff_name,
        type: 'staff',
        typeLabel: PARTY_LABELS.staff,
        amount: toNum(r.management)
      })
    }
  }

  rows.push(...staffMap.values())
  rows.sort((a, b) => b.amount - a.amount)
  return rows
})

const recipientColumns = [
  { accessorKey: 'name', header: 'Người / Bên nhận' },
  { accessorKey: 'typeLabel', header: 'Loại' },
  { accessorKey: 'amount', header: 'Tổng hoa hồng' }
]
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Báo cáo Phân bổ hoa hồng"
      description="Tổng hợp hoa hồng phân bổ cho 4 bên (VH, BQT, BQL, Platform) và chi tiết theo nhân viên"
    />

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
                class="w-64"
              />
            </ClientOnly>
          </UFormField>
          <UFormField label="Dự án">
            <SharedProjectSelect
              v-model="selectedProjectId"
              placeholder="Tất cả dự án"
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

      <!-- ═══ Info alert ═══ -->
      <UAlert
        color="info"
        variant="subtle"
        icon="i-lucide-info"
        title="Đồng bộ với cấu hình chia hoa hồng"
        description="Bốn thẻ dưới là tổng phần hoa hồng phân bổ cho mỗi bên từ các đơn hàng trong kỳ chốt. Phân biệt rõ 'Hoa hồng phân bổ cho Công ty VH' với 'Lợi nhuận gộp công ty VH' ở khối thẻ thông tin bên dưới."
        class="mb-6"
      />

      <!-- ═══ KPI Cards — 4 bên ═══ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SharedSectionCard
          title="Hoa hồng phân bổ — Công ty vận hành"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-2" />
            <USkeleton class="h-4 w-48" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ formatCurrency(summary.party_totals.operating_company) }}
            </p>
            <p class="text-xs text-slate-500 mt-2 leading-snug">
              Phần chia cho bên VH theo cấu hình đơn; khác với <strong>LN gộp</strong> toàn công ty (xem khối bên dưới).
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Ban quản trị"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-2" />
            <USkeleton class="h-4 w-48" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ formatCurrency(summary.party_totals.board_of_directors) }}
            </p>
            <p class="text-xs text-slate-500 mt-2 leading-snug">
              Phần hoa hồng / phân bổ BQT theo cấu hình dự án.
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Ban quản lý (BQL)"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-2" />
            <USkeleton class="h-4 w-48" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ formatCurrency(summary.party_totals.management) }}
            </p>
            <p class="text-xs text-slate-500 mt-2 leading-snug">
              Phần hoa hồng / phân bổ BQL (cấp trên, có thể xuống phòng ban / cá nhân).
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Hoa hồng — Nền tảng (Platform)"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-8 w-32 mb-2" />
            <USkeleton class="h-4 w-48" />
          </template>
          <template v-else-if="summary">
            <p class="text-2xl font-bold tabular-nums">
              {{ formatCurrency(summary.party_totals.platform) }}
            </p>
            <p class="text-xs text-slate-500 mt-2 leading-snug">
              Tổng kỳ. Quy tắc cố định hệ thống:
              <strong>{{ summary.platform_rules.percent }}%</strong>
              +
              <strong>{{ formatNumber(summary.platform_rules.fixed_per_order) }} đ/đơn</strong>.
            </p>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ 2 thẻ thông tin bổ sung ═══ -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SharedSectionCard
          title="Lợi nhuận công ty vận hành (góc kinh doanh)"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-4 w-full mb-3" />
            <USkeleton class="h-4 w-40 mb-2" />
            <USkeleton class="h-10 w-56" />
          </template>
          <template v-else-if="summary">
            <p class="text-sm text-slate-600 mb-3">
              <strong>Lợi nhuận gộp ước tính</strong> = Doanh thu − Hoa hồng chia cho BQT/BQL/Platform − Chi phí vật tư.
            </p>
            <p class="text-xs text-slate-500 mb-1">
              {{ summary.period_label }}
            </p>
            <p class="text-2xl font-bold text-emerald-600 tabular-nums">
              {{ formatCurrency(summary.estimated_gross_profit) }}
            </p>
            <p class="text-xs text-slate-500 mt-3">
              Chi phí vật tư lấy từ giá nhập trên từng dòng đơn (đã khoá khi đơn vào kỳ chốt).
              <NuxtLink
                to="/reports"
                class="text-primary-600 font-medium hover:underline"
              >
                Xem chi tiết doanh thu &amp; lợi nhuận →
              </NuxtLink>
            </p>
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Hoa hồng nền tảng (Platform)"
          compact
        >
          <template v-if="isLoading(summaryStatus)">
            <USkeleton class="h-4 w-full mb-3" />
            <USkeleton class="h-20 w-full" />
          </template>
          <template v-else-if="summary">
            <p class="text-sm text-slate-600 mb-3">
              Nền tảng luôn có phần hoa hồng <strong>theo quy tắc cố định</strong> trong code (không cấu hình theo từng dự án như VH / BQT / BQL).
            </p>
            <ul class="text-sm space-y-2 list-disc pl-5 text-slate-600">
              <li>
                <strong class="text-slate-900">{{ summary.platform_rules.percent }}%</strong>
                trên cơ sở chia hoa hồng.
              </li>
              <li>
                Cộng thêm
                <strong class="text-slate-900">{{ formatNumber(summary.platform_rules.fixed_per_order) }} đ</strong>
                mỗi đơn hàng.
              </li>
              <li>
                Tổng kỳ trên thẻ:
                <strong class="text-slate-900 tabular-nums">{{ formatCurrency(summary.party_totals.platform) }}</strong>.
              </li>
            </ul>
          </template>
        </SharedSectionCard>
      </div>

      <!-- ═══ Biểu đồ phân bổ hoa hồng ═══ -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <SharedSectionCard
          title="Hoa hồng theo dự án"
          compact
        >
          <template v-if="isLoading(byStaffStatus)">
            <USkeleton class="h-[320px] w-full" />
          </template>
          <template v-else>
            <SharedReportStackedColumnChart
              :categories="chartByProject"
              :series="COMMISSION_SERIES"
              :max-bars="12"
              value-suffix=" đ"
              empty-text="Chưa có dữ liệu hoa hồng trong kỳ đã chọn"
            />
          </template>
        </SharedSectionCard>

        <SharedSectionCard
          title="Hoa hồng theo bộ phận"
          compact
        >
          <template v-if="isLoading(byStaffStatus)">
            <USkeleton class="h-[320px] w-full" />
          </template>
          <template v-else>
            <SharedReportStackedColumnChart
              :categories="chartByDepartment"
              :series="COMMISSION_SERIES"
              :max-bars="12"
              value-suffix=" đ"
              empty-text="Chưa có dữ liệu hoa hồng trong kỳ đã chọn"
            />
          </template>
        </SharedSectionCard>
      </div>

      <SharedSectionCard
        title="Hoa hồng theo cá nhân (Top 15)"
        compact
        class="mb-6"
      >
        <template v-if="isLoading(byStaffStatus)">
          <USkeleton class="h-[320px] w-full" />
        </template>
        <template v-else>
          <SharedReportStackedColumnChart
            :categories="chartByStaff"
            :series="COMMISSION_SERIES"
            :max-bars="15"
            value-suffix=" đ"
            empty-text="Chưa có dữ liệu hoa hồng trong kỳ đã chọn"
          />
        </template>
      </SharedSectionCard>

      <!-- ═══ Hoa hồng theo người / bên nhận ═══ -->
      <SharedSectionCard
        title="Hoa hồng theo người / bên nhận"
        compact
        class="mb-6"
      >
        <template #header-actions>
          <NuxtLink
            to="/pmc/finance/commission-summary"
            class="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Tổng hợp hoa hồng (kế toán) →
          </NuxtLink>
        </template>

        <template v-if="isLoading(byStaffStatus) || isLoading(summaryStatus)">
          <USkeleton class="h-8 w-full mb-2" />
          <USkeleton class="h-8 w-full mb-2" />
          <USkeleton class="h-8 w-full" />
        </template>
        <template v-else-if="byRecipient.length === 0">
          <div class="py-8 text-center text-sm text-slate-500">
            Chưa có dữ liệu hoa hồng trong kỳ đã chọn
          </div>
        </template>
        <UTable
          v-else
          :data="byRecipient"
          :columns="recipientColumns"
          :empty-state="{ icon: 'i-lucide-inbox', label: 'Không có dữ liệu' }"
        >
          <template #typeLabel-cell="{ row }">
            <UBadge
              :color="recipientTypeBadgeColor(row.original.type)"
              variant="subtle"
              :label="row.original.typeLabel"
            />
          </template>
          <template #amount-cell="{ row }">
            <span class="tabular-nums font-medium">{{ formatCurrency(String(row.original.amount)) }}</span>
          </template>
        </UTable>
      </SharedSectionCard>
    </template>
  </div>
</template>
