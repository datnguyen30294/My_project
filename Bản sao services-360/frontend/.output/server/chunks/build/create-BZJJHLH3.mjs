import { v as vueExports, u as useSeoMeta, j as useToast, i as useRouter, p as useRoute$1, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h } from './server.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$2 } from './SelectMenu-DKHEMZj7.mjs';
import { _ as _sfc_main$3 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$5 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$6 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_12 } from './QuoteLineFormModal-1EmtTWTT.mjs';
import { _ as _sfc_main$7 } from './Modal-BimZZbNl.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { d as useQuoteCheckActive, e as QUOTE_LINE_TYPE_LABELS, f as QUOTE_CREATE_STATUS_OPTIONS, g as apiCreateQuote } from './useQuotes-C1-4FXSr.mjs';
import { u as useOgTicketList } from './useOgTickets-DPRh9tlL.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
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
import './Label-BBgw4vHh.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
import './Input-JXN8po_F.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './NumberInput-BfLKWOCC.mjs';
import './CatalogItemFormModal-D472wqf5.mjs';
import './ImageUpload-CCeUx1rz.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Separator-DeO-OPIs.mjs';
import './Separator-DtmsHEyk.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useCatalogSuppliers-DJ8n9zOn.mjs';
import './Textarea-DTCNHwKm.mjs';
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
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Tạo báo giá - Thần Nông" });
    const toast = useToast();
    const router = useRouter();
    const route = useRoute$1();
    const ogTicketSearch = vueExports.ref("");
    const selectedOgTicketId = vueExports.ref(
      route.query.og_ticket_id ? Number(route.query.og_ticket_id) : void 0
    );
    const { data: ogTicketsData, status: ogTicketsStatus } = useOgTicketList(
      vueExports.computed(() => ({
        search: ogTicketSearch.value || void 0,
        per_page: SELECT_ALL_PER_PAGE
      }))
    );
    const ogTicketOptions = vueExports.computed(
      () => (ogTicketsData.value?.data ?? []).map((t) => ({
        label: `${t.code} — ${t.subject}`,
        value: t.id
      }))
    );
    const { data: checkActiveData, execute: fetchCheckActive } = useQuoteCheckActive(selectedOgTicketId);
    vueExports.watch(selectedOgTicketId, (ticketId) => {
      if (ticketId) fetchCheckActive();
    }, { immediate: true });
    const activeQuoteInfo = vueExports.computed(() => checkActiveData.value?.data ?? null);
    const hasActiveQuote = vueExports.computed(() => activeQuoteInfo.value?.has_active_quote === true);
    const commissionFixedTotal = vueExports.computed(() => activeQuoteInfo.value?.commission_fixed_total ?? 0);
    const lines = vueExports.ref([]);
    let lineKeySeq = 0;
    vueExports.watch(activeQuoteInfo, (info) => {
      if (info?.has_active_quote && info.active_quote?.lines?.length) {
        lines.value = info.active_quote.lines.map((l) => ({
          key: ++lineKeySeq,
          source: "existing",
          line_type: l.line_type.value,
          reference_id: l.reference_id,
          name: l.name,
          quantity: l.quantity,
          unit: l.unit,
          unit_price: parseFloat(l.unit_price),
          purchase_price: l.purchase_price != null ? parseFloat(l.purchase_price) : 0
        }));
      } else {
        lines.value = [];
      }
    });
    const totalAmount = vueExports.computed(
      () => lines.value.reduce((sum, l) => sum + l.unit_price * l.quantity, 0)
    );
    const serviceAdhocTotal = vueExports.computed(
      () => lines.value.filter((l) => l.line_type === "service" || l.line_type === "adhoc").reduce((sum, l) => sum + l.unit_price * l.quantity, 0)
    );
    const isBelowCommissionFixed = vueExports.computed(
      () => commissionFixedTotal.value > 0 && serviceAdhocTotal.value < commissionFixedTotal.value
    );
    function removeLine(key) {
      lines.value = lines.value.filter((l) => l.key !== key);
    }
    const lineColumns = vueExports.computed(() => {
      const cols = [
        { accessorKey: "name", header: "Hạng mục" },
        { id: "line_type", header: "Loại" },
        { accessorKey: "quantity", header: "SL" },
        { accessorKey: "unit", header: "ĐVT" },
        { id: "unit_price", header: "Đơn giá" },
        { id: "line_amount", header: "Thành tiền" }
      ];
      if (hasActiveQuote.value) {
        cols.push({ id: "source", header: "Nguồn" });
      }
      cols.push(stickyRight({ id: "actions", header: "" }, { width: "w-[80px] min-w-[80px]" }));
      return cols;
    });
    const lineModal = vueExports.ref();
    function onLineAdded(line) {
      lines.value.push({ key: ++lineKeySeq, source: "new", ...line });
    }
    function onLineUpdated(updated) {
      const idx = lines.value.findIndex((l) => l.key === updated.key);
      if (idx === -1) return;
      const prevSource = lines.value[idx].source;
      lines.value[idx] = {
        ...updated,
        source: prevSource === "new" ? "new" : "modified"
      };
    }
    function editLine(item) {
      lineModal.value?.openEdit(item);
    }
    const selectedCreateStatus = vueExports.ref("draft");
    const isSubmitting = vueExports.ref(false);
    const showReplaceConfirm = vueExports.ref(false);
    const canSubmit = vueExports.computed(
      () => selectedOgTicketId.value && lines.value.length > 0 && !isBelowCommissionFixed.value
    );
    function handleSubmitClick() {
      if (!canSubmit.value) return;
      if (hasActiveQuote.value) {
        showReplaceConfirm.value = true;
      } else {
        doSubmit(false);
      }
    }
    function confirmReplace() {
      showReplaceConfirm.value = false;
      doSubmit(true);
    }
    async function doSubmit(replaceActive) {
      isSubmitting.value = true;
      try {
        const payload = {
          og_ticket_id: selectedOgTicketId.value,
          status: selectedCreateStatus.value,
          replace_active: replaceActive || void 0,
          lines: lines.value.map((l) => ({
            line_type: l.line_type,
            reference_id: l.reference_id,
            name: l.name,
            quantity: l.quantity,
            unit_price: l.unit_price,
            purchase_price: l.purchase_price
          }))
        };
        const res = await apiCreateQuote(payload);
        toast.add({ title: "Tạo báo giá thành công", color: "success" });
        router.push(`/pmc/quotes/${res.data.id}`);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Tạo báo giá thất bại"), color: "error" });
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$1;
      const _component_USelectMenu = _sfc_main$2;
      const _component_UAlert = _sfc_main$3;
      const _component_UIcon = _sfc_main$h;
      const _component_UTable = _sfc_main$4;
      const _component_UBadge = _sfc_main$5;
      const _component_USelect = _sfc_main$6;
      const _component_QuoteLineFormModal = __nuxt_component_12;
      const _component_UModal = _sfc_main$7;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-center gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/quotes",
        class: "shrink-0"
      }, null, _parent));
      _push(`<div><h1 class="text-xl font-bold text-slate-900"> Tạo báo giá </h1><p class="text-sm text-slate-500 mt-0.5"> Chọn ticket và thêm dòng vật tư / dịch vụ </p></div></div><div class="flex flex-col gap-6 max-w-4xl">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin nguồn" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Chọn ticket",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(selectedOgTicketId),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(selectedOgTicketId) ? selectedOgTicketId.value = $event : null,
                    "search-term": vueExports.unref(ogTicketSearch),
                    "onUpdate:searchTerm": ($event) => vueExports.isRef(ogTicketSearch) ? ogTicketSearch.value = $event : null,
                    items: vueExports.unref(ogTicketOptions),
                    "value-key": "value",
                    placeholder: "Tìm và chọn ticket...",
                    searchable: "",
                    loading: vueExports.unref(ogTicketsStatus) === "pending",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(selectedOgTicketId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedOgTicketId) ? selectedOgTicketId.value = $event : null,
                      "search-term": vueExports.unref(ogTicketSearch),
                      "onUpdate:searchTerm": ($event) => vueExports.isRef(ogTicketSearch) ? ogTicketSearch.value = $event : null,
                      items: vueExports.unref(ogTicketOptions),
                      "value-key": "value",
                      placeholder: "Tìm và chọn ticket...",
                      searchable: "",
                      loading: vueExports.unref(ogTicketsStatus) === "pending",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "search-term", "onUpdate:searchTerm", "items", "loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(hasActiveQuote)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-alert-triangle",
                color: "warning",
                variant: "subtle",
                description: "Các dòng từ báo giá cũ đã được điền sẵn. Bạn có thể thêm, xoá hoặc giữ nguyên. Tạo mới sẽ thay thế báo giá hiện tại."
              }, {
                title: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Ticket này đã có báo giá active: ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activeQuoteInfo)?.active_quote?.code)} (${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activeQuoteInfo)?.active_quote?.status.label)}) `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Ticket này đã có báo giá active: " + vueExports.toDisplayString(vueExports.unref(activeQuoteInfo)?.active_quote?.code) + " (" + vueExports.toDisplayString(vueExports.unref(activeQuoteInfo)?.active_quote?.status.label) + ") ", 1)
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
                vueExports.createVNode(_component_UFormField, {
                  label: "Chọn ticket",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(selectedOgTicketId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedOgTicketId) ? selectedOgTicketId.value = $event : null,
                      "search-term": vueExports.unref(ogTicketSearch),
                      "onUpdate:searchTerm": ($event) => vueExports.isRef(ogTicketSearch) ? ogTicketSearch.value = $event : null,
                      items: vueExports.unref(ogTicketOptions),
                      "value-key": "value",
                      placeholder: "Tìm và chọn ticket...",
                      searchable: "",
                      loading: vueExports.unref(ogTicketsStatus) === "pending",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "search-term", "onUpdate:searchTerm", "items", "loading"])
                  ]),
                  _: 1
                }),
                vueExports.unref(hasActiveQuote) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  icon: "i-lucide-alert-triangle",
                  color: "warning",
                  variant: "subtle",
                  description: "Các dòng từ báo giá cũ đã được điền sẵn. Bạn có thể thêm, xoá hoặc giữ nguyên. Tạo mới sẽ thay thế báo giá hiện tại."
                }, {
                  title: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Ticket này đã có báo giá active: " + vueExports.toDisplayString(vueExports.unref(activeQuoteInfo)?.active_quote?.code) + " (" + vueExports.toDisplayString(vueExports.unref(activeQuoteInfo)?.active_quote?.status.label) + ") ", 1)
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
            if (vueExports.unref(commissionFixedTotal) > 0) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-info",
                color: vueExports.unref(isBelowCommissionFixed) ? "error" : "info",
                variant: "subtle",
                class: "mb-4"
              }, {
                title: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Lưu ý chiết khấu dự án `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Lưu ý chiết khấu dự án ")
                    ];
                  }
                }),
                description: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p${_scopeId2}> Tổng tiền dịch vụ + tùy chọn phải <strong${_scopeId2}>≥ ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(commissionFixedTotal)))}</strong> (tổng tiền cố định chiết khấu phòng ban của dự án). </p>`);
                    if (vueExports.unref(lines).length > 0) {
                      _push3(`<p class="mt-1"${_scopeId2}> Hiện tại: <strong class="${serverRenderer_cjs_prodExports.ssrRenderClass(vueExports.unref(isBelowCommissionFixed) ? "text-red-600" : "text-green-600")}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(serviceAdhocTotal)))}</strong>`);
                      if (vueExports.unref(isBelowCommissionFixed)) {
                        _push3(`<span${_scopeId2}> — chưa đạt mức tối thiểu</span>`);
                      } else {
                        _push3(`<span${_scopeId2}> — đã đạt</span>`);
                      }
                      _push3(`</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      vueExports.createVNode("p", null, [
                        vueExports.createTextVNode(" Tổng tiền dịch vụ + tùy chọn phải "),
                        vueExports.createVNode("strong", null, "≥ " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(commissionFixedTotal))), 1),
                        vueExports.createTextVNode(" (tổng tiền cố định chiết khấu phòng ban của dự án). ")
                      ]),
                      vueExports.unref(lines).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                        key: 0,
                        class: "mt-1"
                      }, [
                        vueExports.createTextVNode(" Hiện tại: "),
                        vueExports.createVNode("strong", {
                          class: vueExports.unref(isBelowCommissionFixed) ? "text-red-600" : "text-green-600"
                        }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(serviceAdhocTotal))), 3),
                        vueExports.unref(isBelowCommissionFixed) ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, " — chưa đạt mức tối thiểu")) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, " — đã đạt"))
                      ])) : vueExports.createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(lines).length === 0) {
              _push2(`<div class="text-center py-8 text-slate-400"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-package",
                class: "size-8 mb-2"
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-sm"${_scopeId}> Chưa có dòng nào. Bấm &quot;Thêm dòng&quot; để bắt đầu. </p></div>`);
            } else {
              _push2(`<div${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(lines),
                columns: vueExports.unref(lineColumns)
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
                "source-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (row.original.source === "existing") {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        label: "Từ BG cũ",
                        color: "warning",
                        variant: "subtle",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    } else if (row.original.source === "modified") {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        label: "Đã sửa",
                        color: "info",
                        variant: "subtle",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        label: "Mới",
                        color: "success",
                        variant: "subtle",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    }
                  } else {
                    return [
                      row.original.source === "existing" ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 0,
                        label: "Từ BG cũ",
                        color: "warning",
                        variant: "subtle",
                        size: "sm"
                      })) : row.original.source === "modified" ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 1,
                        label: "Đã sửa",
                        color: "info",
                        variant: "subtle",
                        size: "sm"
                      })) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 2,
                        label: "Mới",
                        color: "success",
                        variant: "subtle",
                        size: "sm"
                      }))
                    ];
                  }
                }),
                "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center gap-1"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-pencil",
                      color: "neutral",
                      variant: "ghost",
                      size: "xs",
                      onClick: ($event) => editLine(row.original)
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-trash-2",
                      color: "neutral",
                      variant: "ghost",
                      size: "xs",
                      class: "hover:text-red-500 hover:bg-red-50",
                      onClick: ($event) => removeLine(row.original.key)
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-pencil",
                          color: "neutral",
                          variant: "ghost",
                          size: "xs",
                          onClick: ($event) => editLine(row.original)
                        }, null, 8, ["onClick"]),
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-trash-2",
                          color: "neutral",
                          variant: "ghost",
                          size: "xs",
                          class: "hover:text-red-500 hover:bg-red-50",
                          onClick: ($event) => removeLine(row.original.key)
                        }, null, 8, ["onClick"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
          } else {
            return [
              vueExports.unref(commissionFixedTotal) > 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 0,
                icon: "i-lucide-info",
                color: vueExports.unref(isBelowCommissionFixed) ? "error" : "info",
                variant: "subtle",
                class: "mb-4"
              }, {
                title: vueExports.withCtx(() => [
                  vueExports.createTextVNode(" Lưu ý chiết khấu dự án ")
                ]),
                description: vueExports.withCtx(() => [
                  vueExports.createVNode("p", null, [
                    vueExports.createTextVNode(" Tổng tiền dịch vụ + tùy chọn phải "),
                    vueExports.createVNode("strong", null, "≥ " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(commissionFixedTotal))), 1),
                    vueExports.createTextVNode(" (tổng tiền cố định chiết khấu phòng ban của dự án). ")
                  ]),
                  vueExports.unref(lines).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 0,
                    class: "mt-1"
                  }, [
                    vueExports.createTextVNode(" Hiện tại: "),
                    vueExports.createVNode("strong", {
                      class: vueExports.unref(isBelowCommissionFixed) ? "text-red-600" : "text-green-600"
                    }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(serviceAdhocTotal))), 3),
                    vueExports.unref(isBelowCommissionFixed) ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, " — chưa đạt mức tối thiểu")) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, " — đã đạt"))
                  ])) : vueExports.createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["color"])) : vueExports.createCommentVNode("", true),
              vueExports.unref(lines).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 1,
                class: "text-center py-8 text-slate-400"
              }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-package",
                  class: "size-8 mb-2"
                }),
                vueExports.createVNode("p", { class: "text-sm" }, ' Chưa có dòng nào. Bấm "Thêm dòng" để bắt đầu. ')
              ])) : (vueExports.openBlock(), vueExports.createBlock("div", { key: 2 }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(lines),
                  columns: vueExports.unref(lineColumns)
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
                  "source-cell": vueExports.withCtx(({ row }) => [
                    row.original.source === "existing" ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: "Từ BG cũ",
                      color: "warning",
                      variant: "subtle",
                      size: "sm"
                    })) : row.original.source === "modified" ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 1,
                      label: "Đã sửa",
                      color: "info",
                      variant: "subtle",
                      size: "sm"
                    })) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 2,
                      label: "Mới",
                      color: "success",
                      variant: "subtle",
                      size: "sm"
                    }))
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-pencil",
                        color: "neutral",
                        variant: "ghost",
                        size: "xs",
                        onClick: ($event) => editLine(row.original)
                      }, null, 8, ["onClick"]),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-trash-2",
                        color: "neutral",
                        variant: "ghost",
                        size: "xs",
                        class: "hover:text-red-500 hover:bg-red-50",
                        onClick: ($event) => removeLine(row.original.key)
                      }, null, 8, ["onClick"])
                    ])
                  ]),
                  _: 1
                }, 8, ["data", "columns"])
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      if (vueExports.unref(lines).length > 0) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tổng kết",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center justify-between"${_scopeId}><span class="text-sm font-medium text-slate-600"${_scopeId}>Tổng tiền</span><span class="text-lg font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalAmount)))}</span></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex items-center justify-between" }, [
                  vueExports.createVNode("span", { class: "text-sm font-medium text-slate-600" }, "Tổng tiền"),
                  vueExports.createVNode("span", { class: "text-lg font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalAmount))), 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
        title: "Thao tác",
        compact: ""
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap items-center justify-between gap-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Trạng thái khi tạo" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(selectedCreateStatus),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(selectedCreateStatus) ? selectedCreateStatus.value = $event : null,
                    items: "QUOTE_CREATE_STATUS_OPTIONS" in _ctx ? _ctx.QUOTE_CREATE_STATUS_OPTIONS : vueExports.unref(QUOTE_CREATE_STATUS_OPTIONS),
                    class: "w-56"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(selectedCreateStatus),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedCreateStatus) ? selectedCreateStatus.value = $event : null,
                      items: "QUOTE_CREATE_STATUS_OPTIONS" in _ctx ? _ctx.QUOTE_CREATE_STATUS_OPTIONS : vueExports.unref(QUOTE_CREATE_STATUS_OPTIONS),
                      class: "w-56"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Hủy",
              color: "neutral",
              variant: "ghost",
              to: "/pmc/quotes"
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Tạo báo giá",
              icon: "i-lucide-check",
              color: "primary",
              loading: vueExports.unref(isSubmitting),
              disabled: !vueExports.unref(canSubmit),
              onClick: handleSubmitClick
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-wrap items-center justify-between gap-4" }, [
                vueExports.createVNode("div", { class: "flex items-center gap-3" }, [
                  vueExports.createVNode(_component_UFormField, { label: "Trạng thái khi tạo" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_USelect, {
                        modelValue: vueExports.unref(selectedCreateStatus),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedCreateStatus) ? selectedCreateStatus.value = $event : null,
                        items: "QUOTE_CREATE_STATUS_OPTIONS" in _ctx ? _ctx.QUOTE_CREATE_STATUS_OPTIONS : vueExports.unref(QUOTE_CREATE_STATUS_OPTIONS),
                        class: "w-56"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  })
                ]),
                vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Hủy",
                    color: "neutral",
                    variant: "ghost",
                    to: "/pmc/quotes"
                  }),
                  vueExports.createVNode(_component_UButton, {
                    label: "Tạo báo giá",
                    icon: "i-lucide-check",
                    color: "primary",
                    loading: vueExports.unref(isSubmitting),
                    disabled: !vueExports.unref(canSubmit),
                    onClick: handleSubmitClick
                  }, null, 8, ["loading", "disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_QuoteLineFormModal, {
        ref_key: "lineModal",
        ref: lineModal,
        onAdd: onLineAdded,
        onUpdate: onLineUpdated
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showReplaceConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showReplaceConfirm) ? showReplaceConfirm.value = $event : null,
        title: "Xác nhận thay thế báo giá"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-slate-700"${_scopeId}> Báo giá hiện tại <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activeQuoteInfo)?.active_quote?.code)}</strong> sẽ bị thay thế. Tiếp tục? </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-slate-700" }, [
                vueExports.createTextVNode(" Báo giá hiện tại "),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(activeQuoteInfo)?.active_quote?.code), 1),
                vueExports.createTextVNode(" sẽ bị thay thế. Tiếp tục? ")
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
              onClick: ($event) => showReplaceConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận tạo",
              color: "primary",
              loading: vueExports.unref(isSubmitting),
              onClick: confirmReplace
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showReplaceConfirm.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận tạo",
                  color: "primary",
                  loading: vueExports.unref(isSubmitting),
                  onClick: confirmReplace
                }, null, 8, ["loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/quotes/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-BZJJHLH3.mjs.map
