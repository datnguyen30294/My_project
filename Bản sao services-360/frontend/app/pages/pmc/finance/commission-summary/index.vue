<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  CommissionSummaryFilters,
  CommissionSummaryRecipient,
  CommissionSummarySnapshot,
  ClosingPeriodListItem
} from '~/composables/api/useClosingPeriods'

// ─── Filters ───
const filterClosingPeriodId = ref<string>('pending')
const filterProjectId = ref<number | null>(null)
const filterRecipientType = ref('')

useUrlFilters({
  closing_period_id: { ref: filterClosingPeriodId, type: 'string', defaultValue: 'pending' },
  project_id: { ref: filterProjectId, type: 'number' },
  recipient_type: { ref: filterRecipientType, type: 'string' }
})

const queryParams = computed<CommissionSummaryFilters>(() => ({
  closing_period_id: filterClosingPeriodId.value,
  project_id: filterProjectId.value || undefined,
  recipient_type: filterRecipientType.value || undefined
}))

// ─── Load closing periods for dropdown ───
const { data: periodsData } = useClosingPeriodList({ per_page: SELECT_ALL_PER_PAGE })
const closingPeriodOptions = computed(() => {
  const periods = (periodsData.value?.data ?? []) as ClosingPeriodListItem[]

  const options: { label: string, value: string }[] = [
    { label: 'Chưa chốt (đơn trong kỳ đang mở)', value: 'pending' },
    { label: 'Tất cả kỳ', value: 'all' }
  ]

  for (const p of periods) {
    const statusLabel = p.status.value === 'closed' ? 'Đã chốt' : 'Đang mở'
    options.push({ label: `${p.name} · ${statusLabel}`, value: String(p.id) })
  }

  return options
})

// ─── Recipient type dropdown ───
const recipientTypeOptions: { label: string, value: string }[] = [...SNAPSHOT_RECIPIENT_TYPE_OPTIONS]

// ─── Filter helpers ───
const hasFilters = computed(() =>
  filterClosingPeriodId.value !== 'pending'
  || filterProjectId.value != null
  || !!filterRecipientType.value
)

function clearFilters() {
  filterClosingPeriodId.value = 'pending'
  filterProjectId.value = null
  filterRecipientType.value = ''
}

// ─── Data ───
const { data, status, error, refresh } = useCommissionSummary(queryParams)
const summaryData = computed(() => data.value?.data)
const stats = computed(() => summaryData.value?.stats)

// Fixed recipient-type ordering: Platform → Công ty vận hành → Ban quản trị → Nhân viên.
const RECIPIENT_TYPE_ORDER: Record<string, number> = {
  platform: 0,
  operating_company: 1,
  board_of_directors: 2,
  staff: 3
}
function recipientTypeRank(value: string): number {
  return RECIPIENT_TYPE_ORDER[value] ?? 99
}

const byRecipient = computed<CommissionSummaryRecipient[]>(() => {
  const rows = [...(summaryData.value?.by_recipient ?? [])]
  return rows.sort((a, b) => {
    const rank = recipientTypeRank(a.recipient_type.value) - recipientTypeRank(b.recipient_type.value)
    if (rank !== 0) return rank
    return parseFloat(b.total_amount) - parseFloat(a.total_amount)
  })
})

const snapshots = computed<CommissionSummarySnapshot[]>(() => {
  const rows = [...(summaryData.value?.snapshots ?? [])]
  return rows.sort((a, b) => {
    const rank = recipientTypeRank(a.recipient_type.value) - recipientTypeRank(b.recipient_type.value)
    if (rank !== 0) return rank
    const nameCmp = a.recipient_name.localeCompare(b.recipient_name, 'vi')
    if (nameCmp !== 0) return nameCmp
    return parseFloat(b.amount) - parseFloat(a.amount)
  })
})

// ─── KPI cards ───
const kpiCards = computed(() => [
  { label: 'Tổng hoa hồng', value: stats.value ? formatCurrency(stats.value.total_commission) : '—' },
  { label: 'Số đơn có snapshot', value: stats.value?.order_count ?? '—' },
  { label: 'Số dòng snapshot', value: stats.value?.snapshot_count ?? '—' },
  { label: 'Số người nhận', value: stats.value?.recipient_count ?? '—' }
])

