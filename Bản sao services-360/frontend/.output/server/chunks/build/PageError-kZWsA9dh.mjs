import { v as vueExports, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, l as _sfc_main$c } from './server.mjs';
import { f as formatPageError } from './apiError-DBrxF9au.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PageError",
  __ssrInlineRender: true,
  props: {
    error: {},
    retry: { type: Function }
  },
  setup(__props) {
    const props = __props;
    const errorInfo = vueExports.computed(() => formatPageError(props.error));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      const _component_UButton = _sfc_main$c;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col items-center justify-center py-12 text-center" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-circle-x",
        class: "size-12 text-[var(--ui-error)]"
      }, null, _parent));
      _push(`<h3 class="mt-3 text-lg font-semibold">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errorInfo).title)}</h3><p class="mt-1 text-sm text-[var(--ui-text-muted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errorInfo).description)}</p>`);
      if (__props.retry) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Thử lại",
          icon: "i-lucide-refresh-cw",
          color: "neutral",
          variant: "outline",
          class: "mt-4",
          onClick: __props.retry
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/crud/PageError.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "SharedCrudPageError" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=PageError-kZWsA9dh.mjs.map
