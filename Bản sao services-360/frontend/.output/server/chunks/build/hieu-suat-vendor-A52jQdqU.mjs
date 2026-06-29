import { c as useVendorScorecardReport, _ as __nuxt_component_0, a as __nuxt_component_2 } from './usePlatformReports-BrU8H7Za.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$2 } from './Table-17SH0cIR.mjs';
import { f as formatCurrency, a as formatNumber } from './currency-DEb2TrW3.mjs';
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

const VENDOR_DETAIL_BASE = "/platform/quan-ly-van-hanh/quan-ly-vendor";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "hieu-suat-vendor",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Hiệu suất vendor - Báo cáo tổng hợp" });
    const months = vueExports.ref(6);
    const { data, status, error } = useVendorScorecardReport(vueExports.computed(() => ({ months: months.value })));
    const report = vueExports.computed(() => data.value?.data ?? null);
    const vendors = vueExports.computed(() => report.value?.vendors ?? []);
    const isLoading = vueExports.computed(() => status.value === "pending");
    const columns = [
      { accessorKey: "partner_name", header: "Vendor" },
      { id: "order_count", header: "Đơn" },
      { id: "gmv", header: "GMV" },
      { id: "platform_fee", header: "Phí platform" },
      { id: "completion_rate", header: "Hoàn tất" },
      { id: "cancel_rate", header: "Huỷ" },
      { id: "csat", header: "CSAT" },
      { id: "mix", header: "SP / DV" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PlatformReportPageHeader = __nuxt_component_0;
      const _component_PlatformReportPeriodSelect = __nuxt_component_2;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$1;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UTable = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UIcon = _sfc_main$h;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPageHeader, {
        title: "Hiệu suất vendor",
        description: "Scorecard so sánh chéo toàn bộ vendor (đối tác B3) có phát sinh đơn marketplace, xếp giảm dần theo GMV."
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
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              to: VENDOR_DETAIL_BASE,
              icon: "i-lucide-store",
              label: "Quản lý vendor",
              color: "neutral",
              variant: "subtle"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                to: VENDOR_DETAIL_BASE,
                icon: "i-lucide-store",
                label: "Quản lý vendor",
                color: "neutral",
                variant: "subtle"
              })
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
          description: "Đã xảy ra lỗi khi tải hiệu suất vendor. Vui lòng thử lại.",
          class: "mb-6"
        }, null, _parent));
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Scorecard đối tác B3",
          icon: "i-lucide-store",
          compact: ""
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-500"${_scopeId}>Xếp theo GMV — click vendor để xem chi tiết vận hành.</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "text-xs text-slate-500" }, "Xếp theo GMV — click vendor để xem chi tiết vận hành.")
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(vendors),
                columns,
                loading: vueExports.unref(isLoading)
              }, {
                "partner_name-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `${VENDOR_DETAIL_BASE}/${row.original.partner_id}`,
                      class: "font-semibold text-primary hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.partner_name)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.partner_name), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `${VENDOR_DETAIL_BASE}/${row.original.partner_id}`,
                        class: "font-semibold text-primary hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.partner_name), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
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
                "platform_fee-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee)), 1)
                    ];
                  }
                }),
                "completion_rate-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.completion_rate)}%</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(row.original.completion_rate) + "%", 1)
                    ];
                  }
                }),
                "cancel_rate-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([row.original.cancel_rate > 10 ? "text-red-600 font-medium" : "", "tabular-nums"])}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.cancel_rate)}%</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", {
                        class: ["tabular-nums", row.original.cancel_rate > 10 ? "text-red-600 font-medium" : ""]
                      }, vueExports.toDisplayString(row.original.cancel_rate) + "%", 3)
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
                "mix-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums text-slate-600"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.product_count)} / ${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.service_count)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums text-slate-600" }, vueExports.toDisplayString(row.original.product_count) + " / " + vueExports.toDisplayString(row.original.service_count), 1)
                    ];
                  }
                }),
                empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="py-10 text-center"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-store",
                      class: "size-8 text-slate-300 mx-auto"
                    }, null, _parent3, _scopeId2));
                    _push3(`<p class="mt-2 text-sm font-medium text-slate-700"${_scopeId2}> Chưa có vendor có đơn </p><p class="text-xs text-slate-500"${_scopeId2}> Chưa có đối tác nào phát sinh đơn marketplace trong kỳ. </p></div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-10 text-center" }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-store",
                          class: "size-8 text-slate-300 mx-auto"
                        }),
                        vueExports.createVNode("p", { class: "mt-2 text-sm font-medium text-slate-700" }, " Chưa có vendor có đơn "),
                        vueExports.createVNode("p", { class: "text-xs text-slate-500" }, " Chưa có đối tác nào phát sinh đơn marketplace trong kỳ. ")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(vendors),
                  columns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "partner_name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_NuxtLink, {
                      to: `${VENDOR_DETAIL_BASE}/${row.original.partner_id}`,
                      class: "font-semibold text-primary hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.partner_name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "gmv-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.gmv)), 1)
                  ]),
                  "platform_fee-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee)), 1)
                  ]),
                  "completion_rate-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(row.original.completion_rate) + "%", 1)
                  ]),
                  "cancel_rate-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", {
                      class: ["tabular-nums", row.original.cancel_rate > 10 ? "text-red-600 font-medium" : ""]
                    }, vueExports.toDisplayString(row.original.cancel_rate) + "%", 3)
                  ]),
                  "csat-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count)), 1)
                  ]),
                  "mix-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums text-slate-600" }, vueExports.toDisplayString(row.original.product_count) + " / " + vueExports.toDisplayString(row.original.service_count), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-10 text-center" }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-store",
                        class: "size-8 text-slate-300 mx-auto"
                      }),
                      vueExports.createVNode("p", { class: "mt-2 text-sm font-medium text-slate-700" }, " Chưa có vendor có đơn "),
                      vueExports.createVNode("p", { class: "text-xs text-slate-500" }, " Chưa có đối tác nào phát sinh đơn marketplace trong kỳ. ")
                    ])
                  ]),
                  _: 1
                }, 8, ["data", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/modules/bao-cao-tong-hop/hieu-suat-vendor.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=hieu-suat-vendor-A52jQdqU.mjs.map
