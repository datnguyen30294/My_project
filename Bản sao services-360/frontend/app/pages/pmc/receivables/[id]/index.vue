<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ReceivableDetailResource, PaymentReceiptResource } from '#api/generated/laravel'
import type { ReceivableAudit } from '~/composables/api/useReceivables'
import { buildVietQrImageUrl } from '~/utils/vietqr'

definePageMeta({ layout: 'default' })

const route = useRoute()
const id = computed(() => Number(route.params.id))
const toast = useToast()

// ─── Data ───
const { data, status, error, refresh } = useReceivableDetail(id)
const receivable = computed<ReceivableDetailResource | undefined>(() => data.value?.data)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() =>
  receivable.value?.order ? `Công nợ đơn ${receivable.value.order.code}` : null
))

useSeoMeta({
  title: computed(() =>
    receivable.value?.order ? `Công nợ ${receivable.value.order.code}` : 'Chi tiết công nợ'
  )
})

// ─── Bank account settings (for VietQR) ───
const { data: bankSettingsData } = useSettingsGroup('bank_account')
const bankSettings = computed(() => parseBankAccountSettings(bankSettingsData.value?.data))
const bankConfigured = computed(() => isBankAccountConfigured(bankSettings.value))

// ─── Audit history ───
const { data: auditsData, refresh: refreshAudits } = useReceivableAudits(id)
const audits = computed<ReceivableAudit[]>(() => auditsData.value?.data ?? [])

const RECEIVABLE_AUDIT_FIELD_LABELS: Record<string, string> = {
  status: 'Trạng thái',
  amount: 'Phải thu',
  paid_amount: 'Đã thu',
  due_date: 'Hạn thanh toán',
  issued_at: 'Ngày phát sinh',
  payment_method: 'Phương thức',
  note: 'Ghi chú',
  paid_at: 'Ngày thu'
}

const RECEIVABLE_AUDIT_DATETIME_FIELDS = new Set(['issued_at', 'paid_at', 'due_date'])

const AUDITABLE_TYPE_LABELS: Record<string, string> = {
  receivable: 'Công nợ',
  payment_receipt: 'Phiếu thu'
}

function getChangedFields(audit: ReceivableAudit) {
  return getAuditChangedFields(audit, RECEIVABLE_AUDIT_FIELD_LABELS, RECEIVABLE_AUDIT_DATETIME_FIELDS)
}

// ─── Computed flags ───
const canCollect = computed(() => receivable.value?.can_collect ?? false)
const canRefund = computed(() => receivable.value?.can_refund ?? false)
const canComplete = computed(() => receivable.value?.can_complete ?? false)
const isTerminal = computed(() => {
  const s = receivable.value?.status.value
  return s === 'completed' || s === 'written_off'
})

const payments = computed<PaymentReceiptResource[]>(() => {
  const raw = receivable.value?.payments
  if (!raw || raw.length === 0) return []
  if (typeof raw[0] === 'string') return []
  return raw as PaymentReceiptResource[]
})

const reconciliationProgress = computed(() => {
  const p = receivable.value?.reconciliation_progress
  return {
    total: Number(p?.total ?? 0),
    reconciled: Number(p?.reconciled ?? 0),
    pending: Number(p?.pending ?? 0)
  }
})
const reconciliationPercent = computed(() => {
  const p = reconciliationProgress.value
  return p.total > 0 ? Math.round((p.reconciled / p.total) * 100) : 0
})

