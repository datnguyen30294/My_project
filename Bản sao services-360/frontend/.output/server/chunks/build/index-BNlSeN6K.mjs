import { _ as _sfc_main$6 } from './Alert-tTsPKADX.mjs';
import { f as formatCurrency, a as formatNumber } from './currency-DEb2TrW3.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, ay as usePlatformApiFetch } from './server.mjs';
import { _ as _sfc_main$3 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-DKHEMZj7.mjs';
import { _ as _sfc_main$5 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$7 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$8 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { a as formatDate } from './date-R5YK0ast.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as usePlatformOrganizationList } from './useOrganizations-DNv3fDw1.mjs';
import { S as SELECT_ALL_PER_PAGE, D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
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
import './index-QmZAbLx-.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './Pagination-fZq_Msxb.mjs';

const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ConsoleSummary",
  __ssrInlineRender: true,
  props: {
    summary: {},
    loading: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const tenantsFailed = vueExports.computed(() => props.summary?.warnings?.tenants_failed ?? 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$6;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-3" }, _attrs))}><div class="grid grid-cols-2 md:grid-cols-4 gap-3"><div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><p class="text-xs text-slate-500 mb-1"> Tổng đơn </p>`);
      if (__props.loading) {
        _push(`<p class="h-7 bg-slate-100 rounded animate-pulse"></p>`);
      } else {
        _push(`<p class="text-xl font-bold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(__props.summary?.orders_count ?? 0))}</p>`);
      }
      _push(`</div><div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><p class="text-xs text-slate-500 mb-1"> Giá trị giao dịch (GMV) </p>`);
      if (__props.loading) {
        _push(`<p class="h-7 bg-slate-100 rounded animate-pulse"></p>`);
      } else {
        _push(`<p class="text-xl font-bold text-slate-900 tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.summary?.gmv ?? 0))}</p>`);
      }
      _push(`</div><div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><p class="text-xs text-slate-500 mb-1"> Phí nền tảng (đã chốt) </p>`);
      if (__props.loading) {
        _push(`<p class="h-7 bg-slate-100 rounded animate-pulse"></p>`);
      } else {
        _push(`<p class="text-xl font-bold text-emerald-600 tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.summary?.platform_fee ?? 0))}</p>`);
      }
      _push(`</div><div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><p class="text-xs text-slate-500 mb-1"> Công ty VH có đơn </p>`);
      if (__props.loading) {
        _push(`<p class="h-7 bg-slate-100 rounded animate-pulse"></p>`);
      } else {
        _push(`<p class="text-xl font-bold text-primary-600">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(__props.summary?.tenants_count ?? 0))}</p>`);
      }
      _push(`</div></div>`);
      if (vueExports.unref(tenantsFailed) > 0) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-octagon",
          title: "Thiếu dữ liệu một số công ty VH",
          description: `${vueExports.unref(tenantsFailed)} công ty vận hành không đọc được dữ liệu đơn — số liệu có thể chưa đầy đủ.`
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/og-order/ConsoleSummary.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$2, { __name: "OgOrderConsoleSummary" });
function buildQuery(p) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    if (v === void 0 || v === null || v === "") continue;
    q.set(k, String(v));
  }
  return q.toString();
}
const OG_ORDERS_BASE = "/platform/og-orders";
function usePlatformOgOrderConsoleList(params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildQuery(vueExports.toValue(params));
    return `${OG_ORDERS_BASE}${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url, {
    watch: [() => vueExports.toValue(params)]
  });
}
function usePlatformOgOrderConsoleSummary(params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildQuery(vueExports.toValue(params));
    return `${OG_ORDERS_BASE}/summary${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url, {
    watch: [() => vueExports.toValue(params)]
  });
}
function ogOrderStatusColor(value) {
  switch (value) {
    case "draft":
      return "neutral";
    case "confirmed":
      return "info";
    case "in_progress":
      return "warning";
    case "accepted":
      return "info";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
}
const OG_ORDER_STATUS_OPTIONS = [
  { value: "draft", label: "Nháp" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "accepted", label: "Đã nghiệm thu" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" }
];
const MAX_RANGE_DAYS = 90;
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ConsoleTable",
  __ssrInlineRender: true,
  setup(__props) {
    function defaultRange() {
      const to = /* @__PURE__ */ new Date();
      const from = /* @__PURE__ */ new Date();
      from.setDate(from.getDate() - 30);
      return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
    }
    const filters = vueExports.reactive({
      ...defaultRange(),
      tenant_id: void 0,
      status: void 0
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      searchTerm.value = value ?? "";
      page.value = 1;
    });
    const searchTerm = vueExports.ref("");
    vueExports.watch(() => [filters.from, filters.to], () => {
      if (!filters.from || !filters.to) return;
      const from = new Date(filters.from);
      const to = new Date(filters.to);
      const diffDays = (to.getTime() - from.getTime()) / 864e5;
      if (diffDays > MAX_RANGE_DAYS) {
        const clamped = new Date(to);
        clamped.setDate(clamped.getDate() - MAX_RANGE_DAYS);
        filters.from = clamped.toISOString().slice(0, 10);
      }
    });
    const { data: tenantsData } = usePlatformOrganizationList(
      vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
    );
    const tenantOptions = vueExports.computed(() => [
      { label: "Tất cả công ty VH", value: void 0 },
      ...(tenantsData.value?.data ?? []).map((o) => ({ label: `${o.name} (${o.id})`, value: o.id }))
    ]);
    const statusOptions = [
      { label: "Trạng thái: Tất cả", value: void 0 },
      ...OG_ORDER_STATUS_OPTIONS.map((s) => ({ label: s.label, value: s.value }))
    ];
    vueExports.watch([
      () => filters.tenant_id,
      () => filters.status
    ], () => {
      page.value = 1;
    });
    const hasFilters = vueExports.computed(
      () => !!searchTerm.value || filters.tenant_id !== void 0 || filters.status !== void 0
    );
    function clearFilters() {
      searchInput.value = "";
      searchTerm.value = "";
      filters.tenant_id = void 0;
      filters.status = void 0;
      Object.assign(filters, defaultRange());
      page.value = 1;
    }
    const summaryParams = vueExports.computed(() => ({
      from: filters.from,
      to: filters.to,
      tenant_id: filters.tenant_id,
      status: filters.status,
      search: searchTerm.value || void 0
    }));
    const listParams = vueExports.computed(() => ({
      ...summaryParams.value,
      page: page.value,
      per_page: DEFAULT_PER_PAGE
    }));
    const { data: summaryData, status: summaryStatus } = usePlatformOgOrderConsoleSummary(summaryParams);
    const { data: listData, status: listStatus, error: listError } = usePlatformOgOrderConsoleList(listParams);
    const orders = vueExports.computed(() => listData.value?.data ?? []);
    const columns = vueExports.computed(() => [
      { accessorKey: "code", header: "Mã đơn" },
      { id: "subject", header: "Nội dung" },
      { id: "project", header: "Dự án" },
      { id: "tenant", header: "Công ty VH" },
      { id: "customer", header: "Khách hàng" },
      { id: "total", header: "GMV" },
      { id: "platform_fee", header: "Phí nền tảng" },
      { id: "status", header: "Trạng thái" },
      { id: "created_at", header: "Ngày tạo" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_OgOrderConsoleSummary = __nuxt_component_0$1;
      const _component_UInput = _sfc_main$3;
      const _component_USelectMenu = _sfc_main$4;
      const _component_USelect = _sfc_main$5;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$6;
      const _component_UTable = _sfc_main$7;
      const _component_UBadge = _sfc_main$8;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_OgOrderConsoleSummary, {
        summary: vueExports.unref(summaryData)?.data ?? null,
        loading: vueExports.unref(summaryStatus) === "pending" && !vueExports.unref(summaryData),
        class: "mb-4"
      }, null, _parent));
      _push(`<div class="mb-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 flex-wrap">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm mã đơn / nội dung...",
        class: "max-w-xs"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
        modelValue: vueExports.unref(filters).tenant_id,
        "onUpdate:modelValue": ($event) => vueExports.unref(filters).tenant_id = $event,
        items: vueExports.unref(tenantOptions),
        "value-key": "value",
        searchable: "",
        class: "min-w-[200px]"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(filters).status,
        "onUpdate:modelValue": ($event) => vueExports.unref(filters).status = $event,
        items: statusOptions,
        "value-key": "value",
        class: "min-w-[170px]"
      }, null, _parent));
      _push(`<div class="flex items-center gap-2"><span class="text-sm text-slate-600">Từ</span>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(filters).from,
        "onUpdate:modelValue": ($event) => vueExports.unref(filters).from = $event,
        type: "date"
      }, null, _parent));
      _push(`<span class="text-sm text-slate-600">đến</span>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(filters).to,
        "onUpdate:modelValue": ($event) => vueExports.unref(filters).to = $event,
        type: "date"
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(hasFilters)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-x",
          label: "Xoá bộ lọc",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          onClick: clearFilters
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(listError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không thể tải danh sách đơn hàng. Vui lòng thử lại.",
          class: "mb-4"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(orders),
        columns: vueExports.unref(columns),
        loading: vueExports.unref(listStatus) === "pending"
      }, {
        "code-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-mono font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "font-mono font-semibold text-slate-900" }, vueExports.toDisplayString(row.original.code), 1)
            ];
          }
        }),
        "subject-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.subject ?? "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm text-slate-700" }, vueExports.toDisplayString(row.original.subject ?? "—"), 1)
            ];
          }
        }),
        "project-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name ?? "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm text-slate-700" }, vueExports.toDisplayString(row.original.project_name ?? "—"), 1)
            ];
          }
        }),
        "tenant-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.tenant?.name ?? row.original.tenant?.id ?? "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm text-slate-700" }, vueExports.toDisplayString(row.original.tenant?.name ?? row.original.tenant?.id ?? "—"), 1)
            ];
          }
        }),
        "customer-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-0.5"${_scopeId}><span class="text-sm text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.customer_name ?? "—")}</span>`);
            if (row.original.customer_phone) {
              _push2(`<span class="text-[11px] text-slate-400 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.customer_phone)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-0.5" }, [
                vueExports.createVNode("span", { class: "text-sm text-slate-900" }, vueExports.toDisplayString(row.original.customer_name ?? "—"), 1),
                row.original.customer_phone ? (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 0,
                  class: "text-[11px] text-slate-400 tabular-nums"
                }, vueExports.toDisplayString(row.original.customer_phone), 1)) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "total-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount))}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount)), 1)
            ];
          }
        }),
        "platform_fee-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="tabular-nums font-semibold text-emerald-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee))}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "tabular-nums font-semibold text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_fee)), 1)
            ];
          }
        }),
        "status-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: vueExports.unref(ogOrderStatusColor)(row.original.status.value),
              variant: "subtle",
              label: row.original.status.label
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: vueExports.unref(ogOrderStatusColor)(row.original.status.value),
                variant: "subtle",
                label: row.original.status.label
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        "created_at-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm text-slate-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.created_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at) : "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm text-slate-600" }, vueExports.toDisplayString(row.original.created_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at) : "—"), 1)
            ];
          }
        }),
        empty: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId}> Không có đơn hàng — thử đổi bộ lọc hoặc khoảng thời gian. </div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Không có đơn hàng — thử đổi bộ lọc hoặc khoảng thời gian. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
        page: vueExports.unref(page),
        "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
        meta: vueExports.unref(listData)?.meta
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/og-order/ConsoleTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "OgOrderConsoleTable" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Đơn hàng OG - Thần Nông" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_OgOrderConsoleTable = __nuxt_component_0;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6"><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Đơn hàng OG </h1><p class="text-slate-500 text-sm mt-1"> Giám sát toàn bộ đơn dịch vụ vận hành (sinh từ yêu cầu OG của cư dân) — gộp mọi công ty vận hành. Màn hình đọc-chỉ. </p></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_OgOrderConsoleTable, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/quan-ly-don-hang/don-hang-og/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BNlSeN6K.mjs.map
