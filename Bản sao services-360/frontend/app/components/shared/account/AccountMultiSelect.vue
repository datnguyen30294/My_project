<script setup lang="ts">
interface Props {
  modelValue?: number[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: 'Chọn nhân viên'
})

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()

const { selectedItems, items, loading, onSearchTerm } = useEntityMultiSelect(
  () => props.modelValue,
  val => emit('update:modelValue', val),
  {
    fetchList: useAccountList,
    resolveItem: async (id) => {
      const r = await $api<{ data: { id: number, name: string } }>(`/pmc/accounts/${id}`)
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
    :search-input="{ placeholder: 'Tìm nhân viên...' }"
    :placeholder="placeholder"
    class="w-full"
    @update:search-term="onSearchTerm"
  >
    <template #item-label="{ item }">
      <div class="flex items-center justify-between gap-2 w-full">
        <span class="truncate">{{ (item as { label: string }).label }}</span>
        <SharedCapabilityRatingBadge
          v-if="(item as { capability_rating?: number | null }).capability_rating != null"
          :rating="(item as { capability_rating?: number | null }).capability_rating"
          size="xs"
        />
      </div>
    </template>
  </USelectMenu>
</template>
