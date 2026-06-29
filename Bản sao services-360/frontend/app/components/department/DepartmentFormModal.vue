<script setup lang="ts">
import type { DepartmentResource } from '#api/generated/laravel'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: DepartmentResource | null
  loading?: boolean
  apiErrors?: Record<string, string[]>
  lockedProjectId?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  item: null,
  loading: false,
  apiErrors: () => ({}),
  lockedProjectId: null
})

const emit = defineEmits<{
  'update:open': [boolean]
  'submit': [{ project_id: number | null, code: string, name: string, parent_id: number | null, description: string | null }]
}>()

const formState = reactive({
  project_id: null as number | null,
  code: '',
  name: '',
  parent_id: null as number | null,
  description: null as string | null
})

const parentExcludeIds = ref<number[]>([])

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    if (props.mode === 'edit' && props.item) {
      formState.project_id = props.lockedProjectId ?? props.item.project_id
      formState.code = props.item.code
      formState.name = props.item.name
      formState.parent_id = props.item.parent_id
      formState.description = props.item.description ?? null
      parentExcludeIds.value = await apiGetSelfAndDescendantIds(props.item.id)
    } else {
      formState.project_id = props.lockedProjectId ?? null
      formState.code = ''
      formState.name = ''
      formState.parent_id = null
      formState.description = null
      parentExcludeIds.value = []
    }
  }
)
</script>

<template>
  <SharedCrudBaseFormModal
    :open="open"
    :mode="mode"
    :loading="loading"
    :titles="{ create: 'Thêm phòng ban', edit: 'Sửa phòng ban' }"
    @update:open="emit('update:open', $event)"
    @submit="emit('submit', { ...formState })"
  >
    <UFormField
      label="Mã phòng ban"
      name="code"
      required
    >
      <UInput
        v-model="formState.code"
        placeholder="VD: KT, HC, BGD"
        class="w-full"
        :disabled="mode === 'edit'"
      />
      <SharedCrudFormFieldError :errors="apiErrors.code" />
    </UFormField>

    <UFormField
      label="Tên phòng ban"
      name="name"
      required
    >
      <UInput
        v-model="formState.name"
        placeholder="VD: Phòng Kỹ thuật"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.name" />
    </UFormField>

    <UFormField
      label="Phòng ban cha"
      name="parent_id"
    >
      <SharedDepartmentParentSelect
        v-model="formState.parent_id"
        :exclude-ids="parentExcludeIds"
        :project-id="lockedProjectId ?? formState.project_id"
      />
    </UFormField>

    <UFormField
      v-if="lockedProjectId == null"
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
        placeholder="Mô tả phòng ban (tuỳ chọn)"
        :rows="2"
        class="w-full"
      />
    </UFormField>
  </SharedCrudBaseFormModal>
</template>
