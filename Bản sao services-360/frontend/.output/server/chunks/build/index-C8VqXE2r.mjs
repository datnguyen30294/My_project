import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-W93D3Jpz.mjs';
import { a as usePolicyList, P as POLICY_TYPES, b as POLICY_TYPE_LABELS } from './usePolicies-fLtp10Zn.mjs';
import './apiError-DBrxF9au.mjs';
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
    useSeoMeta({ title: "Quản lý chính sách" });
    const { data, status, error, refresh } = usePolicyList();
    const policies = vueExports.computed(() => data.value?.data ?? []);
    const policyByType = vueExports.computed(
      () => Object.fromEntries(policies.value.map((p) => [p.type.value, p]))
    );
    function getIcon(type) {
      return type === POLICY_TYPES.TERMS_OF_SERVICE ? "i-lucide-scale" : "i-lucide-shield-check";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UIcon = _sfc_main$h;
      const _component_UBadge = _sfc_main$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-5 sm:gap-6" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Quản lý chính sách",
        description: "Quản lý điều khoản sử dụng và chính sách bảo mật."
      }, null, _parent));
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(2, (i) => {
          _push(`<div class="h-40 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList([("POLICY_TYPES" in _ctx ? _ctx.POLICY_TYPES : vueExports.unref(POLICY_TYPES)).TERMS_OF_SERVICE, ("POLICY_TYPES" in _ctx ? _ctx.POLICY_TYPES : vueExports.unref(POLICY_TYPES)).PRIVACY_POLICY], (pType) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            key: pType,
            to: `/pmc/policies/${pType}`,
            class: "bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow group"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-start gap-4"${_scopeId}><div class="p-3 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: getIcon(pType),
                  class: "size-6 text-slate-700"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><h3 class="font-bold text-slate-900 text-lg"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("POLICY_TYPE_LABELS" in _ctx ? _ctx.POLICY_TYPE_LABELS : vueExports.unref(POLICY_TYPE_LABELS))[pType])}</h3><p class="text-sm text-slate-500 mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(policyByType)[pType]?.title || "Chưa có nội dung")}</p><div class="flex items-center gap-3 mt-3"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  label: vueExports.unref(policyByType)[pType]?.is_published ? "Đã xuất bản" : "Chưa xuất bản",
                  color: vueExports.unref(policyByType)[pType]?.is_published ? "success" : "neutral",
                  variant: "subtle"
                }, null, _parent2, _scopeId));
                if (vueExports.unref(policyByType)[pType]?.updated_at) {
                  _push2(`<span class="text-xs text-slate-400"${_scopeId}> Cập nhật: ${serverRenderer_cjs_prodExports.ssrInterpolate(new Date(vueExports.unref(policyByType)[pType].updated_at).toLocaleDateString("vi-VN"))}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "size-5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 mt-1"
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "flex items-start gap-4" }, [
                    vueExports.createVNode("div", { class: "p-3 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors" }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: getIcon(pType),
                        class: "size-6 text-slate-700"
                      }, null, 8, ["name"])
                    ]),
                    vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                      vueExports.createVNode("h3", { class: "font-bold text-slate-900 text-lg" }, vueExports.toDisplayString(("POLICY_TYPE_LABELS" in _ctx ? _ctx.POLICY_TYPE_LABELS : vueExports.unref(POLICY_TYPE_LABELS))[pType]), 1),
                      vueExports.createVNode("p", { class: "text-sm text-slate-500 mt-1" }, vueExports.toDisplayString(vueExports.unref(policyByType)[pType]?.title || "Chưa có nội dung"), 1),
                      vueExports.createVNode("div", { class: "flex items-center gap-3 mt-3" }, [
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(policyByType)[pType]?.is_published ? "Đã xuất bản" : "Chưa xuất bản",
                          color: vueExports.unref(policyByType)[pType]?.is_published ? "success" : "neutral",
                          variant: "subtle"
                        }, null, 8, ["label", "color"]),
                        vueExports.unref(policyByType)[pType]?.updated_at ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "text-xs text-slate-400"
                        }, " Cập nhật: " + vueExports.toDisplayString(new Date(vueExports.unref(policyByType)[pType].updated_at).toLocaleDateString("vi-VN")), 1)) : vueExports.createCommentVNode("", true)
                      ])
                    ]),
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-chevron-right",
                      class: "size-5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 mt-1"
                    })
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/policies/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C8VqXE2r.mjs.map
