<script setup lang="ts">
import type { ProjectResource } from '#api/generated/laravel'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: ProjectResource | null
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
  'submit': [{ code: string, name: string, address: string | null, status: string }]
}>()

const statusOptions = [
  { label: 'Đang quản lý', value: 'managing' },
  { label: 'Đã dừng', value: 'stopped' }
]

const formState = reactive({
  code: '',
  name: '',
  address: null as string | null,
  status: 'managing'
})

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    if (props.mode === 'edit' && props.item) {
      formState.code = props.item.code
      formState.name = props.item.name
      formState.address = props.item.address ?? null
      formState.status = props.item.status.value
    } else {
      formState.code = ''
      formState.name = ''
      formState.address = null
      formState.status = 'managing'
    }
  }
)
</script>

<template>
  <SharedCrudBaseFormModal
    :open="open"
    :mode="mode"
    :loading="loading"
    :titles="{ create: 'Thêm dự án', edit: 'Sửa dự án' }"
    @update:open="emit('update:open', $event)"
    @submit="emit('submit', { ...formState })"
  >
    <UFormField
      label="Mã dự án"
      name="code"
      required
    >
      <UInput
        v-model="formState.code"
        placeholder="VD: DA01, KDT02"
        class="w-full"
        :disabled="mode === 'edit'"
      />
      <SharedCrudFormFieldError :errors="apiErrors.code" />
    </UFormField>

    <UFormField
      label="Tên dự án"
      name="name"
      required
    >
      <UInput
        v-model="formState.name"
        placeholder="VD: Khu đô thị Vinhomes"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.name" />
    </UFormField>

    <UFormField
      label="Địa chỉ"
      name="address"
    >
      <UInput
        v-model="formState.address"
        placeholder="Nhập địa chỉ dự án (tuỳ chọn)"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.address" />
    </UFormField>

    <UFormField
      label="Trạng thái"
      name="status"
      required
    >
      <USelect
        v-model="formState.status"
        :items="statusOptions"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.status" />
    </UFormField>
  </SharedCrudBaseFormModal>
</template>
