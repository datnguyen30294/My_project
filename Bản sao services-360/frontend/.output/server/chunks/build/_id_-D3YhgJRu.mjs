import { _ as _sfc_main$9 } from './Alert-tTsPKADX.mjs';
import { v as vueExports, p as useRoute$1, i as useRouter, j as useToast, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, y as _sfc_main$f, _ as __nuxt_component_0$4, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$a } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_4$1 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_6$2 } from './DualAxisChart-BTWuRjT1.mjs';
import { f as formatCurrency, a as formatNumber } from './currency-DEb2TrW3.mjs';
import { k as usePlatformPartnerDetail, p as partnerStatusBadgeColor, l as apiProvisionPartner, m as apiUpdatePartner, n as usePlatformPartnerRevenueTrend, o as usePlatformPartnerOffers, q as usePlatformPartnerRatings } from './usePartners-DhKs6EM6.mjs';
import { _ as _sfc_main$b } from './Tabs-Djlffbcc.mjs';
import { _ as __nuxt_component_5$1 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$i } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$e } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_5$2 } from './NumberInput-BfLKWOCC.mjs';
import { _ as _sfc_main$d } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$j } from './Switch-1cJNH-6C.mjs';
import { R as REVENUE_RECIPIENT_OPTIONS, S as SUBSCRIPTION_CYCLE_OPTIONS, y as usePlatformContractList, z as CONTRACT_STATUS_OPTIONS, A as apiBulkApplyPlatformCommission } from './usePartnerCommissionContracts-DUXun7gY.mjs';
import { b as getApiErrorStatus, g as getApiErrorMessage, a as getApiValidationErrors } from './apiError-DBrxF9au.mjs';
import { _ as _sfc_main$g } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$k } from './SelectMenu-DKHEMZj7.mjs';
import { _ as __nuxt_component_6$3, a as __nuxt_component_5$1$1, b as __nuxt_component_7$2, c as __nuxt_component_8$1 } from './ContractFormDrawer-D4QomKFW.mjs';
import { f as formatDateTime, a as formatDate } from './date-R5YK0ast.mjs';
import { D as DEFAULT_PER_PAGE, S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { _ as __nuxt_component_0 } from './ConsoleTable-DdQwJKhJ.mjs';
import { _ as __nuxt_component_10$1 } from './TablePagination-CZYWB-qm.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useVendorActions, _ as __nuxt_component_12, a as __nuxt_component_10 } from './PartnerFormModal-Cph3AHtC.mjs';
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
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './Label-BBgw4vHh.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-QmZAbLx-.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './index-CSThDD3J.mjs';
import './useKbd-JjFOu4f7.mjs';
import './Drawer-D5sl7aXR.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Textarea-DTCNHwKm.mjs';
import './DeleteModal-B4AevDGU.mjs';
import './RadioGroup-DnRwe9KX.mjs';
import './useOrganizations-DNv3fDw1.mjs';
import './useProjects-D4K3VYdb.mjs';
import './useAppContext-qiCJKBCF.mjs';
import './OrganizationProjectSelect-C1GzN7Mu.mjs';
import './useVendorOrders-DqEI_vYD.mjs';
import './Pagination-fZq_Msxb.mjs';
import './BaseFormModal-CG7aCaIV.mjs';
import './FormFieldError-cu7WK1i1.mjs';

const _sfc_main$8 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "RevenueCard",
  __ssrInlineRender: true,
  props: {
    partnerId: {}
  },
  setup(__props) {
    const props = __props;
    const { data, status, error } = usePlatformPartnerRevenueTrend(() => props.partnerId, () => 6);
    const trend = vueExports.computed(() => data.value?.data ?? null);
    const months = vueExports.computed(() => trend.value?.months ?? []);
    const schemaMissing = vueExports.computed(() => trend.value?.warnings?.schema_missing ?? false);
    const totals = vueExports.computed(() => {
      return months.value.reduce(
        (acc, m) => ({
          revenue: acc.revenue + m.revenue,
          orders: acc.orders + m.order_count,
          commission: acc.commission + m.commission
        }),
        { revenue: 0, orders: 0, commission: 0 }
      );
    });
    const hasActivity = vueExports.computed(() => totals.value.revenue > 0 || totals.value.orders > 0);
    function monthLabel(ym) {
      const [year, month] = ym.split("-");
      return `T${Number(month)}/${year}`;
    }
    const points = vueExports.computed(
      () => months.value.map((m) => ({
        label: monthLabel(m.month),
        bar: m.revenue,
        line: m.order_count,
        dash: m.commission
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4$1;
      const _component_UAlert = _sfc_main$9;
      const _component_SharedDualAxisChart = __nuxt_component_6$2;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({
        title: "Doanh thu 6 tháng gần nhất",
        icon: "i-lucide-trending-up"
      }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-4 text-xs text-slate-500"${_scopeId}><span class="flex items-center gap-1.5"${_scopeId}><span class="inline-block size-2.5 rounded-sm bg-emerald-400"${_scopeId}></span> Doanh thu </span><span class="flex items-center gap-1.5"${_scopeId}><span class="inline-block h-0.5 w-4 rounded bg-amber-500"${_scopeId}></span> Số đơn </span><span class="flex items-center gap-1.5"${_scopeId}><span class="inline-block w-4 border-t-2 border-dashed border-emerald-600"${_scopeId}></span> Hoa hồng </span></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center gap-4 text-xs text-slate-500" }, [
                vueExports.createVNode("span", { class: "flex items-center gap-1.5" }, [
                  vueExports.createVNode("span", { class: "inline-block size-2.5 rounded-sm bg-emerald-400" }),
                  vueExports.createTextVNode(" Doanh thu ")
                ]),
                vueExports.createVNode("span", { class: "flex items-center gap-1.5" }, [
                  vueExports.createVNode("span", { class: "inline-block h-0.5 w-4 rounded bg-amber-500" }),
                  vueExports.createTextVNode(" Số đơn ")
                ]),
                vueExports.createVNode("span", { class: "flex items-center gap-1.5" }, [
                  vueExports.createVNode("span", { class: "inline-block w-4 border-t-2 border-dashed border-emerald-600" }),
                  vueExports.createTextVNode(" Hoa hồng ")
                ])
              ])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(status) === "pending" && !vueExports.unref(trend)) {
              _push2(`<div class="h-64 bg-slate-50 rounded-lg animate-pulse"${_scopeId}></div>`);
            } else if (vueExports.unref(error)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "subtle",
                icon: "i-lucide-alert-circle",
                description: "Không tải được dữ liệu doanh thu."
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!--[-->`);
              if (vueExports.unref(schemaMissing)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "warning",
                  variant: "subtle",
                  icon: "i-lucide-database",
                  title: "Chưa có dữ liệu bán hàng",
                  description: "Vendor chưa được kết nối với gian hàng trên resi_mart nên chưa có số liệu doanh thu.",
                  class: "mb-4"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5"${_scopeId}><div class="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3"${_scopeId}><div class="text-sm text-slate-500"${_scopeId}> Doanh thu gộp </div><div class="mt-1 text-xl font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totals).revenue))}</div></div><div class="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3"${_scopeId}><div class="text-sm text-slate-500"${_scopeId}> Số đơn hoàn thành </div><div class="mt-1 text-xl font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(totals).orders))}</div></div><div class="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3"${_scopeId}><div class="text-sm text-slate-500"${_scopeId}> Hoa hồng thu về </div><div class="mt-1 text-xl font-bold text-primary-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totals).commission))}</div></div></div>`);
              if (vueExports.unref(hasActivity)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedDualAxisChart, {
                  points: vueExports.unref(points),
                  "bar-label": "Doanh thu",
                  "line-label": "Số đơn",
                  "dash-label": "Hoa hồng",
                  "line-unit": " đơn"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<div class="py-10 text-center text-sm text-slate-500"${_scopeId}> Chưa có đơn hoàn thành trong 6 tháng gần nhất. </div>`);
              }
              _push2(`<!--]-->`);
            }
          } else {
            return [
              vueExports.unref(status) === "pending" && !vueExports.unref(trend) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "h-64 bg-slate-50 rounded-lg animate-pulse"
              })) : vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 1,
                color: "error",
                variant: "subtle",
                icon: "i-lucide-alert-circle",
                description: "Không tải được dữ liệu doanh thu."
              })) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                vueExports.unref(schemaMissing) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "warning",
                  variant: "subtle",
                  icon: "i-lucide-database",
                  title: "Chưa có dữ liệu bán hàng",
                  description: "Vendor chưa được kết nối với gian hàng trên resi_mart nên chưa có số liệu doanh thu.",
                  class: "mb-4"
                })) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5" }, [
                  vueExports.createVNode("div", { class: "rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3" }, [
                    vueExports.createVNode("div", { class: "text-sm text-slate-500" }, " Doanh thu gộp "),
                    vueExports.createVNode("div", { class: "mt-1 text-xl font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totals).revenue)), 1)
                  ]),
                  vueExports.createVNode("div", { class: "rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3" }, [
                    vueExports.createVNode("div", { class: "text-sm text-slate-500" }, " Số đơn hoàn thành "),
                    vueExports.createVNode("div", { class: "mt-1 text-xl font-bold text-slate-900" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(totals).orders)), 1)
                  ]),
                  vueExports.createVNode("div", { class: "rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3" }, [
                    vueExports.createVNode("div", { class: "text-sm text-slate-500" }, " Hoa hồng thu về "),
                    vueExports.createVNode("div", { class: "mt-1 text-xl font-bold text-primary-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totals).commission)), 1)
                  ])
                ]),
                vueExports.unref(hasActivity) ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedDualAxisChart, {
                  key: 1,
                  points: vueExports.unref(points),
                  "bar-label": "Doanh thu",
                  "line-label": "Số đơn",
                  "dash-label": "Hoa hồng",
                  "line-unit": " đơn"
                }, null, 8, ["points"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  class: "py-10 text-center text-sm text-slate-500"
                }, " Chưa có đơn hoàn thành trong 6 tháng gần nhất. "))
              ], 64))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-console/RevenueCard.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$8, { __name: "VendorConsoleRevenueCard" });
const _sfc_main$7 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DefaultCommissionCard",
  __ssrInlineRender: true,
  props: {
    partnerId: {},
    projectCount: { default: 0 }
  },
  emits: ["applied"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const FEE_MODE_OPTIONS = [
      { value: "none", label: "Không thu" },
      { value: "fixed", label: "Cố định mỗi đơn" },
      { value: "percent", label: "% mỗi đơn" },
      { value: "both", label: "Cả hai (cố định + %)" },
      { value: "subscription", label: "Thu theo gói (thuê bao)" }
    ];
    const feeMode = vueExports.ref("percent");
    const percent = vueExports.ref(10);
    const fixed = vueExports.ref(null);
    const amount = vueExports.ref(5e5);
    const cycle = vueExports.ref("monthly");
    const recipient = vueExports.ref("platform");
    const startsAt = vueExports.ref((/* @__PURE__ */ new Date()).toISOString().substring(0, 10));
    const skipExisting = vueExports.ref(true);
    const isPerOrder = vueExports.computed(() => feeMode.value === "fixed" || feeMode.value === "percent" || feeMode.value === "both");
    const showPercent = vueExports.computed(() => feeMode.value === "percent" || feeMode.value === "both");
    const showFixed = vueExports.computed(() => feeMode.value === "fixed" || feeMode.value === "both");
    const isSubmitting = vueExports.ref(false);
    const canApply = vueExports.computed(() => {
      if (feeMode.value === "none") return false;
      if (props.projectCount === 0) return false;
      if (!startsAt.value) return false;
      if (feeMode.value === "subscription") return (amount.value ?? 0) > 0;
      if (showPercent.value && (percent.value ?? 0) > 0) return true;
      if (showFixed.value && (fixed.value ?? 0) > 0) return true;
      return false;
    });
    function buildTerms() {
      if (feeMode.value === "subscription") {
        return { amount: amount.value ?? 0, cycle: cycle.value };
      }
      return {
        percent: showPercent.value ? percent.value ?? null : null,
        fixed: showFixed.value ? fixed.value ?? null : null
      };
    }
    async function apply() {
      if (!canApply.value) return;
      isSubmitting.value = true;
      try {
        const payload = {
          commission_mode: isPerOrder.value ? "per_order" : "subscription",
          revenue_recipient: recipient.value,
          starts_at: startsAt.value,
          terms: buildTerms(),
          skip_existing: skipExisting.value
        };
        const res = await apiBulkApplyPlatformCommission(props.partnerId, payload);
        const created = res.data?.created ?? 0;
        const skipped = res.data?.skipped ?? 0;
        toast.add({
          title: "Đã áp hoa hồng mặc định",
          description: `Tạo ${created} hợp đồng nháp${skipped ? `, bỏ qua ${skipped} dự án đã có cấu hình` : ""}.`,
          color: "success",
          icon: "i-lucide-check-circle"
        });
        emit("applied");
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Áp hoa hồng thất bại"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4$1;
      const _component_UBadge = _sfc_main$a;
      const _component_UFormField = _sfc_main$i;
      const _component_USelect = _sfc_main$e;
      const _component_SharedNumberInput = __nuxt_component_5$2;
      const _component_UInput = _sfc_main$d;
      const _component_USwitch = _sfc_main$j;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({
        title: "Hoa hồng mặc định",
        icon: "i-lucide-percent",
        compact: ""
      }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: "neutral",
              variant: "subtle",
              label: `${__props.projectCount} dự án`,
              icon: "i-lucide-folder"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: "neutral",
                variant: "subtle",
                label: `${__props.projectCount} dự án`,
                icon: "i-lucide-folder"
              }, null, 8, ["label"])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-500 mb-4"${_scopeId}> Áp một bộ điều khoản hoa hồng cho <strong${_scopeId}>tất cả dự án</strong> vendor đang gắn. Mỗi dự án vẫn có thể ghi đè riêng bằng hợp đồng bên dưới. </p><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Hình thức" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(feeMode),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(feeMode) ? feeMode.value = $event : null,
                    items: FEE_MODE_OPTIONS,
                    "value-key": "value",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(feeMode),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(feeMode) ? feeMode.value = $event : null,
                      items: FEE_MODE_OPTIONS,
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Doanh thu thuộc về" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(recipient),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(recipient) ? recipient.value = $event : null,
                    items: vueExports.unref(REVENUE_RECIPIENT_OPTIONS),
                    "value-key": "value",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(recipient),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(recipient) ? recipient.value = $event : null,
                      items: vueExports.unref(REVENUE_RECIPIENT_OPTIONS),
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(showPercent)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "% chiết khấu / đơn" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(percent),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(percent) ? percent.value = $event : null,
                      placeholder: "VD: 10",
                      min: 0,
                      max: 100
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(percent),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(percent) ? percent.value = $event : null,
                        placeholder: "VD: 10",
                        min: 0,
                        max: 100
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(showFixed)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tiền cứng / đơn (VND)" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(fixed),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(fixed) ? fixed.value = $event : null,
                      placeholder: "VD: 50.000",
                      min: 0
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(fixed),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(fixed) ? fixed.value = $event : null,
                        placeholder: "VD: 50.000",
                        min: 0
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(feeMode) === "subscription") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Phí thuê bao (VND)" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(amount),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(amount) ? amount.value = $event : null,
                      min: 0
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(amount),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(amount) ? amount.value = $event : null,
                        min: 0
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(feeMode) === "subscription") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Chu kỳ" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                      modelValue: vueExports.unref(cycle),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(cycle) ? cycle.value = $event : null,
                      items: vueExports.unref(SUBSCRIPTION_CYCLE_OPTIONS),
                      "value-key": "value",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USelect, {
                        modelValue: vueExports.unref(cycle),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(cycle) ? cycle.value = $event : null,
                        items: vueExports.unref(SUBSCRIPTION_CYCLE_OPTIONS),
                        "value-key": "value",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ngày bắt đầu" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(startsAt),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(startsAt) ? startsAt.value = $event : null,
                    type: "date",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(startsAt),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(startsAt) ? startsAt.value = $event : null,
                      type: "date",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="mt-4 flex items-center justify-between gap-4 flex-wrap"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
              modelValue: vueExports.unref(skipExisting),
              "onUpdate:modelValue": ($event) => vueExports.isRef(skipExisting) ? skipExisting.value = $event : null,
              label: "Không ghi đè dự án đã có cấu hình"
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Lưu mặc định",
              icon: "i-lucide-check",
              loading: vueExports.unref(isSubmitting),
              disabled: !vueExports.unref(canApply) || vueExports.unref(isSubmitting),
              onClick: apply
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (vueExports.unref(feeMode) === "none") {
              _push2(`<p class="mt-3 text-xs text-slate-500"${_scopeId}> Chọn một hình thức thu hoa hồng để áp dụng. &quot;Không thu&quot; không tạo hợp đồng nào. </p>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-500 mb-4" }, [
                vueExports.createTextVNode(" Áp một bộ điều khoản hoa hồng cho "),
                vueExports.createVNode("strong", null, "tất cả dự án"),
                vueExports.createTextVNode(" vendor đang gắn. Mỗi dự án vẫn có thể ghi đè riêng bằng hợp đồng bên dưới. ")
              ]),
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                vueExports.createVNode(_component_UFormField, { label: "Hình thức" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(feeMode),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(feeMode) ? feeMode.value = $event : null,
                      items: FEE_MODE_OPTIONS,
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, { label: "Doanh thu thuộc về" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(recipient),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(recipient) ? recipient.value = $event : null,
                      items: vueExports.unref(REVENUE_RECIPIENT_OPTIONS),
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ]),
                  _: 1
                }),
                vueExports.unref(showPercent) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 0,
                  label: "% chiết khấu / đơn"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(percent),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(percent) ? percent.value = $event : null,
                      placeholder: "VD: 10",
                      min: 0,
                      max: 100
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true),
                vueExports.unref(showFixed) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 1,
                  label: "Tiền cứng / đơn (VND)"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(fixed),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(fixed) ? fixed.value = $event : null,
                      placeholder: "VD: 50.000",
                      min: 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true),
                vueExports.unref(feeMode) === "subscription" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 2,
                  label: "Phí thuê bao (VND)"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(amount),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(amount) ? amount.value = $event : null,
                      min: 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true),
                vueExports.unref(feeMode) === "subscription" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 3,
                  label: "Chu kỳ"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(cycle),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(cycle) ? cycle.value = $event : null,
                      items: vueExports.unref(SUBSCRIPTION_CYCLE_OPTIONS),
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UFormField, { label: "Ngày bắt đầu" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(startsAt),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(startsAt) ? startsAt.value = $event : null,
                      type: "date",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })
              ]),
              vueExports.createVNode("div", { class: "mt-4 flex items-center justify-between gap-4 flex-wrap" }, [
                vueExports.createVNode(_component_USwitch, {
                  modelValue: vueExports.unref(skipExisting),
                  "onUpdate:modelValue": ($event) => vueExports.isRef(skipExisting) ? skipExisting.value = $event : null,
                  label: "Không ghi đè dự án đã có cấu hình"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Lưu mặc định",
                  icon: "i-lucide-check",
                  loading: vueExports.unref(isSubmitting),
                  disabled: !vueExports.unref(canApply) || vueExports.unref(isSubmitting),
                  onClick: apply
                }, null, 8, ["loading", "disabled"])
              ]),
              vueExports.unref(feeMode) === "none" ? (vueExports.openBlock(), vueExports.createBlock("p", {
                key: 0,
                class: "mt-3 text-xs text-slate-500"
              }, ' Chọn một hình thức thu hoa hồng để áp dụng. "Không thu" không tạo hợp đồng nào. ')) : vueExports.createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-console/DefaultCommissionCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$7, { __name: "VendorConsoleDefaultCommissionCard" });
