<script setup lang="ts">
import type { CashAccountResource } from '~/composables/api/useTreasury'

defineProps<{
  account: CashAccountResource
}>()
</script>

<template>
  <UCard>
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <!-- Left: account info -->
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-slate-900 text-base">{{ account.name }}</span>
          <UBadge
            :label="account.type.label"
            variant="subtle"
            color="primary"
            size="sm"
          />
        </div>
        <div class="text-sm text-slate-500">
          Mã: <span class="font-mono text-slate-700">{{ account.code }}</span>
        </div>
        <div class="text-sm text-slate-500">
          Số dư đầu kỳ: <span class="font-medium text-slate-700">{{ formatCurrency(account.opening_balance) }}</span>
        </div>
        <!-- Bank info (only if type=bank) -->
        <template v-if="account.type.value === 'bank' && account.bank_account_number">
          <div class="text-sm text-slate-500 mt-1">
            Ngân hàng: <span class="font-medium text-slate-700">{{ account.bank_account_number }}</span>
            <template v-if="account.bank_account_name">
              — {{ account.bank_account_name }}
            </template>
          </div>
        </template>
      </div>

      <!-- Right: current balance (large highlight) -->
      <div class="sm:text-right">
        <div class="text-xs text-slate-500 mb-0.5 uppercase tracking-wide">
          Số dư hiện tại
        </div>
        <div
          class="text-2xl font-bold tabular-nums"
          :class="account.current_balance && parseFloat(account.current_balance) < 0 ? 'text-rose-800' : 'text-slate-900'"
        >
          {{ account.current_balance != null ? formatCurrency(account.current_balance) : '—' }}
        </div>
      </div>
    </div>
  </UCard>
</template>
