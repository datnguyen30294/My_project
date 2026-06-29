import { v as vueExports, u as useSeoMeta, i as useRouter, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, y as _sfc_main$f } from './server.mjs';
import { _ as _sfc_main$2 } from './Tabs-Djlffbcc.mjs';
import { _ as __nuxt_component_2 } from './VendorForm-wq_RZVmI.mjs';
import { _ as _sfc_main$3 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$4 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$5 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$6 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as _sfc_main$7 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$8 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$9 } from './SelectMenu-DKHEMZj7.mjs';
import { D as DEFAULT_PER_PAGE, S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { c as apiCreateTenantPartner, d as useTenantPartnerCatalog, e as apiAttachTenantPartner } from './usePartners-DhKs6EM6.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { d as useProjectList } from './useProjects-D4K3VYdb.mjs';
import { a as getApiValidationErrors, g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './useDirection-CXYby7CP.mjs';
import './FocusScope-BZehoQSg.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './SectionCard-CH-mG9Mf.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Select-CZE7Ef6n.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './Textarea-DTCNHwKm.mjs';
import './index-QmZAbLx-.mjs';
import './index-CSThDD3J.mjs';
import './Pagination-fZq_Msxb.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Label-BBgw4vHh.mjs';
import './useKbd-JjFOu4f7.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "VendorCatalogPicker",
  __ssrInlineRender: true,
  emits: ["attached"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const toast = useToast();
    const params = vueExports.reactive({
      search: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const { data, status, error, refresh } = useTenantPartnerCatalog(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const vendors = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { id: "logo", header: "" },
      { id: "name", header: "Vendor" },
      { id: "categories", header: "Danh mục" },
      { id: "owner", header: "Nguồn" },
      { id: "linked", header: "Đã dùng" },
      stickyRight({ id: "actions", header: "" }, { width: "w-[140px] min-w-[140px]" })
    ];
    function firstChar(name) {
      const trimmed = (name ?? "").trim();
      return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
    }
    const { data: projectsData, status: projectsStatus } = useProjectList(
      vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
    );
    const projectOptions = vueExports.computed(
      () => (projectsData.value?.data ?? []).map((p) => ({ label: p.name, value: p.id }))
    );
    const attachOpen = vueExports.ref(false);
    const selectedVendor = vueExports.ref(null);
    const selectedProjectIds = vueExports.ref([]);
    const isAttaching = vueExports.ref(false);
    function openAttach(vendor) {
      selectedVendor.value = vendor;
      selectedProjectIds.value = [];
      attachOpen.value = true;
    }
    async function confirmAttach() {
      if (!selectedVendor.value || selectedProjectIds.value.length === 0) return;
      isAttaching.value = true;
      try {
        await apiAttachTenantPartner(selectedVendor.value.id, [...selectedProjectIds.value]);
        toast.add({
          title: "Đã thêm vendor vào dự án",
          description: `${selectedVendor.value.display_name ?? selectedVendor.value.name} giờ có thể phục vụ các dự án đã chọn.`,
          color: "success",
          icon: "i-lucide-check-circle"
        });
        const attachedId = selectedVendor.value.id;
        attachOpen.value = false;
        selectedVendor.value = null;
        await refresh();
        emit("attached", attachedId);
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Thêm vendor vào dự án thất bại"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isAttaching.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$3;
      const _component_UAlert = _sfc_main$4;
      const _component_UTable = _sfc_main$5;
      const _component_UAvatar = _sfc_main$f;
      const _component_UBadge = _sfc_main$6;
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_UModal = _sfc_main$7;
      const _component_UFormField = _sfc_main$8;
      const _component_USelectMenu = _sfc_main$9;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-4" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm vendor theo tên, slug, email...",
        class: "max-w-sm"
      }, null, _parent));
      if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không thể tải danh mục vendor. Vui lòng thử lại."
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
        data: vueExports.unref(vendors),
        columns,
        loading: vueExports.unref(status) === "pending",
        empty: "Chưa có vendor active nào trên hệ thống."
      }, {
        "logo-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAvatar, {
              src: row.original.logo_url ?? void 0,
              alt: row.original.name,
              text: firstChar(row.original.display_name ?? row.original.name),
              size: "sm"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UAvatar, {
                src: row.original.logo_url ?? void 0,
                alt: row.original.name,
                text: firstChar(row.original.display_name ?? row.original.name),
                size: "sm"
              }, null, 8, ["src", "alt", "text"])
            ];
          }
        }),
        "name-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col"${_scopeId}><span class="font-medium text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.display_name ?? row.original.name)}</span><span class="font-mono text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.slug)}</span></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col" }, [
                vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.display_name ?? row.original.name), 1),
                vueExports.createVNode("span", { class: "font-mono text-xs text-slate-500" }, vueExports.toDisplayString(row.original.slug), 1)
              ])
            ];
          }
        }),
        "categories-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(row.original.categories.slice(0, 3), (cat) => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                key: cat,
                variant: "subtle",
                color: "info",
                label: cat,
                size: "xs"
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            if (!row.original.categories?.length) {
              _push2(`<span class="text-xs text-gray-400"${_scopeId}>—</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-wrap gap-1" }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(row.original.categories.slice(0, 3), (cat) => {
                  return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                    key: cat,
                    variant: "subtle",
                    color: "info",
                    label: cat,
                    size: "xs"
                  }, null, 8, ["label"]);
                }), 128)),
                !row.original.categories?.length ? (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 0,
                  class: "text-xs text-gray-400"
                }, "—")) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "owner-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: row.original.owner_source.value === "platform" ? "primary" : "neutral",
              variant: "subtle",
              label: row.original.owner_source.value === "platform" ? "Platform" : "PMC khác",
              size: "xs"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: row.original.owner_source.value === "platform" ? "primary" : "neutral",
                variant: "subtle",
                label: row.original.owner_source.value === "platform" ? "Platform" : "PMC khác",
                size: "xs"
              }, null, 8, ["color", "label"])
            ];
          }
        }),
        "linked-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.is_linked) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                color: "success",
                variant: "subtle",
                label: "Đã dùng",
                icon: "i-lucide-check",
                size: "xs"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<span class="text-xs text-slate-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.is_linked ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                key: 0,
                color: "success",
                variant: "subtle",
                label: "Đã dùng",
                icon: "i-lucide-check",
                size: "xs"
              })) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-xs text-slate-400"
              }, "—"))
            ];
          }
        }),
        "actions-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: row.original.is_linked ? "Thêm dự án" : "Thêm",
              color: "primary",
              variant: "soft",
              size: "xs",
              onClick: ($event) => openAttach(row.original)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: row.original.is_linked ? "Thêm dự án" : "Thêm",
                color: "primary",
                variant: "soft",
                size: "xs",
                onClick: ($event) => openAttach(row.original)
              }, null, 8, ["label", "onClick"])
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(attachOpen),
        "onUpdate:open": ($event) => vueExports.isRef(attachOpen) ? attachOpen.value = $event : null,
        title: `Thêm '${vueExports.unref(selectedVendor)?.display_name ?? vueExports.unref(selectedVendor)?.name}' vào dự án`
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}><p class="text-sm text-slate-500"${_scopeId}> Chọn các dự án mà vendor này được phép phục vụ. Vendor không bị thay đổi — bạn chỉ liên kết nó với dự án của mình. </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Dự án",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(selectedProjectIds),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectIds) ? selectedProjectIds.value = $event : null,
                    items: vueExports.unref(projectOptions),
                    "value-key": "value",
                    multiple: "",
                    searchable: "",
                    loading: vueExports.unref(projectsStatus) === "pending",
                    placeholder: "Chọn dự án...",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(selectedProjectIds),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectIds) ? selectedProjectIds.value = $event : null,
                      items: vueExports.unref(projectOptions),
                      "value-key": "value",
                      multiple: "",
                      searchable: "",
                      loading: vueExports.unref(projectsStatus) === "pending",
                      placeholder: "Chọn dự án...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                vueExports.createVNode("p", { class: "text-sm text-slate-500" }, " Chọn các dự án mà vendor này được phép phục vụ. Vendor không bị thay đổi — bạn chỉ liên kết nó với dự án của mình. "),
                vueExports.createVNode(_component_UFormField, {
                  label: "Dự án",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(selectedProjectIds),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectIds) ? selectedProjectIds.value = $event : null,
                      items: vueExports.unref(projectOptions),
                      "value-key": "value",
                      multiple: "",
                      searchable: "",
                      loading: vueExports.unref(projectsStatus) === "pending",
                      placeholder: "Chọn dự án...",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "loading"])
                  ]),
                  _: 1
                })
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
              disabled: vueExports.unref(isAttaching),
              onClick: ($event) => attachOpen.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Thêm vào dự án",
              icon: "i-lucide-check",
              color: "primary",
              loading: vueExports.unref(isAttaching),
              disabled: vueExports.unref(selectedProjectIds).length === 0,
              onClick: confirmAttach
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "ghost",
                  disabled: vueExports.unref(isAttaching),
                  onClick: ($event) => attachOpen.value = false
                }, null, 8, ["disabled", "onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Thêm vào dự án",
                  icon: "i-lucide-check",
                  color: "primary",
                  loading: vueExports.unref(isAttaching),
                  disabled: vueExports.unref(selectedProjectIds).length === 0,
                  onClick: confirmAttach
                }, null, 8, ["loading", "disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vendor/VendorCatalogPicker.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "VendorCatalogPicker" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "tao-moi",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Đăng ký vendor - Thần Nông" });
    const router = useRouter();
    const toast = useToast();
    const mode = vueExports.ref("create");
    const modeItems = [
      { value: "create", label: "Tạo vendor mới", icon: "i-lucide-plus" },
      { value: "catalog", label: "Thêm vendor có sẵn", icon: "i-lucide-library" }
    ];
    function onAttached(vendorId) {
      router.push(`/pmc/vendors/${vendorId}`);
    }
    const isSubmitting = vueExports.ref(false);
    const apiErrors = vueExports.ref({});
    async function handleSubmit(payload) {
      isSubmitting.value = true;
      apiErrors.value = {};
      try {
        const res = await apiCreateTenantPartner(payload);
        const provisioned = res.data.is_provisioned;
        toast.add({
          title: "Đăng ký vendor thành công",
          description: provisioned ? "Shop đã sẵn sàng trên resi_mart." : "Hệ thống đang kích hoạt shop, có thể mất vài phút. Trạng thái sẽ tự cập nhật khi hoàn tất.",
          color: "success",
          icon: "i-lucide-check-circle"
        });
        router.push("/pmc/vendors");
      } catch (err) {
        const validation = getApiValidationErrors(err);
        if (validation) {
          apiErrors.value = validation;
        }
        toast.add({
          title: getApiErrorMessage(err, "Đăng ký vendor thất bại"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UTabs = _sfc_main$2;
      const _component_VendorForm = __nuxt_component_2;
      const _component_VendorCatalogPicker = __nuxt_component_3;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-center gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/vendors",
        class: "shrink-0"
      }, null, _parent));
      _push(`<div><h1 class="text-xl font-bold text-slate-900"> Thêm vendor </h1><p class="text-sm text-slate-500 mt-0.5"> Tạo vendor mới để bán trên marketplace, hoặc thêm vendor đã có sẵn trên hệ thống vào dự án của bạn. </p></div></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTabs, {
        modelValue: vueExports.unref(mode),
        "onUpdate:modelValue": ($event) => vueExports.isRef(mode) ? mode.value = $event : null,
        items: modeItems,
        variant: "link",
        content: false,
        class: "mb-6"
      }, null, _parent));
      if (vueExports.unref(mode) === "create") {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorForm, {
          mode: "create",
          loading: vueExports.unref(isSubmitting),
          "api-errors": vueExports.unref(apiErrors),
          "cancel-to": "/pmc/vendors",
          "submit-label": "Đăng ký vendor",
          onSubmit: handleSubmit
        }, null, _parent));
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorCatalogPicker, { onAttached }, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/vendors/tao-moi.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tao-moi-Cwcgpr0k.mjs.map
