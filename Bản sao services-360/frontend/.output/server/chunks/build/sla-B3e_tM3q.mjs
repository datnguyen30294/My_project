import { _ as _sfc_main$6 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$2 } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, o as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_2$1 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$3 } from './Tabs-Djlffbcc.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$5 } from './Pagination-fZq_Msxb.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import './apiError-DBrxF9au.mjs';
import './Label-BBgw4vHh.mjs';
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
import './useEntitySelect-DG9pQ_n0.mjs';
import './useProjects-D4K3VYdb.mjs';
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
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';

function useSlaSummary() {
  return useApiFetch("/pmc/reports/sla/summary");
}
function useSlaTrend(params) {
  return useApiFetch("/pmc/reports/sla/trend", {
    query: params,
    watch: void 0
  });
}
function useSlaByProject(params) {
  return useApiFetch("/pmc/reports/sla/by-project", {
    query: params,
    watch: [params]
  });
}
function useSlaByStaff(params) {
  return useApiFetch("/pmc/reports/sla/by-staff", {
    query: params,
    watch: [params]
  });
}
function useSlaByTicket(params) {
  return useApiFetch("/pmc/reports/sla/by-ticket", {
    query: params,
    watch: [params]
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "sla",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Báo cáo SLA" });
    const selectedProjectId = vueExports.ref(void 0);
    const ticketPage = vueExports.ref(1);
    const { isInitFromUrl } = useUrlFilters({
      project_id: { ref: selectedProjectId, type: "number" },
      page: { ref: ticketPage, type: "number", defaultValue: 1 }
    });
    const filterProjectId = vueExports.computed(() => selectedProjectId.value || void 0);
    const hasFilters = vueExports.computed(() => selectedProjectId.value != null);
    const { data: summaryData, status: summaryStatus, error: summaryError } = useSlaSummary();
    const summary = vueExports.computed(() => summaryData.value?.data ?? null);
    const {
      data: trendData,
      status: trendStatus,
      error: trendError,
      refresh: refreshTrend
    } = useSlaTrend();
    const trend = vueExports.computed(() => trendData.value?.data ?? []);
    const tabParams = vueExports.computed(() => ({
      project_id: filterProjectId.value
    }));
    const {
      data: byProjectData,
      status: byProjectStatus,
      error: byProjectError,
      refresh: refreshByProject
    } = useSlaByProject(tabParams);
    const byProjectRows = vueExports.computed(() => byProjectData.value?.data ?? []);
    const {
      data: byStaffData,
      status: byStaffStatus,
      error: byStaffError,
      refresh: refreshByStaff
    } = useSlaByStaff(tabParams);
    const byStaffRows = vueExports.computed(() => byStaffData.value?.data ?? []);
    vueExports.watch(selectedProjectId, () => {
      if (!isInitFromUrl.value) {
        ticketPage.value = 1;
      }
    });
    const ticketParams = vueExports.computed(() => ({
      project_id: filterProjectId.value,
      per_page: DEFAULT_PER_PAGE,
      page: ticketPage.value
    }));
    const {
      data: byTicketData,
      status: byTicketStatus,
      error: byTicketError,
      refresh: refreshByTicket
    } = useSlaByTicket(ticketParams);
    const byTicketRows = vueExports.computed(() => byTicketData.value?.data ?? []);
    const ticketMeta = vueExports.computed(() => byTicketData.value?.meta ?? null);
    function clearFilters() {
      selectedProjectId.value = void 0;
      ticketPage.value = 1;
    }
    const activeTab = vueExports.ref("project");
    const tabs = [
      { label: "Theo dự án", value: "project", icon: "i-lucide-building-2" },
      { label: "Theo nhân viên", value: "staff", icon: "i-lucide-users" },
      { label: "Theo ticket", value: "ticket", icon: "i-lucide-ticket" }
    ];
    const chartArea = { left: 48, right: 604, top: 36, bottom: 200 };
    const slaTargetPercent = vueExports.computed(() => summary.value?.sla_target_percent ?? 90);
    const yScale = vueExports.computed(() => {
      const rates = trend.value.map((m) => m.on_time_rate);
      const lo = Math.min(...rates, slaTargetPercent.value);
      const hi = Math.max(...rates, slaTargetPercent.value);
      const pad = Math.max(0.5, (hi - lo) * 0.2);
      const min = Math.max(0, Math.floor((lo - pad) * 10) / 10);
      const max = Math.min(100, Math.ceil((hi + pad) * 10) / 10);
      return { min, max };
    });
    const yMidLabel = vueExports.computed(() => {
      const { min, max } = yScale.value;
      return Math.round((min + max) / 2 * 10) / 10;
    });
    function rateToY(rate) {
      const { min, max } = yScale.value;
      const span = max - min || 1;
      const t = Math.min(1, Math.max(0, (rate - min) / span));
      return chartArea.bottom - t * (chartArea.bottom - chartArea.top);
    }
    const linePoints = vueExports.computed(() => {
      const pts = trend.value;
      const n = pts.length;
      if (n === 0) return "";
      const w = (chartArea.right - chartArea.left) / n;
      return pts.map((m, i) => {
        const cx = chartArea.left + w * i + w / 2;
        return `${cx},${rateToY(m.on_time_rate)}`;
      }).join(" ");
    });
    const dots = vueExports.computed(() => {
      const pts = trend.value;
      const n = pts.length;
      if (n === 0) return [];
      const w = (chartArea.right - chartArea.left) / n;
      return pts.map((m, i) => ({
        x: chartArea.left + w * i + w / 2,
        y: rateToY(m.on_time_rate),
        month: m.month,
        rate: m.on_time_rate
      }));
    });
    const targetLineY = vueExports.computed(() => {
      const { min, max } = yScale.value;
      const t = (slaTargetPercent.value - min) / (max - min || 1);
      if (t < 0 || t > 1) return null;
      return chartArea.bottom - t * (chartArea.bottom - chartArea.top);
    });
    const projectColumns = [
      { accessorKey: "project_name", header: "Dự án" },
      { accessorKey: "tickets_closed", header: "Đã đóng" },
      {
        accessorKey: "on_time_rate",
        header: "Đúng hạn %",
        cell: ({ row }) => `${row.original.on_time_rate}%`
      },
      { accessorKey: "breached", header: "Vi phạm" },
      {
        accessorKey: "avg_hours",
        header: "TB (giờ)",
        cell: ({ row }) => `${row.original.avg_hours} h`
      }
    ];
    const staffColumns = [
      { accessorKey: "project_name", header: "Dự án" },
      { accessorKey: "staff_name", header: "Nhân viên" },
      { accessorKey: "tickets_handled", header: "Ticket xử lý" },
      {
        accessorKey: "on_time_rate",
        header: "Đúng hạn %",
        cell: ({ row }) => `${row.original.on_time_rate}%`
      },
      { accessorKey: "breached", header: "Vi phạm" },
      {
        accessorKey: "avg_resolution_hours",
        header: "TB (giờ)",
        cell: ({ row }) => `${row.original.avg_resolution_hours} h`
      }
    ];
    const ticketColumns = [
      {
        accessorKey: "ticket_code",
        header: "Mã ticket",
        cell: ({ row }) => vueExports.h("span", { class: "font-mono text-sm" }, row.original.ticket_code ?? "—")
      },
      { accessorKey: "project_name", header: "Dự án" },
      {
        accessorKey: "categories",
        header: "Danh mục",
        cell: ({ row }) => {
          if (!row.original.categories || row.original.categories.length === 0) return "—";
          return vueExports.h(
            "div",
            { class: "flex flex-wrap gap-1" },
            row.original.categories.map(
              (category) => vueExports.h(_sfc_main$6, { label: category, color: "neutral", variant: "subtle", size: "sm" })
            )
          );
        }
      },
      { accessorKey: "phase", header: "Giai đoạn SLA" },
      {
        accessorKey: "sla_target_hours",
        header: "Mục tiêu (h)",
        cell: ({ row }) => row.original.sla_target_hours != null ? `${row.original.sla_target_hours} h` : "—"
      },
      {
        accessorKey: "actual_hours",
        header: "Thực tế (h)",
        cell: ({ row }) => row.original.actual_hours != null ? `${row.original.actual_hours} h` : "—"
      },
      {
        accessorKey: "result",
        header: "Kết quả",
        cell: ({ row }) => {
          const isOnTime = row.original.result.value === "on_time";
          return vueExports.h(
            _sfc_main$6,
            { color: isOnTime ? "success" : "error", variant: "subtle", size: "sm" },
            () => row.original.result.label
          );
        }
      }
    ];
    const isLoading = (status) => status === "pending";
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_USkeleton = _sfc_main$1;
      const _component_UFormField = _sfc_main$2;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudTableWrapper = __nuxt_component_2$1;
      const _component_UTabs = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UTable = _sfc_main$4;
      const _component_UPagination = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Báo cáo SLA",
        description: "Hiệu suất xử lý ticket theo cam kết SLA"
      }, null, _parent));
      if (vueExports.unref(summaryError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, { error: vueExports.unref(summaryError) }, null, _parent));
      } else {
        _push(`<!--[--><div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tỷ lệ đúng hạn",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-20 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-28" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold text-emerald-600 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).on_time_rate)}% </p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-20 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-28" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold text-emerald-600 tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary).on_time_rate) + "% ", 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Ticket vi phạm",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-16 mb-1" }, null, _parent2, _scopeId));
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold text-red-600 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).breached_count)}</p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-8 w-16 mb-1"
                })) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold text-red-600 tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary).breached_count), 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Thời gian xử lý (median)",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-20 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-28" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).median_resolution_hours)} h </p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-20 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-28" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary).median_resolution_hours) + " h ", 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tỷ lệ mở lại",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-20 mb-1" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-28" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).reopened_rate)}% </p><span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-20 mb-1" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-28" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(vueExports.unref(summary).reopened_rate) + "% ", 1),
                  vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Lọc bảng chi tiết",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap items-end gap-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Dự án",
                class: "max-w-xs"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
                      modelValue: vueExports.unref(selectedProjectId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                      placeholder: "Tất cả dự án"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án"
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
              _push2(`</div><p class="text-xs text-slate-500 mt-2"${_scopeId}> Áp dụng cho các tab <strong${_scopeId}>Theo dự án</strong>, <strong${_scopeId}>Theo nhân viên</strong>, <strong${_scopeId}>Theo ticket</strong> bên dưới. </p>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap items-end gap-3" }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Dự án",
                    class: "max-w-xs"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án"
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
                vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, [
                  vueExports.createTextVNode(" Áp dụng cho các tab "),
                  vueExports.createVNode("strong", null, "Theo dự án"),
                  vueExports.createTextVNode(", "),
                  vueExports.createVNode("strong", null, "Theo nhân viên"),
                  vueExports.createTextVNode(", "),
                  vueExports.createVNode("strong", null, "Theo ticket"),
                  vueExports.createTextVNode(" bên dưới. ")
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Xu hướng SLA theo tháng",
          compact: "",
          class: "mb-6"
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-4 text-xs text-slate-600"${_scopeId}><span class="flex items-center gap-1.5"${_scopeId}><span class="inline-block w-5 h-0.5 bg-emerald-500 rounded-full"${_scopeId}></span> Đúng hạn % </span><span class="flex items-center gap-1.5"${_scopeId}><span class="inline-block w-5 h-0 border-t-2 border-dashed border-amber-500 opacity-80"${_scopeId}></span> Mục tiêu ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(slaTargetPercent))}% </span></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap gap-4 text-xs text-slate-600" }, [
                  vueExports.createVNode("span", { class: "flex items-center gap-1.5" }, [
                    vueExports.createVNode("span", { class: "inline-block w-5 h-0.5 bg-emerald-500 rounded-full" }),
                    vueExports.createTextVNode(" Đúng hạn % ")
                  ]),
                  vueExports.createVNode("span", { class: "flex items-center gap-1.5" }, [
                    vueExports.createVNode("span", { class: "inline-block w-5 h-0 border-t-2 border-dashed border-amber-500 opacity-80" }),
                    vueExports.createTextVNode(" Mục tiêu " + vueExports.toDisplayString(vueExports.unref(slaTargetPercent)) + "% ", 1)
                  ])
                ])
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                status: vueExports.unref(trendStatus),
                error: vueExports.unref(trendError),
                data: vueExports.unref(trendData),
                refresh: vueExports.unref(refreshTrend)
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(trend).length > 0) {
                      _push3(`<div class="w-full overflow-x-auto"${_scopeId2}><svg class="min-w-[520px] w-full h-[260px] text-slate-400" viewBox="0 0 640 260" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Biểu đồ xu hướng tỷ lệ đúng hạn SLA theo tháng"${_scopeId2}><line x1="48" y1="200" x2="604" y2="200" stroke="currentColor" stroke-opacity="0.22"${_scopeId2}></line><line x1="48" y1="140" x2="604" y2="140" stroke="currentColor" stroke-opacity="0.08"${_scopeId2}></line><line x1="48" y1="80" x2="604" y2="80" stroke="currentColor" stroke-opacity="0.08"${_scopeId2}></line>`);
                      if (vueExports.unref(targetLineY) !== null) {
                        _push3(`<line x1="48"${serverRenderer_cjs_prodExports.ssrRenderAttr("y1", vueExports.unref(targetLineY))} x2="604"${serverRenderer_cjs_prodExports.ssrRenderAttr("y2", vueExports.unref(targetLineY))} stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6 5" stroke-opacity="0.85"${_scopeId2}></line>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`<polyline${serverRenderer_cjs_prodExports.ssrRenderAttr("points", vueExports.unref(linePoints))} fill="none" stroke="#10b981" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"${_scopeId2}></polyline><!--[-->`);
                      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(dots), (pt, i) => {
                        _push3(`<g${_scopeId2}><circle${serverRenderer_cjs_prodExports.ssrRenderAttr("cx", pt.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("cy", pt.y)} r="4.5" class="fill-emerald-500" stroke="white" stroke-width="1.5"${_scopeId2}></circle><text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", pt.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", pt.y - 12)} text-anchor="middle" class="fill-slate-700 text-[10px] font-semibold"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(pt.rate)}% </text><text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", pt.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", 222)} text-anchor="middle" class="fill-slate-500 text-[11px]"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(pt.month)}</text></g>`);
                      });
                      _push3(`<!--]--><text x="6" y="84" class="fill-slate-500 text-[10px]"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(yScale).max)}% </text><text x="6" y="144" class="fill-slate-500 text-[10px]"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(yMidLabel))}% </text><text x="6" y="204" class="fill-slate-500 text-[10px]"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(yScale).min)}% </text></svg></div>`);
                    } else {
                      _push3(`<p class="text-sm text-slate-500 py-8 text-center"${_scopeId2}> Chưa có dữ liệu xu hướng </p>`);
                    }
                  } else {
                    return [
                      vueExports.unref(trend).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "w-full overflow-x-auto"
                      }, [
                        (vueExports.openBlock(), vueExports.createBlock("svg", {
                          class: "min-w-[520px] w-full h-[260px] text-slate-400",
                          viewBox: "0 0 640 260",
                          preserveAspectRatio: "xMidYMid meet",
                          role: "img",
                          "aria-label": "Biểu đồ xu hướng tỷ lệ đúng hạn SLA theo tháng"
                        }, [
                          vueExports.createVNode("line", {
                            x1: "48",
                            y1: "200",
                            x2: "604",
                            y2: "200",
                            stroke: "currentColor",
                            "stroke-opacity": "0.22"
                          }),
                          vueExports.createVNode("line", {
                            x1: "48",
                            y1: "140",
                            x2: "604",
                            y2: "140",
                            stroke: "currentColor",
                            "stroke-opacity": "0.08"
                          }),
                          vueExports.createVNode("line", {
                            x1: "48",
                            y1: "80",
                            x2: "604",
                            y2: "80",
                            stroke: "currentColor",
                            "stroke-opacity": "0.08"
                          }),
                          vueExports.unref(targetLineY) !== null ? (vueExports.openBlock(), vueExports.createBlock("line", {
                            key: 0,
                            x1: "48",
                            y1: vueExports.unref(targetLineY),
                            x2: "604",
                            y2: vueExports.unref(targetLineY),
                            stroke: "#f59e0b",
                            "stroke-width": "1.5",
                            "stroke-dasharray": "6 5",
                            "stroke-opacity": "0.85"
                          }, null, 8, ["y1", "y2"])) : vueExports.createCommentVNode("", true),
                          vueExports.createVNode("polyline", {
                            points: vueExports.unref(linePoints),
                            fill: "none",
                            stroke: "#10b981",
                            "stroke-width": "2.75",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          }, null, 8, ["points"]),
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(dots), (pt, i) => {
                            return vueExports.openBlock(), vueExports.createBlock("g", {
                              key: "pt-" + i
                            }, [
                              vueExports.createVNode("circle", {
                                cx: pt.x,
                                cy: pt.y,
                                r: "4.5",
                                class: "fill-emerald-500",
                                stroke: "white",
                                "stroke-width": "1.5"
                              }, null, 8, ["cx", "cy"]),
                              vueExports.createVNode("text", {
                                x: pt.x,
                                y: pt.y - 12,
                                "text-anchor": "middle",
                                class: "fill-slate-700 text-[10px] font-semibold"
                              }, vueExports.toDisplayString(pt.rate) + "% ", 9, ["x", "y"]),
                              vueExports.createVNode("text", {
                                x: pt.x,
                                y: 222,
                                "text-anchor": "middle",
                                class: "fill-slate-500 text-[11px]"
                              }, vueExports.toDisplayString(pt.month), 9, ["x"])
                            ]);
                          }), 128)),
                          vueExports.createVNode("text", {
                            x: "6",
                            y: "84",
                            class: "fill-slate-500 text-[10px]"
                          }, vueExports.toDisplayString(vueExports.unref(yScale).max) + "% ", 1),
                          vueExports.createVNode("text", {
                            x: "6",
                            y: "144",
                            class: "fill-slate-500 text-[10px]"
                          }, vueExports.toDisplayString(vueExports.unref(yMidLabel)) + "% ", 1),
                          vueExports.createVNode("text", {
                            x: "6",
                            y: "204",
                            class: "fill-slate-500 text-[10px]"
                          }, vueExports.toDisplayString(vueExports.unref(yScale).min) + "% ", 1)
                        ]))
                      ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                        key: 1,
                        class: "text-sm text-slate-500 py-8 text-center"
                      }, " Chưa có dữ liệu xu hướng "))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedCrudTableWrapper, {
                  status: vueExports.unref(trendStatus),
                  error: vueExports.unref(trendError),
                  data: vueExports.unref(trendData),
                  refresh: vueExports.unref(refreshTrend)
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.unref(trend).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "w-full overflow-x-auto"
                    }, [
                      (vueExports.openBlock(), vueExports.createBlock("svg", {
                        class: "min-w-[520px] w-full h-[260px] text-slate-400",
                        viewBox: "0 0 640 260",
                        preserveAspectRatio: "xMidYMid meet",
                        role: "img",
                        "aria-label": "Biểu đồ xu hướng tỷ lệ đúng hạn SLA theo tháng"
                      }, [
                        vueExports.createVNode("line", {
                          x1: "48",
                          y1: "200",
                          x2: "604",
                          y2: "200",
                          stroke: "currentColor",
                          "stroke-opacity": "0.22"
                        }),
                        vueExports.createVNode("line", {
                          x1: "48",
                          y1: "140",
                          x2: "604",
                          y2: "140",
                          stroke: "currentColor",
                          "stroke-opacity": "0.08"
                        }),
                        vueExports.createVNode("line", {
                          x1: "48",
                          y1: "80",
                          x2: "604",
                          y2: "80",
                          stroke: "currentColor",
                          "stroke-opacity": "0.08"
                        }),
                        vueExports.unref(targetLineY) !== null ? (vueExports.openBlock(), vueExports.createBlock("line", {
                          key: 0,
                          x1: "48",
                          y1: vueExports.unref(targetLineY),
                          x2: "604",
                          y2: vueExports.unref(targetLineY),
                          stroke: "#f59e0b",
                          "stroke-width": "1.5",
                          "stroke-dasharray": "6 5",
                          "stroke-opacity": "0.85"
                        }, null, 8, ["y1", "y2"])) : vueExports.createCommentVNode("", true),
                        vueExports.createVNode("polyline", {
                          points: vueExports.unref(linePoints),
                          fill: "none",
                          stroke: "#10b981",
                          "stroke-width": "2.75",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round"
                        }, null, 8, ["points"]),
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(dots), (pt, i) => {
                          return vueExports.openBlock(), vueExports.createBlock("g", {
                            key: "pt-" + i
                          }, [
                            vueExports.createVNode("circle", {
                              cx: pt.x,
                              cy: pt.y,
                              r: "4.5",
                              class: "fill-emerald-500",
                              stroke: "white",
                              "stroke-width": "1.5"
                            }, null, 8, ["cx", "cy"]),
                            vueExports.createVNode("text", {
                              x: pt.x,
                              y: pt.y - 12,
                              "text-anchor": "middle",
                              class: "fill-slate-700 text-[10px] font-semibold"
                            }, vueExports.toDisplayString(pt.rate) + "% ", 9, ["x", "y"]),
                            vueExports.createVNode("text", {
                              x: pt.x,
                              y: 222,
                              "text-anchor": "middle",
                              class: "fill-slate-500 text-[11px]"
                            }, vueExports.toDisplayString(pt.month), 9, ["x"])
                          ]);
                        }), 128)),
                        vueExports.createVNode("text", {
                          x: "6",
                          y: "84",
                          class: "fill-slate-500 text-[10px]"
                        }, vueExports.toDisplayString(vueExports.unref(yScale).max) + "% ", 1),
                        vueExports.createVNode("text", {
                          x: "6",
                          y: "144",
                          class: "fill-slate-500 text-[10px]"
                        }, vueExports.toDisplayString(vueExports.unref(yMidLabel)) + "% ", 1),
                        vueExports.createVNode("text", {
                          x: "6",
                          y: "204",
                          class: "fill-slate-500 text-[10px]"
                        }, vueExports.toDisplayString(vueExports.unref(yScale).min) + "% ", 1)
                      ]))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 1,
                      class: "text-sm text-slate-500 py-8 text-center"
                    }, " Chưa có dữ liệu xu hướng "))
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
          class: "mb-6"
        }, null, _parent));
        if (vueExports.unref(activeTab) === "project") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Theo dự án",
            compact: ""
          }, {
            "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: "/pmc/og-tickets?sla=breached",
                  class: "text-sm font-medium text-primary-600 hover:text-primary-700"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Mở SLA / Vi phạm (chi tiết ticket) `);
                    } else {
                      return [
                        vueExports.createTextVNode(" Mở SLA / Vi phạm (chi tiết ticket) ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_NuxtLink, {
                    to: "/pmc/og-tickets?sla=breached",
                    class: "text-sm font-medium text-primary-600 hover:text-primary-700"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Mở SLA / Vi phạm (chi tiết ticket) ")
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                  status: vueExports.unref(byProjectStatus),
                  error: vueExports.unref(byProjectError),
                  data: vueExports.unref(byProjectData),
                  refresh: vueExports.unref(refreshByProject)
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                        data: vueExports.unref(byProjectRows),
                        columns: projectColumns
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UTable, {
                          data: vueExports.unref(byProjectRows),
                          columns: projectColumns
                        }, null, 8, ["data"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_SharedCrudTableWrapper, {
                    status: vueExports.unref(byProjectStatus),
                    error: vueExports.unref(byProjectError),
                    data: vueExports.unref(byProjectData),
                    refresh: vueExports.unref(refreshByProject)
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UTable, {
                        data: vueExports.unref(byProjectRows),
                        columns: projectColumns
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  }, 8, ["status", "error", "data", "refresh"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(activeTab) === "staff") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Theo nhân viên",
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
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                        data: vueExports.unref(byStaffRows),
                        columns: staffColumns
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UTable, {
                          data: vueExports.unref(byStaffRows),
                          columns: staffColumns
                        }, null, 8, ["data"])
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
                      vueExports.createVNode(_component_UTable, {
                        data: vueExports.unref(byStaffRows),
                        columns: staffColumns
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  }, 8, ["status", "error", "data", "refresh"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(activeTab) === "ticket") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Theo ticket",
            compact: ""
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
                  status: vueExports.unref(byTicketStatus),
                  error: vueExports.unref(byTicketError),
                  data: vueExports.unref(byTicketData),
                  refresh: vueExports.unref(refreshByTicket)
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                        data: vueExports.unref(byTicketRows),
                        columns: ticketColumns
                      }, null, _parent3, _scopeId2));
                      if (vueExports.unref(ticketMeta) && vueExports.unref(ticketMeta).last_page > 1) {
                        _push3(`<div class="flex items-center justify-between pt-4 border-t border-slate-100 mt-4"${_scopeId2}><p class="text-sm text-slate-500"${_scopeId2}> Hiển thị ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(byTicketRows).length)} / ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticketMeta).total)} dòng SLA </p>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UPagination, {
                          page: vueExports.unref(ticketPage),
                          "onUpdate:page": ($event) => vueExports.isRef(ticketPage) ? ticketPage.value = $event : null,
                          total: vueExports.unref(ticketMeta).total,
                          "items-per-page": vueExports.unref(ticketMeta).per_page ?? ("DEFAULT_PER_PAGE" in _ctx ? _ctx.DEFAULT_PER_PAGE : vueExports.unref(DEFAULT_PER_PAGE)),
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
                          data: vueExports.unref(byTicketRows),
                          columns: ticketColumns
                        }, null, 8, ["data"]),
                        vueExports.unref(ticketMeta) && vueExports.unref(ticketMeta).last_page > 1 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 0,
                          class: "flex items-center justify-between pt-4 border-t border-slate-100 mt-4"
                        }, [
                          vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Hiển thị " + vueExports.toDisplayString(vueExports.unref(byTicketRows).length) + " / " + vueExports.toDisplayString(vueExports.unref(ticketMeta).total) + " dòng SLA ", 1),
                          vueExports.createVNode(_component_UPagination, {
                            page: vueExports.unref(ticketPage),
                            "onUpdate:page": ($event) => vueExports.isRef(ticketPage) ? ticketPage.value = $event : null,
                            total: vueExports.unref(ticketMeta).total,
                            "items-per-page": vueExports.unref(ticketMeta).per_page ?? ("DEFAULT_PER_PAGE" in _ctx ? _ctx.DEFAULT_PER_PAGE : vueExports.unref(DEFAULT_PER_PAGE)),
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
                    status: vueExports.unref(byTicketStatus),
                    error: vueExports.unref(byTicketError),
                    data: vueExports.unref(byTicketData),
                    refresh: vueExports.unref(refreshByTicket)
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UTable, {
                        data: vueExports.unref(byTicketRows),
                        columns: ticketColumns
                      }, null, 8, ["data"]),
                      vueExports.unref(ticketMeta) && vueExports.unref(ticketMeta).last_page > 1 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex items-center justify-between pt-4 border-t border-slate-100 mt-4"
                      }, [
                        vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Hiển thị " + vueExports.toDisplayString(vueExports.unref(byTicketRows).length) + " / " + vueExports.toDisplayString(vueExports.unref(ticketMeta).total) + " dòng SLA ", 1),
                        vueExports.createVNode(_component_UPagination, {
                          page: vueExports.unref(ticketPage),
                          "onUpdate:page": ($event) => vueExports.isRef(ticketPage) ? ticketPage.value = $event : null,
                          total: vueExports.unref(ticketMeta).total,
                          "items-per-page": vueExports.unref(ticketMeta).per_page ?? ("DEFAULT_PER_PAGE" in _ctx ? _ctx.DEFAULT_PER_PAGE : vueExports.unref(DEFAULT_PER_PAGE)),
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
        } else {
          _push(`<!---->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/sla.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=sla-B3e_tM3q.mjs.map
