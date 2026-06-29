import { v as vueExports, p as useRoute$1, i as useRouter, u as useSeoMeta, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, l as _sfc_main$c, j as useToast, ay as usePlatformApiFetch, aD as $platformApi } from './server.mjs';
import { _ as _sfc_main$7 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$8 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_5, a as __nuxt_component_6$1 } from './TenantResidentRatingsCard-BH222I8E.mjs';
import { _ as _sfc_main$9 } from './Tabs-Djlffbcc.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5$1 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$a } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$b } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_4$1 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as _sfc_main$d } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$e } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$f } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$j } from './Empty-wM3WsVlF.mjs';
import { _ as __nuxt_component_10$1 } from './TablePagination-CZYWB-qm.mjs';
import { g as usePlatformTenantDetail, S as SERVICE_PLAN_OPTIONS, T as TENANT_MODULE_OPTIONS, h as TENANT_FEE_MODE_OPTIONS, i as TENANT_SUBSCRIPTION_CYCLE_OPTIONS, c as apiUpdateTenant, j as apiUpdateTenantConfig, k as useTenantProjects } from './useTenants-BTW8z9Mm.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { b as getApiErrorStatus, a as getApiValidationErrors, g as getApiErrorMessage, c as getApiErrorCode } from './apiError-DBrxF9au.mjs';
import { S as ServicePlan, a as SubscriptionCycle, T as TenantFeeMode } from './laravel-BKHe1mna.mjs';
import { _ as __nuxt_component_0 } from './BaseFormModal-CG7aCaIV.mjs';
import { _ as _sfc_main$k } from './SelectMenu-DKHEMZj7.mjs';
import { _ as _sfc_main$g } from './Switch-1cJNH-6C.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { _ as _sfc_main$i } from './RadioGroup-DnRwe9KX.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { u as useTenantToggleActive, _ as __nuxt_component_10 } from './useTenantToggleActive-CA9cCr0b.mjs';
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
import './Skeleton-CKN2C2Mt.mjs';
import './DualAxisChart-BTWuRjT1.mjs';
import './usePlatformProjects-D8VBGqRs.mjs';
import './useDirection-CXYby7CP.mjs';
import './FocusScope-BZehoQSg.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './Label-BBgw4vHh.mjs';
import './index-QmZAbLx-.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './Pagination-fZq_Msxb.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';

