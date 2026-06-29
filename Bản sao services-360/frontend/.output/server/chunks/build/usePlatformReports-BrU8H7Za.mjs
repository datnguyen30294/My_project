import { v as vueExports, ay as usePlatformApiFetch, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$2 } from './Select-CZE7Ef6n.mjs';

const HUB_ROUTE = "/platform/modules/bao-cao-tong-hop/tong-quan";
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PageHeader",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: { default: void 0 },
    hideHub: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "mb-6 flex flex-wrap items-start justify-between gap-4" }, _attrs))}><div><h1 class="text-2xl font-black text-slate-900 tracking-tight">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}</h1>`);
      if (__props.description) {
        _push(`<p class="text-slate-500 text-sm mt-1">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center gap-2 flex-wrap">`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "filters", {}, null, _push, _parent);
      if (!__props.hideHub) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          to: HUB_ROUTE,
          icon: "i-lucide-layout-dashboard",
          label: "Hub báo cáo",
          color: "neutral",
          variant: "outline"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/platform-report/PageHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "PlatformReportPageHeader" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PeriodSelect",
  __ssrInlineRender: true,
  props: {
    "modelValue": { required: true },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const months = vueExports.useModel(__props, "modelValue");
    const items = [
      { label: "1 tháng", value: 1 },
      { label: "3 tháng", value: 3 },
      { label: "6 tháng", value: 6 },
      { label: "12 tháng", value: 12 }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelect = _sfc_main$2;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, vueExports.mergeProps({
        modelValue: months.value,
        "onUpdate:modelValue": ($event) => months.value = $event,
        items,
        "value-key": "value",
        icon: "i-lucide-calendar",
        class: "min-w-[140px]"
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/platform-report/PeriodSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "PlatformReportPeriodSelect" });
function buildReportUrl(path, params) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== void 0 && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  const qs = query.toString();
  return qs ? `${path}?${qs}` : path;
}
function useReportOverview(params) {
  const url = vueExports.computed(() => buildReportUrl("/platform/reports/overview", { months: vueExports.toValue(params).months }));
  return usePlatformApiFetch(url);
}
function useRevenueReport(params) {
  const url = vueExports.computed(() => buildReportUrl("/platform/reports/revenue", { months: vueExports.toValue(params).months }));
  return usePlatformApiFetch(url);
}
function useCsatReport(params) {
  const url = vueExports.computed(() => buildReportUrl("/platform/reports/csat", { months: vueExports.toValue(params).months }));
  return usePlatformApiFetch(url);
}
function useServiceAdoptionReport(params) {
  const url = vueExports.computed(() => buildReportUrl("/platform/reports/service-adoption", { months: vueExports.toValue(params).months }));
  return usePlatformApiFetch(url);
}
function useResidentSegmentReport(params) {
  const url = vueExports.computed(() => buildReportUrl("/platform/reports/resident-segments", { months: vueExports.toValue(params).months }));
  return usePlatformApiFetch(url);
}
function useTenantHealthReport(params) {
  const url = vueExports.computed(() => {
    const p = vueExports.toValue(params);
    return buildReportUrl("/platform/reports/tenant-health", { months: p.months, company_id: p.company_id });
  });
  return usePlatformApiFetch(url);
}
function useCommissionAllocationReport(params) {
  const url = vueExports.computed(() => buildReportUrl("/platform/reports/commission-allocation", { months: vueExports.toValue(params).months }));
  return usePlatformApiFetch(url);
}
function useVendorScorecardReport(params) {
  const url = vueExports.computed(() => buildReportUrl("/platform/reports/vendor-scorecard", { months: vueExports.toValue(params).months }));
  return usePlatformApiFetch(url);
}

export { __nuxt_component_0 as _, __nuxt_component_2 as a, useCsatReport as b, useVendorScorecardReport as c, useCommissionAllocationReport as d, useResidentSegmentReport as e, useServiceAdoptionReport as f, useRevenueReport as g, useTenantHealthReport as h, useReportOverview as u };
//# sourceMappingURL=usePlatformReports-BrU8H7Za.mjs.map
