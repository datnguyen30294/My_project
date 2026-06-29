import { v as vueExports, p as useRoute$1, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4 } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "LandingHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const navLinks = [
      { label: "Trang chủ", to: "/" },
      { label: "Dịch vụ", to: "/dich-vu" },
      { label: "Gửi yêu cầu", to: "/ticket" }
    ];
    function isActive(to) {
      if (to === "/") return route.path === "/";
      return route.path.startsWith(to);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      _push(`<header${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:px-10 lg:px-40 py-4" }, _attrs))}><div class="flex items-center justify-between">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-center size-10 rounded-lg bg-slate-900 text-white"${_scopeId}><span class="material-symbols-outlined text-2xl"${_scopeId}>domain</span></div><h2 class="text-slate-900 text-xl font-extrabold leading-tight tracking-tight"${_scopeId}>Thần Nông</h2>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center justify-center size-10 rounded-lg bg-slate-900 text-white" }, [
                vueExports.createVNode("span", { class: "material-symbols-outlined text-2xl" }, "domain")
              ]),
              vueExports.createVNode("h2", { class: "text-slate-900 text-xl font-extrabold leading-tight tracking-tight" }, "Thần Nông")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden md:flex items-center gap-8"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(navLinks, (link) => {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
          key: link.label,
          to: link.to,
          class: [
            "text-sm font-medium transition-colors",
            isActive(link.to) ? "text-slate-900 font-semibold border-b-2 border-slate-900 pb-1" : "text-slate-500 hover:text-slate-900"
          ]
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(link.label)}`);
            } else {
              return [
                vueExports.createTextVNode(vueExports.toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/ticket",
        class: "flex items-center justify-center rounded-lg h-10 px-5 bg-slate-900 text-white text-sm font-bold transition-all hover:bg-slate-800"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Gửi yêu cầu `);
          } else {
            return [
              vueExports.createTextVNode(" Gửi yêu cầu ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/LandingHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "LandingHeader" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "LandingFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const footerLinks = [
      { label: "Trang chủ", to: "/" },
      { label: "Dịch vụ", to: "/dich-vu" },
      { label: "Gửi yêu cầu", to: "/ticket" },
      { label: "Điều khoản sử dụng", to: "/chinh-sach" },
      { label: "Chính sách bảo mật", to: "/chinh-sach-bao-mat" }
    ];
    function isActive(to) {
      if (to === "/") return route.path === "/";
      return route.path.startsWith(to);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      _push(`<footer${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "bg-white border-t border-slate-200 lg:px-40 px-6 py-12" }, _attrs))}><div class="max-w-7xl mx-auto flex flex-col items-center gap-8"><div class="flex flex-col md:flex-row justify-between items-center w-full gap-8">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined text-slate-900 text-3xl"${_scopeId}>domain</span><span class="text-lg font-bold text-slate-900"${_scopeId}>Thần Nông</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "material-symbols-outlined text-slate-900 text-3xl" }, "domain"),
              vueExports.createVNode("span", { class: "text-lg font-bold text-slate-900" }, "Thần Nông")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(footerLinks, (link) => {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
          key: link.label,
          to: link.to,
          class: [
            "text-sm font-medium transition-colors",
            isActive(link.to) ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-900"
          ]
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(link.label)}`);
            } else {
              return [
                vueExports.createTextVNode(vueExports.toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div><div class="w-full border-t border-slate-100 pt-6"><p class="text-slate-400 text-sm text-center"> © ${serverRenderer_cjs_prodExports.ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Thần Nông. All rights reserved. </p></div></div></footer>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/LandingFooter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "LandingFooter" });

export { __nuxt_component_0 as _, __nuxt_component_2 as a };
//# sourceMappingURL=LandingFooter-ButK23zG.mjs.map
