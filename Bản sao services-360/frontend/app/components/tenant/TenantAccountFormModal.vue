<script setup lang="ts">
import type {
  TenantAccountResource,
  TenantAccountOptions200Data
} from '#api/generated/laravel'

export interface TenantAccountFormPayload {
  name: string
  email: string
  password: string
  department_ids: number[]
  job_title_id: number | undefined
  role_id: number | undefined
  is_active: boolean
}

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: TenantAccountResource | null
  options: TenantAccountOptions200Data
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
  'submit': [TenantAccountFormPayload]
}>()

const formState = reactive({
  name: '',
  email: '',
  password: '',
  department_ids: [] as number[],
  job_title_id: undefined as number | undefined,
  role_id: undefined as number | undefined,
  is_active: true
})

const showPassword = ref(false)

function resetForm() {
  formState.name = ''
  formState.email = ''
  formState.password = ''
  formState.department_ids = []
  formState.job_title_id = undefined
  formState.role_id = undefined
  formState.is_active = true
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    showPassword.value = false
    resetForm()
    if (props.mode === 'edit' && props.item) {
      formState.name = props.item.name
      formState.email = props.item.email
      formState.department_ids = (props.item.departments ?? []).map(d => d.id)
      formState.job_title_id = props.item.job_title?.id ?? undefined
      formState.role_id = props.item.role?.id ?? undefined
      formState.is_active = props.item.is_active
    }
  }
)

function handleSubmit() {
  emit('submit', {
    name: formState.name.trim(),
    email: formState.email.trim(),
    password: formState.password,
    department_ids: [...formState.department_ids],
    job_title_id: formState.job_title_id,
    role_id: formState.role_id,
    is_active: formState.is_active
  })
}
</script>

<template>
  <SharedCrudBaseFormModal
    :open="open"
    :mode="mode"
    :loading="loading"
    :titles="{ create: 'Thêm tài khoản', edit: 'Cập nhật tài khoản' }"
    @update:open="emit('update:open', $event)"
    @submit="handleSubmit"
  >
    <UFormField
      label="Họ tên"
      name="name"
      required
    >
      <UInput
        v-model="formState.name"
        placeholder="VD: Nguyễn Văn A"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.name" />
    </UFormField>

    <UFormField
      label="Email đăng nhập"
      name="email"
      required
    >
      <UInput
        v-model="formState.email"
        type="email"
        placeholder="admin@congty.vn"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.email" />
    </UFormField>

    <UFormField
      label="Mật khẩu"
      name="password"
      :required="mode === 'create'"
      :help="mode === 'edit' ? 'Để trống nếu không đổi mật khẩu.' : 'Tối thiểu 8 ký tự.'"
    >
      <div class="flex gap-2">
        <UInput
          v-model="formState.password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="mode === 'edit' ? 'Để trống = giữ nguyên' : 'Tối thiểu 8 ký tự'"
          class="flex-1"
        />
        <UButton
          :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          color="neutral"
          variant="outline"
          @click="showPassword = !showPassword"
        />
      </div>
      <SharedCrudFormFieldError :errors="apiErrors.password" />
    </UFormField>

    <UFormField
      label="Phòng ban"
      name="department_ids"
      required
    >
      <USelectMenu
        v-model="formState.department_ids"
        :items="options.departments"
        value-key="id"
        label-key="name"
        multiple
        placeholder="Chọn phòng ban..."
        :search-input="{ placeholder: 'Tìm phòng ban...' }"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.department_ids" />
    </UFormField>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UFormField
        label="Chức danh"
        name="job_title_id"
        required
      >
        <USelectMenu
          v-model="formState.job_title_id"
          :items="options.job_titles"
          value-key="id"
          label-key="name"
          placeholder="Chọn chức danh..."
          :search-input="{ placeholder: 'Tìm chức danh...' }"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.job_title_id" />
      </UFormField>

      <UFormField
        label="Vai trò"
        name="role_id"
        required
      >
        <USelectMenu
          v-model="formState.role_id"
          :items="options.roles"
          value-key="id"
          label-key="name"
          placeholder="Chọn vai trò..."
          :search-input="{ placeholder: 'Tìm vai trò...' }"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.role_id" />
      </UFormField>
    </div>

    <div class="flex items-center justify-between gap-4">
      <div>
        <div class="font-medium text-slate-900 text-sm">
          Trạng thái hoạt động
        </div>
        <div class="text-sm text-slate-500">
          Tắt để chặn tài khoản đăng nhập cổng vận hành.
        </div>
      </div>
      <USwitch v-model="formState.is_active" />
    </div>
  </SharedCrudBaseFormModal>
</template>
