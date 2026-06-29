import { _ as _sfc_main$5 } from './Alert-tTsPKADX.mjs';
import { f as formatCurrency, a as formatNumber } from './currency-DEb2TrW3.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$3 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-DKHEMZj7.mjs';
import { _ as __nuxt_component_4 } from './OrganizationProjectSelect-C1GzN7Mu.mjs';
import { _ as _sfc_main$6 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$7 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { a as formatDate } from './date-R5YK0ast.mjs';
import { V as VENDOR_ORDER_TYPE_OPTIONS, f as VENDOR_ORDER_STATUS_OPTIONS, g as usePlatformVendorOrderConsoleSummary, h as usePlatformVendorOrderConsoleList, v as vendorOrderStatusColor, r as revenueRecipientColor } from './useVendorOrders-DqEI_vYD.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { j as usePlatformPartnerList } from './usePartners-DhKs6EM6.mjs';
import { S as SELECT_ALL_PER_PAGE, D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as usePlatformOrganizationList } from './useOrganizations-DNv3fDw1.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ConsoleSummary",
  __ssrInlineRender: true,
  props: {
    summary: {},
    loading: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const warnings = vueExports.computed(() => props.summary?.warnings ?? null);
    const ordersSub = vueExports.computed(() => {
      const s = props.summary;
      if (!s) return "";
      return `${formatNumber(s.product_count)} SP · ${formatNumber(s.service_count)} DV`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-3" }, _attrs))}><div class="grid grid-cols-2 md:grid-cols-4 gap-3"><div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><p class="text-xs text-slate-500 mb-1"> Tổng đơn </p>`);
      if (__props.loading) {
        _push(`<p class="h-7 bg-slate-100 rounded animate-pulse"></p>`);
      } else {
        _push(`<!--[--><p class="text-xl font-bold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(__props.summary?.orders_count ?? 0))}</p><p class="text-xs text-slate-500 mt-0.5">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ordersSub))}</p><!--]-->`);
      }
      _push(`</div><div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><p class="text-xs text-slate-500 mb-1"> Giá trị giao dịch (GMV) </p>`);
      if (__props.loading) {
        _push(`<p class="h-7 bg-slate-100 rounded animate-pulse"></p>`);
      } else {
        _push(`<p class="text-xl font-bold text-slate-900 tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.summary?.gmv ?? 0))}</p>`);
      }
      _push(`</div><div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><p class="text-xs text-slate-500 mb-1"> Hoa hồng → Platform </p>`);
      if (__props.loading) {
        _push(`<p class="h-7 bg-slate-100 rounded animate-pulse"></p>`);
      } else {
        _push(`<p class="text-xl font-bold text-emerald-600 tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.summary?.commission_platform ?? 0))}</p>`);
      }
      _push(`</div><div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><p class="text-xs text-slate-500 mb-1"> Hoa hồng → Công ty VH </p>`);
      if (__props.loading) {
        _push(`<p class="h-7 bg-slate-100 rounded animate-pulse"></p>`);
      } else {
        _push(`<p class="text-xl font-bold text-primary-600 tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.summary?.commission_operating_company ?? 0))}</p>`);
      }
      _push(`</div></div>`);
      if (vueExports.unref(warnings)?.schema_missing) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-octagon",
          title: "Thiếu dữ liệu vendor",
          description: "Một số vendor chưa được provision schema trên resi_mart — số liệu có thể chưa đầy đủ."
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(warnings) && vueExports.unref(warnings).non_per_order_orders_count > 0) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "neutral",
          variant: "subtle",
          icon: "i-lucide-info",
          description: `${vueExports.unref(warnings).non_per_order_orders_count} đơn hoàn thành thuộc hợp đồng chia doanh thu / thuê bao — không tính hoa hồng theo đơn.`
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-order/ConsoleSummary.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$1, { __name: "VendorOrderConsoleSummary" });
const DETAIL_BASE = "/platform/quan-ly-don-hang/don-hang-vendor";
const VENDOR_BASE = "/platform/quan-ly-van-hanh/quan-ly-vendor";
const PROJECT_BASE = "/platform/quan-ly-van-hanh/du-an-tren-nen-tang";
const MAX_RANGE_DAYS = 90;
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ConsoleTable",
  __ssrInlineRender: true,
  props: {
    lockedPartnerId: {}
  },
  setup(__props) {
    const props = __props;
    const isLocked = vueExports.computed(() => props.lockedPartnerId !== void 0);
    function defaultRange() {
      const to = /* @__PURE__ */ new Date();
      const from = /* @__PURE__ */ new Date();
      from.setDate(from.getDate() - 30);
      return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
    }
    const filters = vueExports.reactive({
      ...defaultRange(),
      partner_id: void 0,
      tenant_id: void 0,
      project_id: void 0,
      type: void 0,
      status: void 0
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      searchTerm.value = value ?? "";
      page.value = 1;
    });
    const searchTerm = vueExports.ref("");
    const effectivePartnerId = vueExports.computed(() => props.lockedPartnerId ?? filters.partner_id);
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
    const { data: vendorsData } = usePlatformPartnerList(
      vueExports.computed(() => ({ provisioned: true, per_page: SELECT_ALL_PER_PAGE, sort_by: "name", sort_direction: "asc" }))
    );
    const vendorOptions = vueExports.computed(() => [
      { label: "Tất cả vendor", value: void 0 },
      ...(vendorsData.value?.data ?? []).map((v) => ({ label: v.name, value: v.id }))
    ]);
    const { data: tenantsData } = usePlatformOrganizationList(
      vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
    );
    const tenantOptions = vueExports.computed(() => [
      { label: "Tất cả công ty VH", value: void 0 },
      ...(tenantsData.value?.data ?? []).map((o) => ({ label: `${o.name} (${o.id})`, value: o.id }))
    ]);
    const typeOptions = [
      { label: "Loại: Tất cả", value: void 0 },
      ...VENDOR_ORDER_TYPE_OPTIONS.map((t) => ({ label: t.label, value: t.value }))
    ];
    const statusOptions = [
      { label: "Trạng thái: Tất cả", value: void 0 },
      ...VENDOR_ORDER_STATUS_OPTIONS.map((s) => ({ label: s.label, value: s.value }))
    ];
    vueExports.watch([
      () => filters.partner_id,
      () => filters.tenant_id,
      () => filters.project_id,
      () => filters.type,
      () => filters.status
    ], () => {
      page.value = 1;
    });
    vueExports.watch(() => filters.tenant_id, () => {
      filters.project_id = void 0;
    });
    const hasFilters = vueExports.computed(
      () => !!searchTerm.value || !isLocked.value && filters.partner_id !== void 0 || filters.tenant_id !== void 0 || filters.project_id !== void 0 && filters.project_id !== null || filters.type !== void 0 || filters.status !== void 0
    );
    function clearFilters() {
      searchInput.value = "";
      searchTerm.value = "";
      if (!isLocked.value) {
        filters.partner_id = void 0;
      }
      filters.tenant_id = void 0;
      filters.project_id = void 0;
      filters.type = void 0;
      filters.status = void 0;
      Object.assign(filters, defaultRange());
      page.value = 1;
    }
    const summaryParams = vueExports.computed(() => ({
      from: filters.from,
      to: filters.to,
      partner_id: effectivePartnerId.value,
      tenant_id: filters.tenant_id,
      project_id: filters.project_id ?? void 0,
      type: filters.type,
      status: filters.status,
      search: searchTerm.value || void 0
    }));
    const listParams = vueExports.computed(() => ({
      ...summaryParams.value,
      page: page.value,
      per_page: DEFAULT_PER_PAGE
    }));
    const { data: summaryData, status: summaryStatus } = usePlatformVendorOrderConsoleSummary(summaryParams);
    const { data: listData, status: listStatus, error: listError } = usePlatformVendorOrderConsoleList(listParams);
    const orders = vueExports.computed(() => listData.value?.data ?? []);
    const columns = vueExports.computed(() => [
      { accessorKey: "code", header: "Mã đơn" },
      { id: "type", header: "Loại" },
      ...isLocked.value ? [] : [{ id: "vendor", header: "Vendor" }],
      { id: "project", header: "Dự án" },
      { id: "tenant", header: "Công ty VH" },
      { id: "customer", header: "Khách hàng" },
      { id: "total", header: "GMV" },
      { id: "commission", header: "Hoa hồng" },
      { id: "recipient", header: "Thuộc về" },
      { id: "status", header: "Trạng thái" },
      { id: "rating", header: "Đánh giá CD" },
      { id: "created_at", header: "Ngày tạo" }
    ]);
    function orderKey(row) {
      return `${row.vendor?.id ?? props.lockedPartnerId ?? 0}-${row.id}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VendorOrderConsoleSummary = __nuxt_component_0$1;
      const _component_UInput = _sfc_main$2;
      const _component_USelect = _sfc_main$3;
      const _component_USelectMenu = _sfc_main$4;
      const _component_SharedOrganizationProjectSelect = __nuxt_component_4;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$5;
      const _component_UTable = _sfc_main$6;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$7;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderConsoleSummary, {
        summary: vueExports.unref(summaryData)?.data ?? null,
        loading: vueExports.unref(summaryStatus) === "pending" && !vueExports.unref(summaryData),
        class: "mb-4"
      }, null, _parent));
      _push(`<div class="mb-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 flex-wrap">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm mã đơn...",
        class: "max-w-xs"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(filters).type,
        "onUpdate:modelValue": ($event) => vueExports.unref(filters).type = $event,
        items: typeOptions,
        "value-key": "value",
        class: "min-w-[150px]"
      }, null, _parent));
      if (!vueExports.unref(isLocked)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
          modelValue: vueExports.unref(filters).partner_id,
          "onUpdate:modelValue": ($event) => vueExports.unref(filters).partner_id = $event,
          items: vueExports.unref(vendorOptions),
          "value-key": "value",
          searchable: "",
          class: "min-w-[180px]"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
        modelValue: vueExports.unref(filters).tenant_id,
        "onUpdate:modelValue": ($event) => vueExports.unref(filters).tenant_id = $event,
        items: vueExports.unref(tenantOptions),
        "value-key": "value",
        searchable: "",
        class: "min-w-[200px]"
      }, null, _parent));
      _push(`<div class="w-52">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOrganizationProjectSelect, {
        modelValue: vueExports.unref(filters).project_id,
        "onUpdate:modelValue": ($event) => vueExports.unref(filters).project_id = $event,
        "organization-id": vueExports.unref(filters).tenant_id ?? null,
        placeholder: "Tất cả dự án",
        disabled: !vueExports.unref(filters).tenant_id
      }, null, _parent));
      _push(`</div>`);
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
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: `${DETAIL_BASE}/${orderKey(row.original)}`,
              class: "font-mono font-semibold text-primary-700 hover:underline"
            }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.code), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_NuxtLink, {
                to: `${DETAIL_BASE}/${orderKey(row.original)}`,
                class: "font-mono font-semibold text-primary-700 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.code), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ];
          }
        }),
        "type-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.type.label)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.type.label), 1)
            ];
          }
        }),
        "vendor-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.vendor) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                to: `${VENDOR_BASE}/${row.original.vendor.id}`,
                class: "text-slate-900 hover:text-primary-700 hover:underline"
              }, {
                default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.vendor.name)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.vendor.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<span class="text-slate-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.vendor ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                key: 0,
                to: `${VENDOR_BASE}/${row.original.vendor.id}`,
                class: "text-slate-900 hover:text-primary-700 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.vendor.name), 1)
                ]),
                _: 2
              }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-slate-400"
              }, "—"))
            ];
          }
        }),
        "project-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.project_id && row.original.tenant?.id) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                to: `${PROJECT_BASE}/${row.original.project_id}?tenant=${row.original.tenant.id}`,
                class: "text-slate-700 hover:text-primary-700 hover:underline"
              }, {
                default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.project_name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else if (row.original.project_id) {
              _push2(`<span class="text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name)}</span>`);
            } else {
              _push2(`<span class="text-slate-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.project_id && row.original.tenant?.id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                key: 0,
                to: `${PROJECT_BASE}/${row.original.project_id}?tenant=${row.original.tenant.id}`,
                class: "text-slate-700 hover:text-primary-700 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.project_name), 1)
                ]),
                _: 2
              }, 1032, ["to"])) : row.original.project_id ? (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-slate-700"
              }, vueExports.toDisplayString(row.original.project_name), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 2,
                class: "text-slate-400"
              }, "—"))
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
            _push2(`<span class="text-sm text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.customer?.name ?? "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm text-slate-900" }, vueExports.toDisplayString(row.original.customer?.name ?? "—"), 1)
            ];
          }
        }),
        "total-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total))}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total)), 1)
            ];
          }
        }),
        "commission-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.commission) {
              _push2(`<div class="flex flex-col gap-0.5"${_scopeId}><span class="tabular-nums font-semibold text-primary-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission.amount))}</span>`);
              if (row.original.commission.is_manual) {
                _push2(`<span class="text-[11px] text-amber-600"${_scopeId}>Gán thủ công</span>`);
              } else if (row.original.commission.source === "default") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: `${DETAIL_BASE}/${orderKey(row.original)}`,
                  title: "Hoa hồng mặc định 0đ (chưa có hợp đồng) — bấm để gán"
                }, {
                  default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        color: "neutral",
                        variant: "subtle",
                        size: "sm",
                        label: "Mặc định",
                        class: "cursor-pointer"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UBadge, {
                          color: "neutral",
                          variant: "subtle",
                          size: "sm",
                          label: "Mặc định",
                          class: "cursor-pointer"
                        })
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
              _push2(`<span class="text-slate-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.commission ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "flex flex-col gap-0.5"
              }, [
                vueExports.createVNode("span", { class: "tabular-nums font-semibold text-primary-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission.amount)), 1),
                row.original.commission.is_manual ? (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 0,
                  class: "text-[11px] text-amber-600"
                }, "Gán thủ công")) : row.original.commission.source === "default" ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                  key: 1,
                  to: `${DETAIL_BASE}/${orderKey(row.original)}`,
                  title: "Hoa hồng mặc định 0đ (chưa có hợp đồng) — bấm để gán"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UBadge, {
                      color: "neutral",
                      variant: "subtle",
                      size: "sm",
                      label: "Mặc định",
                      class: "cursor-pointer"
                    })
                  ]),
                  _: 1
                }, 8, ["to"])) : vueExports.createCommentVNode("", true)
              ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-slate-400"
              }, "—"))
            ];
          }
        }),
        "recipient-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.commission && row.original.commission.source !== "default") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: vueExports.unref(revenueRecipientColor)(row.original.commission.revenue_recipient.value),
                variant: "subtle",
                size: "sm",
                label: row.original.commission.revenue_recipient.label
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<span class="text-slate-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.commission && row.original.commission.source !== "default" ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                key: 0,
                color: vueExports.unref(revenueRecipientColor)(row.original.commission.revenue_recipient.value),
                variant: "subtle",
                size: "sm",
                label: row.original.commission.revenue_recipient.label
              }, null, 8, ["color", "label"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-slate-400"
              }, "—"))
            ];
          }
        }),
        "status-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: vueExports.unref(vendorOrderStatusColor)(row.original.status.value),
              variant: "subtle",
              label: row.original.status.label
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: vueExports.unref(vendorOrderStatusColor)(row.original.status.value),
                variant: "subtle",
                label: row.original.status.label
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        "rating-cell": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-slate-400"${_scopeId}>—</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-slate-400" }, "—")
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-order/ConsoleTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "VendorOrderConsoleTable" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=ConsoleTable-DdQwJKhJ.mjs.map
