import { _ as _sfc_main$a } from './Card-ywPiICev.mjs';
import { v as vueExports, u as useSeoMeta, i as useRouter, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$b } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$3 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$4 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_3 } from './OrganizationSelect-Cu-8MJ9c.mjs';
import { _ as _sfc_main$5 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$6 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$8 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$7 } from './Empty-wM3WsVlF.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as _sfc_main$9 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$d } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_4 } from './FormFieldError-cu7WK1i1.mjs';
import { h as useListPlatformProjects, P as PROJECT_STATUS_OPTIONS, i as apiCreatePlatformProject, j as apiToggleProjectService } from './usePlatformProjects-D8VBGqRs.mjs';
import { C as CreatePlatformProjectRequestStatus } from './laravel-BKHe1mna.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { a as getApiValidationErrors, g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './index-QmZAbLx-.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './index-CSThDD3J.mjs';
import './useOrganizations-DNv3fDw1.mjs';
import './Pagination-fZq_Msxb.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Label-BBgw4vHh.mjs';

const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformProjectStatsBar",
  __ssrInlineRender: true,
  props: {
    stats: {},
    pending: { type: Boolean, default: false }
  },
  setup(__props) {
    const items = [
      { key: "total", label: "Tổng dự án", icon: "i-lucide-folder-kanban", color: "text-primary" },
      { key: "managing", label: "Đang quản lý", icon: "i-lucide-circle-check", color: "text-emerald-600" },
      { key: "tenant_count", label: "Công ty VH có dự án", icon: "i-lucide-building-2", color: "text-sky-600" },
      { key: "service_disabled", label: "Ngừng cung cấp dịch vụ", icon: "i-lucide-circle-pause", color: "text-amber-600" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$a;
      const _component_UIcon = _sfc_main$h;
      const _component_USkeleton = _sfc_main$b;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        role: "group",
        "aria-label": "Thống kê dự án trên nền tảng",
        class: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6"
      }, _attrs))}><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(items, (item) => {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, {
          key: item.key,
          ui: { body: "px-5 py-4" }
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-4"${_scopeId}><div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: item.icon,
                class: ["size-5", item.color]
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="min-w-0"${_scopeId}><div class="text-sm text-[var(--ui-text-muted)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</div>`);
              if (__props.pending) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "mt-1 h-7 w-10" }, null, _parent2, _scopeId));
              } else {
                _push2(`<div class="mt-1 text-2xl font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.stats?.[item.key] ?? 0)}</div>`);
              }
              _push2(`</div></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex items-center gap-4" }, [
                  vueExports.createVNode("div", { class: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: item.icon,
                      class: ["size-5", item.color]
                    }, null, 8, ["name", "class"])
                  ]),
                  vueExports.createVNode("div", { class: "min-w-0" }, [
                    vueExports.createVNode("div", { class: "text-sm text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(item.label), 1),
                    __props.pending ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                      key: 0,
                      class: "mt-1 h-7 w-10"
                    })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "mt-1 text-2xl font-bold text-slate-900"
                    }, vueExports.toDisplayString(__props.stats?.[item.key] ?? 0), 1))
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/platform-project/PlatformProjectStatsBar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "PlatformProjectStatsBar" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PlatformProjectCreateModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) },
    errorMessage: { default: null }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formState = vueExports.reactive({
      organization_id: null,
      code: "",
      name: "",
      address: "",
      status: CreatePlatformProjectRequestStatus.managing
    });
    vueExports.watch(
      () => props.open,
      (open) => {
        if (open) {
          formState.organization_id = null;
          formState.code = "";
          formState.name = "";
          formState.address = "";
          formState.status = CreatePlatformProjectRequestStatus.managing;
        }
      }
    );
    function handleSubmit() {
      if (!formState.organization_id) return;
      emit("submit", {
        organization_id: formState.organization_id,
        code: formState.code.trim(),
        name: formState.name.trim(),
        address: formState.address.trim() || null,
        status: formState.status
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$9;
      const _component_UAlert = _sfc_main$5;
      const _component_UFormField = _sfc_main$d;
      const _component_SharedOrganizationSelect = __nuxt_component_3;
      const _component_SharedCrudFormFieldError = __nuxt_component_4;
      const _component_UInput = _sfc_main$3;
      const _component_USelect = _sfc_main$4;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Thêm dự án",
        description: "Tạo dự án mới và gán vào một công ty vận hành đang hoạt động.",
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (__props.errorMessage) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "subtle",
                icon: "i-lucide-circle-alert",
                description: __props.errorMessage
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Công ty vận hành",
              name: "organization_id",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOrganizationSelect, {
                    modelValue: vueExports.unref(formState).organization_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).organization_id = $event,
                    placeholder: "Chọn công ty vận hành"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.organization_id
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedOrganizationSelect, {
                      modelValue: vueExports.unref(formState).organization_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).organization_id = $event,
                      placeholder: "Chọn công ty vận hành"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.organization_id
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mã dự án",
              name: "code",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                    placeholder: "VD: DA-001",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.code
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).code,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                      placeholder: "VD: DA-001",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.code
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Trạng thái",
              name: "status"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(formState).status,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                    items: [...vueExports.unref(PROJECT_STATUS_OPTIONS)],
                    "value-key": "value",
                    "label-key": "label",
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
                      items: [...vueExports.unref(PROJECT_STATUS_OPTIONS)],
                      "value-key": "value",
                      "label-key": "label",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.status
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên dự án",
              name: "name",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
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
              label: "Địa chỉ",
              name: "address"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).address,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.address
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).address,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.address
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-4" }, [
                __props.errorMessage ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  variant: "subtle",
                  icon: "i-lucide-circle-alert",
                  description: __props.errorMessage
                }, null, 8, ["description"])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_UFormField, {
                  label: "Công ty vận hành",
                  name: "organization_id",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_SharedOrganizationSelect, {
                      modelValue: vueExports.unref(formState).organization_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).organization_id = $event,
                      placeholder: "Chọn công ty vận hành"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.organization_id
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Mã dự án",
                    name: "code",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(formState).code,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                        placeholder: "VD: DA-001",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.code
                      }, null, 8, ["errors"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, {
                    label: "Trạng thái",
                    name: "status"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_USelect, {
                        modelValue: vueExports.unref(formState).status,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                        items: [...vueExports.unref(PROJECT_STATUS_OPTIONS)],
                        "value-key": "value",
                        "label-key": "label",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.status
                      }, null, 8, ["errors"])
                    ]),
                    _: 1
                  })
                ]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Tên dự án",
                  name: "name",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.name
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Địa chỉ",
                  name: "address"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).address,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.address
                    }, null, 8, ["errors"])
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
              variant: "outline",
              label: "Huỷ",
              disabled: __props.loading,
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "primary",
              icon: "i-lucide-plus",
              label: __props.loading ? "Đang tạo..." : "Tạo dự án",
              loading: __props.loading,
              disabled: !vueExports.unref(formState).organization_id || !vueExports.unref(formState).code.trim() || !vueExports.unref(formState).name.trim(),
              onClick: handleSubmit
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Huỷ",
                  disabled: __props.loading,
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["disabled", "onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "primary",
                  icon: "i-lucide-plus",
                  label: __props.loading ? "Đang tạo..." : "Tạo dự án",
                  loading: __props.loading,
                  disabled: !vueExports.unref(formState).organization_id || !vueExports.unref(formState).code.trim() || !vueExports.unref(formState).name.trim(),
                  onClick: handleSubmit
                }, null, 8, ["label", "loading", "disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/platform-project/PlatformProjectCreateModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main$1, { __name: "PlatformProjectCreateModal" });
const DETAIL_BASE = "/platform/quan-ly-van-hanh/du-an-tren-nen-tang";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Dự án trên nền tảng - Thần Nông" });
    const router = useRouter();
    const toast = useToast();
    function detailTo(row) {
      return `${DETAIL_BASE}/${row.id}?tenant=${row.tenant.id}`;
    }
    const params = vueExports.reactive({
      search: void 0,
      status: void 0,
      organization_id: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const statusItems = [
      { value: "all", label: "Tất cả trạng thái" },
      ...PROJECT_STATUS_OPTIONS
    ];
    const statusFilter = vueExports.ref("all");
    vueExports.watch(statusFilter, (value) => {
      params.status = value === "all" ? void 0 : value;
      page.value = 1;
    });
    const tenantFilter = vueExports.ref(null);
    vueExports.watch(tenantFilter, (value) => {
      params.organization_id = value || void 0;
      page.value = 1;
    });
    const hasFilters = vueExports.computed(
      () => !!searchInput.value || statusFilter.value !== "all" || !!tenantFilter.value
    );
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      statusFilter.value = "all";
      params.status = void 0;
      tenantFilter.value = null;
      params.organization_id = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = useListPlatformProjects(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const projects = vueExports.computed(() => data.value?.data ?? []);
    const stats = vueExports.computed(() => data.value?.stats ?? null);
    const columns = [
      { accessorKey: "code", header: "Mã dự án" },
      { accessorKey: "name", header: "Tên dự án" },
      { accessorKey: "address", header: "Địa chỉ" },
      { id: "status", header: "Trạng thái" },
      { id: "tenant", header: "Công ty vận hành" },
      { id: "tenant_active", header: "Tenant" },
      { id: "platform_service", header: "Dịch vụ platform" },
      stickyRight({ id: "actions", header: "Thao tác" }, { width: "w-[150px] min-w-[150px]" })
    ];
    const showCreateModal = vueExports.ref(false);
    const isCreating = vueExports.ref(false);
    const createApiErrors = vueExports.ref({});
    const createErrorMessage = vueExports.ref(null);
    function openCreateModal() {
      createApiErrors.value = {};
      createErrorMessage.value = null;
      showCreateModal.value = true;
    }
    async function handleCreate(payload) {
      createApiErrors.value = {};
      createErrorMessage.value = null;
      isCreating.value = true;
      try {
        const { organization_id, ...data2 } = payload;
        const res = await apiCreatePlatformProject(organization_id, data2);
        toast.add({ title: "Tạo dự án thành công", color: "success", icon: "i-lucide-check-circle" });
        showCreateModal.value = false;
        await router.push(`${DETAIL_BASE}/${res.data.id}?tenant=${organization_id}`);
      } catch (err) {
        const errors = getApiValidationErrors(err);
        if (errors) {
          createApiErrors.value = errors;
        } else {
          createErrorMessage.value = getApiErrorMessage(err, "Không thể tạo dự án");
        }
      } finally {
        isCreating.value = false;
      }
    }
    const toggleTarget = vueExports.ref(null);
    const showToggleConfirm = vueExports.ref(false);
    const isToggling = vueExports.ref(false);
    const toggleEnable = vueExports.computed(() => !(toggleTarget.value?.platform_service_enabled ?? true));
    function openToggleConfirm(item) {
      toggleTarget.value = item;
      showToggleConfirm.value = true;
    }
    async function confirmToggle() {
      if (!toggleTarget.value) return;
      isToggling.value = true;
      try {
        await apiToggleProjectService(toggleTarget.value.tenant.id, toggleTarget.value.id, toggleEnable.value);
        toast.add({
          title: toggleEnable.value ? "Đã bật cung cấp dịch vụ" : "Đã ngừng cung cấp dịch vụ",
          color: "success",
          icon: "i-lucide-check-circle"
        });
        showToggleConfirm.value = false;
        await refresh();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Không thể cập nhật trạng thái dịch vụ"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isToggling.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PlatformProjectStatsBar = __nuxt_component_0;
      const _component_UInput = _sfc_main$3;
      const _component_USelect = _sfc_main$4;
      const _component_SharedOrganizationSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$5;
      const _component_UTable = _sfc_main$6;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$8;
      const _component_UEmpty = _sfc_main$7;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_PlatformProjectCreateModal = __nuxt_component_11;
      const _component_UModal = _sfc_main$9;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6"><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Dự án trên nền tảng </h1><p class="text-slate-500 text-sm mt-1"> Tổng hợp toàn bộ dự án trên nền tảng — mỗi dự án thuộc một công ty vận hành. Thêm dự án mới, xem chi tiết và cấu hình phí nền tảng riêng theo dự án. </p></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformProjectStatsBar, {
        stats: vueExports.unref(stats),
        pending: vueExports.unref(status) === "pending" && !vueExports.unref(data)
      }, null, _parent));
      _push(`<div class="mb-4 flex items-center gap-3 flex-wrap">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo mã, tên, địa chỉ, công ty VH...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(statusFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(statusFilter) ? statusFilter.value = $event : null,
        items: statusItems,
        "value-key": "value",
        "label-key": "label",
        size: "sm",
        class: "w-44"
      }, null, _parent));
      _push(`<div class="w-56">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOrganizationSelect, {
        modelValue: vueExports.unref(tenantFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(tenantFilter) ? tenantFilter.value = $event : null,
        placeholder: "Lọc theo công ty VH"
      }, null, _parent));
      _push(`</div>`);
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
        label: "Thêm dự án",
        onClick: openCreateModal
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không thể tải danh sách dự án. Dữ liệu gộp từ nhiều công ty vận hành có thể tải chậm — vui lòng thử lại.",
          class: "mb-4"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(projects),
        columns,
        loading: vueExports.unref(status) === "pending"
      }, {
        "code-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: detailTo(row.original),
              class: "font-mono text-primary-600 hover:underline"
            }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.code), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_NuxtLink, {
                to: detailTo(row.original),
                class: "font-mono text-primary-600 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.code), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ];
          }
        }),
        "name-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: detailTo(row.original),
              class: "font-medium text-slate-900 hover:text-primary-600 hover:underline"
            }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.name)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_NuxtLink, {
                to: detailTo(row.original),
                class: "font-medium text-slate-900 hover:text-primary-600 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.name), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ];
          }
        }),
        "address-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.address) {
              _push2(`<span class="text-sm text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.address)}</span>`);
            } else {
              _push2(`<span class="text-xs text-gray-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.address ? (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 0,
                class: "text-sm text-slate-700"
              }, vueExports.toDisplayString(row.original.address), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-xs text-gray-400"
              }, "—"))
            ];
          }
        }),
        "status-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: row.original.status.value === "managing" ? "success" : "neutral",
              variant: "subtle",
              label: row.original.status.label
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: row.original.status.value === "managing" ? "success" : "neutral",
                variant: "subtle",
                label: row.original.status.label
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        "tenant-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: `/platform/tenants/${row.original.tenant.id}`,
              class: "text-sm text-slate-700 hover:text-primary-600 hover:underline"
            }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.tenant.code)}</span> — ${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.tenant.name)}`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(row.original.tenant.code), 1),
                    vueExports.createTextVNode(" — " + vueExports.toDisplayString(row.original.tenant.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_NuxtLink, {
                to: `/platform/tenants/${row.original.tenant.id}`,
                class: "text-sm text-slate-700 hover:text-primary-600 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(row.original.tenant.code), 1),
                  vueExports.createTextVNode(" — " + vueExports.toDisplayString(row.original.tenant.name), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ];
          }
        }),
        "tenant_active-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: row.original.tenant.is_active ? "success" : "warning",
              variant: "subtle",
              label: row.original.tenant.is_active ? "Hoạt động" : "Vô hiệu"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: row.original.tenant.is_active ? "success" : "warning",
                variant: "subtle",
                label: row.original.tenant.is_active ? "Hoạt động" : "Vô hiệu"
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        "platform_service-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: row.original.platform_service_enabled ? "success" : "warning",
              variant: "subtle",
              label: row.original.platform_service_enabled ? "Đang cung cấp" : "Ngừng cung cấp"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: row.original.platform_service_enabled ? "success" : "warning",
                variant: "subtle",
                label: row.original.platform_service_enabled ? "Đang cung cấp" : "Ngừng cung cấp"
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        "actions-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-end gap-1"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              to: detailTo(row.original),
              icon: "i-lucide-eye",
              color: "neutral",
              variant: "ghost",
              size: "sm",
              title: "Xem chi tiết"
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              to: `/platform/tenants/${row.original.tenant.id}`,
              icon: "i-lucide-building-2",
              color: "neutral",
              variant: "ghost",
              size: "sm",
              title: "Xem công ty vận hành"
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: row.original.platform_service_enabled ? "i-lucide-power-off" : "i-lucide-power",
              color: "neutral",
              variant: "ghost",
              size: "sm",
              class: row.original.platform_service_enabled ? "hover:!text-amber-600 hover:!bg-amber-50" : "hover:!text-emerald-600 hover:!bg-emerald-50",
              title: row.original.platform_service_enabled ? "Ngừng cung cấp dịch vụ" : "Bật cung cấp dịch vụ",
              onClick: ($event) => openToggleConfirm(row.original)
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center justify-end gap-1" }, [
                vueExports.createVNode(_component_UButton, {
                  to: detailTo(row.original),
                  icon: "i-lucide-eye",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  title: "Xem chi tiết"
                }, null, 8, ["to"]),
                vueExports.createVNode(_component_UButton, {
                  to: `/platform/tenants/${row.original.tenant.id}`,
                  icon: "i-lucide-building-2",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  title: "Xem công ty vận hành"
                }, null, 8, ["to"]),
                vueExports.createVNode(_component_UButton, {
                  icon: row.original.platform_service_enabled ? "i-lucide-power-off" : "i-lucide-power",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  class: row.original.platform_service_enabled ? "hover:!text-amber-600 hover:!bg-amber-50" : "hover:!text-emerald-600 hover:!bg-emerald-50",
                  title: row.original.platform_service_enabled ? "Ngừng cung cấp dịch vụ" : "Bật cung cấp dịch vụ",
                  onClick: ($event) => openToggleConfirm(row.original)
                }, null, 8, ["icon", "class", "title", "onClick"])
              ])
            ];
          }
        }),
        empty: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UEmpty, {
              icon: "i-lucide-folder-kanban",
              title: "Chưa có dự án nào",
              description: "Thêm dự án mới và gán vào một công ty vận hành để bắt đầu."
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UEmpty, {
                icon: "i-lucide-folder-kanban",
                title: "Chưa có dự án nào",
                description: "Thêm dự án mới và gán vào một công ty vận hành để bắt đầu."
              })
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformProjectCreateModal, {
        open: vueExports.unref(showCreateModal),
        "onUpdate:open": ($event) => vueExports.isRef(showCreateModal) ? showCreateModal.value = $event : null,
        loading: vueExports.unref(isCreating),
        "api-errors": vueExports.unref(createApiErrors),
        "error-message": vueExports.unref(createErrorMessage),
        onSubmit: handleCreate
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showToggleConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showToggleConfirm) ? showToggleConfirm.value = $event : null,
        title: vueExports.unref(toggleEnable) ? "Bật cung cấp dịch vụ" : "Ngừng cung cấp dịch vụ"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3 text-sm text-slate-700"${_scopeId}>`);
            if (vueExports.unref(toggleEnable)) {
              _push2(`<p${_scopeId}> Bật cung cấp dịch vụ nền tảng cho dự án <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(toggleTarget)?.name)}</strong>? </p>`);
            } else {
              _push2(`<p${_scopeId}> Ngừng cung cấp dịch vụ nền tảng cho dự án <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(toggleTarget)?.name)}</strong>? Phí nền tảng theo dự án vẫn được giữ nguyên, có thể bật lại sau. </p>`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-3 text-sm text-slate-700" }, [
                vueExports.unref(toggleEnable) ? (vueExports.openBlock(), vueExports.createBlock("p", { key: 0 }, [
                  vueExports.createTextVNode(" Bật cung cấp dịch vụ nền tảng cho dự án "),
                  vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(toggleTarget)?.name), 1),
                  vueExports.createTextVNode("? ")
                ])) : (vueExports.openBlock(), vueExports.createBlock("p", { key: 1 }, [
                  vueExports.createTextVNode(" Ngừng cung cấp dịch vụ nền tảng cho dự án "),
                  vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(toggleTarget)?.name), 1),
                  vueExports.createTextVNode("? Phí nền tảng theo dự án vẫn được giữ nguyên, có thể bật lại sau. ")
                ]))
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "ghost",
              disabled: vueExports.unref(isToggling),
              onClick: ($event) => showToggleConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: vueExports.unref(toggleEnable) ? "Bật cung cấp" : "Ngừng cung cấp",
              color: vueExports.unref(toggleEnable) ? "primary" : "warning",
              loading: vueExports.unref(isToggling),
              onClick: confirmToggle
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "ghost",
                  disabled: vueExports.unref(isToggling),
                  onClick: ($event) => showToggleConfirm.value = false
                }, null, 8, ["disabled", "onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: vueExports.unref(toggleEnable) ? "Bật cung cấp" : "Ngừng cung cấp",
                  color: vueExports.unref(toggleEnable) ? "primary" : "warning",
                  loading: vueExports.unref(isToggling),
                  onClick: confirmToggle
                }, null, 8, ["label", "color", "loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/quan-ly-van-hanh/du-an-tren-nen-tang/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-F0l95YCN.mjs.map
