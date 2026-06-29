<script setup lang="ts">
import type { StaffRuleForm, CommissionValueType } from '~/composables/api/useCommissionConfig'

const model = defineModel<StaffRuleForm>({ required: true })

const showPercent = computed(() =>
  model.value.value_type === 'percent' || model.value.value_type === 'both'
)

const showFixed = computed(() =>
  model.value.value_type === 'fixed' || model.value.value_type === 'both'
)

function onSelectedChange(checked: boolean | 'indeterminate') {
  model.value.selected = checked === true
}

function onValueTypeChange(val: CommissionValueType) {
  model.value.value_type = val
  if (val === 'percent') model.value.value_fixed = null
  if (val === 'fixed') model.value.percent = null
}
</script>

<template>
  <div
    class="rounded-lg border p-3"
    :class="model.selected ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50/50'"
  >
    <div class="flex items-center gap-3">
      <UCheckbox
        :model-value="model.selected"
        @update:model-value="onSelectedChange"
      />
      <span
        class="text-sm"
        :class="model.selected ? 'font-medium text-slate-900' : 'text-slate-400'"
      >
        {{ model.account_name }}
        <span
          v-if="model.employee_code"
          class="text-xs text-slate-400 font-mono"
        >({{ model.employee_code }})</span>
      </span>
    </div>

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
  </div>
</template>
