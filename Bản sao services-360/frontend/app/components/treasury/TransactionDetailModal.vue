<script setup lang="ts">
import type { CashTransactionDetailResource, CashTransactionListResource } from '~/composables/api/useTreasury'

const props = defineProps<{
  transactionId: string | number | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  delete: [tx: CashTransactionListResource]
}>()

const activeTab = ref('info')

watch(() => props.open, (val) => {
  if (val) {
    activeTab.value = 'info'
  }
})

const { data, status } = useCashTransactionDetail(
  computed(() => props.transactionId ?? 0)
)

const tx = computed<CashTransactionDetailResource | null>(() => data.value?.data ?? null)

const tabs = [
  { label: 'Thông tin giao dịch', value: 'info' },
  { label: 'Lịch sử thay đổi', value: 'audit' }
]

function auditEventLabel(event: string): string {
  if (event === 'created') return 'Tạo mới'
  if (event === 'updated') return 'Cập nhật'
  if (event === 'deleted') return 'Xoá'
  return event
}

function auditEventColor(event: string): string {
  if (event === 'created') return 'text-[var(--ui-success)]'
  if (event === 'deleted') return 'text-[var(--ui-error)]'
  return 'text-[var(--ui-warning)]'
}

function formatAuditValues(values: Record<string, unknown> | null): string {
  if (!values) return ''
  return Object.entries(values)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')
}

function handleDelete() {
  if (!tx.value) return
  // Emit with minimal tx info for the delete modal
  emit('delete', {
    id: tx.value.id,
    code: tx.value.code,
    direction: tx.value.direction,
    amount: tx.value.amount,
    category: tx.value.category,
    transaction_date: tx.value.transaction_date,
    source: tx.value.source,
    manual_reconciliation: tx.value.manual_reconciliation,
    note: tx.value.note,
    created_by: tx.value.created_by,
    is_deleted: tx.value.is_deleted,
    auto_deleted: tx.value.auto_deleted,
    delete_reason: tx.value.delete_reason,
    deleted_by: tx.value.deleted_by,
    deleted_at: tx.value.deleted_at
  } as CashTransactionListResource)
  emit('close')
}
</script>

