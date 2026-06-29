import { _ as _sfc_main$2 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$3 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$4 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$5 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$6 } from './Textarea-DTCNHwKm.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "CustomerForm",
  __ssrInlineRender: true,
  props: {
    mode: {},
    initialValues: { default: () => ({}) },
    code: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) },
    errorMessage: { default: null }
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const form = vueExports.reactive({
      full_name: props.initialValues.full_name ?? "",
      phone: props.initialValues.phone ?? "",
      email: props.initialValues.email ?? "",
      note: props.initialValues.note ?? ""
    });
    vueExports.watch(
      () => props.initialValues,
      (next) => {
        form.full_name = next.full_name ?? "";
        form.phone = next.phone ?? "";
        form.email = next.email ?? "";
        form.note = next.note ?? "";
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$3;
      const _component_UFormField = _sfc_main$4;
      const _component_UInput = _sfc_main$5;
      const _component_UTextarea = _sfc_main$6;
      const _component_UButton = _sfc_main$c;
      _push(`<form${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-5" }, _attrs))}>`);
      if (__props.errorMessage) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-circle-alert",
          description: __props.errorMessage
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.mode === "edit" && __props.code) {
        _push(`<div class="text-sm text-[var(--ui-text-muted)]"> Mã khách hàng: <span class="font-mono font-medium text-slate-700">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.code)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
        label: "Họ tên",
        required: "",
        error: __props.apiErrors.full_name?.[0]
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(form).full_name,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).full_name = $event,
              placeholder: "Nguyễn Văn A",
              maxlength: "255",
              class: "w-full",
              autofocus: ""
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UInput, {
                modelValue: vueExports.unref(form).full_name,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).full_name = $event,
                placeholder: "Nguyễn Văn A",
                maxlength: "255",
                class: "w-full",
                autofocus: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
        label: "Số điện thoại",
        required: "",
        error: __props.apiErrors.phone?.[0],
        help: __props.mode === "create" ? "Dùng để tra cứu — mỗi SĐT một khách hàng." : void 0
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(form).phone,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).phone = $event,
              placeholder: "0912345678",
              maxlength: "20",
              class: "w-full"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UInput, {
                modelValue: vueExports.unref(form).phone,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).phone = $event,
                placeholder: "0912345678",
                maxlength: "20",
                class: "w-full"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
        label: "Email",
        error: __props.apiErrors.email?.[0]
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(form).email,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).email = $event,
              type: "email",
              placeholder: "khachhang@example.com",
              maxlength: "255",
              class: "w-full"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UInput, {
                modelValue: vueExports.unref(form).email,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).email = $event,
                type: "email",
                placeholder: "khachhang@example.com",
                maxlength: "255",
                class: "w-full"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
        label: "Ghi chú",
        error: __props.apiErrors.note?.[0]
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
              modelValue: vueExports.unref(form).note,
              "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
              placeholder: "Ghi chú về khách hàng (tuỳ chọn)",
              rows: 4,
              maxlength: "2000",
              class: "w-full"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UTextarea, {
                modelValue: vueExports.unref(form).note,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
                placeholder: "Ghi chú về khách hàng (tuỳ chọn)",
                rows: 4,
                maxlength: "2000",
                class: "w-full"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-end gap-2 pt-2">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "outline",
        label: "Huỷ",
        disabled: __props.loading,
        onClick: ($event) => emit("cancel")
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        type: "submit",
        color: "primary",
        icon: __props.loading ? "i-lucide-loader-circle" : "i-lucide-check",
        label: __props.loading ? "Đang lưu..." : "Lưu",
        loading: __props.loading,
        disabled: __props.loading
      }, null, _parent));
      _push(`</div></form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/customer/CustomerForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "CustomerForm" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "CustomerFormModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    item: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) },
    errorMessage: { default: null }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const title = vueExports.computed(
      () => props.mode === "create" ? "Thêm khách hàng" : "Sửa khách hàng"
    );
    const initialValues = vueExports.computed(() => {
      if (props.mode === "edit" && props.item) {
        return {
          full_name: props.item.full_name,
          phone: props.item.phone,
          email: props.item.email ?? "",
          note: props.item.note ?? ""
        };
      }
      return {};
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$2;
      const _component_CustomerForm = __nuxt_component_1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: vueExports.unref(title),
        dismissible: !__props.loading,
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CustomerForm, {
              mode: __props.mode,
              code: __props.item?.code ?? null,
              "initial-values": vueExports.unref(initialValues),
              loading: __props.loading,
              "api-errors": __props.apiErrors,
              "error-message": __props.errorMessage,
              onSubmit: ($event) => emit("submit", $event),
              onCancel: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_CustomerForm, {
                mode: __props.mode,
                code: __props.item?.code ?? null,
                "initial-values": vueExports.unref(initialValues),
                loading: __props.loading,
                "api-errors": __props.apiErrors,
                "error-message": __props.errorMessage,
                onSubmit: ($event) => emit("submit", $event),
                onCancel: ($event) => emit("update:open", false)
              }, null, 8, ["mode", "code", "initial-values", "loading", "api-errors", "error-message", "onSubmit", "onCancel"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/customer/CustomerFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main, { __name: "CustomerFormModal" });

export { __nuxt_component_11 as _ };
//# sourceMappingURL=CustomerFormModal-DTm98NMJ.mjs.map
