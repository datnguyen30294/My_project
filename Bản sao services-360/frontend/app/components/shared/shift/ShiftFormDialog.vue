<script setup lang="ts">
import type {
  CreateShiftRequest,
  ShiftResource
} from '#api/generated/laravel'

type ShiftStatus = 'active' | 'inactive'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  shift?: ShiftResource | null
  loading?: boolean
  apiErrors?: Record<string, string[]>
  errorMessage?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  shift: null,
  loading: false,
  apiErrors: () => ({}),
  errorMessage: null
})

const emit = defineEmits<{
  'update:open': [boolean]
  'submit': [payload: CreateShiftRequest]
}>()

const formState = reactive({
  project_id: null as number | null,
  code: '',
  name: '',
  type: '',
  work_group: '',
  start_time: '08:00',
  end_time: '17:00',
  break_hours: 0,
  status: 'active' as ShiftStatus,
  sort_order: 0
})

function resetForm() {
  formState.project_id = null
  formState.code = ''
  formState.name = ''
  formState.type = ''
  formState.work_group = ''
  formState.start_time = '08:00'
  formState.end_time = '17:00'
  formState.break_hours = 0
  formState.status = 'active'
  formState.sort_order = 0
}

function hydrateFromShift(shift: ShiftResource) {
  formState.project_id = (shift as unknown as { project_id: number }).project_id
  formState.code = shift.code
  formState.name = shift.name
  formState.type = shift.type
  formState.work_group = shift.work_group
  formState.start_time = shift.start_time
  formState.end_time = shift.end_time
  formState.break_hours = shift.break_hours
  formState.status = shift.status.value as ShiftStatus
  formState.sort_order = shift.sort_order
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    if (props.mode === 'edit' && props.shift) {
      hydrateFromShift(props.shift)
    } else {
      resetForm()
    }
  }
)

const typeSuggestions: string[] = [...SHIFT_TYPE_SUGGESTIONS]
const workGroupSuggestions: string[] = [...WORK_GROUP_SUGGESTIONS]
const statusItems = SHIFT_STATUS_OPTIONS.map(o => ({ value: o.value, label: o.label }))

const workHoursPreview = computed(() =>
  computeWorkHours(formState.start_time, formState.end_time, formState.break_hours)
)

const isOvernight = computed(() => {
  const [sh = '0', sm = '0'] = formState.start_time.split(':')
  const [eh = '0', em = '0'] = formState.end_time.split(':')
  const startMin = Number(sh) * 60 + Number(sm)
  const endMin = Number(eh) * 60 + Number(em)
  return endMin <= startMin
})

function handleSubmit() {
  const payload = {
    ...(props.mode === 'create' ? { project_id: formState.project_id } : {}),
    code: formState.code.trim(),
    name: formState.name.trim(),
    type: formState.type.trim(),
    work_group: formState.work_group.trim(),
    start_time: formState.start_time,
    end_time: formState.end_time,
    break_hours: formState.break_hours,
    status: formState.status,
    sort_order: formState.sort_order
  } as CreateShiftRequest
  emit('submit', payload)
}
</script>

<template>
  <SharedCrudBaseFormModal
    :open="open"
    :mode="mode"
    :loading="loading"
    :error-message="errorMessage"
    :titles="{ create: 'Thêm ca mới', edit: 'Sửa ca làm việc' }"
    @update:open="emit('update:open', $event)"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <UFormField
        v-if="mode === 'create'"
        label="Dự án"
        name="project_id"
        required
        class="sm:col-span-2"
      >
        <SharedProjectSelect
          v-model="formState.project_id"
          placeholder="Chọn dự án"
        />
        <SharedCrudFormFieldError :errors="apiErrors.project_id" />
      </UFormField>

      <UFormField
        v-else
        label="Dự án"
        name="project_id"
        class="sm:col-span-2"
      >
        <UInput
          :model-value="shift?.project?.name ?? ''"
          disabled
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Mã ca"
        name="code"
        required
      >
        <UInput
          v-model="formState.code"
          placeholder="VD: CS1"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.code" />
      </UFormField>

      <UFormField
        label="Tên hiển thị"
        name="name"
        required
      >
        <UInput
          v-model="formState.name"
          placeholder="VD: Ca sáng"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.name" />
      </UFormField>

      <UFormField
        label="Kiểu ca"
        name="type"
        required
      >
        <UInput
          v-model="formState.type"
          list="shift-type-suggestions"
          placeholder="VD: Ngày thường"
          class="w-full"
        />
        <datalist id="shift-type-suggestions">
          <option
            v-for="item in typeSuggestions"
            :key="item"
            :value="item"
          />
        </datalist>
        <SharedCrudFormFieldError :errors="apiErrors.type" />
      </UFormField>

      <UFormField
        label="Nhóm xử lý"
        name="work_group"
        required
      >
        <UInput
          v-model="formState.work_group"
          list="work-group-suggestions"
          placeholder="VD: Làm việc"
          class="w-full"
        />
        <datalist id="work-group-suggestions">
          <option
            v-for="item in workGroupSuggestions"
            :key="item"
            :value="item"
          />
        </datalist>
        <SharedCrudFormFieldError :errors="apiErrors.work_group" />
      </UFormField>

      <UFormField
        label="Giờ bắt đầu"
        name="start_time"
        required
      >
        <UInput
          v-model="formState.start_time"
          type="time"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.start_time" />
      </UFormField>

      <UFormField
        label="Giờ kết thúc"
        name="end_time"
        required
      >
        <UInput
          v-model="formState.end_time"
          type="time"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.end_time" />
      </UFormField>

      <UFormField
        label="Giờ nghỉ"
        name="break_hours"
      >
        <UInput
          v-model.number="formState.break_hours"
          type="number"
          step="0.5"
          min="0"
          max="24"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.break_hours" />
      </UFormField>

      <UFormField
        label="Thứ tự"
        name="sort_order"
      >
        <UInput
          v-model.number="formState.sort_order"
          type="number"
          min="0"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.sort_order" />
      </UFormField>

      <UFormField
        label="Trạng thái"
        name="status"
        class="sm:col-span-2"
        required
      >
        <USelectMenu
          v-model="formState.status"
          :items="statusItems"
          value-key="value"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.status" />
      </UFormField>
    </div>
  </SharedCrudBaseFormModal>
</template>
