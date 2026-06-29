interface SelectItem {
  id: number
  label: string
  disabled?: boolean
}

interface UseEntitySelectOptions {
  /** Composable that fetches the list - called at setup time */
  fetchList: (params: MaybeRefOrGetter<Record<string, unknown>>) => {
    data: Ref<{ data: unknown[] } | null>
    status: Ref<string>
  }
  /** Resolve a single item by ID (for initial/external value) */
  resolveItem: (id: number) => Promise<SelectItem>
  /** IDs to mark as disabled in the dropdown */
  excludeIds?: MaybeRefOrGetter<number[]>
  /** Additional params merged into the list fetch (e.g. scope filters) */
  extraParams?: MaybeRefOrGetter<Record<string, unknown>>
  /** Re-fetch item when modelValue changes externally (not just clear) */
  syncExternalChanges?: boolean
  /** Callback when label changes (for update:label emit) */
  onLabelChange?: (label: string | null) => void
}

export function useEntitySelect(
  modelValue: () => number | null | undefined,
  onUpdate: (value: number | null) => void,
  options: UseEntitySelectOptions
) {
  const {
    fetchList,
    resolveItem,
    excludeIds,
    extraParams,
    syncExternalChanges = false,
    onLabelChange
  } = options

  const selectedItem = ref<SelectItem | undefined>(undefined)

  // Search with debounce
  let searchTimeout: ReturnType<typeof setTimeout>
  const searchParams = ref<Record<string, unknown>>({ search: undefined, per_page: SELECT_ALL_PER_PAGE })

  const { data: listData, status } = fetchList(computed(() => ({
    ...(toValue(extraParams) ?? {}),
    ...searchParams.value
  })))

  const excludeSet = computed(() => new Set(toValue(excludeIds) ?? []))

  const items = computed<SelectItem[]>(() => {
    const raw = (listData.value?.data as unknown as Array<{ id: number, name: string, capability_rating?: number | null }>) ?? []
    const mapped = raw.map(item => ({
      id: item.id,
      label: item.name,
      capability_rating: item.capability_rating ?? null
    }))
    if (excludeSet.value.size > 0) {
      return mapped.map(item => ({
        ...item,
        disabled: excludeSet.value.has(item.id)
      }))
    }
    return mapped
  })

  const loading = computed(() => status.value === 'pending')

  function onSearchTerm(term: string) {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      searchParams.value = { ...searchParams.value, search: term || undefined }
    }, 300)
  }

  // Resolve initial value
  onMounted(async () => {
    const val = modelValue()
    if (val) {
      try {
        selectedItem.value = await resolveItem(val)
      } catch { /* Not found, ignore */ }
    }
  })

  // Emit on selection change
  watch(selectedItem, (val) => {
    const newId = val?.id ?? null
    if (newId !== (modelValue() ?? null)) {
      onUpdate(newId)
      onLabelChange?.(val?.label ?? null)
    }
  })

  // Sync when parent resets/changes modelValue
  watch(modelValue, async (val) => {
    if (!val) {
      if (selectedItem.value) selectedItem.value = undefined
      return
    }
    if (syncExternalChanges && val !== selectedItem.value?.id) {
      try {
        selectedItem.value = await resolveItem(val)
      } catch { /* Not found, ignore */ }
    }
  })

  return { selectedItem, items, loading, onSearchTerm }
}

// --- Multi-select variant ---

interface UseEntityMultiSelectOptions {
  fetchList: (params: MaybeRefOrGetter<Record<string, unknown>>) => {
    data: Ref<{ data: unknown[] } | null>
    status: Ref<string>
  }
  resolveItem: (id: number) => Promise<SelectItem>
}

export function useEntityMultiSelect(
  modelValue: () => number[],
  onUpdate: (value: number[]) => void,
  options: UseEntityMultiSelectOptions
) {
  const { fetchList, resolveItem } = options

  const selectedItems = ref<SelectItem[]>([])

  // Search with debounce
  let searchTimeout: ReturnType<typeof setTimeout>
  const searchParams = ref<Record<string, unknown>>({ search: undefined, per_page: SELECT_ALL_PER_PAGE })

  const { data: listData, status } = fetchList(computed(() => searchParams.value))

  const items = computed<SelectItem[]>(() => {
    const raw = (listData.value?.data as unknown as Array<{ id: number, name: string, capability_rating?: number | null }>) ?? []
    return raw.map(item => ({
      id: item.id,
      label: item.name,
      capability_rating: item.capability_rating ?? null
    }))
  })

  const loading = computed(() => status.value === 'pending')

  function onSearchTerm(term: string) {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      searchParams.value = { ...searchParams.value, search: term || undefined }
    }, 300)
  }

  // Resolve initial values
  onMounted(async () => {
    const ids = modelValue()
    if (ids.length) {
      try {
        selectedItems.value = await Promise.all(ids.map(id => resolveItem(id)))
      } catch { /* Partial failure, ignore */ }
    }
  })

  // Emit on selection change
  watch(selectedItems, (val) => {
    const newIds = val.map(v => v.id).sort()
    const currentIds = [...modelValue()].sort()
    if (JSON.stringify(newIds) !== JSON.stringify(currentIds)) {
      onUpdate(val.map(v => v.id))
    }
  })

  // Clear when parent resets
  watch(modelValue, (val) => {
    if (!val.length && selectedItems.value.length) {
      selectedItems.value = []
    }
  })

  return { selectedItems, items, loading, onSearchTerm }
}
