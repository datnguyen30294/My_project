<script setup lang="ts">
import type { VendorActionType } from '~/composables/useVendorActions'
import { VENDOR_ACTION_META } from '~/composables/useVendorActions'

interface Props {
  open: boolean
  action: VendorActionType | null
  vendorName?: string | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  vendorName: null,
  loading: false
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
}>()

const meta = computed(() => (props.action ? VENDOR_ACTION_META[props.action] : null))
</script>

<template>
  <UModal
    :open="open"
    :title="meta?.title ?? ''"
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <template #body>
      <p class="text-sm text-slate-600">
        <span
          v-if="vendorName"
          class="font-medium text-slate-900"
        >{{ vendorName }} — </span>
        {{ meta?.description }}
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Huỷ"
          :disabled="loading"
          @click="emit('update:open', false)"
        />
        <UButton
          v-if="meta"
          :color="meta.confirmColor"
          :icon="meta.icon"
          :label="meta.confirmLabel"
          :loading="loading"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </UModal>
</template>