const _sfc_main$6 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantProjectsSection",
  __ssrInlineRender: true,
  props: {
    tenantId: {},
    maxProjects: {}
  },
  setup(__props) {
    const props = __props;
    const page = vueExports.ref(1);
    const { data, status, error, refresh } = useTenantProjects(
      () => props.tenantId,
      vueExports.computed(() => ({ page: page.value, per_page: DEFAULT_PER_PAGE }))
    );
    const projects = vueExports.computed(() => data.value?.data ?? []);
    const totalProjects = vueExports.computed(() => data.value?.meta.total ?? 0);
    const countLabel = vueExports.computed(
      () => props.maxProjects ? `${totalProjects.value}/${props.maxProjects}` : String(totalProjects.value)
    );
    const columns = [
      { accessorKey: "code", header: "Mã" },
      { accessorKey: "name", header: "Tên dự án" },
      { id: "address", header: "Địa chỉ" },
      { id: "status", header: "Trạng thái" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UBadge = _sfc_main$8;
      const _component_UAlert = _sfc_main$7;
      const _component_UButton = _sfc_main$c;
      const _component_UTable = _sfc_main$f;
      const _component_UEmpty = _sfc_main$j;
      const _component_SharedCrudTablePagination = __nuxt_component_10$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({
        title: "Dự án gắn tenant",
        icon: "i-lucide-map-pin"
      }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(status) !== "pending") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "neutral",
                variant: "subtle",
                label: vueExports.unref(countLabel)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.unref(status) !== "pending" ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                key: 0,
                color: "neutral",
                variant: "subtle",
                label: vueExports.unref(countLabel)
              }, null, 8, ["label"])) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(error)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                description: "Không thể tải danh sách dự án. Vui lòng thử lại.",
                class: "mb-4"
              }, {
                actions: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      label: "Thử lại",
                      color: "error",
                      variant: "soft",
                      size: "xs",
                      icon: "i-lucide-refresh-cw",
                      onClick: ($event) => vueExports.unref(refresh)()
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        label: "Thử lại",
                        color: "error",
                        variant: "soft",
                        size: "xs",
                        icon: "i-lucide-refresh-cw",
                        onClick: ($event) => vueExports.unref(refresh)()
                      }, null, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="border border-slate-200 rounded-xl overflow-hidden"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(projects),
              columns,
              loading: vueExports.unref(status) === "pending"
            }, {
              "address-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.address) {
                    _push3(`<span class="text-sm text-slate-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.address)}</span>`);
                  } else {
                    _push3(`<span class="text-xs text-gray-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.address ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(row.original.address), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ];
                }
              }),
              "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: row.original.status.value === "managing" ? "success" : "neutral",
                    variant: "subtle",
                    label: row.original.status.label
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      color: row.original.status.value === "managing" ? "success" : "neutral",
                      variant: "subtle",
                      label: row.original.status.label
                    }, null, 8, ["color", "label"])
                  ];
                }
              }),
              empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UEmpty, {
                    title: "Tenant chưa tạo dự án nào",
                    description: "Dự án do tenant tự quản lý trên cổng vận hành riêng.",
                    icon: "i-lucide-map-pin"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UEmpty, {
                      title: "Tenant chưa tạo dự án nào",
                      description: "Dự án do tenant tự quản lý trên cổng vận hành riêng.",
                      icon: "i-lucide-map-pin"
                    })
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
              vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 0,
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                description: "Không thể tải danh sách dự án. Vui lòng thử lại.",
                class: "mb-4"
              }, {
                actions: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UButton, {
                    label: "Thử lại",
                    color: "error",
                    variant: "soft",
                    size: "xs",
                    icon: "i-lucide-refresh-cw",
                    onClick: ($event) => vueExports.unref(refresh)()
                  }, null, 8, ["onClick"])
                ]),
                _: 1
              })) : vueExports.createCommentVNode("", true),
              vueExports.createVNode("div", { class: "border border-slate-200 rounded-xl overflow-hidden" }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(projects),
                  columns,
                  loading: vueExports.unref(status) === "pending"
                }, {
                  "address-cell": vueExports.withCtx(({ row }) => [
                    row.original.address ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(row.original.address), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ]),
                  "status-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      color: row.original.status.value === "managing" ? "success" : "neutral",
                      variant: "subtle",
                      label: row.original.status.label
                    }, null, 8, ["color", "label"])
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UEmpty, {
                      title: "Tenant chưa tạo dự án nào",
                      description: "Dự án do tenant tự quản lý trên cổng vận hành riêng.",
                      icon: "i-lucide-map-pin"
                    })
                  ]),
                  _: 1
                }, 8, ["data", "loading"]),
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
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantProjectsSection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_9$1 = Object.assign(_sfc_main$6, { __name: "TenantProjectsSection" });
const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantInfoTab",
  __ssrInlineRender: true,
  props: {
    tenant: {}
  },
  emits: ["updated"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const formState = vueExports.reactive({
      name: "",
      tax_code: "",
      service_plan: ServicePlan.business,
      representative_name: "",
      contact_email: "",
      contact_phone: "",
      address: "",
      notes: ""
    });
    vueExports.watch(
      () => props.tenant,
      (tenant) => {
        formState.name = tenant.name;
        formState.tax_code = tenant.tax_code ?? "";
        formState.service_plan = tenant.service_plan?.value ?? ServicePlan.business;
        formState.representative_name = tenant.representative_name ?? "";
        formState.contact_email = tenant.contact_email ?? "";
        formState.contact_phone = tenant.contact_phone ?? "";
        formState.address = tenant.address ?? "";
        formState.notes = tenant.notes ?? "";
      },
      { immediate: true }
    );
    const isSaving = vueExports.ref(false);
    const apiErrors = vueExports.ref({});
    async function handleSave() {
      apiErrors.value = {};
      isSaving.value = true;
      try {
        await apiUpdateTenant(props.tenant.id, {
          name: formState.name.trim(),
          tax_code: formState.tax_code.trim() || null,
          service_plan: formState.service_plan,
          representative_name: formState.representative_name.trim() || null,
          contact_email: formState.contact_email.trim() || null,
          contact_phone: formState.contact_phone.trim() || null,
          address: formState.address.trim() || null,
          notes: formState.notes.trim() || null
        });
        toast.add({ title: "Cập nhật thông tin công ty thành công", color: "success" });
        emit("updated");
      } catch (err) {
        const errors = getApiValidationErrors(err);
        if (errors) {
          apiErrors.value = errors;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Cập nhật thất bại"), color: "error" });
        }
      } finally {
        isSaving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5$1;
      const _component_UBadge = _sfc_main$8;
      const _component_UFormField = _sfc_main$a;
      const _component_UInput = _sfc_main$b;
      const _component_SharedCrudFormFieldError = __nuxt_component_4$1;
      const _component_USelect = _sfc_main$d;
      const _component_UTextarea = _sfc_main$e;
      const _component_UButton = _sfc_main$c;
      const _component_TenantProjectsSection = __nuxt_component_9$1;
      const _component_TenantResidentRatingsCard = __nuxt_component_6$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-6" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Hạ tầng tenant" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-500 mb-4"${_scopeId}> Tên miền và schema do hệ thống cấp khi đăng ký — không thể chỉnh sửa. </p><div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên miền" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.tenant.domains.length) {
                    _push3(`<div class="flex flex-wrap gap-1.5"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(__props.tenant.domains, (domain) => {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        key: domain,
                        color: "info",
                        variant: "subtle",
                        label: domain,
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    __props.tenant.domains.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-wrap gap-1.5"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.tenant.domains, (domain) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: domain,
                          color: "info",
                          variant: "subtle",
                          label: domain,
                          size: "sm"
                        }, null, 8, ["label"]);
                      }), 128))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên schema" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-mono"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.tenant.schema_name)}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(__props.tenant.schema_name), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-500 mb-4" }, " Tên miền và schema do hệ thống cấp khi đăng ký — không thể chỉnh sửa. "),
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, [
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên miền" }, {
                  default: vueExports.withCtx(() => [
                    __props.tenant.domains.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "flex flex-wrap gap-1.5"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.tenant.domains, (domain) => {
                        return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                          key: domain,
                          color: "info",
                          variant: "subtle",
                          label: domain,
                          size: "sm"
                        }, null, 8, ["label"]);
                      }), 128))
                    ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên schema" }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(__props.tenant.schema_name), 1)
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin công ty" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mã công ty",
              name: "id"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    "model-value": __props.tenant.id,
                    disabled: "",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.tenant.id,
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
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
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: vueExports.unref(apiErrors).name
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).name
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
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
                    errors: vueExports.unref(apiErrors).tax_code
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
                      errors: vueExports.unref(apiErrors).tax_code
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
                    errors: vueExports.unref(apiErrors).service_plan
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
                      errors: vueExports.unref(apiErrors).service_plan
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
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: vueExports.unref(apiErrors).representative_name
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).representative_name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).representative_name = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).representative_name
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ngày đăng ký",
              name: "created_at"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    "model-value": __props.tenant.created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(__props.tenant.created_at) : "—",
                    disabled: "",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.tenant.created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(__props.tenant.created_at) : "—",
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
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
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: vueExports.unref(apiErrors).contact_email
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).contact_email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact_email = $event,
                      type: "email",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).contact_email
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
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: vueExports.unref(apiErrors).contact_phone
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).contact_phone,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact_phone = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).contact_phone
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Địa chỉ",
              name: "address",
              class: "sm:col-span-2"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).address,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: vueExports.unref(apiErrors).address
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).address,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).address
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Ghi chú",
              name: "notes",
              help: "Ghi chú nội bộ platform.",
              class: "sm:col-span-2"
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
                    errors: vueExports.unref(apiErrors).notes
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
                      errors: vueExports.unref(apiErrors).notes
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="flex justify-end mt-5"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-save",
              label: "Lưu thay đổi",
              loading: vueExports.unref(isSaving),
              onClick: handleSave
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Mã công ty",
                  name: "id"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.tenant.id,
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Tên công ty",
                  name: "name",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).name
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
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
                      errors: vueExports.unref(apiErrors).tax_code
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
                      errors: vueExports.unref(apiErrors).service_plan
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
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).representative_name
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ngày đăng ký",
                  name: "created_at"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.tenant.created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(__props.tenant.created_at) : "—",
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Email",
                  name: "contact_email"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).contact_email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).contact_email = $event,
                      type: "email",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).contact_email
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
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).contact_phone
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Địa chỉ",
                  name: "address",
                  class: "sm:col-span-2"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).address,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).address = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).address
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Ghi chú",
                  name: "notes",
                  help: "Ghi chú nội bộ platform.",
                  class: "sm:col-span-2"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(formState).notes,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).notes = $event,
                      rows: 2,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).notes
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })
              ]),
              vueExports.createVNode("div", { class: "flex justify-end mt-5" }, [
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-save",
                  label: "Lưu thay đổi",
                  loading: vueExports.unref(isSaving),
                  onClick: handleSave
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantProjectsSection, {
        "tenant-id": __props.tenant.id,
        "max-projects": __props.tenant.config?.max_projects
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantResidentRatingsCard, {
        "tenant-id": __props.tenant.id
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantInfoTab.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$5, { __name: "TenantInfoTab" });
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantAccountFormModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    item: { default: null },
    options: {},
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formState = vueExports.reactive({
      name: "",
      email: "",
      password: "",
      department_ids: [],
      job_title_id: void 0,
      role_id: void 0,
      is_active: true
    });
    const showPassword = vueExports.ref(false);
    function resetForm() {
      formState.name = "";
      formState.email = "";
      formState.password = "";
      formState.department_ids = [];
      formState.job_title_id = void 0;
      formState.role_id = void 0;
      formState.is_active = true;
    }
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        showPassword.value = false;
        resetForm();
        if (props.mode === "edit" && props.item) {
          formState.name = props.item.name;
          formState.email = props.item.email;
          formState.department_ids = (props.item.departments ?? []).map((d) => d.id);
          formState.job_title_id = props.item.job_title?.id ?? void 0;
          formState.role_id = props.item.role?.id ?? void 0;
          formState.is_active = props.item.is_active;
        }
      }
    );
    function handleSubmit() {
      emit("submit", {
        name: formState.name.trim(),
        email: formState.email.trim(),
        password: formState.password,
        department_ids: [...formState.department_ids],
        job_title_id: formState.job_title_id,
        role_id: formState.role_id,
        is_active: formState.is_active
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudBaseFormModal = __nuxt_component_0;
      const _component_UFormField = _sfc_main$a;
      const _component_UInput = _sfc_main$b;
      const _component_SharedCrudFormFieldError = __nuxt_component_4$1;
      const _component_UButton = _sfc_main$c;
      const _component_USelectMenu = _sfc_main$k;
      const _component_USwitch = _sfc_main$g;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudBaseFormModal, vueExports.mergeProps({
        open: __props.open,
        mode: __props.mode,
        loading: __props.loading,
        titles: { create: "Thêm tài khoản", edit: "Cập nhật tài khoản" },
        "onUpdate:open": ($event) => emit("update:open", $event),
        onSubmit: handleSubmit
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
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
              label: "Email đăng nhập",
              name: "email",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                    type: "email",
                    placeholder: "admin@congty.vn",
                    class: "w-full"
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
                      placeholder: "admin@congty.vn",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.email
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mật khẩu",
              name: "password",
              required: __props.mode === "create",
              help: __props.mode === "edit" ? "Để trống nếu không đổi mật khẩu." : "Tối thiểu 8 ký tự."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-2"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).password,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                    type: vueExports.unref(showPassword) ? "text" : "password",
                    placeholder: __props.mode === "edit" ? "Để trống = giữ nguyên" : "Tối thiểu 8 ký tự",
                    class: "flex-1"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: vueExports.unref(showPassword) ? "i-lucide-eye-off" : "i-lucide-eye",
                    color: "neutral",
                    variant: "outline",
                    onClick: ($event) => showPassword.value = !vueExports.unref(showPassword)
                  }, null, _parent3, _scopeId2));
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
                        placeholder: __props.mode === "edit" ? "Để trống = giữ nguyên" : "Tối thiểu 8 ký tự",
                        class: "flex-1"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "placeholder"]),
                      vueExports.createVNode(_component_UButton, {
                        icon: vueExports.unref(showPassword) ? "i-lucide-eye-off" : "i-lucide-eye",
                        color: "neutral",
                        variant: "outline",
                        onClick: ($event) => showPassword.value = !vueExports.unref(showPassword)
                      }, null, 8, ["icon", "onClick"])
                    ]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.password
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
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).department_ids,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).department_ids = $event,
                    items: __props.options.departments,
                    "value-key": "id",
                    "label-key": "name",
                    multiple: "",
                    placeholder: "Chọn phòng ban...",
                    "search-input": { placeholder: "Tìm phòng ban..." },
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.department_ids
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).department_ids,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).department_ids = $event,
                      items: __props.options.departments,
                      "value-key": "id",
                      "label-key": "name",
                      multiple: "",
                      placeholder: "Chọn phòng ban...",
                      "search-input": { placeholder: "Tìm phòng ban..." },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.department_ids
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Chức danh",
              name: "job_title_id",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).job_title_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).job_title_id = $event,
                    items: __props.options.job_titles,
                    "value-key": "id",
                    "label-key": "name",
                    placeholder: "Chọn chức danh...",
                    "search-input": { placeholder: "Tìm chức danh..." },
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.job_title_id
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).job_title_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).job_title_id = $event,
                      items: __props.options.job_titles,
                      "value-key": "id",
                      "label-key": "name",
                      placeholder: "Chọn chức danh...",
                      "search-input": { placeholder: "Tìm chức danh..." },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.job_title_id
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Vai trò",
              name: "role_id",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).role_id,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).role_id = $event,
                    items: __props.options.roles,
                    "value-key": "id",
                    "label-key": "name",
                    placeholder: "Chọn vai trò...",
                    "search-input": { placeholder: "Tìm vai trò..." },
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.role_id
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).role_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).role_id = $event,
                      items: __props.options.roles,
                      "value-key": "id",
                      "label-key": "name",
                      placeholder: "Chọn vai trò...",
                      "search-input": { placeholder: "Tìm vai trò..." },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.role_id
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><div class="font-medium text-slate-900 text-sm"${_scopeId}> Trạng thái hoạt động </div><div class="text-sm text-slate-500"${_scopeId}> Tắt để chặn tài khoản đăng nhập cổng vận hành. </div></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
              modelValue: vueExports.unref(formState).is_active,
              "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_active = $event
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
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
                label: "Email đăng nhập",
                name: "email",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(formState).email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).email = $event,
                    type: "email",
                    placeholder: "admin@congty.vn",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.email
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Mật khẩu",
                name: "password",
                required: __props.mode === "create",
                help: __props.mode === "edit" ? "Để trống nếu không đổi mật khẩu." : "Tối thiểu 8 ký tự."
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "flex gap-2" }, [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).password,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).password = $event,
                      type: vueExports.unref(showPassword) ? "text" : "password",
                      placeholder: __props.mode === "edit" ? "Để trống = giữ nguyên" : "Tối thiểu 8 ký tự",
                      class: "flex-1"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "placeholder"]),
                    vueExports.createVNode(_component_UButton, {
                      icon: vueExports.unref(showPassword) ? "i-lucide-eye-off" : "i-lucide-eye",
                      color: "neutral",
                      variant: "outline",
                      onClick: ($event) => showPassword.value = !vueExports.unref(showPassword)
                    }, null, 8, ["icon", "onClick"])
                  ]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.password
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }, 8, ["required", "help"]),
              vueExports.createVNode(_component_UFormField, {
                label: "Phòng ban",
                name: "department_ids",
                required: ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).department_ids,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).department_ids = $event,
                    items: __props.options.departments,
                    "value-key": "id",
                    "label-key": "name",
                    multiple: "",
                    placeholder: "Chọn phòng ban...",
                    "search-input": { placeholder: "Tìm phòng ban..." },
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                  vueExports.createVNode(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.department_ids
                  }, null, 8, ["errors"])
                ]),
                _: 1
              }),
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Chức danh",
                  name: "job_title_id",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).job_title_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).job_title_id = $event,
                      items: __props.options.job_titles,
                      "value-key": "id",
                      "label-key": "name",
                      placeholder: "Chọn chức danh...",
                      "search-input": { placeholder: "Tìm chức danh..." },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.job_title_id
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Vai trò",
                  name: "role_id",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).role_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).role_id = $event,
                      items: __props.options.roles,
                      "value-key": "id",
                      "label-key": "name",
                      placeholder: "Chọn vai trò...",
                      "search-input": { placeholder: "Tìm vai trò..." },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.role_id
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })
              ]),
              vueExports.createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("div", { class: "font-medium text-slate-900 text-sm" }, " Trạng thái hoạt động "),
                  vueExports.createVNode("div", { class: "text-sm text-slate-500" }, " Tắt để chặn tài khoản đăng nhập cổng vận hành. ")
                ]),
                vueExports.createVNode(_component_USwitch, {
                  modelValue: vueExports.unref(formState).is_active,
                  "onUpdate:modelValue": ($event) => vueExports.unref(formState).is_active = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantAccountFormModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_8$1 = Object.assign(_sfc_main$4, { __name: "TenantAccountFormModal" });
function useTenantAccountList(tenantId, params) {
  const url = vueExports.computed(() => {
    const id = vueExports.toValue(tenantId);
    const p = vueExports.toValue(params);
    const query = new URLSearchParams();
    if (p.search) query.set("search", p.search);
    if (p.is_active !== void 0 && p.is_active !== null) query.set("is_active", p.is_active ? "1" : "0");
    if (p.sort_by) query.set("sort_by", p.sort_by);
    if (p.sort_direction) query.set("sort_direction", p.sort_direction);
    if (p.page) query.set("page", String(p.page));
    if (p.per_page) query.set("per_page", String(p.per_page));
    const qs = query.toString();
    return `/platform/tenants/${id}/accounts${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
function useTenantAccountOptions(tenantId) {
  const url = vueExports.computed(() => `/platform/tenants/${vueExports.toValue(tenantId)}/accounts/options`);
  return usePlatformApiFetch(url);
}
function apiCreateTenantAccount(tenantId, data) {
  return $platformApi(`/platform/tenants/${tenantId}/accounts`, {
    method: "POST",
    body: data
  });
}
function apiUpdateTenantAccount(tenantId, accountId, data) {
  return $platformApi(`/platform/tenants/${tenantId}/accounts/${accountId}`, {
    method: "PUT",
    body: data
  });
}
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantAccountsTab",
  __ssrInlineRender: true,
  props: {
    tenantId: {}
  },
  setup(__props) {
    const props = __props;
    const tenantId = vueExports.computed(() => props.tenantId);
    const params = vueExports.reactive({
      search: void 0,
      is_active: void 0,
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
    const { data, status, error, refresh } = useTenantAccountList(
      tenantId,
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const accounts = vueExports.computed(() => data.value?.data ?? []);
    const { data: optionsData } = useTenantAccountOptions(tenantId);
    const formOptions = vueExports.computed(
      () => optionsData.value?.data ?? { departments: [], job_titles: [], roles: [] }
    );
    const columns = [
      { accessorKey: "name", header: "Họ tên" },
      { accessorKey: "email", header: "Email" },
      { id: "departments", header: "Phòng ban" },
      { id: "job_title", header: "Chức danh" },
      { id: "role", header: "Vai trò" },
      { id: "is_active", header: "Trạng thái" },
      { id: "actions", header: "Thao tác" }
    ];
    function departmentLabel(account) {
      return (account.departments ?? []).map((d) => d.name).join(", ");
    }
    const crud = useCrudModals();
    const {
      showFormModal,
      formMode,
      editTarget,
      formApiErrors,
      openCreateModal,
      openEditModal
    } = crud;
    const toast = useToast();
    const isSubmitting = vueExports.ref(false);
    const BUSINESS_ERROR_FIELDS = {
      EMAIL_ALREADY_EXISTS: { field: "email", message: "Email đã tồn tại." },
      DEPARTMENT_NOT_FOUND: { field: "department_ids", message: "Phòng ban không tồn tại." },
      JOB_TITLE_NOT_FOUND: { field: "job_title_id", message: "Chức danh không tồn tại." },
      ROLE_NOT_FOUND: { field: "role_id", message: "Vai trò không tồn tại." }
    };
    function handleSubmitError(err) {
      const validationErrors = getApiValidationErrors(err);
      if (validationErrors) {
        formApiErrors.value = validationErrors;
        return;
      }
      const code = getApiErrorCode(err);
      const mapped = code ? BUSINESS_ERROR_FIELDS[code] : void 0;
      if (mapped) {
        formApiErrors.value = { [mapped.field]: [mapped.message] };
        return;
      }
      toast.add({
        title: getApiErrorMessage(err, "Lưu tài khoản thất bại"),
        color: "error",
        icon: "i-lucide-alert-circle"
      });
    }
    async function handleFormSubmit(formData) {
      const isCreate = formMode.value === "create";
      formApiErrors.value = {};
      isSubmitting.value = true;
      try {
        if (isCreate) {
          await apiCreateTenantAccount(tenantId.value, {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            department_ids: formData.department_ids,
            job_title_id: formData.job_title_id,
            role_id: formData.role_id,
            is_active: formData.is_active
          });
          toast.add({ title: "Thêm tài khoản thành công", color: "success" });
        } else {
          await apiUpdateTenantAccount(tenantId.value, editTarget.value.id, {
            name: formData.name,
            email: formData.email,
            department_ids: formData.department_ids,
            job_title_id: formData.job_title_id,
            role_id: formData.role_id,
            is_active: formData.is_active,
            ...formData.password ? { password: formData.password } : {}
          });
          toast.add({ title: "Cập nhật tài khoản thành công", color: "success" });
        }
        await refresh();
        showFormModal.value = false;
      } catch (err) {
        handleSubmitError(err);
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$b;
      const _component_UButtonGroup = vueExports.resolveComponent("UButtonGroup");
      const _component_UAlert = _sfc_main$7;
      const _component_UTable = _sfc_main$f;
      const _component_UBadge = _sfc_main$8;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedCrudTablePagination = __nuxt_component_10$1;
      const _component_TenantAccountFormModal = __nuxt_component_8$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({ title: "Quản lý tài khoản" }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Thêm tài khoản",
              size: "sm",
              onClick: vueExports.unref(openCreateModal)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Thêm tài khoản",
                size: "sm",
                onClick: vueExports.unref(openCreateModal)
              }, null, 8, ["onClick"])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-4 flex items-center gap-3 flex-wrap"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(searchInput),
              "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
              icon: "i-lucide-search",
              placeholder: "Tìm theo họ tên, email...",
              class: "max-w-xs"
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButtonGroup, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    color: vueExports.unref(activeFilter) === "all" ? "primary" : "neutral",
                    variant: vueExports.unref(activeFilter) === "all" ? "solid" : "outline",
                    size: "sm",
                    label: "Tất cả",
                    onClick: ($event) => applyActiveFilter("all")
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    color: vueExports.unref(activeFilter) === "active" ? "primary" : "neutral",
                    variant: vueExports.unref(activeFilter) === "active" ? "solid" : "outline",
                    size: "sm",
                    label: "Hoạt động",
                    onClick: ($event) => applyActiveFilter("active")
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    color: vueExports.unref(activeFilter) === "inactive" ? "primary" : "neutral",
                    variant: vueExports.unref(activeFilter) === "inactive" ? "solid" : "outline",
                    size: "sm",
                    label: "Đã tắt",
                    onClick: ($event) => applyActiveFilter("inactive")
                  }, null, _parent3, _scopeId2));
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
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (vueExports.unref(error)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                description: "Không thể tải danh sách tài khoản. Vui lòng thử lại.",
                class: "mb-4"
              }, {
                actions: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      label: "Thử lại",
                      color: "error",
                      variant: "soft",
                      size: "xs",
                      icon: "i-lucide-refresh-cw",
                      onClick: ($event) => vueExports.unref(refresh)()
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        label: "Thử lại",
                        color: "error",
                        variant: "soft",
                        size: "xs",
                        icon: "i-lucide-refresh-cw",
                        onClick: ($event) => vueExports.unref(refresh)()
                      }, null, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="border border-slate-200 rounded-xl overflow-hidden"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(accounts),
              columns,
              loading: vueExports.unref(status) === "pending"
            }, {
              "departments-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (departmentLabel(row.original)) {
                    _push3(`<span class="text-sm text-slate-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(departmentLabel(row.original))}</span>`);
                  } else {
                    _push3(`<span class="text-xs text-gray-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    departmentLabel(row.original) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(departmentLabel(row.original)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ];
                }
              }),
              "job_title-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.job_title) {
                    _push3(`<span class="text-sm text-slate-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.job_title.name)}</span>`);
                  } else {
                    _push3(`<span class="text-xs text-gray-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.job_title ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(row.original.job_title.name), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ];
                }
              }),
              "role-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.original.role) {
                    _push3(`<span class="text-sm text-slate-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.role.name)}</span>`);
                  } else {
                    _push3(`<span class="text-xs text-gray-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    row.original.role ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(row.original.role.name), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ];
                }
              }),
              "is_active-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: row.original.is_active ? "success" : "neutral",
                    variant: "subtle",
                    label: row.original.is_active ? "Hoạt động" : "Tắt"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      color: row.original.is_active ? "success" : "neutral",
                      variant: "subtle",
                      label: row.original.is_active ? "Hoạt động" : "Tắt"
                    }, null, 8, ["color", "label"])
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-pencil",
                    label: "Sửa",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    onClick: ($event) => vueExports.unref(openEditModal)(row.original)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-pencil",
                      label: "Sửa",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      onClick: ($event) => vueExports.unref(openEditModal)(row.original)
                    }, null, 8, ["onClick"])
                  ];
                }
              }),
              empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col items-center gap-3 py-8"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-users",
                    class: "size-10 text-slate-300"
                  }, null, _parent3, _scopeId2));
                  _push3(`<p class="text-sm text-slate-500"${_scopeId2}> Tenant chưa có tài khoản nào. </p>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-plus",
                    label: "Thêm tài khoản",
                    size: "sm",
                    onClick: vueExports.unref(openCreateModal)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col items-center gap-3 py-8" }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-users",
                        class: "size-10 text-slate-300"
                      }),
                      vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Tenant chưa có tài khoản nào. "),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-plus",
                        label: "Thêm tài khoản",
                        size: "sm",
                        onClick: vueExports.unref(openCreateModal)
                      }, null, 8, ["onClick"])
                    ])
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
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantAccountFormModal, {
              open: vueExports.unref(showFormModal),
              "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
              mode: vueExports.unref(formMode),
              item: vueExports.unref(editTarget),
              options: vueExports.unref(formOptions),
              loading: vueExports.unref(isSubmitting),
              "api-errors": vueExports.unref(formApiErrors),
              onSubmit: handleFormSubmit
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("div", { class: "mb-4 flex items-center gap-3 flex-wrap" }, [
                vueExports.createVNode(_component_UInput, {
                  modelValue: vueExports.unref(searchInput),
                  "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
                  icon: "i-lucide-search",
                  placeholder: "Tìm theo họ tên, email...",
                  class: "max-w-xs"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                vueExports.createVNode(_component_UButtonGroup, null, {
                  default: vueExports.withCtx(() => [
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
                  ]),
                  _: 1
                })
              ]),
              vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 0,
                icon: "i-lucide-alert-circle",
                color: "error",
                variant: "subtle",
                description: "Không thể tải danh sách tài khoản. Vui lòng thử lại.",
                class: "mb-4"
              }, {
                actions: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UButton, {
                    label: "Thử lại",
                    color: "error",
                    variant: "soft",
                    size: "xs",
                    icon: "i-lucide-refresh-cw",
                    onClick: ($event) => vueExports.unref(refresh)()
                  }, null, 8, ["onClick"])
                ]),
                _: 1
              })) : vueExports.createCommentVNode("", true),
              vueExports.createVNode("div", { class: "border border-slate-200 rounded-xl overflow-hidden" }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(accounts),
                  columns,
                  loading: vueExports.unref(status) === "pending"
                }, {
                  "departments-cell": vueExports.withCtx(({ row }) => [
                    departmentLabel(row.original) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(departmentLabel(row.original)), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ]),
                  "job_title-cell": vueExports.withCtx(({ row }) => [
                    row.original.job_title ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(row.original.job_title.name), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ]),
                  "role-cell": vueExports.withCtx(({ row }) => [
                    row.original.role ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(row.original.role.name), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-xs text-gray-400"
                    }, "—"))
                  ]),
                  "is_active-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      color: row.original.is_active ? "success" : "neutral",
                      variant: "subtle",
                      label: row.original.is_active ? "Hoạt động" : "Tắt"
                    }, null, 8, ["color", "label"])
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-pencil",
                      label: "Sửa",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      onClick: ($event) => vueExports.unref(openEditModal)(row.original)
                    }, null, 8, ["onClick"])
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "flex flex-col items-center gap-3 py-8" }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-users",
                        class: "size-10 text-slate-300"
                      }),
                      vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Tenant chưa có tài khoản nào. "),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-plus",
                        label: "Thêm tài khoản",
                        size: "sm",
                        onClick: vueExports.unref(openCreateModal)
                      }, null, 8, ["onClick"])
                    ])
                  ]),
                  _: 1
                }, 8, ["data", "loading"]),
                vueExports.createVNode(_component_SharedCrudTablePagination, {
                  page: vueExports.unref(page),
                  "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
                  meta: vueExports.unref(data)?.meta
                }, null, 8, ["page", "onUpdate:page", "meta"])
              ]),
              vueExports.createVNode(_component_TenantAccountFormModal, {
                open: vueExports.unref(showFormModal),
                "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
                mode: vueExports.unref(formMode),
                item: vueExports.unref(editTarget),
                options: vueExports.unref(formOptions),
                loading: vueExports.unref(isSubmitting),
                "api-errors": vueExports.unref(formApiErrors),
                onSubmit: handleFormSubmit
              }, null, 8, ["open", "onUpdate:open", "mode", "item", "options", "loading", "api-errors"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantAccountsTab.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$3, { __name: "TenantAccountsTab" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantModulesTab",
  __ssrInlineRender: true,
  props: {
    tenant: {}
  },
  emits: ["updated"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const allModuleValues = TENANT_MODULE_OPTIONS.map((m) => m.value);
    const enabledModules = vueExports.ref([]);
    vueExports.watch(
      () => props.tenant,
      (tenant) => {
        const configured = tenant.config?.enabled_modules;
        enabledModules.value = configured === null || configured === void 0 ? [...allModuleValues] : configured.filter((m) => allModuleValues.includes(m));
      },
      { immediate: true }
    );
    const savingModule = vueExports.ref(null);
    async function toggleModule(module, enabled) {
      const previous = [...enabledModules.value];
      enabledModules.value = enabled ? [...enabledModules.value, module] : enabledModules.value.filter((m) => m !== module);
      savingModule.value = module;
      try {
        await apiUpdateTenantConfig(props.tenant.id, { enabled_modules: enabledModules.value });
        toast.add({
          title: enabled ? "Đã bật module cho tenant" : "Đã tắt module cho tenant",
          color: "success",
          icon: "i-lucide-check-circle"
        });
        emit("updated");
      } catch (err) {
        enabledModules.value = previous;
        toast.add({
          title: getApiErrorMessage(err, "Không thể cập nhật module"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        savingModule.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UIcon = _sfc_main$h;
      const _component_USwitch = _sfc_main$g;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({ title: "Quản lý dịch vụ" }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-slate-500 mb-4"${_scopeId}> Bật/tắt module nghiệp vụ cho công ty vận hành. Thay đổi được lưu ngay khi gạt công tắc. </p><div class="divide-y divide-slate-100"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(TENANT_MODULE_OPTIONS), (module) => {
              _push2(`<div class="flex items-center gap-4 py-3.5"${_scopeId}><div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: module.icon,
                class: "size-5 text-primary"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><div class="font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(module.label)}</div><div class="text-sm text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(module.description)}</div></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
                "model-value": vueExports.unref(enabledModules).includes(module.value),
                disabled: vueExports.unref(savingModule) !== null,
                loading: vueExports.unref(savingModule) === module.value,
                "onUpdate:modelValue": (v) => toggleModule(module.value, v)
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "text-sm text-slate-500 mb-4" }, " Bật/tắt module nghiệp vụ cho công ty vận hành. Thay đổi được lưu ngay khi gạt công tắc. "),
              vueExports.createVNode("div", { class: "divide-y divide-slate-100" }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(TENANT_MODULE_OPTIONS), (module) => {
                  return vueExports.openBlock(), vueExports.createBlock("div", {
                    key: module.value,
                    class: "flex items-center gap-4 py-3.5"
                  }, [
                    vueExports.createVNode("div", { class: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50" }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: module.icon,
                        class: "size-5 text-primary"
                      }, null, 8, ["name"])
                    ]),
                    vueExports.createVNode("div", { class: "min-w-0 flex-1" }, [
                      vueExports.createVNode("div", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(module.label), 1),
                      vueExports.createVNode("div", { class: "text-sm text-slate-500" }, vueExports.toDisplayString(module.description), 1)
                    ]),
                    vueExports.createVNode(_component_USwitch, {
                      "model-value": vueExports.unref(enabledModules).includes(module.value),
                      disabled: vueExports.unref(savingModule) !== null,
                      loading: vueExports.unref(savingModule) === module.value,
                      "onUpdate:modelValue": (v) => toggleModule(module.value, v)
                    }, null, 8, ["model-value", "disabled", "loading", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantModulesTab.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$2, { __name: "TenantModulesTab" });
const EXAMPLE_ORDER_AMOUNT = 1e7;
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantConfigTab",
  __ssrInlineRender: true,
  props: {
    tenant: {}
  },
  emits: ["updated"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const formState = vueExports.reactive({
      max_projects: 1,
      max_accounts: 1,
      session_timeout_minutes: 15,
      resident_portal_enabled: true,
      partner_portal_enabled: true,
      fee_mode: TenantFeeMode.none,
      subscription_cycle: SubscriptionCycle.monthly,
      subscription_amount: 0,
      fixed_fee_per_order: 0,
      percent_fee_per_order: 0
    });
    vueExports.watch(
      () => props.tenant,
      (tenant) => {
        const config = tenant.config;
        if (!config) return;
        formState.max_projects = config.max_projects;
        formState.max_accounts = config.max_accounts;
        formState.session_timeout_minutes = config.session_timeout_minutes;
        formState.resident_portal_enabled = config.resident_portal_enabled;
        formState.partner_portal_enabled = config.partner_portal_enabled;
        formState.fee_mode = config.fee_mode.value ?? TenantFeeMode.none;
        formState.subscription_cycle = config.subscription_cycle.value ?? SubscriptionCycle.monthly;
        formState.subscription_amount = Number(config.subscription_amount);
        formState.fixed_fee_per_order = Number(config.fixed_fee_per_order);
        formState.percent_fee_per_order = Number(config.percent_fee_per_order);
      },
      { immediate: true }
    );
    const showSubscriptionFields = vueExports.computed(() => formState.fee_mode === TenantFeeMode.subscription);
    const showFixedFee = vueExports.computed(() => formState.fee_mode === TenantFeeMode.fixed_per_order || formState.fee_mode === TenantFeeMode.both);
    const showPercentFee = vueExports.computed(() => formState.fee_mode === TenantFeeMode.percent_per_order || formState.fee_mode === TenantFeeMode.both);
    const bothFeeExample = vueExports.computed(() => {
      const fee = formState.fixed_fee_per_order + EXAMPLE_ORDER_AMOUNT * formState.percent_fee_per_order / 100;
      return formatCurrency(fee);
    });
    const isSaving = vueExports.ref(false);
    const apiErrors = vueExports.ref({});
    async function handleSave() {
      apiErrors.value = {};
      isSaving.value = true;
      try {
        const body = {
          max_projects: formState.max_projects,
          max_accounts: formState.max_accounts,
          session_timeout_minutes: formState.session_timeout_minutes,
          resident_portal_enabled: formState.resident_portal_enabled,
          partner_portal_enabled: formState.partner_portal_enabled,
          fee_mode: formState.fee_mode,
          ...showSubscriptionFields.value ? { subscription_cycle: formState.subscription_cycle, subscription_amount: formState.subscription_amount } : {},
          ...showFixedFee.value ? { fixed_fee_per_order: formState.fixed_fee_per_order } : {},
          ...showPercentFee.value ? { percent_fee_per_order: formState.percent_fee_per_order } : {}
        };
        await apiUpdateTenantConfig(props.tenant.id, body);
        toast.add({ title: "Lưu cấu hình thành công", color: "success" });
        emit("updated");
      } catch (err) {
        const errors = getApiValidationErrors(err);
        if (errors) {
          apiErrors.value = errors;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Lưu cấu hình thất bại"), color: "error" });
        }
      } finally {
        isSaving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$a;
      const _component_UInput = _sfc_main$b;
      const _component_SharedCrudFormFieldError = __nuxt_component_4$1;
      const _component_USwitch = _sfc_main$g;
      const _component_URadioGroup = _sfc_main$i;
      const _component_USelect = _sfc_main$d;
      const _component_UAlert = _sfc_main$7;
      const _component_UButton = _sfc_main$c;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-6" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Cấu hình tenant" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Giới hạn dự án",
              name: "max_projects",
              help: "Số dự án tối đa tenant được tạo."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).max_projects,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).max_projects = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: 1,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: vueExports.unref(apiErrors).max_projects
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).max_projects,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).max_projects = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 1,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).max_projects
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Giới hạn tài khoản",
              name: "max_accounts",
              help: "Số tài khoản vận hành tối đa."
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).max_accounts,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).max_accounts = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: 1,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: vueExports.unref(apiErrors).max_accounts
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).max_accounts,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).max_accounts = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 1,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).max_accounts
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Thời gian phiên (phút)",
              name: "session_timeout_minutes"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).session_timeout_minutes,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).session_timeout_minutes = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: 15,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: vueExports.unref(apiErrors).session_timeout_minutes
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).session_timeout_minutes,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).session_timeout_minutes = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 15,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).session_timeout_minutes
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="mt-5 flex flex-col gap-4"${_scopeId}><div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><div class="font-medium text-slate-900 text-sm"${_scopeId}> Cho phép hiển thị trên app cư dân </div><div class="text-sm text-slate-500"${_scopeId}> Cư dân thấy được dịch vụ của công ty trên ứng dụng. </div></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
              modelValue: vueExports.unref(formState).resident_portal_enabled,
              "onUpdate:modelValue": ($event) => vueExports.unref(formState).resident_portal_enabled = $event
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><div class="font-medium text-slate-900 text-sm"${_scopeId}> Cho phép đăng ký dịch vụ </div><div class="text-sm text-slate-500"${_scopeId}> Đối tác có thể đăng ký cung cấp dịch vụ cho công ty. </div></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
              modelValue: vueExports.unref(formState).partner_portal_enabled,
              "onUpdate:modelValue": ($event) => vueExports.unref(formState).partner_portal_enabled = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Giới hạn dự án",
                  name: "max_projects",
                  help: "Số dự án tối đa tenant được tạo."
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).max_projects,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).max_projects = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 1,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).max_projects
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Giới hạn tài khoản",
                  name: "max_accounts",
                  help: "Số tài khoản vận hành tối đa."
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).max_accounts,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).max_accounts = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 1,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).max_accounts
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Thời gian phiên (phút)",
                  name: "session_timeout_minutes"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).session_timeout_minutes,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).session_timeout_minutes = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 15,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).session_timeout_minutes
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })
              ]),
              vueExports.createVNode("div", { class: "mt-5 flex flex-col gap-4" }, [
                vueExports.createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("div", { class: "font-medium text-slate-900 text-sm" }, " Cho phép hiển thị trên app cư dân "),
                    vueExports.createVNode("div", { class: "text-sm text-slate-500" }, " Cư dân thấy được dịch vụ của công ty trên ứng dụng. ")
                  ]),
                  vueExports.createVNode(_component_USwitch, {
                    modelValue: vueExports.unref(formState).resident_portal_enabled,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).resident_portal_enabled = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                vueExports.createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("div", { class: "font-medium text-slate-900 text-sm" }, " Cho phép đăng ký dịch vụ "),
                    vueExports.createVNode("div", { class: "text-sm text-slate-500" }, " Đối tác có thể đăng ký cung cấp dịch vụ cho công ty. ")
                  ]),
                  vueExports.createVNode(_component_USwitch, {
                    modelValue: vueExports.unref(formState).partner_portal_enabled,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).partner_portal_enabled = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Phí nền tảng theo đơn hàng" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_URadioGroup, {
              modelValue: vueExports.unref(formState).fee_mode,
              "onUpdate:modelValue": ($event) => vueExports.unref(formState).fee_mode = $event,
              variant: "card",
              items: [...vueExports.unref(TENANT_FEE_MODE_OPTIONS)],
              "value-key": "value",
              "label-key": "label",
              "description-key": "description",
              ui: {
                fieldset: "gap-y-2.5",
                item: "cursor-pointer border-slate-200 transition-colors hover:border-slate-300 hover:bg-slate-50/60 has-data-[state=checked]:border-slate-900 has-data-[state=checked]:bg-slate-50 has-data-[state=checked]:ring-1 has-data-[state=checked]:ring-slate-900/10",
                label: "font-semibold text-highlighted",
                description: "mt-0.5 leading-snug text-muted"
              }
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
              errors: vueExports.unref(apiErrors).fee_mode
            }, null, _parent2, _scopeId));
            if (vueExports.unref(showSubscriptionFields) || vueExports.unref(showFixedFee) || vueExports.unref(showPercentFee)) {
              _push2(`<div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5"${_scopeId}>`);
              if (vueExports.unref(showSubscriptionFields)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                  label: "Chu kỳ gói",
                  name: "subscription_cycle"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                        modelValue: vueExports.unref(formState).subscription_cycle,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_cycle = $event,
                        items: [...vueExports.unref(TENANT_SUBSCRIPTION_CYCLE_OPTIONS)],
                        "value-key": "value",
                        "label-key": "label",
                        class: "w-full"
                      }, null, _parent3, _scopeId2));
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                        errors: vueExports.unref(apiErrors).subscription_cycle
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_USelect, {
                          modelValue: vueExports.unref(formState).subscription_cycle,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_cycle = $event,
                          items: [...vueExports.unref(TENANT_SUBSCRIPTION_CYCLE_OPTIONS)],
                          "value-key": "value",
                          "label-key": "label",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: vueExports.unref(apiErrors).subscription_cycle
                        }, null, 8, ["errors"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(showSubscriptionFields)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                  label: "Mức phí gói (đ)",
                  name: "subscription_amount"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                        modelValue: vueExports.unref(formState).subscription_amount,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_amount = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        min: 0,
                        class: "w-full"
                      }, null, _parent3, _scopeId2));
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                        errors: vueExports.unref(apiErrors).subscription_amount
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).subscription_amount,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_amount = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: 0,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: vueExports.unref(apiErrors).subscription_amount
                        }, null, 8, ["errors"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(showFixedFee)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                  label: "Phí cố định mỗi đơn (đ)",
                  name: "fixed_fee_per_order"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                        modelValue: vueExports.unref(formState).fixed_fee_per_order,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).fixed_fee_per_order = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        min: 0,
                        class: "w-full"
                      }, null, _parent3, _scopeId2));
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                        errors: vueExports.unref(apiErrors).fixed_fee_per_order
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).fixed_fee_per_order,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).fixed_fee_per_order = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: 0,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: vueExports.unref(apiErrors).fixed_fee_per_order
                        }, null, 8, ["errors"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(showPercentFee)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                  label: "Phí theo % giá trị đơn",
                  name: "percent_fee_per_order"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                        modelValue: vueExports.unref(formState).percent_fee_per_order,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).percent_fee_per_order = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        min: 0,
                        max: 100,
                        step: 0.1,
                        class: "w-full"
                      }, null, _parent3, _scopeId2));
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                        errors: vueExports.unref(apiErrors).percent_fee_per_order
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(formState).percent_fee_per_order,
                          "onUpdate:modelValue": ($event) => vueExports.unref(formState).percent_fee_per_order = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: 0,
                          max: 100,
                          step: 0.1,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        vueExports.createVNode(_component_SharedCrudFormFieldError, {
                          errors: vueExports.unref(apiErrors).percent_fee_per_order
                        }, null, 8, ["errors"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(formState).fee_mode === vueExports.unref(TenantFeeMode).both) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "info",
                variant: "subtle",
                icon: "i-lucide-calculator",
                class: "mt-4",
                description: `Ví dụ: đơn ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(EXAMPLE_ORDER_AMOUNT)} → phí ${vueExports.unref(bothFeeExample)}.`
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-end mt-5"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-save",
              label: "Lưu cấu hình",
              loading: vueExports.unref(isSaving),
              onClick: handleSave
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode(_component_URadioGroup, {
                modelValue: vueExports.unref(formState).fee_mode,
                "onUpdate:modelValue": ($event) => vueExports.unref(formState).fee_mode = $event,
                variant: "card",
                items: [...vueExports.unref(TENANT_FEE_MODE_OPTIONS)],
                "value-key": "value",
                "label-key": "label",
                "description-key": "description",
                ui: {
                  fieldset: "gap-y-2.5",
                  item: "cursor-pointer border-slate-200 transition-colors hover:border-slate-300 hover:bg-slate-50/60 has-data-[state=checked]:border-slate-900 has-data-[state=checked]:bg-slate-50 has-data-[state=checked]:ring-1 has-data-[state=checked]:ring-slate-900/10",
                  label: "font-semibold text-highlighted",
                  description: "mt-0.5 leading-snug text-muted"
                }
              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
              vueExports.createVNode(_component_SharedCrudFormFieldError, {
                errors: vueExports.unref(apiErrors).fee_mode
              }, null, 8, ["errors"]),
              vueExports.unref(showSubscriptionFields) || vueExports.unref(showFixedFee) || vueExports.unref(showPercentFee) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5"
              }, [
                vueExports.unref(showSubscriptionFields) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 0,
                  label: "Chu kỳ gói",
                  name: "subscription_cycle"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelect, {
                      modelValue: vueExports.unref(formState).subscription_cycle,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_cycle = $event,
                      items: [...vueExports.unref(TENANT_SUBSCRIPTION_CYCLE_OPTIONS)],
                      "value-key": "value",
                      "label-key": "label",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).subscription_cycle
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true),
                vueExports.unref(showSubscriptionFields) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 1,
                  label: "Mức phí gói (đ)",
                  name: "subscription_amount"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).subscription_amount,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).subscription_amount = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 0,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).subscription_amount
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true),
                vueExports.unref(showFixedFee) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 2,
                  label: "Phí cố định mỗi đơn (đ)",
                  name: "fixed_fee_per_order"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).fixed_fee_per_order,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).fixed_fee_per_order = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 0,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).fixed_fee_per_order
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true),
                vueExports.unref(showPercentFee) ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 3,
                  label: "Phí theo % giá trị đơn",
                  name: "percent_fee_per_order"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).percent_fee_per_order,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).percent_fee_per_order = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: 0,
                      max: 100,
                      step: 0.1,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: vueExports.unref(apiErrors).percent_fee_per_order
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true)
              ])) : vueExports.createCommentVNode("", true),
              vueExports.unref(formState).fee_mode === vueExports.unref(TenantFeeMode).both ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 1,
                color: "info",
                variant: "subtle",
                icon: "i-lucide-calculator",
                class: "mt-4",
                description: `Ví dụ: đơn ${("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(EXAMPLE_ORDER_AMOUNT)} → phí ${vueExports.unref(bothFeeExample)}.`
              }, null, 8, ["description"])) : vueExports.createCommentVNode("", true),
              vueExports.createVNode("div", { class: "flex justify-end mt-5" }, [
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-save",
                  label: "Lưu cấu hình",
                  loading: vueExports.unref(isSaving),
                  onClick: handleSave
                }, null, 8, ["loading"])
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantConfigTab.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "TenantConfigTab" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter();
    const id = vueExports.computed(() => String(route.params.id));
    const { data, status, error, refresh } = usePlatformTenantDetail(id);
    const tenant = vueExports.computed(() => data.value?.data ?? null);
    useSeoMeta({
      title: vueExports.computed(() => tenant.value ? `${tenant.value.name} - Công ty vận hành` : "Chi tiết công ty vận hành")
    });
    const notFound = vueExports.computed(() => {
      if (!error.value) return false;
      return getApiErrorStatus(error.value) === 404;
    });
    const tabIds = ["info", "accounts", "services", "config"];
    const tabItems = [
      { value: "info", label: "Thông tin chung", icon: "i-lucide-info" },
      { value: "accounts", label: "Quản lý tài khoản", icon: "i-lucide-users" },
      { value: "services", label: "Quản lý dịch vụ", icon: "i-lucide-layout-grid" },
      { value: "config", label: "Cấu hình", icon: "i-lucide-settings" }
    ];
    const activeTab = vueExports.ref(
      tabIds.includes(route.query.tab) ? route.query.tab : "info"
    );
    vueExports.watch(activeTab, (v) => {
      router.replace({ query: { ...route.query, tab: v === "info" ? void 0 : v } });
    });
    const {
      showActiveConfirm,
      activating,
      isTogglingActive,
      openActiveConfirm,
      confirmToggleActive
    } = useTenantToggleActive(refresh);
    async function handleUpdated() {
      await refresh();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$7;
      const _component_UBadge = _sfc_main$8;
      const _component_TenantBusinessSummaryCard = __nuxt_component_5;
      const _component_UTabs = _sfc_main$9;
      const _component_TenantInfoTab = __nuxt_component_6;
      const _component_TenantAccountsTab = __nuxt_component_7;
      const _component_TenantModulesTab = __nuxt_component_8;
      const _component_TenantConfigTab = __nuxt_component_9;
      const _component_TenantToggleActiveModal = __nuxt_component_10;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(tenant)) {
        _push(`<div class="flex flex-col gap-4"><div class="h-24 bg-slate-100 rounded-xl animate-pulse"></div><div class="h-48 bg-slate-100 rounded-xl animate-pulse"></div></div>`);
      } else if (vueExports.unref(notFound)) {
        _push(`<div class="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-building-2",
          class: "size-12 text-slate-300 mx-auto"
        }, null, _parent));
        _push(`<h2 class="mt-4 text-lg font-semibold text-slate-900"> Không tìm thấy công ty vận hành </h2><p class="mt-1 text-sm text-slate-500"> Công ty không tồn tại hoặc đã bị xoá khỏi hệ thống. </p>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-arrow-left",
          label: "Quay về danh sách",
          class: "mt-5",
          to: "/platform/tenants"
        }, null, _parent));
        _push(`</div>`);
      } else if (vueExports.unref(error) && !vueExports.unref(tenant)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-circle",
          description: "Không tải được thông tin công ty vận hành."
        }, null, _parent));
      } else if (vueExports.unref(tenant)) {
        _push(`<div class="flex flex-col gap-6"><div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-arrow-left",
          label: "Danh sách công ty vận hành",
          color: "neutral",
          variant: "ghost",
          size: "xs",
          to: "/platform/tenants",
          class: "mb-3"
        }, null, _parent));
        _push(`<div class="flex flex-wrap items-start justify-between gap-4"><div class="flex items-start gap-4 min-w-0 flex-1"><div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-building-2",
          class: "size-6 text-primary-600"
        }, null, _parent));
        _push(`</div><div class="min-w-0"><div class="flex items-center gap-3 flex-wrap"><h1 class="text-xl font-bold text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tenant).name)}</h1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          color: vueExports.unref(tenant).is_active ? "success" : "warning",
          variant: "subtle",
          label: vueExports.unref(tenant).is_active ? "Hoạt động" : "Vô hiệu"
        }, null, _parent));
        _push(`</div><p class="mt-1 text-sm text-slate-500 font-mono">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(tenant).id)}</p></div></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: vueExports.unref(tenant).is_active ? "i-lucide-power-off" : "i-lucide-power",
          label: vueExports.unref(tenant).is_active ? "Vô hiệu hoá" : "Kích hoạt lại",
          color: vueExports.unref(tenant).is_active ? "warning" : "primary",
          variant: "solid",
          onClick: ($event) => vueExports.unref(openActiveConfirm)(vueExports.unref(tenant))
        }, null, _parent));
        _push(`</div></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantBusinessSummaryCard, {
          "tenant-id": vueExports.unref(tenant).id
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTabs, {
          modelValue: vueExports.unref(activeTab),
          "onUpdate:modelValue": ($event) => vueExports.isRef(activeTab) ? activeTab.value = $event : null,
          items: tabItems,
          variant: "link",
          content: false,
          class: "w-full"
        }, null, _parent));
        if (vueExports.unref(activeTab) === "info") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantInfoTab, {
            tenant: vueExports.unref(tenant),
            onUpdated: handleUpdated
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(activeTab) === "accounts") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantAccountsTab, {
            "tenant-id": vueExports.unref(tenant).id
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(activeTab) === "services") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantModulesTab, {
            tenant: vueExports.unref(tenant),
            onUpdated: handleUpdated
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(activeTab) === "config") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantConfigTab, {
            tenant: vueExports.unref(tenant),
            onUpdated: handleUpdated
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TenantToggleActiveModal, {
          open: vueExports.unref(showActiveConfirm),
          "onUpdate:open": ($event) => vueExports.isRef(showActiveConfirm) ? showActiveConfirm.value = $event : null,
          "tenant-name": vueExports.unref(tenant).name,
          activating: vueExports.unref(activating),
          loading: vueExports.unref(isTogglingActive),
          onConfirm: vueExports.unref(confirmToggleActive)
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/tenants/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Co7iVLol.mjs.map
