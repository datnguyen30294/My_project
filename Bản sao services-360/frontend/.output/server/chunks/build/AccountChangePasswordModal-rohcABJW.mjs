import { _ as __nuxt_component_0 } from './BaseFormModal-CG7aCaIV.mjs';
import { _ as __nuxt_component_5 } from './AvatarUpload-CsEPx2JP.mjs';
import { _ as _sfc_main$6 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$7 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_4$1 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$8 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$b } from './SelectMenu-DKHEMZj7.mjs';
import { v as vueExports, j as useToast, h as useAuth, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, l as _sfc_main$c$1 } from './server.mjs';
import { u as useEntitySelect, a as useEntityMultiSelect } from './useEntitySelect-DG9pQ_n0.mjs';
import { u as useDepartmentList, d as apiGetDepartment } from './useDepartments-C8BvGnCs.mjs';
import { u as useJobTitleList, a as apiGetJobTitle } from './useJobTitles-DzuQHrcS.mjs';
import { f as apiSearchRoles, d as useRoleList, g as apiGetRole } from './useRoles-Bl-GRSKI.mjs';
import { d as useProjectList, e as apiGetProject } from './useProjects-D4K3VYdb.mjs';
import { _ as _sfc_main$9 } from './Switch-1cJNH-6C.mjs';
import { _ as __nuxt_component_1 } from './CapabilityRatingBadge-BBWBj9qN.mjs';
import { _ as _sfc_main$a } from './Separator-DeO-OPIs.mjs';
import { _ as _sfc_main$c } from './Tooltip-Dasyzope.mjs';
import { V as VIETNAM_BANKS, f as findBankByBin } from './vietqr-D50vgfgj.mjs';
import { f as apiDeleteAccountAvatar, g as apiUploadAccountAvatar } from './useAccounts-BDWM8ZpB.mjs';
import { _ as _sfc_main$d } from './Modal-BimZZbNl.mjs';