const _sfc_main$6 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProjectsCommissionCard",
  __ssrInlineRender: true,
  props: {
    projects: {}
  },
  setup(__props) {
    const columns = [
      { id: "project", header: "Dự án" },
      { id: "tenant", header: "Công ty vận hành" },
      { id: "enabled", header: "Trạng thái" },
      { id: "commission", header: "Cách tính" },
      { id: "recipient", header: "Người nhận DT" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4$1;
      const _component_UTable = _sfc_main$g;
      const _component_UBadge = _sfc_main$a;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({
        title: "Dự án & hoa hồng theo dự án",
        icon: "i-lucide-folder-tree",
        compact: ""
      }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-xs text-slate-500"${_scopeId}> Cấu hình chi tiết tại &quot;Hợp đồng hoa hồng&quot; bên dưới </span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-xs text-slate-500" }, ' Cấu hình chi tiết tại "Hợp đồng hoa hồng" bên dưới ')
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="border border-slate-200 rounded-lg overflow-hidden"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: __props.projects,
              columns
            }, {
              "project-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div${_scopeId2}><p class="text-sm font-medium text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name)}</p><p class="text-xs text-slate-500 font-mono"${_scopeId2}> #${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_id)}</p></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("p", { class: "text-sm font-medium text-slate-900" }, vueExports.toDisplayString(row.original.project_name), 1),
                      vueExports.createVNode("p", { class: "text-xs text-slate-500 font-mono" }, " #" + vueExports.toDisplayString(row.original.project_id), 1)
                    ])
                  ];
                }
              }),
              "tenant-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div${_scopeId2}><p class="text-sm text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.tenant_name ?? "—")}</p><p class="text-xs text-slate-500 font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.tenant_id)}</p></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("p", { class: "text-sm text-slate-900" }, vueExports.toDisplayString(row.original.tenant_name ?? "—"), 1),
                      vueExports.createVNode("p", { class: "text-xs text-slate-500 font-mono" }, vueExports.toDisplayString(row.original.tenant_id), 1)
                    ])
                  ];
                }
              }),
              "enabled-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: row.original.is_vendor_enabled ? "success" : "neutral",
                    variant: "subtle",
                    label: row.original.is_vendor_enabled ? "Đang quản lý" : "Đã dừng"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      color: row.original.is_vendor_enabled ? "success" : "neutral",
                      variant: "subtle",
                      label: row.original.is_vendor_enabled ? "Đang quản lý" : "Đã dừng"
                    }, null, 8, ["color", "label"])
                  ];
                }
              }),
              "commission-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.commission) {
                    _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      color: "primary",
                      variant: "subtle",
                      label: row.original.commission.mode.label
                    }, null, _parent3, _scopeId2));
                    if (row.original.commission.is_override) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        color: "info",
                        variant: "subtle",
                        size: "xs",
                        label: "Ghi đè"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      color: "neutral",
                      variant: "subtle",
                      label: "Chưa cấu hình"
                    }, null, _parent3, _scopeId2));
                  }
                } else {
                  return [
                    row.original.commission ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex items-center gap-2"
                    }, [
                      vueExports.createVNode(_component_UBadge, {
                        color: "primary",
                        variant: "subtle",
                        label: row.original.commission.mode.label
                      }, null, 8, ["label"]),
                      row.original.commission.is_override ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 0,
                        color: "info",
                        variant: "subtle",
                        size: "xs",
                        label: "Ghi đè"
                      })) : vueExports.createCommentVNode("", true)
                    ])) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 1,
                      color: "neutral",
                      variant: "subtle",
                      label: "Chưa cấu hình"
                    }))
                  ];
                }
              }),
              "recipient-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.commission) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      color: row.original.commission.revenue_recipient.value === "platform" ? "primary" : "neutral",
                      variant: "subtle",
                      label: row.original.commission.revenue_recipient.label
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.commission ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      color: row.original.commission.revenue_recipient.value === "platform" ? "primary" : "neutral",
                      variant: "subtle",
                      label: row.original.commission.revenue_recipient.label
                    }, null, 8, ["color", "label"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ];
                }
              }),
              empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Vendor chưa được gắn vào dự án nào. </div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Vendor chưa được gắn vào dự án nào. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "border border-slate-200 rounded-lg overflow-hidden" }, [
                vueExports.createVNode(_component_UTable, {
                  data: __props.projects,
                  columns
                }, {
                  "project-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("p", { class: "text-sm font-medium text-slate-900" }, vueExports.toDisplayString(row.original.project_name), 1),
                      vueExports.createVNode("p", { class: "text-xs text-slate-500 font-mono" }, " #" + vueExports.toDisplayString(row.original.project_id), 1)
                    ])
                  ]),
                  "tenant-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("p", { class: "text-sm text-slate-900" }, vueExports.toDisplayString(row.original.tenant_name ?? "—"), 1),
                      vueExports.createVNode("p", { class: "text-xs text-slate-500 font-mono" }, vueExports.toDisplayString(row.original.tenant_id), 1)
                    ])
                  ]),
                  "enabled-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      color: row.original.is_vendor_enabled ? "success" : "neutral",
                      variant: "subtle",
                      label: row.original.is_vendor_enabled ? "Đang quản lý" : "Đã dừng"
                    }, null, 8, ["color", "label"])
                  ]),
                  "commission-cell": vueExports.withCtx(({ row }) => [
                    row.original.commission ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex items-center gap-2"
                    }, [
                      vueExports.createVNode(_component_UBadge, {
                        color: "primary",
                        variant: "subtle",
                        label: row.original.commission.mode.label
                      }, null, 8, ["label"]),
                      row.original.commission.is_override ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 0,
                        color: "info",
                        variant: "subtle",
                        size: "xs",
                        label: "Ghi đè"
                      })) : vueExports.createCommentVNode("", true)
                    ])) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 1,
                      color: "neutral",
                      variant: "subtle",
                      label: "Chưa cấu hình"
                    }))
                  ]),
                  "recipient-cell": vueExports.withCtx(({ row }) => [
                    row.original.commission ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      color: row.original.commission.revenue_recipient.value === "platform" ? "primary" : "neutral",
                      variant: "subtle",
                      label: row.original.commission.revenue_recipient.label
                    }, null, 8, ["color", "label"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Vendor chưa được gắn vào dự án nào. ")
                  ]),
                  _: 1
                }, 8, ["data"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-console/ProjectsCommissionCard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_6$1 = Object.assign(_sfc_main$6, { __name: "VendorConsoleProjectsCommissionCard" });
const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformContractsPanel",
  __ssrInlineRender: true,
  props: {
    partnerId: {}
  },
  setup(__props) {
    const props = __props;
    const route = useRoute$1();
    const router = useRouter();
    const {
      data: contractsData,
      status: contractsStatus,
      error: contractsError,
      refresh: refreshContracts
    } = usePlatformContractList(
      vueExports.computed(() => ({ partner_id: Number(props.partnerId), per_page: SELECT_ALL_PER_PAGE }))
    );
    const allContracts = vueExports.computed(() => contractsData.value?.data ?? []);
    const tenantOptions = vueExports.computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const c of allContracts.value) {
        if (!map.has(c.tenant_id)) {
          map.set(c.tenant_id, c.tenant_name ? `${c.tenant_name} (${c.tenant_id})` : c.tenant_id);
        }
      }
      return [
        { label: "Tất cả tenant", value: void 0 },
        ...[...map.entries()].map(([value, label]) => ({ label, value }))
      ];
    });
    const tenantFilter = vueExports.ref(void 0);
    const projectOptions = vueExports.computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const c of allContracts.value) {
        if (tenantFilter.value && c.tenant_id !== tenantFilter.value) continue;
        if (!map.has(c.project_id)) {
          map.set(c.project_id, c.project_name ?? `Dự án #${c.project_id}`);
        }
      }
      return [
        { label: "Tất cả dự án", value: void 0 },
        ...[...map.entries()].map(([value, label]) => ({ label, value }))
      ];
    });
    const projectFilter = vueExports.ref(void 0);
    const statusFilter = vueExports.ref(void 0);
    vueExports.watch(tenantFilter, () => {
      projectFilter.value = void 0;
    });
    const statusItems = [
      { label: "Tất cả trạng thái", value: void 0 },
      ...CONTRACT_STATUS_OPTIONS.map((o) => ({ label: o.label, value: o.value }))
    ];
    const filteredContracts = vueExports.computed(
      () => allContracts.value.filter((c) => {
        if (tenantFilter.value && c.tenant_id !== tenantFilter.value) return false;
        if (projectFilter.value && c.project_id !== projectFilter.value) return false;
        if (statusFilter.value && c.status.value !== statusFilter.value) return false;
        return true;
      })
    );
    const hasFilters = vueExports.computed(
      () => !!tenantFilter.value || !!projectFilter.value || !!statusFilter.value
    );
    function clearFilters() {
      tenantFilter.value = void 0;
      projectFilter.value = void 0;
      statusFilter.value = void 0;
    }
    const detailDrawerOpen = vueExports.ref(false);
    const selectedContractId = vueExports.ref(null);
    function openDetail(id) {
      selectedContractId.value = id;
      detailDrawerOpen.value = true;
    }
    const initialContractId = route.query.contract ? Number(route.query.contract) : null;
    if (initialContractId) {
      openDetail(initialContractId);
    }
    vueExports.watch(detailDrawerOpen, (open) => {
      if (open || !route.query.contract) return;
      const query = { ...route.query };
      delete query.contract;
      router.replace({ query });
    });
    const formDrawerOpen = vueExports.ref(false);
    const editContract = vueExports.ref(null);
    function openCreate() {
      editContract.value = null;
      formDrawerOpen.value = true;
    }
    function openEdit(contract) {
      detailDrawerOpen.value = false;
      editContract.value = contract;
      formDrawerOpen.value = true;
    }
    async function reloadAll() {
      await refreshContracts();
    }
    const columns = [
      { accessorKey: "contract_code", header: "Mã hợp đồng" },
      { id: "tenant", header: "Tenant" },
      { id: "project", header: "Dự án" },
      { id: "mode", header: "Loại" },
      { id: "status", header: "Trạng thái" },
      { id: "effective", header: "Hiệu lực" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$k;
      const _component_USelect = _sfc_main$e;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$9;
      const _component_UTable = _sfc_main$g;
      const _component_PartnerCommissionContractModeBadge = __nuxt_component_5$1$1;
      const _component_PartnerCommissionContractStatusBadge = __nuxt_component_6$3;
      const _component_PartnerCommissionContractDetailDrawer = __nuxt_component_7$2;
      const _component_PartnerCommissionContractFormDrawer = __nuxt_component_8$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}><div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 flex-wrap shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
        modelValue: vueExports.unref(tenantFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(tenantFilter) ? tenantFilter.value = $event : null,
        items: vueExports.unref(tenantOptions),
        "value-key": "value",
        searchable: "",
        class: "min-w-[220px]"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
        modelValue: vueExports.unref(projectFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(projectFilter) ? projectFilter.value = $event : null,
        items: vueExports.unref(projectOptions),
        "value-key": "value",
        searchable: "",
        class: "min-w-[200px]"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(statusFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(statusFilter) ? statusFilter.value = $event : null,
        items: statusItems,
        "value-key": "value",
        class: "min-w-[180px]"
      }, null, _parent));
      if (vueExports.unref(hasFilters)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-x",
          label: "Xoá bộ lọc",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          onClick: clearFilters
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1"></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-plus",
        label: "Tạo hợp đồng",
        color: "primary",
        variant: "soft",
        size: "sm",
        onClick: openCreate
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(contractsError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không thể tải danh sách hợp đồng."
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(filteredContracts),
        columns,
        loading: vueExports.unref(contractsStatus) === "pending"
      }, {
        "contract_code-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="font-mono font-semibold text-primary-700 hover:underline"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.contract_code)}</button>`);
          } else {
            return [
              vueExports.createVNode("button", {
                type: "button",
                class: "font-mono font-semibold text-primary-700 hover:underline",
                onClick: ($event) => openDetail(row.original.id)
              }, vueExports.toDisplayString(row.original.contract_code), 9, ["onClick"])
            ];
          }
        }),
        "tenant-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><p class="text-sm text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.tenant_name ?? "—")}</p><p class="text-xs text-slate-500 font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.tenant_id)}</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", null, [
                vueExports.createVNode("p", { class: "text-sm text-slate-900" }, vueExports.toDisplayString(row.original.tenant_name ?? "—"), 1),
                vueExports.createVNode("p", { class: "text-xs text-slate-500 font-mono" }, vueExports.toDisplayString(row.original.tenant_id), 1)
              ])
            ];
          }
        }),
        "project-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name ?? `#${row.original.project_id}`)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.project_name ?? `#${row.original.project_id}`), 1)
            ];
          }
        }),
        "mode-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractModeBadge, {
              mode: row.original.commission_mode
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_PartnerCommissionContractModeBadge, {
                mode: row.original.commission_mode
              }, null, 8, ["mode"])
            ];
          }
        }),
        "status-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractStatusBadge, {
              status: row.original.status
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_PartnerCommissionContractStatusBadge, {
                status: row.original.status
              }, null, 8, ["status"])
            ];
          }
        }),
        "effective-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-xs text-slate-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.starts_at) : "—")} → ${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.ends_at) : "Không thời hạn")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-xs text-slate-600" }, vueExports.toDisplayString(row.original.starts_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.starts_at) : "—") + " → " + vueExports.toDisplayString(row.original.ends_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.ends_at) : "Không thời hạn"), 1)
            ];
          }
        }),
        empty: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId}> Vendor chưa có hợp đồng hoa hồng nào. </div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Vendor chưa có hợp đồng hoa hồng nào. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractDetailDrawer, {
        open: vueExports.unref(detailDrawerOpen),
        "onUpdate:open": ($event) => vueExports.isRef(detailDrawerOpen) ? detailDrawerOpen.value = $event : null,
        scope: "platform",
        "contract-id": vueExports.unref(selectedContractId),
        onChanged: reloadAll,
        onEdit: openEdit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractFormDrawer, {
        open: vueExports.unref(formDrawerOpen),
        "onUpdate:open": ($event) => vueExports.isRef(formDrawerOpen) ? formDrawerOpen.value = $event : null,
        scope: "platform",
        "partner-id": props.partnerId,
        contract: vueExports.unref(editContract),
        onSaved: reloadAll
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner-commission-contract/PlatformContractsPanel.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_7$1 = Object.assign(_sfc_main$5, { __name: "PartnerCommissionContractPlatformContractsPanel" });
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "InfoTab",
  __ssrInlineRender: true,
  props: {
    vendor: {}
  },
  emits: ["changed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const projects = vueExports.computed(() => props.vendor.projects ?? []);
    const projectCount = vueExports.computed(() => projects.value.length);
    function customDomainUrl(domain) {
      return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4$1;
      const _component_SharedFieldDisplay = __nuxt_component_5$1;
      const _component_UBadge = _sfc_main$a;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UIcon = _sfc_main$h;
      const _component_VendorConsoleDefaultCommissionCard = __nuxt_component_5;
      const _component_VendorConsoleProjectsCommissionCard = __nuxt_component_6$1;
      const _component_PartnerCommissionContractPlatformContractsPanel = __nuxt_component_7$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-6" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
        title: "Thông tin vendor",
        icon: "i-lucide-info"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã vendor" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.vendor.slug)}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(__props.vendor.slug), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên vendor" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.vendor.name)}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(__props.vendor.name), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người tạo" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: __props.vendor.owner_source.value === "tenant" ? "neutral" : "primary",
                    variant: "subtle",
                    size: "sm",
                    label: __props.vendor.owner_source.label
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      color: __props.vendor.owner_source.value === "tenant" ? "neutral" : "primary",
                      variant: "subtle",
                      size: "sm",
                      label: __props.vendor.owner_source.label
                    }, null, 8, ["color", "label"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (__props.vendor.owner_tenant_id) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Công ty vận hành" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/platform/tenants/${__props.vendor.owner_tenant_id}`,
                      class: "text-primary-600 hover:underline font-mono"
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.vendor.owner_tenant_id)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(__props.vendor.owner_tenant_id), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/platform/tenants/${__props.vendor.owner_tenant_id}`,
                        class: "text-primary-600 hover:underline font-mono"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(__props.vendor.owner_tenant_id), 1)
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
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày tạo" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.vendor.created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(__props.vendor.created_at) : "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.vendor.created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(__props.vendor.created_at) : "—"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (__props.vendor.description) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                label: "Ghi chú",
                class: "sm:col-span-2"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="whitespace-pre-line text-slate-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.vendor.description)}</p>`);
                  } else {
                    return [
                      vueExports.createVNode("p", { class: "whitespace-pre-line text-slate-700" }, vueExports.toDisplayString(__props.vendor.description), 1)
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
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã vendor" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(__props.vendor.slug), 1)
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên vendor" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(__props.vendor.name), 1)
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Người tạo" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UBadge, {
                      color: __props.vendor.owner_source.value === "tenant" ? "neutral" : "primary",
                      variant: "subtle",
                      size: "sm",
                      label: __props.vendor.owner_source.label
                    }, null, 8, ["color", "label"])
                  ]),
                  _: 1
                }),
                __props.vendor.owner_tenant_id ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                  key: 0,
                  label: "Công ty vận hành"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_NuxtLink, {
                      to: `/platform/tenants/${__props.vendor.owner_tenant_id}`,
                      class: "text-primary-600 hover:underline font-mono"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(__props.vendor.owner_tenant_id), 1)
                      ]),
                      _: 1
                    }, 8, ["to"])
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày tạo" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.vendor.created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(__props.vendor.created_at) : "—"), 1)
                  ]),
                  _: 1
                }),
                __props.vendor.description ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                  key: 1,
                  label: "Ghi chú",
                  class: "sm:col-span-2"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("p", { class: "whitespace-pre-line text-slate-700" }, vueExports.toDisplayString(__props.vendor.description), 1)
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
        title: "Trang shop resi_mart",
        icon: "i-lucide-store"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
              label: "Danh mục",
              class: "sm:col-span-2"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.vendor.categories.length) {
                    _push3(`<div class="flex flex-wrap gap-1.5"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(__props.vendor.categories, (cat) => {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        key: cat,
                        color: "info",
                        variant: "subtle",
                        label: cat,
                        size: "xs"
                      }, null, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    __props.vendor.categories.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-wrap gap-1.5"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.vendor.categories, (cat) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: cat,
                          color: "info",
                          variant: "subtle",
                          label: cat,
                          size: "xs"
                        }, null, 8, ["label"]);
                      }), 128))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Custom domain" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.vendor.custom_domain && __props.vendor.is_provisioned) {
                    _push3(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", customDomainUrl(__props.vendor.custom_domain))} target="_blank" rel="noopener" class="text-primary-600 hover:underline inline-flex items-center gap-1"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.vendor.custom_domain)} `);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-external-link",
                      class: "size-3.5"
                    }, null, _parent3, _scopeId2));
                    _push3(`</a>`);
                  } else {
                    _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.vendor.custom_domain ?? "—")}</span>`);
                  }
                } else {
                  return [
                    __props.vendor.custom_domain && __props.vendor.is_provisioned ? (vueExports.openBlock(), vueExports.createBlock("a", {
                      key: 0,
                      href: customDomainUrl(__props.vendor.custom_domain),
                      target: "_blank",
                      rel: "noopener",
                      class: "text-primary-600 hover:underline inline-flex items-center gap-1"
                    }, [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.vendor.custom_domain) + " ", 1),
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-external-link",
                        class: "size-3.5"
                      })
                    ], 8, ["href"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(__props.vendor.custom_domain ?? "—"), 1))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái resi_mart" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: __props.vendor.is_provisioned ? "success" : "warning",
                    variant: "subtle",
                    size: "sm",
                    icon: __props.vendor.is_provisioned ? "i-lucide-check" : "i-lucide-clock",
                    label: __props.vendor.is_provisioned ? "Đã provision" : "Chờ provision"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      color: __props.vendor.is_provisioned ? "success" : "warning",
                      variant: "subtle",
                      size: "sm",
                      icon: __props.vendor.is_provisioned ? "i-lucide-check" : "i-lucide-clock",
                      label: __props.vendor.is_provisioned ? "Đã provision" : "Chờ provision"
                    }, null, 8, ["color", "icon", "label"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (__props.vendor.is_provisioned) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tenant ID resi_mart" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-mono text-sm"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.vendor.tenant_id ?? "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-mono text-sm" }, vueExports.toDisplayString(__props.vendor.tenant_id ?? "—"), 1)
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
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                vueExports.createVNode(_component_SharedFieldDisplay, {
                  label: "Danh mục",
                  class: "sm:col-span-2"
                }, {
                  default: vueExports.withCtx(() => [
                    __props.vendor.categories.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-wrap gap-1.5"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.vendor.categories, (cat) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: cat,
                          color: "info",
                          variant: "subtle",
                          label: cat,
                          size: "xs"
                        }, null, 8, ["label"]);
                      }), 128))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Custom domain" }, {
                  default: vueExports.withCtx(() => [
                    __props.vendor.custom_domain && __props.vendor.is_provisioned ? (vueExports.openBlock(), vueExports.createBlock("a", {
                      key: 0,
                      href: customDomainUrl(__props.vendor.custom_domain),
                      target: "_blank",
                      rel: "noopener",
                      class: "text-primary-600 hover:underline inline-flex items-center gap-1"
                    }, [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.vendor.custom_domain) + " ", 1),
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-external-link",
                        class: "size-3.5"
                      })
                    ], 8, ["href"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(__props.vendor.custom_domain ?? "—"), 1))
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái resi_mart" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UBadge, {
                      color: __props.vendor.is_provisioned ? "success" : "warning",
                      variant: "subtle",
                      size: "sm",
                      icon: __props.vendor.is_provisioned ? "i-lucide-check" : "i-lucide-clock",
                      label: __props.vendor.is_provisioned ? "Đã provision" : "Chờ provision"
                    }, null, 8, ["color", "icon", "label"])
                  ]),
                  _: 1
                }),
                __props.vendor.is_provisioned ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                  key: 0,
                  label: "Tenant ID resi_mart"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("span", { class: "font-mono text-sm" }, vueExports.toDisplayString(__props.vendor.tenant_id ?? "—"), 1)
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorConsoleDefaultCommissionCard, {
        "partner-id": __props.vendor.id,
        "project-count": vueExports.unref(projectCount),
        onApplied: ($event) => emit("changed")
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorConsoleProjectsCommissionCard, { projects: vueExports.unref(projects) }, null, _parent));
      _push(`<div><h3 class="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-handshake",
        class: "size-4 text-slate-400"
      }, null, _parent));
      _push(` Hợp đồng hoa hồng (theo dự án) </h3>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerCommissionContractPlatformContractsPanel, {
        "partner-id": __props.vendor.id
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-console/InfoTab.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$4, { __name: "VendorConsoleInfoTab" });
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformOrdersPanel",
  __ssrInlineRender: true,
  props: {
    partnerId: {}
  },
  setup(__props) {
    const props = __props;
    const lockedPartnerId = vueExports.computed(() => Number(props.partnerId));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VendorOrderConsoleTable = __nuxt_component_0;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderConsoleTable, vueExports.mergeProps({ "locked-partner-id": vueExports.unref(lockedPartnerId) }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-order/PlatformOrdersPanel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$3, { __name: "VendorOrderPlatformOrdersPanel" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "OffersTab",
  __ssrInlineRender: true,
  props: {
    partnerId: {}
  },
  setup(__props) {
    const props = __props;
    const params = vueExports.reactive({
      search: void 0,
      type: void 0,
      status: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const typeItems = [
      { label: "Tất cả loại", value: void 0 },
      { label: "Bán sản phẩm", value: "sale" },
      { label: "Cho thuê", value: "rental" },
      { label: "Dịch vụ", value: "service" }
    ];
    const statusItems = [
      { label: "Tất cả trạng thái", value: void 0 },
      { label: "Công khai", value: "published" },
      { label: "Ẩn", value: "draft" }
    ];
    const { data, status, error } = usePlatformPartnerOffers(
      () => props.partnerId,
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const offers = vueExports.computed(() => data.value?.data ?? []);
    const schemaMissing = vueExports.computed(() => data.value?.warnings?.schema_missing ?? false);
    function offerStatusColor(color) {
      return ["neutral", "success", "warning", "error"].includes(color) ? color : "neutral";
    }
    function tenantTo(tenantId) {
      return `/platform/tenants/${tenantId}`;
    }
    function projectTo(projectId, tenantId) {
      return `/platform/quan-ly-van-hanh/du-an-tren-nen-tang/${projectId}?tenant=${tenantId}`;
    }
    const columns = [
      { id: "name", header: "Tên gói" },
      { id: "type", header: "Loại" },
      { id: "tenant", header: "Công ty vận hành" },
      { id: "project", header: "Dự án" },
      { accessorKey: "price", header: "Đơn giá" },
      { id: "unit", header: "Đơn vị" },
      { id: "status", header: "Trạng thái" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$d;
      const _component_USelect = _sfc_main$e;
      const _component_UAlert = _sfc_main$9;
      const _component_UTable = _sfc_main$g;
      const _component_UBadge = _sfc_main$a;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_SharedCrudTablePagination = __nuxt_component_10$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center gap-3 flex-wrap">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo tên gói...",
        class: "max-w-xs"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(params).type,
        "onUpdate:modelValue": ($event) => vueExports.unref(params).type = $event,
        items: typeItems,
        "value-key": "value",
        class: "min-w-[160px]"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(params).status,
        "onUpdate:modelValue": ($event) => vueExports.unref(params).status = $event,
        items: statusItems,
        "value-key": "value",
        class: "min-w-[180px]"
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(schemaMissing)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "warning",
          variant: "subtle",
          icon: "i-lucide-database",
          title: "Chưa có danh mục sản phẩm",
          description: "Vendor chưa được kết nối với gian hàng trên resi_mart nên chưa có sản phẩm."
        }, null, _parent));
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-circle",
          description: "Không thể tải danh sách sản phẩm."
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(offers),
        columns,
        loading: vueExports.unref(status) === "pending"
      }, {
        "name-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><p class="text-sm font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.name)}</p>`);
            if (row.original.sku) {
              _push2(`<p class="text-xs text-slate-500 font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.sku)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", null, [
                vueExports.createVNode("p", { class: "text-sm font-medium text-slate-900" }, vueExports.toDisplayString(row.original.name), 1),
                row.original.sku ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "text-xs text-slate-500 font-mono"
                }, vueExports.toDisplayString(row.original.sku), 1)) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "type-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: "neutral",
              variant: "subtle",
              label: row.original.type.label
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: "neutral",
                variant: "subtle",
                label: row.original.type.label
              }, null, 8, ["label"])
            ];
          }
        }),
        "tenant-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.tenant_id) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                to: tenantTo(row.original.tenant_id),
                class: "text-sm text-primary-700 hover:underline"
              }, {
                default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.tenant_name ?? row.original.tenant_id)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.tenant_name ?? row.original.tenant_id), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<span class="text-sm text-slate-400"${_scopeId}> Chưa niêm yết </span>`);
            }
          } else {
            return [
              row.original.tenant_id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                key: 0,
                to: tenantTo(row.original.tenant_id),
                class: "text-sm text-primary-700 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.tenant_name ?? row.original.tenant_id), 1)
                ]),
                _: 2
              }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-sm text-slate-400"
              }, " Chưa niêm yết "))
            ];
          }
        }),
        "project-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.project_id) {
              _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
              if (row.original.tenant_id) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: projectTo(row.original.project_id, row.original.tenant_id),
                  class: "text-sm text-primary-700 hover:underline"
                }, {
                  default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name ?? `Dự án #${row.original.project_id}`)}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.project_name ?? `Dự án #${row.original.project_id}`), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<span class="text-sm text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name ?? `Dự án #${row.original.project_id}`)}</span>`);
              }
              if (row.original.is_active === false) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  color: "warning",
                  variant: "subtle",
                  label: "Tạm dừng"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<span class="text-sm text-slate-400"${_scopeId}> — </span>`);
            }
          } else {
            return [
              row.original.project_id ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "flex items-center gap-2"
              }, [
                row.original.tenant_id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                  key: 0,
                  to: projectTo(row.original.project_id, row.original.tenant_id),
                  class: "text-sm text-primary-700 hover:underline"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.project_name ?? `Dự án #${row.original.project_id}`), 1)
                  ]),
                  _: 2
                }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 1,
                  class: "text-sm text-slate-900"
                }, vueExports.toDisplayString(row.original.project_name ?? `Dự án #${row.original.project_id}`), 1)),
                row.original.is_active === false ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                  key: 2,
                  color: "warning",
                  variant: "subtle",
                  label: "Tạm dừng"
                })) : vueExports.createCommentVNode("", true)
              ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-sm text-slate-400"
              }, " — "))
            ];
          }
        }),
        "price-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.price))}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.price)), 1)
            ];
          }
        }),
        "unit-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm text-slate-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.unit ?? "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm text-slate-600" }, vueExports.toDisplayString(row.original.unit ?? "—"), 1)
            ];
          }
        }),
        "status-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: offerStatusColor(row.original.status.color),
              variant: "subtle",
              label: row.original.status.label
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: offerStatusColor(row.original.status.color),
                variant: "subtle",
                label: row.original.status.label
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        empty: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId}> Chưa có sản phẩm nào. </div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có sản phẩm nào. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
        page: vueExports.unref(page),
        "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
        meta: vueExports.unref(data)?.meta
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-console/OffersTab.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$2, { __name: "VendorConsoleOffersTab" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "RatingsTab",
  __ssrInlineRender: true,
  props: {
    partnerId: {}
  },
  setup(__props) {
    const props = __props;
    const page = vueExports.ref(1);
    const { data, status, error } = usePlatformPartnerRatings(
      () => props.partnerId,
      vueExports.computed(() => ({ page: page.value, per_page: DEFAULT_PER_PAGE }))
    );
    const ratings = vueExports.computed(() => data.value?.data ?? []);
    const summary = vueExports.computed(() => data.value?.summary ?? null);
    const columns = [
      { id: "order", header: "Mã đơn" },
      { id: "project", header: "Dự án" },
      { id: "resident", header: "Cư dân" },
      { id: "score", header: "Điểm" },
      { id: "comment", header: "Nhận xét" },
      { id: "rated_at", header: "Thời điểm" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$9;
      const _component_UIcon = _sfc_main$h;
      const _component_UTable = _sfc_main$g;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}>`);
      if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-circle",
          description: "Không thể tải đánh giá."
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(summary) && vueExports.unref(summary).count > 0) {
        _push(`<div class="flex items-center gap-2 text-sm text-slate-600">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-star",
          class: "size-4 text-amber-500"
        }, null, _parent));
        _push(`<span class="font-semibold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).average?.toFixed(1) ?? "—")}</span><span>· ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).count)} lượt đánh giá</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(ratings),
        columns,
        loading: vueExports.unref(status) === "pending"
      }, {
        "order-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-mono text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.order_code)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "font-mono text-sm" }, vueExports.toDisplayString(row.original.order_code), 1)
            ];
          }
        }),
        "project-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project?.name ?? "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.project?.name ?? "—"), 1)
            ];
          }
        }),
        "resident-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.resident_name)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.resident_name), 1)
            ];
          }
        }),
        "score-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-1 text-amber-500"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-star",
              class: "size-4"
            }, null, _parent2, _scopeId));
            _push2(`<span class="font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.score)}</span></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center gap-1 text-amber-500" }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-star",
                  class: "size-4"
                }),
                vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.score), 1)
              ])
            ];
          }
        }),
        "comment-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm text-slate-600 line-clamp-2"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.comment ?? "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm text-slate-600 line-clamp-2" }, vueExports.toDisplayString(row.original.comment ?? "—"), 1)
            ];
          }
        }),
        "rated_at-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.rated_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.rated_at) : "—")}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.rated_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.rated_at) : "—"), 1)
            ];
          }
        }),
        empty: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId}> Chưa có đánh giá. </div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có đánh giá. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-console/RatingsTab.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "VendorConsoleRatingsTab" });
