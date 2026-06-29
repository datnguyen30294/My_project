import { _ as __nuxt_component_0, a as __nuxt_component_7 } from './DetailDrawer-DcxElfkZ.mjs';
import { _ as _sfc_main$1 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$3 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { t as tenantContractLocation } from './usePartnerCommissionContracts-DUXun7gY.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { d as useAllVendorOrderSummary, e as useAllVendorOrderList } from './useVendorOrders-DqEI_vYD.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useTenantPartnerList } from './usePartners-DhKs6EM6.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { d as useProjectList } from './useProjects-D4K3VYdb.mjs';
import './Drawer-D5sl7aXR.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './Badge-W93D3Jpz.mjs';
import './SectionCard-CH-mG9Mf.mjs';
import './FieldDisplay-BM6nmr2i.mjs';
import './CommissionBreakdown-BKSDhXYk.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
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
import './index-QmZAbLx-.mjs';
import './index-CSThDD3J.mjs';
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
import './Pagination-fZq_Msxb.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Đơn hàng vendor - Thần Nông" });
    function defaultRange() {
      const to = /* @__PURE__ */ new Date();
      const from = /* @__PURE__ */ new Date();
      from.setDate(from.getDate() - 30);
      return {
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10)
      };
    }
    const range = vueExports.reactive(defaultRange());
    const vendorFilter = vueExports.ref(void 0);
    const projectFilter = vueExports.ref(void 0);
    const searchValue = vueExports.ref("");
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((v) => {
      searchValue.value = v ?? "";
      page.value = 1;
    });
    const { data: vendorsData } = useTenantPartnerList(
      vueExports.computed(() => ({ provisioned: true, per_page: SELECT_ALL_PER_PAGE }))
    );
    const vendorOptions = vueExports.computed(() => [
      { label: "Tất cả vendor", value: void 0 },
      ...(vendorsData.value?.data ?? []).map((v) => ({ label: v.name, value: v.id }))
    ]);
    const { data: projectsData } = useProjectList(
      vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
    );
    const projectOptions = vueExports.computed(() => [
      { label: "Tất cả dự án", value: void 0 },
      ...(projectsData.value?.data ?? []).map((p) => ({ label: p.name, value: p.id }))
    ]);
    const { data: summaryData, status: summaryStatus, refresh: refreshSummary } = useAllVendorOrderSummary(
      vueExports.computed(() => ({
        from: range.from,
        to: range.to,
        partner_id: vendorFilter.value,
        project_id: projectFilter.value
      }))
    );
    const listParams = vueExports.computed(() => ({
      from: range.from,
      to: range.to,
      partner_id: vendorFilter.value,
      project_id: projectFilter.value,
      search: searchValue.value || void 0,
      page: page.value,
      per_page: 20
    }));
    const { data: listData, status: listStatus, error: listError, refresh: refreshList } = useAllVendorOrderList(listParams);
    const orders = vueExports.computed(() => listData.value?.data ?? []);
    vueExports.watch([() => range.from, () => range.to, vendorFilter, projectFilter], async () => {
      page.value = 1;
      await Promise.all([refreshList(), refreshSummary()]);
    });
    const drawerOpen = vueExports.ref(false);
    const selectedOrderId = vueExports.ref(null);
    const selectedPartnerId = vueExports.ref(null);
    function openDrawer(row) {
      selectedOrderId.value = row.id;
      selectedPartnerId.value = row.vendor?.id ?? null;
      drawerOpen.value = true;
    }
    const columns = [
      { accessorKey: "code", header: "Mã đơn" },
      { id: "vendor", header: "Vendor" },
      { id: "customer", header: "Khách hàng" },
      { id: "project", header: "Dự án" },
      { id: "products", header: "Sản phẩm" },
      { accessorKey: "total", header: "Tổng tiền" },
      { id: "commission", header: "Hoa hồng PMC" },
      { accessorKey: "completed_at", header: "Hoàn thành" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VendorOrderSummaryCard = __nuxt_component_0;
      const _component_USelect = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UAlert = _sfc_main$3;
      const _component_UTable = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_VendorOrderDetailDrawer = __nuxt_component_7;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6"><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Đơn hàng vendor </h1><p class="text-slate-500 text-sm mt-1"> Tổng hợp đơn hàng hoàn thành và hoa hồng PMC của tất cả vendor mà tenant đang quản lý. </p></div><div class="space-y-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderSummaryCard, {
        summary: vueExports.unref(summaryData)?.data ?? null,
        loading: vueExports.unref(summaryStatus) === "pending"
      }, null, _parent));
      _push(`<div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 flex-wrap shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(vendorFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(vendorFilter) ? vendorFilter.value = $event : null,
        items: vueExports.unref(vendorOptions),
        "value-key": "value",
        class: "min-w-[180px]"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(projectFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(projectFilter) ? projectFilter.value = $event : null,
        items: vueExports.unref(projectOptions),
        "value-key": "value",
        class: "min-w-[180px]"
      }, null, _parent));
      _push(`<div class="flex items-center gap-2"><span class="text-sm text-slate-600">Từ</span>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(range).from,
        "onUpdate:modelValue": ($event) => vueExports.unref(range).from = $event,
        type: "date"
      }, null, _parent));
      _push(`<span class="text-sm text-slate-600">đến</span>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(range).to,
        "onUpdate:modelValue": ($event) => vueExports.unref(range).to = $event,
        type: "date"
      }, null, _parent));
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm mã đơn...",
        class: "max-w-xs"
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(listError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không thể tải danh sách đơn hàng."
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(orders),
        columns,
        loading: vueExports.unref(listStatus) === "pending"
      }, {
        "code-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="font-mono font-semibold text-primary-700 hover:underline"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}</button>`);
          } else {
            return [
              vueExports.createVNode("button", {
                type: "button",
                class: "font-mono font-semibold text-primary-700 hover:underline",
                onClick: ($event) => openDrawer(row.original)
              }, vueExports.toDisplayString(row.original.code), 9, ["onClick"])
            ];
          }
        }),
        "vendor-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.vendor) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                to: `/pmc/vendors/${row.original.vendor.id}`,
                class: "text-sm font-medium text-slate-900 hover:text-primary-700 hover:underline"
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
              _push2(`<span class="text-sm text-slate-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.vendor ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                key: 0,
                to: `/pmc/vendors/${row.original.vendor.id}`,
                class: "text-sm font-medium text-slate-900 hover:text-primary-700 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.vendor.name), 1)
                ]),
                _: 2
              }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-sm text-slate-400"
              }, "—"))
            ];
          }
        }),
        "customer-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><p class="font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.customer?.name ?? "—")}</p>`);
            if (row.original.customer?.phone) {
              _push2(`<p class="text-xs text-slate-500 font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.customer.phone)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", null, [
                vueExports.createVNode("p", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.customer?.name ?? "—"), 1),
                row.original.customer?.phone ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "text-xs text-slate-500 font-mono"
                }, vueExports.toDisplayString(row.original.customer.phone), 1)) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "project-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.project_name), 1)
            ];
          }
        }),
        "products-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-sm"${_scopeId}><p class="line-clamp-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.first_item_name ?? "—")}</p>`);
            if (row.original.items_count > 1) {
              _push2(`<p class="text-xs text-slate-500"${_scopeId}> (+${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.items_count - 1)} sản phẩm khác) </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "text-sm" }, [
                vueExports.createVNode("p", { class: "line-clamp-1" }, vueExports.toDisplayString(row.original.first_item_name ?? "—"), 1),
                row.original.items_count > 1 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "text-xs text-slate-500"
                }, " (+" + vueExports.toDisplayString(row.original.items_count - 1) + " sản phẩm khác) ", 1)) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "total-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total))}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total)), 1)
            ];
          }
        }),
        "commission-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-0.5"${_scopeId}><span class="font-semibold text-primary-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission.amount))}</span>`);
            if (row.original.vendor) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                to: ("tenantContractLocation" in _ctx ? _ctx.tenantContractLocation : vueExports.unref(tenantContractLocation))(row.original.vendor.id, row.original.project_id, row.original.commission.contract_id),
                class: "font-mono text-xs text-slate-500 hover:text-primary-700 hover:underline",
                onClick: () => {
                }
              }, {
                default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.commission.contract_code)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.commission.contract_code), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<span class="font-mono text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.commission.contract_code)}</span>`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-0.5" }, [
                vueExports.createVNode("span", { class: "font-semibold text-primary-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission.amount)), 1),
                row.original.vendor ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                  key: 0,
                  to: ("tenantContractLocation" in _ctx ? _ctx.tenantContractLocation : vueExports.unref(tenantContractLocation))(row.original.vendor.id, row.original.project_id, row.original.commission.contract_id),
                  class: "font-mono text-xs text-slate-500 hover:text-primary-700 hover:underline",
                  onClick: vueExports.withModifiers(() => {
                  }, ["stop"])
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.commission.contract_code), 1)
                  ]),
                  _: 2
                }, 1032, ["to", "onClick"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 1,
                  class: "font-mono text-xs text-slate-500"
                }, vueExports.toDisplayString(row.original.commission.contract_code), 1))
              ])
            ];
          }
        }),
        "completed_at-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.completed_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.completed_at) : "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.completed_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.completed_at) : "—"), 1)
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
      _push(`</div>`);
      if (vueExports.unref(selectedPartnerId)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderDetailDrawer, {
          open: vueExports.unref(drawerOpen),
          "onUpdate:open": ($event) => vueExports.isRef(drawerOpen) ? drawerOpen.value = $event : null,
          "partner-id": vueExports.unref(selectedPartnerId),
          "order-id": vueExports.unref(selectedOrderId)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/vendor-orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D3qaxCDM.mjs.map
