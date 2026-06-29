<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdvancePaymentHistoryResource } from '#api/generated/laravel'
import type {
  AdvancePaymentRow,
  AdvancePaymentListFilters
} from '~/composables/api/useAdvancePayments'
import type { BankInfoPayload } from '~/components/shared/BankQrModal.vue'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Tiền ứng vật tư - Thần Nông' })

const toast = useToast()

// ─── Filters ───
const searchInput = ref('')
const debouncedSearch = ref('')
const { searchInput: boundSearch, onSearch } = useTableSearch((val) => {
  debouncedSearch.value = val ?? ''
})
boundSearch.value = searchInput.value

const statusFilter = ref<'all' | 'pending' | 'paid'>('all')
const projectFilter = ref<number | null>(null)

const listFilters = computed<AdvancePaymentListFilters>(() => ({
  status: statusFilter.value,
  project_id: projectFilter.value ?? undefined,
  search: debouncedSearch.value || undefined
}))

const { data: listData, status: listStatus, refresh: refreshList } = useAdvancePaymentList(listFilters)
const { data: statsData, refresh: refreshStats } = useAdvancePaymentStats()
const { data: historyData, refresh: refreshHistory } = useAdvancePaymentHistory()

const rows = computed<AdvancePaymentRow[]>(() => listData.value?.data ?? [])
const stats = computed(() => statsData.value?.data ?? {
  total_advanced: '0.00', total_pending: '0.00', total_paid: '0.00', account_count: 0
})
const history = computed<AdvancePaymentHistoryResource[]>(() => historyData.value?.data ?? [])

function refreshAll() {
  refreshList()
  refreshStats()
  refreshHistory()
}

// ─── Table columns ───
const columns: TableColumn<AdvancePaymentRow>[] = [
  { id: 'select', header: '' },
  { id: 'payer', header: 'Nhân sự' },
  { id: 'order_line', header: 'Dòng đơn hàng' },
  { id: 'amount', header: 'Tiền ứng' },
  { id: 'status', header: 'Trạng thái' },
  stickyRight<AdvancePaymentRow>({ id: 'actions', header: '' })
]

const historyColumns: TableColumn<AdvancePaymentHistoryResource>[] = [
  { id: 'payer', header: 'Nhân sự' },
  { id: 'order', header: 'Đơn hàng' },
  { id: 'line', header: 'Hạng mục' },
  { id: 'amount', header: 'Số tiền' },
  { accessorKey: 'note', header: 'Ghi chú' },
  { id: 'paid_at', header: 'Ngày hoàn' }
]

// ─── Selection ───
const selectedIds = ref<Set<number>>(new Set())
const pendingRows = computed(() => rows.value.filter(r => !r.is_paid))
const isAllSelected = computed(() =>
  pendingRows.value.length > 0 && pendingRows.value.every(r => selectedIds.value.has(r.order_line_id))
)
const isSomeSelected = computed(() =>
  pendingRows.value.some(r => selectedIds.value.has(r.order_line_id))
)

function toggleSelectAll(v: boolean | 'indeterminate') {
  const next = new Set(selectedIds.value)
  if (v === true) {
    pendingRows.value.forEach(r => next.add(r.order_line_id))
  } else {
    pendingRows.value.forEach(r => next.delete(r.order_line_id))
  }
  selectedIds.value = next
}

function toggleRow(lineId: number, v: boolean | 'indeterminate') {
  const next = new Set(selectedIds.value)
  if (v === true) next.add(lineId)
  else next.delete(lineId)
  selectedIds.value = next
}

// ─── Single pay modal ───
const payModalOpen = ref(false)
const payTarget = ref<AdvancePaymentRow | null>(null)
const payNote = ref('')
const payPaidAt = ref(todayStr())
const isPaying = ref(false)

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function openPayModal(row: AdvancePaymentRow) {
  payTarget.value = row
  payNote.value = `Hoàn tiền ứng ${row.line_name} đơn ${row.order_code}`
  payPaidAt.value = todayStr()
  payModalOpen.value = true
}

async function submitSinglePay() {
  if (!payTarget.value) return
  isPaying.value = true
  try {
    await apiCreateAdvancePayment({
      order_line_id: payTarget.value.order_line_id,
      note: payNote.value || null,
      paid_at: payPaidAt.value
    })
    toast.add({ title: 'Đã ghi nhận hoàn tiền ứng', color: 'success' })
    selectedIds.value.delete(payTarget.value.order_line_id)
    payModalOpen.value = false
    refreshAll()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Ghi nhận thất bại'), color: 'error' })
  } finally {
    isPaying.value = false
  }
}

