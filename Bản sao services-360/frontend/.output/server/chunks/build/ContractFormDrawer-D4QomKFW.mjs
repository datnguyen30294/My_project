import { _ as _sfc_main$c } from './Drawer-D5sl7aXR.mjs';
import { _ as _sfc_main$b } from './Badge-W93D3Jpz.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, j as useToast, l as _sfc_main$c$1, k as _sfc_main$h$1 } from './server.mjs';
import { a as statusBadgeColor, b as usePlatformContractDetail, c as useTenantContractDetail, d as apiSignPlatformContract, e as apiSignTenantContract, f as apiSwitchTenantContract, g as apiRevokePlatformContract, h as apiRevokeTenantContract, i as apiCancelPlatformContract, j as apiCancelTenantContract, k as apiDeletePlatformContractDraft, l as apiDeleteTenantContractDraft, m as apiUpdatePlatformContractNotes, n as apiUpdateTenantContractNotes, o as defaultPerOrderTerms, p as apiUpdatePlatformContractDraft, q as apiUpdateTenantContractDraft, r as apiCreatePlatformContract, v as apiCreateTenantContract, C as COMMISSION_MODE_OPTIONS, R as REVENUE_RECIPIENT_OPTIONS, B as BILLING_PERIOD_OPTIONS, S as SUBSCRIPTION_CYCLE_OPTIONS, w as defaultTermsFor } from './usePartnerCommissionContracts-DUXun7gY.mjs';
import { _ as _sfc_main$d } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5$2 } from './FieldDisplay-BM6nmr2i.mjs';
import { b as formatPercent, f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { a as formatDate, f as formatDateTime } from './date-R5YK0ast.mjs';
import { _ as _sfc_main$e } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$f } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$g } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$h } from './Textarea-DTCNHwKm.mjs';
import { _ as __nuxt_component_11$1 } from './DeleteModal-B4AevDGU.mjs';
import { g as getApiErrorMessage, a as getApiValidationErrors } from './apiError-DBrxF9au.mjs';
import { _ as _sfc_main$i } from './SelectMenu-DKHEMZj7.mjs';
import { _ as _sfc_main$j } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_5$3 } from './NumberInput-BfLKWOCC.mjs';
import { _ as _sfc_main$k } from './RadioGroup-DnRwe9KX.mjs';
import { j as usePlatformPartnerList, u as useTenantPartnerList } from './usePartners-DhKs6EM6.mjs';
import { u as usePlatformOrganizationList, a as apiGetOrganizationProjects } from './useOrganizations-DNv3fDw1.mjs';
import { d as useProjectList } from './useProjects-D4K3VYdb.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useAppContext } from './useAppContext-qiCJKBCF.mjs';

const _sfc_main$a = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractStatusBadge",
  __ssrInlineRender: true,
  props: {
    status: {},
    size: { default: "sm" }
  },
  setup(__props) {
    const props = __props;
    const color = vueExports.computed(() => statusBadgeColor(props.status.value));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = _sfc_main$b;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, vueExports.mergeProps({
        color: vueExports.unref(color),
        variant: "subtle",
        label: __props.status.label,
        size: __props.size
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractStatusBadge.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$a, { __name: "PartnerCommissionContractStatusBadge" });
const _sfc_main$9 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractModeBadge",
  __ssrInlineRender: true,
  props: {
    mode: {},
    size: { default: "sm" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = _sfc_main$b;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, vueExports.mergeProps({
        color: "info",
        variant: "subtle",
        label: __props.mode.label,
        size: __props.size
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractModeBadge.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_5$1 = Object.assign(_sfc_main$9, { __name: "PartnerCommissionContractModeBadge" });
const _sfc_main$8 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractTermsViewer",
  __ssrInlineRender: true,
  props: {
    mode: {},
    terms: {}
  },
  setup(__props) {
    const props = __props;
    const perOrder = vueExports.computed(
      () => props.mode === "per_order" ? props.terms : null
    );
    const revenueShare = vueExports.computed(
      () => props.mode === "revenue_share" ? props.terms : null
    );
    const subscription = vueExports.computed(
      () => props.mode === "subscription" ? props.terms : null
    );
    function billingLabel(v) {
      return BILLING_PERIOD_OPTIONS.find((o) => o.value === v)?.label ?? v;
    }
    function cycleLabel(v) {
      return SUBSCRIPTION_CYCLE_OPTIONS.find((o) => o.value === v)?.label ?? v;
    }
    function formatGmv(value) {
      if (value === null) return "Không giới hạn";
      return formatCurrency(value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedFieldDisplay = __nuxt_component_5$2;
      const _component_UBadge = _sfc_main$b;
      if (vueExports.unref(perOrder)) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}><div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Phần trăm chiết khấu" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(perOrder).percent != null ? ("formatPercent" in _ctx ? _ctx.formatPercent : vueExports.unref(formatPercent))(vueExports.unref(perOrder).percent) : "—")}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(perOrder).percent != null ? ("formatPercent" in _ctx ? _ctx.formatPercent : vueExports.unref(formatPercent))(vueExports.unref(perOrder).percent) : "—"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tiền cứng / đơn" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(perOrder).fixed != null ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(perOrder).fixed) : "—")}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(perOrder).fixed != null ? ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(perOrder).fixed) : "—"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else if (vueExports.unref(revenueShare)) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Chu kỳ chốt" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "info",
                variant: "subtle",
                label: billingLabel(vueExports.unref(revenueShare).billing_period)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UBadge, {
                  color: "info",
                  variant: "subtle",
                  label: billingLabel(vueExports.unref(revenueShare).billing_period)
                }, null, 8, ["label"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div><h3 class="text-xs font-medium text-slate-500 mb-2"> Bậc thang doanh thu </h3><div class="border border-slate-200 rounded-lg overflow-hidden"><table class="w-full text-sm"><thead class="bg-slate-50 text-slate-600"><tr><th class="text-right px-4 py-2 font-medium"> Từ (GMV) </th><th class="text-right px-4 py-2 font-medium"> Đến (GMV) </th><th class="text-right px-4 py-2 font-medium w-32"> Tỉ lệ </th></tr></thead><tbody><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(revenueShare).tiers, (tier, idx) => {
          _push(`<tr class="border-t border-slate-100"><td class="px-4 py-2 text-right">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(tier.min_gmv))}</td><td class="px-4 py-2 text-right">${serverRenderer_cjs_prodExports.ssrInterpolate(formatGmv(tier.max_gmv))}</td><td class="px-4 py-2 text-right font-medium">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPercent" in _ctx ? _ctx.formatPercent : vueExports.unref(formatPercent))(tier.percent))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div></div>`);
      } else if (vueExports.unref(subscription)) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, _attrs))}>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Phí thuê bao" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-semibold text-lg"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(subscription).amount))}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-semibold text-lg" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(subscription).amount)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Chu kỳ" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "info",
                variant: "subtle",
                label: cycleLabel(vueExports.unref(subscription).cycle)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UBadge, {
                  color: "info",
                  variant: "subtle",
                  label: cycleLabel(vueExports.unref(subscription).cycle)
                }, null, 8, ["label"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<p${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "text-sm text-slate-400" }, _attrs))}> Không có dữ liệu điều khoản. </p>`);
      }
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractTermsViewer.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_8$1 = Object.assign(_sfc_main$8, { __name: "PartnerCommissionContractTermsViewer" });
const _sfc_main$7 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractTimeline",
  __ssrInlineRender: true,
  props: {
    contract: {}
  },
  setup(__props) {
    const props = __props;
    const entries = vueExports.computed(() => {
      const c = props.contract;
      const items = [];
      items.push({
        label: "Tạo hợp đồng nháp",
        at: c.created_at,
        color: "neutral",
        icon: "i-lucide-file-edit"
      });
      if (c.signed_at) {
        items.push({
          label: "Đã ký",
          at: c.signed_at,
          color: "info",
          icon: "i-lucide-file-signature"
        });
      }
      if (c.activated_at) {
        items.push({
          label: "Kích hoạt",
          at: c.activated_at,
          color: "success",
          icon: "i-lucide-check-circle"
        });
      }
      if (c.replaced_at) {
        items.push({
          label: c.replaced_by_contract_id ? `Đã bị thay thế bởi hợp đồng #${c.replaced_by_contract_id}` : "Đã bị thay thế",
          at: c.replaced_at,
          color: "neutral",
          icon: "i-lucide-arrow-right-left"
        });
      }
      if (c.cancelled_at) {
        items.push({
          label: c.status.value === "revoked" ? "Thu hồi" : "Huỷ hợp đồng",
          at: c.cancelled_at,
          description: c.cancellation_reason ?? void 0,
          color: "error",
          icon: "i-lucide-x-circle"
        });
      }
      return items;
    });
    const colorClass = {
      neutral: "bg-slate-100 text-slate-600",
      info: "bg-blue-100 text-blue-600",
      success: "bg-emerald-100 text-emerald-600",
      warning: "bg-amber-100 text-amber-600",
      error: "bg-red-100 text-red-600"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h$1;
      _push(`<ol${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "relative space-y-5 border-l border-slate-200 ml-3 pl-6" }, _attrs))}><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(entries), (entry, idx) => {
        _push(`<li class="relative"><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([colorClass[entry.color], "absolute -left-9 flex size-7 items-center justify-center rounded-full ring-4 ring-white"])}">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: entry.icon,
          class: "size-4"
        }, null, _parent));
        _push(`</span><div><p class="text-sm font-semibold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(entry.label)}</p><p class="text-xs text-slate-500 mt-0.5">${serverRenderer_cjs_prodExports.ssrInterpolate(entry.at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(entry.at) : "—")}</p>`);
        if (entry.description) {
          _push(`<p class="text-sm text-slate-700 mt-1 italic"> &quot;${serverRenderer_cjs_prodExports.ssrInterpolate(entry.description)}&quot; </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></li>`);
      });
      _push(`<!--]--></ol>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractTimeline.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$7, { __name: "PartnerCommissionContractTimeline" });
const _sfc_main$6 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractSignModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    contract: {},
    loading: { type: Boolean }
  },
  emits: ["update:open", "confirm"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$e;
      const _component_UAlert = _sfc_main$d;
      const _component_SharedFieldDisplay = __nuxt_component_5$2;
      const _component_PartnerCommissionContractModeBadge = __nuxt_component_5$1;
      const _component_PartnerCommissionContractTermsViewer = __nuxt_component_8$1;
      const _component_UButton = _sfc_main$c$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Ký hợp đồng",
        ui: { content: "sm:max-w-2xl" },
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.contract) {
              _push2(`<div class="space-y-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "warning",
                variant: "subtle",
                icon: "i-lucide-shield-alert",
                title: "Sau khi ký, KHÔNG sửa được điều khoản tài chính",
                description: "Để thay đổi sau khi đã ký, bạn cần thu hồi hợp đồng và tạo bản nháp mới."
              }, null, _parent2, _scopeId));
              _push2(`<div class="grid grid-cols-2 gap-4 text-sm"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã hợp đồng" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.contract.contract_code)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(__props.contract.contract_code), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Vendor" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.contract.partner?.name ?? `#${__props.contract.partner_id}`)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.contract.partner?.name ?? `#${__props.contract.partner_id}`), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tenant" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.contract.tenant_id)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.contract.tenant_id), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Project" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` #${serverRenderer_cjs_prodExports.ssrInterpolate(__props.contract.project_id)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(" #" + vueExports.toDisplayString(__props.contract.project_id), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Loại hợp đồng" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractModeBadge, {
                      mode: __props.contract.commission_mode
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                        mode: __props.contract.commission_mode
                      }, null, 8, ["mode"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Hiệu lực" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.contract.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.contract.starts_at) : "—")} → ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.contract.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.contract.ends_at) : "Không thời hạn")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.contract.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.contract.starts_at) : "—") + " → " + vueExports.toDisplayString(__props.contract.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.contract.ends_at) : "Không thời hạn"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><h3 class="text-sm font-semibold text-slate-700 mb-2"${_scopeId}> Điều khoản </h3>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractTermsViewer, {
                mode: __props.contract.commission_mode.value,
                terms: __props.contract.terms
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.contract ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                vueExports.createVNode(_component_UAlert, {
                  color: "warning",
                  variant: "subtle",
                  icon: "i-lucide-shield-alert",
                  title: "Sau khi ký, KHÔNG sửa được điều khoản tài chính",
                  description: "Để thay đổi sau khi đã ký, bạn cần thu hồi hợp đồng và tạo bản nháp mới."
                }),
                vueExports.createVNode("div", { class: "grid grid-cols-2 gap-4 text-sm" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã hợp đồng" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(__props.contract.contract_code), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Vendor" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.contract.partner?.name ?? `#${__props.contract.partner_id}`), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tenant" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.contract.tenant_id), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Project" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" #" + vueExports.toDisplayString(__props.contract.project_id), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Loại hợp đồng" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                        mode: __props.contract.commission_mode
                      }, null, 8, ["mode"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Hiệu lực" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.contract.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.contract.starts_at) : "—") + " → " + vueExports.toDisplayString(__props.contract.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.contract.ends_at) : "Không thời hạn"), 1)
                    ]),
                    _: 1
                  })
                ]),
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("h3", { class: "text-sm font-semibold text-slate-700 mb-2" }, " Điều khoản "),
                  vueExports.createVNode(_component_PartnerCommissionContractTermsViewer, {
                    mode: __props.contract.commission_mode.value,
                    terms: __props.contract.terms
                  }, null, 8, ["mode", "terms"])
                ])
              ])) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              label: "Huỷ",
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "primary",
              icon: "i-lucide-file-signature",
              label: __props.loading ? "Đang ký..." : "Xác nhận ký",
              loading: __props.loading,
              disabled: __props.loading,
              onClick: ($event) => emit("confirm")
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Huỷ",
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "primary",
                  icon: "i-lucide-file-signature",
                  label: __props.loading ? "Đang ký..." : "Xác nhận ký",
                  loading: __props.loading,
                  disabled: __props.loading,
                  onClick: ($event) => emit("confirm")
                }, null, 8, ["label", "loading", "disabled", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractSignModal.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main$6, { __name: "PartnerCommissionContractSignModal" });
