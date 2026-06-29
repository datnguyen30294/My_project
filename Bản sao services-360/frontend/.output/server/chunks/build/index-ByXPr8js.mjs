import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-W93D3Jpz.mjs';
import { u as useCommissionProjects } from './useCommissionConfig-CzVSCENv.mjs';
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
    useSeoMeta({ title: "Cấu hình hoa hồng" });
    const { data, status, error, refresh } = useCommissionProjects();
    const projects = vueExports.computed(() => data.value?.data ?? []);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UIcon = _sfc_main$h;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Cấu hình chia hoa hồng",
        description: "Thiết lập quy tắc chia tiền hoa hồng theo dự án"
      }, null, _parent));
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(6, (i) => {
          _push(`<div class="h-36 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(projects).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-12 text-center">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-building-2",
          class: "size-12 text-slate-300"
        }, null, _parent));
        _push(`<p class="mt-3 text-sm text-slate-400"> Chưa có dự án nào. </p></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(projects), (project) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            key: project.id,
            to: `/pmc/commission/${project.id}`,
            class: "block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-start justify-between gap-2 mb-2"${_scopeId}><h3 class="text-sm font-bold text-slate-900 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(project.name)}</h3>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  label: project.is_configured ? "Đã cấu hình" : "Chưa cấu hình",
                  color: project.is_configured ? "success" : "neutral",
                  variant: "subtle",
                  size: "xs",
                  class: "shrink-0"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="space-y-1 text-xs text-slate-500"${_scopeId}><p${_scopeId}> Mã: <span class="font-mono font-semibold text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(project.code)}</span></p>`);
                if (project.address) {
                  _push2(`<p${_scopeId}> Địa chỉ: ${serverRenderer_cjs_prodExports.ssrInterpolate(project.address)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                if (project.is_configured) {
                  _push2(`<p${_scopeId}> Phòng ban: ${serverRenderer_cjs_prodExports.ssrInterpolate(project.dept_rules_count)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "flex items-start justify-between gap-2 mb-2" }, [
                    vueExports.createVNode("h3", { class: "text-sm font-bold text-slate-900 truncate" }, vueExports.toDisplayString(project.name), 1),
                    vueExports.createVNode(_component_UBadge, {
                      label: project.is_configured ? "Đã cấu hình" : "Chưa cấu hình",
                      color: project.is_configured ? "success" : "neutral",
                      variant: "subtle",
                      size: "xs",
                      class: "shrink-0"
                    }, null, 8, ["label", "color"])
                  ]),
                  vueExports.createVNode("div", { class: "space-y-1 text-xs text-slate-500" }, [
                    vueExports.createVNode("p", null, [
                      vueExports.createTextVNode(" Mã: "),
                      vueExports.createVNode("span", { class: "font-mono font-semibold text-slate-700" }, vueExports.toDisplayString(project.code), 1)
                    ]),
                    project.address ? (vueExports.openBlock(), vueExports.createBlock("p", { key: 0 }, " Địa chỉ: " + vueExports.toDisplayString(project.address), 1)) : vueExports.createCommentVNode("", true),
                    project.is_configured ? (vueExports.openBlock(), vueExports.createBlock("p", { key: 1 }, " Phòng ban: " + vueExports.toDisplayString(project.dept_rules_count), 1)) : vueExports.createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/commission/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-ByXPr8js.mjs.map
