import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, u as useSeoMeta, h as useAuth, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$2 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { d as formatShortDateTime } from './date-R5YK0ast.mjs';
import { u as useOgTicketList, m as OG_TICKET_STATUS_OPTIONS, O as OG_TICKET_PRIORITY_OPTIONS, a as ogTicketStatusColor, o as ogTicketPriorityColor, c as apiUpdateOgTicket, j as apiDeleteOgTicket, e as apiCheckDeleteOgTicket } from './useOgTickets-DPRh9tlL.mjs';
import { f as formatPhone } from './phone-DErPjpTB.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { u as useCheckDelete } from './useCheckDelete-ka2wDn0T.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './PageError-kZWsA9dh.mjs';
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
    useSeoMeta({ title: "OG Ticket - Thần Nông" });
    const params = vueExports.reactive({ per_page: DEFAULT_PER_PAGE });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const selectedStatus = vueExports.ref(void 0);
    const selectedPriority = vueExports.ref(void 0);
    const selectedWarranty = vueExports.ref(void 0);
    const { isInitFromUrl } = useUrlFilters({
      search: { ref: vueExports.toRef(params, "search"), type: "string", onInit: (v) => {
        searchInput.value = String(v);
      } },
      page: { ref: page, type: "number", defaultValue: 1 },
      status: { ref: selectedStatus, type: "string", onInit: (v) => {
        params.status = String(v);
      } },
      priority: { ref: selectedPriority, type: "string", onInit: (v) => {
        params.priority = String(v);
      } },
      warranty: { ref: selectedWarranty, type: "string", onInit: (v) => {
        params.has_warranty_request = String(v) === "1";
      } }
    });
    vueExports.watch(selectedStatus, (val) => {
      params.status = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedPriority, (val) => {
      params.priority = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedWarranty, (val) => {
      params.has_warranty_request = val === "1" ? true : val === "0" ? false : void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    const statusOptions = OG_TICKET_STATUS_OPTIONS;
    const priorityOptions = OG_TICKET_PRIORITY_OPTIONS;
    const warrantyOptions = [
      { label: "Có YC bảo hành", value: "1" },
      { label: "Không có", value: "0" }
    ];
    const hasFilters = vueExports.computed(() => !!searchInput.value || !!selectedStatus.value || !!selectedPriority.value || !!selectedWarranty.value);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      selectedStatus.value = void 0;
      selectedPriority.value = void 0;
      selectedWarranty.value = void 0;
      page.value = 1;
    }
    function toBadgeColor(color) {
      const allowed = ["error", "success", "warning", "info", "primary", "neutral", "secondary"];
      return allowed.includes(color ?? "") ? color : "neutral";
    }
    const { data, status, error, refresh } = useOgTicketList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const ogTickets = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { id: "receive", header: "Tiếp nhận" },
      { id: "ticket", header: "Ticket" },
      { id: "customer", header: "Khách hàng" },
      { id: "project", header: "Dự án" },
      { id: "status", header: "Trạng thái" },
      { id: "payment", header: "Thanh toán" },
      { id: "reconciliation", header: "Đối soát" },
      { id: "feedback", header: "Đánh giá" },
      stickyRight({ id: "actions", header: "" })
    ];
    const crud = useCrudModals();
    const { showDeleteModal, deleteTarget } = crud;
    const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteOgTicket,
      deleteFn: apiDeleteOgTicket,
      successMessage: "Đã huỷ OG Ticket"
    });
    const { user: authUser } = useAuth();
    const toast = useToast();
    const receivingId = vueExports.ref(null);
    async function handleReceive(ticket) {
      if (!authUser.value) return;
      receivingId.value = ticket.id;
      try {
        await apiUpdateOgTicket(ticket.id, {
          priority: ticket.priority.value,
          received_by_id: authUser.value.id
        });
        toast.add({ title: "Đã tiếp nhận", color: "success" });
        refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Tiếp nhận thất bại"), color: "error" });
      } finally {
        receivingId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$1;
      const _component_USelect = _sfc_main$2;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "OG Ticket",
        description: "Danh sách ticket đang được xử lý bởi tổ chức của bạn"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-inbox",
              label: "Ticket Pool",
              color: "neutral",
              variant: "ghost",
              to: "/pmc/og-tickets/pool"
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Tạo ticket",
              color: "primary",
              to: "/pmc/og-tickets/create"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-inbox",
                label: "Ticket Pool",
                color: "neutral",
                variant: "ghost",
                to: "/pmc/og-tickets/pool"
              }),
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Tạo ticket",
                color: "primary",
                to: "/pmc/og-tickets/create"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mb-4 flex flex-wrap items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo tiêu đề, tên, SĐT...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedStatus),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedStatus) ? selectedStatus.value = $event : null,
        items: vueExports.unref(statusOptions),
        placeholder: "Trạng thái",
        class: "w-44"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedPriority),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedPriority) ? selectedPriority.value = $event : null,
        items: vueExports.unref(priorityOptions),
        placeholder: "Ưu tiên",
        class: "w-36"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedWarranty),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedWarranty) ? selectedWarranty.value = $event : null,
        items: warrantyOptions,
        placeholder: "Bảo hành",
        class: "w-44"
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
              data: vueExports.unref(ogTickets),
              columns
            }, {
              "receive-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col gap-0.5 text-xs min-w-[150px]"${_scopeId2}>`);
                  if (row.original.received_by) {
                    _push3(`<!--[--><span class="font-medium text-gray-900 text-sm"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.received_by.name)}</span><span class="text-gray-500"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatShortDateTime" in _ctx ? _ctx.formatShortDateTime : vueExports.unref(formatShortDateTime))(row.original.received_at))}</span><!--]-->`);
                  } else if (row.original.status.value !== "cancelled") {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      label: "Tiếp nhận",
                      icon: "i-lucide-hand",
                      size: "xs",
                      color: "primary",
                      variant: "solid",
                      class: "self-start",
                      loading: vueExports.unref(receivingId) === row.original.id,
                      onClick: ($event) => handleReceive(row.original)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<span class="text-gray-400"${_scopeId2}>—</span>`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col gap-0.5 text-xs min-w-[150px]" }, [
                      row.original.received_by ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                        vueExports.createVNode("span", { class: "font-medium text-gray-900 text-sm" }, vueExports.toDisplayString(row.original.received_by.name), 1),
                        vueExports.createVNode("span", { class: "text-gray-500" }, vueExports.toDisplayString(("formatShortDateTime" in _ctx ? _ctx.formatShortDateTime : vueExports.unref(formatShortDateTime))(row.original.received_at)), 1)
                      ], 64)) : row.original.status.value !== "cancelled" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 1,
                        label: "Tiếp nhận",
                        icon: "i-lucide-hand",
                        size: "xs",
                        color: "primary",
                        variant: "solid",
                        class: "self-start",
                        loading: vueExports.unref(receivingId) === row.original.id,
                        onClick: ($event) => handleReceive(row.original)
                      }, null, 8, ["loading", "onClick"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 2,
                        class: "text-gray-400"
                      }, "—"))
                    ])
                  ];
                }
              }),
              "ticket-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col gap-1 min-w-[220px] max-w-[320px]"${_scopeId2}><div class="flex items-center gap-2"${_scopeId2}><span class="font-mono text-xs text-gray-500"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code ?? "—")}</span>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.priority.label,
                    color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(row.original.priority.value),
                    variant: "subtle",
                    size: "xs"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/og-tickets/${row.original.id}`,
                    class: "font-medium text-sm text-gray-900 line-clamp-2 hover:text-primary-600"
                  }, {
                    default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.subject)}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.subject), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col gap-1 min-w-[220px] max-w-[320px]" }, [
                      vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                        vueExports.createVNode("span", { class: "font-mono text-xs text-gray-500" }, vueExports.toDisplayString(row.original.code ?? "—"), 1),
                        vueExports.createVNode(_component_UBadge, {
                          label: row.original.priority.label,
                          color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(row.original.priority.value),
                          variant: "subtle",
                          size: "xs"
                        }, null, 8, ["label", "color"])
                      ]),
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/og-tickets/${row.original.id}`,
                        class: "font-medium text-sm text-gray-900 line-clamp-2 hover:text-primary-600"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.subject), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ])
                  ];
                }
              }),
              "customer-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col gap-0.5 min-w-[150px]"${_scopeId2}>`);
                  if (row.original.customer) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/customers/${row.original.customer.id}`,
                      class: "text-sm text-gray-900 truncate hover:text-primary-600 hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.customer.full_name)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.customer.full_name), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<span class="text-sm text-gray-900 truncate"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.requester_name)}</span>`);
                  }
                  if (row.original.customer?.phone ?? row.original.requester_phone) {
                    _push3(`<span class="text-xs text-gray-500 font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(row.original.customer?.phone ?? row.original.requester_phone))}</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col gap-0.5 min-w-[150px]" }, [
                      row.original.customer ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/customers/${row.original.customer.id}`,
                        class: "text-sm text-gray-900 truncate hover:text-primary-600 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.customer.full_name), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-sm text-gray-900 truncate"
                      }, vueExports.toDisplayString(row.original.requester_name), 1)),
                      row.original.customer?.phone ?? row.original.requester_phone ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 2,
                        class: "text-xs text-gray-500 font-mono"
                      }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(row.original.customer?.phone ?? row.original.requester_phone)), 1)) : vueExports.createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              "project-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-sm"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project?.name ?? "—")}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.project?.name ?? "—"), 1)
                  ];
                }
              }),
              "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.status.label,
                    color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(row.original.status.value),
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(row.original.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ];
                }
              }),
              "payment-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.payment_status) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: row.original.payment_status.label,
                      color: toBadgeColor(row.original.payment_status.color),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<span class="text-xs text-gray-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.payment_status ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.payment_status.label,
                      color: toBadgeColor(row.original.payment_status.color),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ];
                }
              }),
              "reconciliation-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.reconciliation_status) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: row.original.reconciliation_status.label,
                      color: toBadgeColor(row.original.reconciliation_status.color),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<span class="text-xs text-gray-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.reconciliation_status ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.reconciliation_status.label,
                      color: toBadgeColor(row.original.reconciliation_status.color),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ];
                }
              }),
              "feedback-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col items-start gap-1 min-w-[130px]"${_scopeId2}>`);
                  if (row.original.resident_rating != null) {
                    _push3(`<div class="flex items-center gap-1"${_scopeId2}><span class="text-amber-500 leading-none text-base tracking-tight"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(5, (n) => {
                      _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(n <= (row.original.resident_rating ?? 0) ? "★" : "☆")}</span>`);
                    });
                    _push3(`<!--]--></span></div>`);
                  } else {
                    _push3(`<span class="text-xs text-gray-400"${_scopeId2}>Chưa đánh giá</span>`);
                  }
                  if (row.original.warranty_request_count > 0) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: `YC bảo hành (${row.original.warranty_request_count})`,
                      color: "error",
                      variant: "solid",
                      size: "xs",
                      icon: "i-lucide-shield-alert"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col items-start gap-1 min-w-[130px]" }, [
                      row.original.resident_rating != null ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex items-center gap-1"
                      }, [
                        vueExports.createVNode("span", { class: "text-amber-500 leading-none text-base tracking-tight" }, [
                          (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(5, (n) => {
                            return vueExports.createVNode("span", { key: n }, vueExports.toDisplayString(n <= (row.original.resident_rating ?? 0) ? "★" : "☆"), 1);
                          }), 64))
                        ])
                      ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-xs text-gray-400"
                      }, "Chưa đánh giá")),
                      row.original.warranty_request_count > 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 2,
                        label: `YC bảo hành (${row.original.warranty_request_count})`,
                        color: "error",
                        variant: "solid",
                        size: "xs",
                        icon: "i-lucide-shield-alert"
                      }, null, 8, ["label"])) : vueExports.createCommentVNode("", true)
                    ])
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
                    to: `/pmc/og-tickets/${row.original.id}`
                  }, null, _parent3, _scopeId2));
                  if (row.original.status.value !== "cancelled") {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-pencil",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      title: "Chỉnh sửa",
                      to: `/pmc/og-tickets/${row.original.id}/edit`
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (row.original.status.value !== "cancelled") {
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
                        to: `/pmc/og-tickets/${row.original.id}`
                      }, null, 8, ["to"]),
                      row.original.status.value !== "cancelled" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        icon: "i-lucide-pencil",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Chỉnh sửa",
                        to: `/pmc/og-tickets/${row.original.id}/edit`
                      }, null, 8, ["to"])) : vueExports.createCommentVNode("", true),
                      row.original.status.value !== "cancelled" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
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
                  data: vueExports.unref(ogTickets),
                  columns
                }, {
                  "receive-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex flex-col gap-0.5 text-xs min-w-[150px]" }, [
                      row.original.received_by ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                        vueExports.createVNode("span", { class: "font-medium text-gray-900 text-sm" }, vueExports.toDisplayString(row.original.received_by.name), 1),
                        vueExports.createVNode("span", { class: "text-gray-500" }, vueExports.toDisplayString(("formatShortDateTime" in _ctx ? _ctx.formatShortDateTime : vueExports.unref(formatShortDateTime))(row.original.received_at)), 1)
                      ], 64)) : row.original.status.value !== "cancelled" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 1,
                        label: "Tiếp nhận",
                        icon: "i-lucide-hand",
                        size: "xs",
                        color: "primary",
                        variant: "solid",
                        class: "self-start",
                        loading: vueExports.unref(receivingId) === row.original.id,
                        onClick: ($event) => handleReceive(row.original)
                      }, null, 8, ["loading", "onClick"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 2,
                        class: "text-gray-400"
                      }, "—"))
                    ])
                  ]),
                  "ticket-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex flex-col gap-1 min-w-[220px] max-w-[320px]" }, [
                      vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                        vueExports.createVNode("span", { class: "font-mono text-xs text-gray-500" }, vueExports.toDisplayString(row.original.code ?? "—"), 1),
                        vueExports.createVNode(_component_UBadge, {
                          label: row.original.priority.label,
                          color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(row.original.priority.value),
                          variant: "subtle",
                          size: "xs"
                        }, null, 8, ["label", "color"])
                      ]),
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/og-tickets/${row.original.id}`,
                        class: "font-medium text-sm text-gray-900 line-clamp-2 hover:text-primary-600"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.subject), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ])
                  ]),
                  "customer-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex flex-col gap-0.5 min-w-[150px]" }, [
                      row.original.customer ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/customers/${row.original.customer.id}`,
                        class: "text-sm text-gray-900 truncate hover:text-primary-600 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.customer.full_name), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-sm text-gray-900 truncate"
                      }, vueExports.toDisplayString(row.original.requester_name), 1)),
                      row.original.customer?.phone ?? row.original.requester_phone ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 2,
                        class: "text-xs text-gray-500 font-mono"
                      }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(row.original.customer?.phone ?? row.original.requester_phone)), 1)) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  "project-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.project?.name ?? "—"), 1)
                  ]),
                  "status-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(row.original.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ]),
                  "payment-cell": vueExports.withCtx(({ row }) => [
                    row.original.payment_status ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.payment_status.label,
                      color: toBadgeColor(row.original.payment_status.color),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ]),
                  "reconciliation-cell": vueExports.withCtx(({ row }) => [
                    row.original.reconciliation_status ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.reconciliation_status.label,
                      color: toBadgeColor(row.original.reconciliation_status.color),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ]),
                  "feedback-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex flex-col items-start gap-1 min-w-[130px]" }, [
                      row.original.resident_rating != null ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex items-center gap-1"
                      }, [
                        vueExports.createVNode("span", { class: "text-amber-500 leading-none text-base tracking-tight" }, [
                          (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(5, (n) => {
                            return vueExports.createVNode("span", { key: n }, vueExports.toDisplayString(n <= (row.original.resident_rating ?? 0) ? "★" : "☆"), 1);
                          }), 64))
                        ])
                      ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-xs text-gray-400"
                      }, "Chưa đánh giá")),
                      row.original.warranty_request_count > 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 2,
                        label: `YC bảo hành (${row.original.warranty_request_count})`,
                        color: "error",
                        variant: "solid",
                        size: "xs",
                        icon: "i-lucide-shield-alert"
                      }, null, 8, ["label"])) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex items-center justify-end gap-1" }, [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-eye",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Xem chi tiết",
                        to: `/pmc/og-tickets/${row.original.id}`
                      }, null, 8, ["to"]),
                      row.original.status.value !== "cancelled" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
                        icon: "i-lucide-pencil",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        title: "Chỉnh sửa",
                        to: `/pmc/og-tickets/${row.original.id}/edit`
                      }, null, 8, ["to"])) : vueExports.createCommentVNode("", true),
                      row.original.status.value !== "cancelled" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
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
        title: "Huỷ OG Ticket",
        "item-name": vueExports.unref(deleteTarget)?.subject,
        description: "OG Ticket sẽ bị huỷ. Ticket gốc sẽ được trả về pool. Báo giá và đơn hàng liên quan sẽ bị huỷ.",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/og-tickets/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CH8jwdT2.mjs.map
