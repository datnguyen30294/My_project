import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$2 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_7 } from './StatusBadge-DeQimcpk.mjs';
import { _ as __nuxt_component_3 } from './TableActions-b69bU2gG.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_11 } from './RoleFormModal-C5YBlGwX.mjs';
import { _ as __nuxt_component_11$1 } from './DeleteModal-B4AevDGU.mjs';
import { a as usePermissionList, d as useRoleList, e as apiCreateRole, b as apiUpdateRole, c as apiDeleteRole } from './useRoles-Bl-GRSKI.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
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
import './index-QmZAbLx-.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './PageError-kZWsA9dh.mjs';
import './apiError-DBrxF9au.mjs';
import './index-CSThDD3J.mjs';
import './Pagination-fZq_Msxb.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Textarea-DTCNHwKm.mjs';
import './Switch-1cJNH-6C.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './Checkbox-Cp_FPUkd.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './Alert-tTsPKADX.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { data: permissionsData, execute: fetchPermissions } = usePermissionList({ immediate: false });
    const permissionsFetched = vueExports.ref(false);
    const permissions = vueExports.computed(() => permissionsData.value?.data ?? []);
    const params = vueExports.reactive({
      search: void 0,
      type: void 0,
      is_active: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value;
      page.value = 1;
    });
    const typeOptions = [
      { label: "Mặc định", value: "default" },
      { label: "Tùy chỉnh", value: "custom" }
    ];
    const selectedType = vueExports.ref(void 0);
    const { isInitFromUrl } = useUrlFilters({
      search: { ref: vueExports.toRef(params, "search"), type: "string", onInit: (v) => {
        searchInput.value = String(v);
      } },
      type: { ref: selectedType, type: "string", onInit: (v) => {
        params.type = v;
      } },
      page: { ref: page, type: "number", defaultValue: 1 }
    });
    vueExports.watch(selectedType, (val) => {
      if (isInitFromUrl.value) return;
      params.type = val || void 0;
      page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value || !!selectedType.value);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      selectedType.value = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = useRoleList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const roles = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { accessorKey: "name", header: "Tên vai trò" },
      { id: "type", header: "Loại" },
      { id: "department", header: "Phòng ban" },
      { id: "job_title", header: "Chức danh" },
      { id: "is_active", header: "Trạng thái" },
      { accessorKey: "description", header: "Mô tả" },
      stickyRight({ id: "actions", header: "Thao tác" })
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
      deleteTarget
    } = crud;
    const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    vueExports.watch(showFormModal, (open) => {
      if (open && !permissionsFetched.value) {
        permissionsFetched.value = true;
        fetchPermissions();
      }
    });
    function handleFormSubmit(formData) {
      submitForm(
        () => apiCreateRole({ name: formData.name, description: formData.description, is_active: formData.is_active, permission_ids: formData.permission_ids }),
        () => apiUpdateRole(editTarget.value.id, { name: formData.name, description: formData.description, is_active: formData.is_active, permission_ids: formData.permission_ids }),
        { create: "Thêm vai trò thành công", update: "Cập nhật vai trò thành công" }
      );
    }
    const { deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      deleteFn: apiDeleteRole,
      successMessage: "Đã xoá vai trò",
      errorFallback: "Không thể xoá vai trò này"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$1;
      const _component_USelect = _sfc_main$2;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_SharedStatusBadge = __nuxt_component_7;
      const _component_SharedCrudTableActions = __nuxt_component_3;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_RoleFormModal = __nuxt_component_11;
      const _component_SharedCrudDeleteModal = __nuxt_component_11$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Vai trò",
        description: "Quản lý vai trò và phân quyền"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Thêm vai trò",
              onClick: vueExports.unref(openCreateModal)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Thêm vai trò",
                onClick: vueExports.unref(openCreateModal)
              }, null, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mb-4 flex flex-wrap items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm kiếm vai trò...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedType),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedType) ? selectedType.value = $event : null,
        items: typeOptions,
        placeholder: "Loại vai trò",
        class: "w-40"
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
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
        status: vueExports.unref(status),
        error: vueExports.unref(error),
        data: vueExports.unref(data),
        refresh: vueExports.unref(refresh)
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(roles),
              columns
            }, {
              "type-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: row.original.type?.value === "default" ? "info" : "neutral",
                    variant: "subtle"
                  }, {
                    default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.type?.label)}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.type?.label), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      color: row.original.type?.value === "default" ? "info" : "neutral",
                      variant: "subtle"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.type?.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "department-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.department) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/departments/${row.original.department.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.department.name)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.department.name), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<span${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.department ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/departments/${row.original.department.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.department.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ];
                }
              }),
              "job_title-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.job_title) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/job-titles/${row.original.job_title.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.job_title.name)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.job_title.name), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<span${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.job_title ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/job-titles/${row.original.job_title.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.job_title.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ];
                }
              }),
              "is_active-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
                    active: Boolean(row.original.is_active),
                    "inactive-label": "Tắt"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedStatusBadge, {
                      active: Boolean(row.original.is_active),
                      "inactive-label": "Tắt"
                    }, null, 8, ["active"])
                  ];
                }
              }),
              "description-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.description ?? "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.description ?? "—"), 1)
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableActions, {
                    "detail-to": `/pmc/roles/${row.original.id}`,
                    onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                    onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/roles/${row.original.id}`,
                      onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                      onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                    }, null, 8, ["detail-to", "onEdit", "onDelete"])
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
          } else {
            return [
              vueExports.createVNode("div", { class: "bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm" }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(roles),
                  columns
                }, {
                  "type-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      color: row.original.type?.value === "default" ? "info" : "neutral",
                      variant: "subtle"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.type?.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ]),
                  "department-cell": vueExports.withCtx(({ row }) => [
                    row.original.department ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/departments/${row.original.department.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.department.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ]),
                  "job_title-cell": vueExports.withCtx(({ row }) => [
                    row.original.job_title ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/job-titles/${row.original.job_title.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.job_title.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ]),
                  "is_active-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_SharedStatusBadge, {
                      active: Boolean(row.original.is_active),
                      "inactive-label": "Tắt"
                    }, null, 8, ["active"])
                  ]),
                  "description-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.description ?? "—"), 1)
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/roles/${row.original.id}`,
                      onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                      onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                    }, null, 8, ["detail-to", "onEdit", "onDelete"])
                  ]),
                  _: 1
                }, 8, ["data"]),
                vueExports.createVNode(_component_SharedCrudTablePagination, {
                  page: vueExports.unref(page),
                  "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
                  meta: vueExports.unref(data)?.meta
                }, null, 8, ["page", "onUpdate:page", "meta"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_RoleFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isSubmitting),
        "api-errors": vueExports.unref(formApiErrors),
        permissions: vueExports.unref(permissions),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/roles/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DwpWp3QS.mjs.map
