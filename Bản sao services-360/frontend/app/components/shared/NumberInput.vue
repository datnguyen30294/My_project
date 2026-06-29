<script setup lang="ts">
interface Props {
  modelValue: number | null | undefined
  placeholder?: string
  min?: number
  max?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  min: undefined,
  max: undefined,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

function formatDisplay(value: number | null | undefined): string {
  if (value == null || value === 0) return ''
  return new Intl.NumberFormat('vi-VN').format(value)
}

const displayValue = ref(formatDisplay(props.modelValue))

watch(() => props.modelValue, (val) => {
  const parsed = parseInput(displayValue.value)
  if (parsed !== val) {
    displayValue.value = formatDisplay(val)
  }
})

function parseInput(raw: string): number | null {
  const cleaned = raw.replace(/\./g, '').replace(/,/g, '.').trim()
  if (cleaned === '') return null
  const num = Number(cleaned)
  return isNaN(num) ? null : num
}

function onInput(value: string | number) {
  const raw = String(value)
  // Allow typing: only strip non-numeric except dots used as thousand sep
  const cleaned = raw.replace(/[^\d]/g, '')
  const num = cleaned === '' ? null : Number(cleaned)

  if (num !== null) {
    displayValue.value = new Intl.NumberFormat('vi-VN').format(num)
  } else {
    displayValue.value = ''
  }

  emit('update:modelValue', num)
}

function onBlur() {
  const num = parseInput(displayValue.value)
  displayValue.value = formatDisplay(num)
}
</script>

<template>
  <UInput
    :model-value="displayValue"
    inputmode="numeric"
    :placeholder="placeholder"
    :disabled="disabled"
    @update:model-value="onInput"
    @blur="onBlur"
  />
</template>
