<script setup lang="ts">
interface Props {
  status: string
  error: unknown
  data: unknown
  refresh?: () => void
}

const props = defineProps<Props>()

const hasLoadedOnce = ref(false)

watch(() => props.data, (val) => {
  if (val) hasLoadedOnce.value = true
}, { immediate: true })

const isInitialLoading = computed(() => !hasLoadedOnce.value && !props.error)
const isRefetching = computed(() => props.status === 'pending' && hasLoadedOnce.value)
</script>

<template>
  <!-- Initial load: spinner -->
  <div
    v-if="isInitialLoading"
    class="flex items-center justify-center py-20"
  >
    <UIcon
      name="i-lucide-loader-circle"
      class="size-8 animate-spin text-[var(--ui-primary)]"
    />
  </div>

  <!-- Error state -->
  <SharedCrudPageError
    v-else-if="error"
    :error="error"
    :retry="refresh"
  />

  <!-- Content with refetch overlay -->
  <div
    v-else
    class="relative"
  >
    <div
      v-if="isRefetching"
      class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[var(--ui-bg)]/60"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-6 animate-spin text-[var(--ui-primary)]"
      />
    </div>
    <div :class="{ 'pointer-events-none': isRefetching }">
      <slot />
    </div>
  </div>
</template>
