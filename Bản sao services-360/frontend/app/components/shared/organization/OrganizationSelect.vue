<script setup lang="ts">
interface SelectItem {
  id: string
  label: string
}

interface Props {
  modelValue?: string | null
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Chọn tổ chức',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const selectedItem = ref<SelectItem | undefined>(undefined)
let searchTimeout: ReturnType<typeof setTimeout>
const searchParams = ref<Record<string, unknown>>({ search: undefined })

const { data, status } = usePlatformOrganizationList(computed(() => searchParams.value))

const items = computed<SelectItem[]>(() => {
  const raw = data.value?.data ?? []
  return raw.map(item => ({ id: item.id, label: `${item.id} — ${item.name}` }))
})

const loading = computed(() => status.value === 'pending')

function onSearchTerm(term: string) {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchParams.value = { ...searchParams.value, search: term || undefined }
  }, 300)
}

// Resolve initial value
onMounted(() => {
  if (props.modelValue && data.value?.data) {
    const found = data.value.data.find(o => o.id === props.modelValue)
    if (found) {
      selectedItem.value = { id: found.id, label: `${found.id} — ${found.name}` }
    }
  }
})

// Watch for data load to resolve initial
watch(data, (val) => {
  if (props.modelValue && val?.data && !selectedItem.value) {
    const found = val.data.find(o => o.id === props.modelValue)
    if (found) {
      selectedItem.value = { id: found.id, label: `${found.id} — ${found.name}` }
    }
  }
})

// Emit on selection
watch(selectedItem, (val) => {
  const newId = val?.id ?? null
  if (newId !== (props.modelValue ?? null)) {
    emit('update:modelValue', newId)
  }
})

// Sync when parent resets
watch(() => props.modelValue, (val) => {
  if (!val && selectedItem.value) {
    selectedItem.value = undefined
  }
})
</script>

<template>
  <USelectMenu
    v-model="selectedItem"
    :items="items"
    :loading="loading"
    :ignore-filter="true"
    :search-input="{ placeholder: 'Tìm tổ chức...' }"
    :placeholder="placeholder"
    :disabled="disabled"
    clear
    class="w-full"
    @update:search-term="onSearchTerm"
  />
</template>
