<script setup lang="ts">
import type { AccountResource } from '#api/generated/laravel'

interface Props {
  open: boolean
  item?: AccountResource | null
  loading?: boolean
  apiErrors?: Record<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  item: null,
  loading: false,
  apiErrors: () => ({})
})
const emit = defineEmits<{
  'update:open': [boolean]
  'submit': [data: { password: string, password_confirmation: string }]
}>()

const formState = reactive({
  password: '',
  password_confirmation: ''
})

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    formState.password = ''
    formState.password_confirmation = ''
  }
)
</script>

<template>
  <UModal
    :open="open"
    title="Đổi mật khẩu"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <p
        v-if="item"
        class="text-sm text-[var(--ui-text-muted)] mb-4"
      >
        Đổi mật khẩu cho tài khoản <strong>{{ item.name }}</strong>
      </p>

      <div class="space-y-4">
        <UFormField
          label="Mật khẩu mới"
          name="password"
          required
        >
          <UInput
            v-model="formState.password"
            type="password"
            placeholder="Tối thiểu 8 ký tự"
            class="w-full"
            autocomplete="new-password"
          />
          <SharedCrudFormFieldError :errors="apiErrors.password" />
        </UFormField>

        <UFormField
          label="Xác nhận mật khẩu"
          name="password_confirmation"
          required
        >
          <UInput
            v-model="formState.password_confirmation"
            type="password"
            placeholder="Nhập lại mật khẩu"
            class="w-full"
            autocomplete="new-password"
          />
          <SharedCrudFormFieldError :errors="apiErrors.password_confirmation" />
        </UFormField>
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
          label="Đổi mật khẩu"
          icon="i-lucide-key"
          :loading="loading"
          @click="emit('submit', { ...formState })"
        />
      </div>
    </template>
  </UModal>
</template>
