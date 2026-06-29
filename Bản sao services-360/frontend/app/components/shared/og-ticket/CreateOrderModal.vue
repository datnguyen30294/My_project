<script setup lang="ts">
import type { QuoteDetailResource } from '#api/generated/laravel'

interface Props {
  open: boolean
  ogTicketSubject: string
  ogTicketCode: string | null
  quote: QuoteDetailResource | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [boolean]
  'created': []
}>()

const modelOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

const toast = useToast()
const note = ref('')
const isSubmitting = ref(false)

function resetForm() {
  note.value = ''
}

async function handleSubmit() {
  if (!props.quote) return
  isSubmitting.value = true
  try {
    await apiCreateOrder({
      quote_id: props.quote.id,
      note: note.value || null
    })
    toast.add({ title: 'Tạo đơn hàng thành công', color: 'success' })
    emit('update:open', false)
    emit('created')
    resetForm()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Tạo đơn hàng thất bại'), color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

function handleClose() {
  emit('update:open', false)
  resetForm()
}
</script>

<template>
  <UModal
    v-model:open="modelOpen"
    title="Tạo đơn hàng"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          v-if="!quote"
          color="warning"
          variant="subtle"
          icon="i-lucide-alert-triangle"
          title="Không có báo giá active đã chấp thuận."
        />

        <template v-else>
          <!-- OG Ticket info -->
          <div class="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              OG Ticket
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500">Tiêu đề</span>
                <span class="font-medium text-slate-900 text-right max-w-[60%] truncate">{{ ogTicketSubject }}</span>
              </div>
              <div
                v-if="ogTicketCode"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-slate-500">Mã ticket</span>
                <span class="font-mono font-semibold text-slate-700">{{ ogTicketCode }}</span>
              </div>
            </div>
          </div>

          <!-- Quote info -->
          <div class="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Báo giá
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500">Mã báo giá</span>
                <span class="font-mono font-semibold text-slate-700">{{ quote.code }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500">Trạng thái</span>
                <UBadge
                  :label="quote.status.label"
                  :color="quoteStatusColor(quote.status.value)"
                  variant="subtle"
                  size="xs"
                />
              </div>
            </div>

            <!-- Quote lines -->
            <USeparator class="my-2" />
            <div class="flex flex-col gap-1">
              <div
                v-for="line in quote.lines"
                :key="line.id"
                class="flex items-center justify-between text-xs"
              >
                <span class="text-slate-600 truncate max-w-[50%]">{{ line.name }}</span>
                <span class="text-slate-500">
                  {{ line.quantity }} {{ line.unit }} &times; {{ formatCurrency(line.unit_price) }}
                  = <span class="font-medium text-slate-700">{{ formatCurrency(line.line_amount) }}</span>
                </span>
              </div>
            </div>

            <!-- Total -->
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
              <span class="text-sm font-medium text-slate-600">Tổng tiền</span>
              <span class="text-sm font-bold text-slate-900">{{ formatCurrency(quote.total_amount) }}</span>
            </div>
          </div>

          <!-- Note -->
          <UFormField label="Ghi chú đơn hàng">
            <UTextarea
              v-model="note"
              placeholder="Ghi chú (không bắt buộc)..."
              :rows="3"
              class="w-full"
            />
          </UFormField>
        </template>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          label="Hủy"
          color="neutral"
          variant="ghost"
          @click="handleClose"
        />
        <UButton
          label="Tạo đơn hàng"
          color="primary"
          icon="i-lucide-shopping-cart"
          :disabled="!quote"
          :loading="isSubmitting"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
