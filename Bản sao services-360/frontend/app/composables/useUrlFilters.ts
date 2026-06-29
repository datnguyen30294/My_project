interface FilterDef {
  ref: Ref
  type: 'string' | 'number'
  defaultValue?: string | number
  onInit?: (value: string | number) => void
}

/**
 * Sync URL query params ↔ reactive refs.
 *
 * @param filters - Map of query param key → FilterDef
 * @param params  - Optional reactive params object. When provided, URL values are
 *                  synchronously written to `params[key]` during init, preventing
 *                  race conditions where `useFetch` fires before async watchers update params.
 */
export function useUrlFilters(
  filters: Record<string, FilterDef>,
  params?: Record<string, any>
) {
  const route = useRoute()
  const router = useRouter()
  const isInitFromUrl = ref(true)

  // Init: read URL query params → set ref values (+ params if provided)
  for (const [key, def] of Object.entries(filters)) {
    const rawValue = route.query[key]
    const raw = Array.isArray(rawValue) ? rawValue[0] : rawValue

    if (raw != null && raw !== '') {
      if (def.type === 'number') {
        const parsed = Number(raw)
        if (!isNaN(parsed)) {
          def.ref.value = parsed
          if (params) params[key] = parsed
          def.onInit?.(parsed)
        }
      } else {
        def.ref.value = raw
        if (params) params[key] = raw
        def.onInit?.(raw)
      }
    }
  }

  nextTick(() => {
    isInitFromUrl.value = false
  })

  // Watch all refs → sync to URL query params
  const entries = Object.entries(filters)

  watch(
    entries.map(([, def]) => def.ref),
    () => {
      if (isInitFromUrl.value) return

      const query: Record<string, string> = {}
      for (const [key, def] of entries) {
        const val = def.ref.value
        if (val != null && val !== '' && val !== def.defaultValue) {
          query[key] = String(val)
        }
      }

      router.replace({ query })
    }
  )

  return { isInitFromUrl }
}
