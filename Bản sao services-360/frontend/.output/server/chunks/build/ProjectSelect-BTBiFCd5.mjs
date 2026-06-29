import { _ as _sfc_main$1 } from './SelectMenu-DKHEMZj7.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { u as useEntitySelect } from './useEntitySelect-DG9pQ_n0.mjs';
import { d as useProjectList, e as apiGetProject } from './useProjects-D4K3VYdb.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProjectSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: null },
    placeholder: { default: "Chọn dự án" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
      () => props.modelValue,
      (val) => emit("update:modelValue", val),
      {
        fetchList: useProjectList,
        resolveItem: async (id) => {
          const r = await apiGetProject(id);
          return { id: r.data.id, label: r.data.name };
        },
        syncExternalChanges: true
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItem),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItem) ? selectedItem.value = $event : null,
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm dự án..." },
        placeholder: __props.placeholder,
        clear: "",
        class: "w-full",
        "onUpdate:searchTerm": vueExports.unref(onSearchTerm)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/project/ProjectSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "SharedProjectSelect" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=ProjectSelect-BTBiFCd5.mjs.map
