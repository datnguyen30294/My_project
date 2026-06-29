<script setup lang="ts">
import type {
  CommissionModeValue,
  ContractTerms,
  PerOrderTerms,
  RevenueShareTerms,
  SubscriptionTerms
} from '~/composables/api/usePartnerCommissionContracts'
import { BILLING_PERIOD_OPTIONS, SUBSCRIPTION_CYCLE_OPTIONS } from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  mode: CommissionModeValue
  terms: ContractTerms
}

const props = defineProps<Props>()

const perOrder = computed<PerOrderTerms | null>(() =>
  props.mode === 'per_order' ? (props.terms as PerOrderTerms) : null
)
const revenueShare = computed<RevenueShareTerms | null>(() =>
  props.mode === 'revenue_share' ? (props.terms as RevenueShareTerms) : null
)
const subscription = computed<SubscriptionTerms | null>(() =>
  props.mode === 'subscription' ? (props.terms as SubscriptionTerms) : null
)

function billingLabel(v: string): string {
  return BILLING_PERIOD_OPTIONS.find(o => o.value === v)?.label ?? v
}

function cycleLabel(v: string): string {
  return SUBSCRIPTION_CYCLE_OPTIONS.find(o => o.value === v)?.label ?? v
}

function formatGmv(value: number | null): string {
  if (value === null) return 'Không giới hạn'
  return formatCurrency(value)
}
</script>

<template>
  <!-- per_order -->
  <div
    v-if="perOrder"
    class="space-y-4"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <SharedFieldDisplay label="Phần trăm chiết khấu">
        <span class="font-medium">
          {{ perOrder.percent != null ? formatPercent(perOrder.percent) : '—' }}
        </span>
      </SharedFieldDisplay>
      <SharedFieldDisplay label="Tiền cứng / đơn">
        <span class="font-medium">
          {{ perOrder.fixed != null ? formatCurrency(perOrder.fixed) : '—' }}
        </span>
      </SharedFieldDisplay>
    </div>
  </div>

  <!-- revenue_share -->
  <div
    v-else-if="revenueShare"
    class="space-y-4"
  >
    <SharedFieldDisplay label="Chu kỳ chốt">
      <UBadge
        color="info"
        variant="subtle"
        :label="billingLabel(revenueShare.billing_period)"
      />
    </SharedFieldDisplay>

    <div>
      <h3 class="text-xs font-medium text-slate-500 mb-2">
        Bậc thang doanh thu
      </h3>
      <div class="border border-slate-200 rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="text-right px-4 py-2 font-medium">
                Từ (GMV)
              </th>
              <th class="text-right px-4 py-2 font-medium">
                Đến (GMV)
              </th>
              <th class="text-right px-4 py-2 font-medium w-32">
                Tỉ lệ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tier, idx) in revenueShare.tiers"
              :key="idx"
              class="border-t border-slate-100"
            >
              <td class="px-4 py-2 text-right">
                {{ formatCurrency(tier.min_gmv) }}
              </td>
              <td class="px-4 py-2 text-right">
                {{ formatGmv(tier.max_gmv) }}
              </td>
              <td class="px-4 py-2 text-right font-medium">
                {{ formatPercent(tier.percent) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- subscription -->
  <div
    v-else-if="subscription"
    class="grid grid-cols-1 sm:grid-cols-2 gap-4"
  >
    <SharedFieldDisplay label="Phí thuê bao">
      <span class="font-semibold text-lg">{{ formatCurrency(subscription.amount) }}</span>
    </SharedFieldDisplay>
    <SharedFieldDisplay label="Chu kỳ">
      <UBadge
        color="info"
        variant="subtle"
        :label="cycleLabel(subscription.cycle)"
      />
    </SharedFieldDisplay>
  </div>

  <p
    v-else
    class="text-sm text-slate-400"
  >
    Không có dữ liệu điều khoản.
  </p>
</template>
