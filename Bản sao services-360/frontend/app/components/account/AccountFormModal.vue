<script setup lang="ts">
import type { AccountResource } from '#api/generated/laravel'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
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
  'submit': [data: {
    email: string
    name: string
    employee_code: string
    gender: string | undefined
    department_ids: number[]
    job_title_id: number | null
    role_id: number | null
    project_ids: number[]
    is_active: boolean
    password: string
    bank_bin: string
    bank_label: string
    bank_account_number: string
    bank_account_name: string
    capability_rating: number | null
  }]
  'avatar-changed': []
}>()

const genderOptions = [
  { label: 'Nam', value: 'male' },
  { label: 'Nữ', value: 'female' },
  { label: 'Khác', value: 'other' }
]

const bankOptions = VIETNAM_BANKS.map(b => ({
  label: `${b.shortName} — ${b.name}`,
  value: b.bin
}))

const formState = reactive({
  email: '',
  name: '',
  employee_code: '',
  gender: undefined as string | undefined,
  department_ids: [] as number[],
  job_title_id: null as number | null,
  role_id: null as number | null,
  project_ids: [] as number[],
  is_active: true,
  password: '',
  bank_bin: '',
  bank_label: '',
  bank_account_number: '',
  bank_account_name: '',
  capability_rating: null as number | null
})

// Auto-fill bank_label when BIN is selected
watch(() => formState.bank_bin, (bin) => {
  const bank = findBankByBin(bin)
  if (bank) {
    formState.bank_label = bank.shortName
  }
})

const showPassword = ref(false)

function generatePassword(length = 16): void {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  formState.password = Array.from(array, byte => chars[byte % chars.length]).join('')
  showPassword.value = true
}

// --- Reset form when modal opens ---
const toast = useToast()
const { user, fetchUser } = useAuth()
const isAvatarLoading = ref(false)

function isCurrentUser(): boolean {
  return !!props.item && !!user.value && props.item.id === user.value.id
}

async function handleAvatarUpload(file: File) {
  if (!props.item) return
  isAvatarLoading.value = true
  try {
    await apiUploadAccountAvatar(props.item.id, file)
    toast.add({ title: 'Cập nhật ảnh đại diện thành công', color: 'success' })
    emit('avatar-changed')
    if (isCurrentUser()) await fetchUser()
  } catch {
    toast.add({ title: 'Tải ảnh lên thất bại', color: 'error' })
  } finally {
    isAvatarLoading.value = false
  }
}

async function handleAvatarDelete() {
  if (!props.item) return
  isAvatarLoading.value = true
  try {
    await apiDeleteAccountAvatar(props.item.id)
    toast.add({ title: 'Xóa ảnh đại diện thành công', color: 'success' })
    emit('avatar-changed')
    if (isCurrentUser()) await fetchUser()
  } catch {
    toast.add({ title: 'Xóa ảnh thất bại', color: 'error' })
  } finally {
    isAvatarLoading.value = false
  }
}

// --- Auto-select default role when department + job title are both set ---
const isInitializing = ref(false)
const departmentLabel = ref<string | null>(null)
const jobTitleLabel = ref<string | null>(null)

async function autoSelectRole() {
  if (isInitializing.value) return
  if (!departmentLabel.value || !jobTitleLabel.value) return

  try {
    const searchTerm = `${jobTitleLabel.value}-${departmentLabel.value}`
    const rolesRes = await apiSearchRoles(searchTerm)
    const firstRole = rolesRes.data?.[0]
    if (firstRole) {
      formState.role_id = firstRole.id
    }
  } catch {
    // Silently ignore — user can still pick manually
  }
}

function onDepartmentFirstLabelChange(label: string | null) {
  departmentLabel.value = label
  autoSelectRole()
}

function onJobTitleLabelChange(label: string | null) {
  jobTitleLabel.value = label
  autoSelectRole()
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    isInitializing.value = true
    showPassword.value = false
    departmentLabel.value = null
    jobTitleLabel.value = null
    if (props.mode === 'edit' && props.item) {
      formState.email = props.item.email
      formState.name = props.item.name
      formState.employee_code = props.item.employee_code ?? ''
      formState.gender = props.item.gender?.value ?? undefined
      formState.department_ids = (props.item.departments ?? []).map(d => d.id)
      formState.job_title_id = props.item.job_title?.id ?? null
      formState.role_id = props.item.role?.id ?? null
      formState.project_ids = (props.item.projects as unknown as Array<{ id: number, name: string }>)?.map(p => p.id) ?? []
      formState.is_active = Boolean(props.item.is_active)
      formState.password = ''
      formState.bank_bin = props.item.bank_info?.bin ?? ''
      formState.bank_label = props.item.bank_info?.label ?? ''
      formState.bank_account_number = props.item.bank_info?.account_number ?? ''
      formState.bank_account_name = props.item.bank_info?.account_name ?? ''
      formState.capability_rating = props.item.capability_rating ?? null
    } else {
      formState.email = ''
      formState.name = ''
      formState.employee_code = ''
      formState.gender = undefined
      formState.department_ids = []
      formState.job_title_id = null
      formState.role_id = null
      formState.project_ids = []
      formState.is_active = true
      formState.password = ''
      formState.bank_bin = ''
      formState.bank_label = ''
      formState.bank_account_number = ''
      formState.bank_account_name = ''
      formState.capability_rating = null
    }
    nextTick(() => {
      isInitializing.value = false
    })
  }
)
</script>

