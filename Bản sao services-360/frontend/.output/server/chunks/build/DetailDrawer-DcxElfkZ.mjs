import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { _ as _sfc_main$3 } from './Drawer-D5sl7aXR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as __nuxt_component_8, a as __nuxt_component_6 } from './CommissionBreakdown-BKSDhXYk.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { b as usePlatformVendorOrderDetail, c as useVendorOrderDetail } from './useVendorOrders-DqEI_vYD.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SummaryCard",
  __ssrInlineRender: true,
  props: {
    summary: {},
    loading: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const kpis = vueExports.computed(() => {
      const s = props.summary;
      return [
        {
          key: "count",
          label: "Số đơn thành công",
          value: s?.orders_count ?? 0,
          format: "number"
        },
        {
          key: "revenue",
          label: "Tổng doanh thu vendor",
          value: s?.revenue_total ?? 0,
          format: "currency"
        },
        {
          key: "commission",
          label: "Tổng hoa hồng PMC",
          value: s?.commission_total ?? 0,
          format: "currency"
        },
        {
          key: "average",
          label: "TB hoa hồng / đơn",
          value: s?.average_commission_per_order ?? 0,
          format: "currency"
        }
      ];
    });
    const warnings = vueExports.computed(() => props.summary?.warnings ?? null);
    function fmt(v, kind) {
      if (kind === "number") return String(v);
      return formatCurrency(v);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$2;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-3" }, _attrs))}><div class="grid grid-cols-2 md:grid-cols-4 gap-3"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(kpis), (k) => {
        _push(`<div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><p class="text-xs text-slate-500 mb-1">${serverRenderer_cjs_prodExports.ssrInterpolate(k.label)}</p>`);
        if (__props.loading) {
          _push(`<p class="h-7 bg-slate-100 rounded animate-pulse"></p>`);
        } else {
          _push(`<p class="text-xl font-bold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(fmt(k.value, k.format))}</p>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      if (vueExports.unref(warnings)?.schema_missing) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-octagon",
          title: "Vendor chưa active",
          description: "Vendor chưa được kích hoạt trên hệ thống marketplace. Liên hệ admin để provision."
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(warnings) && vueExports.unref(warnings).non_per_order_orders_count > 0) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "neutral",
          variant: "subtle",
          icon: "i-lucide-info",
          description: `${vueExports.unref(warnings).non_per_order_orders_count} đơn thuộc dự án dùng hợp đồng chia doanh thu / thuê bao — xem ở mục thống kê theo tháng (sắp ra mắt).`
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-order/SummaryCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "VendorOrderSummaryCard" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DetailDrawer",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    partnerId: {},
    orderId: {},
    scope: { default: "tenant" }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const orderIdRef = vueExports.computed(() => props.orderId);
    const { data, status, error, execute } = props.scope === "platform" ? usePlatformVendorOrderDetail(() => props.partnerId, orderIdRef) : useVendorOrderDetail(() => props.partnerId, orderIdRef);
    vueExports.watch(() => [props.open, props.orderId], async ([open, id]) => {
      if (open && id) {
        await execute();
      }
    }, { immediate: true });
    const order = vueExports.computed(() => data.value?.data ?? null);
    function close() {
      emit("update:open", false);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UDrawer = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_VendorOrderItemsTable = __nuxt_component_8;
      const _component_VendorOrderCommissionBreakdown = __nuxt_component_6;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UDrawer, vueExports.mergeProps({
        open: __props.open,
        direction: "right",
        "onUpdate:open": (v) => emit("update:open", v)
      }, _attrs), {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-screen max-w-2xl h-full flex flex-col bg-white"${_scopeId}><div class="flex items-center justify-between p-4 border-b border-slate-200"${_scopeId}><div class="flex items-center gap-3 flex-wrap"${_scopeId}><h2 class="text-lg font-bold text-slate-900 font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order)?.code ?? "Đang tải...")}</h2>`);
            if (vueExports.unref(order)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "success",
                variant: "subtle"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).status.label)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).status.label), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(order)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: vueExports.unref(order).payment_status.value === "paid" ? "success" : "neutral",
                variant: "outline"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).payment_status.label)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).payment_status.label), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-x",
              color: "neutral",
              variant: "ghost",
              "aria-label": "Đóng",
              onClick: close
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex-1 overflow-y-auto p-4 space-y-5"${_scopeId}>`);
            if (vueExports.unref(status) === "pending" && !vueExports.unref(order)) {
              _push2(`<div class="space-y-3"${_scopeId}><div class="h-20 bg-slate-100 rounded-xl animate-pulse"${_scopeId}></div><div class="h-40 bg-slate-100 rounded-xl animate-pulse"${_scopeId}></div><div class="h-32 bg-slate-100 rounded-xl animate-pulse"${_scopeId}></div></div>`);
            } else if (vueExports.unref(error) && !vueExports.unref(order)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "subtle",
                icon: "i-lucide-alert-circle",
                description: "Không thể tải chi tiết đơn hàng."
              }, null, _parent2, _scopeId));
            } else if (vueExports.unref(order)) {
              _push2(`<!--[-->`);
              if (__props.scope === "platform") {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                  title: "Phạm vi",
                  compact: ""
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId2}>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tenant (PMC)" }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            if (vueExports.unref(order).tenant?.name) {
                              _push4(`<span${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).tenant.name)}</span>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`<span class="text-xs text-slate-500 font-mono block"${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).tenant?.id ?? "—")}</span>`);
                          } else {
                            return [
                              vueExports.unref(order).tenant?.name ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(vueExports.unref(order).tenant.name), 1)) : vueExports.createCommentVNode("", true),
                              vueExports.createVNode("span", { class: "text-xs text-slate-500 font-mono block" }, vueExports.toDisplayString(vueExports.unref(order).tenant?.id ?? "—"), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Dự án" }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).project.name)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).project.name), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      return [
                        vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tenant (PMC)" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.unref(order).tenant?.name ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(vueExports.unref(order).tenant.name), 1)) : vueExports.createCommentVNode("", true),
                              vueExports.createVNode("span", { class: "text-xs text-slate-500 font-mono block" }, vueExports.toDisplayString(vueExports.unref(order).tenant?.id ?? "—"), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Dự án" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).project.name), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: "Khách hàng & Giao hàng",
                compact: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Họ tên" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).customer?.name ?? vueExports.unref(order).contact.name ?? "—")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.name ?? vueExports.unref(order).contact.name ?? "—"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "SĐT" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).customer?.phone ?? vueExports.unref(order).contact.phone ?? "—")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.phone ?? vueExports.unref(order).contact.phone ?? "—"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Email" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).customer?.email ?? vueExports.unref(order).contact.email ?? "—")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.email ?? vueExports.unref(order).contact.email ?? "—"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã căn hộ" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).contact.apartment_code ?? "—")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).contact.apartment_code ?? "—"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                      label: "Địa chỉ giao",
                      class: "sm:col-span-2"
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).contact.shipping_address ?? "—")}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).contact.shipping_address ?? "—"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Họ tên" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.name ?? vueExports.unref(order).contact.name ?? "—"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "SĐT" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.phone ?? vueExports.unref(order).contact.phone ?? "—"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Email" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.email ?? vueExports.unref(order).contact.email ?? "—"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã căn hộ" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).contact.apartment_code ?? "—"), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_SharedFieldDisplay, {
                          label: "Địa chỉ giao",
                          class: "sm:col-span-2"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).contact.shipping_address ?? "—"), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: "Sản phẩm",
                compact: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderItemsTable, {
                      items: vueExports.unref(order).items
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_VendorOrderItemsTable, {
                        items: vueExports.unref(order).items
                      }, null, 8, ["items"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: "Tổng kết",
                compact: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<dl class="text-sm space-y-1"${_scopeId2}><div class="flex justify-between"${_scopeId2}><dt class="text-slate-600"${_scopeId2}> Tạm tính </dt><dd${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.subtotal))}</dd></div><div class="flex justify-between"${_scopeId2}><dt class="text-slate-600"${_scopeId2}> Phí ship </dt><dd${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.shipping_fee))}</dd></div>`);
                    if (vueExports.unref(order).amounts.deposit_total > 0) {
                      _push3(`<div class="flex justify-between"${_scopeId2}><dt class="text-slate-600"${_scopeId2}> Đặt cọc </dt><dd${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.deposit_total))}</dd></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (vueExports.unref(order).amounts.discount_total > 0) {
                      _push3(`<div class="flex justify-between text-error-600"${_scopeId2}><dt${_scopeId2}>Giảm giá</dt><dd${_scopeId2}>-${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.discount_total))}</dd></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<div class="border-t border-slate-200 pt-2 mt-2 flex justify-between text-base"${_scopeId2}><dt class="font-semibold"${_scopeId2}> TỔNG </dt><dd class="font-bold text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.total))} `);
                    if (vueExports.unref(order).amounts.total_overridden) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        color: "warning",
                        variant: "subtle",
                        size: "sm",
                        class: "ml-2"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(` Đã điều chỉnh tay `);
                          } else {
                            return [
                              vueExports.createTextVNode(" Đã điều chỉnh tay ")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</dd></div></dl>`);
                  } else {
                    return [
                      vueExports.createVNode("dl", { class: "text-sm space-y-1" }, [
                        vueExports.createVNode("div", { class: "flex justify-between" }, [
                          vueExports.createVNode("dt", { class: "text-slate-600" }, " Tạm tính "),
                          vueExports.createVNode("dd", null, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.subtotal)), 1)
                        ]),
                        vueExports.createVNode("div", { class: "flex justify-between" }, [
                          vueExports.createVNode("dt", { class: "text-slate-600" }, " Phí ship "),
                          vueExports.createVNode("dd", null, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.shipping_fee)), 1)
                        ]),
                        vueExports.unref(order).amounts.deposit_total > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 0,
                          class: "flex justify-between"
                        }, [
                          vueExports.createVNode("dt", { class: "text-slate-600" }, " Đặt cọc "),
                          vueExports.createVNode("dd", null, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.deposit_total)), 1)
                        ])) : vueExports.createCommentVNode("", true),
                        vueExports.unref(order).amounts.discount_total > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 1,
                          class: "flex justify-between text-error-600"
                        }, [
                          vueExports.createVNode("dt", null, "Giảm giá"),
                          vueExports.createVNode("dd", null, "-" + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.discount_total)), 1)
                        ])) : vueExports.createCommentVNode("", true),
                        vueExports.createVNode("div", { class: "border-t border-slate-200 pt-2 mt-2 flex justify-between text-base" }, [
                          vueExports.createVNode("dt", { class: "font-semibold" }, " TỔNG "),
                          vueExports.createVNode("dd", { class: "font-bold text-slate-900" }, [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.total)) + " ", 1),
                            vueExports.unref(order).amounts.total_overridden ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                              key: 0,
                              color: "warning",
                              variant: "subtle",
                              size: "sm",
                              class: "ml-2"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(" Đã điều chỉnh tay ")
                              ]),
                              _: 1
                            })) : vueExports.createCommentVNode("", true)
                          ])
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: "Hoa hồng PMC",
                compact: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderCommissionBreakdown, {
                      commission: vueExports.unref(order).commission,
                      "vendor-id": props.partnerId,
                      "project-id": vueExports.unref(order).project.id,
                      scope: __props.scope
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_VendorOrderCommissionBreakdown, {
                        commission: vueExports.unref(order).commission,
                        "vendor-id": props.partnerId,
                        "project-id": vueExports.unref(order).project.id,
                        scope: __props.scope
                      }, null, 8, ["commission", "vendor-id", "project-id", "scope"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: "Lịch sử trạng thái",
                compact: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<ul class="text-sm space-y-1"${_scopeId2}>`);
                    if (vueExports.unref(order).timeline.ordered_at) {
                      _push3(`<li class="flex justify-between"${_scopeId2}><span class="text-slate-600"${_scopeId2}>Đặt đơn</span><span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.ordered_at))}</span></li>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (vueExports.unref(order).timeline.confirmed_at) {
                      _push3(`<li class="flex justify-between"${_scopeId2}><span class="text-slate-600"${_scopeId2}>Xác nhận</span><span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.confirmed_at))}</span></li>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (vueExports.unref(order).timeline.completed_at) {
                      _push3(`<li class="flex justify-between font-medium text-success-700"${_scopeId2}><span${_scopeId2}>Hoàn thành</span><span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.completed_at))}</span></li>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</ul>`);
                  } else {
                    return [
                      vueExports.createVNode("ul", { class: "text-sm space-y-1" }, [
                        vueExports.unref(order).timeline.ordered_at ? (vueExports.openBlock(), vueExports.createBlock("li", {
                          key: 0,
                          class: "flex justify-between"
                        }, [
                          vueExports.createVNode("span", { class: "text-slate-600" }, "Đặt đơn"),
                          vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.ordered_at)), 1)
                        ])) : vueExports.createCommentVNode("", true),
                        vueExports.unref(order).timeline.confirmed_at ? (vueExports.openBlock(), vueExports.createBlock("li", {
                          key: 1,
                          class: "flex justify-between"
                        }, [
                          vueExports.createVNode("span", { class: "text-slate-600" }, "Xác nhận"),
                          vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.confirmed_at)), 1)
                        ])) : vueExports.createCommentVNode("", true),
                        vueExports.unref(order).timeline.completed_at ? (vueExports.openBlock(), vueExports.createBlock("li", {
                          key: 2,
                          class: "flex justify-between font-medium text-success-700"
                        }, [
                          vueExports.createVNode("span", null, "Hoàn thành"),
                          vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.completed_at)), 1)
                        ])) : vueExports.createCommentVNode("", true)
                      ])
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
              vueExports.createVNode("div", { class: "w-screen max-w-2xl h-full flex flex-col bg-white" }, [
                vueExports.createVNode("div", { class: "flex items-center justify-between p-4 border-b border-slate-200" }, [
                  vueExports.createVNode("div", { class: "flex items-center gap-3 flex-wrap" }, [
                    vueExports.createVNode("h2", { class: "text-lg font-bold text-slate-900 font-mono" }, vueExports.toDisplayString(vueExports.unref(order)?.code ?? "Đang tải..."), 1),
                    vueExports.unref(order) ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      color: "success",
                      variant: "subtle"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).status.label), 1)
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true),
                    vueExports.unref(order) ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 1,
                      color: vueExports.unref(order).payment_status.value === "paid" ? "success" : "neutral",
                      variant: "outline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).payment_status.label), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-x",
                    color: "neutral",
                    variant: "ghost",
                    "aria-label": "Đóng",
                    onClick: close
                  })
                ]),
                vueExports.createVNode("div", { class: "flex-1 overflow-y-auto p-4 space-y-5" }, [
                  vueExports.unref(status) === "pending" && !vueExports.unref(order) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "space-y-3"
                  }, [
                    vueExports.createVNode("div", { class: "h-20 bg-slate-100 rounded-xl animate-pulse" }),
                    vueExports.createVNode("div", { class: "h-40 bg-slate-100 rounded-xl animate-pulse" }),
                    vueExports.createVNode("div", { class: "h-32 bg-slate-100 rounded-xl animate-pulse" })
                  ])) : vueExports.unref(error) && !vueExports.unref(order) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 1,
                    color: "error",
                    variant: "subtle",
                    icon: "i-lucide-alert-circle",
                    description: "Không thể tải chi tiết đơn hàng."
                  })) : vueExports.unref(order) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                    __props.scope === "platform" ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedSectionCard, {
                      key: 0,
                      title: "Phạm vi",
                      compact: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tenant (PMC)" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.unref(order).tenant?.name ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(vueExports.unref(order).tenant.name), 1)) : vueExports.createCommentVNode("", true),
                              vueExports.createVNode("span", { class: "text-xs text-slate-500 font-mono block" }, vueExports.toDisplayString(vueExports.unref(order).tenant?.id ?? "—"), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Dự án" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).project.name), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true),
                    vueExports.createVNode(_component_SharedSectionCard, {
                      title: "Khách hàng & Giao hàng",
                      compact: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Họ tên" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.name ?? vueExports.unref(order).contact.name ?? "—"), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "SĐT" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.phone ?? vueExports.unref(order).contact.phone ?? "—"), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Email" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.email ?? vueExports.unref(order).contact.email ?? "—"), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã căn hộ" }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).contact.apartment_code ?? "—"), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_SharedFieldDisplay, {
                            label: "Địa chỉ giao",
                            class: "sm:col-span-2"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).contact.shipping_address ?? "—"), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedSectionCard, {
                      title: "Sản phẩm",
                      compact: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_VendorOrderItemsTable, {
                          items: vueExports.unref(order).items
                        }, null, 8, ["items"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedSectionCard, {
                      title: "Tổng kết",
                      compact: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("dl", { class: "text-sm space-y-1" }, [
                          vueExports.createVNode("div", { class: "flex justify-between" }, [
                            vueExports.createVNode("dt", { class: "text-slate-600" }, " Tạm tính "),
                            vueExports.createVNode("dd", null, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.subtotal)), 1)
                          ]),
                          vueExports.createVNode("div", { class: "flex justify-between" }, [
                            vueExports.createVNode("dt", { class: "text-slate-600" }, " Phí ship "),
                            vueExports.createVNode("dd", null, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.shipping_fee)), 1)
                          ]),
                          vueExports.unref(order).amounts.deposit_total > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 0,
                            class: "flex justify-between"
                          }, [
                            vueExports.createVNode("dt", { class: "text-slate-600" }, " Đặt cọc "),
                            vueExports.createVNode("dd", null, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.deposit_total)), 1)
                          ])) : vueExports.createCommentVNode("", true),
                          vueExports.unref(order).amounts.discount_total > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 1,
                            class: "flex justify-between text-error-600"
                          }, [
                            vueExports.createVNode("dt", null, "Giảm giá"),
                            vueExports.createVNode("dd", null, "-" + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.discount_total)), 1)
                          ])) : vueExports.createCommentVNode("", true),
                          vueExports.createVNode("div", { class: "border-t border-slate-200 pt-2 mt-2 flex justify-between text-base" }, [
                            vueExports.createVNode("dt", { class: "font-semibold" }, " TỔNG "),
                            vueExports.createVNode("dd", { class: "font-bold text-slate-900" }, [
                              vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.total)) + " ", 1),
                              vueExports.unref(order).amounts.total_overridden ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                                key: 0,
                                color: "warning",
                                variant: "subtle",
                                size: "sm",
                                class: "ml-2"
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.createTextVNode(" Đã điều chỉnh tay ")
                                ]),
                                _: 1
                              })) : vueExports.createCommentVNode("", true)
                            ])
                          ])
                        ])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedSectionCard, {
                      title: "Hoa hồng PMC",
                      compact: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_VendorOrderCommissionBreakdown, {
                          commission: vueExports.unref(order).commission,
                          "vendor-id": props.partnerId,
                          "project-id": vueExports.unref(order).project.id,
                          scope: __props.scope
                        }, null, 8, ["commission", "vendor-id", "project-id", "scope"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_SharedSectionCard, {
                      title: "Lịch sử trạng thái",
                      compact: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("ul", { class: "text-sm space-y-1" }, [
                          vueExports.unref(order).timeline.ordered_at ? (vueExports.openBlock(), vueExports.createBlock("li", {
                            key: 0,
                            class: "flex justify-between"
                          }, [
                            vueExports.createVNode("span", { class: "text-slate-600" }, "Đặt đơn"),
                            vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.ordered_at)), 1)
                          ])) : vueExports.createCommentVNode("", true),
                          vueExports.unref(order).timeline.confirmed_at ? (vueExports.openBlock(), vueExports.createBlock("li", {
                            key: 1,
                            class: "flex justify-between"
                          }, [
                            vueExports.createVNode("span", { class: "text-slate-600" }, "Xác nhận"),
                            vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.confirmed_at)), 1)
                          ])) : vueExports.createCommentVNode("", true),
                          vueExports.unref(order).timeline.completed_at ? (vueExports.openBlock(), vueExports.createBlock("li", {
                            key: 2,
                            class: "flex justify-between font-medium text-success-700"
                          }, [
                            vueExports.createVNode("span", null, "Hoàn thành"),
                            vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.completed_at)), 1)
                          ])) : vueExports.createCommentVNode("", true)
                        ])
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
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-order/DetailDrawer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main, { __name: "VendorOrderDetailDrawer" });

export { __nuxt_component_0 as _, __nuxt_component_7 as a };
//# sourceMappingURL=DetailDrawer-DcxElfkZ.mjs.map
