<script setup lang="ts">
import type { JobTitleResource } from '#api/generated/laravel'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: JobTitleResource | null
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
  'submit': [{ project_id: number | null, code: string, name: string, description: string | null }]
}>()

const formState = reactive({
  project_id: null as number | null,
  code: '',
  name: '',
  description: null as string | null
})

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    if (props.mode === 'edit' && props.item) {
      formState.project_id = props.item.project_id
      formState.code = props.item.code
      formState.name = props.item.name
      formState.description = props.item.description ?? null
    } else {
      formState.project_id = null
      formState.code = ''
      formState.name = ''
      formState.description = null
    }
  }
)
</script>

<template>
  <SharedCrudBaseFormModal
    :open="open"
    :mode="mode"
    :loading="loading"
    :titles="{ create: 'Thêm chức danh', edit: 'Sửa chức danh' }"
    @update:open="emit('update:open', $event)"
    @submit="emit('submit', { ...formState })"
  >
    <UFormField
      label="Mã"
      name="code"
      required
    >
      <UInput
        v-model="formState.code"
        placeholder="VD: TP, NV, KS"
        class="w-full"
        :disabled="mode === 'edit'"
      />
      <SharedCrudFormFieldError :errors="apiErrors.code" />
    </UFormField>

    <UFormField
      label="Tên"
      name="name"
      required
    >
      <UInput
        v-model="formState.name"
        placeholder="VD: Trưởng phòng"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.name" />
    </UFormField>

    <UFormField
      label="Thuộc dự án"
      name="project_id"
    >
      <SharedProjectSelect
        v-model="formState.project_id"
        placeholder="Trụ sở chính"
      />
      <SharedCrudFormFieldError :errors="apiErrors.project_id" />
    </UFormField>

    <UFormField
      label="Mô tả"
      name="description"
    >
      <UTextarea
        v-model="formState.description"
        placeholder="Mô tả chức danh (tuỳ chọn)"
        :rows="2"
        class="w-full"
      />
    </UFormField>
  </SharedCrudBaseFormModal>
</template>
