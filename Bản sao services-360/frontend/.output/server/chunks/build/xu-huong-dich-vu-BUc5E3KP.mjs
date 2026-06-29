import { f as useServiceAdoptionReport, _ as __nuxt_component_0, a as __nuxt_component_2 } from './usePlatformReports-BrU8H7Za.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_3 } from './KpiCard-rAAySggO.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$2 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$3 } from './Badge-W93D3Jpz.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, aM as _sfc_main$b } from './server.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { a as formatNumber, f as formatCurrency } from './currency-DEb2TrW3.mjs';
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
  __name: "xu-huong-dich-vu",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Xu hướng dịch vụ - Báo cáo tổng hợp" });
    const months = vueExports.ref(6);
    const { data, status, error } = useServiceAdoptionReport(vueExports.computed(() => ({ months: months.value })));
    const report = vueExports.computed(() => data.value?.data ?? null);
    const kpis = vueExports.computed(() => report.value?.kpis ?? null);
    const isLoading = vueExports.computed(() => status.value === "pending");
    const byTypeTotal = vueExports.computed(
      () => (report.value?.by_type ?? []).reduce((sum, t) => sum + t.order_count, 0)
    );
    function typeSharePct(orderCount) {
      return byTypeTotal.value > 0 ? Math.round(orderCount / byTypeTotal.value * 100) : 0;
    }
    function typeColor(value) {
      return value === "product" ? "primary" : "info";
    }
    const offerColumns = [
      { accessorKey: "title", header: "Tên offer" },
      { id: "type", header: "Loại" },
      { accessorKey: "partner_name", header: "Vendor" },
      { id: "order_count", header: "Đơn" },
      { id: "gmv", header: "GMV" }
    ];
    const monthlyColumns = [
      { accessorKey: "month_label", header: "Tháng" },
      { id: "order_count", header: "Tổng đơn" },
      { id: "product_count", header: "SP" },
      { id: "service_count", header: "DV" },
      { id: "gmv", header: "GMV" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PlatformReportPageHeader = __nuxt_component_0;
      const _component_PlatformReportPeriodSelect = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_PlatformReportKpiCard = __nuxt_component_3;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_USkeleton = _sfc_main$2;
      const _component_UBadge = _sfc_main$3;
      const _component_UProgress = _sfc_main$b;
      const _component_UTable = _sfc_main$4;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPageHeader, {
        title: "Xu hướng dịch vụ",
        description: "Mức độ tiêu thụ sản phẩm/dịch vụ trên đơn marketplace vendor: offer hot, tỷ trọng theo số đơn và xu hướng theo tháng."
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
          description: "Đã xảy ra lỗi khi tải xu hướng dịch vụ. Vui lòng thử lại.",
          class: "mb-6"
        }, null, _parent));
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Offer/DV đang active",
          value: ("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(kpis)?.total_offers ?? 0),
          sub: "Bộ vendor + loại + tên",
          icon: "i-lucide-package",
          accent: "primary",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Offer hot nhất",
          value: vueExports.unref(kpis)?.top_offer?.title ?? "—",
          sub: vueExports.unref(kpis)?.top_offer ? `${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(kpis).top_offer.order_count)} đơn` : "",
          icon: "i-lucide-flame",
          accent: "warning",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Tỷ trọng sản phẩm",
          value: `${vueExports.unref(kpis)?.product_share ?? 0}%`,
          sub: "Theo số đơn",
          icon: "i-lucide-box",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Tỷ trọng dịch vụ",
          value: `${vueExports.unref(kpis)?.service_share ?? 0}%`,
          sub: "Theo số đơn",
          icon: "i-lucide-wrench",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Mix sản phẩm vs dịch vụ",
          icon: "i-lucide-pie-chart",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (vueExports.unref(isLoading)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-28 w-full" }, null, _parent2, _scopeId));
              } else if ((vueExports.unref(report)?.by_type.length ?? 0) === 0) {
                _push2(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId}> Chưa có đơn dịch vụ trong kỳ. </div>`);
              } else {
                _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(report)?.by_type ?? [], (bucket) => {
                  _push2(`<div class="rounded-lg border border-slate-200 p-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><span class="font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(bucket.type.label)}</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: typeColor(bucket.type.value),
                    variant: "subtle",
                    label: `${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(bucket.order_count)} đơn`
                  }, null, _parent2, _scopeId));
                  _push2(`</div><div class="mt-2 text-lg font-bold text-slate-900 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(bucket.gmv))}</div>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UProgress, {
                    "model-value": typeSharePct(bucket.order_count),
                    color: typeColor(bucket.type.value),
                    class: "mt-3"
                  }, null, _parent2, _scopeId));
                  _push2(`<div class="mt-1 text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(typeSharePct(bucket.order_count))}% số đơn </div></div>`);
                });
                _push2(`<!--]--></div>`);
              }
            } else {
              return [
                vueExports.unref(isLoading) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-28 w-full"
                })) : (vueExports.unref(report)?.by_type.length ?? 0) === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "py-8 text-center text-sm text-slate-500"
                }, " Chưa có đơn dịch vụ trong kỳ. ")) : (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  class: "grid grid-cols-1 sm:grid-cols-2 gap-4"
                }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(report)?.by_type ?? [], (bucket) => {
                    return vueExports.openBlock(), vueExports.createBlock("div", {
                      key: bucket.type.value,
                      class: "rounded-lg border border-slate-200 p-4"
                    }, [
                      vueExports.createVNode("div", { class: "flex items-center justify-between" }, [
                        vueExports.createVNode("span", { class: "font-semibold text-slate-900" }, vueExports.toDisplayString(bucket.type.label), 1),
                        vueExports.createVNode(_component_UBadge, {
                          color: typeColor(bucket.type.value),
                          variant: "subtle",
                          label: `${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(bucket.order_count)} đơn`
                        }, null, 8, ["color", "label"])
                      ]),
                      vueExports.createVNode("div", { class: "mt-2 text-lg font-bold text-slate-900 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(bucket.gmv)), 1),
                      vueExports.createVNode(_component_UProgress, {
                        "model-value": typeSharePct(bucket.order_count),
                        color: typeColor(bucket.type.value),
                        class: "mt-3"
                      }, null, 8, ["model-value", "color"]),
                      vueExports.createVNode("div", { class: "mt-1 text-xs text-slate-500" }, vueExports.toDisplayString(typeSharePct(bucket.order_count)) + "% số đơn ", 1)
                    ]);
                  }), 128))
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Top offer / dịch vụ (theo số đơn)",
          icon: "i-lucide-list-ordered",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(report)?.offers ?? [],
                columns: offerColumns,
                loading: vueExports.unref(isLoading)
              }, {
                "title-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.title || "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.title || "—"), 1)
                    ];
                  }
                }),
                "type-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      color: typeColor(row.original.type.value),
                      variant: "subtle",
                      label: row.original.type.label
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        color: typeColor(row.original.type.value),
                        variant: "subtle",
                        label: row.original.type.label
                      }, null, 8, ["color", "label"])
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
                empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Chưa có đơn dịch vụ trong kỳ. </div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có đơn dịch vụ trong kỳ. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(report)?.offers ?? [],
                  columns: offerColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "title-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.title || "—"), 1)
                  ]),
                  "type-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      color: typeColor(row.original.type.value),
                      variant: "subtle",
                      label: row.original.type.label
                    }, null, 8, ["color", "label"])
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "gmv-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.gmv)), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có đơn dịch vụ trong kỳ. ")
                  ]),
                  _: 1
                }, 8, ["data", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Đơn theo tháng — SP vs DV",
          icon: "i-lucide-calendar-range",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(report)?.monthly ?? [],
                columns: monthlyColumns,
                loading: vueExports.unref(isLoading)
              }, {
                "order_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                    ];
                  }
                }),
                "product_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.product_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.product_count)), 1)
                    ];
                  }
                }),
                "service_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.service_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.service_count)), 1)
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
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(report)?.monthly ?? [],
                  columns: monthlyColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "product_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.product_count)), 1)
                  ]),
                  "service_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.service_count)), 1)
                  ]),
                  "gmv-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.gmv)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/modules/bao-cao-tong-hop/xu-huong-dich-vu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=xu-huong-dich-vu-BUc5E3KP.mjs.map
