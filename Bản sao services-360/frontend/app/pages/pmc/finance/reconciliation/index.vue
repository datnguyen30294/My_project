<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ReconciliationListItem } from '~/composables/api/useReconciliations'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Đối soát tài chính - Thần Nông' })

// ─── Filters ───
const params = reactive<ReconciliationListFilters>({
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const selectedStatus = ref<string | undefined>(undefined)
const selectedSource = ref<string | undefined>(undefined)
const selectedProjectId = ref<number | undefined>(undefined)
const selectedType = ref<string | undefined>(undefined)
const dateRange = ref<[string, string] | null>(null)
const dateFromRef = ref<string>('')
const dateToRef = ref<string>('')

const route = useRoute()
if (route.query.receivable_id) {
  params.receivable_id = Number(route.query.receivable_id)
}

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  status: { ref: selectedStatus, type: 'string' },
  source: { ref: selectedSource, type: 'string' },
  project_id: { ref: selectedProjectId, type: 'number' },
  type: { ref: selectedType, type: 'string' },
  date_from: { ref: dateFromRef, type: 'string', onInit: (v) => { params.date_from = String(v) } },
  date_to: { ref: dateToRef, type: 'string', onInit: (v) => { params.date_to = String(v) } }
})

// Initialize date picker from URL-synced refs
if (dateFromRef.value && dateToRef.value) {
  dateRange.value = [dateFromRef.value, dateToRef.value]
}

