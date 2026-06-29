<script setup lang="ts">
interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v)
})

const label = computed(() => formatMonthTitle(value.value))

function shiftMonth(delta: number) {
  const [y, m] = value.value.split('-').map(Number)
  const next = new Date(y!, m! - 1 + delta, 1)
  const yy = next.getFullYear()
  const mm = String(next.getMonth() + 1).padStart(2, '0')
  value.value = `${yy}-${mm}`
}
</script>

<template>
  <div class="inline-flex items-center gap-1 rounded-md border border-border-gray bg-white">
    <UButton
      icon="i-lucide-chevron-left"
      variant="ghost"
      color="neutral"
      size="sm"
      aria-label="Tháng trước"
      @click="shiftMonth(-1)"
    />
    <label class="relative cursor-pointer px-2 py-1 text-sm font-medium text-slate-700 select-none">
      {{ label }}
      <input
        v-model="value"
        type="month"
        class="absolute inset-0 opacity-0 cursor-pointer"
      >
    </label>
    <UButton
      icon="i-lucide-chevron-right"
      variant="ghost"
      color="neutral"
      size="sm"
      aria-label="Tháng sau"
      @click="shiftMonth(1)"
    />
  </div>
</template>
