import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { a as __nuxt_component_4, _ as __nuxt_component_10$1 } from './DepartmentFormModal-LJgYT5QE.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$2 } from './Table-17SH0cIR.mjs';
import { _ as __nuxt_component_3$1 } from './TableActions-b69bU2gG.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { u as useDepartmentList, a as apiCreateDepartment, b as apiUpdateDepartment, c as apiDeleteDepartment } from './useDepartments-C8BvGnCs.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
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
import './SelectMenu-DKHEMZj7.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useProjects-D4K3VYdb.mjs';
import './BaseFormModal-CG7aCaIV.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Alert-tTsPKADX.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Textarea-DTCNHwKm.mjs';
import './PageError-kZWsA9dh.mjs';
import './apiError-DBrxF9au.mjs';
import './Pagination-fZq_Msxb.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const params = vueExports.reactive({
      project_id: void 0,
      search: void 0,
      parent_id: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value;
      page.value = 1;
    });
    const selectedProjectId = vueExports.ref(null);
    const selectedParentId = vueExports.ref(null);
    const { isInitFromUrl } = useUrlFilters({
      search: { ref: vueExports.toRef(params, "search"), type: "string", onInit: (v) => {
        searchInput.value = String(v);
      } },
      page: { ref: page, type: "number", defaultValue: 1 },
      project_id: { ref: selectedProjectId, type: "number", onInit: (v) => {
        params.project_id = v;
      } },
      parent_id: { ref: selectedParentId, type: "number", onInit: (v) => {
        params.parent_id = v;
      } }
    });
    vueExports.watch(selectedProjectId, (val) => {
      params.project_id = val ?? void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedParentId, (val) => {
      params.parent_id = val ?? void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value || !!selectedProjectId.value || !!selectedParentId.value);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      selectedProjectId.value = null;
      selectedParentId.value = null;
      page.value = 1;
    }
    const { data, status, error, refresh } = useDepartmentList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const departments = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { accessorKey: "code", header: "Mã" },
      { accessorKey: "name", header: "Tên phòng ban" },
      { id: "parent", header: "Phòng ban cha" },
      { id: "project", header: "Dự án" },
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
      deleteTarget,
      openDeleteModal
    } = crud;
    const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    function handleFormSubmit(formData) {
      submitForm(
        () => apiCreateDepartment(formData),
        () => apiUpdateDepartment(editTarget.value.id, { project_id: formData.project_id, name: formData.name, parent_id: formData.parent_id, description: formData.description }),
        { create: "Thêm phòng ban thành công", update: "Cập nhật phòng ban thành công" }
      );
    }
    function handleDelete() {
      submitDelete(
        () => apiDeleteDepartment(deleteTarget.value.id),
        { message: "Đã xoá phòng ban" }
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$1;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_SharedDepartmentParentSelect = __nuxt_component_4;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_SharedCrudTableActions = __nuxt_component_3$1;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_DepartmentFormModal = __nuxt_component_10$1;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Phòng ban",
        description: "Quản lý danh sách phòng ban"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Thêm phòng ban",
              onClick: vueExports.unref(openCreateModal)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Thêm phòng ban",
                onClick: vueExports.unref(openCreateModal)
              }, null, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mb-4 flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm kiếm phòng ban...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
        modelValue: vueExports.unref(selectedProjectId),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
        placeholder: "Lọc dự án",
        class: "w-56"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedDepartmentParentSelect, {
        modelValue: vueExports.unref(selectedParentId),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedParentId) ? selectedParentId.value = $event : null,
        class: "w-56"
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
              data: vueExports.unref(departments),
              columns
            }, {
              "parent-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.parent) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/departments/${row.original.parent.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.parent.name)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.parent.name), 1)
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
                    row.original.parent ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/departments/${row.original.parent.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.parent.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ];
                }
              }),
              "project-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.project) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/projects/${row.original.project.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project.name)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.project.name), 1)
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
                    row.original.project ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/projects/${row.original.project.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.project.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
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
                    "detail-to": `/pmc/departments/${row.original.id}`,
                    onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                    onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/departments/${row.original.id}`,
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
                  data: vueExports.unref(departments),
                  columns
                }, {
                  "parent-cell": vueExports.withCtx(({ row }) => [
                    row.original.parent ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/departments/${row.original.parent.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.parent.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ]),
                  "project-cell": vueExports.withCtx(({ row }) => [
                    row.original.project ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/pmc/projects/${row.original.project.id}`,
                      class: "text-blue-600 hover:text-blue-800 hover:underline"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.project.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                  ]),
                  "description-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.description ?? "—"), 1)
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/departments/${row.original.id}`,
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_DepartmentFormModal, {
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
        title: "Xoá phòng ban",
        "item-name": vueExports.unref(deleteTarget)?.name,
        loading: vueExports.unref(isDeleting),
        onConfirm: handleDelete
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/departments/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CVkXz6oE.mjs.map
