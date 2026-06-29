import { _ as _sfc_main$1 } from './Pagination-fZq_Msxb.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TablePagination",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    meta: {}
  }, {
    "page": { required: true },
    "pageModifiers": {}
  }),
  emits: ["update:page"],
  setup(__props) {
    const page = vueExports.useModel(__props, "page");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UPagination = _sfc_main$1;
      if (__props.meta) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "px-6 py-4 bg-[#fafafa] border-t border-border-gray flex items-center justify-between" }, _attrs))}><span class="text-sm text-nav-text-secondary"> Hiển thị ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.meta.from ?? 0)}-${serverRenderer_cjs_prodExports.ssrInterpolate(__props.meta.to ?? 0)} trên ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.meta.total)} kết quả </span>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UPagination, {
          page: page.value,
          "onUpdate:page": ($event) => page.value = $event,
          total: __props.meta.total,
          "items-per-page": __props.meta.per_page,
          "show-edges": "",
          "sibling-count": 1
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/crud/TablePagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main, { __name: "SharedCrudTablePagination" });

export { __nuxt_component_10 as _ };
//# sourceMappingURL=TablePagination-CZYWB-qm.mjs.map
