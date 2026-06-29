import { _ as _sfc_main$1 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$2 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$3 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_4 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$4 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$5 } from './Switch-1cJNH-6C.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$6 } from './Checkbox-Cp_FPUkd.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "RoleFormModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    item: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) },
    permissions: { default: () => [] }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formState = vueExports.reactive({
      name: "",
      description: null,
      is_active: true,
      selectedPermissionIds: /* @__PURE__ */ new Set()
    });
    const isDefault = vueExports.computed(() => props.item?.type?.value === "default");
    const isEditMode = vueExports.computed(() => props.mode === "edit");
    const modalTitle = vueExports.computed(() => {
      if (props.mode === "create") return "Thêm vai trò";
      if (isDefault.value) return "Sửa vai trò mặc định";
      return "Sửa vai trò";
    });
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        if (props.mode === "edit" && props.item) {
          formState.name = props.item.name;
          formState.description = props.item.description ?? null;
          formState.is_active = Boolean(props.item.is_active);
          const permIds = props.item.permissions ?? [];
          formState.selectedPermissionIds = new Set(permIds.map((p) => p.id));
        } else {
          formState.name = "";
          formState.description = null;
          formState.is_active = true;
          formState.selectedPermissionIds = /* @__PURE__ */ new Set();
        }
      }
    );
    const ACTION_ORDER = {
      view: 0,
      store: 1,
      update: 2,
      destroy: 3
    };
    function getActionOrder(action) {
      return ACTION_ORDER[action] ?? 99;
    }
    const MODULE_LAYOUT = [
      { label: "HRM", subModules: ["accounts", "departments", "job-titles", "roles", "projects"] },
      { label: "Khách hàng", subModules: ["customers"] },
      { label: "Quản lý ticket", subModules: ["ticket-pool", "og-tickets"] },
      { label: "Quản lý công việc", subModules: ["work-schedules", "schedule-slots", "workforce-capacity", "shifts"] },
      { label: "Danh mục", subModules: ["catalog-suppliers", "service-categories", "catalog-items"] },
      { label: "Quản lý đơn hàng", subModules: ["quotes", "orders"] },
      { label: "Kế toán/Tài chính", subModules: ["commission", "receivables", "reconciliations", "closing-periods", "treasury"] },
      {
        label: "Báo cáo",
        subModules: [
          "report-overview",
          "report-revenue-ticket",
          "report-revenue-profit",
          "report-operating-profit",
          "report-commission",
          "report-cashflow",
          "report-sla",
          "report-csat"
        ]
      },
      {
        label: "Cài đặt hệ thống",
        subModules: [
          "settings-sla",
          "settings-bank-account",
          "settings-acceptance-report",
          "policies"
        ]
      }
    ];
    const subModuleBuckets = vueExports.computed(() => {
      const buckets = /* @__PURE__ */ new Map();
      for (const perm of props.permissions) {
        const key = perm.sub_module.value;
        if (!buckets.has(key)) {
          buckets.set(key, { key, label: perm.sub_module.label, permissions: [] });
        }
        buckets.get(key).permissions.push(perm);
      }
      for (const bucket of buckets.values()) {
        bucket.permissions.sort((a, b) => getActionOrder(a.action.value) - getActionOrder(b.action.value));
      }
      return buckets;
    });
    const moduleGroups = vueExports.computed(() => {
      const buckets = subModuleBuckets.value;
      const placed = /* @__PURE__ */ new Set();
      const result = [];
      for (const module of MODULE_LAYOUT) {
        const subModules = [];
        for (const key of module.subModules) {
          const bucket = buckets.get(key);
          if (bucket) {
            subModules.push(bucket);
            placed.add(key);
          }
        }
        if (subModules.length > 0) {
          result.push({ label: module.label, subModules });
        }
      }
      const leftovers = [];
      for (const [key, bucket] of buckets) {
        if (!placed.has(key)) leftovers.push(bucket);
      }
      if (leftovers.length > 0) {
        result.push({ label: "Khác", subModules: leftovers });
      }
      return result;
    });
    const permissionGroups = vueExports.computed(
      () => moduleGroups.value.flatMap((m) => m.subModules)
    );
    const actionColumns = vueExports.computed(() => {
      const seen = /* @__PURE__ */ new Map();
      for (const group of permissionGroups.value) {
        for (const perm of group.permissions) {
          if (!seen.has(perm.action.value)) {
            seen.set(perm.action.value, perm.action.label);
          }
        }
      }
      const entries = Array.from(seen.entries());
      entries.sort((a, b) => getActionOrder(a[0]) - getActionOrder(b[0]));
      return entries.map(([value, label]) => ({ value, label }));
    });
    function findPermByAction(group, actionValue) {
      return group.permissions.find((p) => p.action.value === actionValue);
    }
    function findViewPermission(permId) {
      for (const group of permissionGroups.value) {
        const perm = group.permissions.find((p) => p.id === permId);
        if (perm) {
          return group.permissions.find((p) => p.action.value === "view");
        }
      }
    }
    function findNonViewPermissions(permId) {
      for (const group of permissionGroups.value) {
        const perm = group.permissions.find((p) => p.id === permId);
        if (perm) {
          return group.permissions.filter((p) => p.action.value !== "view");
        }
      }
      return [];
    }
    function togglePermission(id) {
      const perm = props.permissions.find((p) => p.id === id);
      if (!perm) return;
      if (formState.selectedPermissionIds.has(id)) {
        formState.selectedPermissionIds.delete(id);
        if (perm.action.value === "view") {
          for (const p of findNonViewPermissions(id)) {
            formState.selectedPermissionIds.delete(p.id);
          }
        }
      } else {
        formState.selectedPermissionIds.add(id);
        if (["store", "update", "destroy"].includes(perm.action.value)) {
          const viewPerm = findViewPermission(id);
          if (viewPerm) {
            formState.selectedPermissionIds.add(viewPerm.id);
          }
        }
      }
    }
    function isGroupAllSelected(group) {
      return group.permissions.every((p) => formState.selectedPermissionIds.has(p.id));
    }
    function toggleGroup(group) {
      const allSelected = isGroupAllSelected(group);
      for (const perm of group.permissions) {
        if (allSelected) {
          formState.selectedPermissionIds.delete(perm.id);
        } else {
          formState.selectedPermissionIds.add(perm.id);
        }
      }
    }
    function isViewDisabled(perm, group) {
      if (perm.action.value !== "view") return false;
      return group.permissions.some(
        (p) => ["store", "update", "destroy"].includes(p.action.value) && formState.selectedPermissionIds.has(p.id)
      );
    }
    function isModuleAllSelected(module) {
      return module.subModules.every((sub) => isGroupAllSelected(sub));
    }
    function toggleModule(module) {
      const allSelected = isModuleAllSelected(module);
      for (const sub of module.subModules) {
        for (const perm of sub.permissions) {
          if (allSelected) {
            formState.selectedPermissionIds.delete(perm.id);
          } else {
            formState.selectedPermissionIds.add(perm.id);
          }
        }
      }
    }
    const isAllSelected = vueExports.computed(
      () => props.permissions.length > 0 && props.permissions.every((p) => formState.selectedPermissionIds.has(p.id))
    );
    function toggleAll() {
      if (isAllSelected.value) {
        formState.selectedPermissionIds.clear();
      } else {
        for (const p of props.permissions) {
          formState.selectedPermissionIds.add(p.id);
        }
      }
    }
    function handleSubmit() {
      const payload = {
        description: formState.description,
        is_active: formState.is_active,
        permission_ids: Array.from(formState.selectedPermissionIds)
      };
      if (!isDefault.value || !isEditMode.value) {
        payload.name = formState.name;
      }
      emit("submit", payload);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$1;
      const _component_UFormField = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_SharedCrudFormFieldError = __nuxt_component_4;
      const _component_UTextarea = _sfc_main$4;
      const _component_USwitch = _sfc_main$5;
      const _component_UButton = _sfc_main$c;
      const _component_UCheckbox = _sfc_main$6;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: vueExports.unref(modalTitle),
        ui: { content: "sm:max-w-3xl" },
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên vai trò",
              name: "name",
              required: !vueExports.unref(isDefault) || !vueExports.unref(isEditMode)
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Quản trị viên",
                    class: "w-full",
                    disabled: vueExports.unref(isDefault) && vueExports.unref(isEditMode)
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, _parent3, _scopeId2));
                  if (vueExports.unref(isDefault) && vueExports.unref(isEditMode)) {
                    _push3(`<p class="text-xs text-muted mt-1"${_scopeId2}> Không thể đổi tên vai trò mặc định </p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                      placeholder: "VD: Quản trị viên",
                      class: "w-full",
                      disabled: vueExports.unref(isDefault) && vueExports.unref(isEditMode)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.name
                    }, null, 8, ["errors"]),
                    vueExports.unref(isDefault) && vueExports.unref(isEditMode) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-xs text-muted mt-1"
                    }, " Không thể đổi tên vai trò mặc định ")) : vueExports.createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mô tả",
              name: "description"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).description,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                    placeholder: "Mô tả vai trò (tuỳ chọn)",
                    rows: 2,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).description,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                      placeholder: "Mô tả vai trò (tuỳ chọn)",
                      rows: 2,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Trạng thái",
              name: "is_active"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
                    modelValue: vueExports.unref(formState).is_active,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_active = $event,
                    color: "success",
                    label: "Hoạt động"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.is_active
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USwitch, {
                      modelValue: vueExports.unref(formState).is_active,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_active = $event,
                      color: "success",
                      label: "Hoạt động"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.is_active
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(permissionGroups).length > 0) {
              _push2(`<div class="border-t border-border-gray pt-4"${_scopeId}><div class="flex items-center justify-between mb-3"${_scopeId}><p class="font-semibold text-sm text-slate-900"${_scopeId}> Phân quyền </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: vueExports.unref(isAllSelected) ? "Bỏ chọn tất cả" : "Chọn tất cả",
                color: "neutral",
                variant: "link",
                size: "sm",
                onClick: toggleAll
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="border border-border-gray rounded-lg overflow-hidden"${_scopeId}><table class="w-full text-sm"${_scopeId}><thead${_scopeId}><tr class="bg-slate-100 border-b border-border-gray"${_scopeId}><th class="text-left py-3 px-4 text-[13px] font-semibold text-slate-600"${_scopeId}> Module </th><th class="text-center py-3 px-4 text-[13px] font-semibold text-slate-600 w-20"${_scopeId}> Admin </th><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(actionColumns), (col) => {
                _push2(`<th class="text-center py-3 px-4 text-[13px] font-semibold text-slate-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(col.label)}</th>`);
              });
              _push2(`<!--]--></tr></thead><tbody${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(moduleGroups), (module) => {
                _push2(`<!--[--><tr class="bg-slate-200/70 border-t border-b border-border-gray"${_scopeId}><td class="py-2 px-4 text-[13px] font-bold uppercase tracking-wide text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(module.label)}</td><td class="py-2 px-4 text-center"${_scopeId}><div class="flex justify-center"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                  "model-value": isModuleAllSelected(module),
                  "onUpdate:modelValue": ($event) => toggleModule(module)
                }, null, _parent2, _scopeId));
                _push2(`</div></td><td${serverRenderer_cjs_prodExports.ssrRenderAttr("colspan", vueExports.unref(actionColumns).length)}${_scopeId}></td></tr><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(module.subModules, (group, index) => {
                  _push2(`<tr class="${serverRenderer_cjs_prodExports.ssrRenderClass([index % 2 === 0 ? "bg-white" : "bg-slate-50/60", "border-b border-border-gray transition-colors"])}"${_scopeId}><td class="py-3 px-4 pl-8 text-slate-800"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(group.label)}</td><td class="py-3 px-4 text-center"${_scopeId}><div class="flex justify-center"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                    "model-value": isGroupAllSelected(group),
                    "onUpdate:modelValue": ($event) => toggleGroup(group)
                  }, null, _parent2, _scopeId));
                  _push2(`</div></td><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(actionColumns), (col) => {
                    _push2(`<td class="py-3 px-4 text-center"${_scopeId}><div class="flex justify-center"${_scopeId}>`);
                    if (findPermByAction(group, col.value)) {
                      _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                        "model-value": vueExports.unref(formState).selectedPermissionIds.has(findPermByAction(group, col.value).id),
                        disabled: isViewDisabled(findPermByAction(group, col.value), group),
                        "onUpdate:modelValue": ($event) => togglePermission(findPermByAction(group, col.value).id)
                      }, null, _parent2, _scopeId));
                    } else {
                      _push2(`<span class="text-slate-300"${_scopeId}>—</span>`);
                    }
                    _push2(`</div></td>`);
                  });
                  _push2(`<!--]--></tr>`);
                });
                _push2(`<!--]--><!--]-->`);
              });
              _push2(`<!--]--></tbody></table></div><p class="text-xs text-muted mt-2"${_scopeId}> Chọn quyền Tạo / Sửa / Xoá sẽ tự động bật quyền Xem. </p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Tên vai trò",
                  name: "name",
                  required: !vueExports.unref(isDefault) || !vueExports.unref(isEditMode)
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                      placeholder: "VD: Quản trị viên",
                      class: "w-full",
                      disabled: vueExports.unref(isDefault) && vueExports.unref(isEditMode)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.name
                    }, null, 8, ["errors"]),
                    vueExports.unref(isDefault) && vueExports.unref(isEditMode) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-xs text-muted mt-1"
                    }, " Không thể đổi tên vai trò mặc định ")) : vueExports.createCommentVNode("", true)
                  ]),
                  _: 1
                }, 8, ["required"]),
                vueExports.createVNode(_component_UFormField, {
                  label: "Mô tả",
                  name: "description"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).description,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                      placeholder: "Mô tả vai trò (tuỳ chọn)",
                      rows: 2,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Trạng thái",
                  name: "is_active"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USwitch, {
                      modelValue: vueExports.unref(formState).is_active,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_active = $event,
                      color: "success",
                      label: "Hoạt động"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.is_active
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.unref(permissionGroups).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "border-t border-border-gray pt-4"
                }, [
                  vueExports.createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                    vueExports.createVNode("p", { class: "font-semibold text-sm text-slate-900" }, " Phân quyền "),
                    vueExports.createVNode(_component_UButton, {
                      label: vueExports.unref(isAllSelected) ? "Bỏ chọn tất cả" : "Chọn tất cả",
                      color: "neutral",
                      variant: "link",
                      size: "sm",
                      onClick: toggleAll
                    }, null, 8, ["label"])
                  ]),
                  vueExports.createVNode("div", { class: "border border-border-gray rounded-lg overflow-hidden" }, [
                    vueExports.createVNode("table", { class: "w-full text-sm" }, [
                      vueExports.createVNode("thead", null, [
                        vueExports.createVNode("tr", { class: "bg-slate-100 border-b border-border-gray" }, [
                          vueExports.createVNode("th", { class: "text-left py-3 px-4 text-[13px] font-semibold text-slate-600" }, " Module "),
                          vueExports.createVNode("th", { class: "text-center py-3 px-4 text-[13px] font-semibold text-slate-600 w-20" }, " Admin "),
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(actionColumns), (col) => {
                            return vueExports.openBlock(), vueExports.createBlock("th", {
                              key: col.value,
                              class: "text-center py-3 px-4 text-[13px] font-semibold text-slate-600"
                            }, vueExports.toDisplayString(col.label), 1);
                          }), 128))
                        ])
                      ]),
                      vueExports.createVNode("tbody", null, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(moduleGroups), (module) => {
                          return vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, {
                            key: module.label
                          }, [
                            vueExports.createVNode("tr", { class: "bg-slate-200/70 border-t border-b border-border-gray" }, [
                              vueExports.createVNode("td", { class: "py-2 px-4 text-[13px] font-bold uppercase tracking-wide text-slate-700" }, vueExports.toDisplayString(module.label), 1),
                              vueExports.createVNode("td", { class: "py-2 px-4 text-center" }, [
                                vueExports.createVNode("div", { class: "flex justify-center" }, [
                                  vueExports.createVNode(_component_UCheckbox, {
                                    "model-value": isModuleAllSelected(module),
                                    "onUpdate:modelValue": ($event) => toggleModule(module)
                                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                                ])
                              ]),
                              vueExports.createVNode("td", {
                                colspan: vueExports.unref(actionColumns).length
                              }, null, 8, ["colspan"])
                            ]),
                            (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(module.subModules, (group, index) => {
                              return vueExports.openBlock(), vueExports.createBlock("tr", {
                                key: group.key,
                                class: ["border-b border-border-gray transition-colors", index % 2 === 0 ? "bg-white" : "bg-slate-50/60"]
                              }, [
                                vueExports.createVNode("td", { class: "py-3 px-4 pl-8 text-slate-800" }, vueExports.toDisplayString(group.label), 1),
                                vueExports.createVNode("td", { class: "py-3 px-4 text-center" }, [
                                  vueExports.createVNode("div", { class: "flex justify-center" }, [
                                    vueExports.createVNode(_component_UCheckbox, {
                                      "model-value": isGroupAllSelected(group),
                                      "onUpdate:modelValue": ($event) => toggleGroup(group)
                                    }, null, 8, ["model-value", "onUpdate:modelValue"])
                                  ])
                                ]),
                                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(actionColumns), (col) => {
                                  return vueExports.openBlock(), vueExports.createBlock("td", {
                                    key: col.value,
                                    class: "py-3 px-4 text-center"
                                  }, [
                                    vueExports.createVNode("div", { class: "flex justify-center" }, [
                                      findPermByAction(group, col.value) ? (vueExports.openBlock(), vueExports.createBlock(_component_UCheckbox, {
                                        key: 0,
                                        "model-value": vueExports.unref(formState).selectedPermissionIds.has(findPermByAction(group, col.value).id),
                                        disabled: isViewDisabled(findPermByAction(group, col.value), group),
                                        "onUpdate:modelValue": ($event) => togglePermission(findPermByAction(group, col.value).id)
                                      }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                                        key: 1,
                                        class: "text-slate-300"
                                      }, "—"))
                                    ])
                                  ]);
                                }), 128))
                              ], 2);
                            }), 128))
                          ], 64);
                        }), 128))
                      ])
                    ])
                  ]),
                  vueExports.createVNode("p", { class: "text-xs text-muted mt-2" }, " Chọn quyền Tạo / Sửa / Xoá sẽ tự động bật quyền Xem. ")
                ])) : vueExports.createCommentVNode("", true)
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
              onClick: handleSubmit
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
                  onClick: handleSubmit
                }, null, 8, ["icon", "label", "disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/role/RoleFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main, { __name: "RoleFormModal" });

export { __nuxt_component_11 as _ };
//# sourceMappingURL=RoleFormModal-C5YBlGwX.mjs.map
