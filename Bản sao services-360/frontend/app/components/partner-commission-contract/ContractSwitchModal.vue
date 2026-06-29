<script setup lang="ts">
import type { ContractDetail, ContractListItem } from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  open: boolean
  current: ContractListItem | ContractDetail | null
  target: ContractListItem | ContractDetail | null
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
}>()

const CONFIRM_TEXT = 'XÁC NHẬN'
const typed = ref('')

const canConfirm = computed(() => typed.value.trim().toUpperCase() === CONFIRM_TEXT)

function handleClose(value: boolean): void {
  if (!value) typed.value = ''
  emit('update:open', value)
}

const requiresAntiMisclick = computed(() => Boolean(props.current))
</script>

<template>
  <UModal
    :open="open"
    title="Kích hoạt hợp đồng"
    :ui="{ content: 'sm:max-w-3xl' }"
    @update:open="handleClose"
  >
    <template #body>
      <div class="space-y-4">
        <UAlert
          v-if="requiresAntiMisclick"
          color="warning"
          variant="subtle"
          icon="i-lucide-alert-triangle"
          title="Hợp đồng hiện tại sẽ chuyển sang 'Đã bị thay thế'"
          description="Sau khi xác nhận, không thể quay lại hợp đồng cũ. Đơn cũ giữ nguyên hợp đồng đã gán; đơn mới sẽ tính theo hợp đồng mới."
        />
        <UAlert
          v-else
          color="info"
          variant="subtle"
          icon="i-lucide-info"
          description="Hợp đồng này sẽ được kích hoạt cho vendor × dự án. Đơn mới sẽ áp dụng điều khoản trong hợp đồng."
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-if="current"
            class="border border-slate-200 rounded-lg p-4 bg-slate-50"
          >
            <p class="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-2">
              Hợp đồng hiện tại
            </p>
            <div class="flex items-center gap-2 mb-3">
              <span class="font-mono font-semibold text-slate-900">{{ current.contract_code }}</span>
              <PartnerCommissionContractStatusBadge :status="current.status" />
            </div>
            <PartnerCommissionContractModeBadge :mode="current.commission_mode" />
            <p class="text-xs text-slate-500 mt-2">
              Hiệu lực: {{ current.starts_at ? formatDate(current.starts_at) : '—' }}
              → {{ current.ends_at ? formatDate(current.ends_at) : 'Không thời hạn' }}
            </p>
            <PartnerCommissionContractTermsViewer
              v-if="'terms' in current"
              :mode="current.commission_mode.value"
              :terms="(current as ContractDetail).terms"
              class="mt-3"
            />
          </div>
          <div
            v-else
            class="border border-dashed border-slate-200 rounded-lg p-4 flex items-center justify-center text-sm text-slate-400"
          >
            Chưa có hợp đồng đang hiệu lực
          </div>

          <div
            v-if="target"
            class="border-2 border-emerald-300 rounded-lg p-4 bg-emerald-50/50"
          >
            <p class="text-xs uppercase tracking-wide font-semibold text-emerald-700 mb-2">
              Sẽ kích hoạt
            </p>
            <div class="flex items-center gap-2 mb-3">
              <span class="font-mono font-semibold text-slate-900">{{ target.contract_code }}</span>
              <PartnerCommissionContractStatusBadge :status="target.status" />
            </div>
            <PartnerCommissionContractModeBadge :mode="target.commission_mode" />
            <p class="text-xs text-slate-500 mt-2">
              Hiệu lực: {{ target.starts_at ? formatDate(target.starts_at) : '—' }}
              → {{ target.ends_at ? formatDate(target.ends_at) : 'Không thời hạn' }}
            </p>
            <PartnerCommissionContractTermsViewer
              v-if="'terms' in target"
              :mode="target.commission_mode.value"
              :terms="(target as ContractDetail).terms"
              class="mt-3"
            />
          </div>
        </div>

        <UFormField
          v-if="requiresAntiMisclick"
          :label="`Nhập '${CONFIRM_TEXT}' để tiếp tục`"
          required
        >
          <UInput
            v-model="typed"
            :placeholder="CONFIRM_TEXT"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Huỷ"
          @click="handleClose(false)"
        />
        <UButton
          color="primary"
          icon="i-lucide-check-circle"
          :label="loading ? 'Đang kích hoạt...' : 'Xác nhận kích hoạt'"
          :loading="loading"
          :disabled="loading || (requiresAntiMisclick && !canConfirm)"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </UModal>
</template>
