<script setup lang="ts">
import type { ServiceCategoryResource } from '#api/generated/laravel'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: ServiceCategoryResource | null
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
  'submit': [data: {
    name: string
    code: string
    description: string | null
    sort_order: number | null
    status?: string
  }]
}>()

const statusOptions = [
  { label: 'Đang sử dụng', value: 'active' },
  { label: 'Ngưng sử dụng', value: 'inactive' }
]

const formState = reactive({
  name: '',
  code: '',
  description: null as string | null,
  sort_order: null as number | null,
  status: 'active'
})

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    if (props.mode === 'edit' && props.item) {
      formState.name = props.item.name
      formState.code = props.item.code
      formState.description = props.item.description || null
      formState.sort_order = props.item.sort_order
      formState.status = props.item.status.value
    } else {
      formState.name = ''
      formState.code = ''
      formState.description = null
      formState.sort_order = null
      formState.status = 'active'
    }
  }
)
</script>

<template>
  <SharedCrudBaseFormModal
    :open="open"
    :mode="mode"
    :loading="loading"
    :titles="{ create: 'Thêm loại dịch vụ', edit: 'Sửa loại dịch vụ' }"
    @update:open="emit('update:open', $event)"
    @submit="emit('submit', { ...formState })"
  >
    <UFormField
      label="Mã loại dịch vụ"
      name="code"
      required
    >
      <UInput
        v-model="formState.code"
        placeholder="VD: SC-001"
        class="w-full"
        :disabled="mode === 'edit'"
      />
      <SharedCrudFormFieldError :errors="apiErrors.code" />
    </UFormField>

    <UFormField
      label="Tên loại dịch vụ"
      name="name"
      required
    >
      <UInput
        v-model="formState.name"
        placeholder="VD: Dịch vụ vệ sinh"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.name" />
    </UFormField>

    <UFormField
      label="Mô tả"
      name="description"
    >
      <UTextarea
        v-model="formState.description"
        placeholder="Mô tả loại dịch vụ"
        :rows="2"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.description" />
    </UFormField>

    <UFormField
      label="Thứ tự sắp xếp"
      name="sort_order"
    >
      <UInput
        v-model.number="formState.sort_order"
        type="number"
        placeholder="VD: 0"
        :min="0"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.sort_order" />
    </UFormField>

    <UFormField
      v-if="mode === 'edit'"
      label="Trạng thái"
      name="status"
    >
      <USelect
        v-model="formState.status"
        :items="statusOptions"
        value-key="value"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.status" />
    </UFormField>
  </SharedCrudBaseFormModal>
</template>
