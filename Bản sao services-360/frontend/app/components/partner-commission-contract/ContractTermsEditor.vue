<script setup lang="ts">
import type {
  CommissionModeValue,
  ContractTerms,
  PerOrderTerms,
  RevenueShareTerms,
  SubscriptionTerms,
  RevenueShareTier
} from '~/composables/api/usePartnerCommissionContracts'
import {
  BILLING_PERIOD_OPTIONS,
  SUBSCRIPTION_CYCLE_OPTIONS
} from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  mode: CommissionModeValue
  modelValue: ContractTerms
  disabled?: boolean
  errors?: Record<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  errors: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: ContractTerms]
}>()

// ─── Per-order helpers ─────────────────────────────────────────

const perOrder = computed<PerOrderTerms>(() => props.modelValue as PerOrderTerms)

function updatePerOrder<K extends keyof PerOrderTerms>(key: K, value: PerOrderTerms[K]): void {
  emit('update:modelValue', { ...perOrder.value, [key]: value })
}

// ─── Revenue-share helpers ─────────────────────────────────────

const revenueShare = computed<RevenueShareTerms>(() => props.modelValue as RevenueShareTerms)

function updateBillingPeriod(value: RevenueShareTerms['billing_period']): void {
  emit('update:modelValue', { ...revenueShare.value, billing_period: value })
}

function updateTier(idx: number, patch: Partial<RevenueShareTier>): void {
  const tiers = revenueShare.value.tiers.map((t, i) => (i === idx ? { ...t, ...patch } : t))
  emit('update:modelValue', { ...revenueShare.value, tiers })
}

function addTier(): void {
  const tiers = [...revenueShare.value.tiers]
  const last = tiers[tiers.length - 1]
  const min = last?.max_gmv ?? (last ? Number(last.min_gmv) + 1_000_000 : 0)
  tiers.push({ min_gmv: min, max_gmv: null, percent: 10 })
  // Force previous tier to have max_gmv so we don't have two open-ended tiers.
  if (last && last.max_gmv === null) {
    tiers[tiers.length - 2] = { ...last, max_gmv: min }
  }
  emit('update:modelValue', { ...revenueShare.value, tiers })
}

function removeTier(idx: number): void {
  if (revenueShare.value.tiers.length <= 1) return
  const tiers = revenueShare.value.tiers.filter((_, i) => i !== idx)
  emit('update:modelValue', { ...revenueShare.value, tiers })
}

// ─── Subscription helpers ──────────────────────────────────────

const subscription = computed<SubscriptionTerms>(() => props.modelValue as SubscriptionTerms)

function updateSubscription<K extends keyof SubscriptionTerms>(key: K, value: SubscriptionTerms[K]): void {
  emit('update:modelValue', { ...subscription.value, [key]: value })
}

function errorOf(key: string): string | undefined {
  const arr = props.errors[`terms.${key}`]
  return arr?.[0]
}

const generalTermsError = computed(() => props.errors.terms?.[0])
</script>

<template>
  <div>
    <UAlert
      v-if="generalTermsError"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      :description="generalTermsError"
      class="mb-4"
    />

    <!-- per_order -->
    <div
      v-if="mode === 'per_order'"
      class="space-y-5"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UFormField
          label="% chiết khấu"
          help="Để trống nếu chỉ dùng tiền cứng."
        >
          <SharedNumberInput
            :model-value="perOrder.percent ?? null"
            placeholder="VD: 10"
            :min="0"
            :max="100"
            :disabled="disabled"
            @update:model-value="(v) => updatePerOrder('percent', v)"
          />
        </UFormField>
        <UFormField
          label="Tiền cứng / đơn (VND)"
          help="Để trống nếu chỉ dùng phần trăm."
        >
          <SharedNumberInput
            :model-value="perOrder.fixed ?? null"
            placeholder="VD: 50.000"
            :min="0"
            :disabled="disabled"
            @update:model-value="(v) => updatePerOrder('fixed', v)"
          />
        </UFormField>
      </div>
    </div>

    <!-- revenue_share -->
    <div
      v-else-if="mode === 'revenue_share'"
      class="space-y-5"
    >
      <UFormField label="Chu kỳ chốt">
        <URadioGroup
          :model-value="revenueShare.billing_period"
          :items="BILLING_PERIOD_OPTIONS.map(o => ({ value: o.value, label: o.label }))"
          :disabled="disabled"
          orientation="horizontal"
          @update:model-value="(v) => updateBillingPeriod(v as RevenueShareTerms['billing_period'])"
        />
      </UFormField>

      <div>
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold text-slate-700">
            Bậc thang doanh thu
          </h3>
          <UButton
            icon="i-lucide-plus"
            label="Thêm bậc"
            size="xs"
            variant="soft"
            :disabled="disabled"
            @click="addTier"
          />
        </div>

        <div class="border border-slate-200 rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-600">
              <tr>
                <th class="text-left px-3 py-2 font-medium">
                  Từ (GMV)
                </th>
                <th class="text-left px-3 py-2 font-medium">
                  Đến (GMV)
                </th>
                <th class="text-left px-3 py-2 font-medium w-24">
                  Tỉ lệ %
                </th>
                <th class="w-12" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(tier, idx) in revenueShare.tiers"
                :key="idx"
                class="border-t border-slate-100"
              >
                <td class="px-3 py-2">
                  <SharedNumberInput
                    :model-value="tier.min_gmv"
                    :min="0"
                    :disabled="disabled"
                    @update:model-value="(v) => updateTier(idx, { min_gmv: v ?? 0 })"
                  />
                </td>
                <td class="px-3 py-2">
                  <SharedNumberInput
                    :model-value="tier.max_gmv ?? null"
                    :min="0"
                    placeholder="Không giới hạn"
                    :disabled="disabled"
                    @update:model-value="(v) => updateTier(idx, { max_gmv: v })"
                  />
                </td>
                <td class="px-3 py-2">
                  <SharedNumberInput
                    :model-value="tier.percent"
                    :min="0"
                    :max="100"
                    :disabled="disabled"
                    @update:model-value="(v) => updateTier(idx, { percent: v ?? 0 })"
                  />
                </td>
                <td class="px-3 py-2 text-right">
                  <UButton
                    icon="i-lucide-trash-2"
                    color="error"
                    variant="ghost"
                    size="xs"
                    :disabled="disabled || revenueShare.tiers.length <= 1"
                    @click="removeTier(idx)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-slate-500 mt-2">
          Cột "Đến" để trống = không giới hạn trên (chỉ áp dụng cho bậc cuối).
        </p>
      </div>
    </div>

    <!-- subscription -->
    <div
      v-else-if="mode === 'subscription'"
      class="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <UFormField
        label="Phí thuê bao (VND)"
        required
        :error="errorOf('amount')"
      >
        <SharedNumberInput
          :model-value="subscription.amount"
          :min="0"
          :disabled="disabled"
          @update:model-value="(v) => updateSubscription('amount', v ?? 0)"
        />
      </UFormField>
      <UFormField
        label="Chu kỳ"
        required
        :error="errorOf('cycle')"
      >
        <URadioGroup
          :model-value="subscription.cycle"
          :items="SUBSCRIPTION_CYCLE_OPTIONS.map(o => ({ value: o.value, label: o.label }))"
          :disabled="disabled"
          orientation="horizontal"
          @update:model-value="(v) => updateSubscription('cycle', v as SubscriptionTerms['cycle'])"
        />
      </UFormField>
    </div>
  </div>
</template>
