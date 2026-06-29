import { v as vueExports, p as useRoute$1, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, k as _sfc_main$h } from './server.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_7 } from './StatusBadge-DeQimcpk.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$2 } from './Separator-DeO-OPIs.mjs';
import { _ as __nuxt_component_11 } from './RoleFormModal-C5YBlGwX.mjs';
import { _ as __nuxt_component_11$1 } from './DeleteModal-B4AevDGU.mjs';
import { u as useRoleDetail, a as usePermissionList, b as apiUpdateRole, c as apiDeleteRole } from './useRoles-Bl-GRSKI.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { u as useCheckDelete } from './useCheckDelete-ka2wDn0T.mjs';
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
import './apiError-DBrxF9au.mjs';
import './Separator-DtmsHEyk.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './index-QmZAbLx-.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './Input-JXN8po_F.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Textarea-DTCNHwKm.mjs';
import './Switch-1cJNH-6C.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './Checkbox-Cp_FPUkd.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './useDirection-CXYby7CP.mjs';
import './Alert-tTsPKADX.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useRoleDetail(id);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => data.value?.data?.name ?? null));
    const role = vueExports.computed(() => data.value?.data ?? null);
    const rolePermissions = vueExports.computed(() => {
      const raw = role.value?.permissions;
      if (!raw || !Array.isArray(raw)) return [];
      return raw;
    });
    const permissionGroups = vueExports.computed(() => {
      const groups = /* @__PURE__ */ new Map();
      for (const perm of rolePermissions.value) {
        const key = perm.sub_module.value;
        if (!groups.has(key)) {
          groups.set(key, { label: perm.sub_module.label, permissions: [] });
        }
        groups.get(key).permissions.push(perm);
      }
      return Array.from(groups.values());
    });
    const { data: permissionsData, execute: fetchPermissions } = usePermissionList({ immediate: false });
    const permissionsFetched = vueExports.ref(false);
    const allPermissions = vueExports.computed(() => {
      const raw = permissionsData.value?.data ?? [];
      return raw;
    });
    const crud = useCrudModals();
    const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget } = crud;
    const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    vueExports.watch(showFormModal, (open) => {
      if (open && !permissionsFetched.value) {
        permissionsFetched.value = true;
        fetchPermissions();
      }
    });
    function handleFormSubmit(formData) {
      submitForm(
        null,
        () => apiUpdateRole(editTarget.value.id, { name: formData.name, description: formData.description, is_active: formData.is_active, permission_ids: formData.permission_ids }),
        { update: "Cập nhật vai trò thành công" }
      );
    }
    const { deleteBlockedMessage, openDeleteModal: _openDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      deleteFn: apiDeleteRole,
      successMessage: "Đã xoá vai trò",
      errorFallback: "Không thể xoá vai trò này",
      navigateAfter: "/pmc/roles"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UBadge = _sfc_main$1;
      const _component_SharedStatusBadge = __nuxt_component_7;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UIcon = _sfc_main$h;
      const _component_USeparator = _sfc_main$2;
      const _component_RoleFormModal = __nuxt_component_11;
      const _component_SharedCrudDeleteModal = __nuxt_component_11$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-center gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/roles"
      }, null, _parent));
      _push(`<div><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Chi tiết vai trò </h1><p class="text-slate-500 text-sm mt-0.5">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(role)?.name ?? "...")}</p></div></div>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 flex flex-col gap-6"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(2, (i) => {
          _push(`<div class="h-48 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div><div class="flex flex-col gap-4"><div class="h-64 bg-slate-100 rounded-xl animate-pulse"></div></div></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(role)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 flex flex-col gap-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin vai trò" }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: vueExports.unref(role).type?.value === "default" ? "info" : "neutral",
                variant: "subtle",
                size: "sm"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(role).type?.label)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).type?.label), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
                active: Boolean(vueExports.unref(role).is_active),
                "inactive-label": "Tắt"
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UBadge, {
                  color: vueExports.unref(role).type?.value === "default" ? "info" : "neutral",
                  variant: "subtle",
                  size: "sm"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).type?.label), 1)
                  ]),
                  _: 1
                }, 8, ["color"]),
                vueExports.createVNode(_component_SharedStatusBadge, {
                  active: Boolean(vueExports.unref(role).is_active),
                  "inactive-label": "Tắt"
                }, null, 8, ["active"])
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên vai trò" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(role).name)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(role).name), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Loại vai trò" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      color: vueExports.unref(role).type?.value === "default" ? "info" : "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(role).type?.label)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).type?.label), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        color: vueExports.unref(role).type?.value === "default" ? "info" : "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).type?.label), 1)
                        ]),
                        _: 1
                      }, 8, ["color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Phòng ban" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(role).department) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/departments/${vueExports.unref(role).department.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(role).department.name)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).department.name), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(role).department ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/departments/${vueExports.unref(role).department.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).department.name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Chức danh" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(role).job_title) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/job-titles/${vueExports.unref(role).job_title.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(role).job_title.name)}`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).job_title.name), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(role).job_title ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/job-titles/${vueExports.unref(role).job_title.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).job_title.name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(role).description) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                  label: "Mô tả",
                  class: "sm:col-span-2"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<p class="leading-relaxed whitespace-pre-wrap"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(role).description)}</p>`);
                    } else {
                      return [
                        vueExports.createVNode("p", { class: "leading-relaxed whitespace-pre-wrap" }, vueExports.toDisplayString(vueExports.unref(role).description), 1)
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
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên vai trò" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(role).name), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Loại vai trò" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        color: vueExports.unref(role).type?.value === "default" ? "info" : "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).type?.label), 1)
                        ]),
                        _: 1
                      }, 8, ["color"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Phòng ban" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(role).department ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/departments/${vueExports.unref(role).department.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).department.name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Chức danh" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(role).job_title ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/job-titles/${vueExports.unref(role).job_title.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).job_title.name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ]),
                    _: 1
                  }),
                  vueExports.unref(role).description ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 0,
                    label: "Mô tả",
                    class: "sm:col-span-2"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("p", { class: "leading-relaxed whitespace-pre-wrap" }, vueExports.toDisplayString(vueExports.unref(role).description), 1)
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Phân quyền" }, {
          "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(rolePermissions).length)} quyền </span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "text-xs text-slate-500" }, vueExports.toDisplayString(vueExports.unref(rolePermissions).length) + " quyền ", 1)
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (vueExports.unref(permissionGroups).length > 0) {
                _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(permissionGroups), (group, index) => {
                  _push2(`<div${_scopeId}><div class="flex items-center gap-3 mb-2.5"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-shield",
                    class: "text-slate-400 size-4 shrink-0"
                  }, null, _parent2, _scopeId));
                  _push2(`<span class="text-sm font-semibold text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(group.label)}</span><span class="text-xs text-slate-400"${_scopeId}>(${serverRenderer_cjs_prodExports.ssrInterpolate(group.permissions.length)})</span></div><div class="flex flex-wrap gap-2 ml-7"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(group.permissions, (perm) => {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      key: perm.id,
                      color: "primary",
                      variant: "subtle",
                      size: "sm"
                    }, {
                      default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(perm.action.label)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(perm.action.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  });
                  _push2(`<!--]--></div>`);
                  if (index < vueExports.unref(permissionGroups).length - 1) {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, { class: "mt-4" }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<div class="py-6 text-center"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-shield-off",
                  class: "text-slate-300 size-10 mx-auto mb-3"
                }, null, _parent2, _scopeId));
                _push2(`<p class="text-sm text-slate-500"${_scopeId}> Chưa có quyền nào được gán </p></div>`);
              }
            } else {
              return [
                vueExports.unref(permissionGroups).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "space-y-4"
                }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(permissionGroups), (group, index) => {
                    return vueExports.openBlock(), vueExports.createBlock("div", {
                      key: group.label
                    }, [
                      vueExports.createVNode("div", { class: "flex items-center gap-3 mb-2.5" }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-shield",
                          class: "text-slate-400 size-4 shrink-0"
                        }),
                        vueExports.createVNode("span", { class: "text-sm font-semibold text-slate-700" }, vueExports.toDisplayString(group.label), 1),
                        vueExports.createVNode("span", { class: "text-xs text-slate-400" }, "(" + vueExports.toDisplayString(group.permissions.length) + ")", 1)
                      ]),
                      vueExports.createVNode("div", { class: "flex flex-wrap gap-2 ml-7" }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(group.permissions, (perm) => {
                          return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                            key: perm.id,
                            color: "primary",
                            variant: "subtle",
                            size: "sm"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(perm.action.label), 1)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      index < vueExports.unref(permissionGroups).length - 1 ? (vueExports.openBlock(), vueExports.createBlock(_component_USeparator, {
                        key: 0,
                        class: "mt-4"
                      })) : vueExports.createCommentVNode("", true)
                    ]);
                  }), 128))
                ])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "py-6 text-center"
                }, [
                  vueExports.createVNode(_component_UIcon, {
                    name: "i-lucide-shield-off",
                    class: "text-slate-300 size-10 mx-auto mb-3"
                  }),
                  vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Chưa có quyền nào được gán ")
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="flex flex-col gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Thao tác",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-2.5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-pencil",
                label: "Chỉnh sửa vai trò",
                variant: "soft",
                color: "primary",
                class: "w-full justify-start",
                onClick: ($event) => vueExports.unref(openEditModal)(vueExports.unref(role))
              }, null, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-trash-2",
                label: "Xoá vai trò",
                variant: "soft",
                color: "error",
                class: "w-full justify-start",
                onClick: ($event) => vueExports.unref(_openDeleteModal)(vueExports.unref(role))
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-2.5" }, [
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-pencil",
                    label: "Chỉnh sửa vai trò",
                    variant: "soft",
                    color: "primary",
                    class: "w-full justify-start",
                    onClick: ($event) => vueExports.unref(openEditModal)(vueExports.unref(role))
                  }, null, 8, ["onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-trash-2",
                    label: "Xoá vai trò",
                    variant: "soft",
                    color: "error",
                    class: "w-full justify-start",
                    onClick: ($event) => vueExports.unref(_openDeleteModal)(vueExports.unref(role))
                  }, null, 8, ["onClick"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Liên kết",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Phòng ban" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(role).department) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/departments/${vueExports.unref(role).department.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline inline-flex items-center gap-1"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(role).department.name)} `);
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                              name: "i-lucide-external-link",
                              class: "size-3.5"
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).department.name) + " ", 1),
                              vueExports.createVNode(_component_UIcon, {
                                name: "i-lucide-external-link",
                                class: "size-3.5"
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(role).department ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/departments/${vueExports.unref(role).department.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline inline-flex items-center gap-1"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).department.name) + " ", 1),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-external-link",
                            class: "size-3.5"
                          })
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Chức danh" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(role).job_title) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                        to: `/pmc/job-titles/${vueExports.unref(role).job_title.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline inline-flex items-center gap-1"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(role).job_title.name)} `);
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                              name: "i-lucide-external-link",
                              class: "size-3.5"
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).job_title.name) + " ", 1),
                              vueExports.createVNode(_component_UIcon, {
                                name: "i-lucide-external-link",
                                class: "size-3.5"
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(role).job_title ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/job-titles/${vueExports.unref(role).job_title.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline inline-flex items-center gap-1"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).job_title.name) + " ", 1),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-external-link",
                            class: "size-3.5"
                          })
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
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
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
                      active: Boolean(vueExports.unref(role).is_active),
                      "inactive-label": "Tắt"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedStatusBadge, {
                        active: Boolean(vueExports.unref(role).is_active),
                        "inactive-label": "Tắt"
                      }, null, 8, ["active"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-3" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Phòng ban" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(role).department ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/departments/${vueExports.unref(role).department.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline inline-flex items-center gap-1"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).department.name) + " ", 1),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-external-link",
                            class: "size-3.5"
                          })
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Chức danh" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(role).job_title ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/job-titles/${vueExports.unref(role).job_title.id}`,
                        class: "font-medium text-primary-600 hover:text-primary-800 hover:underline inline-flex items-center gap-1"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(role).job_title.name) + " ", 1),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-external-link",
                            class: "size-3.5"
                          })
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedStatusBadge, {
                        active: Boolean(vueExports.unref(role).is_active),
                        "inactive-label": "Tắt"
                      }, null, 8, ["active"])
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_RoleFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isUpdating),
        "api-errors": vueExports.unref(formApiErrors),
        permissions: vueExports.unref(allPermissions),
        onSubmit: handleFormSubmit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá vai trò",
        "item-name": vueExports.unref(deleteTarget)?.name,
        "blocked-message": vueExports.unref(deleteBlockedMessage),
        loading: vueExports.unref(isDeleting),
        onConfirm: vueExports.unref(handleDelete)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/roles/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CcrjkhYF.mjs.map
