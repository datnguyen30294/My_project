import { v as vueExports, s as serverRenderer_cjs_prodExports, aP as __nuxt_component_0, aQ as __nuxt_component_1, _ as __nuxt_component_0$4, aR as __nuxt_component_3 } from './server.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'tailwindcss/colors';
import 'node:stream';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const mobileOpen = vueExports.ref(false);
    const { items: breadcrumbItems } = useBreadcrumb();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutAppSidebar = __nuxt_component_0;
      const _component_LayoutAppHeader = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_LayoutAppMobileSidebar = __nuxt_component_3;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex h-screen overflow-hidden bg-background-light" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LayoutAppSidebar, null, null, _parent));
      _push(`<div class="flex flex-1 flex-col min-w-0 overflow-hidden">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LayoutAppHeader, {
        onToggleMobileSidebar: ($event) => mobileOpen.value = !vueExports.unref(mobileOpen)
      }, null, _parent));
      _push(`<main class="flex-1 overflow-y-auto bg-background-light p-3 sm:p-6"><div class="max-w-7xl mx-auto">`);
      if (vueExports.unref(breadcrumbItems).length > 1) {
        _push(`<nav class="flex mb-4 text-[12px] text-nav-text-secondary gap-2 items-center"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(breadcrumbItems), (item, index) => {
          _push(`<!--[-->`);
          if (index > 0) {
            _push(`<span class="material-symbols-outlined !text-[14px]">chevron_right</span>`);
          } else {
            _push(`<!---->`);
          }
          if (item.to) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: item.to,
              class: "hover:text-primary"
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(item.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass(index === vueExports.unref(breadcrumbItems).length - 1 ? "text-slate-900 font-medium" : "text-nav-text-secondary")}">${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</span>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></nav>`);
      } else {
        _push(`<!---->`);
      }
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LayoutAppMobileSidebar, {
        open: vueExports.unref(mobileOpen),
        "onUpdate:open": ($event) => vueExports.isRef(mobileOpen) ? mobileOpen.value = $event : null
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CWvzGeOv.mjs.map
