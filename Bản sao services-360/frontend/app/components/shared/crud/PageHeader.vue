<script setup lang="ts">
interface Props {
  title: string
  description?: string
  createTo?: string
  createLabel?: string
}

withDefaults(defineProps<Props>(), {
  createLabel: 'Thêm mới'
})
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
    <div>
      <h1 class="text-xl font-bold text-slate-900">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="mt-1 text-sm text-nav-text-secondary"
      >
        {{ description }}
      </p>
    </div>
    <slot name="actions">
      <NuxtLink
        v-if="createTo"
        :to="createTo"
        class="flex items-center gap-2 bg-[#0f0f29] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:opacity-90 transition-opacity"
      >
        <span
          class="material-symbols-outlined"
          style="font-size:20px"
        >add</span>
        {{ createLabel }}
      </NuxtLink>
    </slot>
  </div>
</template>
