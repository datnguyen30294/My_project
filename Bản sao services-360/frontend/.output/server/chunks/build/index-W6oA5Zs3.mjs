import { v as vueExports, p as useRoute$1, j as useToast, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$3 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$4 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$5 } from './Input-JXN8po_F.mjs';
import { f as useReconciliationDetail, r as reconciliationStatusColor, d as apiReconcile, g as clearReconciliationCache, h as apiRejectReconcile } from './useReconciliations-BSqve17o.mjs';
import { f as formatDateTime, a as formatDate } from './date-R5YK0ast.mjs';
import { e as cashTransactionCategoryColor } from './useTreasury-BKILzBuO.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { p as paymentReceiptTypeColor, r as receivableStatusColor } from './useReceivables-eUxCdlsS.mjs';
import { f as formatPhone } from './phone-DErPjpTB.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
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
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './index-QmZAbLx-.mjs';
import './Label-BBgw4vHh.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const toast = useToast();
    const { data, status, error, refresh } = useReconciliationDetail(id);
    const reconciliation = vueExports.computed(() => data.value?.data);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(
      () => reconciliation.value ? `Chi tiết đối soát #${reconciliation.value.id}` : null
    ));
    useSeoMeta({
      title: vueExports.computed(
        () => reconciliation.value ? `Đối soát #${reconciliation.value.id}` : "Chi tiết đối soát"
      )
    });
    const isPending = vueExports.computed(() => reconciliation.value?.status.value === "pending");
    const isRejected = vueExports.computed(() => reconciliation.value?.status.value === "rejected");
    const isManualSource = vueExports.computed(() => reconciliation.value?.source?.type === "manual_cash");
    const sourceCashTx = vueExports.computed(() => reconciliation.value?.source?.cash_transaction ?? null);
    const showReconcileModal = vueExports.ref(false);
    const reconcileNote = vueExports.ref("");
    const isReconciling = vueExports.ref(false);
    function openReconcileModal() {
      reconcileNote.value = "";
      showReconcileModal.value = true;
    }
    async function submitReconcile() {
      isReconciling.value = true;
      try {
        await apiReconcile(id.value, { note: reconcileNote.value || void 0 });
        toast.add({ title: "Đã xác nhận đối soát thành công", color: "success" });
        clearReconciliationCache(id.value);
        showReconcileModal.value = false;
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Đối soát thất bại"), color: "error" });
      } finally {
        isReconciling.value = false;
      }
    }
    const showRejectModal = vueExports.ref(false);
    const rejectReason = vueExports.ref("");
    const isRejecting = vueExports.ref(false);
    function openRejectModal() {
      rejectReason.value = "";
      showRejectModal.value = true;
    }
    async function submitReject() {
      if (!rejectReason.value.trim()) {
        toast.add({ title: "Vui lòng nhập lý do thất bại", color: "error" });
        return;
      }
      isRejecting.value = true;
      try {
        await apiRejectReconcile(id.value, { reason: rejectReason.value });
        toast.add({ title: "Đã ghi nhận đối soát thất bại", color: "success" });
        clearReconciliationCache(id.value);
        showRejectModal.value = false;
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Ghi nhận thất bại không thành công"), color: "error" });
      } finally {
        isRejecting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$1;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UAlert = _sfc_main$2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UModal = _sfc_main$3;
      const _component_UFormField = _sfc_main$4;
      const _component_UInput = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/finance/reconciliation",
        class: "shrink-0"
      }, null, _parent));
      _push(`<div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight"> Chi tiết đối soát </h1>`);
      if (vueExports.unref(reconciliation)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          label: vueExports.unref(reconciliation).status.label,
          color: ("reconciliationStatusColor" in _ctx ? _ctx.reconciliationStatusColor : vueExports.unref(reconciliationStatusColor))(vueExports.unref(reconciliation).status.value),
          variant: "subtle",
          size: "sm"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(isManualSource) && vueExports.unref(sourceCashTx)) {
        _push(`<p class="text-slate-500 text-sm mt-0.5"> Giao dịch quỹ: <span class="font-mono font-semibold">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(sourceCashTx).code)}</span></p>`);
      } else if (vueExports.unref(reconciliation)?.receivable?.order) {
        _push(`<p class="text-slate-500 text-sm mt-0.5"> Đơn hàng: <span class="font-mono font-semibold">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).receivable.order.code)}</span></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(reconciliation)) {
        _push(`<div class="flex flex-col gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(3, (i) => {
          _push(`<div class="h-24 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(reconciliation)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"><div class="lg:col-span-2 flex flex-col gap-4 sm:gap-6">`);
        if (vueExports.unref(isPending)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: "warning",
            variant: "subtle",
            title: "Chờ đối soát",
            description: "Dòng tiền chưa được đối soát."
          }, null, _parent));
        } else if (vueExports.unref(isRejected)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: "error",
            variant: "subtle",
            title: "Đã từ chối đối soát",
            description: vueExports.unref(reconciliation).note ? `Lý do: ${vueExports.unref(reconciliation).note}` : "Bên đối soát đã từ chối. Vui lòng chỉnh sửa dòng tiền và gửi lại."
          }, null, _parent));
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: "success",
            variant: "subtle",
            title: "Đã đối soát",
            description: `Đã đối soát lúc ${("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).reconciled_at)}${vueExports.unref(reconciliation).reconciled_by ? ` bởi ${vueExports.unref(reconciliation).reconciled_by.name}` : ""}.`
          }, null, _parent));
        }
        if (vueExports.unref(isManualSource)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin giao dịch quỹ" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(sourceCashTx)) {
                  _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã giao dịch" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="font-mono font-semibold"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(sourceCashTx).code)}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "font-mono font-semibold" }, vueExports.toDisplayString(vueExports.unref(sourceCashTx).code), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Danh mục" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: vueExports.unref(sourceCashTx).category.label,
                          color: ("cashTransactionCategoryColor" in _ctx ? _ctx.cashTransactionCategoryColor : vueExports.unref(cashTransactionCategoryColor))(vueExports.unref(sourceCashTx).category.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: vueExports.unref(sourceCashTx).category.label,
                            color: ("cashTransactionCategoryColor" in _ctx ? _ctx.cashTransactionCategoryColor : vueExports.unref(cashTransactionCategoryColor))(vueExports.unref(sourceCashTx).category.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Loại" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: vueExports.unref(sourceCashTx).direction.label,
                          color: vueExports.unref(sourceCashTx).direction.value === "inflow" ? "success" : "warning",
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: vueExports.unref(sourceCashTx).direction.label,
                            color: vueExports.unref(sourceCashTx).direction.value === "inflow" ? "success" : "warning",
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số tiền" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="text-lg font-bold"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(sourceCashTx).amount))}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "text-lg font-bold" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(sourceCashTx).amount)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày giao dịch" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(sourceCashTx).transaction_date))}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(sourceCashTx).transaction_date)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người tạo" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(sourceCashTx).created_by?.name ?? "—")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(sourceCashTx).created_by?.name ?? "—"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                    label: "Ghi chú",
                    class: "sm:col-span-2"
                  }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(sourceCashTx).note ?? "—")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(sourceCashTx).note ?? "—"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="mt-3"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: "/pmc/finance/treasury",
                  class: "text-sm text-primary hover:underline"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Xem trang quản lý quỹ → `);
                    } else {
                      return [
                        vueExports.createTextVNode(" Xem trang quản lý quỹ → ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  vueExports.unref(sourceCashTx) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
                  }, [
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã giao dịch" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-mono font-semibold" }, vueExports.toDisplayString(vueExports.unref(sourceCashTx).code), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Danh mục" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(sourceCashTx).category.label,
                          color: ("cashTransactionCategoryColor" in _ctx ? _ctx.cashTransactionCategoryColor : vueExports.unref(cashTransactionCategoryColor))(vueExports.unref(sourceCashTx).category.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Loại" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(sourceCashTx).direction.label,
                          color: vueExports.unref(sourceCashTx).direction.value === "inflow" ? "success" : "warning",
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số tiền" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "text-lg font-bold" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(sourceCashTx).amount)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày giao dịch" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(sourceCashTx).transaction_date)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Người tạo" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(sourceCashTx).created_by?.name ?? "—"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, {
                      label: "Ghi chú",
                      class: "sm:col-span-2"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(sourceCashTx).note ?? "—"), 1)
                      ]),
                      _: 1
                    })
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode("div", { class: "mt-3" }, [
                    vueExports.createVNode(_component_NuxtLink, {
                      to: "/pmc/finance/treasury",
                      class: "text-sm text-primary hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Xem trang quản lý quỹ → ")
                      ]),
                      _: 1
                    })
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!--[-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin dòng tiền" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(reconciliation).payment_receipt) {
                  _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Loại" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: vueExports.unref(reconciliation).payment_receipt.type.label,
                          color: ("paymentReceiptTypeColor" in _ctx ? _ctx.paymentReceiptTypeColor : vueExports.unref(paymentReceiptTypeColor))(vueExports.unref(reconciliation).payment_receipt.type.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: vueExports.unref(reconciliation).payment_receipt.type.label,
                            color: ("paymentReceiptTypeColor" in _ctx ? _ctx.paymentReceiptTypeColor : vueExports.unref(paymentReceiptTypeColor))(vueExports.unref(reconciliation).payment_receipt.type.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số tiền" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="text-lg font-bold"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(reconciliation).payment_receipt.amount))}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "text-lg font-bold" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(reconciliation).payment_receipt.amount)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Phương thức" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: vueExports.unref(reconciliation).payment_receipt.payment_method.label,
                          color: "neutral",
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: vueExports.unref(reconciliation).payment_receipt.payment_method.label,
                            color: "neutral",
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày giao dịch" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).payment_receipt.paid_at))}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).payment_receipt.paid_at)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người thu/trả" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).payment_receipt.collected_by?.name ?? "—")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).payment_receipt.collected_by?.name ?? "—"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ghi chú" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).payment_receipt.note ?? "—")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).payment_receipt.note ?? "—"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  vueExports.unref(reconciliation).payment_receipt ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
                  }, [
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Loại" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(reconciliation).payment_receipt.type.label,
                          color: ("paymentReceiptTypeColor" in _ctx ? _ctx.paymentReceiptTypeColor : vueExports.unref(paymentReceiptTypeColor))(vueExports.unref(reconciliation).payment_receipt.type.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số tiền" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "text-lg font-bold" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(reconciliation).payment_receipt.amount)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Phương thức" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(reconciliation).payment_receipt.payment_method.label,
                          color: "neutral",
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày giao dịch" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).payment_receipt.paid_at)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Người thu/trả" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).payment_receipt.collected_by?.name ?? "—"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ghi chú" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).payment_receipt.note ?? "—"), 1)
                      ]),
                      _: 1
                    })
                  ])) : vueExports.createCommentVNode("", true)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Công nợ liên quan" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(reconciliation).receivable) {
                  _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Đơn hàng" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        if (vueExports.unref(reconciliation).receivable.order) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                            to: `/pmc/orders/${vueExports.unref(reconciliation).receivable.order.id}`,
                            class: "text-primary hover:underline font-mono text-sm font-medium"
                          }, {
                            default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).receivable.order.code)}`);
                              } else {
                                return [
                                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.order.code), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent3, _scopeId2));
                        } else {
                          _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                        }
                      } else {
                        return [
                          vueExports.unref(reconciliation).receivable.order ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                            key: 0,
                            to: `/pmc/orders/${vueExports.unref(reconciliation).receivable.order.id}`,
                            class: "text-primary hover:underline font-mono text-sm font-medium"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.order.code), 1)
                            ]),
                            _: 1
                          }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                            key: 1,
                            class: "text-slate-400"
                          }, "—"))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Khách hàng" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        if (vueExports.unref(reconciliation).receivable.og_ticket?.customer) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                            to: `/pmc/customers/${vueExports.unref(reconciliation).receivable.og_ticket.customer.id}`,
                            class: "font-medium text-primary-600 hover:underline"
                          }, {
                            default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).receivable.og_ticket.customer.full_name)}`);
                              } else {
                                return [
                                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.og_ticket.customer.full_name), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent3, _scopeId2));
                        } else {
                          _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).receivable.og_ticket?.requester_name ?? "—")}</span>`);
                        }
                      } else {
                        return [
                          vueExports.unref(reconciliation).receivable.og_ticket?.customer ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                            key: 0,
                            to: `/pmc/customers/${vueExports.unref(reconciliation).receivable.og_ticket.customer.id}`,
                            class: "font-medium text-primary-600 hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.og_ticket.customer.full_name), 1)
                            ]),
                            _: 1
                          }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.og_ticket?.requester_name ?? "—"), 1))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "SĐT" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(reconciliation).receivable.og_ticket?.customer?.phone ?? vueExports.unref(reconciliation).receivable.og_ticket?.requester_phone))}</span>`);
                      } else {
                        return [
                          vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(reconciliation).receivable.og_ticket?.customer?.phone ?? vueExports.unref(reconciliation).receivable.og_ticket?.requester_phone)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Căn hộ" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).receivable.og_ticket?.apartment_name ?? "—")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.og_ticket?.apartment_name ?? "—"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Dự án" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).receivable.project?.name ?? "—")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.project?.name ?? "—"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Phải thu" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(reconciliation).receivable.amount))}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(reconciliation).receivable.amount)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Đã thu" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(reconciliation).receivable.paid_amount))}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(reconciliation).receivable.paid_amount)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "TT công nợ" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: vueExports.unref(reconciliation).receivable.status.label,
                          color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(vueExports.unref(reconciliation).receivable.status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UBadge, {
                            label: vueExports.unref(reconciliation).receivable.status.label,
                            color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(vueExports.unref(reconciliation).receivable.status.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="mt-3"${_scopeId}>`);
                if (vueExports.unref(reconciliation).receivable) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/receivables/${vueExports.unref(reconciliation).receivable.id}`,
                    class: "text-sm text-primary hover:underline"
                  }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(` Xem công nợ → `);
                      } else {
                        return [
                          vueExports.createTextVNode(" Xem công nợ → ")
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
                  vueExports.unref(reconciliation).receivable ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
                  }, [
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Đơn hàng" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.unref(reconciliation).receivable.order ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/orders/${vueExports.unref(reconciliation).receivable.order.id}`,
                          class: "text-primary hover:underline font-mono text-sm font-medium"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.order.code), 1)
                          ]),
                          _: 1
                        }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-slate-400"
                        }, "—"))
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Khách hàng" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.unref(reconciliation).receivable.og_ticket?.customer ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/customers/${vueExports.unref(reconciliation).receivable.og_ticket.customer.id}`,
                          class: "font-medium text-primary-600 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.og_ticket.customer.full_name), 1)
                          ]),
                          _: 1
                        }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.og_ticket?.requester_name ?? "—"), 1))
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "SĐT" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(reconciliation).receivable.og_ticket?.customer?.phone ?? vueExports.unref(reconciliation).receivable.og_ticket?.requester_phone)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Căn hộ" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.og_ticket?.apartment_name ?? "—"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Dự án" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reconciliation).receivable.project?.name ?? "—"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Phải thu" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(reconciliation).receivable.amount)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "Đã thu" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(reconciliation).receivable.paid_amount)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedFieldDisplay, { label: "TT công nợ" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(reconciliation).receivable.status.label,
                          color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(vueExports.unref(reconciliation).receivable.status.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])
                      ]),
                      _: 1
                    })
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode("div", { class: "mt-3" }, [
                    vueExports.unref(reconciliation).receivable ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/receivables/${vueExports.unref(reconciliation).receivable.id}`,
                      class: "text-sm text-primary hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Xem công nợ → ")
                      ]),
                      _: 1
                    }, 8, ["to"])) : vueExports.createCommentVNode("", true)
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<!--]-->`);
        }
        _push(`</div><div class="flex flex-col gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hành động",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (vueExports.unref(isPending)) {
                _push2(`<div class="flex flex-col gap-3"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Thành công",
                  icon: "i-lucide-check",
                  color: "primary",
                  class: "w-full",
                  block: "",
                  onClick: openReconcileModal
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Thất bại",
                  icon: "i-lucide-x",
                  color: "error",
                  variant: "soft",
                  class: "w-full",
                  block: "",
                  onClick: openRejectModal
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else if (vueExports.unref(isRejected)) {
                _push2(`<div class="text-sm text-slate-500 space-y-1"${_scopeId}><p class="text-error font-medium"${_scopeId}> Đã từ chối </p>`);
                if (vueExports.unref(reconciliation).note) {
                  _push2(`<p${_scopeId}> Lý do: ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).note)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<div class="text-sm text-slate-400 space-y-1"${_scopeId}><p${_scopeId}>Đã đối soát</p><p${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).reconciled_at))}</p>`);
                if (vueExports.unref(reconciliation).reconciled_by) {
                  _push2(`<p${_scopeId}> Bởi: ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).reconciled_by.name)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(reconciliation).note) {
                  _push2(`<p${_scopeId}> Ghi chú: ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reconciliation).note)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              }
            } else {
              return [
                vueExports.unref(isPending) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "flex flex-col gap-3"
                }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Thành công",
                    icon: "i-lucide-check",
                    color: "primary",
                    class: "w-full",
                    block: "",
                    onClick: openReconcileModal
                  }),
                  vueExports.createVNode(_component_UButton, {
                    label: "Thất bại",
                    icon: "i-lucide-x",
                    color: "error",
                    variant: "soft",
                    class: "w-full",
                    block: "",
                    onClick: openRejectModal
                  })
                ])) : vueExports.unref(isRejected) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "text-sm text-slate-500 space-y-1"
                }, [
                  vueExports.createVNode("p", { class: "text-error font-medium" }, " Đã từ chối "),
                  vueExports.unref(reconciliation).note ? (vueExports.openBlock(), vueExports.createBlock("p", { key: 0 }, " Lý do: " + vueExports.toDisplayString(vueExports.unref(reconciliation).note), 1)) : vueExports.createCommentVNode("", true)
                ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  class: "text-sm text-slate-400 space-y-1"
                }, [
                  vueExports.createVNode("p", null, "Đã đối soát"),
                  vueExports.createVNode("p", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).reconciled_at)), 1),
                  vueExports.unref(reconciliation).reconciled_by ? (vueExports.openBlock(), vueExports.createBlock("p", { key: 0 }, " Bởi: " + vueExports.toDisplayString(vueExports.unref(reconciliation).reconciled_by.name), 1)) : vueExports.createCommentVNode("", true),
                  vueExports.unref(reconciliation).note ? (vueExports.openBlock(), vueExports.createBlock("p", { key: 1 }, " Ghi chú: " + vueExports.toDisplayString(vueExports.unref(reconciliation).note), 1)) : vueExports.createCommentVNode("", true)
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
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
                      label: vueExports.unref(reconciliation).status.label,
                      color: ("reconciliationStatusColor" in _ctx ? _ctx.reconciliationStatusColor : vueExports.unref(reconciliationStatusColor))(vueExports.unref(reconciliation).status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(reconciliation).status.label,
                        color: ("reconciliationStatusColor" in _ctx ? _ctx.reconciliationStatusColor : vueExports.unref(reconciliationStatusColor))(vueExports.unref(reconciliation).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).created_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).created_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).updated_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).updated_at)), 1)
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
                        label: vueExports.unref(reconciliation).status.label,
                        color: ("reconciliationStatusColor" in _ctx ? _ctx.reconciliationStatusColor : vueExports.unref(reconciliationStatusColor))(vueExports.unref(reconciliation).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).created_at)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(reconciliation).updated_at)), 1)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showReconcileModal),
        "onUpdate:open": ($event) => vueExports.isRef(showReconcileModal) ? showReconcileModal.value = $event : null,
        title: "Xác nhận đối soát thành công",
        description: "Dòng tiền sẽ được đánh dấu là đã đối soát thành công."
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú (tùy chọn)" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(reconcileNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(reconcileNote) ? reconcileNote.value = $event : null,
                    placeholder: "Nhập ghi chú đối soát",
                    maxlength: 500,
                    class: "w-full",
                    autofocus: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(reconcileNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(reconcileNote) ? reconcileNote.value = $event : null,
                      placeholder: "Nhập ghi chú đối soát",
                      maxlength: 500,
                      class: "w-full",
                      autofocus: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UFormField, { label: "Ghi chú (tùy chọn)" }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(reconcileNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(reconcileNote) ? reconcileNote.value = $event : null,
                    placeholder: "Nhập ghi chú đối soát",
                    maxlength: 500,
                    class: "w-full",
                    autofocus: ""
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
              label: "Quay lại",
              color: "neutral",
              variant: "ghost",
              disabled: vueExports.unref(isReconciling),
              onClick: ($event) => showReconcileModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận thành công",
              icon: "i-lucide-check",
              color: "primary",
              loading: vueExports.unref(isReconciling),
              onClick: submitReconcile
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Quay lại",
                  color: "neutral",
                  variant: "ghost",
                  disabled: vueExports.unref(isReconciling),
                  onClick: ($event) => showReconcileModal.value = false
                }, null, 8, ["disabled", "onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận thành công",
                  icon: "i-lucide-check",
                  color: "primary",
                  loading: vueExports.unref(isReconciling),
                  onClick: submitReconcile
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
        title: "Xác nhận đối soát thất bại",
        description: "Dòng tiền sẽ được đánh dấu là đối soát thất bại. Vui lòng nhập lý do."
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Lý do thất bại",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(rejectReason),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(rejectReason) ? rejectReason.value = $event : null,
                    placeholder: "Nhập lý do thất bại",
                    maxlength: 500,
                    class: "w-full",
                    autofocus: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(rejectReason),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(rejectReason) ? rejectReason.value = $event : null,
                      placeholder: "Nhập lý do thất bại",
                      maxlength: 500,
                      class: "w-full",
                      autofocus: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UFormField, {
                label: "Lý do thất bại",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(rejectReason),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(rejectReason) ? rejectReason.value = $event : null,
                    placeholder: "Nhập lý do thất bại",
                    maxlength: 500,
                    class: "w-full",
                    autofocus: ""
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
              label: "Quay lại",
              color: "neutral",
              variant: "ghost",
              disabled: vueExports.unref(isRejecting),
              onClick: ($event) => showRejectModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận thất bại",
              icon: "i-lucide-x",
              color: "error",
              loading: vueExports.unref(isRejecting),
              disabled: !vueExports.unref(rejectReason).trim(),
              onClick: submitReject
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Quay lại",
                  color: "neutral",
                  variant: "ghost",
                  disabled: vueExports.unref(isRejecting),
                  onClick: ($event) => showRejectModal.value = false
                }, null, 8, ["disabled", "onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận thất bại",
                  icon: "i-lucide-x",
                  color: "error",
                  loading: vueExports.unref(isRejecting),
                  disabled: !vueExports.unref(rejectReason).trim(),
                  onClick: submitReject
                }, null, 8, ["loading", "disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/finance/reconciliation/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-W6oA5Zs3.mjs.map
