<script setup lang="ts">
defineProps<{
  title: string
  compact?: boolean
  icon?: string
}>()
</script>

<template>
  <div class="bg-white border border-border-gray rounded-xl shadow-sm overflow-hidden">
    <div
      class="border-b border-border-gray flex items-center justify-between"
      :class="compact ? 'px-5 py-4' : 'px-6 py-4'"
    >
      <h2
        class="flex items-center gap-2"
        :class="compact ? 'font-bold text-slate-900 text-sm' : 'font-bold text-slate-900'"
      >
        <UIcon
          v-if="icon"
          :name="icon"
          class="text-primary shrink-0"
          :class="compact ? 'size-4' : 'size-5'"
        />
        {{ title }}
      </h2>
      <div
        v-if="$slots['header-actions']"
        class="flex items-center gap-2"
      >
        <slot name="header-actions" />
      </div>
    </div>
    <div :class="compact ? 'px-5 py-4' : 'px-6 py-5'">
      <slot />
    </div>
  </div>
</template>