// ─── Batch pay modal ───
const batchModalOpen = ref(false)
const batchNote = ref('')
const batchPaidAt = ref(todayStr())

const batchTargets = computed<AdvancePaymentRow[]>(() =>
  rows.value.filter(r => selectedIds.value.has(r.order_line_id) && !r.is_paid)
)

const batchTotal = computed(() =>
  batchTargets.value.reduce((s, r) => s + parseFloat(r.advance_amount), 0)
)

function openBatchModal() {
  batchNote.value = `Hoàn tiền ứng vật tư — ${new Date().toLocaleDateString('vi-VN')}`
  batchPaidAt.value = todayStr()
  batchModalOpen.value = true
}

async function submitBatchPay() {
  if (batchTargets.value.length === 0) return
  isPaying.value = true
  try {
    await apiCreateBatchAdvancePayment({
      order_line_ids: batchTargets.value.map(r => r.order_line_id),
      note: batchNote.value || null,
      paid_at: batchPaidAt.value
    })
    toast.add({ title: `Đã hoàn ${batchTargets.value.length} mục tiền ứng`, color: 'success' })
    selectedIds.value = new Set()
    batchModalOpen.value = false
    refreshAll()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Ghi nhận thất bại'), color: 'error' })
  } finally {
    isPaying.value = false
  }
}

// ─── QR modal ───
const qrModalOpen = ref(false)
const qrBank = ref<BankInfoPayload | null>(null)
const qrAmount = ref(0)
const qrDescription = ref('')
const qrRecipientName = ref('')

function openQrModal(row: AdvancePaymentRow) {
  if (!row.advance_payer?.bank_info) {
    toast.add({
      title: 'Nhân sự chưa có thông tin ngân hàng',
      description: 'Cập nhật trong Tài khoản > Thông tin ngân hàng.',
      color: 'warning'
    })
    return
  }
  qrBank.value = row.advance_payer.bank_info
  qrAmount.value = parseFloat(row.advance_amount)
  qrDescription.value = `HOAN UNG ${row.advance_payer.employee_code ?? ''} ${row.order_code}`.trim()
  qrRecipientName.value = row.advance_payer.name
  qrModalOpen.value = true
}
</script>

