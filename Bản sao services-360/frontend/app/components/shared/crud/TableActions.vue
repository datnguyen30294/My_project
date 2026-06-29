<script setup lang="ts">
interface Props {
  detailTo?: string
  showDelete?: boolean
}

withDefaults(defineProps<Props>(), {
  showDelete: true
})

defineEmits<{
  edit: []
  delete: []
}>()
</script>

<template>
  <div class="flex items-center justify-end gap-1">
    <UButton
      v-if="detailTo"
      :to="detailTo"
      icon="i-lucide-eye"
      color="neutral"
      variant="ghost"
      size="sm"
      title="Xem chi tiết"
    />

    <slot />

    <UButton
      icon="i-lucide-pencil"
      color="neutral"
      variant="ghost"
      size="sm"
      title="Sửa"
      @click="$emit('edit')"
    />

    <slot name="extra" />

    <UButton
      v-if="showDelete"
      icon="i-lucide-trash-2"
      color="neutral"
      variant="ghost"
      size="sm"
      class="hover:!text-red-500 hover:!bg-red-50"
      title="Xóa"
      @click="$emit('delete')"
    />
  </div>
</template>
