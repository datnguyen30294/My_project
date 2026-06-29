import { _ as _sfc_main$2 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$3 } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_5 } from './ImageUpload-CCeUx1rz.mjs';
import { _ as _sfc_main$4 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_4 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$5 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$6 } from './Separator-DeO-OPIs.mjs';
import { _ as __nuxt_component_5$1 } from './NumberInput-BfLKWOCC.mjs';
import { _ as _sfc_main$9 } from './SelectMenu-DKHEMZj7.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { u as useEntitySelect } from './useEntitySelect-DG9pQ_n0.mjs';
import { a as apiGetCatalogSupplier, u as useCatalogSupplierList } from './useCatalogSuppliers-DJ8n9zOn.mjs';
import { _ as _sfc_main$7 } from './Textarea-DTCNHwKm.mjs';
import { _ as __nuxt_component_7 } from './RichTextEditor-CeP76v4Q.mjs';
import { _ as _sfc_main$8 } from './Switch-1cJNH-6C.mjs';
import { d as useServiceCategoryList, e as useCatalogItemImage } from './useCatalogItems-Db1MWi3b.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "CatalogSupplierSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: null },
    placeholder: { default: "Chọn nhà cung cấp" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
      () => props.modelValue,
      (val) => emit("update:modelValue", val),
      {
        fetchList: useCatalogSupplierList,
        resolveItem: async (id) => {
          const r = await apiGetCatalogSupplier(id);
          return { id: r.data.id, label: r.data.name };
        },
        syncExternalChanges: true
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$9;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItem),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItem) ? selectedItem.value = $event : null,
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm NCC..." },
        placeholder: __props.placeholder,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/catalog/CatalogSupplierSelect.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "SharedCatalogSupplierSelect" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "CatalogItemFormModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    defaultType: { default: null },
    defaultName: { default: "" },
    item: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) }
  },
  emits: ["update:open", "submit", "image-changed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const typeOptions = [
      { label: "Vật tư", value: "material" },
      { label: "Dịch vụ", value: "service" },
      { label: "Dịch vụ tùy chọn", value: "adhoc" }
    ];
    const formState = vueExports.reactive({
      type: "material",
      code: "",
      name: "",
      unit: "",
      unit_price: 0,
      purchase_price: null,
      commission_rate: null,
      supplier_id: null,
      service_category_id: null,
      description: null,
      content: null,
      sort_order: 0,
      price_note: null,
      is_published: false,
      is_featured: false
    });
    const { data: categoriesData } = useServiceCategoryList(vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE, status: "active" })));
    const categoryOptions = vueExports.computed(
      () => (categoriesData.value?.data ?? []).map((c) => ({ label: c.name, value: c.id }))
    );
    const selectedCategoryId = vueExports.computed({
      get: () => formState.service_category_id ?? void 0,
      set: (val) => {
        formState.service_category_id = val ?? null;
      }
    });
    const isMaterial = vueExports.computed(() => formState.type === "material");
    const isService = vueExports.computed(() => formState.type === "service");
    const isAdhoc = vueExports.computed(() => formState.type === "adhoc");
    const modalTitle = vueExports.computed(
      () => props.mode === "create" ? "Thêm danh mục hàng" : "Sửa danh mục hàng"
    );
    vueExports.watch(
      () => formState.supplier_id,
      async (supplierId) => {
        if (!supplierId || props.mode === "edit") return;
        try {
          const res = await apiGetCatalogSupplier(supplierId);
          if (res.data.commission_rate) {
            formState.commission_rate = Number(res.data.commission_rate);
          }
        } catch {
        }
      }
    );
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        if (props.mode === "edit" && props.item) {
          formState.type = props.item.type.value;
          formState.code = props.item.code;
          formState.name = props.item.name;
          formState.unit = props.item.unit;
          formState.unit_price = Number(props.item.unit_price);
          formState.purchase_price = props.item.purchase_price ? Number(props.item.purchase_price) : null;
          formState.commission_rate = props.item.commission_rate ? Number(props.item.commission_rate) : null;
          formState.supplier_id = props.item.supplier?.id ?? null;
          formState.service_category_id = props.item.service_category?.id ?? null;
          formState.description = props.item.description || null;
          formState.content = props.item.content || null;
          formState.sort_order = props.item.sort_order ?? 0;
          formState.price_note = props.item.price_note || null;
          formState.is_published = props.item.is_published ?? false;
          formState.is_featured = props.item.is_featured ?? false;
        } else {
          formState.type = props.defaultType ?? "material";
          formState.code = "";
          formState.name = props.defaultName ?? "";
          formState.unit = "";
          formState.unit_price = 0;
          formState.purchase_price = null;
          formState.commission_rate = null;
          formState.supplier_id = null;
          formState.service_category_id = null;
          formState.description = null;
          formState.content = null;
          formState.sort_order = 0;
          formState.price_note = null;
          formState.is_published = false;
          formState.is_featured = false;
        }
      }
    );
    const { isImageLoading, handleImageUpload, handleImageDelete } = useCatalogItemImage(
      vueExports.computed(() => props.item?.id),
      () => emit("image-changed")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$2;
      const _component_UFormField = _sfc_main$3;
      const _component_SharedImageUpload = __nuxt_component_5;
      const _component_USelect = _sfc_main$4;
      const _component_SharedCrudFormFieldError = __nuxt_component_4;
      const _component_UInput = _sfc_main$5;
      const _component_USeparator = _sfc_main$6;
      const _component_SharedNumberInput = __nuxt_component_5$1;
      const _component_SharedCatalogSupplierSelect = __nuxt_component_3;
      const _component_UTextarea = _sfc_main$7;
      const _component_SharedRichTextEditor = __nuxt_component_7;
      const _component_USwitch = _sfc_main$8;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: vueExports.unref(modalTitle),
        ui: { content: "sm:max-w-3xl" },
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-5"${_scopeId}>`);
            if (__props.mode === "edit" && __props.item) {
              _push2(`<div${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Hình ảnh",
                name: "image"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedImageUpload, {
                      "current-url": __props.item.image_url,
                      alt: __props.item.name,
                      loading: vueExports.unref(isImageLoading),
                      onUpload: vueExports.unref(handleImageUpload),
                      onDelete: vueExports.unref(handleImageDelete)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedImageUpload, {
                        "current-url": __props.item.image_url,
                        alt: __props.item.name,
                        loading: vueExports.unref(isImageLoading),
                        onUpload: vueExports.unref(handleImageUpload),
                        onDelete: vueExports.unref(handleImageDelete)
                      }, null, 8, ["current-url", "alt", "loading", "onUpload", "onDelete"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<fieldset${_scopeId}><legend class="text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3"${_scopeId}> Thông tin cơ bản </legend><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Loại",
              name: "type",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(formState).type,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).type = $event,
                    items: typeOptions,
                    "value-key": "value",
                    class: "w-full",
                    disabled: __props.mode === "edit"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.type
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(formState).type,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).type = $event,
                      items: typeOptions,
                      "value-key": "value",
                      class: "w-full",
                      disabled: __props.mode === "edit"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.type
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (!vueExports.unref(isAdhoc)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Mã",
                name: "code",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(formState).code,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                      placeholder: vueExports.unref(isMaterial) ? "VD: VT-001" : "VD: DV-001",
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
                        placeholder: vueExports.unref(isMaterial) ? "VD: VT-001" : "VD: DV-001",
                        class: "w-full",
                        disabled: __props.mode === "edit"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "disabled"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.code
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
              label: "Tên",
              name: "name",
              required: "",
              class: "sm:col-span-2"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: vueExports.unref(isMaterial) ? "VD: Ống nước PVC D21" : "VD: Dịch vụ sơn tường",
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
                      placeholder: vueExports.unref(isMaterial) ? "VD: Ống nước PVC D21" : "VD: Dịch vụ sơn tường",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.name
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Đơn vị",
              name: "unit",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).unit,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).unit = $event,
                    placeholder: vueExports.unref(isMaterial) ? "VD: m, cái, kg" : "VD: lần, giờ, ngày",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.unit
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).unit,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).unit = $event,
                      placeholder: vueExports.unref(isMaterial) ? "VD: m, cái, kg" : "VD: lần, giờ, ngày",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.unit
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(isService)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Danh mục dịch vụ",
                name: "service_category_id",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                      modelValue: vueExports.unref(selectedCategoryId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedCategoryId) ? selectedCategoryId.value = $event : null,
                      items: vueExports.unref(categoryOptions),
                      "value-key": "value",
                      placeholder: "Chọn danh mục",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.service_category_id
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USelect, {
                        modelValue: vueExports.unref(selectedCategoryId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedCategoryId) ? selectedCategoryId.value = $event : null,
                        items: vueExports.unref(categoryOptions),
                        "value-key": "value",
                        placeholder: "Chọn danh mục",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.service_category_id
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></fieldset>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
            _push2(`<fieldset${_scopeId}><legend class="text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3"${_scopeId}> Thông tin giá </legend><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: vueExports.unref(isMaterial) ? "Giá bán" : "Đơn giá",
              name: "unit_price",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                    modelValue: vueExports.unref(formState).unit_price,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).unit_price = $event,
                    placeholder: "VD: 25.000",
                    min: 0,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.unit_price
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(formState).unit_price,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).unit_price = $event,
                      placeholder: "VD: 25.000",
                      min: 0,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.unit_price
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(isMaterial)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Giá mua",
                name: "purchase_price"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(formState).purchase_price,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).purchase_price = $event,
                      placeholder: "VD: 18.000",
                      min: 0,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.purchase_price
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(formState).purchase_price,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).purchase_price = $event,
                        placeholder: "VD: 18.000",
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.purchase_price
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(isService)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Ghi chú giá",
                name: "price_note",
                class: "sm:col-span-2"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(formState).price_note,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).price_note = $event,
                      placeholder: "VD: từ 500.000đ/lần, liên hệ báo giá",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.price_note
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(formState).price_note,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).price_note = $event,
                        placeholder: "VD: từ 500.000đ/lần, liên hệ báo giá",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.price_note
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></fieldset>`);
            if (vueExports.unref(isMaterial)) {
              _push2(`<!--[-->`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
              _push2(`<fieldset${_scopeId}><legend class="text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3"${_scopeId}> Nhà cung cấp </legend><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Nhà cung cấp",
                name: "supplier_id"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCatalogSupplierSelect, {
                      modelValue: vueExports.unref(formState).supplier_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).supplier_id = $event
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.supplier_id
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedCatalogSupplierSelect, {
                        modelValue: vueExports.unref(formState).supplier_id,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).supplier_id = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.supplier_id
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Hoa Hồng (%)",
                name: "commission_rate"
              }, {
                help: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="text-xs text-[var(--ui-text-dimmed)] italic"${_scopeId2}>Bỏ trống sẽ lấy từ cài đặt nhà cung cấp</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "text-xs text-[var(--ui-text-dimmed)] italic" }, "Bỏ trống sẽ lấy từ cài đặt nhà cung cấp")
                    ];
                  }
                }),
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
              _push2(`</div></fieldset><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mô tả ngắn",
              name: "description",
              description: vueExports.unref(isService) ? "Hiển thị trên trang danh sách dịch vụ (listing)" : void 0
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).description,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                    placeholder: "Mô tả ngắn (tuỳ chọn)",
                    rows: 3,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).description,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                      placeholder: "Mô tả ngắn (tuỳ chọn)",
                      rows: 3,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(isService)) {
              _push2(`<!--[-->`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Nội dung chi tiết",
                name: "content",
                description: "Bài viết chi tiết hiển thị trên trang dịch vụ (dạng blog)"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedRichTextEditor, {
                      modelValue: vueExports.unref(formState).content,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).content = $event,
                      placeholder: "Viết nội dung chi tiết về dịch vụ...",
                      "min-height": "250px"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedRichTextEditor, {
                        modelValue: vueExports.unref(formState).content,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).content = $event,
                        placeholder: "Viết nội dung chi tiết về dịch vụ...",
                        "min-height": "250px"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
            _push2(`<fieldset${_scopeId}><legend class="text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3"${_scopeId}> Hiển thị </legend><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Hiển thị cho cư dân",
              name: "is_published",
              description: "Bật để hiển thị trên trang dành cho cư dân"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
                    modelValue: vueExports.unref(formState).is_published,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_published = $event,
                    color: "success"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USwitch, {
                      modelValue: vueExports.unref(formState).is_published,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_published = $event,
                      color: "success"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(isService)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Dịch vụ nổi bật",
                name: "is_featured",
                description: "Đánh dấu ưu tiên hiển thị trên trang chính"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
                      modelValue: vueExports.unref(formState).is_featured,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_featured = $event,
                      color: "warning"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USwitch, {
                        modelValue: vueExports.unref(formState).is_featured,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_featured = $event,
                        color: "warning"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(isService)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Thứ tự sắp xếp",
                name: "sort_order",
                description: "Số nhỏ hơn hiển thị trước"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(formState).sort_order,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).sort_order = $event,
                      modelModifiers: { number: true },
                      type: "number",
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
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></fieldset></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-5" }, [
                __props.mode === "edit" && __props.item ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 0 }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Hình ảnh",
                    name: "image"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedImageUpload, {
                        "current-url": __props.item.image_url,
                        alt: __props.item.name,
                        loading: vueExports.unref(isImageLoading),
                        onUpload: vueExports.unref(handleImageUpload),
                        onDelete: vueExports.unref(handleImageDelete)
                      }, null, 8, ["current-url", "alt", "loading", "onUpload", "onDelete"])
                    ]),
                    _: 1
                  })
                ])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("fieldset", null, [
                  vueExports.createVNode("legend", { class: "text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3" }, " Thông tin cơ bản "),
                  vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                    vueExports.createVNode(_component_UFormField, {
                      label: "Loại",
                      name: "type",
                      required: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_USelect, {
                          modelValue: vueExports.unref(formState).type,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).type = $event,
                          items: typeOptions,
                          "value-key": "value",
                          class: "w-full",
                          disabled: __props.mode === "edit"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: __props.apiErrors.type
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    }),
                    !vueExports.unref(isAdhoc) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                      key: 0,
                      label: "Mã",
                      name: "code",
                      required: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).code,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                          placeholder: vueExports.unref(isMaterial) ? "VD: VT-001" : "VD: DV-001",
                          class: "w-full",
                          disabled: __props.mode === "edit"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "disabled"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: __props.apiErrors.code
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true),
                    vueExports.createVNode(_component_UFormField, {
                      label: "Tên",
                      name: "name",
                      required: "",
                      class: "sm:col-span-2"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).name,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                          placeholder: vueExports.unref(isMaterial) ? "VD: Ống nước PVC D21" : "VD: Dịch vụ sơn tường",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: __props.apiErrors.name
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_UFormField, {
                      label: "Đơn vị",
                      name: "unit",
                      required: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).unit,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).unit = $event,
                          placeholder: vueExports.unref(isMaterial) ? "VD: m, cái, kg" : "VD: lần, giờ, ngày",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: __props.apiErrors.unit
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    }),
                    vueExports.unref(isService) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                      key: 1,
                      label: "Danh mục dịch vụ",
                      name: "service_category_id",
                      required: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_USelect, {
                          modelValue: vueExports.unref(selectedCategoryId),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(selectedCategoryId) ? selectedCategoryId.value = $event : null,
                          items: vueExports.unref(categoryOptions),
                          "value-key": "value",
                          placeholder: "Chọn danh mục",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: __props.apiErrors.service_category_id
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true)
                  ])
                ]),
                vueExports.createVNode(_component_USeparator),
                vueExports.createVNode("fieldset", null, [
                  vueExports.createVNode("legend", { class: "text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3" }, " Thông tin giá "),
                  vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                    vueExports.createVNode(_component_UFormField, {
                      label: vueExports.unref(isMaterial) ? "Giá bán" : "Đơn giá",
                      name: "unit_price",
                      required: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_SharedNumberInput, {
                          modelValue: vueExports.unref(formState).unit_price,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).unit_price = $event,
                          placeholder: "VD: 25.000",
                          min: 0,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: __props.apiErrors.unit_price
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    vueExports.unref(isMaterial) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                      key: 0,
                      label: "Giá mua",
                      name: "purchase_price"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_SharedNumberInput, {
                          modelValue: vueExports.unref(formState).purchase_price,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).purchase_price = $event,
                          placeholder: "VD: 18.000",
                          min: 0,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: __props.apiErrors.purchase_price
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true),
                    vueExports.unref(isService) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                      key: 1,
                      label: "Ghi chú giá",
                      name: "price_note",
                      class: "sm:col-span-2"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).price_note,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).price_note = $event,
                          placeholder: "VD: từ 500.000đ/lần, liên hệ báo giá",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: __props.apiErrors.price_note
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true)
                  ])
                ]),
                vueExports.unref(isMaterial) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode(_component_USeparator),
                  vueExports.createVNode("fieldset", null, [
                    vueExports.createVNode("legend", { class: "text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3" }, " Nhà cung cấp "),
                    vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                      vueExports.createVNode(_component_UFormField, {
                        label: "Nhà cung cấp",
                        name: "supplier_id"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_SharedCatalogSupplierSelect, {
                            modelValue: vueExports.unref(formState).supplier_id,
                            "onUpdate:modelValue": ($event) => vueExports.unref(formState).supplier_id = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          vueExports.createVNode(_component_SharedCrudFormFieldError, {
                            errors: __props.apiErrors.supplier_id
                          }, null, 8, ["errors"])
                        ]),
                        _: 1
                      }),
                      vueExports.createVNode(_component_UFormField, {
                        label: "Hoa Hồng (%)",
                        name: "commission_rate"
                      }, {
                        help: vueExports.withCtx(() => [
                          vueExports.createVNode("span", { class: "text-xs text-[var(--ui-text-dimmed)] italic" }, "Bỏ trống sẽ lấy từ cài đặt nhà cung cấp")
                        ]),
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
                      })
                    ])
                  ])
                ], 64)) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_USeparator),
                vueExports.createVNode(_component_UFormField, {
                  label: "Mô tả ngắn",
                  name: "description",
                  description: vueExports.unref(isService) ? "Hiển thị trên trang danh sách dịch vụ (listing)" : void 0
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).description,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                      placeholder: "Mô tả ngắn (tuỳ chọn)",
                      rows: 3,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["description"]),
                vueExports.unref(isService) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                  vueExports.createVNode(_component_USeparator),
                  vueExports.createVNode(_component_UFormField, {
                    label: "Nội dung chi tiết",
                    name: "content",
                    description: "Bài viết chi tiết hiển thị trên trang dịch vụ (dạng blog)"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedRichTextEditor, {
                        modelValue: vueExports.unref(formState).content,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).content = $event,
                        placeholder: "Viết nội dung chi tiết về dịch vụ...",
                        "min-height": "250px"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ], 64)) : vueExports.createCommentVNode("", true),
                vueExports.createVNode(_component_USeparator),
                vueExports.createVNode("fieldset", null, [
                  vueExports.createVNode("legend", { class: "text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3" }, " Hiển thị "),
                  vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                    vueExports.createVNode(_component_UFormField, {
                      label: "Hiển thị cho cư dân",
                      name: "is_published",
                      description: "Bật để hiển thị trên trang dành cho cư dân"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_USwitch, {
                          modelValue: vueExports.unref(formState).is_published,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_published = $event,
                          color: "success"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    vueExports.unref(isService) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                      key: 0,
                      label: "Dịch vụ nổi bật",
                      name: "is_featured",
                      description: "Đánh dấu ưu tiên hiển thị trên trang chính"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_USwitch, {
                          modelValue: vueExports.unref(formState).is_featured,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_featured = $event,
                          color: "warning"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true),
                    vueExports.unref(isService) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                      key: 1,
                      label: "Thứ tự sắp xếp",
                      name: "sort_order",
                      description: "Số nhỏ hơn hiển thị trước"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).sort_order,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).sort_order = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: 0,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: __props.apiErrors.sort_order
                        }, null, 8, ["errors"])
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true)
                  ])
                ])
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
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "primary",
              icon: __props.loading ? "i-lucide-loader-circle" : "i-lucide-check",
              label: __props.loading ? "Đang lưu..." : "Lưu",
              disabled: __props.loading,
              onClick: ($event) => emit("submit", { ...vueExports.unref(formState) })
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Huỷ",
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "primary",
                  icon: __props.loading ? "i-lucide-loader-circle" : "i-lucide-check",
                  label: __props.loading ? "Đang lưu..." : "Lưu",
                  disabled: __props.loading,
                  onClick: ($event) => emit("submit", { ...vueExports.unref(formState) })
                }, null, 8, ["icon", "label", "disabled", "onClick"])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/catalog/CatalogItemFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_12 = Object.assign(_sfc_main, { __name: "CatalogItemFormModal" });

export { __nuxt_component_12 as _, __nuxt_component_3 as a };
//# sourceMappingURL=CatalogItemFormModal-D472wqf5.mjs.map
