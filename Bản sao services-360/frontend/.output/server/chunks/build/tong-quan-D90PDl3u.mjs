import { u as useReportOverview, _ as __nuxt_component_0, a as __nuxt_component_2 } from './usePlatformReports-BrU8H7Za.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_3 } from './KpiCard-rAAySggO.mjs';
import { _ as _sfc_main$2 } from './Skeleton-CKN2C2Mt.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$3 } from './Card-ywPiICev.mjs';
import { f as formatCurrency, a as formatNumber } from './currency-DEb2TrW3.mjs';
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

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "tong-quan",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Báo cáo tổng hợp - Thần Nông" });
    const months = vueExports.ref(6);
    const { data, status, error } = useReportOverview(vueExports.computed(() => ({ months: months.value })));
    const overview = vueExports.computed(() => data.value?.data ?? null);
    const kpis = vueExports.computed(() => overview.value?.kpis ?? null);
    const cards = vueExports.computed(() => overview.value?.report_cards ?? []);
    const csatPending = vueExports.computed(() => (kpis.value?.rated_count ?? 0) === 0);
    const csatHeadline = vueExports.computed(() => {
      if (!kpis.value || csatPending.value) return "—";
      return kpis.value.avg_rating.toFixed(1);
    });
    const CARD_META = {
      "revenue": { icon: "i-lucide-banknote", format: "money" },
      "csat": { icon: "i-lucide-smile", format: "rating" },
      "service-adoption": { icon: "i-lucide-trending-up", format: "money" },
      "resident-segments": { icon: "i-lucide-users", format: "count" },
      "tenant-health": { icon: "i-lucide-building-2", format: "count" },
      "commission-allocation": { icon: "i-lucide-split", format: "money" },
      "vendor-scorecard": { icon: "i-lucide-store", format: "count" }
    };
    function cardIcon(key) {
      return CARD_META[key]?.icon ?? "i-lucide-bar-chart-3";
    }
    function cardKpi(card) {
      const fmt = CARD_META[card.key]?.format ?? "count";
      if (fmt === "money") return formatCurrency(card.kpi);
      if (fmt === "rating") return card.kpi > 0 ? card.kpi.toFixed(1) : "—";
      return formatNumber(card.kpi);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PlatformReportPageHeader = __nuxt_component_0;
      const _component_PlatformReportPeriodSelect = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_PlatformReportKpiCard = __nuxt_component_3;
      const _component_USkeleton = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UCard = _sfc_main$3;
      const _component_UIcon = _sfc_main$h;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPageHeader, {
        title: "Báo cáo tổng hợp",
        description: "Tổng hợp xuyên toàn bộ công ty vận hành để theo dõi doanh thu, chất lượng và hiệu suất nền tảng.",
        "hide-hub": ""
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
          description: "Đã xảy ra lỗi khi tải dữ liệu tổng quan. Vui lòng thử lại.",
          class: "mb-6"
        }, null, _parent));
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Doanh thu nền tảng",
          value: ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.total_platform_revenue ?? 0),
          sub: "Hoa hồng marketplace + phí vận hành",
          icon: "i-lucide-banknote",
          accent: "success",
          pending: vueExports.unref(status) === "pending"
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "GMV marketplace",
          value: ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.marketplace_gmv ?? 0),
          sub: "Tách biệt doanh thu nền tảng",
          icon: "i-lucide-shopping-cart",
          pending: vueExports.unref(status) === "pending"
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "CSAT trung bình",
          value: vueExports.unref(csatHeadline),
          sub: `${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(kpis)?.rated_count ?? 0)} đơn đánh giá`,
          icon: "i-lucide-smile",
          accent: "warning",
          pending: vueExports.unref(status) === "pending"
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Cư dân có đơn",
          value: `${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(kpis)?.active_residents ?? 0)} / ${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(kpis)?.total_residents ?? 0)}`,
          sub: "Cư dân phát sinh đơn / tổng danh bạ",
          icon: "i-lucide-users",
          accent: "primary",
          pending: vueExports.unref(status) === "pending"
        }, null, _parent));
        _push(`</div>`);
        if (vueExports.unref(csatPending) && vueExports.unref(status) !== "pending") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            icon: "i-lucide-info",
            color: "info",
            variant: "subtle",
            title: "Chưa có đánh giá trong kỳ",
            description: "Chưa có lượt đánh giá nào của cư dân cho đơn marketplace trong khoảng thời gian này. Điểm hài lòng sẽ hiển thị khi có đánh giá.",
            class: "mb-6"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(status) === "pending") {
          _push(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(7, (i) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, {
              key: i,
              class: "h-32 w-full rounded-xl"
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(cards), (card) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              key: card.key,
              to: card.route,
              class: "block"
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, {
                    class: "h-full transition hover:border-primary/60 hover:shadow-md",
                    ui: { body: "px-5 py-4" }
                  }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="flex items-start gap-3"${_scopeId2}><div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"${_scopeId2}>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                          name: cardIcon(card.key),
                          class: "size-5 text-primary"
                        }, null, _parent3, _scopeId2));
                        _push3(`</div><div class="min-w-0 flex-1"${_scopeId2}><h3 class="font-bold text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(card.title)}</h3><p class="text-xs text-slate-500 mt-0.5"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(card.blurb)}</p><div class="mt-3 flex items-baseline gap-2"${_scopeId2}><span class="text-xl font-bold text-slate-900 tracking-tight"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(cardKpi(card))}</span><span class="text-xs text-slate-400"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(card.sub)}</span></div></div>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-chevron-right",
                          class: "size-5 text-slate-300 shrink-0"
                        }, null, _parent3, _scopeId2));
                        _push3(`</div>`);
                      } else {
                        return [
                          vueExports.createVNode("div", { class: "flex items-start gap-3" }, [
                            vueExports.createVNode("div", { class: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10" }, [
                              vueExports.createVNode(_component_UIcon, {
                                name: cardIcon(card.key),
                                class: "size-5 text-primary"
                              }, null, 8, ["name"])
                            ]),
                            vueExports.createVNode("div", { class: "min-w-0 flex-1" }, [
                              vueExports.createVNode("h3", { class: "font-bold text-slate-900" }, vueExports.toDisplayString(card.title), 1),
                              vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-0.5" }, vueExports.toDisplayString(card.blurb), 1),
                              vueExports.createVNode("div", { class: "mt-3 flex items-baseline gap-2" }, [
                                vueExports.createVNode("span", { class: "text-xl font-bold text-slate-900 tracking-tight" }, vueExports.toDisplayString(cardKpi(card)), 1),
                                vueExports.createVNode("span", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(card.sub), 1)
                              ])
                            ]),
                            vueExports.createVNode(_component_UIcon, {
                              name: "i-lucide-chevron-right",
                              class: "size-5 text-slate-300 shrink-0"
                            })
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  return [
                    vueExports.createVNode(_component_UCard, {
                      class: "h-full transition hover:border-primary/60 hover:shadow-md",
                      ui: { body: "px-5 py-4" }
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("div", { class: "flex items-start gap-3" }, [
                          vueExports.createVNode("div", { class: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10" }, [
                            vueExports.createVNode(_component_UIcon, {
                              name: cardIcon(card.key),
                              class: "size-5 text-primary"
                            }, null, 8, ["name"])
                          ]),
                          vueExports.createVNode("div", { class: "min-w-0 flex-1" }, [
                            vueExports.createVNode("h3", { class: "font-bold text-slate-900" }, vueExports.toDisplayString(card.title), 1),
                            vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-0.5" }, vueExports.toDisplayString(card.blurb), 1),
                            vueExports.createVNode("div", { class: "mt-3 flex items-baseline gap-2" }, [
                              vueExports.createVNode("span", { class: "text-xl font-bold text-slate-900 tracking-tight" }, vueExports.toDisplayString(cardKpi(card)), 1),
                              vueExports.createVNode("span", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(card.sub), 1)
                            ])
                          ]),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-chevron-right",
                            class: "size-5 text-slate-300 shrink-0"
                          })
                        ])
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/modules/bao-cao-tong-hop/tong-quan.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tong-quan-D90PDl3u.mjs.map
