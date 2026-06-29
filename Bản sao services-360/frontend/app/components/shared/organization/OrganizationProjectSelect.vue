<script setup lang="ts">
interface SelectItem {
  id: number
  label: string
}

interface Props {
  modelValue?: number | null
  organizationId?: string | null
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  organizationId: null,
  placeholder: 'Chọn dự án',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const selectedItem = ref<SelectItem | undefined>(undefined)
const items = ref<SelectItem[]>([])
const loading = ref(false)
let searchTimeout: ReturnType<typeof setTimeout>

async function fetchProjects(search?: string) {
  if (!props.organizationId) {
    items.value = []
    return
  }
  loading.value = true
  try {
    const data = await apiGetOrganizationProjects(props.organizationId, search)
    items.value = data.map(p => ({ id: Number(p.id), label: p.name }))
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function onSearchTerm(term: string) {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchProjects(term || undefined)
  }, 300)
}

// Fetch when organization changes
watch(() => props.organizationId, (val) => {
  selectedItem.value = undefined
  emit('update:modelValue', null)
  if (val) {
    fetchProjects()
  } else {
    items.value = []
  }
})

// Initial fetch if org already set
onMounted(() => {
  if (props.organizationId) {
    fetchProjects()
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
    :search-input="{ placeholder: 'Tìm dự án...' }"
    :placeholder="organizationId ? placeholder : 'Chọn tổ chức trước'"
    :disabled="!organizationId || disabled"
    clear
    class="w-full"
    @update:search-term="onSearchTerm"
  />
</template>
