<script setup lang="ts">
interface Props {
  modelValue?: number | null
  excludeIds?: number[]
  projectId?: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
  () => props.modelValue ?? null,
  val => emit('update:modelValue', val),
  {
    fetchList: useDepartmentList,
    resolveItem: async (id) => {
      const r = await apiGetDepartment(id)
      return { id: r.data.id, label: r.data.name }
    },
    excludeIds: computed(() => props.excludeIds ?? []),
    extraParams: computed(() => (
      props.projectId != null ? { project_id: props.projectId } : {}
    ))
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
    placeholder="Chọn phòng ban"
    clear
    class="w-full"
    @update:search-term="onSearchTerm"
  />
</template>
