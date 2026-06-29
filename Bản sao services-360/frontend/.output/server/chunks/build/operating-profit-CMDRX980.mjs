import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$2 } from './SelectMenu-DKHEMZj7.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, w as __nuxt_component_5, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4, o as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as _sfc_main$3 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$5 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_13 } from './DonutChart-DD8U5f6E.mjs';
import { _ as _sfc_main$6 } from './Table-17SH0cIR.mjs';
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

function useOperatingProfitSummary(params) {
  return useApiFetch("/pmc/reports/operating-profit/summary", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useOperatingProfitMonthly(params) {
  return useApiFetch("/pmc/reports/operating-profit/monthly", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useOperatingProfitByProject(params) {
  return useApiFetch("/pmc/reports/operating-profit/by-project", {
    query: params,
    watch: params ? [params] : void 0
  });
}
const MATERIAL_COLOR = "#f59e0b";
const COMMISSION_COLOR = "#2563eb";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "operating-profit",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Lợi nhuận công ty vận hành (Vật tư + Hoa hồng)" });
    const {
      dateRange,
      dateFromRef,
      dateToRef,
      defaultFrom,
      defaultTo,
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
    } = useOperatingProfitSummary(filterParams);
    const summary = vueExports.computed(() => summaryData.value?.data ?? null);
    const {
      data: monthlyData,
      status: monthlyStatus
    } = useOperatingProfitMonthly(filterParams);
    const monthly = vueExports.computed(() => monthlyData.value?.data ?? []);
    const {
      data: byProjectData,
      status: byProjectStatus
    } = useOperatingProfitByProject(filterParams);
    const byProject = vueExports.computed(() => byProjectData.value?.data ?? []);
    const isLoading = (status) => status === "pending";
    function toNum(value) {
      if (value == null) return 0;
      return typeof value === "string" ? parseFloat(value) || 0 : value;
    }
    function signed(value, fractionDigits = 1) {
      const sign = value > 0 ? "+" : "";
      return `${sign}${value.toFixed(fractionDigits)}%`;
    }
    const totalProfit = vueExports.computed(() => toNum(summary.value?.total_profit));
    const materialProfit = vueExports.computed(() => toNum(summary.value?.material_profit));
    const commissionProfit = vueExports.computed(() => toNum(summary.value?.commission_profit));
    const totalIsProfit = vueExports.computed(() => totalProfit.value > 0);
    const totalIsLoss = vueExports.computed(() => totalProfit.value < 0);
    const breakdownSlices = vueExports.computed(() => {
      const items = [];
      if (materialProfit.value > 0) {
        items.push({ label: "Vật tư", value: materialProfit.value, color: MATERIAL_COLOR });
      }
      if (commissionProfit.value > 0) {
        items.push({ label: "Hoa hồng VH", value: commissionProfit.value, color: COMMISSION_COLOR });
      }
      return items;
    });
    const chartInner = { left: 56, right: 600, top: 28, bottom: 220 };
    const absMaxMonthly = vueExports.computed(() => {
      const list = monthly.value;
      if (list.length === 0) return 1;
      let max = 0;
      for (const m of list) {
        const mat = toNum(m.material_profit);
        const com = toNum(m.commission_profit);
        const positive = Math.max(0, mat) + Math.max(0, com);
        const negative = Math.min(0, mat) + Math.min(0, com);
        max = Math.max(max, Math.abs(positive), Math.abs(negative));
      }
      return max > 0 ? max : 1;
    });
    const zeroLineY = vueExports.computed(() => (chartInner.top + chartInner.bottom) / 2);
    const monthlyBars = vueExports.computed(() => {
      const list = monthly.value;
      const n = list.length;
      if (n === 0) return [];
      const w = (chartInner.right - chartInner.left) / n;
      const barW = Math.min(48, w * 0.56);
      const halfHeight = (chartInner.bottom - chartInner.top) / 2;
      const scale = halfHeight * 0.92 / absMaxMonthly.value;
      return list.map((m, i) => {
        const cx = chartInner.left + w * i + w / 2;
        const x = cx - barW / 2;
        const mat = toNum(m.material_profit);
        const com = toNum(m.commission_profit);
        const total = mat + com;
        let matRect = null;
        let comRect = null;
        let matNegRect = null;
        let comNegRect = null;
        if (mat > 0 || com > 0) {
          let cursor = zeroLineY.value;
          if (mat > 0) {
            const h2 = mat * scale;
            cursor -= h2;
            matRect = { y: cursor, h: h2 };
          }
          if (com > 0) {
            const h2 = com * scale;
            cursor -= h2;
            comRect = { y: cursor, h: h2 };
          }
        }
        if (mat < 0 || com < 0) {
          let cursor = zeroLineY.value;
          if (mat < 0) {
            const h2 = Math.abs(mat) * scale;
            matNegRect = { y: cursor, h: h2 };
            cursor += h2;
          }
          if (com < 0) {
            const h2 = Math.abs(com) * scale;
            comNegRect = { y: cursor, h: h2 };
          }
        }
        const totalBn = total / 1e9;
        const totalMn = total / 1e6;
        const totalShort = total !== 0 ? Math.abs(totalBn) >= 1 ? `${totalBn.toFixed(2)}B` : `${totalMn.toFixed(1)}M` : "";
        let totalY = zeroLineY.value - 8;
        if (total > 0 && matRect) {
          totalY = (comRect?.y ?? matRect.y) - 6;
        } else if (total < 0 && matNegRect) {
          const bottomRect = comNegRect ?? matNegRect;
          totalY = bottomRect.y + bottomRect.h + 12;
        }
        return {
          cx,
          x,
          w: barW,
          label: m.month,
          total,
          matRect,
          comRect,
          matNegRect,
          comNegRect,
          totalShort,
          totalY
        };
      });
    });
    const chartYLabel = vueExports.computed(() => {
      const mxBn = absMaxMonthly.value / 1e9;
      if (mxBn >= 1) return `${mxBn.toFixed(1)}B`;
      return `${(absMaxMonthly.value / 1e6).toFixed(0)}M`;
    });
    const projectBars = vueExports.computed(() => {
      return byProject.value.map((row) => {
        const mat = Math.max(0, toNum(row.material_profit));
        const com = Math.max(0, toNum(row.commission_profit));
        const totalPositive = mat + com;
        return {
          project_id: row.project_id,
          project_name: row.project_name,
          material_profit: toNum(row.material_profit),
          commission_profit: toNum(row.commission_profit),
          total_profit: toNum(row.total_profit),
          share_percent: row.share_percent,
          matPct: totalPositive > 0 ? mat / totalPositive * 100 : 0,
          comPct: totalPositive > 0 ? com / totalPositive * 100 : 0
        };
      });
    });
    const projectColumns = [
      { accessorKey: "project_name", header: "Dự án" },
      {
        accessorKey: "material_profit",
        header: "LN Vật tư",
        cell: ({ row }) => vueExports.h("span", {
          class: row.original.material_profit >= 0 ? "tabular-nums text-amber-700 font-medium" : "tabular-nums text-red-600 font-medium"
        }, formatCurrency(row.original.material_profit))
      },
      {
        accessorKey: "commission_profit",
        header: "LN Hoa hồng VH",
        cell: ({ row }) => vueExports.h("span", {
          class: row.original.commission_profit >= 0 ? "tabular-nums text-blue-700 font-medium" : "tabular-nums text-red-600 font-medium"
        }, formatCurrency(row.original.commission_profit))
      },
      {
        accessorKey: "total_profit",
        header: "Tổng LN",
        cell: ({ row }) => vueExports.h("span", {
          class: row.original.total_profit >= 0 ? "tabular-nums font-bold text-emerald-600" : "tabular-nums font-bold text-red-600"
        }, formatCurrency(row.original.total_profit))
      },
      {
        accessorKey: "share_percent",
        header: "% đóng góp",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, `${row.original.share_percent.toFixed(1)}%`)
      }
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
      const _component_USkeleton = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UAlert = _sfc_main$5;
      const _component_SharedReportDonutChart = __nuxt_component_13;
      const _component_UTable = _sfc_main$6;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Lợi nhuận công ty vận hành",
        description: "Mổ xẻ lợi nhuận theo hai nguồn: Vật tư (markup) + Hoa hồng công ty vận hành nhận được"
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
                            format: "dd/MM/yyyy",
                            "auto-apply": "",
                            "max-date": /* @__PURE__ */ new Date(),
                            "input-class-name": "dp-custom-input",
                            teleport: true,
                            disabled: vueExports.unref(isClosingPeriodSelected),
                            class: "w-64"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "max-date", "disabled"])
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
                            format: "dd/MM/yyyy",
                            "auto-apply": "",
                            "max-date": /* @__PURE__ */ new Date(),
                            "input-class-name": "dp-custom-input",
                            teleport: true,
                            disabled: vueExports.unref(isClosingPeriodSelected),
                            class: "w-64"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "max-date", "disabled"])
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
        _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
          vueExports.unref(totalIsProfit) ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-50 to-white" : "",
          vueExports.unref(totalIsLoss) ? "border-red-200 bg-gradient-to-br from-red-50 via-red-50 to-white" : "",
          !vueExports.unref(totalIsProfit) && !vueExports.unref(totalIsLoss) ? "border-slate-200 bg-slate-50" : ""
        ], "relative mb-6 overflow-hidden rounded-xl border p-6 sm:p-8"])}"><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6"><div class="min-w-0"><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(totalIsProfit) ? "text-emerald-700" : vueExports.unref(totalIsLoss) ? "text-red-700" : "text-slate-500", "text-xs font-semibold tracking-wider uppercase mb-2"])}">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: vueExports.unref(totalIsProfit) ? "i-lucide-trending-up" : vueExports.unref(totalIsLoss) ? "i-lucide-trending-down" : "i-lucide-minus",
          class: "size-4 align-[-3px] mr-1"
        }, null, _parent));
        _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(totalIsProfit) ? "Đang lãi" : vueExports.unref(totalIsLoss) ? "Đang lỗ" : "Hòa vốn")} — ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary)?.period_label)}</p>`);
        if (isLoading(vueExports.unref(summaryStatus))) {
          _push(`<!--[-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-14 w-72 mb-3" }, null, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-96" }, null, _parent));
          _push(`<!--]-->`);
        } else if (vueExports.unref(summary)) {
          _push(`<!--[--><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(totalIsProfit) ? "text-emerald-700" : vueExports.unref(totalIsLoss) ? "text-red-700" : "text-slate-700", "text-4xl sm:text-5xl font-extrabold tabular-nums leading-tight"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalProfit)))}</p><div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: vueExports.unref(summary).mom_total_percent >= 0 ? "success" : "error",
            variant: "subtle",
            size: "md"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: vueExports.unref(summary).mom_total_percent >= 0 ? "i-lucide-arrow-up" : "i-lucide-arrow-down",
                  class: "size-3.5 mr-1"
                }, null, _parent2, _scopeId));
                _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(signed(vueExports.unref(summary).mom_total_percent))}`);
              } else {
                return [
                  vueExports.createVNode(_component_UIcon, {
                    name: vueExports.unref(summary).mom_total_percent >= 0 ? "i-lucide-arrow-up" : "i-lucide-arrow-down",
                    class: "size-3.5 mr-1"
                  }, null, 8, ["name"]),
                  vueExports.createTextVNode(" " + vueExports.toDisplayString(signed(vueExports.unref(summary).mom_total_percent)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<span class="text-slate-600"> so với ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).prev_month_label || "tháng trước")} (${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).last_month_label || "—")}) </span></div><p class="text-xs text-slate-500 mt-3"> TB 6 tháng gần nhất: <strong class="text-slate-700 tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).avg_profit_6_months))}</strong> · QoQ: <strong class="${serverRenderer_cjs_prodExports.ssrRenderClass(vueExports.unref(summary).qoq_total_percent >= 0 ? "text-emerald-600" : "text-red-600")}">${serverRenderer_cjs_prodExports.ssrInterpolate(signed(vueExports.unref(summary).qoq_total_percent))}</strong></p><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (vueExports.unref(summary) && vueExports.unref(totalIsProfit)) {
          _push(`<div class="w-full md:w-[340px] shrink-0"><p class="text-xs text-slate-500 mb-2"> Cơ cấu đóng góp </p><div class="h-8 w-full flex rounded-lg overflow-hidden border border-slate-200 bg-white"><div class="h-full flex items-center justify-center text-white text-[11px] font-medium transition-all" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${vueExports.unref(summary).material_share_percent}%`, backgroundColor: MATERIAL_COLOR })}">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).material_share_percent >= 12 ? `${vueExports.unref(summary).material_share_percent.toFixed(0)}%` : "")}</div><div class="h-full flex items-center justify-center text-white text-[11px] font-medium transition-all" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${vueExports.unref(summary).commission_share_percent}%`, backgroundColor: COMMISSION_COLOR })}">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).commission_share_percent >= 12 ? `${vueExports.unref(summary).commission_share_percent.toFixed(0)}%` : "")}</div></div><div class="flex justify-between mt-2 text-[11px] text-slate-600"><span class="flex items-center gap-1.5"><span class="inline-block size-2.5 rounded-sm" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundColor: MATERIAL_COLOR })}"></span> Vật tư </span><span class="flex items-center gap-1.5"> Hoa hồng VH <span class="inline-block size-2.5 rounded-sm" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundColor: COMMISSION_COLOR })}"></span></span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Lợi nhuận từ Vật tư",
          icon: "i-lucide-package",
          compact: ""
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                variant: "subtle",
                color: "warning"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Markup vật tư `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Markup vật tư ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UBadge, {
                  variant: "subtle",
                  color: "warning"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Markup vật tư ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-40 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-56" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(materialProfit) >= 0 ? "text-amber-700" : "text-red-600", "text-3xl font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(materialProfit)))}</p><div class="flex items-center gap-2 mt-2 text-xs"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  color: vueExports.unref(summary).mom_material_percent >= 0 ? "success" : "error",
                  variant: "subtle",
                  size: "sm"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(signed(vueExports.unref(summary).mom_material_percent))}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(signed(vueExports.unref(summary).mom_material_percent)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`<span class="text-slate-500"${_scopeId}>so với tháng trước</span></div><div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs"${_scopeId}><div${_scopeId}><p class="text-slate-500"${_scopeId}> Doanh thu VT </p><p class="font-semibold tabular-nums text-slate-800 mt-0.5"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).material_revenue))}</p></div><div${_scopeId}><p class="text-slate-500"${_scopeId}> CP mua vào </p><p class="font-semibold tabular-nums text-slate-800 mt-0.5"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).material_cost))}</p></div></div><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-40 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-56" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", {
                    class: ["text-3xl font-bold tabular-nums", vueExports.unref(materialProfit) >= 0 ? "text-amber-700" : "text-red-600"]
                  }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(materialProfit))), 3),
                  vueExports.createVNode("div", { class: "flex items-center gap-2 mt-2 text-xs" }, [
                    vueExports.createVNode(_component_UBadge, {
                      color: vueExports.unref(summary).mom_material_percent >= 0 ? "success" : "error",
                      variant: "subtle",
                      size: "sm"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(signed(vueExports.unref(summary).mom_material_percent)), 1)
                      ]),
                      _: 1
                    }, 8, ["color"]),
                    vueExports.createVNode("span", { class: "text-slate-500" }, "so với tháng trước")
                  ]),
                  vueExports.createVNode("div", { class: "mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs" }, [
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("p", { class: "text-slate-500" }, " Doanh thu VT "),
                      vueExports.createVNode("p", { class: "font-semibold tabular-nums text-slate-800 mt-0.5" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).material_revenue)), 1)
                    ]),
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("p", { class: "text-slate-500" }, " CP mua vào "),
                      vueExports.createVNode("p", { class: "font-semibold tabular-nums text-slate-800 mt-0.5" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).material_cost)), 1)
                    ])
                  ])
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Lợi nhuận từ Hoa hồng",
          icon: "i-lucide-coins",
          compact: ""
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                variant: "subtle",
                color: "info"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Hoa hồng VH nhận `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Hoa hồng VH nhận ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UBadge, {
                  variant: "subtle",
                  color: "info"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Hoa hồng VH nhận ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-40 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-56" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(commissionProfit) >= 0 ? "text-blue-700" : "text-red-600", "text-3xl font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(commissionProfit)))}</p><div class="flex items-center gap-2 mt-2 text-xs"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  color: vueExports.unref(summary).mom_commission_percent >= 0 ? "success" : "error",
                  variant: "subtle",
                  size: "sm"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(signed(vueExports.unref(summary).mom_commission_percent))}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(signed(vueExports.unref(summary).mom_commission_percent)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`<span class="text-slate-500"${_scopeId}>so với tháng trước</span></div><p class="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 leading-relaxed"${_scopeId}> Phần hoa hồng công ty vận hành giữ lại sau khi phân bổ (recipient_type <code class="text-[10px] bg-slate-100 px-1 rounded"${_scopeId}>operating_company</code>). Xem chi tiết phân bổ tại `);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: "/reports/commission",
                  class: "text-primary-600 hover:underline"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` báo cáo Phân bổ hoa hồng → `);
                    } else {
                      return [
                        vueExports.createTextVNode(" báo cáo Phân bổ hoa hồng → ")
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
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-56" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", {
                    class: ["text-3xl font-bold tabular-nums", vueExports.unref(commissionProfit) >= 0 ? "text-blue-700" : "text-red-600"]
                  }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(commissionProfit))), 3),
                  vueExports.createVNode("div", { class: "flex items-center gap-2 mt-2 text-xs" }, [
                    vueExports.createVNode(_component_UBadge, {
                      color: vueExports.unref(summary).mom_commission_percent >= 0 ? "success" : "error",
                      variant: "subtle",
                      size: "sm"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(signed(vueExports.unref(summary).mom_commission_percent)), 1)
                      ]),
                      _: 1
                    }, 8, ["color"]),
                    vueExports.createVNode("span", { class: "text-slate-500" }, "so với tháng trước")
                  ]),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 leading-relaxed" }, [
                    vueExports.createTextVNode(" Phần hoa hồng công ty vận hành giữ lại sau khi phân bổ (recipient_type "),
                    vueExports.createVNode("code", { class: "text-[10px] bg-slate-100 px-1 rounded" }, "operating_company"),
                    vueExports.createTextVNode("). Xem chi tiết phân bổ tại "),
                    vueExports.createVNode(_component_NuxtLink, {
                      to: "/reports/commission",
                      class: "text-primary-600 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" báo cáo Phân bổ hoa hồng → ")
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
        _push(`</div>`);
        if (vueExports.unref(summary) && vueExports.unref(summary).insights.length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: vueExports.unref(totalIsLoss) ? "warning" : "info",
            variant: "subtle",
            icon: vueExports.unref(totalIsLoss) ? "i-lucide-alert-triangle" : "i-lucide-lightbulb",
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
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Xu hướng 6 tháng — LN ghép khối (Vật tư + Hoa hồng)",
          compact: "",
          class: "mb-6"
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-4 text-xs"${_scopeId}><span class="flex items-center gap-1.5"${_scopeId}><span class="inline-block size-2.5 rounded-sm" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundColor: MATERIAL_COLOR })}"${_scopeId}></span> Vật tư </span><span class="flex items-center gap-1.5"${_scopeId}><span class="inline-block size-2.5 rounded-sm" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundColor: COMMISSION_COLOR })}"${_scopeId}></span> Hoa hồng VH </span></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap gap-4 text-xs" }, [
                  vueExports.createVNode("span", { class: "flex items-center gap-1.5" }, [
                    vueExports.createVNode("span", {
                      class: "inline-block size-2.5 rounded-sm",
                      style: { backgroundColor: MATERIAL_COLOR }
                    }, null, 4),
                    vueExports.createTextVNode(" Vật tư ")
                  ]),
                  vueExports.createVNode("span", { class: "flex items-center gap-1.5" }, [
                    vueExports.createVNode("span", {
                      class: "inline-block size-2.5 rounded-sm",
                      style: { backgroundColor: COMMISSION_COLOR }
                    }, null, 4),
                    vueExports.createTextVNode(" Hoa hồng VH ")
                  ])
                ])
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(monthlyStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[280px] w-full" }, null, _parent2, _scopeId));
              } else if (vueExports.unref(monthly).length === 0 || vueExports.unref(absMaxMonthly) === 1) {
                _push2(`<p class="py-12 text-center text-sm text-slate-500"${_scopeId}> Chưa có dữ liệu trong kỳ đã chọn </p>`);
              } else {
                _push2(`<!--[--><p class="text-xs text-slate-500 mb-3"${_scopeId}> Cột ghép: Vật tư xếp dưới, Hoa hồng VH xếp trên. Số trên đỉnh = tổng LN tháng. Cột hướng xuống = lỗ. </p><div class="w-full overflow-x-auto"${_scopeId}><svg class="min-w-[520px] w-full h-[300px] text-slate-500" viewBox="0 0 640 300" preserveAspectRatio="xMidYMid meet" aria-label="Biểu đồ lợi nhuận công ty vận hành 6 tháng"${_scopeId}><line x1="56"${serverRenderer_cjs_prodExports.ssrRenderAttr("y1", vueExports.unref(zeroLineY))} x2="600"${serverRenderer_cjs_prodExports.ssrRenderAttr("y2", vueExports.unref(zeroLineY))} stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5"${_scopeId}></line><line x1="56"${serverRenderer_cjs_prodExports.ssrRenderAttr("y1", chartInner.top)} x2="600"${serverRenderer_cjs_prodExports.ssrRenderAttr("y2", chartInner.top)} stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="3,3"${_scopeId}></line><line x1="56"${serverRenderer_cjs_prodExports.ssrRenderAttr("y1", chartInner.bottom)} x2="600"${serverRenderer_cjs_prodExports.ssrRenderAttr("y2", chartInner.bottom)} stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="3,3"${_scopeId}></line><text x="8"${serverRenderer_cjs_prodExports.ssrRenderAttr("y", chartInner.top + 12)} class="fill-current text-[10px]"${_scopeId}> +${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(chartYLabel))}</text><text x="8"${serverRenderer_cjs_prodExports.ssrRenderAttr("y", vueExports.unref(zeroLineY) + 4)} class="fill-current text-[10px]"${_scopeId}> 0 </text><text x="8"${serverRenderer_cjs_prodExports.ssrRenderAttr("y", chartInner.bottom - 2)} class="fill-current text-[10px]"${_scopeId}> -${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(chartYLabel))}</text><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(monthlyBars), (b, i) => {
                  _push2(`<g${_scopeId}>`);
                  if (b.matRect) {
                    _push2(`<rect${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", b.matRect.y)}${serverRenderer_cjs_prodExports.ssrRenderAttr("width", b.w)}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", b.matRect.h)}${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", MATERIAL_COLOR)} rx="2"${_scopeId}></rect>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (b.comRect) {
                    _push2(`<rect${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", b.comRect.y)}${serverRenderer_cjs_prodExports.ssrRenderAttr("width", b.w)}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", b.comRect.h)}${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", COMMISSION_COLOR)} rx="2"${_scopeId}></rect>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (b.matNegRect) {
                    _push2(`<rect${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", b.matNegRect.y)}${serverRenderer_cjs_prodExports.ssrRenderAttr("width", b.w)}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", b.matNegRect.h)}${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", MATERIAL_COLOR)} fill-opacity="0.6" rx="2"${_scopeId}></rect>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (b.comNegRect) {
                    _push2(`<rect${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", b.comNegRect.y)}${serverRenderer_cjs_prodExports.ssrRenderAttr("width", b.w)}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", b.comNegRect.h)}${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", COMMISSION_COLOR)} fill-opacity="0.6" rx="2"${_scopeId}></rect>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.cx)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", chartInner.bottom + 22)} text-anchor="middle" class="fill-current text-[11px]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(b.label)}</text>`);
                  if (b.totalShort) {
                    _push2(`<text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.cx)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", b.totalY)} text-anchor="middle" class="${serverRenderer_cjs_prodExports.ssrRenderClass([b.total >= 0 ? "text-emerald-700" : "text-red-600", "fill-current text-[10px] font-semibold"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(b.totalShort)}</text>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</g>`);
                });
                _push2(`<!--]--></svg></div><!--]-->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(monthlyStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[280px] w-full"
                })) : vueExports.unref(monthly).length === 0 || vueExports.unref(absMaxMonthly) === 1 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 1,
                  class: "py-12 text-center text-sm text-slate-500"
                }, " Chưa có dữ liệu trong kỳ đã chọn ")) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mb-3" }, " Cột ghép: Vật tư xếp dưới, Hoa hồng VH xếp trên. Số trên đỉnh = tổng LN tháng. Cột hướng xuống = lỗ. "),
                  vueExports.createVNode("div", { class: "w-full overflow-x-auto" }, [
                    (vueExports.openBlock(), vueExports.createBlock("svg", {
                      class: "min-w-[520px] w-full h-[300px] text-slate-500",
                      viewBox: "0 0 640 300",
                      preserveAspectRatio: "xMidYMid meet",
                      "aria-label": "Biểu đồ lợi nhuận công ty vận hành 6 tháng"
                    }, [
                      vueExports.createVNode("line", {
                        x1: "56",
                        y1: vueExports.unref(zeroLineY),
                        x2: "600",
                        y2: vueExports.unref(zeroLineY),
                        stroke: "currentColor",
                        "stroke-opacity": "0.35",
                        "stroke-width": "1.5"
                      }, null, 8, ["y1", "y2"]),
                      vueExports.createVNode("line", {
                        x1: "56",
                        y1: chartInner.top,
                        x2: "600",
                        y2: chartInner.top,
                        stroke: "currentColor",
                        "stroke-opacity": "0.08",
                        "stroke-dasharray": "3,3"
                      }, null, 8, ["y1", "y2"]),
                      vueExports.createVNode("line", {
                        x1: "56",
                        y1: chartInner.bottom,
                        x2: "600",
                        y2: chartInner.bottom,
                        stroke: "currentColor",
                        "stroke-opacity": "0.08",
                        "stroke-dasharray": "3,3"
                      }, null, 8, ["y1", "y2"]),
                      vueExports.createVNode("text", {
                        x: "8",
                        y: chartInner.top + 12,
                        class: "fill-current text-[10px]"
                      }, " +" + vueExports.toDisplayString(vueExports.unref(chartYLabel)), 9, ["y"]),
                      vueExports.createVNode("text", {
                        x: "8",
                        y: vueExports.unref(zeroLineY) + 4,
                        class: "fill-current text-[10px]"
                      }, " 0 ", 8, ["y"]),
                      vueExports.createVNode("text", {
                        x: "8",
                        y: chartInner.bottom - 2,
                        class: "fill-current text-[10px]"
                      }, " -" + vueExports.toDisplayString(vueExports.unref(chartYLabel)), 9, ["y"]),
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(monthlyBars), (b, i) => {
                        return vueExports.openBlock(), vueExports.createBlock("g", {
                          key: "bar-" + i
                        }, [
                          b.matRect ? (vueExports.openBlock(), vueExports.createBlock("rect", {
                            key: 0,
                            x: b.x,
                            y: b.matRect.y,
                            width: b.w,
                            height: b.matRect.h,
                            fill: MATERIAL_COLOR,
                            rx: "2"
                          }, null, 8, ["x", "y", "width", "height"])) : vueExports.createCommentVNode("", true),
                          b.comRect ? (vueExports.openBlock(), vueExports.createBlock("rect", {
                            key: 1,
                            x: b.x,
                            y: b.comRect.y,
                            width: b.w,
                            height: b.comRect.h,
                            fill: COMMISSION_COLOR,
                            rx: "2"
                          }, null, 8, ["x", "y", "width", "height"])) : vueExports.createCommentVNode("", true),
                          b.matNegRect ? (vueExports.openBlock(), vueExports.createBlock("rect", {
                            key: 2,
                            x: b.x,
                            y: b.matNegRect.y,
                            width: b.w,
                            height: b.matNegRect.h,
                            fill: MATERIAL_COLOR,
                            "fill-opacity": "0.6",
                            rx: "2"
                          }, null, 8, ["x", "y", "width", "height"])) : vueExports.createCommentVNode("", true),
                          b.comNegRect ? (vueExports.openBlock(), vueExports.createBlock("rect", {
                            key: 3,
                            x: b.x,
                            y: b.comNegRect.y,
                            width: b.w,
                            height: b.comNegRect.h,
                            fill: COMMISSION_COLOR,
                            "fill-opacity": "0.6",
                            rx: "2"
                          }, null, 8, ["x", "y", "width", "height"])) : vueExports.createCommentVNode("", true),
                          vueExports.createVNode("text", {
                            x: b.cx,
                            y: chartInner.bottom + 22,
                            "text-anchor": "middle",
                            class: "fill-current text-[11px]"
                          }, vueExports.toDisplayString(b.label), 9, ["x", "y"]),
                          b.totalShort ? (vueExports.openBlock(), vueExports.createBlock("text", {
                            key: 4,
                            x: b.cx,
                            y: b.totalY,
                            "text-anchor": "middle",
                            class: ["fill-current text-[10px] font-semibold", b.total >= 0 ? "text-emerald-700" : "text-red-600"]
                          }, vueExports.toDisplayString(b.totalShort), 11, ["x", "y"])) : vueExports.createCommentVNode("", true)
                        ]);
                      }), 128))
                    ]))
                  ])
                ], 64))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Cơ cấu LN theo nguồn",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[220px] w-full" }, null, _parent2, _scopeId));
              } else if (vueExports.unref(breakdownSlices).length === 0) {
                _push2(`<p class="py-12 text-center text-sm text-slate-500"${_scopeId}> Chưa có lợi nhuận dương trong kỳ </p>`);
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportDonutChart, {
                  title: "Lợi nhuận theo nguồn",
                  slices: vueExports.unref(breakdownSlices),
                  "center-label": "Tổng LN",
                  "value-suffix": " đ"
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[220px] w-full"
                })) : vueExports.unref(breakdownSlices).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 1,
                  class: "py-12 text-center text-sm text-slate-500"
                }, " Chưa có lợi nhuận dương trong kỳ ")) : (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportDonutChart, {
                  key: 2,
                  title: "Lợi nhuận theo nguồn",
                  slices: vueExports.unref(breakdownSlices),
                  "center-label": "Tổng LN",
                  "value-suffix": " đ"
                }, null, 8, ["slices"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Luồng tạo LN công ty vận hành",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus)) || !vueExports.unref(summary)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-40" }, null, _parent2, _scopeId));
              } else {
                _push2(`<div class="space-y-3"${_scopeId}><div class="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center"${_scopeId}><div class="rounded-lg border border-amber-200 bg-amber-50 p-2.5"${_scopeId}><p class="text-[10px] text-slate-500 mb-0.5"${_scopeId}> DT Vật tư </p><p class="text-xs font-bold tabular-nums text-slate-800"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).material_revenue))}</p></div>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-minus",
                  class: "size-4 text-slate-400"
                }, null, _parent2, _scopeId));
                _push2(`<div class="rounded-lg border border-red-200 bg-red-50 p-2.5"${_scopeId}><p class="text-[10px] text-slate-500 mb-0.5"${_scopeId}> CP mua </p><p class="text-xs font-bold tabular-nums text-slate-800"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).material_cost))}</p></div>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-equal",
                  class: "size-4 text-slate-400"
                }, null, _parent2, _scopeId));
                _push2(`<div class="rounded-lg border border-amber-300 bg-amber-100 p-2.5"${_scopeId}><p class="text-[10px] text-slate-500 mb-0.5"${_scopeId}> LN Vật tư </p><p class="text-xs font-bold tabular-nums text-amber-800"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).material_profit))}</p></div></div><div class="flex justify-center"${_scopeId}><span class="inline-flex items-center justify-center size-8 rounded-full bg-slate-100 text-slate-600 font-bold text-lg"${_scopeId}>+</span></div><div class="rounded-lg border border-blue-200 bg-blue-50 p-3 flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-[10px] text-slate-500 mb-0.5"${_scopeId}> Hoa hồng VH nhận (snapshot) </p><p class="text-xs text-slate-600"${_scopeId}> = ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission_profit))}</p></div><p class="text-sm font-bold tabular-nums text-blue-800"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission_profit))}</p></div><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(totalIsProfit) ? "border-emerald-300 bg-emerald-50" : vueExports.unref(totalIsLoss) ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50", "rounded-lg border p-3 flex items-center justify-between"])}"${_scopeId}><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(totalIsProfit) ? "text-emerald-700" : vueExports.unref(totalIsLoss) ? "text-red-700" : "text-slate-600", "text-sm font-semibold"])}"${_scopeId}> = Tổng LN công ty vận hành </p><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(totalIsProfit) ? "text-emerald-700" : vueExports.unref(totalIsLoss) ? "text-red-700" : "text-slate-700", "text-lg font-extrabold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).total_profit))}</p></div></div>`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) || !vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-40"
                })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "space-y-3"
                }, [
                  vueExports.createVNode("div", { class: "grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center" }, [
                    vueExports.createVNode("div", { class: "rounded-lg border border-amber-200 bg-amber-50 p-2.5" }, [
                      vueExports.createVNode("p", { class: "text-[10px] text-slate-500 mb-0.5" }, " DT Vật tư "),
                      vueExports.createVNode("p", { class: "text-xs font-bold tabular-nums text-slate-800" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).material_revenue)), 1)
                    ]),
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-minus",
                      class: "size-4 text-slate-400"
                    }),
                    vueExports.createVNode("div", { class: "rounded-lg border border-red-200 bg-red-50 p-2.5" }, [
                      vueExports.createVNode("p", { class: "text-[10px] text-slate-500 mb-0.5" }, " CP mua "),
                      vueExports.createVNode("p", { class: "text-xs font-bold tabular-nums text-slate-800" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).material_cost)), 1)
                    ]),
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-equal",
                      class: "size-4 text-slate-400"
                    }),
                    vueExports.createVNode("div", { class: "rounded-lg border border-amber-300 bg-amber-100 p-2.5" }, [
                      vueExports.createVNode("p", { class: "text-[10px] text-slate-500 mb-0.5" }, " LN Vật tư "),
                      vueExports.createVNode("p", { class: "text-xs font-bold tabular-nums text-amber-800" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).material_profit)), 1)
                    ])
                  ]),
                  vueExports.createVNode("div", { class: "flex justify-center" }, [
                    vueExports.createVNode("span", { class: "inline-flex items-center justify-center size-8 rounded-full bg-slate-100 text-slate-600 font-bold text-lg" }, "+")
                  ]),
                  vueExports.createVNode("div", { class: "rounded-lg border border-blue-200 bg-blue-50 p-3 flex items-center justify-between" }, [
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("p", { class: "text-[10px] text-slate-500 mb-0.5" }, " Hoa hồng VH nhận (snapshot) "),
                      vueExports.createVNode("p", { class: "text-xs text-slate-600" }, " = " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission_profit)), 1)
                    ]),
                    vueExports.createVNode("p", { class: "text-sm font-bold tabular-nums text-blue-800" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission_profit)), 1)
                  ]),
                  vueExports.createVNode("div", {
                    class: ["rounded-lg border p-3 flex items-center justify-between", vueExports.unref(totalIsProfit) ? "border-emerald-300 bg-emerald-50" : vueExports.unref(totalIsLoss) ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"]
                  }, [
                    vueExports.createVNode("p", {
                      class: ["text-sm font-semibold", vueExports.unref(totalIsProfit) ? "text-emerald-700" : vueExports.unref(totalIsLoss) ? "text-red-700" : "text-slate-600"]
                    }, " = Tổng LN công ty vận hành ", 2),
                    vueExports.createVNode("p", {
                      class: ["text-lg font-extrabold tabular-nums", vueExports.unref(totalIsProfit) ? "text-emerald-700" : vueExports.unref(totalIsLoss) ? "text-red-700" : "text-slate-700"]
                    }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).total_profit)), 3)
                  ], 2)
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Theo dự án — đóng góp LN",
          compact: "",
          class: "mb-6"
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-500 hidden sm:inline"${_scopeId}> Sắp xếp theo tổng LN giảm dần </span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "text-xs text-slate-500 hidden sm:inline" }, " Sắp xếp theo tổng LN giảm dần ")
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byProjectStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-40 w-full" }, null, _parent2, _scopeId));
              } else if (vueExports.unref(projectBars).length === 0) {
                _push2(`<p class="py-12 text-center text-sm text-slate-500"${_scopeId}> Không có dự án trong kỳ </p>`);
              } else {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                  data: vueExports.unref(projectBars),
                  columns: projectColumns,
                  "empty-state": { icon: "i-lucide-inbox", label: "Không có dự án trong kỳ" }
                }, null, _parent2, _scopeId));
                _push2(`<div class="mt-6 space-y-3"${_scopeId}><p class="text-xs text-slate-500 mb-1"${_scopeId}> Cơ cấu Vật tư vs Hoa hồng VH của từng dự án (chỉ phần lãi dương): </p><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(projectBars).slice(0, 5), (row) => {
                  _push2(`<div class="text-xs"${_scopeId}><div class="flex items-center justify-between mb-1"${_scopeId}><span class="font-medium text-slate-700 truncate max-w-[60%]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.project_name)}</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([row.total_profit >= 0 ? "text-emerald-600" : "text-red-600", "tabular-nums font-semibold"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.total_profit))}</span></div><div class="h-2 w-full flex rounded-full overflow-hidden bg-slate-100"${_scopeId}>`);
                  if (row.matPct > 0) {
                    _push2(`<div class="h-full transition-all" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${row.matPct}%`, backgroundColor: MATERIAL_COLOR })}"${_scopeId}></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (row.comPct > 0) {
                    _push2(`<div class="h-full transition-all" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${row.comPct}%`, backgroundColor: COMMISSION_COLOR })}"${_scopeId}></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                });
                _push2(`<!--]--></div><!--]-->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(byProjectStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-40 w-full"
                })) : vueExports.unref(projectBars).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 1,
                  class: "py-12 text-center text-sm text-slate-500"
                }, " Không có dự án trong kỳ ")) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                  vueExports.createVNode(_component_UTable, {
                    data: vueExports.unref(projectBars),
                    columns: projectColumns,
                    "empty-state": { icon: "i-lucide-inbox", label: "Không có dự án trong kỳ" }
                  }, null, 8, ["data"]),
                  vueExports.createVNode("div", { class: "mt-6 space-y-3" }, [
                    vueExports.createVNode("p", { class: "text-xs text-slate-500 mb-1" }, " Cơ cấu Vật tư vs Hoa hồng VH của từng dự án (chỉ phần lãi dương): "),
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(projectBars).slice(0, 5), (row) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: row.project_id,
                        class: "text-xs"
                      }, [
                        vueExports.createVNode("div", { class: "flex items-center justify-between mb-1" }, [
                          vueExports.createVNode("span", { class: "font-medium text-slate-700 truncate max-w-[60%]" }, vueExports.toDisplayString(row.project_name), 1),
                          vueExports.createVNode("span", {
                            class: ["tabular-nums font-semibold", row.total_profit >= 0 ? "text-emerald-600" : "text-red-600"]
                          }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.total_profit)), 3)
                        ]),
                        vueExports.createVNode("div", { class: "h-2 w-full flex rounded-full overflow-hidden bg-slate-100" }, [
                          row.matPct > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 0,
                            class: "h-full transition-all",
                            style: { width: `${row.matPct}%`, backgroundColor: MATERIAL_COLOR }
                          }, null, 4)) : vueExports.createCommentVNode("", true),
                          row.comPct > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 1,
                            class: "h-full transition-all",
                            style: { width: `${row.comPct}%`, backgroundColor: COMMISSION_COLOR }
                          }, null, 4)) : vueExports.createCommentVNode("", true)
                        ])
                      ]);
                    }), 128))
                  ])
                ], 64))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/operating-profit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=operating-profit-CMDRX980.mjs.map
