import { v as vueExports, p as useRoute$1, j as useToast, u as useSeoMeta, o as useApiFetch, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, w as __nuxt_component_5$1, aL as __nuxt_component_6, q as navigateTo, $ as $api } from './server.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as _sfc_main$5 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$6 } from './Stepper-Bzh3Mxt9.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$7 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$8 } from './Table-17SH0cIR.mjs';
import { a as _sfc_main$1$1, _ as __nuxt_component_16 } from './OrderAcceptanceReportModal-BlOKlq6u.mjs';
import { _ as _sfc_main$9 } from './SelectMenu-DKHEMZj7.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { _ as _sfc_main$a } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$b } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_5$2 } from './NumberInput-BfLKWOCC.mjs';
import { g as getApiErrorMessage, a as getApiValidationErrors } from './apiError-DBrxF9au.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { _ as __nuxt_component_4$1 } from './FormFieldError-cu7WK1i1.mjs';
import { e as useOrderDetail, f as ORDER_STATUS_ALERT, g as ORDER_WORKFLOW_STEPS, h as useOrderActiveAccounts, o as orderStatusColor, i as advanceStatusColor, A as ADVANCE_STATUS_LABELS, j as apiUpdateOrder, k as clearOrderCache, l as apiSetOrderLineAdvancePayer, m as apiUpdateOrderLinePrices, n as apiTransitionOrder, c as apiDeleteOrder, d as apiCheckDeleteOrder } from './useOrders-Da-CMLMo.mjs';
import { i as useQuoteVersions, q as quoteStatusColor } from './useQuotes-C1-4FXSr.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { u as useCheckDelete } from './useCheckDelete-ka2wDn0T.mjs';
import { u as useCommissionMindmap } from './useCommissionMindmap-DoF1JQcV.mjs';
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
import './index-QmZAbLx-.mjs';
import './index-CSThDD3J.mjs';
import './index-Bkkr_xbW.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './utils-DY0Zag2O.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './useGraceArea-B6BTYtpN.mjs';
import './Input-JXN8po_F.mjs';
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
import './useAcceptanceReports-lSZWdtC6.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Label-BBgw4vHh.mjs';

