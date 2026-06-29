import { g as useRevenueReport, _ as __nuxt_component_0, a as __nuxt_component_2 } from './usePlatformReports-BrU8H7Za.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_3 } from './KpiCard-rAAySggO.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$2 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_6 } from './DualAxisChart-BTWuRjT1.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { f as formatCurrency, a as formatNumber } from './currency-DEb2TrW3.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports } from './server.mjs';
import './Select-CZE7Ef6n.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
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
import './Card-ywPiICev.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
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
  __name: "doanh-thu-tong-hop",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Doanh thu nền tảng - Báo cáo tổng hợp" });
    const months = vueExports.ref(6);
    const { data, status, error } = useRevenueReport(vueExports.computed(() => ({ months: months.value })));
    const report = vueExports.computed(() => data.value?.data ?? null);
    const kpis = vueExports.computed(() => report.value?.kpis ?? null);
    const isLoading = vueExports.computed(() => status.value === "pending");
    const chartPoints = vueExports.computed(
      () => (report.value?.analytics_months ?? []).map((m) => ({
        label: m.month_label,
        bar: m.tenant_revenue,
        line: m.order_count,
        dash: m.platform_revenue
      }))
    );
    const tenantColumns = [
      { accessorKey: "company_name", header: "Công ty vận hành" },
      { id: "status", header: "Trạng thái" },
      { id: "project_count", header: "Dự án" },
      { id: "order_count", header: "Số đơn vận hành" },
      { id: "tenant_revenue", header: "Doanh số vận hành (tham khảo)" },
      { id: "platform_revenue", header: "Tổng thu nền tảng" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PlatformReportPageHeader = __nuxt_component_0;
      const _component_PlatformReportPeriodSelect = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_PlatformReportKpiCard = __nuxt_component_3;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_USkeleton = _sfc_main$2;
      const _component_SharedDualAxisChart = __nuxt_component_6;
      const _component_UTable = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPageHeader, {
        title: "Doanh thu nền tảng",
        description: "Phí nền tảng thu được theo từng công ty vận hành và theo thời gian."
      }, {
        filters: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPeriodSelect, {
              modelValue: vueExports.unref(months),
              "onUpdate:modelValue": ($event) => vueExports.isRef(months) ? months.value = $event : null
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_PlatformReportPeriodSelect, {
                modelValue: vueExports.unref(months),
                "onUpdate:modelValue": ($event) => vueExports.isRef(months) ? months.value = $event : null
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          title: "Không tải được báo cáo",
          description: "Đã xảy ra lỗi khi tải báo cáo doanh thu. Vui lòng thử lại.",
          class: "mb-6"
        }, null, _parent));
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Tổng thu nền tảng",
          value: ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.total_platform_revenue ?? 0),
          sub: "Hoa hồng marketplace + phí vận hành",
          icon: "i-lucide-banknote",
          accent: "success",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "GMV marketplace",
          value: ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.marketplace_gmv ?? 0),
          sub: `${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(kpis)?.order_count ?? 0)} đơn`,
          icon: "i-lucide-shopping-cart",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Phí platform marketplace",
          value: ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.marketplace_platform_fee ?? 0),
          sub: `VH nhận ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.marketplace_vh_share ?? 0)}`,
          icon: "i-lucide-split",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Phí nền tảng (đơn vận hành)",
          value: ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.pmc_platform_fee ?? 0),
          sub: "Thu trên đơn dịch vụ vận hành",
          icon: "i-lucide-landmark",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Xu hướng kinh doanh theo công ty vận hành",
          icon: "i-lucide-trending-up",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (vueExports.unref(isLoading)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[280px] w-full" }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedDualAxisChart, {
                  points: vueExports.unref(chartPoints),
                  "bar-label": "Doanh số vận hành",
                  "line-label": "Số đơn",
                  "dash-label": "Phí nền tảng",
                  "line-unit": " đơn"
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                vueExports.unref(isLoading) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[280px] w-full"
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_SharedDualAxisChart, {
                  key: 1,
                  points: vueExports.unref(chartPoints),
                  "bar-label": "Doanh số vận hành",
                  "line-label": "Số đơn",
                  "dash-label": "Phí nền tảng",
                  "line-unit": " đơn"
                }, null, 8, ["points"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Thu platform theo công ty vận hành",
          icon: "i-lucide-building-2",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(report)?.by_tenant ?? [],
                columns: tenantColumns,
                loading: vueExports.unref(isLoading)
              }, {
                "company_name-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.company_name)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.company_name), 1)
                    ];
                  }
                }),
                "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      color: row.original.status.value === "active" ? "success" : "neutral",
                      variant: "subtle",
                      label: row.original.status.label
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        color: row.original.status.value === "active" ? "success" : "neutral",
                        variant: "subtle",
                        label: row.original.status.label
                      }, null, 8, ["color", "label"])
                    ];
                  }
                }),
                "project_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.project_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.project_count)), 1)
                    ];
                  }
                }),
                "order_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                    ];
                  }
                }),
                "tenant_revenue-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums text-slate-500" title="Doanh số đơn vận hành của công ty — không tính vào tổng thu nền tảng"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.tenant_revenue))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", {
                        class: "tabular-nums text-slate-500",
                        title: "Doanh số đơn vận hành của công ty — không tính vào tổng thu nền tảng"
                      }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.tenant_revenue)), 1)
                    ];
                  }
                }),
                "platform_revenue-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums font-bold text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_revenue))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_revenue)), 1)
                    ];
                  }
                }),
                empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Chưa có công ty vận hành phát sinh doanh thu. </div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có công ty vận hành phát sinh doanh thu. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(report)?.by_tenant ?? [],
                  columns: tenantColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "company_name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.company_name), 1)
                  ]),
                  "status-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      color: row.original.status.value === "active" ? "success" : "neutral",
                      variant: "subtle",
                      label: row.original.status.label
                    }, null, 8, ["color", "label"])
                  ]),
                  "project_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.project_count)), 1)
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "tenant_revenue-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", {
                      class: "tabular-nums text-slate-500",
                      title: "Doanh số đơn vận hành của công ty — không tính vào tổng thu nền tảng"
                    }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.tenant_revenue)), 1)
                  ]),
                  "platform_revenue-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_revenue)), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có công ty vận hành phát sinh doanh thu. ")
                  ]),
                  _: 1
                }, 8, ["data", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/modules/bao-cao-tong-hop/doanh-thu-tong-hop.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=doanh-thu-tong-hop-CvdTdFDu.mjs.map
