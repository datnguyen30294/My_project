import { _ as _sfc_main$1 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$2 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$3 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-DKHEMZj7.mjs';
import { v as vueExports, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$5 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_5 } from './NumberInput-BfLKWOCC.mjs';
import { _ as __nuxt_component_12$1 } from './CatalogItemFormModal-D472wqf5.mjs';
import { h as QUOTE_LINE_TYPE_OPTIONS } from './useQuotes-C1-4FXSr.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { b as useCatalogItemsByType, c as apiCreateCatalogItem } from './useCatalogItems-Db1MWi3b.mjs';
import { a as getApiValidationErrors, g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "QuoteLineFormModal",
  __ssrInlineRender: true,
  emits: ["add", "update"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const toast = useToast();
    const isOpen = vueExports.ref(false);
    const editingKey = vueExports.ref(null);
    const isEditMode = vueExports.computed(() => editingKey.value !== null);
    const lineForm = vueExports.reactive({
      line_type: "",
      reference_id: void 0,
      name: "",
      quantity: 1,
      unit: "",
      unit_price: 0,
      purchase_price: 0
    });
    const showCatalogModal = vueExports.ref(false);
    const isCatalogSubmitting = vueExports.ref(false);
    const catalogApiErrors = vueExports.ref({});
    const catalogDefaultName = vueExports.ref("");
    const debouncedCatalogSearch = vueExports.ref("");
    const { searchInput: catalogSearch, onSearch: debounceCatalogSearch } = useTableSearch((val) => {
      debouncedCatalogSearch.value = val ?? "";
    });
    const lineTypeForCatalog = vueExports.computed(() => lineForm.line_type || void 0);
    const { data: catalogData, status: catalogStatus, execute: fetchCatalog } = useCatalogItemsByType(lineTypeForCatalog, debouncedCatalogSearch);
    const catalogOptions = vueExports.computed(
      () => (catalogData.value?.data ?? []).map((item) => ({
        label: `${item.name} (${item.unit})`,
        value: item.id,
        item
      }))
    );
    let skipLineTypeReset = false;
    vueExports.watch(() => lineForm.line_type, (type) => {
      if (skipLineTypeReset) {
        skipLineTypeReset = false;
        if (type) fetchCatalog();
        return;
      }
      lineForm.reference_id = void 0;
      lineForm.name = "";
      lineForm.unit = "";
      lineForm.unit_price = 0;
      lineForm.purchase_price = 0;
      catalogSearch.value = "";
      if (type) fetchCatalog();
    });
    vueExports.watch(() => lineForm.reference_id, (refId) => {
      if (!refId) return;
      const found = (catalogData.value?.data ?? []).find((i) => i.id === refId);
      if (found) {
        lineForm.name = found.name;
        lineForm.unit = found.unit;
        lineForm.unit_price = parseFloat(found.unit_price);
        lineForm.purchase_price = found.purchase_price != null ? parseFloat(found.purchase_price) : 0;
      }
    });
    const lineFormTotal = vueExports.computed(() => lineForm.unit_price * lineForm.quantity);
    const canAddLine = vueExports.computed(() => {
      if (!lineForm.line_type || !lineForm.name || lineForm.quantity <= 0 || !lineForm.unit || lineForm.unit_price < 0 || lineForm.purchase_price < 0) {
        return false;
      }
      return !!lineForm.reference_id;
    });
    function open() {
      editingKey.value = null;
      lineForm.line_type = "material";
      lineForm.reference_id = void 0;
      lineForm.name = "";
      lineForm.quantity = 1;
      lineForm.unit = "";
      lineForm.unit_price = 0;
      lineForm.purchase_price = 0;
      catalogSearch.value = "";
      fetchCatalog();
      isOpen.value = true;
    }
    function openEdit(line) {
      editingKey.value = line.key;
      skipLineTypeReset = true;
      lineForm.line_type = line.line_type;
      lineForm.reference_id = line.reference_id;
      lineForm.name = line.name;
      lineForm.quantity = line.quantity;
      lineForm.unit = line.unit;
      lineForm.unit_price = line.unit_price;
      lineForm.purchase_price = line.purchase_price;
      catalogSearch.value = "";
      isOpen.value = true;
    }
    function openCatalogCreate(prefilledName = "") {
      catalogApiErrors.value = {};
      catalogDefaultName.value = prefilledName;
      showCatalogModal.value = true;
    }
    async function handleCatalogSubmit(formData) {
      isCatalogSubmitting.value = true;
      catalogApiErrors.value = {};
      try {
        const res = await apiCreateCatalogItem({
          ...formData,
          service_category_id: formData.service_category_id != null ? String(formData.service_category_id) : null
        });
        toast.add({ title: "Tạo danh mục thành công", color: "success" });
        showCatalogModal.value = false;
        await fetchCatalog();
        const created = res.data;
        lineForm.reference_id = created.id;
        lineForm.name = created.name;
        lineForm.unit = created.unit;
        lineForm.unit_price = parseFloat(created.unit_price);
        lineForm.purchase_price = created.purchase_price != null ? parseFloat(created.purchase_price) : 0;
      } catch (err) {
        const validationErrors = getApiValidationErrors(err);
        if (validationErrors) {
          catalogApiErrors.value = validationErrors;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Tạo danh mục thất bại"), color: "error" });
        }
      } finally {
        isCatalogSubmitting.value = false;
      }
    }
    function handleSubmit() {
      if (!canAddLine.value) return;
      const lineData = {
        line_type: lineForm.line_type,
        reference_id: lineForm.reference_id,
        name: lineForm.name,
        quantity: lineForm.quantity,
        unit: lineForm.unit,
        unit_price: lineForm.unit_price,
        purchase_price: lineForm.purchase_price
      };
      if (isEditMode.value) {
        emit("update", { key: editingKey.value, ...lineData });
      } else {
        emit("add", lineData);
      }
      isOpen.value = false;
    }
    __expose({ open, openEdit });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$1;
      const _component_UFormField = _sfc_main$2;
      const _component_USelect = _sfc_main$3;
      const _component_USelectMenu = _sfc_main$4;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$5;
      const _component_SharedNumberInput = __nuxt_component_5;
      const _component_CatalogItemFormModal = __nuxt_component_12$1;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(isOpen),
        "onUpdate:open": ($event) => vueExports.isRef(isOpen) ? isOpen.value = $event : null,
        title: vueExports.unref(isEditMode) ? "Sửa dòng báo giá" : "Thêm dòng báo giá"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Loại",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(lineForm).line_type,
                    "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).line_type = $event,
                    items: "QUOTE_LINE_TYPE_OPTIONS" in _ctx ? _ctx.QUOTE_LINE_TYPE_OPTIONS : vueExports.unref(QUOTE_LINE_TYPE_OPTIONS),
                    placeholder: "Chọn loại...",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(lineForm).line_type,
                      "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).line_type = $event,
                      items: "QUOTE_LINE_TYPE_OPTIONS" in _ctx ? _ctx.QUOTE_LINE_TYPE_OPTIONS : vueExports.unref(QUOTE_LINE_TYPE_OPTIONS),
                      placeholder: "Chọn loại...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(lineForm).line_type) {
              _push2(`<!--[-->`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Hạng mục",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                      modelValue: vueExports.unref(lineForm).reference_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).reference_id = $event,
                      "search-term": vueExports.unref(catalogSearch),
                      "onUpdate:searchTerm": [($event) => vueExports.isRef(catalogSearch) ? catalogSearch.value = $event : null, vueExports.unref(debounceCatalogSearch)],
                      items: vueExports.unref(catalogOptions),
                      "value-key": "value",
                      placeholder: "Tìm và chọn hạng mục...",
                      searchable: "",
                      "ignore-filter": "",
                      loading: vueExports.unref(catalogStatus) === "pending",
                      class: "w-full"
                    }, {
                      empty: vueExports.withCtx(({ searchTerm }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex flex-col items-stretch gap-2 p-2"${_scopeId3}><p class="text-sm text-[var(--ui-text-muted)] text-center"${_scopeId3}> Không tìm thấy hạng mục phù hợp </p>`);
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                            label: searchTerm ? `Tạo mới “${searchTerm}”` : "Tạo mới hạng mục",
                            icon: "i-lucide-plus",
                            color: "primary",
                            variant: "soft",
                            size: "sm",
                            block: "",
                            onClick: ($event) => openCatalogCreate(searchTerm)
                          }, null, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          return [
                            vueExports.createVNode("div", { class: "flex flex-col items-stretch gap-2 p-2" }, [
                              vueExports.createVNode("p", { class: "text-sm text-[var(--ui-text-muted)] text-center" }, " Không tìm thấy hạng mục phù hợp "),
                              vueExports.createVNode(_component_UButton, {
                                label: searchTerm ? `Tạo mới “${searchTerm}”` : "Tạo mới hạng mục",
                                icon: "i-lucide-plus",
                                color: "primary",
                                variant: "soft",
                                size: "sm",
                                block: "",
                                onClick: ($event) => openCatalogCreate(searchTerm)
                              }, null, 8, ["label", "onClick"])
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USelectMenu, {
                        modelValue: vueExports.unref(lineForm).reference_id,
                        "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).reference_id = $event,
                        "search-term": vueExports.unref(catalogSearch),
                        "onUpdate:searchTerm": [($event) => vueExports.isRef(catalogSearch) ? catalogSearch.value = $event : null, vueExports.unref(debounceCatalogSearch)],
                        items: vueExports.unref(catalogOptions),
                        "value-key": "value",
                        placeholder: "Tìm và chọn hạng mục...",
                        searchable: "",
                        "ignore-filter": "",
                        loading: vueExports.unref(catalogStatus) === "pending",
                        class: "w-full"
                      }, {
                        empty: vueExports.withCtx(({ searchTerm }) => [
                          vueExports.createVNode("div", { class: "flex flex-col items-stretch gap-2 p-2" }, [
                            vueExports.createVNode("p", { class: "text-sm text-[var(--ui-text-muted)] text-center" }, " Không tìm thấy hạng mục phù hợp "),
                            vueExports.createVNode(_component_UButton, {
                              label: searchTerm ? `Tạo mới “${searchTerm}”` : "Tạo mới hạng mục",
                              icon: "i-lucide-plus",
                              color: "primary",
                              variant: "soft",
                              size: "sm",
                              block: "",
                              onClick: ($event) => openCatalogCreate(searchTerm)
                            }, null, 8, ["label", "onClick"])
                          ])
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue", "search-term", "onUpdate:searchTerm", "items", "loading"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Tạo mới danh mục",
                icon: "i-lucide-plus",
                variant: "link",
                color: "primary",
                size: "sm",
                class: "self-start -mt-2",
                onClick: ($event) => openCatalogCreate(vueExports.unref(catalogSearch))
              }, null, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(lineForm).line_type) {
              _push2(`<div class="grid grid-cols-2 gap-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Số lượng",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(lineForm).quantity,
                      "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).quantity = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 1,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(lineForm).quantity,
                        "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).quantity = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        min: 1,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Đơn vị",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(lineForm).unit,
                      "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).unit = $event,
                      placeholder: "vd: bình, cái, m2...",
                      disabled: "",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(lineForm).unit,
                        "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).unit = $event,
                        placeholder: "vd: bình, cái, m2...",
                        disabled: "",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(lineForm).line_type) {
              _push2(`<div class="grid grid-cols-2 gap-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Giá nhập (đ)" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(lineForm).purchase_price,
                      "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).purchase_price = $event,
                      min: 0,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(lineForm).purchase_price,
                        "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).purchase_price = $event,
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Đơn giá (đ)",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(lineForm).unit_price,
                      "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).unit_price = $event,
                      min: 0,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(lineForm).unit_price,
                        "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).unit_price = $event,
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(lineForm).unit_price > 0 && vueExports.unref(lineForm).quantity > 0) {
              _push2(`<div class="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2"${_scopeId}><span class="text-sm text-slate-600"${_scopeId}>Thành tiền</span><span class="font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(lineFormTotal)))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Loại",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(lineForm).line_type,
                      "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).line_type = $event,
                      items: "QUOTE_LINE_TYPE_OPTIONS" in _ctx ? _ctx.QUOTE_LINE_TYPE_OPTIONS : vueExports.unref(QUOTE_LINE_TYPE_OPTIONS),
                      placeholder: "Chọn loại...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ]),
                  _: 1
                }),
                vueExports.unref(lineForm).line_type ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Hạng mục",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_USelectMenu, {
                        modelValue: vueExports.unref(lineForm).reference_id,
                        "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).reference_id = $event,
                        "search-term": vueExports.unref(catalogSearch),
                        "onUpdate:searchTerm": [($event) => vueExports.isRef(catalogSearch) ? catalogSearch.value = $event : null, vueExports.unref(debounceCatalogSearch)],
                        items: vueExports.unref(catalogOptions),
                        "value-key": "value",
                        placeholder: "Tìm và chọn hạng mục...",
                        searchable: "",
                        "ignore-filter": "",
                        loading: vueExports.unref(catalogStatus) === "pending",
                        class: "w-full"
                      }, {
                        empty: vueExports.withCtx(({ searchTerm }) => [
                          vueExports.createVNode("div", { class: "flex flex-col items-stretch gap-2 p-2" }, [
                            vueExports.createVNode("p", { class: "text-sm text-[var(--ui-text-muted)] text-center" }, " Không tìm thấy hạng mục phù hợp "),
                            vueExports.createVNode(_component_UButton, {
                              label: searchTerm ? `Tạo mới “${searchTerm}”` : "Tạo mới hạng mục",
                              icon: "i-lucide-plus",
                              color: "primary",
                              variant: "soft",
                              size: "sm",
                              block: "",
                              onClick: ($event) => openCatalogCreate(searchTerm)
                            }, null, 8, ["label", "onClick"])
                          ])
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue", "search-term", "onUpdate:searchTerm", "items", "loading"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UButton, {
                    label: "Tạo mới danh mục",
                    icon: "i-lucide-plus",
                    variant: "link",
                    color: "primary",
                    size: "sm",
                    class: "self-start -mt-2",
                    onClick: ($event) => openCatalogCreate(vueExports.unref(catalogSearch))
                  }, null, 8, ["onClick"])
                ], 64)) : vueExports.createCommentVNode("", true),
                vueExports.unref(lineForm).line_type ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "grid grid-cols-2 gap-4"
                }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Số lượng",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(lineForm).quantity,
                        "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).quantity = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        min: 1,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, {
                    label: "Đơn vị",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(lineForm).unit,
                        "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).unit = $event,
                        placeholder: "vd: bình, cái, m2...",
                        disabled: "",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ])) : vueExports.createCommentVNode("", true),
                vueExports.unref(lineForm).line_type ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  class: "grid grid-cols-2 gap-4"
                }, [
                  vueExports.createVNode(_component_UFormField, { label: "Giá nhập (đ)" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(lineForm).purchase_price,
                        "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).purchase_price = $event,
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, {
                    label: "Đơn giá (đ)",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(lineForm).unit_price,
                        "onUpdate:modelValue": ($event) => vueExports.unref(lineForm).unit_price = $event,
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ])) : vueExports.createCommentVNode("", true),
                vueExports.unref(lineForm).unit_price > 0 && vueExports.unref(lineForm).quantity > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 3,
                  class: "flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2"
                }, [
                  vueExports.createVNode("span", { class: "text-sm text-slate-600" }, "Thành tiền"),
                  vueExports.createVNode("span", { class: "font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(lineFormTotal))), 1)
                ])) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Hủy",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => isOpen.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: vueExports.unref(isEditMode) ? "Cập nhật" : "Thêm",
              color: "primary",
              icon: vueExports.unref(isEditMode) ? "i-lucide-check" : "i-lucide-plus",
              disabled: !vueExports.unref(canAddLine),
              onClick: handleSubmit
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => isOpen.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: vueExports.unref(isEditMode) ? "Cập nhật" : "Thêm",
                  color: "primary",
                  icon: vueExports.unref(isEditMode) ? "i-lucide-check" : "i-lucide-plus",
                  disabled: !vueExports.unref(canAddLine),
                  onClick: handleSubmit
                }, null, 8, ["label", "icon", "disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CatalogItemFormModal, {
        open: vueExports.unref(showCatalogModal),
        "onUpdate:open": ($event) => vueExports.isRef(showCatalogModal) ? showCatalogModal.value = $event : null,
        mode: "create",
        "default-type": vueExports.unref(lineForm).line_type || null,
        "default-name": vueExports.unref(catalogDefaultName),
        loading: vueExports.unref(isCatalogSubmitting),
        "api-errors": vueExports.unref(catalogApiErrors),
        onSubmit: handleCatalogSubmit
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quote/QuoteLineFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_12 = Object.assign(_sfc_main, { __name: "QuoteLineFormModal" });

export { __nuxt_component_12 as _ };
//# sourceMappingURL=QuoteLineFormModal-1EmtTWTT.mjs.map
