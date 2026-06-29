<script setup lang="ts">
import type { AccountResource } from '#api/generated/laravel'
import type { OverrideFormItem, CommissionOverrideRecipientType } from '~/composables/api/useCommissionOverride'

const props = defineProps<{
  orderId: number
  commissionableTotal: number
  platformAmount: number
  existingOverrides: {
    recipient_type: { value: CommissionOverrideRecipientType, label: string }
    account: { id: number, name: string, employee_code: string | null } | null
    amount: string
  }[]
}>()

const emit = defineEmits<{
  saved: []
  close: []
}>()

const toast = useToast()

// ─── Form state ───
const overrides = ref<OverrideFormItem[]>([])
const isSaving = ref(false)

const remainingForOverrides = computed(() =>
  Math.round((props.commissionableTotal - props.platformAmount) * 100) / 100
)

// Init from existing
onMounted(() => {
  if (props.existingOverrides.length > 0) {
    overrides.value = props.existingOverrides.map(o => ({
      recipient_type: o.recipient_type.value,
      account_id: o.account?.id ?? null,
      account_name: o.account?.name ?? OVERRIDE_RECIPIENT_LABELS[o.recipient_type.value] ?? '',
      amount: parseFloat(o.amount) || null
    }))
  } else {
    // Default: Operating Company + Board of Directors
    overrides.value = [
      { recipient_type: 'operating_company', account_id: null, account_name: 'Công ty vận hành', amount: null },
      { recipient_type: 'board_of_directors', account_id: null, account_name: 'Ban quản trị', amount: null }
    ]
  }
})

// ─── Computed ───
const totalOverrides = computed(() =>
  overrides.value.reduce((sum, o) => sum + (o.amount ?? 0), 0)
)

const difference = computed(() =>
  Math.round((remainingForOverrides.value - totalOverrides.value) * 100) / 100
)

const isBalanced = computed(() => Math.abs(difference.value) < 0.01)

// ─── Account search (server-side, debounced) ───
const accountSearchTerm = ref('')
const accountSearchResults = ref<{ label: string, value: number, name: string }[]>([])
const isSearchingAccounts = ref(false)
let accountSearchTimeout: ReturnType<typeof setTimeout>

// Map of selected account IDs → display info (so USelectMenu can always resolve labels)
const selectedAccountMap = ref<Map<number, { label: string, name: string }>>(new Map())

// Init map from existing overrides
onMounted(() => {
  for (const o of props.existingOverrides) {
    if (o.account?.id) {
      const label = `${o.account.name}${o.account.employee_code ? ` (${o.account.employee_code})` : ''}`
      selectedAccountMap.value.set(o.account.id, { label, name: o.account.name })
    }
  }
})

async function fetchAccounts(search?: string) {
  isSearchingAccounts.value = true
  try {
    const query: Record<string, unknown> = { is_active: 1, per_page: 20 }
    if (search) query.search = search
    const res = await $api<{ data: AccountResource[] }>('/pmc/accounts', { query })
    accountSearchResults.value = (res.data ?? []).map(acc => ({
      label: `${acc.name}${acc.employee_code ? ` (${acc.employee_code})` : ''}`,
      value: acc.id,
      name: acc.name
    }))
  } catch {
    accountSearchResults.value = []
  } finally {
    isSearchingAccounts.value = false
  }
}

// Load initial list
onMounted(() => {
  fetchAccounts()
})

watch(accountSearchTerm, (val) => {
  clearTimeout(accountSearchTimeout)
  accountSearchTimeout = setTimeout(() => fetchAccounts(val || undefined), 300)
})

/** Items for a specific row: includes own selection (for label) but excludes other rows' selections */
function getAccountItemsForRow(rowIndex: number): { label: string, value: number, name: string }[] {
  const ownAccountId = overrides.value[rowIndex]?.account_id
  const otherSelectedIds = new Set(
    overrides.value
      .filter((o, i) => i !== rowIndex && o.account_id)
      .map(o => o.account_id)
  )

  const items = new Map<number, { label: string, value: number, name: string }>()

  // Add own selected account so label resolves
  if (ownAccountId && selectedAccountMap.value.has(ownAccountId)) {
    const info = selectedAccountMap.value.get(ownAccountId)!
    items.set(ownAccountId, { label: info.label, value: ownAccountId, name: info.name })
  }

  // Add search results, excluding accounts selected in other rows
  for (const r of accountSearchResults.value) {
    if (!otherSelectedIds.has(r.value)) {
      items.set(r.value, r)
    }
  }

  return Array.from(items.values())
}

// ─── Actions ───
function addStaff() {
  overrides.value.push({
    recipient_type: 'staff',
    account_id: null,
    account_name: '',
    amount: null
  })
}

function removeOverride(index: number) {
  overrides.value.splice(index, 1)
}

function onAccountSelect(index: number, accountId: number) {
  const items = getAccountItemsForRow(index)
  const option = items.find(o => o.value === accountId)
  if (option) {
    overrides.value[index]!.account_id = accountId
    overrides.value[index]!.account_name = option.name
    selectedAccountMap.value.set(accountId, { label: option.label, name: option.name })
  }
}

