<script setup lang="ts">
import type { CustomerFormValues } from '~/components/customer/CustomerForm.vue'

interface CustomerEditTarget {
  full_name: string
  phone: string
  email?: string | null
  note?: string | null
  code?: string | null
}

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: CustomerEditTarget | null
  loading?: boolean
  apiErrors?: Record<string, string[]>
  errorMessage?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  item: null,
  loading: false,
  apiErrors: () => ({}),
  errorMessage: null
})

const emit = defineEmits<{
  'update:open': [boolean]
  'submit': [values: CustomerFormValues]
}>()

const title = computed(() =>
  props.mode === 'create' ? 'Thêm khách hàng' : 'Sửa khách hàng'
)

const initialValues = computed<Partial<CustomerFormValues>>(() => {
  if (props.mode === 'edit' && props.item) {
    return {
      full_name: props.item.full_name,
      phone: props.item.phone,
      email: props.item.email ?? '',
      note: props.item.note ?? ''
    }
  }
  return {}
})
</script>

<template>
  <UModal
    :open="open"
    :title="title"
    :dismissible="!loading"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <CustomerForm
        :mode="mode"
        :code="item?.code ?? null"
        :initial-values="initialValues"
        :loading="loading"
        :api-errors="apiErrors"
        :error-message="errorMessage"
        @submit="emit('submit', $event)"
        @cancel="emit('update:open', false)"
      />
    </template>
  </UModal>
</template>
