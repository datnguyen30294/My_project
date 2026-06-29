<script setup lang="ts">
import type { OrganizationDetailResource, UpdateTenantConfigRequest } from '~/composables/api/useTenants'
import { TenantFeeMode, SubscriptionCycle, TENANT_FEE_MODE_OPTIONS, TENANT_SUBSCRIPTION_CYCLE_OPTIONS, apiUpdateTenantConfig } from '~/composables/api/useTenants'

interface Props {
  tenant: OrganizationDetailResource
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updated: []
}>()

const toast = useToast()

type FeeMode = NonNullable<UpdateTenantConfigRequest['fee_mode']>

const formState = reactive({
  max_projects: 1,
  max_accounts: 1,
  session_timeout_minutes: 15,
  resident_portal_enabled: true,
  partner_portal_enabled: true,
  fee_mode: TenantFeeMode.none as FeeMode,
  subscription_cycle: SubscriptionCycle.monthly as NonNullable<UpdateTenantConfigRequest['subscription_cycle']>,
  subscription_amount: 0,
  fixed_fee_per_order: 0,
  percent_fee_per_order: 0
})

watch(
  () => props.tenant,
  (tenant) => {
    const config = tenant.config
    if (!config) return
    formState.max_projects = config.max_projects
    formState.max_accounts = config.max_accounts
    formState.session_timeout_minutes = config.session_timeout_minutes
    formState.resident_portal_enabled = config.resident_portal_enabled
    formState.partner_portal_enabled = config.partner_portal_enabled
    formState.fee_mode = (config.fee_mode.value as FeeMode) ?? TenantFeeMode.none
    formState.subscription_cycle = (config.subscription_cycle.value as typeof formState.subscription_cycle) ?? SubscriptionCycle.monthly
    formState.subscription_amount = Number(config.subscription_amount)
    formState.fixed_fee_per_order = Number(config.fixed_fee_per_order)
    formState.percent_fee_per_order = Number(config.percent_fee_per_order)
  },
  { immediate: true }
)

const showSubscriptionFields = computed(() => formState.fee_mode === TenantFeeMode.subscription)
const showFixedFee = computed(() => formState.fee_mode === TenantFeeMode.fixed_per_order || formState.fee_mode === TenantFeeMode.both)
const showPercentFee = computed(() => formState.fee_mode === TenantFeeMode.percent_per_order || formState.fee_mode === TenantFeeMode.both)

const EXAMPLE_ORDER_AMOUNT = 10_000_000

const bothFeeExample = computed(() => {
  const fee = formState.fixed_fee_per_order + EXAMPLE_ORDER_AMOUNT * formState.percent_fee_per_order / 100
  return formatCurrency(fee)
})

const isSaving = ref(false)
const apiErrors = ref<Record<string, string[]>>({})

