import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$2 } from './Select-CZE7Ef6n.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { u as useQuoteList, Q as QUOTE_STATUS_OPTIONS, a as QUOTE_ACTIVE_OPTIONS, q as quoteStatusColor, b as apiDeleteQuote, c as apiCheckDeleteQuote } from './useQuotes-C1-4FXSr.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { u as useCheckDelete } from './useCheckDelete-ka2wDn0T.mjs';
import './index-QmZAbLx-.mjs';
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
import './PageError-kZWsA9dh.mjs';
import './apiError-DBrxF9au.mjs';
import './index-CSThDD3J.mjs';
import './Pagination-fZq_Msxb.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Alert-tTsPKADX.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Báo giá - Thần Nông" });
    const params = vueExports.reactive({
      is_active: "true",
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const selectedStatus = vueExports.ref(void 0);
    const selectedActive = vueExports.ref("true");
    const { isInitFromUrl } = useUrlFilters({
      search: { ref: vueExports.toRef(params, "search"), type: "string", onInit: (v) => {
        searchInput.value = String(v);
      } },
      page: { ref: page, type: "number", defaultValue: 1 },
      status: { ref: selectedStatus, type: "string" },
      is_active: { ref: selectedActive, type: "string" }
    }, params);
    vueExports.watch(selectedStatus, (val) => {
      params.status = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedActive, (val) => {
      params.is_active = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value || !!selectedStatus.value || !!selectedActive.value && selectedActive.value !== "true");
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      selectedStatus.value = void 0;
      selectedActive.value = "true";
      page.value = 1;
    }
    const { data, status, error, refresh } = useQuoteList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const quotes = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { accessorKey: "code", header: "Mã" },
      { id: "og_ticket", header: "Ticket" },
      { id: "status", header: "Trạng thái" },
      { id: "is_active", header: "Active" },
      { id: "total_amount", header: "Tổng tiền" },
      { accessorKey: "lines_count", header: "Số dòng" },
      { id: "created_at", header: "Tạo lúc" },
      stickyRight({ id: "actions", header: "" })
    ];
    const crud = useCrudModals();
    const { showDeleteModal, deleteTarget } = crud;
    const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteQuote,
      deleteFn: apiDeleteQuote,
      successMessage: "Đã xoá báo giá"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UInput = _sfc_main$1;
      const _component_USelect = _sfc_main$2;
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$4;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Báo giá",
        description: "Danh sách báo giá cho các ticket nội bộ",
        "create-to": "/pmc/quotes/create",
        "create-label": "Tạo báo giá"
      }, null, _parent));
      _push(`<div class="mb-4 flex flex-wrap items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo mã, tên ticket...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedStatus),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedStatus) ? selectedStatus.value = $event : null,
        items: "QUOTE_STATUS_OPTIONS" in _ctx ? _ctx.QUOTE_STATUS_OPTIONS : vueExports.unref(QUOTE_STATUS_OPTIONS),
        placeholder: "Trạng thái",
        class: "w-44"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedActive),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedActive) ? selectedActive.value = $event : null,
        items: "QUOTE_ACTIVE_OPTIONS" in _ctx ? _ctx.QUOTE_ACTIVE_OPTIONS : vueExports.unref(QUOTE_ACTIVE_OPTIONS),
        placeholder: "Hiệu lực",
        class: "w-36"
      }, null, _parent));
      if (vueExports.unref(hasFilters)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-x",
          label: "Xóa bộ lọc",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          onClick: clearFilters
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
        status: vueExports.unref(status),
        error: vueExports.unref(error),
        data: vueExports.unref(data),
        refresh: vueExports.unref(refresh)
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(quotes),
              columns
            }, {
              "code-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-mono text-xs font-semibold"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-mono text-xs font-semibold" }, vueExports.toDisplayString(row.original.code), 1)
                  ];
                }
              }),
              "og_ticket-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.og_ticket) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/og-tickets/${row.original.og_ticket.id}`,
                      class: "text-primary hover:underline text-sm"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.og_ticket.subject)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.og_ticket.subject), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    row.original.og_ticket ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/og-tickets/${row.original.og_ticket.id}`,
                      class: "text-primary hover:underline text-sm"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.og_ticket.subject), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : vueExports.createCommentVNode("", true)
                  ];
                }
              }),
              "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.status.label,
                    color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(row.original.status.value),
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(row.original.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ];
                }
              }),
              "is_active-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.is_active ? "Active" : "Inactive",
                    color: row.original.is_active ? "success" : "neutral",
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.is_active ? "Active" : "Inactive",
                      color: row.original.is_active ? "success" : "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ];
                }
              }),
              "total_amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount))}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount)), 1)
                  ];
                }
              }),
              "created_at-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.created_at))}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.created_at)), 1)
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center justify-end gap-1"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-eye",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    title: "Xem chi tiết",
                    to: `/pmc/quotes/${row.original.id}`
                  }, null, _parent3, _scopeId2));
                  if (row.original.is_active && row.original.status.value !== "approved") {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-pencil",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      title: "Chỉnh sửa",
                      to: `/pmc/quotes/${row.original.id}/edit`
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (row.original.is_active) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-trash-2",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      class: "hover:!text-red-500 hover:!bg-red-50",
                      title: "Xoá",
                      onClick: ($event) => vueExports.unref(openDeleteModal)(row.original)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex items-center justify-end gap-1" }, [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-eye",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Xem chi tiết",
                        to: `/pmc/quotes/${row.original.id}`
                      }, null, 8, ["to"]),
                      row.original.is_active && row.original.status.value !== "approved" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        icon: "i-lucide-pencil",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Chỉnh sửa",
                        to: `/pmc/quotes/${row.original.id}/edit`
                      }, null, 8, ["to"])) : vueExports.createCommentVNode("", true),
                      row.original.is_active ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 1,
                        icon: "i-lucide-trash-2",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        class: "hover:!text-red-500 hover:!bg-red-50",
                        title: "Xoá",
                        onClick: ($event) => vueExports.unref(openDeleteModal)(row.original)
                      }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
              page: vueExports.unref(page),
              "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
              meta: vueExports.unref(data)?.meta
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm" }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(quotes),
                  columns
                }, {
                  "code-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-mono text-xs font-semibold" }, vueExports.toDisplayString(row.original.code), 1)
                  ]),
                  "og_ticket-cell": vueExports.withCtx(({ row }) => [
                    row.original.og_ticket ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/og-tickets/${row.original.og_ticket.id}`,
                      class: "text-primary hover:underline text-sm"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.og_ticket.subject), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : vueExports.createCommentVNode("", true)
                  ]),
                  "status-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(row.original.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ]),
                  "is_active-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.is_active ? "Active" : "Inactive",
                      color: row.original.is_active ? "success" : "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ]),
                  "total_amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.total_amount)), 1)
                  ]),
                  "created_at-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.created_at)), 1)
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex items-center justify-end gap-1" }, [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-eye",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Xem chi tiết",
                        to: `/pmc/quotes/${row.original.id}`
                      }, null, 8, ["to"]),
                      row.original.is_active && row.original.status.value !== "approved" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        icon: "i-lucide-pencil",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Chỉnh sửa",
                        to: `/pmc/quotes/${row.original.id}/edit`
                      }, null, 8, ["to"])) : vueExports.createCommentVNode("", true),
                      row.original.is_active ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 1,
                        icon: "i-lucide-trash-2",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        class: "hover:!text-red-500 hover:!bg-red-50",
                        title: "Xoá",
                        onClick: ($event) => vueExports.unref(openDeleteModal)(row.original)
                      }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  _: 1
                }, 8, ["data"]),
                vueExports.createVNode(_component_SharedCrudTablePagination, {
                  page: vueExports.unref(page),
                  "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
                  meta: vueExports.unref(data)?.meta
                }, null, 8, ["page", "onUpdate:page", "meta"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá báo giá",
        "item-name": vueExports.unref(deleteTarget)?.code,
        description: "Báo giá sẽ bị ngưng hiệu lực.",
        checking: vueExports.unref(isCheckingDelete),
        "blocked-message": vueExports.unref(deleteBlockedMessage),
        loading: vueExports.unref(isDeleting),
        onConfirm: vueExports.unref(handleDelete)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/quotes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C0gBmXXL.mjs.map
