<script setup lang="ts">
import type { CashTransactionListResource } from '~/composables/api/useTreasury'

const props = defineProps<{
  transaction: CashTransactionListResource | null
  currentBalance: number
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const toast = useToast()

const reason = ref('')
const errors = ref<Record<string, string[]>>({})
const isSubmitting = ref(false)

watch(() => props.open, (val) => {
  if (val) {
    reason.value = ''
    errors.value = {}
  }
})

const balanceAfter = computed(() => {
  if (!props.transaction) return props.currentBalance
  const amount = parseFloat(props.transaction.amount)
  return props.transaction.direction.value === 'inflow'
    ? props.currentBalance - amount
    : props.currentBalance + amount
})

const isNegativeAfter = computed(() => balanceAfter.value < 0)

async function submit() {
  if (reason.value.trim().length < 5) {
    errors.value = { reason: ['Lý do xoá tối thiểu 5 ký tự'] }
    return
  }
  if (!props.transaction) return

  isSubmitting.value = true
  errors.value = {}
  try {
    await apiDeleteCashTransaction(props.transaction.id, reason.value.trim())
    toast.add({ title: 'Đã xoá giao dịch', color: 'success' })
    emit('success')
    emit('close')
  } catch (err) {
    const validationErrors = getApiValidationErrors(err)
    if (validationErrors) {
      errors.value = validationErrors
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Xoá thất bại'), color: 'error' })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    :open="open"
    title="Xoá giao dịch"
    @update:open="(v) => !v && emit('close')"
  >
    <template #body>
      <div
        v-if="transaction"
        class="space-y-4"
      >
        <!-- Transaction summary -->
        <div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500">Mã giao dịch</span>
            <span class="font-mono font-medium text-slate-800">{{ transaction.code }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Loại</span>
            <span
              class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring ring-inset"
              :class="transaction.direction.value === 'inflow'
                ? 'bg-slate-100 text-slate-900 ring-slate-300'
                : 'bg-rose-50 text-rose-800 ring-rose-200'"
            >
              {{ transaction.direction.label }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Số tiền</span>
            <span
              class="font-bold tabular-nums"
              :class="transaction.direction.value === 'inflow' ? 'text-slate-900' : 'text-rose-800'"
            >
              {{ transaction.direction.value === 'inflow' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Ngày</span>
            <span class="text-slate-700">{{ formatDate(transaction.transaction_date) }}</span>
          </div>
          <div
            v-if="transaction.note"
            class="flex justify-between"
          >
            <span class="text-slate-500">Ghi chú</span>
            <span class="text-slate-700 max-w-48 text-right">{{ transaction.note }}</span>
          </div>
        </div>

        <!-- Balance after -->
        <div class="rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500">Số dư hiện tại</span>
            <span
              class="font-bold tabular-nums"
              :class="currentBalance < 0 ? 'text-rose-800' : 'text-slate-900'"
            >
              {{ formatCurrency(String(currentBalance)) }}
            </span>
          </div>
          <div class="flex justify-between mt-1">
            <span class="text-slate-500">Số dư sau khi xoá</span>
            <span
              class="font-bold tabular-nums"
              :class="isNegativeAfter ? 'text-rose-800' : 'text-slate-900'"
            >
              {{ formatCurrency(String(balanceAfter)) }}
            </span>
          </div>
        </div>

        <UAlert
          v-if="isNegativeAfter"
          color="error"
          variant="subtle"
          :description="`Số dư sẽ chuyển âm: ${formatCurrency(String(balanceAfter))}`"
          icon="i-lucide-alert-triangle"
        />

        <!-- Reason input -->
        <UFormField
          label="Lý do xoá"
          required
          :error="errors.reason?.[0]"
        >
          <UTextarea
            v-model="reason"
            placeholder="Nhập lý do xoá (ít nhất 5 ký tự)..."
            :rows="3"
            class="w-full"
            :maxlength="500"
            @focus="errors.reason = []"
          />
          <template #hint>
            {{ reason.length }}/500
          </template>
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Huỷ"
          color="neutral"
          variant="outline"
          @click="emit('close')"
        />
        <UButton
          label="Xác nhận xoá"
          color="error"
          icon="i-lucide-trash-2"
          :loading="isSubmitting"
          :disabled="reason.trim().length < 5"
          @click="submit"
        />
      </div>
    </template>
  </UModal>
</template>
