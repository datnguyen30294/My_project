<script setup lang="ts">
import type { QuoteListResource } from '#api/generated/laravel'

interface Props {
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [boolean]
  'created': [id: number]
}>()

const modelOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

const toast = useToast()

// ─── Available quotes ───
const { data: quotesData, status: quotesStatus } = useAvailableQuotes()
const availableQuotes = computed<QuoteListResource[]>(() => quotesData.value?.data ?? [])

const quoteOptions = computed(() =>
  availableQuotes.value.map(q => ({
    label: `${q.code} — ${q.og_ticket?.subject ?? '—'} — ${formatCurrency(q.total_amount)} (${q.lines_count} dòng)`,
    value: q.id
  }))
)

// ─── Form state ───
const selectedQuoteId = ref<number | undefined>(undefined)
const note = ref('')
const isSubmitting = ref(false)

const selectedQuote = computed(() =>
  availableQuotes.value.find(q => q.id === selectedQuoteId.value)
)

function resetForm() {
  selectedQuoteId.value = undefined
  note.value = ''
}

// ─── Submit ───
async function handleSubmit() {
  if (!selectedQuoteId.value) return
  isSubmitting.value = true
  try {
    const res = await apiCreateOrder({
      quote_id: selectedQuoteId.value,
      note: note.value || null
    })
    toast.add({ title: 'Tạo đơn hàng thành công', color: 'success' })
    emit('update:open', false)
    emit('created', res.data.id)
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
    title="Tạo đơn hàng từ báo giá"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <!-- Loading -->
        <div
          v-if="quotesStatus === 'pending'"
          class="flex flex-col gap-3"
        >
          <USkeleton class="h-10 w-full" />
          <USkeleton class="h-10 w-full" />
        </div>

        <!-- Empty: no available quotes -->
        <UAlert
          v-else-if="availableQuotes.length === 0"
          color="info"
          variant="subtle"
          icon="i-lucide-info"
          title="Không có báo giá đã chấp thuận nào khả dụng. Vui lòng tạo và duyệt báo giá trước."
        />

        <!-- Form -->
        <template v-else>
          <UFormField
            label="Báo giá"
            required
          >
            <USelect
              v-model="selectedQuoteId"
              :items="quoteOptions"
              placeholder="Chọn báo giá..."
              class="w-full"
            />
          </UFormField>

          <!-- Selected quote info -->
          <div
            v-if="selectedQuote"
            class="rounded-lg bg-slate-50 border border-slate-200 p-3 flex flex-col gap-1.5"
          >
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500">Ticket</span>
              <span class="font-medium text-slate-900">{{ selectedQuote.og_ticket?.subject ?? '—' }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500">Tổng tiền</span>
              <span class="font-bold text-slate-900">{{ formatCurrency(selectedQuote.total_amount) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500">Số dòng</span>
              <span class="font-medium text-slate-900">{{ selectedQuote.lines_count }}</span>
            </div>
          </div>

          <UFormField label="Ghi chú">
            <UTextarea
              v-model="note"
              placeholder="Ghi chú (tuỳ chọn)..."
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
          icon="i-lucide-plus"
          :disabled="!selectedQuoteId || availableQuotes.length === 0"
          :loading="isSubmitting"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
