<script setup lang="ts">
/**
 * Header dùng chung cho các trang báo cáo chi tiết platform: tiêu đề + mô tả
 * bên trái; slot `filters` (bộ chọn kỳ…) + nút "Hub báo cáo" + slot `actions`
 * bên phải.
 */
interface Props {
  title: string
  description?: string
  /** Ẩn nút quay về Hub (dùng cho chính trang Hub). */
  hideHub?: boolean
}

withDefaults(defineProps<Props>(), {
  description: undefined,
  hideHub: false
})

const HUB_ROUTE = '/platform/modules/bao-cao-tong-hop/tong-quan'
</script>

<template>
  <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-slate-500 text-sm mt-1"
      >
        {{ description }}
      </p>
    </div>

    <div class="flex items-center gap-2 flex-wrap">
      <slot name="filters" />
      <UButton
        v-if="!hideHub"
        :to="HUB_ROUTE"
        icon="i-lucide-layout-dashboard"
        label="Hub báo cáo"
        color="neutral"
        variant="outline"
      />
      <slot name="actions" />
    </div>
  </div>
</template>
