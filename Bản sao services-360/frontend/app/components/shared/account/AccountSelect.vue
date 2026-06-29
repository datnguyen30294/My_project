<script setup lang="ts">
interface Props {
  modelValue?: number | null
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Chọn nhân viên'
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
  () => props.modelValue,
  val => emit('update:modelValue', val),
  {
    fetchList: useAccountList,
    resolveItem: async (id) => {
      const r = await $api<{ data: { id: number, name: string } }>(`/pmc/accounts/${id}`)
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
    :search-input="{ placeholder: 'Tìm nhân viên...' }"
    :placeholder="placeholder"
    clear
    class="w-full"
    @update:search-term="onSearchTerm"
  >
    <template #item="{ item }">
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
