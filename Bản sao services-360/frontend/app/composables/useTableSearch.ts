export function useTableSearch(onUpdate: (value: string | undefined) => void, delay = 300) {
  const searchInput = ref('')
  let searchTimeout: ReturnType<typeof setTimeout>

  function onSearch(value: string) {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      onUpdate(value || undefined)
    }, delay)
  }

  return { searchInput, onSearch }
}
