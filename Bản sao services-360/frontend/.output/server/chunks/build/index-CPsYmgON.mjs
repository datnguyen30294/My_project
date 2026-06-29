import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, q as navigateTo, j as useToast } from './server.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$3 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$5 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as _sfc_main$6 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$7 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$8 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$9 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$a } from './Textarea-DTCNHwKm.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { u as useOrderList, O as ORDER_STATUS_OPTIONS, o as orderStatusColor, a as useAvailableQuotes, b as apiCreateOrder, c as apiDeleteOrder, d as apiCheckDeleteOrder } from './useOrders-Da-CMLMo.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { u as useCheckDelete } from './useCheckDelete-ka2wDn0T.mjs';
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
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Label-BBgw4vHh.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "OrderCreateModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  emits: ["update:open", "created"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const modelOpen = vueExports.computed({
      get: () => props.open,
      set: (v) => emit("update:open", v)
    });
    const toast = useToast();
    const { data: quotesData, status: quotesStatus } = useAvailableQuotes();
    const availableQuotes = vueExports.computed(() => quotesData.value?.data ?? []);
    const quoteOptions = vueExports.computed(
      () => availableQuotes.value.map((q) => ({
        label: `${q.code} — ${q.og_ticket?.subject ?? "—"} — ${formatCurrency(q.total_amount)} (${q.lines_count} dòng)`,
        value: q.id
      }))
    );
    const selectedQuoteId = vueExports.ref(void 0);
    const note = vueExports.ref("");
    const isSubmitting = vueExports.ref(false);
    const selectedQuote = vueExports.computed(
      () => availableQuotes.value.find((q) => q.id === selectedQuoteId.value)
    );
    function resetForm() {
      selectedQuoteId.value = void 0;
      note.value = "";
    }
    async function handleSubmit() {
      if (!selectedQuoteId.value) return;
      isSubmitting.value = true;
      try {
        const res = await apiCreateOrder({
          quote_id: selectedQuoteId.value,
          note: note.value || null
        });
        toast.add({ title: "Tạo đơn hàng thành công", color: "success" });
        emit("update:open", false);
        emit("created", res.data.id);
        resetForm();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Tạo đơn hàng thất bại"), color: "error" });
      } finally {
        isSubmitting.value = false;
      }
    }
    function handleClose() {
      emit("update:open", false);
      resetForm();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$6;
      const _component_USkeleton = _sfc_main$7;
      const _component_UAlert = _sfc_main$8;
      const _component_UFormField = _sfc_main$9;
      const _component_USelect = _sfc_main$3;
      const _component_UTextarea = _sfc_main$a;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: vueExports.unref(modelOpen),
        "onUpdate:open": ($event) => vueExports.isRef(modelOpen) ? modelOpen.value = $event : null,
        title: "Tạo đơn hàng từ báo giá"
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}>`);
            if (vueExports.unref(quotesStatus) === "pending") {
              _push2(`<div class="flex flex-col gap-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-10 w-full" }, null, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-10 w-full" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (vueExports.unref(availableQuotes).length === 0) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "info",
                variant: "subtle",
                icon: "i-lucide-info",
                title: "Không có báo giá đã chấp thuận nào khả dụng. Vui lòng tạo và duyệt báo giá trước."
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!--[-->`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Báo giá",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                      modelValue: vueExports.unref(selectedQuoteId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedQuoteId) ? selectedQuoteId.value = $event : null,
                      items: vueExports.unref(quoteOptions),
                      placeholder: "Chọn báo giá...",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USelect, {
                        modelValue: vueExports.unref(selectedQuoteId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedQuoteId) ? selectedQuoteId.value = $event : null,
                        items: vueExports.unref(quoteOptions),
                        placeholder: "Chọn báo giá...",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(selectedQuote)) {
                _push2(`<div class="rounded-lg bg-slate-50 border border-slate-200 p-3 flex flex-col gap-1.5"${_scopeId}><div class="flex items-center justify-between text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Ticket</span><span class="font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(selectedQuote).og_ticket?.subject ?? "—")}</span></div><div class="flex items-center justify-between text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Tổng tiền</span><span class="font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(selectedQuote).total_amount))}</span></div><div class="flex items-center justify-between text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Số dòng</span><span class="font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(selectedQuote).lines_count)}</span></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                      modelValue: vueExports.unref(note),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(note) ? note.value = $event : null,
                      placeholder: "Ghi chú (tuỳ chọn)...",
                      rows: 3,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(note),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(note) ? note.value = $event : null,
                        placeholder: "Ghi chú (tuỳ chọn)...",
                        rows: 3,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                vueExports.unref(quotesStatus) === "pending" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "flex flex-col gap-3"
                }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-10 w-full" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-10 w-full" })
                ])) : vueExports.unref(availableQuotes).length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 1,
                  color: "info",
                  variant: "subtle",
                  icon: "i-lucide-info",
                  title: "Không có báo giá đã chấp thuận nào khả dụng. Vui lòng tạo và duyệt báo giá trước."
                })) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Báo giá",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_USelect, {
                        modelValue: vueExports.unref(selectedQuoteId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedQuoteId) ? selectedQuoteId.value = $event : null,
                        items: vueExports.unref(quoteOptions),
                        placeholder: "Chọn báo giá...",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  }),
                  vueExports.unref(selectedQuote) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "rounded-lg bg-slate-50 border border-slate-200 p-3 flex flex-col gap-1.5"
                  }, [
                    vueExports.createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Ticket"),
                      vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(vueExports.unref(selectedQuote).og_ticket?.subject ?? "—"), 1)
                    ]),
                    vueExports.createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Tổng tiền"),
                      vueExports.createVNode("span", { class: "font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(selectedQuote).total_amount)), 1)
                    ]),
                    vueExports.createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Số dòng"),
                      vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(vueExports.unref(selectedQuote).lines_count), 1)
                    ])
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode(_component_UFormField, { label: "Ghi chú" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(note),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(note) ? note.value = $event : null,
                        placeholder: "Ghi chú (tuỳ chọn)...",
                        rows: 3,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ], 64))
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Hủy",
              color: "neutral",
              variant: "ghost",
              onClick: handleClose
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Tạo đơn hàng",
              color: "primary",
              icon: "i-lucide-plus",
              disabled: !vueExports.unref(selectedQuoteId) || vueExports.unref(availableQuotes).length === 0,
              loading: vueExports.unref(isSubmitting),
              onClick: handleSubmit
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: handleClose
                }),
                vueExports.createVNode(_component_UButton, {
                  label: "Tạo đơn hàng",
                  color: "primary",
                  icon: "i-lucide-plus",
                  disabled: !vueExports.unref(selectedQuoteId) || vueExports.unref(availableQuotes).length === 0,
                  loading: vueExports.unref(isSubmitting),
                  onClick: handleSubmit
                }, null, 8, ["disabled", "loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/order/OrderCreateModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "OrderCreateModal" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Đơn hàng - Thần Nông" });
    const params = vueExports.reactive({
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const selectedStatus = vueExports.ref(void 0);
    const { isInitFromUrl } = useUrlFilters({
      search: { ref: vueExports.toRef(params, "search"), type: "string", onInit: (v) => {
        searchInput.value = String(v);
      } },
      page: { ref: page, type: "number", defaultValue: 1 },
      status: { ref: selectedStatus, type: "string", onInit: (v) => {
        params.status = String(v);
      } }
    });
    vueExports.watch(selectedStatus, (val) => {
      params.status = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value || !!selectedStatus.value);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      selectedStatus.value = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = useOrderList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const orders = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { accessorKey: "code", header: "Mã đơn" },
      { id: "quote", header: "Báo giá" },
      { id: "og_ticket", header: "Ticket" },
      { id: "status", header: "Trạng thái" },
      { id: "total_amount", header: "Tổng tiền" },
      { accessorKey: "lines_count", header: "Số dòng" },
      { id: "created_at", header: "Tạo lúc" },
      stickyRight({ id: "actions", header: "Thao tác" })
    ];
    const showCreateModal = vueExports.ref(false);
    function handleCreated(newId) {
      navigateTo(`/pmc/orders/${newId}`);
    }
    const crud = useCrudModals();
    const { showDeleteModal, deleteTarget } = crud;
    const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteOrder,
      deleteFn: apiDeleteOrder,
      successMessage: "Đã xoá đơn hàng"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$2;
      const _component_USelect = _sfc_main$3;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$5;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_OrderCreateModal = __nuxt_component_9;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Đơn hàng",
        description: "Quản lý danh sách đơn hàng"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Tạo đơn hàng",
              onClick: ($event) => showCreateModal.value = true
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Tạo đơn hàng",
                onClick: ($event) => showCreateModal.value = true
              }, null, 8, ["onClick"])
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
        placeholder: "Tìm theo mã, tên ticket...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedStatus),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedStatus) ? selectedStatus.value = $event : null,
        items: "ORDER_STATUS_OPTIONS" in _ctx ? _ctx.ORDER_STATUS_OPTIONS : vueExports.unref(ORDER_STATUS_OPTIONS),
        placeholder: "Trạng thái",
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
              data: vueExports.unref(orders),
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
              "quote-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.quote) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/quotes/${row.original.quote.id}`,
                      class: "text-primary hover:underline font-mono text-xs"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.quote.code)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.quote.code), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.quote ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/quotes/${row.original.quote.id}`,
                      class: "text-primary hover:underline font-mono text-xs"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.quote.code), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
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
                    color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(row.original.status.value),
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(row.original.status.value),
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
                    to: `/pmc/orders/${row.original.id}`
                  }, null, _parent3, _scopeId2));
                  if (row.original.status.value === "draft") {
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
                        to: `/pmc/orders/${row.original.id}`
                      }, null, 8, ["to"]),
                      row.original.status.value === "draft" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
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
                  data: vueExports.unref(orders),
                  columns
                }, {
                  "code-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-mono text-xs font-semibold" }, vueExports.toDisplayString(row.original.code), 1)
                  ]),
                  "quote-cell": vueExports.withCtx(({ row }) => [
                    row.original.quote ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/quotes/${row.original.quote.id}`,
                      class: "text-primary hover:underline font-mono text-xs"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.quote.code), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
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
                      color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(row.original.status.value),
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
                        to: `/pmc/orders/${row.original.id}`
                      }, null, 8, ["to"]),
                      row.original.status.value === "draft" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 0,
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_OrderCreateModal, {
        open: vueExports.unref(showCreateModal),
        "onUpdate:open": ($event) => vueExports.isRef(showCreateModal) ? showCreateModal.value = $event : null,
        onCreated: handleCreated
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá đơn hàng",
        "item-name": vueExports.unref(deleteTarget)?.code,
        description: "Đơn hàng sẽ bị xoá vĩnh viễn.",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CPsYmgON.mjs.map
