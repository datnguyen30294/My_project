import { _ as _sfc_main$1 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { v as vueExports, p as useRoute$1, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, q as navigateTo } from './server.mjs';
import { _ as __nuxt_component_7 } from './StatusBadge-DeQimcpk.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5 } from './ImageUpload-CCeUx1rz.mjs';
import { _ as __nuxt_component_5$1 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as __nuxt_component_10 } from './ServiceCategoryFormModal-D4Mg27H6.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { l as useServiceCategoryDetail, m as useServiceCategoryImage, n as apiUpdateServiceCategory, o as apiDeleteServiceCategory, p as apiCheckDeleteServiceCategory } from './useCatalogItems-Db1MWi3b.mjs';
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
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './index-QmZAbLx-.mjs';
import './BaseFormModal-CG7aCaIV.mjs';
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
import './constants-G9YmtWtp.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useServiceCategoryDetail(id);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => data.value?.data?.name ?? null));
    const category = vueExports.computed(() => data.value?.data ?? null);
    const crud = useCrudModals();
    const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget } = crud;
    const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    function handleFormSubmit(formData) {
      submitForm(
        null,
        () => apiUpdateServiceCategory(editTarget.value.id, {
          name: formData.name,
          description: formData.description,
          sort_order: formData.sort_order,
          status: formData.status
        }),
        { update: "Cập nhật loại dịch vụ thành công" }
      );
    }
    const { isImageLoading, handleImageUpload, handleImageDelete } = useServiceCategoryImage(
      vueExports.computed(() => category.value?.id),
      () => refresh()
    );
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal: onOpenDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteServiceCategory,
      deleteFn: apiDeleteServiceCategory,
      successMessage: "Đã xoá loại dịch vụ",
      errorFallback: "Không thể xoá loại dịch vụ này",
      navigateAfter: "/pmc/catalog/categories"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USkeleton = _sfc_main$1;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UButton = _sfc_main$c;
      const _component_SharedStatusBadge = __nuxt_component_7;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedImageUpload = __nuxt_component_5;
      const _component_SharedFieldDisplay = __nuxt_component_5$1;
      const _component_CatalogServiceCategoryFormModal = __nuxt_component_10;
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
      } else if (vueExports.unref(category)) {
        _push(`<div><div class="flex items-center justify-between mb-6"><div class="flex items-center gap-3">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-arrow-left",
          color: "neutral",
          variant: "ghost",
          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : vueExports.unref(navigateTo))("/pmc/catalog/categories")
        }, null, _parent));
        _push(`<div><div class="flex items-center gap-2.5"><h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(category).name)}</h1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
          active: vueExports.unref(category).status.value === "active"
        }, null, _parent));
        _push(`</div><p class="mt-1 text-sm text-[var(--ui-text-muted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(category).code)}</p></div></div><div class="flex items-center gap-2">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-pencil",
          label: "Sửa",
          variant: "outline",
          onClick: ($event) => vueExports.unref(openEditModal)(vueExports.unref(category))
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-trash-2",
          label: "Xoá",
          color: "error",
          variant: "outline",
          onClick: ($event) => vueExports.unref(onOpenDeleteModal)(vueExports.unref(category))
        }, null, _parent));
        _push(`</div></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hình ảnh",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedImageUpload, {
                "current-url": vueExports.unref(category).image_url,
                alt: vueExports.unref(category).name,
                loading: vueExports.unref(isImageLoading),
                onUpload: vueExports.unref(handleImageUpload),
                onDelete: vueExports.unref(handleImageDelete)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedImageUpload, {
                  "current-url": vueExports.unref(category).image_url,
                  alt: vueExports.unref(category).name,
                  loading: vueExports.unref(isImageLoading),
                  onUpload: vueExports.unref(handleImageUpload),
                  onDelete: vueExports.unref(handleImageDelete)
                }, null, 8, ["current-url", "alt", "loading", "onUpload", "onDelete"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Thông tin chung",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã loại dịch vụ" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(category).code)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(category).code), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên loại dịch vụ" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(category).name)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(category).name), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Thứ tự sắp xếp" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(category).sort_order)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(category).sort_order), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
                      active: vueExports.unref(category).status.value === "active"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedStatusBadge, {
                        active: vueExports.unref(category).status.value === "active"
                      }, null, 8, ["active"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                label: "Mô tả",
                class: "lg:col-span-4"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(category).description || "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(category).description || "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số dịch vụ liên kết" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(category).items_count ?? 0)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(category).items_count ?? 0), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã loại dịch vụ" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(category).code), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên loại dịch vụ" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(category).name), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Thứ tự sắp xếp" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(category).sort_order), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedStatusBadge, {
                        active: vueExports.unref(category).status.value === "active"
                      }, null, 8, ["active"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, {
                    label: "Mô tả",
                    class: "lg:col-span-4"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(category).description || "—"), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số dịch vụ liên kết" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(category).items_count ?? 0), 1)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CatalogServiceCategoryFormModal, {
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
        title: "Xoá loại dịch vụ",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/catalog/categories/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-C940830S.mjs.map
