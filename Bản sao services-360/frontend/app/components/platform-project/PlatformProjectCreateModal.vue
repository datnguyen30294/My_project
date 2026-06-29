<script setup lang="ts">
import type { CreatePlatformProjectPayload } from '~/composables/api/usePlatformProjects'
import { PROJECT_STATUS_OPTIONS, ProjectStatus } from '~/composables/api/usePlatformProjects'

interface Props {
  open: boolean
  loading?: boolean
  apiErrors?: Record<string, string[]>
  /** Lỗi nghiệp vụ cấp form (vd: tenant bị vô hiệu hoá). */
  errorMessage?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  apiErrors: () => ({}),
  errorMessage: null
})

const emit = defineEmits<{
  'update:open': [boolean]
  'submit': [CreatePlatformProjectPayload]
}>()

type ProjectStatusValue = (typeof ProjectStatus)[keyof typeof ProjectStatus]

const formState = reactive({
  organization_id: null as string | null,
  code: '',
  name: '',
  address: '',
  status: ProjectStatus.managing as ProjectStatusValue
})

watch(
  () => props.open,
  (open) => {
    if (open) {
      formState.organization_id = null
      formState.code = ''
      formState.name = ''
      formState.address = ''
      formState.status = ProjectStatus.managing
    }
  }
)

function handleSubmit() {
  if (!formState.organization_id) return
  emit('submit', {
    organization_id: formState.organization_id,
    code: formState.code.trim(),
    name: formState.name.trim(),
    address: formState.address.trim() || null,
    status: formState.status
  })
}
</script>

<template>
  <UModal
    :open="open"
    title="Thêm dự án"
    description="Tạo dự án mới và gán vào một công ty vận hành đang hoạt động."
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div class="space-y-4">
        <UAlert
          v-if="errorMessage"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :description="errorMessage"
        />

        <UFormField
          label="Công ty vận hành"
          name="organization_id"
          required
        >
          <SharedOrganizationSelect
            v-model="formState.organization_id"
            placeholder="Chọn công ty vận hành"
          />
          <SharedCrudFormFieldError :errors="apiErrors.organization_id" />
        </UFormField>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField
            label="Mã dự án"
            name="code"
            required
          >
            <UInput
              v-model="formState.code"
              placeholder="VD: DA-001"
              class="w-full"
            />
            <SharedCrudFormFieldError :errors="apiErrors.code" />
          </UFormField>

          <UFormField
            label="Trạng thái"
            name="status"
          >
            <USelect
              v-model="formState.status"
              :items="[...PROJECT_STATUS_OPTIONS]"
              value-key="value"
              label-key="label"
              class="w-full"
            />
            <SharedCrudFormFieldError :errors="apiErrors.status" />
          </UFormField>
        </div>

        <UFormField
          label="Tên dự án"
          name="name"
          required
        >
          <UInput
            v-model="formState.name"
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
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.address" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          color="neutral"
          variant="outline"
          label="Huỷ"
          :disabled="loading"
          @click="emit('update:open', false)"
        />
        <UButton
          color="primary"
          icon="i-lucide-plus"
          :label="loading ? 'Đang tạo...' : 'Tạo dự án'"
          :loading="loading"
          :disabled="!formState.organization_id || !formState.code.trim() || !formState.name.trim()"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
