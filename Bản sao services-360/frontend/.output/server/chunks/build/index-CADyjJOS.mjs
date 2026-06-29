import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { v as vueExports, u as useSeoMeta, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, ay as usePlatformApiFetch, aD as $platformApi } from './server.mjs';
import { _ as _sfc_main$3 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$5 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_3 } from './TableActions-b69bU2gG.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_0 } from './BaseFormModal-CG7aCaIV.mjs';
import { _ as _sfc_main$7 } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_3$1 } from './OrganizationSelect-Cu-8MJ9c.mjs';
import { _ as __nuxt_component_4 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as __nuxt_component_4$1 } from './OrganizationProjectSelect-C1GzN7Mu.mjs';
import { _ as _sfc_main$8 } from './Switch-1cJNH-6C.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { _ as _sfc_main$6 } from './Modal-BimZZbNl.mjs';
import { a as formatDate } from './date-R5YK0ast.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import './index-QmZAbLx-.mjs';
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
import './index-CSThDD3J.mjs';
import './Pagination-fZq_Msxb.mjs';
import './Label-BBgw4vHh.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './useOrganizations-DNv3fDw1.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';

function usePlatformApiScopeList() {
  return usePlatformApiFetch("/platform/api-scopes");
}
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ApiClientFormModal",
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
    const { data: scopeGroupsResponse } = usePlatformApiScopeList();
    const scopeGroups = vueExports.computed(() => scopeGroupsResponse.value?.data ?? []);
    const props = __props;
    const emit = __emit;
    const formState = vueExports.reactive({
      organization_id: null,
      project_id: null,
      name: "",
      scopes: [],
      is_active: true
    });
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        if (props.mode === "edit" && props.item) {
          formState.organization_id = props.item.organization_id;
          formState.project_id = props.item.project_id;
          formState.name = props.item.name;
          formState.scopes = [...props.item.scopes];
          formState.is_active = props.item.is_active;
        } else {
          formState.organization_id = null;
          formState.project_id = null;
          formState.name = "";
          formState.scopes = [];
          formState.is_active = true;
        }
      }
    );
    function toggleScope(value) {
      const idx = formState.scopes.indexOf(value);
      if (idx >= 0) {
        formState.scopes.splice(idx, 1);
      } else {
        formState.scopes.push(value);
      }
    }
    function isGroupAllSelected(group) {
      return group.scopes.every((s) => formState.scopes.includes(s.value));
    }
    function toggleGroup(group) {
      if (isGroupAllSelected(group)) {
        group.scopes.forEach((s) => {
          const idx = formState.scopes.indexOf(s.value);
          if (idx >= 0) formState.scopes.splice(idx, 1);
        });
      } else {
        group.scopes.forEach((s) => {
          if (!formState.scopes.includes(s.value)) formState.scopes.push(s.value);
        });
      }
    }
    function handleSubmit() {
      emit("submit", {
        organization_id: formState.organization_id,
        project_id: formState.project_id,
        name: formState.name,
        scopes: formState.scopes,
        ...props.mode === "edit" ? { is_active: formState.is_active } : {}
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudBaseFormModal = __nuxt_component_0;
      const _component_UFormField = _sfc_main$7;
      const _component_SharedOrganizationSelect = __nuxt_component_3$1;
      const _component_SharedCrudFormFieldError = __nuxt_component_4;
      const _component_SharedOrganizationProjectSelect = __nuxt_component_4$1;
      const _component_UInput = _sfc_main$2;
      const _component_UIcon = _sfc_main$h;
      const _component_USwitch = _sfc_main$8;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudBaseFormModal, vueExports.mergeProps({
        open: __props.open,
        mode: __props.mode,
        loading: __props.loading,
        titles: { create: "Tạo API Client", edit: "Sửa API Client" },
        "onUpdate:open": ($event) => emit("update:open", $event),
        onSubmit: handleSubmit
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tổ chức",
              name: "organization_id",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOrganizationSelect, {
                    modelValue: vueExports.unref(formState).organization_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).organization_id = $event,
                    disabled: __props.mode === "edit"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.organization_id
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedOrganizationSelect, {
                      modelValue: vueExports.unref(formState).organization_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).organization_id = $event,
                      disabled: __props.mode === "edit"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.organization_id
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Dự án",
              name: "project_id",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOrganizationProjectSelect, {
                    modelValue: vueExports.unref(formState).project_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_id = $event,
                    "organization-id": vueExports.unref(formState).organization_id,
                    disabled: __props.mode === "edit"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.project_id
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedOrganizationProjectSelect, {
                      modelValue: vueExports.unref(formState).project_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_id = $event,
                      "organization-id": vueExports.unref(formState).organization_id,
                      disabled: __props.mode === "edit"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "organization-id", "disabled"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.project_id
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên ứng dụng",
              name: "name",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: ERP Connector, Mobile App",
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
                      placeholder: "VD: ERP Connector, Mobile App",
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
              label: "Quyền truy cập",
              name: "scopes",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="rounded-lg border border-gray-200 divide-y divide-gray-200"${_scopeId2}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(scopeGroups), (group) => {
                    _push3(`<div class="px-4 py-3"${_scopeId2}><div class="flex items-center justify-between mb-2"${_scopeId2}><div class="flex items-center gap-2"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: group.icon,
                      class: "text-gray-500 size-4"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="text-sm font-medium text-gray-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(group.label)}</span></div><button type="button" class="text-xs text-primary hover:underline"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(isGroupAllSelected(group) ? "Bỏ chọn tất cả" : "Chọn tất cả")}</button></div><div class="flex flex-wrap gap-2 ml-6"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(group.scopes, (scope) => {
                      _push3(`<button type="button" class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(formState).scopes.includes(scope.value) ? "bg-primary/10 border-primary/30 text-primary" : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300", "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"])}"${_scopeId2}>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                        name: vueExports.unref(formState).scopes.includes(scope.value) ? "i-lucide-check" : "i-lucide-plus",
                        class: "size-3"
                      }, null, _parent3, _scopeId2));
                      _push3(` ${serverRenderer_cjs_prodExports.ssrInterpolate(scope.label)}</button>`);
                    });
                    _push3(`<!--]--></div></div>`);
                  });
                  _push3(`<!--]--></div>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.scopes
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode("div", { class: "rounded-lg border border-gray-200 divide-y divide-gray-200" }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(scopeGroups), (group) => {
                        return vueExports.openBlock(), vueExports.createBlock("div", {
                          key: group.key,
                          class: "px-4 py-3"
                        }, [
                          vueExports.createVNode("div", { class: "flex items-center justify-between mb-2" }, [
                            vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                              vueExports.createVNode(_component_UIcon, {
                                name: group.icon,
                                class: "text-gray-500 size-4"
                              }, null, 8, ["name"]),
                              vueExports.createVNode("span", { class: "text-sm font-medium text-gray-700" }, vueExports.toDisplayString(group.label), 1)
                            ]),
                            vueExports.createVNode("button", {
                              type: "button",
                              class: "text-xs text-primary hover:underline",
                              onClick: ($event) => toggleGroup(group)
                            }, vueExports.toDisplayString(isGroupAllSelected(group) ? "Bỏ chọn tất cả" : "Chọn tất cả"), 9, ["onClick"])
                          ]),
                          vueExports.createVNode("div", { class: "flex flex-wrap gap-2 ml-6" }, [
                            (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(group.scopes, (scope) => {
                              return vueExports.openBlock(), vueExports.createBlock("button", {
                                key: scope.value,
                                type: "button",
                                class: ["inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors", vueExports.unref(formState).scopes.includes(scope.value) ? "bg-primary/10 border-primary/30 text-primary" : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"],
                                onClick: ($event) => toggleScope(scope.value)
                              }, [
                                vueExports.createVNode(_component_UIcon, {
                                  name: vueExports.unref(formState).scopes.includes(scope.value) ? "i-lucide-check" : "i-lucide-plus",
                                  class: "size-3"
                                }, null, 8, ["name"]),
                                vueExports.createTextVNode(" " + vueExports.toDisplayString(scope.label), 1)
                              ], 10, ["onClick"]);
                            }), 128))
                          ])
                        ]);
                      }), 128))
                    ]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.scopes
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (__props.mode === "edit") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Trạng thái",
                name: "is_active"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
                      modelValue: vueExports.unref(formState).is_active,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_active = $event,
                      color: "success"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="text-sm text-gray-500"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formState).is_active ? "Đang hoạt động" : "Đã tắt")}</span></div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                        vueExports.createVNode(_component_USwitch, {
                          modelValue: vueExports.unref(formState).is_active,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_active = $event,
                          color: "success"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode("span", { class: "text-sm text-gray-500" }, vueExports.toDisplayString(vueExports.unref(formState).is_active ? "Đang hoạt động" : "Đã tắt"), 1)
                      ])
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
                label: "Tổ chức",
                name: "organization_id",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SharedOrganizationSelect, {
                    modelValue: vueExports.unref(formState).organization_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).organization_id = $event,
                    disabled: __props.mode === "edit"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.organization_id
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Dự án",
                name: "project_id",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SharedOrganizationProjectSelect, {
                    modelValue: vueExports.unref(formState).project_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_id = $event,
                    "organization-id": vueExports.unref(formState).organization_id,
                    disabled: __props.mode === "edit"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "organization-id", "disabled"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.project_id
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Tên ứng dụng",
                name: "name",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: ERP Connector, Mobile App",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Quyền truy cập",
                name: "scopes",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "rounded-lg border border-gray-200 divide-y divide-gray-200" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(scopeGroups), (group) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: group.key,
                        class: "px-4 py-3"
                      }, [
                        vueExports.createVNode("div", { class: "flex items-center justify-between mb-2" }, [
                          vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                            vueExports.createVNode(_component_UIcon, {
                              name: group.icon,
                              class: "text-gray-500 size-4"
                            }, null, 8, ["name"]),
                            vueExports.createVNode("span", { class: "text-sm font-medium text-gray-700" }, vueExports.toDisplayString(group.label), 1)
                          ]),
                          vueExports.createVNode("button", {
                            type: "button",
                            class: "text-xs text-primary hover:underline",
                            onClick: ($event) => toggleGroup(group)
                          }, vueExports.toDisplayString(isGroupAllSelected(group) ? "Bỏ chọn tất cả" : "Chọn tất cả"), 9, ["onClick"])
                        ]),
                        vueExports.createVNode("div", { class: "flex flex-wrap gap-2 ml-6" }, [
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(group.scopes, (scope) => {
                            return vueExports.openBlock(), vueExports.createBlock("button", {
                              key: scope.value,
                              type: "button",
                              class: ["inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors", vueExports.unref(formState).scopes.includes(scope.value) ? "bg-primary/10 border-primary/30 text-primary" : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"],
                              onClick: ($event) => toggleScope(scope.value)
                            }, [
                              vueExports.createVNode(_component_UIcon, {
                                name: vueExports.unref(formState).scopes.includes(scope.value) ? "i-lucide-check" : "i-lucide-plus",
                                class: "size-3"
                              }, null, 8, ["name"]),
                              vueExports.createTextVNode(" " + vueExports.toDisplayString(scope.label), 1)
                            ], 10, ["onClick"]);
                          }), 128))
                        ])
                      ]);
                    }), 128))
                  ]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.scopes
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              __props.mode === "edit" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                key: 0,
                label: "Trạng thái",
                name: "is_active"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                    vueExports.createVNode(_component_USwitch, {
                      modelValue: vueExports.unref(formState).is_active,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_active = $event,
                      color: "success"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode("span", { class: "text-sm text-gray-500" }, vueExports.toDisplayString(vueExports.unref(formState).is_active ? "Đang hoạt động" : "Đã tắt"), 1)
                  ])
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/api-client/ApiClientFormModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$1, { __name: "ApiClientFormModal" });
function usePlatformApiClientList(params) {
  const url = vueExports.computed(() => {
    const p = vueExports.toValue(params);
    const query = new URLSearchParams();
    if (p.search) query.set("search", p.search);
    if (p.organization_id) query.set("organization_id", p.organization_id);
    if (p.is_active !== void 0 && p.is_active !== null) query.set("is_active", p.is_active ? "1" : "0");
    if (p.page) query.set("page", String(p.page));
    if (p.per_page) query.set("per_page", String(p.per_page));
    const qs = query.toString();
    return `/platform/api-clients${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
function apiCreateApiClient(data) {
  return $platformApi("/platform/api-clients", {
    method: "POST",
    body: data
  });
}
function apiUpdateApiClient(id, data) {
  return $platformApi(`/platform/api-clients/${id}`, {
    method: "PUT",
    body: data
  });
}
function apiDeleteApiClient(id) {
  return $platformApi(`/platform/api-clients/${id}`, {
    method: "DELETE"
  });
}
function apiRegenerateSecret(id) {
  return $platformApi(`/platform/api-clients/${id}/regenerate-secret`, {
    method: "POST"
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Quản lý API Clients - Thần Nông" });
    const params = vueExports.reactive({
      search: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = usePlatformApiClientList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const clients = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { accessorKey: "name", header: "Tên ứng dụng" },
      { id: "client_key", header: "Client Key" },
      { id: "organization", header: "Tổ chức" },
      { id: "project", header: "Dự án" },
      { id: "scopes", header: "Scopes" },
      { id: "is_active", header: "Trạng thái" },
      { accessorKey: "last_used_at", header: "Lần dùng cuối" },
      stickyRight({ id: "actions", header: "Thao tác" }, { width: "w-[140px] min-w-[140px]" })
    ];
    const crud = useCrudModals();
    const {
      showFormModal,
      formMode,
      editTarget,
      formApiErrors,
      openCreateModal,
      openEditModal,
      showDeleteModal,
      deleteTarget,
      openDeleteModal
    } = crud;
    const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    const secretKey = vueExports.ref(null);
    const secretClientKey = vueExports.ref(null);
    const showSecretModal = vueExports.ref(false);
    async function handleFormSubmit(formData) {
      crud.formApiErrors.value = {};
      const isCreate = formMode.value === "create";
      if (isCreate) {
        try {
          const result = await apiCreateApiClient(formData);
          secretClientKey.value = result.data?.client_key ?? null;
          secretKey.value = result.secret_key ?? null;
          showSecretModal.value = true;
          crud.showFormModal.value = false;
          await refresh();
        } catch (err) {
          crud.handleFormError(err);
        }
      } else {
        submitForm(
          null,
          () => apiUpdateApiClient(editTarget.value.id, {
            name: formData.name,
            scopes: formData.scopes,
            is_active: formData.is_active
          }),
          { update: "Cập nhật API client thành công" }
        );
      }
    }
    function handleDelete() {
      submitDelete(
        () => apiDeleteApiClient(deleteTarget.value.id),
        { message: "Đã xoá API client" }
      );
    }
    const toast = useToast();
    const showRegenerateModal = vueExports.ref(false);
    const regenerateTarget = vueExports.ref(null);
    const isRegenerating = vueExports.ref(false);
    function openRegenerateModal(client) {
      regenerateTarget.value = client;
      showRegenerateModal.value = true;
    }
    async function confirmRegenerateSecret() {
      if (!regenerateTarget.value) return;
      isRegenerating.value = true;
      try {
        const result = await apiRegenerateSecret(regenerateTarget.value.id);
        secretClientKey.value = regenerateTarget.value.client_key;
        secretKey.value = result.secret_key ?? null;
        showRegenerateModal.value = false;
        showSecretModal.value = true;
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Tạo lại secret thất bại"), color: "error" });
      } finally {
        isRegenerating.value = false;
      }
    }
    function copyElementById(id) {
      const el = (void 0).getElementById(id);
      if (!el) return;
      const range = (void 0).createRange();
      range.selectNodeContents(el);
      const selection = (void 0).getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      (void 0).execCommand("copy");
      selection?.removeAllRanges();
      toast.add({ title: "Đã copy", color: "success" });
    }
    function copyToClipboard(text) {
      if ((void 0).clipboard?.writeText) {
        (void 0).clipboard.writeText(text).then(() => {
          toast.add({ title: "Đã copy", color: "success" });
        }).catch(() => {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    }
    function fallbackCopy(text) {
      const textarea = (void 0).createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      (void 0).body.appendChild(textarea);
      textarea.select();
      (void 0).execCommand("copy");
      (void 0).body.removeChild(textarea);
      toast.add({ title: "Đã copy", color: "success" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$2;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$3;
      const _component_UTable = _sfc_main$4;
      const _component_UBadge = _sfc_main$5;
      const _component_SharedCrudTableActions = __nuxt_component_3;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_ApiClientFormModal = __nuxt_component_7;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      const _component_UModal = _sfc_main$6;
      const _component_UIcon = _sfc_main$h;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6"><h1 class="text-2xl font-black text-slate-900 tracking-tight"> API Clients </h1><p class="text-slate-500 text-sm mt-1"> Quản lý ứng dụng bên thứ 3 kết nối qua API. </p></div><div class="mb-4 flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo tên...",
        class: "max-w-sm"
      }, null, _parent));
      if (vueExports.unref(hasFilters)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-x",
          label: "Xóa bộ lọc",
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
        label: "Tạo API Client",
        onClick: vueExports.unref(openCreateModal)
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không thể tải dữ liệu. Vui lòng thử lại.",
          class: "mb-4"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(clients),
        columns,
        loading: vueExports.unref(status) === "pending"
      }, {
        "client_key-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-1"${_scopeId}><code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.client_key.slice(0, 20))}...</code>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-copy",
              color: "neutral",
              variant: "ghost",
              size: "xs",
              title: "Copy Client Key",
              onClick: ($event) => copyToClipboard(row.original.client_key)
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                vueExports.createVNode("code", { class: "text-xs bg-gray-100 px-1.5 py-0.5 rounded" }, vueExports.toDisplayString(row.original.client_key.slice(0, 20)) + "...", 1),
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-copy",
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  title: "Copy Client Key",
                  onClick: ($event) => copyToClipboard(row.original.client_key)
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        "organization-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><span class="text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.organization_name ?? row.original.organization_id)}</span><span class="text-xs text-gray-400 ml-1"${_scopeId}>(${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.organization_id)})</span></div>`);
          } else {
            return [
              vueExports.createVNode("div", null, [
                vueExports.createVNode("span", { class: "text-sm" }, vueExports.toDisplayString(row.original.organization_name ?? row.original.organization_id), 1),
                vueExports.createVNode("span", { class: "text-xs text-gray-400 ml-1" }, "(" + vueExports.toDisplayString(row.original.organization_id) + ")", 1)
              ])
            ];
          }
        }),
        "project-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name ?? `#${row.original.project_id}`)}`);
          } else {
            return [
              vueExports.createTextVNode(vueExports.toDisplayString(row.original.project_name ?? `#${row.original.project_id}`), 1)
            ];
          }
        }),
        "scopes-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(row.original.scopes, (scope) => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                key: scope,
                variant: "subtle",
                color: "info",
                label: scope,
                size: "xs"
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-wrap gap-1" }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(row.original.scopes, (scope) => {
                  return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                    key: scope,
                    variant: "subtle",
                    color: "info",
                    label: scope,
                    size: "xs"
                  }, null, 8, ["label"]);
                }), 128))
              ])
            ];
          }
        }),
        "is_active-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: row.original.is_active ? "success" : "neutral",
              variant: "subtle",
              label: row.original.is_active ? "Hoạt động" : "Đã tắt"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: row.original.is_active ? "success" : "neutral",
                variant: "subtle",
                label: row.original.is_active ? "Hoạt động" : "Đã tắt"
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        "last_used_at-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.last_used_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.last_used_at) : "—")}`);
          } else {
            return [
              vueExports.createTextVNode(vueExports.toDisplayString(row.original.last_used_at ? ("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.last_used_at) : "—"), 1)
            ];
          }
        }),
        "actions-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableActions, {
              onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
              onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
            }, {
              extra: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-refresh-cw",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    title: "Tạo lại Secret",
                    onClick: ($event) => openRegenerateModal(row.original)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-refresh-cw",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      title: "Tạo lại Secret",
                      onClick: ($event) => openRegenerateModal(row.original)
                    }, null, 8, ["onClick"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_SharedCrudTableActions, {
                onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
              }, {
                extra: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-refresh-cw",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    title: "Tạo lại Secret",
                    onClick: ($event) => openRegenerateModal(row.original)
                  }, null, 8, ["onClick"])
                ]),
                _: 2
              }, 1032, ["onEdit", "onDelete"])
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
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ApiClientFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isSubmitting),
        "api-errors": vueExports.unref(formApiErrors),
        onSubmit: handleFormSubmit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá API Client",
        "item-name": vueExports.unref(deleteTarget)?.name,
        loading: vueExports.unref(isDeleting),
        onConfirm: handleDelete
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showRegenerateModal),
        title: "Tạo lại Secret Key",
        "onUpdate:open": ($event) => showRegenerateModal.value = $event
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              icon: "i-lucide-alert-triangle",
              color: "warning",
              variant: "subtle",
              title: "Cảnh báo",
              description: "Secret key hiện tại sẽ bị vô hiệu hóa ngay lập tức. Tất cả access token đang hoạt động sẽ bị thu hồi. Ứng dụng bên thứ 3 sẽ không thể truy cập API cho đến khi cập nhật secret key mới.",
              class: "mb-4"
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-sm text-gray-600"${_scopeId}> Bạn có chắc chắn muốn tạo lại secret key cho <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(regenerateTarget)?.name)}</strong>? </p>`);
          } else {
            return [
              vueExports.createVNode(_component_UAlert, {
                icon: "i-lucide-alert-triangle",
                color: "warning",
                variant: "subtle",
                title: "Cảnh báo",
                description: "Secret key hiện tại sẽ bị vô hiệu hóa ngay lập tức. Tất cả access token đang hoạt động sẽ bị thu hồi. Ứng dụng bên thứ 3 sẽ không thể truy cập API cho đến khi cập nhật secret key mới.",
                class: "mb-4"
              }),
              vueExports.createVNode("p", { class: "text-sm text-gray-600" }, [
                vueExports.createTextVNode(" Bạn có chắc chắn muốn tạo lại secret key cho "),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(regenerateTarget)?.name), 1),
                vueExports.createTextVNode("? ")
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
              onClick: ($event) => showRegenerateModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "warning",
              icon: "i-lucide-refresh-cw",
              label: "Tạo lại Secret",
              loading: vueExports.unref(isRegenerating),
              onClick: confirmRegenerateSecret
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Huỷ",
                  onClick: ($event) => showRegenerateModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "warning",
                  icon: "i-lucide-refresh-cw",
                  label: "Tạo lại Secret",
                  loading: vueExports.unref(isRegenerating),
                  onClick: confirmRegenerateSecret
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showSecretModal),
        title: "Thông tin xác thực",
        "onUpdate:open": ($event) => showSecretModal.value = $event
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              icon: "i-lucide-alert-triangle",
              color: "warning",
              variant: "subtle",
              title: "Lưu ý",
              description: "Secret key chỉ hiển thị một lần duy nhất. Hãy sao chép và lưu trữ an toàn.",
              class: "mb-4"
            }, null, _parent2, _scopeId));
            _push2(`<div class="space-y-3"${_scopeId}><div${_scopeId}><label class="text-xs font-medium text-gray-500 mb-1 block"${_scopeId}>Client Key</label><div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border"${_scopeId}><code id="client-key-display" class="flex-1 text-sm font-mono break-all whitespace-pre-wrap select-all"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(secretClientKey))}</code><button type="button" class="shrink-0 p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-copy",
              class: "size-4"
            }, null, _parent2, _scopeId));
            _push2(`</button></div></div><div${_scopeId}><label class="text-xs font-medium text-gray-500 mb-1 block"${_scopeId}>Secret Key</label><div class="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border"${_scopeId}><code id="secret-key-input" class="flex-1 text-sm font-mono break-all whitespace-pre-wrap select-all"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(secretKey))}</code><button type="button" class="shrink-0 p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-copy",
              class: "size-4"
            }, null, _parent2, _scopeId));
            _push2(`</button></div></div></div>`);
          } else {
            return [
              vueExports.createVNode(_component_UAlert, {
                icon: "i-lucide-alert-triangle",
                color: "warning",
                variant: "subtle",
                title: "Lưu ý",
                description: "Secret key chỉ hiển thị một lần duy nhất. Hãy sao chép và lưu trữ an toàn.",
                class: "mb-4"
              }),
              vueExports.createVNode("div", { class: "space-y-3" }, [
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("label", { class: "text-xs font-medium text-gray-500 mb-1 block" }, "Client Key"),
                  vueExports.createVNode("div", { class: "flex items-center gap-2 p-3 bg-gray-50 rounded-lg border" }, [
                    vueExports.createVNode("code", {
                      id: "client-key-display",
                      class: "flex-1 text-sm font-mono break-all whitespace-pre-wrap select-all"
                    }, vueExports.toDisplayString(vueExports.unref(secretClientKey)), 1),
                    vueExports.createVNode("button", {
                      type: "button",
                      class: "shrink-0 p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors",
                      onClick: ($event) => copyElementById("client-key-display")
                    }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-copy",
                        class: "size-4"
                      })
                    ], 8, ["onClick"])
                  ])
                ]),
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("label", { class: "text-xs font-medium text-gray-500 mb-1 block" }, "Secret Key"),
                  vueExports.createVNode("div", { class: "flex items-start gap-2 p-3 bg-gray-50 rounded-lg border" }, [
                    vueExports.createVNode("code", {
                      id: "secret-key-input",
                      class: "flex-1 text-sm font-mono break-all whitespace-pre-wrap select-all"
                    }, vueExports.toDisplayString(vueExports.unref(secretKey)), 1),
                    vueExports.createVNode("button", {
                      type: "button",
                      class: "shrink-0 p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors",
                      onClick: ($event) => copyElementById("secret-key-input")
                    }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-copy",
                        class: "size-4"
                      })
                    ], 8, ["onClick"])
                  ])
                ])
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Đã lưu, đóng",
              onClick: ($event) => showSecretModal.value = false
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Đã lưu, đóng",
                  onClick: ($event) => showSecretModal.value = false
                }, null, 8, ["onClick"])
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/api-clients/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CADyjJOS.mjs.map