const LIST_ROUTE = "/platform/quan-ly-van-hanh/quan-ly-vendor";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter();
    const toast = useToast();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = usePlatformPartnerDetail(id);
    const vendor = vueExports.computed(() => data.value?.data ?? null);
    useSeoMeta({
      title: vueExports.computed(() => vendor.value ? `${vendor.value.name} - Vendor` : "Chi tiết vendor")
    });
    vueExports.watch(error, (e) => {
      if (!e) return;
      if (getApiErrorStatus(e) === 404) {
        toast.add({ title: "Không tìm thấy vendor", color: "error" });
        router.replace(LIST_ROUTE);
      }
    });
    function firstChar(name) {
      const trimmed = (name ?? "").trim();
      return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
    }
    const headerAction = vueExports.computed(() => {
      switch (vendor.value?.status.value) {
        case "pending":
          return { type: "approve", label: "Duyệt", icon: "i-lucide-check-circle", color: "success" };
        case "active":
          return { type: "deactivate", label: "Vô hiệu hoá", icon: "i-lucide-ban", color: "warning" };
        case "suspended":
          return { type: "reactivate", label: "Kích hoạt lại", icon: "i-lucide-power", color: "primary" };
        default:
          return null;
      }
    });
    const { runVendorAction } = useVendorActions();
    const actionType = vueExports.ref(null);
    const actionLoading = vueExports.ref(false);
    const showActionModal = vueExports.ref(false);
    function askAction(type) {
      actionType.value = type;
      showActionModal.value = true;
    }
    async function confirmAction() {
      if (!actionType.value || !vendor.value) return;
      actionLoading.value = true;
      const ok = await runVendorAction(actionType.value, vendor.value.id);
      actionLoading.value = false;
      if (ok) {
        showActionModal.value = false;
        await refresh();
      }
    }
    const provisioning = vueExports.ref(false);
    async function handleProvision() {
      if (!vendor.value) return;
      provisioning.value = true;
      try {
        await apiProvisionPartner(vendor.value.id);
        toast.add({
          title: "Đã provision tenant ở resi_mart",
          color: "success",
          icon: "i-lucide-check-circle"
        });
        await refresh();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Provision thất bại — resi_mart không phản hồi"),
          description: "Hãy chắc chắn resi_mart đang chạy và env RESI_MART_INTERNAL_URL/TOKEN đã cấu hình.",
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        provisioning.value = false;
      }
    }
    const showEditModal = vueExports.ref(false);
    const isEditing = vueExports.ref(false);
    const editApiErrors = vueExports.ref({});
    function openEdit() {
      editApiErrors.value = {};
      showEditModal.value = true;
    }
    async function handleEditSubmit(formData) {
      if (!vendor.value) return;
      editApiErrors.value = {};
      isEditing.value = true;
      const { id: _omit, slug: _slug, ...payload } = formData;
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([key, val]) => {
          if (key === "owner_email" && (val === "" || val == null)) return false;
          return true;
        })
      );
      try {
        await apiUpdatePartner(vendor.value.id, cleanPayload);
        toast.add({ title: "Cập nhật vendor thành công", color: "success", icon: "i-lucide-check-circle" });
        showEditModal.value = false;
        await refresh();
      } catch (err) {
        const errs = getApiValidationErrors(err);
        if (errs) {
          editApiErrors.value = errs;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Cập nhật vendor thất bại"), color: "error", icon: "i-lucide-alert-circle" });
        }
      } finally {
        isEditing.value = false;
      }
    }
    const tabIds = ["info", "orders", "offers", "ratings"];
    const tabItems = [
      { value: "info", label: "Thông tin & Phí", icon: "i-lucide-info" },
      { value: "orders", label: "Đơn hàng", icon: "i-lucide-shopping-cart" },
      { value: "offers", label: "Sản phẩm", icon: "i-lucide-package" },
      { value: "ratings", label: "Đánh giá cư dân", icon: "i-lucide-star" }
    ];
    const activeTab = vueExports.ref(
      tabIds.includes(route.query.tab) ? route.query.tab : "info"
    );
    vueExports.watch(activeTab, (v) => {
      router.replace({ query: { ...route.query, tab: v === "info" ? void 0 : v } });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$9;
      const _component_UButton = _sfc_main$c;
      const _component_UAvatar = _sfc_main$f;
      const _component_UBadge = _sfc_main$a;
      const _component_VendorConsoleRevenueCard = __nuxt_component_4;
      const _component_UTabs = _sfc_main$b;
      const _component_VendorConsoleInfoTab = __nuxt_component_6;
      const _component_VendorOrderPlatformOrdersPanel = __nuxt_component_7;
      const _component_VendorConsoleOffersTab = __nuxt_component_8;
      const _component_VendorConsoleRatingsTab = __nuxt_component_9;
      const _component_VendorConsoleActionConfirmModal = __nuxt_component_12;
      const _component_PartnerFormModal = __nuxt_component_10;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(vendor)) {
        _push(`<div class="flex flex-col gap-4"><div class="h-24 bg-slate-100 rounded-xl animate-pulse"></div><div class="h-48 bg-slate-100 rounded-xl animate-pulse"></div></div>`);
      } else if (vueExports.unref(error) && !vueExports.unref(vendor)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-circle",
          description: "Không tải được thông tin vendor."
        }, null, _parent));
      } else if (vueExports.unref(vendor)) {
        _push(`<div class="flex flex-col gap-6"><div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-arrow-left",
          label: "Danh sách vendor",
          color: "neutral",
          variant: "ghost",
          size: "xs",
          to: LIST_ROUTE,
          class: "mb-3"
        }, null, _parent));
        _push(`<div class="flex flex-wrap items-start justify-between gap-4"><div class="flex items-start gap-4 min-w-0 flex-1">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAvatar, {
          src: vueExports.unref(vendor).logo_url ?? void 0,
          alt: vueExports.unref(vendor).name,
          text: firstChar(vueExports.unref(vendor).name),
          size: "lg"
        }, null, _parent));
        _push(`<div class="min-w-0"><div class="flex items-center gap-3 flex-wrap"><h1 class="text-xl font-bold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).name)}</h1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          color: vueExports.unref(partnerStatusBadgeColor)(vueExports.unref(vendor).status.value),
          variant: "subtle",
          label: vueExports.unref(vendor).status.label
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          color: vueExports.unref(vendor).owner_source.value === "platform" ? "primary" : "neutral",
          variant: "subtle",
          label: vueExports.unref(vendor).owner_source.label
        }, null, _parent));
        if (vueExports.unref(vendor).is_provisioned) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: "success",
            variant: "subtle",
            label: "Đã provision",
            icon: "i-lucide-check"
          }, null, _parent));
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: "warning",
            variant: "subtle",
            label: "Chờ provision",
            icon: "i-lucide-clock"
          }, null, _parent));
        }
        _push(`</div><p class="mt-1 text-sm text-slate-500 font-mono">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(vendor).slug)}</p></div></div><div class="flex items-center gap-2">`);
        if (!vueExports.unref(vendor).is_provisioned) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-rocket",
            label: "Provision resi_mart",
            color: "warning",
            variant: "outline",
            loading: vueExports.unref(provisioning),
            onClick: handleProvision
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-pencil",
          label: "Sửa",
          color: "neutral",
          variant: "outline",
          onClick: openEdit
        }, null, _parent));
        if (vueExports.unref(headerAction)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: vueExports.unref(headerAction).icon,
            label: vueExports.unref(headerAction).label,
            color: vueExports.unref(headerAction).color,
            onClick: ($event) => askAction(vueExports.unref(headerAction).type)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorConsoleRevenueCard, {
          "partner-id": vueExports.unref(vendor).id
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTabs, {
          modelValue: vueExports.unref(activeTab),
          "onUpdate:modelValue": ($event) => vueExports.isRef(activeTab) ? activeTab.value = $event : null,
          items: tabItems,
          variant: "link",
          content: false,
          class: "w-full"
        }, null, _parent));
        if (vueExports.unref(activeTab) === "info") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorConsoleInfoTab, {
            vendor: vueExports.unref(vendor),
            onChanged: vueExports.unref(refresh)
          }, null, _parent));
        } else if (vueExports.unref(activeTab) === "orders") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderPlatformOrdersPanel, {
            "partner-id": vueExports.unref(vendor).id
          }, null, _parent));
        } else if (vueExports.unref(activeTab) === "offers") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorConsoleOffersTab, {
            "partner-id": vueExports.unref(vendor).id
          }, null, _parent));
        } else if (vueExports.unref(activeTab) === "ratings") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorConsoleRatingsTab, {
            "partner-id": vueExports.unref(vendor).id
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorConsoleActionConfirmModal, {
        open: vueExports.unref(showActionModal),
        "onUpdate:open": ($event) => vueExports.isRef(showActionModal) ? showActionModal.value = $event : null,
        action: vueExports.unref(actionType),
        "vendor-name": vueExports.unref(vendor)?.name,
        loading: vueExports.unref(actionLoading),
        onConfirm: confirmAction
      }, null, _parent));
      if (vueExports.unref(vendor)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PartnerFormModal, {
          open: vueExports.unref(showEditModal),
          "onUpdate:open": ($event) => vueExports.isRef(showEditModal) ? showEditModal.value = $event : null,
          mode: "edit",
          item: vueExports.unref(vendor),
          "initial-project-ids": vueExports.unref(vendor).project_ids,
          loading: vueExports.unref(isEditing),
          "api-errors": vueExports.unref(editApiErrors),
          onSubmit: handleEditSubmit
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/quan-ly-van-hanh/quan-ly-vendor/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-D3YhgJRu.mjs.map
