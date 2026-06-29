import { _ as _sfc_main$1 } from './SelectMenu-DKHEMZj7.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { u as usePlatformOrganizationList } from './useOrganizations-DNv3fDw1.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "OrganizationSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: null },
    placeholder: { default: "Chọn tổ chức" },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const selectedItem = vueExports.ref(void 0);
    let searchTimeout;
    const searchParams = vueExports.ref({ search: void 0 });
    const { data, status } = usePlatformOrganizationList(vueExports.computed(() => searchParams.value));
    const items = vueExports.computed(() => {
      const raw = data.value?.data ?? [];
      return raw.map((item) => ({ id: item.id, label: `${item.id} — ${item.name}` }));
    });
    const loading = vueExports.computed(() => status.value === "pending");
    function onSearchTerm(term) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchParams.value = { ...searchParams.value, search: term || void 0 };
      }, 300);
    }
    vueExports.watch(data, (val) => {
      if (props.modelValue && val?.data && !selectedItem.value) {
        const found = val.data.find((o) => o.id === props.modelValue);
        if (found) {
          selectedItem.value = { id: found.id, label: `${found.id} — ${found.name}` };
        }
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
        "search-input": { placeholder: "Tìm tổ chức..." },
        placeholder: __props.placeholder,
        disabled: __props.disabled,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/organization/OrganizationSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "SharedOrganizationSelect" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=OrganizationSelect-Cu-8MJ9c.mjs.map
