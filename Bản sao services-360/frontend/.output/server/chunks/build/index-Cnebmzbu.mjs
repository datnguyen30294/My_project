import { _ as _sfc_main$a } from './Card-ywPiICev.mjs';
import { v as vueExports, u as useSeoMeta, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$b } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$3 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$4 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$5 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$6 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$7 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$8 } from './Switch-1cJNH-6C.mjs';
import { _ as __nuxt_component_3 } from './TableActions-b69bU2gG.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_0$1 } from './BaseFormModal-CG7aCaIV.mjs';
import { _ as _sfc_main$d } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_4 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$e } from './Textarea-DTCNHwKm.mjs';
import { u as usePlatformTenantStats, a as usePlatformTenantList, S as SERVICE_PLAN_OPTIONS, b as apiCreateTenant, c as apiUpdateTenant, d as apiToggleTenantVendorFeature, e as apiGetTenant } from './useTenants-BTW8z9Mm.mjs';
import { S as ServicePlan } from './laravel-BKHe1mna.mjs';
import { u as useTenantToggleActive, _ as __nuxt_component_10$1 } from './useTenantToggleActive-CA9cCr0b.mjs';
import { _ as _sfc_main$9 } from './Modal-BimZZbNl.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './index-CSThDD3J.mjs';
import './Label-BBgw4vHh.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './Pagination-fZq_Msxb.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';