const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "BreakdownTable",
  __ssrInlineRender: true,
  props: {
    rows: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "overflow-x-auto rounded-lg border border-slate-200" }, _attrs))}><table class="w-full text-sm"><thead><tr class="bg-slate-100 border-b border-slate-200"><th class="px-4 py-2 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider"> Bên nhận </th><th class="px-4 py-2 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider"> Công thức </th><th class="px-4 py-2 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider whitespace-nowrap"> Thành tiền </th></tr></thead><tbody><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(__props.rows, (row, idx) => {
        _push(`<tr class="${serverRenderer_cjs_prodExports.ssrRenderClass([
          row.isSummary ? "bg-slate-50 border-t-2 border-slate-300" : "bg-white",
          idx > 0 && !row.isSummary ? "border-t border-slate-100" : ""
        ])}"><td class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
          row.isSummary ? "font-bold text-slate-900" : "",
          row.level === 0 && !row.isSummary ? "font-medium text-slate-900" : "",
          row.level === 1 ? "text-slate-700" : "",
          row.level === 2 ? "text-slate-500 text-xs" : ""
        ], "px-4 py-2"])}"><div class="flex items-center gap-1.5" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ paddingLeft: row.isSummary ? "0" : `${row.level * 20}px` })}">`);
        if (row.level === 1) {
          _push(`<span class="text-slate-300">├</span>`);
        } else {
          _push(`<!---->`);
        }
        if (row.level === 2) {
          _push(`<span class="text-slate-300">└</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(row.label)}</span></div></td><td class="px-4 py-2 font-mono text-xs text-slate-400">${serverRenderer_cjs_prodExports.ssrInterpolate(row.formula)}</td><td class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
          row.isSummary ? "font-bold text-slate-900" : "",
          row.level === 0 && !row.isSummary && !row.isIntermediary ? "font-semibold text-slate-900" : "",
          row.isIntermediary ? "text-slate-400" : "",
          row.level === 2 ? "text-slate-500 text-xs" : ""
        ], "px-4 py-2 text-right font-mono whitespace-nowrap tabular-nums"])}">`);
        if (row.isIntermediary) {
          _push(`<!--[--> — <!--]-->`);
        } else {
          _push(`<!--[-->${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.amount))}<!--]-->`);
        }
        _push(`</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/commission/BreakdownTable.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_14 = Object.assign(_sfc_main$3, { __name: "CommissionBreakdownTable" });
const OVERRIDE_RECIPIENT_LABELS = {
  operating_company: "Công ty vận hành",
  board_of_directors: "Ban quản trị",
  staff: "Nhân viên"
};
function useCommissionOverride(orderId) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/orders/${vueExports.toValue(orderId)}/commission-override`),
    { watch: [() => vueExports.toValue(orderId)] }
  );
}
function apiSaveCommissionOverride(orderId, data) {
  return $api(`/pmc/orders/${orderId}/commission-override`, {
    method: "PUT",
    body: data
  });
}
function apiDeleteCommissionOverride(orderId) {
  return $api(`/pmc/orders/${orderId}/commission-override`, {
    method: "DELETE"
  });
}
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "OverrideModal",
  __ssrInlineRender: true,
  props: {
    orderId: {},
    commissionableTotal: {},
    platformAmount: {},
    existingOverrides: {}
  },
  emits: ["saved", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const overrides = vueExports.ref([]);
    const isSaving = vueExports.ref(false);
    const remainingForOverrides = vueExports.computed(
      () => Math.round((props.commissionableTotal - props.platformAmount) * 100) / 100
    );
    const totalOverrides = vueExports.computed(
      () => overrides.value.reduce((sum, o) => sum + (o.amount ?? 0), 0)
    );
    const difference = vueExports.computed(
      () => Math.round((remainingForOverrides.value - totalOverrides.value) * 100) / 100
    );
    const isBalanced = vueExports.computed(() => Math.abs(difference.value) < 0.01);
    const accountSearchTerm = vueExports.ref("");
    const accountSearchResults = vueExports.ref([]);
    const isSearchingAccounts = vueExports.ref(false);
    let accountSearchTimeout;
    const selectedAccountMap = vueExports.ref(/* @__PURE__ */ new Map());
    async function fetchAccounts(search) {
      isSearchingAccounts.value = true;
      try {
        const query = { is_active: 1, per_page: 20 };
        if (search) query.search = search;
        const res = await $api("/pmc/accounts", { query });
        accountSearchResults.value = (res.data ?? []).map((acc) => ({
          label: `${acc.name}${acc.employee_code ? ` (${acc.employee_code})` : ""}`,
          value: acc.id,
          name: acc.name
        }));
      } catch {
        accountSearchResults.value = [];
      } finally {
        isSearchingAccounts.value = false;
      }
    }
    vueExports.watch(accountSearchTerm, (val) => {
      clearTimeout(accountSearchTimeout);
      accountSearchTimeout = setTimeout(() => fetchAccounts(val || void 0), 300);
    });
    function getAccountItemsForRow(rowIndex) {
      const ownAccountId = overrides.value[rowIndex]?.account_id;
      const otherSelectedIds = new Set(
        overrides.value.filter((o, i) => i !== rowIndex && o.account_id).map((o) => o.account_id)
      );
      const items = /* @__PURE__ */ new Map();
      if (ownAccountId && selectedAccountMap.value.has(ownAccountId)) {
        const info = selectedAccountMap.value.get(ownAccountId);
        items.set(ownAccountId, { label: info.label, value: ownAccountId, name: info.name });
      }
      for (const r of accountSearchResults.value) {
        if (!otherSelectedIds.has(r.value)) {
          items.set(r.value, r);
        }
      }
      return Array.from(items.values());
    }
    function addStaff() {
      overrides.value.push({
        recipient_type: "staff",
        account_id: null,
        account_name: "",
        amount: null
      });
    }
    function removeOverride(index) {
      overrides.value.splice(index, 1);
    }
    function onAccountSelect(index, accountId) {
      const items = getAccountItemsForRow(index);
      const option = items.find((o) => o.value === accountId);
      if (option) {
        overrides.value[index].account_id = accountId;
        overrides.value[index].account_name = option.name;
        selectedAccountMap.value.set(accountId, { label: option.label, name: option.name });
      }
    }
    function fillRemaining(index) {
      const otherSum = overrides.value.reduce((sum, o, i) => i === index ? sum : sum + (o.amount ?? 0), 0);
      overrides.value[index].amount = Math.round((remainingForOverrides.value - otherSum) * 100) / 100;
    }
    async function handleSave() {
      if (!isBalanced.value) {
        toast.add({ title: "Tổng tiền chưa khớp", color: "error" });
        return;
      }
      const invalidStaff = overrides.value.find((o) => o.recipient_type === "staff" && !o.account_id);
      if (invalidStaff) {
        toast.add({ title: "Vui lòng chọn nhân viên cho tất cả dòng nhân viên", color: "error" });
        return;
      }
      isSaving.value = true;
      try {
        await apiSaveCommissionOverride(props.orderId, {
          overrides: overrides.value.map((o) => ({
            recipient_type: o.recipient_type,
            account_id: o.account_id,
            amount: o.amount ?? 0
          }))
        });
        toast.add({ title: "Đã lưu điều chỉnh hoa hồng", color: "success" });
        emit("saved");
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu thất bại"), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$a;
      const _component_UButton = _sfc_main$c;
      const _component_UFormField = _sfc_main$b;
      const _component_USelectMenu = _sfc_main$9;
      const _component_SharedNumberInput = __nuxt_component_5$2;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: true,
        "onUpdate:open": (v) => !v && emit("close")
      }, _attrs), {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h3 class="text-lg font-bold text-slate-900"${_scopeId}> Điều chỉnh hoa hồng </h3><p class="text-sm text-slate-500 mt-0.5"${_scopeId}> Tổng tiền dịch vụ: ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.commissionableTotal))}</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", null, [
                vueExports.createVNode("h3", { class: "text-lg font-bold text-slate-900" }, " Điều chỉnh hoa hồng "),
                vueExports.createVNode("p", { class: "text-sm text-slate-500 mt-0.5" }, " Tổng tiền dịch vụ: " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.commissionableTotal)), 1)
              ])
            ];
          }
        }),
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}><div class="p-3 bg-slate-50 rounded-lg border border-slate-200"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><span class="text-sm font-semibold text-slate-700"${_scopeId}>Platform</span></div><span class="text-sm font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.platformAmount))}</span></div></div><div class="p-2 bg-blue-50 rounded-lg text-sm text-blue-700 text-center font-medium"${_scopeId}> Số tiền cần phân bổ: ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(remainingForOverrides)))}</div><div class="flex flex-col gap-3"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(overrides), (item, idx) => {
              _push2(`<div class="p-3 rounded-lg border border-slate-200"${_scopeId}><div class="flex items-center justify-between mb-2"${_scopeId}><span class="text-sm font-semibold text-slate-700"${_scopeId}>`);
              if (item.recipient_type === "staff") {
                _push2(`<!--[--> Nhân viên <!--]-->`);
              } else {
                _push2(`<!--[-->${serverRenderer_cjs_prodExports.ssrInterpolate(("OVERRIDE_RECIPIENT_LABELS" in _ctx ? _ctx.OVERRIDE_RECIPIENT_LABELS : vueExports.unref(OVERRIDE_RECIPIENT_LABELS))[item.recipient_type])}<!--]-->`);
              }
              _push2(`</span><div class="flex items-center gap-1"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-calculator",
                size: "xs",
                color: "neutral",
                variant: "ghost",
                title: "Tự điền số tiền còn lại",
                onClick: ($event) => fillRemaining(idx)
              }, null, _parent2, _scopeId));
              if (item.recipient_type === "staff") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-trash-2",
                  size: "xs",
                  color: "error",
                  variant: "ghost",
                  onClick: ($event) => removeOverride(idx)
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([item.recipient_type === "staff" ? "sm:grid-cols-2" : "", "grid grid-cols-1 gap-2"])}"${_scopeId}>`);
              if (item.recipient_type === "staff") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tài khoản" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                        "model-value": item.account_id ?? void 0,
                        items: getAccountItemsForRow(idx),
                        "value-key": "value",
                        "ignore-filter": "",
                        loading: vueExports.unref(isSearchingAccounts),
                        "search-input": { placeholder: "Gõ tên hoặc mã NV..." },
                        placeholder: "Chọn nhân viên...",
                        "onUpdate:modelValue": ($event) => onAccountSelect(idx, $event),
                        "onUpdate:searchTerm": ($event) => accountSearchTerm.value = $event
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_USelectMenu, {
                          "model-value": item.account_id ?? void 0,
                          items: getAccountItemsForRow(idx),
                          "value-key": "value",
                          "ignore-filter": "",
                          loading: vueExports.unref(isSearchingAccounts),
                          "search-input": { placeholder: "Gõ tên hoặc mã NV..." },
                          placeholder: "Chọn nhân viên...",
                          "onUpdate:modelValue": ($event) => onAccountSelect(idx, $event),
                          "onUpdate:searchTerm": ($event) => accountSearchTerm.value = $event
                        }, null, 8, ["model-value", "items", "loading", "onUpdate:modelValue", "onUpdate:searchTerm"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Số tiền (đ)" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: item.amount,
                      "onUpdate:modelValue": ($event) => item.amount = $event,
                      min: 0,
                      placeholder: "0"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: item.amount,
                        "onUpdate:modelValue": ($event) => item.amount = $event,
                        min: 0,
                        placeholder: "0"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Thêm người nhận",
              color: "primary",
              variant: "soft",
              size: "sm",
              onClick: addStaff
            }, null, _parent2, _scopeId));
            _push2(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(isBalanced) ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200", "p-3 rounded-lg text-sm font-medium text-center"])}"${_scopeId}>`);
            if (vueExports.unref(isBalanced)) {
              _push2(`<!--[--> Tổng phân bổ: ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalOverrides)))} ✓ <!--]-->`);
            } else {
              _push2(`<!--[--> Tổng phân bổ: ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalOverrides)))} / ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(remainingForOverrides)))} — ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(difference) > 0 ? `thiếu ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(difference))}` : `dư ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Math.abs(vueExports.unref(difference)))}`)}<!--]-->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                vueExports.createVNode("div", { class: "p-3 bg-slate-50 rounded-lg border border-slate-200" }, [
                  vueExports.createVNode("div", { class: "flex items-center justify-between" }, [
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("span", { class: "text-sm font-semibold text-slate-700" }, "Platform")
                    ]),
                    vueExports.createVNode("span", { class: "text-sm font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.platformAmount)), 1)
                  ])
                ]),
                vueExports.createVNode("div", { class: "p-2 bg-blue-50 rounded-lg text-sm text-blue-700 text-center font-medium" }, " Số tiền cần phân bổ: " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(remainingForOverrides))), 1),
                vueExports.createVNode("div", { class: "flex flex-col gap-3" }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(overrides), (item, idx) => {
                    return vueExports.openBlock(), vueExports.createBlock("div", {
                      key: idx,
                      class: "p-3 rounded-lg border border-slate-200"
                    }, [
                      vueExports.createVNode("div", { class: "flex items-center justify-between mb-2" }, [
                        vueExports.createVNode("span", { class: "text-sm font-semibold text-slate-700" }, [
                          item.recipient_type === "staff" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                            vueExports.createTextVNode(" Nhân viên ")
                          ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                            vueExports.createTextVNode(vueExports.toDisplayString(("OVERRIDE_RECIPIENT_LABELS" in _ctx ? _ctx.OVERRIDE_RECIPIENT_LABELS : vueExports.unref(OVERRIDE_RECIPIENT_LABELS))[item.recipient_type]), 1)
                          ], 64))
                        ]),
                        vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                          vueExports.createVNode(_component_UButton, {
                            icon: "i-lucide-calculator",
                            size: "xs",
                            color: "neutral",
                            variant: "ghost",
                            title: "Tự điền số tiền còn lại",
                            onClick: ($event) => fillRemaining(idx)
                          }, null, 8, ["onClick"]),
                          item.recipient_type === "staff" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                            key: 0,
                            icon: "i-lucide-trash-2",
                            size: "xs",
                            color: "error",
                            variant: "ghost",
                            onClick: ($event) => removeOverride(idx)
                          }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true)
                        ])
                      ]),
                      vueExports.createVNode("div", {
                        class: ["grid grid-cols-1 gap-2", item.recipient_type === "staff" ? "sm:grid-cols-2" : ""]
                      }, [
                        item.recipient_type === "staff" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                          key: 0,
                          label: "Tài khoản"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_USelectMenu, {
                              "model-value": item.account_id ?? void 0,
                              items: getAccountItemsForRow(idx),
                              "value-key": "value",
                              "ignore-filter": "",
                              loading: vueExports.unref(isSearchingAccounts),
                              "search-input": { placeholder: "Gõ tên hoặc mã NV..." },
                              placeholder: "Chọn nhân viên...",
                              "onUpdate:modelValue": ($event) => onAccountSelect(idx, $event),
                              "onUpdate:searchTerm": ($event) => accountSearchTerm.value = $event
                            }, null, 8, ["model-value", "items", "loading", "onUpdate:modelValue", "onUpdate:searchTerm"])
                          ]),
                          _: 2
                        }, 1024)) : vueExports.createCommentVNode("", true),
                        vueExports.createVNode(_component_UFormField, { label: "Số tiền (đ)" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_SharedNumberInput, {
                              modelValue: item.amount,
                              "onUpdate:modelValue": ($event) => item.amount = $event,
                              min: 0,
                              placeholder: "0"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 2
                        }, 1024)
                      ], 2)
                    ]);
                  }), 128))
                ]),
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-plus",
                  label: "Thêm người nhận",
                  color: "primary",
                  variant: "soft",
                  size: "sm",
                  onClick: addStaff
                }),
                vueExports.createVNode("div", {
                  class: ["p-3 rounded-lg text-sm font-medium text-center", vueExports.unref(isBalanced) ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"]
                }, [
                  vueExports.unref(isBalanced) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                    vueExports.createTextVNode(" Tổng phân bổ: " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalOverrides))) + " ✓ ", 1)
                  ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                    vueExports.createTextVNode(" Tổng phân bổ: " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalOverrides))) + " / " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(remainingForOverrides))) + " — " + vueExports.toDisplayString(vueExports.unref(difference) > 0 ? `thiếu ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(difference))}` : `dư ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Math.abs(vueExports.unref(difference)))}`), 1)
                  ], 64))
                ], 2)
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Hủy",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => emit("close")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Lưu",
              icon: "i-lucide-save",
              color: "primary",
              loading: vueExports.unref(isSaving),
              disabled: !vueExports.unref(isBalanced),
              onClick: handleSave
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => emit("close")
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Lưu",
                  icon: "i-lucide-save",
                  color: "primary",
                  loading: vueExports.unref(isSaving),
                  disabled: !vueExports.unref(isBalanced),
                  onClick: handleSave
                }, null, 8, ["loading", "disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/commission/OverrideModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_15 = Object.assign(_sfc_main$2, { __name: "CommissionOverrideModal" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "OrderLinePricesModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    line: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const form = vueExports.reactive({
      unit_price: 0,
      purchase_price: 0
    });
    const lineTotal = vueExports.computed(() => form.unit_price * (props.line?.quantity ?? 0));
    vueExports.watch(() => props.open, (isOpen) => {
      if (!isOpen || !props.line) return;
      form.unit_price = parseFloat(String(props.line.unit_price)) || 0;
      form.purchase_price = props.line.purchase_price != null ? parseFloat(String(props.line.purchase_price)) || 0 : 0;
    });
    function handleSubmit() {
      emit("submit", {
        unit_price: form.unit_price,
        // Send null when user clears to 0 — 0 means "free" which is valid too, so only null when input was empty.
        // Here we treat 0 as "explicitly zero" and still send it. Use null only if user clears via separate action.
        purchase_price: form.purchase_price
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$a;
      const _component_UFormField = _sfc_main$b;
      const _component_SharedNumberInput = __nuxt_component_5$2;
      const _component_SharedCrudFormFieldError = __nuxt_component_4$1;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Sửa giá dòng đơn hàng",
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), vueExports.createSlots({
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Hủy",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Lưu",
              icon: "i-lucide-check",
              color: "primary",
              loading: __props.loading,
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
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Lưu",
                  icon: "i-lucide-check",
                  color: "primary",
                  loading: __props.loading,
                  onClick: handleSubmit
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 2
      }, [
        __props.line ? {
          name: "body",
          fn: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-4"${_scopeId}><div class="rounded-lg bg-slate-50 px-4 py-3 text-sm space-y-1"${_scopeId}><div class="flex justify-between gap-3"${_scopeId}><span class="text-slate-500"${_scopeId}>Hạng mục</span><span class="font-medium text-right"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.line.name)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Số lượng</span><span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.line.quantity)} ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.line.unit)}</span></div></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Giá nhập (đ)",
                name: "purchase_price",
                help: "Đơn giá nhập/gốc cho 1 đơn vị. Dùng để tính tiền ứng."
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(form).purchase_price,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).purchase_price = $event,
                      min: 0,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.purchase_price
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(form).purchase_price,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).purchase_price = $event,
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.purchase_price
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Giá bán (đ)",
                name: "unit_price",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(form).unit_price,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).unit_price = $event,
                      min: 0,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.unit_price
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(form).unit_price,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).unit_price = $event,
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.unit_price
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex items-center justify-between bg-primary-50 rounded-lg px-4 py-2"${_scopeId}><span class="text-sm text-slate-600"${_scopeId}>Thành tiền mới</span><span class="font-bold text-slate-900 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(lineTotal)))}</span></div></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                  vueExports.createVNode("div", { class: "rounded-lg bg-slate-50 px-4 py-3 text-sm space-y-1" }, [
                    vueExports.createVNode("div", { class: "flex justify-between gap-3" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Hạng mục"),
                      vueExports.createVNode("span", { class: "font-medium text-right" }, vueExports.toDisplayString(__props.line.name), 1)
                    ]),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Số lượng"),
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(__props.line.quantity) + " " + vueExports.toDisplayString(__props.line.unit), 1)
                    ])
                  ]),
                  vueExports.createVNode(_component_UFormField, {
                    label: "Giá nhập (đ)",
                    name: "purchase_price",
                    help: "Đơn giá nhập/gốc cho 1 đơn vị. Dùng để tính tiền ứng."
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(form).purchase_price,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).purchase_price = $event,
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.purchase_price
                      }, null, 8, ["errors"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, {
                    label: "Giá bán (đ)",
                    name: "unit_price",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(form).unit_price,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).unit_price = $event,
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.unit_price
                      }, null, 8, ["errors"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode("div", { class: "flex items-center justify-between bg-primary-50 rounded-lg px-4 py-2" }, [
                    vueExports.createVNode("span", { class: "text-sm text-slate-600" }, "Thành tiền mới"),
                    vueExports.createVNode("span", { class: "font-bold text-slate-900 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(lineTotal))), 1)
                  ])
                ])
              ];
            }
          }),
          key: "0"
        } : void 0
      ]), _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/order/OrderLinePricesModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_19 = Object.assign(_sfc_main$1, { __name: "OrderLinePricesModal" });
