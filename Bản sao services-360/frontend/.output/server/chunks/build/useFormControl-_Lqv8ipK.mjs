import { v as vueExports, ag as unrefElement } from './server.mjs';

function useFormControl(el) {
  return vueExports.computed(() => vueExports.toValue(el) ? Boolean(unrefElement(el)?.closest("form")) : true);
}

export { useFormControl as u };
//# sourceMappingURL=useFormControl-_Lqv8ipK.mjs.map
