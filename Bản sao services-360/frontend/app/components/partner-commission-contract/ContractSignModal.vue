<script setup lang="ts">
import type { ContractDetail } from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  open: boolean
  contract: ContractDetail | null
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
}>()
</script>

<template>
  <UModal
    :open="open"
    title="Ký hợp đồng"
    :ui="{ content: 'sm:max-w-2xl' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div
        v-if="contract"
        class="space-y-4"
      >
        <UAlert
          color="warning"
          variant="subtle"
          icon="i-lucide-shield-alert"
          title="Sau khi ký, KHÔNG sửa được điều khoản tài chính"
          description="Để thay đổi sau khi đã ký, bạn cần thu hồi hợp đồng và tạo bản nháp mới."
        />

        <div class="grid grid-cols-2 gap-4 text-sm">
          <SharedFieldDisplay label="Mã hợp đồng">
            <span class="font-mono">{{ contract.contract_code }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Vendor">
            {{ contract.partner?.name ?? `#${contract.partner_id}` }}
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Tenant">
            {{ contract.tenant_id }}
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Project">
            #{{ contract.project_id }}
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Loại hợp đồng">
            <PartnerCommissionContractModeBadge :mode="contract.commission_mode" />
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Hiệu lực">
            {{ contract.starts_at ? formatDate(contract.starts_at) : '—' }}
            →
            {{ contract.ends_at ? formatDate(contract.ends_at) : 'Không thời hạn' }}
          </SharedFieldDisplay>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-slate-700 mb-2">
            Điều khoản
          </h3>
          <PartnerCommissionContractTermsViewer
            :mode="contract.commission_mode.value"
            :terms="contract.terms"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Huỷ"
          @click="emit('update:open', false)"
        />
        <UButton
          color="primary"
          icon="i-lucide-file-signature"
          :label="loading ? 'Đang ký...' : 'Xác nhận ký'"
          :loading="loading"
          :disabled="loading"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </UModal>
</template>
