import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4 } from './server.mjs';
import { u as usePlatformAuth } from './usePlatformAuth-xR_pVxir.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Tổng quan - Thần Nông" });
    const { user } = usePlatformAuth();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6"><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Xin chào, ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(user)?.name)} 👋 </h1><p class="text-slate-500 text-sm mt-1"> Chào mừng đến với hệ thống quản lý yêu cầu Thần Nông. </p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/platform/tickets",
        class: "group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="size-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"${_scopeId}><span class="material-symbols-outlined text-violet-600" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}"${_scopeId}>confirmation_number</span></div><h3 class="font-bold text-slate-900 mb-1"${_scopeId}>Quản lý yêu cầu</h3><p class="text-sm text-slate-500"${_scopeId}>Xem và xử lý các yêu cầu sửa chữa từ cư dân.</p>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "size-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" }, [
                vueExports.createVNode("span", {
                  class: "material-symbols-outlined text-violet-600",
                  style: { "font-size": "24px" }
                }, "confirmation_number")
              ]),
              vueExports.createVNode("h3", { class: "font-bold text-slate-900 mb-1" }, "Quản lý yêu cầu"),
              vueExports.createVNode("p", { class: "text-sm text-slate-500" }, "Xem và xử lý các yêu cầu sửa chữa từ cư dân.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/platform/settings/bank-account",
        class: "group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="size-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"${_scopeId}><span class="material-symbols-outlined text-emerald-600" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}"${_scopeId}>account_balance</span></div><h3 class="font-bold text-slate-900 mb-1"${_scopeId}>Tài khoản Platform</h3><p class="text-sm text-slate-500"${_scopeId}>STK nhận hoa hồng Platform từ các công ty vận hành.</p>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "size-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" }, [
                vueExports.createVNode("span", {
                  class: "material-symbols-outlined text-emerald-600",
                  style: { "font-size": "24px" }
                }, "account_balance")
              ]),
              vueExports.createVNode("h3", { class: "font-bold text-slate-900 mb-1" }, "Tài khoản Platform"),
              vueExports.createVNode("p", { class: "text-sm text-slate-500" }, "STK nhận hoa hồng Platform từ các công ty vận hành.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-bG21_53v.mjs.map
