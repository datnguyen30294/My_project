<script setup lang="ts">
interface Props {
  modelValue?: number[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: 'Chọn dự án'
})

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()

const { selectedItems, items, loading, onSearchTerm } = useEntityMultiSelect(
  () => props.modelValue,
  val => emit('update:modelValue', val),
  {
    fetchList: useProjectList,
    resolveItem: async (id) => {
      const r = await apiGetProject(id)
      return { id: r.data.id, label: r.data.name }
    }
  }
)
</script>

<template>
  <USelectMenu
    v-model="selectedItems"
    multiple
    :items="items"
    :loading="loading"
    :ignore-filter="true"
    :search-input="{ placeholder: 'Tìm dự án...' }"
    :placeholder="placeholder"
    class="w-full"
    @update:search-term="onSearchTerm"
  />
</template>