// ─── Status Alert config ───
const statusAlertConfig = computed(() => {
  if (!receivable.value) return null
  const s = receivable.value.status.value
  const outstanding = formatCurrency(receivable.value.outstanding)
  const dueDate = formatDate(receivable.value.due_date)
  const overpaid = formatCurrency(receivable.value.overpaid_amount)

  switch (s) {
    case 'unpaid': return { color: 'neutral' as const, title: 'Chưa thu', description: `Chưa thu. Hạn thanh toán: ${dueDate}.` }
    case 'partial': return { color: 'warning' as const, title: 'Thu một phần', description: `Còn nợ ${outstanding}.` }
    case 'paid': return { color: 'success' as const, title: 'Đã thu đủ', description: 'Đã thu đủ toàn bộ số tiền phải thu.' }
    case 'overpaid': return { color: 'info' as const, title: 'Thu thừa', description: `Thu thừa ${overpaid}. Vui lòng ghi nhận hoàn trả.` }
    case 'overdue': return { color: 'error' as const, title: 'Quá hạn', description: `Quá hạn thanh toán. Còn nợ ${outstanding}.` }
    case 'completed': return { color: 'success' as const, title: 'Hoàn thành', description: 'Đã thu đủ và đối soát hoàn tất.' }
    case 'written_off': return { color: 'neutral' as const, title: 'Xóa nợ', description: 'Khoản nợ đã được xóa.' }
    default: return null
  }
})

// ─── Payment history table ───
const paymentColumns: TableColumn<PaymentReceiptResource>[] = [
  { id: 'type', header: 'Loại' },
  { id: 'paid_at', header: 'Ngày' },
  { id: 'amount', header: 'Số tiền' },
  { id: 'payment_method', header: 'Phương thức' },
  { id: 'collected_by', header: 'Người thực hiện' },
  { id: 'reconciliation_status', header: 'Đối soát' },
  { id: 'note', header: 'Ghi chú' },
  stickyRight<PaymentReceiptResource>({ id: 'actions', header: '' })
]

// ─── Payment modal (create + edit) ───
const showPaymentModal = ref(false)
const isSubmittingPayment = ref(false)
const editingPaymentId = ref<number | null>(null)
const isEditMode = computed(() => editingPaymentId.value !== null)

const paymentForm = reactive({
  amount: null as number | null,
  payment_method: 'transfer' as 'cash' | 'transfer',
  paid_at: new Date().toISOString().slice(0, 10),
  note: ''
})

function openPaymentModal() {
  editingPaymentId.value = null
  paymentForm.amount = null
  paymentForm.payment_method = 'transfer'
  paymentForm.paid_at = new Date().toISOString().slice(0, 10)
  paymentForm.note = ''
  showPaymentModal.value = true
}

function openEditPaymentModal(payment: PaymentReceiptResource) {
  editingPaymentId.value = payment.id
  paymentForm.amount = parseFloat(payment.amount)
  paymentForm.payment_method = payment.payment_method.value as 'cash' | 'transfer'
  paymentForm.paid_at = payment.paid_at ? payment.paid_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
  paymentForm.note = payment.note ?? ''
  showPaymentModal.value = true
}

const isOverpaymentWarning = computed(() => {
  const amt = paymentForm.amount
  const outstanding = parseFloat(receivable.value?.outstanding ?? '0')
  return amt !== null && amt > outstanding && !isEditMode.value
})

const isPaymentValid = computed(() => {
  const amt = paymentForm.amount
  return amt !== null && amt > 0
})

async function submitPayment() {
  if (!isPaymentValid.value || !paymentForm.amount) return
  isSubmittingPayment.value = true
  try {
    const payload = {
      amount: paymentForm.amount,
      payment_method: paymentForm.payment_method,
      paid_at: paymentForm.paid_at,
      note: paymentForm.note || undefined
    }

    if (isEditMode.value) {
      await apiUpdatePayment(id.value, editingPaymentId.value!, payload)
      toast.add({ title: 'Đã cập nhật phiếu thu', color: 'success' })
    } else {
      await apiCreatePayment(id.value, payload)
      toast.add({ title: 'Ghi nhận thu tiền thành công', color: 'success' })
    }

    showPaymentModal.value = false
    clearReceivableCache(id.value)
    await Promise.all([refresh(), refreshAudits()])
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, isEditMode.value ? 'Cập nhật thất bại' : 'Ghi nhận thất bại'), color: 'error' })
  } finally {
    isSubmittingPayment.value = false
  }
}

// ─── Refund modal ───
const showRefundModal = ref(false)
const isSubmittingRefund = ref(false)

const refundForm = reactive({
  amount: null as number | null,
  payment_method: 'transfer' as 'cash' | 'transfer',
  paid_at: new Date().toISOString().slice(0, 10),
  note: ''
})

