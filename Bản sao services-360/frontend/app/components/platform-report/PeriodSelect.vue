<script setup lang="ts">
/**
 * Bộ chọn kỳ (số tháng) dùng chung cho các báo cáo platform. Mặc định 6 tháng.
 * Đổi giá trị → page tự `refresh()` qua watch query.
 */
const months = defineModel<number>({ required: true })

const items = [
  { label: '1 tháng', value: 1 },
  { label: '3 tháng', value: 3 },
  { label: '6 tháng', value: 6 },
  { label: '12 tháng', value: 12 }
]
</script>

<template>
  <USelect
    v-model="months"
    :items="items"
    value-key="value"
    icon="i-lucide-calendar"
    class="min-w-[140px]"
  />
</template>
