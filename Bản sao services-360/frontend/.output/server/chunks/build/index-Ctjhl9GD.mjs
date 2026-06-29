import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, y as _sfc_main$f } from './server.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { a as __nuxt_component_3, _ as __nuxt_component_12 } from './CatalogItemFormModal-D472wqf5.mjs';
import { _ as _sfc_main$2 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$3 } from './Table-17SH0cIR.mjs';
import { _ as __nuxt_component_7 } from './StatusBadge-DeQimcpk.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_3$1 } from './TableActions-b69bU2gG.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { D as DEFAULT_PER_PAGE, S as SELECT_ALL_PER_PAGE, A as ACTIVE_STATUS_OPTIONS } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { d as useServiceCategoryList, k as useCatalogItemList, c as apiCreateCatalogItem, i as apiUpdateCatalogItem, j as apiDeleteCatalogItem } from './useCatalogItems-Db1MWi3b.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
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
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './ImageUpload-CCeUx1rz.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Separator-DeO-OPIs.mjs';
import './Separator-DtmsHEyk.mjs';
import './NumberInput-BfLKWOCC.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useCatalogSuppliers-DJ8n9zOn.mjs';
import './Textarea-DTCNHwKm.mjs';
import './RichTextEditor-CeP76v4Q.mjs';
import '@tiptap/vue-3';
import '@tiptap/starter-kit';
import '@tiptap/extension-underline';
import '@tiptap/extension-text-align';
import '@tiptap/extension-link';
import '@tiptap/extension-image';
import '@tiptap/extension-placeholder';
import '@tiptap/extension-table';
import '@tiptap/extension-table-row';
import '@tiptap/extension-table-header';
import '@tiptap/extension-table-cell';
import './Switch-1cJNH-6C.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './PageError-kZWsA9dh.mjs';
import './apiError-DBrxF9au.mjs';
import './Pagination-fZq_Msxb.mjs';
import './Alert-tTsPKADX.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const tabs = [
      { label: "Vật tư", value: "material" },
      { label: "Dịch vụ", value: "service" },
      { label: "Dịch vụ tùy chọn", value: "adhoc" }
    ];
    const activeTab = vueExports.ref("material");
    const params = vueExports.reactive({
      search: void 0,
      type: "material",
      supplier_id: void 0,
      service_category_id: void 0,
      status: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value;
      page.value = 1;
    });
    const selectedStatus = vueExports.ref(void 0);
    const selectedSupplierId = vueExports.ref(void 0);
    const selectedCategoryId = vueExports.ref(void 0);
    const statusOptions = ACTIVE_STATUS_OPTIONS;
    const { data: categoriesData } = useServiceCategoryList(vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE, status: "active" })));
    const categoryFilterOptions = vueExports.computed(
      () => (categoriesData.value?.data ?? []).map((c) => ({ label: c.name, value: c.id }))
    );
    const { isInitFromUrl } = useUrlFilters({
      search: { ref: vueExports.toRef(params, "search"), type: "string", onInit: (v) => {
        searchInput.value = String(v);
      } },
      page: { ref: page, type: "number", defaultValue: 1 },
      type: { ref: activeTab, type: "string", onInit: (v) => {
        params.type = v || void 0;
      } },
      status: { ref: selectedStatus, type: "string", onInit: (v) => {
        params.status = v;
      } },
      supplier_id: { ref: selectedSupplierId, type: "number", onInit: (v) => {
        params.supplier_id = v;
      } }
    });
    vueExports.watch(activeTab, (val) => {
      params.type = val || void 0;
      if (val === "service" || val === "adhoc") {
        selectedSupplierId.value = void 0;
        params.supplier_id = void 0;
      }
      if (val !== "service") {
        selectedCategoryId.value = void 0;
        params.service_category_id = void 0;
      }
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedCategoryId, (val) => {
      params.service_category_id = val ?? void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedStatus, (val) => {
      params.status = val ?? void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedSupplierId, (val) => {
      params.supplier_id = val ?? void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value || !!selectedStatus.value || !!selectedSupplierId.value || !!selectedCategoryId.value);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      selectedStatus.value = void 0;
      selectedSupplierId.value = void 0;
      selectedCategoryId.value = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = useCatalogItemList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const items = vueExports.computed(() => data.value?.data ?? []);
    const showMaterialFields = vueExports.computed(() => activeTab.value !== "service" && activeTab.value !== "adhoc");
    const columns = vueExports.computed(() => {
      const cols = [
        { id: "product", header: "Sản phẩm" },
        { accessorKey: "unit", header: "Đơn vị" },
        { id: "unit_price", header: showMaterialFields.value ? "Giá bán" : "Đơn giá" }
      ];
      if (showMaterialFields.value) {
        cols.push({ id: "purchase_price", header: "Giá mua" });
        cols.push({ id: "supplier", header: "NCC" });
        cols.push({ id: "commission_rate", header: "Hoa Hồng (%)" });
      }
      if (activeTab.value === "service") {
        cols.push({ id: "service_category", header: "Danh mục" });
      }
      cols.push({ id: "status", header: "Trạng thái" });
      cols.push({ id: "is_published", header: "Công bố" });
      cols.push(stickyRight({ id: "actions", header: "Thao tác" }));
      return cols;
    });
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
    const formDefaultType = vueExports.computed(() => {
      if (activeTab.value === "material" || activeTab.value === "service") {
        return activeTab.value;
      }
      return null;
    });
    function handleFormSubmit(formData) {
      const categoryId = formData.service_category_id != null ? String(formData.service_category_id) : null;
      submitForm(
        () => apiCreateCatalogItem({ ...formData, service_category_id: categoryId }),
        () => apiUpdateCatalogItem(editTarget.value.id, {
          code: formData.code,
          name: formData.name,
          unit: formData.unit,
          unit_price: formData.unit_price,
          purchase_price: formData.purchase_price,
          commission_rate: formData.commission_rate,
          supplier_id: formData.supplier_id,
          service_category_id: categoryId,
          description: formData.description,
          content: formData.content,
          sort_order: formData.sort_order,
          price_note: formData.price_note,
          is_published: formData.is_published,
          is_featured: formData.is_featured
        }),
        { create: "Thêm danh mục hàng thành công", update: "Cập nhật danh mục hàng thành công" }
      );
    }
    function handleDelete() {
      submitDelete(
        () => apiDeleteCatalogItem(deleteTarget.value.id),
        { message: "Đã xoá danh mục hàng" }
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$1;
      const _component_SharedCatalogSupplierSelect = __nuxt_component_3;
      const _component_USelect = _sfc_main$2;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$3;
      const _component_UAvatar = _sfc_main$f;
      const _component_SharedStatusBadge = __nuxt_component_7;
      const _component_UBadge = _sfc_main$4;
      const _component_SharedCrudTableActions = __nuxt_component_3$1;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_CatalogItemFormModal = __nuxt_component_12;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Danh mục hàng",
        description: "Quản lý vật tư và dịch vụ"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Thêm mới",
              onClick: vueExports.unref(openCreateModal)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Thêm mới",
                onClick: vueExports.unref(openCreateModal)
              }, null, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mb-4 flex gap-2"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(tabs, (tab) => {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          key: tab.value,
          label: tab.label,
          variant: vueExports.unref(activeTab) === tab.value ? "solid" : "ghost",
          color: vueExports.unref(activeTab) === tab.value ? "primary" : "neutral",
          size: "sm",
          onClick: ($event) => activeTab.value = tab.value
        }, null, _parent));
      });
      _push(`<!--]--></div><div class="mb-4 flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm kiếm...",
        class: "max-w-sm"
      }, null, _parent));
      if (vueExports.unref(showMaterialFields)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCatalogSupplierSelect, {
          modelValue: vueExports.unref(selectedSupplierId),
          "onUpdate:modelValue": ($event) => vueExports.isRef(selectedSupplierId) ? selectedSupplierId.value = $event : null,
          placeholder: "Lọc NCC",
          class: "w-56"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(activeTab) === "service") {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
          modelValue: vueExports.unref(selectedCategoryId),
          "onUpdate:modelValue": ($event) => vueExports.isRef(selectedCategoryId) ? selectedCategoryId.value = $event : null,
          items: vueExports.unref(categoryFilterOptions),
          "value-key": "value",
          placeholder: "Lọc danh mục",
          class: "w-56"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedStatus),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedStatus) ? selectedStatus.value = $event : null,
        items: vueExports.unref(statusOptions),
        placeholder: "Trạng thái",
        class: "w-48",
        "value-key": "value"
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
              data: vueExports.unref(items),
              columns: vueExports.unref(columns)
            }, {
              "product-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-3"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAvatar, {
                    src: row.original.image_url ?? void 0,
                    alt: row.original.name,
                    size: "md",
                    icon: "i-lucide-package"
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="min-w-0"${_scopeId2}><div class="font-medium text-sm text-gray-900 truncate"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.name)}</div><div class="text-xs text-gray-500"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}</div></div></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex items-center gap-3" }, [
                      vueExports.createVNode(_component_UAvatar, {
                        src: row.original.image_url ?? void 0,
                        alt: row.original.name,
                        size: "md",
                        icon: "i-lucide-package"
                      }, null, 8, ["src", "alt"]),
                      vueExports.createVNode("div", { class: "min-w-0" }, [
                        vueExports.createVNode("div", { class: "font-medium text-sm text-gray-900 truncate" }, vueExports.toDisplayString(row.original.name), 1),
                        vueExports.createVNode("div", { class: "text-xs text-gray-500" }, vueExports.toDisplayString(row.original.code), 1)
                      ])
                    ])
                  ];
                }
              }),
              "unit_price-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(Number(row.original.unit_price).toLocaleString("vi-VN"))}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(Number(row.original.unit_price).toLocaleString("vi-VN")), 1)
                  ];
                }
              }),
              "purchase_price-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.purchase_price ? Number(row.original.purchase_price).toLocaleString("vi-VN") : "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.purchase_price ? Number(row.original.purchase_price).toLocaleString("vi-VN") : "—"), 1)
                  ];
                }
              }),
              "supplier-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.supplier?.name ?? "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.supplier?.name ?? "—"), 1)
                  ];
                }
              }),
              "commission_rate-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.commission_rate ? `${row.original.commission_rate}%` : "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.commission_rate ? `${row.original.commission_rate}%` : "—"), 1)
                  ];
                }
              }),
              "service_category-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.service_category?.name ?? "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.service_category?.name ?? "—"), 1)
                  ];
                }
              }),
              "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
                    active: row.original.status.value === "active"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedStatusBadge, {
                      active: row.original.status.value === "active"
                    }, null, 8, ["active"])
                  ];
                }
              }),
              "is_published-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.is_published ? "Đã công bố" : "Chưa công bố",
                    color: row.original.is_published ? "success" : "neutral",
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.is_published ? "Đã công bố" : "Chưa công bố",
                      color: row.original.is_published ? "success" : "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableActions, {
                    "detail-to": `/pmc/catalog/items/${row.original.id}`,
                    onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                    onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/catalog/items/${row.original.id}`,
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
                  data: vueExports.unref(items),
                  columns: vueExports.unref(columns)
                }, {
                  "product-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex items-center gap-3" }, [
                      vueExports.createVNode(_component_UAvatar, {
                        src: row.original.image_url ?? void 0,
                        alt: row.original.name,
                        size: "md",
                        icon: "i-lucide-package"
                      }, null, 8, ["src", "alt"]),
                      vueExports.createVNode("div", { class: "min-w-0" }, [
                        vueExports.createVNode("div", { class: "font-medium text-sm text-gray-900 truncate" }, vueExports.toDisplayString(row.original.name), 1),
                        vueExports.createVNode("div", { class: "text-xs text-gray-500" }, vueExports.toDisplayString(row.original.code), 1)
                      ])
                    ])
                  ]),
                  "unit_price-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(Number(row.original.unit_price).toLocaleString("vi-VN")), 1)
                  ]),
                  "purchase_price-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.purchase_price ? Number(row.original.purchase_price).toLocaleString("vi-VN") : "—"), 1)
                  ]),
                  "supplier-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.supplier?.name ?? "—"), 1)
                  ]),
                  "commission_rate-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.commission_rate ? `${row.original.commission_rate}%` : "—"), 1)
                  ]),
                  "service_category-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.service_category?.name ?? "—"), 1)
                  ]),
                  "status-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_SharedStatusBadge, {
                      active: row.original.status.value === "active"
                    }, null, 8, ["active"])
                  ]),
                  "is_published-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.is_published ? "Đã công bố" : "Chưa công bố",
                      color: row.original.is_published ? "success" : "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_SharedCrudTableActions, {
                      "detail-to": `/pmc/catalog/items/${row.original.id}`,
                      onEdit: ($event) => vueExports.unref(openEditModal)(row.original),
                      onDelete: ($event) => vueExports.unref(openDeleteModal)(row.original)
                    }, null, 8, ["detail-to", "onEdit", "onDelete"])
                  ]),
                  _: 2
                }, 1032, ["data", "columns"]),
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CatalogItemFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        "default-type": vueExports.unref(formDefaultType),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isSubmitting),
        "api-errors": vueExports.unref(formApiErrors),
        onSubmit: handleFormSubmit,
        onImageChanged: ($event) => vueExports.unref(refresh)()
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá danh mục hàng",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/catalog/items/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Ctjhl9GD.mjs.map
