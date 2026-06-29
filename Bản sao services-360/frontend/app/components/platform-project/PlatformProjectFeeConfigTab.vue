<script setup lang="ts">
import type { ProjectFeeConfigResource, UpdateProjectFeeConfigRequest } from '~/composables/api/usePlatformProjects'
import { useProjectFeeConfig, apiUpdateProjectFeeConfig } from '~/composables/api/usePlatformProjects'
import { TenantFeeMode, SubscriptionCycle, TENANT_FEE_MODE_OPTIONS, TENANT_SUBSCRIPTION_CYCLE_OPTIONS } from '~/composables/api/useTenants'

interface Props {
  tenantId: string
  projectId: number
}

const props = defineProps<Props>()

const toast = useToast()

const { data, status, error, refresh } = useProjectFeeConfig(() => props.tenantId, () => props.projectId)
const config = computed<ProjectFeeConfigResource | null>(() => data.value?.data ?? null)
const isLoading = computed(() => status.value === 'pending' && !data.value)

type FeeMode = NonNullable<UpdateProjectFeeConfigRequest['fee_mode']>
type Cycle = NonNullable<UpdateProjectFeeConfigRequest['subscription_cycle']>

const formState = reactive({
  inherit_default: true,
  platform_service_enabled: true,
  notes: '',
  fee_mode: TenantFeeMode.none as FeeMode,
  subscription_cycle: SubscriptionCycle.monthly as Cycle,
  subscription_amount: 0,
  fixed_fee_per_order: 0,
  percent_fee_per_order: 0
})

watch(config, (value) => {
  if (!value) return
  formState.inherit_default = value.inherit_default
  formState.platform_service_enabled = value.platform_service_enabled
  formState.notes = value.notes ?? ''
  formState.fee_mode = (value.override.fee_mode?.value as FeeMode) ?? TenantFeeMode.none
  formState.subscription_cycle = (value.override.subscription_cycle?.value as Cycle) ?? SubscriptionCycle.monthly
  formState.subscription_amount = Number(value.override.subscription_amount)
  formState.fixed_fee_per_order = Number(value.override.fixed_fee_per_order)
  formState.percent_fee_per_order = Number(value.override.percent_fee_per_order)
}, { immediate: true })

const showSubscriptionFields = computed(() => formState.fee_mode === TenantFeeMode.subscription)
const showFixedFee = computed(() => formState.fee_mode === TenantFeeMode.fixed_per_order || formState.fee_mode === TenantFeeMode.both)
const showPercentFee = computed(() => formState.fee_mode === TenantFeeMode.percent_per_order || formState.fee_mode === TenantFeeMode.both)

/** Mức phí mặc định của tenant — hiển thị khi đang kế thừa để biết đang áp dụng gì. */
const tenantDefault = computed(() => config.value?.tenant_default ?? null)

const isSaving = ref(false)
const apiErrors = ref<Record<string, string[]>>({})

