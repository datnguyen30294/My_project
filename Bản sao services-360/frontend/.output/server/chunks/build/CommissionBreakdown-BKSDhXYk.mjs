import { f as formatCurrency, b as formatPercent } from './currency-DEb2TrW3.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$2 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$3 } from './Alert-tTsPKADX.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { x as platformContractLocation, t as tenantContractLocation } from './usePartnerCommissionContracts-DUXun7gY.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ItemsTable",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "border border-slate-200 rounded-lg overflow-hidden" }, _attrs))}><table class="w-full text-sm"><thead class="bg-slate-50 text-slate-600"><tr><th class="w-12"></th><th class="text-left px-3 py-2 font-medium"> Sản phẩm </th><th class="text-right px-3 py-2 font-medium w-16"> SL </th><th class="text-right px-3 py-2 font-medium w-28"> Đơn giá </th><th class="text-right px-3 py-2 font-medium w-28"> Thành tiền </th></tr></thead><tbody><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(__props.items, (item) => {
        _push(`<tr class="border-t border-slate-100"><td class="px-2 py-2">`);
        if (item.cover_url) {
          _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", item.cover_url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", item.product_name)} class="w-10 h-10 object-cover rounded">`);
        } else {
          _push(`<div class="w-10 h-10 bg-slate-100 rounded"></div>`);
        }
        _push(`</td><td class="px-3 py-2"><p class="font-medium text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(item.product_name)}</p>`);
        if (item.variant_name) {
          _push(`<p class="text-xs text-slate-500">${serverRenderer_cjs_prodExports.ssrInterpolate(item.variant_name)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="text-xs text-slate-400 font-mono">${serverRenderer_cjs_prodExports.ssrInterpolate(item.sku)}</p></td><td class="px-3 py-2 text-right">${serverRenderer_cjs_prodExports.ssrInterpolate(item.quantity)}</td><td class="px-3 py-2 text-right">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(item.unit_price))}</td><td class="px-3 py-2 text-right font-medium">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(item.subtotal))}</td></tr>`);
      });
      _push(`<!--]-->`);
      if (__props.items.length === 0) {
        _push(`<tr><td colspan="5" class="text-center text-slate-500 py-6"> Không có sản phẩm </td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-order/ItemsTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$1, { __name: "VendorOrderItemsTable" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "CommissionBreakdown",
  __ssrInlineRender: true,
  props: {
    commission: {},
    vendorId: {},
    projectId: {},
    scope: { default: "tenant" }
  },
  setup(__props) {
    const props = __props;
    const contractLink = vueExports.computed(() => {
      if (!props.commission || !props.commission.contract) return void 0;
      return props.scope === "platform" ? platformContractLocation(props.vendorId, props.commission.contract.id) : tenantContractLocation(props.vendorId, props.projectId, props.commission.contract.id);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$2;
      const _component_UAlert = _sfc_main$3;
      if (__props.commission) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}>`);
        if (__props.commission.contract) {
          _push(`<div class="flex items-center gap-2 flex-wrap"><span class="text-sm text-slate-600">Hợp đồng:</span>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: vueExports.unref(contractLink),
            class: "font-mono font-semibold text-primary-700 hover:underline"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.commission.contract.code)}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(__props.commission.contract.code), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: "info",
            variant: "subtle",
            size: "sm"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.commission.contract.mode.label)}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(__props.commission.contract.mode.label), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else if (__props.commission.is_manual) {
          _push(`<div class="flex items-center gap-2 flex-wrap">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: "warning",
            variant: "subtle",
            size: "sm",
            icon: "i-lucide-hand-coins"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Hoa hồng gán thủ công `);
              } else {
                return [
                  vueExports.createTextVNode(" Hoa hồng gán thủ công ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (__props.commission.revenue_recipient) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: "neutral",
              variant: "subtle",
              size: "sm"
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.commission.revenue_recipient.label)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.commission.revenue_recipient.label), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<div class="flex items-center gap-2 flex-wrap">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: "neutral",
            variant: "subtle",
            size: "sm",
            icon: "i-lucide-circle-dashed"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Hoa hồng mặc định 0đ `);
              } else {
                return [
                  vueExports.createTextVNode(" Hoa hồng mặc định 0đ ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<span class="text-xs text-slate-500">Chưa có hợp đồng hoa hồng cho dự án này</span></div>`);
        }
        if (__props.commission.applied_at) {
          _push(`<p class="text-xs text-slate-500"> Áp dụng lúc: ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(__props.commission.applied_at))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">`);
        if (__props.commission.formula.capped_at_total) {
          _push(`<div class="text-amber-700 font-medium"> Tiền cứng (${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.commission.formula.fixed))}) ≥ Tổng đơn → lấy trọn đơn </div>`);
        } else {
          _push(`<!--[--><div class="flex justify-between"><span class="text-slate-600">Tiền cứng</span><span class="font-medium">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.commission.formula.fixed))}</span></div><div class="flex justify-between text-slate-500 text-xs"><span>Còn lại sau tiền cứng</span><span>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.commission.formula.remainder_after_fixed))}</span></div><div class="flex justify-between"><span class="text-slate-600">Phần trăm (${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPercent" in _ctx ? _ctx.formatPercent : vueExports.unref(formatPercent))(__props.commission.formula.percent))})</span><span class="font-medium">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.commission.formula.percent_amount))}</span></div><!--]-->`);
        }
        _push(`<div class="border-t border-slate-300 pt-2 mt-2 flex justify-between text-base"><span class="font-semibold">TỔNG HOA HỒNG</span><span class="font-bold text-primary-700">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.commission.amount))}</span></div></div></div>`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, vueExports.mergeProps({
          color: "info",
          variant: "subtle",
          icon: "i-lucide-clock",
          title: "Hoa hồng chưa phát sinh",
          description: "Đơn chưa hoàn thành — hoa hồng chỉ tính khi đơn ở trạng thái hoàn thành."
        }, _attrs), null, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-order/CommissionBreakdown.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main, { __name: "VendorOrderCommissionBreakdown" });

export { __nuxt_component_8 as _, __nuxt_component_6 as a };
//# sourceMappingURL=CommissionBreakdown-BKSDhXYk.mjs.map
