import { _ as _sfc_main$1 } from './SelectMenu-DKHEMZj7.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { a as apiGetOrganizationProjects } from './useOrganizations-DNv3fDw1.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "OrganizationProjectSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: null },
    organizationId: { default: null },
    placeholder: { default: "Chọn dự án" },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const selectedItem = vueExports.ref(void 0);
    const items = vueExports.ref([]);
    const loading = vueExports.ref(false);
    let searchTimeout;
    async function fetchProjects(search) {
      if (!props.organizationId) {
        items.value = [];
        return;
      }
      loading.value = true;
      try {
        const data = await apiGetOrganizationProjects(props.organizationId, search);
        items.value = data.map((p) => ({ id: Number(p.id), label: p.name }));
      } catch {
        items.value = [];
      } finally {
        loading.value = false;
      }
    }
    function onSearchTerm(term) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchProjects(term || void 0);
      }, 300);
    }
    vueExports.watch(() => props.organizationId, (val) => {
      selectedItem.value = void 0;
      emit("update:modelValue", null);
      if (val) {
        fetchProjects();
      } else {
        items.value = [];
      }
    });
    vueExports.watch(selectedItem, (val) => {
      const newId = val?.id ?? null;
      if (newId !== (props.modelValue ?? null)) {
        emit("update:modelValue", newId);
      }
    });
    vueExports.watch(() => props.modelValue, (val) => {
      if (!val && selectedItem.value) {
        selectedItem.value = void 0;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItem),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItem) ? selectedItem.value = $event : null,
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm dự án..." },
        placeholder: __props.organizationId ? __props.placeholder : "Chọn tổ chức trước",
        disabled: !__props.organizationId || __props.disabled,
        clear: "",
        class: "w-full",
        "onUpdate:searchTerm": onSearchTerm
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/organization/OrganizationProjectSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "SharedOrganizationProjectSelect" });

export { __nuxt_component_4 as _ };
//# sourceMappingURL=OrganizationProjectSelect-C1GzN7Mu.mjs.map