async function handleSave() {
  apiErrors.value = {}
  isSaving.value = true
  try {
    const body: UpdateProjectFeeConfigRequest = {
      inherit_default: formState.inherit_default,
      platform_service_enabled: formState.platform_service_enabled,
      notes: formState.notes.trim() || null,
      fee_mode: formState.inherit_default ? null : formState.fee_mode,
      fixed_fee_per_order: formState.fixed_fee_per_order,
      percent_fee_per_order: formState.percent_fee_per_order,
      subscription_amount: formState.subscription_amount,
      subscription_cycle: !formState.inherit_default && showSubscriptionFields.value
        ? formState.subscription_cycle
        : null
    }
    await apiUpdateProjectFeeConfig(props.tenantId, props.projectId, body)
    toast.add({ title: 'Lưu cấu hình phí thành công', color: 'success', icon: 'i-lucide-check-circle' })
    await refresh()
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
    <div
      v-if="isLoading"
      class="flex flex-col gap-4"
    >
      <USkeleton class="h-32 w-full rounded-xl" />
      <USkeleton class="h-48 w-full rounded-xl" />
    </div>

    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      title="Không tải được cấu hình phí"
      description="Đã xảy ra lỗi khi tải cấu hình. Vui lòng thử lại."
    >
      <template #actions>
        <UButton
          label="Thử lại"
          color="error"
          variant="soft"
          size="xs"
          icon="i-lucide-refresh-cw"
          @click="refresh()"
        />
      </template>
    </UAlert>

    <template v-else>
      <SharedSectionCard title="Phí nền tảng theo dự án">
        <p class="text-sm text-slate-500 mb-4">
          Mức phí nền tảng (phần TNP thu của công ty vận hành) áp dụng riêng cho dự án này. Mặc định kế thừa cấu hình của công ty vận hành, trừ khi bật ghi đè.
        </p>

        <UAlert
          color="warning"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="Thay đổi phí % sẽ tự động chia lại hoa hồng"
          description="Khi % phí nền tảng thay đổi, tỷ lệ hoa hồng của 3 đơn vị (công ty vận hành, ban quản trị, ban quản lý) sẽ được tự động chia lại theo đúng tỷ lệ tương đối hiện tại, để tổng luôn bằng 100%. Cấu hình hoa hồng nội bộ của công ty vận hành sẽ bị ghi đè."
          class="mb-4"
        />

        <div class="flex items-center justify-between gap-4 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50/50">
          <div>
            <div class="font-medium text-slate-900 text-sm">
              Kế thừa phí từ công ty vận hành
            </div>
            <div class="text-sm text-slate-500">
              Bật: dùng cấu hình mặc định của công ty vận hành. Tắt: ghi đè mức phí riêng cho dự án.
            </div>
          </div>
          <USwitch v-model="formState.inherit_default" />
        </div>

        <!-- Cấu hình hiệu lực khi kế thừa -->
        <div
          v-if="formState.inherit_default"
          class="mt-4"
        >
          <UAlert
            color="info"
            variant="subtle"
            icon="i-lucide-info"
            title="Đang áp dụng cấu hình mặc định của công ty vận hành"
          >
            <template #description>
              <div
                v-if="tenantDefault"
                class="mt-1 flex flex-col gap-0.5 text-sm"
              >
                <span>Hình thức thu phí: <strong>{{ tenantDefault.fee_mode.label }}</strong></span>
                <span>Phí cố định mỗi đơn: <strong>{{ formatCurrency(Number(tenantDefault.fixed_fee_per_order)) }}</strong></span>
                <span>Phí theo % giá trị đơn: <strong>{{ Number(tenantDefault.percent_fee_per_order) }}%</strong></span>
              </div>
            </template>
          </UAlert>
        </div>

        <!-- Ghi đè khi tắt kế thừa -->
        <div
          v-else
          class="mt-5 border-t border-slate-100 pt-5"
        >
          <UFormField
            label="Hình thức thu phí"
            name="fee_mode"
          >
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
          </UFormField>

          <div
            v-if="showSubscriptionFields || showFixedFee || showPercentFee"
            class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
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
              label="Giá gói (đ)"
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
        </div>
      </SharedSectionCard>

      <SharedSectionCard title="Cung cấp dịch vụ & ghi chú">
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="font-medium text-slate-900 text-sm">
              Cung cấp dịch vụ nền tảng
            </div>
            <div class="text-sm text-slate-500">
              Bật/tắt việc nền tảng cung cấp dịch vụ cho dự án này.
            </div>
          </div>
          <USwitch v-model="formState.platform_service_enabled" />
        </div>

        <UFormField
          label="Ghi chú nội bộ"
          name="notes"
          help="Ghi chú cho đội vận hành platform — cư dân/tenant không nhìn thấy."
          class="mt-5"
        >
          <UTextarea
            v-model="formState.notes"
            :rows="3"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.notes" />
        </UFormField>

        <div class="flex justify-end mt-5">
          <UButton
            icon="i-lucide-save"
            label="Lưu cấu hình"
            :loading="isSaving"
            @click="handleSave"
          />
        </div>
      </SharedSectionCard>
    </template>
  </div>
</template>