<template>
  <UModal
    :open="open"
    :title="tx ? `Giao dịch ${tx.code}` : 'Chi tiết giao dịch'"
    :ui="{ content: 'max-w-xl' }"
    @update:open="(v) => !v && emit('close')"
  >
    <template #body>
      <div
        v-if="status === 'pending'"
        class="flex justify-center py-8"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-6 animate-spin text-slate-400"
        />
      </div>

      <div
        v-else-if="!tx"
        class="text-center py-8 text-slate-400 text-sm"
      >
        Không tìm thấy giao dịch
      </div>

      <div v-else>
        <!-- Deleted banner -->
        <UAlert
          v-if="tx.is_deleted"
          color="error"
          variant="subtle"
          :title="tx.auto_deleted ? 'Giao dịch đã bị xoá tự động' : 'Giao dịch đã bị xoá thủ công'"
          :description="tx.delete_reason || undefined"
          icon="i-lucide-trash-2"
          class="mb-4"
        />

        <!-- Tabs -->
        <div class="flex gap-0 border-b border-slate-200 mb-4">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === tab.value
              ? 'border-[var(--ui-primary)] text-[var(--ui-primary)]'
              : 'border-transparent text-slate-500 hover:text-slate-700'"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- ─── Tab: Info ─── -->
        <div
          v-if="activeTab === 'info'"
          class="space-y-4"
        >
          <!-- Basic info -->
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-xs text-slate-500 mb-0.5">
                Mã
              </div>
              <div class="font-mono font-medium">
                {{ tx.code }}
              </div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-0.5">
                Ngày giao dịch
              </div>
              <div>{{ formatDate(tx.transaction_date) }}</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-0.5">
                Loại
              </div>
              <span
                class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring ring-inset"
                :class="tx.direction.value === 'inflow'
                  ? 'bg-slate-100 text-slate-900 ring-slate-300'
                  : 'bg-rose-50 text-rose-800 ring-rose-200'"
              >
                {{ tx.direction.label }}
              </span>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-0.5">
                Danh mục
              </div>
              <UBadge
                :label="tx.category.label"
                :color="cashTransactionCategoryColor(tx.category.value)"
                variant="subtle"
                size="sm"
              />
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-0.5">
                Số tiền
              </div>
              <div
                class="font-bold tabular-nums"
                :class="tx.direction.value === 'inflow' ? 'text-slate-900' : 'text-rose-800'"
              >
                {{ tx.direction.value === 'inflow' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
              </div>
            </div>
            <div v-if="tx.cash_account">
              <div class="text-xs text-slate-500 mb-0.5">
                Tài khoản quỹ
              </div>
              <div>{{ tx.cash_account.name }}</div>
            </div>
            <div v-if="tx.created_by">
              <div class="text-xs text-slate-500 mb-0.5">
                Người tạo
              </div>
              <div>{{ tx.created_by.name }}</div>
            </div>
          </div>

          <div
            v-if="tx.note"
            class="text-sm"
          >
            <div class="text-xs text-slate-500 mb-0.5">
              Ghi chú
            </div>
            <div class="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
              {{ tx.note }}
            </div>
          </div>

          <!-- Manual reconciliation audit gate (only on manual txs) -->
          <div
            v-if="tx.manual_reconciliation"
            class="rounded-lg border border-slate-200 p-3 space-y-1.5 text-sm"
          >
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Đối soát
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Trạng thái</span>
              <UBadge
                :label="tx.manual_reconciliation.status.label"
                :color="manualReconciliationStatusColor(tx.manual_reconciliation.status.value)"
                variant="subtle"
                size="sm"
              />
            </div>
            <div
              v-if="tx.manual_reconciliation.reconciled_at"
              class="flex justify-between"
            >
              <span class="text-slate-500">Ngày đối soát</span>
              <span>{{ formatDateTime(tx.manual_reconciliation.reconciled_at) }}</span>
            </div>
            <div
              v-if="tx.manual_reconciliation.reconciled_by"
              class="flex justify-between"
            >
              <span class="text-slate-500">Người đối soát</span>
              <span>{{ tx.manual_reconciliation.reconciled_by.name }}</span>
            </div>
            <div>
              <NuxtLink
                :to="`/pmc/finance/reconciliation/${tx.manual_reconciliation.id}`"
                class="text-[var(--ui-primary)] hover:underline text-sm"
                @click="emit('close')"
              >
                Xem trên trang đối soát →
              </NuxtLink>
            </div>
          </div>

          <!-- Source: Reconciliation -->
          <div
            v-if="tx.reconciliation"
            class="rounded-lg border border-slate-200 p-3 space-y-1.5 text-sm"
          >
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Nguồn: Đối soát
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Đối soát #</span>
              <NuxtLink
                :to="`/pmc/finance/reconciliation/${tx.reconciliation.id}`"
                class="font-medium text-[var(--ui-primary)] hover:underline"
                @click="emit('close')"
              >
                {{ tx.reconciliation.id }}
              </NuxtLink>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Trạng thái</span>
              <UBadge
                :label="tx.reconciliation.status"
                variant="subtle"
                size="sm"
              />
            </div>
            <div
              v-if="tx.reconciliation.reconciled_at"
              class="flex justify-between"
            >
              <span class="text-slate-500">Ngày đối soát</span>
              <span>{{ formatDate(tx.reconciliation.reconciled_at) }}</span>
            </div>
            <template v-if="tx.reconciliation.payment_receipt">
              <div class="flex justify-between">
                <span class="text-slate-500">Phiếu thu #</span>
                <span class="font-medium">{{ tx.reconciliation.payment_receipt.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Loại</span>
                <span>{{ tx.reconciliation.payment_receipt.type.label }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Số tiền</span>
                <span class="font-bold tabular-nums">{{ formatCurrency(tx.reconciliation.payment_receipt.amount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Ngày trả</span>
                <span>{{ formatDate(tx.reconciliation.payment_receipt.paid_at) }}</span>
              </div>
            </template>
            <div v-if="tx.source.type === 'reconciliation' && tx.source.order_id">
              <NuxtLink
                :to="`/pmc/orders/${tx.source.order_id}`"
                class="text-[var(--ui-primary)] hover:underline text-sm"
                @click="emit('close')"
              >
                Xem đơn hàng {{ tx.source.order_code || tx.source.order_id }} →
              </NuxtLink>
            </div>
          </div>

          <!-- Source: Commission snapshot -->
          <div
            v-else-if="tx.commission_snapshot"
            class="rounded-lg border border-slate-200 p-3 space-y-1.5 text-sm"
          >
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Nguồn: Hoa hồng
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Snapshot #</span>
              <NuxtLink
                :to="`/pmc/finance/commission-summary?highlight=${tx.commission_snapshot.id}`"
                class="font-medium text-[var(--ui-primary)] hover:underline"
                @click="emit('close')"
              >
                {{ tx.commission_snapshot.id }}
              </NuxtLink>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Số tiền</span>
              <span class="font-bold tabular-nums">{{ formatCurrency(tx.commission_snapshot.amount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Ngày chi trả</span>
              <span>{{ formatDate(tx.commission_snapshot.paid_out_at) }}</span>
            </div>
            <div v-if="tx.source.type === 'commission_snapshot' && tx.source.order_id">
              <NuxtLink
                :to="`/pmc/orders/${tx.source.order_id}`"
                class="text-[var(--ui-primary)] hover:underline text-sm"
                @click="emit('close')"
              >
                Xem đơn hàng {{ tx.source.order_code || tx.source.order_id }} →
              </NuxtLink>
            </div>
          </div>

          <!-- Delete info (if deleted) -->
          <div
            v-if="tx.is_deleted && tx.deleted_by"
            class="rounded-lg border border-red-100 bg-red-50 p-3 space-y-1.5 text-sm"
          >
            <div class="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
              Thông tin xoá
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Người xoá</span>
              <span>{{ tx.deleted_by.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Ngày xoá</span>
              <span>{{ formatDate(tx.deleted_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Loại xoá</span>
              <span>{{ tx.auto_deleted ? 'Tự động' : 'Thủ công' }}</span>
            </div>
            <div
              v-if="tx.delete_reason"
              class="flex justify-between gap-4"
            >
              <span class="text-slate-500 shrink-0">Lý do</span>
              <span class="text-right text-slate-700">{{ tx.delete_reason }}</span>
            </div>
          </div>
        </div>

        <!-- ─── Tab: Audit ─── -->
        <div
          v-if="activeTab === 'audit'"
          class="space-y-3"
        >
          <div
            v-if="tx.audit_history.length === 0"
            class="text-sm text-slate-400 text-center py-6"
          >
            Không có lịch sử thay đổi
          </div>

          <div
            v-else
            class="space-y-3"
          >
            <div
              v-for="(entry, idx) in tx.audit_history"
              :key="idx"
              class="flex gap-3 text-sm"
            >
              <div class="flex flex-col items-center">
                <div class="size-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                  <UIcon
                    name="i-lucide-clock"
                    class="size-3.5 text-slate-400"
                  />
                </div>
                <div
                  v-if="idx < tx.audit_history.length - 1"
                  class="w-px flex-1 bg-slate-200 mt-1"
                />
              </div>
              <div class="pb-4 flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span
                    class="font-semibold"
                    :class="auditEventColor(entry.event)"
                  >
                    {{ auditEventLabel(entry.event) }}
                  </span>
                  <span
                    v-if="entry.user"
                    class="text-slate-500"
                  >bởi {{ entry.user.name }}</span>
                  <span class="ml-auto text-xs text-slate-400">
                    {{ entry.created_at ? formatDateTime(entry.created_at) : '' }}
                  </span>
                </div>
                <div
                  v-if="entry.new_values && Object.keys(entry.new_values).length > 0"
                  class="mt-1 text-xs text-slate-500 font-mono bg-slate-50 rounded px-2 py-1 truncate"
                >
                  {{ formatAuditValues(entry.new_values) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template
      v-if="tx && !tx.is_deleted && tx.source.type === 'manual'"
      #footer
    >
      <div class="flex justify-between w-full">
        <UButton
          label="Xoá giao dịch"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          @click="handleDelete"
        />
        <UButton
          label="Đóng"
          color="neutral"
          variant="outline"
          @click="emit('close')"
        />
      </div>
    </template>

    <template
      v-else
      #footer
    >
      <div class="flex justify-end">
        <UButton
          label="Đóng"
          color="neutral"
          variant="outline"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>
