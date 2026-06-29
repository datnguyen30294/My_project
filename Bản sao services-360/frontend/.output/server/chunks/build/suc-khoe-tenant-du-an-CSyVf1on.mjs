import { h as useTenantHealthReport, _ as __nuxt_component_0, a as __nuxt_component_2 } from './usePlatformReports-BrU8H7Za.mjs';
import { _ as _sfc_main$1 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { f as formatCurrency, a as formatNumber } from './currency-DEb2TrW3.mjs';
import { r as residentRatingAvgLabel } from './rating-C4Dp507A.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports } from './server.mjs';
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
  __name: "suc-khoe-tenant-du-an",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Sức khỏe công ty vận hành & dự án - Báo cáo tổng hợp" });
    const months = vueExports.ref(6);
    const companyId = vueExports.ref(void 0);
    const { data, status, error } = useTenantHealthReport(vueExports.computed(() => ({ months: months.value })));
    const report = vueExports.computed(() => data.value?.data ?? null);
    const isLoading = vueExports.computed(() => status.value === "pending");
    const companyItems = vueExports.computed(() => [
      { value: void 0, label: "Tất cả công ty vận hành" },
      ...(report.value?.by_company ?? []).map((c) => ({ value: c.company_id, label: c.company_name }))
    ]);
    const selectedCompanyName = vueExports.computed(
      () => companyId.value ? report.value?.by_company.find((c) => c.company_id === companyId.value)?.company_name ?? null : null
    );
    const filteredCompanies = vueExports.computed(
      () => companyId.value ? (report.value?.by_company ?? []).filter((c) => c.company_id === companyId.value) : report.value?.by_company ?? []
    );
    const filteredProjects = vueExports.computed(
      () => selectedCompanyName.value ? (report.value?.by_project ?? []).filter((p) => p.company_name === selectedCompanyName.value) : report.value?.by_project ?? []
    );
    function trendLabel(trend) {
      return trend > 0 ? `+${trend}` : String(trend);
    }
    function trendClass(trend) {
      if (trend > 0) return "text-emerald-600";
      if (trend < 0) return "text-red-600";
      return "text-slate-400";
    }
    const companyColumns = [
      { accessorKey: "company_name", header: "Công ty vận hành" },
      { id: "status", header: "Trạng thái" },
      { id: "project_count", header: "Dự án" },
      { id: "order_count", header: "Số đơn OG" },
      { id: "revenue", header: "Doanh thu OG" },
      { id: "platform_fee", header: "Phí nền tảng" },
      { id: "csat", header: "CSAT" },
      { id: "order_trend", header: "Δ đơn T-1" }
    ];
    const projectColumns = [
      { accessorKey: "project_name", header: "Dự án" },
      { accessorKey: "company_name", header: "Công ty vận hành" },
      { id: "order_count", header: "Số đơn OG" },
      { id: "revenue", header: "Doanh thu OG" },
      { id: "platform_fee", header: "Phí nền tảng" },
      { id: "csat", header: "CSAT" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PlatformReportPageHeader = __nuxt_component_0;
      const _component_USelect = _sfc_main$1;
      const _component_PlatformReportPeriodSelect = __nuxt_component_2;
      const _component_UAlert = _sfc_main$2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UTable = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPageHeader, {
        title: "Sức khỏe công ty vận hành & dự án",
        description: "Hiệu suất từng công ty vận hành theo đơn vận hành OG (số đơn/doanh thu/phí nền tảng/CSAT) và chi tiết theo dự án, kèm thay đổi số đơn tháng gần nhất."
      }, {
        filters: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
              modelValue: vueExports.unref(companyId),
              "onUpdate:modelValue": ($event) => vueExports.isRef(companyId) ? companyId.value = $event : null,
              items: vueExports.unref(companyItems),
              "value-key": "value",
              icon: "i-lucide-building-2",
              class: "min-w-[200px]"
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPeriodSelect, {
              modelValue: vueExports.unref(months),
              "onUpdate:modelValue": ($event) => vueExports.isRef(months) ? months.value = $event : null
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_USelect, {
                modelValue: vueExports.unref(companyId),
                "onUpdate:modelValue": ($event) => vueExports.isRef(companyId) ? companyId.value = $event : null,
                items: vueExports.unref(companyItems),
                "value-key": "value",
                icon: "i-lucide-building-2",
                class: "min-w-[200px]"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
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
          description: "Đã xảy ra lỗi khi tải sức khỏe công ty vận hành & dự án. Vui lòng thử lại.",
          class: "mb-6"
        }, null, _parent));
      } else {
        _push(`<!--[-->`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Sức khỏe theo công ty vận hành",
          icon: "i-lucide-building-2",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(filteredCompanies),
                columns: companyColumns,
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
                "revenue-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue)), 1)
                    ];
                  }
                }),
                "platform_fee-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee)), 1)
                    ];
                  }
                }),
                "csat-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count)), 1)
                    ];
                  }
                }),
                "order_trend-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([trendClass(row.original.order_trend), "tabular-nums font-medium"])}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(trendLabel(row.original.order_trend))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", {
                        class: ["tabular-nums font-medium", trendClass(row.original.order_trend)]
                      }, vueExports.toDisplayString(trendLabel(row.original.order_trend)), 3)
                    ];
                  }
                }),
                empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Chưa có công ty vận hành / đơn trong kỳ. </div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có công ty vận hành / đơn trong kỳ. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(filteredCompanies),
                  columns: companyColumns,
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
                  "revenue-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue)), 1)
                  ]),
                  "platform_fee-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee)), 1)
                  ]),
                  "csat-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count)), 1)
                  ]),
                  "order_trend-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", {
                      class: ["tabular-nums font-medium", trendClass(row.original.order_trend)]
                    }, vueExports.toDisplayString(trendLabel(row.original.order_trend)), 3)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có công ty vận hành / đơn trong kỳ. ")
                  ]),
                  _: 1
                }, 8, ["data", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Chi tiết theo dự án",
          icon: "i-lucide-folder-kanban",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(filteredProjects),
                columns: projectColumns,
                loading: vueExports.unref(isLoading)
              }, {
                "project_name-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.project_name), 1)
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
                "revenue-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue)), 1)
                    ];
                  }
                }),
                "platform_fee-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee)), 1)
                    ];
                  }
                }),
                "csat-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count)), 1)
                    ];
                  }
                }),
                empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Chưa có dự án phát sinh đơn OG. </div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có dự án phát sinh đơn OG. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(filteredProjects),
                  columns: projectColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "project_name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.project_name), 1)
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "revenue-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue)), 1)
                  ]),
                  "platform_fee-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee)), 1)
                  ]),
                  "csat-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count)), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có dự án phát sinh đơn OG. ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/modules/bao-cao-tong-hop/suc-khoe-tenant-du-an.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=suc-khoe-tenant-du-an-CSyVf1on.mjs.map
