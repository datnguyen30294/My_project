import { ad as injectConfigProviderContext, v as vueExports } from './server.mjs';

function useDirection(dir) {
  const context = injectConfigProviderContext({ dir: vueExports.ref("ltr") });
  return vueExports.computed(() => dir?.value || context.dir?.value || "ltr");
}

export { useDirection as u };
//# sourceMappingURL=useDirection-CXYby7CP.mjs.map