const maxRefundAmount = computed(() => parseFloat(receivable.value?.overpaid_amount ?? '0'))

function openRefundModal() {
  refundForm.amount = null
  refundForm.payment_method = 'transfer'
  refundForm.paid_at = new Date().toISOString().slice(0, 10)
  refundForm.note = ''
  showRefundModal.value = true
}

const isRefundValid = computed(() => {
  const amt = refundForm.amount
  return amt !== null && amt > 0 && amt <= maxRefundAmount.value
})

async function submitRefund() {
  if (!isRefundValid.value || !refundForm.amount) return
  isSubmittingRefund.value = true
  try {
    await apiCreateRefund(id.value, {
      amount: refundForm.amount,
      payment_method: refundForm.payment_method,
      paid_at: refundForm.paid_at,
      note: refundForm.note || undefined
    })
    toast.add({ title: 'Ghi nhận trả tiền thành công', color: 'success' })
    showRefundModal.value = false
    clearReceivableCache(id.value)
    await Promise.all([refresh(), refreshAudits()])
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Ghi nhận hoàn trả thất bại'), color: 'error' })
  } finally {
    isSubmittingRefund.value = false
  }
}

// ─── QR code modal ───
const showQrModal = ref(false)
const qrModalAmount = ref<number>(0)
const qrModalContext = ref<'payment' | 'outstanding'>('outstanding')

const qrTransferDescription = computed(() => {
  const orderCode = receivable.value?.order?.code
  return orderCode ? `TT ${orderCode}` : ''
})

const qrModalImageUrl = computed(() => {
  if (!bankConfigured.value || qrModalAmount.value <= 0) return ''
  return buildVietQrImageUrl({
    bankBin: bankSettings.value.bank_bin,
    accountNumber: bankSettings.value.account_number,
    accountName: bankSettings.value.account_holder,
    amount: qrModalAmount.value,
    description: qrTransferDescription.value
  })
})

function openPaymentQrModal(payment: PaymentReceiptResource) {
  qrModalAmount.value = Math.round(parseFloat(payment.amount) || 0)
  qrModalContext.value = 'payment'
  showQrModal.value = true
}

function openOutstandingQrModal() {
  qrModalAmount.value = Math.round(parseFloat(receivable.value?.outstanding ?? '0') || 0)
  qrModalContext.value = 'outstanding'
  showQrModal.value = true
}