function useOrderTransition(id, options = {}) {
  const toast = useToast();
  const isTransitioning = vueExports.ref(false);
  async function handleTransition(targetStatus) {
    isTransitioning.value = true;
    try {
      await apiTransitionOrder(vueExports.toValue(id), { status: targetStatus });
      toast.add({ title: "Chuyển trạng thái thành công", color: "success" });
      clearOrderCache(vueExports.toValue(id));
      await options.onSuccess?.();
    } catch (err) {
      toast.add({ title: getApiErrorMessage(err, "Chuyển trạng thái thất bại"), color: "error" });
    } finally {
      isTransitioning.value = false;
    }
  }
  return {
    isTransitioning,
    handleTransition
  };
}
function useOrderCommissionSnapshots(orderId) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/orders/${vueExports.toValue(orderId)}/commission-snapshot`),
    { watch: [() => vueExports.toValue(orderId)] }
  );
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const toast = useToast();
    const { data, status, error, refresh } = useOrderDetail(id);
    const order = vueExports.computed(() => data.value?.data);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => order.value?.code ?? null));
    useSeoMeta({
      title: vueExports.computed(
        () => order.value ? `${order.value.code} - Đơn hàng` : "Chi tiết đơn hàng"
      )
    });
    const isDraft = vueExports.computed(() => order.value?.status.value === "draft");
    const isActionable = vueExports.computed(() => {
      const s = order.value?.status.value;
      return s === "draft" || s === "confirmed" || s === "in_progress";
    });
    const statusAlert = vueExports.computed(
      () => order.value ? ORDER_STATUS_ALERT[order.value.status.value] : null
    );
    const isCancelled = vueExports.computed(() => order.value?.status.value === "cancelled");
    const workflowSteps = vueExports.computed(
      () => ORDER_WORKFLOW_STEPS.map((step) => ({
        title: step.title,
        description: step.description,
        icon: isCancelled.value && step.value === currentStepBeforeCancel.value ? "i-lucide-x-circle" : step.icon,
        value: step.value
      }))
    );
    const currentStepBeforeCancel = vueExports.computed(() => {
      if (!isCancelled.value) return null;
      return "draft";
    });
    const currentStepValue = vueExports.computed(() => {
      if (!order.value) return "draft";
      if (isCancelled.value) return currentStepBeforeCancel.value ?? "draft";
      return order.value.status.value;
    });
    const ogTicketId = vueExports.computed(() => order.value?.og_ticket?.id ?? null);
    const { data: versionsData } = useQuoteVersions(ogTicketId);
    const quoteVersions = vueExports.computed(() => versionsData.value?.data ?? []);
    const isCompleted = vueExports.computed(() => order.value?.status.value === "completed");
    const showNewQuoteConfirm = vueExports.ref(false);
    function confirmNewQuote() {
      showNewQuoteConfirm.value = false;
      navigateTo(`/pmc/quotes/create?og_ticket_id=${ogTicketId.value}`);
    }
    const isEditingNote = vueExports.ref(false);
    const editNote = vueExports.ref("");
    const isSavingNote = vueExports.ref(false);
    function startEditNote() {
      editNote.value = order.value?.note ?? "";
      isEditingNote.value = true;
    }
    function cancelEditNote() {
      isEditingNote.value = false;
    }
    async function saveNote() {
      isSavingNote.value = true;
      try {
        await apiUpdateOrder(id.value, { note: editNote.value || null });
        toast.add({ title: "Đã lưu ghi chú", color: "success" });
        clearOrderCache(id.value);
        await refresh();
        isEditingNote.value = false;
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu thất bại"), color: "error" });
      } finally {
        isSavingNote.value = false;
      }
    }
    const lineColumns = [
      { accessorKey: "name", header: "Hạng mục" },
      { id: "line_type", header: "Loại" },
      { accessorKey: "quantity", header: "SL" },
      { accessorKey: "unit", header: "ĐVT" },
      { id: "purchase_price", header: "Giá nhập" },
      { id: "unit_price", header: "Giá bán" },
      { id: "line_amount", header: "Thành tiền" },
      {
        id: "advance_payer",
        header: "Người ứng",
        meta: {
          class: {
            th: "sticky right-10 z-20 bg-[var(--ui-bg-elevated)] w-44 min-w-44 max-w-44 shadow-[-6px_0_6px_-6px_rgba(0,0,0,0.08)]",
            td: "sticky right-10 z-10 bg-white w-44 min-w-44 max-w-44 shadow-[-6px_0_6px_-6px_rgba(0,0,0,0.08)]"
          }
        }
      },
      {
        id: "actions",
        header: "",
        meta: {
          class: {
            th: "sticky right-0 z-20 bg-[var(--ui-bg-elevated)] w-10 min-w-10",
            td: "sticky right-0 z-10 bg-white w-10 min-w-10"
          }
        }
      }
    ];
    const advancePayerPopoverLineId = vueExports.ref(null);
    const isSettingAdvancePayer = vueExports.ref(false);
    const debouncedAdvancePayerSearch = vueExports.ref("");
    const { searchInput: advancePayerSearch, onSearch: debounceAdvancePayerSearch } = useTableSearch((val) => {
      debouncedAdvancePayerSearch.value = val ?? "";
    });
    const { data: activeAccountsData, status: activeAccountsStatus, execute: fetchActiveAccounts } = useOrderActiveAccounts(debouncedAdvancePayerSearch);
    const activeAccountOptions = vueExports.computed(
      () => (activeAccountsData.value?.data ?? []).map((a) => ({
        label: a.employee_code ? `${a.name} (${a.employee_code})` : a.name,
        value: a.id
      }))
    );
    async function openAdvancePayerPopover(lineId) {
      advancePayerPopoverLineId.value = lineId;
      advancePayerSearch.value = "";
      debouncedAdvancePayerSearch.value = "";
      await fetchActiveAccounts();
    }
    async function handleSetAdvancePayer(line, advancePayerId) {
      isSettingAdvancePayer.value = true;
      try {
        await apiSetOrderLineAdvancePayer(id.value, line.id, advancePayerId);
        toast.add({ title: "Đã cập nhật người ứng tiền", color: "success" });
        clearOrderCache(id.value);
        await refresh();
        advancePayerPopoverLineId.value = null;
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Cập nhật thất bại"), color: "error" });
      } finally {
        isSettingAdvancePayer.value = false;
      }
    }
    const showPricesModal = vueExports.ref(false);
    const pricesTargetLine = vueExports.ref(null);
    const isSavingPrices = vueExports.ref(false);
    const pricesApiErrors = vueExports.ref({});
    function openPricesModal(line) {
      pricesTargetLine.value = line;
      pricesApiErrors.value = {};
      showPricesModal.value = true;
    }
    async function handleSavePrices(data2) {
      if (!pricesTargetLine.value) return;
      isSavingPrices.value = true;
      pricesApiErrors.value = {};
      try {
        await apiUpdateOrderLinePrices(id.value, pricesTargetLine.value.id, data2);
        toast.add({ title: "Đã cập nhật giá", color: "success" });
        clearOrderCache(id.value);
        await refresh();
        showPricesModal.value = false;
      } catch (err) {
        const errors = getApiValidationErrors(err);
        if (errors) {
          pricesApiErrors.value = errors;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Cập nhật giá thất bại"), color: "error" });
        }
      } finally {
        isSavingPrices.value = false;
      }
    }
    const {
      isTransitioning,
      handleTransition
    } = useOrderTransition(id, { onSuccess: () => refresh() });
    const showCancelConfirm = vueExports.ref(false);
    const showAcceptanceReport = vueExports.ref(false);
    function confirmCancel() {
      showCancelConfirm.value = false;
      handleTransition("cancelled");
    }
    const crud = useCrudModals();
    const { showDeleteModal: showDeleteConfirm } = crud;
    const { isDeleting, submitDelete } = useCrudSubmit(crud, async () => {
      await refresh();
    });
    const {
      isCheckingDelete,
      deleteBlockedMessage,
      openDeleteModal: _openDeleteModal,
      handleDelete: confirmDelete
    } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteOrder,
      deleteFn: apiDeleteOrder,
      successMessage: "Đã xoá đơn hàng",
      navigateAfter: "/pmc/orders"
    });
    function openDeleteConfirm() {
      if (order.value) _openDeleteModal(order.value);
    }
    const orderProjectId = vueExports.computed(() => order.value?.og_ticket?.project_id ?? null);
    const { data: commConfigData } = useApiFetch(
      vueExports.computed(
        () => orderProjectId.value ? `/pmc/commission/projects/${orderProjectId.value}` : false
      ),
      { watch: [orderProjectId] }
    );
    const commissionConfig = vueExports.computed(() => commConfigData.value?.data);
    const commissionInput = vueExports.computed(() => {
      const config = commissionConfig.value;
      if (!config || !orderProjectId.value) return null;
      const total = commissionableTotal.value;
      if (total <= 0) return null;
      return {
        total,
        platform: {
          percent: config.platform?.percent ?? 5,
          valueFixed: config.platform?.value_fixed ?? 1e3
        },
        partyRules: (config.party_rules ?? []).map((rule) => ({
          id: rule.party_type.value,
          name: rule.party_type.label,
          valueType: rule.value_type.value,
          percent: rule.percent ? parseFloat(rule.percent) : null,
          valueFixed: rule.value_fixed ? parseFloat(rule.value_fixed) : null
        })),
        deptRules: (config.dept_rules ?? []).map((rule) => ({
          id: rule.department.id,
          name: rule.department.name,
          sortOrder: rule.sort_order,
          valueType: rule.value_type.value,
          percent: rule.percent ? parseFloat(rule.percent) : null,
          valueFixed: rule.value_fixed ? parseFloat(rule.value_fixed) : null,
          staff: rule.staff_rules.map((s) => ({
            id: s.account.id,
            name: s.account.name,
            sortOrder: s.sort_order,
            valueType: s.value_type.value,
            percent: s.percent ? parseFloat(s.percent) : null,
            valueFixed: s.value_fixed ? parseFloat(s.value_fixed) : null
          }))
        }))
      };
    });
    const {
      mindmap: commissionMindmap,
      tableRows: commissionTableRows,
      diagramKey: commissionDiagramKey,
      errors: commissionErrors,
      isValid: isCommissionConfigValid
    } = useCommissionMindmap(commissionInput);
    const isFinanciallyLocked = vueExports.computed(() => order.value?.is_financially_locked === true);
    const { data: snapshotData } = useOrderCommissionSnapshots(id);
    const snapshots = vueExports.computed(() => snapshotData.value?.data ?? []);
    const snapshotTerminalRows = vueExports.computed(
      () => snapshots.value.filter((s) => !["management", "department"].includes(s.recipient_type.value))
    );
    const snapshotTotal = vueExports.computed(
      () => snapshotTerminalRows.value.reduce((sum, s) => sum + parseFloat(s.amount ?? "0"), 0)
    );
    const canOverride = vueExports.computed(() => {
      const s = order.value?.status.value;
      const isAdjuster = order.value?.is_adjuster === true;
      const isLocked = order.value?.is_financially_locked === true;
      return isAdjuster && !isLocked && (s === "confirmed" || s === "in_progress" || s === "accepted" || s === "completed");
    });
    const hasOverrides = vueExports.computed(() => order.value?.has_commission_overrides === true);
    const commissionableTotal = vueExports.computed(() => parseFloat(order.value?.commissionable_total ?? "0"));
    const { data: overrideData, refresh: refreshOverrides } = useCommissionOverride(id);
    const showOverrideModal = vueExports.ref(false);
    const overrideItems = vueExports.computed(() => overrideData.value?.data?.overrides ?? []);
    const platformAmountFromApi = vueExports.computed(() => parseFloat(overrideData.value?.data?.platform_amount ?? "0"));
    async function handleOverrideSaved() {
      showOverrideModal.value = false;
      await Promise.all([refresh(), refreshOverrides()]);
    }
    async function handleDeleteOverride() {
      try {
        await apiDeleteCommissionOverride(id.value);
        toast.add({ title: "Đã xoá điều chỉnh hoa hồng", color: "success" });
        await Promise.all([refresh(), refreshOverrides()]);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Xoá thất bại"), color: "error" });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$4;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UAlert = _sfc_main$5;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UStepper = _sfc_main$6;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UTextarea = _sfc_main$7;
      const _component_UTable = _sfc_main$8;
      const _component_UPopover = _sfc_main$1$1;
      const _component_USelectMenu = _sfc_main$9;
      const _component_ClientOnly = __nuxt_component_5$1;
      const _component_CommissionPreviewDiagram = __nuxt_component_6;
      const _component_CommissionBreakdownTable = __nuxt_component_14;
      const _component_CommissionOverrideModal = __nuxt_component_15;
      const _component_SharedOrderAcceptanceReportModal = __nuxt_component_16;
      const _component_UModal = _sfc_main$a;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      const _component_OrderLinePricesModal = __nuxt_component_19;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "pb-20 lg:pb-0" }, _attrs))}><div class="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4"><div class="flex items-center gap-3 sm:gap-4 min-w-0">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/orders",
        class: "shrink-0"
      }, null, _parent));
      _push(`<div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight"> Chi tiết đơn hàng </h1>`);
      if (vueExports.unref(order)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          label: vueExports.unref(order).status.label,
          color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(order).status.value),
          variant: "subtle",
          size: "sm"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-slate-500 text-sm mt-0.5">`);
      if (vueExports.unref(order)) {
        _push(`<span class="font-mono font-semibold">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).code)}</span>`);
      } else {
        _push(`<span>...</span>`);
      }
      _push(`</p></div></div>`);
      if (vueExports.unref(order) && vueExports.unref(isDraft)) {
        _push(`<div class="hidden sm:flex items-center gap-2 shrink-0">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-trash-2",
          label: "Xoá",
          color: "error",
          variant: "outline",
          size: "sm",
          onClick: ($event) => openDeleteConfirm()
        }, null, _parent));
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
      } else if (vueExports.unref(order)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"><div class="lg:col-span-2 flex flex-col gap-4 sm:gap-6">`);
        if (vueExports.unref(statusAlert)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            icon: vueExports.unref(statusAlert).icon,
            color: vueExports.unref(statusAlert).color,
            variant: "subtle",
            title: vueExports.unref(statusAlert).title
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Giai đoạn đơn hàng" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="overflow-x-auto -mx-1 px-1"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UStepper, {
                items: vueExports.unref(workflowSteps),
                "model-value": vueExports.unref(currentStepValue),
                disabled: "",
                linear: false,
                size: "sm",
                color: vueExports.unref(isCancelled) ? "error" : "primary",
                ui: vueExports.unref(isCancelled) ? {
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
                    color: vueExports.unref(isCancelled) ? "error" : "primary",
                    ui: vueExports.unref(isCancelled) ? {
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
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin tổng quan" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã đơn" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-mono font-semibold"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).code)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-mono font-semibold" }, vueExports.toDisplayString(vueExports.unref(order).code), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: vueExports.unref(order).status.label,
                      color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(order).status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(order).status.label,
                        color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(order).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(order).quote) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Báo giá" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/quotes/${vueExports.unref(order).quote.id}`,
                        class: "text-primary hover:underline font-mono text-sm font-medium"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).quote.code)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).quote.code), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        label: vueExports.unref(order).quote.status.label,
                        color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(vueExports.unref(order).quote.status.value),
                        variant: "subtle",
                        size: "xs"
                      }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      return [
                        vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/quotes/${vueExports.unref(order).quote.id}`,
                            class: "text-primary hover:underline font-mono text-sm font-medium"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).quote.code), 1)
                            ]),
                            _: 1
                          }, 8, ["to"]),
                          vueExports.createVNode(_component_UBadge, {
                            label: vueExports.unref(order).quote.status.label,
                            color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(vueExports.unref(order).quote.status.value),
                            variant: "subtle",
                            size: "xs"
                          }, null, 8, ["label", "color"])
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(order).og_ticket) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ticket" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/og-tickets/${vueExports.unref(order).og_ticket.id}`,
                        class: "text-primary hover:underline font-medium"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).og_ticket.subject)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).og_ticket.subject), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/og-tickets/${vueExports.unref(order).og_ticket.id}`,
                          class: "text-primary hover:underline font-medium"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).og_ticket.subject), 1)
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
              if (vueExports.unref(order).og_ticket) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người yêu cầu" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).og_ticket.requester_name)}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).og_ticket.requester_name), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tổng tiền" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-bold text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).total_amount))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).total_amount)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã đơn" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-mono font-semibold" }, vueExports.toDisplayString(vueExports.unref(order).code), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(order).status.label,
                        color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(order).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.unref(order).quote ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 0,
                    label: "Báo giá"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/quotes/${vueExports.unref(order).quote.id}`,
                          class: "text-primary hover:underline font-mono text-sm font-medium"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).quote.code), 1)
                          ]),
                          _: 1
                        }, 8, ["to"]),
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(order).quote.status.label,
                          color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(vueExports.unref(order).quote.status.value),
                          variant: "subtle",
                          size: "xs"
                        }, null, 8, ["label", "color"])
                      ])
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(order).og_ticket ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 1,
                    label: "Ticket"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/og-tickets/${vueExports.unref(order).og_ticket.id}`,
                        class: "text-primary hover:underline font-medium"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).og_ticket.subject), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(order).og_ticket ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 2,
                    label: "Người yêu cầu"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).og_ticket.requester_name), 1)
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tổng tiền" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).total_amount)), 1)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Ghi chú" }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!vueExports.unref(isEditingNote)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-pencil",
                  label: "Sửa",
                  size: "sm",
                  color: "neutral",
                  variant: "ghost",
                  onClick: startEditNote
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                !vueExports.unref(isEditingNote) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 0,
                  icon: "i-lucide-pencil",
                  label: "Sửa",
                  size: "sm",
                  color: "neutral",
                  variant: "ghost",
                  onClick: startEditNote
                })) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!vueExports.unref(isEditingNote)) {
                _push2(`<!--[-->`);
                if (vueExports.unref(order).note) {
                  _push2(`<p class="whitespace-pre-line text-sm text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).note)}</p>`);
                } else {
                  _push2(`<p class="text-sm text-slate-400 italic"${_scopeId}> Chưa có ghi chú. </p>`);
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                  modelValue: vueExports.unref(editNote),
                  "onUpdate:modelValue": ($event) => vueExports.isRef(editNote) ? editNote.value = $event : null,
                  placeholder: "Nhập ghi chú...",
                  rows: 3,
                  class: "w-full"
                }, null, _parent2, _scopeId));
                _push2(`<div class="flex justify-end gap-2 mt-3"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  disabled: vueExports.unref(isSavingNote),
                  onClick: cancelEditNote
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Lưu",
                  icon: "i-lucide-save",
                  color: "primary",
                  size: "sm",
                  loading: vueExports.unref(isSavingNote),
                  onClick: saveNote
                }, null, _parent2, _scopeId));
                _push2(`</div><!--]-->`);
              }
            } else {
              return [
                !vueExports.unref(isEditingNote) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.unref(order).note ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 0,
                    class: "whitespace-pre-line text-sm text-slate-700"
                  }, vueExports.toDisplayString(vueExports.unref(order).note), 1)) : (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 1,
                    class: "text-sm text-slate-400 italic"
                  }, " Chưa có ghi chú. "))
                ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(editNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(editNote) ? editNote.value = $event : null,
                    placeholder: "Nhập ghi chú...",
                    rows: 3,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode("div", { class: "flex justify-end gap-2 mt-3" }, [
                    vueExports.createVNode(_component_UButton, {
                      label: "Hủy",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      disabled: vueExports.unref(isSavingNote),
                      onClick: cancelEditNote
                    }, null, 8, ["disabled"]),
                    vueExports.createVNode(_component_UButton, {
                      label: "Lưu",
                      icon: "i-lucide-save",
                      color: "primary",
                      size: "sm",
                      loading: vueExports.unref(isSavingNote),
                      onClick: saveNote
                    }, null, 8, ["loading"])
                  ])
                ], 64))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Dòng đơn hàng" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="sm:hidden flex flex-col gap-3"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(order).lines, (line) => {
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
                data: vueExports.unref(order).lines,
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
                "purchase_price-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (row.original.purchase_price) {
                      _push3(`<span class="text-slate-600"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.purchase_price))}</span>`);
                    } else {
                      _push3(`<span class="text-slate-300"${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      row.original.purchase_price ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-slate-600"
                      }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.purchase_price)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-300"
                      }, "—"))
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
                "advance_payer-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (row.original.line_type.value !== "material") {
                      _push3(`<div class="text-xs text-slate-300"${_scopeId2}> — </div>`);
                    } else {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UPopover, {
                        open: vueExports.unref(advancePayerPopoverLineId) === row.original.id,
                        "onUpdate:open": (v) => {
                          if (v) openAdvancePayerPopover(row.original.id);
                          else advancePayerPopoverLineId.value = null;
                        }
                      }, {
                        content: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="p-3 w-72 flex flex-col gap-3"${_scopeId3}><p class="text-xs font-semibold text-slate-700"${_scopeId3}> Chọn người ứng tiền </p>`);
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                              "search-term": vueExports.unref(advancePayerSearch),
                              "onUpdate:searchTerm": [($event) => vueExports.isRef(advancePayerSearch) ? advancePayerSearch.value = $event : null, vueExports.unref(debounceAdvancePayerSearch)],
                              "model-value": row.original.advance_payer?.id ?? void 0,
                              items: vueExports.unref(activeAccountOptions),
                              "value-key": "value",
                              placeholder: "Tìm và chọn nhân sự...",
                              searchable: "",
                              "ignore-filter": "",
                              loading: vueExports.unref(activeAccountsStatus) === "pending",
                              class: "w-full",
                              "onUpdate:modelValue": (v) => handleSetAdvancePayer(row.original, v)
                            }, null, _parent4, _scopeId3));
                            if (row.original.advance_payer) {
                              _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                                label: "Xoá gán",
                                icon: "i-lucide-trash-2",
                                color: "error",
                                variant: "ghost",
                                size: "xs",
                                loading: vueExports.unref(isSettingAdvancePayer),
                                onClick: ($event) => handleSetAdvancePayer(row.original, null)
                              }, null, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                            if (!vueExports.unref(activeAccountOptions).length) {
                              _push4(`<p class="text-xs text-slate-400"${_scopeId3}> Chưa có nhân sự khả dụng. </p>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div>`);
                          } else {
                            return [
                              vueExports.createVNode("div", { class: "p-3 w-72 flex flex-col gap-3" }, [
                                vueExports.createVNode("p", { class: "text-xs font-semibold text-slate-700" }, " Chọn người ứng tiền "),
                                vueExports.createVNode(_component_USelectMenu, {
                                  "search-term": vueExports.unref(advancePayerSearch),
                                  "onUpdate:searchTerm": [($event) => vueExports.isRef(advancePayerSearch) ? advancePayerSearch.value = $event : null, vueExports.unref(debounceAdvancePayerSearch)],
                                  "model-value": row.original.advance_payer?.id ?? void 0,
                                  items: vueExports.unref(activeAccountOptions),
                                  "value-key": "value",
                                  placeholder: "Tìm và chọn nhân sự...",
                                  searchable: "",
                                  "ignore-filter": "",
                                  loading: vueExports.unref(activeAccountsStatus) === "pending",
                                  class: "w-full",
                                  "onUpdate:modelValue": (v) => handleSetAdvancePayer(row.original, v)
                                }, null, 8, ["search-term", "onUpdate:searchTerm", "model-value", "items", "loading", "onUpdate:modelValue"]),
                                row.original.advance_payer ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                                  key: 0,
                                  label: "Xoá gán",
                                  icon: "i-lucide-trash-2",
                                  color: "error",
                                  variant: "ghost",
                                  size: "xs",
                                  loading: vueExports.unref(isSettingAdvancePayer),
                                  onClick: ($event) => handleSetAdvancePayer(row.original, null)
                                }, null, 8, ["loading", "onClick"])) : vueExports.createCommentVNode("", true),
                                !vueExports.unref(activeAccountOptions).length ? (vueExports.openBlock(), vueExports.createBlock("p", {
                                  key: 1,
                                  class: "text-xs text-slate-400"
                                }, " Chưa có nhân sự khả dụng. ")) : vueExports.createCommentVNode("", true)
                              ])
                            ];
                          }
                        }),
                        default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -mx-2 -my-1"${_scopeId3}>`);
                            if (row.original.advance_payer) {
                              _push4(`<div class="flex flex-col min-w-0"${_scopeId3}><span class="text-sm font-medium text-slate-700 truncate"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.advance_payer.name)}</span>`);
                              _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                                label: ("ADVANCE_STATUS_LABELS" in _ctx ? _ctx.ADVANCE_STATUS_LABELS : vueExports.unref(ADVANCE_STATUS_LABELS))[row.original.advance_status],
                                color: ("advanceStatusColor" in _ctx ? _ctx.advanceStatusColor : vueExports.unref(advanceStatusColor))(row.original.advance_status),
                                variant: "subtle",
                                size: "xs",
                                class: "self-start mt-0.5"
                              }, null, _parent4, _scopeId3));
                              _push4(`</div>`);
                            } else {
                              _push4(`<span class="text-xs text-slate-400 italic"${_scopeId3}> + Gán người ứng </span>`);
                            }
                            _push4(`</div>`);
                          } else {
                            return [
                              vueExports.createVNode("div", { class: "flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -mx-2 -my-1" }, [
                                row.original.advance_payer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                                  key: 0,
                                  class: "flex flex-col min-w-0"
                                }, [
                                  vueExports.createVNode("span", { class: "text-sm font-medium text-slate-700 truncate" }, vueExports.toDisplayString(row.original.advance_payer.name), 1),
                                  vueExports.createVNode(_component_UBadge, {
                                    label: ("ADVANCE_STATUS_LABELS" in _ctx ? _ctx.ADVANCE_STATUS_LABELS : vueExports.unref(ADVANCE_STATUS_LABELS))[row.original.advance_status],
                                    color: ("advanceStatusColor" in _ctx ? _ctx.advanceStatusColor : vueExports.unref(advanceStatusColor))(row.original.advance_status),
                                    variant: "subtle",
                                    size: "xs",
                                    class: "self-start mt-0.5"
                                  }, null, 8, ["label", "color"])
                                ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                                  key: 1,
                                  class: "text-xs text-slate-400 italic"
                                }, " + Gán người ứng "))
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    }
                  } else {
                    return [
                      row.original.line_type.value !== "material" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "text-xs text-slate-300"
                      }, " — ")) : (vueExports.openBlock(), vueExports.createBlock(_component_UPopover, {
                        key: 1,
                        open: vueExports.unref(advancePayerPopoverLineId) === row.original.id,
                        "onUpdate:open": (v) => {
                          if (v) openAdvancePayerPopover(row.original.id);
                          else advancePayerPopoverLineId.value = null;
                        }
                      }, {
                        content: vueExports.withCtx(() => [
                          vueExports.createVNode("div", { class: "p-3 w-72 flex flex-col gap-3" }, [
                            vueExports.createVNode("p", { class: "text-xs font-semibold text-slate-700" }, " Chọn người ứng tiền "),
                            vueExports.createVNode(_component_USelectMenu, {
                              "search-term": vueExports.unref(advancePayerSearch),
                              "onUpdate:searchTerm": [($event) => vueExports.isRef(advancePayerSearch) ? advancePayerSearch.value = $event : null, vueExports.unref(debounceAdvancePayerSearch)],
                              "model-value": row.original.advance_payer?.id ?? void 0,
                              items: vueExports.unref(activeAccountOptions),
                              "value-key": "value",
                              placeholder: "Tìm và chọn nhân sự...",
                              searchable: "",
                              "ignore-filter": "",
                              loading: vueExports.unref(activeAccountsStatus) === "pending",
                              class: "w-full",
                              "onUpdate:modelValue": (v) => handleSetAdvancePayer(row.original, v)
                            }, null, 8, ["search-term", "onUpdate:searchTerm", "model-value", "items", "loading", "onUpdate:modelValue"]),
                            row.original.advance_payer ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                              key: 0,
                              label: "Xoá gán",
                              icon: "i-lucide-trash-2",
                              color: "error",
                              variant: "ghost",
                              size: "xs",
                              loading: vueExports.unref(isSettingAdvancePayer),
                              onClick: ($event) => handleSetAdvancePayer(row.original, null)
                            }, null, 8, ["loading", "onClick"])) : vueExports.createCommentVNode("", true),
                            !vueExports.unref(activeAccountOptions).length ? (vueExports.openBlock(), vueExports.createBlock("p", {
                              key: 1,
                              class: "text-xs text-slate-400"
                            }, " Chưa có nhân sự khả dụng. ")) : vueExports.createCommentVNode("", true)
                          ])
                        ]),
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode("div", { class: "flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -mx-2 -my-1" }, [
                            row.original.advance_payer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                              key: 0,
                              class: "flex flex-col min-w-0"
                            }, [
                              vueExports.createVNode("span", { class: "text-sm font-medium text-slate-700 truncate" }, vueExports.toDisplayString(row.original.advance_payer.name), 1),
                              vueExports.createVNode(_component_UBadge, {
                                label: ("ADVANCE_STATUS_LABELS" in _ctx ? _ctx.ADVANCE_STATUS_LABELS : vueExports.unref(ADVANCE_STATUS_LABELS))[row.original.advance_status],
                                color: ("advanceStatusColor" in _ctx ? _ctx.advanceStatusColor : vueExports.unref(advanceStatusColor))(row.original.advance_status),
                                variant: "subtle",
                                size: "xs",
                                class: "self-start mt-0.5"
                              }, null, 8, ["label", "color"])
                            ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                              key: 1,
                              class: "text-xs text-slate-400 italic"
                            }, " + Gán người ứng "))
                          ])
                        ]),
                        _: 2
                      }, 1032, ["open", "onUpdate:open"]))
                    ];
                  }
                }),
                "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-pencil",
                      size: "xs",
                      variant: "ghost",
                      color: "neutral",
                      title: "Sửa giá nhập / giá bán",
                      onClick: ($event) => openPricesModal(row.original)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-pencil",
                        size: "xs",
                        variant: "ghost",
                        color: "neutral",
                        title: "Sửa giá nhập / giá bán",
                        onClick: ($event) => openPricesModal(row.original)
                      }, null, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "sm:hidden flex flex-col gap-3" }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(order).lines, (line) => {
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
                    data: vueExports.unref(order).lines,
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
                    "purchase_price-cell": vueExports.withCtx(({ row }) => [
                      row.original.purchase_price ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-slate-600"
                      }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.purchase_price)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-300"
                      }, "—"))
                    ]),
                    "line_amount-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.line_amount)), 1)
                    ]),
                    "advance_payer-cell": vueExports.withCtx(({ row }) => [
                      row.original.line_type.value !== "material" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "text-xs text-slate-300"
                      }, " — ")) : (vueExports.openBlock(), vueExports.createBlock(_component_UPopover, {
                        key: 1,
                        open: vueExports.unref(advancePayerPopoverLineId) === row.original.id,
                        "onUpdate:open": (v) => {
                          if (v) openAdvancePayerPopover(row.original.id);
                          else advancePayerPopoverLineId.value = null;
                        }
                      }, {
                        content: vueExports.withCtx(() => [
                          vueExports.createVNode("div", { class: "p-3 w-72 flex flex-col gap-3" }, [
                            vueExports.createVNode("p", { class: "text-xs font-semibold text-slate-700" }, " Chọn người ứng tiền "),
                            vueExports.createVNode(_component_USelectMenu, {
                              "search-term": vueExports.unref(advancePayerSearch),
                              "onUpdate:searchTerm": [($event) => vueExports.isRef(advancePayerSearch) ? advancePayerSearch.value = $event : null, vueExports.unref(debounceAdvancePayerSearch)],
                              "model-value": row.original.advance_payer?.id ?? void 0,
                              items: vueExports.unref(activeAccountOptions),
                              "value-key": "value",
                              placeholder: "Tìm và chọn nhân sự...",
                              searchable: "",
                              "ignore-filter": "",
                              loading: vueExports.unref(activeAccountsStatus) === "pending",
                              class: "w-full",
                              "onUpdate:modelValue": (v) => handleSetAdvancePayer(row.original, v)
                            }, null, 8, ["search-term", "onUpdate:searchTerm", "model-value", "items", "loading", "onUpdate:modelValue"]),
                            row.original.advance_payer ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                              key: 0,
                              label: "Xoá gán",
                              icon: "i-lucide-trash-2",
                              color: "error",
                              variant: "ghost",
                              size: "xs",
                              loading: vueExports.unref(isSettingAdvancePayer),
                              onClick: ($event) => handleSetAdvancePayer(row.original, null)
                            }, null, 8, ["loading", "onClick"])) : vueExports.createCommentVNode("", true),
                            !vueExports.unref(activeAccountOptions).length ? (vueExports.openBlock(), vueExports.createBlock("p", {
                              key: 1,
                              class: "text-xs text-slate-400"
                            }, " Chưa có nhân sự khả dụng. ")) : vueExports.createCommentVNode("", true)
                          ])
                        ]),
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode("div", { class: "flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -mx-2 -my-1" }, [
                            row.original.advance_payer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                              key: 0,
                              class: "flex flex-col min-w-0"
                            }, [
                              vueExports.createVNode("span", { class: "text-sm font-medium text-slate-700 truncate" }, vueExports.toDisplayString(row.original.advance_payer.name), 1),
                              vueExports.createVNode(_component_UBadge, {
                                label: ("ADVANCE_STATUS_LABELS" in _ctx ? _ctx.ADVANCE_STATUS_LABELS : vueExports.unref(ADVANCE_STATUS_LABELS))[row.original.advance_status],
                                color: ("advanceStatusColor" in _ctx ? _ctx.advanceStatusColor : vueExports.unref(advanceStatusColor))(row.original.advance_status),
                                variant: "subtle",
                                size: "xs",
                                class: "self-start mt-0.5"
                              }, null, 8, ["label", "color"])
                            ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                              key: 1,
                              class: "text-xs text-slate-400 italic"
                            }, " + Gán người ứng "))
                          ])
                        ]),
                        _: 2
                      }, 1032, ["open", "onUpdate:open"]))
                    ]),
                    "actions-cell": vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-pencil",
                        size: "xs",
                        variant: "ghost",
                        color: "neutral",
                        title: "Sửa giá nhập / giá bán",
                        onClick: ($event) => openPricesModal(row.original)
                      }, null, 8, ["onClick"])
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
              _push2(`<div class="flex items-center justify-between"${_scopeId}><span class="text-sm font-medium text-slate-600"${_scopeId}>Tổng tiền</span><span class="text-lg font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).total_amount))}</span></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex items-center justify-between" }, [
                  vueExports.createVNode("span", { class: "text-sm font-medium text-slate-600" }, "Tổng tiền"),
                  vueExports.createVNode("span", { class: "text-lg font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).total_amount)), 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(isFinanciallyLocked) || vueExports.unref(commissionMindmap).length > 0 || vueExports.unref(hasOverrides) || !vueExports.unref(isCommissionConfigValid)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Chia hoa hồng" }, {
            "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
                if (vueExports.unref(isFinanciallyLocked)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: "Đã chốt kỳ",
                    color: "neutral",
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (!vueExports.unref(isFinanciallyLocked) && vueExports.unref(hasOverrides)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: "Đã điều chỉnh",
                    color: "warning",
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(canOverride)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: vueExports.unref(hasOverrides) ? "i-lucide-pencil" : "i-lucide-sliders-horizontal",
                    label: vueExports.unref(hasOverrides) ? "Sửa" : "Điều chỉnh",
                    size: "sm",
                    color: "primary",
                    variant: "soft",
                    onClick: ($event) => showOverrideModal.value = true
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(canOverride) && vueExports.unref(hasOverrides)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-undo-2",
                    label: "Xoá điều chỉnh",
                    size: "sm",
                    color: "error",
                    variant: "ghost",
                    onClick: handleDeleteOverride
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                    vueExports.unref(isFinanciallyLocked) ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: "Đã chốt kỳ",
                      color: "neutral",
                      variant: "subtle",
                      size: "sm"
                    })) : vueExports.createCommentVNode("", true),
                    !vueExports.unref(isFinanciallyLocked) && vueExports.unref(hasOverrides) ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 1,
                      label: "Đã điều chỉnh",
                      color: "warning",
                      variant: "subtle",
                      size: "sm"
                    })) : vueExports.createCommentVNode("", true),
                    vueExports.unref(canOverride) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                      key: 2,
                      icon: vueExports.unref(hasOverrides) ? "i-lucide-pencil" : "i-lucide-sliders-horizontal",
                      label: vueExports.unref(hasOverrides) ? "Sửa" : "Điều chỉnh",
                      size: "sm",
                      color: "primary",
                      variant: "soft",
                      onClick: ($event) => showOverrideModal.value = true
                    }, null, 8, ["icon", "label", "onClick"])) : vueExports.createCommentVNode("", true),
                    vueExports.unref(canOverride) && vueExports.unref(hasOverrides) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                      key: 3,
                      icon: "i-lucide-undo-2",
                      label: "Xoá điều chỉnh",
                      size: "sm",
                      color: "error",
                      variant: "ghost",
                      onClick: handleDeleteOverride
                    })) : vueExports.createCommentVNode("", true)
                  ])
                ];
              }
            }),
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(isFinanciallyLocked)) {
                  _push2(`<div class="flex flex-col gap-2"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(snapshotTerminalRows), (snap) => {
                    _push2(`<div class="flex items-center justify-between p-2 rounded-lg border border-slate-100"${_scopeId}><div class="flex items-center gap-2 min-w-0"${_scopeId}>`);
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: snap.recipient_type.label,
                      color: snap.recipient_type.value === "platform" ? "neutral" : snap.recipient_type.value === "staff" ? "primary" : "info",
                      variant: "subtle",
                      size: "xs"
                    }, null, _parent2, _scopeId));
                    _push2(`<span class="text-sm text-slate-700 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(snap.recipient_name)}</span></div><span class="text-sm font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(parseFloat(snap.amount)))}</span></div>`);
                  });
                  _push2(`<!--]-->`);
                  if (vueExports.unref(snapshotTerminalRows).length === 0) {
                    _push2(`<div class="text-sm text-slate-500 italic p-2"${_scopeId}> Đơn hàng đã chốt kỳ nhưng chưa có dòng hoa hồng nào được ghi nhận. </div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (vueExports.unref(snapshotTerminalRows).length > 0) {
                    _push2(`<div class="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200"${_scopeId}><span class="text-sm font-semibold text-emerald-700"${_scopeId}>Tổng cộng</span><span class="text-sm font-bold text-emerald-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(snapshotTotal)))}</span></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else if (!vueExports.unref(isCommissionConfigValid)) {
                  _push2(`<!--[-->`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "error",
                    variant: "subtle",
                    icon: "i-lucide-triangle-alert",
                    title: "Công thức chia hoa hồng không hợp lệ",
                    description: "Tổng phần trăm vượt quá 100% ở một hoặc nhiều cấp phân phối. Vui lòng điều chỉnh cấu hình trước khi xem sơ đồ."
                  }, null, _parent2, _scopeId));
                  _push2(`<ul class="mt-3 text-sm text-red-700 list-disc pl-5 space-y-1"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(commissionErrors), (err, idx) => {
                    _push2(`<li${_scopeId}><span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(err.scope)}:</span> tổng ${serverRenderer_cjs_prodExports.ssrInterpolate(err.sumPercent.toFixed(2))}% (&gt;100%) </li>`);
                  });
                  _push2(`<!--]--></ul><!--]-->`);
                } else if (vueExports.unref(hasOverrides) && vueExports.unref(overrideItems).length > 0) {
                  _push2(`<div class="flex flex-col gap-2"${_scopeId}><div class="flex items-center justify-between p-2 bg-slate-50 rounded-lg"${_scopeId}><span class="text-sm font-medium text-slate-600"${_scopeId}>Platform</span><span class="text-sm font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(platformAmountFromApi)))}</span></div><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(overrideItems), (item) => {
                    _push2(`<div class="flex items-center justify-between p-2 rounded-lg border border-slate-100"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: item.recipient_type.label,
                      color: item.recipient_type.value === "staff" ? "primary" : "neutral",
                      variant: "subtle",
                      size: "xs"
                    }, null, _parent2, _scopeId));
                    _push2(`<span class="text-sm text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.account?.name ?? item.recipient_type.label)}</span></div><span class="text-sm font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(parseFloat(item.amount)))}</span></div>`);
                  });
                  _push2(`<!--]--><div class="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200"${_scopeId}><span class="text-sm font-semibold text-emerald-700"${_scopeId}>Tổng cộng</span><span class="text-sm font-bold text-emerald-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(commissionableTotal)))}</span></div></div>`);
                } else {
                  _push2(`<!--[-->`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, null, {
                    fallback: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50/30 py-12 text-slate-400 text-sm"${_scopeId2}> Đang tải sơ đồ... </div>`);
                      } else {
                        return [
                          vueExports.createVNode("div", { class: "flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50/30 py-12 text-slate-400 text-sm" }, " Đang tải sơ đồ... ")
                        ];
                      }
                    })
                  }, _parent2, _scopeId));
                  _push2(`<div class="mt-4"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CommissionBreakdownTable, { rows: vueExports.unref(commissionTableRows) }, null, _parent2, _scopeId));
                  _push2(`</div><!--]-->`);
                }
              } else {
                return [
                  vueExports.unref(isFinanciallyLocked) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "flex flex-col gap-2"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(snapshotTerminalRows), (snap) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: snap.id,
                        class: "flex items-center justify-between p-2 rounded-lg border border-slate-100"
                      }, [
                        vueExports.createVNode("div", { class: "flex items-center gap-2 min-w-0" }, [
                          vueExports.createVNode(_component_UBadge, {
                            label: snap.recipient_type.label,
                            color: snap.recipient_type.value === "platform" ? "neutral" : snap.recipient_type.value === "staff" ? "primary" : "info",
                            variant: "subtle",
                            size: "xs"
                          }, null, 8, ["label", "color"]),
                          vueExports.createVNode("span", { class: "text-sm text-slate-700 truncate" }, vueExports.toDisplayString(snap.recipient_name), 1)
                        ]),
                        vueExports.createVNode("span", { class: "text-sm font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(parseFloat(snap.amount))), 1)
                      ]);
                    }), 128)),
                    vueExports.unref(snapshotTerminalRows).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "text-sm text-slate-500 italic p-2"
                    }, " Đơn hàng đã chốt kỳ nhưng chưa có dòng hoa hồng nào được ghi nhận. ")) : vueExports.createCommentVNode("", true),
                    vueExports.unref(snapshotTerminalRows).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200"
                    }, [
                      vueExports.createVNode("span", { class: "text-sm font-semibold text-emerald-700" }, "Tổng cộng"),
                      vueExports.createVNode("span", { class: "text-sm font-bold text-emerald-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(snapshotTotal))), 1)
                    ])) : vueExports.createCommentVNode("", true)
                  ])) : !vueExports.unref(isCommissionConfigValid) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                    vueExports.createVNode(_component_UAlert, {
                      color: "error",
                      variant: "subtle",
                      icon: "i-lucide-triangle-alert",
                      title: "Công thức chia hoa hồng không hợp lệ",
                      description: "Tổng phần trăm vượt quá 100% ở một hoặc nhiều cấp phân phối. Vui lòng điều chỉnh cấu hình trước khi xem sơ đồ."
                    }),
                    vueExports.createVNode("ul", { class: "mt-3 text-sm text-red-700 list-disc pl-5 space-y-1" }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(commissionErrors), (err, idx) => {
                        return vueExports.openBlock(), vueExports.createBlock("li", { key: idx }, [
                          vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(err.scope) + ":", 1),
                          vueExports.createTextVNode(" tổng " + vueExports.toDisplayString(err.sumPercent.toFixed(2)) + "% (>100%) ", 1)
                        ]);
                      }), 128))
                    ])
                  ], 64)) : vueExports.unref(hasOverrides) && vueExports.unref(overrideItems).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 2,
                    class: "flex flex-col gap-2"
                  }, [
                    vueExports.createVNode("div", { class: "flex items-center justify-between p-2 bg-slate-50 rounded-lg" }, [
                      vueExports.createVNode("span", { class: "text-sm font-medium text-slate-600" }, "Platform"),
                      vueExports.createVNode("span", { class: "text-sm font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(platformAmountFromApi))), 1)
                    ]),
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(overrideItems), (item) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: item.id,
                        class: "flex items-center justify-between p-2 rounded-lg border border-slate-100"
                      }, [
                        vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                          vueExports.createVNode(_component_UBadge, {
                            label: item.recipient_type.label,
                            color: item.recipient_type.value === "staff" ? "primary" : "neutral",
                            variant: "subtle",
                            size: "xs"
                          }, null, 8, ["label", "color"]),
                          vueExports.createVNode("span", { class: "text-sm text-slate-700" }, vueExports.toDisplayString(item.account?.name ?? item.recipient_type.label), 1)
                        ]),
                        vueExports.createVNode("span", { class: "text-sm font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(parseFloat(item.amount))), 1)
                      ]);
                    }), 128)),
                    vueExports.createVNode("div", { class: "flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200" }, [
                      vueExports.createVNode("span", { class: "text-sm font-semibold text-emerald-700" }, "Tổng cộng"),
                      vueExports.createVNode("span", { class: "text-sm font-bold text-emerald-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(commissionableTotal))), 1)
                    ])
                  ])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 3 }, [
                    vueExports.createVNode(_component_ClientOnly, null, {
                      fallback: vueExports.withCtx(() => [
                        vueExports.createVNode("div", { class: "flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50/30 py-12 text-slate-400 text-sm" }, " Đang tải sơ đồ... ")
                      ]),
                      default: vueExports.withCtx(() => [
                        (vueExports.openBlock(), vueExports.createBlock(_component_CommissionPreviewDiagram, {
                          key: vueExports.unref(commissionDiagramKey),
                          data: vueExports.unref(commissionMindmap)
                        }, null, 8, ["data"]))
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode("div", { class: "mt-4" }, [
                      vueExports.createVNode(_component_CommissionBreakdownTable, { rows: vueExports.unref(commissionTableRows) }, null, 8, ["rows"])
                    ])
                  ], 64))
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(showOverrideModal)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CommissionOverrideModal, {
            "order-id": vueExports.unref(id),
            "commissionable-total": vueExports.unref(commissionableTotal),
            "platform-amount": vueExports.unref(platformAmountFromApi),
            "existing-overrides": vueExports.unref(overrideItems),
            onSaved: handleOverrideSaved,
            onClose: ($event) => showOverrideModal.value = false
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Phiên bản báo giá" }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!vueExports.unref(isCompleted)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-plus",
                  label: "Tạo báo giá mới",
                  size: "sm",
                  color: "primary",
                  variant: "soft",
                  onClick: ($event) => showNewQuoteConfirm.value = true
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                !vueExports.unref(isCompleted) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 0,
                  icon: "i-lucide-plus",
                  label: "Tạo báo giá mới",
                  size: "sm",
                  color: "primary",
                  variant: "soft",
                  onClick: ($event) => showNewQuoteConfirm.value = true
                }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (vueExports.unref(quoteVersions).length === 0) {
                _push2(`<div class="text-sm text-slate-400 italic"${_scopeId}> Chưa có phiên bản báo giá. </div>`);
              } else {
                _push2(`<div class="flex flex-col gap-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(quoteVersions), (ver, idx) => {
                  _push2(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([ver.is_active ? "border-emerald-300 bg-emerald-50/50" : "border-slate-200 bg-slate-50/50", "rounded-lg border p-3 sm:p-4"])}"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 mb-2"${_scopeId}><div class="flex items-center gap-1.5 sm:gap-2 flex-wrap"${_scopeId}><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([ver.is_active ? "text-emerald-700" : "text-slate-500", "text-sm font-bold"])}"${_scopeId}> #${serverRenderer_cjs_prodExports.ssrInterpolate(idx + 1)}</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/quotes/${ver.id}`,
                    class: ["font-mono text-xs font-semibold hover:underline", ver.id === vueExports.unref(order).quote?.id ? "text-primary" : "text-slate-700"]
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
                      label: "Active",
                      color: "success",
                      variant: "subtle",
                      size: "xs"
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: "Inactive",
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
              }
            } else {
              return [
                vueExports.unref(quoteVersions).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "text-sm text-slate-400 italic"
                }, " Chưa có phiên bản báo giá. ")) : (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "flex flex-col gap-3"
                }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(quoteVersions), (ver, idx) => {
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
                            class: ["font-mono text-xs font-semibold hover:underline", ver.id === vueExports.unref(order).quote?.id ? "text-primary" : "text-slate-700"]
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(ver.code), 1)
                            ]),
                            _: 2
                          }, 1032, ["to", "class"]),
                          ver.is_active ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                            key: 0,
                            label: "Active",
                            color: "success",
                            variant: "subtle",
                            size: "xs"
                          })) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                            key: 1,
                            label: "Inactive",
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
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="flex flex-col gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Biên bản nghiệm thu",
          compact: "",
          class: "hidden lg:block"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Lập biên bản nghiệm thu",
                icon: "i-lucide-clipboard-check",
                color: "primary",
                variant: "soft",
                class: "w-full",
                onClick: ($event) => showAcceptanceReport.value = true
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UButton, {
                  label: "Lập biên bản nghiệm thu",
                  icon: "i-lucide-clipboard-check",
                  color: "primary",
                  variant: "soft",
                  class: "w-full",
                  onClick: ($event) => showAcceptanceReport.value = true
                }, null, 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hành động",
          compact: "",
          class: "hidden lg:block"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (vueExports.unref(order).status.value === "draft") {
                _push2(`<div class="flex flex-col gap-2"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Xác nhận đơn",
                  icon: "i-lucide-check-circle",
                  color: "primary",
                  class: "w-full",
                  loading: vueExports.unref(isTransitioning),
                  onClick: ($event) => vueExports.unref(handleTransition)("confirmed")
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Hủy đơn",
                  icon: "i-lucide-x-circle",
                  color: "error",
                  variant: "outline",
                  class: "w-full",
                  loading: vueExports.unref(isTransitioning),
                  onClick: ($event) => showCancelConfirm.value = true
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else if (vueExports.unref(order).status.value === "confirmed") {
                _push2(`<div class="flex flex-col gap-2"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Bắt đầu thực hiện",
                  icon: "i-lucide-play",
                  color: "primary",
                  class: "w-full",
                  loading: vueExports.unref(isTransitioning),
                  onClick: ($event) => vueExports.unref(handleTransition)("in_progress")
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Hủy đơn",
                  icon: "i-lucide-x-circle",
                  color: "error",
                  variant: "outline",
                  class: "w-full",
                  loading: vueExports.unref(isTransitioning),
                  onClick: ($event) => showCancelConfirm.value = true
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else if (vueExports.unref(order).status.value === "in_progress") {
                _push2(`<div class="flex flex-col gap-2"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Nghiệm thu",
                  icon: "i-lucide-clipboard-check",
                  color: "primary",
                  class: "w-full",
                  loading: vueExports.unref(isTransitioning),
                  onClick: ($event) => vueExports.unref(handleTransition)("accepted")
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Hủy đơn",
                  icon: "i-lucide-x-circle",
                  color: "error",
                  variant: "outline",
                  class: "w-full",
                  loading: vueExports.unref(isTransitioning),
                  onClick: ($event) => showCancelConfirm.value = true
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else if (vueExports.unref(order).status.value === "accepted") {
                _push2(`<div class="flex flex-col gap-2"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Hoàn thành",
                  icon: "i-lucide-circle-check-big",
                  color: "primary",
                  class: "w-full",
                  loading: vueExports.unref(isTransitioning),
                  onClick: ($event) => vueExports.unref(handleTransition)("completed")
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Hủy đơn",
                  icon: "i-lucide-x-circle",
                  color: "error",
                  variant: "outline",
                  class: "w-full",
                  loading: vueExports.unref(isTransitioning),
                  onClick: ($event) => showCancelConfirm.value = true
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<p class="text-sm text-slate-400 italic"${_scopeId}> Không có hành động khả dụng. </p>`);
              }
            } else {
              return [
                vueExports.unref(order).status.value === "draft" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "flex flex-col gap-2"
                }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Xác nhận đơn",
                    icon: "i-lucide-check-circle",
                    color: "primary",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => vueExports.unref(handleTransition)("confirmed")
                  }, null, 8, ["loading", "onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Hủy đơn",
                    icon: "i-lucide-x-circle",
                    color: "error",
                    variant: "outline",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => showCancelConfirm.value = true
                  }, null, 8, ["loading", "onClick"])
                ])) : vueExports.unref(order).status.value === "confirmed" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "flex flex-col gap-2"
                }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Bắt đầu thực hiện",
                    icon: "i-lucide-play",
                    color: "primary",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => vueExports.unref(handleTransition)("in_progress")
                  }, null, 8, ["loading", "onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Hủy đơn",
                    icon: "i-lucide-x-circle",
                    color: "error",
                    variant: "outline",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => showCancelConfirm.value = true
                  }, null, 8, ["loading", "onClick"])
                ])) : vueExports.unref(order).status.value === "in_progress" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  class: "flex flex-col gap-2"
                }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Nghiệm thu",
                    icon: "i-lucide-clipboard-check",
                    color: "primary",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => vueExports.unref(handleTransition)("accepted")
                  }, null, 8, ["loading", "onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Hủy đơn",
                    icon: "i-lucide-x-circle",
                    color: "error",
                    variant: "outline",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => showCancelConfirm.value = true
                  }, null, 8, ["loading", "onClick"])
                ])) : vueExports.unref(order).status.value === "accepted" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 3,
                  class: "flex flex-col gap-2"
                }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Hoàn thành",
                    icon: "i-lucide-circle-check-big",
                    color: "primary",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => vueExports.unref(handleTransition)("completed")
                  }, null, 8, ["loading", "onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Hủy đơn",
                    icon: "i-lucide-x-circle",
                    color: "error",
                    variant: "outline",
                    class: "w-full",
                    loading: vueExports.unref(isTransitioning),
                    onClick: ($event) => showCancelConfirm.value = true
                  }, null, 8, ["loading", "onClick"])
                ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 4,
                  class: "text-sm text-slate-400 italic"
                }, " Không có hành động khả dụng. "))
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
                      label: vueExports.unref(order).status.label,
                      color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(order).status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(order).status.label,
                        color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(order).status.value),
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
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).lines.length)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).lines.length), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).created_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).created_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).updated_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).updated_at)), 1)
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
                        label: vueExports.unref(order).status.label,
                        color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(order).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số dòng" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).lines.length), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tạo lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).created_at)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).updated_at)), 1)
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
      if (vueExports.unref(order) && vueExports.unref(isActionable)) {
        _push(`<div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-3 lg:hidden z-50">`);
        if (vueExports.unref(order).status.value === "draft") {
          _push(`<div class="flex items-center gap-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Xác nhận đơn",
            icon: "i-lucide-check-circle",
            color: "primary",
            class: "flex-1",
            loading: vueExports.unref(isTransitioning),
            onClick: ($event) => vueExports.unref(handleTransition)("confirmed")
          }, null, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-x-circle",
            color: "error",
            variant: "outline",
            onClick: ($event) => showCancelConfirm.value = true
          }, null, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-trash-2",
            color: "error",
            variant: "outline",
            onClick: ($event) => openDeleteConfirm()
          }, null, _parent));
          _push(`</div>`);
        } else if (vueExports.unref(order).status.value === "confirmed") {
          _push(`<div class="flex items-center gap-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Bắt đầu thực hiện",
            icon: "i-lucide-play",
            color: "primary",
            class: "flex-1",
            loading: vueExports.unref(isTransitioning),
            onClick: ($event) => vueExports.unref(handleTransition)("in_progress")
          }, null, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-x-circle",
            color: "error",
            variant: "outline",
            onClick: ($event) => showCancelConfirm.value = true
          }, null, _parent));
          _push(`</div>`);
        } else if (vueExports.unref(order).status.value === "in_progress") {
          _push(`<div class="flex items-center gap-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Nghiệm thu",
            icon: "i-lucide-clipboard-check",
            color: "primary",
            class: "flex-1",
            loading: vueExports.unref(isTransitioning),
            onClick: ($event) => vueExports.unref(handleTransition)("accepted")
          }, null, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-x-circle",
            color: "error",
            variant: "outline",
            onClick: ($event) => showCancelConfirm.value = true
          }, null, _parent));
          _push(`</div>`);
        } else if (vueExports.unref(order).status.value === "accepted") {
          _push(`<div class="flex items-center gap-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Hoàn thành",
            icon: "i-lucide-circle-check-big",
            color: "primary",
            class: "flex-1",
            loading: vueExports.unref(isTransitioning),
            onClick: ($event) => vueExports.unref(handleTransition)("completed")
          }, null, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-x-circle",
            color: "error",
            variant: "outline",
            onClick: ($event) => showCancelConfirm.value = true
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(order)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOrderAcceptanceReportModal, {
          open: vueExports.unref(showAcceptanceReport),
          "onUpdate:open": ($event) => vueExports.isRef(showAcceptanceReport) ? showAcceptanceReport.value = $event : null,
          "order-id": vueExports.unref(id)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showCancelConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showCancelConfirm) ? showCancelConfirm.value = $event : null,
        title: "Xác nhận hủy đơn hàng"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-slate-700"${_scopeId}> Hành động này không thể hoàn tác. Tiếp tục? </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-slate-700" }, " Hành động này không thể hoàn tác. Tiếp tục? ")
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
              onClick: ($event) => showCancelConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận",
              color: "error",
              loading: vueExports.unref(isTransitioning),
              onClick: confirmCancel
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Quay lại",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showCancelConfirm.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận",
                  color: "error",
                  loading: vueExports.unref(isTransitioning),
                  onClick: confirmCancel
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteConfirm) ? showDeleteConfirm.value = $event : null,
        title: "Xoá đơn hàng",
        "item-name": vueExports.unref(order)?.code,
        description: "Đơn hàng sẽ bị xoá vĩnh viễn.",
        checking: vueExports.unref(isCheckingDelete),
        "blocked-message": vueExports.unref(deleteBlockedMessage),
        loading: vueExports.unref(isDeleting),
        onConfirm: vueExports.unref(confirmDelete)
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showNewQuoteConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showNewQuoteConfirm) ? showNewQuoteConfirm.value = $event : null,
        title: "Tạo báo giá mới"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-slate-700"${_scopeId}> Tạo báo giá mới sẽ thay thế báo giá hiện tại và đơn hàng sẽ được cập nhật theo báo giá mới. Đơn hàng sẽ quay về trạng thái <strong${_scopeId}>Nháp</strong>. Tiếp tục? </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-slate-700" }, [
                vueExports.createTextVNode(" Tạo báo giá mới sẽ thay thế báo giá hiện tại và đơn hàng sẽ được cập nhật theo báo giá mới. Đơn hàng sẽ quay về trạng thái "),
                vueExports.createVNode("strong", null, "Nháp"),
                vueExports.createTextVNode(". Tiếp tục? ")
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
              onClick: ($event) => showNewQuoteConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Tiếp tục tạo",
              color: "primary",
              icon: "i-lucide-arrow-right",
              onClick: confirmNewQuote
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showNewQuoteConfirm.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Tiếp tục tạo",
                  color: "primary",
                  icon: "i-lucide-arrow-right",
                  onClick: confirmNewQuote
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_OrderLinePricesModal, {
        open: vueExports.unref(showPricesModal),
        "onUpdate:open": ($event) => vueExports.isRef(showPricesModal) ? showPricesModal.value = $event : null,
        line: vueExports.unref(pricesTargetLine),
        loading: vueExports.unref(isSavingPrices),
        "api-errors": vueExports.unref(pricesApiErrors),
        onSubmit: handleSavePrices
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/orders/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CG9XgOCN.mjs.map