// ─── By-recipient table ───
const recipientColumns: TableColumn<CommissionSummaryRecipient>[] = [
  { accessorKey: 'recipient_name', header: 'Người / Bên nhận' },
  { accessorKey: 'recipient_type', header: 'Loại' },
  { accessorKey: 'total_amount', header: 'Tổng hoa hồng' },
  { accessorKey: 'order_count', header: 'Số đơn hàng' },
  { accessorKey: 'payout_status', header: 'Thanh toán HH' },
  { id: 'qr', header: 'QR' },
  stickyRight<CommissionSummaryRecipient>({ id: 'actions', header: 'Thanh toán' })
]

// ─── Snapshot table ───
const snapshotColumns = [
  { accessorKey: 'order_code', header: 'Đơn hàng' },
  { accessorKey: 'closing_period_name', header: 'Kỳ chốt' },
  { accessorKey: 'recipient_name', header: 'Người nhận' },
  { accessorKey: 'recipient_type', header: 'Loại' },
  { accessorKey: 'amount', header: 'Số tiền' },
  { accessorKey: 'resolved_from', header: 'Nguồn' },
  { accessorKey: 'formula', header: 'Giá trị' },
  { accessorKey: 'payout_status', header: 'Thanh toán HH' },
  { accessorKey: 'cash_transaction', header: 'Đã vào quỹ' },
  { id: 'qr', header: 'QR' }
]

// ─── Commission QR modal ───
const commissionQrOpen = ref(false)
const commissionQrBank = ref<{ bin: string, label: string, account_number: string, account_name: string } | null>(null)
const commissionQrAmount = ref(0)
const commissionQrDescription = ref('')
const commissionQrRecipientName = ref('')

function openCommissionQr(
  bankInfo: { bin: string, label: string, account_number: string, account_name: string } | null | undefined,
  amount: string | number,
  recipientName: string,
  context: string
) {
  if (!bankInfo) return
  commissionQrBank.value = bankInfo
  commissionQrAmount.value = typeof amount === 'string' ? parseFloat(amount) : amount
  commissionQrDescription.value = `HOA HONG ${context}`.trim()
  commissionQrRecipientName.value = recipientName
  commissionQrOpen.value = true
}

// ─── Payout actions (pay whole recipient total, not per-order) ───
const toast = useToast()
const payoutLoadingKey = ref<string | null>(null)

function recipientKey(r: { recipient_type: { value: string }, account_id: number | null, recipient_name: string }): string {
  return `${r.recipient_type.value}|${r.account_id ?? ''}|${r.recipient_name}`
}

function snapshotsForRecipient(r: CommissionSummaryRecipient): CommissionSummarySnapshot[] {
  const key = recipientKey(r)
  return snapshots.value.filter(s => recipientKey(s) === key)
}

async function payRecipientTotal(r: CommissionSummaryRecipient, payoutStatus: 'paid' | 'unpaid') {
  const target = snapshotsForRecipient(r).filter(s =>
    payoutStatus === 'paid'
      ? s.payout_status.value !== 'paid'
      : s.payout_status.value === 'paid'
  )
  if (target.length === 0) {
    toast.add({
      title: payoutStatus === 'paid'
        ? 'Tất cả dòng của người nhận này đã được thanh toán'
        : 'Không có dòng nào đang ở trạng thái đã thanh toán để hoàn tác',
      color: 'info'
    })
    return
  }

  const key = recipientKey(r)
  payoutLoadingKey.value = key
  try {
    const result = await apiUpdatePayoutStatus({
      snapshot_ids: target.map(s => s.id),
      payout_status: payoutStatus
    })
    toast.add({ title: result.message, color: 'success' })
    await refresh()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Có lỗi xảy ra'
    toast.add({ title: message, color: 'error' })
  } finally {
    payoutLoadingKey.value = null
  }
}

// ─── Helpers ───
function buildFormula(s: CommissionSummarySnapshot): string {
  if (!s.value_type) return '—'
  const vt = s.value_type.value
  if (vt === 'percent') return formatPercent(s.percent)
  if (vt === 'fixed') return formatCurrency(s.value_fixed ?? '0')
  if (vt === 'both') return `${formatCurrency(s.value_fixed ?? '0')} + ${formatPercent(s.percent)}`
  return '—'
}