async function downloadQrCode() {
  if (!qrModalImageUrl.value) return
  try {
    const res = await fetch(qrModalImageUrl.value)
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = `qr-${receivable.value?.order?.code ?? 'payment'}-${qrModalAmount.value}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(objectUrl)
  } catch {
    toast.add({ title: 'Không tải được ảnh QR', color: 'error' })
  }
}

// ─── Mark Completed confirm ───
const showCompleteConfirm = ref(false)
const isCompleting = ref(false)

async function submitComplete() {
  isCompleting.value = true
  try {
    await apiMarkCompleted(id.value)
    toast.add({ title: 'Đã hoàn thành khoản công nợ', color: 'success' })
    showCompleteConfirm.value = false
    clearReceivableCache(id.value)
    await Promise.all([refresh(), refreshAudits()])
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Hoàn thành thất bại'), color: 'error' })
  } finally {
    isCompleting.value = false
  }
}

// ─── Write-off confirm ───
const showWriteOffConfirm = ref(false)
const isWritingOff = ref(false)
const writeOffNote = ref('')

async function submitWriteOff() {
  isWritingOff.value = true
  try {
    await apiWriteOffReceivable(id.value, {
      note: writeOffNote.value || undefined
    })
    toast.add({ title: 'Đã xóa nợ', color: 'success' })
    showWriteOffConfirm.value = false
    clearReceivableCache(id.value)
    await Promise.all([refresh(), refreshAudits()])
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Xóa nợ thất bại'), color: 'error' })
  } finally {
    isWritingOff.value = false
  }
}

// ─── Helpers ───
async function refreshAll() {
  clearReceivableCache(id.value)
  await Promise.all([refresh(), refreshAudits()])
}
</script>

<template>
  <div>
    <!-- ═══ HEADER ═══ -->
    <div class="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        to="/pmc/receivables"
        class="shrink-0"
      />
      <div class="min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
            Chi tiết công nợ
          </h1>
          <UBadge
            v-if="receivable"
            :label="receivable.status.label"
            :color="receivableStatusColor(receivable.status.value)"
            variant="subtle"
            size="sm"
          />
        </div>
        <p class="text-slate-500 text-sm mt-0.5">
          <span
            v-if="receivable?.order"
            class="font-mono font-semibold"
          >{{ receivable.order.code }}</span>
          <span v-else>...</span>
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending' && !receivable"
      class="flex flex-col gap-4"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="h-24 bg-slate-100 rounded-xl animate-pulse"
      />
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <!-- ═══ CONTENT ═══ -->
    <div
      v-else-if="receivable"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      <!-- LEFT: Main content -->
      <div class="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
        <!-- Status Alert -->
        <UAlert
          v-if="statusAlertConfig"
          :color="statusAlertConfig.color"
          variant="subtle"
          :title="statusAlertConfig.title"
          :description="statusAlertConfig.description"
        />

        <!-- Lifecycle Stepper -->
        <SharedSectionCard title="Giai đoạn công nợ">
          <SharedReceivableLifecycleStepper
            :receivable="receivable"
            :payments="payments"
          />
        </SharedSectionCard>

        <!-- Summary Cards -->
        <div
          class="grid gap-3 sm:gap-4"
          :class="receivable.status.value === 'overpaid' ? 'grid-cols-1 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'"
        >
          <UCard>
            <div class="text-xs text-slate-500 mb-1">
              Phải thu
            </div>
            <div class="text-lg font-bold text-slate-900">
              {{ formatCurrency(receivable.amount) }}
            </div>
          </UCard>
          <UCard>
            <div class="text-xs text-slate-500 mb-1">
              Đã thu
            </div>
            <div class="text-lg font-bold text-[var(--ui-success)]">
              {{ formatCurrency(receivable.paid_amount) }}
            </div>
          </UCard>
          <UCard>
            <div class="text-xs text-slate-500 mb-1">
              Còn nợ
            </div>
            <div
              class="text-lg font-bold"
              :class="parseFloat(receivable.outstanding) > 0 ? 'text-[var(--ui-warning)]' : 'text-[var(--ui-success)]'"
            >
              {{ formatCurrency(receivable.outstanding) }}
            </div>
          </UCard>
          <UCard v-if="receivable.status.value === 'overpaid'">
            <div class="text-xs text-slate-500 mb-1">
              Thu thừa
            </div>
            <div class="text-lg font-bold text-[var(--ui-info)]">
              {{ formatCurrency(receivable.overpaid_amount) }}
            </div>
          </UCard>
        </div>

        <!-- Thông tin công nợ -->
        <SharedSectionCard title="Thông tin công nợ">
          <template #header-actions>
            <UBadge
              :label="receivable.status.label"
              :color="receivableStatusColor(receivable.status.value)"
              variant="subtle"
              size="sm"
            />
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <SharedFieldDisplay label="Đơn hàng">
              <NuxtLink
                v-if="receivable.order"
                :to="`/pmc/orders/${receivable.order.id}`"
                class="text-primary hover:underline font-mono text-sm font-medium"
              >
                {{ receivable.order.code }}
              </NuxtLink>
              <span
                v-else
                class="text-slate-400"
              >—</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="receivable.order"
              label="Trạng thái đơn"
            >
              <UBadge
                :label="receivable.order.status.label"
                :color="orderStatusColor(receivable.order.status.value)"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Khách hàng">
              <NuxtLink
                v-if="receivable.og_ticket?.customer"
                :to="`/pmc/customers/${receivable.og_ticket.customer.id}`"
                class="font-medium text-primary-600 hover:underline"
              >
                {{ receivable.og_ticket.customer.full_name }}
              </NuxtLink>
              <span v-else>{{ receivable.og_ticket?.requester_name ?? '—' }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Số điện thoại">
              <span class="font-mono">{{ formatPhone(receivable.og_ticket?.customer?.phone ?? receivable.og_ticket?.requester_phone) }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Căn hộ">
              {{ receivable.og_ticket?.apartment_name ?? '—' }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Dự án">
              {{ receivable.project?.name ?? '—' }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Ngày phát sinh">
              {{ formatDateTime(receivable.issued_at) }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Hạn thanh toán">
              {{ formatDate(receivable.due_date) }}
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <!-- Lịch sử dòng tiền -->
        <SharedSectionCard :title="`Lịch sử dòng tiền (${payments.length})`">
          <template #header-actions>
            <div class="flex items-center gap-2">
              <UButton
                icon="i-lucide-file-search"
                label="Đối soát"
                size="sm"
                color="neutral"
                variant="ghost"
                to="/pmc/finance/reconciliation"
              />
              <UButton
                v-if="canCollect"
                icon="i-lucide-plus"
                label="Ghi nhận thu tiền"
                size="sm"
                color="primary"
                variant="soft"
                @click="openPaymentModal"
              />
              <UButton
                v-if="canRefund"
                icon="i-lucide-undo-2"
                label="Ghi nhận trả tiền"
                size="sm"
                class="bg-rose-800 text-white hover:bg-rose-900 active:bg-rose-900 focus-visible:outline-rose-800"
                @click="openRefundModal"
              />
            </div>
          </template>

          <template v-if="payments.length > 0">
            <UTable
              :data="payments"
              :columns="paymentColumns"
            >
              <template #type-cell="{ row }">
                <UBadge
                  :label="row.original.type.label"
                  :color="paymentReceiptTypeColor(row.original.type.value)"
                  variant="subtle"
                  size="sm"
                />
              </template>
              <template #paid_at-cell="{ row }">
                {{ formatDateTime(row.original.paid_at) }}
              </template>
              <template #amount-cell="{ row }">
                <span class="font-medium">{{ formatCurrency(row.original.amount) }}</span>
              </template>
              <template #payment_method-cell="{ row }">
                {{ row.original.payment_method.label }}
              </template>
              <template #collected_by-cell="{ row }">
                {{ row.original.collected_by?.name ?? '—' }}
              </template>
              <template #reconciliation_status-cell="{ row }">
                <UBadge
                  v-if="row.original.reconciliation_status"
                  :label="row.original.reconciliation_status.label"
                  :color="reconciliationStatusColor(row.original.reconciliation_status.value)"
                  variant="subtle"
                  size="sm"
                />
                <span
                  v-else
                  class="text-slate-400"
                >—</span>
              </template>
              <template #note-cell="{ row }">
                {{ row.original.note ?? '—' }}
              </template>
              <template #actions-cell="{ row }">
                <div class="flex gap-1">
                  <UButton
                    icon="i-lucide-qr-code"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    title="Xem mã QR chuyển khoản"
                    @click="openPaymentQrModal(row.original)"
                  />
                  <UButton
                    v-if="row.original.reconciliation_id"
                    icon="i-lucide-file-search"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    title="Xem đối soát"
                    :to="`/pmc/finance/reconciliation/${row.original.reconciliation_id}`"
                  />
                  <UButton
                    v-if="!isTerminal"
                    icon="i-lucide-pencil"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    title="Sửa phiếu thu"
                    @click="openEditPaymentModal(row.original)"
                  />
                </div>
              </template>
            </UTable>
          </template>

          <div
            v-else
            class="text-center py-8 text-sm text-slate-400"
          >
            <p>Chưa có dòng tiền nào.</p>
            <p
              v-if="canCollect"
              class="mt-1"
            >
              Bấm 'Ghi nhận thu tiền' để thêm phiếu thu.
            </p>
          </div>
        </SharedSectionCard>
      </div>

      <!-- ═══ RIGHT SIDEBAR ═══ -->
      <div class="flex flex-col gap-4">
        <!-- Hành động -->
        <SharedSectionCard
          title="Hành động"
          compact
        >
          <div class="flex flex-col gap-2">
            <UButton
              v-if="canCollect"
              label="Ghi nhận thu tiền"
              icon="i-lucide-banknote"
              color="primary"
              class="w-full"
              @click="openPaymentModal"
            />
            <UButton
              v-if="canComplete"
              label="Hoàn thành"
              icon="i-lucide-check-circle"
              color="success"
              class="w-full"
              @click="showCompleteConfirm = true"
            />
            <UButton
              v-if="canCollect"
              label="Xóa nợ"
              icon="i-lucide-x-circle"
              color="error"
              variant="outline"
              class="w-full"
              @click="showWriteOffConfirm = true"
            />
            <p
              v-if="isTerminal"
              class="text-sm text-slate-400 italic"
            >
              <template v-if="receivable.status.value === 'completed'">
                Khoản công nợ đã hoàn thành.
              </template>
              <template v-else>
                Khoản nợ đã được xóa.
              </template>
            </p>
            <p
              v-if="receivable.status.value === 'paid' && !canComplete"
              class="text-sm text-slate-400 italic"
            >
              Đã thu đủ. Cần đối soát tất cả dòng tiền để hoàn thành.
            </p>
          </div>
        </SharedSectionCard>

        <!-- Tiến độ đối soát -->
        <SharedSectionCard
          v-if="reconciliationProgress.total > 0"
          title="Tiến độ đối soát"
          compact
        >
          <div class="flex items-center gap-2">
            <UProgress
              :value="reconciliationPercent"
              :color="reconciliationPercent === 100 ? 'success' : 'warning'"
              class="flex-1"
            />
            <span class="text-sm whitespace-nowrap font-medium">
              {{ reconciliationProgress.reconciled }}/{{ reconciliationProgress.total }}
            </span>
          </div>
          <p
            v-if="reconciliationProgress.pending > 0"
            class="text-sm text-slate-400 mt-1"
          >
            Còn {{ reconciliationProgress.pending }} dòng tiền chưa đối soát
          </p>
          <NuxtLink
            :to="`/pmc/finance/reconciliation?receivable_id=${receivable.id}`"
            class="text-sm text-primary hover:underline mt-2 inline-block"
          >
            Xem đối soát ({{ reconciliationProgress.pending }} chờ)
          </NuxtLink>
        </SharedSectionCard>

        <!-- Thông tin -->
        <SharedSectionCard
          title="Thông tin"
          compact
        >
          <div class="flex flex-col gap-3">
            <SharedFieldDisplay label="Trạng thái">
              <UBadge
                :label="receivable.status.label"
                :color="receivableStatusColor(receivable.status.value)"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tuổi nợ">
              {{ formatAgingDays(receivable.aging_days, receivable.status.value) }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tạo lúc">
              {{ formatDateTime(receivable.created_at) }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Cập nhật">
              {{ formatDateTime(receivable.updated_at) }}
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <!-- Lịch sử thay đổi -->
        <div
          v-if="audits.length > 0"
          class="bg-white border border-border-gray rounded-xl shadow-sm overflow-hidden"
        >
          <div class="px-5 py-4 border-b border-border-gray">
            <h2 class="font-bold text-slate-900 text-sm">
              Lịch sử thay đổi
            </h2>
          </div>
          <div class="px-5 py-4 max-h-[500px] overflow-y-auto">
            <div class="relative">
              <div class="absolute top-0 bottom-0 left-2.5 w-px bg-slate-200" />
              <div
                v-for="audit in audits"
                :key="audit.id"
                class="relative flex gap-3 pb-4 last:pb-0"
              >
                <div class="relative z-10 flex items-center justify-center size-5 rounded-full bg-white border-2 border-slate-300 shrink-0">
                  <div class="size-1.5 rounded-full bg-slate-400" />
                </div>
                <div class="flex-1 min-w-0 -mt-0.5">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <UBadge
                      :label="AUDIT_EVENT_LABELS[audit.event] ?? audit.event"
                      :color="AUDIT_EVENT_COLORS[audit.event] ?? 'neutral'"
                      variant="subtle"
                      size="xs"
                    />
                    <UBadge
                      :label="AUDITABLE_TYPE_LABELS[audit.auditable_type] ?? audit.auditable_type"
                      color="neutral"
                      variant="outline"
                      size="xs"
                    />
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">
                    <span v-if="audit.user">{{ audit.user.name }} · </span>
                    {{ formatDateTime(audit.created_at) }}
                  </p>
                  <div
                    v-if="audit.event !== 'created'"
                    class="mt-1.5 flex flex-col gap-1"
                  >
                    <div
                      v-for="change in getChangedFields(audit)"
                      :key="change.field"
                      class="text-[11px] leading-relaxed"
                    >
                      <span class="font-medium text-slate-600">{{ change.field }}:</span>
                      <span class="text-red-500 line-through ml-1">{{ change.old }}</span>
                      <UIcon
                        name="i-lucide-arrow-right"
                        class="size-3 text-slate-400 mx-0.5 inline-block align-middle"
                      />
                      <span class="text-emerald-600">{{ change.new }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ MODALS ═══ -->

    <!-- Payment Modal (create + edit) -->
    <UModal
      v-model:open="showPaymentModal"
      :title="isEditMode ? 'Chỉnh sửa phiếu thu' : 'Ghi nhận thu tiền'"
      :description="`Còn nợ: ${receivable ? formatCurrency(receivable.outstanding) : ''}`"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField
            label="Số tiền (đ)"
            required
          >
            <div class="flex gap-2">
              <SharedNumberInput
                v-model="paymentForm.amount"
                placeholder="Nhập số tiền"
                :min="1"
                class="flex-1"
              />
              <UButton
                v-if="!isEditMode"
                label="Tất cả"
                color="neutral"
                variant="outline"
                size="sm"
                class="shrink-0"
                @click="paymentForm.amount = parseFloat(receivable?.outstanding ?? '0')"
              />
            </div>
          </UFormField>

          <!-- Overpayment warning -->
          <UAlert
            v-if="isOverpaymentWarning"
            color="warning"
            variant="subtle"
            title="Số tiền vượt quá công nợ"
            :description="`Sẽ thu thừa ${formatCurrency(String((paymentForm.amount ?? 0) - parseFloat(receivable?.outstanding ?? '0')))}`"
          />

          <UFormField
            label="Phương thức"
            required
          >
            <USelect
              v-model="paymentForm.payment_method"
              :items="PAYMENT_METHOD_OPTIONS"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Ngày thu"
            required
          >
            <UInput
              v-model="paymentForm.paid_at"
              type="date"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Ghi chú">
            <UInput
              v-model="paymentForm.note"
              placeholder="Ghi chú (tùy chọn)"
              :maxlength="500"
              class="w-full"
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
            @click="showPaymentModal = false"
          />
          <UButton
            :label="isEditMode ? 'Cập nhật' : 'Ghi nhận'"
            color="primary"
            :disabled="!isPaymentValid"
            :loading="isSubmittingPayment"
            @click="submitPayment"
          />
        </div>
      </template>
    </UModal>

    <!-- Refund Modal -->
    <UModal
      v-model:open="showRefundModal"
      title="Ghi nhận trả tiền"
      :description="`Thu thừa: ${receivable ? formatCurrency(receivable.overpaid_amount) : ''}`"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField
            label="Số tiền hoàn trả (đ)"
            required
          >
            <div class="flex gap-2">
              <SharedNumberInput
                v-model="refundForm.amount"
                placeholder="Nhập số tiền"
                :min="1"
                :max="maxRefundAmount"
                class="flex-1"
              />
              <UButton
                label="Tất cả"
                color="neutral"
                variant="outline"
                size="sm"
                class="shrink-0"
                @click="refundForm.amount = maxRefundAmount"
              />
            </div>
          </UFormField>

          <UFormField
            label="Phương thức"
            required
          >
            <USelect
              v-model="refundForm.payment_method"
              :items="PAYMENT_METHOD_OPTIONS"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Ngày trả"
            required
          >
            <UInput
              v-model="refundForm.paid_at"
              type="date"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Ghi chú">
            <UInput
              v-model="refundForm.note"
              placeholder="Ghi chú (tùy chọn)"
              :maxlength="500"
              class="w-full"
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
            @click="showRefundModal = false"
          />
          <UButton
            label="Ghi nhận"
            color="primary"
            :disabled="!isRefundValid"
            :loading="isSubmittingRefund"
            @click="submitRefund"
          />
        </div>
      </template>
    </UModal>

    <!-- Complete Confirm -->
    <UModal
      v-model:open="showCompleteConfirm"
      title="Xác nhận hoàn thành"
    >
      <template #body>
        <p class="text-slate-700">
          Khoản công nợ sẽ được đánh dấu hoàn thành.
          Đã đối soát <strong>{{ reconciliationProgress.reconciled }}/{{ reconciliationProgress.total }}</strong> dòng tiền.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Quay lại"
            color="neutral"
            variant="ghost"
            @click="showCompleteConfirm = false"
          />
          <UButton
            label="Xác nhận hoàn thành"
            color="success"
            :loading="isCompleting"
            @click="submitComplete"
          />
        </div>
      </template>
    </UModal>

    <!-- Payment QR Modal -->
    <UModal
      v-model:open="showQrModal"
      :title="qrModalContext === 'outstanding' ? 'Mã QR thanh toán còn nợ' : 'Mã QR chuyển khoản'"
      :description="`Số tiền: ${formatCurrency(String(qrModalAmount))}`"
    >
      <template #body>
        <div class="flex flex-col items-center gap-4">
          <UAlert
            v-if="!bankConfigured"
            icon="i-lucide-alert-triangle"
            color="warning"
            variant="subtle"
            title="Chưa cấu hình tài khoản nhận chuyển khoản"
            class="w-full"
          >
            <template #description>
              Vui lòng cấu hình số tài khoản ngân hàng tại trang
              <NuxtLink
                to="/pmc/settings/bank-account"
                class="text-primary underline font-medium"
              >
                Cài đặt → Tài khoản nhận CK
              </NuxtLink>
              để có thể tạo mã QR chuyển khoản.
            </template>
          </UAlert>

          <template v-else>
            <img
              v-if="qrModalImageUrl"
              :src="qrModalImageUrl"
              :alt="`QR VietQR ${bankSettings.account_number}`"
              class="w-[280px] rounded-lg border border-slate-200 bg-white"
              width="280"
              height="360"
              loading="lazy"
            >

            <div class="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-700 flex flex-col gap-0.5">
              <div class="flex justify-between">
                <span class="text-slate-500">Số tiền:</span>
                <span class="font-semibold text-slate-900">{{ formatCurrency(String(qrModalAmount)) }}</span>
              </div>
              <div
                v-if="qrTransferDescription"
                class="flex justify-between"
              >
                <span class="text-slate-500">Nội dung:</span>
                <span class="font-mono">{{ qrTransferDescription }}</span>
              </div>
            </div>

            <p class="text-xs text-slate-500 text-center">
              Khách hàng dùng app ngân hàng quét mã để chuyển khoản. Số tiền và nội dung được điền sẵn.
            </p>
          </template>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Đóng"
            color="neutral"
            variant="ghost"
            @click="showQrModal = false"
          />
          <UButton
            v-if="bankConfigured"
            label="Tải mã QR"
            icon="i-lucide-download"
            color="primary"
            @click="downloadQrCode"
          />
        </div>
      </template>
    </UModal>

    <!-- Write-off Confirm -->
    <UModal
      v-model:open="showWriteOffConfirm"
      title="Xác nhận xóa nợ"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <p class="text-slate-700">
            Khoản nợ còn <strong>{{ receivable ? formatCurrency(receivable.outstanding) : '' }}</strong> sẽ được xóa. Hành động này không thể hoàn tác.
          </p>
          <UFormField label="Ghi chú lý do">
            <UInput
              v-model="writeOffNote"
              placeholder="Nhập lý do xóa nợ (tùy chọn)"
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
            @click="showWriteOffConfirm = false"
          />
          <UButton
            label="Xác nhận xóa nợ"
            color="error"
            :loading="isWritingOff"
            @click="submitWriteOff"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
