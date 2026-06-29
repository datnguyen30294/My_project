import { v as vueExports, p as useRoute$1, j as useToast, u as useSeoMeta, q as navigateTo, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$2 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$3 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$4 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$5 } from './Textarea-DTCNHwKm.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$6 } from './Modal-BimZZbNl.mjs';
import { _ as __nuxt_component_12 } from './QuoteLineFormModal-1EmtTWTT.mjs';
import { l as useQuoteDetail, e as QUOTE_LINE_TYPE_LABELS, q as quoteStatusColor, m as apiUpdateQuote, n as clearQuoteCache } from './useQuotes-C1-4FXSr.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { u as useQuoteTransition } from './useQuoteTransition-C55tMBSm.mjs';
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
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
import './Label-BBgw4vHh.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Select-CZE7Ef6n.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './Input-JXN8po_F.mjs';
import './NumberInput-BfLKWOCC.mjs';
import './CatalogItemFormModal-D472wqf5.mjs';
import './ImageUpload-CCeUx1rz.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Separator-DeO-OPIs.mjs';
import './Separator-DtmsHEyk.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './constants-G9YmtWtp.mjs';
import './useCatalogSuppliers-DJ8n9zOn.mjs';
import './RichTextEditor-CeP76v4Q.mjs';
import '@tiptap/vue-3';
import '@tiptap/starter-kit';
import '@tiptap/extension-underline';
import '@tiptap/extension-text-align';
import '@tiptap/extension-link';
import '@tiptap/extension-image';
import '@tiptap/extension-placeholder';
import '@tiptap/extension-table';
import '@tiptap/extension-table-row';
import '@tiptap/extension-table-header';
import '@tiptap/extension-table-cell';
import './Switch-1cJNH-6C.mjs';
import './useCatalogItems-Db1MWi3b.mjs';
import './useTableSearch-BhG9s2Ie.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const toast = useToast();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useQuoteDetail(id);
    const quote = vueExports.computed(() => data.value?.data);
    useSeoMeta({
      title: vueExports.computed(
        () => quote.value ? `Chỉnh sửa: ${quote.value.code} - Báo giá` : "Chỉnh sửa báo giá"
      )
    });
    vueExports.watch(quote, (q) => {
      if (q && (q.status.value === "approved" || !q.is_active)) {
        navigateTo(`/pmc/quotes/${id.value}`);
      }
    }, { immediate: true });
    let editLineKeySeq = 0;
    const editLines = vueExports.ref([]);
    const editNote = vueExports.ref("");
    vueExports.watch(quote, (q) => {
      if (q) {
        editLines.value = q.lines.map((l) => ({
          key: ++editLineKeySeq,
          line_type: l.line_type.value,
          reference_id: l.reference_id,
          name: l.name,
          quantity: l.quantity,
          unit: l.unit,
          unit_price: parseFloat(l.unit_price),
          purchase_price: l.purchase_price != null ? parseFloat(l.purchase_price) : 0
        }));
        editNote.value = q.note ?? "";
      }
    }, { immediate: true });
    function removeEditLine(key) {
      editLines.value = editLines.value.filter((l) => l.key !== key);
    }
    const editTotalAmount = vueExports.computed(
      () => editLines.value.reduce((sum, l) => sum + l.unit_price * l.quantity, 0)
    );
    const lineColumns = [
      { accessorKey: "name", header: "Hạng mục" },
      { id: "line_type", header: "Loại" },
      { accessorKey: "quantity", header: "SL" },
      { accessorKey: "unit", header: "ĐVT" },
      { id: "unit_price", header: "Đơn giá" },
      { id: "line_amount", header: "Thành tiền" },
      { id: "remove", header: "" }
    ];
    const lineModal = vueExports.ref();
    function onLineAdded(line) {
      editLines.value.push({ key: ++editLineKeySeq, ...line });
    }
    const isSaving = vueExports.ref(false);
    async function handleSave() {
      if (!quote.value || editLines.value.length === 0) return;
      isSaving.value = true;
      try {
        const payload = {
          note: editNote.value || null,
          lines: editLines.value.map((l) => ({
            line_type: l.line_type,
            reference_id: l.reference_id,
            name: l.name,
            quantity: l.quantity,
            unit: l.unit,
            unit_price: l.unit_price,
            purchase_price: l.purchase_price
          }))
        };
        await apiUpdateQuote(id.value, payload);
        toast.add({ title: "Đã lưu thay đổi", color: "success" });
        clearQuoteCache(id.value);
        navigateTo(`/pmc/quotes/${id.value}`);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu thất bại"), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    function handleCancel() {
      navigateTo(`/pmc/quotes/${id.value}`);
    }
    const {
      isTransitioning,
      showRejectModal,
      rejectNote,
      handleTransition,
      openRejectModal,
      confirmReject
    } = useQuoteTransition(id, {
      onSuccess: async () => {
        await navigateTo(`/pmc/quotes/${id.value}`);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UTable = _sfc_main$2;
      const _component_UBadge = _sfc_main$3;
      const _component_UIcon = _sfc_main$h;
      const _component_UFormField = _sfc_main$4;
      const _component_UTextarea = _sfc_main$5;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UModal = _sfc_main$6;
      const _component_QuoteLineFormModal = __nuxt_component_12;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-start justify-between gap-4"><div class="flex items-center gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: `/pmc/quotes/${vueExports.unref(id)}`
      }, null, _parent));
      _push(`<div><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Chỉnh sửa báo giá </h1><p class="text-slate-500 text-sm mt-0.5">`);
      if (vueExports.unref(quote)) {
        _push(`<span class="font-mono font-semibold">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(quote).code)}</span>`);
      } else {
        _push(`<span>...</span>`);
      }
      _push(`</p></div></div>`);
      if (vueExports.unref(quote)) {
        _push(`<div class="flex items-center gap-2 shrink-0">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Hủy",
          color: "neutral",
          variant: "ghost",
          onClick: handleCancel
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Lưu thay đổi",
          icon: "i-lucide-save",
          color: "primary",
          loading: vueExports.unref(isSaving),
          disabled: vueExports.unref(editLines).length === 0,
          onClick: handleSave
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="flex flex-col gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(3, (i) => {
          _push(`<div class="h-28 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(quote)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 flex flex-col gap-6">`);
        if (vueExports.unref(quote).status.value !== "draft") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            icon: "i-lucide-info",
            color: "info",
            variant: "subtle",
            title: "Lưu thay đổi sẽ đưa trạng thái về Nháp."
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Dòng báo giá" }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Thêm dòng",
                size: "sm",
                color: "primary",
                variant: "soft",
                onClick: ($event) => vueExports.unref(lineModal)?.open()
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-plus",
                  label: "Thêm dòng",
                  size: "sm",
                  color: "primary",
                  variant: "soft",
                  onClick: ($event) => vueExports.unref(lineModal)?.open()
                }, null, 8, ["onClick"])
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(editLines),
                columns: lineColumns
              }, {
                "line_type-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: ("QUOTE_LINE_TYPE_LABELS" in _ctx ? _ctx.QUOTE_LINE_TYPE_LABELS : vueExports.unref(QUOTE_LINE_TYPE_LABELS))[row.original.line_type] ?? row.original.line_type,
                      color: "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: ("QUOTE_LINE_TYPE_LABELS" in _ctx ? _ctx.QUOTE_LINE_TYPE_LABELS : vueExports.unref(QUOTE_LINE_TYPE_LABELS))[row.original.line_type] ?? row.original.line_type,
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
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.unit_price * row.original.quantity))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.unit_price * row.original.quantity)), 1)
                    ];
                  }
                }),
                "remove-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-trash-2",
                      color: "neutral",
                      variant: "ghost",
                      size: "xs",
                      class: "hover:text-red-500 hover:bg-red-50",
                      onClick: ($event) => removeEditLine(row.original.key)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-trash-2",
                        color: "neutral",
                        variant: "ghost",
                        size: "xs",
                        class: "hover:text-red-500 hover:bg-red-50",
                        onClick: ($event) => removeEditLine(row.original.key)
                      }, null, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(editLines).length === 0) {
                _push2(`<div class="text-center py-8"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-package-open",
                  class: "size-10 text-slate-300 mx-auto mb-2"
                }, null, _parent2, _scopeId));
                _push2(`<p class="text-sm text-slate-400"${_scopeId}> Chưa có dòng báo giá </p>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Thêm dòng đầu tiên",
                  icon: "i-lucide-plus",
                  color: "primary",
                  variant: "soft",
                  size: "sm",
                  class: "mt-3",
                  onClick: ($event) => vueExports.unref(lineModal)?.open()
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(editLines),
                  columns: lineColumns
                }, {
                  "line_type-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: ("QUOTE_LINE_TYPE_LABELS" in _ctx ? _ctx.QUOTE_LINE_TYPE_LABELS : vueExports.unref(QUOTE_LINE_TYPE_LABELS))[row.original.line_type] ?? row.original.line_type,
                      color: "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label"])
                  ]),
                  "unit_price-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.unit_price)), 1)
                  ]),
                  "line_amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.unit_price * row.original.quantity)), 1)
                  ]),
                  "remove-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-trash-2",
                      color: "neutral",
                      variant: "ghost",
                      size: "xs",
                      class: "hover:text-red-500 hover:bg-red-50",
                      onClick: ($event) => removeEditLine(row.original.key)
                    }, null, 8, ["onClick"])
                  ]),
                  _: 1
                }, 8, ["data"]),
                vueExports.unref(editLines).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "text-center py-8"
                }, [
                  vueExports.createVNode(_component_UIcon, {
                    name: "i-lucide-package-open",
                    class: "size-10 text-slate-300 mx-auto mb-2"
                  }),
                  vueExports.createVNode("p", { class: "text-sm text-slate-400" }, " Chưa có dòng báo giá "),
                  vueExports.createVNode(_component_UButton, {
                    label: "Thêm dòng đầu tiên",
                    icon: "i-lucide-plus",
                    color: "primary",
                    variant: "soft",
                    size: "sm",
                    class: "mt-3",
                    onClick: ($event) => vueExports.unref(lineModal)?.open()
                  }, null, 8, ["onClick"])
                ])) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Tổng kết" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><span class="text-sm font-medium text-slate-600"${_scopeId}>Tổng tiền</span><span class="text-lg font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(editTotalAmount)))}</span></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                      modelValue: vueExports.unref(editNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(editNote) ? editNote.value = $event : null,
                      placeholder: "Ghi chú nội bộ...",
                      rows: 3,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(editNote),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(editNote) ? editNote.value = $event : null,
                        placeholder: "Ghi chú nội bộ...",
                        rows: 3,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                  vueExports.createVNode("div", { class: "flex items-center justify-between" }, [
                    vueExports.createVNode("span", { class: "text-sm font-medium text-slate-600" }, "Tổng tiền"),
                    vueExports.createVNode("span", { class: "text-lg font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(editTotalAmount))), 1)
                  ]),
                  vueExports.createVNode(_component_UFormField, { label: "Ghi chú" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(editNote),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(editNote) ? editNote.value = $event : null,
                        placeholder: "Ghi chú nội bộ...",
                        rows: 3,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex items-center gap-3 lg:hidden">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Lưu thay đổi",
          icon: "i-lucide-save",
          color: "primary",
          loading: vueExports.unref(isSaving),
          disabled: vueExports.unref(editLines).length === 0,
          class: "flex-1",
          onClick: handleSave
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Hủy",
          color: "neutral",
          variant: "ghost",
          onClick: handleCancel
        }, null, _parent));
        _push(`</div></div><div class="flex flex-col gap-4">`);
        if (vueExports.unref(quote).is_active) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Hành động",
            compact: ""
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
              if (vueExports.unref(quote).og_ticket) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ticket" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/og-tickets/${vueExports.unref(quote).og_ticket.id}`,
                        class: "text-primary hover:underline text-sm"
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
                          class: "text-primary hover:underline text-sm"
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
                  vueExports.unref(quote).og_ticket ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 0,
                    label: "Ticket"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/og-tickets/${vueExports.unref(quote).og_ticket.id}`,
                        class: "text-primary hover:underline text-sm"
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
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Xem chi tiết",
          icon: "i-lucide-eye",
          color: "primary",
          variant: "soft",
          class: "w-full",
          to: `/pmc/quotes/${vueExports.unref(id)}`
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_QuoteLineFormModal, {
        ref_key: "lineModal",
        ref: lineModal,
        onAdd: onLineAdded
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/quotes/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-6EOZwilv.mjs.map
