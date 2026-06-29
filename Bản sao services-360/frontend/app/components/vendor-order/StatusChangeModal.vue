<script setup lang="ts">
import type { VendorOrderDetail, VendorOrderStatusValue } from '~/composables/api/useVendorOrders'
import {
  apiUpdateVendorOrderStatus,
  VENDOR_ORDER_STATUS_OPTIONS
} from '~/composables/api/useVendorOrders'

interface Props {
  open: boolean
  partnerId: number | string
  orderId: number | string
  currentStatus: VendorOrderStatusValue
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'updated': [detail: VendorOrderDetail]
}>()

const toast = useToast()

const status = ref<VendorOrderStatusValue>(props.currentStatus)
const reason = ref('')
const submitting = ref(false)

const statusItems = computed(() =>
  VENDOR_ORDER_STATUS_OPTIONS.map(s => ({ label: s.label, value: s.value }))
)

watch(() => props.open, (open) => {
  if (open) {
    status.value = props.currentStatus
    reason.value = ''
  }
})

const isUnchanged = computed(() => status.value === props.currentStatus)

/** Đổi sang/khỏi "Hoàn thành" ảnh hưởng việc tính hoa hồng — cảnh báo. */
const showCommissionWarning = computed(
  () => status.value === 'completed' || props.currentStatus === 'completed'
)

async function submit(): Promise<void> {
  if (isUnchanged.value) return
  submitting.value = true

  try {
    const res = await apiUpdateVendorOrderStatus(props.partnerId, props.orderId, {
      status: status.value,
      reason: reason.value || null
    })
    toast.add({ title: 'Đã cập nhật trạng thái đơn', color: 'success', icon: 'i-lucide-check-circle' })
    emit('updated', res.data)
    emit('update:open', false)
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Cập nhật trạng thái thất bại'), color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal
    :open="open"
    title="Đổi trạng thái đơn"
    description="Cập nhật trạng thái đơn vendor. Lệnh được ghi sang resi_mart (chủ sở hữu đơn)."
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField label="Trạng thái mới">
          <USelect
            v-model="status"
            :items="statusItems"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="showCommissionWarning"
          color="warning"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="Ảnh hưởng hoa hồng"
          description="Hoa hồng chỉ tính cho đơn ở trạng thái Hoàn thành. Đổi sang/khỏi Hoàn thành sẽ làm hoa hồng bắt đầu hoặc ngừng áp dụng cho đơn này."
        />

        <UFormField
          label="Lý do"
          hint="Tuỳ chọn"
        >
          <UTextarea
            v-model="reason"
            :rows="2"
            placeholder="Lý do đổi trạng thái..."
            class="w-full"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          color="neutral"
          variant="ghost"
          label="Huỷ"
          @click="emit('update:open', false)"
        />
        <UButton
          color="primary"
          label="Lưu trạng thái"
          icon="i-lucide-save"
          :loading="submitting"
          :disabled="isUnchanged"
          @click="submit"
        />
      </div>
    </template>
  </UModal>
</template>
