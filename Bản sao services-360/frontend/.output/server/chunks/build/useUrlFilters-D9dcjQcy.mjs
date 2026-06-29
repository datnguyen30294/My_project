import { p as useRoute$1, i as useRouter, v as vueExports } from './server.mjs';

function useUrlFilters(filters, params) {
  const route = useRoute$1();
  const router = useRouter();
  const isInitFromUrl = vueExports.ref(true);
  for (const [key, def] of Object.entries(filters)) {
    const rawValue = route.query[key];
    const raw = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (raw != null && raw !== "") {
      if (def.type === "number") {
        const parsed = Number(raw);
        if (!isNaN(parsed)) {
          def.ref.value = parsed;
          if (params) params[key] = parsed;
          def.onInit?.(parsed);
        }
      } else {
        def.ref.value = raw;
        if (params) params[key] = raw;
        def.onInit?.(raw);
      }
    }
  }
  vueExports.nextTick(() => {
    isInitFromUrl.value = false;
  });
  const entries = Object.entries(filters);
  vueExports.watch(
    entries.map(([, def]) => def.ref),
    () => {
      if (isInitFromUrl.value) return;
      const query = {};
      for (const [key, def] of entries) {
        const val = def.ref.value;
        if (val != null && val !== "" && val !== def.defaultValue) {
          query[key] = String(val);
        }
      }
      router.replace({ query });
    }
  );
  return { isInitFromUrl };
}

export { useUrlFilters as u };
//# sourceMappingURL=useUrlFilters-D9dcjQcy.mjs.map
