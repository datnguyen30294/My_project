<script setup lang="ts">
/**
 * Modal hiển thị QR VietQR để chuyển khoản cho nhân sự.
 * Dùng chung cho cả luồng hoàn tiền ứng và chi trả hoa hồng.
 */
export interface BankInfoPayload {
  bin: string
  label: string
  account_number: string
  account_name: string
}

interface Props {
  open: boolean
  bank: BankInfoPayload | null
  amount: number
  /** Nội dung chuyển khoản — sẽ được sanitize trước khi đưa vào QR. */
  description: string
  /** Tên người nhận để hiển thị trên header (VD: Nguyễn Văn A). */
  recipientName?: string
  /** Tiêu đề modal. */
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  recipientName: '',
  title: 'QR chuyển khoản'
})

defineEmits<{
  'update:open': [boolean]
}>()

const headerTitle = computed(() =>
  props.recipientName ? `${props.title} — ${props.recipientName}` : props.title
)

const sanitizedDescription = computed(() => sanitizeQrDescription(props.description))

const qrPayload = computed(() => {
  if (!props.bank) return ''
  return buildVietQrPayload({
    bankBin: props.bank.bin,
    accountNumber: props.bank.account_number,
    amount: props.amount,
    description: sanitizedDescription.value
  })
})
</script>

<template>
  <UModal
    :open="open"
    :title="headerTitle"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <div
        v-if="!bank"
        class="flex flex-col items-center gap-3 py-8 text-center"
      >
        <UIcon
          name="i-lucide-alert-triangle"
          class="size-10 text-amber-400"
        />
        <p class="text-sm font-medium text-slate-700">
          Nhân sự chưa có thông tin ngân hàng
        </p>
        <p class="text-xs text-slate-500 max-w-xs">
          Vui lòng cập nhật số tài khoản và mã BIN VietQR trong hồ sơ tài khoản để sinh QR.
        </p>
      </div>

      <div
        v-else
        class="flex flex-col items-center gap-4"
      >
        <div class="w-full rounded-lg bg-slate-50 px-4 py-3 text-sm space-y-1.5">
          <div class="flex justify-between">
            <span class="text-slate-500">Ngân hàng</span>
            <span class="font-medium">{{ bank.label || bank.bin }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Số TK</span>
            <span class="font-mono font-medium">{{ bank.account_number }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Chủ TK</span>
            <span class="font-medium uppercase">{{ bank.account_name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Số tiền</span>
            <span class="font-semibold text-amber-600 tabular-nums">{{ formatCurrency(amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Nội dung CK</span>
            <span class="font-mono text-xs text-right max-w-[60%] break-all">{{ sanitizedDescription }}</span>
          </div>
        </div>

        <SharedQrCode
          :value="qrPayload"
          :size="240"
          :file-name="`qr-${bank.account_number}.png`"
        />

        <p class="text-xs text-slate-400 text-center max-w-xs">
          Quét QR bằng ứng dụng ngân hàng (VietQR) để chuyển khoản nhanh.
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end w-full">
        <UButton
          label="Đóng"
          color="neutral"
          variant="ghost"
          @click="$emit('update:open', false)"
        />
      </div>
    </template>
  </UModal>
</template>
