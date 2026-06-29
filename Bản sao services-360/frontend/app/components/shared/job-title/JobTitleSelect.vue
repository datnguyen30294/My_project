<script setup lang="ts">
interface Props {
  modelValue?: number | null
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Chọn chức danh'
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'update:label': [value: string | null]
}>()

const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
  () => props.modelValue,
  val => emit('update:modelValue', val),
  {
    fetchList: useJobTitleList,
    resolveItem: async (id) => {
      const r = await apiGetJobTitle(id)
      return { id: r.data.id, label: r.data.name }
    },
    onLabelChange: val => emit('update:label', val)
  }
)
</script>

<template>
  <USelectMenu
    v-model="selectedItem"
    :items="items"
    :loading="loading"
    :ignore-filter="true"
    :search-input="{ placeholder: 'Tìm chức danh...' }"
    :placeholder="placeholder"
    clear
    class="w-full"
    @update:search-term="onSearchTerm"
  />
</template>