function fillRemaining(index: number) {
  const otherSum = overrides.value.reduce((sum, o, i) => i === index ? sum : sum + (o.amount ?? 0), 0)
  overrides.value[index]!.amount = Math.round((remainingForOverrides.value - otherSum) * 100) / 100
}

// ─── Submit ───
async function handleSave() {
  if (!isBalanced.value) {
    toast.add({ title: 'Tổng tiền chưa khớp', color: 'error' })
    return
  }

  // Validate staff has account_id
  const invalidStaff = overrides.value.find(o => o.recipient_type === 'staff' && !o.account_id)
  if (invalidStaff) {
    toast.add({ title: 'Vui lòng chọn nhân viên cho tất cả dòng nhân viên', color: 'error' })
    return
  }

  isSaving.value = true
  try {
    await apiSaveCommissionOverride(props.orderId, {
      overrides: overrides.value.map(o => ({
        recipient_type: o.recipient_type,
        account_id: o.account_id,
        amount: o.amount ?? 0
      }))
    })
    toast.add({ title: 'Đã lưu điều chỉnh hoa hồng', color: 'success' })
    emit('saved')
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu thất bại'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <UModal
    :open="true"
    @update:open="(v) => !v && emit('close')"
  >
    <template #header>
      <div>
        <h3 class="text-lg font-bold text-slate-900">
          Điều chỉnh hoa hồng
        </h3>
        <p class="text-sm text-slate-500 mt-0.5">
          Tổng tiền dịch vụ: {{ formatCurrency(commissionableTotal) }}
        </p>
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <!-- Platform (read-only) -->
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm font-semibold text-slate-700">Platform</span>
            </div>
            <span class="text-sm font-bold text-slate-900">{{ formatCurrency(platformAmount) }}</span>
          </div>
        </div>

        <!-- Remaining to distribute -->
        <div class="p-2 bg-blue-50 rounded-lg text-sm text-blue-700 text-center font-medium">
          Số tiền cần phân bổ: {{ formatCurrency(remainingForOverrides) }}
        </div>

        <!-- Override rows -->
        <div class="flex flex-col gap-3">
          <div
            v-for="(item, idx) in overrides"
            :key="idx"
            class="p-3 rounded-lg border border-slate-200"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-slate-700">
                <template v-if="item.recipient_type === 'staff'">
                  Nhân viên
                </template>
                <template v-else>
                  {{ OVERRIDE_RECIPIENT_LABELS[item.recipient_type] }}
                </template>
              </span>
              <div class="flex items-center gap-1">
                <UButton
                  icon="i-lucide-calculator"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  title="Tự điền số tiền còn lại"
                  @click="fillRemaining(idx)"
                />
                <UButton
                  v-if="item.recipient_type === 'staff'"
                  icon="i-lucide-trash-2"
                  size="xs"
                  color="error"
                  variant="ghost"
                  @click="removeOverride(idx)"
                />
              </div>
            </div>

            <div
              class="grid grid-cols-1 gap-2"
              :class="item.recipient_type === 'staff' ? 'sm:grid-cols-2' : ''"
            >
              <!-- Account select for staff -->
              <UFormField
                v-if="item.recipient_type === 'staff'"
                label="Tài khoản"
              >
                <USelectMenu
                  :model-value="item.account_id ?? undefined"
                  :items="getAccountItemsForRow(idx)"
                  value-key="value"
                  ignore-filter
                  :loading="isSearchingAccounts"
                  :search-input="{ placeholder: 'Gõ tên hoặc mã NV...' }"
                  placeholder="Chọn nhân viên..."
                  @update:model-value="onAccountSelect(idx, $event as number)"
                  @update:search-term="accountSearchTerm = $event"
                />
              </UFormField>

              <!-- Amount -->
              <UFormField label="Số tiền (đ)">
                <SharedNumberInput
                  v-model="item.amount"
                  :min="0"
                  placeholder="0"
                />
              </UFormField>
            </div>
          </div>
        </div>

        <!-- Add staff button -->
        <UButton
          icon="i-lucide-plus"
          label="Thêm người nhận"
          color="primary"
          variant="soft"
          size="sm"
          @click="addStaff"
        />

        <!-- Total validation -->
        <div
          class="p-3 rounded-lg text-sm font-medium text-center"
          :class="isBalanced
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'"
        >
          <template v-if="isBalanced">
            Tổng phân bổ: {{ formatCurrency(totalOverrides) }} ✓
          </template>
          <template v-else>
            Tổng phân bổ: {{ formatCurrency(totalOverrides) }} / {{ formatCurrency(remainingForOverrides) }}
            — {{ difference > 0 ? `thiếu ${formatCurrency(difference)}` : `dư ${formatCurrency(Math.abs(difference))}` }}
          </template>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Hủy"
          color="neutral"
          variant="ghost"
          @click="emit('close')"
        />
        <UButton
          label="Lưu"
          icon="i-lucide-save"
          color="primary"
          :loading="isSaving"
          :disabled="!isBalanced"
          @click="handleSave"
        />
      </div>
    </template>
  </UModal>
</template>
