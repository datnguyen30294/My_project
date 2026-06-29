import { _ as __nuxt_component_0 } from './BaseFormModal-CG7aCaIV.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_4 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$3 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$4 } from './Select-CZE7Ef6n.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "CatalogSupplierFormModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    item: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const statusOptions = [
      { label: "Đang sử dụng", value: "active" },
      { label: "Ngưng sử dụng", value: "inactive" }
    ];
    const formState = vueExports.reactive({
      name: "",
      code: "",
      contact: null,
      phone: null,
      address: null,
      email: null,
      commission_rate: null,
      status: "active"
    });
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        if (props.mode === "edit" && props.item) {
          formState.name = props.item.name;
          formState.code = props.item.code;
          formState.contact = props.item.contact;
          formState.phone = props.item.phone;
          formState.address = props.item.address;
          formState.email = props.item.email;
          formState.commission_rate = props.item.commission_rate ? Number(props.item.commission_rate) : null;
          formState.status = props.item.status.value;
        } else {
          formState.name = "";
          formState.code = "";
          formState.contact = null;
          formState.phone = null;
          formState.address = null;
          formState.email = null;
          formState.commission_rate = null;
          formState.status = "active";
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudBaseFormModal = __nuxt_component_0;
      const _component_UFormField = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_SharedCrudFormFieldError = __nuxt_component_4;
      const _component_UTextarea = _sfc_main$3;
      const _component_USelect = _sfc_main$4;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudBaseFormModal, vueExports.mergeProps({
        open: __props.open,
        mode: __props.mode,
        loading: __props.loading,
        titles: { create: "Thêm nhà cung cấp", edit: "Sửa nhà cung cấp" },
        "onUpdate:open": ($event) => emit("update:open", $event),
        onSubmit: ($event) => emit("submit", { ...vueExports.unref(formState) })
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mã NCC",
              name: "code",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                    placeholder: "VD: NCC-001",
                    class: "w-full",
                    disabled: __props.mode === "edit"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.code
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).code,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                      placeholder: "VD: NCC-001",
                      class: "w-full",
                      disabled: __props.mode === "edit"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.code
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên nhà cung cấp",
              name: "name",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Công ty TNHH ABC",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                      placeholder: "VD: Công ty TNHH ABC",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.name
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Người liên hệ",
              name: "contact"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).contact,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact = $event,
                    placeholder: "Họ tên người liên hệ",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).contact,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact = $event,
                      placeholder: "Họ tên người liên hệ",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Số điện thoại",
              name: "phone"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).phone,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).phone = $event,
                    placeholder: "VD: 0901234567",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).phone,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).phone = $event,
                      placeholder: "VD: 0901234567",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Email",
              name: "email"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                    type: "email",
                    placeholder: "VD: contact@abc.com",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.email
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                      type: "email",
                      placeholder: "VD: contact@abc.com",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.email
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Địa chỉ",
              name: "address"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).address,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                    placeholder: "Địa chỉ nhà cung cấp",
                    rows: 2,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).address,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                      placeholder: "Địa chỉ nhà cung cấp",
                      rows: 2,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Hoa hồng (%)",
              name: "commission_rate"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).commission_rate,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).commission_rate = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    placeholder: "VD: 5",
                    min: 0,
                    max: 100,
                    step: "0.01",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.commission_rate
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).commission_rate,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).commission_rate = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      placeholder: "VD: 5",
                      min: 0,
                      max: 100,
                      step: "0.01",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.commission_rate
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (__props.mode === "edit") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Trạng thái",
                name: "status"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                      modelValue: vueExports.unref(formState).status,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                      items: statusOptions,
                      "value-key": "value",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.status
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USelect, {
                        modelValue: vueExports.unref(formState).status,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                        items: statusOptions,
                        "value-key": "value",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.status
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.createVNode(_component_UFormField, {
                label: "Mã NCC",
                name: "code",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                    placeholder: "VD: NCC-001",
                    class: "w-full",
                    disabled: __props.mode === "edit"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.code
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Tên nhà cung cấp",
                name: "name",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Công ty TNHH ABC",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Người liên hệ",
                name: "contact"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).contact,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact = $event,
                    placeholder: "Họ tên người liên hệ",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Số điện thoại",
                name: "phone"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).phone,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).phone = $event,
                    placeholder: "VD: 0901234567",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Email",
                name: "email"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                    type: "email",
                    placeholder: "VD: contact@abc.com",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.email
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Địa chỉ",
                name: "address"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).address,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                    placeholder: "Địa chỉ nhà cung cấp",
                    rows: 2,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Hoa hồng (%)",
                name: "commission_rate"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).commission_rate,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).commission_rate = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    placeholder: "VD: 5",
                    min: 0,
                    max: 100,
                    step: "0.01",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.commission_rate
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              __props.mode === "edit" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                key: 0,
                label: "Trạng thái",
                name: "status"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_USelect, {
                    modelValue: vueExports.unref(formState).status,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                    items: statusOptions,
                    "value-key": "value",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.status
                  }, null, 8, ["errors"])
                ]),
                _: 1
              })) : vueExports.createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/catalog/CatalogSupplierFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main, { __name: "CatalogSupplierFormModal" });

export { __nuxt_component_9 as _ };
//# sourceMappingURL=CatalogSupplierFormModal-BR6lCPos.mjs.map
