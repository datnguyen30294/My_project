import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4, j as useToast } from './server.mjs';
import { _ as _sfc_main$e } from './Card-ywPiICev.mjs';
import { _ as _sfc_main$d } from './Badge-W93D3Jpz.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { _ as __nuxt_component_4$1 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$8 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$9 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_2$1 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$a } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$b } from './Tooltip-Dasyzope.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as _sfc_main$f } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$g } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_5$1 } from './NumberInput-BfLKWOCC.mjs';
import { _ as _sfc_main$i } from './Textarea-DTCNHwKm.mjs';
import { Z as Zl } from './vue-datepicker-6F5-CyxW.mjs';
import { u as useCashAccountDefault, a as useTreasuryKpi, b as useCashTransactionList, C as CASH_TRANSACTION_DIRECTION_OPTIONS, c as CASH_TRANSACTION_CATEGORY_OPTIONS, d as CASH_TRANSACTION_INCLUDE_DELETED_OPTIONS, m as manualReconciliationStatusColor, e as cashTransactionCategoryColor, f as useCashTransactionDetail, g as apiManualTopup, h as apiManualWithdraw, i as apiDeleteCashTransaction } from './useTreasury-BKILzBuO.mjs';
import { a as getApiValidationErrors, g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { _ as _sfc_main$j } from './Alert-tTsPKADX.mjs';
import { a as formatDate, f as formatDateTime } from './date-R5YK0ast.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
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
import './useGraceArea-B6BTYtpN.mjs';
import './Kbd-T8yC2vfh.mjs';
import './Pagination-fZq_Msxb.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Label-BBgw4vHh.mjs';

const _sfc_main$7 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AccountCard",
  __ssrInlineRender: true,
  props: {
    account: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$e;
      const _component_UBadge = _sfc_main$d;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, _attrs, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"${_scopeId}><div class="space-y-1"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="font-semibold text-slate-900 text-base"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.account.name)}</span>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              label: __props.account.type.label,
              variant: "subtle",
              color: "primary",
              size: "sm"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="text-sm text-slate-500"${_scopeId}> Mã: <span class="font-mono text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.account.code)}</span></div><div class="text-sm text-slate-500"${_scopeId}> Số dư đầu kỳ: <span class="font-medium text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.account.opening_balance))}</span></div>`);
            if (__props.account.type.value === "bank" && __props.account.bank_account_number) {
              _push2(`<div class="text-sm text-slate-500 mt-1"${_scopeId}> Ngân hàng: <span class="font-medium text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.account.bank_account_number)}</span>`);
              if (__props.account.bank_account_name) {
                _push2(`<!--[--> — ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.account.bank_account_name)}<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="sm:text-right"${_scopeId}><div class="text-xs text-slate-500 mb-0.5 uppercase tracking-wide"${_scopeId}> Số dư hiện tại </div><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.account.current_balance && parseFloat(__props.account.current_balance) < 0 ? "text-rose-800" : "text-slate-900", "text-2xl font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.account.current_balance != null ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.account.current_balance) : "—")}</div></div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4" }, [
                vueExports.createVNode("div", { class: "space-y-1" }, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                    vueExports.createVNode("span", { class: "font-semibold text-slate-900 text-base" }, vueExports.toDisplayString(__props.account.name), 1),
                    vueExports.createVNode(_component_UBadge, {
                      label: __props.account.type.label,
                      variant: "subtle",
                      color: "primary",
                      size: "sm"
                    }, null, 8, ["label"])
                  ]),
                  vueExports.createVNode("div", { class: "text-sm text-slate-500" }, [
                    vueExports.createTextVNode(" Mã: "),
                    vueExports.createVNode("span", { class: "font-mono text-slate-700" }, vueExports.toDisplayString(__props.account.code), 1)
                  ]),
                  vueExports.createVNode("div", { class: "text-sm text-slate-500" }, [
                    vueExports.createTextVNode(" Số dư đầu kỳ: "),
                    vueExports.createVNode("span", { class: "font-medium text-slate-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.account.opening_balance)), 1)
                  ]),
                  __props.account.type.value === "bank" && __props.account.bank_account_number ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "text-sm text-slate-500 mt-1"
                  }, [
                    vueExports.createTextVNode(" Ngân hàng: "),
                    vueExports.createVNode("span", { class: "font-medium text-slate-700" }, vueExports.toDisplayString(__props.account.bank_account_number), 1),
                    __props.account.bank_account_name ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                      vueExports.createTextVNode(" — " + vueExports.toDisplayString(__props.account.bank_account_name), 1)
                    ], 64)) : vueExports.createCommentVNode("", true)
                  ])) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.createVNode("div", { class: "sm:text-right" }, [
                  vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-0.5 uppercase tracking-wide" }, " Số dư hiện tại "),
                  vueExports.createVNode("div", {
                    class: ["text-2xl font-bold tabular-nums", __props.account.current_balance && parseFloat(__props.account.current_balance) < 0 ? "text-rose-800" : "text-slate-900"]
                  }, vueExports.toDisplayString(__props.account.current_balance != null ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.account.current_balance) : "—"), 3)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/treasury/AccountCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$7, { __name: "TreasuryAccountCard" });
const _sfc_main$6 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "KpiRow",
  __ssrInlineRender: true,
  props: {
    kpi: {}
  },
  setup(__props) {
    function netFlowClass(netFlow) {
      return parseFloat(netFlow) < 0 ? "text-rose-800" : "text-slate-900";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$e;
      const _component_UIcon = _sfc_main$h;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-xs text-slate-500 mb-1 flex items-center gap-1"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-trending-up",
              class: "size-3.5 text-slate-700"
            }, null, _parent2, _scopeId));
            _push2(` Tổng thu </div><div class="text-lg font-bold text-slate-900 tabular-nums"${_scopeId}> +${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.kpi.total_inflow))}</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1 flex items-center gap-1" }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-trending-up",
                  class: "size-3.5 text-slate-700"
                }),
                vueExports.createTextVNode(" Tổng thu ")
              ]),
              vueExports.createVNode("div", { class: "text-lg font-bold text-slate-900 tabular-nums" }, " +" + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.kpi.total_inflow)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-xs text-slate-500 mb-1 flex items-center gap-1"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-trending-down",
              class: "size-3.5 text-rose-700"
            }, null, _parent2, _scopeId));
            _push2(` Tổng chi </div><div class="text-lg font-bold text-rose-800 tabular-nums"${_scopeId}> -${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.kpi.total_outflow))}</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1 flex items-center gap-1" }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-trending-down",
                  class: "size-3.5 text-rose-700"
                }),
                vueExports.createTextVNode(" Tổng chi ")
              ]),
              vueExports.createVNode("div", { class: "text-lg font-bold text-rose-800 tabular-nums" }, " -" + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.kpi.total_outflow)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-xs text-slate-500 mb-1 flex items-center gap-1"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-activity",
              class: "size-3.5 text-slate-400"
            }, null, _parent2, _scopeId));
            _push2(` Dòng tiền ròng </div><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([netFlowClass(__props.kpi.net_flow), "text-lg font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(parseFloat(__props.kpi.net_flow) >= 0 ? "+" : "")}${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.kpi.net_flow))}</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1 flex items-center gap-1" }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-activity",
                  class: "size-3.5 text-slate-400"
                }),
                vueExports.createTextVNode(" Dòng tiền ròng ")
              ]),
              vueExports.createVNode("div", {
                class: ["text-lg font-bold tabular-nums", netFlowClass(__props.kpi.net_flow)]
              }, vueExports.toDisplayString(parseFloat(__props.kpi.net_flow) >= 0 ? "+" : "") + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.kpi.net_flow)), 3)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-xs text-slate-500 mb-1 flex items-center gap-1"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-receipt",
              class: "size-3.5 text-slate-400"
            }, null, _parent2, _scopeId));
            _push2(` Số giao dịch </div><div class="text-lg font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.kpi.transaction_count)}</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1 flex items-center gap-1" }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-receipt",
                  class: "size-3.5 text-slate-400"
                }),
                vueExports.createTextVNode(" Số giao dịch ")
              ]),
              vueExports.createVNode("div", { class: "text-lg font-bold text-slate-900" }, vueExports.toDisplayString(__props.kpi.transaction_count), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/treasury/KpiRow.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$6, { __name: "TreasuryKpiRow" });
const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "FlowChart",
  __ssrInlineRender: true,
  props: {
    kpi: {}
  },
  setup(__props) {
    const props = __props;
    const inflowCategories = vueExports.computed(() => {
      try {
        return JSON.parse(props.kpi.inflow_by_category) ?? [];
      } catch {
        return [];
      }
    });
    const outflowCategories = vueExports.computed(() => {
      try {
        return JSON.parse(props.kpi.outflow_by_category) ?? [];
      } catch {
        return [];
      }
    });
    const totalInflow = vueExports.computed(() => parseFloat(props.kpi.total_inflow) || 0);
    const totalOutflow = vueExports.computed(() => parseFloat(props.kpi.total_outflow) || 0);
    const maxAmount = vueExports.computed(() => Math.max(totalInflow.value, totalOutflow.value, 1));
    function barWidth(amount) {
      return `${Math.round(amount / maxAmount.value * 100)}%`;
    }
    function categoryLabel(value) {
      const labels = {
        manual_topup: "Nạp thủ công",
        manual_withdraw: "Rút thủ công",
        receivable_collection: "Thu công nợ",
        customer_refund: "Hoàn tiền",
        commission_payout: "Chi hoa hồng"
      };
      return labels[value] ?? value;
    }
    const hasData = vueExports.computed(() => totalInflow.value > 0 || totalOutflow.value > 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({
        title: "Dòng tiền theo danh mục",
        compact: ""
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!vueExports.unref(hasData)) {
              _push2(`<div class="text-sm text-slate-400 text-center py-6"${_scopeId}> Không có giao dịch trong khoảng thời gian này </div>`);
            } else {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-6"${_scopeId}><div${_scopeId}><div class="flex items-center gap-2 mb-3"${_scopeId}><span class="size-2.5 rounded-full bg-slate-900"${_scopeId}></span><span class="text-sm font-semibold text-slate-900"${_scopeId}>Tiền vào</span><span class="ml-auto text-sm font-bold tabular-nums text-slate-900"${_scopeId}> +${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.kpi.total_inflow))}</span></div><div class="space-y-2"${_scopeId}>`);
              if (vueExports.unref(inflowCategories).length === 0) {
                _push2(`<div class="text-xs text-slate-400"${_scopeId}> Không có </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(inflowCategories), (row) => {
                _push2(`<div class="space-y-0.5"${_scopeId}><div class="flex items-center justify-between text-xs text-slate-600"${_scopeId}><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(categoryLabel(row.category))}</span><span class="tabular-nums font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(row.amount)))}</span></div><div class="h-2 rounded-full bg-slate-100 overflow-hidden"${_scopeId}><div class="h-full rounded-full bg-slate-900 transition-all duration-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: barWidth(row.amount) })}"${_scopeId}></div></div></div>`);
              });
              _push2(`<!--]--></div></div><div${_scopeId}><div class="flex items-center gap-2 mb-3"${_scopeId}><span class="size-2.5 rounded-full bg-rose-800"${_scopeId}></span><span class="text-sm font-semibold text-rose-800"${_scopeId}>Tiền ra</span><span class="ml-auto text-sm font-bold tabular-nums text-rose-800"${_scopeId}> -${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.kpi.total_outflow))}</span></div><div class="space-y-2"${_scopeId}>`);
              if (vueExports.unref(outflowCategories).length === 0) {
                _push2(`<div class="text-xs text-slate-400"${_scopeId}> Không có </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(outflowCategories), (row) => {
                _push2(`<div class="space-y-0.5"${_scopeId}><div class="flex items-center justify-between text-xs text-slate-600"${_scopeId}><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(categoryLabel(row.category))}</span><span class="tabular-nums font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(row.amount)))}</span></div><div class="h-2 rounded-full bg-rose-50 overflow-hidden"${_scopeId}><div class="h-full rounded-full bg-rose-800 transition-all duration-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: barWidth(row.amount) })}"${_scopeId}></div></div></div>`);
              });
              _push2(`<!--]--></div></div></div>`);
            }
          } else {
            return [
              !vueExports.unref(hasData) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "text-sm text-slate-400 text-center py-6"
              }, " Không có giao dịch trong khoảng thời gian này ")) : (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 1,
                class: "grid grid-cols-1 sm:grid-cols-2 gap-6"
              }, [
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2 mb-3" }, [
                    vueExports.createVNode("span", { class: "size-2.5 rounded-full bg-slate-900" }),
                    vueExports.createVNode("span", { class: "text-sm font-semibold text-slate-900" }, "Tiền vào"),
                    vueExports.createVNode("span", { class: "ml-auto text-sm font-bold tabular-nums text-slate-900" }, " +" + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.kpi.total_inflow)), 1)
                  ]),
                  vueExports.createVNode("div", { class: "space-y-2" }, [
                    vueExports.unref(inflowCategories).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "text-xs text-slate-400"
                    }, " Không có ")) : vueExports.createCommentVNode("", true),
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(inflowCategories), (row) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: row.category,
                        class: "space-y-0.5"
                      }, [
                        vueExports.createVNode("div", { class: "flex items-center justify-between text-xs text-slate-600" }, [
                          vueExports.createVNode("span", null, vueExports.toDisplayString(categoryLabel(row.category)), 1),
                          vueExports.createVNode("span", { class: "tabular-nums font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(row.amount))), 1)
                        ]),
                        vueExports.createVNode("div", { class: "h-2 rounded-full bg-slate-100 overflow-hidden" }, [
                          vueExports.createVNode("div", {
                            class: "h-full rounded-full bg-slate-900 transition-all duration-500",
                            style: { width: barWidth(row.amount) }
                          }, null, 4)
                        ])
                      ]);
                    }), 128))
                  ])
                ]),
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2 mb-3" }, [
                    vueExports.createVNode("span", { class: "size-2.5 rounded-full bg-rose-800" }),
                    vueExports.createVNode("span", { class: "text-sm font-semibold text-rose-800" }, "Tiền ra"),
                    vueExports.createVNode("span", { class: "ml-auto text-sm font-bold tabular-nums text-rose-800" }, " -" + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.kpi.total_outflow)), 1)
                  ]),
                  vueExports.createVNode("div", { class: "space-y-2" }, [
                    vueExports.unref(outflowCategories).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "text-xs text-slate-400"
                    }, " Không có ")) : vueExports.createCommentVNode("", true),
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(outflowCategories), (row) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: row.category,
                        class: "space-y-0.5"
                      }, [
                        vueExports.createVNode("div", { class: "flex items-center justify-between text-xs text-slate-600" }, [
                          vueExports.createVNode("span", null, vueExports.toDisplayString(categoryLabel(row.category)), 1),
                          vueExports.createVNode("span", { class: "tabular-nums font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(row.amount))), 1)
                        ]),
                        vueExports.createVNode("div", { class: "h-2 rounded-full bg-rose-50 overflow-hidden" }, [
                          vueExports.createVNode("div", {
                            class: "h-full rounded-full bg-rose-800 transition-all duration-500",
                            style: { width: barWidth(row.amount) }
                          }, null, 4)
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/treasury/FlowChart.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$5, { __name: "TreasuryFlowChart" });
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ManualTopupModal",
  __ssrInlineRender: true,
  props: {
    account: {},
    open: { type: Boolean }
  },
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const form = vueExports.reactive({
      amount: null,
      transaction_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      note: ""
    });
    const errors = vueExports.ref({});
    const isSubmitting = vueExports.ref(false);
    const dateValue = vueExports.ref(/* @__PURE__ */ new Date());
    vueExports.watch(() => props.open, (val) => {
      if (val) {
        form.amount = null;
        form.transaction_date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
        form.note = "";
        errors.value = {};
        dateValue.value = /* @__PURE__ */ new Date();
      }
    });
    vueExports.watch(dateValue, (val) => {
      if (val) {
        const d = new Date(val);
        form.transaction_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }
    });
    async function submit() {
      if (!form.amount || form.amount <= 0) {
        errors.value = { amount: ["Số tiền phải lớn hơn 0"] };
        return;
      }
      if (!form.transaction_date) {
        errors.value = { transaction_date: ["Vui lòng chọn ngày giao dịch"] };
        return;
      }
      isSubmitting.value = true;
      errors.value = {};
      try {
        await apiManualTopup({
          cash_account_id: Number(props.account.id),
          amount: form.amount,
          transaction_date: form.transaction_date,
          note: form.note || null
        });
        toast.add({ title: `Đã nạp ${formatCurrency(String(form.amount))} vào quỹ`, color: "success" });
        emit("success");
        emit("close");
      } catch (err) {
        const validationErrors = getApiValidationErrors(err);
        if (validationErrors) {
          errors.value = validationErrors;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Nạp tiền thất bại"), color: "error" });
        }
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$f;
      const _component_UFormField = _sfc_main$g;
      const _component_UInput = _sfc_main$8;
      const _component_SharedNumberInput = __nuxt_component_5$1;
      const _component_UTextarea = _sfc_main$i;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Nạp tiền vào quỹ",
        "onUpdate:open": (v) => !v && emit("close")
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tài khoản quỹ" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    "model-value": __props.account.name,
                    disabled: "",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.account.name,
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Số tiền (đ)",
              required: "",
              error: vueExports.unref(errors).amount?.[0]
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                    modelValue: vueExports.unref(form).amount,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).amount = $event,
                    min: 1,
                    placeholder: "Nhập số tiền...",
                    class: "w-full",
                    onFocus: ($event) => vueExports.unref(errors).amount = []
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(form).amount,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).amount = $event,
                      min: 1,
                      placeholder: "Nhập số tiền...",
                      class: "w-full",
                      onFocus: ($event) => vueExports.unref(errors).amount = []
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onFocus"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ngày giao dịch",
              required: "",
              error: vueExports.unref(errors).transaction_date?.[0]
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Zl), {
                    modelValue: vueExports.unref(dateValue),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(dateValue) ? dateValue.value = $event : null,
                    "max-date": /* @__PURE__ */ new Date(),
                    format: "dd/MM/yyyy",
                    "auto-apply": "",
                    "time-config": { enableTimePicker: false }
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(vueExports.unref(Zl), {
                      modelValue: vueExports.unref(dateValue),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(dateValue) ? dateValue.value = $event : null,
                      "max-date": /* @__PURE__ */ new Date(),
                      format: "dd/MM/yyyy",
                      "auto-apply": "",
                      "time-config": { enableTimePicker: false }
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "max-date"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ghi chú",
              error: vueExports.unref(errors).note?.[0]
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(form).note,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
                    placeholder: "Ghi chú (tùy chọn)...",
                    rows: 3,
                    class: "w-full",
                    maxlength: 1e3
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(form).note,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
                      placeholder: "Ghi chú (tùy chọn)...",
                      rows: 3,
                      class: "w-full",
                      maxlength: 1e3
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-4" }, [
                vueExports.createVNode(_component_UFormField, { label: "Tài khoản quỹ" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.account.name,
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Số tiền (đ)",
                  required: "",
                  error: vueExports.unref(errors).amount?.[0]
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(form).amount,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).amount = $event,
                      min: 1,
                      placeholder: "Nhập số tiền...",
                      class: "w-full",
                      onFocus: ($event) => vueExports.unref(errors).amount = []
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onFocus"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ngày giao dịch",
                  required: "",
                  error: vueExports.unref(errors).transaction_date?.[0]
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(vueExports.unref(Zl), {
                      modelValue: vueExports.unref(dateValue),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(dateValue) ? dateValue.value = $event : null,
                      "max-date": /* @__PURE__ */ new Date(),
                      format: "dd/MM/yyyy",
                      "auto-apply": "",
                      "time-config": { enableTimePicker: false }
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "max-date"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ghi chú",
                  error: vueExports.unref(errors).note?.[0]
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(form).note,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
                      placeholder: "Ghi chú (tùy chọn)...",
                      rows: 3,
                      class: "w-full",
                      maxlength: 1e3
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"])
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "outline",
              onClick: ($event) => emit("close")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận nạp",
              color: "primary",
              icon: "i-lucide-plus",
              loading: vueExports.unref(isSubmitting),
              onClick: submit
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "outline",
                  onClick: ($event) => emit("close")
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận nạp",
                  color: "primary",
                  icon: "i-lucide-plus",
                  loading: vueExports.unref(isSubmitting),
                  onClick: submit
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/treasury/ManualTopupModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_14 = Object.assign(_sfc_main$4, { __name: "TreasuryManualTopupModal" });
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ManualWithdrawModal",
  __ssrInlineRender: true,
  props: {
    account: {},
    currentBalance: {},
    open: { type: Boolean }
  },
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const form = vueExports.reactive({
      amount: null,
      transaction_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      note: ""
    });
    const errors = vueExports.ref({});
    const isSubmitting = vueExports.ref(false);
    const dateValue = vueExports.ref(/* @__PURE__ */ new Date());
    vueExports.watch(() => props.open, (val) => {
      if (val) {
        form.amount = null;
        form.transaction_date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
        form.note = "";
        errors.value = {};
        dateValue.value = /* @__PURE__ */ new Date();
      }
    });
    vueExports.watch(dateValue, (val) => {
      if (val) {
        const d = new Date(val);
        form.transaction_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }
    });
    const balanceAfter = vueExports.computed(() => {
      if (!form.amount) return props.currentBalance;
      return props.currentBalance - form.amount;
    });
    const isNegativeAfter = vueExports.computed(() => balanceAfter.value < 0);
    const canSubmit = vueExports.computed(
      () => !!form.amount && form.amount > 0 && !isNegativeAfter.value
    );
    async function submit() {
      if (!form.amount || form.amount <= 0) {
        errors.value = { amount: ["Số tiền phải lớn hơn 0"] };
        return;
      }
      if (isNegativeAfter.value) {
        errors.value = { amount: ["Số tiền rút vượt quá số dư hiện tại"] };
        return;
      }
      if (!form.transaction_date) {
        errors.value = { transaction_date: ["Vui lòng chọn ngày giao dịch"] };
        return;
      }
      isSubmitting.value = true;
      errors.value = {};
      try {
        await apiManualWithdraw({
          cash_account_id: Number(props.account.id),
          amount: form.amount,
          transaction_date: form.transaction_date,
          note: form.note || null
        });
        toast.add({ title: `Đã rút ${formatCurrency(String(form.amount))} khỏi quỹ`, color: "success" });
        emit("success");
        emit("close");
      } catch (err) {
        const validationErrors = getApiValidationErrors(err);
        if (validationErrors) {
          errors.value = validationErrors;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Rút tiền thất bại"), color: "error" });
        }
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$f;
      const _component_UFormField = _sfc_main$g;
      const _component_UInput = _sfc_main$8;
      const _component_SharedNumberInput = __nuxt_component_5$1;
      const _component_UAlert = _sfc_main$j;
      const _component_UTextarea = _sfc_main$i;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Rút tiền khỏi quỹ",
        "onUpdate:open": (v) => !v && emit("close")
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tài khoản quỹ" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    "model-value": __props.account.name,
                    disabled: "",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.account.name,
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="rounded-lg bg-slate-50 px-4 py-3 text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Số dư hiện tại:</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.currentBalance < 0 ? "text-rose-800" : "text-slate-900", "ml-2 font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(__props.currentBalance)))}</span></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Số tiền (đ)",
              required: "",
              error: vueExports.unref(errors).amount?.[0]
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                    modelValue: vueExports.unref(form).amount,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).amount = $event,
                    min: 1,
                    placeholder: "Nhập số tiền cần rút...",
                    class: "w-full",
                    onFocus: ($event) => vueExports.unref(errors).amount = []
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(form).amount,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).amount = $event,
                      min: 1,
                      placeholder: "Nhập số tiền cần rút...",
                      class: "w-full",
                      onFocus: ($event) => vueExports.unref(errors).amount = []
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onFocus"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(form).amount && vueExports.unref(form).amount > 0) {
              _push2(`<div${_scopeId}>`);
              if (vueExports.unref(isNegativeAfter)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "error",
                  variant: "subtle",
                  title: "Không đủ số dư",
                  description: `Số tiền rút (${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(form).amount))}) vượt quá số dư hiện tại (${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(__props.currentBalance))}). Không thể rút âm.`,
                  icon: "i-lucide-alert-triangle"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<div class="rounded-lg bg-slate-50 px-4 py-3 text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Số dư sau khi rút:</span><span class="ml-2 font-bold tabular-nums text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(balanceAfter))))}</span></div>`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ngày giao dịch",
              required: "",
              error: vueExports.unref(errors).transaction_date?.[0]
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Zl), {
                    modelValue: vueExports.unref(dateValue),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(dateValue) ? dateValue.value = $event : null,
                    "max-date": /* @__PURE__ */ new Date(),
                    format: "dd/MM/yyyy",
                    "auto-apply": "",
                    "time-config": { enableTimePicker: false }
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(vueExports.unref(Zl), {
                      modelValue: vueExports.unref(dateValue),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(dateValue) ? dateValue.value = $event : null,
                      "max-date": /* @__PURE__ */ new Date(),
                      format: "dd/MM/yyyy",
                      "auto-apply": "",
                      "time-config": { enableTimePicker: false }
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "max-date"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ghi chú",
              error: vueExports.unref(errors).note?.[0]
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(form).note,
                    "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
                    placeholder: "Ghi chú (tùy chọn)...",
                    rows: 3,
                    class: "w-full",
                    maxlength: 1e3
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(form).note,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
                      placeholder: "Ghi chú (tùy chọn)...",
                      rows: 3,
                      class: "w-full",
                      maxlength: 1e3
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-4" }, [
                vueExports.createVNode(_component_UFormField, { label: "Tài khoản quỹ" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.account.name,
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode("div", { class: "rounded-lg bg-slate-50 px-4 py-3 text-sm" }, [
                  vueExports.createVNode("span", { class: "text-slate-500" }, "Số dư hiện tại:"),
                  vueExports.createVNode("span", {
                    class: ["ml-2 font-bold tabular-nums", __props.currentBalance < 0 ? "text-rose-800" : "text-slate-900"]
                  }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(__props.currentBalance))), 3)
                ]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Số tiền (đ)",
                  required: "",
                  error: vueExports.unref(errors).amount?.[0]
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(form).amount,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).amount = $event,
                      min: 1,
                      placeholder: "Nhập số tiền cần rút...",
                      class: "w-full",
                      onFocus: ($event) => vueExports.unref(errors).amount = []
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onFocus"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                vueExports.unref(form).amount && vueExports.unref(form).amount > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 0 }, [
                  vueExports.unref(isNegativeAfter) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 0,
                    color: "error",
                    variant: "subtle",
                    title: "Không đủ số dư",
                    description: `Số tiền rút (${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(form).amount))}) vượt quá số dư hiện tại (${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(__props.currentBalance))}). Không thể rút âm.`,
                    icon: "i-lucide-alert-triangle"
                  }, null, 8, ["description"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "rounded-lg bg-slate-50 px-4 py-3 text-sm"
                  }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Số dư sau khi rút:"),
                    vueExports.createVNode("span", { class: "ml-2 font-bold tabular-nums text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(balanceAfter)))), 1)
                  ]))
                ])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ngày giao dịch",
                  required: "",
                  error: vueExports.unref(errors).transaction_date?.[0]
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(vueExports.unref(Zl), {
                      modelValue: vueExports.unref(dateValue),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(dateValue) ? dateValue.value = $event : null,
                      "max-date": /* @__PURE__ */ new Date(),
                      format: "dd/MM/yyyy",
                      "auto-apply": "",
                      "time-config": { enableTimePicker: false }
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "max-date"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ghi chú",
                  error: vueExports.unref(errors).note?.[0]
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(form).note,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
                      placeholder: "Ghi chú (tùy chọn)...",
                      rows: 3,
                      class: "w-full",
                      maxlength: 1e3
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"])
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "outline",
              onClick: ($event) => emit("close")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận rút",
              icon: "i-lucide-minus",
              variant: "solid",
              class: "bg-rose-800 text-white hover:bg-rose-900 active:bg-rose-900 focus-visible:outline-rose-800 disabled:bg-rose-800",
              loading: vueExports.unref(isSubmitting),
              disabled: !vueExports.unref(canSubmit),
              onClick: submit
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "outline",
                  onClick: ($event) => emit("close")
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận rút",
                  icon: "i-lucide-minus",
                  variant: "solid",
                  class: "bg-rose-800 text-white hover:bg-rose-900 active:bg-rose-900 focus-visible:outline-rose-800 disabled:bg-rose-800",
                  loading: vueExports.unref(isSubmitting),
                  disabled: !vueExports.unref(canSubmit),
                  onClick: submit
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/treasury/ManualWithdrawModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_15 = Object.assign(_sfc_main$3, { __name: "TreasuryManualWithdrawModal" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DeleteTransactionModal",
  __ssrInlineRender: true,
  props: {
    transaction: {},
    currentBalance: {},
    open: { type: Boolean }
  },
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const reason = vueExports.ref("");
    const errors = vueExports.ref({});
    const isSubmitting = vueExports.ref(false);
    vueExports.watch(() => props.open, (val) => {
      if (val) {
        reason.value = "";
        errors.value = {};
      }
    });
    const balanceAfter = vueExports.computed(() => {
      if (!props.transaction) return props.currentBalance;
      const amount = parseFloat(props.transaction.amount);
      return props.transaction.direction.value === "inflow" ? props.currentBalance - amount : props.currentBalance + amount;
    });
    const isNegativeAfter = vueExports.computed(() => balanceAfter.value < 0);
    async function submit() {
      if (reason.value.trim().length < 5) {
        errors.value = { reason: ["Lý do xoá tối thiểu 5 ký tự"] };
        return;
      }
      if (!props.transaction) return;
      isSubmitting.value = true;
      errors.value = {};
      try {
        await apiDeleteCashTransaction(props.transaction.id, reason.value.trim());
        toast.add({ title: "Đã xoá giao dịch", color: "success" });
        emit("success");
        emit("close");
      } catch (err) {
        const validationErrors = getApiValidationErrors(err);
        if (validationErrors) {
          errors.value = validationErrors;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Xoá thất bại"), color: "error" });
        }
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$f;
      const _component_UAlert = _sfc_main$j;
      const _component_UFormField = _sfc_main$g;
      const _component_UTextarea = _sfc_main$i;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Xoá giao dịch",
        "onUpdate:open": (v) => !v && emit("close")
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.transaction) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 space-y-1 text-sm"${_scopeId}><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Mã giao dịch</span><span class="font-mono font-medium text-slate-800"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.transaction.code)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Loại</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.transaction.direction.value === "inflow" ? "bg-slate-100 text-slate-900 ring-slate-300" : "bg-rose-50 text-rose-800 ring-rose-200", "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring ring-inset"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.transaction.direction.label)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Số tiền</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.transaction.direction.value === "inflow" ? "text-slate-900" : "text-rose-800", "font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.transaction.direction.value === "inflow" ? "+" : "-")}${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.transaction.amount))}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Ngày</span><span class="text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.transaction.transaction_date))}</span></div>`);
              if (__props.transaction.note) {
                _push2(`<div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Ghi chú</span><span class="text-slate-700 max-w-48 text-right"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.transaction.note)}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="rounded-lg bg-slate-50 px-4 py-3 text-sm"${_scopeId}><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Số dư hiện tại</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.currentBalance < 0 ? "text-rose-800" : "text-slate-900", "font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(__props.currentBalance)))}</span></div><div class="flex justify-between mt-1"${_scopeId}><span class="text-slate-500"${_scopeId}>Số dư sau khi xoá</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(isNegativeAfter) ? "text-rose-800" : "text-slate-900", "font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(balanceAfter))))}</span></div></div>`);
              if (vueExports.unref(isNegativeAfter)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "error",
                  variant: "subtle",
                  description: `Số dư sẽ chuyển âm: ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(balanceAfter)))}`,
                  icon: "i-lucide-alert-triangle"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Lý do xoá",
                required: "",
                error: vueExports.unref(errors).reason?.[0]
              }, {
                hint: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reason).length)}/500 `);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reason).length) + "/500 ", 1)
                    ];
                  }
                }),
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                      modelValue: vueExports.unref(reason),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(reason) ? reason.value = $event : null,
                      placeholder: "Nhập lý do xoá (ít nhất 5 ký tự)...",
                      rows: 3,
                      class: "w-full",
                      maxlength: 500,
                      onFocus: ($event) => vueExports.unref(errors).reason = []
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(reason),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(reason) ? reason.value = $event : null,
                        placeholder: "Nhập lý do xoá (ít nhất 5 ký tự)...",
                        rows: 3,
                        class: "w-full",
                        maxlength: 500,
                        onFocus: ($event) => vueExports.unref(errors).reason = []
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onFocus"])
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
              __props.transaction ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                vueExports.createVNode("div", { class: "rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 space-y-1 text-sm" }, [
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Mã giao dịch"),
                    vueExports.createVNode("span", { class: "font-mono font-medium text-slate-800" }, vueExports.toDisplayString(__props.transaction.code), 1)
                  ]),
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Loại"),
                    vueExports.createVNode("span", {
                      class: ["inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring ring-inset", __props.transaction.direction.value === "inflow" ? "bg-slate-100 text-slate-900 ring-slate-300" : "bg-rose-50 text-rose-800 ring-rose-200"]
                    }, vueExports.toDisplayString(__props.transaction.direction.label), 3)
                  ]),
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Số tiền"),
                    vueExports.createVNode("span", {
                      class: ["font-bold tabular-nums", __props.transaction.direction.value === "inflow" ? "text-slate-900" : "text-rose-800"]
                    }, vueExports.toDisplayString(__props.transaction.direction.value === "inflow" ? "+" : "-") + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.transaction.amount)), 3)
                  ]),
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Ngày"),
                    vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.transaction.transaction_date)), 1)
                  ]),
                  __props.transaction.note ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "flex justify-between"
                  }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Ghi chú"),
                    vueExports.createVNode("span", { class: "text-slate-700 max-w-48 text-right" }, vueExports.toDisplayString(__props.transaction.note), 1)
                  ])) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.createVNode("div", { class: "rounded-lg bg-slate-50 px-4 py-3 text-sm" }, [
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Số dư hiện tại"),
                    vueExports.createVNode("span", {
                      class: ["font-bold tabular-nums", __props.currentBalance < 0 ? "text-rose-800" : "text-slate-900"]
                    }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(__props.currentBalance))), 3)
                  ]),
                  vueExports.createVNode("div", { class: "flex justify-between mt-1" }, [
                    vueExports.createVNode("span", { class: "text-slate-500" }, "Số dư sau khi xoá"),
                    vueExports.createVNode("span", {
                      class: ["font-bold tabular-nums", vueExports.unref(isNegativeAfter) ? "text-rose-800" : "text-slate-900"]
                    }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(balanceAfter)))), 3)
                  ])
                ]),
                vueExports.unref(isNegativeAfter) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  variant: "subtle",
                  description: `Số dư sẽ chuyển âm: ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(String(vueExports.unref(balanceAfter)))}`,
                  icon: "i-lucide-alert-triangle"
                }, null, 8, ["description"])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UFormField, {
                  label: "Lý do xoá",
                  required: "",
                  error: vueExports.unref(errors).reason?.[0]
                }, {
                  hint: vueExports.withCtx(() => [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(reason).length) + "/500 ", 1)
                  ]),
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(reason),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(reason) ? reason.value = $event : null,
                      placeholder: "Nhập lý do xoá (ít nhất 5 ký tự)...",
                      rows: 3,
                      class: "w-full",
                      maxlength: 500,
                      onFocus: ($event) => vueExports.unref(errors).reason = []
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onFocus"])
                  ]),
                  _: 1
                }, 8, ["error"])
              ])) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "outline",
              onClick: ($event) => emit("close")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận xoá",
              color: "error",
              icon: "i-lucide-trash-2",
              loading: vueExports.unref(isSubmitting),
              disabled: vueExports.unref(reason).trim().length < 5,
              onClick: submit
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "outline",
                  onClick: ($event) => emit("close")
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận xoá",
                  color: "error",
                  icon: "i-lucide-trash-2",
                  loading: vueExports.unref(isSubmitting),
                  disabled: vueExports.unref(reason).trim().length < 5,
                  onClick: submit
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/treasury/DeleteTransactionModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_16 = Object.assign(_sfc_main$2, { __name: "TreasuryDeleteTransactionModal" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TransactionDetailModal",
  __ssrInlineRender: true,
  props: {
    transactionId: {},
    open: { type: Boolean }
  },
  emits: ["close", "delete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const activeTab = vueExports.ref("info");
    vueExports.watch(() => props.open, (val) => {
      if (val) {
        activeTab.value = "info";
      }
    });
    const { data, status } = useCashTransactionDetail(
      vueExports.computed(() => props.transactionId ?? 0)
    );
    const tx = vueExports.computed(() => data.value?.data ?? null);
    const tabs = [
      { label: "Thông tin giao dịch", value: "info" },
      { label: "Lịch sử thay đổi", value: "audit" }
    ];
    function auditEventLabel(event) {
      if (event === "created") return "Tạo mới";
      if (event === "updated") return "Cập nhật";
      if (event === "deleted") return "Xoá";
      return event;
    }
    function auditEventColor(event) {
      if (event === "created") return "text-[var(--ui-success)]";
      if (event === "deleted") return "text-[var(--ui-error)]";
      return "text-[var(--ui-warning)]";
    }
    function formatAuditValues(values) {
      if (!values) return "";
      return Object.entries(values).map(([k, v]) => `${k}: ${v}`).join(", ");
    }
    function handleDelete() {
      if (!tx.value) return;
      emit("delete", {
        id: tx.value.id,
        code: tx.value.code,
        direction: tx.value.direction,
        amount: tx.value.amount,
        category: tx.value.category,
        transaction_date: tx.value.transaction_date,
        source: tx.value.source,
        manual_reconciliation: tx.value.manual_reconciliation,
        note: tx.value.note,
        created_by: tx.value.created_by,
        is_deleted: tx.value.is_deleted,
        auto_deleted: tx.value.auto_deleted,
        delete_reason: tx.value.delete_reason,
        deleted_by: tx.value.deleted_by,
        deleted_at: tx.value.deleted_at
      });
      emit("close");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$f;
      const _component_UIcon = _sfc_main$h;
      const _component_UAlert = _sfc_main$j;
      const _component_UBadge = _sfc_main$d;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: vueExports.unref(tx) ? `Giao dịch ${vueExports.unref(tx).code}` : "Chi tiết giao dịch",
        ui: { content: "max-w-xl" },
        "onUpdate:open": (v) => !v && emit("close")
      }, _attrs), vueExports.createSlots({
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(status) === "pending") {
              _push2(`<div class="flex justify-center py-8"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-loader-circle",
                class: "size-6 animate-spin text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (!vueExports.unref(tx)) {
              _push2(`<div class="text-center py-8 text-slate-400 text-sm"${_scopeId}> Không tìm thấy giao dịch </div>`);
            } else {
              _push2(`<div${_scopeId}>`);
              if (vueExports.unref(tx).is_deleted) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "error",
                  variant: "subtle",
                  title: vueExports.unref(tx).auto_deleted ? "Giao dịch đã bị xoá tự động" : "Giao dịch đã bị xoá thủ công",
                  description: vueExports.unref(tx).delete_reason || void 0,
                  icon: "i-lucide-trash-2",
                  class: "mb-4"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="flex gap-0 border-b border-slate-200 mb-4"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(tabs, (tab) => {
                _push2(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(activeTab) === tab.value ? "border-[var(--ui-primary)] text-[var(--ui-primary)]" : "border-transparent text-slate-500 hover:text-slate-700", "px-4 py-2 text-sm font-medium border-b-2 transition-colors"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(tab.label)}</button>`);
              });
              _push2(`<!--]--></div>`);
              if (vueExports.unref(activeTab) === "info") {
                _push2(`<div class="space-y-4"${_scopeId}><div class="grid grid-cols-2 gap-3 text-sm"${_scopeId}><div${_scopeId}><div class="text-xs text-slate-500 mb-0.5"${_scopeId}> Mã </div><div class="font-mono font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).code)}</div></div><div${_scopeId}><div class="text-xs text-slate-500 mb-0.5"${_scopeId}> Ngày giao dịch </div><div${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(tx).transaction_date))}</div></div><div${_scopeId}><div class="text-xs text-slate-500 mb-0.5"${_scopeId}> Loại </div><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(tx).direction.value === "inflow" ? "bg-slate-100 text-slate-900 ring-slate-300" : "bg-rose-50 text-rose-800 ring-rose-200", "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring ring-inset"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).direction.label)}</span></div><div${_scopeId}><div class="text-xs text-slate-500 mb-0.5"${_scopeId}> Danh mục </div>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  label: vueExports.unref(tx).category.label,
                  color: ("cashTransactionCategoryColor" in _ctx ? _ctx.cashTransactionCategoryColor : vueExports.unref(cashTransactionCategoryColor))(vueExports.unref(tx).category.value),
                  variant: "subtle",
                  size: "sm"
                }, null, _parent2, _scopeId));
                _push2(`</div><div${_scopeId}><div class="text-xs text-slate-500 mb-0.5"${_scopeId}> Số tiền </div><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(tx).direction.value === "inflow" ? "text-slate-900" : "text-rose-800", "font-bold tabular-nums"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).direction.value === "inflow" ? "+" : "-")}${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(tx).amount))}</div></div>`);
                if (vueExports.unref(tx).cash_account) {
                  _push2(`<div${_scopeId}><div class="text-xs text-slate-500 mb-0.5"${_scopeId}> Tài khoản quỹ </div><div${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).cash_account.name)}</div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(tx).created_by) {
                  _push2(`<div${_scopeId}><div class="text-xs text-slate-500 mb-0.5"${_scopeId}> Người tạo </div><div${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).created_by.name)}</div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (vueExports.unref(tx).note) {
                  _push2(`<div class="text-sm"${_scopeId}><div class="text-xs text-slate-500 mb-0.5"${_scopeId}> Ghi chú </div><div class="rounded-lg bg-slate-50 px-3 py-2 text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).note)}</div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(tx).manual_reconciliation) {
                  _push2(`<div class="rounded-lg border border-slate-200 p-3 space-y-1.5 text-sm"${_scopeId}><div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2"${_scopeId}> Đối soát </div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Trạng thái</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: vueExports.unref(tx).manual_reconciliation.status.label,
                    color: ("manualReconciliationStatusColor" in _ctx ? _ctx.manualReconciliationStatusColor : vueExports.unref(manualReconciliationStatusColor))(vueExports.unref(tx).manual_reconciliation.status.value),
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                  if (vueExports.unref(tx).manual_reconciliation.reconciled_at) {
                    _push2(`<div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Ngày đối soát</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(tx).manual_reconciliation.reconciled_at))}</span></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (vueExports.unref(tx).manual_reconciliation.reconciled_by) {
                    _push2(`<div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Người đối soát</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).manual_reconciliation.reconciled_by.name)}</span></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<div${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/finance/reconciliation/${vueExports.unref(tx).manual_reconciliation.id}`,
                    class: "text-[var(--ui-primary)] hover:underline text-sm",
                    onClick: ($event) => emit("close")
                  }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(` Xem trên trang đối soát → `);
                      } else {
                        return [
                          vueExports.createTextVNode(" Xem trên trang đối soát → ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(`</div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(tx).reconciliation) {
                  _push2(`<div class="rounded-lg border border-slate-200 p-3 space-y-1.5 text-sm"${_scopeId}><div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2"${_scopeId}> Nguồn: Đối soát </div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Đối soát #</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/finance/reconciliation/${vueExports.unref(tx).reconciliation.id}`,
                    class: "font-medium text-[var(--ui-primary)] hover:underline",
                    onClick: ($event) => emit("close")
                  }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).reconciliation.id)}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(tx).reconciliation.id), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(`</div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Trạng thái</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: vueExports.unref(tx).reconciliation.status,
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                  if (vueExports.unref(tx).reconciliation.reconciled_at) {
                    _push2(`<div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Ngày đối soát</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(tx).reconciliation.reconciled_at))}</span></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (vueExports.unref(tx).reconciliation.payment_receipt) {
                    _push2(`<!--[--><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Phiếu thu #</span><span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).reconciliation.payment_receipt.id)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Loại</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).reconciliation.payment_receipt.type.label)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Số tiền</span><span class="font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(tx).reconciliation.payment_receipt.amount))}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Ngày trả</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(tx).reconciliation.payment_receipt.paid_at))}</span></div><!--]-->`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (vueExports.unref(tx).source.type === "reconciliation" && vueExports.unref(tx).source.order_id) {
                    _push2(`<div${_scopeId}>`);
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/orders/${vueExports.unref(tx).source.order_id}`,
                      class: "text-[var(--ui-primary)] hover:underline text-sm",
                      onClick: ($event) => emit("close")
                    }, {
                      default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(` Xem đơn hàng ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).source.order_code || vueExports.unref(tx).source.order_id)} → `);
                        } else {
                          return [
                            vueExports.createTextVNode(" Xem đơn hàng " + vueExports.toDisplayString(vueExports.unref(tx).source.order_code || vueExports.unref(tx).source.order_id) + " → ", 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                    _push2(`</div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else if (vueExports.unref(tx).commission_snapshot) {
                  _push2(`<div class="rounded-lg border border-slate-200 p-3 space-y-1.5 text-sm"${_scopeId}><div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2"${_scopeId}> Nguồn: Hoa hồng </div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Snapshot #</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/finance/commission-summary?highlight=${vueExports.unref(tx).commission_snapshot.id}`,
                    class: "font-medium text-[var(--ui-primary)] hover:underline",
                    onClick: ($event) => emit("close")
                  }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).commission_snapshot.id)}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(tx).commission_snapshot.id), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(`</div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Số tiền</span><span class="font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(tx).commission_snapshot.amount))}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Ngày chi trả</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(tx).commission_snapshot.paid_out_at))}</span></div>`);
                  if (vueExports.unref(tx).source.type === "commission_snapshot" && vueExports.unref(tx).source.order_id) {
                    _push2(`<div${_scopeId}>`);
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/orders/${vueExports.unref(tx).source.order_id}`,
                      class: "text-[var(--ui-primary)] hover:underline text-sm",
                      onClick: ($event) => emit("close")
                    }, {
                      default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(` Xem đơn hàng ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).source.order_code || vueExports.unref(tx).source.order_id)} → `);
                        } else {
                          return [
                            vueExports.createTextVNode(" Xem đơn hàng " + vueExports.toDisplayString(vueExports.unref(tx).source.order_code || vueExports.unref(tx).source.order_id) + " → ", 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                    _push2(`</div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(tx).is_deleted && vueExports.unref(tx).deleted_by) {
                  _push2(`<div class="rounded-lg border border-red-100 bg-red-50 p-3 space-y-1.5 text-sm"${_scopeId}><div class="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2"${_scopeId}> Thông tin xoá </div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Người xoá</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).deleted_by.name)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Ngày xoá</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(tx).deleted_at))}</span></div><div class="flex justify-between"${_scopeId}><span class="text-slate-500"${_scopeId}>Loại xoá</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).auto_deleted ? "Tự động" : "Thủ công")}</span></div>`);
                  if (vueExports.unref(tx).delete_reason) {
                    _push2(`<div class="flex justify-between gap-4"${_scopeId}><span class="text-slate-500 shrink-0"${_scopeId}>Lý do</span><span class="text-right text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tx).delete_reason)}</span></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(activeTab) === "audit") {
                _push2(`<div class="space-y-3"${_scopeId}>`);
                if (vueExports.unref(tx).audit_history.length === 0) {
                  _push2(`<div class="text-sm text-slate-400 text-center py-6"${_scopeId}> Không có lịch sử thay đổi </div>`);
                } else {
                  _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(tx).audit_history, (entry, idx) => {
                    _push2(`<div class="flex gap-3 text-sm"${_scopeId}><div class="flex flex-col items-center"${_scopeId}><div class="size-6 rounded-full bg-slate-100 flex items-center justify-center text-xs"${_scopeId}>`);
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-clock",
                      class: "size-3.5 text-slate-400"
                    }, null, _parent2, _scopeId));
                    _push2(`</div>`);
                    if (idx < vueExports.unref(tx).audit_history.length - 1) {
                      _push2(`<div class="w-px flex-1 bg-slate-200 mt-1"${_scopeId}></div>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</div><div class="pb-4 flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([auditEventColor(entry.event), "font-semibold"])}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(auditEventLabel(entry.event))}</span>`);
                    if (entry.user) {
                      _push2(`<span class="text-slate-500"${_scopeId}>bởi ${serverRenderer_cjs_prodExports.ssrInterpolate(entry.user.name)}</span>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`<span class="ml-auto text-xs text-slate-400"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(entry.created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(entry.created_at) : "")}</span></div>`);
                    if (entry.new_values && Object.keys(entry.new_values).length > 0) {
                      _push2(`<div class="mt-1 text-xs text-slate-500 font-mono bg-slate-50 rounded px-2 py-1 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatAuditValues(entry.new_values))}</div>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</div></div>`);
                  });
                  _push2(`<!--]--></div>`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
          } else {
            return [
              vueExports.unref(status) === "pending" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "flex justify-center py-8"
              }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-loader-circle",
                  class: "size-6 animate-spin text-slate-400"
                })
              ])) : !vueExports.unref(tx) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 1,
                class: "text-center py-8 text-slate-400 text-sm"
              }, " Không tìm thấy giao dịch ")) : (vueExports.openBlock(), vueExports.createBlock("div", { key: 2 }, [
                vueExports.unref(tx).is_deleted ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  variant: "subtle",
                  title: vueExports.unref(tx).auto_deleted ? "Giao dịch đã bị xoá tự động" : "Giao dịch đã bị xoá thủ công",
                  description: vueExports.unref(tx).delete_reason || void 0,
                  icon: "i-lucide-trash-2",
                  class: "mb-4"
                }, null, 8, ["title", "description"])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("div", { class: "flex gap-0 border-b border-slate-200 mb-4" }, [
                  (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(tabs, (tab) => {
                    return vueExports.createVNode("button", {
                      key: tab.value,
                      class: ["px-4 py-2 text-sm font-medium border-b-2 transition-colors", vueExports.unref(activeTab) === tab.value ? "border-[var(--ui-primary)] text-[var(--ui-primary)]" : "border-transparent text-slate-500 hover:text-slate-700"],
                      onClick: ($event) => activeTab.value = tab.value
                    }, vueExports.toDisplayString(tab.label), 11, ["onClick"]);
                  }), 64))
                ]),
                vueExports.unref(activeTab) === "info" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "space-y-4"
                }, [
                  vueExports.createVNode("div", { class: "grid grid-cols-2 gap-3 text-sm" }, [
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-0.5" }, " Mã "),
                      vueExports.createVNode("div", { class: "font-mono font-medium" }, vueExports.toDisplayString(vueExports.unref(tx).code), 1)
                    ]),
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-0.5" }, " Ngày giao dịch "),
                      vueExports.createVNode("div", null, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(tx).transaction_date)), 1)
                    ]),
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-0.5" }, " Loại "),
                      vueExports.createVNode("span", {
                        class: ["inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring ring-inset", vueExports.unref(tx).direction.value === "inflow" ? "bg-slate-100 text-slate-900 ring-slate-300" : "bg-rose-50 text-rose-800 ring-rose-200"]
                      }, vueExports.toDisplayString(vueExports.unref(tx).direction.label), 3)
                    ]),
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-0.5" }, " Danh mục "),
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(tx).category.label,
                        color: ("cashTransactionCategoryColor" in _ctx ? _ctx.cashTransactionCategoryColor : vueExports.unref(cashTransactionCategoryColor))(vueExports.unref(tx).category.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-0.5" }, " Số tiền "),
                      vueExports.createVNode("div", {
                        class: ["font-bold tabular-nums", vueExports.unref(tx).direction.value === "inflow" ? "text-slate-900" : "text-rose-800"]
                      }, vueExports.toDisplayString(vueExports.unref(tx).direction.value === "inflow" ? "+" : "-") + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(tx).amount)), 3)
                    ]),
                    vueExports.unref(tx).cash_account ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 0 }, [
                      vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-0.5" }, " Tài khoản quỹ "),
                      vueExports.createVNode("div", null, vueExports.toDisplayString(vueExports.unref(tx).cash_account.name), 1)
                    ])) : vueExports.createCommentVNode("", true),
                    vueExports.unref(tx).created_by ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 1 }, [
                      vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-0.5" }, " Người tạo "),
                      vueExports.createVNode("div", null, vueExports.toDisplayString(vueExports.unref(tx).created_by.name), 1)
                    ])) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.unref(tx).note ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "text-sm"
                  }, [
                    vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-0.5" }, " Ghi chú "),
                    vueExports.createVNode("div", { class: "rounded-lg bg-slate-50 px-3 py-2 text-slate-700" }, vueExports.toDisplayString(vueExports.unref(tx).note), 1)
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(tx).manual_reconciliation ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "rounded-lg border border-slate-200 p-3 space-y-1.5 text-sm"
                  }, [
                    vueExports.createVNode("div", { class: "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2" }, " Đối soát "),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Trạng thái"),
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(tx).manual_reconciliation.status.label,
                        color: ("manualReconciliationStatusColor" in _ctx ? _ctx.manualReconciliationStatusColor : vueExports.unref(manualReconciliationStatusColor))(vueExports.unref(tx).manual_reconciliation.status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    vueExports.unref(tx).manual_reconciliation.reconciled_at ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex justify-between"
                    }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Ngày đối soát"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(tx).manual_reconciliation.reconciled_at)), 1)
                    ])) : vueExports.createCommentVNode("", true),
                    vueExports.unref(tx).manual_reconciliation.reconciled_by ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "flex justify-between"
                    }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Người đối soát"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(vueExports.unref(tx).manual_reconciliation.reconciled_by.name), 1)
                    ])) : vueExports.createCommentVNode("", true),
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/finance/reconciliation/${vueExports.unref(tx).manual_reconciliation.id}`,
                        class: "text-[var(--ui-primary)] hover:underline text-sm",
                        onClick: ($event) => emit("close")
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(" Xem trên trang đối soát → ")
                        ]),
                        _: 1
                      }, 8, ["to", "onClick"])
                    ])
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(tx).reconciliation ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 2,
                    class: "rounded-lg border border-slate-200 p-3 space-y-1.5 text-sm"
                  }, [
                    vueExports.createVNode("div", { class: "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2" }, " Nguồn: Đối soát "),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Đối soát #"),
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/finance/reconciliation/${vueExports.unref(tx).reconciliation.id}`,
                        class: "font-medium text-[var(--ui-primary)] hover:underline",
                        onClick: ($event) => emit("close")
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(tx).reconciliation.id), 1)
                        ]),
                        _: 1
                      }, 8, ["to", "onClick"])
                    ]),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Trạng thái"),
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(tx).reconciliation.status,
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label"])
                    ]),
                    vueExports.unref(tx).reconciliation.reconciled_at ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex justify-between"
                    }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Ngày đối soát"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(tx).reconciliation.reconciled_at)), 1)
                    ])) : vueExports.createCommentVNode("", true),
                    vueExports.unref(tx).reconciliation.payment_receipt ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                      vueExports.createVNode("div", { class: "flex justify-between" }, [
                        vueExports.createVNode("span", { class: "text-slate-500" }, "Phiếu thu #"),
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(tx).reconciliation.payment_receipt.id), 1)
                      ]),
                      vueExports.createVNode("div", { class: "flex justify-between" }, [
                        vueExports.createVNode("span", { class: "text-slate-500" }, "Loại"),
                        vueExports.createVNode("span", null, vueExports.toDisplayString(vueExports.unref(tx).reconciliation.payment_receipt.type.label), 1)
                      ]),
                      vueExports.createVNode("div", { class: "flex justify-between" }, [
                        vueExports.createVNode("span", { class: "text-slate-500" }, "Số tiền"),
                        vueExports.createVNode("span", { class: "font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(tx).reconciliation.payment_receipt.amount)), 1)
                      ]),
                      vueExports.createVNode("div", { class: "flex justify-between" }, [
                        vueExports.createVNode("span", { class: "text-slate-500" }, "Ngày trả"),
                        vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(tx).reconciliation.payment_receipt.paid_at)), 1)
                      ])
                    ], 64)) : vueExports.createCommentVNode("", true),
                    vueExports.unref(tx).source.type === "reconciliation" && vueExports.unref(tx).source.order_id ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 2 }, [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/orders/${vueExports.unref(tx).source.order_id}`,
                        class: "text-[var(--ui-primary)] hover:underline text-sm",
                        onClick: ($event) => emit("close")
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(" Xem đơn hàng " + vueExports.toDisplayString(vueExports.unref(tx).source.order_code || vueExports.unref(tx).source.order_id) + " → ", 1)
                        ]),
                        _: 1
                      }, 8, ["to", "onClick"])
                    ])) : vueExports.createCommentVNode("", true)
                  ])) : vueExports.unref(tx).commission_snapshot ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 3,
                    class: "rounded-lg border border-slate-200 p-3 space-y-1.5 text-sm"
                  }, [
                    vueExports.createVNode("div", { class: "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2" }, " Nguồn: Hoa hồng "),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Snapshot #"),
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/finance/commission-summary?highlight=${vueExports.unref(tx).commission_snapshot.id}`,
                        class: "font-medium text-[var(--ui-primary)] hover:underline",
                        onClick: ($event) => emit("close")
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(tx).commission_snapshot.id), 1)
                        ]),
                        _: 1
                      }, 8, ["to", "onClick"])
                    ]),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Số tiền"),
                      vueExports.createVNode("span", { class: "font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(tx).commission_snapshot.amount)), 1)
                    ]),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Ngày chi trả"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(tx).commission_snapshot.paid_out_at)), 1)
                    ]),
                    vueExports.unref(tx).source.type === "commission_snapshot" && vueExports.unref(tx).source.order_id ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 0 }, [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/orders/${vueExports.unref(tx).source.order_id}`,
                        class: "text-[var(--ui-primary)] hover:underline text-sm",
                        onClick: ($event) => emit("close")
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(" Xem đơn hàng " + vueExports.toDisplayString(vueExports.unref(tx).source.order_code || vueExports.unref(tx).source.order_id) + " → ", 1)
                        ]),
                        _: 1
                      }, 8, ["to", "onClick"])
                    ])) : vueExports.createCommentVNode("", true)
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(tx).is_deleted && vueExports.unref(tx).deleted_by ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 4,
                    class: "rounded-lg border border-red-100 bg-red-50 p-3 space-y-1.5 text-sm"
                  }, [
                    vueExports.createVNode("div", { class: "text-xs font-semibold text-red-600 uppercase tracking-wide mb-2" }, " Thông tin xoá "),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Người xoá"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(vueExports.unref(tx).deleted_by.name), 1)
                    ]),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Ngày xoá"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(tx).deleted_at)), 1)
                    ]),
                    vueExports.createVNode("div", { class: "flex justify-between" }, [
                      vueExports.createVNode("span", { class: "text-slate-500" }, "Loại xoá"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(vueExports.unref(tx).auto_deleted ? "Tự động" : "Thủ công"), 1)
                    ]),
                    vueExports.unref(tx).delete_reason ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex justify-between gap-4"
                    }, [
                      vueExports.createVNode("span", { class: "text-slate-500 shrink-0" }, "Lý do"),
                      vueExports.createVNode("span", { class: "text-right text-slate-700" }, vueExports.toDisplayString(vueExports.unref(tx).delete_reason), 1)
                    ])) : vueExports.createCommentVNode("", true)
                  ])) : vueExports.createCommentVNode("", true)
                ])) : vueExports.createCommentVNode("", true),
                vueExports.unref(activeTab) === "audit" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  class: "space-y-3"
                }, [
                  vueExports.unref(tx).audit_history.length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "text-sm text-slate-400 text-center py-6"
                  }, " Không có lịch sử thay đổi ")) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "space-y-3"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(tx).audit_history, (entry, idx) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: idx,
                        class: "flex gap-3 text-sm"
                      }, [
                        vueExports.createVNode("div", { class: "flex flex-col items-center" }, [
                          vueExports.createVNode("div", { class: "size-6 rounded-full bg-slate-100 flex items-center justify-center text-xs" }, [
                            vueExports.createVNode(_component_UIcon, {
                              name: "i-lucide-clock",
                              class: "size-3.5 text-slate-400"
                            })
                          ]),
                          idx < vueExports.unref(tx).audit_history.length - 1 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 0,
                            class: "w-px flex-1 bg-slate-200 mt-1"
                          })) : vueExports.createCommentVNode("", true)
                        ]),
                        vueExports.createVNode("div", { class: "pb-4 flex-1 min-w-0" }, [
                          vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                            vueExports.createVNode("span", {
                              class: ["font-semibold", auditEventColor(entry.event)]
                            }, vueExports.toDisplayString(auditEventLabel(entry.event)), 3),
                            entry.user ? (vueExports.openBlock(), vueExports.createBlock("span", {
                              key: 0,
                              class: "text-slate-500"
                            }, "bởi " + vueExports.toDisplayString(entry.user.name), 1)) : vueExports.createCommentVNode("", true),
                            vueExports.createVNode("span", { class: "ml-auto text-xs text-slate-400" }, vueExports.toDisplayString(entry.created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(entry.created_at) : ""), 1)
                          ]),
                          entry.new_values && Object.keys(entry.new_values).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 0,
                            class: "mt-1 text-xs text-slate-500 font-mono bg-slate-50 rounded px-2 py-1 truncate"
                          }, vueExports.toDisplayString(formatAuditValues(entry.new_values)), 1)) : vueExports.createCommentVNode("", true)
                        ])
                      ]);
                    }), 128))
                  ]))
                ])) : vueExports.createCommentVNode("", true)
              ]))
            ];
          }
        }),
        _: 2
      }, [
        vueExports.unref(tx) && !vueExports.unref(tx).is_deleted && vueExports.unref(tx).source.type === "manual" ? {
          name: "footer",
          fn: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex justify-between w-full"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Xoá giao dịch",
                color: "error",
                variant: "ghost",
                icon: "i-lucide-trash-2",
                onClick: handleDelete
              }, null, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Đóng",
                color: "neutral",
                variant: "outline",
                onClick: ($event) => emit("close")
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex justify-between w-full" }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Xoá giao dịch",
                    color: "error",
                    variant: "ghost",
                    icon: "i-lucide-trash-2",
                    onClick: handleDelete
                  }),
                  vueExports.createVNode(_component_UButton, {
                    label: "Đóng",
                    color: "neutral",
                    variant: "outline",
                    onClick: ($event) => emit("close")
                  }, null, 8, ["onClick"])
                ])
              ];
            }
          }),
          key: "0"
        } : {
          name: "footer",
          fn: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex justify-end"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Đóng",
                color: "neutral",
                variant: "outline",
                onClick: ($event) => emit("close")
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex justify-end" }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Đóng",
                    color: "neutral",
                    variant: "outline",
                    onClick: ($event) => emit("close")
                  }, null, 8, ["onClick"])
                ])
              ];
            }
          }),
          key: "1"
        }
      ]), _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/treasury/TransactionDetailModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_17 = Object.assign(_sfc_main$1, { __name: "TreasuryTransactionDetailModal" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Quản lý dòng tiền - Thần Nông" });
    function defaultDateFrom() {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - 30);
      return d.toISOString().slice(0, 10);
    }
    function defaultDateTo() {
      return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    }
    function toPickerDate(str) {
      return /* @__PURE__ */ new Date(str + "T00:00:00");
    }
    function pickerDateToStr(d) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
    const dateRange = vueExports.ref([toPickerDate(defaultDateFrom()), toPickerDate(defaultDateTo())]);
    const dateFrom = vueExports.computed(() => dateRange.value ? pickerDateToStr(dateRange.value[0]) : void 0);
    const dateTo = vueExports.computed(() => dateRange.value ? pickerDateToStr(dateRange.value[1]) : void 0);
    const selectedDirection = vueExports.ref(void 0);
    const selectedCategory = vueExports.ref(void 0);
    const selectedIncludeDeleted = vueExports.ref("none");
    const searchOrderId = vueExports.ref("");
    const page = vueExports.ref(1);
    const kpiParams = vueExports.computed(() => ({
      date_from: dateFrom.value,
      date_to: dateTo.value
    }));
    const tableParams = vueExports.computed(() => ({
      date_from: dateFrom.value,
      date_to: dateTo.value,
      direction: selectedDirection.value,
      category: selectedCategory.value,
      include_deleted: selectedIncludeDeleted.value === "none" ? void 0 : selectedIncludeDeleted.value,
      search: searchOrderId.value || void 0,
      per_page: DEFAULT_PER_PAGE,
      page: page.value
    }));
    vueExports.watch([selectedDirection, selectedCategory, selectedIncludeDeleted, searchOrderId, dateRange], () => {
      page.value = 1;
    });
    const { data: accountData, status: accountStatus, refresh: refreshAccount } = useCashAccountDefault();
    const account = vueExports.computed(() => accountData.value?.data ?? null);
    const currentBalance = vueExports.computed(() => account.value?.current_balance != null ? parseFloat(account.value.current_balance) : 0);
    const { data: kpiData, status: kpiStatus, refresh: refreshKpi } = useTreasuryKpi(kpiParams);
    const kpi = vueExports.computed(() => kpiData.value?.data ?? null);
    const { data: txData, status: txStatus, error: txError, refresh: refreshTx } = useCashTransactionList(tableParams);
    const transactions = vueExports.computed(() => txData.value?.data ?? []);
    async function refreshAll() {
      await Promise.all([refreshAccount(), refreshKpi(), refreshTx()]);
    }
    const showTopupModal = vueExports.ref(false);
    const showWithdrawModal = vueExports.ref(false);
    const showDeleteModal = vueExports.ref(false);
    const deleteTarget = vueExports.ref(null);
    const showDetailModal = vueExports.ref(false);
    const detailId = vueExports.ref(null);
    function openDetail(tx) {
      detailId.value = tx.id;
      showDetailModal.value = true;
    }
    function openDelete(tx) {
      deleteTarget.value = tx;
      showDeleteModal.value = true;
    }
    function handleDetailDelete(tx) {
      showDetailModal.value = false;
      openDelete(tx);
    }
    const columns = [
      { id: "code", header: "Mã" },
      { id: "date", header: "Ngày" },
      { id: "direction", header: "Loại" },
      { id: "category", header: "Danh mục" },
      { id: "amount", header: "Số tiền" },
      { id: "source", header: "Nguồn" },
      { id: "reconciliation", header: "TT đối soát" },
      { id: "note", header: "Ghi chú" },
      stickyRight({ id: "actions", header: "" })
    ];
    const includeDeletedOptions = CASH_TRANSACTION_INCLUDE_DELETED_OPTIONS;
    function hasFilters() {
      return !!selectedDirection.value || !!selectedCategory.value || !!searchOrderId.value || selectedIncludeDeleted.value !== "none";
    }
    function clearFilters() {
      selectedDirection.value = void 0;
      selectedCategory.value = void 0;
      selectedIncludeDeleted.value = "none";
      searchOrderId.value = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_TreasuryAccountCard = __nuxt_component_2;
      const _component_UIcon = _sfc_main$h;
      const _component_TreasuryKpiRow = __nuxt_component_4;
      const _component_TreasuryFlowChart = __nuxt_component_5;
      const _component_UInput = _sfc_main$8;
      const _component_USelect = _sfc_main$9;
      const _component_SharedCrudTableWrapper = __nuxt_component_2$1;
      const _component_UTable = _sfc_main$a;
      const _component_UBadge = _sfc_main$d;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UTooltip = _sfc_main$b;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_TreasuryManualTopupModal = __nuxt_component_14;
      const _component_TreasuryManualWithdrawModal = __nuxt_component_15;
      const _component_TreasuryDeleteTransactionModal = __nuxt_component_16;
      const _component_TreasuryTransactionDetailModal = __nuxt_component_17;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Quản lý dòng tiền",
        description: "Theo dõi dòng tiền và số dư tài khoản quỹ"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Nạp tiền",
              icon: "i-lucide-plus",
              variant: "solid",
              class: "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-800 focus-visible:outline-slate-900",
              disabled: !vueExports.unref(account),
              onClick: ($event) => showTopupModal.value = true
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Rút tiền",
              icon: "i-lucide-minus",
              variant: "solid",
              class: "bg-rose-800 text-white hover:bg-rose-900 active:bg-rose-900 focus-visible:outline-rose-800",
              disabled: !vueExports.unref(account),
              onClick: ($event) => showWithdrawModal.value = true
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                label: "Nạp tiền",
                icon: "i-lucide-plus",
                variant: "solid",
                class: "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-800 focus-visible:outline-slate-900",
                disabled: !vueExports.unref(account),
                onClick: ($event) => showTopupModal.value = true
              }, null, 8, ["disabled", "onClick"]),
              vueExports.createVNode(_component_UButton, {
                label: "Rút tiền",
                icon: "i-lucide-minus",
                variant: "solid",
                class: "bg-rose-800 text-white hover:bg-rose-900 active:bg-rose-900 focus-visible:outline-rose-800",
                disabled: !vueExports.unref(account),
                onClick: ($event) => showWithdrawModal.value = true
              }, null, 8, ["disabled", "onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mb-4 sm:mb-6">`);
      if (vueExports.unref(accountStatus) === "pending") {
        _push(`<div class="h-24 rounded-xl bg-slate-100 animate-pulse"></div>`);
      } else if (vueExports.unref(account)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TreasuryAccountCard, { account: vueExports.unref(account) }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-4 flex flex-wrap items-center gap-3"><div class="flex items-center gap-2">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-calendar",
        class: "size-4 text-slate-400"
      }, null, _parent));
      _push(`<span class="text-sm text-slate-600 font-medium">Khoảng thời gian:</span></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Zl), {
        modelValue: vueExports.unref(dateRange),
        "onUpdate:modelValue": ($event) => vueExports.isRef(dateRange) ? dateRange.value = $event : null,
        range: "",
        "time-config": { enableTimePicker: false },
        format: "dd/MM/yyyy",
        "auto-apply": "",
        "max-date": /* @__PURE__ */ new Date(),
        class: "w-64"
      }, null, _parent));
      _push(`</div><div class="mb-4 sm:mb-6">`);
      if (vueExports.unref(kpiStatus) === "pending") {
        _push(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-3"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(4, (n) => {
          _push(`<div class="h-20 rounded-xl bg-slate-100 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(kpi)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TreasuryKpiRow, { kpi: vueExports.unref(kpi) }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(kpi)) {
        _push(`<div class="mb-4 sm:mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TreasuryFlowChart, { kpi: vueExports.unref(kpi) }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-3 flex flex-wrap items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchOrderId),
        "onUpdate:modelValue": ($event) => vueExports.isRef(searchOrderId) ? searchOrderId.value = $event : null,
        icon: "i-lucide-search",
        placeholder: "Tìm theo mã giao dịch, ghi chú...",
        class: "max-w-xs"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedDirection),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedDirection) ? selectedDirection.value = $event : null,
        items: "CASH_TRANSACTION_DIRECTION_OPTIONS" in _ctx ? _ctx.CASH_TRANSACTION_DIRECTION_OPTIONS : vueExports.unref(CASH_TRANSACTION_DIRECTION_OPTIONS),
        placeholder: "Hướng",
        class: "w-36"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedCategory),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedCategory) ? selectedCategory.value = $event : null,
        items: "CASH_TRANSACTION_CATEGORY_OPTIONS" in _ctx ? _ctx.CASH_TRANSACTION_CATEGORY_OPTIONS : vueExports.unref(CASH_TRANSACTION_CATEGORY_OPTIONS),
        placeholder: "Danh mục",
        class: "w-48"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedIncludeDeleted),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedIncludeDeleted) ? selectedIncludeDeleted.value = $event : null,
        items: vueExports.unref(includeDeletedOptions),
        class: "w-52"
      }, null, _parent));
      if (hasFilters()) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Xoá bộ lọc",
          color: "neutral",
          variant: "ghost",
          icon: "i-lucide-x",
          size: "sm",
          onClick: clearFilters
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
        status: vueExports.unref(txStatus),
        error: vueExports.unref(txError),
        data: vueExports.unref(txData),
        refresh: vueExports.unref(refreshTx)
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-white border rounded-xl overflow-hidden"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(transactions),
              columns
            }, {
              "code-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([row.original.is_deleted ? "line-through text-slate-400" : "", "font-mono text-sm text-[var(--ui-primary)] hover:underline"])}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}</button>`);
                } else {
                  return [
                    vueExports.createVNode("button", {
                      class: ["font-mono text-sm text-[var(--ui-primary)] hover:underline", row.original.is_deleted ? "line-through text-slate-400" : ""],
                      onClick: ($event) => openDetail(row.original)
                    }, vueExports.toDisplayString(row.original.code), 11, ["onClick"])
                  ];
                }
              }),
              "date-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([row.original.is_deleted ? "text-slate-400" : "text-slate-700", "text-sm"])}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.transaction_date))}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", {
                      class: ["text-sm", row.original.is_deleted ? "text-slate-400" : "text-slate-700"]
                    }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.transaction_date)), 3)
                  ];
                }
              }),
              "direction-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-1.5"${_scopeId2}><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
                    row.original.direction.value === "inflow" ? "bg-slate-100 text-slate-900 ring-slate-300" : "bg-rose-50 text-rose-800 ring-rose-200",
                    row.original.is_deleted ? "opacity-50" : ""
                  ], "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring ring-inset"])}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.direction.label)}</span>`);
                  if (row.original.is_deleted) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: "Đã xoá",
                      color: "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex items-center gap-1.5" }, [
                      vueExports.createVNode("span", {
                        class: ["inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring ring-inset", [
                          row.original.direction.value === "inflow" ? "bg-slate-100 text-slate-900 ring-slate-300" : "bg-rose-50 text-rose-800 ring-rose-200",
                          row.original.is_deleted ? "opacity-50" : ""
                        ]]
                      }, vueExports.toDisplayString(row.original.direction.label), 3),
                      row.original.is_deleted ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 0,
                        label: "Đã xoá",
                        color: "neutral",
                        variant: "subtle",
                        size: "sm"
                      })) : vueExports.createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              "category-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.category.label,
                    color: ("cashTransactionCategoryColor" in _ctx ? _ctx.cashTransactionCategoryColor : vueExports.unref(cashTransactionCategoryColor))(row.original.category.value),
                    variant: "subtle",
                    size: "sm",
                    class: row.original.is_deleted ? "opacity-50" : ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.category.label,
                      color: ("cashTransactionCategoryColor" in _ctx ? _ctx.cashTransactionCategoryColor : vueExports.unref(cashTransactionCategoryColor))(row.original.category.value),
                      variant: "subtle",
                      size: "sm",
                      class: row.original.is_deleted ? "opacity-50" : ""
                    }, null, 8, ["label", "color", "class"])
                  ];
                }
              }),
              "amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
                    row.original.is_deleted ? "line-through text-slate-400" : row.original.direction.value === "inflow" ? "text-slate-900" : "text-rose-800"
                  ], "font-bold tabular-nums text-sm"])}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.direction.value === "inflow" ? "+" : "-")}${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount))}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", {
                      class: ["font-bold tabular-nums text-sm", [
                        row.original.is_deleted ? "line-through text-slate-400" : row.original.direction.value === "inflow" ? "text-slate-900" : "text-rose-800"
                      ]]
                    }, vueExports.toDisplayString(row.original.direction.value === "inflow" ? "+" : "-") + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 3)
                  ];
                }
              }),
              "source-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-sm text-slate-600"${_scopeId2}>`);
                  if (row.original.source.type === "manual") {
                    _push3(`<!--[--> Thủ công <!--]-->`);
                  } else if (row.original.source.type === "reconciliation") {
                    _push3(`<!--[-->`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/finance/reconciliation/${row.original.source.id}`,
                      class: "text-[var(--ui-primary)] hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Đối soát #${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.source.id)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(" Đối soát #" + vueExports.toDisplayString(row.original.source.id), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    if (row.original.source.order_code) {
                      _push3(`<!--[--> → `);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/orders/${row.original.source.order_id}`,
                        class: "text-[var(--ui-primary)] hover:underline"
                      }, {
                        default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.source.order_code)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.source.order_code), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`<!--]-->`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--]-->`);
                  } else if (row.original.source.type === "commission_snapshot") {
                    _push3(`<!--[-->`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/finance/commission-summary?highlight=${row.original.source.id}`,
                      class: "text-[var(--ui-primary)] hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Snapshot #${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.source.id)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(" Snapshot #" + vueExports.toDisplayString(row.original.source.id), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    if (row.original.source.order_code) {
                      _push3(`<!--[--> → `);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/orders/${row.original.source.order_id}`,
                        class: "text-[var(--ui-primary)] hover:underline"
                      }, {
                        default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.source.order_code)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.source.order_code), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`<!--]-->`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--]-->`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "text-sm text-slate-600" }, [
                      row.original.source.type === "manual" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                        vueExports.createTextVNode(" Thủ công ")
                      ], 64)) : row.original.source.type === "reconciliation" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/finance/reconciliation/${row.original.source.id}`,
                          class: "text-[var(--ui-primary)] hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(" Đối soát #" + vueExports.toDisplayString(row.original.source.id), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"]),
                        row.original.source.order_code ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createTextVNode(" → "),
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/orders/${row.original.source.order_id}`,
                            class: "text-[var(--ui-primary)] hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.source.order_code), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ], 64)) : vueExports.createCommentVNode("", true)
                      ], 64)) : row.original.source.type === "commission_snapshot" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/finance/commission-summary?highlight=${row.original.source.id}`,
                          class: "text-[var(--ui-primary)] hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(" Snapshot #" + vueExports.toDisplayString(row.original.source.id), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"]),
                        row.original.source.order_code ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createTextVNode(" → "),
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/orders/${row.original.source.order_id}`,
                            class: "text-[var(--ui-primary)] hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.source.order_code), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ], 64)) : vueExports.createCommentVNode("", true)
                      ], 64)) : vueExports.createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              "reconciliation-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.manual_reconciliation) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: row.original.manual_reconciliation.status.label,
                      color: ("manualReconciliationStatusColor" in _ctx ? _ctx.manualReconciliationStatusColor : vueExports.unref(manualReconciliationStatusColor))(row.original.manual_reconciliation.status.value),
                      variant: "subtle",
                      size: "sm",
                      to: `/pmc/finance/reconciliation/${row.original.manual_reconciliation.id}`,
                      class: row.original.is_deleted ? "opacity-50" : ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<span class="text-xs text-slate-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.manual_reconciliation ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.manual_reconciliation.status.label,
                      color: ("manualReconciliationStatusColor" in _ctx ? _ctx.manualReconciliationStatusColor : vueExports.unref(manualReconciliationStatusColor))(row.original.manual_reconciliation.status.value),
                      variant: "subtle",
                      size: "sm",
                      to: `/pmc/finance/reconciliation/${row.original.manual_reconciliation.id}`,
                      class: row.original.is_deleted ? "opacity-50" : ""
                    }, null, 8, ["label", "color", "to", "class"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-slate-400"
                    }, "—"))
                  ];
                }
              }),
              "note-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([row.original.is_deleted ? "text-slate-400" : "text-slate-600", "text-sm max-w-44 truncate block"])}"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", row.original.note)}${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.note || "—")}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", {
                      class: ["text-sm max-w-44 truncate block", row.original.is_deleted ? "text-slate-400" : "text-slate-600"],
                      title: row.original.note
                    }, vueExports.toDisplayString(row.original.note || "—"), 11, ["title"])
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-1"${_scopeId2}>`);
                  if (row.original.source.type !== "manual" && !row.original.is_deleted) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTooltip, { text: "Giao dịch tự động. Thao tác ở đối soát / snapshot hoa hồng." }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                            icon: "i-lucide-trash-2",
                            color: "error",
                            variant: "ghost",
                            size: "xs",
                            disabled: ""
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_UButton, {
                              icon: "i-lucide-trash-2",
                              color: "error",
                              variant: "ghost",
                              size: "xs",
                              disabled: ""
                            })
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else if (row.original.source.type === "manual" && !row.original.is_deleted) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-trash-2",
                      color: "error",
                      variant: "ghost",
                      size: "xs",
                      onClick: ($event) => openDelete(row.original)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                      row.original.source.type !== "manual" && !row.original.is_deleted ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                        key: 0,
                        text: "Giao dịch tự động. Thao tác ở đối soát / snapshot hoa hồng."
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_UButton, {
                            icon: "i-lucide-trash-2",
                            color: "error",
                            variant: "ghost",
                            size: "xs",
                            disabled: ""
                          })
                        ]),
                        _: 1
                      })) : row.original.source.type === "manual" && !row.original.is_deleted ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 1,
                        icon: "i-lucide-trash-2",
                        color: "error",
                        variant: "ghost",
                        size: "xs",
                        onClick: vueExports.withModifiers(($event) => openDelete(row.original), ["stop"])
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
              meta: vueExports.unref(txData)?.meta
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "bg-white border rounded-xl overflow-hidden" }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(transactions),
                  columns
                }, {
                  "code-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("button", {
                      class: ["font-mono text-sm text-[var(--ui-primary)] hover:underline", row.original.is_deleted ? "line-through text-slate-400" : ""],
                      onClick: ($event) => openDetail(row.original)
                    }, vueExports.toDisplayString(row.original.code), 11, ["onClick"])
                  ]),
                  "date-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", {
                      class: ["text-sm", row.original.is_deleted ? "text-slate-400" : "text-slate-700"]
                    }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.transaction_date)), 3)
                  ]),
                  "direction-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex items-center gap-1.5" }, [
                      vueExports.createVNode("span", {
                        class: ["inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring ring-inset", [
                          row.original.direction.value === "inflow" ? "bg-slate-100 text-slate-900 ring-slate-300" : "bg-rose-50 text-rose-800 ring-rose-200",
                          row.original.is_deleted ? "opacity-50" : ""
                        ]]
                      }, vueExports.toDisplayString(row.original.direction.label), 3),
                      row.original.is_deleted ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 0,
                        label: "Đã xoá",
                        color: "neutral",
                        variant: "subtle",
                        size: "sm"
                      })) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  "category-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.category.label,
                      color: ("cashTransactionCategoryColor" in _ctx ? _ctx.cashTransactionCategoryColor : vueExports.unref(cashTransactionCategoryColor))(row.original.category.value),
                      variant: "subtle",
                      size: "sm",
                      class: row.original.is_deleted ? "opacity-50" : ""
                    }, null, 8, ["label", "color", "class"])
                  ]),
                  "amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", {
                      class: ["font-bold tabular-nums text-sm", [
                        row.original.is_deleted ? "line-through text-slate-400" : row.original.direction.value === "inflow" ? "text-slate-900" : "text-rose-800"
                      ]]
                    }, vueExports.toDisplayString(row.original.direction.value === "inflow" ? "+" : "-") + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 3)
                  ]),
                  "source-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "text-sm text-slate-600" }, [
                      row.original.source.type === "manual" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                        vueExports.createTextVNode(" Thủ công ")
                      ], 64)) : row.original.source.type === "reconciliation" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/finance/reconciliation/${row.original.source.id}`,
                          class: "text-[var(--ui-primary)] hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(" Đối soát #" + vueExports.toDisplayString(row.original.source.id), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"]),
                        row.original.source.order_code ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createTextVNode(" → "),
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/orders/${row.original.source.order_id}`,
                            class: "text-[var(--ui-primary)] hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.source.order_code), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ], 64)) : vueExports.createCommentVNode("", true)
                      ], 64)) : row.original.source.type === "commission_snapshot" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                        vueExports.createVNode(_component_NuxtLink, {
                          to: `/pmc/finance/commission-summary?highlight=${row.original.source.id}`,
                          class: "text-[var(--ui-primary)] hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(" Snapshot #" + vueExports.toDisplayString(row.original.source.id), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"]),
                        row.original.source.order_code ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createTextVNode(" → "),
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/orders/${row.original.source.order_id}`,
                            class: "text-[var(--ui-primary)] hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.original.source.order_code), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ], 64)) : vueExports.createCommentVNode("", true)
                      ], 64)) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  "reconciliation-cell": vueExports.withCtx(({ row }) => [
                    row.original.manual_reconciliation ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      label: row.original.manual_reconciliation.status.label,
                      color: ("manualReconciliationStatusColor" in _ctx ? _ctx.manualReconciliationStatusColor : vueExports.unref(manualReconciliationStatusColor))(row.original.manual_reconciliation.status.value),
                      variant: "subtle",
                      size: "sm",
                      to: `/pmc/finance/reconciliation/${row.original.manual_reconciliation.id}`,
                      class: row.original.is_deleted ? "opacity-50" : ""
                    }, null, 8, ["label", "color", "to", "class"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-slate-400"
                    }, "—"))
                  ]),
                  "note-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", {
                      class: ["text-sm max-w-44 truncate block", row.original.is_deleted ? "text-slate-400" : "text-slate-600"],
                      title: row.original.note
                    }, vueExports.toDisplayString(row.original.note || "—"), 11, ["title"])
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                      row.original.source.type !== "manual" && !row.original.is_deleted ? (vueExports.openBlock(), vueExports.createBlock(_component_UTooltip, {
                        key: 0,
                        text: "Giao dịch tự động. Thao tác ở đối soát / snapshot hoa hồng."
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_UButton, {
                            icon: "i-lucide-trash-2",
                            color: "error",
                            variant: "ghost",
                            size: "xs",
                            disabled: ""
                          })
                        ]),
                        _: 1
                      })) : row.original.source.type === "manual" && !row.original.is_deleted ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                        key: 1,
                        icon: "i-lucide-trash-2",
                        color: "error",
                        variant: "ghost",
                        size: "xs",
                        onClick: vueExports.withModifiers(($event) => openDelete(row.original), ["stop"])
                      }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  _: 1
                }, 8, ["data"]),
                vueExports.createVNode(_component_SharedCrudTablePagination, {
                  page: vueExports.unref(page),
                  "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
                  meta: vueExports.unref(txData)?.meta
                }, null, 8, ["page", "onUpdate:page", "meta"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (vueExports.unref(account)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TreasuryManualTopupModal, {
          account: vueExports.unref(account),
          open: vueExports.unref(showTopupModal),
          onClose: ($event) => showTopupModal.value = false,
          onSuccess: refreshAll
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(account)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TreasuryManualWithdrawModal, {
          account: vueExports.unref(account),
          "current-balance": vueExports.unref(currentBalance),
          open: vueExports.unref(showWithdrawModal),
          onClose: ($event) => showWithdrawModal.value = false,
          onSuccess: refreshAll
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TreasuryDeleteTransactionModal, {
        transaction: vueExports.unref(deleteTarget),
        "current-balance": vueExports.unref(currentBalance),
        open: vueExports.unref(showDeleteModal),
        onClose: ($event) => {
          showDeleteModal.value = false;
          deleteTarget.value = null;
        },
        onSuccess: refreshAll
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TreasuryTransactionDetailModal, {
        "transaction-id": vueExports.unref(detailId),
        open: vueExports.unref(showDetailModal),
        onClose: ($event) => {
          showDetailModal.value = false;
          detailId.value = null;
        },
        onDelete: handleDetailDelete
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/finance/treasury/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CsmEt6Ao.mjs.map
