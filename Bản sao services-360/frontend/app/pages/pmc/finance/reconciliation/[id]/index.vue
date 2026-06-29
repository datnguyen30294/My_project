<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const id = computed(() => Number(route.params.id))
const toast = useToast()

// ─── Data ───
const { data, status, error, refresh } = useReconciliationDetail(id)
const reconciliation = computed(() => data.value?.data)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() =>
  reconciliation.value ? `Chi tiết đối soát #${reconciliation.value.id}` : null
))

useSeoMeta({
  title: computed(() =>
    reconciliation.value ? `Đối soát #${reconciliation.value.id}` : 'Chi tiết đối soát'
  )
})

const isPending = computed(() => reconciliation.value?.status.value === 'pending')
const isRejected = computed(() => reconciliation.value?.status.value === 'rejected')
const isManualSource = computed(() => reconciliation.value?.source?.type === 'manual_cash')
const sourceCashTx = computed(() => reconciliation.value?.source?.cash_transaction ?? null)

// ─── Reconcile (Thành công) ───
const showReconcileModal = ref(false)
const reconcileNote = ref('')
const isReconciling = ref(false)

function openReconcileModal() {
  reconcileNote.value = ''
  showReconcileModal.value = true
}

async function submitReconcile() {
  isReconciling.value = true
  try {
    await apiReconcile(id.value, { note: reconcileNote.value || undefined })
    toast.add({ title: 'Đã xác nhận đối soát thành công', color: 'success' })
    clearReconciliationCache(id.value)
    showReconcileModal.value = false
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Đối soát thất bại'), color: 'error' })
  } finally {
    isReconciling.value = false
  }
}

// ─── Reject (Thất bại) ───
const showRejectModal = ref(false)
const rejectReason = ref('')
const isRejecting = ref(false)

function openRejectModal() {
  rejectReason.value = ''
  showRejectModal.value = true
}

