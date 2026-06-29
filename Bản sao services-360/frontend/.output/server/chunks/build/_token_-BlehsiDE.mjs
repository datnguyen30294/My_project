import { x as _export_sfc, v as vueExports, p as useRoute$1, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { f as usePublicAcceptanceReport } from './useAcceptanceReports-lSZWdtC6.mjs';
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
  __name: "[token]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const token = vueExports.computed(() => String(route.params.token));
    const { data, status, error } = usePublicAcceptanceReport(token);
    const report = vueExports.computed(() => data.value?.data);
    const contentHtml = vueExports.computed(() => report.value?.content_html ?? "");
    function handlePrint() {
      (void 0).print();
    }
    useSeoMeta({ title: "Biên bản nghiệm thu" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "min-h-screen py-6 px-4" }, _attrs))} data-v-75dc5000><div class="max-w-3xl mx-auto" data-v-75dc5000><div class="acceptance-report-toolbar flex items-center justify-between gap-2 mb-4 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm" data-v-75dc5000><div class="min-w-0" data-v-75dc5000><h1 class="text-base font-semibold text-slate-900" data-v-75dc5000> Biên bản nghiệm thu </h1><p class="text-xs text-slate-500" data-v-75dc5000> Xem và in biên bản để ký xác nhận. </p></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        label: "In",
        icon: "i-lucide-printer",
        color: "primary",
        size: "sm",
        disabled: vueExports.unref(status) === "pending" || !!vueExports.unref(error),
        onClick: handlePrint
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="space-y-3" data-v-75dc5000><div class="h-6 bg-slate-100 rounded animate-pulse" data-v-75dc5000></div><div class="h-96 bg-slate-100 rounded animate-pulse" data-v-75dc5000></div></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-triangle",
          color: "error",
          variant: "subtle",
          title: "Không tìm thấy biên bản"
        }, {
          description: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Đường dẫn không hợp lệ hoặc biên bản đã bị xoá. `);
            } else {
              return [
                vueExports.createTextVNode(" Đường dẫn không hợp lệ hoặc biên bản đã bị xoá. ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<div class="acceptance-report-body bg-white border border-slate-200 rounded-xl p-4 sm:p-8 shadow-sm" data-v-75dc5000><div class="acceptance-report-content prose prose-sm max-w-none" data-v-75dc5000>${vueExports.unref(contentHtml) ?? ""}</div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/acceptance-report/[token].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _token_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-75dc5000"]]);

export { _token_ as default };
//# sourceMappingURL=_token_-BlehsiDE.mjs.map
