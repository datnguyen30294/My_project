import { v as vueExports, s as serverRenderer_cjs_prodExports, k as _sfc_main$h } from './server.mjs';
import { _ as __nuxt_component_2$1 } from './PageError-kZWsA9dh.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TableWrapper",
  __ssrInlineRender: true,
  props: {
    status: {},
    error: {},
    data: {},
    refresh: { type: Function }
  },
  setup(__props) {
    const props = __props;
    const hasLoadedOnce = vueExports.ref(false);
    vueExports.watch(() => props.data, (val) => {
      if (val) hasLoadedOnce.value = true;
    }, { immediate: true });
    const isInitialLoading = vueExports.computed(() => !hasLoadedOnce.value && !props.error);
    const isRefetching = vueExports.computed(() => props.status === "pending" && hasLoadedOnce.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      const _component_SharedCrudPageError = __nuxt_component_2$1;
      if (vueExports.unref(isInitialLoading)) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex items-center justify-center py-20" }, _attrs))}>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-circle",
          class: "size-8 animate-spin text-[var(--ui-primary)]"
        }, null, _parent));
        _push(`</div>`);
      } else if (__props.error) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, vueExports.mergeProps({
          error: __props.error,
          retry: __props.refresh
        }, _attrs), null, _parent));
      } else {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "relative" }, _attrs))}>`);
        if (vueExports.unref(isRefetching)) {
          _push(`<div class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[var(--ui-bg)]/60">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-loader-circle",
            class: "size-6 animate-spin text-[var(--ui-primary)]"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass({ "pointer-events-none": vueExports.unref(isRefetching) })}">`);
        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/crud/TableWrapper.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "SharedCrudTableWrapper" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=TableWrapper-VwUckvcF.mjs.map
