import { v as vueExports, p as useRoute$1, u as useSeoMeta, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, k as _sfc_main$h, q as navigateTo } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$3 } from './Stepper-Bzh3Mxt9.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { _ as _sfc_main$5 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$6 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$7 } from './Textarea-DTCNHwKm.mjs';
import { l as useQuoteDetail, i as useQuoteVersions, p as useQuoteAudits, k as isQuoteRejected, r as QUOTE_WORKFLOW_STEPS, q as quoteStatusColor, b as apiDeleteQuote, c as apiCheckDeleteQuote } from './useQuotes-C1-4FXSr.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { o as orderStatusColor, b as apiCreateOrder } from './useOrders-Da-CMLMo.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { A as AUDIT_EVENT_COLORS, a as AUDIT_EVENT_LABELS, g as getAuditChangedFields } from './audit-BekS3Wny.mjs';
import { u as useQuoteTransition } from './useQuoteTransition-C55tMBSm.mjs';
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
import './useDirection-CXYby7CP.mjs';
import './FocusScope-BZehoQSg.mjs';
import './Separator-DtmsHEyk.mjs';
import './useArrowNavigation-m9a1sGcE.mjs';
import './useKbd-JjFOu4f7.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Label-BBgw4vHh.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useQuoteDetail(id);
    const quote = vueExports.computed(() => data.value?.data);
    const ogTicketId = vueExports.computed(() => quote.value?.og_ticket?.id ?? null);
    const { data: versionsData } = useQuoteVersions(ogTicketId);
    const versions = vueExports.computed(() => versionsData.value?.data ?? []);
    const { data: auditsData } = useQuoteAudits(id);
    const audits = vueExports.computed(() => auditsData.value?.data ?? []);
    const QUOTE_AUDIT_FIELD_LABELS = {
      status: "Trạng thái",
      is_active: "Active",
      total_amount: "Tổng tiền",
      note: "Ghi chú",
      manager_approved_at: "QL duyệt lúc",
      manager_approved_by_id: "QL duyệt bởi",
      resident_approved_at: "Cư dân chấp thuận lúc",
      og_ticket_id: "OG Ticket",
      code: "Mã"
    };
    const QUOTE_AUDIT_DATETIME_FIELDS = /* @__PURE__ */ new Set(["manager_approved_at", "resident_approved_at"]);
    function getChangedFields(audit) {
      return getAuditChangedFields(audit, QUOTE_AUDIT_FIELD_LABELS, QUOTE_AUDIT_DATETIME_FIELDS);
    }
    useSeoMeta({
      title: vueExports.computed(
        () => quote.value ? `${quote.value.code} - Báo giá` : "Chi tiết báo giá"
      )
    });
    vueExports.computed(() => quote.value?.status.value === "draft");
    const isActive = vueExports.computed(() => quote.value?.is_active === true);
    const canEdit = vueExports.computed(() => isActive.value && quote.value?.status.value !== "approved");
    const isRejected = vueExports.computed(() => {
      const s = quote.value?.status.value;
      return s ? isQuoteRejected(s) : false;
    });
    const rejectedStepValue = vueExports.computed(() => {
      if (!isRejected.value) return null;
      return quote.value?.status.value === "resident_rejected" ? "approved" : "manager_approved";
    });
    const workflowSteps = vueExports.computed(
      () => QUOTE_WORKFLOW_STEPS.map((step) => ({
        title: step.title,
        description: step.description,
        icon: step.value === rejectedStepValue.value ? "i-lucide-x-circle" : step.icon,
        value: step.value
      }))
    );
    const currentStepValue = vueExports.computed(() => {
      if (!quote.value) return "draft";
      if (isRejected.value) return rejectedStepValue.value ?? "draft";
      return quote.value.status.value;
    });
    const lineColumns = [
      { accessorKey: "name", header: "Hạng mục" },
      { id: "line_type", header: "Loại" },
      { accessorKey: "quantity", header: "SL" },
      { accessorKey: "unit", header: "ĐVT" },
      { id: "unit_price", header: "Đơn giá" },
      { id: "line_amount", header: "Thành tiền" }
    ];
    const {
      isTransitioning,
      showRejectModal,
      rejectNote,
      handleTransition,
      openRejectModal,
      confirmReject
    } = useQuoteTransition(id, { onSuccess: () => refresh() });
    const crud = useCrudModals();
    const { showDeleteModal, deleteTarget } = crud;
    const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteQuote,
      deleteFn: apiDeleteQuote,
      successMessage: "Đã xoá báo giá",
      navigateAfter: "/pmc/quotes"
    });
    const toast = useToast();
    const canCreateOrder = vueExports.computed(
      () => isActive.value && quote.value?.status.value === "approved" && !quote.value?.order
    );
    const showCreateOrderModal = vueExports.ref(false);
    const orderNote = vueExports.ref("");
    const isCreatingOrder = vueExports.ref(false);
    async function handleCreateOrder() {
      if (!quote.value) return;
      isCreatingOrder.value = true;
      try {
        const order = await apiCreateOrder({ quote_id: quote.value.id, note: orderNote.value || void 0 });
        showCreateOrderModal.value = false;
        orderNote.value = "";
        toast.add({ title: "Đã tạo đơn hàng", color: "success" });
        navigateTo(`/pmc/orders/${order.data.id}`);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Tạo đơn hàng thất bại"), color: "error" });
      } finally {
        isCreatingOrder.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$1;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UAlert = _sfc_main$2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UStepper = _sfc_main$3;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UTable = _sfc_main$4;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      const _component_UModal = _sfc_main$5;
      const _component_UFormField = _sfc_main$6;
      const _component_UTextarea = _sfc_main$7;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "pb-20 lg:pb-0" }, _attrs))}><div class="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4"><div class="flex items-center gap-3 sm:gap-4 min-w-0">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/quotes",
        class: "shrink-0"
      }, null, _parent));
      _push(`<div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight"> Chi tiết báo giá </h1>`);
      if (vueExports.unref(quote)) {
        _push(`<!--[-->`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          label: vueExports.unref(quote).status.label,
          color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(vueExports.unref(quote).status.value),
          variant: "subtle",
          size: "sm"
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          label: vueExports.unref(quote).is_active ? "Active" : "Inactive",
          color: vueExports.unref(quote).is_active ? "success" : "neutral",
          variant: "subtle",
          size: "sm"
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-slate-500 text-sm mt-0.5">`);
      if (vueExports.unref(quote)) {
        _push(`<span class="font-mono font-semibold">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote).code)}</span>`);
      } else {
        _push(`<span>...</span>`);
      }
      _push(`</p></div></div>`);
      if (vueExports.unref(quote)) {
        _push(`<div class="hidden sm:flex items-center gap-2 shrink-0">`);
        if (vueExports.unref(canEdit)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Chỉnh sửa",
            icon: "i-lucide-pencil",
            color: "primary",
            variant: "soft",
            size: "sm",
            to: `/pmc/quotes/${vueExports.unref(id)}/edit`
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(isActive)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-trash-2",
            label: "Xoá",
            color: "error",
            variant: "outline",
            size: "sm",
            onClick: ($event) => vueExports.unref(openDeleteModal)(vueExports.unref(quote))
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="flex flex-col gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(4, (i) => {
          _push(`<div class="h-24 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(quote)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"><div class="lg:col-span-2 flex flex-col gap-4 sm:gap-6">`);
        if (!vueExports.unref(isActive)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            icon: "i-lucide-alert-triangle",
            color: "warning",
            variant: "subtle",
            title: "Báo giá này đã bị thay thế bởi báo giá mới."
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(isRejected) && vueExports.unref(quote).note) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            icon: "i-lucide-x-circle",
            color: "error",
            variant: "subtle",
            title: "Lý do từ chối",
            description: vueExports.unref(quote).note
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Giai đoạn báo giá" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="overflow-x-auto -mx-1 px-1"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UStepper, {
                items: vueExports.unref(workflowSteps),
                "model-value": vueExports.unref(currentStepValue),
                disabled: "",
                linear: false,
                size: "sm",
                color: vueExports.unref(isRejected) ? "error" : "primary",
                ui: vueExports.unref(isRejected) ? {
                  trigger: "group-data-[state=completed]:bg-primary group-data-[state=completed]:text-inverted",
                  separator: "group-data-[state=completed]:bg-primary"
                } : void 0,
                class: "w-full min-w-[400px]"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "overflow-x-auto -mx-1 px-1" }, [
                  vueExports.createVNode(_component_UStepper, {
                    items: vueExports.unref(workflowSteps),
                    "model-value": vueExports.unref(currentStepValue),
                    disabled: "",
                    linear: false,
                    size: "sm",
                    color: vueExports.unref(isRejected) ? "error" : "primary",
                    ui: vueExports.unref(isRejected) ? {
                      trigger: "group-data-[state=completed]:bg-primary group-data-[state=completed]:text-inverted",
                      separator: "group-data-[state=completed]:bg-primary"
                    } : void 0,
                    class: "w-full min-w-[400px]"
                  }, null, 8, ["items", "model-value", "color", "ui"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin nguồn" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"${_scopeId}>`);
              if (vueExports.unref(quote).og_ticket) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ticket" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/og-tickets/${vueExports.unref(quote).og_ticket.id}`,
                        class: "text-primary hover:underline font-medium"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote).og_ticket.subject)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).og_ticket.subject), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/og-tickets/${vueExports.unref(quote).og_ticket.id}`,
                          class: "text-primary hover:underline font-medium"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).og_ticket.subject), 1)
                          ]),
                          _: 1
                        }, 8, ["to"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(quote).og_ticket) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Khách hàng" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (vueExports.unref(quote).og_ticket.customer) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                          to: `/pmc/customers/${vueExports.unref(quote).og_ticket.customer.id}`,
                          class: "font-medium text-primary-600 hover:underline"
                        }, {
                          default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote).og_ticket.customer.full_name)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).og_ticket.customer.full_name), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent3, _scopeId2));
                      } else {
                        _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote).og_ticket.requester_name)}</span>`);
                      }
                    } else {
                      return [
                        vueExports.unref(quote).og_ticket.customer ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/customers/${vueExports.unref(quote).og_ticket.customer.id}`,
                          class: "font-medium text-primary-600 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).og_ticket.customer.full_name), 1)
                          ]),
                          _: 1
                        }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(quote).og_ticket.requester_name), 1))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).created_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).created_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).updated_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).updated_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(quote).manager_approved_at) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "QL duyệt lúc" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).manager_approved_at))} `);
                      if (vueExports.unref(quote).manager_approved_by) {
                        _push3(`<span class="text-slate-500"${_scopeId2}> — ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote).manager_approved_by.name)}</span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).manager_approved_at)) + " ", 1),
                        vueExports.unref(quote).manager_approved_by ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "text-slate-500"
                        }, " — " + vueExports.toDisplayString(vueExports.unref(quote).manager_approved_by.name), 1)) : vueExports.createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(quote).resident_approved_at) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cư dân chấp thuận lúc" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex flex-wrap items-center gap-2"${_scopeId2}><span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).resident_approved_at))}</span>`);
                      if (vueExports.unref(quote).resident_approved_via) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: vueExports.unref(quote).resident_approved_via.label,
                          color: vueExports.unref(quote).resident_approved_via.value === "resident_self" ? "success" : "warning",
                          variant: "subtle",
                          size: "xs"
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                      if (vueExports.unref(quote).resident_approved_by) {
                        _push3(`<span class="text-slate-500"${_scopeId2}> — ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote).resident_approved_by.name)}</span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div>`);
                    } else {
                      return [
                        vueExports.createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                          vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).resident_approved_at)), 1),
                          vueExports.unref(quote).resident_approved_via ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                            key: 0,
                            label: vueExports.unref(quote).resident_approved_via.label,
                            color: vueExports.unref(quote).resident_approved_via.value === "resident_self" ? "success" : "warning",
                            variant: "subtle",
                            size: "xs"
                          }, null, 8, ["label", "color"])) : vueExports.createCommentVNode("", true),
                          vueExports.unref(quote).resident_approved_by ? (vueExports.openBlock(), vueExports.createBlock("span", {
                            key: 1,
                            class: "text-slate-500"
                          }, " — " + vueExports.toDisplayString(vueExports.unref(quote).resident_approved_by.name), 1)) : vueExports.createCommentVNode("", true)
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(quote).order) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Đơn hàng" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/orders/${vueExports.unref(quote).order.id}`,
                        class: "text-primary hover:underline font-mono text-sm font-medium"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote).order.code)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).order.code), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        label: vueExports.unref(quote).order.status.label,
                        color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(quote).order.status.value),
                        variant: "subtle",
                        size: "xs"
                      }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      return [
                        vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/orders/${vueExports.unref(quote).order.id}`,
                            class: "text-primary hover:underline font-mono text-sm font-medium"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).order.code), 1)
                            ]),
                            _: 1
                          }, 8, ["to"]),
                          vueExports.createVNode(_component_UBadge, {
                            label: vueExports.unref(quote).order.status.label,
                            color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(quote).order.status.value),
                            variant: "subtle",
                            size: "xs"
                          }, null, 8, ["label", "color"])
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else if (vueExports.unref(canCreateOrder)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Đơn hàng" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                        label: "Tạo đơn hàng",
                        icon: "i-lucide-plus",
                        size: "xs",
                        color: "primary",
                        variant: "soft",
                        onClick: ($event) => showCreateOrderModal.value = true
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UButton, {
                          label: "Tạo đơn hàng",
                          icon: "i-lucide-plus",
                          size: "xs",
                          color: "primary",
                          variant: "soft",
                          onClick: ($event) => showCreateOrderModal.value = true
                        }, null, 8, ["onClick"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5" }, [
                  vueExports.unref(quote).og_ticket ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 0,
                    label: "Ticket"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/og-tickets/${vueExports.unref(quote).og_ticket.id}`,
                        class: "text-primary hover:underline font-medium"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).og_ticket.subject), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(quote).og_ticket ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 1,
                    label: "Khách hàng"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(quote).og_ticket.customer ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/customers/${vueExports.unref(quote).og_ticket.customer.id}`,
                        class: "font-medium text-primary-600 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).og_ticket.customer.full_name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(quote).og_ticket.requester_name), 1))
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).created_at)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).updated_at)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.unref(quote).manager_approved_at ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 2,
                    label: "QL duyệt lúc"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).manager_approved_at)) + " ", 1),
                      vueExports.unref(quote).manager_approved_by ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-slate-500"
                      }, " — " + vueExports.toDisplayString(vueExports.unref(quote).manager_approved_by.name), 1)) : vueExports.createCommentVNode("", true)
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(quote).resident_approved_at ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 3,
                    label: "Cư dân chấp thuận lúc"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                        vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).resident_approved_at)), 1),
                        vueExports.unref(quote).resident_approved_via ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: 0,
                          label: vueExports.unref(quote).resident_approved_via.label,
                          color: vueExports.unref(quote).resident_approved_via.value === "resident_self" ? "success" : "warning",
                          variant: "subtle",
                          size: "xs"
                        }, null, 8, ["label", "color"])) : vueExports.createCommentVNode("", true),
                        vueExports.unref(quote).resident_approved_by ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-500"
                        }, " — " + vueExports.toDisplayString(vueExports.unref(quote).resident_approved_by.name), 1)) : vueExports.createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(quote).order ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 4,
                    label: "Đơn hàng"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/orders/${vueExports.unref(quote).order.id}`,
                          class: "text-primary hover:underline font-mono text-sm font-medium"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).order.code), 1)
                          ]),
                          _: 1
                        }, 8, ["to"]),
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(quote).order.status.label,
                          color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(quote).order.status.value),
                          variant: "subtle",
                          size: "xs"
                        }, null, 8, ["label", "color"])
                      ])
                    ]),
                    _: 1
                  })) : vueExports.unref(canCreateOrder) ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 5,
                    label: "Đơn hàng"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UButton, {
                        label: "Tạo đơn hàng",
                        icon: "i-lucide-plus",
                        size: "xs",
                        color: "primary",
                        variant: "soft",
                        onClick: ($event) => showCreateOrderModal.value = true
                      }, null, 8, ["onClick"])
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Dòng báo giá" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="sm:hidden flex flex-col gap-3"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(quote).lines, (line) => {
                _push2(`<div class="rounded-lg border border-slate-200 bg-slate-50/50 p-3"${_scopeId}><div class="flex items-start justify-between gap-2 mb-1.5"${_scopeId}><span class="text-sm font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(line.name)}</span>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  label: line.line_type.label,
                  color: "neutral",
                  variant: "subtle",
                  size: "xs",
                  class: "shrink-0"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="flex items-center justify-between text-xs text-slate-500"${_scopeId}><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(line.quantity)} ${serverRenderer_cjs_prodExports.ssrInterpolate(line.unit)} × ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.unit_price))}</span><span class="font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.line_amount))}</span></div></div>`);
              });
              _push2(`<!--]--></div><div class="hidden sm:block"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(quote).lines,
                columns: lineColumns
              }, {
                "line_type-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: row.original.line_type.label,
                      color: "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: row.original.line_type.label,
                        color: "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label"])
                    ];
                  }
                }),
                "unit_price-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.unit_price))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.unit_price)), 1)
                    ];
                  }
                }),
                "line_amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.line_amount))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.line_amount)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "sm:hidden flex flex-col gap-3" }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(quote).lines, (line) => {
                    return vueExports.openBlock(), vueExports.createBlock("div", {
                      key: line.id,
                      class: "rounded-lg border border-slate-200 bg-slate-50/50 p-3"
                    }, [
                      vueExports.createVNode("div", { class: "flex items-start justify-between gap-2 mb-1.5" }, [
                        vueExports.createVNode("span", { class: "text-sm font-medium text-slate-900" }, vueExports.toDisplayString(line.name), 1),
                        vueExports.createVNode(_component_UBadge, {
                          label: line.line_type.label,
                          color: "neutral",
                          variant: "subtle",
                          size: "xs",
                          class: "shrink-0"
                        }, null, 8, ["label"])
                      ]),
                      vueExports.createVNode("div", { class: "flex items-center justify-between text-xs text-slate-500" }, [
                        vueExports.createVNode("span", null, vueExports.toDisplayString(line.quantity) + " " + vueExports.toDisplayString(line.unit) + " × " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.unit_price)), 1),
                        vueExports.createVNode("span", { class: "font-semibold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.line_amount)), 1)
                      ])
                    ]);
                  }), 128))
                ]),
                vueExports.createVNode("div", { class: "hidden sm:block" }, [
                  vueExports.createVNode(_component_UTable, {
                    data: vueExports.unref(quote).lines,
                    columns: lineColumns
                  }, {
                    "line_type-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_UBadge, {
                        label: row.original.line_type.label,
                        color: "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label"])
                    ]),
                    "unit_price-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.unit_price)), 1)
                    ]),
                    "line_amount-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.line_amount)), 1)
                    ]),
                    _: 1
                  }, 8, ["data"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Tổng kết" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><span class="text-sm font-medium text-slate-600"${_scopeId}>Tổng tiền</span><span class="text-lg font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(quote).total_amount))}</span></div>`);
              if (vueExports.unref(quote).note) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ghi chú" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="whitespace-pre-line"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote).note)}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "whitespace-pre-line" }, vueExports.toDisplayString(vueExports.unref(quote).note), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                  vueExports.createVNode("div", { class: "flex items-center justify-between" }, [
                    vueExports.createVNode("span", { class: "text-sm font-medium text-slate-600" }, "Tổng tiền"),
                    vueExports.createVNode("span", { class: "text-lg font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(quote).total_amount)), 1)
                  ]),
                  vueExports.unref(quote).note ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 0,
                    label: "Ghi chú"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "whitespace-pre-line" }, vueExports.toDisplayString(vueExports.unref(quote).note), 1)
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(versions).length > 1) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Phiên bản báo giá" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex flex-col gap-4"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(versions), (ver, idx) => {
                  _push2(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([ver.is_active ? "border-emerald-300 bg-emerald-50/50" : "border-slate-200 bg-slate-50/50", "rounded-lg border p-3 sm:p-4"])}"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 mb-2"${_scopeId}><div class="flex items-center gap-1.5 sm:gap-2 flex-wrap"${_scopeId}><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([ver.is_active ? "text-emerald-700" : "text-slate-500", "text-sm font-bold"])}"${_scopeId}> #${serverRenderer_cjs_prodExports.ssrInterpolate(idx + 1)}</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/quotes/${ver.id}`,
                    class: ["font-mono text-xs font-semibold hover:underline", ver.id === vueExports.unref(id) ? "text-primary" : "text-slate-700"]
                  }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(ver.code)}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(ver.code), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  if (ver.is_active) {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: "Còn hiệu lực",
                      color: "success",
                      variant: "subtle",
                      size: "xs"
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: "Đã thay thế",
                      color: "neutral",
                      variant: "subtle",
                      size: "xs"
                    }, null, _parent2, _scopeId));
                  }
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: ver.status.label,
                    color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(ver.status.value),
                    variant: "subtle",
                    size: "xs"
                  }, null, _parent2, _scopeId));
                  _push2(`</div><span class="text-xs text-slate-400"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(ver.created_at))}</span></div><div class="flex flex-col gap-1"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(ver.lines, (line) => {
                    _push2(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-0.5 sm:gap-0"${_scopeId}><span class="text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(line.name)}</span><span class="text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(line.quantity)} ${serverRenderer_cjs_prodExports.ssrInterpolate(line.unit)} × ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.unit_price))} = <span class="font-medium text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.line_amount))}</span></span></div>`);
                  });
                  _push2(`<!--]--></div><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([ver.is_active ? "border-emerald-200" : "border-slate-200", "flex items-center justify-between mt-2 pt-2 border-t"])}"${_scopeId}><span class="text-xs font-medium text-slate-600"${_scopeId}>Tổng tiền</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([ver.is_active ? "text-emerald-700" : "text-slate-700", "text-sm font-bold"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(ver.total_amount))}</span></div></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(versions), (ver, idx) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: ver.id,
                        class: ["rounded-lg border p-3 sm:p-4", ver.is_active ? "border-emerald-300 bg-emerald-50/50" : "border-slate-200 bg-slate-50/50"]
                      }, [
                        vueExports.createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 mb-2" }, [
                          vueExports.createVNode("div", { class: "flex items-center gap-1.5 sm:gap-2 flex-wrap" }, [
                            vueExports.createVNode("span", {
                              class: ["text-sm font-bold", ver.is_active ? "text-emerald-700" : "text-slate-500"]
                            }, " #" + vueExports.toDisplayString(idx + 1), 3),
                            vueExports.createVNode(_component_NuxtLink, {
                              to: `/pmc/quotes/${ver.id}`,
                              class: ["font-mono text-xs font-semibold hover:underline", ver.id === vueExports.unref(id) ? "text-primary" : "text-slate-700"]
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(vueExports.toDisplayString(ver.code), 1)
                              ]),
                              _: 2
                            }, 1032, ["to", "class"]),
                            ver.is_active ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                              key: 0,
                              label: "Còn hiệu lực",
                              color: "success",
                              variant: "subtle",
                              size: "xs"
                            })) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                              key: 1,
                              label: "Đã thay thế",
                              color: "neutral",
                              variant: "subtle",
                              size: "xs"
                            })),
                            vueExports.createVNode(_component_UBadge, {
                              label: ver.status.label,
                              color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(ver.status.value),
                              variant: "subtle",
                              size: "xs"
                            }, null, 8, ["label", "color"])
                          ]),
                          vueExports.createVNode("span", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(ver.created_at)), 1)
                        ]),
                        vueExports.createVNode("div", { class: "flex flex-col gap-1" }, [
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(ver.lines, (line) => {
                            return vueExports.openBlock(), vueExports.createBlock("div", {
                              key: line.id,
                              class: "flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-0.5 sm:gap-0"
                            }, [
                              vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(line.name), 1),
                              vueExports.createVNode("span", { class: "text-slate-500" }, [
                                vueExports.createTextVNode(vueExports.toDisplayString(line.quantity) + " " + vueExports.toDisplayString(line.unit) + " × " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.unit_price)) + " = ", 1),
                                vueExports.createVNode("span", { class: "font-medium text-slate-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.line_amount)), 1)
                              ])
                            ]);
                          }), 128))
                        ]),
                        vueExports.createVNode("div", {
                          class: ["flex items-center justify-between mt-2 pt-2 border-t", ver.is_active ? "border-emerald-200" : "border-slate-200"]
                        }, [
                          vueExports.createVNode("span", { class: "text-xs font-medium text-slate-600" }, "Tổng tiền"),
                          vueExports.createVNode("span", {
                            class: ["text-sm font-bold", ver.is_active ? "text-emerald-700" : "text-slate-700"]
                          }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(ver.total_amount)), 3)
                        ], 2)
                      ], 2);
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
        _push(`</div><div class="flex flex-col gap-4">`);
        if (vueExports.unref(isActive)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Hành động",
            compact: "",
            class: "hidden lg:block"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(quote).status.value === "draft") {
                  _push2(`<div class="flex flex-col gap-2"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: "Gửi báo giá",
                    icon: "i-lucide-send",
                    color: "primary",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => vueExports.unref(handleTransition)("sent")
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                } else if (vueExports.unref(quote).status.value === "sent") {
                  _push2(`<div class="flex flex-col gap-2"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: "Quản lý duyệt",
                    icon: "i-lucide-user-check",
                    color: "primary",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => vueExports.unref(handleTransition)("manager_approved")
                  }, null, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: "Quản lý từ chối",
                    icon: "i-lucide-x-circle",
                    color: "error",
                    variant: "outline",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: vueExports.unref(openRejectModal)
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                } else if (vueExports.unref(quote).status.value === "manager_approved") {
                  _push2(`<div class="flex flex-col gap-2"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: "Cư dân chấp thuận",
                    icon: "i-lucide-check-circle",
                    color: "success",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => vueExports.unref(handleTransition)("approved")
                  }, null, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: "Cư dân từ chối",
                    icon: "i-lucide-x-circle",
                    color: "error",
                    variant: "outline",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: vueExports.unref(openRejectModal)
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  _push2(`<p class="text-sm text-slate-400 italic"${_scopeId}> Không có hành động khả dụng. </p>`);
                }
              } else {
                return [
                  vueExports.unref(quote).status.value === "draft" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "flex flex-col gap-2"
                  }, [
                    vueExports.createVNode(_component_UButton, {
                      label: "Gửi báo giá",
                      icon: "i-lucide-send",
                      color: "primary",
                      class: "w-full",
                      loading: vueExports.unref(isTransitioning),
                      onClick: ($event) => vueExports.unref(handleTransition)("sent")
                    }, null, 8, ["loading", "onClick"])
                  ])) : vueExports.unref(quote).status.value === "sent" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "flex flex-col gap-2"
                  }, [
                    vueExports.createVNode(_component_UButton, {
                      label: "Quản lý duyệt",
                      icon: "i-lucide-user-check",
                      color: "primary",
                      class: "w-full",
                      loading: vueExports.unref(isTransitioning),
                      onClick: ($event) => vueExports.unref(handleTransition)("manager_approved")
                    }, null, 8, ["loading", "onClick"]),
                    vueExports.createVNode(_component_UButton, {
                      label: "Quản lý từ chối",
                      icon: "i-lucide-x-circle",
                      color: "error",
                      variant: "outline",
                      class: "w-full",
                      loading: vueExports.unref(isTransitioning),
                      onClick: vueExports.unref(openRejectModal)
                    }, null, 8, ["loading", "onClick"])
                  ])) : vueExports.unref(quote).status.value === "manager_approved" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 2,
                    class: "flex flex-col gap-2"
                  }, [
                    vueExports.createVNode(_component_UButton, {
                      label: "Cư dân chấp thuận",
                      icon: "i-lucide-check-circle",
                      color: "success",
                      class: "w-full",
                      loading: vueExports.unref(isTransitioning),
                      onClick: ($event) => vueExports.unref(handleTransition)("approved")
                    }, null, 8, ["loading", "onClick"]),
                    vueExports.createVNode(_component_UButton, {
                      label: "Cư dân từ chối",
                      icon: "i-lucide-x-circle",
                      color: "error",
                      variant: "outline",
                      class: "w-full",
                      loading: vueExports.unref(isTransitioning),
                      onClick: vueExports.unref(openRejectModal)
                    }, null, 8, ["loading", "onClick"])
                  ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 3,
                    class: "text-sm text-slate-400 italic"
                  }, " Không có hành động khả dụng. "))
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Thông tin",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: vueExports.unref(quote).status.label,
                      color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(vueExports.unref(quote).status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(quote).status.label,
                        color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(vueExports.unref(quote).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Active" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: vueExports.unref(quote).is_active ? "Active" : "Inactive",
                      color: vueExports.unref(quote).is_active ? "success" : "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(quote).is_active ? "Active" : "Inactive",
                        color: vueExports.unref(quote).is_active ? "success" : "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số dòng" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote).lines.length)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).lines.length), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).created_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).created_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).updated_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).updated_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-3" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(quote).status.label,
                        color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(vueExports.unref(quote).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Active" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(quote).is_active ? "Active" : "Inactive",
                        color: vueExports.unref(quote).is_active ? "success" : "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số dòng" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(quote).lines.length), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).created_at)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(quote).updated_at)), 1)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(audits).length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Lịch sử thay đổi",
            compact: ""
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="max-h-[500px] overflow-y-auto"${_scopeId}><div class="relative"${_scopeId}><div class="absolute top-0 bottom-0 left-2.5 w-px bg-slate-200"${_scopeId}></div><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(audits), (audit) => {
                  _push2(`<div class="relative flex gap-3 pb-4 last:pb-0"${_scopeId}><div class="relative z-10 flex items-center justify-center size-5 rounded-full bg-white border-2 border-slate-300 shrink-0"${_scopeId}><div class="size-1.5 rounded-full bg-slate-400"${_scopeId}></div></div><div class="flex-1 min-w-0 -mt-0.5"${_scopeId}><div class="flex items-center gap-1.5 flex-wrap"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: ("AUDIT_EVENT_LABELS" in _ctx ? _ctx.AUDIT_EVENT_LABELS : vueExports.unref(AUDIT_EVENT_LABELS))[audit.event] ?? audit.event,
                    color: ("AUDIT_EVENT_COLORS" in _ctx ? _ctx.AUDIT_EVENT_COLORS : vueExports.unref(AUDIT_EVENT_COLORS))[audit.event] ?? "neutral",
                    variant: "subtle",
                    size: "xs"
                  }, null, _parent2, _scopeId));
                  _push2(`</div><p class="text-[11px] text-slate-500 mt-0.5"${_scopeId}>`);
                  if (audit.user) {
                    _push2(`<span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(audit.user.name)} · </span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(audit.created_at))}</p>`);
                  if (audit.event !== "created") {
                    _push2(`<div class="mt-1.5 flex flex-col gap-1"${_scopeId}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(getChangedFields(audit), (change) => {
                      _push2(`<div class="text-[11px] leading-relaxed"${_scopeId}><span class="font-medium text-slate-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(change.field)}:</span><span class="text-red-500 line-through ml-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(change.old)}</span>`);
                      _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-arrow-right",
                        class: "size-3 text-slate-400 mx-0.5 inline-block align-middle"
                      }, null, _parent2, _scopeId));
                      _push2(`<span class="text-emerald-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(change.new)}</span></div>`);
                    });
                    _push2(`<!--]--></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                });
                _push2(`<!--]--></div></div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "max-h-[500px] overflow-y-auto" }, [
                    vueExports.createVNode("div", { class: "relative" }, [
                      vueExports.createVNode("div", { class: "absolute top-0 bottom-0 left-2.5 w-px bg-slate-200" }),
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(audits), (audit) => {
                        return vueExports.openBlock(), vueExports.createBlock("div", {
                          key: audit.id,
                          class: "relative flex gap-3 pb-4 last:pb-0"
                        }, [
                          vueExports.createVNode("div", { class: "relative z-10 flex items-center justify-center size-5 rounded-full bg-white border-2 border-slate-300 shrink-0" }, [
                            vueExports.createVNode("div", { class: "size-1.5 rounded-full bg-slate-400" })
                          ]),
                          vueExports.createVNode("div", { class: "flex-1 min-w-0 -mt-0.5" }, [
                            vueExports.createVNode("div", { class: "flex items-center gap-1.5 flex-wrap" }, [
                              vueExports.createVNode(_component_UBadge, {
                                label: ("AUDIT_EVENT_LABELS" in _ctx ? _ctx.AUDIT_EVENT_LABELS : vueExports.unref(AUDIT_EVENT_LABELS))[audit.event] ?? audit.event,
                                color: ("AUDIT_EVENT_COLORS" in _ctx ? _ctx.AUDIT_EVENT_COLORS : vueExports.unref(AUDIT_EVENT_COLORS))[audit.event] ?? "neutral",
                                variant: "subtle",
                                size: "xs"
                              }, null, 8, ["label", "color"])
                            ]),
                            vueExports.createVNode("p", { class: "text-[11px] text-slate-500 mt-0.5" }, [
                              audit.user ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(audit.user.name) + " · ", 1)) : vueExports.createCommentVNode("", true),
                              vueExports.createTextVNode(" " + vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(audit.created_at)), 1)
                            ]),
                            audit.event !== "created" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                              key: 0,
                              class: "mt-1.5 flex flex-col gap-1"
                            }, [
                              (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(getChangedFields(audit), (change) => {
                                return vueExports.openBlock(), vueExports.createBlock("div", {
                                  key: change.field,
                                  class: "text-[11px] leading-relaxed"
                                }, [
                                  vueExports.createVNode("span", { class: "font-medium text-slate-600" }, vueExports.toDisplayString(change.field) + ":", 1),
                                  vueExports.createVNode("span", { class: "text-red-500 line-through ml-1" }, vueExports.toDisplayString(change.old), 1),
                                  vueExports.createVNode(_component_UIcon, {
                                    name: "i-lucide-arrow-right",
                                    class: "size-3 text-slate-400 mx-0.5 inline-block align-middle"
                                  }),
                                  vueExports.createVNode("span", { class: "text-emerald-600" }, vueExports.toDisplayString(change.new), 1)
                                ]);
                              }), 128))
                            ])) : vueExports.createCommentVNode("", true)
                          ])
                        ]);
                      }), 128))
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(quote) && vueExports.unref(isActive)) {
        _push(`<div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-3 lg:hidden z-50">`);
        if (vueExports.unref(quote).status.value === "draft") {
          _push(`<div class="flex items-center gap-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Gửi báo giá",
            icon: "i-lucide-send",
            color: "primary",
            class: "flex-1",
            loading: vueExports.unref(isTransitioning),
            onClick: ($event) => vueExports.unref(handleTransition)("sent")
          }, null, _parent));
          if (vueExports.unref(canEdit)) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-pencil",
              color: "neutral",
              variant: "outline",
              to: `/pmc/quotes/${vueExports.unref(id)}/edit`
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-trash-2",
            color: "error",
            variant: "outline",
            onClick: ($event) => vueExports.unref(openDeleteModal)(vueExports.unref(quote))
          }, null, _parent));
          _push(`</div>`);
        } else if (vueExports.unref(quote).status.value === "sent") {
          _push(`<div class="flex items-center gap-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Quản lý duyệt",
            icon: "i-lucide-user-check",
            color: "primary",
            class: "flex-1",
            loading: vueExports.unref(isTransitioning),
            onClick: ($event) => vueExports.unref(handleTransition)("manager_approved")
          }, null, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-x-circle",
            color: "error",
            variant: "outline",
            loading: vueExports.unref(isTransitioning),
            onClick: vueExports.unref(openRejectModal)
          }, null, _parent));
          if (vueExports.unref(canEdit)) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-pencil",
              color: "neutral",
              variant: "outline",
              to: `/pmc/quotes/${vueExports.unref(id)}/edit`
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (vueExports.unref(quote).status.value === "manager_approved") {
          _push(`<div class="flex items-center gap-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Cư dân chấp thuận",
            icon: "i-lucide-check-circle",
            color: "success",
            class: "flex-1",
            loading: vueExports.unref(isTransitioning),
            onClick: ($event) => vueExports.unref(handleTransition)("approved")
          }, null, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-x-circle",
            color: "error",
            variant: "outline",
            loading: vueExports.unref(isTransitioning),
            onClick: vueExports.unref(openRejectModal)
          }, null, _parent));
          _push(`</div>`);
        } else if (vueExports.unref(canEdit)) {
          _push(`<div class="flex items-center gap-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Chỉnh sửa",
            icon: "i-lucide-pencil",
            color: "primary",
            variant: "soft",
            class: "flex-1",
            to: `/pmc/quotes/${vueExports.unref(id)}/edit`
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá báo giá",
        "item-name": vueExports.unref(deleteTarget)?.code ?? vueExports.unref(quote)?.code,
        description: "Báo giá sẽ bị ngưng hiệu lực.",
        checking: vueExports.unref(isCheckingDelete),
        "blocked-message": vueExports.unref(deleteBlockedMessage),
        loading: vueExports.unref(isDeleting),
        onConfirm: vueExports.unref(handleDelete)
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showCreateOrderModal),
        "onUpdate:open": ($event) => vueExports.isRef(showCreateOrderModal) ? showCreateOrderModal.value = $event : null,
        title: "Tạo đơn hàng"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-600 mb-4"${_scopeId}> Tạo đơn hàng từ báo giá <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote)?.code)}</strong></p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú (không bắt buộc)" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(orderNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(orderNote) ? orderNote.value = $event : null,
                    placeholder: "Nhập ghi chú...",
                    rows: 3,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(orderNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(orderNote) ? orderNote.value = $event : null,
                      placeholder: "Nhập ghi chú...",
                      rows: 3,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-600 mb-4" }, [
                vueExports.createTextVNode(" Tạo đơn hàng từ báo giá "),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(quote)?.code), 1)
              ]),
              vueExports.createVNode(_component_UFormField, { label: "Ghi chú (không bắt buộc)" }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(orderNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(orderNote) ? orderNote.value = $event : null,
                    placeholder: "Nhập ghi chú...",
                    rows: 3,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              })
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
              onClick: ($event) => showCreateOrderModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Tạo đơn hàng",
              icon: "i-lucide-plus",
              color: "primary",
              loading: vueExports.unref(isCreatingOrder),
              onClick: handleCreateOrder
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showCreateOrderModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Tạo đơn hàng",
                  icon: "i-lucide-plus",
                  color: "primary",
                  loading: vueExports.unref(isCreatingOrder),
                  onClick: handleCreateOrder
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showRejectModal),
        "onUpdate:open": ($event) => vueExports.isRef(showRejectModal) ? showRejectModal.value = $event : null,
        title: "Từ chối báo giá"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-slate-700 mb-4"${_scopeId}> Vui lòng nhập lý do từ chối (không bắt buộc). </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
              modelValue: vueExports.unref(rejectNote),
              "onUpdate:modelValue": ($event) => vueExports.isRef(rejectNote) ? rejectNote.value = $event : null,
              placeholder: "Lý do từ chối...",
              rows: 3,
              class: "w-full"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("p", { class: "text-slate-700 mb-4" }, " Vui lòng nhập lý do từ chối (không bắt buộc). "),
              vueExports.createVNode(_component_UTextarea, {
                modelValue: vueExports.unref(rejectNote),
                "onUpdate:modelValue": ($event) => vueExports.isRef(rejectNote) ? rejectNote.value = $event : null,
                placeholder: "Lý do từ chối...",
                rows: 3,
                class: "w-full"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
              onClick: ($event) => showRejectModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Từ chối",
              color: "error",
              loading: vueExports.unref(isTransitioning),
              onClick: ($event) => vueExports.unref(confirmReject)(vueExports.unref(quote).status.value)
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showRejectModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Từ chối",
                  color: "error",
                  loading: vueExports.unref(isTransitioning),
                  onClick: ($event) => vueExports.unref(confirmReject)(vueExports.unref(quote).status.value)
                }, null, 8, ["loading", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/quotes/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C3KGKwMz.mjs.map
