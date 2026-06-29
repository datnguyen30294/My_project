<script setup lang="ts">
interface Props {
  modelValue?: number[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: 'Chọn phòng ban'
})

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
  'update:firstLabel': [value: string | null]
}>()

const { selectedItems, items, loading, onSearchTerm } = useEntityMultiSelect(
  () => props.modelValue,
  val => emit('update:modelValue', val),
  {
    fetchList: useDepartmentList,
    resolveItem: async (id) => {
      const r = await apiGetDepartment(id)
      return { id: r.data.id, label: r.data.name }
    }
  }
)

watch(
  selectedItems,
  (val) => {
    emit('update:firstLabel', val.length ? (val[0]?.label ?? null) : null)
  },
  { immediate: true }
)
</script>

<template>
  <USelectMenu
    v-model="selectedItems"
    multiple
    :items="items"
    :loading="loading"
    :ignore-filter="true"
    :search-input="{ placeholder: 'Tìm phòng ban...' }"
    :placeholder="placeholder"
    class="w-full"
    @update:search-term="onSearchTerm"
  />
</template>
