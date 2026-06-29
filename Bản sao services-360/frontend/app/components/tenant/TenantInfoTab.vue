<script setup lang="ts">
import type { OrganizationDetailResource, UpdateOrganizationRequest } from '~/composables/api/useTenants'
import { ServicePlan, SERVICE_PLAN_OPTIONS, apiUpdateTenant } from '~/composables/api/useTenants'

interface Props {
  tenant: OrganizationDetailResource
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updated: []
}>()

const toast = useToast()

const formState = reactive({
  name: '',
  tax_code: '',
  service_plan: ServicePlan.business as NonNullable<UpdateOrganizationRequest['service_plan']>,
  representative_name: '',
  contact_email: '',
  contact_phone: '',
  address: '',
  notes: ''
})

watch(
  () => props.tenant,
  (tenant) => {
    formState.name = tenant.name
    formState.tax_code = tenant.tax_code ?? ''
    formState.service_plan = (tenant.service_plan?.value as typeof formState.service_plan) ?? ServicePlan.business
    formState.representative_name = tenant.representative_name ?? ''
    formState.contact_email = tenant.contact_email ?? ''
    formState.contact_phone = tenant.contact_phone ?? ''
    formState.address = tenant.address ?? ''
    formState.notes = tenant.notes ?? ''
  },
  { immediate: true }
)

const isSaving = ref(false)
const apiErrors = ref<Record<string, string[]>>({})

async function handleSave() {
  apiErrors.value = {}
  isSaving.value = true
  try {
    await apiUpdateTenant(props.tenant.id, {
      name: formState.name.trim(),
      tax_code: formState.tax_code.trim() || null,
      service_plan: formState.service_plan,
      representative_name: formState.representative_name.trim() || null,
      contact_email: formState.contact_email.trim() || null,
      contact_phone: formState.contact_phone.trim() || null,
      address: formState.address.trim() || null,
      notes: formState.notes.trim() || null
    })
    toast.add({ title: 'Cập nhật thông tin công ty thành công', color: 'success' })
    emit('updated')
  } catch (err) {
    const errors = getApiValidationErrors(err)
    if (errors) {
      apiErrors.value = errors
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Cập nhật thất bại'), color: 'error' })
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <SharedSectionCard title="Hạ tầng tenant">
      <p class="text-sm text-slate-500 mb-4">
        Tên miền và schema do hệ thống cấp khi đăng ký — không thể chỉnh sửa.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SharedFieldDisplay label="Tên miền">
          <div
            v-if="tenant.domains.length"
            class="flex flex-wrap gap-1.5"
          >
            <UBadge
              v-for="domain in tenant.domains"
              :key="domain"
              color="info"
              variant="subtle"
              :label="domain"
              size="sm"
            />
          </div>
          <span
            v-else
            class="text-slate-400"
          >—</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Tên schema">
          <span class="font-mono">{{ tenant.schema_name }}</span>
        </SharedFieldDisplay>
      </div>
    </SharedSectionCard>

    <SharedSectionCard title="Thông tin công ty">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UFormField
          label="Mã công ty"
          name="id"
        >
          <UInput
            :model-value="tenant.id"
            disabled
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Tên công ty"
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
          label="Người đại diện"
          name="representative_name"
        >
          <UInput
            v-model="formState.representative_name"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.representative_name" />
        </UFormField>

        <UFormField
          label="Ngày đăng ký"
          name="created_at"
        >
          <UInput
            :model-value="tenant.created_at ? formatDateTime(tenant.created_at) : '—'"
            disabled
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Email"
          name="contact_email"
        >
          <UInput
            v-model="formState.contact_email"
            type="email"
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
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.contact_phone" />
        </UFormField>

        <UFormField
          label="Địa chỉ"
          name="address"
          class="sm:col-span-2"
        >
          <UInput
            v-model="formState.address"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.address" />
        </UFormField>

        <UFormField
          label="Ghi chú"
          name="notes"
          help="Ghi chú nội bộ platform."
          class="sm:col-span-2"
        >
          <UTextarea
            v-model="formState.notes"
            :rows="2"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.notes" />
        </UFormField>
      </div>

      <div class="flex justify-end mt-5">
        <UButton
          icon="i-lucide-save"
          label="Lưu thay đổi"
          :loading="isSaving"
          @click="handleSave"
        />
      </div>
    </SharedSectionCard>

    <TenantProjectsSection
      :tenant-id="tenant.id"
      :max-projects="tenant.config?.max_projects"
    />

    <TenantResidentRatingsCard :tenant-id="tenant.id" />
  </div>
</template>
