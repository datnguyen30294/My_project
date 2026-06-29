<script setup lang="ts">
/**
 * Modal to edit unit_price (giá bán) and purchase_price (giá nhập) on an order line.
 * Used from the order detail page.
 */
interface LineRef {
  id: number
  name: string
  quantity: number
  unit: string
  unit_price: string | number
  purchase_price: string | number | null
}

interface Props {
  open: boolean
  line: LineRef | null
  loading?: boolean
  apiErrors?: Record<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  line: null,
  loading: false,
  apiErrors: () => ({})
})

const emit = defineEmits<{
  'update:open': [boolean]
  'submit': [data: { unit_price: number, purchase_price: number | null }]
}>()

const form = reactive({
  unit_price: 0,
  purchase_price: 0
})

const lineTotal = computed(() => form.unit_price * (props.line?.quantity ?? 0))

watch(() => props.open, (isOpen) => {
  if (!isOpen || !props.line) return
  form.unit_price = parseFloat(String(props.line.unit_price)) || 0
  form.purchase_price = props.line.purchase_price != null
    ? parseFloat(String(props.line.purchase_price)) || 0
    : 0
})

function handleSubmit() {
  emit('submit', {
    unit_price: form.unit_price,
    // Send null when user clears to 0 — 0 means "free" which is valid too, so only null when input was empty.
    // Here we treat 0 as "explicitly zero" and still send it. Use null only if user clears via separate action.
    purchase_price: form.purchase_price
  })
}
</script>

<template>
  <UModal
    :open="open"
    title="Sửa giá dòng đơn hàng"
    @update:open="emit('update:open', $event)"
  >
    <template
      v-if="line"
      #body
    >
      <div class="flex flex-col gap-4">
        <div class="rounded-lg bg-slate-50 px-4 py-3 text-sm space-y-1">
          <div class="flex justify-between gap-3">
            <span class="text-slate-500">Hạng mục</span>
            <span class="font-medium text-right">{{ line.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Số lượng</span>
            <span class="font-medium">{{ line.quantity }} {{ line.unit }}</span>
          </div>
        </div>

        <UFormField
          label="Giá nhập (đ)"
          name="purchase_price"
          help="Đơn giá nhập/gốc cho 1 đơn vị. Dùng để tính tiền ứng."
        >
          <SharedNumberInput
            v-model="form.purchase_price"
            :min="0"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.purchase_price" />
        </UFormField>

        <UFormField
          label="Giá bán (đ)"
          name="unit_price"
          required
        >
          <SharedNumberInput
            v-model="form.unit_price"
            :min="0"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.unit_price" />
        </UFormField>

        <div class="flex items-center justify-between bg-primary-50 rounded-lg px-4 py-2">
          <span class="text-sm text-slate-600">Thành tiền mới</span>
          <span class="font-bold text-slate-900 tabular-nums">{{ formatCurrency(lineTotal) }}</span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          label="Hủy"
          color="neutral"
          variant="ghost"
          @click="emit('update:open', false)"
        />
        <UButton
          label="Lưu"
          icon="i-lucide-check"
          color="primary"
          :loading="loading"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
