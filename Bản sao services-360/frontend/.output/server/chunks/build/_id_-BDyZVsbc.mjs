import { _ as _sfc_main$1 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { v as vueExports, p as useRoute$1, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, q as navigateTo, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as __nuxt_component_9 } from './JobTitleFormModal-BI-xKGZV.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { b as useJobTitleDetail, c as apiUpdateJobTitle, d as apiDeleteJobTitle, e as apiCheckDeleteJobTitle } from './useJobTitles-DzuQHrcS.mjs';
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
import './ProjectSelect-BTBiFCd5.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './constants-G9YmtWtp.mjs';
import './useProjects-D4K3VYdb.mjs';
import './Textarea-DTCNHwKm.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useJobTitleDetail(id);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => data.value?.data?.name ?? null));
    const jobTitle = vueExports.computed(() => data.value?.data ?? null);
    const crud = useCrudModals();
    const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget } = crud;
    const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    function handleFormSubmit(formData) {
      submitForm(
        null,
        () => apiUpdateJobTitle(editTarget.value.id, { project_id: formData.project_id, name: formData.name, description: formData.description }),
        { update: "Cập nhật chức danh thành công" }
      );
    }
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal: onOpenDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteJobTitle,
      deleteFn: apiDeleteJobTitle,
      successMessage: "Đã xoá chức danh",
      errorFallback: "Không thể xoá chức danh này",
      navigateAfter: "/pmc/job-titles"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USkeleton = _sfc_main$1;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UButton = _sfc_main$c;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_JobTitleFormModal = __nuxt_component_9;
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
      } else if (vueExports.unref(jobTitle)) {
        _push(`<div><div class="flex items-center justify-between mb-6"><div class="flex items-center gap-3">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-arrow-left",
          color: "neutral",
          variant: "ghost",
          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : vueExports.unref(navigateTo))("/pmc/job-titles")
        }, null, _parent));
        _push(`<div><h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(jobTitle).name)}</h1><p class="mt-1 text-sm text-[var(--ui-text-muted)]"> Mã: ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(jobTitle).code)}</p></div></div><div class="flex items-center gap-2">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-pencil",
          label: "Sửa",
          variant: "outline",
          onClick: ($event) => vueExports.unref(openEditModal)(vueExports.unref(jobTitle))
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-trash-2",
          label: "Xoá",
          color: "error",
          variant: "outline",
          onClick: ($event) => vueExports.unref(onOpenDeleteModal)(vueExports.unref(jobTitle))
        }, null, _parent));
        _push(`</div></div><div class="max-w-xl rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6 space-y-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã chức danh" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(jobTitle).code)}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(jobTitle).code), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tên chức danh" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(jobTitle).name)}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(jobTitle).name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Thuộc dự án" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (vueExports.unref(jobTitle).project) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: `/pmc/projects/${vueExports.unref(jobTitle).project.id}`,
                  class: "font-medium text-blue-600 hover:text-blue-800 hover:underline"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(jobTitle).project.name)}`);
                    } else {
                      return [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(jobTitle).project.name), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<span class="font-medium"${_scopeId}>Trụ sở chính</span>`);
              }
            } else {
              return [
                vueExports.unref(jobTitle).project ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                  key: 0,
                  to: `/pmc/projects/${vueExports.unref(jobTitle).project.id}`,
                  class: "font-medium text-blue-600 hover:text-blue-800 hover:underline"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(jobTitle).project.name), 1)
                  ]),
                  _: 1
                }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                  key: 1,
                  class: "font-medium"
                }, "Trụ sở chính"))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mô tả" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(jobTitle).description ?? "—")}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(jobTitle).description ?? "—"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_JobTitleFormModal, {
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
        title: "Xoá chức danh",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/job-titles/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BDyZVsbc.mjs.map
