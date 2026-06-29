import { e as useResidentSegmentReport, _ as __nuxt_component_0, a as __nuxt_component_2 } from './usePlatformReports-BrU8H7Za.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_3 } from './KpiCard-rAAySggO.mjs';
import { _ as _sfc_main$2 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$3 } from './Card-ywPiICev.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, k as _sfc_main$h } from './server.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$5 } from './Table-17SH0cIR.mjs';
import { a as formatNumber, f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { r as residentRatingAvgLabel } from './rating-C4Dp507A.mjs';
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
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "phan-khuc-cu-dan",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Phân khúc cư dân - Báo cáo tổng hợp" });
    const months = vueExports.ref(6);
    const { data, status, error } = useResidentSegmentReport(vueExports.computed(() => ({ months: months.value })));
    const report = vueExports.computed(() => data.value?.data ?? null);
    const kpis = vueExports.computed(() => report.value?.kpis ?? null);
    const isLoading = vueExports.computed(() => status.value === "pending");
    function segmentColor(value) {
      return value === "project" ? "primary" : "neutral";
    }
    const residentColumns = [
      { id: "resident_name", header: "Khách hàng" },
      { id: "order_count", header: "Số đơn" },
      { id: "gmv", header: "GMV" },
      { id: "csat", header: "CSAT" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PlatformReportPageHeader = __nuxt_component_0;
      const _component_PlatformReportPeriodSelect = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_PlatformReportKpiCard = __nuxt_component_3;
      const _component_USkeleton = _sfc_main$2;
      const _component_UCard = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UTable = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPageHeader, {
        title: "Phân khúc cư dân",
        description: "Phân khúc theo nguồn khách: cư dân dự án vs khách vãng lai, trên miền đơn marketplace vendor."
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
          description: "Đã xảy ra lỗi khi tải phân khúc cư dân. Vui lòng thử lại.",
          class: "mb-6"
        }, null, _parent));
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Cư dân có đơn",
          value: `${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(kpis)?.active_residents ?? 0)} / ${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(kpis)?.total_residents ?? 0)}`,
          sub: "Có phát sinh đơn / tổng danh bạ",
          icon: "i-lucide-users",
          accent: "primary",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Đơn cư dân dự án",
          value: `${vueExports.unref(kpis)?.project_order_share ?? 0}%`,
          sub: "Theo số đơn",
          icon: "i-lucide-building-2",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Đơn khách vãng lai",
          value: `${vueExports.unref(kpis)?.walk_in_order_share ?? 0}%`,
          sub: "Theo số đơn",
          icon: "i-lucide-user-round",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "GMV cư dân dự án",
          value: ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.project_gmv ?? 0),
          sub: `Vãng lai ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.walk_in_gmv ?? 0)}`,
          icon: "i-lucide-banknote",
          accent: "success",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">`);
        if (vueExports.unref(isLoading)) {
          _push(`<!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(2, (i) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, {
              key: i,
              class: "h-36 w-full rounded-xl"
            }, null, _parent));
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(report)?.segments ?? [], (segment) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, {
              key: segment.source.value,
              ui: { body: "px-5 py-4" }
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="flex items-center justify-between"${_scopeId}><span class="font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(segment.source.label)}</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: segmentColor(segment.source.value),
                    variant: "subtle",
                    label: `${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(segment.order_count)} đơn`
                  }, null, _parent2, _scopeId));
                  _push2(`</div><div class="mt-3 text-2xl font-bold text-slate-900 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(segment.gmv))}</div><div class="mt-2 flex items-center gap-1.5 text-sm text-slate-500"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-star",
                    class: "size-4 text-amber-500"
                  }, null, _parent2, _scopeId));
                  _push2(`<span${_scopeId}>CSAT ${serverRenderer_cjs_prodExports.ssrInterpolate(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(segment.avg_rating, segment.rated_count))}</span></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex items-center justify-between" }, [
                      vueExports.createVNode("span", { class: "font-semibold text-slate-900" }, vueExports.toDisplayString(segment.source.label), 1),
                      vueExports.createVNode(_component_UBadge, {
                        color: segmentColor(segment.source.value),
                        variant: "subtle",
                        label: `${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(segment.order_count)} đơn`
                      }, null, 8, ["color", "label"])
                    ]),
                    vueExports.createVNode("div", { class: "mt-3 text-2xl font-bold text-slate-900 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(segment.gmv)), 1),
                    vueExports.createVNode("div", { class: "mt-2 flex items-center gap-1.5 text-sm text-slate-500" }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-star",
                        class: "size-4 text-amber-500"
                      }),
                      vueExports.createVNode("span", null, "CSAT " + vueExports.toDisplayString(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(segment.avg_rating, segment.rated_count)), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]-->`);
        }
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Top khách hàng theo số đơn",
          icon: "i-lucide-trophy",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(report)?.top_residents ?? [],
                columns: residentColumns,
                loading: vueExports.unref(isLoading)
              }, {
                "resident_name-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.resident_name ?? "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.resident_name ?? "—"), 1)
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
                "gmv-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.gmv))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.gmv)), 1)
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
                    _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Chưa có dữ liệu cư dân trong kỳ. </div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có dữ liệu cư dân trong kỳ. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(report)?.top_residents ?? [],
                  columns: residentColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "resident_name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.resident_name ?? "—"), 1)
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "gmv-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.gmv)), 1)
                  ]),
                  "csat-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count)), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có dữ liệu cư dân trong kỳ. ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/modules/bao-cao-tong-hop/phan-khuc-cu-dan.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=phan-khuc-cu-dan-4IQCfwjR.mjs.map
