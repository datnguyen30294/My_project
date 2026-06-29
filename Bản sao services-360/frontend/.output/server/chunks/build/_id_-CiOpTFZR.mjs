import { _ as _sfc_main$1 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { v as vueExports, p as useRoute$1, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, q as navigateTo } from './server.mjs';
import { _ as __nuxt_component_7 } from './StatusBadge-DeQimcpk.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as __nuxt_component_9 } from './CatalogSupplierFormModal-BR6lCPos.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { b as useCatalogSupplierDetail, c as apiUpdateCatalogSupplier, d as apiDeleteCatalogSupplier, e as apiCheckDeleteCatalogSupplier } from './useCatalogSuppliers-DJ8n9zOn.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { u as useCheckDelete } from './useCheckDelete-ka2wDn0T.mjs';
import './apiError-DBrxF9au.mjs';
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
import './BaseFormModal-CG7aCaIV.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './index-QmZAbLx-.mjs';
import './Alert-tTsPKADX.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './Input-JXN8po_F.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Textarea-DTCNHwKm.mjs';
import './Select-CZE7Ef6n.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useCatalogSupplierDetail(id);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => data.value?.data?.name ?? null));
    const supplier = vueExports.computed(() => data.value?.data ?? null);
    const crud = useCrudModals();
    const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget } = crud;
    const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    function handleFormSubmit(formData) {
      submitForm(
        null,
        () => apiUpdateCatalogSupplier(editTarget.value.id, {
          name: formData.name,
          contact: formData.contact,
          phone: formData.phone,
          address: formData.address,
          email: formData.email,
          commission_rate: formData.commission_rate,
          status: formData.status
        }),
        { update: "Cập nhật nhà cung cấp thành công" }
      );
    }
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal: onOpenDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteCatalogSupplier,
      deleteFn: apiDeleteCatalogSupplier,
      successMessage: "Đã xoá nhà cung cấp",
      errorFallback: "Không thể xoá nhà cung cấp này",
      navigateAfter: "/pmc/catalog/suppliers"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USkeleton = _sfc_main$1;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UButton = _sfc_main$c;
      const _component_SharedStatusBadge = __nuxt_component_7;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_CatalogSupplierFormModal = __nuxt_component_9;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="space-y-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-48" }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-64 w-full" }, null, _parent));
        _push(`</div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(supplier)) {
        _push(`<div><div class="flex items-center justify-between mb-6"><div class="flex items-center gap-3">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-arrow-left",
          color: "neutral",
          variant: "ghost",
          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : vueExports.unref(navigateTo))("/pmc/catalog/suppliers")
        }, null, _parent));
        _push(`<div><div class="flex items-center gap-2.5"><h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(supplier).name)}</h1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
          active: vueExports.unref(supplier).status.value === "active"
        }, null, _parent));
        _push(`</div><p class="mt-1 text-sm text-[var(--ui-text-muted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(supplier).code)}</p></div></div><div class="flex items-center gap-2">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-pencil",
          label: "Sửa",
          variant: "outline",
          onClick: ($event) => vueExports.unref(openEditModal)(vueExports.unref(supplier))
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-trash-2",
          label: "Xoá",
          color: "error",
          variant: "outline",
          onClick: ($event) => vueExports.unref(onOpenDeleteModal)(vueExports.unref(supplier))
        }, null, _parent));
        _push(`</div></div><div class="space-y-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Thông tin chung",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã NCC" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(supplier).code)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).code), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên nhà cung cấp" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(supplier).name)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).name), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
                      active: vueExports.unref(supplier).status.value === "active"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedStatusBadge, {
                        active: vueExports.unref(supplier).status.value === "active"
                      }, null, 8, ["active"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Hoa hồng (%)" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(supplier).commission_rate ? `${vueExports.unref(supplier).commission_rate}%` : "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).commission_rate ? `${vueExports.unref(supplier).commission_rate}%` : "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã NCC" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).code), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên nhà cung cấp" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).name), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedStatusBadge, {
                        active: vueExports.unref(supplier).status.value === "active"
                      }, null, 8, ["active"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Hoa hồng (%)" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).commission_rate ? `${vueExports.unref(supplier).commission_rate}%` : "—"), 1)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Liên hệ",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người liên hệ" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(supplier).contact || "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).contact || "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(supplier).phone || "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).phone || "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Email" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(supplier).email || "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).email || "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Địa chỉ" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(supplier).address || "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).address || "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Người liên hệ" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).contact || "—"), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).phone || "—"), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Email" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).email || "—"), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Địa chỉ" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(supplier).address || "—"), 1)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CatalogSupplierFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isUpdating),
        "api-errors": vueExports.unref(formApiErrors),
        onSubmit: handleFormSubmit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá nhà cung cấp",
        "item-name": vueExports.unref(deleteTarget)?.name,
        "blocked-message": vueExports.unref(deleteBlockedMessage),
        loading: vueExports.unref(isDeleting),
        checking: vueExports.unref(isCheckingDelete),
        onConfirm: vueExports.unref(handleDelete)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/catalog/suppliers/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CiOpTFZR.mjs.map
