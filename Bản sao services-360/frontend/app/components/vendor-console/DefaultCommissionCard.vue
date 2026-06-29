<script setup lang="ts">
import type {
  BulkApplyCommissionPayload,
  ContractTerms,
  RevenueRecipientValue,
  SubscriptionCycleValue
} from '~/composables/api/usePartnerCommissionContracts'
import {
  apiBulkApplyPlatformCommission,
  REVENUE_RECIPIENT_OPTIONS,
  SUBSCRIPTION_CYCLE_OPTIONS
} from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  partnerId: number | string
  /** Số dự án vendor đang gắn — để hiển thị phạm vi áp dụng. */
  projectCount?: number
}

const props = withDefaults(defineProps<Props>(), { projectCount: 0 })

const emit = defineEmits<{ applied: [] }>()

const toast = useToast()

type FeeMode = 'none' | 'fixed' | 'percent' | 'both' | 'subscription'

const FEE_MODE_OPTIONS: { value: FeeMode, label: string }[] = [
  { value: 'none', label: 'Không thu' },
  { value: 'fixed', label: 'Cố định mỗi đơn' },
  { value: 'percent', label: '% mỗi đơn' },
  { value: 'both', label: 'Cả hai (cố định + %)' },
  { value: 'subscription', label: 'Thu theo gói (thuê bao)' }
]

const feeMode = ref<FeeMode>('percent')
const percent = ref<number | null>(10)
const fixed = ref<number | null>(null)
const amount = ref<number | null>(500_000)
const cycle = ref<SubscriptionCycleValue>('monthly')
const recipient = ref<RevenueRecipientValue>('platform')
const startsAt = ref<string>(new Date().toISOString().substring(0, 10))
const skipExisting = ref(true)

const isPerOrder = computed(() => feeMode.value === 'fixed' || feeMode.value === 'percent' || feeMode.value === 'both')
const showPercent = computed(() => feeMode.value === 'percent' || feeMode.value === 'both')
const showFixed = computed(() => feeMode.value === 'fixed' || feeMode.value === 'both')

const isSubmitting = ref(false)

const canApply = computed(() => {
  if (feeMode.value === 'none') return false
  if (props.projectCount === 0) return false
  if (!startsAt.value) return false
  if (feeMode.value === 'subscription') return (amount.value ?? 0) > 0
  if (showPercent.value && (percent.value ?? 0) > 0) return true
  if (showFixed.value && (fixed.value ?? 0) > 0) return true
  return false
})

function buildTerms(): ContractTerms {
  if (feeMode.value === 'subscription') {
    return { amount: amount.value ?? 0, cycle: cycle.value }
  }
  return {
    percent: showPercent.value ? (percent.value ?? null) : null,
    fixed: showFixed.value ? (fixed.value ?? null) : null
  }
}

async function apply(): Promise<void> {
  if (!canApply.value) return
  isSubmitting.value = true
  try {
    const payload: BulkApplyCommissionPayload = {
      commission_mode: isPerOrder.value ? 'per_order' : 'subscription',
      revenue_recipient: recipient.value,
      starts_at: startsAt.value,
      terms: buildTerms(),
      skip_existing: skipExisting.value
    }
    const res = await apiBulkApplyPlatformCommission(props.partnerId, payload)
    const created = res.data?.created ?? 0
    const skipped = res.data?.skipped ?? 0
    toast.add({
      title: 'Đã áp hoa hồng mặc định',
      description: `Tạo ${created} hợp đồng nháp${skipped ? `, bỏ qua ${skipped} dự án đã có cấu hình` : ''}.`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    emit('applied')
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Áp hoa hồng thất bại'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <SharedSectionCard
    title="Hoa hồng mặc định"
    icon="i-lucide-percent"
    compact
  >
    <template #header-actions>
      <UBadge
        color="neutral"
        variant="subtle"
        :label="`${projectCount} dự án`"
        icon="i-lucide-folder"
      />
    </template>

    <p class="text-sm text-slate-500 mb-4">
      Áp một bộ điều khoản hoa hồng cho <strong>tất cả dự án</strong> vendor đang gắn. Mỗi
      dự án vẫn có thể ghi đè riêng bằng hợp đồng bên dưới.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UFormField label="Hình thức">
        <USelect
          v-model="feeMode"
          :items="FEE_MODE_OPTIONS"
          value-key="value"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Doanh thu thuộc về">
        <USelect
          v-model="recipient"
          :items="REVENUE_RECIPIENT_OPTIONS"
          value-key="value"
          class="w-full"
        />
      </UFormField>

      <UFormField
        v-if="showPercent"
        label="% chiết khấu / đơn"
      >
        <SharedNumberInput
          v-model="percent"
          placeholder="VD: 10"
          :min="0"
          :max="100"
        />
      </UFormField>

      <UFormField
        v-if="showFixed"
        label="Tiền cứng / đơn (VND)"
      >
        <SharedNumberInput
          v-model="fixed"
          placeholder="VD: 50.000"
          :min="0"
        />
      </UFormField>

      <UFormField
        v-if="feeMode === 'subscription'"
        label="Phí thuê bao (VND)"
      >
        <SharedNumberInput
          v-model="amount"
          :min="0"
        />
      </UFormField>

      <UFormField
        v-if="feeMode === 'subscription'"
        label="Chu kỳ"
      >
        <USelect
          v-model="cycle"
          :items="SUBSCRIPTION_CYCLE_OPTIONS"
          value-key="value"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Ngày bắt đầu">
        <UInput
          v-model="startsAt"
          type="date"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="mt-4 flex items-center justify-between gap-4 flex-wrap">
      <USwitch
        v-model="skipExisting"
        label="Không ghi đè dự án đã có cấu hình"
      />
      <UButton
        label="Lưu mặc định"
        icon="i-lucide-check"
        :loading="isSubmitting"
        :disabled="!canApply || isSubmitting"
        @click="apply"
      />
    </div>

    <p
      v-if="feeMode === 'none'"
      class="mt-3 text-xs text-slate-500"
    >
      Chọn một hình thức thu hoa hồng để áp dụng. "Không thu" không tạo hợp đồng nào.
    </p>
  </SharedSectionCard>
</template>
