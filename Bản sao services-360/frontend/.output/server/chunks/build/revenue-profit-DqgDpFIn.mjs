import { _ as _sfc_main$6 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$2 } from './SelectMenu-DKHEMZj7.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, w as __nuxt_component_5, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4, o as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as _sfc_main$3 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$4 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_13 } from './DonutChart-DD8U5f6E.mjs';
import { _ as _sfc_main$5 } from './Table-17SH0cIR.mjs';
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

function useRevenueProfitSummary(params) {
  return useApiFetch("/pmc/reports/revenue-profit/summary", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useRevenueProfitMonthly(params) {
  return useApiFetch("/pmc/reports/revenue-profit/monthly", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useRevenueProfitByProject(params) {
  return useApiFetch("/pmc/reports/revenue-profit/by-project", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useRevenueProfitByServiceCategory(params) {
  return useApiFetch(
    "/pmc/reports/revenue-profit/by-service-category",
    { query: params, watch: params ? [params] : void 0 }
  );
}
const ADJUSTMENT_KEY = "internal-adjustment";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "revenue-profit",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Báo cáo Doanh thu & Lợi nhuận" });
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
    } = useRevenueProfitSummary(filterParams);
    const summary = vueExports.computed(() => summaryData.value?.data ?? null);
    const {
      data: monthlyData,
      status: monthlyStatus
    } = useRevenueProfitMonthly(filterParams);
    const monthly = vueExports.computed(() => monthlyData.value?.data ?? []);
    const {
      data: byProjectData,
      status: byProjectStatus
    } = useRevenueProfitByProject(filterParams);
    const byProject = vueExports.computed(() => byProjectData.value?.data ?? []);
    const {
      data: byServiceData,
      status: byServiceStatus
    } = useRevenueProfitByServiceCategory(filterParams);
    const byService = vueExports.computed(() => byServiceData.value?.data ?? []);
    const isLoading = (status) => status === "pending";
    function toNum(value) {
      if (value == null) return 0;
      return typeof value === "string" ? parseFloat(value) || 0 : value;
    }
    function signed(value, fractionDigits = 1) {
      const sign = value > 0 ? "+" : "";
      return `${sign}${value.toFixed(fractionDigits)}%`;
    }
    const chartInner = { left: 56, right: 600, top: 32, bottom: 220 };
    const maxRevenue = vueExports.computed(() => {
      const max = Math.max(0, ...monthly.value.map((m) => toNum(m.revenue)));
      return max > 0 ? max : 1;
    });
    const chartBars = vueExports.computed(() => {
      const list = monthly.value;
      const n = list.length;
      if (n === 0) return [];
      const w = (chartInner.right - chartInner.left) / n;
      const barW = Math.min(44, w * 0.62);
      return list.map((m, i) => {
        const cx = chartInner.left + w * i + w / 2;
        const x = cx - barW / 2;
        const rev = toNum(m.revenue);
        const h2 = rev / maxRevenue.value * (chartInner.bottom - chartInner.top) * 0.92;
        const y = chartInner.bottom - h2;
        const revBn = rev / 1e9;
        return {
          x,
          y,
          w: barW,
          h: h2,
          cx,
          label: m.month,
          revShort: rev > 0 ? `${revBn.toFixed(2)}B` : ""
        };
      });
    });
    const marginBounds = vueExports.computed(() => {
      const margins = monthly.value.map((m) => m.margin_percent).filter((v) => v > 0);
      if (margins.length === 0) return { min: 0, max: 50 };
      const minVal = Math.min(...margins);
      const maxVal = Math.max(...margins);
      const padding = Math.max(2, (maxVal - minVal) * 0.25);
      return {
        min: Math.max(0, Math.floor(minVal - padding)),
        max: Math.ceil(maxVal + padding)
      };
    });
    const marginPoints = vueExports.computed(() => {
      const list = monthly.value;
      const n = list.length;
      if (n === 0) return [];
      const w = (chartInner.right - chartInner.left) / n;
      const { min, max } = marginBounds.value;
      const range = max - min || 1;
      return list.map((m, i) => {
        const t = (m.margin_percent - min) / range;
        const clamped = Math.min(1, Math.max(0, t));
        const x = chartInner.left + w * i + w / 2;
        const y = chartInner.bottom - clamped * (chartInner.bottom - chartInner.top);
        return { x, y, hasValue: m.margin_percent > 0 };
      });
    });
    const marginLinePoints = vueExports.computed(() => marginPoints.value.filter((p) => p.hasValue).map((p) => `${p.x},${p.y}`).join(" "));
    const chartYLabels = vueExports.computed(() => {
      const mxBn = maxRevenue.value / 1e9;
      return [`${(mxBn * 0.66).toFixed(1)}B`, `${(mxBn * 0.33).toFixed(1)}B`];
    });
    const bridge = vueExports.computed(() => {
      if (!summary.value) return null;
      return {
        revenue: toNum(summary.value.revenue),
        estimatedCost: toNum(summary.value.estimated_cost),
        grossProfit: toNum(summary.value.gross_profit),
        externalCommission: toNum(summary.value.external_commission),
        materialCost: toNum(summary.value.material_cost)
      };
    });
    const SERVICE_COLORS = ["#16a34a", "#2563eb", "#d97706", "#7c3aed", "#0d9488", "#dc2626"];
    const serviceDonutSlices = vueExports.computed(() => {
      let colorIdx = 0;
      return byService.value.filter((row) => row.category_key !== ADJUSTMENT_KEY && toNum(row.profit) > 0).map((row) => ({
        label: row.category_label,
        value: toNum(row.profit),
        color: SERVICE_COLORS[colorIdx++ % SERVICE_COLORS.length]
      }));
    });
    const projectDonutSlices = vueExports.computed(() => byProject.value.filter((row) => toNum(row.gross_profit) > 0).map((row, i) => ({
      label: row.project_name,
      value: toNum(row.gross_profit),
      color: SERVICE_COLORS[i % SERVICE_COLORS.length]
    })));
    const projectColumns = [
      { accessorKey: "project_name", header: "Dự án" },
      {
        accessorKey: "share_of_revenue_percent",
        header: "% đóng góp DT",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, `${row.original.share_of_revenue_percent.toFixed(1)}%`)
      },
      {
        accessorKey: "revenue",
        header: "Doanh thu",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, formatCurrency(row.original.revenue))
      },
      {
        accessorKey: "estimated_cost",
        header: "Chi phí ước",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, formatCurrency(row.original.estimated_cost))
      },
      {
        accessorKey: "gross_profit",
        header: "LN gộp",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums font-medium text-emerald-600" }, formatCurrency(row.original.gross_profit))
      },
      {
        accessorKey: "margin_percent",
        header: "Margin %",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, `${row.original.margin_percent.toFixed(1)}%`)
      },
      {
        accessorKey: "margin_alert",
        header: "Cảnh báo",
        cell: ({ row }) => {
          const alert = row.original.margin_alert;
          return vueExports.h(
            _sfc_main$6,
            {
              color: alert ? "warning" : "success",
              variant: "subtle",
              size: "sm"
            },
            () => alert ? "Dưới ngưỡng" : "Ổn định"
          );
        }
      }
    ];
    const marginAlertThreshold = vueExports.computed(() => summary.value?.margin_alert_threshold ?? 31);
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
      const _component_USkeleton = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UAlert = _sfc_main$4;
      const _component_SharedReportDonutChart = __nuxt_component_13;
      const _component_UTable = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Báo cáo Doanh thu & Lợi nhuận",
        description: "Tổng hợp doanh thu (trước/sau KM), chi phí ước, LN gộp và margin theo kỳ chốt — góc nhìn công ty vận hành"
      }, null, _parent));
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
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Doanh thu",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-40 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-48" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).revenue))}</p><p class="text-xs text-slate-500 mt-2"${_scopeId}> Tổng thu thực tế của các đơn trong kỳ chốt </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-40 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-48" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).revenue)), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, " Tổng thu thực tế của các đơn trong kỳ chốt ")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "LN gộp (ước)",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-40 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-48" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([toNum(vueExports.unref(summary).gross_profit) >= 0 ? "text-emerald-600" : "text-red-600", "text-2xl font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).gross_profit))}</p><p class="text-xs text-slate-500 mt-2"${_scopeId}> CP ước: <strong class="text-slate-700 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).estimated_cost))}</strong> · `);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: "/reports/commission",
                  class: "text-primary-600 hover:underline"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Xem HH theo NV → `);
                    } else {
                      return [
                        vueExports.createTextVNode(" Xem HH theo NV → ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-40 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-48" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", {
                    class: ["text-2xl font-bold tabular-nums", toNum(vueExports.unref(summary).gross_profit) >= 0 ? "text-emerald-600" : "text-red-600"]
                  }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).gross_profit)), 3),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, [
                    vueExports.createTextVNode(" CP ước: "),
                    vueExports.createVNode("strong", { class: "text-slate-700 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).estimated_cost)), 1),
                    vueExports.createTextVNode(" · "),
                    vueExports.createVNode(_component_NuxtLink, {
                      to: "/reports/commission",
                      class: "text-primary-600 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Xem HH theo NV → ")
                      ]),
                      _: 1
                    })
                  ])
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Margin gộp",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-44" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).margin_percent.toFixed(1))}% </p><p class="text-xs text-slate-500 mt-2"${_scopeId}> TB 6 tháng: ~${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).avg_margin_6_months.toFixed(1))}% </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-44" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary).margin_percent.toFixed(1)) + "% ", 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, " TB 6 tháng: ~" + vueExports.toDisplayString(vueExports.unref(summary).avg_margin_6_months.toFixed(1)) + "% ", 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "MoM — Doanh thu",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-7 w-24 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-40" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(summary).mom_revenue_percent >= 0 ? "text-emerald-600" : "text-red-600", "text-xl font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(signed(vueExports.unref(summary).mom_revenue_percent))}</p><p class="text-xs text-slate-500 mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).last_month_label || "—")} vs ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).prev_month_label || "—")}</p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-7 w-24 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-40" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", {
                    class: ["text-xl font-bold tabular-nums", vueExports.unref(summary).mom_revenue_percent >= 0 ? "text-emerald-600" : "text-red-600"]
                  }, vueExports.toDisplayString(signed(vueExports.unref(summary).mom_revenue_percent)), 3),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, vueExports.toDisplayString(vueExports.unref(summary).last_month_label || "—") + " vs " + vueExports.toDisplayString(vueExports.unref(summary).prev_month_label || "—"), 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "MoM — LN gộp",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-7 w-24 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-40" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(summary).mom_profit_percent >= 0 ? "text-emerald-600" : "text-red-600", "text-xl font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(signed(vueExports.unref(summary).mom_profit_percent))}</p><p class="text-xs text-slate-500 mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).last_month_label || "—")} vs ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).prev_month_label || "—")}</p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-7 w-24 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-40" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", {
                    class: ["text-xl font-bold tabular-nums", vueExports.unref(summary).mom_profit_percent >= 0 ? "text-emerald-600" : "text-red-600"]
                  }, vueExports.toDisplayString(signed(vueExports.unref(summary).mom_profit_percent)), 3),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, vueExports.toDisplayString(vueExports.unref(summary).last_month_label || "—") + " vs " + vueExports.toDisplayString(vueExports.unref(summary).prev_month_label || "—"), 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "QoQ — DT / LN gộp",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-7 w-40 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-32" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-base font-semibold tabular-nums"${_scopeId}><span class="${serverRenderer_cjs_prodExports.ssrRenderClass(vueExports.unref(summary).qoq_revenue_percent >= 0 ? "text-emerald-600" : "text-red-600")}"${_scopeId}> DT ${serverRenderer_cjs_prodExports.ssrInterpolate(signed(vueExports.unref(summary).qoq_revenue_percent))}</span><span class="text-slate-400 mx-1.5"${_scopeId}>·</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass(vueExports.unref(summary).qoq_profit_percent >= 0 ? "text-emerald-600" : "text-red-600")}"${_scopeId}> LN ${serverRenderer_cjs_prodExports.ssrInterpolate(signed(vueExports.unref(summary).qoq_profit_percent))}</span></p><p class="text-xs text-slate-500 mt-1"${_scopeId}> So với quý liền trước </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-7 w-40 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-32" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-base font-semibold tabular-nums" }, [
                    vueExports.createVNode("span", {
                      class: vueExports.unref(summary).qoq_revenue_percent >= 0 ? "text-emerald-600" : "text-red-600"
                    }, " DT " + vueExports.toDisplayString(signed(vueExports.unref(summary).qoq_revenue_percent)), 3),
                    vueExports.createVNode("span", { class: "text-slate-400 mx-1.5" }, "·"),
                    vueExports.createVNode("span", {
                      class: vueExports.unref(summary).qoq_profit_percent >= 0 ? "text-emerald-600" : "text-red-600"
                    }, " LN " + vueExports.toDisplayString(signed(vueExports.unref(summary).qoq_profit_percent)), 3)
                  ]),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " So với quý liền trước ")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Xu hướng 6 tháng",
          compact: "",
          class: "mb-6"
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-4 text-xs"${_scopeId}><span class="flex items-center gap-1.5"${_scopeId}><span class="inline-block size-2.5 rounded-sm bg-primary-500"${_scopeId}></span> Doanh thu </span><span class="flex items-center gap-1.5"${_scopeId}><span class="inline-block w-4 h-0.5 bg-amber-500 rounded-full"${_scopeId}></span> Margin % </span></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap gap-4 text-xs" }, [
                  vueExports.createVNode("span", { class: "flex items-center gap-1.5" }, [
                    vueExports.createVNode("span", { class: "inline-block size-2.5 rounded-sm bg-primary-500" }),
                    vueExports.createTextVNode(" Doanh thu ")
                  ]),
                  vueExports.createVNode("span", { class: "flex items-center gap-1.5" }, [
                    vueExports.createVNode("span", { class: "inline-block w-4 h-0.5 bg-amber-500 rounded-full" }),
                    vueExports.createTextVNode(" Margin % ")
                  ])
                ])
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(monthlyStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[280px] w-full" }, null, _parent2, _scopeId));
              } else if (vueExports.unref(monthly).length === 0) {
                _push2(`<p class="py-12 text-center text-sm text-slate-500"${_scopeId}> Chưa có dữ liệu trong kỳ đã chọn </p>`);
              } else {
                _push2(`<!--[--><p class="text-xs text-slate-500 mb-3"${_scopeId}> Cột: doanh thu sau KM (tỷ đồng) · Đường: margin gộp % (trục phải) </p><div class="w-full overflow-x-auto"${_scopeId}><svg class="min-w-[520px] w-full h-[280px] text-slate-500" viewBox="0 0 640 280" preserveAspectRatio="xMidYMid meet" aria-label="Biểu đồ doanh thu và margin theo tháng"${_scopeId}><line x1="56" y1="220" x2="600" y2="220" stroke="currentColor" stroke-opacity="0.2"${_scopeId}></line><line x1="56" y1="160" x2="600" y2="160" stroke="currentColor" stroke-opacity="0.08"${_scopeId}></line><line x1="56" y1="100" x2="600" y2="100" stroke="currentColor" stroke-opacity="0.08"${_scopeId}></line><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(chartBars), (b, i) => {
                  _push2(`<g${_scopeId}><rect${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", b.y)}${serverRenderer_cjs_prodExports.ssrRenderAttr("width", b.w)}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", b.h)} class="fill-primary-500/85" rx="3"${_scopeId}></rect><text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.cx)} y="238" text-anchor="middle" class="fill-current text-[11px]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(b.label)}</text>`);
                  if (b.revShort) {
                    _push2(`<text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.cx)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", b.y - 6)} text-anchor="middle" class="fill-current text-[10px] font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(b.revShort)}</text>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</g>`);
                });
                _push2(`<!--]-->`);
                if (vueExports.unref(marginLinePoints)) {
                  _push2(`<polyline${serverRenderer_cjs_prodExports.ssrRenderAttr("points", vueExports.unref(marginLinePoints))} fill="none" stroke="currentColor" stroke-width="2.5" class="text-amber-500" stroke-linecap="round" stroke-linejoin="round"${_scopeId}></polyline>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(marginPoints), (pt, i) => {
                  _push2(`<g${_scopeId}>`);
                  if (pt.hasValue) {
                    _push2(`<circle${serverRenderer_cjs_prodExports.ssrRenderAttr("cx", pt.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("cy", pt.y)} r="4" class="fill-amber-500"${_scopeId}></circle>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</g>`);
                });
                _push2(`<!--]--><text x="8" y="100" class="fill-current text-[10px]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(chartYLabels)[0])}</text><text x="8" y="160" class="fill-current text-[10px]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(chartYLabels)[1])}</text><text x="8" y="218" class="fill-current text-[10px]"${_scopeId}> 0 </text><text x="608" y="104" text-anchor="end" class="fill-current text-[10px]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(marginBounds).max)}% </text><text x="608" y="224" text-anchor="end" class="fill-current text-[10px]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(marginBounds).min)}% </text></svg></div><!--]-->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(monthlyStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[280px] w-full"
                })) : vueExports.unref(monthly).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 1,
                  class: "py-12 text-center text-sm text-slate-500"
                }, " Chưa có dữ liệu trong kỳ đã chọn ")) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mb-3" }, " Cột: doanh thu sau KM (tỷ đồng) · Đường: margin gộp % (trục phải) "),
                  vueExports.createVNode("div", { class: "w-full overflow-x-auto" }, [
                    (vueExports.openBlock(), vueExports.createBlock("svg", {
                      class: "min-w-[520px] w-full h-[280px] text-slate-500",
                      viewBox: "0 0 640 280",
                      preserveAspectRatio: "xMidYMid meet",
                      "aria-label": "Biểu đồ doanh thu và margin theo tháng"
                    }, [
                      vueExports.createVNode("line", {
                        x1: "56",
                        y1: "220",
                        x2: "600",
                        y2: "220",
                        stroke: "currentColor",
                        "stroke-opacity": "0.2"
                      }),
                      vueExports.createVNode("line", {
                        x1: "56",
                        y1: "160",
                        x2: "600",
                        y2: "160",
                        stroke: "currentColor",
                        "stroke-opacity": "0.08"
                      }),
                      vueExports.createVNode("line", {
                        x1: "56",
                        y1: "100",
                        x2: "600",
                        y2: "100",
                        stroke: "currentColor",
                        "stroke-opacity": "0.08"
                      }),
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(chartBars), (b, i) => {
                        return vueExports.openBlock(), vueExports.createBlock("g", {
                          key: "bar-" + i
                        }, [
                          vueExports.createVNode("rect", {
                            x: b.x,
                            y: b.y,
                            width: b.w,
                            height: b.h,
                            class: "fill-primary-500/85",
                            rx: "3"
                          }, null, 8, ["x", "y", "width", "height"]),
                          vueExports.createVNode("text", {
                            x: b.cx,
                            y: "238",
                            "text-anchor": "middle",
                            class: "fill-current text-[11px]"
                          }, vueExports.toDisplayString(b.label), 9, ["x"]),
                          b.revShort ? (vueExports.openBlock(), vueExports.createBlock("text", {
                            key: 0,
                            x: b.cx,
                            y: b.y - 6,
                            "text-anchor": "middle",
                            class: "fill-current text-[10px] font-medium"
                          }, vueExports.toDisplayString(b.revShort), 9, ["x", "y"])) : vueExports.createCommentVNode("", true)
                        ]);
                      }), 128)),
                      vueExports.unref(marginLinePoints) ? (vueExports.openBlock(), vueExports.createBlock("polyline", {
                        key: 0,
                        points: vueExports.unref(marginLinePoints),
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2.5",
                        class: "text-amber-500",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, null, 8, ["points"])) : vueExports.createCommentVNode("", true),
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(marginPoints), (pt, i) => {
                        return vueExports.openBlock(), vueExports.createBlock("g", {
                          key: "mpt-" + i
                        }, [
                          pt.hasValue ? (vueExports.openBlock(), vueExports.createBlock("circle", {
                            key: 0,
                            cx: pt.x,
                            cy: pt.y,
                            r: "4",
                            class: "fill-amber-500"
                          }, null, 8, ["cx", "cy"])) : vueExports.createCommentVNode("", true)
                        ]);
                      }), 128)),
                      vueExports.createVNode("text", {
                        x: "8",
                        y: "100",
                        class: "fill-current text-[10px]"
                      }, vueExports.toDisplayString(vueExports.unref(chartYLabels)[0]), 1),
                      vueExports.createVNode("text", {
                        x: "8",
                        y: "160",
                        class: "fill-current text-[10px]"
                      }, vueExports.toDisplayString(vueExports.unref(chartYLabels)[1]), 1),
                      vueExports.createVNode("text", {
                        x: "8",
                        y: "218",
                        class: "fill-current text-[10px]"
                      }, " 0 "),
                      vueExports.createVNode("text", {
                        x: "608",
                        y: "104",
                        "text-anchor": "end",
                        class: "fill-current text-[10px]"
                      }, vueExports.toDisplayString(vueExports.unref(marginBounds).max) + "% ", 1),
                      vueExports.createVNode("text", {
                        x: "608",
                        y: "224",
                        "text-anchor": "end",
                        class: "fill-current text-[10px]"
                      }, vueExports.toDisplayString(vueExports.unref(marginBounds).min) + "% ", 1)
                    ]))
                  ])
                ], 64))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Luồng tạo LN gộp (ước — cùng kỳ báo cáo)",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus)) || !vueExports.unref(bridge)) {
                _push2(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(3, (i) => {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, {
                    key: i,
                    class: "h-24"
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!--[--><div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center"${_scopeId}><div class="rounded-lg border border-primary-300 bg-primary-50 p-3"${_scopeId}><p class="text-[11px] text-slate-500 mb-1"${_scopeId}> Doanh thu </p><p class="font-bold tabular-nums text-sm text-primary-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(bridge).revenue))}</p></div><div class="rounded-lg border border-red-200 bg-red-50/60 p-3 flex flex-col justify-center"${_scopeId}><p class="text-red-700 text-sm font-bold"${_scopeId}> − CP ước </p><p class="text-[11px] text-slate-600 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(bridge).estimatedCost))}</p><p class="text-[10px] text-slate-500 mt-1"${_scopeId}> HH ngoài: ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(bridge).externalCommission))} · Vật tư: ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(bridge).materialCost))}</p></div><div class="rounded-lg border border-emerald-300 bg-emerald-50 p-3"${_scopeId}><p class="text-[11px] text-slate-500 mb-1"${_scopeId}> LN gộp </p><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(bridge).grossProfit >= 0 ? "text-emerald-700" : "text-red-700", "font-bold tabular-nums text-sm"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(bridge).grossProfit))}</p></div></div><p class="text-xs text-slate-500 mt-3 leading-relaxed"${_scopeId}> Đơn vị: đồng. Mục đích: cho BGĐ thấy nhanh DT → chi phí → LN gộp. <strong${_scopeId}>LN gộp KHÔNG trừ phần HH công ty VH</strong> (VH giữ lại). </p><!--]-->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) || !vueExports.unref(bridge) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "grid grid-cols-1 sm:grid-cols-3 gap-3"
                }, [
                  (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(3, (i) => {
                    return vueExports.createVNode(_component_USkeleton, {
                      key: i,
                      class: "h-24"
                    });
                  }), 64))
                ])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-center" }, [
                    vueExports.createVNode("div", { class: "rounded-lg border border-primary-300 bg-primary-50 p-3" }, [
                      vueExports.createVNode("p", { class: "text-[11px] text-slate-500 mb-1" }, " Doanh thu "),
                      vueExports.createVNode("p", { class: "font-bold tabular-nums text-sm text-primary-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(bridge).revenue)), 1)
                    ]),
                    vueExports.createVNode("div", { class: "rounded-lg border border-red-200 bg-red-50/60 p-3 flex flex-col justify-center" }, [
                      vueExports.createVNode("p", { class: "text-red-700 text-sm font-bold" }, " − CP ước "),
                      vueExports.createVNode("p", { class: "text-[11px] text-slate-600 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(bridge).estimatedCost)), 1),
                      vueExports.createVNode("p", { class: "text-[10px] text-slate-500 mt-1" }, " HH ngoài: " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(bridge).externalCommission)) + " · Vật tư: " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(bridge).materialCost)), 1)
                    ]),
                    vueExports.createVNode("div", { class: "rounded-lg border border-emerald-300 bg-emerald-50 p-3" }, [
                      vueExports.createVNode("p", { class: "text-[11px] text-slate-500 mb-1" }, " LN gộp "),
                      vueExports.createVNode("p", {
                        class: ["font-bold tabular-nums text-sm", vueExports.unref(bridge).grossProfit >= 0 ? "text-emerald-700" : "text-red-700"]
                      }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(bridge).grossProfit)), 3)
                    ])
                  ]),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-3 leading-relaxed" }, [
                    vueExports.createTextVNode(" Đơn vị: đồng. Mục đích: cho BGĐ thấy nhanh DT → chi phí → LN gộp. "),
                    vueExports.createVNode("strong", null, "LN gộp KHÔNG trừ phần HH công ty VH"),
                    vueExports.createTextVNode(" (VH giữ lại). ")
                  ])
                ], 64))
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(summary) && vueExports.unref(summary).insights.length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: "neutral",
            variant: "subtle",
            icon: "i-lucide-lightbulb",
            title: "Nhận định nhanh",
            class: "mb-6"
          }, {
            description: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<ul class="list-disc pl-5 text-sm space-y-1.5 mt-1"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(summary).insights, (line, idx) => {
                  _push2(`<li${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(line)}</li>`);
                });
                _push2(`<!--]--></ul>`);
              } else {
                return [
                  vueExports.createVNode("ul", { class: "list-disc pl-5 text-sm space-y-1.5 mt-1" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(summary).insights, (line, idx) => {
                      return vueExports.openBlock(), vueExports.createBlock("li", { key: idx }, vueExports.toDisplayString(line), 1);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Cơ cấu LN gộp theo loại dịch vụ",
          compact: ""
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-500 hidden sm:inline"${_scopeId}>Tỷ trọng theo nhóm dịch vụ</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "text-xs text-slate-500 hidden sm:inline" }, "Tỷ trọng theo nhóm dịch vụ")
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byServiceStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[220px] w-full" }, null, _parent2, _scopeId));
              } else if (vueExports.unref(byService).length === 0) {
                _push2(`<p class="py-12 text-center text-sm text-slate-500"${_scopeId}> Chưa có dữ liệu </p>`);
              } else {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportDonutChart, {
                  title: "Lợi nhuận theo loại dịch vụ",
                  slices: vueExports.unref(serviceDonutSlices),
                  "center-label": "Tổng LN",
                  "value-suffix": " đ"
                }, null, _parent2, _scopeId));
                _push2(`<ul class="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(byService).filter((r) => r.category_key === ADJUSTMENT_KEY), (row) => {
                  _push2(`<li class="flex items-start gap-2 text-slate-500"${_scopeId}><span class="mt-1 size-2 rounded-sm bg-slate-300"${_scopeId}></span><div class="flex-1"${_scopeId}><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.category_label)}</span><span class="ml-1 tabular-nums"${_scopeId}> — ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.profit))} (${serverRenderer_cjs_prodExports.ssrInterpolate(row.share_percent.toFixed(1))}%) </span></div></li>`);
                });
                _push2(`<!--]--></ul><p class="text-xs text-slate-500 mt-3 leading-relaxed"${_scopeId}> Hai biểu đồ (dịch vụ + dự án) cùng tổng = LN gộp kỳ. Dòng &quot;Điều chỉnh nội bộ&quot; là phần HH chưa phân bổ được xuống line. </p><!--]-->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(byServiceStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[220px] w-full"
                })) : vueExports.unref(byService).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 1,
                  class: "py-12 text-center text-sm text-slate-500"
                }, " Chưa có dữ liệu ")) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                  vueExports.createVNode(_component_SharedReportDonutChart, {
                    title: "Lợi nhuận theo loại dịch vụ",
                    slices: vueExports.unref(serviceDonutSlices),
                    "center-label": "Tổng LN",
                    "value-suffix": " đ"
                  }, null, 8, ["slices"]),
                  vueExports.createVNode("ul", { class: "mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(byService).filter((r) => r.category_key === ADJUSTMENT_KEY), (row) => {
                      return vueExports.openBlock(), vueExports.createBlock("li", {
                        key: row.category_key,
                        class: "flex items-start gap-2 text-slate-500"
                      }, [
                        vueExports.createVNode("span", { class: "mt-1 size-2 rounded-sm bg-slate-300" }),
                        vueExports.createVNode("div", { class: "flex-1" }, [
                          vueExports.createVNode("span", null, vueExports.toDisplayString(row.category_label), 1),
                          vueExports.createVNode("span", { class: "ml-1 tabular-nums" }, " — " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.profit)) + " (" + vueExports.toDisplayString(row.share_percent.toFixed(1)) + "%) ", 1)
                        ])
                      ]);
                    }), 128))
                  ]),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-3 leading-relaxed" }, ' Hai biểu đồ (dịch vụ + dự án) cùng tổng = LN gộp kỳ. Dòng "Điều chỉnh nội bộ" là phần HH chưa phân bổ được xuống line. ')
                ], 64))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Cơ cấu LN gộp theo dự án",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byProjectStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[220px] w-full" }, null, _parent2, _scopeId));
              } else if (vueExports.unref(projectDonutSlices).length === 0) {
                _push2(`<p class="py-12 text-center text-sm text-slate-500"${_scopeId}> Chưa có dữ liệu </p>`);
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportDonutChart, {
                  title: "Lợi nhuận theo dự án",
                  slices: vueExports.unref(projectDonutSlices),
                  "center-label": "Tổng LN",
                  "value-suffix": " đ"
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(byProjectStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[220px] w-full"
                })) : vueExports.unref(projectDonutSlices).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 1,
                  class: "py-12 text-center text-sm text-slate-500"
                }, " Chưa có dữ liệu ")) : (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportDonutChart, {
                  key: 2,
                  title: "Lợi nhuận theo dự án",
                  slices: vueExports.unref(projectDonutSlices),
                  "center-label": "Tổng LN",
                  "value-suffix": " đ"
                }, null, 8, ["slices"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Theo dự án — cơ cấu & cảnh báo margin",
          compact: "",
          class: "mb-6"
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-500 hidden sm:inline"${_scopeId}> % đóng góp DT trên tổng. Cảnh báo khi margin &lt; ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(marginAlertThreshold))}% </span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "text-xs text-slate-500 hidden sm:inline" }, " % đóng góp DT trên tổng. Cảnh báo khi margin < " + vueExports.toDisplayString(vueExports.unref(marginAlertThreshold)) + "% ", 1)
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byProjectStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-40 w-full" }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                  data: vueExports.unref(byProject),
                  columns: projectColumns,
                  "empty-state": { icon: "i-lucide-inbox", label: "Không có dự án trong kỳ" }
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(byProjectStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-40 w-full"
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                  key: 1,
                  data: vueExports.unref(byProject),
                  columns: projectColumns,
                  "empty-state": { icon: "i-lucide-inbox", label: "Không có dự án trong kỳ" }
                }, null, 8, ["data"]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/revenue-profit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=revenue-profit-DqgDpFIn.mjs.map
