import { v as vueExports, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4 } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PageHeader",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    createTo: {},
    createLabel: { default: "Thêm mới" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-wrap items-center justify-between gap-4 mb-6" }, _attrs))}><div><h1 class="text-xl font-bold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}</h1>`);
      if (__props.description) {
        _push(`<p class="mt-1 text-sm text-nav-text-secondary">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
        if (__props.createTo) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: __props.createTo,
            class: "flex items-center gap-2 bg-[#0f0f29] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:opacity-90 transition-opacity"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "20px" })}"${_scopeId}>add</span> ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.createLabel)}`);
              } else {
                return [
                  vueExports.createVNode("span", {
                    class: "material-symbols-outlined",
                    style: { "font-size": "20px" }
                  }, "add"),
                  vueExports.createTextVNode(" " + vueExports.toDisplayString(__props.createLabel), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
      }, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/crud/PageHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SharedCrudPageHeader" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=PageHeader-BJhealxW.mjs.map
