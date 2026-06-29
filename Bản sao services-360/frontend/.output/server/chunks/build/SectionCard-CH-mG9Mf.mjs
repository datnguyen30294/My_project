import { v as vueExports, s as serverRenderer_cjs_prodExports, k as _sfc_main$h } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SectionCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    compact: { type: Boolean },
    icon: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "bg-white border border-border-gray rounded-xl shadow-sm overflow-hidden" }, _attrs))}><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.compact ? "px-5 py-4" : "px-6 py-4", "border-b border-border-gray flex items-center justify-between"])}"><h2 class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.compact ? "font-bold text-slate-900 text-sm" : "font-bold text-slate-900", "flex items-center gap-2"])}">`);
      if (__props.icon) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: __props.icon,
          class: ["text-primary shrink-0", __props.compact ? "size-4" : "size-5"]
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}</h2>`);
      if (_ctx.$slots["header-actions"]) {
        _push(`<div class="flex items-center gap-2">`);
        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "header-actions", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="${serverRenderer_cjs_prodExports.ssrRenderClass(__props.compact ? "px-5 py-4" : "px-6 py-5")}">`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/SectionCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "SharedSectionCard" });

export { __nuxt_component_4 as _ };
//# sourceMappingURL=SectionCard-CH-mG9Mf.mjs.map
