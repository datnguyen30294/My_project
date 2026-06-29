<script setup lang="ts">
import type { OrganizationListResource, UpdateOrganizationRequest, TenantFormPayload } from '~/composables/api/useTenants'
import { ServicePlan, SERVICE_PLAN_OPTIONS, apiGetTenant } from '~/composables/api/useTenants'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: OrganizationListResource | null
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
  'submit': [TenantFormPayload]
}>()

const formState = reactive({
  id: '',
  name: '',
  tax_code: '',
  representative_name: '',
  contact_email: '',
  contact_phone: '',
  address: '',
  service_plan: ServicePlan.business as NonNullable<UpdateOrganizationRequest['service_plan']>,
  notes: '',
  domains: [] as string[]
})

const newDomain = ref('')
const isLoadingDetail = ref(false)

function resetForm() {
  formState.id = ''
  formState.name = ''
  formState.tax_code = ''
  formState.representative_name = ''
  formState.contact_email = ''
  formState.contact_phone = ''
  formState.address = ''
  formState.service_plan = ServicePlan.business
  formState.notes = ''
  formState.domains = []
}

async function fillFromDetail(id: string) {
  isLoadingDetail.value = true
  try {
    const res = await apiGetTenant(id)
    const detail = res.data
    formState.name = detail.name
    formState.tax_code = detail.tax_code ?? ''
    formState.representative_name = detail.representative_name ?? ''
    formState.contact_email = detail.contact_email ?? ''
    formState.contact_phone = detail.contact_phone ?? ''
    formState.address = detail.address ?? ''
    formState.service_plan = (detail.service_plan?.value as typeof formState.service_plan) ?? ServicePlan.business
    formState.notes = detail.notes ?? ''
    formState.domains = [...(detail.domains ?? [])]
  } finally {
    isLoadingDetail.value = false
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    resetForm()
    newDomain.value = ''
    if (props.mode === 'edit' && props.item) {
      formState.id = props.item.id
      formState.name = props.item.name
      formState.tax_code = props.item.tax_code ?? ''
      formState.representative_name = props.item.representative_name ?? ''
      formState.contact_email = props.item.contact_email ?? ''
      formState.service_plan = (props.item.service_plan?.value as typeof formState.service_plan) ?? ServicePlan.business
      formState.domains = [...(props.item.domains ?? [])]
      fillFromDetail(props.item.id)
    }
  }
)

function addDomain() {
  const value = newDomain.value.trim().toLowerCase()
  if (!value) return
  if (formState.domains.includes(value)) {
    newDomain.value = ''
    return
  }
  formState.domains.push(value)
  newDomain.value = ''
}

function removeDomain(domain: string) {
  formState.domains = formState.domains.filter(d => d !== domain)
}

function handleSubmit() {
  emit('submit', {
    ...(props.mode === 'create' ? { id: formState.id.trim() } : {}),
    name: formState.name.trim(),
    tax_code: formState.tax_code.trim() || null,
    representative_name: formState.representative_name.trim() || null,
    contact_email: formState.contact_email.trim() || null,
    contact_phone: formState.contact_phone.trim() || null,
    address: formState.address.trim() || null,
    service_plan: formState.service_plan,
    notes: formState.notes.trim() || null,
    domains: formState.domains
  })
}
</script>

<template>
  <SharedCrudBaseFormModal
    :open="open"
    :mode="mode"
    :loading="loading || isLoadingDetail"
    :titles="{ create: 'Đăng ký công ty vận hành', edit: 'Cập nhật công ty vận hành' }"
    @update:open="emit('update:open', $event)"
    @submit="handleSubmit"
  >
    <UFormField
      label="Mã công ty"
      name="id"
      :required="mode === 'create'"
      help="Mã định danh tenant, không đổi sau khi tạo. Chữ thường, số, gạch ngang/dưới."
    >
      <UInput
        v-if="mode === 'create'"
        v-model="formState.id"
        placeholder="vd: acme, tnp-residential"
        class="w-full"
      />
      <UInput
        v-else
        :model-value="formState.id"
        disabled
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.id" />
    </UFormField>

    <UFormField
      label="Tên công ty"
      name="name"
      required
    >
      <UInput
        v-model="formState.name"
        placeholder="VD: Công ty CP Quản lý vận hành ACME"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.name" />
    </UFormField>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UFormField
        label="Mã số thuế"
        name="tax_code"
      >
        <UInput
          v-model="formState.tax_code"
          placeholder="10–13 chữ số"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.tax_code" />
      </UFormField>

      <UFormField
        label="Người đại diện"
        name="representative_name"
      >
        <UInput
          v-model="formState.representative_name"
          placeholder="VD: Nguyễn Văn A"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.representative_name" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UFormField
        label="Email"
        name="contact_email"
      >
        <UInput
          v-model="formState.contact_email"
          type="email"
          placeholder="lienhe@congty.vn"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.contact_email" />
      </UFormField>

      <UFormField
        label="Điện thoại"
        name="contact_phone"
      >
        <UInput
          v-model="formState.contact_phone"
          placeholder="VD: 0901234567"
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.contact_phone" />
      </UFormField>
    </div>

    <UFormField
      label="Địa chỉ"
      name="address"
    >
      <UInput
        v-model="formState.address"
        placeholder="Địa chỉ trụ sở công ty"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.address" />
    </UFormField>

    <UFormField
      label="Gói dịch vụ"
      name="service_plan"
    >
      <USelect
        v-model="formState.service_plan"
        :items="[...SERVICE_PLAN_OPTIONS]"
        value-key="value"
        label-key="label"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.service_plan" />
    </UFormField>

    <UFormField
      label="Domains"
      name="domains"
      help="Không truyền domain → hệ thống tự sinh. Domain phải unique trên toàn hệ thống."
    >
      <div class="space-y-2">
        <div class="flex gap-2">
          <UInput
            v-model="newDomain"
            placeholder="vd: acme.tnp.app.vn"
            class="flex-1"
            @keydown.enter.prevent="addDomain"
          />
          <UButton
            icon="i-lucide-plus"
            color="neutral"
            variant="outline"
            label="Thêm"
            :disabled="!newDomain.trim()"
            @click="addDomain"
          />
        </div>
        <div
          v-if="formState.domains.length"
          class="flex flex-wrap gap-2"
        >
          <UBadge
            v-for="domain in formState.domains"
            :key="domain"
            color="info"
            variant="subtle"
            class="gap-1 pr-1"
          >
            {{ domain }}
            <button
              type="button"
              class="ml-1 rounded hover:bg-black/10 p-0.5"
              @click="removeDomain(domain)"
            >
              <UIcon
                name="i-lucide-x"
                class="size-3"
              />
            </button>
          </UBadge>
        </div>
        <p
          v-else
          class="text-sm text-gray-400"
        >
          Chưa có domain nào — hệ thống sẽ tự sinh khi đăng ký.
        </p>
        <SharedCrudFormFieldError :errors="apiErrors.domains" />
        <SharedCrudFormFieldError :errors="apiErrors['domains.0']" />
      </div>
    </UFormField>

    <UFormField
      label="Ghi chú"
      name="notes"
      help="Ghi chú nội bộ platform."
    >
      <UTextarea
        v-model="formState.notes"
        :rows="2"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.notes" />
    </UFormField>
  </SharedCrudBaseFormModal>
</template>
