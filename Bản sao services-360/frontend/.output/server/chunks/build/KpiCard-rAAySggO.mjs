import { _ as _sfc_main$1 } from './Card-ywPiICev.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$2 } from './Skeleton-CKN2C2Mt.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "KpiCard",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    sub: { default: void 0 },
    icon: { default: void 0 },
    accent: { default: "neutral" },
    pending: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const ACCENT_TEXT = {
      primary: "text-primary",
      success: "text-emerald-600",
      error: "text-red-600",
      warning: "text-amber-600",
      neutral: "text-slate-900"
    };
    const valueClass = vueExports.computed(() => ACCENT_TEXT[props.accent]);
    const iconClass = vueExports.computed(() => props.accent === "neutral" ? "text-primary" : ACCENT_TEXT[props.accent]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UIcon = _sfc_main$h;
      const _component_USkeleton = _sfc_main$2;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, vueExports.mergeProps({ ui: { body: "px-5 py-4" } }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-4"${_scopeId}>`);
            if (__props.icon) {
              _push2(`<div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: __props.icon,
                class: ["size-5", vueExports.unref(iconClass)]
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="min-w-0"${_scopeId}><div class="text-sm text-[var(--ui-text-muted)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}</div>`);
            if (__props.pending) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "mt-1 h-7 w-20" }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(valueClass), "mt-1 text-2xl font-bold tracking-tight truncate"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.value)}</div>`);
            }
            if (__props.sub && !__props.pending) {
              _push2(`<div class="text-xs text-slate-500 mt-0.5 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.sub)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center gap-4" }, [
                __props.icon ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50"
                }, [
                  vueExports.createVNode(_component_UIcon, {
                    name: __props.icon,
                    class: ["size-5", vueExports.unref(iconClass)]
                  }, null, 8, ["name", "class"])
                ])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("div", { class: "min-w-0" }, [
                  vueExports.createVNode("div", { class: "text-sm text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(__props.label), 1),
                  __props.pending ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                    key: 0,
                    class: "mt-1 h-7 w-20"
                  })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: ["mt-1 text-2xl font-bold tracking-tight truncate", vueExports.unref(valueClass)]
                  }, vueExports.toDisplayString(__props.value), 3)),
                  __props.sub && !__props.pending ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 2,
                    class: "text-xs text-slate-500 mt-0.5 truncate"
                  }, vueExports.toDisplayString(__props.sub), 1)) : vueExports.createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/platform-report/KpiCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "PlatformReportKpiCard" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=KpiCard-rAAySggO.mjs.map