const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DepartmentMultiSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: () => [] },
    placeholder: { default: "Chọn phòng ban" }
  },
  emits: ["update:modelValue", "update:firstLabel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { selectedItems, items, loading, onSearchTerm } = useEntityMultiSelect(
      () => props.modelValue,
      (val) => emit("update:modelValue", val),
      {
        fetchList: useDepartmentList,
        resolveItem: async (id) => {
          const r = await apiGetDepartment(id);
          return { id: r.data.id, label: r.data.name };
        }
      }
    );
    vueExports.watch(
      selectedItems,
      (val) => {
        emit("update:firstLabel", val.length ? val[0]?.label ?? null : null);
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$b;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItems),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItems) ? selectedItems.value = $event : null,
        multiple: "",
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm phòng ban..." },
        placeholder: __props.placeholder,
        class: "w-full",
        "onUpdate:searchTerm": vueExports.unref(onSearchTerm)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/department/DepartmentMultiSelect.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$5, { __name: "SharedDepartmentMultiSelect" });
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "JobTitleSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: null },
    placeholder: { default: "Chọn chức danh" }
  },
  emits: ["update:modelValue", "update:label"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
      () => props.modelValue,
      (val) => emit("update:modelValue", val),
      {
        fetchList: useJobTitleList,
        resolveItem: async (id) => {
          const r = await apiGetJobTitle(id);
          return { id: r.data.id, label: r.data.name };
        },
        onLabelChange: (val) => emit("update:label", val)
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$b;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItem),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItem) ? selectedItem.value = $event : null,
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm chức danh..." },
        placeholder: __props.placeholder,
        clear: "",
        class: "w-full",
        "onUpdate:searchTerm": vueExports.unref(onSearchTerm)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/job-title/JobTitleSelect.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$4, { __name: "SharedJobTitleSelect" });
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "RoleSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: null },
    placeholder: { default: "Chọn role" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
      () => props.modelValue,
      (val) => emit("update:modelValue", val),
      {
        fetchList: useRoleList,
        resolveItem: async (id) => {
          const r = await apiGetRole(id);
          return { id: r.data.id, label: r.data.name };
        },
        syncExternalChanges: true
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$b;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItem),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItem) ? selectedItem.value = $event : null,
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm role..." },
        placeholder: __props.placeholder,
        clear: "",
        class: "w-full",
        "onUpdate:searchTerm": vueExports.unref(onSearchTerm)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/role/RoleSelect.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$3, { __name: "SharedRoleSelect" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProjectMultiSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: () => [] },
    placeholder: { default: "Chọn dự án" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { selectedItems, items, loading, onSearchTerm } = useEntityMultiSelect(
      () => props.modelValue,
      (val) => emit("update:modelValue", val),
      {
        fetchList: useProjectList,
        resolveItem: async (id) => {
          const r = await apiGetProject(id);
          return { id: r.data.id, label: r.data.name };
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$b;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItems),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItems) ? selectedItems.value = $event : null,
        multiple: "",
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm dự án..." },
        placeholder: __props.placeholder,
        class: "w-full",
        "onUpdate:searchTerm": vueExports.unref(onSearchTerm)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/project/ProjectMultiSelect.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$2, { __name: "SharedProjectMultiSelect" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AccountFormModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    item: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) }
  },
  emits: ["update:open", "submit", "avatar-changed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const genderOptions = [
      { label: "Nam", value: "male" },
      { label: "Nữ", value: "female" },
      { label: "Khác", value: "other" }
    ];
    const bankOptions = VIETNAM_BANKS.map((b) => ({
      label: `${b.shortName} — ${b.name}`,
      value: b.bin
    }));
    const formState = vueExports.reactive({
      email: "",
      name: "",
      employee_code: "",
      gender: void 0,
      department_ids: [],
      job_title_id: null,
      role_id: null,
      project_ids: [],
      is_active: true,
      password: "",
      bank_bin: "",
      bank_label: "",
      bank_account_number: "",
      bank_account_name: "",
      capability_rating: null
    });
    vueExports.watch(() => formState.bank_bin, (bin) => {
      const bank = findBankByBin(bin);
      if (bank) {
        formState.bank_label = bank.shortName;
      }
    });
    const showPassword = vueExports.ref(false);
    function generatePassword(length = 16) {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      formState.password = Array.from(array, (byte) => chars[byte % chars.length]).join("");
      showPassword.value = true;
    }
    const toast = useToast();
    const { user, fetchUser } = useAuth();
    const isAvatarLoading = vueExports.ref(false);
    function isCurrentUser() {
      return !!props.item && !!user.value && props.item.id === user.value.id;
    }
    async function handleAvatarUpload(file) {
      if (!props.item) return;
      isAvatarLoading.value = true;
      try {
        await apiUploadAccountAvatar(props.item.id, file);
        toast.add({ title: "Cập nhật ảnh đại diện thành công", color: "success" });
        emit("avatar-changed");
        if (isCurrentUser()) await fetchUser();
      } catch {
        toast.add({ title: "Tải ảnh lên thất bại", color: "error" });
      } finally {
        isAvatarLoading.value = false;
      }
    }
    async function handleAvatarDelete() {
      if (!props.item) return;
      isAvatarLoading.value = true;
      try {
        await apiDeleteAccountAvatar(props.item.id);
        toast.add({ title: "Xóa ảnh đại diện thành công", color: "success" });
        emit("avatar-changed");
        if (isCurrentUser()) await fetchUser();
      } catch {
        toast.add({ title: "Xóa ảnh thất bại", color: "error" });
      } finally {
        isAvatarLoading.value = false;
      }
    }
    const isInitializing = vueExports.ref(false);
    const departmentLabel = vueExports.ref(null);
    const jobTitleLabel = vueExports.ref(null);
    async function autoSelectRole() {
      if (isInitializing.value) return;
      if (!departmentLabel.value || !jobTitleLabel.value) return;
      try {
        const searchTerm = `${jobTitleLabel.value}-${departmentLabel.value}`;
        const rolesRes = await apiSearchRoles(searchTerm);
        const firstRole = rolesRes.data?.[0];
        if (firstRole) {
          formState.role_id = firstRole.id;
        }
      } catch {
      }
    }
    function onDepartmentFirstLabelChange(label) {
      departmentLabel.value = label;
      autoSelectRole();
    }
    function onJobTitleLabelChange(label) {
      jobTitleLabel.value = label;
      autoSelectRole();
    }
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        isInitializing.value = true;
        showPassword.value = false;
        departmentLabel.value = null;
        jobTitleLabel.value = null;
        if (props.mode === "edit" && props.item) {
          formState.email = props.item.email;
          formState.name = props.item.name;
          formState.employee_code = props.item.employee_code ?? "";
          formState.gender = props.item.gender?.value ?? void 0;
          formState.department_ids = (props.item.departments ?? []).map((d) => d.id);
          formState.job_title_id = props.item.job_title?.id ?? null;
          formState.role_id = props.item.role?.id ?? null;
          formState.project_ids = props.item.projects?.map((p) => p.id) ?? [];
          formState.is_active = Boolean(props.item.is_active);
          formState.password = "";
          formState.bank_bin = props.item.bank_info?.bin ?? "";
          formState.bank_label = props.item.bank_info?.label ?? "";
          formState.bank_account_number = props.item.bank_info?.account_number ?? "";
          formState.bank_account_name = props.item.bank_info?.account_name ?? "";
          formState.capability_rating = props.item.capability_rating ?? null;
        } else {
          formState.email = "";
          formState.name = "";
          formState.employee_code = "";
          formState.gender = void 0;
          formState.department_ids = [];
          formState.job_title_id = null;
          formState.role_id = null;
          formState.project_ids = [];
          formState.is_active = true;
          formState.password = "";
          formState.bank_bin = "";
          formState.bank_label = "";
          formState.bank_account_number = "";
          formState.bank_account_name = "";
          formState.capability_rating = null;
        }
        vueExports.nextTick(() => {
          isInitializing.value = false;
        });
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudBaseFormModal = __nuxt_component_0;
      const _component_SharedAvatarUpload = __nuxt_component_5;
      const _component_UFormField = _sfc_main$6;
      const _component_UInput = _sfc_main$7;
      const _component_SharedCrudFormFieldError = __nuxt_component_4$1;
      const _component_USelect = _sfc_main$8;
      const _component_SharedDepartmentMultiSelect = __nuxt_component_6;
      const _component_SharedJobTitleSelect = __nuxt_component_4;
      const _component_SharedRoleSelect = __nuxt_component_8;
      const _component_SharedProjectMultiSelect = __nuxt_component_9;
      const _component_USwitch = _sfc_main$9;
      const _component_SharedCapabilityRatingBadge = __nuxt_component_1;
      const _component_USeparator = _sfc_main$a;
      const _component_USelectMenu = _sfc_main$b;
      const _component_UIcon = _sfc_main$h;
      const _component_UTooltip = _sfc_main$c;
      const _component_UButton = _sfc_main$c$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudBaseFormModal, vueExports.mergeProps({
        open: __props.open,
        mode: __props.mode,
        loading: __props.loading,
        titles: { create: "Thêm tài khoản", edit: "Sửa tài khoản" },
        "onUpdate:open": ($event) => emit("update:open", $event),
        onSubmit: ($event) => emit("submit", { ...vueExports.unref(formState) })
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.mode === "edit" && __props.item) {
              _push2(`<div${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedAvatarUpload, {
                "current-url": __props.item.avatar_url,
                alt: __props.item.name,
                loading: vueExports.unref(isAvatarLoading),
                onUpload: handleAvatarUpload,
                onDelete: handleAvatarDelete
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Email",
              name: "email",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                    type: "email",
                    placeholder: "VD: nguyenvana@company.com",
                    class: "w-full",
                    disabled: __props.mode === "edit",
                    autocomplete: "off"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.email
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                      type: "email",
                      placeholder: "VD: nguyenvana@company.com",
                      class: "w-full",
                      disabled: __props.mode === "edit",
                      autocomplete: "off"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.email
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Họ tên",
              name: "name",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Nguyễn Văn A",
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
                      placeholder: "VD: Nguyễn Văn A",
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
              label: "Mã nhân viên",
              name: "employee_code",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).employee_code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).employee_code = $event,
                    placeholder: "VD: NV001",
                    class: "w-full",
                    disabled: __props.mode === "edit"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.employee_code
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).employee_code,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).employee_code = $event,
                      placeholder: "VD: NV001",
                      class: "w-full",
                      disabled: __props.mode === "edit"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.employee_code
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Giới tính",
              name: "gender"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(formState).gender,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).gender = $event,
                    items: genderOptions,
                    placeholder: "Chọn giới tính",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.gender
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(formState).gender,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).gender = $event,
                      items: genderOptions,
                      placeholder: "Chọn giới tính",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.gender
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Phòng ban",
              name: "department_ids",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedDepartmentMultiSelect, {
                    modelValue: vueExports.unref(formState).department_ids,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).department_ids = $event,
                    "onUpdate:firstLabel": onDepartmentFirstLabelChange
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.department_ids
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedDepartmentMultiSelect, {
                      modelValue: vueExports.unref(formState).department_ids,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).department_ids = $event,
                      "onUpdate:firstLabel": onDepartmentFirstLabelChange
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.department_ids
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Chức danh",
              name: "job_title_id",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedJobTitleSelect, {
                    modelValue: vueExports.unref(formState).job_title_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).job_title_id = $event,
                    "onUpdate:label": onJobTitleLabelChange
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.job_title_id
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedJobTitleSelect, {
                      modelValue: vueExports.unref(formState).job_title_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).job_title_id = $event,
                      "onUpdate:label": onJobTitleLabelChange
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.job_title_id
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Role",
              name: "role_id",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedRoleSelect, {
                    modelValue: vueExports.unref(formState).role_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).role_id = $event
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.role_id
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedRoleSelect, {
                      modelValue: vueExports.unref(formState).role_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).role_id = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.role_id
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Dự án",
              name: "project_ids"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectMultiSelect, {
                    modelValue: vueExports.unref(formState).project_ids,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_ids = $event
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.project_ids
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedProjectMultiSelect, {
                      modelValue: vueExports.unref(formState).project_ids,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_ids = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.project_ids
                    }, null, 8, ["errors"])
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
                } else {
                  return [
                    vueExports.createVNode(_component_USwitch, {
                      modelValue: vueExports.unref(formState).is_active,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_active = $event,
                      color: "success",
                      label: "Hoạt động"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Năng lực (1–10)",
              name: "capability_rating"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-3"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).capability_rating,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).capability_rating = $event,
                    type: "number",
                    min: 1,
                    max: 10,
                    placeholder: "VD: 7",
                    class: "w-28",
                    ui: { base: "tabular-nums" }
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCapabilityRatingBadge, {
                    rating: vueExports.unref(formState).capability_rating,
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.capability_rating
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex items-center gap-3" }, [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(formState).capability_rating,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).capability_rating = $event,
                        type: "number",
                        min: 1,
                        max: 10,
                        placeholder: "VD: 7",
                        class: "w-28",
                        ui: { base: "tabular-nums" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCapabilityRatingBadge, {
                        rating: vueExports.unref(formState).capability_rating,
                        size: "sm"
                      }, null, 8, ["rating"])
                    ]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.capability_rating
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-col gap-1"${_scopeId}><h3 class="text-sm font-semibold text-slate-900"${_scopeId}> Thông tin ngân hàng </h3><p class="text-xs text-slate-500"${_scopeId}> Dùng để sinh QR khi chuyển tiền ứng vật tư hoặc tiền hoa hồng cho nhân sự. Có thể bỏ trống. </p></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ngân hàng (VietQR BIN)",
              name: "bank_bin"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).bank_bin,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).bank_bin = $event,
                    items: vueExports.unref(bankOptions),
                    "value-key": "value",
                    placeholder: "Chọn ngân hàng...",
                    "search-input": { placeholder: "Tìm theo tên ngân hàng..." },
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.bank_bin
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).bank_bin,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).bank_bin = $event,
                      items: vueExports.unref(bankOptions),
                      "value-key": "value",
                      placeholder: "Chọn ngân hàng...",
                      "search-input": { placeholder: "Tìm theo tên ngân hàng..." },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.bank_bin
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Số tài khoản",
              name: "bank_account_number"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).bank_account_number,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).bank_account_number = $event,
                    placeholder: "VD: 19021234567890",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.bank_account_number
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).bank_account_number,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).bank_account_number = $event,
                      placeholder: "VD: 19021234567890",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.bank_account_number
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên chủ tài khoản",
              name: "bank_account_name",
              help: "Viết HOA, không dấu — đúng như trên app ngân hàng."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).bank_account_name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).bank_account_name = $event,
                    placeholder: "VD: NGUYEN VAN A",
                    class: "w-full",
                    onInput: ($event) => vueExports.unref(formState).bank_account_name = vueExports.unref(formState).bank_account_name.toUpperCase()
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.bank_account_name
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).bank_account_name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).bank_account_name = $event,
                      placeholder: "VD: NGUYEN VAN A",
                      class: "w-full",
                      onInput: ($event) => vueExports.unref(formState).bank_account_name = vueExports.unref(formState).bank_account_name.toUpperCase()
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.bank_account_name
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, null, null, _parent2, _scopeId));
            if (__props.mode === "create") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Mật khẩu",
                name: "password",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex gap-2"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(formState).password,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                      type: vueExports.unref(showPassword) ? "text" : "password",
                      placeholder: "Tối thiểu 8 ký tự",
                      class: "flex-1",
                      autocomplete: "new-password"
                    }, {
                      trailing: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                            name: vueExports.unref(showPassword) ? "i-lucide-eye-off" : "i-lucide-eye",
                            class: "cursor-pointer text-(--ui-text-dimmed) hover:text-(--ui-text)",
                            onClick: ($event) => showPassword.value = !vueExports.unref(showPassword)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_UIcon, {
                              name: vueExports.unref(showPassword) ? "i-lucide-eye-off" : "i-lucide-eye",
                              class: "cursor-pointer text-(--ui-text-dimmed) hover:text-(--ui-text)",
                              onClick: ($event) => showPassword.value = !vueExports.unref(showPassword)
                            }, null, 8, ["name", "onClick"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTooltip, { text: "Tạo mật khẩu ngẫu nhiên" }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                            color: "neutral",
                            variant: "outline",
                            icon: "i-lucide-key-round",
                            onClick: ($event) => generatePassword()
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_UButton, {
                              color: "neutral",
                              variant: "outline",
                              icon: "i-lucide-key-round",
                              onClick: ($event) => generatePassword()
                            }, null, 8, ["onClick"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.password
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "flex gap-2" }, [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).password,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                          type: vueExports.unref(showPassword) ? "text" : "password",
                          placeholder: "Tối thiểu 8 ký tự",
                          class: "flex-1",
                          autocomplete: "new-password"
                        }, {
                          trailing: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UIcon, {
                              name: vueExports.unref(showPassword) ? "i-lucide-eye-off" : "i-lucide-eye",
                              class: "cursor-pointer text-(--ui-text-dimmed) hover:text-(--ui-text)",
                              onClick: ($event) => showPassword.value = !vueExports.unref(showPassword)
                            }, null, 8, ["name", "onClick"])
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue", "type"]),
                        vueExports.createVNode(_component_UTooltip, { text: "Tạo mật khẩu ngẫu nhiên" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UButton, {
                              color: "neutral",
                              variant: "outline",
                              icon: "i-lucide-key-round",
                              onClick: ($event) => generatePassword()
                            }, null, 8, ["onClick"])
                          ]),
                          _: 1
                        })
                      ]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.password
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.mode === "edit" && __props.item ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 0 }, [
                vueExports.createVNode(_component_SharedAvatarUpload, {
                  "current-url": __props.item.avatar_url,
                  alt: __props.item.name,
                  loading: vueExports.unref(isAvatarLoading),
                  onUpload: handleAvatarUpload,
                  onDelete: handleAvatarDelete
                }, null, 8, ["current-url", "alt", "loading"])
              ])) : vueExports.createCommentVNode("", true),
              vueExports.createVNode(_component_UFormField, {
                label: "Email",
                name: "email",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                    type: "email",
                    placeholder: "VD: nguyenvana@company.com",
                    class: "w-full",
                    disabled: __props.mode === "edit",
                    autocomplete: "off"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.email
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Họ tên",
                name: "name",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Nguyễn Văn A",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Mã nhân viên",
                name: "employee_code",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).employee_code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).employee_code = $event,
                    placeholder: "VD: NV001",
                    class: "w-full",
                    disabled: __props.mode === "edit"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.employee_code
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Giới tính",
                name: "gender"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_USelect, {
                    modelValue: vueExports.unref(formState).gender,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).gender = $event,
                    items: genderOptions,
                    placeholder: "Chọn giới tính",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.gender
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Phòng ban",
                name: "department_ids",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SharedDepartmentMultiSelect, {
                    modelValue: vueExports.unref(formState).department_ids,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).department_ids = $event,
                    "onUpdate:firstLabel": onDepartmentFirstLabelChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.department_ids
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Chức danh",
                name: "job_title_id",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SharedJobTitleSelect, {
                    modelValue: vueExports.unref(formState).job_title_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).job_title_id = $event,
                    "onUpdate:label": onJobTitleLabelChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.job_title_id
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Role",
                name: "role_id",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SharedRoleSelect, {
                    modelValue: vueExports.unref(formState).role_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).role_id = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.role_id
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Dự án",
                name: "project_ids"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SharedProjectMultiSelect, {
                    modelValue: vueExports.unref(formState).project_ids,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_ids = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.project_ids
                  }, null, 8, ["errors"])
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
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Năng lực (1–10)",
                name: "capability_rating"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "flex items-center gap-3" }, [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).capability_rating,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).capability_rating = $event,
                      type: "number",
                      min: 1,
                      max: 10,
                      placeholder: "VD: 7",
                      class: "w-28",
                      ui: { base: "tabular-nums" }
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCapabilityRatingBadge, {
                      rating: vueExports.unref(formState).capability_rating,
                      size: "sm"
                    }, null, 8, ["rating"])
                  ]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.capability_rating
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_USeparator),
              vueExports.createVNode("div", { class: "flex flex-col gap-1" }, [
                vueExports.createVNode("h3", { class: "text-sm font-semibold text-slate-900" }, " Thông tin ngân hàng "),
                vueExports.createVNode("p", { class: "text-xs text-slate-500" }, " Dùng để sinh QR khi chuyển tiền ứng vật tư hoặc tiền hoa hồng cho nhân sự. Có thể bỏ trống. ")
              ]),
              vueExports.createVNode(_component_UFormField, {
                label: "Ngân hàng (VietQR BIN)",
                name: "bank_bin"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).bank_bin,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).bank_bin = $event,
                    items: vueExports.unref(bankOptions),
                    "value-key": "value",
                    placeholder: "Chọn ngân hàng...",
                    "search-input": { placeholder: "Tìm theo tên ngân hàng..." },
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.bank_bin
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Số tài khoản",
                name: "bank_account_number"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).bank_account_number,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).bank_account_number = $event,
                    placeholder: "VD: 19021234567890",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.bank_account_number
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Tên chủ tài khoản",
                name: "bank_account_name",
                help: "Viết HOA, không dấu — đúng như trên app ngân hàng."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).bank_account_name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).bank_account_name = $event,
                    placeholder: "VD: NGUYEN VAN A",
                    class: "w-full",
                    onInput: ($event) => vueExports.unref(formState).bank_account_name = vueExports.unref(formState).bank_account_name.toUpperCase()
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.bank_account_name
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_USeparator),
              __props.mode === "create" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                key: 1,
                label: "Mật khẩu",
                name: "password",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "flex gap-2" }, [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).password,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                      type: vueExports.unref(showPassword) ? "text" : "password",
                      placeholder: "Tối thiểu 8 ký tự",
                      class: "flex-1",
                      autocomplete: "new-password"
                    }, {
                      trailing: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UIcon, {
                          name: vueExports.unref(showPassword) ? "i-lucide-eye-off" : "i-lucide-eye",
                          class: "cursor-pointer text-(--ui-text-dimmed) hover:text-(--ui-text)",
                          onClick: ($event) => showPassword.value = !vueExports.unref(showPassword)
                        }, null, 8, ["name", "onClick"])
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue", "type"]),
                    vueExports.createVNode(_component_UTooltip, { text: "Tạo mật khẩu ngẫu nhiên" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UButton, {
                          color: "neutral",
                          variant: "outline",
                          icon: "i-lucide-key-round",
                          onClick: ($event) => generatePassword()
                        }, null, 8, ["onClick"])
                      ]),
                      _: 1
                    })
                  ]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.password
                  }, null, 8, ["errors"])
                ]),
                _: 1
              })) : vueExports.createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountFormModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_16 = Object.assign(_sfc_main$1, { __name: "AccountFormModal" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AccountChangePasswordModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    item: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formState = vueExports.reactive({
      password: "",
      password_confirmation: ""
    });
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        formState.password = "";
        formState.password_confirmation = "";
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$d;
      const _component_UFormField = _sfc_main$6;
      const _component_UInput = _sfc_main$7;
      const _component_SharedCrudFormFieldError = __nuxt_component_4$1;
      const _component_UButton = _sfc_main$c$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: "Đổi mật khẩu",
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.item) {
              _push2(`<p class="text-sm text-[var(--ui-text-muted)] mb-4"${_scopeId}> Đổi mật khẩu cho tài khoản <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.item.name)}</strong></p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mật khẩu mới",
              name: "password",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).password,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                    type: "password",
                    placeholder: "Tối thiểu 8 ký tự",
                    class: "w-full",
                    autocomplete: "new-password"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.password
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).password,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                      type: "password",
                      placeholder: "Tối thiểu 8 ký tự",
                      class: "w-full",
                      autocomplete: "new-password"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.password
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Xác nhận mật khẩu",
              name: "password_confirmation",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).password_confirmation,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).password_confirmation = $event,
                    type: "password",
                    placeholder: "Nhập lại mật khẩu",
                    class: "w-full",
                    autocomplete: "new-password"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.password_confirmation
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).password_confirmation,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).password_confirmation = $event,
                      type: "password",
                      placeholder: "Nhập lại mật khẩu",
                      class: "w-full",
                      autocomplete: "new-password"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.password_confirmation
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              __props.item ? (vueExports.openBlock(), vueExports.createBlock("p", {
                key: 0,
                class: "text-sm text-[var(--ui-text-muted)] mb-4"
              }, [
                vueExports.createTextVNode(" Đổi mật khẩu cho tài khoản "),
                vueExports.createVNode("strong", null, vueExports.toDisplayString(__props.item.name), 1)
              ])) : vueExports.createCommentVNode("", true),
              vueExports.createVNode("div", { class: "space-y-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Mật khẩu mới",
                  name: "password",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).password,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                      type: "password",
                      placeholder: "Tối thiểu 8 ký tự",
                      class: "w-full",
                      autocomplete: "new-password"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.password
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Xác nhận mật khẩu",
                  name: "password_confirmation",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).password_confirmation,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).password_confirmation = $event,
                      type: "password",
                      placeholder: "Nhập lại mật khẩu",
                      class: "w-full",
                      autocomplete: "new-password"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.password_confirmation
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
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              label: "Huỷ",
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Đổi mật khẩu",
              icon: "i-lucide-key",
              loading: __props.loading,
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
                  label: "Đổi mật khẩu",
                  icon: "i-lucide-key",
                  loading: __props.loading,
                  onClick: ($event) => emit("submit", { ...vueExports.unref(formState) })
                }, null, 8, ["loading", "onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountChangePasswordModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_17 = Object.assign(_sfc_main, { __name: "AccountChangePasswordModal" });

export { __nuxt_component_16 as _, __nuxt_component_17 as a, __nuxt_component_4 as b };
//# sourceMappingURL=AccountChangePasswordModal-rohcABJW.mjs.map
