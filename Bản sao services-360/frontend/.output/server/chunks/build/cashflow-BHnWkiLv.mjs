import { _ as _sfc_main$6 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, w as __nuxt_component_5, _ as __nuxt_component_0$4, o as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$3 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as __nuxt_component_2$1 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$5 } from './Pagination-fZq_Msxb.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { Z as Zl } from './vue-datepicker-6F5-CyxW.mjs';
import { u as useReportDateRange } from './useReportDateRange-TMS_xfWx.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { a as formatDate } from './date-R5YK0ast.mjs';
import './apiError-DBrxF9au.mjs';
import './Label-BBgw4vHh.mjs';
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
import './SelectMenu-DKHEMZj7.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
import './Input-JXN8po_F.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useProjects-D4K3VYdb.mjs';

function useCashFlowSummary(params) {
  return useApiFetch("/pmc/reports/cashflow/summary", {
    query: params,
    watch: [params]
  });
}
function useCashFlowDaily(params) {
  return useApiFetch("/pmc/reports/cashflow/daily", {
    query: params,
    watch: [params]
  });
}
function useCashFlowTransactions(params) {
  return useApiFetch("/pmc/reports/cashflow/transactions", {
    query: params,
    watch: [params]
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "cashflow",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Báo cáo Dòng tiền" });
    const {
      dateRange,
      dateFromRef,
      dateToRef,
      formatDateRange,
      syncRangeFromRefs
    } = useReportDateRange();
    const selectedProjectId = vueExports.ref(void 0);
    useUrlFilters({
      date_from: { ref: dateFromRef, type: "string" },
      date_to: { ref: dateToRef, type: "string" },
      project_id: { ref: selectedProjectId, type: "number" }
    });
    syncRangeFromRefs();
    const isProjectFiltered = vueExports.computed(() => selectedProjectId.value != null);
    const filterParams = vueExports.computed(() => ({
      date_from: dateFromRef.value || void 0,
      date_to: dateToRef.value || void 0,
      project_id: selectedProjectId.value || void 0
    }));
    const { data: summaryData, status: summaryStatus, error: summaryError } = useCashFlowSummary(filterParams);
    const summary = vueExports.computed(() => summaryData.value?.data ?? null);
    const {
      data: dailyData,
      status: dailyStatus,
      error: dailyError,
      refresh: refreshDaily
    } = useCashFlowDaily(filterParams);
    const dailyRows = vueExports.computed(() => dailyData.value?.data ?? []);
    const txPage = vueExports.ref(1);
    vueExports.watch(filterParams, () => {
      txPage.value = 1;
    });
    const txParams = vueExports.computed(() => ({
      ...filterParams.value,
      per_page: DEFAULT_PER_PAGE,
      page: txPage.value
    }));
    const {
      data: txData,
      status: txStatus,
      error: txError,
      refresh: refreshTransactions
    } = useCashFlowTransactions(txParams);
    const txRows = vueExports.computed(() => txData.value?.data ?? []);
    const txMeta = vueExports.computed(() => txData.value?.meta ?? null);
    const categoryRows = vueExports.computed(() => {
      if (!summary.value) return [];
      const inflow = summary.value.inflow_by_category.map((row, i) => ({
        key: `in-${i}`,
        category: row.category.label,
        direction: "inflow",
        amount: row.amount,
        count: row.count
      }));
      const outflow = summary.value.outflow_by_category.map((row, i) => ({
        key: `out-${i}`,
        category: row.category.label,
        direction: "outflow",
        amount: row.amount,
        count: row.count
      }));
      return [...inflow, ...outflow];
    });
    function isNegative(val) {
      return parseFloat(val) < 0;
    }
    function formatKpi(val) {
      return formatCurrency(val);
    }
    function netClass(val) {
      return isNegative(val) ? "text-red-600 font-semibold tabular-nums" : "text-emerald-600 font-semibold tabular-nums";
    }
    const categoryColumns = [
      { accessorKey: "category", header: "Danh mục" },
      {
        accessorKey: "direction",
        header: "Chiều",
        cell: ({ row }) => vueExports.h(
          _sfc_main$6,
          {
            color: row.original.direction === "inflow" ? "success" : "error",
            variant: "subtle",
            size: "sm"
          },
          () => row.original.direction === "inflow" ? "Tiền vào" : "Tiền ra"
        )
      },
      {
        accessorKey: "amount",
        header: "Số tiền",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, formatCurrency(row.original.amount))
      },
      { accessorKey: "count", header: "Số GD" }
    ];
    const dailyColumns = [
      {
        accessorKey: "date",
        header: "Ngày",
        cell: ({ row }) => formatDate(row.original.date)
      },
      {
        accessorKey: "total_inflow",
        header: "Tiền vào",
        cell: ({ row }) => vueExports.h("span", { class: "text-emerald-600 tabular-nums" }, formatCurrency(row.original.total_inflow))
      },
      {
        accessorKey: "total_outflow",
        header: "Tiền ra",
        cell: ({ row }) => vueExports.h("span", { class: "text-red-600 tabular-nums" }, formatCurrency(row.original.total_outflow))
      },
      {
        accessorKey: "net",
        header: "Ròng",
        cell: ({ row }) => vueExports.h("span", { class: netClass(row.original.net) }, formatCurrency(row.original.net))
      }
    ];
    const txColumns = [
      {
        accessorKey: "transaction_date",
        header: "Ngày",
        cell: ({ row }) => formatDate(row.original.transaction_date)
      },
      {
        accessorKey: "code",
        header: "Mã GD",
        cell: ({ row }) => vueExports.h("span", { class: "font-mono text-sm" }, row.original.code)
      },
      {
        accessorKey: "project_name",
        header: "Dự án",
        cell: ({ row }) => row.original.project_name ?? "—"
      },
      {
        accessorKey: "direction",
        header: "Chiều",
        cell: ({ row }) => vueExports.h(
          _sfc_main$6,
          {
            color: row.original.direction.value === "inflow" ? "success" : "error",
            variant: "subtle",
            size: "sm"
          },
          () => row.original.direction.label
        )
      },
      {
        accessorKey: "category",
        header: "Danh mục",
        cell: ({ row }) => row.original.category.label
      },
      {
        accessorKey: "amount",
        header: "Số tiền",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, formatCurrency(row.original.amount))
      },
      {
        accessorKey: "note",
        header: "Ghi chú",
        cell: ({ row }) => row.original.note ?? "—"
      }
    ];
    const isLoading = (status) => status === "pending";
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$1;
      const _component_ClientOnly = __nuxt_component_5;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UAlert = _sfc_main$2;
      const _component_USkeleton = _sfc_main$3;
      const _component_UTable = _sfc_main$4;
      const _component_SharedCrudTableWrapper = __nuxt_component_2$1;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UPagination = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Báo cáo Dòng tiền",
        description: "Tổng hợp tiền vào/ra và số dư tài khoản quỹ"
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
                            class: "w-64"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "format", "max-date"])
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
                      class: "w-48"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án",
                        class: "w-48"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              if (vueExports.unref(isProjectFiltered)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "warning",
                  variant: "subtle",
                  class: "mt-3",
                  description: "Khi lọc theo dự án, giao dịch nạp/rút thủ công không thuộc dự án sẽ không hiển thị."
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap gap-4 items-end" }, [
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
                            class: "w-64"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "format", "max-date"])
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
                        class: "w-48"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                vueExports.unref(isProjectFiltered) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "warning",
                  variant: "subtle",
                  class: "mt-3",
                  description: "Khi lọc theo dự án, giao dịch nạp/rút thủ công không thuộc dự án sẽ không hiển thị."
                })) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Số dư hiện tại",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-24" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatKpi(vueExports.unref(summary).current_balance))}</p><span class="text-xs text-slate-500"${_scopeId}>Số dư thực tế</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-24" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(formatKpi(vueExports.unref(summary).current_balance)), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, "Số dư thực tế")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tổng tiền vào",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-28" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold text-emerald-600 tabular-nums"${_scopeId}> +${serverRenderer_cjs_prodExports.ssrInterpolate(formatKpi(vueExports.unref(summary).total_inflow))}</p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-28" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold text-emerald-600 tabular-nums" }, " +" + vueExports.toDisplayString(formatKpi(vueExports.unref(summary).total_inflow)), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tổng tiền ra",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-28" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold text-red-600 tabular-nums"${_scopeId}> -${serverRenderer_cjs_prodExports.ssrInterpolate(formatKpi(vueExports.unref(summary).total_outflow))}</p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-28" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold text-red-600 tabular-nums" }, " -" + vueExports.toDisplayString(formatKpi(vueExports.unref(summary).total_outflow)), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Dòng tiền ròng",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-28" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([isNegative(vueExports.unref(summary).net_flow) ? "text-red-600" : "text-emerald-600", "text-2xl font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(isNegative(vueExports.unref(summary).net_flow) ? "" : "+")}${serverRenderer_cjs_prodExports.ssrInterpolate(formatKpi(vueExports.unref(summary).net_flow))}</p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-28" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", {
                    class: ["text-2xl font-bold tabular-nums", isNegative(vueExports.unref(summary).net_flow) ? "text-red-600" : "text-emerald-600"]
                  }, vueExports.toDisplayString(isNegative(vueExports.unref(summary).net_flow) ? "" : "+") + vueExports.toDisplayString(formatKpi(vueExports.unref(summary).net_flow)), 3),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tiền vào/ra theo danh mục",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-48 w-full" }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                  data: vueExports.unref(categoryRows),
                  columns: categoryColumns,
                  loading: false
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-48 w-full"
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                  key: 1,
                  data: vueExports.unref(categoryRows),
                  columns: categoryColumns,
                  loading: false
                }, null, 8, ["data"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Dòng tiền theo ngày",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                status: vueExports.unref(dailyStatus),
                error: vueExports.unref(dailyError),
                data: vueExports.unref(dailyData),
                refresh: vueExports.unref(refreshDaily)
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                      data: vueExports.unref(dailyRows),
                      columns: dailyColumns
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UTable, {
                        data: vueExports.unref(dailyRows),
                        columns: dailyColumns
                      }, null, 8, ["data"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedCrudTableWrapper, {
                  status: vueExports.unref(dailyStatus),
                  error: vueExports.unref(dailyError),
                  data: vueExports.unref(dailyData),
                  refresh: vueExports.unref(refreshDaily)
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTable, {
                      data: vueExports.unref(dailyRows),
                      columns: dailyColumns
                    }, null, 8, ["data"])
                  ]),
                  _: 1
                }, 8, ["status", "error", "data", "refresh"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Chi tiết giao dịch",
          compact: "",
          class: "mb-6"
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                to: "/pmc/finance/treasury",
                class: "text-sm font-medium text-primary-600 hover:text-primary-700"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Quản lý quỹ → `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Quản lý quỹ → ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_NuxtLink, {
                  to: "/pmc/finance/treasury",
                  class: "text-sm font-medium text-primary-600 hover:text-primary-700"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Quản lý quỹ → ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                status: vueExports.unref(txStatus),
                error: vueExports.unref(txError),
                data: vueExports.unref(txData),
                refresh: vueExports.unref(refreshTransactions)
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                      data: vueExports.unref(txRows),
                      columns: txColumns
                    }, null, _parent3, _scopeId2));
                    if (vueExports.unref(txMeta) && vueExports.unref(txMeta).last_page > 1) {
                      _push3(`<div class="flex items-center justify-between pt-4 border-t border-slate-100 mt-4"${_scopeId2}><p class="text-sm text-slate-500"${_scopeId2}> Hiển thị ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(txRows).length)} / ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(txMeta).total)} giao dịch </p>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UPagination, {
                        page: vueExports.unref(txPage),
                        "onUpdate:page": ($event) => vueExports.isRef(txPage) ? txPage.value = $event : null,
                        total: vueExports.unref(txMeta).total,
                        "items-per-page": vueExports.unref(txMeta).per_page ?? ("DEFAULT_PER_PAGE" in _ctx ? _ctx.DEFAULT_PER_PAGE : vueExports.unref(DEFAULT_PER_PAGE)),
                        max: 5,
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      vueExports.createVNode(_component_UTable, {
                        data: vueExports.unref(txRows),
                        columns: txColumns
                      }, null, 8, ["data"]),
                      vueExports.unref(txMeta) && vueExports.unref(txMeta).last_page > 1 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex items-center justify-between pt-4 border-t border-slate-100 mt-4"
                      }, [
                        vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Hiển thị " + vueExports.toDisplayString(vueExports.unref(txRows).length) + " / " + vueExports.toDisplayString(vueExports.unref(txMeta).total) + " giao dịch ", 1),
                        vueExports.createVNode(_component_UPagination, {
                          page: vueExports.unref(txPage),
                          "onUpdate:page": ($event) => vueExports.isRef(txPage) ? txPage.value = $event : null,
                          total: vueExports.unref(txMeta).total,
                          "items-per-page": vueExports.unref(txMeta).per_page ?? ("DEFAULT_PER_PAGE" in _ctx ? _ctx.DEFAULT_PER_PAGE : vueExports.unref(DEFAULT_PER_PAGE)),
                          max: 5,
                          size: "sm"
                        }, null, 8, ["page", "onUpdate:page", "total", "items-per-page"])
                      ])) : vueExports.createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedCrudTableWrapper, {
                  status: vueExports.unref(txStatus),
                  error: vueExports.unref(txError),
                  data: vueExports.unref(txData),
                  refresh: vueExports.unref(refreshTransactions)
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTable, {
                      data: vueExports.unref(txRows),
                      columns: txColumns
                    }, null, 8, ["data"]),
                    vueExports.unref(txMeta) && vueExports.unref(txMeta).last_page > 1 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex items-center justify-between pt-4 border-t border-slate-100 mt-4"
                    }, [
                      vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Hiển thị " + vueExports.toDisplayString(vueExports.unref(txRows).length) + " / " + vueExports.toDisplayString(vueExports.unref(txMeta).total) + " giao dịch ", 1),
                      vueExports.createVNode(_component_UPagination, {
                        page: vueExports.unref(txPage),
                        "onUpdate:page": ($event) => vueExports.isRef(txPage) ? txPage.value = $event : null,
                        total: vueExports.unref(txMeta).total,
                        "items-per-page": vueExports.unref(txMeta).per_page ?? ("DEFAULT_PER_PAGE" in _ctx ? _ctx.DEFAULT_PER_PAGE : vueExports.unref(DEFAULT_PER_PAGE)),
                        max: 5,
                        size: "sm"
                      }, null, 8, ["page", "onUpdate:page", "total", "items-per-page"])
                    ])) : vueExports.createCommentVNode("", true)
                  ]),
                  _: 1
                }, 8, ["status", "error", "data", "refresh"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/cashflow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cashflow-BHnWkiLv.mjs.map