async function submitReject() {
  if (!rejectReason.value.trim()) {
    toast.add({ title: 'Vui lòng nhập lý do thất bại', color: 'error' })
    return
  }
  isRejecting.value = true
  try {
    await apiRejectReconcile(id.value, { reason: rejectReason.value })
    toast.add({ title: 'Đã ghi nhận đối soát thất bại', color: 'success' })
    clearReconciliationCache(id.value)
    showRejectModal.value = false
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Ghi nhận thất bại không thành công'), color: 'error' })
  } finally {
    isRejecting.value = false
  }
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
        to="/pmc/finance/reconciliation"
        class="shrink-0"
      />
      <div class="min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
            Chi tiết đối soát
          </h1>
          <UBadge
            v-if="reconciliation"
            :label="reconciliation.status.label"
            :color="reconciliationStatusColor(reconciliation.status.value)"
            variant="subtle"
            size="sm"
          />
        </div>
        <p
          v-if="isManualSource && sourceCashTx"
          class="text-slate-500 text-sm mt-0.5"
        >
          Giao dịch quỹ:
          <span class="font-mono font-semibold">{{ sourceCashTx.code }}</span>
        </p>
        <p
          v-else-if="reconciliation?.receivable?.order"
          class="text-slate-500 text-sm mt-0.5"
        >
          Đơn hàng:
          <span class="font-mono font-semibold">{{ reconciliation.receivable.order.code }}</span>
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending' && !reconciliation"
      class="flex flex-col gap-4"
    >
      <div
        v-for="i in 3"
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
      v-else-if="reconciliation"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      <!-- LEFT: Main content -->
      <div class="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
        <!-- Status Alert -->
        <UAlert
          v-if="isPending"
          color="warning"
          variant="subtle"
          title="Chờ đối soát"
          description="Dòng tiền chưa được đối soát."
        />
        <UAlert
          v-else-if="isRejected"
          color="error"
          variant="subtle"
          title="Đã từ chối đối soát"
          :description="reconciliation.note ? `Lý do: ${reconciliation.note}` : 'Bên đối soát đã từ chối. Vui lòng chỉnh sửa dòng tiền và gửi lại.'"
        />
        <UAlert
          v-else
          color="success"
          variant="subtle"
          title="Đã đối soát"
          :description="`Đã đối soát lúc ${formatDateTime(reconciliation.reconciled_at)}${reconciliation.reconciled_by ? ` bởi ${reconciliation.reconciled_by.name}` : ''}.`"
        />

        <!-- ═══ Manual cash source ═══ -->
        <template v-if="isManualSource">
          <SharedSectionCard title="Thông tin giao dịch quỹ">
            <div
              v-if="sourceCashTx"
              class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
            >
              <SharedFieldDisplay label="Mã giao dịch">
                <span class="font-mono font-semibold">{{ sourceCashTx.code }}</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Danh mục">
                <UBadge
                  :label="sourceCashTx.category.label"
                  :color="cashTransactionCategoryColor(sourceCashTx.category.value)"
                  variant="subtle"
                  size="sm"
                />
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Loại">
                <UBadge
                  :label="sourceCashTx.direction.label"
                  :color="sourceCashTx.direction.value === 'inflow' ? 'success' : 'warning'"
                  variant="subtle"
                  size="sm"
                />
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Số tiền">
                <span class="text-lg font-bold">{{ formatCurrency(sourceCashTx.amount) }}</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Ngày giao dịch">
                {{ formatDate(sourceCashTx.transaction_date) }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Người tạo">
                {{ sourceCashTx.created_by?.name ?? '—' }}
              </SharedFieldDisplay>
              <SharedFieldDisplay
                label="Ghi chú"
                class="sm:col-span-2"
              >
                {{ sourceCashTx.note ?? '—' }}
              </SharedFieldDisplay>
            </div>
            <div class="mt-3">
              <NuxtLink
                to="/pmc/finance/treasury"
                class="text-sm text-primary hover:underline"
              >
                Xem trang quản lý quỹ →
              </NuxtLink>
            </div>
          </SharedSectionCard>
        </template>

        <!-- ═══ Receivable source ═══ -->
        <template v-else>
          <!-- Thông tin dòng tiền -->
          <SharedSectionCard title="Thông tin dòng tiền">
            <div
              v-if="reconciliation.payment_receipt"
              class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
            >
              <SharedFieldDisplay label="Loại">
                <UBadge
                  :label="reconciliation.payment_receipt.type.label"
                  :color="paymentReceiptTypeColor(reconciliation.payment_receipt.type.value)"
                  variant="subtle"
                  size="sm"
                />
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Số tiền">
                <span class="text-lg font-bold">{{ formatCurrency(reconciliation.payment_receipt.amount) }}</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Phương thức">
                <UBadge
                  :label="reconciliation.payment_receipt.payment_method.label"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                />
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Ngày giao dịch">
                {{ formatDateTime(reconciliation.payment_receipt.paid_at) }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Người thu/trả">
                {{ reconciliation.payment_receipt.collected_by?.name ?? '—' }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Ghi chú">
                {{ reconciliation.payment_receipt.note ?? '—' }}
              </SharedFieldDisplay>
            </div>
          </SharedSectionCard>

          <!-- Thông tin công nợ liên quan -->
          <SharedSectionCard title="Công nợ liên quan">
            <div
              v-if="reconciliation.receivable"
              class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
            >
              <SharedFieldDisplay label="Đơn hàng">
                <NuxtLink
                  v-if="reconciliation.receivable.order"
                  :to="`/pmc/orders/${reconciliation.receivable.order.id}`"
                  class="text-primary hover:underline font-mono text-sm font-medium"
                >
                  {{ reconciliation.receivable.order.code }}
                </NuxtLink>
                <span
                  v-else
                  class="text-slate-400"
                >—</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Khách hàng">
                <NuxtLink
                  v-if="reconciliation.receivable.og_ticket?.customer"
                  :to="`/pmc/customers/${reconciliation.receivable.og_ticket.customer.id}`"
                  class="font-medium text-primary-600 hover:underline"
                >
                  {{ reconciliation.receivable.og_ticket.customer.full_name }}
                </NuxtLink>
                <span v-else>{{ reconciliation.receivable.og_ticket?.requester_name ?? '—' }}</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="SĐT">
                <span class="font-mono">{{ formatPhone(reconciliation.receivable.og_ticket?.customer?.phone ?? reconciliation.receivable.og_ticket?.requester_phone) }}</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Căn hộ">
                {{ reconciliation.receivable.og_ticket?.apartment_name ?? '—' }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Dự án">
                {{ reconciliation.receivable.project?.name ?? '—' }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Phải thu">
                {{ formatCurrency(reconciliation.receivable.amount) }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Đã thu">
                {{ formatCurrency(reconciliation.receivable.paid_amount) }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="TT công nợ">
                <UBadge
                  :label="reconciliation.receivable.status.label"
                  :color="receivableStatusColor(reconciliation.receivable.status.value)"
                  variant="subtle"
                  size="sm"
                />
              </SharedFieldDisplay>
            </div>
            <div class="mt-3">
              <NuxtLink
                v-if="reconciliation.receivable"
                :to="`/pmc/receivables/${reconciliation.receivable.id}`"
                class="text-sm text-primary hover:underline"
              >
                Xem công nợ →
              </NuxtLink>
            </div>
          </SharedSectionCard>
        </template>
      </div>

      <!-- ═══ RIGHT SIDEBAR ═══ -->
      <div class="flex flex-col gap-4">
        <!-- Hành động -->
        <SharedSectionCard
          title="Hành động"
          compact
        >
          <template v-if="isPending">
            <div class="flex flex-col gap-3">
              <UButton
                label="Thành công"
                icon="i-lucide-check"
                color="primary"
                class="w-full"
                block
                @click="openReconcileModal"
              />
              <UButton
                label="Thất bại"
                icon="i-lucide-x"
                color="error"
                variant="soft"
                class="w-full"
                block
                @click="openRejectModal"
              />
            </div>
          </template>
          <div
            v-else-if="isRejected"
            class="text-sm text-slate-500 space-y-1"
          >
            <p class="text-error font-medium">
              Đã từ chối
            </p>
            <p v-if="reconciliation.note">
              Lý do: {{ reconciliation.note }}
            </p>
          </div>
          <div
            v-else
            class="text-sm text-slate-400 space-y-1"
          >
            <p>Đã đối soát</p>
            <p>{{ formatDateTime(reconciliation.reconciled_at) }}</p>
            <p v-if="reconciliation.reconciled_by">
              Bởi: {{ reconciliation.reconciled_by.name }}
            </p>
            <p v-if="reconciliation.note">
              Ghi chú: {{ reconciliation.note }}
            </p>
          </div>
        </SharedSectionCard>

        <!-- Thông tin -->
        <SharedSectionCard
          title="Thông tin"
          compact
        >
          <div class="flex flex-col gap-3">
            <SharedFieldDisplay label="Trạng thái">
              <UBadge
                :label="reconciliation.status.label"
                :color="reconciliationStatusColor(reconciliation.status.value)"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tạo lúc">
              {{ formatDateTime(reconciliation.created_at) }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Cập nhật">
              {{ formatDateTime(reconciliation.updated_at) }}
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>
      </div>
    </div>

    <!-- ═══ Modal: Xác nhận Thành công ═══ -->
    <UModal
      v-model:open="showReconcileModal"
      title="Xác nhận đối soát thành công"
      description="Dòng tiền sẽ được đánh dấu là đã đối soát thành công."
    >
      <template #body>
        <UFormField label="Ghi chú (tùy chọn)">
          <UInput
            v-model="reconcileNote"
            placeholder="Nhập ghi chú đối soát"
            :maxlength="500"
            class="w-full"
            autofocus
          />
        </UFormField>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Quay lại"
            color="neutral"
            variant="ghost"
            :disabled="isReconciling"
            @click="showReconcileModal = false"
          />
          <UButton
            label="Xác nhận thành công"
            icon="i-lucide-check"
            color="primary"
            :loading="isReconciling"
            @click="submitReconcile"
          />
        </div>
      </template>
    </UModal>

    <!-- ═══ Modal: Xác nhận Thất bại ═══ -->
    <UModal
      v-model:open="showRejectModal"
      title="Xác nhận đối soát thất bại"
      description="Dòng tiền sẽ được đánh dấu là đối soát thất bại. Vui lòng nhập lý do."
    >
      <template #body>
        <UFormField
          label="Lý do thất bại"
          required
        >
          <UInput
            v-model="rejectReason"
            placeholder="Nhập lý do thất bại"
            :maxlength="500"
            class="w-full"
            autofocus
          />
        </UFormField>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Quay lại"
            color="neutral"
            variant="ghost"
            :disabled="isRejecting"
            @click="showRejectModal = false"
          />
          <UButton
            label="Xác nhận thất bại"
            icon="i-lucide-x"
            color="error"
            :loading="isRejecting"
            :disabled="!rejectReason.trim()"
            @click="submitReject"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
