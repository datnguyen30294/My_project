import { v as vueExports } from './server.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';

function useEntitySelect(modelValue, onUpdate, options) {
  const {
    fetchList,
    resolveItem,
    excludeIds,
    extraParams,
    syncExternalChanges = false,
    onLabelChange
  } = options;
  const selectedItem = vueExports.ref(void 0);
  let searchTimeout;
  const searchParams = vueExports.ref({ search: void 0, per_page: SELECT_ALL_PER_PAGE });
  const { data: listData, status } = fetchList(vueExports.computed(() => ({
    ...vueExports.toValue(extraParams) ?? {},
    ...searchParams.value
  })));
  const excludeSet = vueExports.computed(() => new Set(vueExports.toValue(excludeIds) ?? []));
  const items = vueExports.computed(() => {
    const raw = listData.value?.data ?? [];
    const mapped = raw.map((item) => ({
      id: item.id,
      label: item.name,
      capability_rating: item.capability_rating ?? null
    }));
    if (excludeSet.value.size > 0) {
      return mapped.map((item) => ({
        ...item,
        disabled: excludeSet.value.has(item.id)
      }));
    }
    return mapped;
  });
  const loading = vueExports.computed(() => status.value === "pending");
  function onSearchTerm(term) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchParams.value = { ...searchParams.value, search: term || void 0 };
    }, 300);
  }
  vueExports.watch(selectedItem, (val) => {
    const newId = val?.id ?? null;
    if (newId !== (modelValue() ?? null)) {
      onUpdate(newId);
      onLabelChange?.(val?.label ?? null);
    }
  });
  vueExports.watch(modelValue, async (val) => {
    if (!val) {
      if (selectedItem.value) selectedItem.value = void 0;
      return;
    }
    if (syncExternalChanges && val !== selectedItem.value?.id) {
      try {
        selectedItem.value = await resolveItem(val);
      } catch {
      }
    }
  });
  return { selectedItem, items, loading, onSearchTerm };
}
function useEntityMultiSelect(modelValue, onUpdate, options) {
  const { fetchList, resolveItem } = options;
  const selectedItems = vueExports.ref([]);
  let searchTimeout;
  const searchParams = vueExports.ref({ search: void 0, per_page: SELECT_ALL_PER_PAGE });
  const { data: listData, status } = fetchList(vueExports.computed(() => searchParams.value));
  const items = vueExports.computed(() => {
    const raw = listData.value?.data ?? [];
    return raw.map((item) => ({
      id: item.id,
      label: item.name,
      capability_rating: item.capability_rating ?? null
    }));
  });
  const loading = vueExports.computed(() => status.value === "pending");
  function onSearchTerm(term) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchParams.value = { ...searchParams.value, search: term || void 0 };
    }, 300);
  }
  vueExports.watch(selectedItems, (val) => {
    const newIds = val.map((v) => v.id).sort();
    const currentIds = [...modelValue()].sort();
    if (JSON.stringify(newIds) !== JSON.stringify(currentIds)) {
      onUpdate(val.map((v) => v.id));
    }
  });
  vueExports.watch(modelValue, (val) => {
    if (!val.length && selectedItems.value.length) {
      selectedItems.value = [];
    }
  });
  return { selectedItems, items, loading, onSearchTerm };
}

export { useEntityMultiSelect as a, useEntitySelect as u };
//# sourceMappingURL=useEntitySelect-DG9pQ_n0.mjs.map
