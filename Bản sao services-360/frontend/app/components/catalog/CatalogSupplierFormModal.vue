<script setup lang="ts">
import type { CatalogSupplierResource } from '#api/generated/laravel'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: CatalogSupplierResource | null
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
    contact: string | null
    phone: string | null
    address: string | null
    email: string | null
    commission_rate: number | null
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
  contact: null as string | null,
  phone: null as string | null,
  address: null as string | null,
  email: null as string | null,
  commission_rate: null as number | null,
  status: 'active'
})

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    if (props.mode === 'edit' && props.item) {
      formState.name = props.item.name
      formState.code = props.item.code
      formState.contact = props.item.contact
      formState.phone = props.item.phone
      formState.address = props.item.address
      formState.email = props.item.email
      formState.commission_rate = props.item.commission_rate ? Number(props.item.commission_rate) : null
      formState.status = props.item.status.value
    } else {
      formState.name = ''
      formState.code = ''
      formState.contact = null
      formState.phone = null
      formState.address = null
      formState.email = null
      formState.commission_rate = null
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
    :titles="{ create: 'Thêm nhà cung cấp', edit: 'Sửa nhà cung cấp' }"
    @update:open="emit('update:open', $event)"
    @submit="emit('submit', { ...formState })"
  >
    <UFormField
      label="Mã NCC"
      name="code"
      required
    >
      <UInput
        v-model="formState.code"
        placeholder="VD: NCC-001"
        class="w-full"
        :disabled="mode === 'edit'"
      />
      <SharedCrudFormFieldError :errors="apiErrors.code" />
    </UFormField>

    <UFormField
      label="Tên nhà cung cấp"
      name="name"
      required
    >
      <UInput
        v-model="formState.name"
        placeholder="VD: Công ty TNHH ABC"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.name" />
    </UFormField>

    <UFormField
      label="Người liên hệ"
      name="contact"
    >
      <UInput
        v-model="formState.contact"
        placeholder="Họ tên người liên hệ"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Số điện thoại"
      name="phone"
    >
      <UInput
        v-model="formState.phone"
        placeholder="VD: 0901234567"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Email"
      name="email"
    >
      <UInput
        v-model="formState.email"
        type="email"
        placeholder="VD: contact@abc.com"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.email" />
    </UFormField>

    <UFormField
      label="Địa chỉ"
      name="address"
    >
      <UTextarea
        v-model="formState.address"
        placeholder="Địa chỉ nhà cung cấp"
        :rows="2"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Hoa hồng (%)"
      name="commission_rate"
    >
      <UInput
        v-model.number="formState.commission_rate"
        type="number"
        placeholder="VD: 5"
        :min="0"
        :max="100"
        step="0.01"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.commission_rate" />
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
