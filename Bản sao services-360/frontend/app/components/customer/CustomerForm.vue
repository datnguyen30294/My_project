<script setup lang="ts">
export interface CustomerFormValues {
  full_name: string
  phone: string
  email: string
  note: string
}

interface Props {
  mode: 'create' | 'edit'
  initialValues?: Partial<CustomerFormValues>
  /** Customer code to show readonly (edit mode) */
  code?: string | null
  loading?: boolean
  apiErrors?: Record<string, string[]>
  errorMessage?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  initialValues: () => ({}),
  code: null,
  loading: false,
  apiErrors: () => ({}),
  errorMessage: null
})

const emit = defineEmits<{
  submit: [values: CustomerFormValues]
  cancel: []
}>()

const form = reactive<CustomerFormValues>({
  full_name: props.initialValues.full_name ?? '',
  phone: props.initialValues.phone ?? '',
  email: props.initialValues.email ?? '',
  note: props.initialValues.note ?? ''
})

watch(
  () => props.initialValues,
  (next) => {
    form.full_name = next.full_name ?? ''
    form.phone = next.phone ?? ''
    form.email = next.email ?? ''
    form.note = next.note ?? ''
  },
  { deep: true }
)

function onSubmit() {
  emit('submit', {
    full_name: form.full_name.trim(),
    phone: stripPhone(form.phone),
    email: form.email.trim(),
    note: form.note.trim()
  })
}
</script>

<template>
  <form
    class="flex flex-col gap-5"
    @submit.prevent="onSubmit"
  >
    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :description="errorMessage"
    />

    <div
      v-if="mode === 'edit' && code"
      class="text-sm text-[var(--ui-text-muted)]"
    >
      Mã khách hàng: <span class="font-mono font-medium text-slate-700">{{ code }}</span>
    </div>

    <UFormField
      label="Họ tên"
      required
      :error="apiErrors.full_name?.[0]"
    >
      <UInput
        v-model="form.full_name"
        placeholder="Nguyễn Văn A"
        maxlength="255"
        class="w-full"
        autofocus
      />
    </UFormField>

    <UFormField
      label="Số điện thoại"
      required
      :error="apiErrors.phone?.[0]"
      :help="mode === 'create' ? 'Dùng để tra cứu — mỗi SĐT một khách hàng.' : undefined"
    >
      <UInput
        v-model="form.phone"
        placeholder="0912345678"
        maxlength="20"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Email"
      :error="apiErrors.email?.[0]"
    >
      <UInput
        v-model="form.email"
        type="email"
        placeholder="khachhang@example.com"
        maxlength="255"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Ghi chú"
      :error="apiErrors.note?.[0]"
    >
      <UTextarea
        v-model="form.note"
        placeholder="Ghi chú về khách hàng (tuỳ chọn)"
        :rows="4"
        maxlength="2000"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end gap-2 pt-2">
      <UButton
        color="neutral"
        variant="outline"
        label="Huỷ"
        :disabled="loading"
        @click="emit('cancel')"
      />
      <UButton
        type="submit"
        color="primary"
        :icon="loading ? 'i-lucide-loader-circle' : 'i-lucide-check'"
        :label="loading ? 'Đang lưu...' : 'Lưu'"
        :loading="loading"
        :disabled="loading"
      />
    </div>
  </form>
</template>
