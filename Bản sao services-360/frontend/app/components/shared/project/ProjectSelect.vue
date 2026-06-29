<script setup lang="ts">
interface Props {
  modelValue?: number | null
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Chọn dự án'
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
  () => props.modelValue,
  val => emit('update:modelValue', val),
  {
    fetchList: useProjectList,
    resolveItem: async (id) => {
      const r = await apiGetProject(id)
      return { id: r.data.id, label: r.data.name }
    },
    syncExternalChanges: true
  }
)
</script>

<template>
  <USelectMenu
    v-model="selectedItem"
    :items="items"
    :loading="loading"
    :ignore-filter="true"
    :search-input="{ placeholder: 'Tìm dự án...' }"
    :placeholder="placeholder"
    clear
    class="w-full"
    @update:search-term="onSearchTerm"
  />
</template>
