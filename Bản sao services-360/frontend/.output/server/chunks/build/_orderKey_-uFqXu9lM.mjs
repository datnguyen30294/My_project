import { v as vueExports, p as useRoute$1, u as useSeoMeta, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$3 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$4 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { a as __nuxt_component_6, _ as __nuxt_component_8 } from './CommissionBreakdown-BKSDhXYk.mjs';
import { _ as _sfc_main$5 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$6 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$7 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$8 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$9 } from './Textarea-DTCNHwKm.mjs';
import { b as usePlatformVendorOrderDetail, i as vendorOrderTypeOption, v as vendorOrderStatusColor, r as revenueRecipientColor, j as apiRemoveVendorOrderCommission, f as VENDOR_ORDER_STATUS_OPTIONS, k as apiUpdateVendorOrderStatus, l as apiAssignVendorOrderCommission } from './useVendorOrders-DqEI_vYD.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { _ as _sfc_main$a } from './SelectMenu-DKHEMZj7.mjs';
import { _ as __nuxt_component_5$1 } from './NumberInput-BfLKWOCC.mjs';
import { _ as _sfc_main$b } from './Input-JXN8po_F.mjs';
import { y as usePlatformContractList, R as REVENUE_RECIPIENT_OPTIONS } from './usePartnerCommissionContracts-DUXun7gY.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
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
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './index-CSThDD3J.mjs';

const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StatusChangeModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    partnerId: {},
    orderId: {},
    currentStatus: {}
  },
  emits: ["update:open", "updated"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const status = vueExports.ref(props.currentStatus);
    const reason = vueExports.ref("");
    const submitting = vueExports.ref(false);
    const statusItems = vueExports.computed(
      () => VENDOR_ORDER_STATUS_OPTIONS.map((s) => ({ label: s.label, value: s.value }))
    );
    vueExports.watch(() => props.open, (open) => {
      if (open) {
        status.value = props.currentStatus;
        reason.value = "";
      }
    });
    const isUnchanged = vueExports.computed(() => status.value === props.currentStatus);
    const showCommissionWarning = vueExports.computed(
      () => status.value === "completed" || props.currentStatus === "completed"
    );
    async function submit() {
      if (isUnchanged.value) return;
      submitting.value = true;
      try {
        const res = await apiUpdateVendorOrderStatus(props.partnerId, props.orderId, {
          status: status.value,
          reason: reason.value || null
        });
        toast.add({ title: "Đã cập nhật trạng thái đơn", color: "success", icon: "i-lucide-check-circle" });
        emit("updated", res.data);
        emit("update:open", false);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Cập nhật trạng thái thất bại"), color: "error", icon: "i-lucide-alert-circle" });
      } finally {
        submitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$5;
      const _component_UFormField = _sfc_main$6;
      const _component_USelect = _sfc_main$7;
      const _component_UAlert = _sfc_main$8;
      const _component_UTextarea = _sfc_main$9;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Đổi trạng thái đơn",
        description: "Cập nhật trạng thái đơn vendor. Lệnh được ghi sang resi_mart (chủ sở hữu đơn).",
        "onUpdate:open": (v) => emit("update:open", v)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Trạng thái mới" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(status),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(status) ? status.value = $event : null,
                    items: vueExports.unref(statusItems),
                    "value-key": "value",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(status),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(status) ? status.value = $event : null,
                      items: vueExports.unref(statusItems),
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(showCommissionWarning)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "warning",
                variant: "subtle",
                icon: "i-lucide-triangle-alert",
                title: "Ảnh hưởng hoa hồng",
                description: "Hoa hồng chỉ tính cho đơn ở trạng thái Hoàn thành. Đổi sang/khỏi Hoàn thành sẽ làm hoa hồng bắt đầu hoặc ngừng áp dụng cho đơn này."
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Lý do",
              hint: "Tuỳ chọn"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(reason),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(reason) ? reason.value = $event : null,
                    rows: 2,
                    placeholder: "Lý do đổi trạng thái...",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(reason),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(reason) ? reason.value = $event : null,
                      rows: 2,
                      placeholder: "Lý do đổi trạng thái...",
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
                vueExports.createVNode(_component_UFormField, { label: "Trạng thái mới" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(status),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(status) ? status.value = $event : null,
                      items: vueExports.unref(statusItems),
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ]),
                  _: 1
                }),
                vueExports.unref(showCommissionWarning) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "warning",
                  variant: "subtle",
                  icon: "i-lucide-triangle-alert",
                  title: "Ảnh hưởng hoa hồng",
                  description: "Hoa hồng chỉ tính cho đơn ở trạng thái Hoàn thành. Đổi sang/khỏi Hoàn thành sẽ làm hoa hồng bắt đầu hoặc ngừng áp dụng cho đơn này."
                })) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UFormField, {
                  label: "Lý do",
                  hint: "Tuỳ chọn"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(reason),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(reason) ? reason.value = $event : null,
                      rows: 2,
                      placeholder: "Lý do đổi trạng thái...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "ghost",
              label: "Huỷ",
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "primary",
              label: "Lưu trạng thái",
              icon: "i-lucide-save",
              loading: vueExports.unref(submitting),
              disabled: vueExports.unref(isUnchanged),
              onClick: submit
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "ghost",
                  label: "Huỷ",
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "primary",
                  label: "Lưu trạng thái",
                  icon: "i-lucide-save",
                  loading: vueExports.unref(submitting),
                  disabled: vueExports.unref(isUnchanged),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-order/StatusChangeModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$2, { __name: "VendorOrderStatusChangeModal" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "CommissionAssignModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    partnerId: {},
    orderId: {},
    commission: { default: null }
  },
  emits: ["update:open", "assigned"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const source = vueExports.ref("manual");
    const contractId = vueExports.ref(void 0);
    const fixed = vueExports.ref(0);
    const percent = vueExports.ref(0);
    const recipient = vueExports.ref("platform");
    const note = vueExports.ref("");
    const submitting = vueExports.ref(false);
    const sourceItems = [
      { label: "Nhập thủ công (tiền cứng / %)", value: "manual" },
      { label: "Sao chép từ hợp đồng có sẵn", value: "contract" }
    ];
    const { data: contractsData, status: contractsStatus } = usePlatformContractList(
      vueExports.computed(() => ({
        partner_id: Number(props.partnerId),
        commission_mode: "per_order",
        per_page: SELECT_ALL_PER_PAGE
      }))
    );
    const contractItems = vueExports.computed(
      () => (contractsData.value?.data ?? []).map((c) => ({
        label: `${c.contract_code} · ${c.revenue_recipient.label}`,
        value: c.id
      }))
    );
    function resetForm() {
      const f = props.commission?.formula;
      source.value = "manual";
      contractId.value = void 0;
      fixed.value = f ? f.fixed : 0;
      percent.value = f ? f.percent : 0;
      recipient.value = props.commission?.revenue_recipient?.value ?? "platform";
      note.value = "";
    }
    vueExports.watch(() => props.open, (open) => {
      if (open) resetForm();
    });
    const canSubmit = vueExports.computed(() => {
      if (source.value === "contract") return contractId.value !== void 0;
      return percent.value >= 0 && percent.value <= 100 && fixed.value >= 0;
    });
    async function submit() {
      if (!canSubmit.value) return;
      submitting.value = true;
      const payload = source.value === "contract" ? { source: "contract", contract_id: contractId.value, note: note.value || null } : {
        source: "manual",
        fixed: Number(fixed.value),
        percent: Number(percent.value),
        revenue_recipient: recipient.value,
        note: note.value || null
      };
      try {
        const res = await apiAssignVendorOrderCommission(props.partnerId, props.orderId, payload);
        toast.add({ title: "Đã gán hoa hồng cho đơn", color: "success", icon: "i-lucide-check-circle" });
        emit("assigned", res.data);
        emit("update:open", false);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Gán hoa hồng thất bại"), color: "error", icon: "i-lucide-alert-circle" });
      } finally {
        submitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$5;
      const _component_UFormField = _sfc_main$6;
      const _component_USelect = _sfc_main$7;
      const _component_USelectMenu = _sfc_main$a;
      const _component_UAlert = _sfc_main$8;
      const _component_SharedNumberInput = __nuxt_component_5$1;
      const _component_UInput = _sfc_main$b;
      const _component_UTextarea = _sfc_main$9;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Gán hoa hồng cho đơn",
        description: "Đơn đã hoàn thành nhưng chưa có hợp đồng hoa hồng áp dụng. Gán thủ công để tính hoa hồng cho đơn này.",
        "onUpdate:open": (v) => emit("update:open", v)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Nguồn hoa hồng" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(source),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(source) ? source.value = $event : null,
                    items: sourceItems,
                    "value-key": "value",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(source),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(source) ? source.value = $event : null,
                      items: sourceItems,
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(source) === "contract") {
              _push2(`<!--[-->`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Hợp đồng (per_order)",
                help: "Sao chép điều khoản & bên nhận từ hợp đồng đã chọn."
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                      modelValue: vueExports.unref(contractId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(contractId) ? contractId.value = $event : null,
                      items: vueExports.unref(contractItems),
                      "value-key": "value",
                      loading: vueExports.unref(contractsStatus) === "pending",
                      searchable: "",
                      placeholder: "Chọn hợp đồng",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USelectMenu, {
                        modelValue: vueExports.unref(contractId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(contractId) ? contractId.value = $event : null,
                        items: vueExports.unref(contractItems),
                        "value-key": "value",
                        loading: vueExports.unref(contractsStatus) === "pending",
                        searchable: "",
                        placeholder: "Chọn hợp đồng",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(contractsStatus) !== "pending" && vueExports.unref(contractItems).length === 0) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "warning",
                  variant: "subtle",
                  icon: "i-lucide-alert-triangle",
                  description: "Vendor này chưa có hợp đồng per_order nào. Hãy nhập thủ công."
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(`<!--[--><div class="grid grid-cols-2 gap-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tiền cứng (VND)" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(fixed),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(fixed) ? fixed.value = $event : null,
                      min: 0,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(fixed),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(fixed) ? fixed.value = $event : null,
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Phần trăm (%)" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(percent),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(percent) ? percent.value = $event : null,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 0,
                      max: 100,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(percent),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(percent) ? percent.value = $event : null,
                        modelModifiers: { number: true },
                        type: "number",
                        min: 0,
                        max: 100,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Hoa hồng thuộc về" }, {
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
              _push2(`<!--]-->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ghi chú",
              hint: "Tuỳ chọn"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(note),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(note) ? note.value = $event : null,
                    rows: 2,
                    placeholder: "Lý do gán hoa hồng thủ công...",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(note),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(note) ? note.value = $event : null,
                      rows: 2,
                      placeholder: "Lý do gán hoa hồng thủ công...",
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
                vueExports.createVNode(_component_UFormField, { label: "Nguồn hoa hồng" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(source),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(source) ? source.value = $event : null,
                      items: sourceItems,
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                vueExports.unref(source) === "contract" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Hợp đồng (per_order)",
                    help: "Sao chép điều khoản & bên nhận từ hợp đồng đã chọn."
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_USelectMenu, {
                        modelValue: vueExports.unref(contractId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(contractId) ? contractId.value = $event : null,
                        items: vueExports.unref(contractItems),
                        "value-key": "value",
                        loading: vueExports.unref(contractsStatus) === "pending",
                        searchable: "",
                        placeholder: "Chọn hợp đồng",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"])
                    ]),
                    _: 1
                  }),
                  vueExports.unref(contractsStatus) !== "pending" && vueExports.unref(contractItems).length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 0,
                    color: "warning",
                    variant: "subtle",
                    icon: "i-lucide-alert-triangle",
                    description: "Vendor này chưa có hợp đồng per_order nào. Hãy nhập thủ công."
                  })) : vueExports.createCommentVNode("", true)
                ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                    vueExports.createVNode(_component_UFormField, { label: "Tiền cứng (VND)" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_SharedNumberInput, {
                          modelValue: vueExports.unref(fixed),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(fixed) ? fixed.value = $event : null,
                          min: 0,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_UFormField, { label: "Phần trăm (%)" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(percent),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(percent) ? percent.value = $event : null,
                          modelModifiers: { number: true },
                          type: "number",
                          min: 0,
                          max: 100,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  vueExports.createVNode(_component_UFormField, { label: "Hoa hồng thuộc về" }, {
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
                  })
                ], 64)),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ghi chú",
                  hint: "Tuỳ chọn"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(note),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(note) ? note.value = $event : null,
                      rows: 2,
                      placeholder: "Lý do gán hoa hồng thủ công...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "ghost",
              label: "Huỷ",
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "primary",
              label: "Lưu hoa hồng",
              icon: "i-lucide-hand-coins",
              loading: vueExports.unref(submitting),
              disabled: !vueExports.unref(canSubmit),
              onClick: submit
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "ghost",
                  label: "Huỷ",
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "primary",
                  label: "Lưu hoa hồng",
                  icon: "i-lucide-hand-coins",
                  loading: vueExports.unref(submitting),
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-order/CommissionAssignModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main$1, { __name: "VendorOrderCommissionAssignModal" });
const LIST_PATH = "/platform/quan-ly-don-hang/don-hang-vendor";
const VENDOR_BASE = "/platform/quan-ly-van-hanh/quan-ly-vendor";
const PROJECT_BASE = "/platform/quan-ly-van-hanh/du-an-tren-nen-tang";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[orderKey]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const orderKey = vueExports.computed(() => String(route.params.orderKey ?? ""));
    const vendorId = vueExports.computed(() => Number(orderKey.value.split("-")[0] ?? 0));
    const orderId = vueExports.computed(() => Number(orderKey.value.split("-")[1] ?? 0));
    const { data, status, error, execute } = usePlatformVendorOrderDetail(vendorId, orderId);
    const order = vueExports.computed(() => data.value?.data ?? null);
    const orderType = vueExports.computed(() => order.value ? vendorOrderTypeOption(order.value.items) : null);
    const commission = vueExports.computed(() => order.value?.commission ?? null);
    const isDefault = vueExports.computed(() => commission.value?.source === "default");
    const recipient = vueExports.computed(() => commission.value && !isDefault.value ? commission.value.revenue_recipient : null);
    const isManual = vueExports.computed(() => commission.value?.is_manual === true);
    const canAssign = vueExports.computed(() => order.value?.status.value === "completed" && isDefault.value);
    const canChangeStatus = vueExports.computed(
      () => order.value != null && !["completed", "cancelled"].includes(order.value.status.value)
    );
    useSeoMeta({ title: () => `${order.value?.code ?? "Đơn hàng vendor"} - Thần Nông` });
    const toast = useToast();
    const assignOpen = vueExports.ref(false);
    const removeOpen = vueExports.ref(false);
    const removing = vueExports.ref(false);
    const statusOpen = vueExports.ref(false);
    async function onAssigned() {
      await execute();
    }
    async function onStatusUpdated() {
      await execute();
    }
    async function confirmRemove() {
      removing.value = true;
      try {
        await apiRemoveVendorOrderCommission(vendorId.value, orderId.value);
        toast.add({ title: "Đã gỡ hoa hồng gán thủ công", color: "success", icon: "i-lucide-check-circle" });
        removeOpen.value = false;
        await execute();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Gỡ hoa hồng thất bại"), color: "error", icon: "i-lucide-alert-circle" });
      } finally {
        removing.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$3;
      const _component_USkeleton = _sfc_main$4;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_VendorOrderCommissionBreakdown = __nuxt_component_6;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_VendorOrderItemsTable = __nuxt_component_8;
      const _component_VendorOrderStatusChangeModal = __nuxt_component_9;
      const _component_VendorOrderCommissionAssignModal = __nuxt_component_10;
      const _component_UModal = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-start justify-between gap-4 flex-wrap"><div class="flex items-center gap-3 flex-wrap">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: LIST_PATH,
        label: "Danh sách"
      }, null, _parent));
      if (vueExports.unref(order)) {
        _push(`<h1 class="text-2xl font-black text-slate-900 tracking-tight font-mono">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).code)}</h1>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(order) && vueExports.unref(orderType)) {
        _push(`<!--[-->`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          color: "neutral",
          variant: "subtle",
          label: vueExports.unref(orderType).label
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          color: vueExports.unref(vendorOrderStatusColor)(vueExports.unref(order).status.value),
          variant: "subtle",
          label: vueExports.unref(order).status.label
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(canChangeStatus)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-refresh-cw",
          label: "Đổi trạng thái",
          color: "neutral",
          variant: "outline",
          onClick: ($event) => statusOpen.value = true
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(order)) {
        _push(`<div class="space-y-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-32 w-full" }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-48 w-full" }, null, _parent));
        _push(`</div>`);
      } else if (vueExports.unref(error) || !vueExports.unref(order)) {
        _push(`<div class="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-package-x",
          class: "size-10 text-slate-300 mx-auto mb-3"
        }, null, _parent));
        _push(`<p class="text-slate-600 mb-4"> Không tìm thấy đơn hàng. </p>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-list",
          label: "Danh sách đơn",
          to: LIST_PATH
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-5">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hoa hồng",
          compact: ""
        }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (vueExports.unref(isManual)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  color: "warning",
                  variant: "subtle",
                  size: "sm",
                  icon: "i-lucide-hand-coins",
                  label: "Gán thủ công"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(canAssign)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-hand-coins",
                  label: "Gán hoa hồng",
                  size: "xs",
                  onClick: ($event) => assignOpen.value = true
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(isManual)) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-pencil",
                  label: "Sửa",
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  onClick: ($event) => assignOpen.value = true
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-trash-2",
                  color: "error",
                  variant: "ghost",
                  size: "xs",
                  "aria-label": "Gỡ hoa hồng",
                  onClick: ($event) => removeOpen.value = true
                }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                vueExports.unref(isManual) ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                  key: 0,
                  color: "warning",
                  variant: "subtle",
                  size: "sm",
                  icon: "i-lucide-hand-coins",
                  label: "Gán thủ công"
                })) : vueExports.createCommentVNode("", true),
                vueExports.unref(canAssign) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 1,
                  icon: "i-lucide-hand-coins",
                  label: "Gán hoa hồng",
                  size: "xs",
                  onClick: ($event) => assignOpen.value = true
                }, null, 8, ["onClick"])) : vueExports.createCommentVNode("", true),
                vueExports.unref(isManual) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-pencil",
                    label: "Sửa",
                    color: "neutral",
                    variant: "ghost",
                    size: "xs",
                    onClick: ($event) => assignOpen.value = true
                  }, null, 8, ["onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-trash-2",
                    color: "error",
                    variant: "ghost",
                    size: "xs",
                    "aria-label": "Gỡ hoa hồng",
                    onClick: ($event) => removeOpen.value = true
                  }, null, 8, ["onClick"])
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "GMV (tổng đơn)" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums font-semibold"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.total))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums font-semibold" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.total)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Hoa hồng" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(order).commission) {
                      _push3(`<span class="tabular-nums font-semibold text-primary-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).commission.amount))}</span>`);
                    } else {
                      _push3(`<span class="text-slate-500"${_scopeId2}>Không áp dụng</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(order).commission ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "tabular-nums font-semibold text-primary-700"
                      }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).commission.amount)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-500"
                      }, "Không áp dụng"))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Thuộc về" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(recipient)) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        color: vueExports.unref(revenueRecipientColor)(vueExports.unref(recipient).value),
                        variant: "subtle",
                        size: "sm",
                        label: vueExports.unref(recipient).label
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(recipient) ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 0,
                        color: vueExports.unref(revenueRecipientColor)(vueExports.unref(recipient).value),
                        variant: "subtle",
                        size: "sm",
                        label: vueExports.unref(recipient).label
                      }, null, 8, ["color", "label"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderCommissionBreakdown, {
                commission: vueExports.unref(order).commission,
                "vendor-id": vueExports.unref(vendorId),
                "project-id": vueExports.unref(order).project.id,
                scope: "platform"
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "GMV (tổng đơn)" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "tabular-nums font-semibold" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.total)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Hoa hồng" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(order).commission ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "tabular-nums font-semibold text-primary-700"
                      }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).commission.amount)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-500"
                      }, "Không áp dụng"))
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Thuộc về" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(recipient) ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: 0,
                        color: vueExports.unref(revenueRecipientColor)(vueExports.unref(recipient).value),
                        variant: "subtle",
                        size: "sm",
                        label: vueExports.unref(recipient).label
                      }, null, 8, ["color", "label"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ]),
                    _: 1
                  })
                ]),
                vueExports.createVNode(_component_VendorOrderCommissionBreakdown, {
                  commission: vueExports.unref(order).commission,
                  "vendor-id": vueExports.unref(vendorId),
                  "project-id": vueExports.unref(order).project.id,
                  scope: "platform"
                }, null, 8, ["commission", "vendor-id", "project-id"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Vendor & Dự án",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Vendor" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `${VENDOR_BASE}/${vueExports.unref(vendorId)}`,
                      class: "text-primary-700 hover:underline font-medium"
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Mở trang vendor `);
                        } else {
                          return [
                            vueExports.createTextVNode(" Mở trang vendor ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `${VENDOR_BASE}/${vueExports.unref(vendorId)}`,
                        class: "text-primary-700 hover:underline font-medium"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(" Mở trang vendor ")
                        ]),
                        _: 1
                      }, 8, ["to"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Dự án" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(order).project.id) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `${PROJECT_BASE}/${vueExports.unref(order).project.id}`,
                        class: "text-primary-700 hover:underline"
                      }, {
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
                    } else {
                      _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).project.name)}</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(order).project.id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `${PROJECT_BASE}/${vueExports.unref(order).project.id}`,
                        class: "text-primary-700 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).project.name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(order).project.name), 1))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Công ty VH" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(order).tenant?.name) {
                      _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).tenant.name)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<span class="text-xs text-slate-500 font-mono block"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).tenant?.id ?? "—")}</span>`);
                  } else {
                    return [
                      vueExports.unref(order).tenant?.name ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(vueExports.unref(order).tenant.name), 1)) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode("span", { class: "text-xs text-slate-500 font-mono block" }, vueExports.toDisplayString(vueExports.unref(order).tenant?.id ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-4" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Vendor" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `${VENDOR_BASE}/${vueExports.unref(vendorId)}`,
                        class: "text-primary-700 hover:underline font-medium"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(" Mở trang vendor ")
                        ]),
                        _: 1
                      }, 8, ["to"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Dự án" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(order).project.id ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `${PROJECT_BASE}/${vueExports.unref(order).project.id}`,
                        class: "text-primary-700 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).project.name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(order).project.name), 1))
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Công ty VH" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(order).tenant?.name ? (vueExports.openBlock(), vueExports.createBlock("span", { key: 0 }, vueExports.toDisplayString(vueExports.unref(order).tenant.name), 1)) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode("span", { class: "text-xs text-slate-500 font-mono block" }, vueExports.toDisplayString(vueExports.unref(order).tenant?.id ?? "—"), 1)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Khách hàng & Giao hàng",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Họ tên" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).customer?.name ?? vueExports.unref(order).contact.name ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.name ?? vueExports.unref(order).contact.name ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "SĐT" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).customer?.phone ?? vueExports.unref(order).contact.phone ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.phone ?? vueExports.unref(order).contact.phone ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Email" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).customer?.email ?? vueExports.unref(order).contact.email ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).customer?.email ?? vueExports.unref(order).contact.email ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã căn hộ" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).contact.apartment_code ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).contact.apartment_code ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                label: "Địa chỉ giao",
                class: "sm:col-span-2"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).contact.shipping_address ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).contact.shipping_address ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
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
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Dòng đơn",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderItemsTable, {
                items: vueExports.unref(order).items
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_VendorOrderItemsTable, {
                  items: vueExports.unref(order).items
                }, null, 8, ["items"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Thanh toán",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái thanh toán" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      color: vueExports.unref(order).payment_status.value === "paid" ? "success" : "neutral",
                      variant: "subtle",
                      size: "sm",
                      label: vueExports.unref(order).payment_status.label
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        color: vueExports.unref(order).payment_status.value === "paid" ? "success" : "neutral",
                        variant: "subtle",
                        size: "sm",
                        label: vueExports.unref(order).payment_status.label
                      }, null, 8, ["color", "label"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Phương thức" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(order).payment_method ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).payment_method ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><dl class="text-sm space-y-1"${_scopeId}><div class="flex justify-between"${_scopeId}><dt class="text-slate-600"${_scopeId}> Tạm tính </dt><dd class="tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.subtotal))}</dd></div><div class="flex justify-between"${_scopeId}><dt class="text-slate-600"${_scopeId}> Phí giao </dt><dd class="tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.shipping_fee))}</dd></div>`);
              if (vueExports.unref(order).amounts.deposit_total > 0) {
                _push2(`<div class="flex justify-between"${_scopeId}><dt class="text-slate-600"${_scopeId}> Đặt cọc </dt><dd class="tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.deposit_total))}</dd></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(order).amounts.discount_total > 0) {
                _push2(`<div class="flex justify-between text-error-600"${_scopeId}><dt${_scopeId}>Giảm giá</dt><dd class="tabular-nums"${_scopeId}> -${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.discount_total))}</dd></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="border-t border-slate-200 pt-2 mt-2 flex justify-between text-base"${_scopeId}><dt class="font-semibold"${_scopeId}> TỔNG </dt><dd class="font-bold text-slate-900 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.total))}</dd></div></dl>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái thanh toán" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        color: vueExports.unref(order).payment_status.value === "paid" ? "success" : "neutral",
                        variant: "subtle",
                        size: "sm",
                        label: vueExports.unref(order).payment_status.label
                      }, null, 8, ["color", "label"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Phương thức" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(order).payment_method ?? "—"), 1)
                    ]),
                    _: 1
                  })
                ]),
                vueExports.createVNode("dl", { class: "text-sm space-y-1" }, [
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("dt", { class: "text-slate-600" }, " Tạm tính "),
                    vueExports.createVNode("dd", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.subtotal)), 1)
                  ]),
                  vueExports.createVNode("div", { class: "flex justify-between" }, [
                    vueExports.createVNode("dt", { class: "text-slate-600" }, " Phí giao "),
                    vueExports.createVNode("dd", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.shipping_fee)), 1)
                  ]),
                  vueExports.unref(order).amounts.deposit_total > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "flex justify-between"
                  }, [
                    vueExports.createVNode("dt", { class: "text-slate-600" }, " Đặt cọc "),
                    vueExports.createVNode("dd", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.deposit_total)), 1)
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(order).amounts.discount_total > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "flex justify-between text-error-600"
                  }, [
                    vueExports.createVNode("dt", null, "Giảm giá"),
                    vueExports.createVNode("dd", { class: "tabular-nums" }, " -" + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.discount_total)), 1)
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode("div", { class: "border-t border-slate-200 pt-2 mt-2 flex justify-between text-base" }, [
                    vueExports.createVNode("dt", { class: "font-semibold" }, " TỔNG "),
                    vueExports.createVNode("dd", { class: "font-bold text-slate-900 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(order).amounts.total)), 1)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Mốc thời gian",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul class="text-sm space-y-1"${_scopeId}>`);
              if (vueExports.unref(order).timeline.ordered_at) {
                _push2(`<li class="flex justify-between"${_scopeId}><span class="text-slate-600"${_scopeId}>Đặt đơn</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.ordered_at))}</span></li>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(order).timeline.confirmed_at) {
                _push2(`<li class="flex justify-between"${_scopeId}><span class="text-slate-600"${_scopeId}>Xác nhận</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.confirmed_at))}</span></li>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(order).timeline.completed_at) {
                _push2(`<li class="flex justify-between font-medium text-success-700"${_scopeId}><span${_scopeId}>Hoàn thành</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.completed_at))}</span></li>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(order).timeline.cancelled_at) {
                _push2(`<li class="flex justify-between font-medium text-error-700"${_scopeId}><span${_scopeId}>Huỷ</span><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.cancelled_at))}</span></li>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</ul>`);
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
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(order).timeline.cancelled_at ? (vueExports.openBlock(), vueExports.createBlock("li", {
                    key: 3,
                    class: "flex justify-between font-medium text-error-700"
                  }, [
                    vueExports.createVNode("span", null, "Huỷ"),
                    vueExports.createVNode("span", null, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(order).timeline.cancelled_at)), 1)
                  ])) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Đánh giá cư dân",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="text-sm text-slate-400 italic"${_scopeId}> Chưa có đánh giá. </p>`);
            } else {
              return [
                vueExports.createVNode("p", { class: "text-sm text-slate-400 italic" }, " Chưa có đánh giá. ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderStatusChangeModal, {
          open: vueExports.unref(statusOpen),
          "onUpdate:open": ($event) => vueExports.isRef(statusOpen) ? statusOpen.value = $event : null,
          "partner-id": vueExports.unref(vendorId),
          "order-id": vueExports.unref(orderId),
          "current-status": vueExports.unref(order).status.value,
          onUpdated: onStatusUpdated
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorOrderCommissionAssignModal, {
          open: vueExports.unref(assignOpen),
          "onUpdate:open": ($event) => vueExports.isRef(assignOpen) ? assignOpen.value = $event : null,
          "partner-id": vueExports.unref(vendorId),
          "order-id": vueExports.unref(orderId),
          commission: vueExports.unref(order).commission,
          onAssigned
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
          open: vueExports.unref(removeOpen),
          "onUpdate:open": ($event) => vueExports.isRef(removeOpen) ? removeOpen.value = $event : null,
          title: "Gỡ hoa hồng gán thủ công",
          description: "Đơn sẽ trở lại trạng thái chưa có hoa hồng. Bạn có thể gán lại sau."
        }, {
          footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                color: "neutral",
                variant: "ghost",
                label: "Huỷ",
                onClick: ($event) => removeOpen.value = false
              }, null, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                color: "error",
                label: "Gỡ hoa hồng",
                icon: "i-lucide-trash-2",
                loading: vueExports.unref(removing),
                onClick: confirmRemove
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                  vueExports.createVNode(_component_UButton, {
                    color: "neutral",
                    variant: "ghost",
                    label: "Huỷ",
                    onClick: ($event) => removeOpen.value = false
                  }, null, 8, ["onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    color: "error",
                    label: "Gỡ hoa hồng",
                    icon: "i-lucide-trash-2",
                    loading: vueExports.unref(removing),
                    onClick: confirmRemove
                  }, null, 8, ["loading"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/quan-ly-don-hang/don-hang-vendor/[orderKey].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_orderKey_-uFqXu9lM.mjs.map
