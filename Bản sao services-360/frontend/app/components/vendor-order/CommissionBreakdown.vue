<script setup lang="ts">
import type { VendorOrderCommission } from '~/composables/api/useVendorOrders'
import {
  platformContractLocation,
  tenantContractLocation
} from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  commission: VendorOrderCommission | null
  vendorId: number | string
  projectId: number | string
  scope?: 'tenant' | 'platform'
}

const props = withDefaults(defineProps<Props>(), { scope: 'tenant' })

const contractLink = computed(() => {
  if (!props.commission || !props.commission.contract) return undefined
  return props.scope === 'platform'
    ? platformContractLocation(props.vendorId, props.commission.contract.id)
    : tenantContractLocation(props.vendorId, props.projectId, props.commission.contract.id)
})
</script>

<template>
  <div
    v-if="commission"
    class="space-y-4"
  >
    <div
      v-if="commission.contract"
      class="flex items-center gap-2 flex-wrap"
    >
      <span class="text-sm text-slate-600">Hợp đồng:</span>
      <NuxtLink
        :to="contractLink"
        class="font-mono font-semibold text-primary-700 hover:underline"
      >
        {{ commission.contract.code }}
      </NuxtLink>
      <UBadge
        color="info"
        variant="subtle"
        size="sm"
      >
        {{ commission.contract.mode.label }}
      </UBadge>
    </div>
    <div
      v-else-if="commission.is_manual"
      class="flex items-center gap-2 flex-wrap"
    >
      <UBadge
        color="warning"
        variant="subtle"
        size="sm"
        icon="i-lucide-hand-coins"
      >
        Hoa hồng gán thủ công
      </UBadge>
      <UBadge
        v-if="commission.revenue_recipient"
        color="neutral"
        variant="subtle"
        size="sm"
      >
        {{ commission.revenue_recipient.label }}
      </UBadge>
    </div>
    <div
      v-else
      class="flex items-center gap-2 flex-wrap"
    >
      <UBadge
        color="neutral"
        variant="subtle"
        size="sm"
        icon="i-lucide-circle-dashed"
      >
        Hoa hồng mặc định 0đ
      </UBadge>
      <span class="text-xs text-slate-500">Chưa có hợp đồng hoa hồng cho dự án này</span>
    </div>
    <p
      v-if="commission.applied_at"
      class="text-xs text-slate-500"
    >
      Áp dụng lúc: {{ formatDateTime(commission.applied_at) }}
    </p>

    <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
      <div
        v-if="commission.formula.capped_at_total"
        class="text-amber-700 font-medium"
      >
        Tiền cứng ({{ formatCurrency(commission.formula.fixed) }}) ≥ Tổng đơn → lấy trọn đơn
      </div>
      <template v-else>
        <div class="flex justify-between">
          <span class="text-slate-600">Tiền cứng</span>
          <span class="font-medium">{{ formatCurrency(commission.formula.fixed) }}</span>
        </div>
        <div class="flex justify-between text-slate-500 text-xs">
          <span>Còn lại sau tiền cứng</span>
          <span>{{ formatCurrency(commission.formula.remainder_after_fixed) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-600">Phần trăm ({{ formatPercent(commission.formula.percent) }})</span>
          <span class="font-medium">{{ formatCurrency(commission.formula.percent_amount) }}</span>
        </div>
      </template>
      <div class="border-t border-slate-300 pt-2 mt-2 flex justify-between text-base">
        <span class="font-semibold">TỔNG HOA HỒNG</span>
        <span class="font-bold text-primary-700">{{ formatCurrency(commission.amount) }}</span>
      </div>
    </div>
  </div>
  <UAlert
    v-else
    color="info"
    variant="subtle"
    icon="i-lucide-clock"
    title="Hoa hồng chưa phát sinh"
    description="Đơn chưa hoàn thành — hoa hồng chỉ tính khi đơn ở trạng thái hoàn thành."
  />
</template>
