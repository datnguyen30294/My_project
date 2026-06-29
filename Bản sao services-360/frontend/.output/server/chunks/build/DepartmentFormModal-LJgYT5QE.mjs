import { _ as __nuxt_component_0 } from './BaseFormModal-CG7aCaIV.mjs';
import { _ as _sfc_main$2 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$3 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_4$1 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$5 } from './SelectMenu-DKHEMZj7.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { u as useEntitySelect } from './useEntitySelect-DG9pQ_n0.mjs';
import { e as apiGetSelfAndDescendantIds, u as useDepartmentList, d as apiGetDepartment } from './useDepartments-C8BvGnCs.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as _sfc_main$4 } from './Textarea-DTCNHwKm.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DepartmentParentSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    excludeIds: {},
    projectId: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
      () => props.modelValue ?? null,
      (val) => emit("update:modelValue", val),
      {
        fetchList: useDepartmentList,
        resolveItem: async (id) => {
          const r = await apiGetDepartment(id);
          return { id: r.data.id, label: r.data.name };
        },
        excludeIds: vueExports.computed(() => props.excludeIds ?? []),
        extraParams: vueExports.computed(() => props.projectId != null ? { project_id: props.projectId } : {})
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$5;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItem),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItem) ? selectedItem.value = $event : null,
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm phòng ban..." },
        placeholder: "Chọn phòng ban",
        clear: "",
        class: "w-full",
        "onUpdate:searchTerm": vueExports.unref(onSearchTerm)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/department/DepartmentParentSelect.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "SharedDepartmentParentSelect" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DepartmentFormModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    item: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) },
    lockedProjectId: { default: null }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formState = vueExports.reactive({
      project_id: null,
      code: "",
      name: "",
      parent_id: null,
      description: null
    });
    const parentExcludeIds = vueExports.ref([]);
    vueExports.watch(
      () => props.open,
      async (isOpen) => {
        if (!isOpen) return;
        if (props.mode === "edit" && props.item) {
          formState.project_id = props.lockedProjectId ?? props.item.project_id;
          formState.code = props.item.code;
          formState.name = props.item.name;
          formState.parent_id = props.item.parent_id;
          formState.description = props.item.description ?? null;
          parentExcludeIds.value = await apiGetSelfAndDescendantIds(props.item.id);
        } else {
          formState.project_id = props.lockedProjectId ?? null;
          formState.code = "";
          formState.name = "";
          formState.parent_id = null;
          formState.description = null;
          parentExcludeIds.value = [];
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudBaseFormModal = __nuxt_component_0;
      const _component_UFormField = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_SharedCrudFormFieldError = __nuxt_component_4$1;
      const _component_SharedDepartmentParentSelect = __nuxt_component_4;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UTextarea = _sfc_main$4;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudBaseFormModal, vueExports.mergeProps({
        open: __props.open,
        mode: __props.mode,
        loading: __props.loading,
        titles: { create: "Thêm phòng ban", edit: "Sửa phòng ban" },
        "onUpdate:open": ($event) => emit("update:open", $event),
        onSubmit: ($event) => emit("submit", { ...vueExports.unref(formState) })
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mã phòng ban",
              name: "code",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                    placeholder: "VD: KT, HC, BGD",
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
                      placeholder: "VD: KT, HC, BGD",
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
              label: "Tên phòng ban",
              name: "name",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Phòng Kỹ thuật",
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
                      placeholder: "VD: Phòng Kỹ thuật",
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
              label: "Phòng ban cha",
              name: "parent_id"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedDepartmentParentSelect, {
                    modelValue: vueExports.unref(formState).parent_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).parent_id = $event,
                    "exclude-ids": vueExports.unref(parentExcludeIds),
                    "project-id": __props.lockedProjectId ?? vueExports.unref(formState).project_id
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedDepartmentParentSelect, {
                      modelValue: vueExports.unref(formState).parent_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).parent_id = $event,
                      "exclude-ids": vueExports.unref(parentExcludeIds),
                      "project-id": __props.lockedProjectId ?? vueExports.unref(formState).project_id
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "exclude-ids", "project-id"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (__props.lockedProjectId == null) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Thuộc dự án",
                name: "project_id"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
                      modelValue: vueExports.unref(formState).project_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_id = $event,
                      placeholder: "Trụ sở chính"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.project_id
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(formState).project_id,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_id = $event,
                        placeholder: "Trụ sở chính"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.project_id
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mô tả",
              name: "description"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).description,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                    placeholder: "Mô tả phòng ban (tuỳ chọn)",
                    rows: 2,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).description,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                      placeholder: "Mô tả phòng ban (tuỳ chọn)",
                      rows: 2,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UFormField, {
                label: "Mã phòng ban",
                name: "code",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                    placeholder: "VD: KT, HC, BGD",
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
                label: "Tên phòng ban",
                name: "name",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Phòng Kỹ thuật",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Phòng ban cha",
                name: "parent_id"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SharedDepartmentParentSelect, {
                    modelValue: vueExports.unref(formState).parent_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).parent_id = $event,
                    "exclude-ids": vueExports.unref(parentExcludeIds),
                    "project-id": __props.lockedProjectId ?? vueExports.unref(formState).project_id
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "exclude-ids", "project-id"])
                ]),
                _: 1
              }),
              __props.lockedProjectId == null ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                key: 0,
                label: "Thuộc dự án",
                name: "project_id"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SharedProjectSelect, {
                    modelValue: vueExports.unref(formState).project_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_id = $event,
                    placeholder: "Trụ sở chính"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.project_id
                  }, null, 8, ["errors"])
                ]),
                _: 1
              })) : vueExports.createCommentVNode("", true),
              vueExports.createVNode(_component_UFormField, {
                label: "Mô tả",
                name: "description"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).description,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                    placeholder: "Mô tả phòng ban (tuỳ chọn)",
                    rows: 2,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/department/DepartmentFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main, { __name: "DepartmentFormModal" });

export { __nuxt_component_10 as _, __nuxt_component_4 as a };
//# sourceMappingURL=DepartmentFormModal-LJgYT5QE.mjs.map
