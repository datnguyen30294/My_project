<script setup lang="ts">
import type {
  AssignCommissionOverridePayload,
  CommissionOverrideSource,
  VendorOrderCommission,
  VendorOrderDetail
} from '~/composables/api/useVendorOrders'
import { apiAssignVendorOrderCommission } from '~/composables/api/useVendorOrders'
import type { RevenueRecipientValue } from '~/composables/api/usePartnerCommissionContracts'
import {
  REVENUE_RECIPIENT_OPTIONS,
  usePlatformContractList
} from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  open: boolean
  partnerId: number | string
  orderId: number | string
  /** Hoa hồng hiện tại (nếu đang sửa override thủ công) để prefill. */
  commission?: VendorOrderCommission | null
}

const props = withDefaults(defineProps<Props>(), { commission: null })

const emit = defineEmits<{
  'update:open': [value: boolean]
  'assigned': [detail: VendorOrderDetail]
}>()

const toast = useToast()

const source = ref<CommissionOverrideSource>('manual')
const contractId = ref<number | undefined>(undefined)
const fixed = ref(0)
const percent = ref(0)
const recipient = ref<RevenueRecipientValue>('platform')
const note = ref('')
const submitting = ref(false)

const sourceItems: { label: string, value: CommissionOverrideSource }[] = [
  { label: 'Nhập thủ công (tiền cứng / %)', value: 'manual' },
  { label: 'Sao chép từ hợp đồng có sẵn', value: 'contract' }
]

const { data: contractsData, status: contractsStatus } = usePlatformContractList(
  computed(() => ({
    partner_id: Number(props.partnerId),
    commission_mode: 'per_order' as const,
    per_page: SELECT_ALL_PER_PAGE
  }))
)
const contractItems = computed(() =>
  (contractsData.value?.data ?? []).map(c => ({
    label: `${c.contract_code} · ${c.revenue_recipient.label}`,
    value: c.id
  }))
)

function resetForm(): void {
  const f = props.commission?.formula
  source.value = 'manual'
  contractId.value = undefined
  fixed.value = f ? f.fixed : 0
  percent.value = f ? f.percent : 0
  recipient.value = props.commission?.revenue_recipient?.value ?? 'platform'
  note.value = ''
}

watch(() => props.open, (open) => {
  if (open) resetForm()
})

const canSubmit = computed(() => {
  if (source.value === 'contract') return contractId.value !== undefined
  return percent.value >= 0 && percent.value <= 100 && fixed.value >= 0
})

async function submit(): Promise<void> {
  if (!canSubmit.value) return
  submitting.value = true

  const payload: AssignCommissionOverridePayload = source.value === 'contract'
    ? { source: 'contract', contract_id: contractId.value, note: note.value || null }
    : {
        source: 'manual',
        fixed: Number(fixed.value),
        percent: Number(percent.value),
        revenue_recipient: recipient.value,
        note: note.value || null
      }

  try {
    const res = await apiAssignVendorOrderCommission(props.partnerId, props.orderId, payload)
    toast.add({ title: 'Đã gán hoa hồng cho đơn', color: 'success', icon: 'i-lucide-check-circle' })
    emit('assigned', res.data)
    emit('update:open', false)
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Gán hoa hồng thất bại'), color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal
    :open="open"
    title="Gán hoa hồng cho đơn"
    description="Đơn đã hoàn thành nhưng chưa có hợp đồng hoa hồng áp dụng. Gán thủ công để tính hoa hồng cho đơn này."
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField label="Nguồn hoa hồng">
          <USelect
            v-model="source"
            :items="sourceItems"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <template v-if="source === 'contract'">
          <UFormField
            label="Hợp đồng (per_order)"
            help="Sao chép điều khoản & bên nhận từ hợp đồng đã chọn."
          >
            <USelectMenu
              v-model="contractId"
              :items="contractItems"
              value-key="value"
              :loading="contractsStatus === 'pending'"
              searchable
              placeholder="Chọn hợp đồng"
              class="w-full"
            />
          </UFormField>
          <UAlert
            v-if="contractsStatus !== 'pending' && contractItems.length === 0"
            color="warning"
            variant="subtle"
            icon="i-lucide-alert-triangle"
            description="Vendor này chưa có hợp đồng per_order nào. Hãy nhập thủ công."
          />
        </template>

        <template v-else>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Tiền cứng (VND)">
              <SharedNumberInput
                v-model="fixed"
                :min="0"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Phần trăm (%)">
              <UInput
                v-model.number="percent"
                type="number"
                :min="0"
                :max="100"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="Hoa hồng thuộc về">
            <USelect
              v-model="recipient"
              :items="REVENUE_RECIPIENT_OPTIONS"
              value-key="value"
              class="w-full"
            />
          </UFormField>
        </template>

        <UFormField
          label="Ghi chú"
          hint="Tuỳ chọn"
        >
          <UTextarea
            v-model="note"
            :rows="2"
            placeholder="Lý do gán hoa hồng thủ công..."
            class="w-full"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          color="neutral"
          variant="ghost"
          label="Huỷ"
          @click="emit('update:open', false)"
        />
        <UButton
          color="primary"
          label="Lưu hoa hồng"
          icon="i-lucide-hand-coins"
          :loading="submitting"
          :disabled="!canSubmit"
          @click="submit"
        />
      </div>
    </template>
  </UModal>
</template>