const CONFIRM_TEXT = "XÁC NHẬN";
const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractSwitchModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    current: {},
    target: {},
    loading: { type: Boolean }
  },
  emits: ["update:open", "confirm"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const typed = vueExports.ref("");
    const canConfirm = vueExports.computed(() => typed.value.trim().toUpperCase() === CONFIRM_TEXT);
    function handleClose(value) {
      if (!value) typed.value = "";
      emit("update:open", value);
    }
    const requiresAntiMisclick = vueExports.computed(() => Boolean(props.current));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$e;
      const _component_UAlert = _sfc_main$d;
      const _component_PartnerCommissionContractStatusBadge = __nuxt_component_6;
      const _component_PartnerCommissionContractModeBadge = __nuxt_component_5$1;
      const _component_PartnerCommissionContractTermsViewer = __nuxt_component_8$1;
      const _component_UFormField = _sfc_main$f;
      const _component_UInput = _sfc_main$g;
      const _component_UButton = _sfc_main$c$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Kích hoạt hợp đồng",
        ui: { content: "sm:max-w-3xl" },
        "onUpdate:open": handleClose
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (vueExports.unref(requiresAntiMisclick)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "warning",
                variant: "subtle",
                icon: "i-lucide-alert-triangle",
                title: "Hợp đồng hiện tại sẽ chuyển sang 'Đã bị thay thế'",
                description: "Sau khi xác nhận, không thể quay lại hợp đồng cũ. Đơn cũ giữ nguyên hợp đồng đã gán; đơn mới sẽ tính theo hợp đồng mới."
              }, null, _parent2, _scopeId));
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "info",
                variant: "subtle",
                icon: "i-lucide-info",
                description: "Hợp đồng này sẽ được kích hoạt cho vendor × dự án. Đơn mới sẽ áp dụng điều khoản trong hợp đồng."
              }, null, _parent2, _scopeId));
            }
            _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}>`);
            if (__props.current) {
              _push2(`<div class="border border-slate-200 rounded-lg p-4 bg-slate-50"${_scopeId}><p class="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-2"${_scopeId}> Hợp đồng hiện tại </p><div class="flex items-center gap-2 mb-3"${_scopeId}><span class="font-mono font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.current.contract_code)}</span>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractStatusBadge, {
                status: __props.current.status
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractModeBadge, {
                mode: __props.current.commission_mode
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-xs text-slate-500 mt-2"${_scopeId}> Hiệu lực: ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.current.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.current.starts_at) : "—")} → ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.current.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.current.ends_at) : "Không thời hạn")}</p>`);
              if ("terms" in __props.current) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractTermsViewer, {
                  mode: __props.current.commission_mode.value,
                  terms: __props.current.terms,
                  class: "mt-3"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<div class="border border-dashed border-slate-200 rounded-lg p-4 flex items-center justify-center text-sm text-slate-400"${_scopeId}> Chưa có hợp đồng đang hiệu lực </div>`);
            }
            if (__props.target) {
              _push2(`<div class="border-2 border-emerald-300 rounded-lg p-4 bg-emerald-50/50"${_scopeId}><p class="text-xs uppercase tracking-wide font-semibold text-emerald-700 mb-2"${_scopeId}> Sẽ kích hoạt </p><div class="flex items-center gap-2 mb-3"${_scopeId}><span class="font-mono font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.target.contract_code)}</span>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractStatusBadge, {
                status: __props.target.status
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractModeBadge, {
                mode: __props.target.commission_mode
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-xs text-slate-500 mt-2"${_scopeId}> Hiệu lực: ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.target.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.target.starts_at) : "—")} → ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.target.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.target.ends_at) : "Không thời hạn")}</p>`);
              if ("terms" in __props.target) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractTermsViewer, {
                  mode: __props.target.commission_mode.value,
                  terms: __props.target.terms,
                  class: "mt-3"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (vueExports.unref(requiresAntiMisclick)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: `Nhập '${CONFIRM_TEXT}' để tiếp tục`,
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(typed),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(typed) ? typed.value = $event : null,
                      placeholder: CONFIRM_TEXT
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(typed),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(typed) ? typed.value = $event : null,
                        placeholder: CONFIRM_TEXT
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
              vueExports.createVNode("div", { class: "space-y-4" }, [
                vueExports.unref(requiresAntiMisclick) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "warning",
                  variant: "subtle",
                  icon: "i-lucide-alert-triangle",
                  title: "Hợp đồng hiện tại sẽ chuyển sang 'Đã bị thay thế'",
                  description: "Sau khi xác nhận, không thể quay lại hợp đồng cũ. Đơn cũ giữ nguyên hợp đồng đã gán; đơn mới sẽ tính theo hợp đồng mới."
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 1,
                  color: "info",
                  variant: "subtle",
                  icon: "i-lucide-info",
                  description: "Hợp đồng này sẽ được kích hoạt cho vendor × dự án. Đơn mới sẽ áp dụng điều khoản trong hợp đồng."
                })),
                vueExports.createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                  __props.current ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "border border-slate-200 rounded-lg p-4 bg-slate-50"
                  }, [
                    vueExports.createVNode("p", { class: "text-xs uppercase tracking-wide font-semibold text-slate-500 mb-2" }, " Hợp đồng hiện tại "),
                    vueExports.createVNode("div", { class: "flex items-center gap-2 mb-3" }, [
                      vueExports.createVNode("span", { class: "font-mono font-semibold text-slate-900" }, vueExports.toDisplayString(__props.current.contract_code), 1),
                      vueExports.createVNode(_component_PartnerCommissionContractStatusBadge, {
                        status: __props.current.status
                      }, null, 8, ["status"])
                    ]),
                    vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                      mode: __props.current.commission_mode
                    }, null, 8, ["mode"]),
                    vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, " Hiệu lực: " + vueExports.toDisplayString(__props.current.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.current.starts_at) : "—") + " → " + vueExports.toDisplayString(__props.current.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.current.ends_at) : "Không thời hạn"), 1),
                    "terms" in __props.current ? (vueExports.openBlock(), vueExports.createBlock(_component_PartnerCommissionContractTermsViewer, {
                      key: 0,
                      mode: __props.current.commission_mode.value,
                      terms: __props.current.terms,
                      class: "mt-3"
                    }, null, 8, ["mode", "terms"])) : vueExports.createCommentVNode("", true)
                  ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "border border-dashed border-slate-200 rounded-lg p-4 flex items-center justify-center text-sm text-slate-400"
                  }, " Chưa có hợp đồng đang hiệu lực ")),
                  __props.target ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 2,
                    class: "border-2 border-emerald-300 rounded-lg p-4 bg-emerald-50/50"
                  }, [
                    vueExports.createVNode("p", { class: "text-xs uppercase tracking-wide font-semibold text-emerald-700 mb-2" }, " Sẽ kích hoạt "),
                    vueExports.createVNode("div", { class: "flex items-center gap-2 mb-3" }, [
                      vueExports.createVNode("span", { class: "font-mono font-semibold text-slate-900" }, vueExports.toDisplayString(__props.target.contract_code), 1),
                      vueExports.createVNode(_component_PartnerCommissionContractStatusBadge, {
                        status: __props.target.status
                      }, null, 8, ["status"])
                    ]),
                    vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                      mode: __props.target.commission_mode
                    }, null, 8, ["mode"]),
                    vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, " Hiệu lực: " + vueExports.toDisplayString(__props.target.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.target.starts_at) : "—") + " → " + vueExports.toDisplayString(__props.target.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(__props.target.ends_at) : "Không thời hạn"), 1),
                    "terms" in __props.target ? (vueExports.openBlock(), vueExports.createBlock(_component_PartnerCommissionContractTermsViewer, {
                      key: 0,
                      mode: __props.target.commission_mode.value,
                      terms: __props.target.terms,
                      class: "mt-3"
                    }, null, 8, ["mode", "terms"])) : vueExports.createCommentVNode("", true)
                  ])) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.unref(requiresAntiMisclick) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 2,
                  label: `Nhập '${CONFIRM_TEXT}' để tiếp tục`,
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(typed),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(typed) ? typed.value = $event : null,
                      placeholder: CONFIRM_TEXT
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["label"])) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              label: "Huỷ",
              onClick: ($event) => handleClose(false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "primary",
              icon: "i-lucide-check-circle",
              label: __props.loading ? "Đang kích hoạt..." : "Xác nhận kích hoạt",
              loading: __props.loading,
              disabled: __props.loading || vueExports.unref(requiresAntiMisclick) && !vueExports.unref(canConfirm),
              onClick: ($event) => emit("confirm")
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Huỷ",
                  onClick: ($event) => handleClose(false)
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "primary",
                  icon: "i-lucide-check-circle",
                  label: __props.loading ? "Đang kích hoạt..." : "Xác nhận kích hoạt",
                  loading: __props.loading,
                  disabled: __props.loading || vueExports.unref(requiresAntiMisclick) && !vueExports.unref(canConfirm),
                  onClick: ($event) => emit("confirm")
                }, null, 8, ["label", "loading", "disabled", "onClick"])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractSwitchModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main$5, { __name: "PartnerCommissionContractSwitchModal" });
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractReasonModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    title: {},
    confirmLabel: {},
    confirmColor: { default: "error" },
    warning: { default: void 0 },
    helpText: { default: void 0 },
    loading: { type: Boolean, default: false }
  },
  emits: ["update:open", "confirm"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const reason = vueExports.ref("");
    function handleClose(value) {
      if (!value) {
        reason.value = "";
      }
      emit("update:open", value);
    }
    function handleConfirm() {
      if (!reason.value.trim()) return;
      emit("confirm", reason.value.trim());
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$e;
      const _component_UAlert = _sfc_main$d;
      const _component_UFormField = _sfc_main$f;
      const _component_UTextarea = _sfc_main$h;
      const _component_UButton = _sfc_main$c$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: __props.title,
        "onUpdate:open": handleClose
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (__props.warning) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "subtle",
                icon: "i-lucide-alert-triangle",
                description: __props.warning
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Lý do",
              required: "",
              help: __props.helpText
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(reason),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(reason) ? reason.value = $event : null,
                    rows: 4,
                    placeholder: "Nhập lý do...",
                    class: "w-full",
                    maxlength: 1e3
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(reason),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(reason) ? reason.value = $event : null,
                      rows: 4,
                      placeholder: "Nhập lý do...",
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
                __props.warning ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  variant: "subtle",
                  icon: "i-lucide-alert-triangle",
                  description: __props.warning
                }, null, 8, ["description"])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UFormField, {
                  label: "Lý do",
                  required: "",
                  help: __props.helpText
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(reason),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(reason) ? reason.value = $event : null,
                      rows: 4,
                      placeholder: "Nhập lý do...",
                      class: "w-full",
                      maxlength: 1e3
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["help"])
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              label: "Huỷ",
              onClick: ($event) => handleClose(false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: __props.confirmColor,
              label: __props.loading ? "Đang xử lý..." : __props.confirmLabel,
              disabled: !vueExports.unref(reason).trim() || __props.loading,
              loading: __props.loading,
              onClick: handleConfirm
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Huỷ",
                  onClick: ($event) => handleClose(false)
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: __props.confirmColor,
                  label: __props.loading ? "Đang xử lý..." : __props.confirmLabel,
                  disabled: !vueExports.unref(reason).trim() || __props.loading,
                  loading: __props.loading,
                  onClick: handleConfirm
                }, null, 8, ["color", "label", "disabled", "loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractReasonModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_12 = Object.assign(_sfc_main$4, { __name: "PartnerCommissionContractReasonModal" });
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractDetailDrawer",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    contractId: {},
    scope: { default: "tenant" }
  },
  emits: ["update:open", "changed", "edit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isPlatform = vueExports.computed(() => props.scope === "platform");
    const emit = __emit;
    const toast = useToast();
    const idRef = vueExports.computed(() => props.contractId);
    const detailFetch = isPlatform.value ? usePlatformContractDetail(idRef) : useTenantContractDetail(idRef);
    const { data, status, error, execute, refresh } = detailFetch;
    const contract = vueExports.computed(() => data.value?.data ?? null);
    const statusValue = vueExports.computed(() => contract.value?.status.value ?? null);
    vueExports.watch(() => [props.open, props.contractId], async ([open, id]) => {
      if (open && id) {
        await execute();
      }
    }, { immediate: true });
    function close() {
      emit("update:open", false);
    }
    async function afterChange() {
      await refresh();
      emit("changed");
    }
    const showNotesModal = vueExports.ref(false);
    const notesDraft = vueExports.reactive({ contract_code: "", notes: "" });
    const isNotesSaving = vueExports.ref(false);
    const notesErrors = vueExports.ref({});
    function openNotesModal() {
      if (!contract.value) return;
      notesDraft.contract_code = contract.value.contract_code ?? "";
      notesDraft.notes = contract.value.notes ?? "";
      notesErrors.value = {};
      showNotesModal.value = true;
    }
    async function saveNotes() {
      if (!contract.value) return;
      isNotesSaving.value = true;
      notesErrors.value = {};
      try {
        await (isPlatform.value ? apiUpdatePlatformContractNotes : apiUpdateTenantContractNotes)(
          contract.value.id,
          {
            contract_code: notesDraft.contract_code,
            notes: notesDraft.notes
          }
        );
        toast.add({ title: "Đã cập nhật", color: "success", icon: "i-lucide-check-circle" });
        showNotesModal.value = false;
        await afterChange();
      } catch (err) {
        const errs = getApiValidationErrors(err);
        if (errs) {
          notesErrors.value = errs;
        } else {
          toast.add({
            title: getApiErrorMessage(err, "Cập nhật thất bại"),
            color: "error",
            icon: "i-lucide-alert-circle"
          });
        }
      } finally {
        isNotesSaving.value = false;
      }
    }
    const showSignModal = vueExports.ref(false);
    const isSigning = vueExports.ref(false);
    async function handleSign() {
      if (!contract.value) return;
      isSigning.value = true;
      try {
        await (isPlatform.value ? apiSignPlatformContract : apiSignTenantContract)(contract.value.id);
        toast.add({ title: "Đã ký hợp đồng", color: "success", icon: "i-lucide-file-signature" });
        showSignModal.value = false;
        await afterChange();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Ký hợp đồng thất bại"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isSigning.value = false;
      }
    }
    const showRevokeModal = vueExports.ref(false);
    const isRevoking = vueExports.ref(false);
    async function handleRevoke(reason) {
      if (!contract.value) return;
      isRevoking.value = true;
      try {
        await (isPlatform.value ? apiRevokePlatformContract : apiRevokeTenantContract)(contract.value.id, reason);
        toast.add({ title: "Đã thu hồi hợp đồng", color: "success" });
        showRevokeModal.value = false;
        await afterChange();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Thu hồi thất bại"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isRevoking.value = false;
      }
    }
    const showSwitchModal = vueExports.ref(false);
    const isSwitching = vueExports.ref(false);
    async function handleSwitch() {
      if (!contract.value) return;
      isSwitching.value = true;
      try {
        await apiSwitchTenantContract(contract.value.id);
        toast.add({ title: "Đã kích hoạt hợp đồng", color: "success" });
        showSwitchModal.value = false;
        await afterChange();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Kích hoạt thất bại"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isSwitching.value = false;
      }
    }
    const showCancelModal = vueExports.ref(false);
    const isCancelling = vueExports.ref(false);
    async function handleCancel(reason) {
      if (!contract.value) return;
      isCancelling.value = true;
      try {
        await (isPlatform.value ? apiCancelPlatformContract : apiCancelTenantContract)(contract.value.id, reason);
        toast.add({ title: "Đã huỷ hợp đồng", color: "success" });
        showCancelModal.value = false;
        await afterChange();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Huỷ hợp đồng thất bại"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isCancelling.value = false;
      }
    }
    const showDeleteModal = vueExports.ref(false);
    const isDeleting = vueExports.ref(false);
    async function handleDelete() {
      if (!contract.value) return;
      isDeleting.value = true;
      try {
        await (isPlatform.value ? apiDeletePlatformContractDraft : apiDeleteTenantContractDraft)(contract.value.id);
        toast.add({ title: "Đã xoá nháp hợp đồng", color: "success" });
        showDeleteModal.value = false;
        emit("changed");
        close();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Xoá thất bại"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
        showDeleteModal.value = false;
      } finally {
        isDeleting.value = false;
      }
    }
    function requestEdit() {
      if (contract.value) emit("edit", contract.value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UDrawer = _sfc_main$c;
      const _component_PartnerCommissionContractStatusBadge = __nuxt_component_6;
      const _component_PartnerCommissionContractModeBadge = __nuxt_component_5$1;
      const _component_UButton = _sfc_main$c$1;
      const _component_UAlert = _sfc_main$d;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5$2;
      const _component_UBadge = _sfc_main$b;
      const _component_PartnerCommissionContractTermsViewer = __nuxt_component_8$1;
      const _component_PartnerCommissionContractTimeline = __nuxt_component_9;
      const _component_PartnerCommissionContractSignModal = __nuxt_component_10;
      const _component_PartnerCommissionContractSwitchModal = __nuxt_component_11;
      const _component_PartnerCommissionContractReasonModal = __nuxt_component_12;
      const _component_SharedCrudDeleteModal = __nuxt_component_11$1;
      const _component_UModal = _sfc_main$e;
      const _component_UFormField = _sfc_main$f;
      const _component_UInput = _sfc_main$g;
      const _component_UTextarea = _sfc_main$h;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UDrawer, {
        open: __props.open,
        direction: "right",
        "onUpdate:open": (v) => emit("update:open", v)
      }, {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-screen max-w-3xl h-full flex flex-col bg-white"${_scopeId}><div class="flex items-start justify-between gap-3 p-4 border-b border-slate-200"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><div class="flex items-center gap-2 flex-wrap"${_scopeId}><h2 class="text-lg font-black text-slate-900 font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(contract)?.contract_code ?? "Đang tải...")}</h2>`);
            if (vueExports.unref(contract)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractStatusBadge, {
                status: vueExports.unref(contract).status
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(contract)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractModeBadge, {
                mode: vueExports.unref(contract).commission_mode
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-x",
              color: "neutral",
              variant: "ghost",
              "aria-label": "Đóng",
              onClick: close
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (vueExports.unref(contract)) {
              _push2(`<div class="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50"${_scopeId}>`);
              if (vueExports.unref(statusValue) === "draft") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-pencil",
                  label: "Sửa nháp",
                  color: "primary",
                  variant: "soft",
                  size: "sm",
                  onClick: requestEdit
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(statusValue) === "draft") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-file-signature",
                  label: "Ký hợp đồng",
                  color: "primary",
                  size: "sm",
                  onClick: ($event) => showSignModal.value = true
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(statusValue) === "draft") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-trash-2",
                  color: "error",
                  variant: "soft",
                  size: "sm",
                  "aria-label": "Xoá nháp",
                  onClick: ($event) => showDeleteModal.value = true
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(statusValue) === "pending") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-pencil",
                  label: "Sửa ghi chú",
                  color: "primary",
                  variant: "soft",
                  size: "sm",
                  onClick: openNotesModal
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(statusValue) === "pending" && !vueExports.unref(isPlatform)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-power",
                  label: "Kích hoạt",
                  color: "success",
                  size: "sm",
                  onClick: ($event) => showSwitchModal.value = true
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(statusValue) === "pending") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-undo-2",
                  label: "Thu hồi",
                  color: "warning",
                  variant: "soft",
                  size: "sm",
                  onClick: ($event) => showRevokeModal.value = true
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(statusValue) === "active") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-x-circle",
                  label: "Huỷ hợp đồng",
                  color: "error",
                  variant: "soft",
                  size: "sm",
                  onClick: ($event) => showCancelModal.value = true
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex-1 overflow-y-auto p-4 space-y-5"${_scopeId}>`);
            if (vueExports.unref(status) === "pending" && !vueExports.unref(contract)) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="h-20 bg-slate-100 rounded-xl animate-pulse"${_scopeId}></div><div class="h-48 bg-slate-100 rounded-xl animate-pulse"${_scopeId}></div></div>`);
            } else if (vueExports.unref(error) && !vueExports.unref(contract)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "subtle",
                icon: "i-lucide-alert-circle",
                description: "Không thể tải chi tiết hợp đồng."
              }, null, _parent2, _scopeId));
            } else if (vueExports.unref(contract)) {
              _push2(`<!--[-->`);
              if (vueExports.unref(statusValue) === "pending") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "warning",
                  variant: "subtle",
                  icon: "i-lucide-clock",
                  title: "Hợp đồng chờ kích hoạt",
                  description: vueExports.unref(isPlatform) ? "Hợp đồng đã ký, đang chờ tenant kích hoạt ở phía PMC. Điều khoản tài chính không còn sửa được." : "Bấm 'Kích hoạt' để gắn hợp đồng này vào vendor. Hợp đồng đang active hiện tại (nếu có) sẽ tự động chuyển sang trạng thái 'Đã bị thay thế'."
                }, null, _parent2, _scopeId));
              } else if (vueExports.unref(statusValue) === "active") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "success",
                  variant: "subtle",
                  icon: "i-lucide-check-circle",
                  title: "Hợp đồng đang hiệu lực",
                  description: "Vendor đang nhận đơn theo điều khoản này. Để dừng nhận đơn, hãy huỷ hợp đồng."
                }, null, _parent2, _scopeId));
              } else if (vueExports.unref(statusValue) === "replaced") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "neutral",
                  variant: "subtle",
                  icon: "i-lucide-arrow-right-left",
                  title: "Đã bị thay thế",
                  description: vueExports.unref(contract).replaced_by_contract_id ? `Hợp đồng này đã bị thay thế bởi hợp đồng #${vueExports.unref(contract).replaced_by_contract_id}.` : "Hợp đồng này đã bị thay thế."
                }, null, _parent2, _scopeId));
              } else if (vueExports.unref(statusValue) === "cancelled" || vueExports.unref(statusValue) === "revoked" || vueExports.unref(statusValue) === "expired") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "neutral",
                  variant: "subtle",
                  icon: "i-lucide-x-circle",
                  title: vueExports.unref(contract).status.label,
                  description: "Hợp đồng đã kết thúc và không thể tái sử dụng. Đơn cũ vẫn giữ snapshot riêng."
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Vendor & Phạm vi" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-5"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Vendor" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<span class="font-medium"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(contract).partner?.name ?? `#${vueExports.unref(contract).partner_id}`)}</span>`);
                          if (vueExports.unref(contract).partner?.slug) {
                            _push4(`<p class="text-xs text-slate-500 font-mono"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(contract).partner.slug)}</p>`);
                          } else {
                            _push4(`<!---->`);
                          }
                        } else {
                          return [
                            vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(contract).partner?.name ?? `#${vueExports.unref(contract).partner_id}`), 1),
                            vueExports.unref(contract).partner?.slug ? (vueExports.openBlock(), vueExports.createBlock("p", {
                              key: 0,
                              class: "text-xs text-slate-500 font-mono"
                            }, vueExports.toDisplayString(vueExports.unref(contract).partner.slug), 1)) : vueExports.createCommentVNode("", true)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tenant" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (vueExports.unref(contract).tenant_name) {
                            _push4(`<span${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(contract).tenant_name)}</span>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<span class="text-xs text-slate-500 font-mono block"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(contract).tenant_id)}</span>`);
                        } else {
                          return [
                            vueExports.unref(contract).tenant_name ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(vueExports.unref(contract).tenant_name), 1)) : vueExports.createCommentVNode("", true),
                            vueExports.createVNode("span", { class: "text-xs text-slate-500 font-mono block" }, vueExports.toDisplayString(vueExports.unref(contract).tenant_id), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Dự án" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(contract).project_name ?? `#${vueExports.unref(contract).project_id}`)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).project_name ?? `#${vueExports.unref(contract).project_id}`), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-5" }, [
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Vendor" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(contract).partner?.name ?? `#${vueExports.unref(contract).partner_id}`), 1),
                            vueExports.unref(contract).partner?.slug ? (vueExports.openBlock(), vueExports.createBlock("p", {
                              key: 0,
                              class: "text-xs text-slate-500 font-mono"
                            }, vueExports.toDisplayString(vueExports.unref(contract).partner.slug), 1)) : vueExports.createCommentVNode("", true)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tenant" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.unref(contract).tenant_name ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(vueExports.unref(contract).tenant_name), 1)) : vueExports.createCommentVNode("", true),
                            vueExports.createVNode("span", { class: "text-xs text-slate-500 font-mono block" }, vueExports.toDisplayString(vueExports.unref(contract).tenant_id), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Dự án" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).project_name ?? `#${vueExports.unref(contract).project_id}`), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Loại & Điều khoản" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="mb-4 flex items-center gap-2 flex-wrap"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractModeBadge, {
                      mode: vueExports.unref(contract).commission_mode,
                      size: "md"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      color: "info",
                      variant: "subtle",
                      label: `Doanh thu: ${vueExports.unref(contract).revenue_recipient.label}`,
                      icon: "i-lucide-wallet"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractTermsViewer, {
                      mode: vueExports.unref(contract).commission_mode.value,
                      terms: vueExports.unref(contract).terms
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "mb-4 flex items-center gap-2 flex-wrap" }, [
                        vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                          mode: vueExports.unref(contract).commission_mode,
                          size: "md"
                        }, null, 8, ["mode"]),
                        vueExports.createVNode(_component_UBadge, {
                          color: "info",
                          variant: "subtle",
                          label: `Doanh thu: ${vueExports.unref(contract).revenue_recipient.label}`,
                          icon: "i-lucide-wallet"
                        }, null, 8, ["label"])
                      ]),
                      vueExports.createVNode(_component_PartnerCommissionContractTermsViewer, {
                        mode: vueExports.unref(contract).commission_mode.value,
                        terms: vueExports.unref(contract).terms
                      }, null, 8, ["mode", "terms"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Hiệu lực" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-5"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày bắt đầu" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(contract).starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(contract).starts_at) : "—")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(contract).starts_at) : "—"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày kết thúc" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(contract).ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(contract).ends_at) : "Không thời hạn")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(contract).ends_at) : "Không thời hạn"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày kích hoạt" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(contract).activated_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(contract).activated_at) : "—")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).activated_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(contract).activated_at) : "—"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-5" }, [
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày bắt đầu" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(contract).starts_at) : "—"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày kết thúc" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(contract).ends_at) : "Không thời hạn"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày kích hoạt" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).activated_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(contract).activated_at) : "—"), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(contract).notes) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Ghi chú" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<p class="whitespace-pre-line text-slate-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(contract).notes)}</p>`);
                    } else {
                      return [
                        vueExports.createVNode("p", { class: "whitespace-pre-line text-slate-700" }, vueExports.toDisplayString(vueExports.unref(contract).notes), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Lịch sử trạng thái" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractTimeline, { contract: vueExports.unref(contract) }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_PartnerCommissionContractTimeline, { contract: vueExports.unref(contract) }, null, 8, ["contract"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "w-screen max-w-3xl h-full flex flex-col bg-white" }, [
                vueExports.createVNode("div", { class: "flex items-start justify-between gap-3 p-4 border-b border-slate-200" }, [
                  vueExports.createVNode("div", { class: "min-w-0 flex-1" }, [
                    vueExports.createVNode("div", { class: "flex items-center gap-2 flex-wrap" }, [
                      vueExports.createVNode("h2", { class: "text-lg font-black text-slate-900 font-mono" }, vueExports.toDisplayString(vueExports.unref(contract)?.contract_code ?? "Đang tải..."), 1),
                      vueExports.unref(contract) ? (vueExports.openBlock(), vueExports.createBlock(_component_PartnerCommissionContractStatusBadge, {
                        key: 0,
                        status: vueExports.unref(contract).status
                      }, null, 8, ["status"])) : vueExports.createCommentVNode("", true),
                      vueExports.unref(contract) ? (vueExports.openBlock(), vueExports.createBlock(_component_PartnerCommissionContractModeBadge, {
                        key: 1,
                        mode: vueExports.unref(contract).commission_mode
                      }, null, 8, ["mode"])) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-x",
                    color: "neutral",
                    variant: "ghost",
                    "aria-label": "Đóng",
                    onClick: close
                  })
                ]),
                vueExports.unref(contract) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "flex flex-wrap items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50"
                }, [
                  vueExports.unref(statusValue) === "draft" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 0,
                    icon: "i-lucide-pencil",
                    label: "Sửa nháp",
                    color: "primary",
                    variant: "soft",
                    size: "sm",
                    onClick: requestEdit
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(statusValue) === "draft" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 1,
                    icon: "i-lucide-file-signature",
                    label: "Ký hợp đồng",
                    color: "primary",
                    size: "sm",
                    onClick: ($event) => showSignModal.value = true
                  }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(statusValue) === "draft" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 2,
                    icon: "i-lucide-trash-2",
                    color: "error",
                    variant: "soft",
                    size: "sm",
                    "aria-label": "Xoá nháp",
                    onClick: ($event) => showDeleteModal.value = true
                  }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(statusValue) === "pending" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 3,
                    icon: "i-lucide-pencil",
                    label: "Sửa ghi chú",
                    color: "primary",
                    variant: "soft",
                    size: "sm",
                    onClick: openNotesModal
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(statusValue) === "pending" && !vueExports.unref(isPlatform) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 4,
                    icon: "i-lucide-power",
                    label: "Kích hoạt",
                    color: "success",
                    size: "sm",
                    onClick: ($event) => showSwitchModal.value = true
                  }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(statusValue) === "pending" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 5,
                    icon: "i-lucide-undo-2",
                    label: "Thu hồi",
                    color: "warning",
                    variant: "soft",
                    size: "sm",
                    onClick: ($event) => showRevokeModal.value = true
                  }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(statusValue) === "active" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 6,
                    icon: "i-lucide-x-circle",
                    label: "Huỷ hợp đồng",
                    color: "error",
                    variant: "soft",
                    size: "sm",
                    onClick: ($event) => showCancelModal.value = true
                  }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true)
                ])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("div", { class: "flex-1 overflow-y-auto p-4 space-y-5" }, [
                  vueExports.unref(status) === "pending" && !vueExports.unref(contract) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "space-y-4"
                  }, [
                    vueExports.createVNode("div", { class: "h-20 bg-slate-100 rounded-xl animate-pulse" }),
                    vueExports.createVNode("div", { class: "h-48 bg-slate-100 rounded-xl animate-pulse" })
                  ])) : vueExports.unref(error) && !vueExports.unref(contract) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 1,
                    color: "error",
                    variant: "subtle",
                    icon: "i-lucide-alert-circle",
                    description: "Không thể tải chi tiết hợp đồng."
                  })) : vueExports.unref(contract) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                    vueExports.unref(statusValue) === "pending" ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                      key: 0,
                      color: "warning",
                      variant: "subtle",
                      icon: "i-lucide-clock",
                      title: "Hợp đồng chờ kích hoạt",
                      description: vueExports.unref(isPlatform) ? "Hợp đồng đã ký, đang chờ tenant kích hoạt ở phía PMC. Điều khoản tài chính không còn sửa được." : "Bấm 'Kích hoạt' để gắn hợp đồng này vào vendor. Hợp đồng đang active hiện tại (nếu có) sẽ tự động chuyển sang trạng thái 'Đã bị thay thế'."
                    }, null, 8, ["description"])) : vueExports.unref(statusValue) === "active" ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                      key: 1,
                      color: "success",
                      variant: "subtle",
                      icon: "i-lucide-check-circle",
                      title: "Hợp đồng đang hiệu lực",
                      description: "Vendor đang nhận đơn theo điều khoản này. Để dừng nhận đơn, hãy huỷ hợp đồng."
                    })) : vueExports.unref(statusValue) === "replaced" ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                      key: 2,
                      color: "neutral",
                      variant: "subtle",
                      icon: "i-lucide-arrow-right-left",
                      title: "Đã bị thay thế",
                      description: vueExports.unref(contract).replaced_by_contract_id ? `Hợp đồng này đã bị thay thế bởi hợp đồng #${vueExports.unref(contract).replaced_by_contract_id}.` : "Hợp đồng này đã bị thay thế."
                    }, null, 8, ["description"])) : vueExports.unref(statusValue) === "cancelled" || vueExports.unref(statusValue) === "revoked" || vueExports.unref(statusValue) === "expired" ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                      key: 3,
                      color: "neutral",
                      variant: "subtle",
                      icon: "i-lucide-x-circle",
                      title: vueExports.unref(contract).status.label,
                      description: "Hợp đồng đã kết thúc và không thể tái sử dụng. Đơn cũ vẫn giữ snapshot riêng."
                    }, null, 8, ["title"])) : vueExports.createCommentVNode("", true),
                    vueExports.createVNode(_component_SharedSectionCard, { title: "Vendor & Phạm vi" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-5" }, [
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Vendor" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(contract).partner?.name ?? `#${vueExports.unref(contract).partner_id}`), 1),
                              vueExports.unref(contract).partner?.slug ? (vueExports.openBlock(), vueExports.createBlock("p", {
                                key: 0,
                                class: "text-xs text-slate-500 font-mono"
                              }, vueExports.toDisplayString(vueExports.unref(contract).partner.slug), 1)) : vueExports.createCommentVNode("", true)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tenant" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.unref(contract).tenant_name ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(vueExports.unref(contract).tenant_name), 1)) : vueExports.createCommentVNode("", true),
                              vueExports.createVNode("span", { class: "text-xs text-slate-500 font-mono block" }, vueExports.toDisplayString(vueExports.unref(contract).tenant_id), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Dự án" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).project_name ?? `#${vueExports.unref(contract).project_id}`), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedSectionCard, { title: "Loại & Điều khoản" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("div", { class: "mb-4 flex items-center gap-2 flex-wrap" }, [
                          vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                            mode: vueExports.unref(contract).commission_mode,
                            size: "md"
                          }, null, 8, ["mode"]),
                          vueExports.createVNode(_component_UBadge, {
                            color: "info",
                            variant: "subtle",
                            label: `Doanh thu: ${vueExports.unref(contract).revenue_recipient.label}`,
                            icon: "i-lucide-wallet"
                          }, null, 8, ["label"])
                        ]),
                        vueExports.createVNode(_component_PartnerCommissionContractTermsViewer, {
                          mode: vueExports.unref(contract).commission_mode.value,
                          terms: vueExports.unref(contract).terms
                        }, null, 8, ["mode", "terms"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedSectionCard, { title: "Hiệu lực" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-5" }, [
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày bắt đầu" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(contract).starts_at) : "—"), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày kết thúc" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(contract).ends_at) : "Không thời hạn"), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày kích hoạt" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(contract).activated_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(contract).activated_at) : "—"), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    }),
                    vueExports.unref(contract).notes ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedSectionCard, {
                      key: 4,
                      title: "Ghi chú"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("p", { class: "whitespace-pre-line text-slate-700" }, vueExports.toDisplayString(vueExports.unref(contract).notes), 1)
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true),
                    vueExports.createVNode(_component_SharedSectionCard, { title: "Lịch sử trạng thái" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_PartnerCommissionContractTimeline, { contract: vueExports.unref(contract) }, null, 8, ["contract"])
                      ]),
                      _: 1
                    })
                  ], 64)) : vueExports.createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractSignModal, {
        open: vueExports.unref(showSignModal),
        "onUpdate:open": ($event) => vueExports.isRef(showSignModal) ? showSignModal.value = $event : null,
        contract: vueExports.unref(contract),
        loading: vueExports.unref(isSigning),
        onConfirm: handleSign
      }, null, _parent));
      if (!vueExports.unref(isPlatform)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractSwitchModal, {
          open: vueExports.unref(showSwitchModal),
          "onUpdate:open": ($event) => vueExports.isRef(showSwitchModal) ? showSwitchModal.value = $event : null,
          current: null,
          target: vueExports.unref(contract),
          loading: vueExports.unref(isSwitching),
          onConfirm: handleSwitch
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractReasonModal, {
        open: vueExports.unref(showRevokeModal),
        "onUpdate:open": ($event) => vueExports.isRef(showRevokeModal) ? showRevokeModal.value = $event : null,
        title: "Thu hồi hợp đồng",
        "confirm-label": "Xác nhận thu hồi",
        "confirm-color": "warning",
        warning: "Hợp đồng pending sẽ bị thu hồi và không thể kích hoạt nữa.",
        "help-text": "Lý do thu hồi (sẽ lưu lại để audit).",
        loading: vueExports.unref(isRevoking),
        onConfirm: handleRevoke
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractReasonModal, {
        open: vueExports.unref(showCancelModal),
        "onUpdate:open": ($event) => vueExports.isRef(showCancelModal) ? showCancelModal.value = $event : null,
        title: "Huỷ hợp đồng đang hiệu lực",
        "confirm-label": "Xác nhận huỷ",
        "confirm-color": "error",
        warning: vueExports.unref(contract)?.commission_mode.value === "subscription" ? "Sau khi huỷ, vendor ngừng nhận đơn ngay lập tức. Hợp đồng thuê bao — kỳ thanh toán hiện tại sẽ không được hoàn lại." : "Sau khi huỷ, vendor SẼ NGAY LẬP TỨC không nhận được đơn mới ở dự án này.",
        "help-text": "Lý do huỷ (sẽ lưu lại để audit).",
        loading: vueExports.unref(isCancelling),
        onConfirm: handleCancel
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá nháp hợp đồng",
        "item-name": vueExports.unref(contract)?.contract_code ?? void 0,
        loading: vueExports.unref(isDeleting),
        description: "Hợp đồng nháp sẽ bị xoá vĩnh viễn.",
        onConfirm: handleDelete
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showNotesModal),
        "onUpdate:open": ($event) => vueExports.isRef(showNotesModal) ? showNotesModal.value = $event : null,
        title: "Sửa thông tin hợp đồng"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "warning",
              variant: "subtle",
              icon: "i-lucide-info",
              description: "Hợp đồng đã ký — chỉ sửa được mã hợp đồng và ghi chú. Để thay đổi điều khoản, vui lòng thu hồi hợp đồng này và tạo nháp mới."
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mã hợp đồng",
              error: vueExports.unref(notesErrors).contract_code?.[0]
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(notesDraft).contract_code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(notesDraft).contract_code = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(notesDraft).contract_code,
                      "onUpdate:modelValue": ($event) => vueExports.unref(notesDraft).contract_code = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ghi chú",
              error: vueExports.unref(notesErrors).notes?.[0]
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(notesDraft).notes,
                    "onUpdate:modelValue": ($event) => vueExports.unref(notesDraft).notes = $event,
                    rows: 4,
                    maxlength: 2e3,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(notesDraft).notes,
                      "onUpdate:modelValue": ($event) => vueExports.unref(notesDraft).notes = $event,
                      rows: 4,
                      maxlength: 2e3,
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
              vueExports.createVNode("div", { class: "space-y-4" }, [
                vueExports.createVNode(_component_UAlert, {
                  color: "warning",
                  variant: "subtle",
                  icon: "i-lucide-info",
                  description: "Hợp đồng đã ký — chỉ sửa được mã hợp đồng và ghi chú. Để thay đổi điều khoản, vui lòng thu hồi hợp đồng này và tạo nháp mới."
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Mã hợp đồng",
                  error: vueExports.unref(notesErrors).contract_code?.[0]
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(notesDraft).contract_code,
                      "onUpdate:modelValue": ($event) => vueExports.unref(notesDraft).contract_code = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ghi chú",
                  error: vueExports.unref(notesErrors).notes?.[0]
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(notesDraft).notes,
                      "onUpdate:modelValue": ($event) => vueExports.unref(notesDraft).notes = $event,
                      rows: 4,
                      maxlength: 2e3,
                      class: "w-full"
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
              color: "neutral",
              variant: "outline",
              label: "Huỷ",
              onClick: ($event) => showNotesModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "primary",
              label: vueExports.unref(isNotesSaving) ? "Đang lưu..." : "Lưu thay đổi",
              loading: vueExports.unref(isNotesSaving),
              disabled: vueExports.unref(isNotesSaving),
              onClick: saveNotes
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Huỷ",
                  onClick: ($event) => showNotesModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "primary",
                  label: vueExports.unref(isNotesSaving) ? "Đang lưu..." : "Lưu thay đổi",
                  loading: vueExports.unref(isNotesSaving),
                  disabled: vueExports.unref(isNotesSaving),
                  onClick: saveNotes
                }, null, 8, ["label", "loading", "disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractDetailDrawer.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$3, { __name: "PartnerCommissionContractDetailDrawer" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractTermsEditor",
  __ssrInlineRender: true,
  props: {
    mode: {},
    modelValue: {},
    disabled: { type: Boolean, default: false },
    errors: { default: () => ({}) }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const perOrder = vueExports.computed(() => props.modelValue);
    function updatePerOrder(key, value) {
      emit("update:modelValue", { ...perOrder.value, [key]: value });
    }
    const revenueShare = vueExports.computed(() => props.modelValue);
    function updateBillingPeriod(value) {
      emit("update:modelValue", { ...revenueShare.value, billing_period: value });
    }
    function updateTier(idx, patch) {
      const tiers = revenueShare.value.tiers.map((t, i) => i === idx ? { ...t, ...patch } : t);
      emit("update:modelValue", { ...revenueShare.value, tiers });
    }
    function addTier() {
      const tiers = [...revenueShare.value.tiers];
      const last = tiers[tiers.length - 1];
      const min = last?.max_gmv ?? (last ? Number(last.min_gmv) + 1e6 : 0);
      tiers.push({ min_gmv: min, max_gmv: null, percent: 10 });
      if (last && last.max_gmv === null) {
        tiers[tiers.length - 2] = { ...last, max_gmv: min };
      }
      emit("update:modelValue", { ...revenueShare.value, tiers });
    }
    function removeTier(idx) {
      if (revenueShare.value.tiers.length <= 1) return;
      const tiers = revenueShare.value.tiers.filter((_, i) => i !== idx);
      emit("update:modelValue", { ...revenueShare.value, tiers });
    }
    const subscription = vueExports.computed(() => props.modelValue);
    function updateSubscription(key, value) {
      emit("update:modelValue", { ...subscription.value, [key]: value });
    }
    function errorOf(key) {
      const arr = props.errors[`terms.${key}`];
      return arr?.[0];
    }
    const generalTermsError = vueExports.computed(() => props.errors.terms?.[0]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$d;
      const _component_UFormField = _sfc_main$f;
      const _component_SharedNumberInput = __nuxt_component_5$3;
      const _component_URadioGroup = _sfc_main$k;
      const _component_UButton = _sfc_main$c$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      if (vueExports.unref(generalTermsError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-circle",
          description: vueExports.unref(generalTermsError),
          class: "mb-4"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.mode === "per_order") {
        _push(`<div class="space-y-5"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
          label: "% chiết khấu",
          help: "Để trống nếu chỉ dùng tiền cứng."
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                "model-value": vueExports.unref(perOrder).percent ?? null,
                placeholder: "VD: 10",
                min: 0,
                max: 100,
                disabled: __props.disabled,
                "onUpdate:modelValue": (v) => updatePerOrder("percent", v)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedNumberInput, {
                  "model-value": vueExports.unref(perOrder).percent ?? null,
                  placeholder: "VD: 10",
                  min: 0,
                  max: 100,
                  disabled: __props.disabled,
                  "onUpdate:modelValue": (v) => updatePerOrder("percent", v)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
          label: "Tiền cứng / đơn (VND)",
          help: "Để trống nếu chỉ dùng phần trăm."
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                "model-value": vueExports.unref(perOrder).fixed ?? null,
                placeholder: "VD: 50.000",
                min: 0,
                disabled: __props.disabled,
                "onUpdate:modelValue": (v) => updatePerOrder("fixed", v)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedNumberInput, {
                  "model-value": vueExports.unref(perOrder).fixed ?? null,
                  placeholder: "VD: 50.000",
                  min: 0,
                  disabled: __props.disabled,
                  "onUpdate:modelValue": (v) => updatePerOrder("fixed", v)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else if (__props.mode === "revenue_share") {
        _push(`<div class="space-y-5">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Chu kỳ chốt" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_URadioGroup, {
                "model-value": vueExports.unref(revenueShare).billing_period,
                items: vueExports.unref(BILLING_PERIOD_OPTIONS).map((o) => ({ value: o.value, label: o.label })),
                disabled: __props.disabled,
                orientation: "horizontal",
                "onUpdate:modelValue": (v) => updateBillingPeriod(v)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_URadioGroup, {
                  "model-value": vueExports.unref(revenueShare).billing_period,
                  items: vueExports.unref(BILLING_PERIOD_OPTIONS).map((o) => ({ value: o.value, label: o.label })),
                  disabled: __props.disabled,
                  orientation: "horizontal",
                  "onUpdate:modelValue": (v) => updateBillingPeriod(v)
                }, null, 8, ["model-value", "items", "disabled", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div><div class="flex items-center justify-between mb-2"><h3 class="text-sm font-semibold text-slate-700"> Bậc thang doanh thu </h3>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-plus",
          label: "Thêm bậc",
          size: "xs",
          variant: "soft",
          disabled: __props.disabled,
          onClick: addTier
        }, null, _parent));
        _push(`</div><div class="border border-slate-200 rounded-lg overflow-hidden"><table class="w-full text-sm"><thead class="bg-slate-50 text-slate-600"><tr><th class="text-left px-3 py-2 font-medium"> Từ (GMV) </th><th class="text-left px-3 py-2 font-medium"> Đến (GMV) </th><th class="text-left px-3 py-2 font-medium w-24"> Tỉ lệ % </th><th class="w-12"></th></tr></thead><tbody><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(revenueShare).tiers, (tier, idx) => {
          _push(`<tr class="border-t border-slate-100"><td class="px-3 py-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
            "model-value": tier.min_gmv,
            min: 0,
            disabled: __props.disabled,
            "onUpdate:modelValue": (v) => updateTier(idx, { min_gmv: v ?? 0 })
          }, null, _parent));
          _push(`</td><td class="px-3 py-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
            "model-value": tier.max_gmv ?? null,
            min: 0,
            placeholder: "Không giới hạn",
            disabled: __props.disabled,
            "onUpdate:modelValue": (v) => updateTier(idx, { max_gmv: v })
          }, null, _parent));
          _push(`</td><td class="px-3 py-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
            "model-value": tier.percent,
            min: 0,
            max: 100,
            disabled: __props.disabled,
            "onUpdate:modelValue": (v) => updateTier(idx, { percent: v ?? 0 })
          }, null, _parent));
          _push(`</td><td class="px-3 py-2 text-right">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-trash-2",
            color: "error",
            variant: "ghost",
            size: "xs",
            disabled: __props.disabled || vueExports.unref(revenueShare).tiers.length <= 1,
            onClick: ($event) => removeTier(idx)
          }, null, _parent));
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div><p class="text-xs text-slate-500 mt-2"> Cột &quot;Đến&quot; để trống = không giới hạn trên (chỉ áp dụng cho bậc cuối). </p></div></div>`);
      } else if (__props.mode === "subscription") {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
          label: "Phí thuê bao (VND)",
          required: "",
          error: errorOf("amount")
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                "model-value": vueExports.unref(subscription).amount,
                min: 0,
                disabled: __props.disabled,
                "onUpdate:modelValue": (v) => updateSubscription("amount", v ?? 0)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedNumberInput, {
                  "model-value": vueExports.unref(subscription).amount,
                  min: 0,
                  disabled: __props.disabled,
                  "onUpdate:modelValue": (v) => updateSubscription("amount", v ?? 0)
                }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
          label: "Chu kỳ",
          required: "",
          error: errorOf("cycle")
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_URadioGroup, {
                "model-value": vueExports.unref(subscription).cycle,
                items: vueExports.unref(SUBSCRIPTION_CYCLE_OPTIONS).map((o) => ({ value: o.value, label: o.label })),
                disabled: __props.disabled,
                orientation: "horizontal",
                "onUpdate:modelValue": (v) => updateSubscription("cycle", v)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_URadioGroup, {
                  "model-value": vueExports.unref(subscription).cycle,
                  items: vueExports.unref(SUBSCRIPTION_CYCLE_OPTIONS).map((o) => ({ value: o.value, label: o.label })),
                  disabled: __props.disabled,
                  orientation: "horizontal",
                  "onUpdate:modelValue": (v) => updateSubscription("cycle", v)
                }, null, 8, ["model-value", "items", "disabled", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractTermsEditor.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$2, { __name: "PartnerCommissionContractTermsEditor" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractDraftForm",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    apiErrors: { default: () => ({}) },
    disableIdentity: { type: Boolean, default: false },
    disableTerms: { type: Boolean, default: false },
    submitting: { type: Boolean, default: false },
    scope: { default: "platform" },
    currentTenantId: { default: "" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isTenant = vueExports.computed(() => props.scope === "tenant");
    function update(key, value) {
      emit("update:modelValue", { ...props.modelValue, [key]: value });
    }
    function updateMode(mode) {
      emit("update:modelValue", {
        ...props.modelValue,
        commission_mode: mode,
        terms: defaultTermsFor(mode)
      });
    }
    function updateTerms(terms) {
      emit("update:modelValue", { ...props.modelValue, terms });
    }
    function err(field) {
      return props.apiErrors[field]?.[0];
    }
    if (isTenant.value && props.currentTenantId && props.modelValue.tenant_id !== props.currentTenantId) {
      update("tenant_id", props.currentTenantId);
    }
    const partnerSearch = vueExports.ref("");
    const platformPartnersFetch = !isTenant.value ? usePlatformPartnerList(
      vueExports.computed(() => ({ search: partnerSearch.value || void 0, per_page: 50 }))
    ) : null;
    const tenantPartnersFetch = isTenant.value ? useTenantPartnerList(
      vueExports.computed(() => ({ search: partnerSearch.value || void 0, per_page: 50 }))
    ) : null;
    const partnersData = vueExports.computed(
      () => isTenant.value ? tenantPartnersFetch?.data.value : platformPartnersFetch?.data.value
    );
    const partnersStatus = vueExports.computed(
      () => isTenant.value ? tenantPartnersFetch?.status.value : platformPartnersFetch?.status.value
    );
    const partnerOptions = vueExports.computed(
      () => (partnersData.value?.data ?? []).map((p) => ({
        label: `${p.name} (${p.slug})`,
        value: p.id
      }))
    );
    const tenantSearch = vueExports.ref("");
    const platformTenantsFetch = !isTenant.value ? usePlatformOrganizationList(
      vueExports.computed(() => ({ search: tenantSearch.value || void 0 }))
    ) : null;
    const tenantOptions = vueExports.computed(
      () => (platformTenantsFetch?.data.value?.data ?? []).map((o) => ({
        label: `${o.id} — ${o.name}`,
        value: o.id
      }))
    );
    const projectOptions = vueExports.ref([]);
    const projectsLoading = vueExports.ref(false);
    async function loadProjectsFromPlatform(tenantId) {
      if (!tenantId) {
        projectOptions.value = [];
        return;
      }
      projectsLoading.value = true;
      try {
        const projects = await apiGetOrganizationProjects(tenantId);
        projectOptions.value = projects.map((p) => ({ label: p.name, value: Number(p.id) }));
      } finally {
        projectsLoading.value = false;
      }
    }
    const tenantProjectsFetch = isTenant.value ? useProjectList(vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))) : null;
    vueExports.watch(
      () => tenantProjectsFetch?.data.value,
      (d) => {
        if (!isTenant.value || !d) return;
        projectOptions.value = (d.data ?? []).map((p) => ({ label: p.name, value: Number(p.id) }));
      },
      { immediate: true }
    );
    vueExports.watch(
      () => props.modelValue.tenant_id,
      async (newId, oldId) => {
        if (isTenant.value) return;
        if (!newId || newId === oldId) {
          if (!newId) projectOptions.value = [];
          return;
        }
        await loadProjectsFromPlatform(newId);
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$f;
      const _component_USelectMenu = _sfc_main$i;
      const _component_UInput = _sfc_main$g;
      const _component_USelect = _sfc_main$j;
      const _component_PartnerCommissionContractTermsEditor = __nuxt_component_5;
      const _component_UTextarea = _sfc_main$h;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin cơ bản" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Vendor",
              required: "",
              error: err("partner_id")
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    "model-value": __props.modelValue.partner_id || void 0,
                    items: vueExports.unref(partnerOptions),
                    "value-key": "value",
                    placeholder: "Chọn vendor...",
                    searchable: "",
                    loading: vueExports.unref(partnersStatus) === "pending",
                    disabled: __props.disableIdentity,
                    class: "w-full",
                    "onUpdate:searchTerm": (v) => partnerSearch.value = v,
                    "onUpdate:modelValue": (v) => update("partner_id", Number(v ?? 0))
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      "model-value": __props.modelValue.partner_id || void 0,
                      items: vueExports.unref(partnerOptions),
                      "value-key": "value",
                      placeholder: "Chọn vendor...",
                      searchable: "",
                      loading: vueExports.unref(partnersStatus) === "pending",
                      disabled: __props.disableIdentity,
                      class: "w-full",
                      "onUpdate:searchTerm": (v) => partnerSearch.value = v,
                      "onUpdate:modelValue": (v) => update("partner_id", Number(v ?? 0))
                    }, null, 8, ["model-value", "items", "loading", "disabled", "onUpdate:searchTerm", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mã hợp đồng",
              help: "Để trống → tự sinh HD-YYYY-NNNN",
              error: err("contract_code")
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    "model-value": __props.modelValue.contract_code ?? "",
                    placeholder: "HD-2026-0001",
                    disabled: __props.submitting,
                    "onUpdate:modelValue": (v) => update("contract_code", String(v || ""))
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.modelValue.contract_code ?? "",
                      placeholder: "HD-2026-0001",
                      disabled: __props.submitting,
                      "onUpdate:modelValue": (v) => update("contract_code", String(v || ""))
                    }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (!vueExports.unref(isTenant)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Tenant (PMC)",
                required: "",
                error: err("tenant_id")
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                      "model-value": __props.modelValue.tenant_id || void 0,
                      items: vueExports.unref(tenantOptions),
                      "value-key": "value",
                      placeholder: "Chọn tenant...",
                      searchable: "",
                      disabled: __props.disableIdentity,
                      class: "w-full",
                      "onUpdate:searchTerm": (v) => tenantSearch.value = v,
                      "onUpdate:modelValue": (v) => update("tenant_id", String(v ?? ""))
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USelectMenu, {
                        "model-value": __props.modelValue.tenant_id || void 0,
                        items: vueExports.unref(tenantOptions),
                        "value-key": "value",
                        placeholder: "Chọn tenant...",
                        searchable: "",
                        disabled: __props.disableIdentity,
                        class: "w-full",
                        "onUpdate:searchTerm": (v) => tenantSearch.value = v,
                        "onUpdate:modelValue": (v) => update("tenant_id", String(v ?? ""))
                      }, null, 8, ["model-value", "items", "disabled", "onUpdate:searchTerm", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Tenant",
                help: "Tự động gắn vào đơn vị của bạn"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      "model-value": __props.currentTenantId || __props.modelValue.tenant_id,
                      disabled: "",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        "model-value": __props.currentTenantId || __props.modelValue.tenant_id,
                        disabled: "",
                        class: "w-full"
                      }, null, 8, ["model-value"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Dự án",
              required: "",
              error: err("project_id"),
              help: !vueExports.unref(isTenant) && !__props.modelValue.tenant_id ? "Vui lòng chọn tenant trước" : void 0
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    "model-value": __props.modelValue.project_id || void 0,
                    items: vueExports.unref(projectOptions),
                    "value-key": "value",
                    placeholder: "Chọn dự án...",
                    searchable: "",
                    loading: vueExports.unref(projectsLoading),
                    disabled: __props.disableIdentity || !vueExports.unref(isTenant) && !__props.modelValue.tenant_id,
                    class: "w-full",
                    "onUpdate:modelValue": (v) => update("project_id", Number(v ?? 0))
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      "model-value": __props.modelValue.project_id || void 0,
                      items: vueExports.unref(projectOptions),
                      "value-key": "value",
                      placeholder: "Chọn dự án...",
                      searchable: "",
                      loading: vueExports.unref(projectsLoading),
                      disabled: __props.disableIdentity || !vueExports.unref(isTenant) && !__props.modelValue.tenant_id,
                      class: "w-full",
                      "onUpdate:modelValue": (v) => update("project_id", Number(v ?? 0))
                    }, null, 8, ["model-value", "items", "loading", "disabled", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ngày bắt đầu",
              required: "",
              error: err("starts_at")
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    type: "date",
                    "model-value": __props.modelValue.starts_at?.substring(0, 10) ?? "",
                    disabled: __props.disableTerms,
                    "onUpdate:modelValue": (v) => update("starts_at", String(v || ""))
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      type: "date",
                      "model-value": __props.modelValue.starts_at?.substring(0, 10) ?? "",
                      disabled: __props.disableTerms,
                      "onUpdate:modelValue": (v) => update("starts_at", String(v || ""))
                    }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ngày kết thúc",
              help: "Để trống = không thời hạn",
              error: err("ends_at")
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    type: "date",
                    "model-value": __props.modelValue.ends_at?.substring(0, 10) ?? "",
                    disabled: __props.disableTerms,
                    "onUpdate:modelValue": (v) => update("ends_at", v ? String(v) : null)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      type: "date",
                      "model-value": __props.modelValue.ends_at?.substring(0, 10) ?? "",
                      disabled: __props.disableTerms,
                      "onUpdate:modelValue": (v) => update("ends_at", v ? String(v) : null)
                    }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Vendor",
                  required: "",
                  error: err("partner_id")
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelectMenu, {
                      "model-value": __props.modelValue.partner_id || void 0,
                      items: vueExports.unref(partnerOptions),
                      "value-key": "value",
                      placeholder: "Chọn vendor...",
                      searchable: "",
                      loading: vueExports.unref(partnersStatus) === "pending",
                      disabled: __props.disableIdentity,
                      class: "w-full",
                      "onUpdate:searchTerm": (v) => partnerSearch.value = v,
                      "onUpdate:modelValue": (v) => update("partner_id", Number(v ?? 0))
                    }, null, 8, ["model-value", "items", "loading", "disabled", "onUpdate:searchTerm", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Mã hợp đồng",
                  help: "Để trống → tự sinh HD-YYYY-NNNN",
                  error: err("contract_code")
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.modelValue.contract_code ?? "",
                      placeholder: "HD-2026-0001",
                      disabled: __props.submitting,
                      "onUpdate:modelValue": (v) => update("contract_code", String(v || ""))
                    }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                !vueExports.unref(isTenant) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 0,
                  label: "Tenant (PMC)",
                  required: "",
                  error: err("tenant_id")
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelectMenu, {
                      "model-value": __props.modelValue.tenant_id || void 0,
                      items: vueExports.unref(tenantOptions),
                      "value-key": "value",
                      placeholder: "Chọn tenant...",
                      searchable: "",
                      disabled: __props.disableIdentity,
                      class: "w-full",
                      "onUpdate:searchTerm": (v) => tenantSearch.value = v,
                      "onUpdate:modelValue": (v) => update("tenant_id", String(v ?? ""))
                    }, null, 8, ["model-value", "items", "disabled", "onUpdate:searchTerm", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 1,
                  label: "Tenant",
                  help: "Tự động gắn vào đơn vị của bạn"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.currentTenantId || __props.modelValue.tenant_id,
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                })),
                vueExports.createVNode(_component_UFormField, {
                  label: "Dự án",
                  required: "",
                  error: err("project_id"),
                  help: !vueExports.unref(isTenant) && !__props.modelValue.tenant_id ? "Vui lòng chọn tenant trước" : void 0
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelectMenu, {
                      "model-value": __props.modelValue.project_id || void 0,
                      items: vueExports.unref(projectOptions),
                      "value-key": "value",
                      placeholder: "Chọn dự án...",
                      searchable: "",
                      loading: vueExports.unref(projectsLoading),
                      disabled: __props.disableIdentity || !vueExports.unref(isTenant) && !__props.modelValue.tenant_id,
                      class: "w-full",
                      "onUpdate:modelValue": (v) => update("project_id", Number(v ?? 0))
                    }, null, 8, ["model-value", "items", "loading", "disabled", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error", "help"]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ngày bắt đầu",
                  required: "",
                  error: err("starts_at")
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      type: "date",
                      "model-value": __props.modelValue.starts_at?.substring(0, 10) ?? "",
                      disabled: __props.disableTerms,
                      "onUpdate:modelValue": (v) => update("starts_at", String(v || ""))
                    }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ngày kết thúc",
                  help: "Để trống = không thời hạn",
                  error: err("ends_at")
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      type: "date",
                      "model-value": __props.modelValue.ends_at?.substring(0, 10) ?? "",
                      disabled: __props.disableTerms,
                      "onUpdate:modelValue": (v) => update("ends_at", v ? String(v) : null)
                    }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Loại hợp đồng" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 md:grid-cols-3 gap-3"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(COMMISSION_MODE_OPTIONS), (opt) => {
              _push2(`<button type="button"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(__props.disableTerms) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
                __props.modelValue.commission_mode === opt.value ? "border-primary-500 bg-primary-50/50" : "border-slate-200 hover:border-slate-300",
                __props.disableTerms ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              ], "text-left border-2 rounded-lg p-4 transition-colors"])}"${_scopeId}><p class="font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(opt.label)}</p><p class="text-xs text-slate-500 mt-1"${_scopeId}>`);
              if (opt.value === "per_order") {
                _push2(`<span${_scopeId}>% hoặc tiền cứng mỗi đơn + chia tỉ lệ cho các bên</span>`);
              } else if (opt.value === "revenue_share") {
                _push2(`<span${_scopeId}>Bậc thang doanh thu theo tháng/quý</span>`);
              } else {
                _push2(`<span${_scopeId}>Phí cố định theo tháng / quý / năm</span>`);
              }
              _push2(`</p></button>`);
            });
            _push2(`<!--]--></div>`);
            if (err("commission_mode")) {
              _push2(`<p class="text-xs text-red-600 mt-2"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(err("commission_mode"))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Doanh thu thuộc về",
              help: "Ai nhận hoa hồng từ các đơn của vendor ở dự án này.",
              class: "mt-5 max-w-sm",
              error: err("revenue_recipient")
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    "model-value": __props.modelValue.revenue_recipient,
                    items: vueExports.unref(REVENUE_RECIPIENT_OPTIONS),
                    "value-key": "value",
                    disabled: __props.disableTerms,
                    class: "w-full",
                    "onUpdate:modelValue": (v) => update("revenue_recipient", v)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      "model-value": __props.modelValue.revenue_recipient,
                      items: vueExports.unref(REVENUE_RECIPIENT_OPTIONS),
                      "value-key": "value",
                      disabled: __props.disableTerms,
                      class: "w-full",
                      "onUpdate:modelValue": (v) => update("revenue_recipient", v)
                    }, null, 8, ["model-value", "items", "disabled", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-3" }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(COMMISSION_MODE_OPTIONS), (opt) => {
                  return vueExports.openBlock(), vueExports.createBlock("button", {
                    key: opt.value,
                    type: "button",
                    disabled: __props.disableTerms,
                    class: ["text-left border-2 rounded-lg p-4 transition-colors", [
                      __props.modelValue.commission_mode === opt.value ? "border-primary-500 bg-primary-50/50" : "border-slate-200 hover:border-slate-300",
                      __props.disableTerms ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    ]],
                    onClick: ($event) => !__props.disableTerms && updateMode(opt.value)
                  }, [
                    vueExports.createVNode("p", { class: "font-semibold text-slate-900" }, vueExports.toDisplayString(opt.label), 1),
                    vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, [
                      opt.value === "per_order" ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, "% hoặc tiền cứng mỗi đơn + chia tỉ lệ cho các bên")) : opt.value === "revenue_share" ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "Bậc thang doanh thu theo tháng/quý")) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 2 }, "Phí cố định theo tháng / quý / năm"))
                    ])
                  ], 10, ["disabled", "onClick"]);
                }), 128))
              ]),
              err("commission_mode") ? (vueExports.openBlock(), vueExports.createBlock("p", {
                key: 0,
                class: "text-xs text-red-600 mt-2"
              }, vueExports.toDisplayString(err("commission_mode")), 1)) : vueExports.createCommentVNode("", true),
              vueExports.createVNode(_component_UFormField, {
                label: "Doanh thu thuộc về",
                help: "Ai nhận hoa hồng từ các đơn của vendor ở dự án này.",
                class: "mt-5 max-w-sm",
                error: err("revenue_recipient")
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_USelect, {
                    "model-value": __props.modelValue.revenue_recipient,
                    items: vueExports.unref(REVENUE_RECIPIENT_OPTIONS),
                    "value-key": "value",
                    disabled: __props.disableTerms,
                    class: "w-full",
                    "onUpdate:modelValue": (v) => update("revenue_recipient", v)
                  }, null, 8, ["model-value", "items", "disabled", "onUpdate:modelValue"])
                ]),
                _: 1
              }, 8, ["error"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Điều khoản" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractTermsEditor, {
              mode: __props.modelValue.commission_mode,
              "model-value": __props.modelValue.terms,
              disabled: __props.disableTerms,
              errors: __props.apiErrors,
              "onUpdate:modelValue": updateTerms
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_PartnerCommissionContractTermsEditor, {
                mode: __props.modelValue.commission_mode,
                "model-value": __props.modelValue.terms,
                disabled: __props.disableTerms,
                errors: __props.apiErrors,
                "onUpdate:modelValue": updateTerms
              }, null, 8, ["mode", "model-value", "disabled", "errors"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Ghi chú" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              error: err("notes")
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    "model-value": __props.modelValue.notes ?? "",
                    rows: 3,
                    maxlength: 2e3,
                    placeholder: "Ghi chú nội bộ (tối đa 2000 ký tự)...",
                    class: "w-full",
                    disabled: __props.submitting,
                    "onUpdate:modelValue": (v) => update("notes", String(v || ""))
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      "model-value": __props.modelValue.notes ?? "",
                      rows: 3,
                      maxlength: 2e3,
                      placeholder: "Ghi chú nội bộ (tối đa 2000 ký tự)...",
                      class: "w-full",
                      disabled: __props.submitting,
                      "onUpdate:modelValue": (v) => update("notes", String(v || ""))
                    }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UFormField, {
                error: err("notes")
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UTextarea, {
                    "model-value": __props.modelValue.notes ?? "",
                    rows: 3,
                    maxlength: 2e3,
                    placeholder: "Ghi chú nội bộ (tối đa 2000 ký tự)...",
                    class: "w-full",
                    disabled: __props.submitting,
                    "onUpdate:modelValue": (v) => update("notes", String(v || ""))
                  }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                ]),
                _: 1
              }, 8, ["error"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractDraftForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "PartnerCommissionContractDraftForm" });
function emptyContractDraft() {
  return {
    partner_id: 0,
    tenant_id: "",
    project_id: 0,
    commission_mode: "per_order",
    revenue_recipient: "platform",
    starts_at: (/* @__PURE__ */ new Date()).toISOString().substring(0, 10),
    ends_at: null,
    notes: null,
    contract_code: null,
    terms: defaultPerOrderTerms()
  };
}
function contractDraftFromDetail(c) {
  return {
    partner_id: c.partner_id,
    tenant_id: c.tenant_id,
    project_id: c.project_id,
    commission_mode: c.commission_mode.value,
    revenue_recipient: c.revenue_recipient.value,
    starts_at: c.starts_at ? c.starts_at.substring(0, 10) : "",
    ends_at: c.ends_at ? c.ends_at.substring(0, 10) : null,
    notes: c.notes,
    contract_code: c.contract_code,
    terms: c.terms
  };
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContractFormDrawer",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    partnerId: {},
    projectId: { default: void 0 },
    contract: { default: null },
    scope: { default: "tenant" }
  },
  emits: ["update:open", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const { tenantSubdomain } = useAppContext();
    const isPlatform = vueExports.computed(() => props.scope === "platform");
    const isEdit = vueExports.computed(() => props.contract !== null);
    const draft = vueExports.ref(emptyContractDraft());
    const apiErrors = vueExports.ref({});
    const isSubmitting = vueExports.ref(false);
    const showSignAfter = vueExports.ref(false);
    function hydrate() {
      apiErrors.value = {};
      if (props.contract) {
        draft.value = contractDraftFromDetail(props.contract);
        return;
      }
      const fresh = emptyContractDraft();
      fresh.partner_id = Number(props.partnerId);
      if (isPlatform.value) {
        fresh.tenant_id = "";
        fresh.project_id = 0;
      } else {
        fresh.tenant_id = tenantSubdomain.value ?? "";
        fresh.project_id = Number(props.projectId ?? 0);
      }
      draft.value = fresh;
    }
    vueExports.watch(() => props.open, (open) => {
      if (open) hydrate();
    }, { immediate: true });
    async function save(thenSign) {
      apiErrors.value = {};
      isSubmitting.value = true;
      showSignAfter.value = thenSign;
      try {
        let id;
        if (props.contract) {
          await (isPlatform.value ? apiUpdatePlatformContractDraft(props.contract.id, draft.value) : apiUpdateTenantContractDraft(props.contract.id, draft.value));
          id = props.contract.id;
        } else {
          const res = await (isPlatform.value ? apiCreatePlatformContract(draft.value) : apiCreateTenantContract(draft.value));
          id = res.data.id;
        }
        if (thenSign) {
          await (isPlatform.value ? apiSignPlatformContract(id) : apiSignTenantContract(id));
          toast.add({
            title: isEdit.value ? "Đã lưu và ký hợp đồng" : "Tạo và ký hợp đồng thành công",
            color: "success",
            icon: "i-lucide-check-circle"
          });
        } else {
          toast.add({
            title: "Đã lưu nháp hợp đồng",
            color: "success",
            icon: "i-lucide-check-circle"
          });
        }
        emit("saved");
        emit("update:open", false);
      } catch (err) {
        const errs = getApiValidationErrors(err);
        if (errs) {
          apiErrors.value = errs;
          toast.add({
            title: "Dữ liệu chưa hợp lệ",
            description: "Vui lòng kiểm tra các ô bị đỏ.",
            color: "error",
            icon: "i-lucide-alert-circle"
          });
        } else {
          toast.add({
            title: getApiErrorMessage(err, "Lưu nháp thất bại"),
            color: "error",
            icon: "i-lucide-alert-circle"
          });
        }
      } finally {
        isSubmitting.value = false;
        showSignAfter.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UDrawer = _sfc_main$c;
      const _component_UButton = _sfc_main$c$1;
      const _component_PartnerCommissionContractDraftForm = __nuxt_component_2;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UDrawer, vueExports.mergeProps({
        open: __props.open,
        direction: "right",
        "onUpdate:open": (v) => emit("update:open", v)
      }, _attrs), {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-screen max-w-3xl h-full flex flex-col bg-white"${_scopeId}><div class="flex items-center justify-between p-4 border-b border-slate-200"${_scopeId}><div${_scopeId}><h2 class="text-lg font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isEdit) ? "Sửa nháp hợp đồng" : "Tạo nháp hợp đồng hoa hồng")}</h2><p class="text-sm text-slate-500 mt-0.5"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isEdit) ? "Chỉnh sửa bản nháp. Sau khi ký không sửa được điều khoản." : "Tạo bản nháp cho vendor × dự án. Sau khi ký không sửa được điều khoản.")}</p></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-x",
              color: "neutral",
              variant: "ghost",
              "aria-label": "Đóng",
              disabled: vueExports.unref(isSubmitting),
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex-1 overflow-y-auto p-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractDraftForm, {
              modelValue: vueExports.unref(draft),
              "onUpdate:modelValue": ($event) => vueExports.isRef(draft) ? draft.value = $event : null,
              "api-errors": vueExports.unref(apiErrors),
              submitting: vueExports.unref(isSubmitting),
              scope: __props.scope,
              "current-tenant-id": vueExports.unref(isPlatform) ? "" : vueExports.unref(tenantSubdomain) ?? ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex justify-end gap-3 p-4 border-t border-slate-200"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "outline",
              disabled: vueExports.unref(isSubmitting),
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Lưu nháp",
              color: "primary",
              variant: "outline",
              icon: "i-lucide-save",
              loading: vueExports.unref(isSubmitting) && !vueExports.unref(showSignAfter),
              disabled: vueExports.unref(isSubmitting),
              onClick: ($event) => save(false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Lưu & Ký",
              color: "primary",
              icon: "i-lucide-file-signature",
              loading: vueExports.unref(isSubmitting) && vueExports.unref(showSignAfter),
              disabled: vueExports.unref(isSubmitting),
              onClick: ($event) => save(true)
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "w-screen max-w-3xl h-full flex flex-col bg-white" }, [
                vueExports.createVNode("div", { class: "flex items-center justify-between p-4 border-b border-slate-200" }, [
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("h2", { class: "text-lg font-bold text-slate-900" }, vueExports.toDisplayString(vueExports.unref(isEdit) ? "Sửa nháp hợp đồng" : "Tạo nháp hợp đồng hoa hồng"), 1),
                    vueExports.createVNode("p", { class: "text-sm text-slate-500 mt-0.5" }, vueExports.toDisplayString(vueExports.unref(isEdit) ? "Chỉnh sửa bản nháp. Sau khi ký không sửa được điều khoản." : "Tạo bản nháp cho vendor × dự án. Sau khi ký không sửa được điều khoản."), 1)
                  ]),
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-x",
                    color: "neutral",
                    variant: "ghost",
                    "aria-label": "Đóng",
                    disabled: vueExports.unref(isSubmitting),
                    onClick: ($event) => emit("update:open", false)
                  }, null, 8, ["disabled", "onClick"])
                ]),
                vueExports.createVNode("div", { class: "flex-1 overflow-y-auto p-4" }, [
                  vueExports.createVNode(_component_PartnerCommissionContractDraftForm, {
                    modelValue: vueExports.unref(draft),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(draft) ? draft.value = $event : null,
                    "api-errors": vueExports.unref(apiErrors),
                    submitting: vueExports.unref(isSubmitting),
                    scope: __props.scope,
                    "current-tenant-id": vueExports.unref(isPlatform) ? "" : vueExports.unref(tenantSubdomain) ?? ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "api-errors", "submitting", "scope", "current-tenant-id"])
                ]),
                vueExports.createVNode("div", { class: "flex justify-end gap-3 p-4 border-t border-slate-200" }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Huỷ",
                    color: "neutral",
                    variant: "outline",
                    disabled: vueExports.unref(isSubmitting),
                    onClick: ($event) => emit("update:open", false)
                  }, null, 8, ["disabled", "onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Lưu nháp",
                    color: "primary",
                    variant: "outline",
                    icon: "i-lucide-save",
                    loading: vueExports.unref(isSubmitting) && !vueExports.unref(showSignAfter),
                    disabled: vueExports.unref(isSubmitting),
                    onClick: ($event) => save(false)
                  }, null, 8, ["loading", "disabled", "onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Lưu & Ký",
                    color: "primary",
                    icon: "i-lucide-file-signature",
                    loading: vueExports.unref(isSubmitting) && vueExports.unref(showSignAfter),
                    disabled: vueExports.unref(isSubmitting),
                    onClick: ($event) => save(true)
                  }, null, 8, ["loading", "disabled", "onClick"])
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/ContractFormDrawer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main, { __name: "PartnerCommissionContractFormDrawer" });

export { __nuxt_component_6 as _, __nuxt_component_5$1 as a, __nuxt_component_7 as b, __nuxt_component_8 as c };
//# sourceMappingURL=ContractFormDrawer-D4QomKFW.mjs.map
