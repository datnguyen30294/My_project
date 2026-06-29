<script setup lang="ts">
interface Props {
  modelValue?: number | null
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Chọn phòng ban'
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'update:label': [value: string | null]
}>()

const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
  () => props.modelValue,
  val => emit('update:modelValue', val),
  {
    fetchList: useDepartmentList,
    resolveItem: async (id) => {
      const r = await apiGetDepartment(id)
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
    :search-input="{ placeholder: 'Tìm phòng ban...' }"
    :placeholder="placeholder"
    clear
    class="w-full"
    @update:search-term="onSearchTerm"
  />
</template>
