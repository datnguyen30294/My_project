<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type { CashAccountResource } from '~/composables/api/useTreasury'

const props = defineProps<{
  account: CashAccountResource
  currentBalance: number
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const toast = useToast()

const form = reactive({
  amount: null as number | null,
  transaction_date: new Date().toISOString().slice(0, 10),
  note: ''
})
const errors = ref<Record<string, string[]>>({})
const isSubmitting = ref(false)

const dateValue = ref<Date>(new Date())

watch(() => props.open, (val) => {
  if (val) {
    form.amount = null
    form.transaction_date = new Date().toISOString().slice(0, 10)
    form.note = ''
    errors.value = {}
    dateValue.value = new Date()
  }
})

watch(dateValue, (val) => {
  if (val) {
    const d = new Date(val)
    form.transaction_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }
})

const balanceAfter = computed(() => {
  if (!form.amount) return props.currentBalance
  return props.currentBalance - form.amount
})

const isNegativeAfter = computed(() => balanceAfter.value < 0)

const canSubmit = computed(() =>
  !!form.amount && form.amount > 0 && !isNegativeAfter.value
)

async function submit() {
  if (!form.amount || form.amount <= 0) {
    errors.value = { amount: ['Số tiền phải lớn hơn 0'] }
    return
  }
  if (isNegativeAfter.value) {
    errors.value = { amount: ['Số tiền rút vượt quá số dư hiện tại'] }
    return
  }
  if (!form.transaction_date) {
    errors.value = { transaction_date: ['Vui lòng chọn ngày giao dịch'] }
    return
  }

  isSubmitting.value = true
  errors.value = {}
  try {
    await apiManualWithdraw({
      cash_account_id: Number(props.account.id),
      amount: form.amount,
      transaction_date: form.transaction_date,
      note: form.note || null
    })
    toast.add({ title: `Đã rút ${formatCurrency(String(form.amount))} khỏi quỹ`, color: 'success' })
    emit('success')
    emit('close')
  } catch (err) {
    const validationErrors = getApiValidationErrors(err)
    if (validationErrors) {
      errors.value = validationErrors
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Rút tiền thất bại'), color: 'error' })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    :open="open"
    title="Rút tiền khỏi quỹ"
    @update:open="(v) => !v && emit('close')"
  >
    <template #body>
      <div class="space-y-4">
        <!-- Account readonly -->
        <UFormField label="Tài khoản quỹ">
          <UInput
            :model-value="account.name"
            disabled
            class="w-full"
          />
        </UFormField>

        <!-- Current balance info -->
        <div class="rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <span class="text-slate-500">Số dư hiện tại:</span>
          <span
            class="ml-2 font-bold tabular-nums"
            :class="currentBalance < 0 ? 'text-rose-800' : 'text-slate-900'"
          >
            {{ formatCurrency(String(currentBalance)) }}
          </span>
        </div>

        <!-- Amount -->
        <UFormField
          label="Số tiền (đ)"
          required
          :error="errors.amount?.[0]"
        >
          <SharedNumberInput
            v-model="form.amount"
            :min="1"
            placeholder="Nhập số tiền cần rút..."
            class="w-full"
            @focus="errors.amount = []"
          />
        </UFormField>

        <!-- Live balance after -->
        <div v-if="form.amount && form.amount > 0">
          <UAlert
            v-if="isNegativeAfter"
            color="error"
            variant="subtle"
            title="Không đủ số dư"
            :description="`Số tiền rút (${formatCurrency(String(form.amount))}) vượt quá số dư hiện tại (${formatCurrency(String(currentBalance))}). Không thể rút âm.`"
            icon="i-lucide-alert-triangle"
          />
          <div
            v-else
            class="rounded-lg bg-slate-50 px-4 py-3 text-sm"
          >
            <span class="text-slate-500">Số dư sau khi rút:</span>
            <span class="ml-2 font-bold tabular-nums text-slate-900">
              {{ formatCurrency(String(balanceAfter)) }}
            </span>
          </div>
        </div>

        <!-- Date -->
        <UFormField
          label="Ngày giao dịch"
          required
          :error="errors.transaction_date?.[0]"
        >
          <VueDatePicker
            v-model="dateValue"
            :max-date="new Date()"
            format="dd/MM/yyyy"
            auto-apply
            :time-config="{ enableTimePicker: false }"
          />
        </UFormField>

        <!-- Note -->
        <UFormField
          label="Ghi chú"
          :error="errors.note?.[0]"
        >
          <UTextarea
            v-model="form.note"
            placeholder="Ghi chú (tùy chọn)..."
            :rows="3"
            class="w-full"
            :maxlength="1000"
          />
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
          label="Xác nhận rút"
          icon="i-lucide-minus"
          variant="solid"
          class="bg-rose-800 text-white hover:bg-rose-900 active:bg-rose-900 focus-visible:outline-rose-800 disabled:bg-rose-800"
          :loading="isSubmitting"
          :disabled="!canSubmit"
          @click="submit"
        />
      </div>
    </template>
  </UModal>
</template>
