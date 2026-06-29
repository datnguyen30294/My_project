<template>
  <div
    v-if="meta"
    class="px-6 py-4 bg-[#fafafa] border-t border-border-gray flex items-center justify-between"
  >
    <span class="text-sm text-nav-text-secondary">
      Hiển thị {{ meta.from ?? 0 }}-{{ meta.to ?? 0 }} trên {{ meta.total }} kết quả
    </span>
    <UPagination
      v-model:page="page"
      :total="meta.total"
      :items-per-page="meta.per_page"
      show-edges
      :sibling-count="1"
    />
  </div>
</template>

<script setup lang="ts">
interface PaginationMeta {
  from?: number | null
  to?: number | null
  total: number
  per_page: number
}

const page = defineModel<number>('page', { required: true })

defineProps<{
  meta: PaginationMeta | null | undefined
}>()
</script>
