import { _ as _sfc_main$2 } from './Modal-BimZZbNl.mjs';
import { j as useToast, v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h } from './server.mjs';
import { r as apiApprovePartner, s as apiDeactivatePartner, t as apiReactivatePartner } from './usePartners-DhKs6EM6.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { _ as __nuxt_component_0 } from './BaseFormModal-CG7aCaIV.mjs';
import { _ as _sfc_main$3 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$4 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_4 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$5 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$6 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$7 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$8 } from './SelectMenu-DKHEMZj7.mjs';
import { u as usePlatformOrganizationList, a as apiGetOrganizationProjects } from './useOrganizations-DNv3fDw1.mjs';

const VENDOR_ACTION_META = {
  approve: {
    title: "Duyệt vendor",
    description: 'Vendor sẽ chuyển sang trạng thái "Đang hoạt động" và có thể nhận đơn.',
    confirmLabel: "Duyệt",
    confirmColor: "success",
    icon: "i-lucide-check-circle",
    toast: "Đã duyệt vendor"
  },
  deactivate: {
    title: "Vô hiệu hoá vendor",
    description: "Vendor sẽ ngừng nhận đơn mới cho đến khi được kích hoạt lại.",
    confirmLabel: "Vô hiệu hoá",
    confirmColor: "warning",
    icon: "i-lucide-ban",
    toast: "Đã vô hiệu hoá vendor"
  },
  reactivate: {
    title: "Kích hoạt lại vendor",
    description: "Vendor sẽ hoạt động trở lại và có thể nhận đơn.",
    confirmLabel: "Kích hoạt",
    confirmColor: "primary",
    icon: "i-lucide-power",
    toast: "Đã kích hoạt lại vendor"
  }
};
function useVendorActions() {
  const toast = useToast();
  async function runVendorAction(type, id) {
    const meta = VENDOR_ACTION_META[type];
    try {
      if (type === "approve") {
        await apiApprovePartner(id);
      } else if (type === "deactivate") {
        await apiDeactivatePartner(id);
      } else {
        await apiReactivatePartner(id);
      }
      toast.add({ title: meta.toast, color: "success", icon: "i-lucide-check-circle" });
      return true;
    } catch (err) {
      toast.add({
        title: getApiErrorMessage(err, "Thao tác thất bại"),
        color: "error",
        icon: "i-lucide-alert-circle"
      });
      return false;
    }
  }
  return { runVendorAction };
}
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ActionConfirmModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    action: {},
    vendorName: { default: null },
    loading: { type: Boolean, default: false }
  },
  emits: ["update:open", "confirm"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const meta = vueExports.computed(() => props.action ? VENDOR_ACTION_META[props.action] : null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$2;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: vueExports.unref(meta)?.title ?? "",
        "onUpdate:open": (v) => emit("update:open", v)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-600"${_scopeId}>`);
            if (__props.vendorName) {
              _push2(`<span class="font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.vendorName)} — </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(meta)?.description)}</p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-600" }, [
                __props.vendorName ? (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 0,
                  class: "font-medium text-slate-900"
                }, vueExports.toDisplayString(__props.vendorName) + " — ", 1)) : vueExports.createCommentVNode("", true),
                vueExports.createTextVNode(" " + vueExports.toDisplayString(vueExports.unref(meta)?.description), 1)
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
              disabled: __props.loading,
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            if (vueExports.unref(meta)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                color: vueExports.unref(meta).confirmColor,
                icon: vueExports.unref(meta).icon,
                label: vueExports.unref(meta).confirmLabel,
                loading: __props.loading,
                onClick: ($event) => emit("confirm")
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Huỷ",
                  disabled: __props.loading,
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["disabled", "onClick"]),
                vueExports.unref(meta) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 0,
                  color: vueExports.unref(meta).confirmColor,
                  icon: vueExports.unref(meta).icon,
                  label: vueExports.unref(meta).confirmLabel,
                  loading: __props.loading,
                  onClick: ($event) => emit("confirm")
                }, null, 8, ["color", "icon", "label", "loading", "onClick"])) : vueExports.createCommentVNode("", true)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor-console/ActionConfirmModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_12 = Object.assign(_sfc_main$1, { __name: "VendorConsoleActionConfirmModal" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PartnerFormModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    item: { default: null },
    initialProjectIds: { default: () => [] },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formState = vueExports.reactive({
      id: void 0,
      slug: "",
      name: "",
      display_name: "",
      status: "active",
      custom_domain: "",
      categories: [],
      owner_email: "",
      owner_phone: "",
      logo_url: "",
      description: "",
      owner_tenant_id: "",
      project_ids: []
    });
    const newCategory = vueExports.ref("");
    const orgParams = vueExports.reactive({ search: "" });
    const { data: orgsData, status: orgsStatus } = usePlatformOrganizationList(orgParams);
    const tenantOptions = vueExports.computed(
      () => (orgsData.value?.data ?? []).map((o) => ({
        label: `${o.id} — ${o.name}`,
        value: o.id
      }))
    );
    const projectOptions = vueExports.ref([]);
    const projectsLoading = vueExports.ref(false);
    async function loadProjects(tenantId) {
      if (!tenantId) {
        projectOptions.value = [];
        return;
      }
      projectsLoading.value = true;
      try {
        const projects = await apiGetOrganizationProjects(tenantId);
        projectOptions.value = projects.map((p) => ({ label: p.name, value: Number(p.id) }));
      } finally {
        projectsLoading.value = false;
      }
    }
    vueExports.watch(
      () => formState.owner_tenant_id,
      async (newId, oldId) => {
        if (newId === oldId) return;
        if (oldId !== "" && oldId !== void 0) {
          formState.project_ids = [];
        }
        await loadProjects(newId);
      }
    );
    vueExports.watch(
      () => props.open,
      async (isOpen) => {
        if (!isOpen) return;
        if (props.mode === "edit" && props.item) {
          formState.id = props.item.id;
          formState.slug = props.item.slug;
          formState.name = props.item.name;
          formState.display_name = props.item.display_name ?? "";
          formState.status = props.item.status.value;
          formState.custom_domain = props.item.custom_domain ?? "";
          formState.categories = [...props.item.categories ?? []];
          formState.owner_email = "";
          formState.owner_phone = "";
          formState.logo_url = props.item.logo_url ?? "";
          formState.description = "";
          formState.owner_tenant_id = props.item.owner_tenant_id ?? "";
          formState.project_ids = [...props.initialProjectIds];
          if (formState.owner_tenant_id) {
            await loadProjects(formState.owner_tenant_id);
          }
        } else {
          formState.id = void 0;
          formState.slug = "";
          formState.name = "";
          formState.display_name = "";
          formState.status = "active";
          formState.custom_domain = "";
          formState.categories = [];
          formState.owner_email = "";
          formState.owner_phone = "";
          formState.logo_url = "";
          formState.description = "";
          formState.owner_tenant_id = "";
          formState.project_ids = [];
          projectOptions.value = [];
        }
        newCategory.value = "";
      }
    );
    function addCategory() {
      const value = newCategory.value.trim().toLowerCase().replace(/\s+/g, "_");
      if (!value) return;
      if (formState.categories.includes(value)) {
        newCategory.value = "";
        return;
      }
      formState.categories.push(value);
      newCategory.value = "";
    }
    function removeCategory(category) {
      formState.categories = formState.categories.filter((c) => c !== category);
    }
    function handleSubmit() {
      const ownerTenantId = formState.owner_tenant_id.trim();
      const payload = {
        ...formState.id ? { id: formState.id } : {},
        ...props.mode === "create" ? { slug: formState.slug.trim().toLowerCase() } : { slug: formState.slug },
        name: formState.name.trim(),
        display_name: formState.display_name.trim() || null,
        status: formState.status,
        custom_domain: formState.custom_domain.trim() || null,
        categories: formState.categories,
        owner_email: formState.owner_email.trim(),
        owner_phone: formState.owner_phone.trim() || null,
        logo_url: formState.logo_url.trim() || null,
        description: formState.description.trim() || null,
        owner_tenant_id: ownerTenantId || null,
        project_ids: ownerTenantId ? [...formState.project_ids] : []
      };
      emit("submit", payload);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudBaseFormModal = __nuxt_component_0;
      const _component_UFormField = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_SharedCrudFormFieldError = __nuxt_component_4;
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$5;
      const _component_UIcon = _sfc_main$h;
      const _component_UTextarea = _sfc_main$6;
      const _component_USelect = _sfc_main$7;
      const _component_USelectMenu = _sfc_main$8;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudBaseFormModal, vueExports.mergeProps({
        open: __props.open,
        mode: __props.mode,
        loading: __props.loading,
        titles: { create: "Tạo partner", edit: "Sửa partner" },
        "onUpdate:open": ($event) => emit("update:open", $event),
        onSubmit: handleSubmit
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.mode === "create") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Slug (định danh URL)",
                name: "slug",
                required: "",
                help: "Chữ thường, số, gạch ngang. Dùng làm subdomain ở resi_mart. Không đổi được sau khi tạo."
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(formState).slug,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).slug = $event,
                      placeholder: "vd: hoa-qua-abc",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.slug
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(formState).slug,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).slug = $event,
                        placeholder: "vd: hoa-qua-abc",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.slug
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Slug",
                name: "slug"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      "model-value": vueExports.unref(formState).slug,
                      disabled: "",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        "model-value": vueExports.unref(formState).slug,
                        disabled: "",
                        class: "w-full"
                      }, null, 8, ["model-value"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên partner",
              name: "name",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Hoa Quả Sạch ABC",
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
                      placeholder: "VD: Hoa Quả Sạch ABC",
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
              label: "Tên hiển thị (tuỳ chọn)",
              name: "display_name",
              help: "Tên hiển thị trên storefront. Bỏ trống = dùng Tên partner."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).display_name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).display_name = $event,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.display_name
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).display_name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).display_name = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.display_name
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Email chủ sở hữu",
              name: "owner_email",
              required: __props.mode === "create",
              help: "Email dùng để gửi credential cho partner login vào resi_mart."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).owner_email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_email = $event,
                    type: "email",
                    placeholder: __props.mode === "edit" ? "Để trống nếu không đổi" : "vd: admin@hoaquaabc.vn",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.owner_email
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).owner_email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_email = $event,
                      type: "email",
                      placeholder: __props.mode === "edit" ? "Để trống nếu không đổi" : "vd: admin@hoaquaabc.vn",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.owner_email
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "SĐT chủ sở hữu (tuỳ chọn)",
              name: "owner_phone"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).owner_phone,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_phone = $event,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.owner_phone
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).owner_phone,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_phone = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.owner_phone
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Categories",
              name: "categories",
              help: "Phân loại vendor (vd: hoa_qua, giat_la, sua_chua). Enter để thêm."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-2"${_scopeId2}><div class="flex gap-2"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(newCategory),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(newCategory) ? newCategory.value = $event : null,
                    placeholder: "vd: hoa_qua",
                    class: "flex-1",
                    onKeydown: addCategory
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-plus",
                    color: "neutral",
                    variant: "outline",
                    label: "Thêm",
                    disabled: !vueExports.unref(newCategory).trim(),
                    onClick: addCategory
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (vueExports.unref(formState).categories.length) {
                    _push3(`<div class="flex flex-wrap gap-2"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(formState).categories, (cat) => {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        key: cat,
                        color: "info",
                        variant: "subtle",
                        class: "gap-1 pr-1"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(cat)} <button type="button" class="ml-1 rounded hover:bg-black/10 p-0.5"${_scopeId3}>`);
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                              name: "i-lucide-x",
                              class: "size-3"
                            }, null, _parent4, _scopeId3));
                            _push4(`</button>`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(cat) + " ", 1),
                              vueExports.createVNode("button", {
                                type: "button",
                                class: "ml-1 rounded hover:bg-black/10 p-0.5",
                                onClick: ($event) => removeCategory(cat)
                              }, [
                                vueExports.createVNode(_component_UIcon, {
                                  name: "i-lucide-x",
                                  class: "size-3"
                                })
                              ], 8, ["onClick"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<p class="text-sm text-gray-400"${_scopeId2}> Chưa có category nào. </p>`);
                  }
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.categories
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "space-y-2" }, [
                      vueExports.createVNode("div", { class: "flex gap-2" }, [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(newCategory),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(newCategory) ? newCategory.value = $event : null,
                          placeholder: "vd: hoa_qua",
                          class: "flex-1",
                          onKeydown: vueExports.withKeys(vueExports.withModifiers(addCategory, ["prevent"]), ["enter"])
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-plus",
                          color: "neutral",
                          variant: "outline",
                          label: "Thêm",
                          disabled: !vueExports.unref(newCategory).trim(),
                          onClick: addCategory
                        }, null, 8, ["disabled"])
                      ]),
                      vueExports.unref(formState).categories.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex flex-wrap gap-2"
                      }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(formState).categories, (cat) => {
                          return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                            key: cat,
                            color: "info",
                            variant: "subtle",
                            class: "gap-1 pr-1"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(cat) + " ", 1),
                              vueExports.createVNode("button", {
                                type: "button",
                                class: "ml-1 rounded hover:bg-black/10 p-0.5",
                                onClick: ($event) => removeCategory(cat)
                              }, [
                                vueExports.createVNode(_component_UIcon, {
                                  name: "i-lucide-x",
                                  class: "size-3"
                                })
                              ], 8, ["onClick"])
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                        key: 1,
                        class: "text-sm text-gray-400"
                      }, " Chưa có category nào. ")),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.categories
                      }, null, 8, ["errors"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Custom domain (tuỳ chọn)",
              name: "custom_domain",
              help: "CHỈ hostname (không http://, không dấu /). Vd: shop.hoaquaabc.vn hoặc hoaqua.localhost (dev)."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).custom_domain,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).custom_domain = $event,
                    placeholder: "vd: shop.hoaquaabc.vn",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.custom_domain
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).custom_domain,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).custom_domain = $event,
                      placeholder: "vd: shop.hoaquaabc.vn",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.custom_domain
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Logo URL",
              name: "logo_url"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).logo_url,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).logo_url = $event,
                    type: "url",
                    placeholder: "https://...",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.logo_url
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).logo_url,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).logo_url = $event,
                      type: "url",
                      placeholder: "https://...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.logo_url
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mô tả (tuỳ chọn)",
              name: "description"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).description,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                    rows: 3,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.description
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).description,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                      rows: 3,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.description
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Trạng thái",
              name: "status"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(formState).status,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                    items: [
                      { label: "Đang hoạt động", value: "active" },
                      { label: "Tạm khoá", value: "suspended" },
                      { label: "Đã chấm dứt", value: "terminated" }
                    ],
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.status
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(formState).status,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                      items: [
                        { label: "Đang hoạt động", value: "active" },
                        { label: "Tạm khoá", value: "suspended" },
                        { label: "Đã chấm dứt", value: "terminated" }
                      ],
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.status
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Gán cho tenant PMC (tuỳ chọn)",
              name: "owner_tenant_id",
              help: "Để trống = vendor central (chưa gán tenant). Khi gán tenant, vendor sẽ hiện trong list của tenant đó và phục vụ các dự án đã chọn."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).owner_tenant_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_tenant_id = $event,
                    items: vueExports.unref(tenantOptions),
                    "value-key": "value",
                    searchable: "",
                    loading: vueExports.unref(orgsStatus) === "pending",
                    placeholder: "Chọn PMC tenant...",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.owner_tenant_id
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).owner_tenant_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_tenant_id = $event,
                      items: vueExports.unref(tenantOptions),
                      "value-key": "value",
                      searchable: "",
                      loading: vueExports.unref(orgsStatus) === "pending",
                      placeholder: "Chọn PMC tenant...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.owner_tenant_id
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(formState).owner_tenant_id) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Dự án vendor được phục vụ",
                name: "project_ids",
                required: "",
                help: "Vendor sẽ được hiển thị trên storefront của các dự án đã chọn trong tenant này."
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).project_ids,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_ids = $event,
                      items: vueExports.unref(projectOptions),
                      "value-key": "value",
                      multiple: "",
                      searchable: "",
                      loading: vueExports.unref(projectsLoading),
                      placeholder: "Chọn dự án...",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.project_ids
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors["project_ids.0"]
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USelectMenu, {
                        modelValue: vueExports.unref(formState).project_ids,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_ids = $event,
                        items: vueExports.unref(projectOptions),
                        "value-key": "value",
                        multiple: "",
                        searchable: "",
                        loading: vueExports.unref(projectsLoading),
                        placeholder: "Chọn dự án...",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.project_ids
                      }, null, 8, ["errors"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors["project_ids.0"]
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
              __props.mode === "create" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                key: 0,
                label: "Slug (định danh URL)",
                name: "slug",
                required: "",
                help: "Chữ thường, số, gạch ngang. Dùng làm subdomain ở resi_mart. Không đổi được sau khi tạo."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).slug,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).slug = $event,
                    placeholder: "vd: hoa-qua-abc",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.slug
                  }, null, 8, ["errors"])
                ]),
                _: 1
              })) : (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                key: 1,
                label: "Slug",
                name: "slug"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    "model-value": vueExports.unref(formState).slug,
                    disabled: "",
                    class: "w-full"
                  }, null, 8, ["model-value"])
                ]),
                _: 1
              })),
              vueExports.createVNode(_component_UFormField, {
                label: "Tên partner",
                name: "name",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Hoa Quả Sạch ABC",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Tên hiển thị (tuỳ chọn)",
                name: "display_name",
                help: "Tên hiển thị trên storefront. Bỏ trống = dùng Tên partner."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).display_name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).display_name = $event,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.display_name
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Email chủ sở hữu",
                name: "owner_email",
                required: __props.mode === "create",
                help: "Email dùng để gửi credential cho partner login vào resi_mart."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).owner_email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_email = $event,
                    type: "email",
                    placeholder: __props.mode === "edit" ? "Để trống nếu không đổi" : "vd: admin@hoaquaabc.vn",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.owner_email
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }, 8, ["required"]),
              vueExports.createVNode(_component_UFormField, {
                label: "SĐT chủ sở hữu (tuỳ chọn)",
                name: "owner_phone"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).owner_phone,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_phone = $event,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.owner_phone
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Categories",
                name: "categories",
                help: "Phân loại vendor (vd: hoa_qua, giat_la, sua_chua). Enter để thêm."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "space-y-2" }, [
                    vueExports.createVNode("div", { class: "flex gap-2" }, [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(newCategory),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(newCategory) ? newCategory.value = $event : null,
                        placeholder: "vd: hoa_qua",
                        class: "flex-1",
                        onKeydown: vueExports.withKeys(vueExports.withModifiers(addCategory, ["prevent"]), ["enter"])
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-plus",
                        color: "neutral",
                        variant: "outline",
                        label: "Thêm",
                        disabled: !vueExports.unref(newCategory).trim(),
                        onClick: addCategory
                      }, null, 8, ["disabled"])
                    ]),
                    vueExports.unref(formState).categories.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-wrap gap-2"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(formState).categories, (cat) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: cat,
                          color: "info",
                          variant: "subtle",
                          class: "gap-1 pr-1"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(cat) + " ", 1),
                            vueExports.createVNode("button", {
                              type: "button",
                              class: "ml-1 rounded hover:bg-black/10 p-0.5",
                              onClick: ($event) => removeCategory(cat)
                            }, [
                              vueExports.createVNode(_component_UIcon, {
                                name: "i-lucide-x",
                                class: "size-3"
                              })
                            ], 8, ["onClick"])
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 1,
                      class: "text-sm text-gray-400"
                    }, " Chưa có category nào. ")),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.categories
                    }, null, 8, ["errors"])
                  ])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Custom domain (tuỳ chọn)",
                name: "custom_domain",
                help: "CHỈ hostname (không http://, không dấu /). Vd: shop.hoaquaabc.vn hoặc hoaqua.localhost (dev)."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).custom_domain,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).custom_domain = $event,
                    placeholder: "vd: shop.hoaquaabc.vn",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.custom_domain
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Logo URL",
                name: "logo_url"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).logo_url,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).logo_url = $event,
                    type: "url",
                    placeholder: "https://...",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.logo_url
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Mô tả (tuỳ chọn)",
                name: "description"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).description,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).description = $event,
                    rows: 3,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.description
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Trạng thái",
                name: "status"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_USelect, {
                    modelValue: vueExports.unref(formState).status,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                    items: [
                      { label: "Đang hoạt động", value: "active" },
                      { label: "Tạm khoá", value: "suspended" },
                      { label: "Đã chấm dứt", value: "terminated" }
                    ],
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.status
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Gán cho tenant PMC (tuỳ chọn)",
                name: "owner_tenant_id",
                help: "Để trống = vendor central (chưa gán tenant). Khi gán tenant, vendor sẽ hiện trong list của tenant đó và phục vụ các dự án đã chọn."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).owner_tenant_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).owner_tenant_id = $event,
                    items: vueExports.unref(tenantOptions),
                    "value-key": "value",
                    searchable: "",
                    loading: vueExports.unref(orgsStatus) === "pending",
                    placeholder: "Chọn PMC tenant...",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.owner_tenant_id
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.unref(formState).owner_tenant_id ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                key: 2,
                label: "Dự án vendor được phục vụ",
                name: "project_ids",
                required: "",
                help: "Vendor sẽ được hiển thị trên storefront của các dự án đã chọn trong tenant này."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).project_ids,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_ids = $event,
                    items: vueExports.unref(projectOptions),
                    "value-key": "value",
                    multiple: "",
                    searchable: "",
                    loading: vueExports.unref(projectsLoading),
                    placeholder: "Chọn dự án...",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.project_ids
                  }, null, 8, ["errors"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors["project_ids.0"]
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner/PartnerFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main, { __name: "PartnerFormModal" });

export { __nuxt_component_12 as _, __nuxt_component_10 as a, useVendorActions as u };
//# sourceMappingURL=PartnerFormModal-Cph3AHtC.mjs.map
