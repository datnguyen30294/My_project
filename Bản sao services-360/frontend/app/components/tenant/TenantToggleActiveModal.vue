<script setup lang="ts">
interface Props {
  open: boolean
  tenantName?: string | null
  /** true = hành động kích hoạt lại, false = vô hiệu hoá */
  activating: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  tenantName: null,
  loading: false
})

const emit = defineEmits<{
  'update:open': [boolean]
  'confirm': []
}>()
</script>

<template>
  <UModal
    :open="open"
    :title="activating ? 'Kích hoạt lại công ty vận hành' : 'Vô hiệu hoá công ty vận hành'"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div class="space-y-3 text-sm text-slate-700">
        <p v-if="activating">
          Kích hoạt lại công ty
          <strong>{{ tenantName }}</strong>?
          Công ty sẽ có thể đăng nhập và vận hành trở lại bình thường.
        </p>
        <template v-else>
          <p>
            Vô hiệu hoá công ty
            <strong>{{ tenantName }}</strong>?
          </p>
          <UAlert
            color="warning"
            variant="subtle"
            icon="i-lucide-alert-triangle"
            description="Công ty sẽ không thể đăng nhập và vận hành. Dữ liệu lịch sử được giữ nguyên, có thể kích hoạt lại bất kỳ lúc nào."
          />
        </template>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          label="Huỷ"
          color="neutral"
          variant="ghost"
          :disabled="loading"
          @click="emit('update:open', false)"
        />
        <UButton
          :label="activating ? 'Kích hoạt lại' : 'Vô hiệu hoá'"
          :color="activating ? 'primary' : 'warning'"
          :loading="loading"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </UModal>
</template>
