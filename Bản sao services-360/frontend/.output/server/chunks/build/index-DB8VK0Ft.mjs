import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$2 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_3 } from './TableActions-b69bU2gG.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_9 } from './ProjectFormModal-DmXkzlFJ.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { d as useProjectList, f as apiCreateProject, a as apiUpdateProject, b as apiDeleteProject } from './useProjects-D4K3VYdb.mjs';
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
import './BaseFormModal-CG7aCaIV.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Alert-tTsPKADX.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './FormFieldError-cu7WK1i1.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const params = vueExports.reactive({
      search: void 0,
      status: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value;
      page.value = 1;
    });
    const selectedStatus = vueExports.ref(void 0);
    const { isInitFromUrl } = useUrlFilters({
      search: { ref: vueExports.toRef(params, "search"), type: "string", onInit: (v) => {
        searchInput.value = String(v);
      } },
      page: { ref: page, type: "number", defaultValue: 1 },
      status: { ref: selectedStatus, type: "string", onInit: (v) => {
        params.status = v;
      } }
    });
    vueExports.watch(selectedStatus, (val) => {
      params.status = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    const statusFilterOptions = [
      { label: "Đang quản lý", value: "managing" },
      { label: "Đã dừng", value: "stopped" }
    ];
    const hasFilters = vueExports.computed(() => !!searchInput.value || !!selectedStatus.value);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      selectedStatus.value = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = useProjectList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const projects = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { accessorKey: "code", header: "Mã" },
      { accessorKey: "name", header: "Tên" },
      { id: "address", header: "Địa chỉ" },
      { id: "status", header: "Trạng thái" },
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
        () => apiCreateProject({ code: formData.code, name: formData.name, address: formData.address, status: formData.status }),
        () => apiUpdateProject(editTarget.value.id, { name: formData.name, address: formData.address, status: formData.status }),
        { create: "Thêm dự án thành công", update: "Cập nhật dự án thành công" }
      );
    }
    function handleDelete() {
      submitDelete(
        () => apiDeleteProject(deleteTarget.value.id),
        { message: "Đã xoá dự án" }
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$1;
      const _component_USelect = _sfc_main$2;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      const _component_SharedCrudTableActions = __nuxt_component_3;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_ProjectFormModal = __nuxt_component_9;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Dự án",
        description: "Quản lý danh mục dự án (khu đô thị)"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Thêm dự án",
              onClick: vueExports.unref(openCreateModal)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Thêm dự án",
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
        placeholder: "Tìm kiếm dự án...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedStatus),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedStatus) ? selectedStatus.value = $event : null,
        items: statusFilterOptions,
        placeholder: "Trạng thái",
        class: "w-48"
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
              data: vueExports.unref(projects),
              columns
            }, {
              "address-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.address ?? "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.address ?? "—"), 1)
                  ];
                }
              }),
              "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.status.label,
                    color: row.original.status.value === "managing" ? "success" : "error",
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: row.original.status.value === "managing" ? "success" : "error",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableActions, {
                    "detail-to": `/pmc/projects/${row.original.id}`,
                    onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                    onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/projects/${row.original.id}`,
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
                  data: vueExports.unref(projects),
                  columns
                }, {
                  "address-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.address ?? "—"), 1)
                  ]),
                  "status-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: row.original.status.value === "managing" ? "success" : "error",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/projects/${row.original.id}`,
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ProjectFormModal, {
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
        title: "Xoá dự án",
        "item-name": vueExports.unref(deleteTarget)?.name,
        description: "Tất cả nhân viên đã gán vào dự án này cũng sẽ bị gỡ khỏi dự án.",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/projects/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DB8VK0Ft.mjs.map
