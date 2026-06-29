<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  itemName?: string
  description?: string
  blockedMessage?: string | null
  loading?: boolean
  checking?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
}>()
</script>

<template>
  <UModal
    :open="open"
    :title="title"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div
        v-if="checking"
        class="flex items-center justify-center py-4"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-5 animate-spin text-[var(--ui-text-muted)]"
        />
        <span class="ml-2 text-sm text-[var(--ui-text-muted)]">Đang kiểm tra...</span>
      </div>
      <template v-else-if="blockedMessage">
        <UAlert
          color="error"
          :description="blockedMessage"
          icon="i-lucide-alert-circle"
        />
      </template>
      <template v-else>
        <p>
          Bạn có chắc muốn xoá
          <strong v-if="itemName">{{ itemName }}</strong>?
        </p>
        <p
          v-if="description"
          class="mt-2 text-sm text-[var(--ui-text-muted)]"
        >
          {{ description }}
        </p>
      </template>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Huỷ"
          @click="emit('update:open', false)"
        />
        <UButton
          color="error"
          :label="loading ? 'Đang xóa...' : 'Xóa'"
          :disabled="!!blockedMessage || checking || loading"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </UModal>
</template>
