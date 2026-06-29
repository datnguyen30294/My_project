<script setup lang="ts">
defineProps<{
  errors?: string[]
}>()
</script>

<template>
  <p
    v-if="errors?.length"
    class="text-sm text-[var(--ui-error)] mt-1"
  >
    {{ errors[0] }}
  </p>
</template>
