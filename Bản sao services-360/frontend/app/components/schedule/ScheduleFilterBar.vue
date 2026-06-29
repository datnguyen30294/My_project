<script setup lang="ts">
/**
 * Generic filter bar wrapper — slot-based so callers compose the exact filters they need.
 */
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 rounded-lg border border-border-gray bg-white p-3">
    <slot />
  </div>
</template>
