import { _ as _sfc_main$1 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { v as vueExports, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, $ as $api } from './server.mjs';
import { _ as _sfc_main$3 } from './Checkbox-Cp_FPUkd.mjs';
import { g as getApiErrorMessage, a as getApiValidationErrors } from './apiError-DBrxF9au.mjs';

function apiListOgTicketCategories(params) {
  return $api("/pmc/og-ticket-categories", { query: params });
}
function apiCreateOgTicketCategory(data) {
  return $api("/pmc/og-ticket-categories", { method: "POST", body: data });
}
function apiUpdateOgTicketCategory(id, data) {
  return $api(`/pmc/og-ticket-categories/${id}`, { method: "PUT", body: data });
}
function apiDeleteOgTicketCategory(id) {
  return $api(`/pmc/og-ticket-categories/${id}`, { method: "DELETE" });
}
function apiSyncOgTicketCategories(ogTicketId, categoryIds) {
  return $api(`/pmc/og-tickets/${ogTicketId}/categories`, {
    method: "PUT",
    body: { category_ids: categoryIds }
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "OgTicketCategoryModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    ogTicketId: {},
    selectedIds: {}
  },
  emits: ["update:open", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const modelOpen = vueExports.computed({
      get: () => props.open,
      set: (v) => emit("update:open", v)
    });
    const toast = useToast();
    const categories = vueExports.ref([]);
    const selected = vueExports.ref(/* @__PURE__ */ new Set());
    const isLoading = vueExports.ref(false);
    const isSubmitting = vueExports.ref(false);
    const newCategoryName = vueExports.ref("");
    const creatingNew = vueExports.ref(false);
    const editingId = vueExports.ref(null);
    const editingName = vueExports.ref("");
    async function loadCategories() {
      isLoading.value = true;
      try {
        const res = await apiListOgTicketCategories({ per_page: 200, sort_by: "sort_order", sort_direction: "asc" });
        categories.value = res.data;
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Không tải được danh sách danh mục"), color: "error" });
      } finally {
        isLoading.value = false;
      }
    }
    vueExports.watch(
      () => props.open,
      (v) => {
        if (v) {
          selected.value = new Set(props.selectedIds);
          editingId.value = null;
          newCategoryName.value = "";
          loadCategories();
        }
      }
    );
    function toggle(id) {
      const next = new Set(selected.value);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      selected.value = next;
    }
    async function handleCreate() {
      const name = newCategoryName.value.trim();
      if (!name) return;
      creatingNew.value = true;
      try {
        const res = await apiCreateOgTicketCategory({ name });
        categories.value = [...categories.value, res.data];
        selected.value = /* @__PURE__ */ new Set([...selected.value, res.data.id]);
        newCategoryName.value = "";
        toast.add({ title: "Thêm danh mục thành công", color: "success" });
      } catch (err) {
        const validation = getApiValidationErrors(err);
        const msg = validation?.name?.[0] ?? getApiErrorMessage(err, "Thêm danh mục thất bại");
        toast.add({ title: msg, color: "error" });
      } finally {
        creatingNew.value = false;
      }
    }
    function startEdit(cat) {
      editingId.value = cat.id;
      editingName.value = cat.name;
    }
    function cancelEdit() {
      editingId.value = null;
      editingName.value = "";
    }
    async function handleSaveEdit(id) {
      const name = editingName.value.trim();
      if (!name) return;
      try {
        const res = await apiUpdateOgTicketCategory(id, { name });
        categories.value = categories.value.map((c) => c.id === id ? res.data : c);
        editingId.value = null;
        toast.add({ title: "Cập nhật danh mục thành công", color: "success" });
      } catch (err) {
        const validation = getApiValidationErrors(err);
        const msg = validation?.name?.[0] ?? getApiErrorMessage(err, "Cập nhật thất bại");
        toast.add({ title: msg, color: "error" });
      }
    }
    async function handleDelete(cat) {
      if (!confirm(`Xoá danh mục "${cat.name}"?`)) return;
      try {
        await apiDeleteOgTicketCategory(cat.id);
        categories.value = categories.value.filter((c) => c.id !== cat.id);
        const next = new Set(selected.value);
        next.delete(cat.id);
        selected.value = next;
        toast.add({ title: "Đã xoá danh mục", color: "success" });
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Không thể xoá danh mục"), color: "error" });
      }
    }
    async function handleSubmit() {
      isSubmitting.value = true;
      try {
        await apiSyncOgTicketCategories(props.ogTicketId, Array.from(selected.value));
        const finalList = categories.value.filter((c) => selected.value.has(c.id));
        toast.add({ title: "Lưu danh mục thành công", color: "success" });
        emit("saved", finalList);
        emit("update:open", false);
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu danh mục thất bại"), color: "error" });
      } finally {
        isSubmitting.value = false;
      }
    }
    function handleClose() {
      emit("update:open", false);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UButton = _sfc_main$c;
      const _component_UCheckbox = _sfc_main$3;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: vueExports.unref(modelOpen),
        "onUpdate:open": ($event) => vueExports.isRef(modelOpen) ? modelOpen.value = $event : null,
        title: "Quản lý danh mục",
        description: "Chọn hoặc tạo các danh mục mô tả yêu cầu."
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}><div class="flex gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(newCategoryName),
              "onUpdate:modelValue": ($event) => vueExports.isRef(newCategoryName) ? newCategoryName.value = $event : null,
              placeholder: "Tên danh mục mới",
              class: "flex-1",
              disabled: vueExports.unref(creatingNew),
              onKeyup: handleCreate
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              loading: vueExports.unref(creatingNew),
              disabled: !vueExports.unref(newCategoryName).trim(),
              onClick: handleCreate
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Thêm `);
                } else {
                  return [
                    vueExports.createTextVNode(" Thêm ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (vueExports.unref(isLoading)) {
              _push2(`<div class="py-8 text-center text-slate-500 text-sm"${_scopeId}> Đang tải... </div>`);
            } else if (vueExports.unref(categories).length === 0) {
              _push2(`<div class="py-8 text-center text-slate-500 text-sm"${_scopeId}> Chưa có danh mục. Thêm danh mục đầu tiên phía trên. </div>`);
            } else {
              _push2(`<div class="max-h-96 overflow-y-auto divide-y divide-slate-100 rounded-lg border border-slate-200"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(categories), (cat) => {
                _push2(`<div class="flex items-center gap-3 px-3 py-2"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                  "model-value": vueExports.unref(selected).has(cat.id),
                  "onUpdate:modelValue": ($event) => toggle(cat.id)
                }, null, _parent2, _scopeId));
                _push2(`<div class="flex-1 min-w-0"${_scopeId}>`);
                if (vueExports.unref(editingId) === cat.id) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(editingName),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(editingName) ? editingName.value = $event : null,
                    size: "sm",
                    autofocus: "",
                    onKeyup: [($event) => handleSaveEdit(cat.id), cancelEdit]
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<span class="text-sm truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(cat.name)}</span>`);
                }
                _push2(`</div><div class="flex items-center gap-1"${_scopeId}>`);
                if (vueExports.unref(editingId) === cat.id) {
                  _push2(`<!--[-->`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-check",
                    size: "xs",
                    color: "success",
                    variant: "ghost",
                    onClick: ($event) => handleSaveEdit(cat.id)
                  }, null, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-x",
                    size: "xs",
                    color: "neutral",
                    variant: "ghost",
                    onClick: cancelEdit
                  }, null, _parent2, _scopeId));
                  _push2(`<!--]-->`);
                } else {
                  _push2(`<!--[-->`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-pencil",
                    size: "xs",
                    color: "neutral",
                    variant: "ghost",
                    onClick: ($event) => startEdit(cat)
                  }, null, _parent2, _scopeId));
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-trash-2",
                    size: "xs",
                    color: "error",
                    variant: "ghost",
                    onClick: ($event) => handleDelete(cat)
                  }, null, _parent2, _scopeId));
                  _push2(`<!--]-->`);
                }
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                vueExports.createVNode("div", { class: "flex gap-2" }, [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(newCategoryName),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(newCategoryName) ? newCategoryName.value = $event : null,
                    placeholder: "Tên danh mục mới",
                    class: "flex-1",
                    disabled: vueExports.unref(creatingNew),
                    onKeyup: vueExports.withKeys(handleCreate, ["enter"])
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-plus",
                    loading: vueExports.unref(creatingNew),
                    disabled: !vueExports.unref(newCategoryName).trim(),
                    onClick: handleCreate
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Thêm ")
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ]),
                vueExports.unref(isLoading) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "py-8 text-center text-slate-500 text-sm"
                }, " Đang tải... ")) : vueExports.unref(categories).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "py-8 text-center text-slate-500 text-sm"
                }, " Chưa có danh mục. Thêm danh mục đầu tiên phía trên. ")) : (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  class: "max-h-96 overflow-y-auto divide-y divide-slate-100 rounded-lg border border-slate-200"
                }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(categories), (cat) => {
                    return vueExports.openBlock(), vueExports.createBlock("div", {
                      key: cat.id,
                      class: "flex items-center gap-3 px-3 py-2"
                    }, [
                      vueExports.createVNode(_component_UCheckbox, {
                        "model-value": vueExports.unref(selected).has(cat.id),
                        "onUpdate:modelValue": ($event) => toggle(cat.id)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                        vueExports.unref(editingId) === cat.id ? (vueExports.openBlock(), vueExports.createBlock(_component_UInput, {
                          key: 0,
                          modelValue: vueExports.unref(editingName),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(editingName) ? editingName.value = $event : null,
                          size: "sm",
                          autofocus: "",
                          onKeyup: [
                            vueExports.withKeys(($event) => handleSaveEdit(cat.id), ["enter"]),
                            vueExports.withKeys(cancelEdit, ["esc"])
                          ]
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeyup"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "text-sm truncate"
                        }, vueExports.toDisplayString(cat.name), 1))
                      ]),
                      vueExports.createVNode("div", { class: "flex items-center gap-1" }, [
                        vueExports.unref(editingId) === cat.id ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createVNode(_component_UButton, {
                            icon: "i-lucide-check",
                            size: "xs",
                            color: "success",
                            variant: "ghost",
                            onClick: ($event) => handleSaveEdit(cat.id)
                          }, null, 8, ["onClick"]),
                          vueExports.createVNode(_component_UButton, {
                            icon: "i-lucide-x",
                            size: "xs",
                            color: "neutral",
                            variant: "ghost",
                            onClick: cancelEdit
                          })
                        ], 64)) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                          vueExports.createVNode(_component_UButton, {
                            icon: "i-lucide-pencil",
                            size: "xs",
                            color: "neutral",
                            variant: "ghost",
                            onClick: ($event) => startEdit(cat)
                          }, null, 8, ["onClick"]),
                          vueExports.createVNode(_component_UButton, {
                            icon: "i-lucide-trash-2",
                            size: "xs",
                            color: "error",
                            variant: "ghost",
                            onClick: ($event) => handleDelete(cat)
                          }, null, 8, ["onClick"])
                        ], 64))
                      ])
                    ]);
                  }), 128))
                ]))
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "ghost",
              disabled: vueExports.unref(isSubmitting),
              onClick: handleClose
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Huỷ `);
                } else {
                  return [
                    vueExports.createTextVNode(" Huỷ ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              loading: vueExports.unref(isSubmitting),
              onClick: handleSubmit
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Lưu `);
                } else {
                  return [
                    vueExports.createTextVNode(" Lưu ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "ghost",
                  disabled: vueExports.unref(isSubmitting),
                  onClick: handleClose
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Huỷ ")
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                vueExports.createVNode(_component_UButton, {
                  loading: vueExports.unref(isSubmitting),
                  onClick: handleSubmit
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Lưu ")
                  ]),
                  _: 1
                }, 8, ["loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/og-ticket/OgTicketCategoryModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_21 = Object.assign(_sfc_main, { __name: "SharedOgTicketCategoryModal" });

export { __nuxt_component_21 as _ };
//# sourceMappingURL=OgTicketCategoryModal-vqxLvQYn.mjs.map
