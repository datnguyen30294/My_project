import { v as vueExports, s as serverRenderer_cjs_prodExports, x as _export_sfc, i as useRouter, l as _sfc_main$c, p as useRoute$1, aS as apiPlatformLogout, _ as __nuxt_component_0$4 } from './server.mjs';
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

function usePlatformNavigation() {
  const navigationItems = vueExports.computed(() => [
    {
      label: "Tổng quan",
      icon: "dashboard",
      to: "/platform"
    },
    {
      label: "Quản lý vận hành",
      icon: "domain",
      defaultOpen: true,
      children: [
        { label: "Công ty vận hành", to: "/platform/tenants" },
        { label: "Dự án trên nền tảng", to: "/platform/quan-ly-van-hanh/du-an-tren-nen-tang" },
        { label: "Quản lý Vendor", to: "/platform/quan-ly-van-hanh/quan-ly-vendor" },
        { label: "Cư dân", to: "/platform/customers" },
        { label: "Quản lý yêu cầu", to: "/platform/tickets" }
      ]
    },
    {
      label: "Quản lý đơn hàng",
      icon: "receipt_long",
      children: [
        { label: "Đơn hàng vendor", to: "/platform/quan-ly-don-hang/don-hang-vendor" },
        { label: "Đơn hàng OG", to: "/platform/quan-ly-don-hang/don-hang-og" }
      ]
    },
    {
      label: "Báo cáo tổng hợp",
      icon: "assessment",
      children: [
        { label: "Tổng quan", to: "/platform/modules/bao-cao-tong-hop/tong-quan" },
        { label: "Doanh thu nền tảng", to: "/platform/modules/bao-cao-tong-hop/doanh-thu-tong-hop" },
        { label: "Chất lượng & CSAT", to: "/platform/modules/bao-cao-tong-hop/chat-luong-csat" },
        { label: "Xu hướng dịch vụ", to: "/platform/modules/bao-cao-tong-hop/xu-huong-dich-vu" },
        { label: "Phân khúc cư dân", to: "/platform/modules/bao-cao-tong-hop/phan-khuc-cu-dan" },
        { label: "Sức khỏe công ty vận hành & dự án", to: "/platform/modules/bao-cao-tong-hop/suc-khoe-tenant-du-an" },
        { label: "Hoa hồng & phân bổ", to: "/platform/modules/bao-cao-tong-hop/hoa-hong-phan-bo" },
        { label: "Hiệu suất vendor", to: "/platform/modules/bao-cao-tong-hop/hieu-suat-vendor" }
      ]
    },
    {
      label: "Hệ thống",
      icon: "settings",
      children: [
        { label: "API Clients", to: "/platform/api-clients" },
        { label: "Tài khoản nhận CK", to: "/platform/settings/bank-account" }
      ]
    }
  ]);
  return { navigationItems };
}
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformSidebarContent",
  __ssrInlineRender: true,
  setup(__props) {
    const { navigationItems } = usePlatformNavigation();
    const route = useRoute$1();
    function isActive(to) {
      if (!to) return false;
      if (to === "/platform") return route.path === "/platform";
      return route.path === to || route.path.startsWith(to + "/");
    }
    function isGroupActive(item) {
      return Boolean(item.children?.some((child) => isActive(child.to)));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      _push(`<!--[--><div class="h-14 flex items-center px-6 border-b border-[#e5e7eb]">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/platform",
        class: "flex items-center gap-2"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="size-6 bg-[#0f0f29] rounded flex items-center justify-center"${_scopeId}><span class="material-symbols-outlined !text-white" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}"${_scopeId}>confirmation_number</span></div><span class="font-bold text-slate-900 tracking-tight"${_scopeId}>Thần Nông</span>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "size-6 bg-[#0f0f29] rounded flex items-center justify-center" }, [
                vueExports.createVNode("span", {
                  class: "material-symbols-outlined !text-white",
                  style: { "font-size": "14px" }
                }, "confirmation_number")
              ]),
              vueExports.createVNode("span", { class: "font-bold text-slate-900 tracking-tight" }, "Thần Nông")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><nav class="flex-1 overflow-y-auto py-4 flex flex-col gap-1"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(navigationItems), (item) => {
        _push(`<!--[-->`);
        if (!item.children && item.to) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: item.to,
            class: ["flex items-center gap-3 px-6 py-2 border-l-2 transition-colors", isActive(item.to) ? "border-primary bg-primary/5 text-nav-text-primary" : "border-transparent hover:bg-gray-100 text-nav-text-primary"]
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="material-symbols-outlined text-nav-text-secondary"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.icon)}</span><span class="text-[14px] font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</span>`);
              } else {
                return [
                  vueExports.createVNode("span", { class: "material-symbols-outlined text-nav-text-secondary" }, vueExports.toDisplayString(item.icon), 1),
                  vueExports.createVNode("span", { class: "text-[14px] font-medium" }, vueExports.toDisplayString(item.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else if (item.children) {
          _push(`<details class="group"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(item.defaultOpen || isGroupActive(item)) ? " open" : ""}><summary class="${serverRenderer_cjs_prodExports.ssrRenderClass([isGroupActive(item) ? "border-primary bg-primary/5" : "border-transparent hover:bg-gray-100", "flex items-center justify-between px-6 py-2 cursor-pointer border-l-2 text-nav-text-primary list-none"])}"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-nav-text-secondary">${serverRenderer_cjs_prodExports.ssrInterpolate(item.icon)}</span><span class="text-[14px] font-medium">${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</span></div><span class="material-symbols-outlined text-nav-text-secondary transition-transform group-open:rotate-180">expand_more</span></summary><div class="flex flex-col mt-1"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(item.children, (child) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              key: child.to,
              to: child.to,
              class: ["pl-[52px] pr-6 py-2 text-[13px] border-l-2 transition-colors", isActive(child.to) ? "text-primary font-semibold bg-primary/5 border-primary" : "text-nav-text-secondary hover:text-primary hover:bg-gray-50 border-transparent"]
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(child.label)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(child.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></details>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></nav><div class="p-4 border-t border-[#e5e7eb]"><div class="flex items-center gap-3 text-[#6b7280]"><span class="material-symbols-outlined">help_outline</span><span class="text-[13px]">Trợ giúp &amp; Hỗ trợ</span></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/PlatformSidebarContent.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$4, { __name: "LayoutPlatformSidebarContent" });
const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_LayoutPlatformSidebarContent = __nuxt_component_0$1;
  _push(`<aside${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "hidden lg:flex w-[240px] flex-shrink-0 flex-col bg-[#fafafa] border-r border-[#e5e7eb] z-20 overflow-y-auto" }, _attrs))}>`);
  _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LayoutPlatformSidebarContent, null, null, _parent));
  _push(`</aside>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/PlatformSidebar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]), { __name: "LayoutPlatformSidebar" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformHeader",
  __ssrInlineRender: true,
  emits: ["toggleMobileSidebar"],
  setup(__props) {
    const { user, clearAuth } = usePlatformAuth();
    const router = useRouter();
    const isLoggingOut = vueExports.ref(false);
    const showUserMenu = vueExports.ref(false);
    async function handleLogout() {
      isLoggingOut.value = true;
      try {
        await apiPlatformLogout();
      } catch {
      } finally {
        clearAuth();
        isLoggingOut.value = false;
        router.push("/login");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      _push(`<header${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "h-14 flex-shrink-0 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 z-10" }, _attrs))}><div class="flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        class: "lg:hidden",
        icon: "i-lucide-menu",
        color: "neutral",
        variant: "ghost",
        onClick: ($event) => _ctx.$emit("toggleMobileSidebar")
      }, null, _parent));
      _push(`<div class="flex flex-col justify-center"><h1 class="text-[16px] font-semibold text-[#111827] leading-tight"> Thần Nông </h1><p class="text-[12px] text-[#6b7280]"> Quản lý yêu cầu dịch vụ </p></div></div><div class="flex items-center gap-4"><div class="relative" data-user-menu><button class="flex items-center gap-3 hover:opacity-80 transition-opacity"><div class="hidden sm:block text-right"><p class="text-[13px] font-medium text-slate-900 leading-none">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(user)?.name ?? "Platform")}</p><p class="text-[11px] text-[#6b7280] mt-[2px]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(user)?.email ?? "")}</p></div><div class="size-9 rounded-full bg-[#0f0f29] flex items-center justify-center text-white text-[14px] font-semibold flex-shrink-0">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(user)?.name?.charAt(0)?.toUpperCase() ?? "R")}</div></button>`);
      if (vueExports.unref(showUserMenu)) {
        _push(`<div class="absolute right-0 top-full mt-2 w-44 bg-white border border-[#e5e7eb] rounded shadow-md z-50"><div class="px-4 py-3 border-b border-[#e5e7eb]"><p class="text-[13px] font-medium text-slate-900 truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(user)?.name)}</p><p class="text-[11px] text-[#6b7280] truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(user)?.email)}</p></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-log-out",
          label: vueExports.unref(isLoggingOut) ? "Đang thoát..." : "Đăng xuất",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          class: "w-full justify-start",
          disabled: vueExports.unref(isLoggingOut),
          onClick: handleLogout
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/PlatformHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$2, { __name: "LayoutPlatformHeader" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformMobileSidebar",
  __ssrInlineRender: true,
  props: {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  },
  emits: ["update:open"],
  setup(__props) {
    const open = vueExports.useModel(__props, "open");
    const route = useRoute$1();
    vueExports.watch(() => route.fullPath, () => {
      open.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutPlatformSidebarContent = __nuxt_component_0$1;
      _push(`<!--[-->`);
      if (open.value) {
        _push(`<div class="fixed inset-0 bg-black/40 z-30 lg:hidden" data-v-798c1910></div>`);
      } else {
        _push(`<!---->`);
      }
      if (open.value) {
        _push(`<aside class="fixed top-0 left-0 h-full w-[240px] flex flex-col bg-[#fafafa] border-r border-[#e5e7eb] z-40 lg:hidden overflow-y-auto" data-v-798c1910>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LayoutPlatformSidebarContent, null, null, _parent));
        _push(`</aside>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/PlatformMobileSidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-798c1910"]]), { __name: "LayoutPlatformMobileSidebar" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "platform",
  __ssrInlineRender: true,
  setup(__props) {
    const mobileOpen = vueExports.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutPlatformSidebar = __nuxt_component_0;
      const _component_LayoutPlatformHeader = __nuxt_component_1;
      const _component_LayoutPlatformMobileSidebar = __nuxt_component_2;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex h-screen overflow-hidden bg-background-light" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LayoutPlatformSidebar, null, null, _parent));
      _push(`<div class="flex flex-1 flex-col min-w-0 overflow-hidden">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LayoutPlatformHeader, {
        onToggleMobileSidebar: ($event) => mobileOpen.value = !vueExports.unref(mobileOpen)
      }, null, _parent));
      _push(`<main class="flex-1 overflow-y-auto bg-background-light p-6"><div class="max-w-7xl mx-auto">`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LayoutPlatformMobileSidebar, {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/platform.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=platform-CMKrRH6r.mjs.map
