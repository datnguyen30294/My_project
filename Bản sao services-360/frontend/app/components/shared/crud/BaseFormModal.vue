<script setup lang="ts">
interface Props {
  open: boolean
  mode: 'create' | 'edit'
  loading?: boolean
  /** Top-level error message shown as alert above the form (e.g. business rule violations). */
  errorMessage?: string | null
  /** Labels for modal title: { create: 'Thêm X', edit: 'Sửa X' } */
  titles: { create: string, edit: string }
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  errorMessage: null
})

const emit = defineEmits<{
  'update:open': [boolean]
  'submit': []
}>()

const modalTitle = computed(() =>
  props.mode === 'create' ? props.titles.create : props.titles.edit
)
</script>

<template>
  <UModal
    :open="open"
    :title="modalTitle"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div class="space-y-4">
        <UAlert
          v-if="errorMessage"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :description="errorMessage"
        />
        <slot />
      </div>
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
          color="primary"
          :icon="loading ? 'i-lucide-loader-circle' : 'i-lucide-check'"
          :label="loading ? 'Đang lưu...' : 'Lưu'"
          :disabled="loading"
          @click="emit('submit')"
        />
      </div>
    </template>
  </UModal>
</template>