const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantStatsBar",
  __ssrInlineRender: true,
  props: {
    stats: {},
    pending: { type: Boolean, default: false }
  },
  setup(__props) {
    const items = [
      { key: "total", label: "Tổng công ty", icon: "i-lucide-building-2", color: "text-primary" },
      { key: "active", label: "Đang hoạt động", icon: "i-lucide-circle-check", color: "text-emerald-600" },
      { key: "inactive", label: "Đã vô hiệu hoá", icon: "i-lucide-circle-pause", color: "text-amber-600" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$a;
      const _component_UIcon = _sfc_main$h;
      const _component_USkeleton = _sfc_main$b;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        role: "group",
        "aria-label": "Thống kê công ty vận hành",
        class: "grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6"
      }, _attrs))}><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(items, (item) => {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, {
          key: item.key,
          ui: { body: "px-5 py-4" }
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-4"${_scopeId}><div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: item.icon,
                class: ["size-5", item.color]
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="min-w-0"${_scopeId}><div class="text-sm text-[var(--ui-text-muted)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</div>`);
              if (__props.pending) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "mt-1 h-7 w-10" }, null, _parent2, _scopeId));
              } else {
                _push2(`<div class="mt-1 text-2xl font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.stats?.[item.key] ?? 0)}</div>`);
              }
              _push2(`</div></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex items-center gap-4" }, [
                  vueExports.createVNode("div", { class: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: item.icon,
                      class: ["size-5", item.color]
                    }, null, 8, ["name", "class"])
                  ]),
                  vueExports.createVNode("div", { class: "min-w-0" }, [
                    vueExports.createVNode("div", { class: "text-sm text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(item.label), 1),
                    __props.pending ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                      key: 0,
                      class: "mt-1 h-7 w-10"
                    })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "mt-1 text-2xl font-bold text-slate-900"
                    }, vueExports.toDisplayString(__props.stats?.[item.key] ?? 0), 1))
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantStatsBar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "TenantStatsBar" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantFormModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    item: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formState = vueExports.reactive({
      id: "",
      name: "",
      tax_code: "",
      representative_name: "",
      contact_email: "",
      contact_phone: "",
      address: "",
      service_plan: ServicePlan.business,
      notes: "",
      domains: []
    });
    const newDomain = vueExports.ref("");
    const isLoadingDetail = vueExports.ref(false);
    function resetForm() {
      formState.id = "";
      formState.name = "";
      formState.tax_code = "";
      formState.representative_name = "";
      formState.contact_email = "";
      formState.contact_phone = "";
      formState.address = "";
      formState.service_plan = ServicePlan.business;
      formState.notes = "";
      formState.domains = [];
    }
    async function fillFromDetail(id) {
      isLoadingDetail.value = true;
      try {
        const res = await apiGetTenant(id);
        const detail = res.data;
        formState.name = detail.name;
        formState.tax_code = detail.tax_code ?? "";
        formState.representative_name = detail.representative_name ?? "";
        formState.contact_email = detail.contact_email ?? "";
        formState.contact_phone = detail.contact_phone ?? "";
        formState.address = detail.address ?? "";
        formState.service_plan = detail.service_plan?.value ?? ServicePlan.business;
        formState.notes = detail.notes ?? "";
        formState.domains = [...detail.domains ?? []];
      } finally {
        isLoadingDetail.value = false;
      }
    }
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        resetForm();
        newDomain.value = "";
        if (props.mode === "edit" && props.item) {
          formState.id = props.item.id;
          formState.name = props.item.name;
          formState.tax_code = props.item.tax_code ?? "";
          formState.representative_name = props.item.representative_name ?? "";
          formState.contact_email = props.item.contact_email ?? "";
          formState.service_plan = props.item.service_plan?.value ?? ServicePlan.business;
          formState.domains = [...props.item.domains ?? []];
          fillFromDetail(props.item.id);
        }
      }
    );
    function addDomain() {
      const value = newDomain.value.trim().toLowerCase();
      if (!value) return;
      if (formState.domains.includes(value)) {
        newDomain.value = "";
        return;
      }
      formState.domains.push(value);
      newDomain.value = "";
    }
    function removeDomain(domain) {
      formState.domains = formState.domains.filter((d) => d !== domain);
    }
    function handleSubmit() {
      emit("submit", {
        ...props.mode === "create" ? { id: formState.id.trim() } : {},
        name: formState.name.trim(),
        tax_code: formState.tax_code.trim() || null,
        representative_name: formState.representative_name.trim() || null,
        contact_email: formState.contact_email.trim() || null,
        contact_phone: formState.contact_phone.trim() || null,
        address: formState.address.trim() || null,
        service_plan: formState.service_plan,
        notes: formState.notes.trim() || null,
        domains: formState.domains
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudBaseFormModal = __nuxt_component_0$1;
      const _component_UFormField = _sfc_main$d;
      const _component_UInput = _sfc_main$3;
      const _component_SharedCrudFormFieldError = __nuxt_component_4;
      const _component_USelect = _sfc_main$4;
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$7;
      const _component_UIcon = _sfc_main$h;
      const _component_UTextarea = _sfc_main$e;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudBaseFormModal, vueExports.mergeProps({
        open: __props.open,
        mode: __props.mode,
        loading: __props.loading || vueExports.unref(isLoadingDetail),
        titles: { create: "Đăng ký công ty vận hành", edit: "Cập nhật công ty vận hành" },
        "onUpdate:open": ($event) => emit("update:open", $event),
        onSubmit: handleSubmit
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mã công ty",
              name: "id",
              required: __props.mode === "create",
              help: "Mã định danh tenant, không đổi sau khi tạo. Chữ thường, số, gạch ngang/dưới."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.mode === "create") {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(formState).id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).id = $event,
                      placeholder: "vd: acme, tnp-residential",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      "model-value": vueExports.unref(formState).id,
                      disabled: "",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  }
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.id
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    __props.mode === "create" ? (vueExports.openBlock(), vueExports.createBlock(_component_UInput, {
                      key: 0,
                      modelValue: vueExports.unref(formState).id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).id = $event,
                      placeholder: "vd: acme, tnp-residential",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UInput, {
                      key: 1,
                      "model-value": vueExports.unref(formState).id,
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.id
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên công ty",
              name: "name",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Công ty CP Quản lý vận hành ACME",
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
                      placeholder: "VD: Công ty CP Quản lý vận hành ACME",
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
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mã số thuế",
              name: "tax_code"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).tax_code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).tax_code = $event,
                    placeholder: "10–13 chữ số",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.tax_code
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).tax_code,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).tax_code = $event,
                      placeholder: "10–13 chữ số",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.tax_code
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Người đại diện",
              name: "representative_name"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).representative_name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).representative_name = $event,
                    placeholder: "VD: Nguyễn Văn A",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.representative_name
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).representative_name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).representative_name = $event,
                      placeholder: "VD: Nguyễn Văn A",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.representative_name
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Email",
              name: "contact_email"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).contact_email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact_email = $event,
                    type: "email",
                    placeholder: "lienhe@congty.vn",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.contact_email
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).contact_email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact_email = $event,
                      type: "email",
                      placeholder: "lienhe@congty.vn",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.contact_email
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Điện thoại",
              name: "contact_phone"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).contact_phone,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact_phone = $event,
                    placeholder: "VD: 0901234567",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.contact_phone
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).contact_phone,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact_phone = $event,
                      placeholder: "VD: 0901234567",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.contact_phone
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Địa chỉ",
              name: "address"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).address,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                    placeholder: "Địa chỉ trụ sở công ty",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.address
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).address,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                      placeholder: "Địa chỉ trụ sở công ty",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.address
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Gói dịch vụ",
              name: "service_plan"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                    modelValue: vueExports.unref(formState).service_plan,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).service_plan = $event,
                    items: [...vueExports.unref(SERVICE_PLAN_OPTIONS)],
                    "value-key": "value",
                    "label-key": "label",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.service_plan
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(formState).service_plan,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).service_plan = $event,
                      items: [...vueExports.unref(SERVICE_PLAN_OPTIONS)],
                      "value-key": "value",
                      "label-key": "label",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.service_plan
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Domains",
              name: "domains",
              help: "Không truyền domain → hệ thống tự sinh. Domain phải unique trên toàn hệ thống."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-2"${_scopeId2}><div class="flex gap-2"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(newDomain),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(newDomain) ? newDomain.value = $event : null,
                    placeholder: "vd: acme.tnp.app.vn",
                    class: "flex-1",
                    onKeydown: addDomain
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-plus",
                    color: "neutral",
                    variant: "outline",
                    label: "Thêm",
                    disabled: !vueExports.unref(newDomain).trim(),
                    onClick: addDomain
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (vueExports.unref(formState).domains.length) {
                    _push3(`<div class="flex flex-wrap gap-2"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(formState).domains, (domain) => {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        key: domain,
                        color: "info",
                        variant: "subtle",
                        class: "gap-1 pr-1"
                      }, {
                        default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(domain)} <button type="button" class="ml-1 rounded hover:bg-black/10 p-0.5"${_scopeId3}>`);
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                              name: "i-lucide-x",
                              class: "size-3"
                            }, null, _parent4, _scopeId3));
                            _push4(`</button>`);
                          } else {
                            return [
                              vueExports.createTextVNode(vueExports.toDisplayString(domain) + " ", 1),
                              vueExports.createVNode("button", {
                                type: "button",
                                class: "ml-1 rounded hover:bg-black/10 p-0.5",
                                onClick: ($event) => removeDomain(domain)
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
                    _push3(`<p class="text-sm text-gray-400"${_scopeId2}> Chưa có domain nào — hệ thống sẽ tự sinh khi đăng ký. </p>`);
                  }
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.domains
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors["domains.0"]
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "space-y-2" }, [
                      vueExports.createVNode("div", { class: "flex gap-2" }, [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(newDomain),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(newDomain) ? newDomain.value = $event : null,
                          placeholder: "vd: acme.tnp.app.vn",
                          class: "flex-1",
                          onKeydown: vueExports.withKeys(vueExports.withModifiers(addDomain, ["prevent"]), ["enter"])
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-plus",
                          color: "neutral",
                          variant: "outline",
                          label: "Thêm",
                          disabled: !vueExports.unref(newDomain).trim(),
                          onClick: addDomain
                        }, null, 8, ["disabled"])
                      ]),
                      vueExports.unref(formState).domains.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex flex-wrap gap-2"
                      }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(formState).domains, (domain) => {
                          return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                            key: domain,
                            color: "info",
                            variant: "subtle",
                            class: "gap-1 pr-1"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(domain) + " ", 1),
                              vueExports.createVNode("button", {
                                type: "button",
                                class: "ml-1 rounded hover:bg-black/10 p-0.5",
                                onClick: ($event) => removeDomain(domain)
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
                      }, " Chưa có domain nào — hệ thống sẽ tự sinh khi đăng ký. ")),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.domains
                      }, null, 8, ["errors"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors["domains.0"]
                      }, null, 8, ["errors"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ghi chú",
              name: "notes",
              help: "Ghi chú nội bộ platform."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).notes,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).notes = $event,
                    rows: 2,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.notes
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).notes,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).notes = $event,
                      rows: 2,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.notes
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UFormField, {
                label: "Mã công ty",
                name: "id",
                required: __props.mode === "create",
                help: "Mã định danh tenant, không đổi sau khi tạo. Chữ thường, số, gạch ngang/dưới."
              }, {
                default: vueExports.withCtx(() => [
                  __props.mode === "create" ? (vueExports.openBlock(), vueExports.createBlock(_component_UInput, {
                    key: 0,
                    modelValue: vueExports.unref(formState).id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).id = $event,
                    placeholder: "vd: acme, tnp-residential",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UInput, {
                    key: 1,
                    "model-value": vueExports.unref(formState).id,
                    disabled: "",
                    class: "w-full"
                  }, null, 8, ["model-value"])),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.id
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }, 8, ["required"]),
              vueExports.createVNode(_component_UFormField, {
                label: "Tên công ty",
                name: "name",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Công ty CP Quản lý vận hành ACME",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Mã số thuế",
                  name: "tax_code"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).tax_code,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).tax_code = $event,
                      placeholder: "10–13 chữ số",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.tax_code
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Người đại diện",
                  name: "representative_name"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).representative_name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).representative_name = $event,
                      placeholder: "VD: Nguyễn Văn A",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.representative_name
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })
              ]),
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Email",
                  name: "contact_email"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).contact_email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact_email = $event,
                      type: "email",
                      placeholder: "lienhe@congty.vn",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.contact_email
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Điện thoại",
                  name: "contact_phone"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).contact_phone,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact_phone = $event,
                      placeholder: "VD: 0901234567",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.contact_phone
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })
              ]),
              vueExports.createVNode(_component_UFormField, {
                label: "Địa chỉ",
                name: "address"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).address,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                    placeholder: "Địa chỉ trụ sở công ty",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.address
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Gói dịch vụ",
                name: "service_plan"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_USelect, {
                    modelValue: vueExports.unref(formState).service_plan,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).service_plan = $event,
                    items: [...vueExports.unref(SERVICE_PLAN_OPTIONS)],
                    "value-key": "value",
                    "label-key": "label",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.service_plan
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Domains",
                name: "domains",
                help: "Không truyền domain → hệ thống tự sinh. Domain phải unique trên toàn hệ thống."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "space-y-2" }, [
                    vueExports.createVNode("div", { class: "flex gap-2" }, [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(newDomain),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(newDomain) ? newDomain.value = $event : null,
                        placeholder: "vd: acme.tnp.app.vn",
                        class: "flex-1",
                        onKeydown: vueExports.withKeys(vueExports.withModifiers(addDomain, ["prevent"]), ["enter"])
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-plus",
                        color: "neutral",
                        variant: "outline",
                        label: "Thêm",
                        disabled: !vueExports.unref(newDomain).trim(),
                        onClick: addDomain
                      }, null, 8, ["disabled"])
                    ]),
                    vueExports.unref(formState).domains.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-wrap gap-2"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(formState).domains, (domain) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: domain,
                          color: "info",
                          variant: "subtle",
                          class: "gap-1 pr-1"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(domain) + " ", 1),
                            vueExports.createVNode("button", {
                              type: "button",
                              class: "ml-1 rounded hover:bg-black/10 p-0.5",
                              onClick: ($event) => removeDomain(domain)
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
                    }, " Chưa có domain nào — hệ thống sẽ tự sinh khi đăng ký. ")),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.domains
                    }, null, 8, ["errors"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors["domains.0"]
                    }, null, 8, ["errors"])
                  ])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Ghi chú",
                name: "notes",
                help: "Ghi chú nội bộ platform."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(formState).notes,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).notes = $event,
                    rows: 2,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.notes
                  }, null, 8, ["errors"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantFormModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main$1, { __name: "TenantFormModal" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Công ty vận hành - Thần Nông" });
    const { data: statsData, status: statsStatus, refresh: refreshStats } = usePlatformTenantStats();
    const stats = vueExports.computed(() => statsData.value?.data ?? null);
    const params = vueExports.reactive({
      search: void 0,
      is_active: void 0,
      service_plan: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const activeFilter = vueExports.ref("all");
    function applyActiveFilter(value) {
      activeFilter.value = value;
      params.is_active = value === "all" ? void 0 : value === "active";
      page.value = 1;
    }
    const servicePlanItems = [
      { value: "all", label: "Tất cả gói" },
      ...SERVICE_PLAN_OPTIONS
    ];
    const servicePlanFilter = vueExports.ref("all");
    vueExports.watch(servicePlanFilter, (value) => {
      params.service_plan = value === "all" ? void 0 : value;
      page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value || activeFilter.value !== "all" || servicePlanFilter.value !== "all");
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      activeFilter.value = "all";
      params.is_active = void 0;
      servicePlanFilter.value = "all";
      params.service_plan = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = usePlatformTenantList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const tenants = vueExports.computed(() => data.value?.data ?? []);
    async function refreshAll() {
      await Promise.all([refresh(), refreshStats()]);
    }
    const columns = [
      { accessorKey: "id", header: "Mã" },
      { accessorKey: "name", header: "Tên công ty" },
      { accessorKey: "tax_code", header: "MST" },
      { id: "service_plan", header: "Gói DV" },
      { id: "contact", header: "Liên hệ" },
      { id: "domains", header: "Domains" },
      { id: "vendor_feature", header: "Gói vendor" },
      { id: "is_active", header: "Trạng thái" },
      stickyRight({ id: "actions", header: "Thao tác" }, { width: "w-[160px] min-w-[160px]" })
    ];
    const toast = useToast();
    const toggleTarget = vueExports.ref(null);
    const toggleTargetEnable = vueExports.ref(false);
    const showToggleConfirm = vueExports.ref(false);
    const isToggling = vueExports.ref(false);
    function openToggleConfirm(item, nextValue) {
      toggleTarget.value = item;
      toggleTargetEnable.value = nextValue;
      showToggleConfirm.value = true;
    }
    async function confirmToggle() {
      if (!toggleTarget.value) return;
      isToggling.value = true;
      try {
        await apiToggleTenantVendorFeature(toggleTarget.value.id, toggleTargetEnable.value);
        toast.add({
          title: toggleTargetEnable.value ? "Đã bật gói vendor cho tenant" : "Đã tắt gói vendor cho tenant",
          color: "success",
          icon: "i-lucide-check-circle"
        });
        showToggleConfirm.value = false;
        await refresh();
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Không thể cập nhật gói vendor"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isToggling.value = false;
      }
    }
    const {
      showActiveConfirm,
      activeTarget,
      activating,
      isTogglingActive,
      openActiveConfirm,
      confirmToggleActive
    } = useTenantToggleActive(refreshAll);
    const crud = useCrudModals();
    const {
      showFormModal,
      formMode,
      editTarget,
      formApiErrors,
      openCreateModal,
      openEditModal
    } = crud;
    const { isSubmitting, submitForm } = useCrudSubmit(crud, refreshAll);
    function handleFormSubmit(formData) {
      const isCreate = formMode.value === "create";
      const { id, domains, ...profile } = formData;
      submitForm(
        isCreate ? () => apiCreateTenant({
          id,
          ...profile,
          ...domains.length ? { domains } : {}
        }) : null,
        isCreate ? null : () => apiUpdateTenant(editTarget.value.id, { ...profile, domains }),
        { create: "Đăng ký công ty vận hành thành công", update: "Cập nhật công ty vận hành thành công" }
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TenantStatsBar = __nuxt_component_0;
      const _component_UInput = _sfc_main$3;
      const _component_UButtonGroup = vueExports.resolveComponent("UButtonGroup");
      const _component_UButton = _sfc_main$c;
      const _component_USelect = _sfc_main$4;
      const _component_UAlert = _sfc_main$5;
      const _component_UTable = _sfc_main$6;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$7;
      const _component_USwitch = _sfc_main$8;
      const _component_SharedCrudTableActions = __nuxt_component_3;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_TenantFormModal = __nuxt_component_11;
      const _component_TenantToggleActiveModal = __nuxt_component_10$1;
      const _component_UModal = _sfc_main$9;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6"><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Công ty vận hành </h1><p class="text-slate-500 text-sm mt-1"> Quản lý các công ty vận hành (tenant) trên hệ thống — mỗi công ty có schema dữ liệu riêng. </p></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantStatsBar, {
        stats: vueExports.unref(stats),
        pending: vueExports.unref(statsStatus) === "pending"
      }, null, _parent));
      _push(`<div class="mb-4 flex items-center gap-3 flex-wrap">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo mã, tên, MST, email...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButtonGroup, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: vueExports.unref(activeFilter) === "all" ? "primary" : "neutral",
              variant: vueExports.unref(activeFilter) === "all" ? "solid" : "outline",
              size: "sm",
              label: "Tất cả",
              onClick: ($event) => applyActiveFilter("all")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: vueExports.unref(activeFilter) === "active" ? "primary" : "neutral",
              variant: vueExports.unref(activeFilter) === "active" ? "solid" : "outline",
              size: "sm",
              label: "Hoạt động",
              onClick: ($event) => applyActiveFilter("active")
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: vueExports.unref(activeFilter) === "inactive" ? "primary" : "neutral",
              variant: vueExports.unref(activeFilter) === "inactive" ? "solid" : "outline",
              size: "sm",
              label: "Đã tắt",
              onClick: ($event) => applyActiveFilter("inactive")
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                color: vueExports.unref(activeFilter) === "all" ? "primary" : "neutral",
                variant: vueExports.unref(activeFilter) === "all" ? "solid" : "outline",
                size: "sm",
                label: "Tất cả",
                onClick: ($event) => applyActiveFilter("all")
              }, null, 8, ["color", "variant", "onClick"]),
              vueExports.createVNode(_component_UButton, {
                color: vueExports.unref(activeFilter) === "active" ? "primary" : "neutral",
                variant: vueExports.unref(activeFilter) === "active" ? "solid" : "outline",
                size: "sm",
                label: "Hoạt động",
                onClick: ($event) => applyActiveFilter("active")
              }, null, 8, ["color", "variant", "onClick"]),
              vueExports.createVNode(_component_UButton, {
                color: vueExports.unref(activeFilter) === "inactive" ? "primary" : "neutral",
                variant: vueExports.unref(activeFilter) === "inactive" ? "solid" : "outline",
                size: "sm",
                label: "Đã tắt",
                onClick: ($event) => applyActiveFilter("inactive")
              }, null, 8, ["color", "variant", "onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(servicePlanFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(servicePlanFilter) ? servicePlanFilter.value = $event : null,
        items: servicePlanItems,
        "value-key": "value",
        "label-key": "label",
        size: "sm",
        class: "w-36"
      }, null, _parent));
      if (vueExports.unref(hasFilters)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-x",
          label: "Xoá bộ lọc",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          onClick: clearFilters
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1"></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-plus",
        label: "Đăng ký công ty VH",
        onClick: vueExports.unref(openCreateModal)
      }, null, _parent));
      _push(`</div>`);
      if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không thể tải dữ liệu. Vui lòng thử lại.",
          class: "mb-4"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(tenants),
        columns,
        loading: vueExports.unref(status) === "pending"
      }, {
        "id-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: `/platform/tenants/${row.original.id}`,
              class: "font-mono text-primary-600 hover:underline"
            }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.id)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.id), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_NuxtLink, {
                to: `/platform/tenants/${row.original.id}`,
                class: "font-mono text-primary-600 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.id), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ];
          }
        }),
        "name-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: `/platform/tenants/${row.original.id}`,
              class: "font-medium text-slate-900 hover:text-primary-600 hover:underline"
            }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.name)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_NuxtLink, {
                to: `/platform/tenants/${row.original.id}`,
                class: "font-medium text-slate-900 hover:text-primary-600 hover:underline"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.name), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ];
          }
        }),
        "tax_code-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.tax_code) {
              _push2(`<span class="font-mono text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.tax_code)}</span>`);
            } else {
              _push2(`<span class="text-xs text-gray-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.tax_code ? (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 0,
                class: "font-mono text-sm"
              }, vueExports.toDisplayString(row.original.tax_code), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-xs text-gray-400"
              }, "—"))
            ];
          }
        }),
        "service_plan-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.service_plan) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "info",
                variant: "subtle",
                size: "sm",
                label: row.original.service_plan.label
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<span class="text-xs text-gray-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.service_plan ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                key: 0,
                color: "info",
                variant: "subtle",
                size: "sm",
                label: row.original.service_plan.label
              }, null, 8, ["label"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-xs text-gray-400"
              }, "—"))
            ];
          }
        }),
        "contact-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.representative_name || row.original.contact_email) {
              _push2(`<div class="text-sm"${_scopeId}>`);
              if (row.original.representative_name) {
                _push2(`<div class="text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.representative_name)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (row.original.contact_email) {
                _push2(`<div class="text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.contact_email)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<span class="text-xs text-gray-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.representative_name || row.original.contact_email ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "text-sm"
              }, [
                row.original.representative_name ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "text-slate-900"
                }, vueExports.toDisplayString(row.original.representative_name), 1)) : vueExports.createCommentVNode("", true),
                row.original.contact_email ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "text-xs text-slate-500"
                }, vueExports.toDisplayString(row.original.contact_email), 1)) : vueExports.createCommentVNode("", true)
              ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-xs text-gray-400"
              }, "—"))
            ];
          }
        }),
        "domains-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(row.original.domains, (domain) => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                key: domain,
                variant: "subtle",
                color: "info",
                label: domain,
                size: "xs"
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            if (!row.original.domains?.length) {
              _push2(`<span class="text-xs text-gray-400"${_scopeId}>—</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-wrap gap-1" }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(row.original.domains, (domain) => {
                  return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                    key: domain,
                    variant: "subtle",
                    color: "info",
                    label: domain,
                    size: "xs"
                  }, null, 8, ["label"]);
                }), 128)),
                !row.original.domains?.length ? (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 0,
                  class: "text-xs text-gray-400"
                }, "—")) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "vendor_feature-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
              "model-value": row.original.is_vendor_enabled,
              label: row.original.is_vendor_enabled ? "Đã bật" : "Tắt",
              "onUpdate:modelValue": (v) => openToggleConfirm(row.original, v)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_USwitch, {
                "model-value": row.original.is_vendor_enabled,
                label: row.original.is_vendor_enabled ? "Đã bật" : "Tắt",
                "onUpdate:modelValue": (v) => openToggleConfirm(row.original, v)
              }, null, 8, ["model-value", "label", "onUpdate:modelValue"])
            ];
          }
        }),
        "is_active-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: row.original.is_active ? "success" : "warning",
              variant: "subtle",
              label: row.original.is_active ? "Hoạt động" : "Vô hiệu"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: row.original.is_active ? "success" : "warning",
                variant: "subtle",
                label: row.original.is_active ? "Hoạt động" : "Vô hiệu"
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        "actions-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableActions, {
              "detail-to": `/platform/tenants/${row.original.id}`,
              "show-delete": false,
              onEdit: ($event) => vueExports.unref(openEditModal)(row.original)
            }, {
              extra: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: row.original.is_active ? "i-lucide-power-off" : "i-lucide-power",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    class: row.original.is_active ? "hover:!text-amber-600 hover:!bg-amber-50" : "hover:!text-emerald-600 hover:!bg-emerald-50",
                    title: row.original.is_active ? "Vô hiệu hoá" : "Kích hoạt lại",
                    onClick: ($event) => vueExports.unref(openActiveConfirm)(row.original)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UButton, {
                      icon: row.original.is_active ? "i-lucide-power-off" : "i-lucide-power",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      class: row.original.is_active ? "hover:!text-amber-600 hover:!bg-amber-50" : "hover:!text-emerald-600 hover:!bg-emerald-50",
                      title: row.original.is_active ? "Vô hiệu hoá" : "Kích hoạt lại",
                      onClick: ($event) => vueExports.unref(openActiveConfirm)(row.original)
                    }, null, 8, ["icon", "class", "title", "onClick"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_SharedCrudTableActions, {
                "detail-to": `/platform/tenants/${row.original.id}`,
                "show-delete": false,
                onEdit: ($event) => vueExports.unref(openEditModal)(row.original)
              }, {
                extra: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UButton, {
                    icon: row.original.is_active ? "i-lucide-power-off" : "i-lucide-power",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    class: row.original.is_active ? "hover:!text-amber-600 hover:!bg-amber-50" : "hover:!text-emerald-600 hover:!bg-emerald-50",
                    title: row.original.is_active ? "Vô hiệu hoá" : "Kích hoạt lại",
                    onClick: ($event) => vueExports.unref(openActiveConfirm)(row.original)
                  }, null, 8, ["icon", "class", "title", "onClick"])
                ]),
                _: 2
              }, 1032, ["detail-to", "onEdit"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
        page: vueExports.unref(page),
        "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
        meta: vueExports.unref(data)?.meta
      }, null, _parent));
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isSubmitting),
        "api-errors": vueExports.unref(formApiErrors),
        onSubmit: handleFormSubmit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantToggleActiveModal, {
        open: vueExports.unref(showActiveConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showActiveConfirm) ? showActiveConfirm.value = $event : null,
        "tenant-name": vueExports.unref(activeTarget)?.name,
        activating: vueExports.unref(activating),
        loading: vueExports.unref(isTogglingActive),
        onConfirm: vueExports.unref(confirmToggleActive)
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showToggleConfirm),
        "onUpdate:open": ($event) => vueExports.isRef(showToggleConfirm) ? showToggleConfirm.value = $event : null,
        title: vueExports.unref(toggleTargetEnable) ? "Bật gói vendor" : "Tắt gói vendor"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3 text-sm text-slate-700"${_scopeId}>`);
            if (vueExports.unref(toggleTargetEnable)) {
              _push2(`<p${_scopeId}> Bật gói vendor cho tenant <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(toggleTarget)?.name)}</strong>? Tenant sẽ thấy menu &quot;Vendor của tôi&quot; sau khi đăng nhập lại và có thể tự đăng ký vendor riêng. </p>`);
            } else {
              _push2(`<p${_scopeId}> Tắt gói vendor cho tenant <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(toggleTarget)?.name)}</strong>? Các vendor đã đăng ký vẫn giữ nguyên trong hệ thống, nhưng tenant sẽ mất quyền chỉnh sửa. </p>`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-3 text-sm text-slate-700" }, [
                vueExports.unref(toggleTargetEnable) ? (vueExports.openBlock(), vueExports.createBlock("p", { key: 0 }, [
                  vueExports.createTextVNode(" Bật gói vendor cho tenant "),
                  vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(toggleTarget)?.name), 1),
                  vueExports.createTextVNode('? Tenant sẽ thấy menu "Vendor của tôi" sau khi đăng nhập lại và có thể tự đăng ký vendor riêng. ')
                ])) : (vueExports.openBlock(), vueExports.createBlock("p", { key: 1 }, [
                  vueExports.createTextVNode(" Tắt gói vendor cho tenant "),
                  vueExports.createVNode("strong", null, vueExports.toDisplayString(vueExports.unref(toggleTarget)?.name), 1),
                  vueExports.createTextVNode("? Các vendor đã đăng ký vẫn giữ nguyên trong hệ thống, nhưng tenant sẽ mất quyền chỉnh sửa. ")
                ]))
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "ghost",
              disabled: vueExports.unref(isToggling),
              onClick: ($event) => showToggleConfirm.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: vueExports.unref(toggleTargetEnable) ? "Bật gói vendor" : "Tắt gói vendor",
              color: vueExports.unref(toggleTargetEnable) ? "primary" : "warning",
              loading: vueExports.unref(isToggling),
              onClick: confirmToggle
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "ghost",
                  disabled: vueExports.unref(isToggling),
                  onClick: ($event) => showToggleConfirm.value = false
                }, null, 8, ["disabled", "onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: vueExports.unref(toggleTargetEnable) ? "Bật gói vendor" : "Tắt gói vendor",
                  color: vueExports.unref(toggleTargetEnable) ? "primary" : "warning",
                  loading: vueExports.unref(isToggling),
                  onClick: confirmToggle
                }, null, 8, ["label", "color", "loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/tenants/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cnebmzbu.mjs.map