useHead({ title: 'Tổng hợp hoa hồng' })
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Tổng hợp hoa hồng"
      description="Báo cáo hoa hồng theo kỳ chốt, dự án, người nhận"
    >
      <template #actions>
        <span />
      </template>
    </SharedCrudPageHeader>

    <!-- Filters -->
    <div class="flex flex-wrap items-end gap-3 mb-6">
      <UFormField label="Kỳ chốt">
        <USelect
          v-model="filterClosingPeriodId"
          :items="closingPeriodOptions"
          value-key="value"
          class="min-w-56"
        />
      </UFormField>

      <UFormField label="Dự án">
        <SharedProjectSelect
          v-model="filterProjectId"
          placeholder="Tất cả dự án"
        />
      </UFormField>

      <UFormField label="Loại người nhận">
        <USelect
          v-model="filterRecipientType"
          :items="recipientTypeOptions"
          value-key="value"
          placeholder="Tất cả loại"
          class="min-w-40"
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

    <SharedCrudTableWrapper
      :status="status"
      :error="error"
      :data="summaryData"
      :refresh="refresh"
    >
      <!-- KPI Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <UCard
          v-for="card in kpiCards"
          :key="card.label"
        >
          <div class="text-center">
            <p class="text-xs text-[var(--ui-text-muted)] mb-1">
              {{ card.label }}
            </p>
            <p class="text-lg font-bold">
              {{ card.value }}
            </p>
          </div>
        </UCard>
      </div>

      <!-- Table: By Recipient -->
      <SharedSectionCard
        title="Hoa hồng theo người / bên nhận"
        compact
        class="mb-6"
      >
        <div
          v-if="byRecipient.length === 0"
          class="py-8 text-center text-sm text-[var(--ui-text-muted)]"
        >
          Chưa có dữ liệu hoa hồng cho bộ lọc này
        </div>
        <UTable
          v-else
          :data="byRecipient"
          :columns="recipientColumns"
        >
          <template #recipient_name-cell="{ row }">
            <NuxtLink
              v-if="row.original.account_id"
              :to="`/pmc/accounts/${row.original.account_id}`"
              class="text-[var(--ui-primary)] hover:underline font-medium"
            >
              {{ row.original.recipient_name }}
            </NuxtLink>
            <span v-else>{{ row.original.recipient_name }}</span>
          </template>
          <template #recipient_type-cell="{ row }">
            <UBadge
              :color="recipientTypeBadgeColor(row.original.recipient_type.value)"
              variant="subtle"
              :label="row.original.recipient_type.label"
            />
          </template>
          <template #total_amount-cell="{ row }">
            {{ formatCurrency(row.original.total_amount) }}
          </template>
          <template #payout_status-cell="{ row }">
            <UBadge
              :color="payoutStatusBadgeColor(row.original.payout_status)"
              variant="subtle"
              :label="payoutStatusLabel(row.original.payout_status)"
            />
          </template>
          <template #qr-cell="{ row }">
            <UButton
              v-if="row.original.bank_info"
              icon="i-lucide-qr-code"
              size="xs"
              variant="ghost"
              color="neutral"
              title="QR chuyển khoản"
              @click="openCommissionQr(row.original.bank_info, row.original.total_amount, row.original.recipient_name, `TONG ${row.original.recipient_name}`)"
            />
            <span
              v-else
              class="text-xs text-slate-300"
            >—</span>
          </template>
          <template #actions-cell="{ row }">
            <div class="flex items-center gap-1">
              <UButton
                v-if="row.original.payout_status !== 'paid'"
                size="xs"
                color="success"
                variant="soft"
                icon="i-lucide-check"
                label="Thanh toán tổng"
                :loading="payoutLoadingKey === recipientKey(row.original)"
                @click="payRecipientTotal(row.original, 'paid')"
              />
              <UButton
                v-if="row.original.payout_status !== 'unpaid'"
                size="xs"
                color="warning"
                variant="soft"
                icon="i-lucide-rotate-ccw"
                label="Hoàn tác"
                :loading="payoutLoadingKey === recipientKey(row.original)"
                @click="payRecipientTotal(row.original, 'unpaid')"
              />
            </div>
          </template>
        </UTable>
      </SharedSectionCard>

      <!-- Table: Snapshot Details -->
      <SharedSectionCard
        title="Chi tiết theo đơn hàng"
        compact
      >
        <div
          v-if="snapshots.length === 0"
          class="py-8 text-center text-sm text-[var(--ui-text-muted)]"
        >
          Chưa có dữ liệu hoa hồng cho bộ lọc này
        </div>
        <UTable
          v-else
          :data="snapshots"
          :columns="snapshotColumns"
        >
          <template #order_code-cell="{ row }">
            <NuxtLink
              :to="`/pmc/orders/${row.original.order_id}`"
              class="text-[var(--ui-primary)] hover:underline font-medium"
            >
              {{ row.original.order_code }}
            </NuxtLink>
          </template>
          <template #recipient_name-cell="{ row }">
            <NuxtLink
              v-if="row.original.account_id"
              :to="`/pmc/accounts/${row.original.account_id}`"
              class="text-[var(--ui-primary)] hover:underline font-medium"
            >
              {{ row.original.recipient_name }}
            </NuxtLink>
            <span v-else>{{ row.original.recipient_name }}</span>
          </template>
          <template #recipient_type-cell="{ row }">
            <UBadge
              :color="recipientTypeBadgeColor(row.original.recipient_type.value)"
              variant="subtle"
              :label="row.original.recipient_type.label"
            />
          </template>
          <template #amount-cell="{ row }">
            {{ formatCurrency(row.original.amount) }}
          </template>
          <template #resolved_from-cell="{ row }">
            <UBadge
              :color="row.original.resolved_from === 'override' ? 'warning' : 'neutral'"
              variant="subtle"
              :label="row.original.resolved_from === 'override' ? 'Override' : 'Config'"
            />
          </template>
          <template #formula-cell="{ row }">
            {{ buildFormula(row.original) }}
          </template>
          <template #payout_status-cell="{ row }">
            <UBadge
              :color="payoutStatusBadgeColor(row.original.payout_status.value)"
              variant="subtle"
              :label="row.original.payout_status.label"
            />
          </template>

          <!-- Cash transaction -->
          <template #cash_transaction-cell="{ row }">
            <template v-if="row.original.payout_status.value === 'unpaid'">
              <span class="text-slate-400">—</span>
            </template>
            <UTooltip
              v-else-if="row.original.cash_transaction"
              :text="`Đã chi ra quỹ: ${row.original.cash_transaction.code}`"
            >
              <NuxtLink
                to="/pmc/finance/treasury"
                class="flex items-center gap-1 text-[var(--ui-success)] hover:underline text-sm font-mono"
              >
                <UIcon
                  name="i-lucide-check-circle"
                  class="size-3.5 shrink-0"
                />
                {{ row.original.cash_transaction.code }}
              </NuxtLink>
            </UTooltip>
            <UTooltip
              v-else-if="row.original.payout_status.value === 'paid'"
              text="Giao dịch quỹ đã bị huỷ"
            >
              <span class="flex items-center gap-1 text-[var(--ui-warning)]">
                <UIcon
                  name="i-lucide-alert-triangle"
                  class="size-3.5 shrink-0"
                />
                <span class="text-xs">Đã huỷ</span>
              </span>
            </UTooltip>
            <span
              v-else
              class="text-slate-400"
            >—</span>
          </template>

          <template #qr-cell="{ row }">
            <UButton
              v-if="row.original.bank_info"
              icon="i-lucide-qr-code"
              size="xs"
              variant="ghost"
              color="neutral"
              title="QR chuyển khoản"
              @click="openCommissionQr(row.original.bank_info, row.original.amount, row.original.recipient_name, `${row.original.order_code ?? ''} ${row.original.recipient_name}`)"
            />
            <span
              v-else
              class="text-xs text-slate-300"
            >—</span>
          </template>
        </UTable>
      </SharedSectionCard>
    </SharedCrudTableWrapper>

    <!-- Commission QR modal -->
    <SharedBankQrModal
      v-model:open="commissionQrOpen"
      :bank="commissionQrBank"
      :amount="commissionQrAmount"
      :description="commissionQrDescription"
      :recipient-name="commissionQrRecipientName"
      title="QR chi tiền hoa hồng"
    />
  </div>
</template>
