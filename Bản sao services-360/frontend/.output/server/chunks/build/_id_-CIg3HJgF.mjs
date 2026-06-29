import { v as vueExports, p as useRoute$1, i as useRouter, u as useSeoMeta, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, l as _sfc_main$c, _ as __nuxt_component_0$4, j as useToast } from './server.mjs';
import { _ as _sfc_main$6 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$7 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_5, a as __nuxt_component_6 } from './TenantResidentRatingsCard-BH222I8E.mjs';
import { _ as _sfc_main$8 } from './Tabs-Djlffbcc.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5$1 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$9 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$a } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$b } from './Empty-wM3WsVlF.mjs';
import { _ as __nuxt_component_10$1 } from './TablePagination-CZYWB-qm.mjs';
import { _ as _sfc_main$k } from './Modal-BimZZbNl.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { b as usePlatformProjectDetail, c as useProjectOrders, d as useProjectVendors, e as useProjectFeeConfig, f as apiToggleProjectVendor, g as apiUpdateProjectFeeConfig } from './usePlatformProjects-D8VBGqRs.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { _ as _sfc_main$d } from './Switch-1cJNH-6C.mjs';
import { _ as _sfc_main$e } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$f } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$g } from './RadioGroup-DnRwe9KX.mjs';
import { _ as __nuxt_component_4$1 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$i } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$j } from './Textarea-DTCNHwKm.mjs';
import { h as TENANT_FEE_MODE_OPTIONS, i as TENANT_SUBSCRIPTION_CYCLE_OPTIONS } from './useTenants-BTW8z9Mm.mjs';
import { b as getApiErrorStatus, a as getApiValidationErrors, g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { a as SubscriptionCycle, T as TenantFeeMode } from './laravel-BKHe1mna.mjs';
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
import './DualAxisChart-BTWuRjT1.mjs';
import './useDirection-CXYby7CP.mjs';
import './FocusScope-BZehoQSg.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './index-QmZAbLx-.mjs';
import './index-CSThDD3J.mjs';
import './Pagination-fZq_Msxb.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Label-BBgw4vHh.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';

const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformProjectInfoTab",
  __ssrInlineRender: true,
  props: {
    project: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5$1;
      const _component_UBadge = _sfc_main$7;
      const _component_UButton = _sfc_main$c;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-6" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin dự án" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã dự án" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.project.code)}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(__props.project.code), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên dự án" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.project.name)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.project.name), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Địa chỉ" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.project.address) {
                    _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.project.address)}</span>`);
                  } else {
                    _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    __props.project.address ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(__props.project.address), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: __props.project.status.value === "managing" ? "success" : "neutral",
                    variant: "subtle",
                    label: __props.project.status.label
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      color: __props.project.status.value === "managing" ? "success" : "neutral",
                      variant: "subtle",
                      label: __props.project.status.label
                    }, null, 8, ["color", "label"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã dự án" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(__props.project.code), 1)
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên dự án" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.project.name), 1)
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Địa chỉ" }, {
                  default: vueExports.withCtx(() => [
                    __props.project.address ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(__props.project.address), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UBadge, {
                      color: __props.project.status.value === "managing" ? "success" : "neutral",
                      variant: "subtle",
                      label: __props.project.status.label
                    }, null, 8, ["color", "label"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Công ty vận hành" }, {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-building-2",
              label: "Xem chi tiết công ty VH",
              color: "neutral",
              variant: "outline",
              size: "xs",
              to: `/platform/tenants/${__props.project.tenant.id}`
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-building-2",
                label: "Xem chi tiết công ty VH",
                color: "neutral",
                variant: "outline",
                size: "xs",
                to: `/platform/tenants/${__props.project.tenant.id}`
              }, null, 8, ["to"])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã công ty" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.project.tenant.code)}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(__props.project.tenant.code), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên công ty" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.project.tenant.name)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.project.tenant.name), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái tenant" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: __props.project.tenant.is_active ? "success" : "warning",
                    variant: "subtle",
                    label: __props.project.tenant.is_active ? "Hoạt động" : "Vô hiệu"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      color: __props.project.tenant.is_active ? "success" : "warning",
                      variant: "subtle",
                      label: __props.project.tenant.is_active ? "Hoạt động" : "Vô hiệu"
                    }, null, 8, ["color", "label"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên miền" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.project.tenant.domain) {
                    _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.project.tenant.domain)}</span>`);
                  } else {
                    _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    __props.project.tenant.domain ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "font-mono"
                    }, vueExports.toDisplayString(__props.project.tenant.domain), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã công ty" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(__props.project.tenant.code), 1)
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên công ty" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.project.tenant.name), 1)
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái tenant" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UBadge, {
                      color: __props.project.tenant.is_active ? "success" : "warning",
                      variant: "subtle",
                      label: __props.project.tenant.is_active ? "Hoạt động" : "Vô hiệu"
                    }, null, 8, ["color", "label"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên miền" }, {
                  default: vueExports.withCtx(() => [
                    __props.project.tenant.domain ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "font-mono"
                    }, vueExports.toDisplayString(__props.project.tenant.domain), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ]),
                  _: 1
                })
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/platform-project/PlatformProjectInfoTab.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_8$1 = Object.assign(_sfc_main$5, { __name: "PlatformProjectInfoTab" });
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformProjectOrderDetailModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    order: {}
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const order = vueExports.computed(() => props.order);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$k;
      const _component_SharedFieldDisplay = __nuxt_component_5$1;
      const _component_UBadge = _sfc_main$7;
      const _component_UAlert = _sfc_main$6;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: vueExports.unref(order) ? `Đơn hàng ${vueExports.unref(order).code}` : "Chi tiết đơn hàng",
        description: "Số liệu đơn hàng PMC của dự án xem từ cổng platform.",
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(order)) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã đơn" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).code)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(order).code), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      color: "neutral",
                      variant: "subtle",
                      label: vueExports.unref(order).status.label
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        color: "neutral",
                        variant: "subtle",
                        label: vueExports.unref(order).status.label
                      }, null, 8, ["label"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Giá trị đơn" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-semibold tabular-nums text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(vueExports.unref(order).total_amount)))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-semibold tabular-nums text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(vueExports.unref(order).total_amount))), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Phí platform" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-semibold tabular-nums text-emerald-600"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(vueExports.unref(order).platform_fee)))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-semibold tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(vueExports.unref(order).platform_fee))), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                label: "Thời gian hoàn thành",
                class: "sm:col-span-2"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(order).completed_at) {
                      _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).completed_at))}</span>`);
                    } else {
                      _push3(`<span class="text-slate-400"${_scopeId2}>Chưa hoàn thành</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(order).completed_at ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).completed_at)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "Chưa hoàn thành"))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "info",
              variant: "subtle",
              icon: "i-lucide-info",
              class: "mt-4",
              description: "Phí platform là số đã đóng băng tại kỳ chốt phí. Đơn chưa vào kỳ chốt hiển thị 0."
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.unref(order) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "grid grid-cols-1 sm:grid-cols-2 gap-5"
              }, [
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã đơn" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(order).code), 1)
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UBadge, {
                      color: "neutral",
                      variant: "subtle",
                      label: vueExports.unref(order).status.label
                    }, null, 8, ["label"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Giá trị đơn" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("span", { class: "font-semibold tabular-nums text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(vueExports.unref(order).total_amount))), 1)
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Phí platform" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("span", { class: "font-semibold tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(vueExports.unref(order).platform_fee))), 1)
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, {
                  label: "Thời gian hoàn thành",
                  class: "sm:col-span-2"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.unref(order).completed_at ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).completed_at)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "Chưa hoàn thành"))
                  ]),
                  _: 1
                })
              ])) : vueExports.createCommentVNode("", true),
              vueExports.createVNode(_component_UAlert, {
                color: "info",
                variant: "subtle",
                icon: "i-lucide-info",
                class: "mt-4",
                description: "Phí platform là số đã đóng băng tại kỳ chốt phí. Đơn chưa vào kỳ chốt hiển thị 0."
              })
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Đóng",
              color: "neutral",
              variant: "outline",
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Đóng",
                  color: "neutral",
                  variant: "outline",
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/platform-project/PlatformProjectOrderDetailModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$4, { __name: "PlatformProjectOrderDetailModal" });
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformProjectOrdersTab",
  __ssrInlineRender: true,
  props: {
    tenantId: {},
    projectId: {}
  },
  setup(__props) {
    const props = __props;
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      searchTerm.value = value || void 0;
      page.value = 1;
    });
    const searchTerm = vueExports.ref(void 0);
    const { data, status, error, refresh } = useProjectOrders(
      () => props.tenantId,
      () => props.projectId,
      vueExports.computed(() => ({ search: searchTerm.value, page: page.value }))
    );
    const orders = vueExports.computed(() => data.value?.data ?? []);
    const pageTotals = vueExports.computed(() => orders.value.reduce(
      (acc, order) => {
        acc.totalValue += Number(order.total_amount);
        acc.totalFee += Number(order.platform_fee);
        return acc;
      },
      { totalValue: 0, totalFee: 0 }
    ));
    const columns = [
      { accessorKey: "code", header: "Mã đơn" },
      { id: "total_amount", header: "Giá trị đơn" },
      { id: "platform_fee", header: "Phí platform" },
      { id: "status", header: "Trạng thái" },
      { id: "completed_at", header: "Thời gian" }
    ];
    const selectedOrder = vueExports.ref(null);
    const showOrderDetail = vueExports.ref(false);
    function openOrderDetail(order) {
      selectedOrder.value = order;
      showOrderDetail.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UBadge = _sfc_main$7;
      const _component_UInput = _sfc_main$9;
      const _component_UAlert = _sfc_main$6;
      const _component_UButton = _sfc_main$c;
      const _component_UTable = _sfc_main$a;
      const _component_UEmpty = _sfc_main$b;
      const _component_SharedCrudTablePagination = __nuxt_component_10$1;
      const _component_PlatformProjectOrderDetailModal = __nuxt_component_8;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({
        title: "Đơn hàng dự án",
        icon: "i-lucide-shopping-cart"
      }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap items-center gap-2 text-xs"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: "neutral",
              variant: "subtle",
              label: `Tổng giá trị (trang này): ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(pageTotals).totalValue)}`
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: "success",
              variant: "subtle",
              label: `Tổng phí platform (trang này): ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(pageTotals).totalFee)}`
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-wrap items-center gap-2 text-xs" }, [
                vueExports.createVNode(_component_UBadge, {
                  color: "neutral",
                  variant: "subtle",
                  label: `Tổng giá trị (trang này): ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(pageTotals).totalValue)}`
                }, null, 8, ["label"]),
                vueExports.createVNode(_component_UBadge, {
                  color: "success",
                  variant: "subtle",
                  label: `Tổng phí platform (trang này): ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(pageTotals).totalFee)}`
                }, null, 8, ["label"])
              ])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-500 mb-4"${_scopeId}> Đơn hàng PMC của dự án kèm phí nền tảng đã đóng băng tại kỳ chốt phí (đơn chưa vào kỳ hiển thị 0). </p><div class="mb-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(searchInput),
              "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
              icon: "i-lucide-search",
              placeholder: "Tìm theo mã đơn...",
              class: "max-w-xs"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (vueExports.unref(error)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                description: "Không thể tải danh sách đơn hàng. Vui lòng thử lại.",
                class: "mb-4"
              }, {
                actions: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      label: "Thử lại",
                      color: "error",
                      variant: "soft",
                      size: "xs",
                      icon: "i-lucide-refresh-cw",
                      onClick: ($event) => vueExports.unref(refresh)()
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        label: "Thử lại",
                        color: "error",
                        variant: "soft",
                        size: "xs",
                        icon: "i-lucide-refresh-cw",
                        onClick: ($event) => vueExports.unref(refresh)()
                      }, null, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="border border-slate-200 rounded-xl overflow-hidden"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(orders),
              columns,
              loading: vueExports.unref(status) === "pending"
            }, {
              "code-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<button type="button" class="font-mono text-primary-600 hover:underline"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}</button>`);
                } else {
                  return [
                    vueExports.createVNode("button", {
                      type: "button",
                      class: "font-mono text-primary-600 hover:underline",
                      onClick: ($event) => openOrderDetail(row.original)
                    }, vueExports.toDisplayString(row.original.code), 9, ["onClick"])
                  ];
                }
              }),
              "total_amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="tabular-nums text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(row.original.total_amount)))}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "tabular-nums text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(row.original.total_amount))), 1)
                  ];
                }
              }),
              "platform_fee-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="tabular-nums text-emerald-600"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(row.original.platform_fee)))}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(row.original.platform_fee))), 1)
                  ];
                }
              }),
              "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: "neutral",
                    variant: "subtle",
                    label: row.original.status.label
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      color: "neutral",
                      variant: "subtle",
                      label: row.original.status.label
                    }, null, 8, ["label"])
                  ];
                }
              }),
              "completed_at-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.completed_at) {
                    _push3(`<span class="text-sm text-slate-500 whitespace-nowrap"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.completed_at))}</span>`);
                  } else {
                    _push3(`<span class="text-xs text-gray-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.completed_at ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-500 whitespace-nowrap"
                    }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.completed_at)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ];
                }
              }),
              empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UEmpty, {
                    icon: "i-lucide-shopping-cart",
                    title: "Chưa có đơn hàng nào",
                    description: "Đơn hàng PMC của dự án sẽ hiển thị tại đây."
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UEmpty, {
                      icon: "i-lucide-shopping-cart",
                      title: "Chưa có đơn hàng nào",
                      description: "Đơn hàng PMC của dự án sẽ hiển thị tại đây."
                    })
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
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformProjectOrderDetailModal, {
              open: vueExports.unref(showOrderDetail),
              "onUpdate:open": ($event) => vueExports.isRef(showOrderDetail) ? showOrderDetail.value = $event : null,
              order: vueExports.unref(selectedOrder)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-500 mb-4" }, " Đơn hàng PMC của dự án kèm phí nền tảng đã đóng băng tại kỳ chốt phí (đơn chưa vào kỳ hiển thị 0). "),
              vueExports.createVNode("div", { class: "mb-4" }, [
                vueExports.createVNode(_component_UInput, {
                  modelValue: vueExports.unref(searchInput),
                  "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
                  icon: "i-lucide-search",
                  placeholder: "Tìm theo mã đơn...",
                  class: "max-w-xs"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ]),
              vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 0,
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                description: "Không thể tải danh sách đơn hàng. Vui lòng thử lại.",
                class: "mb-4"
              }, {
                actions: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UButton, {
                    label: "Thử lại",
                    color: "error",
                    variant: "soft",
                    size: "xs",
                    icon: "i-lucide-refresh-cw",
                    onClick: ($event) => vueExports.unref(refresh)()
                  }, null, 8, ["onClick"])
                ]),
                _: 1
              })) : vueExports.createCommentVNode("", true),
              vueExports.createVNode("div", { class: "border border-slate-200 rounded-xl overflow-hidden" }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(orders),
                  columns,
                  loading: vueExports.unref(status) === "pending"
                }, {
                  "code-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("button", {
                      type: "button",
                      class: "font-mono text-primary-600 hover:underline",
                      onClick: ($event) => openOrderDetail(row.original)
                    }, vueExports.toDisplayString(row.original.code), 9, ["onClick"])
                  ]),
                  "total_amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(row.original.total_amount))), 1)
                  ]),
                  "platform_fee-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(row.original.platform_fee))), 1)
                  ]),
                  "status-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      color: "neutral",
                      variant: "subtle",
                      label: row.original.status.label
                    }, null, 8, ["label"])
                  ]),
                  "completed_at-cell": vueExports.withCtx(({ row }) => [
                    row.original.completed_at ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-500 whitespace-nowrap"
                    }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(row.original.completed_at)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UEmpty, {
                      icon: "i-lucide-shopping-cart",
                      title: "Chưa có đơn hàng nào",
                      description: "Đơn hàng PMC của dự án sẽ hiển thị tại đây."
                    })
                  ]),
                  _: 1
                }, 8, ["data", "loading"]),
                vueExports.createVNode(_component_SharedCrudTablePagination, {
                  page: vueExports.unref(page),
                  "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
                  meta: vueExports.unref(data)?.meta
                }, null, 8, ["page", "onUpdate:page", "meta"])
              ]),
              vueExports.createVNode(_component_PlatformProjectOrderDetailModal, {
                open: vueExports.unref(showOrderDetail),
                "onUpdate:open": ($event) => vueExports.isRef(showOrderDetail) ? showOrderDetail.value = $event : null,
                order: vueExports.unref(selectedOrder)
              }, null, 8, ["open", "onUpdate:open", "order"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/platform-project/PlatformProjectOrdersTab.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$3, { __name: "PlatformProjectOrdersTab" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformProjectVendorTab",
  __ssrInlineRender: true,
  props: {
    tenantId: {},
    projectId: {}
  },
  setup(__props) {
    const props = __props;
    const toast = useToast();
    const { data, status, error, refresh } = useProjectVendors(
      () => props.tenantId,
      () => props.projectId
    );
    const vendors = vueExports.computed(() => data.value?.data ?? []);
    const stats = vueExports.computed(() => data.value?.stats ?? { total: 0, enabled_count: 0 });
    const schemaMissing = vueExports.computed(() => data.value?.warnings?.schema_missing ?? false);
    const togglingIds = vueExports.ref(/* @__PURE__ */ new Set());
    function statusColor(value) {
      if (value === "active") return "success";
      if (value === "suspended") return "warning";
      return "neutral";
    }
    async function onToggle(vendor, enabled) {
      togglingIds.value.add(vendor.partner_id);
      try {
        await apiToggleProjectVendor(props.tenantId, props.projectId, vendor.partner_id, enabled);
        await refresh();
        toast.add({
          title: enabled ? "Đã bật vendor trên dự án" : "Đã tạm tắt vendor trên dự án",
          color: "success"
        });
      } catch {
        toast.add({ title: "Không thể cập nhật trạng thái vendor. Vui lòng thử lại.", color: "error" });
        await refresh();
      } finally {
        togglingIds.value.delete(vendor.partner_id);
      }
    }
    const columns = [
      { accessorKey: "code", header: "Mã vendor" },
      { accessorKey: "name", header: "Tên" },
      { id: "status", header: "Trạng thái" },
      { id: "offer_count", header: "Gói dịch vụ" },
      { id: "order_count", header: "Số đơn" },
      { id: "enabled", header: "Cho phép cung cấp" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UBadge = _sfc_main$7;
      const _component_UAlert = _sfc_main$6;
      const _component_UButton = _sfc_main$c;
      const _component_UTable = _sfc_main$a;
      const _component_USwitch = _sfc_main$d;
      const _component_UEmpty = _sfc_main$b;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({
        title: "Vendor / đối tác trên dự án",
        icon: "i-lucide-store"
      }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap items-center gap-2 text-xs"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: "neutral",
              variant: "subtle",
              label: `Tổng vendor: ${vueExports.unref(stats).total}`
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: "success",
              variant: "subtle",
              label: `Đang bật: ${vueExports.unref(stats).enabled_count}`
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-wrap items-center gap-2 text-xs" }, [
                vueExports.createVNode(_component_UBadge, {
                  color: "neutral",
                  variant: "subtle",
                  label: `Tổng vendor: ${vueExports.unref(stats).total}`
                }, null, 8, ["label"]),
                vueExports.createVNode(_component_UBadge, {
                  color: "success",
                  variant: "subtle",
                  label: `Đang bật: ${vueExports.unref(stats).enabled_count}`
                }, null, 8, ["label"])
              ])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-500 mb-4"${_scopeId}> Bật/tắt để cho phép hoặc tạm chặn vendor cung cấp dịch vụ trên dự án này. Tắt vendor giữ nguyên liên kết, có thể bật lại bất cứ lúc nào. </p>`);
            if (vueExports.unref(schemaMissing)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-triangle-alert",
                color: "warning",
                variant: "subtle",
                title: "Một số vendor chưa kết nối được dữ liệu marketplace",
                description: "Số gói dịch vụ / số đơn của các vendor đó tạm hiển thị 0.",
                class: "mb-4"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(error)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                description: "Không thể tải danh sách vendor. Vui lòng thử lại.",
                class: "mb-4"
              }, {
                actions: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      label: "Thử lại",
                      color: "error",
                      variant: "soft",
                      size: "xs",
                      icon: "i-lucide-refresh-cw",
                      onClick: ($event) => vueExports.unref(refresh)()
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        label: "Thử lại",
                        color: "error",
                        variant: "soft",
                        size: "xs",
                        icon: "i-lucide-refresh-cw",
                        onClick: ($event) => vueExports.unref(refresh)()
                      }, null, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="border border-slate-200 rounded-xl overflow-hidden"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(vendors),
              columns,
              loading: vueExports.unref(status) === "pending"
            }, {
              "code-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-mono text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-mono text-slate-900" }, vueExports.toDisplayString(row.original.code), 1)
                  ];
                }
              }),
              "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: statusColor(row.original.status.value),
                    variant: "subtle",
                    label: row.original.status.label
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      color: statusColor(row.original.status.value),
                      variant: "subtle",
                      label: row.original.status.label
                    }, null, 8, ["color", "label"])
                  ];
                }
              }),
              "offer_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="tabular-nums text-slate-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.offer_count)}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "tabular-nums text-slate-700" }, vueExports.toDisplayString(row.original.offer_count), 1)
                  ];
                }
              }),
              "order_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="tabular-nums text-slate-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.order_count)}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "tabular-nums text-slate-700" }, vueExports.toDisplayString(row.original.order_count), 1)
                  ];
                }
              }),
              "enabled-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
                    "model-value": row.original.enabled,
                    loading: vueExports.unref(togglingIds).has(row.original.partner_id),
                    "onUpdate:modelValue": (val) => onToggle(row.original, val)
                  }, null, _parent3, _scopeId2));
                  _push3(`<span class="text-xs text-slate-500"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.enabled ? "Đang bật" : "Đã tắt")}</span></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                      vueExports.createVNode(_component_USwitch, {
                        "model-value": row.original.enabled,
                        loading: vueExports.unref(togglingIds).has(row.original.partner_id),
                        "onUpdate:modelValue": (val) => onToggle(row.original, val)
                      }, null, 8, ["model-value", "loading", "onUpdate:modelValue"]),
                      vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(row.original.enabled ? "Đang bật" : "Đã tắt"), 1)
                    ])
                  ];
                }
              }),
              empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UEmpty, {
                    icon: "i-lucide-store",
                    title: "Chưa có vendor",
                    description: "Vendor cung cấp dịch vụ trên dự án sẽ hiển thị tại đây."
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UEmpty, {
                      icon: "i-lucide-store",
                      title: "Chưa có vendor",
                      description: "Vendor cung cấp dịch vụ trên dự án sẽ hiển thị tại đây."
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-500 mb-4" }, " Bật/tắt để cho phép hoặc tạm chặn vendor cung cấp dịch vụ trên dự án này. Tắt vendor giữ nguyên liên kết, có thể bật lại bất cứ lúc nào. "),
              vueExports.unref(schemaMissing) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 0,
                icon: "i-lucide-triangle-alert",
                color: "warning",
                variant: "subtle",
                title: "Một số vendor chưa kết nối được dữ liệu marketplace",
                description: "Số gói dịch vụ / số đơn của các vendor đó tạm hiển thị 0.",
                class: "mb-4"
              })) : vueExports.createCommentVNode("", true),
              vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 1,
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                description: "Không thể tải danh sách vendor. Vui lòng thử lại.",
                class: "mb-4"
              }, {
                actions: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UButton, {
                    label: "Thử lại",
                    color: "error",
                    variant: "soft",
                    size: "xs",
                    icon: "i-lucide-refresh-cw",
                    onClick: ($event) => vueExports.unref(refresh)()
                  }, null, 8, ["onClick"])
                ]),
                _: 1
              })) : vueExports.createCommentVNode("", true),
              vueExports.createVNode("div", { class: "border border-slate-200 rounded-xl overflow-hidden" }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(vendors),
                  columns,
                  loading: vueExports.unref(status) === "pending"
                }, {
                  "code-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-mono text-slate-900" }, vueExports.toDisplayString(row.original.code), 1)
                  ]),
                  "status-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      color: statusColor(row.original.status.value),
                      variant: "subtle",
                      label: row.original.status.label
                    }, null, 8, ["color", "label"])
                  ]),
                  "offer_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums text-slate-700" }, vueExports.toDisplayString(row.original.offer_count), 1)
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums text-slate-700" }, vueExports.toDisplayString(row.original.order_count), 1)
                  ]),
                  "enabled-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                      vueExports.createVNode(_component_USwitch, {
                        "model-value": row.original.enabled,
                        loading: vueExports.unref(togglingIds).has(row.original.partner_id),
                        "onUpdate:modelValue": (val) => onToggle(row.original, val)
                      }, null, 8, ["model-value", "loading", "onUpdate:modelValue"]),
                      vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(row.original.enabled ? "Đang bật" : "Đã tắt"), 1)
                    ])
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UEmpty, {
                      icon: "i-lucide-store",
                      title: "Chưa có vendor",
                      description: "Vendor cung cấp dịch vụ trên dự án sẽ hiển thị tại đây."
                    })
                  ]),
                  _: 1
                }, 8, ["data", "loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/platform-project/PlatformProjectVendorTab.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main$2, { __name: "PlatformProjectVendorTab" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformProjectFeeConfigTab",
  __ssrInlineRender: true,
  props: {
    tenantId: {},
    projectId: {}
  },
  setup(__props) {
    const props = __props;
    const toast = useToast();
    const { data, status, error, refresh } = useProjectFeeConfig(() => props.tenantId, () => props.projectId);
    const config = vueExports.computed(() => data.value?.data ?? null);
    const isLoading = vueExports.computed(() => status.value === "pending" && !data.value);
    const formState = vueExports.reactive({
      inherit_default: true,
      platform_service_enabled: true,
      notes: "",
      fee_mode: TenantFeeMode.none,
      subscription_cycle: SubscriptionCycle.monthly,
      subscription_amount: 0,
      fixed_fee_per_order: 0,
      percent_fee_per_order: 0
    });
    vueExports.watch(config, (value) => {
      if (!value) return;
      formState.inherit_default = value.inherit_default;
      formState.platform_service_enabled = value.platform_service_enabled;
      formState.notes = value.notes ?? "";
      formState.fee_mode = value.override.fee_mode?.value ?? TenantFeeMode.none;
      formState.subscription_cycle = value.override.subscription_cycle?.value ?? SubscriptionCycle.monthly;
      formState.subscription_amount = Number(value.override.subscription_amount);
      formState.fixed_fee_per_order = Number(value.override.fixed_fee_per_order);
      formState.percent_fee_per_order = Number(value.override.percent_fee_per_order);
    }, { immediate: true });
    const showSubscriptionFields = vueExports.computed(() => formState.fee_mode === TenantFeeMode.subscription);
    const showFixedFee = vueExports.computed(() => formState.fee_mode === TenantFeeMode.fixed_per_order || formState.fee_mode === TenantFeeMode.both);
    const showPercentFee = vueExports.computed(() => formState.fee_mode === TenantFeeMode.percent_per_order || formState.fee_mode === TenantFeeMode.both);
    const tenantDefault = vueExports.computed(() => config.value?.tenant_default ?? null);
    const isSaving = vueExports.ref(false);
    const apiErrors = vueExports.ref({});
    async function handleSave() {
      apiErrors.value = {};
      isSaving.value = true;
      try {
        const body = {
          inherit_default: formState.inherit_default,
          platform_service_enabled: formState.platform_service_enabled,
          notes: formState.notes.trim() || null,
          fee_mode: formState.inherit_default ? null : formState.fee_mode,
          fixed_fee_per_order: formState.fixed_fee_per_order,
          percent_fee_per_order: formState.percent_fee_per_order,
          subscription_amount: formState.subscription_amount,
          subscription_cycle: !formState.inherit_default && showSubscriptionFields.value ? formState.subscription_cycle : null
        };
        await apiUpdateProjectFeeConfig(props.tenantId, props.projectId, body);
        toast.add({ title: "Lưu cấu hình phí thành công", color: "success", icon: "i-lucide-check-circle" });
        await refresh();
      } catch (err) {
        const errors = getApiValidationErrors(err);
        if (errors) {
          apiErrors.value = errors;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Lưu cấu hình thất bại"), color: "error" });
        }
      } finally {
        isSaving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USkeleton = _sfc_main$e;
      const _component_UAlert = _sfc_main$6;
      const _component_UButton = _sfc_main$c;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_USwitch = _sfc_main$d;
      const _component_UFormField = _sfc_main$f;
      const _component_URadioGroup = _sfc_main$g;
      const _component_SharedCrudFormFieldError = __nuxt_component_4$1;
      const _component_USelect = _sfc_main$i;
      const _component_UInput = _sfc_main$9;
      const _component_UTextarea = _sfc_main$j;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-6" }, _attrs))}>`);
      if (vueExports.unref(isLoading)) {
        _push(`<div class="flex flex-col gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-32 w-full rounded-xl" }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-48 w-full rounded-xl" }, null, _parent));
        _push(`</div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-circle",
          title: "Không tải được cấu hình phí",
          description: "Đã xảy ra lỗi khi tải cấu hình. Vui lòng thử lại."
        }, {
          actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Thử lại",
                color: "error",
                variant: "soft",
                size: "xs",
                icon: "i-lucide-refresh-cw",
                onClick: ($event) => vueExports.unref(refresh)()
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UButton, {
                  label: "Thử lại",
                  color: "error",
                  variant: "soft",
                  size: "xs",
                  icon: "i-lucide-refresh-cw",
                  onClick: ($event) => vueExports.unref(refresh)()
                }, null, 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!--[-->`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Phí nền tảng theo dự án" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="text-sm text-slate-500 mb-4"${_scopeId}> Mức phí nền tảng (phần TNP thu của công ty vận hành) áp dụng riêng cho dự án này. Mặc định kế thừa cấu hình của công ty vận hành, trừ khi bật ghi đè. </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "warning",
                variant: "subtle",
                icon: "i-lucide-triangle-alert",
                title: "Thay đổi phí % sẽ tự động chia lại hoa hồng",
                description: "Khi % phí nền tảng thay đổi, tỷ lệ hoa hồng của 3 đơn vị (công ty vận hành, ban quản trị, ban quản lý) sẽ được tự động chia lại theo đúng tỷ lệ tương đối hiện tại, để tổng luôn bằng 100%. Cấu hình hoa hồng nội bộ của công ty vận hành sẽ bị ghi đè.",
                class: "mb-4"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex items-center justify-between gap-4 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50/50"${_scopeId}><div${_scopeId}><div class="font-medium text-slate-900 text-sm"${_scopeId}> Kế thừa phí từ công ty vận hành </div><div class="text-sm text-slate-500"${_scopeId}> Bật: dùng cấu hình mặc định của công ty vận hành. Tắt: ghi đè mức phí riêng cho dự án. </div></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
                modelValue: vueExports.unref(formState).inherit_default,
                "onUpdate:modelValue": ($event) => vueExports.unref(formState).inherit_default = $event
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              if (vueExports.unref(formState).inherit_default) {
                _push2(`<div class="mt-4"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "info",
                  variant: "subtle",
                  icon: "i-lucide-info",
                  title: "Đang áp dụng cấu hình mặc định của công ty vận hành"
                }, {
                  description: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (vueExports.unref(tenantDefault)) {
                        _push3(`<div class="mt-1 flex flex-col gap-0.5 text-sm"${_scopeId2}><span${_scopeId2}>Hình thức thu phí: <strong${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tenantDefault).fee_mode.label)}</strong></span><span${_scopeId2}>Phí cố định mỗi đơn: <strong${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(vueExports.unref(tenantDefault).fixed_fee_per_order)))}</strong></span><span${_scopeId2}>Phí theo % giá trị đơn: <strong${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(Number(vueExports.unref(tenantDefault).percent_fee_per_order))}%</strong></span></div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        vueExports.unref(tenantDefault) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 0,
                          class: "mt-1 flex flex-col gap-0.5 text-sm"
                        }, [
                          vueExports.createVNode("span", null, [
                            vueExports.createTextVNode("Hình thức thu phí: "),
                            vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(tenantDefault).fee_mode.label), 1)
                          ]),
                          vueExports.createVNode("span", null, [
                            vueExports.createTextVNode("Phí cố định mỗi đơn: "),
                            vueExports.createVNode("strong", null, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(vueExports.unref(tenantDefault).fixed_fee_per_order))), 1)
                          ]),
                          vueExports.createVNode("span", null, [
                            vueExports.createTextVNode("Phí theo % giá trị đơn: "),
                            vueExports.createVNode("strong", null, vueExports.toDisplayString(Number(vueExports.unref(tenantDefault).percent_fee_per_order)) + "%", 1)
                          ])
                        ])) : vueExports.createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<div class="mt-5 border-t border-slate-100 pt-5"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                  label: "Hình thức thu phí",
                  name: "fee_mode"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_URadioGroup, {
                        modelValue: vueExports.unref(formState).fee_mode,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).fee_mode = $event,
                        variant: "card",
                        items: [...vueExports.unref(TENANT_FEE_MODE_OPTIONS)],
                        "value-key": "value",
                        "label-key": "label",
                        "description-key": "description",
                        ui: {
                          fieldset: "gap-y-2.5",
                          item: "cursor-pointer border-slate-200 transition-colors hover:border-slate-300 hover:bg-slate-50/60 has-data-[state=checked]:border-slate-900 has-data-[state=checked]:bg-slate-50 has-data-[state=checked]:ring-1 has-data-[state=checked]:ring-slate-900/10",
                          label: "font-semibold text-highlighted",
                          description: "mt-0.5 leading-snug text-muted"
                        }
                      }, null, _parent3, _scopeId2));
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                        errors: vueExports.unref(apiErrors).fee_mode
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_URadioGroup, {
                          modelValue: vueExports.unref(formState).fee_mode,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).fee_mode = $event,
                          variant: "card",
                          items: [...vueExports.unref(TENANT_FEE_MODE_OPTIONS)],
                          "value-key": "value",
                          "label-key": "label",
                          "description-key": "description",
                          ui: {
                            fieldset: "gap-y-2.5",
                            item: "cursor-pointer border-slate-200 transition-colors hover:border-slate-300 hover:bg-slate-50/60 has-data-[state=checked]:border-slate-900 has-data-[state=checked]:bg-slate-50 has-data-[state=checked]:ring-1 has-data-[state=checked]:ring-slate-900/10",
                            label: "font-semibold text-highlighted",
                            description: "mt-0.5 leading-snug text-muted"
                          }
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: vueExports.unref(apiErrors).fee_mode
                        }, null, 8, ["errors"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                if (vueExports.unref(showSubscriptionFields) || vueExports.unref(showFixedFee) || vueExports.unref(showPercentFee)) {
                  _push2(`<div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
                  if (vueExports.unref(showSubscriptionFields)) {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                      label: "Chu kỳ gói",
                      name: "subscription_cycle"
                    }, {
                      default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                            modelValue: vueExports.unref(formState).subscription_cycle,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_cycle = $event,
                            items: [...vueExports.unref(TENANT_SUBSCRIPTION_CYCLE_OPTIONS)],
                            "value-key": "value",
                            "label-key": "label",
                            class: "w-full"
                          }, null, _parent3, _scopeId2));
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                            errors: vueExports.unref(apiErrors).subscription_cycle
                          }, null, _parent3, _scopeId2));
                        } else {
                          return [
                            vueExports.createVNode(_component_USelect, {
                              modelValue: vueExports.unref(formState).subscription_cycle,
                              "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_cycle = $event,
                              items: [...vueExports.unref(TENANT_SUBSCRIPTION_CYCLE_OPTIONS)],
                              "value-key": "value",
                              "label-key": "label",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                            vueExports.createVNode(_component_SharedCrudFormFieldError, {
                              errors: vueExports.unref(apiErrors).subscription_cycle
                            }, null, 8, ["errors"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  if (vueExports.unref(showSubscriptionFields)) {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                      label: "Giá gói (đ)",
                      name: "subscription_amount"
                    }, {
                      default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                            modelValue: vueExports.unref(formState).subscription_amount,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_amount = $event,
                            modelModifiers: { number: true },
                            type: "number",
                            min: 0,
                            class: "w-full"
                          }, null, _parent3, _scopeId2));
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                            errors: vueExports.unref(apiErrors).subscription_amount
                          }, null, _parent3, _scopeId2));
                        } else {
                          return [
                            vueExports.createVNode(_component_UInput, {
                              modelValue: vueExports.unref(formState).subscription_amount,
                              "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_amount = $event,
                              modelModifiers: { number: true },
                              type: "number",
                              min: 0,
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            vueExports.createVNode(_component_SharedCrudFormFieldError, {
                              errors: vueExports.unref(apiErrors).subscription_amount
                            }, null, 8, ["errors"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  if (vueExports.unref(showFixedFee)) {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                      label: "Phí cố định mỗi đơn (đ)",
                      name: "fixed_fee_per_order"
                    }, {
                      default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                            modelValue: vueExports.unref(formState).fixed_fee_per_order,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).fixed_fee_per_order = $event,
                            modelModifiers: { number: true },
                            type: "number",
                            min: 0,
                            class: "w-full"
                          }, null, _parent3, _scopeId2));
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                            errors: vueExports.unref(apiErrors).fixed_fee_per_order
                          }, null, _parent3, _scopeId2));
                        } else {
                          return [
                            vueExports.createVNode(_component_UInput, {
                              modelValue: vueExports.unref(formState).fixed_fee_per_order,
                              "onUpdate:modelValue": ($event) => vueExports.unref(formState).fixed_fee_per_order = $event,
                              modelModifiers: { number: true },
                              type: "number",
                              min: 0,
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            vueExports.createVNode(_component_SharedCrudFormFieldError, {
                              errors: vueExports.unref(apiErrors).fixed_fee_per_order
                            }, null, 8, ["errors"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  if (vueExports.unref(showPercentFee)) {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                      label: "Phí theo % giá trị đơn",
                      name: "percent_fee_per_order"
                    }, {
                      default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                            modelValue: vueExports.unref(formState).percent_fee_per_order,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).percent_fee_per_order = $event,
                            modelModifiers: { number: true },
                            type: "number",
                            min: 0,
                            max: 100,
                            step: 0.1,
                            class: "w-full"
                          }, null, _parent3, _scopeId2));
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                            errors: vueExports.unref(apiErrors).percent_fee_per_order
                          }, null, _parent3, _scopeId2));
                        } else {
                          return [
                            vueExports.createVNode(_component_UInput, {
                              modelValue: vueExports.unref(formState).percent_fee_per_order,
                              "onUpdate:modelValue": ($event) => vueExports.unref(formState).percent_fee_per_order = $event,
                              modelModifiers: { number: true },
                              type: "number",
                              min: 0,
                              max: 100,
                              step: 0.1,
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            vueExports.createVNode(_component_SharedCrudFormFieldError, {
                              errors: vueExports.unref(apiErrors).percent_fee_per_order
                            }, null, 8, ["errors"])
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
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              }
            } else {
              return [
                vueExports.createVNode("p", { class: "text-sm text-slate-500 mb-4" }, " Mức phí nền tảng (phần TNP thu của công ty vận hành) áp dụng riêng cho dự án này. Mặc định kế thừa cấu hình của công ty vận hành, trừ khi bật ghi đè. "),
                vueExports.createVNode(_component_UAlert, {
                  color: "warning",
                  variant: "subtle",
                  icon: "i-lucide-triangle-alert",
                  title: "Thay đổi phí % sẽ tự động chia lại hoa hồng",
                  description: "Khi % phí nền tảng thay đổi, tỷ lệ hoa hồng của 3 đơn vị (công ty vận hành, ban quản trị, ban quản lý) sẽ được tự động chia lại theo đúng tỷ lệ tương đối hiện tại, để tổng luôn bằng 100%. Cấu hình hoa hồng nội bộ của công ty vận hành sẽ bị ghi đè.",
                  class: "mb-4"
                }),
                vueExports.createVNode("div", { class: "flex items-center justify-between gap-4 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50/50" }, [
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("div", { class: "font-medium text-slate-900 text-sm" }, " Kế thừa phí từ công ty vận hành "),
                    vueExports.createVNode("div", { class: "text-sm text-slate-500" }, " Bật: dùng cấu hình mặc định của công ty vận hành. Tắt: ghi đè mức phí riêng cho dự án. ")
                  ]),
                  vueExports.createVNode(_component_USwitch, {
                    modelValue: vueExports.unref(formState).inherit_default,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).inherit_default = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                vueExports.unref(formState).inherit_default ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "mt-4"
                }, [
                  vueExports.createVNode(_component_UAlert, {
                    color: "info",
                    variant: "subtle",
                    icon: "i-lucide-info",
                    title: "Đang áp dụng cấu hình mặc định của công ty vận hành"
                  }, {
                    description: vueExports.withCtx(() => [
                      vueExports.unref(tenantDefault) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "mt-1 flex flex-col gap-0.5 text-sm"
                      }, [
                        vueExports.createVNode("span", null, [
                          vueExports.createTextVNode("Hình thức thu phí: "),
                          vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(tenantDefault).fee_mode.label), 1)
                        ]),
                        vueExports.createVNode("span", null, [
                          vueExports.createTextVNode("Phí cố định mỗi đơn: "),
                          vueExports.createVNode("strong", null, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(Number(vueExports.unref(tenantDefault).fixed_fee_per_order))), 1)
                        ]),
                        vueExports.createVNode("span", null, [
                          vueExports.createTextVNode("Phí theo % giá trị đơn: "),
                          vueExports.createVNode("strong", null, vueExports.toDisplayString(Number(vueExports.unref(tenantDefault).percent_fee_per_order)) + "%", 1)
                        ])
                      ])) : vueExports.createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "mt-5 border-t border-slate-100 pt-5"
                }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Hình thức thu phí",
                    name: "fee_mode"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_URadioGroup, {
                        modelValue: vueExports.unref(formState).fee_mode,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).fee_mode = $event,
                        variant: "card",
                        items: [...vueExports.unref(TENANT_FEE_MODE_OPTIONS)],
                        "value-key": "value",
                        "label-key": "label",
                        "description-key": "description",
                        ui: {
                          fieldset: "gap-y-2.5",
                          item: "cursor-pointer border-slate-200 transition-colors hover:border-slate-300 hover:bg-slate-50/60 has-data-[state=checked]:border-slate-900 has-data-[state=checked]:bg-slate-50 has-data-[state=checked]:ring-1 has-data-[state=checked]:ring-slate-900/10",
                          label: "font-semibold text-highlighted",
                          description: "mt-0.5 leading-snug text-muted"
                        }
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: vueExports.unref(apiErrors).fee_mode
                      }, null, 8, ["errors"])
                    ]),
                    _: 1
                  }),
                  vueExports.unref(showSubscriptionFields) || vueExports.unref(showFixedFee) || vueExports.unref(showPercentFee) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
                  }, [
                    vueExports.unref(showSubscriptionFields) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                      key: 0,
                      label: "Chu kỳ gói",
                      name: "subscription_cycle"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_USelect, {
                          modelValue: vueExports.unref(formState).subscription_cycle,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_cycle = $event,
                          items: [...vueExports.unref(TENANT_SUBSCRIPTION_CYCLE_OPTIONS)],
                          "value-key": "value",
                          "label-key": "label",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: vueExports.unref(apiErrors).subscription_cycle
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true),
                    vueExports.unref(showSubscriptionFields) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                      key: 1,
                      label: "Giá gói (đ)",
                      name: "subscription_amount"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).subscription_amount,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_amount = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: 0,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: vueExports.unref(apiErrors).subscription_amount
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true),
                    vueExports.unref(showFixedFee) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                      key: 2,
                      label: "Phí cố định mỗi đơn (đ)",
                      name: "fixed_fee_per_order"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).fixed_fee_per_order,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).fixed_fee_per_order = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: 0,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: vueExports.unref(apiErrors).fixed_fee_per_order
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true),
                    vueExports.unref(showPercentFee) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                      key: 3,
                      label: "Phí theo % giá trị đơn",
                      name: "percent_fee_per_order"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).percent_fee_per_order,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).percent_fee_per_order = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: 0,
                          max: 100,
                          step: 0.1,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: vueExports.unref(apiErrors).percent_fee_per_order
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true)
                  ])) : vueExports.createCommentVNode("", true)
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Cung cấp dịch vụ & ghi chú" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><div class="font-medium text-slate-900 text-sm"${_scopeId}> Cung cấp dịch vụ nền tảng </div><div class="text-sm text-slate-500"${_scopeId}> Bật/tắt việc nền tảng cung cấp dịch vụ cho dự án này. </div></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
                modelValue: vueExports.unref(formState).platform_service_enabled,
                "onUpdate:modelValue": ($event) => vueExports.unref(formState).platform_service_enabled = $event
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Ghi chú nội bộ",
                name: "notes",
                help: "Ghi chú cho đội vận hành platform — cư dân/tenant không nhìn thấy.",
                class: "mt-5"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).notes,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).notes = $event,
                      rows: 3,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).notes
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(formState).notes,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).notes = $event,
                        rows: 3,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: vueExports.unref(apiErrors).notes
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex justify-end mt-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-save",
                label: "Lưu cấu hình",
                loading: vueExports.unref(isSaving),
                onClick: handleSave
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("div", { class: "font-medium text-slate-900 text-sm" }, " Cung cấp dịch vụ nền tảng "),
                    vueExports.createVNode("div", { class: "text-sm text-slate-500" }, " Bật/tắt việc nền tảng cung cấp dịch vụ cho dự án này. ")
                  ]),
                  vueExports.createVNode(_component_USwitch, {
                    modelValue: vueExports.unref(formState).platform_service_enabled,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).platform_service_enabled = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ghi chú nội bộ",
                  name: "notes",
                  help: "Ghi chú cho đội vận hành platform — cư dân/tenant không nhìn thấy.",
                  class: "mt-5"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).notes,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).notes = $event,
                      rows: 3,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).notes
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode("div", { class: "flex justify-end mt-5" }, [
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-save",
                    label: "Lưu cấu hình",
                    loading: vueExports.unref(isSaving),
                    onClick: handleSave
                  }, null, 8, ["loading"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/platform-project/PlatformProjectFeeConfigTab.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main$1, { __name: "PlatformProjectFeeConfigTab" });
const LIST_ROUTE = "/platform/quan-ly-van-hanh/du-an-tren-nen-tang";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter();
    const projectId = vueExports.computed(() => Number(route.params.id));
    const tenantId = vueExports.computed(() => String(route.query.tenant ?? ""));
    const { data, status, error } = usePlatformProjectDetail(tenantId, projectId);
    const project = vueExports.computed(() => data.value?.data ?? null);
    useSeoMeta({
      title: vueExports.computed(() => project.value ? `${project.value.name} - Dự án trên nền tảng` : "Chi tiết dự án")
    });
    const notFound = vueExports.computed(() => {
      if (!tenantId.value) return true;
      if (!error.value) return false;
      return getApiErrorStatus(error.value) === 404;
    });
    const tabIds = ["info", "orders", "vendors", "config"];
    const tabItems = [
      { value: "info", label: "Thông tin chung", icon: "i-lucide-info" },
      { value: "orders", label: "Đơn hàng", icon: "i-lucide-shopping-cart" },
      { value: "vendors", label: "Vendor", icon: "i-lucide-store" },
      { value: "config", label: "Cấu hình", icon: "i-lucide-settings" }
    ];
    const activeTab = vueExports.ref(
      tabIds.includes(route.query.tab) ? route.query.tab : "info"
    );
    vueExports.watch(activeTab, (v) => {
      router.replace({ query: { ...route.query, tab: v === "info" ? void 0 : v } });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$6;
      const _component_UBadge = _sfc_main$7;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_TenantBusinessSummaryCard = __nuxt_component_5;
      const _component_TenantResidentRatingsCard = __nuxt_component_6;
      const _component_UTabs = _sfc_main$8;
      const _component_PlatformProjectInfoTab = __nuxt_component_8$1;
      const _component_PlatformProjectOrdersTab = __nuxt_component_9;
      const _component_PlatformProjectVendorTab = __nuxt_component_10;
      const _component_PlatformProjectFeeConfigTab = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(project) && !vueExports.unref(notFound)) {
        _push(`<div class="flex flex-col gap-4"><div class="h-24 bg-slate-100 rounded-xl animate-pulse"></div><div class="h-48 bg-slate-100 rounded-xl animate-pulse"></div></div>`);
      } else if (vueExports.unref(notFound)) {
        _push(`<div class="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-folder-x",
          class: "size-12 text-slate-300 mx-auto"
        }, null, _parent));
        _push(`<h2 class="mt-4 text-lg font-semibold text-slate-900"> Không tìm thấy dự án </h2><p class="mt-1 text-sm text-slate-500"> Dự án không tồn tại, đã bị xoá, hoặc liên kết truy cập không hợp lệ. </p>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-arrow-left",
          label: "Quay về danh sách",
          class: "mt-5",
          to: LIST_ROUTE
        }, null, _parent));
        _push(`</div>`);
      } else if (vueExports.unref(error) && !vueExports.unref(project)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-circle",
          description: "Không tải được thông tin dự án."
        }, null, _parent));
      } else if (vueExports.unref(project)) {
        _push(`<div class="flex flex-col gap-6"><div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-arrow-left",
          label: "Danh sách dự án trên nền tảng",
          color: "neutral",
          variant: "ghost",
          size: "xs",
          to: LIST_ROUTE,
          class: "mb-3"
        }, null, _parent));
        _push(`<div class="flex flex-wrap items-start justify-between gap-4"><div class="flex items-start gap-4 min-w-0 flex-1"><div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-folder-kanban",
          class: "size-6 text-primary-600"
        }, null, _parent));
        _push(`</div><div class="min-w-0"><div class="flex items-center gap-3 flex-wrap"><h1 class="text-xl font-bold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).name)}</h1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          color: vueExports.unref(project).status.value === "managing" ? "success" : "neutral",
          variant: "subtle",
          label: vueExports.unref(project).status.label
        }, null, _parent));
        _push(`</div><div class="mt-1 flex items-center gap-2 text-sm text-slate-500"><span class="font-mono">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).code)}</span><span>·</span>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
          to: `/platform/tenants/${vueExports.unref(project).tenant.id}`,
          class: "hover:text-primary-600 hover:underline"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).tenant.code)}</span> — ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).tenant.name)}`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(project).tenant.code), 1),
                vueExports.createTextVNode(" — " + vueExports.toDisplayString(vueExports.unref(project).tenant.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantBusinessSummaryCard, {
          "tenant-id": vueExports.unref(tenantId),
          "project-id": vueExports.unref(projectId)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantResidentRatingsCard, {
          "tenant-id": vueExports.unref(tenantId),
          "project-id": vueExports.unref(projectId)
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
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformProjectInfoTab, { project: vueExports.unref(project) }, null, _parent));
        } else if (vueExports.unref(activeTab) === "orders") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformProjectOrdersTab, {
            "tenant-id": vueExports.unref(tenantId),
            "project-id": vueExports.unref(projectId)
          }, null, _parent));
        } else if (vueExports.unref(activeTab) === "vendors") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformProjectVendorTab, {
            "tenant-id": vueExports.unref(tenantId),
            "project-id": vueExports.unref(projectId)
          }, null, _parent));
        } else if (vueExports.unref(activeTab) === "config") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformProjectFeeConfigTab, {
            "tenant-id": vueExports.unref(tenantId),
            "project-id": vueExports.unref(projectId)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/quan-ly-van-hanh/du-an-tren-nen-tang/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CIg3HJgF.mjs.map
