import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$2 } from './SelectMenu-DKHEMZj7.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, w as __nuxt_component_5, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4, o as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as _sfc_main$3 } from './Skeleton-CKN2C2Mt.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { Z as Zl } from './vue-datepicker-6F5-CyxW.mjs';
import { u as useReportDateRange } from './useReportDateRange-TMS_xfWx.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { u as useClosingPeriodOptions } from './useClosingPeriodOptions-DRcuaph0.mjs';
import './apiError-DBrxF9au.mjs';
import './Label-BBgw4vHh.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
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
import './index-QmZAbLx-.mjs';
import './Input-JXN8po_F.mjs';
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
import './useEntitySelect-DG9pQ_n0.mjs';
import './constants-G9YmtWtp.mjs';
import './useProjects-D4K3VYdb.mjs';
import './useClosingPeriods-HdCSZwWv.mjs';

function useOverviewSummary(params) {
  return useApiFetch("/pmc/reports/overview/summary", {
    query: params,
    watch: params ? [params] : void 0
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Báo cáo Tổng quan" });
    const {
      dateRange,
      dateFromRef,
      dateToRef,
      defaultFrom,
      defaultTo,
      formatDateRange,
      syncRangeFromRefs,
      resetToDefault
    } = useReportDateRange();
    const selectedProjectId = vueExports.ref(void 0);
    const selectedClosingPeriodId = vueExports.ref(void 0);
    useUrlFilters({
      date_from: { ref: dateFromRef, type: "string" },
      date_to: { ref: dateToRef, type: "string" },
      project_id: { ref: selectedProjectId, type: "number" },
      closing_period_id: { ref: selectedClosingPeriodId, type: "number" }
    });
    syncRangeFromRefs();
    const isClosingPeriodSelected = vueExports.computed(() => selectedClosingPeriodId.value != null);
    const hasFilters = vueExports.computed(
      () => selectedProjectId.value != null || selectedClosingPeriodId.value != null || dateFromRef.value && dateFromRef.value !== defaultFrom() || dateToRef.value && dateToRef.value !== defaultTo()
    );
    function clearFilters() {
      selectedProjectId.value = void 0;
      selectedClosingPeriodId.value = void 0;
      resetToDefault();
    }
    const filterParams = vueExports.computed(() => {
      if (selectedClosingPeriodId.value != null) {
        return { closing_period_id: selectedClosingPeriodId.value };
      }
      return {
        date_from: dateFromRef.value || void 0,
        date_to: dateToRef.value || void 0,
        project_id: selectedProjectId.value || void 0
      };
    });
    const { closingPeriodOptions } = useClosingPeriodOptions();
    const {
      data: summaryData,
      status: summaryStatus,
      error: summaryError
    } = useOverviewSummary(filterParams);
    const summary = vueExports.computed(() => summaryData.value?.data ?? null);
    const isLoading = (status) => status === "pending";
    function formatScore(value) {
      if (value == null) return "0";
      return value.toFixed(1);
    }
    const kpiCards = [
      { to: "/reports/sla", icon: "i-lucide-gauge", title: "SLA" },
      { to: "/reports/revenue-profit", icon: "i-lucide-trending-up", title: "Doanh thu & LN" },
      { to: "/reports/csat", icon: "i-lucide-smile-plus", title: "Hài lòng KH" },
      { to: "/reports/commission", icon: "i-lucide-coins", title: "Phân bổ hoa hồng" }
    ];
    const supplementaryReports = [
      { to: "/reports/operating-profit", label: "LN VH (Vật tư + HH)" },
      { to: "/reports/revenue-ticket", label: "Doanh thu (ticket)" },
      { to: "/reports/cashflow", label: "Dòng tiền" },
      { to: "/reports/vendor-order", label: "Đơn hàng vendor (Marketplace)" }
    ];
    const businessReferences = [
      { to: "/pmc/og-tickets", label: "OG Ticket / SLA vi phạm" },
      { to: "/pmc/finance/commission-summary", label: "Tổng hợp hoa hồng" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$1;
      const _component_USelectMenu = _sfc_main$2;
      const _component_ClientOnly = __nuxt_component_5;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_UIcon = _sfc_main$h;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_USkeleton = _sfc_main$3;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, { title: "Báo cáo Tổng quan" }, null, _parent));
      if (vueExports.unref(summaryError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, { error: vueExports.unref(summaryError) }, null, _parent));
      } else {
        _push(`<!--[-->`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Bộ lọc",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-4 items-end"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Kỳ chốt" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                      modelValue: vueExports.unref(selectedClosingPeriodId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedClosingPeriodId) ? selectedClosingPeriodId.value = $event : null,
                      items: vueExports.unref(closingPeriodOptions),
                      "value-key": "value",
                      placeholder: "Tất cả kỳ",
                      class: "w-72",
                      searchable: "",
                      "search-input": { placeholder: "Tìm kỳ chốt...", icon: "i-lucide-search" }
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USelectMenu, {
                        modelValue: vueExports.unref(selectedClosingPeriodId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedClosingPeriodId) ? selectedClosingPeriodId.value = $event : null,
                        items: vueExports.unref(closingPeriodOptions),
                        "value-key": "value",
                        placeholder: "Tất cả kỳ",
                        class: "w-72",
                        searchable: "",
                        "search-input": { placeholder: "Tìm kỳ chốt...", icon: "i-lucide-search" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Khoảng thời gian" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, null, {}, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_ClientOnly, null, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(vueExports.unref(Zl), {
                            modelValue: vueExports.unref(dateRange),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(dateRange) ? dateRange.value = $event : null,
                            range: "",
                            "partial-range": false,
                            "time-config": { enableTimePicker: false },
                            "model-type": "yyyy-MM-dd",
                            format: vueExports.unref(formatDateRange),
                            "auto-apply": "",
                            "max-date": /* @__PURE__ */ new Date(),
                            "input-class-name": "dp-custom-input",
                            teleport: true,
                            disabled: vueExports.unref(isClosingPeriodSelected),
                            class: "w-64"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "format", "max-date", "disabled"])
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Dự án" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
                      modelValue: vueExports.unref(selectedProjectId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                      placeholder: "Tất cả dự án",
                      disabled: vueExports.unref(isClosingPeriodSelected),
                      class: "w-48"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án",
                        disabled: vueExports.unref(isClosingPeriodSelected),
                        class: "w-48"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(hasFilters)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-x",
                  label: "Xóa bộ lọc",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  onClick: clearFilters
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (vueExports.unref(summary)) {
                _push2(`<p class="text-xs text-slate-500 mt-3"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-calendar",
                  class: "size-3.5 align-[-2px]"
                }, null, _parent2, _scopeId));
                _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</p>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap gap-4 items-end" }, [
                  vueExports.createVNode(_component_UFormField, { label: "Kỳ chốt" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_USelectMenu, {
                        modelValue: vueExports.unref(selectedClosingPeriodId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedClosingPeriodId) ? selectedClosingPeriodId.value = $event : null,
                        items: vueExports.unref(closingPeriodOptions),
                        "value-key": "value",
                        placeholder: "Tất cả kỳ",
                        class: "w-72",
                        searchable: "",
                        "search-input": { placeholder: "Tìm kỳ chốt...", icon: "i-lucide-search" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, { label: "Khoảng thời gian" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_ClientOnly, null, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(vueExports.unref(Zl), {
                            modelValue: vueExports.unref(dateRange),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(dateRange) ? dateRange.value = $event : null,
                            range: "",
                            "partial-range": false,
                            "time-config": { enableTimePicker: false },
                            "model-type": "yyyy-MM-dd",
                            format: vueExports.unref(formatDateRange),
                            "auto-apply": "",
                            "max-date": /* @__PURE__ */ new Date(),
                            "input-class-name": "dp-custom-input",
                            teleport: true,
                            disabled: vueExports.unref(isClosingPeriodSelected),
                            class: "w-64"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "format", "max-date", "disabled"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, { label: "Dự án" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án",
                        disabled: vueExports.unref(isClosingPeriodSelected),
                        class: "w-48"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                    ]),
                    _: 1
                  }),
                  vueExports.unref(hasFilters) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 0,
                    icon: "i-lucide-x",
                    label: "Xóa bộ lọc",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    onClick: clearFilters
                  })) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "text-xs text-slate-500 mt-3"
                }, [
                  vueExports.createVNode(_component_UIcon, {
                    name: "i-lucide-calendar",
                    class: "size-3.5 align-[-2px]"
                  }),
                  vueExports.createTextVNode(" " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ])) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(kpiCards, (card) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            key: card.to,
            to: card.to,
            class: "block group"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                  title: card.title,
                  icon: card.icon,
                  compact: "",
                  class: "h-full transition-all group-hover:ring-2 group-hover:ring-primary"
                }, {
                  "header-actions": vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-arrow-right",
                        class: "size-4 text-primary opacity-70 group-hover:opacity-100"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-arrow-right",
                          class: "size-4 text-primary opacity-70 group-hover:opacity-100"
                        })
                      ];
                    }
                  }),
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (isLoading(vueExports.unref(summaryStatus))) {
                        _push3(`<!--[-->`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-7 w-32 mb-2" }, null, _parent3, _scopeId2));
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-48" }, null, _parent3, _scopeId2));
                        _push3(`<!--]-->`);
                      } else {
                        _push3(`<!--[-->`);
                        if (card.title === "SLA") {
                          _push3(`<!--[-->`);
                          if (vueExports.unref(summary)?.sla) {
                            _push3(`<!--[--><p class="text-xl font-bold tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).sla.on_time_rate)}% </p><p class="text-xs text-slate-500 mt-1"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).sla.breached_count)} ticket vi phạm · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</p><!--]-->`);
                          } else {
                            _push3(`<!--[--><p class="text-xl font-bold text-slate-400"${_scopeId2}> — </p><p class="text-xs text-slate-500 mt-1"${_scopeId2}> Chưa có dữ liệu · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.period_label)}</p><!--]-->`);
                          }
                          _push3(`<!--]-->`);
                        } else if (card.title === "Doanh thu & LN") {
                          _push3(`<!--[-->`);
                          if (vueExports.unref(summary)?.revenue) {
                            _push3(`<!--[--><p class="text-xl font-bold tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).revenue.revenue))}</p><p class="text-xs text-slate-500 mt-1"${_scopeId2}> Margin gộp ~${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).revenue.margin_percent)}% · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</p><!--]-->`);
                          } else {
                            _push3(`<!--[--><p class="text-xl font-bold text-slate-400"${_scopeId2}> — </p><p class="text-xs text-slate-500 mt-1"${_scopeId2}> Chưa có dữ liệu · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.period_label)}</p><!--]-->`);
                          }
                          _push3(`<!--]-->`);
                        } else if (card.title === "Hài lòng KH") {
                          _push3(`<!--[-->`);
                          if (vueExports.unref(summary)?.csat) {
                            _push3(`<!--[--><p class="text-xl font-bold tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatScore(vueExports.unref(summary).csat.avg_score))} / ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).csat.max_score)}</p><p class="text-xs text-slate-500 mt-1"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).csat.response_rate)}% phản hồi · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</p><!--]-->`);
                          } else {
                            _push3(`<!--[--><p class="text-xl font-bold text-slate-400"${_scopeId2}> — </p><p class="text-xs text-slate-500 mt-1"${_scopeId2}> Chưa có dữ liệu · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.period_label)}</p><!--]-->`);
                          }
                          _push3(`<!--]-->`);
                        } else if (card.title === "Phân bổ hoa hồng") {
                          _push3(`<!--[-->`);
                          if (vueExports.unref(summary)?.commission) {
                            _push3(`<!--[--><p class="text-xl font-bold tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission.total_all_parties))}</p><p class="text-xs text-slate-500 mt-1"${_scopeId2}> Platform ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission.party_totals.platform))} · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</p><!--]-->`);
                          } else {
                            _push3(`<!--[--><p class="text-xl font-bold text-slate-400"${_scopeId2}> — </p><p class="text-xs text-slate-500 mt-1"${_scopeId2}> Chưa có dữ liệu · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.period_label)}</p><!--]-->`);
                          }
                          _push3(`<!--]-->`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`<!--]-->`);
                      }
                    } else {
                      return [
                        isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createVNode(_component_USkeleton, { class: "h-7 w-32 mb-2" }),
                          vueExports.createVNode(_component_USkeleton, { class: "h-4 w-48" })
                        ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                          card.title === "SLA" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                            vueExports.unref(summary)?.sla ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                              vueExports.createVNode("p", { class: "text-xl font-bold tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary).sla.on_time_rate) + "% ", 1),
                              vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, vueExports.toDisplayString(vueExports.unref(summary).sla.breached_count) + " ticket vi phạm · " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                            ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                              vueExports.createVNode("p", { class: "text-xl font-bold text-slate-400" }, " — "),
                              vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Chưa có dữ liệu · " + vueExports.toDisplayString(vueExports.unref(summary)?.period_label), 1)
                            ], 64))
                          ], 64)) : card.title === "Doanh thu & LN" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                            vueExports.unref(summary)?.revenue ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                              vueExports.createVNode("p", { class: "text-xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).revenue.revenue)), 1),
                              vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Margin gộp ~" + vueExports.toDisplayString(vueExports.unref(summary).revenue.margin_percent) + "% · " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                            ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                              vueExports.createVNode("p", { class: "text-xl font-bold text-slate-400" }, " — "),
                              vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Chưa có dữ liệu · " + vueExports.toDisplayString(vueExports.unref(summary)?.period_label), 1)
                            ], 64))
                          ], 64)) : card.title === "Hài lòng KH" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                            vueExports.unref(summary)?.csat ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                              vueExports.createVNode("p", { class: "text-xl font-bold tabular-nums" }, vueExports.toDisplayString(formatScore(vueExports.unref(summary).csat.avg_score)) + " / " + vueExports.toDisplayString(vueExports.unref(summary).csat.max_score), 1),
                              vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, vueExports.toDisplayString(vueExports.unref(summary).csat.response_rate) + "% phản hồi · " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                            ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                              vueExports.createVNode("p", { class: "text-xl font-bold text-slate-400" }, " — "),
                              vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Chưa có dữ liệu · " + vueExports.toDisplayString(vueExports.unref(summary)?.period_label), 1)
                            ], 64))
                          ], 64)) : card.title === "Phân bổ hoa hồng" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 3 }, [
                            vueExports.unref(summary)?.commission ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                              vueExports.createVNode("p", { class: "text-xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission.total_all_parties)), 1),
                              vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Platform " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission.party_totals.platform)) + " · " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                            ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                              vueExports.createVNode("p", { class: "text-xl font-bold text-slate-400" }, " — "),
                              vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Chưa có dữ liệu · " + vueExports.toDisplayString(vueExports.unref(summary)?.period_label), 1)
                            ], 64))
                          ], 64)) : vueExports.createCommentVNode("", true)
                        ], 64))
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_SharedSectionCard, {
                    title: card.title,
                    icon: card.icon,
                    compact: "",
                    class: "h-full transition-all group-hover:ring-2 group-hover:ring-primary"
                  }, {
                    "header-actions": vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-arrow-right",
                        class: "size-4 text-primary opacity-70 group-hover:opacity-100"
                      })
                    ]),
                    default: vueExports.withCtx(() => [
                      isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                        vueExports.createVNode(_component_USkeleton, { class: "h-7 w-32 mb-2" }),
                        vueExports.createVNode(_component_USkeleton, { class: "h-4 w-48" })
                      ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                        card.title === "SLA" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.unref(summary)?.sla ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                            vueExports.createVNode("p", { class: "text-xl font-bold tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary).sla.on_time_rate) + "% ", 1),
                            vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, vueExports.toDisplayString(vueExports.unref(summary).sla.breached_count) + " ticket vi phạm · " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                          ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                            vueExports.createVNode("p", { class: "text-xl font-bold text-slate-400" }, " — "),
                            vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Chưa có dữ liệu · " + vueExports.toDisplayString(vueExports.unref(summary)?.period_label), 1)
                          ], 64))
                        ], 64)) : card.title === "Doanh thu & LN" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                          vueExports.unref(summary)?.revenue ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                            vueExports.createVNode("p", { class: "text-xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).revenue.revenue)), 1),
                            vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Margin gộp ~" + vueExports.toDisplayString(vueExports.unref(summary).revenue.margin_percent) + "% · " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                          ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                            vueExports.createVNode("p", { class: "text-xl font-bold text-slate-400" }, " — "),
                            vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Chưa có dữ liệu · " + vueExports.toDisplayString(vueExports.unref(summary)?.period_label), 1)
                          ], 64))
                        ], 64)) : card.title === "Hài lòng KH" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                          vueExports.unref(summary)?.csat ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                            vueExports.createVNode("p", { class: "text-xl font-bold tabular-nums" }, vueExports.toDisplayString(formatScore(vueExports.unref(summary).csat.avg_score)) + " / " + vueExports.toDisplayString(vueExports.unref(summary).csat.max_score), 1),
                            vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, vueExports.toDisplayString(vueExports.unref(summary).csat.response_rate) + "% phản hồi · " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                          ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                            vueExports.createVNode("p", { class: "text-xl font-bold text-slate-400" }, " — "),
                            vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Chưa có dữ liệu · " + vueExports.toDisplayString(vueExports.unref(summary)?.period_label), 1)
                          ], 64))
                        ], 64)) : card.title === "Phân bổ hoa hồng" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 3 }, [
                          vueExports.unref(summary)?.commission ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                            vueExports.createVNode("p", { class: "text-xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission.total_all_parties)), 1),
                            vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Platform " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission.party_totals.platform)) + " · " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                          ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                            vueExports.createVNode("p", { class: "text-xl font-bold text-slate-400" }, " — "),
                            vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Chưa có dữ liệu · " + vueExports.toDisplayString(vueExports.unref(summary)?.period_label), 1)
                          ], 64))
                        ], 64)) : vueExports.createCommentVNode("", true)
                      ], 64))
                    ]),
                    _: 2
                  }, 1032, ["title", "icon"])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Báo cáo bổ sung",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul class="text-sm space-y-3"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(supplementaryReports, (item) => {
                _push2(`<li${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: item.to,
                  class: "text-primary font-medium hover:underline"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(item.label), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              return [
                vueExports.createVNode("ul", { class: "text-sm space-y-3" }, [
                  (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(supplementaryReports, (item) => {
                    return vueExports.createVNode("li", {
                      key: item.to
                    }, [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: item.to,
                        class: "text-primary font-medium hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(item.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]);
                  }), 64))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Liên kết nghiệp vụ",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul class="text-sm space-y-3 list-disc pl-5"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(businessReferences, (item) => {
                _push2(`<li${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: item.to,
                  class: "text-primary font-medium hover:underline"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(item.label), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              return [
                vueExports.createVNode("ul", { class: "text-sm space-y-3 list-disc pl-5" }, [
                  (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(businessReferences, (item) => {
                    return vueExports.createVNode("li", {
                      key: item.to
                    }, [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: item.to,
                        class: "text-primary font-medium hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(item.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]);
                  }), 64))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CYoEH4a5.mjs.map
