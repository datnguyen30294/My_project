<script setup lang="ts">
import type {
  DeptRuleForm,
  CommissionValueType,
  AvailableDepartmentAccount
} from '~/composables/api/useCommissionConfig'

interface Props {
  availableAccounts: AvailableDepartmentAccount[]
}

const props = defineProps<Props>()
const model = defineModel<DeptRuleForm>({ required: true })

const showPercent = computed(() =>
  model.value.value_type === 'percent' || model.value.value_type === 'both'
)

const showFixed = computed(() =>
  model.value.value_type === 'fixed' || model.value.value_type === 'both'
)

const selectedStaff = computed(() =>
  model.value.staff_rules.filter(s => s.selected)
)

const staffPercentSum = computed(() =>
  selectedStaff.value
    .filter(s => s.value_type === 'percent' || s.value_type === 'both')
    .reduce((sum, s) => sum + (s.percent ?? 0), 0)
)

function onSelectedChange(checked: boolean | 'indeterminate') {
  model.value.selected = checked === true
}

function onValueTypeChange(val: CommissionValueType) {
  model.value.value_type = val
  if (val === 'percent') model.value.value_fixed = null
  if (val === 'fixed') model.value.percent = null
}

function toggleExpand() {
  model.value.expanded = !model.value.expanded

  // Auto-init staff rules on first expand if no staff rules exist yet
  if (model.value.expanded && model.value.staff_rules.length === 0) {
    initStaffRules()
  }
}

function initStaffRules() {
  const accounts = props.availableAccounts
  if (accounts.length === 0) return

  const evenPercent = Math.round(100 / accounts.length * 100) / 100

  model.value.staff_rules = accounts.map((acc, idx) => {
    const isLast = idx === accounts.length - 1
    const percent = isLast
      ? Math.round((100 - evenPercent * (accounts.length - 1)) * 100) / 100
      : evenPercent

    return {
      account_id: acc.id,
      account_name: acc.name,
      employee_code: acc.employee_code,
      selected: true,
      sort_order: idx + 1,
      value_type: 'percent' as CommissionValueType,
      percent,
      value_fixed: null
    }
  })
}
</script>

<template>
  <div
    class="rounded-xl border"
    :class="model.selected ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50/50'"
  >
    <!-- Header row -->
    <div class="p-4">
      <div class="flex items-center gap-3">
        <UCheckbox
          :model-value="model.selected"
          @update:model-value="onSelectedChange"
        />
        <span
          class="text-sm font-semibold cursor-pointer select-none hover:text-primary-600 transition-colors text-slate-900"
          @click="onSelectedChange(!model.selected)"
        >
          {{ model.department_name }}
        </span>
      </div>

      <!-- Config inputs (only when selected) -->
      <div
        v-if="model.selected"
        class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pl-7"
      >
        <UFormField label="Thứ tự">
          <UInput
            v-model.number="model.sort_order"
            type="number"
            :min="1"
            size="sm"
          />
        </UFormField>

        <UFormField label="Loại">
          <USelect
            :model-value="model.value_type"
            :items="COMMISSION_VALUE_TYPE_OPTIONS"
            value-key="value"
            size="sm"
            @update:model-value="onValueTypeChange"
          />
        </UFormField>

        <UFormField
          v-if="showPercent"
          label="Phần trăm (%)"
        >
          <UInput
            v-model.number="model.percent"
            type="number"
            :min="0"
            :max="100"
            :step="0.01"
            size="sm"
          />
        </UFormField>

        <UFormField
          v-if="showFixed"
          label="Tiền cứng (đ)"
        >
          <SharedNumberInput
            v-model="model.value_fixed"
            :min="0"
          />
        </UFormField>
      </div>

      <!-- Expand toggle -->
      <div
        v-if="model.selected"
        class="mt-3 pl-7"
      >
        <UButton
          :icon="model.expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          :label="`Chỉ định cá nhân (${availableAccounts.length} NV)`"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="toggleExpand"
        />
      </div>
    </div>

    <!-- Staff rules (expanded) -->
    <div
      v-if="model.selected && model.expanded"
      class="border-t border-slate-100 p-4 bg-slate-50/30"
    >
      <div
        v-if="model.staff_rules.length === 0"
        class="text-sm text-slate-400 italic"
      >
        Không có nhân viên nào thuộc phòng ban này trong dự án.
      </div>

      <div
        v-else
        class="flex flex-col gap-2"
      >
        <CommissionStaffRuleRow
          v-for="(staff, idx) in model.staff_rules"
          :key="staff.account_id"
          v-model="model.staff_rules[idx]!"
        />

        <!-- Staff percent summary -->
        <div class="mt-2 text-xs font-medium">
          <span
            v-if="staffPercentSum === 100"
            class="text-emerald-600"
          >
            Tổng %: 100% ✓
          </span>
          <span
            v-else-if="selectedStaff.some(s => s.value_type === 'percent' || s.value_type === 'both')"
            class="text-red-500"
          >
            Tổng %: {{ staffPercentSum }}% (phải bằng 100%)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