<template>
  <div class="pb-12">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Tiền ứng vật tư
      </h1>
      <p class="text-sm text-slate-500 mt-1">
        Theo dõi và hoàn tiền ứng mua vật tư theo dòng đơn hàng cho nhân sự.
      </p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- KPI -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
          <p class="text-xs text-slate-500 mb-1">
            Tổng đã ứng
          </p>
          <p class="text-lg font-bold tabular-nums text-slate-900">
            {{ formatCurrency(stats.total_advanced) }}
          </p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
          <p class="text-xs text-slate-500 mb-1">
            Chưa hoàn
          </p>
          <p class="text-lg font-bold tabular-nums text-amber-600">
            {{ formatCurrency(stats.total_pending) }}
          </p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
          <p class="text-xs text-slate-500 mb-1">
            Đã hoàn
          </p>
          <p class="text-lg font-bold tabular-nums text-emerald-600">
            {{ formatCurrency(stats.total_paid) }}
          </p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
          <p class="text-xs text-slate-500 mb-1">
            Số nhân sự ứng
          </p>
          <p class="text-lg font-bold tabular-nums text-slate-900">
            {{ stats.account_count }}
          </p>
        </div>
      </div>

      <!-- Filter bar -->
      <SharedSectionCard
        title="Bộ lọc"
        compact
      >
        <div class="flex flex-wrap items-center gap-3">
          <UInput
            v-model="boundSearch"
            placeholder="Tìm nhân sự, đơn hàng, hạng mục..."
            icon="i-lucide-search"
            class="min-w-64"
            @input="onSearch"
          />
          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'Tất cả', value: 'all' },
              { label: 'Chưa hoàn', value: 'pending' },
              { label: 'Đã hoàn', value: 'paid' }
            ]"
            class="min-w-40"
          />
          <SharedProjectSelect
            v-model="projectFilter"
            placeholder="Tất cả dự án"
          />
          <div class="grow" />
          <UButton
            v-if="selectedIds.size > 0"
            icon="i-lucide-check-circle"
            :label="`Hoàn ${selectedIds.size} mục đã chọn`"
            color="success"
            @click="openBatchModal"
          />
          <UButton
            icon="i-lucide-refresh-cw"
            variant="ghost"
            color="neutral"
            @click="refreshAll"
          />
        </div>
      </SharedSectionCard>

      <!-- Main table -->
      <SharedSectionCard :title="`Danh sách tiền ứng (${rows.length})`">
        <div
          v-if="listStatus === 'pending'"
          class="py-12 flex justify-center"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="size-6 animate-spin text-slate-400"
          />
        </div>

        <div
          v-else-if="rows.length === 0"
          class="py-12 text-center"
        >
          <UIcon
            name="i-lucide-package-open"
            class="size-10 text-slate-300 mx-auto mb-2"
          />
          <p class="text-sm text-slate-500">
            Không có dòng nào khớp với bộ lọc.
          </p>
        </div>

        <UTable
          v-else
          :data="rows"
          :columns="columns"
        >
          <template #select-header>
            <UCheckbox
              :model-value="isAllSelected"
              :indeterminate="isSomeSelected && !isAllSelected"
              aria-label="Chọn tất cả"
              @update:model-value="toggleSelectAll"
            />
          </template>
          <template #select-cell="{ row }">
            <UCheckbox
              :model-value="selectedIds.has(row.original.order_line_id)"
              :disabled="row.original.is_paid"
              @update:model-value="(v: boolean | 'indeterminate') => toggleRow(row.original.order_line_id, v)"
            />
          </template>

          <template #payer-cell="{ row }">
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-900 truncate">
                {{ row.original.advance_payer?.name ?? '—' }}
              </p>
              <p class="text-xs text-slate-500">
                {{ row.original.advance_payer?.employee_code ?? '' }}
              </p>
            </div>
          </template>

          <template #order_line-cell="{ row }">
            <NuxtLink
              :to="`/pmc/orders/${row.original.order_id}`"
              class="text-sm text-primary-600 hover:underline font-mono"
            >
              {{ row.original.order_code }}
            </NuxtLink>
            <p class="text-xs text-slate-500 truncate max-w-sm">
              {{ row.original.line_name }}
            </p>
          </template>

          <template #amount-cell="{ row }">
            <div class="text-right">
              <p class="text-sm font-semibold tabular-nums text-slate-900">
                {{ formatCurrency(row.original.advance_amount) }}
              </p>
              <p class="text-xs text-slate-400">
                {{ row.original.quantity }} {{ row.original.unit }}
              </p>
            </div>
          </template>

          <template #status-cell="{ row }">
            <div class="flex flex-col items-end gap-1">
              <UBadge
                :label="row.original.is_paid ? 'Đã hoàn' : 'Chưa hoàn'"
                :color="row.original.is_paid ? 'success' : 'warning'"
                variant="subtle"
                size="sm"
              />
              <p
                v-if="row.original.is_paid && row.original.paid_at"
                class="text-xs text-slate-400"
              >
                {{ row.original.paid_at }}
              </p>
            </div>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex items-center gap-1">
              <UButton
                v-if="!row.original.is_paid"
                icon="i-lucide-check"
                label="Ghi hoàn"
                size="xs"
                variant="soft"
                color="success"
                @click="openPayModal(row.original)"
              />
              <UButton
                icon="i-lucide-qr-code"
                size="xs"
                variant="ghost"
                color="neutral"
                :disabled="!row.original.advance_payer?.bank_info"
                :title="row.original.advance_payer?.bank_info ? 'Xem QR chuyển khoản' : 'Chưa có STK'"
                @click="openQrModal(row.original)"
              />
            </div>
          </template>
        </UTable>
      </SharedSectionCard>

      <!-- History -->
      <SharedSectionCard :title="`Lịch sử hoàn tiền ứng (${history.length})`">
        <div
          v-if="history.length === 0"
          class="py-8 text-center"
        >
          <UIcon
            name="i-lucide-file-clock"
            class="size-8 text-slate-300 mx-auto mb-2"
          />
          <p class="text-sm text-slate-500">
            Chưa có lịch sử hoàn tiền.
          </p>
        </div>
        <UTable
          v-else
          :data="history"
          :columns="historyColumns"
        >
          <template #payer-cell="{ row }">
            <span class="font-medium">{{ row.original.account?.name ?? '—' }}</span>
          </template>
          <template #order-cell="{ row }">
            <NuxtLink
              v-if="row.original.order"
              :to="`/pmc/orders/${row.original.order.id}`"
              class="text-primary-600 hover:underline font-mono text-sm"
            >
              {{ row.original.order.code }}
            </NuxtLink>
            <span
              v-else
              class="text-slate-300"
            >—</span>
          </template>
          <template #line-cell="{ row }">
            <span class="text-sm">{{ row.original.order_line?.name ?? '—' }}</span>
          </template>
          <template #amount-cell="{ row }">
            <span class="font-medium tabular-nums">{{ formatCurrency(row.original.amount) }}</span>
          </template>
          <template #paid_at-cell="{ row }">
            {{ row.original.paid_at ?? '—' }}
          </template>
        </UTable>
      </SharedSectionCard>
    </div>

    <!-- Single pay modal -->
    <UModal
      v-model:open="payModalOpen"
      title="Ghi nhận hoàn tiền ứng"
    >
      <template
        v-if="payTarget"
        #body
      >
        <div class="flex flex-col gap-4">
          <div class="rounded-lg bg-slate-50 px-4 py-3 text-sm space-y-1.5">
            <div class="flex justify-between">
              <span class="text-slate-500">Nhân sự</span>
              <span class="font-medium">{{ payTarget.advance_payer?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Đơn hàng</span>
              <span class="font-mono">{{ payTarget.order_code }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Hạng mục</span>
              <span class="max-w-[60%] text-right">{{ payTarget.line_name }}</span>
            </div>
            <div class="flex justify-between border-t pt-1.5 mt-1">
              <span class="text-slate-500">Số tiền hoàn</span>
              <span class="font-bold text-amber-600 tabular-nums">{{ formatCurrency(payTarget.advance_amount) }}</span>
            </div>
          </div>
          <UFormField label="Ghi chú">
            <UTextarea
              v-model="payNote"
              :rows="2"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Ngày hoàn">
            <UInput
              v-model="payPaidAt"
              type="date"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="payModalOpen = false"
          />
          <UButton
            label="Xác nhận hoàn"
            icon="i-lucide-check"
            color="primary"
            :loading="isPaying"
            @click="submitSinglePay"
          />
        </div>
      </template>
    </UModal>

    <!-- Batch pay modal -->
    <UModal
      v-model:open="batchModalOpen"
      title="Hoàn tiền ứng gộp"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <div class="rounded-lg bg-slate-50 px-4 py-3 text-sm max-h-64 overflow-auto">
            <p class="font-medium mb-2 text-slate-700">
              Các dòng sẽ hoàn ({{ batchTargets.length }})
            </p>
            <ul class="space-y-1 text-xs">
              <li
                v-for="t in batchTargets"
                :key="t.order_line_id"
                class="flex justify-between gap-3"
              >
                <span class="truncate">{{ t.advance_payer?.name }} — {{ t.order_code }} — {{ t.line_name }}</span>
                <span class="tabular-nums font-medium shrink-0">{{ formatCurrency(t.advance_amount) }}</span>
              </li>
            </ul>
            <div class="mt-2 pt-2 border-t border-slate-200 flex justify-between font-bold">
              <span>Tổng</span>
              <span class="tabular-nums text-amber-600">{{ formatCurrency(batchTotal) }}</span>
            </div>
          </div>
          <UFormField label="Ghi chú chung">
            <UTextarea
              v-model="batchNote"
              :rows="2"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Ngày hoàn">
            <UInput
              v-model="batchPaidAt"
              type="date"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="batchModalOpen = false"
          />
          <UButton
            :label="`Hoàn ${batchTargets.length} mục`"
            icon="i-lucide-check"
            color="primary"
            :loading="isPaying"
            @click="submitBatchPay"
          />
        </div>
      </template>
    </UModal>

    <!-- QR modal -->
    <SharedBankQrModal
      v-model:open="qrModalOpen"
      :bank="qrBank"
      :amount="qrAmount"
      :description="qrDescription"
      :recipient-name="qrRecipientName"
      title="QR hoàn tiền ứng"
    />
  </div>
</template>
