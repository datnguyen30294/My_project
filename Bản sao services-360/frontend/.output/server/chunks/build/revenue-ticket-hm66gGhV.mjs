import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, w as __nuxt_component_5, l as _sfc_main$c, o as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as _sfc_main$2 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_2$1 } from './TableWrapper-VwUckvcF.mjs';
import { _ as __nuxt_component_13 } from './DonutChart-DD8U5f6E.mjs';
import { _ as _sfc_main$3 } from './Empty-wM3WsVlF.mjs';
import { _ as _sfc_main$4 } from './Tabs-Djlffbcc.mjs';
import { _ as _sfc_main$5 } from './Table-17SH0cIR.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { Z as Zl } from './vue-datepicker-6F5-CyxW.mjs';
import { u as useReportDateRange } from './useReportDateRange-TMS_xfWx.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
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
import './constants-G9YmtWtp.mjs';
import './useProjects-D4K3VYdb.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './Badge-W93D3Jpz.mjs';

function useRevenueTicketSummary(params) {
  return useApiFetch("/pmc/reports/revenue-ticket/summary", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useRevenueTicketByCategory(params) {
  return useApiFetch("/pmc/reports/revenue-ticket/by-category", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useRevenueTicketByStaff(params) {
  return useApiFetch("/pmc/reports/revenue-ticket/by-staff", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useRevenueTicketDaily(params) {
  return useApiFetch("/pmc/reports/revenue-ticket/daily", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useRevenueTicketDetails(params) {
  return useApiFetch("/pmc/reports/revenue-ticket/details", {
    query: params,
    watch: params ? [params] : void 0
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "revenue-ticket",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Báo cáo Doanh thu (ticket)" });
    const {
      dateRange,
      dateFromRef,
      dateToRef,
      formatDateRange,
      syncRangeFromRefs,
      clearRange
    } = useReportDateRange({ withDefault: false });
    const selectedProjectId = vueExports.ref(void 0);
    useUrlFilters({
      date_from: { ref: dateFromRef, type: "string" },
      date_to: { ref: dateToRef, type: "string" },
      project_id: { ref: selectedProjectId, type: "number" }
    });
    syncRangeFromRefs();
    const hasFilters = vueExports.computed(
      () => selectedProjectId.value != null || !!dateFromRef.value || !!dateToRef.value
    );
    function clearFilters() {
      selectedProjectId.value = void 0;
      clearRange();
    }
    const filterParams = vueExports.computed(() => ({
      date_from: dateFromRef.value || void 0,
      date_to: dateToRef.value || void 0,
      project_id: selectedProjectId.value || void 0
    }));
    const { data: summaryData, status: summaryStatus, error: summaryError } = useRevenueTicketSummary(filterParams);
    const summary = vueExports.computed(() => summaryData.value?.data ?? null);
    const {
      data: byCategoryData,
      status: byCategoryStatus,
      error: byCategoryError,
      refresh: refreshByCategory
    } = useRevenueTicketByCategory(filterParams);
    const byCategoryRows = vueExports.computed(() => byCategoryData.value?.data ?? []);
    const {
      data: byStaffData,
      status: byStaffStatus,
      error: byStaffError,
      refresh: refreshByStaff
    } = useRevenueTicketByStaff(filterParams);
    const byStaffRows = vueExports.computed(() => byStaffData.value?.data ?? []);
    const {
      data: dailyData,
      status: dailyStatus,
      error: dailyError,
      refresh: refreshDaily
    } = useRevenueTicketDaily(filterParams);
    const dailyRows = vueExports.computed(() => dailyData.value?.data ?? []);
    const {
      data: detailsData,
      status: detailsStatus,
      error: detailsError,
      refresh: refreshDetails
    } = useRevenueTicketDetails(filterParams);
    const detailRows = vueExports.computed(() => detailsData.value?.data ?? []);
    const isLoading = (status) => status === "pending";
    const categorySlices = vueExports.computed(
      () => byCategoryRows.value.map((row) => ({
        label: row.category_label,
        value: row.ticket_count
      }))
    );
    const staffSlices = vueExports.computed(
      () => byStaffRows.value.map((row) => ({
        label: row.staff_name,
        value: row.ticket_count
      }))
    );
    const LINE_COLORS = [
      "#16a34a",
      "#2563eb",
      "#d97706",
      "#7c3aed",
      "#0d9488",
      "#dc2626",
      "#64748b"
    ];
    function dateShort(d) {
      const [, m, day] = d.split("-");
      return m && day ? `${day}/${m}` : d;
    }
    const ticketLineChart = vueExports.computed(() => {
      const rows = dailyRows.value;
      const dates = [...new Set(rows.map((r) => r.date))].sort();
      if (dates.length === 0) {
        return {
          dates: [],
          series: [],
          maxY: 0,
          xAt: (_i) => 330
        };
      }
      const projectKeyOf = (row) => row.project_id !== null ? String(row.project_id) : "null";
      const keyToName = /* @__PURE__ */ new Map();
      for (const row of rows) {
        keyToName.set(projectKeyOf(row), row.project_name);
      }
      const projectKeys = [...keyToName.keys()].sort();
      const byDateProj = /* @__PURE__ */ new Map();
      for (const row of rows) {
        const m = byDateProj.get(row.date) ?? /* @__PURE__ */ new Map();
        m.set(projectKeyOf(row), { count: row.ticket_count, revenue: row.revenue });
        byDateProj.set(row.date, m);
      }
      let maxY = 1;
      for (const d of dates) {
        const m = byDateProj.get(d);
        for (const key of projectKeys) {
          const v = m.get(key)?.count ?? 0;
          if (v > maxY) maxY = v;
        }
      }
      const inner = { left: 52, right: 608, top: 28, bottom: 200 };
      const w = inner.right - inner.left;
      const h2 = inner.bottom - inner.top;
      const n = dates.length;
      const xAt = (i) => inner.left + (n <= 1 ? w / 2 : i / (n - 1) * w);
      const yAt = (v) => inner.bottom - v / maxY * h2 * 0.92;
      const series = projectKeys.map((key, idx) => {
        const points = dates.map((d, i) => {
          const cell = byDateProj.get(d)?.get(key);
          const count = cell?.count ?? 0;
          const revenue = cell ? formatCurrency(cell.revenue) : "0 đ";
          return {
            x: xAt(i),
            y: yAt(count),
            value: count,
            tooltip: `${keyToName.get(key) ?? key} · ${dateShort(d)}: ${count} ticket · ${revenue}`
          };
        });
        return {
          projectKey: key,
          label: keyToName.get(key) ?? "Chưa gán dự án",
          color: LINE_COLORS[idx % LINE_COLORS.length],
          polyline: points.map((p) => `${p.x},${p.y}`).join(" "),
          points
        };
      });
      return { dates, series, maxY, xAt };
    });
    const activeTab = vueExports.ref("category");
    const tabs = [
      { label: "Theo category", value: "category", icon: "i-lucide-layers" },
      { label: "Theo nhân viên", value: "staff", icon: "i-lucide-users" }
    ];
    const categoryColumns = [
      { accessorKey: "category_label", header: "Category ticket" },
      {
        accessorKey: "revenue",
        header: "Doanh thu",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, formatCurrency(row.original.revenue))
      },
      {
        accessorKey: "ticket_count",
        header: "Số ticket",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, row.original.ticket_count.toLocaleString("vi-VN"))
      },
      {
        accessorKey: "ticket_share_percent",
        header: "Tỷ trọng",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums text-slate-500" }, `${row.original.ticket_share_percent}%`)
      }
    ];
    const staffColumns = [
      { accessorKey: "staff_name", header: "Nhân viên" },
      {
        accessorKey: "revenue",
        header: "Doanh thu",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, formatCurrency(row.original.revenue))
      },
      {
        accessorKey: "ticket_count",
        header: "Số ticket",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, row.original.ticket_count.toLocaleString("vi-VN"))
      },
      {
        accessorKey: "ticket_share_percent",
        header: "Tỷ trọng",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums text-slate-500" }, `${row.original.ticket_share_percent}%`)
      }
    ];
    const detailColumns = [
      {
        accessorKey: "date",
        header: "Ngày",
        cell: ({ row }) => formatDate(row.original.date)
      },
      {
        accessorKey: "project_name",
        header: "Dự án"
      },
      {
        accessorKey: "category_label",
        header: "Category"
      },
      {
        accessorKey: "staff_name",
        header: "NV"
      },
      {
        accessorKey: "ticket_count",
        header: "Ticket",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums" }, row.original.ticket_count.toLocaleString("vi-VN"))
      },
      {
        accessorKey: "revenue",
        header: "Doanh thu",
        cell: ({ row }) => vueExports.h("span", { class: "tabular-nums font-medium" }, formatCurrency(row.original.revenue))
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$1;
      const _component_ClientOnly = __nuxt_component_5;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_USkeleton = _sfc_main$2;
      const _component_SharedCrudTableWrapper = __nuxt_component_2$1;
      const _component_SharedReportDonutChart = __nuxt_component_13;
      const _component_UEmpty = _sfc_main$3;
      const _component_UTabs = _sfc_main$4;
      const _component_UTable = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Báo cáo Doanh thu (ticket)",
        description: "Doanh thu gắn luồng ticket → đơn hàng, nhìn theo category và nhân viên xử lý"
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
                            placeholder: "Toàn thời gian",
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
              _push2(`</div><p class="text-xs text-slate-500 mt-3"${_scopeId}> Doanh thu gắn luồng <strong${_scopeId}>ticket → đơn hàng → công nợ</strong>. Chỉ tính ticket có order hoàn thành và công nợ đã thu. Để trống ngày = toàn thời gian. </p>`);
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
                            placeholder: "Toàn thời gian",
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
                vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-3" }, [
                  vueExports.createTextVNode(" Doanh thu gắn luồng "),
                  vueExports.createVNode("strong", null, "ticket → đơn hàng → công nợ"),
                  vueExports.createTextVNode(". Chỉ tính ticket có order hoàn thành và công nợ đã thu. Để trống ngày = toàn thời gian. ")
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tổng doanh thu",
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
                _push2(`<!--[--><p class="text-2xl font-bold text-emerald-600 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).total_revenue))}</p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-24" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold text-emerald-600 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).total_revenue)), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Số ticket",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-16 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-24" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).ticket_count.toLocaleString("vi-VN"))}</p><span class="text-xs text-slate-500"${_scopeId}>Ticket có phát sinh doanh thu</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-16 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-24" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary).ticket_count.toLocaleString("vi-VN")), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, "Ticket có phát sinh doanh thu")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Số dòng ghi nhận",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-16 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-28" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).record_count.toLocaleString("vi-VN"))}</p><span class="text-xs text-slate-500"${_scopeId}>Dòng aggregate trong bảng chi tiết</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-16 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-28" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary).record_count.toLocaleString("vi-VN")), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, "Dòng aggregate trong bảng chi tiết")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Category khác nhau",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-16 mb-1" }, null, _parent2, _scopeId));
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).category_count.toLocaleString("vi-VN"))}</p><span class="text-xs text-slate-500"${_scopeId}>Số category ticket trong kỳ</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-8 w-16 mb-1"
                })) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary).category_count.toLocaleString("vi-VN")), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, "Số category ticket trong kỳ")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tỷ suất theo category ticket",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                status: vueExports.unref(byCategoryStatus),
                error: vueExports.unref(byCategoryError),
                data: vueExports.unref(byCategoryData),
                refresh: vueExports.unref(refreshByCategory)
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(categorySlices).length) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportDonutChart, {
                        title: "Cơ cấu ticket theo category",
                        slices: vueExports.unref(categorySlices),
                        "center-label": "Tổng ticket",
                        "value-suffix": " ticket"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UEmpty, {
                        title: "Chưa có dữ liệu",
                        description: "Đổi bộ lọc hoặc khoảng ngày để xem biểu đồ.",
                        icon: "i-lucide-pie-chart"
                      }, null, _parent3, _scopeId2));
                    }
                  } else {
                    return [
                      vueExports.unref(categorySlices).length ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportDonutChart, {
                        key: 0,
                        title: "Cơ cấu ticket theo category",
                        slices: vueExports.unref(categorySlices),
                        "center-label": "Tổng ticket",
                        "value-suffix": " ticket"
                      }, null, 8, ["slices"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UEmpty, {
                        key: 1,
                        title: "Chưa có dữ liệu",
                        description: "Đổi bộ lọc hoặc khoảng ngày để xem biểu đồ.",
                        icon: "i-lucide-pie-chart"
                      }))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedCrudTableWrapper, {
                  status: vueExports.unref(byCategoryStatus),
                  error: vueExports.unref(byCategoryError),
                  data: vueExports.unref(byCategoryData),
                  refresh: vueExports.unref(refreshByCategory)
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.unref(categorySlices).length ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportDonutChart, {
                      key: 0,
                      title: "Cơ cấu ticket theo category",
                      slices: vueExports.unref(categorySlices),
                      "center-label": "Tổng ticket",
                      "value-suffix": " ticket"
                    }, null, 8, ["slices"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UEmpty, {
                      key: 1,
                      title: "Chưa có dữ liệu",
                      description: "Đổi bộ lọc hoặc khoảng ngày để xem biểu đồ.",
                      icon: "i-lucide-pie-chart"
                    }))
                  ]),
                  _: 1
                }, 8, ["status", "error", "data", "refresh"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tỷ suất theo nhân viên xử lý",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                status: vueExports.unref(byStaffStatus),
                error: vueExports.unref(byStaffError),
                data: vueExports.unref(byStaffData),
                refresh: vueExports.unref(refreshByStaff)
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(staffSlices).length) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportDonutChart, {
                        title: "Cơ cấu ticket theo nhân viên",
                        slices: vueExports.unref(staffSlices),
                        "center-label": "Tổng ticket",
                        "value-suffix": " ticket"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UEmpty, {
                        title: "Chưa có dữ liệu",
                        description: "Đổi bộ lọc hoặc khoảng ngày để xem biểu đồ.",
                        icon: "i-lucide-pie-chart"
                      }, null, _parent3, _scopeId2));
                    }
                  } else {
                    return [
                      vueExports.unref(staffSlices).length ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportDonutChart, {
                        key: 0,
                        title: "Cơ cấu ticket theo nhân viên",
                        slices: vueExports.unref(staffSlices),
                        "center-label": "Tổng ticket",
                        "value-suffix": " ticket"
                      }, null, 8, ["slices"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UEmpty, {
                        key: 1,
                        title: "Chưa có dữ liệu",
                        description: "Đổi bộ lọc hoặc khoảng ngày để xem biểu đồ.",
                        icon: "i-lucide-pie-chart"
                      }))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedCrudTableWrapper, {
                  status: vueExports.unref(byStaffStatus),
                  error: vueExports.unref(byStaffError),
                  data: vueExports.unref(byStaffData),
                  refresh: vueExports.unref(refreshByStaff)
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.unref(staffSlices).length ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportDonutChart, {
                      key: 0,
                      title: "Cơ cấu ticket theo nhân viên",
                      slices: vueExports.unref(staffSlices),
                      "center-label": "Tổng ticket",
                      "value-suffix": " ticket"
                    }, null, 8, ["slices"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UEmpty, {
                      key: 1,
                      title: "Chưa có dữ liệu",
                      description: "Đổi bộ lọc hoặc khoảng ngày để xem biểu đồ.",
                      icon: "i-lucide-pie-chart"
                    }))
                  ]),
                  _: 1
                }, 8, ["status", "error", "data", "refresh"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Số ticket theo ngày và theo dự án",
          compact: "",
          class: "mb-6"
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-3 text-xs"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ticketLineChart).series, (s) => {
                _push2(`<span class="flex items-center gap-1.5"${_scopeId}><span class="inline-block w-4 h-0.5 rounded-full shrink-0" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundColor: s.color })}"${_scopeId}></span><span class="text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(s.label)}</span></span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap gap-3 text-xs" }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ticketLineChart).series, (s) => {
                    return vueExports.openBlock(), vueExports.createBlock("span", {
                      key: s.projectKey,
                      class: "flex items-center gap-1.5"
                    }, [
                      vueExports.createVNode("span", {
                        class: "inline-block w-4 h-0.5 rounded-full shrink-0",
                        style: { backgroundColor: s.color }
                      }, null, 4),
                      vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(s.label), 1)
                    ]);
                  }), 128))
                ])
              ];
            }
          }),
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
                    if (vueExports.unref(ticketLineChart).dates.length) {
                      _push3(`<div class="w-full overflow-x-auto"${_scopeId2}><svg class="min-w-[520px] w-full h-[260px] text-slate-400" viewBox="0 0 640 260" preserveAspectRatio="xMidYMid meet" aria-label="Biểu đồ đường số ticket theo dự án theo ngày"${_scopeId2}><line x1="52" y1="200" x2="608" y2="200" stroke="currentColor" stroke-opacity="0.3"${_scopeId2}></line><line x1="52" y1="120" x2="608" y2="120" stroke="currentColor" stroke-opacity="0.1"${_scopeId2}></line><line x1="52" y1="40" x2="608" y2="40" stroke="currentColor" stroke-opacity="0.1"${_scopeId2}></line><!--[-->`);
                      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ticketLineChart).series, (s, si) => {
                        _push3(`<g${_scopeId2}><polyline${serverRenderer_cjs_prodExports.ssrRenderAttr("points", s.polyline)} fill="none"${serverRenderer_cjs_prodExports.ssrRenderAttr("stroke", s.color)} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"${_scopeId2}></polyline><!--[-->`);
                        serverRenderer_cjs_prodExports.ssrRenderList(s.points, (pt, pi) => {
                          _push3(`<g${_scopeId2}><title${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(pt.tooltip)}</title><circle${serverRenderer_cjs_prodExports.ssrRenderAttr("cx", pt.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("cy", pt.y)} r="4"${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", s.color)} class="hover:opacity-90"${_scopeId2}></circle></g>`);
                        });
                        _push3(`<!--]--></g>`);
                      });
                      _push3(`<!--]--><!--[-->`);
                      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ticketLineChart).dates, (d, i) => {
                        _push3(`<g${_scopeId2}><text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", vueExports.unref(ticketLineChart).xAt(i))} y="232" text-anchor="middle" class="fill-slate-500 text-[10px]"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(dateShort(d))}</text></g>`);
                      });
                      _push3(`<!--]--><text x="8" y="44" class="fill-slate-500 text-[10px]"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticketLineChart).maxY)}</text><text x="8" y="200" class="fill-slate-500 text-[10px]"${_scopeId2}> 0 </text></svg></div>`);
                    } else {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UEmpty, {
                        title: "Chưa có điểm dữ liệu theo ngày",
                        description: "Chọn khoảng ngày hoặc dự án khác — hoặc không có ticket hoàn thành trong khoảng đã chọn.",
                        icon: "i-lucide-line-chart"
                      }, null, _parent3, _scopeId2));
                    }
                  } else {
                    return [
                      vueExports.unref(ticketLineChart).dates.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "w-full overflow-x-auto"
                      }, [
                        (vueExports.openBlock(), vueExports.createBlock("svg", {
                          class: "min-w-[520px] w-full h-[260px] text-slate-400",
                          viewBox: "0 0 640 260",
                          preserveAspectRatio: "xMidYMid meet",
                          "aria-label": "Biểu đồ đường số ticket theo dự án theo ngày"
                        }, [
                          vueExports.createVNode("line", {
                            x1: "52",
                            y1: "200",
                            x2: "608",
                            y2: "200",
                            stroke: "currentColor",
                            "stroke-opacity": "0.3"
                          }),
                          vueExports.createVNode("line", {
                            x1: "52",
                            y1: "120",
                            x2: "608",
                            y2: "120",
                            stroke: "currentColor",
                            "stroke-opacity": "0.1"
                          }),
                          vueExports.createVNode("line", {
                            x1: "52",
                            y1: "40",
                            x2: "608",
                            y2: "40",
                            stroke: "currentColor",
                            "stroke-opacity": "0.1"
                          }),
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ticketLineChart).series, (s, si) => {
                            return vueExports.openBlock(), vueExports.createBlock("g", {
                              key: "line-" + s.projectKey
                            }, [
                              vueExports.createVNode("polyline", {
                                points: s.polyline,
                                fill: "none",
                                stroke: s.color,
                                "stroke-width": "2.5",
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round"
                              }, null, 8, ["points", "stroke"]),
                              (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(s.points, (pt, pi) => {
                                return vueExports.openBlock(), vueExports.createBlock("g", {
                                  key: "pt-" + si + "-" + pi
                                }, [
                                  vueExports.createVNode("title", null, vueExports.toDisplayString(pt.tooltip), 1),
                                  vueExports.createVNode("circle", {
                                    cx: pt.x,
                                    cy: pt.y,
                                    r: "4",
                                    fill: s.color,
                                    class: "hover:opacity-90"
                                  }, null, 8, ["cx", "cy", "fill"])
                                ]);
                              }), 128))
                            ]);
                          }), 128)),
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ticketLineChart).dates, (d, i) => {
                            return vueExports.openBlock(), vueExports.createBlock("g", {
                              key: "dx-" + i
                            }, [
                              vueExports.createVNode("text", {
                                x: vueExports.unref(ticketLineChart).xAt(i),
                                y: "232",
                                "text-anchor": "middle",
                                class: "fill-slate-500 text-[10px]"
                              }, vueExports.toDisplayString(dateShort(d)), 9, ["x"])
                            ]);
                          }), 128)),
                          vueExports.createVNode("text", {
                            x: "8",
                            y: "44",
                            class: "fill-slate-500 text-[10px]"
                          }, vueExports.toDisplayString(vueExports.unref(ticketLineChart).maxY), 1),
                          vueExports.createVNode("text", {
                            x: "8",
                            y: "200",
                            class: "fill-slate-500 text-[10px]"
                          }, " 0 ")
                        ]))
                      ])) : (vueExports.openBlock(), vueExports.createBlock(_component_UEmpty, {
                        key: 1,
                        title: "Chưa có điểm dữ liệu theo ngày",
                        description: "Chọn khoảng ngày hoặc dự án khác — hoặc không có ticket hoàn thành trong khoảng đã chọn.",
                        icon: "i-lucide-line-chart"
                      }))
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
                    vueExports.unref(ticketLineChart).dates.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "w-full overflow-x-auto"
                    }, [
                      (vueExports.openBlock(), vueExports.createBlock("svg", {
                        class: "min-w-[520px] w-full h-[260px] text-slate-400",
                        viewBox: "0 0 640 260",
                        preserveAspectRatio: "xMidYMid meet",
                        "aria-label": "Biểu đồ đường số ticket theo dự án theo ngày"
                      }, [
                        vueExports.createVNode("line", {
                          x1: "52",
                          y1: "200",
                          x2: "608",
                          y2: "200",
                          stroke: "currentColor",
                          "stroke-opacity": "0.3"
                        }),
                        vueExports.createVNode("line", {
                          x1: "52",
                          y1: "120",
                          x2: "608",
                          y2: "120",
                          stroke: "currentColor",
                          "stroke-opacity": "0.1"
                        }),
                        vueExports.createVNode("line", {
                          x1: "52",
                          y1: "40",
                          x2: "608",
                          y2: "40",
                          stroke: "currentColor",
                          "stroke-opacity": "0.1"
                        }),
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ticketLineChart).series, (s, si) => {
                          return vueExports.openBlock(), vueExports.createBlock("g", {
                            key: "line-" + s.projectKey
                          }, [
                            vueExports.createVNode("polyline", {
                              points: s.polyline,
                              fill: "none",
                              stroke: s.color,
                              "stroke-width": "2.5",
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round"
                            }, null, 8, ["points", "stroke"]),
                            (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(s.points, (pt, pi) => {
                              return vueExports.openBlock(), vueExports.createBlock("g", {
                                key: "pt-" + si + "-" + pi
                              }, [
                                vueExports.createVNode("title", null, vueExports.toDisplayString(pt.tooltip), 1),
                                vueExports.createVNode("circle", {
                                  cx: pt.x,
                                  cy: pt.y,
                                  r: "4",
                                  fill: s.color,
                                  class: "hover:opacity-90"
                                }, null, 8, ["cx", "cy", "fill"])
                              ]);
                            }), 128))
                          ]);
                        }), 128)),
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ticketLineChart).dates, (d, i) => {
                          return vueExports.openBlock(), vueExports.createBlock("g", {
                            key: "dx-" + i
                          }, [
                            vueExports.createVNode("text", {
                              x: vueExports.unref(ticketLineChart).xAt(i),
                              y: "232",
                              "text-anchor": "middle",
                              class: "fill-slate-500 text-[10px]"
                            }, vueExports.toDisplayString(dateShort(d)), 9, ["x"])
                          ]);
                        }), 128)),
                        vueExports.createVNode("text", {
                          x: "8",
                          y: "44",
                          class: "fill-slate-500 text-[10px]"
                        }, vueExports.toDisplayString(vueExports.unref(ticketLineChart).maxY), 1),
                        vueExports.createVNode("text", {
                          x: "8",
                          y: "200",
                          class: "fill-slate-500 text-[10px]"
                        }, " 0 ")
                      ]))
                    ])) : (vueExports.openBlock(), vueExports.createBlock(_component_UEmpty, {
                      key: 1,
                      title: "Chưa có điểm dữ liệu theo ngày",
                      description: "Chọn khoảng ngày hoặc dự án khác — hoặc không có ticket hoàn thành trong khoảng đã chọn.",
                      icon: "i-lucide-line-chart"
                    }))
                  ]),
                  _: 1
                }, 8, ["status", "error", "data", "refresh"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTabs, {
          modelValue: vueExports.unref(activeTab),
          "onUpdate:modelValue": ($event) => vueExports.isRef(activeTab) ? activeTab.value = $event : null,
          items: tabs,
          class: "w-full mb-6",
          "value-key": "value"
        }, {
          content: vueExports.withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="pt-4"${_scopeId}>`);
              if (item.value === "category") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                  title: "Doanh thu theo category ticket",
                  compact: ""
                }, {
                  default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                        status: vueExports.unref(byCategoryStatus),
                        error: vueExports.unref(byCategoryError),
                        data: vueExports.unref(byCategoryData),
                        refresh: vueExports.unref(refreshByCategory)
                      }, {
                        default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                              data: vueExports.unref(byCategoryRows),
                              columns: categoryColumns,
                              "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              vueExports.createVNode(_component_UTable, {
                                data: vueExports.unref(byCategoryRows),
                                columns: categoryColumns,
                                "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                              }, null, 8, ["data"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_SharedCrudTableWrapper, {
                          status: vueExports.unref(byCategoryStatus),
                          error: vueExports.unref(byCategoryError),
                          data: vueExports.unref(byCategoryData),
                          refresh: vueExports.unref(refreshByCategory)
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UTable, {
                              data: vueExports.unref(byCategoryRows),
                              columns: categoryColumns,
                              "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                            }, null, 8, ["data"])
                          ]),
                          _: 1
                        }, 8, ["status", "error", "data", "refresh"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (item.value === "staff") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                  title: "Doanh thu theo nhân viên xử lý",
                  compact: ""
                }, {
                  default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                        status: vueExports.unref(byStaffStatus),
                        error: vueExports.unref(byStaffError),
                        data: vueExports.unref(byStaffData),
                        refresh: vueExports.unref(refreshByStaff)
                      }, {
                        default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                              data: vueExports.unref(byStaffRows),
                              columns: staffColumns,
                              "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              vueExports.createVNode(_component_UTable, {
                                data: vueExports.unref(byStaffRows),
                                columns: staffColumns,
                                "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                              }, null, 8, ["data"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_SharedCrudTableWrapper, {
                          status: vueExports.unref(byStaffStatus),
                          error: vueExports.unref(byStaffError),
                          data: vueExports.unref(byStaffData),
                          refresh: vueExports.unref(refreshByStaff)
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UTable, {
                              data: vueExports.unref(byStaffRows),
                              columns: staffColumns,
                              "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                            }, null, 8, ["data"])
                          ]),
                          _: 1
                        }, 8, ["status", "error", "data", "refresh"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "pt-4" }, [
                  item.value === "category" ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedSectionCard, {
                    key: 0,
                    title: "Doanh thu theo category ticket",
                    compact: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedCrudTableWrapper, {
                        status: vueExports.unref(byCategoryStatus),
                        error: vueExports.unref(byCategoryError),
                        data: vueExports.unref(byCategoryData),
                        refresh: vueExports.unref(refreshByCategory)
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_UTable, {
                            data: vueExports.unref(byCategoryRows),
                            columns: categoryColumns,
                            "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                          }, null, 8, ["data"])
                        ]),
                        _: 1
                      }, 8, ["status", "error", "data", "refresh"])
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  item.value === "staff" ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedSectionCard, {
                    key: 1,
                    title: "Doanh thu theo nhân viên xử lý",
                    compact: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedCrudTableWrapper, {
                        status: vueExports.unref(byStaffStatus),
                        error: vueExports.unref(byStaffError),
                        data: vueExports.unref(byStaffData),
                        refresh: vueExports.unref(refreshByStaff)
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_UTable, {
                            data: vueExports.unref(byStaffRows),
                            columns: staffColumns,
                            "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                          }, null, 8, ["data"])
                        ]),
                        _: 1
                      }, 8, ["status", "error", "data", "refresh"])
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Chi tiết dòng (đã lọc)",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                status: vueExports.unref(detailsStatus),
                error: vueExports.unref(detailsError),
                data: vueExports.unref(detailsData),
                refresh: vueExports.unref(refreshDetails)
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                      data: vueExports.unref(detailRows),
                      columns: detailColumns,
                      "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                    }, null, _parent3, _scopeId2));
                    _push3(`<p class="text-xs text-slate-500 mt-3"${_scopeId2}> Đây là bảng tổng hợp theo <strong${_scopeId2}>ngày × dự án × category × nhân viên</strong>, không phải từng ticket raw. </p>`);
                  } else {
                    return [
                      vueExports.createVNode(_component_UTable, {
                        data: vueExports.unref(detailRows),
                        columns: detailColumns,
                        "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                      }, null, 8, ["data"]),
                      vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-3" }, [
                        vueExports.createTextVNode(" Đây là bảng tổng hợp theo "),
                        vueExports.createVNode("strong", null, "ngày × dự án × category × nhân viên"),
                        vueExports.createTextVNode(", không phải từng ticket raw. ")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedCrudTableWrapper, {
                  status: vueExports.unref(detailsStatus),
                  error: vueExports.unref(detailsError),
                  data: vueExports.unref(detailsData),
                  refresh: vueExports.unref(refreshDetails)
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTable, {
                      data: vueExports.unref(detailRows),
                      columns: detailColumns,
                      "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                    }, null, 8, ["data"]),
                    vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-3" }, [
                      vueExports.createTextVNode(" Đây là bảng tổng hợp theo "),
                      vueExports.createVNode("strong", null, "ngày × dự án × category × nhân viên"),
                      vueExports.createTextVNode(", không phải từng ticket raw. ")
                    ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/revenue-ticket.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=revenue-ticket-hm66gGhV.mjs.map
