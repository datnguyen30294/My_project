import { b as useCsatReport, _ as __nuxt_component_0, a as __nuxt_component_2 } from './usePlatformReports-BrU8H7Za.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_3 } from './KpiCard-rAAySggO.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$2 } from './Skeleton-CKN2C2Mt.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, aM as _sfc_main$b } from './server.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { a as formatNumber } from './currency-DEb2TrW3.mjs';
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
  __name: "chat-luong-csat",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Chất lượng & CSAT - Báo cáo tổng hợp" });
    const months = vueExports.ref(6);
    const { data, status, error } = useCsatReport(vueExports.computed(() => ({ months: months.value })));
    const report = vueExports.computed(() => data.value?.data ?? null);
    const kpis = vueExports.computed(() => report.value?.kpis ?? null);
    const isLoading = vueExports.computed(() => status.value === "pending");
    const avgValue = vueExports.computed(
      () => kpis.value?.avg_rating == null ? "—" : `${kpis.value.avg_rating.toFixed(1)} / 5`
    );
    const qualityLabel = vueExports.computed(() => {
      const a = kpis.value?.avg_rating;
      if (a == null) return "Chưa có đánh giá";
      if (a >= 4.5) return "Rất tốt";
      if (a >= 4) return "Tốt";
      if (a >= 3) return "Khá";
      return "Cần cải thiện";
    });
    const avgAccent = vueExports.computed(() => {
      const a = kpis.value?.avg_rating;
      if (a == null) return "neutral";
      if (a >= 4) return "success";
      if (a >= 3) return "warning";
      return "error";
    });
    const cancelAccent = vueExports.computed(
      () => (kpis.value?.cancel_rate ?? 0) > 10 ? "error" : "neutral"
    );
    const hasRatings = vueExports.computed(() => (kpis.value?.rated_count ?? 0) > 0);
    const maxStarCount = vueExports.computed(
      () => Math.max(1, ...(report.value?.star_buckets ?? []).map((b) => b.count))
    );
    function starPct(count) {
      return Math.round(count / maxStarCount.value * 100);
    }
    function lowRatingColor(rating) {
      return rating <= 2 ? "error" : "warning";
    }
    const vendorColumns = [
      { accessorKey: "partner_name", header: "Vendor" },
      { id: "order_count", header: "Đơn" },
      { id: "csat", header: "CSAT" },
      { id: "cancel_count", header: "Huỷ" }
    ];
    const projectColumns = [
      { accessorKey: "project_name", header: "Dự án" },
      { id: "order_count", header: "Đơn" },
      { id: "csat", header: "CSAT" }
    ];
    const lowRatingColumns = [
      { accessorKey: "partner_name", header: "Vendor" },
      { accessorKey: "project_name", header: "Dự án" },
      { id: "resident_name", header: "Cư dân" },
      { id: "resident_rating", header: "Sao" },
      { id: "resident_rating_comment", header: "Nhận xét" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PlatformReportPageHeader = __nuxt_component_0;
      const _component_PlatformReportPeriodSelect = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_PlatformReportKpiCard = __nuxt_component_3;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_USkeleton = _sfc_main$2;
      const _component_UIcon = _sfc_main$h;
      const _component_UProgress = _sfc_main$b;
      const _component_UTable = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPageHeader, {
        title: "Chất lượng & CSAT",
        description: "Điểm hài lòng cư dân trên toàn bộ đơn marketplace vendor: CSAT, tỷ lệ phản hồi/hoàn tất/huỷ và đánh giá thấp cần theo dõi."
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
          title: "Không tải được báo cáo CSAT",
          description: "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.",
          class: "mb-6"
        }, null, _parent));
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Điểm trung bình",
          value: vueExports.unref(avgValue),
          sub: vueExports.unref(qualityLabel),
          icon: "i-lucide-star",
          accent: vueExports.unref(avgAccent),
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Tỷ lệ phản hồi",
          value: `${vueExports.unref(kpis)?.response_rate ?? 0}%`,
          sub: `${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(kpis)?.rated_count ?? 0)} / ${("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(kpis)?.total_orders ?? 0)} đơn`,
          icon: "i-lucide-message-square",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Hoàn tất",
          value: `${vueExports.unref(kpis)?.completion_rate ?? 0}%`,
          icon: "i-lucide-circle-check",
          accent: "success",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Huỷ đơn",
          value: `${vueExports.unref(kpis)?.cancel_rate ?? 0}%`,
          icon: "i-lucide-circle-x",
          accent: vueExports.unref(cancelAccent),
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Phân bố đánh giá theo sao",
          icon: "i-lucide-bar-chart-3",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (vueExports.unref(isLoading)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-40 w-full" }, null, _parent2, _scopeId));
              } else if (!vueExports.unref(hasRatings)) {
                _push2(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId}> Chưa có dữ liệu đánh giá. </div>`);
              } else {
                _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(report)?.star_buckets ?? [], (bucket) => {
                  _push2(`<div class="flex items-center gap-3"${_scopeId}><div class="flex w-12 shrink-0 items-center gap-1 text-sm font-medium text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(bucket.star)} `);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-star",
                    class: "size-3.5 text-amber-500"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UProgress, {
                    "model-value": starPct(bucket.count),
                    color: "warning",
                    class: "flex-1"
                  }, null, _parent2, _scopeId));
                  _push2(`<div class="w-10 shrink-0 text-right text-sm tabular-nums text-slate-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(bucket.count))}</div></div>`);
                });
                _push2(`<!--]--></div>`);
              }
            } else {
              return [
                vueExports.unref(isLoading) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-40 w-full"
                })) : !vueExports.unref(hasRatings) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "py-8 text-center text-sm text-slate-500"
                }, " Chưa có dữ liệu đánh giá. ")) : (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  class: "space-y-3"
                }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(report)?.star_buckets ?? [], (bucket) => {
                    return vueExports.openBlock(), vueExports.createBlock("div", {
                      key: bucket.star,
                      class: "flex items-center gap-3"
                    }, [
                      vueExports.createVNode("div", { class: "flex w-12 shrink-0 items-center gap-1 text-sm font-medium text-slate-700" }, [
                        vueExports.createTextVNode(vueExports.toDisplayString(bucket.star) + " ", 1),
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-star",
                          class: "size-3.5 text-amber-500"
                        })
                      ]),
                      vueExports.createVNode(_component_UProgress, {
                        "model-value": starPct(bucket.count),
                        color: "warning",
                        class: "flex-1"
                      }, null, 8, ["model-value"]),
                      vueExports.createVNode("div", { class: "w-10 shrink-0 text-right text-sm tabular-nums text-slate-600" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(bucket.count)), 1)
                    ]);
                  }), 128))
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "CSAT theo vendor",
          icon: "i-lucide-store",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(report)?.by_vendor ?? [],
                columns: vendorColumns,
                loading: vueExports.unref(isLoading)
              }, {
                "partner_name-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.partner_name)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.partner_name), 1)
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
                "csat-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count)), 1)
                    ];
                  }
                }),
                "cancel_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.cancel_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.cancel_count)), 1)
                    ];
                  }
                }),
                empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Chưa có đơn vendor trong kỳ. </div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có đơn vendor trong kỳ. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(report)?.by_vendor ?? [],
                  columns: vendorColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "partner_name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.partner_name), 1)
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "csat-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count)), 1)
                  ]),
                  "cancel_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.cancel_count)), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có đơn vendor trong kỳ. ")
                  ]),
                  _: 1
                }, 8, ["data", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "CSAT theo dự án",
          icon: "i-lucide-building-2",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(report)?.by_project ?? [],
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
                    _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Chưa có dự án phát sinh đơn trong kỳ. </div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có dự án phát sinh đơn trong kỳ. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(report)?.by_project ?? [],
                  columns: projectColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "project_name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.project_name), 1)
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "csat-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("residentRatingAvgLabel" in _ctx ? _ctx.residentRatingAvgLabel : vueExports.unref(residentRatingAvgLabel))(row.original.avg_rating, row.original.rated_count)), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có dự án phát sinh đơn trong kỳ. ")
                  ]),
                  _: 1
                }, 8, ["data", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Đánh giá thấp cần theo dõi (≤ 3 sao)",
          icon: "i-lucide-alert-triangle",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!vueExports.unref(isLoading) && (vueExports.unref(report)?.low_ratings.length ?? 0) === 0) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  icon: "i-lucide-thumbs-up",
                  color: "success",
                  variant: "subtle",
                  title: "Không có đánh giá thấp trong kỳ",
                  description: "Toàn bộ đánh giá cư dân trong kỳ đều từ 4 sao trở lên."
                }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                  data: vueExports.unref(report)?.low_ratings ?? [],
                  columns: lowRatingColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "resident_name-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.resident_name ?? "—")}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", null, vueExports.toDisplayString(row.original.resident_name ?? "—"), 1)
                      ];
                    }
                  }),
                  "resident_rating-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        color: lowRatingColor(row.original.resident_rating),
                        variant: "subtle",
                        label: `${row.original.resident_rating} ★`
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UBadge, {
                          color: lowRatingColor(row.original.resident_rating),
                          variant: "subtle",
                          label: `${row.original.resident_rating} ★`
                        }, null, 8, ["color", "label"])
                      ];
                    }
                  }),
                  "resident_rating_comment-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="text-slate-600"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.resident_rating_comment || "—")}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "text-slate-600" }, vueExports.toDisplayString(row.original.resident_rating_comment || "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              }
            } else {
              return [
                !vueExports.unref(isLoading) && (vueExports.unref(report)?.low_ratings.length ?? 0) === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  icon: "i-lucide-thumbs-up",
                  color: "success",
                  variant: "subtle",
                  title: "Không có đánh giá thấp trong kỳ",
                  description: "Toàn bộ đánh giá cư dân trong kỳ đều từ 4 sao trở lên."
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                  key: 1,
                  data: vueExports.unref(report)?.low_ratings ?? [],
                  columns: lowRatingColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "resident_name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", null, vueExports.toDisplayString(row.original.resident_name ?? "—"), 1)
                  ]),
                  "resident_rating-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      color: lowRatingColor(row.original.resident_rating),
                      variant: "subtle",
                      label: `${row.original.resident_rating} ★`
                    }, null, 8, ["color", "label"])
                  ]),
                  "resident_rating_comment-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "text-slate-600" }, vueExports.toDisplayString(row.original.resident_rating_comment || "—"), 1)
                  ]),
                  _: 1
                }, 8, ["data", "loading"]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/modules/bao-cao-tong-hop/chat-luong-csat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=chat-luong-csat-D6ayQyuF.mjs.map