watch(selectedStatus, (val) => {
  params.status = (val || undefined) as ReconciliationListFilters['status']
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedSource, (val) => {
  params.source = (val || undefined) as ReconciliationListFilters['source']
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedProjectId, (val) => {
  params.project_id = val || undefined
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedType, (val) => {
  params.type = val || undefined
  if (!isInitFromUrl.value) page.value = 1
})

watch(dateRange, (val) => {
  if (val && val[0] && val[1]) {
    params.date_from = val[0]
    params.date_to = val[1]
    dateFromRef.value = val[0]
    dateToRef.value = val[1]
  } else {
    params.date_from = undefined
    params.date_to = undefined
    dateFromRef.value = ''
    dateToRef.value = ''
  }
  if (!isInitFromUrl.value) page.value = 1
})

const hasFilters = computed(() =>
  !!searchInput.value || !!selectedStatus.value || !!selectedSource.value || selectedProjectId.value != null
  || !!selectedType.value || !!dateRange.value
)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedStatus.value = undefined
  selectedSource.value = undefined
  selectedProjectId.value = undefined
  selectedType.value = undefined
  dateRange.value = null
  params.date_from = undefined
  params.date_to = undefined
  params.source = undefined
  params.receivable_id = undefined
  page.value = 1
}

function formatDateRange(dates: Date[]): string {
  if (!dates || dates.length < 2) return ''
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
  return `${fmt(dates[0])} - ${fmt(dates[1])}`
}

// ─── Data ───
const { data, status, error, refresh } = useReconciliationList(
  computed(() => ({ ...params, page: page.value }))
)
const items = computed<ReconciliationListItem[]>(() => data.value?.data ?? [])

// ─── Summary (Reconciliation) — same filters as list ───
const { data: summaryData } = useReconciliationSummary(
  computed(() => ({ ...params }))
)
const summary = computed<ReconciliationSummary | undefined>(() => summaryData.value?.data)
const totalAmount = computed(() => {
  if (!summary.value) return ''
  return formatCurrency(String(parseFloat(summary.value.pending_amount) + parseFloat(summary.value.reconciled_amount)))
})

// ─── Table ───
const columns: TableColumn<ReconciliationListItem>[] = [
  { id: 'select', header: '' },
  { id: 'source_label', header: 'Nguồn' },
  { id: 'order_info', header: 'Đơn hàng / Giao dịch' },
  { id: 'project', header: 'Dự án' },
  { id: 'type', header: 'Loại' },
  { id: 'receipt_amount', header: 'Số tiền GD' },
  { id: 'receivable_amount', header: 'Phải thu' },
  { id: 'receivable_paid', header: 'Đã thu' },
  { id: 'receivable_status', header: 'TT công nợ' },
  { id: 'paid_at', header: 'Ngày GD' },
  { id: 'status', header: 'TT đối soát' },
  { id: 'reconciled_info', header: 'Đối soát' },
  { id: 'cash_transaction', header: 'Giao dịch quỹ' },
  stickyRight<ReconciliationListItem>({ id: 'actions', header: '' })
]

// ─── Selection for batch reconcile ───
const selectedIds = ref<Set<number>>(new Set())
const toast = useToast()

function toggleSelection(id: number) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
  selectedIds.value = new Set(selectedIds.value)
}

function toggleSelectAll() {
  const pendingItems = items.value.filter(i => i.status.value === 'pending')
  if (pendingItems.every(i => selectedIds.value.has(i.id))) {
    pendingItems.forEach(i => selectedIds.value.delete(i.id))
  } else {
    pendingItems.forEach(i => selectedIds.value.add(i.id))
  }
  selectedIds.value = new Set(selectedIds.value)
}

const isAllSelected = computed(() => {
  const pendingItems = items.value.filter(i => i.status.value === 'pending')
  return pendingItems.length > 0 && pendingItems.every(i => selectedIds.value.has(i.id))
})

// ─── Batch Reconcile ───
const showBatchConfirm = ref(false)
const isBatchReconciling = ref(false)
const batchNote = ref('')

async function submitBatchReconcile() {
  isBatchReconciling.value = true
  try {
    const result = await apiBatchReconcile({
      ids: [...selectedIds.value],
      note: batchNote.value || undefined
    })
    toast.add({ title: `Đã đối soát ${result.data.reconciled_count} dòng tiền`, color: 'success' })
    showBatchConfirm.value = false
    selectedIds.value = new Set()
    batchNote.value = ''
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Đối soát hàng loạt thất bại'), color: 'error' })
  } finally {
    isBatchReconciling.value = false
  }
}

// ─── Single Reconcile (quick action) ───
async function quickReconcile(item: ReconciliationListItem) {
  try {
    await apiReconcile(item.id, {})
    toast.add({ title: 'Đã xác nhận đối soát', color: 'success' })
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Đối soát thất bại'), color: 'error' })
  }
}
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Đối soát tài chính"
      description="Quản lý đối soát các dòng tiền thu/trả"
    >
      <template #actions>
        <UButton
          v-if="selectedIds.size > 0"
          :label="`Đối soát đã chọn (${selectedIds.size})`"
          color="primary"
          icon="i-lucide-check-check"
          @click="showBatchConfirm = true"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- ═══ SUMMARY CARDS ═══ -->
    <div
      v-if="summary"
      class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6"
    >
      <UCard>
        <div class="text-xs text-slate-500 mb-1">
          Tổng dòng tiền
        </div>
        <div class="text-lg font-bold text-slate-900">
          {{ totalAmount }}
        </div>
        <div class="text-xs text-slate-400">
          {{ summary.total_count }} dòng
        </div>
      </UCard>
      <UCard v-if="summary">
        <div class="text-xs text-slate-500 mb-1">
          Chờ đối soát
        </div>
        <div class="text-lg font-bold text-[var(--ui-warning)]">
          {{ summary.pending_count }}
        </div>
        <div class="text-xs text-slate-400">
          {{ formatCurrency(summary.pending_amount) }}
        </div>
      </UCard>
      <UCard v-if="summary">
        <div class="text-xs text-slate-500 mb-1">
          Đã đối soát
        </div>
        <div class="text-lg font-bold text-[var(--ui-success)]">
          {{ summary.reconciled_count }}
        </div>
        <div class="text-xs text-slate-400">
          {{ formatCurrency(summary.reconciled_amount) }}
        </div>
      </UCard>
    </div>

    <!-- ═══ FILTERS ═══ -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo mã đơn, khách hàng..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="selectedStatus"
        :items="RECONCILIATION_STATUS_OPTIONS"
        placeholder="Trạng thái"
        class="w-44"
      />
      <USelect
        v-model="selectedSource"
        :items="RECONCILIATION_SOURCE_OPTIONS"
        placeholder="Nguồn"
        class="w-44"
      />
      <USelect
        v-model="selectedType"
        :items="PAYMENT_TYPE_FILTER_OPTIONS"
        placeholder="Loại"
        class="w-36"
      />
      <SharedProjectSelect
        v-model="selectedProjectId"
        placeholder="Dự án"
        class="w-48"
      />
      <div class="w-64 dp-nuxt-ui">
        <VueDatePicker
          v-model="dateRange"
          range
          :partial-range="false"
          :time-config="{ enableTimePicker: false }"
          model-type="yyyy-MM-dd"
          :format="formatDateRange"
          placeholder="Ngày đối soát"
          auto-apply
        />
      </div>
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

    <!-- ═══ TABLE ═══ -->
    <SharedCrudTableWrapper
      :status="status"
      :error="error"
      :data="data"
      :refresh="refresh"
    >
      <div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm">
        <UTable
          :data="items"
          :columns="columns"
        >
          <!-- Select -->
          <template #select-cell="{ row }">
            <UCheckbox
              v-if="row.original.status.value === 'pending'"
              :model-value="selectedIds.has(row.original.id)"
              @update:model-value="toggleSelection(row.original.id)"
            />
          </template>
          <template #select-header>
            <UCheckbox
              :model-value="isAllSelected"
              @update:model-value="toggleSelectAll"
            />
          </template>

          <!-- Source badge -->
          <template #source_label-cell="{ row }">
            <UBadge
              :label="row.original.source.type === 'manual_cash' ? 'Quỹ thủ công' : 'Công nợ'"
              :color="reconciliationSourceColor(row.original.source.type)"
              variant="subtle"
              size="sm"
            />
          </template>

          <!-- Order info / Cash tx info (combined) -->
          <template #order_info-cell="{ row }">
            <!-- Manual source: cash transaction info -->
            <div
              v-if="row.original.source.type === 'manual_cash' && row.original.source.cash_transaction"
              class="flex flex-col gap-0.5"
            >
              <NuxtLink
                to="/pmc/finance/treasury"
                class="text-primary hover:underline font-mono text-xs font-semibold"
              >
                {{ row.original.source.cash_transaction.code }}
              </NuxtLink>
              <span class="text-xs text-slate-700">{{ row.original.source.cash_transaction.category.label }}</span>
              <span
                v-if="row.original.source.cash_transaction.note"
                class="text-[11px] text-slate-400 truncate max-w-40"
                :title="row.original.source.cash_transaction.note"
              >{{ row.original.source.cash_transaction.note }}</span>
            </div>
            <!-- Receivable source -->
            <div
              v-else
              class="flex flex-col gap-0.5"
            >
              <NuxtLink
                v-if="row.original.receivable"
                :to="`/pmc/receivables/${row.original.receivable.id}`"
                class="text-primary hover:underline font-mono text-xs font-semibold"
              >
                {{ row.original.receivable.order_code ?? '—' }}
              </NuxtLink>
              <span class="text-xs text-slate-700">{{ row.original.receivable?.customer?.full_name ?? row.original.receivable?.requester_name ?? '—' }}</span>
              <span
                v-if="row.original.receivable?.apartment_name"
                class="text-[11px] text-slate-400"
              >{{ row.original.receivable.apartment_name }}</span>
            </div>
          </template>

          <!-- Project -->
          <template #project-cell="{ row }">
            <span :class="row.original.project ? '' : 'text-slate-400'">{{ row.original.project?.name ?? '—' }}</span>
          </template>

          <!-- Type (collection / refund / manual) -->
          <template #type-cell="{ row }">
            <UBadge
              v-if="row.original.payment_receipt"
              :label="row.original.payment_receipt.type.label"
              :color="paymentReceiptTypeColor(row.original.payment_receipt.type.value)"
              variant="subtle"
              size="sm"
            />
            <UBadge
              v-else-if="row.original.source.type === 'manual_cash' && row.original.source.cash_transaction"
              :label="row.original.source.cash_transaction.direction.label"
              :color="row.original.source.cash_transaction.direction.value === 'inflow' ? 'success' : 'warning'"
              variant="subtle"
              size="sm"
            />
          </template>

          <!-- Receipt amount (unified: payment_receipt.amount OR cash_transaction.amount) -->
          <template #receipt_amount-cell="{ row }">
            <span class="font-medium">{{ formatCurrency(row.original.amount) }}</span>
          </template>

          <!-- Receivable: Phải thu -->
          <template #receivable_amount-cell="{ row }">
            <span
              class="text-sm"
              :class="row.original.receivable ? '' : 'text-slate-400'"
            >{{ row.original.receivable ? formatCurrency(row.original.receivable.amount) : '—' }}</span>
          </template>

          <!-- Receivable: Đã thu -->
          <template #receivable_paid-cell="{ row }">
            <span
              class="text-sm"
              :class="row.original.receivable ? 'text-[var(--ui-success)]' : 'text-slate-400'"
            >{{ row.original.receivable ? formatCurrency(row.original.receivable.paid_amount) : '—' }}</span>
          </template>

          <!-- Receivable status -->
          <template #receivable_status-cell="{ row }">
            <UBadge
              v-if="row.original.receivable"
              :label="row.original.receivable.status.label"
              :color="receivableStatusColor(row.original.receivable.status.value)"
              variant="subtle"
              size="sm"
            />
            <span
              v-else
              class="text-xs text-slate-400"
            >—</span>
          </template>

          <!-- Paid at -->
          <template #paid_at-cell="{ row }">
            <span class="text-xs">
              <template v-if="row.original.payment_receipt">{{ formatDateTime(row.original.payment_receipt.paid_at) }}</template>
              <template v-else-if="row.original.source.type === 'manual_cash' && row.original.source.cash_transaction?.transaction_date">{{ formatDate(row.original.source.cash_transaction.transaction_date) }}</template>
              <template v-else>—</template>
            </span>
          </template>

          <!-- Reconciliation status -->
          <template #status-cell="{ row }">
            <UBadge
              :label="row.original.status.label"
              :color="reconciliationStatusColor(row.original.status.value)"
              variant="subtle"
              size="sm"
            />
          </template>

          <!-- Reconciled info (date + person combined) -->
          <template #reconciled_info-cell="{ row }">
            <div
              v-if="row.original.reconciled_at"
              class="flex flex-col"
            >
              <span class="text-xs">{{ formatDateTime(row.original.reconciled_at) }}</span>
              <span class="text-[11px] text-slate-400">{{ row.original.reconciled_by?.name ?? '' }}</span>
            </div>
            <span
              v-else
              class="text-slate-400"
            >—</span>
          </template>

          <!-- Cash transaction -->
          <template #cash_transaction-cell="{ row }">
            <template v-if="row.original.status.value === 'rejected'">
              <span class="text-slate-400 text-xs">N/A</span>
            </template>
            <NuxtLink
              v-else-if="row.original.cash_transaction"
              to="/pmc/finance/treasury"
              class="font-mono text-sm text-[var(--ui-primary)] hover:underline"
            >
              {{ row.original.cash_transaction.code }}
            </NuxtLink>
            <span
              v-else
              class="text-slate-400"
            >—</span>
          </template>

          <!-- Actions -->
          <template #actions-cell="{ row }">
            <div class="flex gap-1">
              <UButton
                v-if="row.original.status.value === 'pending'"
                icon="i-lucide-check"
                color="success"
                variant="ghost"
                size="sm"
                title="Đối soát"
                @click="quickReconcile(row.original)"
              />
              <UButton
                icon="i-lucide-eye"
                color="neutral"
                variant="ghost"
                size="sm"
                title="Chi tiết"
                :to="`/pmc/finance/reconciliation/${row.original.id}`"
              />
            </div>
          </template>
        </UTable>

        <SharedCrudTablePagination
          v-model:page="page"
          :meta="data?.meta"
        />
      </div>
    </SharedCrudTableWrapper>

    <!-- ═══ BATCH RECONCILE CONFIRM ═══ -->
    <UModal
      v-model:open="showBatchConfirm"
      title="Đối soát hàng loạt"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <p class="text-slate-700">
            Xác nhận đối soát <strong>{{ selectedIds.size }}</strong> dòng tiền?
          </p>
          <UFormField label="Ghi chú chung">
            <UInput
              v-model="batchNote"
              placeholder="Nhập ghi chú (tùy chọn)"
              :maxlength="500"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Quay lại"
            color="neutral"
            variant="ghost"
            @click="showBatchConfirm = false"
          />
          <UButton
            :label="`Xác nhận (${selectedIds.size})`"
            color="primary"
            :loading="isBatchReconciling"
            @click="submitBatchReconcile"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.dp-nuxt-ui :deep(.dp__input) {
  font-size: 0.875rem;
  line-height: 1.25rem;
  height: 2rem;
  border-radius: var(--ui-radius);
  border-color: var(--ui-border);
  background-color: var(--ui-bg);
  padding-left: 2rem;
  padding-right: 0.625rem;
  font-family: inherit;
}

.dp-nuxt-ui :deep(.dp__input:hover) {
  border-color: var(--ui-border-hover, var(--ui-border));
}

.dp-nuxt-ui :deep(.dp__input:focus) {
  border-color: var(--ui-primary);
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--ui-primary), transparent 80%);
}

.dp-nuxt-ui :deep(.dp__input_icon) {
  color: var(--ui-text-dimmed);
}

.dp-nuxt-ui :deep(.dp__clear_icon) {
  color: var(--ui-text-dimmed);
}
</style>
