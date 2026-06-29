<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type { TableColumn } from '@nuxt/ui'
import type {
  CashTransactionListResource,
  TreasuryListFilters
} from '~/composables/api/useTreasury'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Quản lý dòng tiền - Thần Nông' })

// ─── Helpers exposed to template ───
// (imported from composable — auto-imported in Nuxt)

// ─── Date range defaults: last 30 days ───
function defaultDateFrom(): string {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().slice(0, 10)
}

function defaultDateTo(): string {
  return new Date().toISOString().slice(0, 10)
}

function toPickerDate(str: string): Date {
  return new Date(str + 'T00:00:00')
}

function pickerDateToStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ─── Filters (shared between KPI + table) ───
const dateRange = ref<[Date, Date]>([toPickerDate(defaultDateFrom()), toPickerDate(defaultDateTo())])
const dateFrom = computed(() => dateRange.value ? pickerDateToStr(dateRange.value[0]) : undefined)
const dateTo = computed(() => dateRange.value ? pickerDateToStr(dateRange.value[1]) : undefined)

const selectedDirection = ref<string | undefined>(undefined)
const selectedCategory = ref<string | undefined>(undefined)
const selectedIncludeDeleted = ref<string>('none')
const searchOrderId = ref<string>('')

const page = ref(1)

const kpiParams = computed(() => ({
  date_from: dateFrom.value,
  date_to: dateTo.value
}))

const tableParams = computed<TreasuryListFilters & { page: number }>(() => ({
  date_from: dateFrom.value,
  date_to: dateTo.value,
  direction: selectedDirection.value as TreasuryListFilters['direction'],
  category: selectedCategory.value as TreasuryListFilters['category'],
  include_deleted: selectedIncludeDeleted.value === 'none' ? undefined : selectedIncludeDeleted.value as TreasuryListFilters['include_deleted'],
  search: searchOrderId.value || undefined,
  per_page: DEFAULT_PER_PAGE,
  page: page.value
}))

watch([selectedDirection, selectedCategory, selectedIncludeDeleted, searchOrderId, dateRange], () => {
  page.value = 1
})

// ─── Data fetching ───
const { data: accountData, status: accountStatus, refresh: refreshAccount } = useCashAccountDefault()
const account = computed(() => accountData.value?.data ?? null)
const currentBalance = computed(() => account.value?.current_balance != null ? parseFloat(account.value.current_balance) : 0)

const { data: kpiData, status: kpiStatus, refresh: refreshKpi } = useTreasuryKpi(kpiParams)
const kpi = computed(() => kpiData.value?.data ?? null)

const { data: txData, status: txStatus, error: txError, refresh: refreshTx } = useCashTransactionList(tableParams)
const transactions = computed<CashTransactionListResource[]>(() => txData.value?.data ?? [])

async function refreshAll() {
  await Promise.all([refreshAccount(), refreshKpi(), refreshTx()])
}

// ─── Modals state ───
const showTopupModal = ref(false)
const showWithdrawModal = ref(false)

const showDeleteModal = ref(false)
const deleteTarget = ref<CashTransactionListResource | null>(null)

const showDetailModal = ref(false)
const detailId = ref<string | number | null>(null)

function openDetail(tx: CashTransactionListResource) {
  detailId.value = tx.id
  showDetailModal.value = true
}

function openDelete(tx: CashTransactionListResource) {
  deleteTarget.value = tx
  showDeleteModal.value = true
}

function handleDetailDelete(tx: CashTransactionListResource) {
  showDetailModal.value = false
  openDelete(tx)
}

// ─── Table columns ───
const columns: TableColumn<CashTransactionListResource>[] = [
  { id: 'code', header: 'Mã' },
  { id: 'date', header: 'Ngày' },
  { id: 'direction', header: 'Loại' },
  { id: 'category', header: 'Danh mục' },
  { id: 'amount', header: 'Số tiền' },
  { id: 'source', header: 'Nguồn' },
  { id: 'reconciliation', header: 'TT đối soát' },
  { id: 'note', header: 'Ghi chú' },
  stickyRight<CashTransactionListResource>({ id: 'actions', header: '' })
]

// ─── Include deleted options (for radio-like USelect) ───
const includeDeletedOptions = CASH_TRANSACTION_INCLUDE_DELETED_OPTIONS

function hasFilters(): boolean {
  return !!selectedDirection.value || !!selectedCategory.value || !!searchOrderId.value || selectedIncludeDeleted.value !== 'none'
}

