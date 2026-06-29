<script setup lang="ts">
interface Props {
  error: unknown
  retry?: () => void
}

const props = defineProps<Props>()

const errorInfo = computed(() => formatPageError(props.error))
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <UIcon
      name="i-lucide-circle-x"
      class="size-12 text-[var(--ui-error)]"
    />
    <h3 class="mt-3 text-lg font-semibold">
      {{ errorInfo.title }}
    </h3>
    <p class="mt-1 text-sm text-[var(--ui-text-muted)]">
      {{ errorInfo.description }}
    </p>
    <UButton
      v-if="retry"
      label="Thử lại"
      icon="i-lucide-refresh-cw"
      color="neutral"
      variant="outline"
      class="mt-4"
      @click="retry"
    />
  </div>
</template>