async function handleSave() {
  apiErrors.value = {}
  isSaving.value = true
  try {
    const body: UpdateTenantConfigRequest = {
      max_projects: formState.max_projects,
      max_accounts: formState.max_accounts,
      session_timeout_minutes: formState.session_timeout_minutes,
      resident_portal_enabled: formState.resident_portal_enabled,
      partner_portal_enabled: formState.partner_portal_enabled,
      fee_mode: formState.fee_mode,
      ...(showSubscriptionFields.value
        ? { subscription_cycle: formState.subscription_cycle, subscription_amount: formState.subscription_amount }
        : {}),
      ...(showFixedFee.value ? { fixed_fee_per_order: formState.fixed_fee_per_order } : {}),
      ...(showPercentFee.value ? { percent_fee_per_order: formState.percent_fee_per_order } : {})
    }
    await apiUpdateTenantConfig(props.tenant.id, body)
    toast.add({ title: 'Lưu cấu hình thành công', color: 'success' })
    emit('updated')
  } catch (err) {
    const errors = getApiValidationErrors(err)
    if (errors) {
      apiErrors.value = errors
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Lưu cấu hình thất bại'), color: 'error' })
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <SharedSectionCard title="Cấu hình tenant">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UFormField
          label="Giới hạn dự án"
          name="max_projects"
          help="Số dự án tối đa tenant được tạo."
        >
          <UInput
            v-model.number="formState.max_projects"
            type="number"
            :min="1"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.max_projects" />
        </UFormField>

        <UFormField
          label="Giới hạn tài khoản"
          name="max_accounts"
          help="Số tài khoản vận hành tối đa."
        >
          <UInput
            v-model.number="formState.max_accounts"
            type="number"
            :min="1"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.max_accounts" />
        </UFormField>

        <UFormField
          label="Thời gian phiên (phút)"
          name="session_timeout_minutes"
        >
          <UInput
            v-model.number="formState.session_timeout_minutes"
            type="number"
            :min="15"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.session_timeout_minutes" />
        </UFormField>
      </div>

      <div class="mt-5 flex flex-col gap-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="font-medium text-slate-900 text-sm">
              Cho phép hiển thị trên app cư dân
            </div>
            <div class="text-sm text-slate-500">
              Cư dân thấy được dịch vụ của công ty trên ứng dụng.
            </div>
          </div>
          <USwitch v-model="formState.resident_portal_enabled" />
        </div>
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="font-medium text-slate-900 text-sm">
              Cho phép đăng ký dịch vụ
            </div>
            <div class="text-sm text-slate-500">
              Đối tác có thể đăng ký cung cấp dịch vụ cho công ty.
            </div>
          </div>
          <USwitch v-model="formState.partner_portal_enabled" />
        </div>
      </div>
    </SharedSectionCard>

    <SharedSectionCard title="Phí nền tảng theo đơn hàng">
      <URadioGroup
        v-model="formState.fee_mode"
        variant="card"
        :items="[...TENANT_FEE_MODE_OPTIONS]"
        value-key="value"
        label-key="label"
        description-key="description"
        :ui="{
          fieldset: 'gap-y-2.5',
          item: 'cursor-pointer border-slate-200 transition-colors hover:border-slate-300 hover:bg-slate-50/60 has-data-[state=checked]:border-slate-900 has-data-[state=checked]:bg-slate-50 has-data-[state=checked]:ring-1 has-data-[state=checked]:ring-slate-900/10',
          label: 'font-semibold text-highlighted',
          description: 'mt-0.5 leading-snug text-muted'
        }"
      />
      <SharedCrudFormFieldError :errors="apiErrors.fee_mode" />

      <div
        v-if="showSubscriptionFields || showFixedFee || showPercentFee"
        class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5"
      >
        <UFormField
          v-if="showSubscriptionFields"
          label="Chu kỳ gói"
          name="subscription_cycle"
        >
          <USelect
            v-model="formState.subscription_cycle"
            :items="[...TENANT_SUBSCRIPTION_CYCLE_OPTIONS]"
            value-key="value"
            label-key="label"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.subscription_cycle" />
        </UFormField>

        <UFormField
          v-if="showSubscriptionFields"
          label="Mức phí gói (đ)"
          name="subscription_amount"
        >
          <UInput
            v-model.number="formState.subscription_amount"
            type="number"
            :min="0"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.subscription_amount" />
        </UFormField>

        <UFormField
          v-if="showFixedFee"
          label="Phí cố định mỗi đơn (đ)"
          name="fixed_fee_per_order"
        >
          <UInput
            v-model.number="formState.fixed_fee_per_order"
            type="number"
            :min="0"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.fixed_fee_per_order" />
        </UFormField>

        <UFormField
          v-if="showPercentFee"
          label="Phí theo % giá trị đơn"
          name="percent_fee_per_order"
        >
          <UInput
            v-model.number="formState.percent_fee_per_order"
            type="number"
            :min="0"
            :max="100"
            :step="0.1"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.percent_fee_per_order" />
        </UFormField>
      </div>

      <UAlert
        v-if="formState.fee_mode === TenantFeeMode.both"
        color="info"
        variant="subtle"
        icon="i-lucide-calculator"
        class="mt-4"
        :description="`Ví dụ: đơn ${formatCurrency(EXAMPLE_ORDER_AMOUNT)} → phí ${bothFeeExample}.`"
      />

      <div class="flex justify-end mt-5">
        <UButton
          icon="i-lucide-save"
          label="Lưu cấu hình"
          :loading="isSaving"
          @click="handleSave"
        />
      </div>
    </SharedSectionCard>
  </div>
</template>
