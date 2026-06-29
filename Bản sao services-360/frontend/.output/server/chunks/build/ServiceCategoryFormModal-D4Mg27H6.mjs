import { _ as __nuxt_component_0 } from './BaseFormModal-CG7aCaIV.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_4 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$3 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$4 } from './Select-CZE7Ef6n.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ServiceCategoryFormModal",
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
      description: null,
      sort_order: null,
      status: "active"
    });
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        if (props.mode === "edit" && props.item) {
          formState.name = props.item.name;
          formState.code = props.item.code;
          formState.description = props.item.description || null;
          formState.sort_order = props.item.sort_order;
          formState.status = props.item.status.value;
        } else {
          formState.name = "";
          formState.code = "";
          formState.description = null;
          formState.sort_order = null;
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
        titles: { create: "Thêm loại dịch vụ", edit: "Sửa loại dịch vụ" },
        "onUpdate:open": ($event) => emit("update:open", $event),
        onSubmit: ($event) => emit("submit", { ...vueExports.unref(formState) })
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mã loại dịch vụ",
              name: "code",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                    placeholder: "VD: SC-001",
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
                      placeholder: "VD: SC-001",
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
              label: "Tên loại dịch vụ",
              name: "name",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Dịch vụ vệ sinh",
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
                      placeholder: "VD: Dịch vụ vệ sinh",
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
              label: "Mô tả",
              name: "description"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).description,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                    placeholder: "Mô tả loại dịch vụ",
                    rows: 2,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.description
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).description,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                      placeholder: "Mô tả loại dịch vụ",
                      rows: 2,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.description
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Thứ tự sắp xếp",
              name: "sort_order"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).sort_order,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).sort_order = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    placeholder: "VD: 0",
                    min: 0,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.sort_order
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).sort_order,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).sort_order = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      placeholder: "VD: 0",
                      min: 0,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.sort_order
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
                label: "Mã loại dịch vụ",
                name: "code",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                    placeholder: "VD: SC-001",
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
                label: "Tên loại dịch vụ",
                name: "name",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Dịch vụ vệ sinh",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Mô tả",
                name: "description"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).description,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                    placeholder: "Mô tả loại dịch vụ",
                    rows: 2,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.description
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Thứ tự sắp xếp",
                name: "sort_order"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).sort_order,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).sort_order = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    placeholder: "VD: 0",
                    min: 0,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.sort_order
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/catalog/ServiceCategoryFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main, { __name: "CatalogServiceCategoryFormModal" });

export { __nuxt_component_10 as _ };
//# sourceMappingURL=ServiceCategoryFormModal-D4Mg27H6.mjs.map
