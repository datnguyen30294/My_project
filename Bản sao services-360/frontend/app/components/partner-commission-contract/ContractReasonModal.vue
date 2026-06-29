<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  confirmLabel: string
  confirmColor?: 'primary' | 'error' | 'warning'
  warning?: string
  helpText?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  confirmColor: 'error',
  warning: undefined,
  helpText: undefined,
  loading: false
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': [reason: string]
}>()

const reason = ref('')

function handleClose(value: boolean): void {
  if (!value) {
    reason.value = ''
  }
  emit('update:open', value)
}

function handleConfirm(): void {
  if (!reason.value.trim()) return
  emit('confirm', reason.value.trim())
}
</script>

<template>
  <UModal
    :open="open"
    :title="title"
    @update:open="handleClose"
  >
    <template #body>
      <div class="space-y-4">
        <UAlert
          v-if="warning"
          color="error"
          variant="subtle"
          icon="i-lucide-alert-triangle"
          :description="warning"
        />

        <UFormField
          label="Lý do"
          required
          :help="helpText"
        >
          <UTextarea
            v-model="reason"
            :rows="4"
            placeholder="Nhập lý do..."
            class="w-full"
            :maxlength="1000"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Huỷ"
          @click="handleClose(false)"
        />
        <UButton
          :color="confirmColor"
          :label="loading ? 'Đang xử lý...' : confirmLabel"
          :disabled="!reason.trim() || loading"
          :loading="loading"
          @click="handleConfirm"
        />
      </div>
    </template>
  </UModal>
</template>
