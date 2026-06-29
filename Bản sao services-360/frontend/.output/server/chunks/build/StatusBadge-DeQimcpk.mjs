import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StatusBadge",
  __ssrInlineRender: true,
  props: {
    active: { type: Boolean },
    activeLabel: { default: "Hoạt động" },
    inactiveLabel: { default: "Không hoạt động" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: [
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border",
          __props.active ? "bg-green-50 text-green-700 border-green-100" : "bg-slate-50 text-slate-500 border-slate-200"
        ]
      }, _attrs))}><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.active ? "bg-green-500" : "bg-slate-400", "w-1.5 h-1.5 rounded-full"])}"></span> ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.active ? __props.activeLabel : __props.inactiveLabel)}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/StatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main, { __name: "SharedStatusBadge" });

export { __nuxt_component_7 as _ };
//# sourceMappingURL=StatusBadge-DeQimcpk.mjs.map