function clearFilters() {
  selectedDirection.value = undefined
  selectedCategory.value = undefined
  selectedIncludeDeleted.value = 'none'
  searchOrderId.value = ''
}
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Quản lý dòng tiền"
      description="Theo dõi dòng tiền và số dư tài khoản quỹ"
    >
      <template #actions>
        <UButton
          label="Nạp tiền"
          icon="i-lucide-plus"
          variant="solid"
          class="bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-800 focus-visible:outline-slate-900"
          :disabled="!account"
          @click="showTopupModal = true"
        />
        <UButton
          label="Rút tiền"
          icon="i-lucide-minus"
          variant="solid"
          class="bg-rose-800 text-white hover:bg-rose-900 active:bg-rose-900 focus-visible:outline-rose-800"
          :disabled="!account"
          @click="showWithdrawModal = true"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- ═══ ACCOUNT CARD ═══ -->
    <div class="mb-4 sm:mb-6">
      <div
        v-if="accountStatus === 'pending'"
        class="h-24 rounded-xl bg-slate-100 animate-pulse"
      />
      <TreasuryAccountCard
        v-else-if="account"
        :account="account"
      />
    </div>

    <!-- ═══ DATE RANGE FILTER ═══ -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-calendar"
          class="size-4 text-slate-400"
        />
        <span class="text-sm text-slate-600 font-medium">Khoảng thời gian:</span>
      </div>
      <VueDatePicker
        v-model="dateRange"
        range
        :time-config="{ enableTimePicker: false }"
        format="dd/MM/yyyy"
        auto-apply
        :max-date="new Date()"
        class="w-64"
      />
    </div>

    <!-- ═══ KPI CARDS ═══ -->
    <div class="mb-4 sm:mb-6">
      <div
        v-if="kpiStatus === 'pending'"
        class="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="h-20 rounded-xl bg-slate-100 animate-pulse"
        />
      </div>
      <TreasuryKpiRow
        v-else-if="kpi"
        :kpi="kpi"
      />
    </div>

    <!-- ═══ FLOW CHART ═══ -->
    <div
      v-if="kpi"
      class="mb-4 sm:mb-6"
    >
      <TreasuryFlowChart :kpi="kpi" />
    </div>

    <!-- ═══ TABLE FILTERS ═══ -->
    <div class="mb-3 flex flex-wrap items-center gap-3">
      <UInput
        v-model="searchOrderId"
        icon="i-lucide-search"
        placeholder="Tìm theo mã giao dịch, ghi chú..."
        class="max-w-xs"
      />
      <USelect
        v-model="selectedDirection"
        :items="CASH_TRANSACTION_DIRECTION_OPTIONS"
        placeholder="Hướng"
        class="w-36"
      />
      <USelect
        v-model="selectedCategory"
        :items="CASH_TRANSACTION_CATEGORY_OPTIONS"
        placeholder="Danh mục"
        class="w-48"
      />
      <USelect
        v-model="selectedIncludeDeleted"
        :items="includeDeletedOptions"
        class="w-52"
      />
      <UButton
        v-if="hasFilters()"
        label="Xoá bộ lọc"
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        size="sm"
        @click="clearFilters"
      />
    </div>

    <!-- ═══ TRANSACTIONS TABLE ═══ -->
    <SharedCrudTableWrapper
      :status="txStatus"
      :error="txError"
      :data="txData"
      :refresh="refreshTx"
    >
      <div class="bg-white border rounded-xl overflow-hidden">
        <UTable
          :data="transactions"
          :columns="columns"
        >
          <!-- Code (clickable) -->
          <template #code-cell="{ row }">
            <button
              class="font-mono text-sm text-[var(--ui-primary)] hover:underline"
              :class="row.original.is_deleted ? 'line-through text-slate-400' : ''"
              @click="openDetail(row.original)"
            >
              {{ row.original.code }}
            </button>
          </template>

          <!-- Date -->
          <template #date-cell="{ row }">
            <span
              class="text-sm"
              :class="row.original.is_deleted ? 'text-slate-400' : 'text-slate-700'"
            >
              {{ formatDate(row.original.transaction_date) }}
            </span>
          </template>

          <!-- Direction -->
          <template #direction-cell="{ row }">
            <div class="flex items-center gap-1.5">
              <span
                class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring ring-inset"
                :class="[
                  row.original.direction.value === 'inflow'
                    ? 'bg-slate-100 text-slate-900 ring-slate-300'
                    : 'bg-rose-50 text-rose-800 ring-rose-200',
                  row.original.is_deleted ? 'opacity-50' : ''
                ]"
              >
                {{ row.original.direction.label }}
              </span>
              <UBadge
                v-if="row.original.is_deleted"
                label="Đã xoá"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </div>
          </template>

          <!-- Category -->
          <template #category-cell="{ row }">
            <UBadge
              :label="row.original.category.label"
              :color="cashTransactionCategoryColor(row.original.category.value)"
              variant="subtle"
              size="sm"
              :class="row.original.is_deleted ? 'opacity-50' : ''"
            />
          </template>

          <!-- Amount -->
          <template #amount-cell="{ row }">
            <span
              class="font-bold tabular-nums text-sm"
              :class="[
                row.original.is_deleted ? 'line-through text-slate-400' : (
                  row.original.direction.value === 'inflow' ? 'text-slate-900' : 'text-rose-800'
                )
              ]"
            >
              {{ row.original.direction.value === 'inflow' ? '+' : '-' }}{{ formatCurrency(row.original.amount) }}
            </span>
          </template>

          <!-- Source -->
          <template #source-cell="{ row }">
            <span class="text-sm text-slate-600">
              <template v-if="row.original.source.type === 'manual'">
                Thủ công
              </template>
              <template v-else-if="row.original.source.type === 'reconciliation'">
                <NuxtLink
                  :to="`/pmc/finance/reconciliation/${row.original.source.id}`"
                  class="text-[var(--ui-primary)] hover:underline"
                >
                  Đối soát #{{ row.original.source.id }}
                </NuxtLink>
                <template v-if="row.original.source.order_code">
                  →
                  <NuxtLink
                    :to="`/pmc/orders/${row.original.source.order_id}`"
                    class="text-[var(--ui-primary)] hover:underline"
                  >
                    {{ row.original.source.order_code }}
                  </NuxtLink>
                </template>
              </template>
              <template v-else-if="row.original.source.type === 'commission_snapshot'">
                <NuxtLink
                  :to="`/pmc/finance/commission-summary?highlight=${row.original.source.id}`"
                  class="text-[var(--ui-primary)] hover:underline"
                >
                  Snapshot #{{ row.original.source.id }}
                </NuxtLink>
                <template v-if="row.original.source.order_code">
                  →
                  <NuxtLink
                    :to="`/pmc/orders/${row.original.source.order_id}`"
                    class="text-[var(--ui-primary)] hover:underline"
                  >
                    {{ row.original.source.order_code }}
                  </NuxtLink>
                </template>
              </template>
            </span>
          </template>

          <!-- Reconciliation status (manual txs only) -->
          <template #reconciliation-cell="{ row }">
            <UBadge
              v-if="row.original.manual_reconciliation"
              :label="row.original.manual_reconciliation.status.label"
              :color="manualReconciliationStatusColor(row.original.manual_reconciliation.status.value)"
              variant="subtle"
              size="sm"
              :to="`/pmc/finance/reconciliation/${row.original.manual_reconciliation.id}`"
              :class="row.original.is_deleted ? 'opacity-50' : ''"
            />
            <span
              v-else
              class="text-xs text-slate-400"
            >—</span>
          </template>

          <!-- Note -->
          <template #note-cell="{ row }">
            <span
              class="text-sm max-w-44 truncate block"
              :class="row.original.is_deleted ? 'text-slate-400' : 'text-slate-600'"
              :title="row.original.note"
            >
              {{ row.original.note || '—' }}
            </span>
          </template>

          <!-- Actions -->
          <template #actions-cell="{ row }">
            <div class="flex items-center gap-1">
              <UTooltip
                v-if="row.original.source.type !== 'manual' && !row.original.is_deleted"
                text="Giao dịch tự động. Thao tác ở đối soát / snapshot hoa hồng."
              >
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  size="xs"
                  disabled
                />
              </UTooltip>
              <UButton
                v-else-if="row.original.source.type === 'manual' && !row.original.is_deleted"
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="xs"
                @click.stop="openDelete(row.original)"
              />
            </div>
          </template>
        </UTable>

        <SharedCrudTablePagination
          v-model:page="page"
          :meta="txData?.meta"
        />
      </div>
    </SharedCrudTableWrapper>

    <!-- ═══ MODALS ═══ -->

    <!-- Topup -->
    <TreasuryManualTopupModal
      v-if="account"
      :account="account"
      :open="showTopupModal"
      @close="showTopupModal = false"
      @success="refreshAll"
    />

    <!-- Withdraw -->
    <TreasuryManualWithdrawModal
      v-if="account"
      :account="account"
      :current-balance="currentBalance"
      :open="showWithdrawModal"
      @close="showWithdrawModal = false"
      @success="refreshAll"
    />

    <!-- Delete -->
    <TreasuryDeleteTransactionModal
      :transaction="deleteTarget"
      :current-balance="currentBalance"
      :open="showDeleteModal"
      @close="showDeleteModal = false; deleteTarget = null"
      @success="refreshAll"
    />

    <!-- Detail -->
    <TreasuryTransactionDetailModal
      :transaction-id="detailId"
      :open="showDetailModal"
      @close="showDetailModal = false; detailId = null"
      @delete="handleDetailDelete"
    />
  </div>
</template>
