import { _ as _sfc_main$1 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { v as vueExports, p as useRoute$1, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, q as navigateTo, _ as __nuxt_component_0$4, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$2 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_5 } from './AvatarUpload-CsEPx2JP.mjs';
import { _ as __nuxt_component_5$1 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as __nuxt_component_7 } from './StatusBadge-DeQimcpk.mjs';
import { _ as __nuxt_component_12 } from './CatalogItemFormModal-D472wqf5.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { f as useCatalogItemDetail, e as useCatalogItemImage, g as apiDeleteCatalogItemGalleryImage, h as apiUploadCatalogItemGallery, i as apiUpdateCatalogItem, j as apiDeleteCatalogItem } from './useCatalogItems-Db1MWi3b.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
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
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './ImageUpload-CCeUx1rz.mjs';
import './Select-CZE7Ef6n.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Input-JXN8po_F.mjs';
import './Separator-DeO-OPIs.mjs';
import './Separator-DtmsHEyk.mjs';
import './NumberInput-BfLKWOCC.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './index-CSThDD3J.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './constants-G9YmtWtp.mjs';
import './useCatalogSuppliers-DJ8n9zOn.mjs';
import './Textarea-DTCNHwKm.mjs';
import './RichTextEditor-CeP76v4Q.mjs';
import '@tiptap/vue-3';
import '@tiptap/starter-kit';
import '@tiptap/extension-underline';
import '@tiptap/extension-text-align';
import '@tiptap/extension-link';
import '@tiptap/extension-image';
import '@tiptap/extension-placeholder';
import '@tiptap/extension-table';
import '@tiptap/extension-table-row';
import '@tiptap/extension-table-header';
import '@tiptap/extension-table-cell';
import './Switch-1cJNH-6C.mjs';
import './Alert-tTsPKADX.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useCatalogItemDetail(id);
    const item = vueExports.computed(() => data.value?.data ?? null);
    const isMaterial = vueExports.computed(() => item.value?.type.value === "material");
    const isService = vueExports.computed(() => item.value?.type.value === "service");
    const crud = useCrudModals();
    const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget, openDeleteModal } = crud;
    const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    function handleFormSubmit(formData) {
      const categoryId = formData.service_category_id != null ? String(formData.service_category_id) : null;
      submitForm(
        null,
        () => apiUpdateCatalogItem(editTarget.value.id, {
          code: formData.code,
          name: formData.name,
          unit: formData.unit,
          unit_price: formData.unit_price,
          purchase_price: formData.purchase_price,
          commission_rate: formData.commission_rate,
          supplier_id: formData.supplier_id,
          service_category_id: categoryId,
          description: formData.description,
          content: formData.content,
          sort_order: formData.sort_order,
          price_note: formData.price_note,
          is_published: formData.is_published,
          is_featured: formData.is_featured
        }),
        { update: "Cập nhật danh mục hàng thành công" }
      );
    }
    const { isImageLoading, handleImageUpload, handleImageDelete } = useCatalogItemImage(
      vueExports.computed(() => item.value?.id),
      () => refresh()
    );
    const galleryInput = vueExports.ref();
    const isGalleryLoading = vueExports.ref(false);
    const toast = useToast();
    async function handleGalleryDelete(imageId) {
      if (!item.value) return;
      isGalleryLoading.value = true;
      try {
        await apiDeleteCatalogItemGalleryImage(item.value.id, imageId);
        toast.add({ title: "Xóa ảnh thành công", color: "success" });
        await refresh();
      } catch {
        toast.add({ title: "Xóa ảnh thất bại", color: "error" });
      } finally {
        isGalleryLoading.value = false;
      }
    }
    async function onGalleryFilesSelected(e) {
      const input = e.target;
      const files = Array.from(input.files ?? []);
      if (!files.length || !item.value) return;
      isGalleryLoading.value = true;
      try {
        await apiUploadCatalogItemGallery(item.value.id, files);
        toast.add({ title: "Tải ảnh thành công", color: "success" });
        await refresh();
      } catch {
        toast.add({ title: "Tải ảnh thất bại", color: "error" });
      } finally {
        isGalleryLoading.value = false;
        input.value = "";
      }
    }
    function handleDelete() {
      submitDelete(
        () => apiDeleteCatalogItem(deleteTarget.value.id),
        { message: "Đã xoá danh mục hàng", navigateAfter: "/pmc/catalog/items" }
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USkeleton = _sfc_main$1;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedAvatarUpload = __nuxt_component_5;
      const _component_SharedFieldDisplay = __nuxt_component_5$1;
      const _component_SharedStatusBadge = __nuxt_component_7;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UIcon = _sfc_main$h;
      const _component_CatalogItemFormModal = __nuxt_component_12;
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
      } else if (vueExports.unref(item)) {
        _push(`<div><div class="flex items-center justify-between mb-6"><div class="flex items-center gap-3">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-arrow-left",
          color: "neutral",
          variant: "ghost",
          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : vueExports.unref(navigateTo))("/pmc/catalog/items")
        }, null, _parent));
        _push(`<div><div class="flex items-center gap-2.5"><h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).name)}</h1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          label: vueExports.unref(item).type.label,
          color: vueExports.unref(isMaterial) ? "info" : "secondary",
          variant: "subtle",
          size: "sm"
        }, null, _parent));
        _push(`</div><p class="mt-1 text-sm text-[var(--ui-text-muted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).code)}</p></div></div><div class="flex items-center gap-2">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-pencil",
          label: "Sửa",
          variant: "outline",
          onClick: ($event) => vueExports.unref(openEditModal)(vueExports.unref(item))
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-trash-2",
          label: "Xoá",
          color: "error",
          variant: "outline",
          onClick: ($event) => vueExports.unref(openDeleteModal)(vueExports.unref(item))
        }, null, _parent));
        _push(`</div></div><div class="space-y-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hình ảnh",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedAvatarUpload, {
                "current-url": vueExports.unref(item).image_url,
                alt: vueExports.unref(item).name,
                loading: vueExports.unref(isImageLoading),
                onUpload: vueExports.unref(handleImageUpload),
                onDelete: vueExports.unref(handleImageDelete)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedAvatarUpload, {
                  "current-url": vueExports.unref(item).image_url,
                  alt: vueExports.unref(item).name,
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
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).code)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).code), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).name)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).name), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Đơn vị" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).unit)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).unit), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedStatusBadge, {
                      active: vueExports.unref(item).status.value === "active"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedStatusBadge, {
                        active: vueExports.unref(item).status.value === "active"
                      }, null, 8, ["active"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Hiển thị cho cư dân" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: vueExports.unref(item).is_published ? "Đã công bố" : "Chưa công bố",
                      color: vueExports.unref(item).is_published ? "success" : "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(item).is_published ? "Đã công bố" : "Chưa công bố",
                        color: vueExports.unref(item).is_published ? "success" : "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(isService)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Dịch vụ nổi bật" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        label: vueExports.unref(item).is_featured ? "Nổi bật" : "Thường",
                        color: vueExports.unref(item).is_featured ? "warning" : "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(item).is_featured ? "Nổi bật" : "Thường",
                          color: vueExports.unref(item).is_featured ? "warning" : "neutral",
                          variant: "subtle",
                          size: "sm"
                        }, null, 8, ["label", "color"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(isService)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Danh mục dịch vụ" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).service_category?.name ?? "—")}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).service_category?.name ?? "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(isService)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Thứ tự sắp xếp" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).sort_order ?? 0)}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).sort_order ?? 0), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(item).slug) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Slug" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-mono text-xs"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).slug)}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-mono text-xs" }, vueExports.toDisplayString(vueExports.unref(item).slug), 1)
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
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Mã" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).code), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Tên" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).name), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Đơn vị" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).unit), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedStatusBadge, {
                        active: vueExports.unref(item).status.value === "active"
                      }, null, 8, ["active"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Hiển thị cho cư dân" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(item).is_published ? "Đã công bố" : "Chưa công bố",
                        color: vueExports.unref(item).is_published ? "success" : "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.unref(isService) ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 0,
                    label: "Dịch vụ nổi bật"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(item).is_featured ? "Nổi bật" : "Thường",
                        color: vueExports.unref(item).is_featured ? "warning" : "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(isService) ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 1,
                    label: "Danh mục dịch vụ"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).service_category?.name ?? "—"), 1)
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(isService) ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 2,
                    label: "Thứ tự sắp xếp"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).sort_order ?? 0), 1)
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(item).slug ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 3,
                    label: "Slug"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-mono text-xs" }, vueExports.toDisplayString(vueExports.unref(item).slug), 1)
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Giá & Hoa Hồng",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, {
                label: vueExports.unref(isMaterial) ? "Giá bán" : "Đơn giá"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-semibold text-base text-[var(--ui-text-highlighted)]"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(Number(vueExports.unref(item).unit_price).toLocaleString("vi-VN"))} đ </span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-semibold text-base text-[var(--ui-text-highlighted)]" }, vueExports.toDisplayString(Number(vueExports.unref(item).unit_price).toLocaleString("vi-VN")) + " đ ", 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(item).price_note) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ghi chú giá" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="text-sm italic text-[var(--ui-text-muted)]"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).price_note)}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "text-sm italic text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(vueExports.unref(item).price_note), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(isMaterial)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Giá mua" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-semibold text-base text-[var(--ui-text-highlighted)]"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).purchase_price ? `${Number(vueExports.unref(item).purchase_price).toLocaleString("vi-VN")} đ` : "—")}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-semibold text-base text-[var(--ui-text-highlighted)]" }, vueExports.toDisplayString(vueExports.unref(item).purchase_price ? `${Number(vueExports.unref(item).purchase_price).toLocaleString("vi-VN")} đ` : "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(isMaterial)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Hoa Hồng (%)" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).commission_rate ? `${vueExports.unref(item).commission_rate}%` : "—")}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).commission_rate ? `${vueExports.unref(item).commission_rate}%` : "—"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(isMaterial)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Nhà cung cấp" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (vueExports.unref(item).supplier) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                          to: `/pmc/catalog/suppliers/${vueExports.unref(item).supplier.id}`,
                          class: "font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        }, {
                          default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).supplier.name)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(item).supplier.name), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent3, _scopeId2));
                      } else {
                        _push3(`<span class="font-medium"${_scopeId2}>—</span>`);
                      }
                    } else {
                      return [
                        vueExports.unref(item).supplier ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/catalog/suppliers/${vueExports.unref(item).supplier.id}`,
                          class: "font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(item).supplier.name), 1)
                          ]),
                          _: 1
                        }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 1,
                          class: "font-medium"
                        }, "—"))
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
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, {
                    label: vueExports.unref(isMaterial) ? "Giá bán" : "Đơn giá"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-semibold text-base text-[var(--ui-text-highlighted)]" }, vueExports.toDisplayString(Number(vueExports.unref(item).unit_price).toLocaleString("vi-VN")) + " đ ", 1)
                    ]),
                    _: 2
                  }, 1032, ["label"]),
                  vueExports.unref(item).price_note ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 0,
                    label: "Ghi chú giá"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "text-sm italic text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(vueExports.unref(item).price_note), 1)
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(isMaterial) ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 1,
                    label: "Giá mua"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-semibold text-base text-[var(--ui-text-highlighted)]" }, vueExports.toDisplayString(vueExports.unref(item).purchase_price ? `${Number(vueExports.unref(item).purchase_price).toLocaleString("vi-VN")} đ` : "—"), 1)
                    ]),
                    _: 2
                  }, 1024)) : vueExports.createCommentVNode("", true),
                  vueExports.unref(isMaterial) ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 2,
                    label: "Hoa Hồng (%)"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(item).commission_rate ? `${vueExports.unref(item).commission_rate}%` : "—"), 1)
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(isMaterial) ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedFieldDisplay, {
                    key: 3,
                    label: "Nhà cung cấp"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(item).supplier ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/catalog/suppliers/${vueExports.unref(item).supplier.id}`,
                        class: "font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(item).supplier.name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "font-medium"
                      }, "—"))
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Mô tả ngắn",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="text-sm text-slate-700 leading-relaxed"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(item).description || "Chưa có mô tả.")}</p>`);
            } else {
              return [
                vueExports.createVNode("p", { class: "text-sm text-slate-700 leading-relaxed" }, vueExports.toDisplayString(vueExports.unref(item).description || "Chưa có mô tả."), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(isService) && vueExports.unref(item).content) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Nội dung chi tiết",
            compact: ""
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="prose prose-sm max-w-none"${_scopeId}>${vueExports.unref(item).content ?? ""}</div>`);
              } else {
                return [
                  vueExports.createVNode("div", {
                    class: "prose prose-sm max-w-none",
                    innerHTML: vueExports.unref(item).content
                  }, null, 8, ["innerHTML"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(item).images && vueExports.unref(item).images.length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Thư viện ảnh",
            compact: ""
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(item).images, (img) => {
                  _push2(`<div class="relative group rounded-lg overflow-hidden border border-[var(--ui-border)]"${_scopeId}><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", img.image_url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", `Gallery ${img.sort_order}`)} class="w-full h-32 object-cover"${_scopeId}><button type="button" class="absolute top-1 right-1 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Xóa ảnh"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-x",
                    class: "size-3.5"
                  }, null, _parent2, _scopeId));
                  _push2(`</button></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(item).images, (img) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: img.id,
                        class: "relative group rounded-lg overflow-hidden border border-[var(--ui-border)]"
                      }, [
                        vueExports.createVNode("img", {
                          src: img.image_url,
                          alt: `Gallery ${img.sort_order}`,
                          class: "w-full h-32 object-cover"
                        }, null, 8, ["src", "alt"]),
                        vueExports.createVNode("button", {
                          type: "button",
                          class: "absolute top-1 right-1 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity",
                          title: "Xóa ảnh",
                          onClick: ($event) => handleGalleryDelete(img.id)
                        }, [
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-x",
                            class: "size-3.5"
                          })
                        ], 8, ["onClick"])
                      ]);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tải thêm ảnh",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div${_scopeId}><input type="file" accept="image/*" multiple class="hidden"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-image-plus",
                label: "Chọn ảnh",
                variant: "outline",
                loading: vueExports.unref(isGalleryLoading),
                onClick: ($event) => vueExports.unref(galleryInput)?.click()
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("input", {
                    ref_key: "galleryInput",
                    ref: galleryInput,
                    type: "file",
                    accept: "image/*",
                    multiple: "",
                    class: "hidden",
                    onChange: onGalleryFilesSelected
                  }, null, 544),
                  vueExports.createVNode(_component_UButton, {
                    icon: "i-lucide-image-plus",
                    label: "Chọn ảnh",
                    variant: "outline",
                    loading: vueExports.unref(isGalleryLoading),
                    onClick: ($event) => vueExports.unref(galleryInput)?.click()
                  }, null, 8, ["loading", "onClick"])
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CatalogItemFormModal, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        item: vueExports.unref(editTarget),
        loading: vueExports.unref(isUpdating),
        "api-errors": vueExports.unref(formApiErrors),
        onSubmit: handleFormSubmit,
        onImageChanged: ($event) => vueExports.unref(refresh)()
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá danh mục hàng",
        "item-name": vueExports.unref(deleteTarget)?.name,
        loading: vueExports.unref(isDeleting),
        onConfirm: handleDelete
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/catalog/items/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-ZtXEJU_0.mjs.map
