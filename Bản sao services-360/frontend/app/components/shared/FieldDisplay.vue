<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div>
    <h2 class="text-xs font-medium text-slate-500 mb-1">
      {{ label }}
    </h2>
    <div class="text-slate-900 text-sm">
      <slot />
    </div>
  </div>
</template>