<template>
  <SharedCrudBaseFormModal
    :open="open"
    :mode="mode"
    :loading="loading"
    :titles="{ create: 'Thêm tài khoản', edit: 'Sửa tài khoản' }"
    @update:open="emit('update:open', $event)"
    @submit="emit('submit', { ...formState })"
  >
    <!-- Avatar (chỉ hiện khi sửa) -->
    <div v-if="mode === 'edit' && item">
      <SharedAvatarUpload
        :current-url="item.avatar_url"
        :alt="item.name"
        :loading="isAvatarLoading"
        @upload="handleAvatarUpload"
        @delete="handleAvatarDelete"
      />
    </div>

    <UFormField
      label="Email"
      name="email"
      required
    >
      <UInput
        v-model="formState.email"
        type="email"
        placeholder="VD: nguyenvana@company.com"
        class="w-full"
        :disabled="mode === 'edit'"
        autocomplete="off"
      />
      <SharedCrudFormFieldError :errors="apiErrors.email" />
    </UFormField>

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
      label="Mã nhân viên"
      name="employee_code"
      required
    >
      <UInput
        v-model="formState.employee_code"
        placeholder="VD: NV001"
        class="w-full"
        :disabled="mode === 'edit'"
      />
      <SharedCrudFormFieldError :errors="apiErrors.employee_code" />
    </UFormField>

    <UFormField
      label="Giới tính"
      name="gender"
    >
      <USelect
        v-model="formState.gender"
        :items="genderOptions"
        placeholder="Chọn giới tính"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.gender" />
    </UFormField>

    <UFormField
      label="Phòng ban"
      name="department_ids"
      required
    >
      <SharedDepartmentMultiSelect
        v-model="formState.department_ids"
        @update:first-label="onDepartmentFirstLabelChange"
      />
      <SharedCrudFormFieldError :errors="apiErrors.department_ids" />
    </UFormField>

    <UFormField
      label="Chức danh"
      name="job_title_id"
      required
    >
      <SharedJobTitleSelect
        v-model="formState.job_title_id"
        @update:label="onJobTitleLabelChange"
      />
      <SharedCrudFormFieldError :errors="apiErrors.job_title_id" />
    </UFormField>

    <UFormField
      label="Role"
      name="role_id"
      required
    >
      <SharedRoleSelect v-model="formState.role_id" />
      <SharedCrudFormFieldError :errors="apiErrors.role_id" />
    </UFormField>

    <UFormField
      label="Dự án"
      name="project_ids"
    >
      <SharedProjectMultiSelect v-model="formState.project_ids" />
      <SharedCrudFormFieldError :errors="apiErrors.project_ids" />
    </UFormField>

    <UFormField
      label="Trạng thái"
      name="is_active"
    >
      <USwitch
        v-model="formState.is_active"
        color="success"
        label="Hoạt động"
      />
    </UFormField>

    <UFormField
      label="Năng lực (1–10)"
      name="capability_rating"
    >
      <div class="flex items-center gap-3">
        <UInput
          v-model="formState.capability_rating"
          type="number"
          :min="1"
          :max="10"
          placeholder="VD: 7"
          class="w-28"
          :ui="{ base: 'tabular-nums' }"
        />
        <SharedCapabilityRatingBadge
          :rating="formState.capability_rating"
          size="sm"
        />
      </div>
      <SharedCrudFormFieldError :errors="apiErrors.capability_rating" />
    </UFormField>

    <!-- Thông tin ngân hàng (dùng để tạo QR chuyển tiền ứng / hoa hồng) -->
    <USeparator />
    <div class="flex flex-col gap-1">
      <h3 class="text-sm font-semibold text-slate-900">
        Thông tin ngân hàng
      </h3>
      <p class="text-xs text-slate-500">
        Dùng để sinh QR khi chuyển tiền ứng vật tư hoặc tiền hoa hồng cho nhân sự. Có thể bỏ trống.
      </p>
    </div>

    <UFormField
      label="Ngân hàng (VietQR BIN)"
      name="bank_bin"
    >
      <USelectMenu
        v-model="formState.bank_bin"
        :items="bankOptions"
        value-key="value"
        placeholder="Chọn ngân hàng..."
        :search-input="{ placeholder: 'Tìm theo tên ngân hàng...' }"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.bank_bin" />
    </UFormField>

    <UFormField
      label="Số tài khoản"
      name="bank_account_number"
    >
      <UInput
        v-model="formState.bank_account_number"
        placeholder="VD: 19021234567890"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.bank_account_number" />
    </UFormField>

    <UFormField
      label="Tên chủ tài khoản"
      name="bank_account_name"
      help="Viết HOA, không dấu — đúng như trên app ngân hàng."
    >
      <UInput
        v-model="formState.bank_account_name"
        placeholder="VD: NGUYEN VAN A"
        class="w-full"
        @input="formState.bank_account_name = formState.bank_account_name.toUpperCase()"
      />
      <SharedCrudFormFieldError :errors="apiErrors.bank_account_name" />
    </UFormField>

    <USeparator />

    <UFormField
      v-if="mode === 'create'"
      label="Mật khẩu"
      name="password"
      required
    >
      <div class="flex gap-2">
        <UInput
          v-model="formState.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Tối thiểu 8 ký tự"
          class="flex-1"
          autocomplete="new-password"
        >
          <template #trailing>
            <UIcon
              :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              class="cursor-pointer text-(--ui-text-dimmed) hover:text-(--ui-text)"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
        <UTooltip text="Tạo mật khẩu ngẫu nhiên">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-key-round"
            @click="generatePassword()"
          />
        </UTooltip>
      </div>
      <SharedCrudFormFieldError :errors="apiErrors.password" />
    </UFormField>
  </SharedCrudBaseFormModal>
</template>
