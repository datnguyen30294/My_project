<script setup lang="ts">
import type { ApiClientResource, CreateApiClientRequestScopesItem } from '#api/generated/laravel'
import type { ApiScopeGroup } from '~/composables/api/useApiScopes'

const { data: scopeGroupsResponse } = usePlatformApiScopeList()
const scopeGroups = computed<ApiScopeGroup[]>(() => scopeGroupsResponse.value?.data ?? [])

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: ApiClientResource | null
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
  'submit': [{
    organization_id: string
    project_id: number
    name: string
    scopes: CreateApiClientRequestScopesItem[]
    is_active?: boolean
  }]
}>()

const formState = reactive({
  organization_id: null as string | null,
  project_id: null as number | null,
  name: '',
  scopes: [] as string[],
  is_active: true
})

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    if (props.mode === 'edit' && props.item) {
      formState.organization_id = props.item.organization_id
      formState.project_id = props.item.project_id
      formState.name = props.item.name
      formState.scopes = [...props.item.scopes]
      formState.is_active = props.item.is_active
    } else {
      formState.organization_id = null
      formState.project_id = null
      formState.name = ''
      formState.scopes = []
      formState.is_active = true
    }
  }
)

function toggleScope(value: string) {
  const idx = formState.scopes.indexOf(value)
  if (idx >= 0) {
    formState.scopes.splice(idx, 1)
  } else {
    formState.scopes.push(value)
  }
}

function isGroupAllSelected(group: ApiScopeGroup): boolean {
  return group.scopes.every(s => formState.scopes.includes(s.value))
}

function toggleGroup(group: ApiScopeGroup) {
  if (isGroupAllSelected(group)) {
    group.scopes.forEach((s) => {
      const idx = formState.scopes.indexOf(s.value)
      if (idx >= 0) formState.scopes.splice(idx, 1)
    })
  } else {
    group.scopes.forEach((s) => {
      if (!formState.scopes.includes(s.value)) formState.scopes.push(s.value)
    })
  }
}

function handleSubmit() {
  emit('submit', {
    organization_id: formState.organization_id!,
    project_id: formState.project_id!,
    name: formState.name,
    scopes: formState.scopes as CreateApiClientRequestScopesItem[],
    ...(props.mode === 'edit' ? { is_active: formState.is_active } : {})
  })
}
</script>

<template>
  <SharedCrudBaseFormModal
    :open="open"
    :mode="mode"
    :loading="loading"
    :titles="{ create: 'Tạo API Client', edit: 'Sửa API Client' }"
    @update:open="emit('update:open', $event)"
    @submit="handleSubmit"
  >
    <UFormField
      label="Tổ chức"
      name="organization_id"
      required
    >
      <SharedOrganizationSelect
        v-model="formState.organization_id"
        :disabled="mode === 'edit'"
      />
      <SharedCrudFormFieldError :errors="apiErrors.organization_id" />
    </UFormField>

    <UFormField
      label="Dự án"
      name="project_id"
      required
    >
      <SharedOrganizationProjectSelect
        v-model="formState.project_id"
        :organization-id="formState.organization_id"
        :disabled="mode === 'edit'"
      />
      <SharedCrudFormFieldError :errors="apiErrors.project_id" />
    </UFormField>

    <UFormField
      label="Tên ứng dụng"
      name="name"
      required
    >
      <UInput
        v-model="formState.name"
        placeholder="VD: ERP Connector, Mobile App"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.name" />
    </UFormField>

    <UFormField
      label="Quyền truy cập"
      name="scopes"
      required
    >
      <div class="rounded-lg border border-gray-200 divide-y divide-gray-200">
        <div
          v-for="group in scopeGroups"
          :key="group.key"
          class="px-4 py-3"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <UIcon
                :name="group.icon"
                class="text-gray-500 size-4"
              />
              <span class="text-sm font-medium text-gray-700">{{ group.label }}</span>
            </div>
            <button
              type="button"
              class="text-xs text-primary hover:underline"
              @click="toggleGroup(group)"
            >
              {{ isGroupAllSelected(group) ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}
            </button>
          </div>
          <div class="flex flex-wrap gap-2 ml-6">
            <button
              v-for="scope in group.scopes"
              :key="scope.value"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              :class="formState.scopes.includes(scope.value)
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'"
              @click="toggleScope(scope.value)"
            >
              <UIcon
                :name="formState.scopes.includes(scope.value) ? 'i-lucide-check' : 'i-lucide-plus'"
                class="size-3"
              />
              {{ scope.label }}
            </button>
          </div>
        </div>
      </div>
      <SharedCrudFormFieldError :errors="apiErrors.scopes" />
    </UFormField>

    <UFormField
      v-if="mode === 'edit'"
      label="Trạng thái"
      name="is_active"
    >
      <div class="flex items-center gap-2">
        <USwitch
          v-model="formState.is_active"
          color="success"
        />
        <span class="text-sm text-gray-500">{{ formState.is_active ? 'Đang hoạt động' : 'Đã tắt' }}</span>
      </div>
    </UFormField>
  </SharedCrudBaseFormModal>
</template>
