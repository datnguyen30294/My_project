import { x as _export_sfc, v as vueExports, u as useSeoMeta, p as useRoute$1, j as useToast, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4, l as _sfc_main$c, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$3 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$4 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$5 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_7 } from './RichTextEditor-CeP76v4Q.mjs';
import { g as getApiErrorMessage, a as getApiValidationErrors } from './apiError-DBrxF9au.mjs';
import { u as usePublicOgTicketSurvey, S as SURVEY_MAX_FILES, a as SURVEY_ALLOWED_MIMES, b as apiDeletePublicOgTicketSurveyAttachment, c as apiUpsertPublicOgTicketSurvey } from './useOgTicketSurvey-DrNJ8Z2q.mjs';
import { i as isImageMime, f as formatFileSize, A as ATTACHMENT_MAX_FILES, a as ATTACHMENT_ALLOWED_TYPES, b as ATTACHMENT_MAX_FILE_SIZE } from './file-DEnEYJZ3.mjs';
import { _ as _sfc_main$6 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$7 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$8 } from './Input-JXN8po_F.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { u as usePublicTicketInfo, a as apiSubmitQuoteDecision, b as apiSubmitWarrantyRequest } from './useTickets-ChvwqcYd.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { a as apiConfirmPublicAcceptanceReport } from './useAcceptanceReports-lSZWdtC6.mjs';
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
import './index-QmZAbLx-.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';

const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PublicSurveySection",
  __ssrInlineRender: true,
  props: {
    ticketCode: {}
  },
  setup(__props) {
    const props = __props;
    const toast = useToast();
    const { data, status, error, refresh } = usePublicOgTicketSurvey(() => props.ticketCode);
    const survey = vueExports.computed(() => data.value?.data ?? null);
    const noteInput = vueExports.ref(null);
    const pendingFiles = vueExports.ref([]);
    const pendingPreviews = vueExports.ref(/* @__PURE__ */ new Map());
    const fileInputRef = vueExports.ref(null);
    const isSaving = vueExports.ref(false);
    const deletingAttachmentId = vueExports.ref(null);
    const isExpanded = vueExports.ref(false);
    function previewUrl(file) {
      return pendingPreviews.value.get(file) ?? null;
    }
    function untrackPreview(file) {
      const url = pendingPreviews.value.get(file);
      if (url) {
        URL.revokeObjectURL(url);
        pendingPreviews.value.delete(file);
      }
    }
    function clearAllPreviews() {
      for (const url of pendingPreviews.value.values()) {
        URL.revokeObjectURL(url);
      }
      pendingPreviews.value.clear();
    }
    vueExports.watch(
      survey,
      (val) => {
        noteInput.value = val?.note ?? null;
      },
      { immediate: true }
    );
    const isDirty = vueExports.computed(() => {
      if ((noteInput.value ?? "") !== (survey.value?.note ?? "")) return true;
      if (pendingFiles.value.length > 0) return true;
      return false;
    });
    const totalFiles = vueExports.computed(
      () => (survey.value?.attachments.length ?? 0) + pendingFiles.value.length
    );
    const hasContent = vueExports.computed(
      () => (survey.value?.note ?? "").length > 0 || (survey.value?.attachments.length ?? 0) > 0
    );
    function isVideoMime(mime) {
      return mime.startsWith("video/");
    }
    function fileIcon(mime) {
      if (isImageMime(mime)) return "i-lucide-image";
      if (isVideoMime(mime)) return "i-lucide-video";
      if (mime === "application/pdf") return "i-lucide-file-text";
      return "i-lucide-file";
    }
    function onPickFiles() {
      fileInputRef.value?.click();
    }
    function removePendingFile(index) {
      const file = pendingFiles.value[index];
      if (file) untrackPreview(file);
      pendingFiles.value = pendingFiles.value.filter((_, i) => i !== index);
    }
    async function onSave() {
      if (!isDirty.value) return;
      isSaving.value = true;
      try {
        await apiUpsertPublicOgTicketSurvey(props.ticketCode, {
          note: noteInput.value,
          attachments: pendingFiles.value
        });
        clearAllPreviews();
        pendingFiles.value = [];
        await refresh();
        toast.add({ title: "Đã lưu khảo sát. Cảm ơn bạn!", color: "success" });
        isExpanded.value = false;
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Không thể lưu khảo sát"),
          color: "error"
        });
      } finally {
        isSaving.value = false;
      }
    }
    async function onDeleteAttachment(attachmentId) {
      if (!confirm("Xoá tệp này?")) return;
      deletingAttachmentId.value = attachmentId;
      try {
        await apiDeletePublicOgTicketSurveyAttachment(props.ticketCode, attachmentId);
        await refresh();
        toast.add({ title: "Đã xoá tệp", color: "success" });
      } catch (err) {
        toast.add({
          title: getApiErrorMessage(err, "Không thể xoá tệp"),
          color: "error"
        });
      } finally {
        deletingAttachmentId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = _sfc_main$4;
      const _component_UAlert = _sfc_main$5;
      const _component_SharedRichTextEditor = __nuxt_component_7;
      const _component_UButton = _sfc_main$c;
      const _component_UIcon = _sfc_main$h;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" }, _attrs))}><button type="button" class="w-full px-5 py-3.5 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-emerald-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px", "font-variation-settings": "'FILL' 1" })}">search</span><h2 class="text-sm font-bold text-slate-800"> Khảo sát hiện trạng </h2>`);
      if (vueExports.unref(hasContent)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          color: "success",
          variant: "subtle",
          size: "xs"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Đã điền `);
            } else {
              return [
                vueExports.createTextVNode(" Đã điền ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center gap-2">`);
      if ((vueExports.unref(survey)?.attachments.length ?? 0) > 0) {
        _push(`<span class="text-xs text-slate-400">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(survey)?.attachments.length)} tệp </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "rotate-180": vueExports.unref(isExpanded) }, "material-symbols-outlined text-slate-400 transition-transform"])}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}">expand_more</span></div></button>`);
      if (vueExports.unref(isExpanded)) {
        _push(`<div class="px-5 py-4">`);
        if (vueExports.unref(status) === "pending") {
          _push(`<div class="text-sm text-slate-500 py-4 text-center"> Đang tải... </div>`);
        } else if (vueExports.unref(error)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: "error",
            variant: "subtle",
            title: "Không tải được khảo sát",
            description: ("getApiErrorMessage" in _ctx ? _ctx.getApiErrorMessage : vueExports.unref(getApiErrorMessage))(vueExports.unref(error))
          }, null, _parent));
        } else {
          _push(`<div class="flex flex-col gap-4"><div class="flex flex-col gap-2"><label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider"> Mô tả hiện trạng </label>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedRichTextEditor, {
            modelValue: vueExports.unref(noteInput),
            "onUpdate:modelValue": ($event) => vueExports.isRef(noteInput) ? noteInput.value = $event : null,
            placeholder: "Ví dụ: Tường nứt ở vị trí X, vòi nước rỉ, máy lạnh không lạnh...",
            "min-height": "160px"
          }, null, _parent));
          _push(`</div><div class="flex flex-col gap-2"><div class="flex items-center justify-between"><label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider"> Ảnh / Video / Tệp (${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(totalFiles))} / ${serverRenderer_cjs_prodExports.ssrInterpolate("SURVEY_MAX_FILES" in _ctx ? _ctx.SURVEY_MAX_FILES : vueExports.unref(SURVEY_MAX_FILES))}) </label>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-upload",
            label: "Chọn tệp",
            size: "xs",
            variant: "soft",
            color: "primary",
            onClick: onPickFiles
          }, null, _parent));
          _push(`<input type="file" multiple class="hidden"${serverRenderer_cjs_prodExports.ssrRenderAttr("accept", ("SURVEY_ALLOWED_MIMES" in _ctx ? _ctx.SURVEY_ALLOWED_MIMES : vueExports.unref(SURVEY_ALLOWED_MIMES)).join(","))}></div><div class="text-xs text-slate-400"> Tối đa 100MB mỗi tệp. Hỗ trợ ảnh, video, PDF. </div>`);
          if (vueExports.unref(totalFiles) === 0) {
            _push(`<div class="text-sm text-slate-400 py-6 text-center border border-dashed border-slate-200 rounded-lg"> Chưa có tệp nào </div>`);
          } else {
            _push(`<div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5"><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(survey)?.attachments ?? [], (att) => {
              _push(`<div class="relative border border-slate-200 rounded-lg overflow-hidden bg-white group"><div class="aspect-square flex items-center justify-center bg-slate-50">`);
              if (("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) && att.url) {
                _push(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", att.url)} target="_blank" rel="noopener" class="block w-full h-full"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", att.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", att.original_name)} class="w-full h-full object-cover"></a>`);
              } else if (isVideoMime(att.mime_type) && att.url) {
                _push(`<video${serverRenderer_cjs_prodExports.ssrRenderAttr("src", att.url)} controls preload="metadata" class="w-full h-full object-cover"></video>`);
              } else if (att.url) {
                _push(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", att.url)} target="_blank" rel="noopener" class="flex flex-col items-center gap-1 text-slate-500">`);
                _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: fileIcon(att.mime_type),
                  class: "size-8"
                }, null, _parent));
                _push(`<span class="text-[10px]">Mở tệp</span></a>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div><div class="px-2 py-1.5 text-[11px]"><div class="truncate font-medium text-slate-700"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", att.original_name)}>${serverRenderer_cjs_prodExports.ssrInterpolate(att.original_name)}</div><div class="text-slate-400">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(att.size_bytes))}</div></div>`);
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-trash-2",
                color: "error",
                variant: "solid",
                size: "sm",
                square: "",
                class: "absolute top-1 right-1 shadow-md",
                "aria-label": "Xoá tệp",
                loading: vueExports.unref(deletingAttachmentId) === att.id,
                onClick: ($event) => onDeleteAttachment(att.id)
              }, null, _parent));
              _push(`</div>`);
            });
            _push(`<!--]--><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(pendingFiles), (file, idx) => {
              _push(`<div class="relative border-2 border-dashed border-emerald-400 rounded-lg overflow-hidden bg-emerald-50 group"><div class="aspect-square flex items-center justify-center bg-slate-50">`);
              if (("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) && previewUrl(file)) {
                _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", previewUrl(file))}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", file.name)} class="w-full h-full object-cover">`);
              } else if (isVideoMime(file.type) && previewUrl(file)) {
                _push(`<video${serverRenderer_cjs_prodExports.ssrRenderAttr("src", previewUrl(file))} controls preload="metadata" class="w-full h-full object-cover"></video>`);
              } else {
                _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: fileIcon(file.type),
                  class: "size-8 text-emerald-500"
                }, null, _parent));
              }
              _push(`</div><div class="px-2 py-1.5 text-[11px]"><div class="truncate font-medium text-slate-700"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", file.name)}>${serverRenderer_cjs_prodExports.ssrInterpolate(file.name)}</div><div class="text-emerald-600"> Chưa lưu · ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(file.size))}</div></div>`);
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-trash-2",
                color: "error",
                variant: "solid",
                size: "sm",
                square: "",
                class: "absolute top-1 right-1 shadow-md",
                "aria-label": "Xoá tệp",
                onClick: ($event) => removePendingFile(idx)
              }, null, _parent));
              _push(`</div>`);
            });
            _push(`<!--]--></div>`);
          }
          _push(`</div><div class="flex justify-end gap-2 pt-2 border-t border-slate-100">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Lưu khảo sát",
            icon: "i-lucide-save",
            color: "primary",
            disabled: !vueExports.unref(isDirty),
            loading: vueExports.unref(isSaving),
            onClick: onSave
          }, null, _parent));
          _push(`</div></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/og-ticket/PublicSurveySection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$2, { __name: "OgTicketPublicSurveySection" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "WarrantyRequestModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    ticketCode: {},
    request: {}
  },
  emits: ["update:open", "submitted"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const subject = vueExports.ref("");
    const description = vueExports.ref("");
    const attachments = vueExports.ref([]);
    const errors = vueExports.ref({});
    const isSubmitting = vueExports.ref(false);
    const attachmentPreviews = vueExports.computed(
      () => attachments.value.map((file) => ({
        file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null
      }))
    );
    function resetForm() {
      for (const preview of attachmentPreviews.value) {
        if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl);
      }
      subject.value = "";
      description.value = "";
      attachments.value = [];
      errors.value = {};
    }
    vueExports.watch(() => props.open, (open) => {
      if (open && props.mode === "create") {
        resetForm();
      }
    });
    function handleFileSelect(event) {
      const input = event.target;
      if (!input.files) return;
      for (const file of Array.from(input.files)) {
        if (attachments.value.length >= ATTACHMENT_MAX_FILES) {
          errors.value.attachments = `Tối đa ${ATTACHMENT_MAX_FILES} tệp đính kèm.`;
          break;
        }
        if (file.size > ATTACHMENT_MAX_FILE_SIZE) {
          errors.value.attachments = `Tệp "${file.name}" vượt quá 10MB.`;
          continue;
        }
        if (!ATTACHMENT_ALLOWED_TYPES.includes(file.type)) {
          errors.value.attachments = `Tệp "${file.name}" không được hỗ trợ.`;
          continue;
        }
        attachments.value.push(file);
      }
      input.value = "";
    }
    function removeFile(index) {
      const preview = attachmentPreviews.value[index];
      if (preview?.previewUrl) URL.revokeObjectURL(preview.previewUrl);
      attachments.value.splice(index, 1);
      if (errors.value.attachments) delete errors.value.attachments;
    }
    async function handleSubmit() {
      errors.value = {};
      const localErrors = {};
      if (!subject.value.trim()) localErrors.subject = "Vui lòng nhập tiêu đề.";
      if (!description.value.trim()) localErrors.description = "Vui lòng nhập mô tả.";
      if (Object.keys(localErrors).length > 0) {
        errors.value = localErrors;
        return;
      }
      isSubmitting.value = true;
      try {
        await apiSubmitWarrantyRequest(props.ticketCode, {
          subject: subject.value.trim(),
          description: description.value.trim(),
          attachments: attachments.value.length > 0 ? attachments.value : void 0
        });
        toast.add({ title: "Đã gửi yêu cầu bảo hành!", color: "success" });
        emit("submitted");
        emit("update:open", false);
      } catch (err) {
        const validationErrors = getApiValidationErrors(err);
        if (validationErrors) {
          const mapped = {};
          for (const [key, messages] of Object.entries(validationErrors)) {
            if (messages.length > 0) mapped[key] = messages[0];
          }
          errors.value = mapped;
        } else {
          toast.add({ title: getApiErrorMessage(err, "Có lỗi xảy ra, vui lòng thử lại."), color: "error" });
        }
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$7;
      const _component_UInput = _sfc_main$8;
      const _component_UTextarea = _sfc_main$6;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        "onUpdate:open": (v) => emit("update:open", v)
      }, _attrs), {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6"${_scopeId}><div class="flex items-center gap-3 mb-5"${_scopeId}><div class="size-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0"${_scopeId}><span class="material-symbols-outlined text-amber-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "20px", "font-variation-settings": "'FILL' 1" })}"${_scopeId}>verified</span></div><div${_scopeId}><h3 class="text-base font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.mode === "create" ? "Yêu cầu bảo hành" : "Chi tiết yêu cầu bảo hành")}</h3>`);
            if (__props.mode === "create") {
              _push2(`<p class="text-xs text-slate-500 mt-0.5"${_scopeId}> Mô tả vấn đề để chúng tôi xử lý nhanh nhất </p>`);
            } else if (__props.request?.created_at) {
              _push2(`<p class="text-xs text-slate-500 mt-0.5"${_scopeId}> Gửi lúc ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(__props.request.created_at))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            if (__props.mode === "create") {
              _push2(`<!--[--><div class="mb-4"${_scopeId}><label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5"${_scopeId}> Tiêu đề <span class="text-red-400"${_scopeId}>*</span></label>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                modelValue: vueExports.unref(subject),
                "onUpdate:modelValue": ($event) => vueExports.isRef(subject) ? subject.value = $event : null,
                placeholder: "VD: Mái bị thấm nước sau mưa",
                maxlength: 500,
                class: "w-full"
              }, null, _parent2, _scopeId));
              if (vueExports.unref(errors).subject) {
                _push2(`<p class="text-[11px] text-red-400 mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).subject)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="mb-4"${_scopeId}><label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5"${_scopeId}> Mô tả chi tiết <span class="text-red-400"${_scopeId}>*</span></label>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                modelValue: vueExports.unref(description),
                "onUpdate:modelValue": ($event) => vueExports.isRef(description) ? description.value = $event : null,
                placeholder: "Mô tả tình trạng và thời điểm phát hiện...",
                rows: 5,
                maxlength: 5e3,
                class: "w-full"
              }, null, _parent2, _scopeId));
              if (vueExports.unref(errors).description) {
                _push2(`<p class="text-[11px] text-red-400 mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).description)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="mb-5"${_scopeId}><label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5"${_scopeId}> Hình ảnh/tệp đính kèm <span class="text-[10px] text-slate-400 font-normal"${_scopeId}>(tối đa ${serverRenderer_cjs_prodExports.ssrInterpolate("ATTACHMENT_MAX_FILES" in _ctx ? _ctx.ATTACHMENT_MAX_FILES : vueExports.unref(ATTACHMENT_MAX_FILES))})</span></label>`);
              if (vueExports.unref(attachmentPreviews).length > 0) {
                _push2(`<div class="grid grid-cols-3 gap-2 mb-2"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(attachmentPreviews), (preview, idx) => {
                  _push2(`<div class="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50"${_scopeId}>`);
                  if (preview.previewUrl) {
                    _push2(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", preview.previewUrl)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", preview.file.name)} class="w-full h-full object-cover"${_scopeId}>`);
                  } else {
                    _push2(`<div class="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2"${_scopeId}><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "28px" })}"${_scopeId}>draft</span><p class="text-[10px] mt-1 text-center line-clamp-2 break-all"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(preview.file.name)}</p></div>`);
                  }
                  _push2(`<button type="button" class="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"${_scopeId}><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}"${_scopeId}>close</span></button></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(attachments).length < ("ATTACHMENT_MAX_FILES" in _ctx ? _ctx.ATTACHMENT_MAX_FILES : vueExports.unref(ATTACHMENT_MAX_FILES))) {
                _push2(`<label class="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 text-sm font-medium cursor-pointer hover:border-amber-300 hover:text-amber-500 transition-colors"${_scopeId}><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}"${_scopeId}>add_photo_alternate</span> Chọn tệp từ máy <input type="file" multiple${serverRenderer_cjs_prodExports.ssrRenderAttr("accept", ("ATTACHMENT_ALLOWED_TYPES" in _ctx ? _ctx.ATTACHMENT_ALLOWED_TYPES : vueExports.unref(ATTACHMENT_ALLOWED_TYPES)).join(","))} class="hidden"${_scopeId}></label>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(errors).attachments) {
                _push2(`<p class="text-[11px] text-red-400 mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(errors).attachments)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex gap-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                color: "neutral",
                variant: "outline",
                size: "md",
                class: "flex-1",
                disabled: vueExports.unref(isSubmitting),
                onClick: ($event) => emit("update:open", false)
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Huỷ `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Huỷ ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                color: "warning",
                size: "md",
                class: "flex-1",
                loading: vueExports.unref(isSubmitting),
                onClick: handleSubmit
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Gửi yêu cầu `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Gửi yêu cầu ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><!--]-->`);
            } else if (__props.request) {
              _push2(`<!--[--><div class="mb-4"${_scopeId}><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1"${_scopeId}> Tiêu đề </p><p class="text-sm font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.request.subject)}</p></div><div class="mb-4"${_scopeId}><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1"${_scopeId}> Mô tả </p><p class="text-sm text-slate-700 whitespace-pre-line"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.request.description)}</p></div>`);
              if (__props.request.attachments.length > 0) {
                _push2(`<div class="mb-5"${_scopeId}><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2"${_scopeId}> Hình ảnh/tệp đính kèm </p><div class="grid grid-cols-3 gap-2"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(__props.request.attachments, (attachment) => {
                  _push2(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", attachment.url ?? "#")} target="_blank" rel="noopener" class="relative block rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50 hover:border-amber-300 transition-colors"${_scopeId}>`);
                  if (attachment.mime_type.startsWith("image/") && attachment.url) {
                    _push2(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", attachment.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", attachment.original_name)} class="w-full h-full object-cover"${_scopeId}>`);
                  } else {
                    _push2(`<div class="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2"${_scopeId}><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "28px" })}"${_scopeId}>draft</span><p class="text-[10px] mt-1 text-center line-clamp-2 break-all"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(attachment.original_name)}</p></div>`);
                  }
                  _push2(`</a>`);
                });
                _push2(`<!--]--></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                color: "neutral",
                variant: "outline",
                size: "md",
                block: "",
                onClick: ($event) => emit("update:open", false)
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Đóng `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Đóng ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "p-6" }, [
                vueExports.createVNode("div", { class: "flex items-center gap-3 mb-5" }, [
                  vueExports.createVNode("div", { class: "size-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0" }, [
                    vueExports.createVNode("span", {
                      class: "material-symbols-outlined text-amber-500",
                      style: { "font-size": "20px", "font-variation-settings": "'FILL' 1" }
                    }, "verified")
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("h3", { class: "text-base font-bold text-slate-900" }, vueExports.toDisplayString(__props.mode === "create" ? "Yêu cầu bảo hành" : "Chi tiết yêu cầu bảo hành"), 1),
                    __props.mode === "create" ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-xs text-slate-500 mt-0.5"
                    }, " Mô tả vấn đề để chúng tôi xử lý nhanh nhất ")) : __props.request?.created_at ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 1,
                      class: "text-xs text-slate-500 mt-0.5"
                    }, " Gửi lúc " + vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(__props.request.created_at)), 1)) : vueExports.createCommentVNode("", true)
                  ])
                ]),
                __props.mode === "create" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode("div", { class: "mb-4" }, [
                    vueExports.createVNode("label", { class: "block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" }, [
                      vueExports.createTextVNode(" Tiêu đề "),
                      vueExports.createVNode("span", { class: "text-red-400" }, "*")
                    ]),
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(subject),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(subject) ? subject.value = $event : null,
                      placeholder: "VD: Mái bị thấm nước sau mưa",
                      maxlength: 500,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.unref(errors).subject ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-[11px] text-red-400 mt-1"
                    }, vueExports.toDisplayString(vueExports.unref(errors).subject), 1)) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("div", { class: "mb-4" }, [
                    vueExports.createVNode("label", { class: "block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" }, [
                      vueExports.createTextVNode(" Mô tả chi tiết "),
                      vueExports.createVNode("span", { class: "text-red-400" }, "*")
                    ]),
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(description),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(description) ? description.value = $event : null,
                      placeholder: "Mô tả tình trạng và thời điểm phát hiện...",
                      rows: 5,
                      maxlength: 5e3,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.unref(errors).description ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-[11px] text-red-400 mt-1"
                    }, vueExports.toDisplayString(vueExports.unref(errors).description), 1)) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("div", { class: "mb-5" }, [
                    vueExports.createVNode("label", { class: "block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" }, [
                      vueExports.createTextVNode(" Hình ảnh/tệp đính kèm "),
                      vueExports.createVNode("span", { class: "text-[10px] text-slate-400 font-normal" }, "(tối đa " + vueExports.toDisplayString("ATTACHMENT_MAX_FILES" in _ctx ? _ctx.ATTACHMENT_MAX_FILES : vueExports.unref(ATTACHMENT_MAX_FILES)) + ")", 1)
                    ]),
                    vueExports.unref(attachmentPreviews).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 0,
                      class: "grid grid-cols-3 gap-2 mb-2"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(attachmentPreviews), (preview, idx) => {
                        return vueExports.openBlock(), vueExports.createBlock("div", {
                          key: idx,
                          class: "relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50"
                        }, [
                          preview.previewUrl ? (vueExports.openBlock(), vueExports.createBlock("img", {
                            key: 0,
                            src: preview.previewUrl,
                            alt: preview.file.name,
                            class: "w-full h-full object-cover"
                          }, null, 8, ["src", "alt"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 1,
                            class: "w-full h-full flex flex-col items-center justify-center text-slate-400 p-2"
                          }, [
                            vueExports.createVNode("span", {
                              class: "material-symbols-outlined",
                              style: { "font-size": "28px" }
                            }, "draft"),
                            vueExports.createVNode("p", { class: "text-[10px] mt-1 text-center line-clamp-2 break-all" }, vueExports.toDisplayString(preview.file.name), 1)
                          ])),
                          vueExports.createVNode("button", {
                            type: "button",
                            class: "absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                            onClick: ($event) => removeFile(idx)
                          }, [
                            vueExports.createVNode("span", {
                              class: "material-symbols-outlined",
                              style: { "font-size": "14px" }
                            }, "close")
                          ], 8, ["onClick"])
                        ]);
                      }), 128))
                    ])) : vueExports.createCommentVNode("", true),
                    vueExports.unref(attachments).length < ("ATTACHMENT_MAX_FILES" in _ctx ? _ctx.ATTACHMENT_MAX_FILES : vueExports.unref(ATTACHMENT_MAX_FILES)) ? (vueExports.openBlock(), vueExports.createBlock("label", {
                      key: 1,
                      class: "flex items-center justify-center gap-2 w-full px-3 py-3 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 text-sm font-medium cursor-pointer hover:border-amber-300 hover:text-amber-500 transition-colors"
                    }, [
                      vueExports.createVNode("span", {
                        class: "material-symbols-outlined",
                        style: { "font-size": "18px" }
                      }, "add_photo_alternate"),
                      vueExports.createTextVNode(" Chọn tệp từ máy "),
                      vueExports.createVNode("input", {
                        type: "file",
                        multiple: "",
                        accept: ("ATTACHMENT_ALLOWED_TYPES" in _ctx ? _ctx.ATTACHMENT_ALLOWED_TYPES : vueExports.unref(ATTACHMENT_ALLOWED_TYPES)).join(","),
                        class: "hidden",
                        onChange: handleFileSelect
                      }, null, 40, ["accept"])
                    ])) : vueExports.createCommentVNode("", true),
                    vueExports.unref(errors).attachments ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 2,
                      class: "text-[11px] text-red-400 mt-1"
                    }, vueExports.toDisplayString(vueExports.unref(errors).attachments), 1)) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("div", { class: "flex gap-3" }, [
                    vueExports.createVNode(_component_UButton, {
                      color: "neutral",
                      variant: "outline",
                      size: "md",
                      class: "flex-1",
                      disabled: vueExports.unref(isSubmitting),
                      onClick: ($event) => emit("update:open", false)
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Huỷ ")
                      ]),
                      _: 1
                    }, 8, ["disabled", "onClick"]),
                    vueExports.createVNode(_component_UButton, {
                      color: "warning",
                      size: "md",
                      class: "flex-1",
                      loading: vueExports.unref(isSubmitting),
                      onClick: handleSubmit
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Gửi yêu cầu ")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ], 64)) : __props.request ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("div", { class: "mb-4" }, [
                    vueExports.createVNode("p", { class: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1" }, " Tiêu đề "),
                    vueExports.createVNode("p", { class: "text-sm font-semibold text-slate-900" }, vueExports.toDisplayString(__props.request.subject), 1)
                  ]),
                  vueExports.createVNode("div", { class: "mb-4" }, [
                    vueExports.createVNode("p", { class: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1" }, " Mô tả "),
                    vueExports.createVNode("p", { class: "text-sm text-slate-700 whitespace-pre-line" }, vueExports.toDisplayString(__props.request.description), 1)
                  ]),
                  __props.request.attachments.length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "mb-5"
                  }, [
                    vueExports.createVNode("p", { class: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2" }, " Hình ảnh/tệp đính kèm "),
                    vueExports.createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.request.attachments, (attachment) => {
                        return vueExports.openBlock(), vueExports.createBlock("a", {
                          key: attachment.id,
                          href: attachment.url ?? "#",
                          target: "_blank",
                          rel: "noopener",
                          class: "relative block rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50 hover:border-amber-300 transition-colors"
                        }, [
                          attachment.mime_type.startsWith("image/") && attachment.url ? (vueExports.openBlock(), vueExports.createBlock("img", {
                            key: 0,
                            src: attachment.url,
                            alt: attachment.original_name,
                            class: "w-full h-full object-cover"
                          }, null, 8, ["src", "alt"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                            key: 1,
                            class: "w-full h-full flex flex-col items-center justify-center text-slate-400 p-2"
                          }, [
                            vueExports.createVNode("span", {
                              class: "material-symbols-outlined",
                              style: { "font-size": "28px" }
                            }, "draft"),
                            vueExports.createVNode("p", { class: "text-[10px] mt-1 text-center line-clamp-2 break-all" }, vueExports.toDisplayString(attachment.original_name), 1)
                          ]))
                        ], 8, ["href"]);
                      }), 128))
                    ])
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode(_component_UButton, {
                    color: "neutral",
                    variant: "outline",
                    size: "md",
                    block: "",
                    onClick: ($event) => emit("update:open", false)
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Đóng ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ], 64)) : vueExports.createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/ticket/WarrantyRequestModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "SharedTicketWarrantyRequestModal" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[code]",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Thông tin yêu cầu - Thần Nông",
      description: "Xem thông tin yêu cầu hỗ trợ và đánh giá dịch vụ."
    });
    const route = useRoute$1();
    const code = vueExports.computed(() => String(route.params.code));
    const toast = useToast();
    const { data: responseData, status, error, refresh } = usePublicTicketInfo(code);
    const ticket = vueExports.computed(() => responseData.value?.data ?? null);
    const showApproveModal = vueExports.ref(false);
    const showRejectModal = vueExports.ref(false);
    const rejectReason = vueExports.ref("");
    const isQuoteSubmitting = vueExports.ref(false);
    const showWarrantyCreateModal = vueExports.ref(false);
    const showWarrantyViewModal = vueExports.ref(false);
    const selectedWarrantyRequest = vueExports.ref(null);
    const showAcceptanceConfirmModal = vueExports.ref(false);
    const acceptanceSignatureName = vueExports.ref("");
    const acceptanceNote = vueExports.ref("");
    const isAcceptanceSubmitting = vueExports.ref(false);
    const acceptanceReport = vueExports.computed(() => ticket.value?.acceptance_report ?? null);
    const showAcceptanceSection = vueExports.computed(() => {
      const order = ticket.value?.order;
      if (!order || !acceptanceReport.value) return false;
      return order.status.value === "accepted" || order.status.value === "completed";
    });
    function openAcceptanceConfirmModal() {
      acceptanceSignatureName.value = ticket.value?.requester_name ?? "";
      acceptanceNote.value = "";
      showAcceptanceConfirmModal.value = true;
    }
    async function handleAcceptanceConfirm() {
      const name = acceptanceSignatureName.value.trim();
      if (name.length < 2) return;
      const token = acceptanceReport.value?.share_token;
      if (!token) return;
      isAcceptanceSubmitting.value = true;
      try {
        await apiConfirmPublicAcceptanceReport(token, {
          signature_name: name,
          note: acceptanceNote.value.trim() || void 0
        });
        toast.add({ title: "Đã xác nhận nghiệm thu. Cảm ơn bạn!", color: "success" });
        showAcceptanceConfirmModal.value = false;
        await refresh();
      } catch (err) {
        const message = typeof err === "object" && err !== null && "data" in err && typeof err.data?.message === "string" ? err.data.message : "Có lỗi xảy ra, vui lòng thử lại.";
        toast.add({ title: message, color: "error" });
      } finally {
        isAcceptanceSubmitting.value = false;
      }
    }
    function openWarrantyCreateModal() {
      selectedWarrantyRequest.value = null;
      showWarrantyCreateModal.value = true;
    }
    async function handleWarrantySubmitted() {
      await refresh();
    }
    const quoteStatusVisible = ["manager_approved", "approved", "resident_rejected"];
    const showQuoteSection = vueExports.computed(
      () => ticket.value?.quote != null && quoteStatusVisible.includes(ticket.value.quote.status.value) && (ticket.value.order == null || ticket.value.quote.status.value !== "approved")
    );
    const showStickyQuoteBar = vueExports.computed(
      () => ticket.value?.quote != null && ticket.value.quote.is_resident_actionable && !showApproveModal.value && !showRejectModal.value
    );
    async function handleApprove() {
      isQuoteSubmitting.value = true;
      try {
        await apiSubmitQuoteDecision(code.value, { action: "approve" });
        toast.add({ title: "Bạn đã chấp thuận báo giá!", color: "success" });
        showApproveModal.value = false;
        await refresh();
      } catch {
        toast.add({ title: "Có lỗi xảy ra, vui lòng thử lại.", color: "error" });
      } finally {
        isQuoteSubmitting.value = false;
      }
    }
    async function handleReject() {
      if (rejectReason.value.trim().length < 5) return;
      isQuoteSubmitting.value = true;
      try {
        await apiSubmitQuoteDecision(code.value, { action: "reject", reason: rejectReason.value.trim() });
        toast.add({ title: "Bạn đã từ chối báo giá.", color: "info" });
        showRejectModal.value = false;
        rejectReason.value = "";
        await refresh();
      } catch {
        toast.add({ title: "Có lỗi xảy ra, vui lòng thử lại.", color: "error" });
      } finally {
        isQuoteSubmitting.value = false;
      }
    }
    const selectedRating = vueExports.ref(0);
    const hoverRating = vueExports.ref(0);
    const ratingComment = vueExports.ref("");
    const isSubmitting = vueExports.ref(false);
    const submitSuccess = vueExports.ref(false);
    const displayRating = vueExports.computed(() => hoverRating.value || selectedRating.value);
    const ratingLabels = ["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];
    const ratingLabel = vueExports.computed(() => ratingLabels[displayRating.value] ?? "");
    const statusIconMap = {
      pending: "schedule",
      received: "inbox",
      in_progress: "engineering",
      completed: "check_circle",
      cancelled: "cancel"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_USkeleton = _sfc_main$3;
      const _component_OgTicketPublicSurveySection = __nuxt_component_2;
      const _component_UBadge = _sfc_main$4;
      const _component_UAlert = _sfc_main$5;
      const _component_UButton = _sfc_main$c;
      const _component_UTextarea = _sfc_main$6;
      const _component_UModal = _sfc_main$7;
      const _component_UInput = _sfc_main$8;
      const _component_SharedTicketWarrantyRequestModal = __nuxt_component_9;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "min-h-screen w-full bg-slate-50" }, _attrs))} data-v-62db03a8><header class="relative overflow-hidden bg-slate-900" data-v-62db03a8><div class="absolute -top-20 left-1/3 size-[400px] rounded-full bg-indigo-500/10 blur-[120px]" data-v-62db03a8></div><div class="absolute -bottom-10 right-1/4 size-[300px] rounded-full bg-violet-500/8 blur-[100px]" data-v-62db03a8></div><div class="absolute inset-0 opacity-[0.03]" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "background-image": "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)", "background-size": "48px 48px" })}" data-v-62db03a8></div><div class="relative max-w-2xl mx-auto px-6 py-5" data-v-62db03a8><div class="flex items-center justify-between mb-6" data-v-62db03a8>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3 group"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="size-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors" data-v-62db03a8${_scopeId}><span class="material-symbols-outlined text-white" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}" data-v-62db03a8${_scopeId}>domain</span></div><span class="text-white font-bold text-base tracking-tight" data-v-62db03a8${_scopeId}>Thần Nông</span>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "size-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors" }, [
                vueExports.createVNode("span", {
                  class: "material-symbols-outlined text-white",
                  style: { "font-size": "18px" }
                }, "domain")
              ]),
              vueExports.createVNode("span", { class: "text-white font-bold text-base tracking-tight" }, "Thần Nông")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/ticket",
        class: "flex items-center gap-1.5 rounded-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 hover:text-white transition-all"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}" data-v-62db03a8${_scopeId}>add_circle</span> Gửi yêu cầu mới `);
          } else {
            return [
              vueExports.createVNode("span", {
                class: "material-symbols-outlined",
                style: { "font-size": "14px" }
              }, "add_circle"),
              vueExports.createTextVNode(" Gửi yêu cầu mới ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (vueExports.unref(ticket)) {
        _push(`<div class="pb-2" data-v-62db03a8><div class="flex items-center gap-2.5 mb-2" data-v-62db03a8><span class="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider" data-v-62db03a8><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "13px" })}" data-v-62db03a8>confirmation_number</span> ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).code)}</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([{
          "bg-amber-500/15 text-amber-300 border border-amber-500/20": vueExports.unref(ticket).status.value === "pending",
          "bg-blue-500/15 text-blue-300 border border-blue-500/20": vueExports.unref(ticket).status.value === "received",
          "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20": vueExports.unref(ticket).status.value === "in_progress",
          "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20": vueExports.unref(ticket).status.value === "completed",
          "bg-slate-500/15 text-slate-400 border border-slate-500/20": vueExports.unref(ticket).status.value === "cancelled"
        }, "inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"])}" data-v-62db03a8><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "13px", "font-variation-settings": "'FILL' 1" })}" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(statusIconMap[vueExports.unref(ticket).status.value] ?? "help")}</span> ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).status.label)}</span></div><h1 class="text-white text-xl sm:text-2xl font-extrabold tracking-tight leading-snug" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).subject)}</h1></div>`);
      } else {
        _push(`<div class="pb-2" data-v-62db03a8><div class="h-6 w-36 bg-slate-800 rounded-full animate-pulse mb-3" data-v-62db03a8></div><div class="h-7 w-72 bg-slate-800 rounded-lg animate-pulse" data-v-62db03a8></div></div>`);
      }
      _push(`</div></header><main class="max-w-2xl mx-auto px-6 -mt-1" data-v-62db03a8>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="py-8 space-y-5" data-v-62db03a8><div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100" data-v-62db03a8>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-5 w-32 mb-4" }, null, _parent));
        _push(`<div class="grid grid-cols-2 gap-4" data-v-62db03a8><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(4, (i) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, {
            key: i,
            class: "h-12"
          }, null, _parent));
        });
        _push(`<!--]--></div></div><div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100" data-v-62db03a8>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-5 w-40 mb-4" }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-24" }, null, _parent));
        _push(`</div></div>`);
      } else if (vueExports.unref(error)) {
        _push(`<div class="py-12" data-v-62db03a8><div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center" data-v-62db03a8><div class="size-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4" data-v-62db03a8><span class="material-symbols-outlined text-red-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "28px" })}" data-v-62db03a8>error</span></div><h2 class="text-lg font-bold text-slate-900 mb-1" data-v-62db03a8> Không tìm thấy yêu cầu </h2><p class="text-sm text-slate-500" data-v-62db03a8> Mã yêu cầu không tồn tại hoặc đã bị xóa. </p>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
          to: "/ticket",
          class: "inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}" data-v-62db03a8${_scopeId}>arrow_back</span> Quay lại trang gửi yêu cầu `);
            } else {
              return [
                vueExports.createVNode("span", {
                  class: "material-symbols-outlined",
                  style: { "font-size": "16px" }
                }, "arrow_back"),
                vueExports.createTextVNode(" Quay lại trang gửi yêu cầu ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else if (vueExports.unref(ticket)) {
        _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "pb-32 sm:pb-6": vueExports.unref(showStickyQuoteBar) }, "py-6 space-y-5"])}" data-v-62db03a8><div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" data-v-62db03a8><div class="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2" data-v-62db03a8><span class="material-symbols-outlined text-slate-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}" data-v-62db03a8>description</span><h2 class="text-sm font-bold text-slate-800" data-v-62db03a8> Thông tin yêu cầu </h2></div><div class="px-5 py-4" data-v-62db03a8><div class="grid grid-cols-2 gap-x-6 gap-y-3.5" data-v-62db03a8><div data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5" data-v-62db03a8> Mã yêu cầu </p><p class="text-sm font-bold text-slate-900 font-mono" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).code)}</p></div><div data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5" data-v-62db03a8> Ngày tạo </p><p class="text-sm text-slate-700" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ticket).created_at))}</p></div><div data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5" data-v-62db03a8> Người gửi </p><p class="text-sm font-semibold text-slate-900" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).requester_name)}</p></div><div data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5" data-v-62db03a8> Số điện thoại </p><p class="text-sm text-slate-700" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).requester_phone)}</p></div></div>`);
        if (vueExports.unref(ticket).description) {
          _push(`<div class="mt-4 pt-3.5 border-t border-slate-50" data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1" data-v-62db03a8> Mô tả </p><p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).description)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(ticket).address) {
          _push(`<div class="mt-3 pt-3.5 border-t border-slate-50" data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1" data-v-62db03a8> Địa chỉ </p><p class="text-sm text-slate-700" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).address)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_OgTicketPublicSurveySection, { "ticket-code": vueExports.unref(code) }, null, _parent));
        if (vueExports.unref(showQuoteSection) && vueExports.unref(ticket).quote) {
          _push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" data-v-62db03a8><div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between" data-v-62db03a8><div class="flex items-center gap-2" data-v-62db03a8><span class="material-symbols-outlined text-slate-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}" data-v-62db03a8>request_quote</span><h2 class="text-sm font-bold text-slate-800" data-v-62db03a8> Báo giá </h2></div>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: vueExports.unref(ticket).quote.status.value === "approved" ? "success" : vueExports.unref(ticket).quote.status.value === "resident_rejected" ? "error" : "warning",
            variant: "subtle",
            size: "xs"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).quote.status.value === "manager_approved" ? "Chờ bạn chấp thuận" : vueExports.unref(ticket).quote.status.label)}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ticket).quote.status.value === "manager_approved" ? "Chờ bạn chấp thuận" : vueExports.unref(ticket).quote.status.label), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div><div class="px-5 py-4" data-v-62db03a8><div class="flex items-center justify-between mb-4" data-v-62db03a8><div data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5" data-v-62db03a8> Mã báo giá </p><p class="text-sm font-bold text-slate-900 font-mono" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).quote.code)}</p></div><div class="text-right" data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5" data-v-62db03a8> Tổng tiền </p><p class="text-base font-extrabold text-slate-900" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ticket).quote.total_amount))}</p></div></div>`);
          if (vueExports.unref(ticket).quote.lines.length > 0) {
            _push(`<div class="border border-slate-100 rounded-xl overflow-hidden" data-v-62db03a8><table class="w-full text-sm" data-v-62db03a8><thead data-v-62db03a8><tr class="bg-slate-50/80" data-v-62db03a8><th class="text-left px-3.5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" data-v-62db03a8> Hạng mục </th><th class="text-center px-3 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" data-v-62db03a8> SL </th><th class="text-right px-3 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" data-v-62db03a8> Đơn giá </th><th class="text-right px-3.5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" data-v-62db03a8> Thành tiền </th></tr></thead><tbody class="divide-y divide-slate-50" data-v-62db03a8><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ticket).quote.lines, (line, idx) => {
              _push(`<tr data-v-62db03a8><td class="px-3.5 py-2.5" data-v-62db03a8><p class="font-semibold text-slate-800 text-[13px]" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(line.name)}</p><span class="inline-block mt-0.5 text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(line.line_type.label)}</span></td><td class="text-center px-3 py-2.5 text-slate-600 text-[13px]" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(line.quantity)} ${serverRenderer_cjs_prodExports.ssrInterpolate(line.unit)}</td><td class="text-right px-3 py-2.5 text-slate-600 text-[13px]" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.unit_price))}</td><td class="text-right px-3.5 py-2.5 font-semibold text-slate-800 text-[13px]" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.line_amount))}</td></tr>`);
            });
            _push(`<!--]--></tbody><tfoot data-v-62db03a8><tr class="bg-slate-50/80" data-v-62db03a8><td colspan="3" class="text-right px-3.5 py-2.5 text-[13px] font-semibold text-slate-500" data-v-62db03a8> Tổng cộng </td><td class="text-right px-3.5 py-2.5 text-[13px] font-extrabold text-slate-900" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ticket).quote.total_amount))}</td></tr></tfoot></table></div>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(ticket).quote.status.value === "approved") {
            _push(`<div class="mt-4" data-v-62db03a8>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "success",
              variant: "subtle",
              icon: "i-lucide-check-circle",
              title: "Bạn đã chấp thuận báo giá này",
              description: vueExports.unref(ticket).quote.manager_approved_at ? `Ngày duyệt: ${("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ticket).quote.manager_approved_at)}` : void 0
            }, null, _parent));
            _push(`</div>`);
          } else if (vueExports.unref(ticket).quote.status.value === "resident_rejected") {
            _push(`<div class="mt-4" data-v-62db03a8>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "error",
              variant: "subtle",
              icon: "i-lucide-x-circle",
              title: "Bạn đã từ chối báo giá này",
              description: vueExports.unref(ticket).quote.note ? `Lý do: ${vueExports.unref(ticket).quote.note}` : void 0
            }, null, _parent));
            _push(`</div>`);
          } else if (vueExports.unref(ticket).quote.is_resident_actionable) {
            _push(`<div class="mt-4" data-v-62db03a8><div class="flex flex-col gap-2.5" data-v-62db03a8>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "success",
              size: "xl",
              block: "",
              class: "min-h-[52px] font-semibold text-base whitespace-nowrap",
              icon: "i-lucide-check",
              onClick: ($event) => showApproveModal.value = true
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Đồng ý báo giá `);
                } else {
                  return [
                    vueExports.createTextVNode(" Đồng ý báo giá ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "error",
              variant: "outline",
              size: "lg",
              block: "",
              class: "min-h-[44px] font-semibold",
              icon: "i-lucide-x",
              onClick: ($event) => showRejectModal.value = true
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Từ chối `);
                } else {
                  return [
                    vueExports.createTextVNode(" Từ chối ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(ticket).order) {
          _push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" data-v-62db03a8><div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between" data-v-62db03a8><div class="flex items-center gap-2" data-v-62db03a8><span class="material-symbols-outlined text-slate-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}" data-v-62db03a8>receipt_long</span><h2 class="text-sm font-bold text-slate-800" data-v-62db03a8> Đơn hàng </h2></div>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: vueExports.unref(ticket).order.status.value === "completed" ? "success" : "info",
            variant: "subtle",
            size: "xs"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).order.status.label)}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ticket).order.status.label), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div><div class="px-5 py-4" data-v-62db03a8><div class="flex items-center justify-between mb-4" data-v-62db03a8><div data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5" data-v-62db03a8> Mã đơn hàng </p><p class="text-sm font-bold text-slate-900 font-mono" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).order.code)}</p></div><div class="text-right" data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5" data-v-62db03a8> Tổng tiền </p><p class="text-base font-extrabold text-slate-900" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ticket).order.total_amount))}</p></div></div>`);
          if (vueExports.unref(ticket).order.lines.length > 0) {
            _push(`<div class="border border-slate-100 rounded-xl overflow-hidden" data-v-62db03a8><table class="w-full text-sm" data-v-62db03a8><thead data-v-62db03a8><tr class="bg-slate-50/80" data-v-62db03a8><th class="text-left px-3.5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" data-v-62db03a8> Hạng mục </th><th class="text-center px-3 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" data-v-62db03a8> SL </th><th class="text-right px-3 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" data-v-62db03a8> Đơn giá </th><th class="text-right px-3.5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" data-v-62db03a8> Thành tiền </th></tr></thead><tbody class="divide-y divide-slate-50" data-v-62db03a8><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ticket).order.lines, (line, idx) => {
              _push(`<tr data-v-62db03a8><td class="px-3.5 py-2.5" data-v-62db03a8><p class="font-semibold text-slate-800 text-[13px]" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(line.name)}</p><span class="inline-block mt-0.5 text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(line.line_type.label)}</span></td><td class="text-center px-3 py-2.5 text-slate-600 text-[13px]" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(line.quantity)} ${serverRenderer_cjs_prodExports.ssrInterpolate(line.unit)}</td><td class="text-right px-3 py-2.5 text-slate-600 text-[13px]" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.unit_price))}</td><td class="text-right px-3.5 py-2.5 font-semibold text-slate-800 text-[13px]" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.line_amount))}</td></tr>`);
            });
            _push(`<!--]--></tbody><tfoot data-v-62db03a8><tr class="bg-slate-50/80" data-v-62db03a8><td colspan="3" class="text-right px-3.5 py-2.5 text-[13px] font-semibold text-slate-500" data-v-62db03a8> Tổng cộng </td><td class="text-right px-3.5 py-2.5 text-[13px] font-extrabold text-slate-900" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ticket).order.total_amount))}</td></tr></tfoot></table></div>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(ticket).order.status.value === "completed") {
            _push(`<div class="mt-5 pt-5 border-t border-slate-100" data-v-62db03a8><div class="flex items-center justify-between mb-3" data-v-62db03a8><div class="flex items-center gap-2" data-v-62db03a8><span class="material-symbols-outlined text-amber-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px", "font-variation-settings": "'FILL' 1" })}" data-v-62db03a8>verified</span><h3 class="text-sm font-bold text-slate-800" data-v-62db03a8> Bảo hành 12 tháng </h3></div>`);
            if (vueExports.unref(ticket).can_request_warranty) {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                color: "warning",
                variant: "soft",
                size: "xs",
                icon: "i-lucide-plus",
                onClick: openWarrantyCreateModal
              }, {
                default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` Yêu cầu bảo hành `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Yêu cầu bảo hành ")
                    ];
                  }
                }),
                _: 1
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (!vueExports.unref(ticket).can_request_warranty && vueExports.unref(ticket).warranty_requests.length === 0) {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-info",
                color: "neutral",
                variant: "subtle",
                title: "Đã hết thời hạn bảo hành",
                description: "Bảo hành chỉ áp dụng trong 12 tháng kể từ khi đơn hàng hoàn thành."
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            if (vueExports.unref(ticket).warranty_requests.length > 0) {
              _push(`<div class="space-y-2" data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider" data-v-62db03a8> Đã gửi ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).warranty_requests.length)} yêu cầu </p><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ticket).warranty_requests, (req, idx) => {
                _push(`<button type="button" class="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-colors text-left" data-v-62db03a8><div class="size-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-600 text-xs font-bold" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(idx + 1)}</div><div class="flex-1 min-w-0" data-v-62db03a8><p class="text-sm font-semibold text-slate-800 truncate" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(req.subject)}</p><p class="text-[11px] text-slate-400 mt-0.5" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(req.created_at ? ("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(req.created_at) : "")}</p></div><span class="material-symbols-outlined text-slate-300" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}" data-v-62db03a8>chevron_right</span></button>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(showAcceptanceSection) && vueExports.unref(acceptanceReport)) {
          _push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" data-v-62db03a8><div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between" data-v-62db03a8><div class="flex items-center gap-2" data-v-62db03a8><span class="material-symbols-outlined text-slate-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}" data-v-62db03a8>assignment_turned_in</span><h2 class="text-sm font-bold text-slate-800" data-v-62db03a8> Biên bản nghiệm thu </h2></div>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: vueExports.unref(acceptanceReport).is_confirmed || vueExports.unref(acceptanceReport).has_signed_file ? "success" : "warning",
            variant: "subtle",
            size: "xs"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(acceptanceReport).is_confirmed || vueExports.unref(acceptanceReport).has_signed_file ? "Đã xác nhận" : "Chờ xác nhận")}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(acceptanceReport).is_confirmed || vueExports.unref(acceptanceReport).has_signed_file ? "Đã xác nhận" : "Chờ xác nhận"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div><div class="px-5 py-4 space-y-3" data-v-62db03a8><p class="text-sm text-slate-600 leading-relaxed" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(acceptanceReport).has_signed_file ? "Biên bản nghiệm thu đã được xác nhận bằng bản giấy có chữ ký. Bạn có thể xem hoặc tải về bản đã ký bên dưới." : "Vui lòng xem nội dung biên bản nghiệm thu và bấm nút xác nhận nếu công việc đã được hoàn tất đúng yêu cầu.")}</p><div class="flex flex-col sm:flex-row gap-2" data-v-62db03a8>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            to: vueExports.unref(acceptanceReport).public_url,
            target: "_blank",
            color: "neutral",
            variant: "outline",
            size: "md",
            icon: "i-lucide-external-link",
            class: "flex-1"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Xem biên bản `);
              } else {
                return [
                  vueExports.createTextVNode(" Xem biên bản ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (vueExports.unref(acceptanceReport).is_confirmable && !vueExports.unref(acceptanceReport).is_confirmed && !vueExports.unref(acceptanceReport).has_signed_file) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "success",
              size: "md",
              icon: "i-lucide-check",
              class: "flex-1",
              onClick: openAcceptanceConfirmModal
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Xác nhận nghiệm thu `);
                } else {
                  return [
                    vueExports.createTextVNode(" Xác nhận nghiệm thu ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (vueExports.unref(acceptanceReport).is_confirmed) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "success",
              variant: "subtle",
              icon: "i-lucide-check-circle",
              title: "Bạn đã xác nhận biên bản nghiệm thu",
              description: vueExports.unref(acceptanceReport).confirmed_at ? `Ngày xác nhận: ${("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(acceptanceReport).confirmed_at)}${vueExports.unref(acceptanceReport).confirmed_signature_name ? ` — ${vueExports.unref(acceptanceReport).confirmed_signature_name}` : ""}` : void 0
            }, null, _parent));
          } else if (vueExports.unref(acceptanceReport).has_signed_file) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "success",
              variant: "subtle",
              icon: "i-lucide-check-circle",
              title: "Đã nghiệm thu bằng biên bản ký tay",
              description: "Khách hàng đã ký biên bản bản giấy, không cần xác nhận điện tử thêm."
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(acceptanceReport).has_signed_file && vueExports.unref(acceptanceReport).signed_file_url) {
            _push(`<div class="pt-3 border-t border-slate-100" data-v-62db03a8><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2" data-v-62db03a8> Biên bản đã ký (bản giấy) </p><a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", vueExports.unref(acceptanceReport).signed_file_url)} target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 text-sm text-slate-700 transition-colors" data-v-62db03a8><span class="material-symbols-outlined text-emerald-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}" data-v-62db03a8>description</span><span class="truncate max-w-[220px]" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(acceptanceReport).signed_file_original_name ?? "Tải biên bản đã ký")}</span><span class="material-symbols-outlined text-slate-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}" data-v-62db03a8>download</span></a>`);
            if (vueExports.unref(acceptanceReport).signed_uploaded_at) {
              _push(`<p class="text-[11px] text-slate-400 mt-2" data-v-62db03a8> Tải lên lúc ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(acceptanceReport).signed_uploaded_at))}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(ticket).status.value === "completed") {
          _push(`<!--[-->`);
          if (vueExports.unref(submitSuccess)) {
            _push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" data-v-62db03a8><div class="text-center px-6 py-10" data-v-62db03a8><div class="size-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-5 ring-4 ring-emerald-50/50" data-v-62db03a8><span class="material-symbols-outlined text-emerald-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "36px", "font-variation-settings": "'FILL' 1" })}" data-v-62db03a8>check_circle</span></div><h3 class="text-xl font-extrabold text-slate-900 mb-1" data-v-62db03a8> Cảm ơn bạn! </h3><p class="text-sm text-slate-500 mb-5" data-v-62db03a8> Đánh giá của bạn giúp chúng tôi cải thiện chất lượng dịch vụ. </p><div class="flex items-center justify-center gap-1.5" data-v-62db03a8><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(5, (star) => {
              _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([star <= vueExports.unref(selectedRating) ? "text-amber-400" : "text-slate-200", "text-2xl"])}" data-v-62db03a8>★</span>`);
            });
            _push(`<!--]--></div><p class="text-sm font-bold text-slate-700 mt-2" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(ratingLabels[vueExports.unref(selectedRating)])}</p></div></div>`);
          } else if (vueExports.unref(ticket).rating) {
            _push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" data-v-62db03a8><div class="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2" data-v-62db03a8><span class="material-symbols-outlined text-amber-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px", "font-variation-settings": "'FILL' 1" })}" data-v-62db03a8>star</span><h2 class="text-sm font-bold text-slate-800" data-v-62db03a8> Đánh giá của bạn </h2></div><div class="px-5 py-5" data-v-62db03a8><div class="flex items-center gap-3 mb-3" data-v-62db03a8><div class="flex items-center gap-0.5" data-v-62db03a8><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(5, (star) => {
              _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([star <= vueExports.unref(ticket).rating.rating ? "text-amber-400" : "text-slate-200", "text-xl"])}" data-v-62db03a8>★</span>`);
            });
            _push(`<!--]--></div><span class="text-sm font-bold text-slate-700" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).rating.rating)}/5</span><span class="text-xs font-semibold text-slate-400" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(ratingLabels[vueExports.unref(ticket).rating.rating])}</span></div>`);
            if (vueExports.unref(ticket).rating.comment) {
              _push(`<p class="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 italic" data-v-62db03a8> &quot;${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).rating.comment)}&quot; </p>`);
            } else {
              _push(`<p class="text-sm text-slate-400 italic" data-v-62db03a8> Không có nhận xét </p>`);
            }
            if (vueExports.unref(ticket).rating.rated_at) {
              _push(`<p class="text-[11px] text-slate-400 mt-3" data-v-62db03a8> Đánh giá lúc ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ticket).rating.rated_at))}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else if (vueExports.unref(ticket).is_ratable) {
            _push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" data-v-62db03a8><div class="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2" data-v-62db03a8><span class="material-symbols-outlined text-amber-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px", "font-variation-settings": "'FILL' 1" })}" data-v-62db03a8>star</span><h2 class="text-sm font-bold text-slate-800" data-v-62db03a8> Đánh giá dịch vụ </h2></div><form class="px-5 py-5 space-y-5" data-v-62db03a8><div class="text-center" data-v-62db03a8><p class="text-sm font-semibold text-slate-600 mb-3" data-v-62db03a8> Bạn đánh giá dịch vụ như thế nào? </p><div class="flex items-center justify-center gap-2" data-v-62db03a8><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(5, (star) => {
              _push(`<button type="button" class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
                star <= vueExports.unref(displayRating) ? "text-amber-400 scale-110" : "text-slate-200 hover:text-amber-300",
                star === vueExports.unref(displayRating) ? "scale-125" : ""
              ], "star-btn text-4xl transition-all duration-150 focus:outline-none"])}" data-v-62db03a8> ★ </button>`);
            });
            _push(`<!--]--></div>`);
            if (vueExports.unref(ratingLabel)) {
              _push(`<p class="${serverRenderer_cjs_prodExports.ssrRenderClass([{
                "text-red-500": vueExports.unref(displayRating) === 1,
                "text-orange-500": vueExports.unref(displayRating) === 2,
                "text-amber-500": vueExports.unref(displayRating) === 3,
                "text-emerald-500": vueExports.unref(displayRating) === 4,
                "text-green-600": vueExports.unref(displayRating) === 5
              }, "text-sm font-bold mt-2"])}" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ratingLabel))}</p>`);
            } else {
              _push(`<p class="text-xs text-slate-400 mt-2" data-v-62db03a8> Chọn số sao để đánh giá </p>`);
            }
            _push(`</div><div data-v-62db03a8><label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" data-v-62db03a8> Nhận xét (không bắt buộc) </label>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
              modelValue: vueExports.unref(ratingComment),
              "onUpdate:modelValue": ($event) => vueExports.isRef(ratingComment) ? ratingComment.value = $event : null,
              placeholder: "Chia sẻ trải nghiệm của bạn...",
              rows: 3,
              maxlength: 1e3,
              class: "w-full"
            }, null, _parent));
            _push(`<p class="text-right text-[11px] text-slate-300 mt-1" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ratingComment).length)}/1000 </p></div>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              size: "lg",
              block: "",
              loading: vueExports.unref(isSubmitting),
              disabled: vueExports.unref(selectedRating) < 1 || vueExports.unref(isSubmitting)
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Gửi đánh giá `);
                } else {
                  return [
                    vueExports.createTextVNode(" Gửi đánh giá ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</form></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="text-center py-6" data-v-62db03a8><p class="text-xs text-slate-400" data-v-62db03a8> Thần Nông — Hệ thống quản lý dịch vụ cư dân </p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
      serverRenderer_cjs_prodExports.ssrRenderTeleport(_push, (_push2) => {
        if (vueExports.unref(showStickyQuoteBar)) {
          _push2(`<div class="sticky-action-bar lg:hidden" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "padding-bottom": "env(safe-area-inset-bottom)" })}" data-v-62db03a8><div class="px-4 pt-3 pb-3 max-w-2xl mx-auto" data-v-62db03a8><div class="flex items-center justify-between mb-2.5" data-v-62db03a8><p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider" data-v-62db03a8> Báo giá chờ chấp thuận </p><p class="text-base font-extrabold text-slate-900" data-v-62db03a8>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ticket)?.quote?.total_amount ?? "0"))}</p></div><div class="flex gap-2.5" data-v-62db03a8>`);
          _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            color: "error",
            variant: "outline",
            size: "xl",
            class: "flex-1 justify-center min-h-[48px] font-semibold",
            icon: "i-lucide-x",
            onClick: ($event) => showRejectModal.value = true
          }, {
            default: vueExports.withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(` Từ chối `);
              } else {
                return [
                  vueExports.createTextVNode(" Từ chối ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            color: "success",
            size: "xl",
            class: "flex-[1.6] justify-center min-h-[48px] font-semibold",
            icon: "i-lucide-check",
            onClick: ($event) => showApproveModal.value = true
          }, {
            default: vueExports.withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(` Đồng ý `);
              } else {
                return [
                  vueExports.createTextVNode(" Đồng ý ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showApproveModal),
        "onUpdate:open": ($event) => vueExports.isRef(showApproveModal) ? showApproveModal.value = $event : null
      }, {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6" data-v-62db03a8${_scopeId}><div class="flex items-center gap-3 mb-4" data-v-62db03a8${_scopeId}><div class="size-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0" data-v-62db03a8${_scopeId}><span class="material-symbols-outlined text-emerald-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "20px", "font-variation-settings": "'FILL' 1" })}" data-v-62db03a8${_scopeId}>check_circle</span></div><div data-v-62db03a8${_scopeId}><h3 class="text-base font-bold text-slate-900" data-v-62db03a8${_scopeId}> Xác nhận chấp thuận báo giá </h3><p class="text-xs text-slate-500 mt-0.5" data-v-62db03a8${_scopeId}> Hành động này không thể hoàn tác. </p></div></div>`);
            if (vueExports.unref(ticket)?.quote) {
              _push2(`<div class="bg-slate-50 rounded-xl px-4 py-3 mb-5" data-v-62db03a8${_scopeId}><p class="text-xs text-slate-500 mb-1" data-v-62db03a8${_scopeId}> Tổng giá trị báo giá </p><p class="text-xl font-extrabold text-slate-900" data-v-62db03a8${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ticket).quote.total_amount))}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-sm text-slate-600 mb-5" data-v-62db03a8${_scopeId}> Sau khi chấp thuận, đội ngũ kỹ thuật sẽ tiến hành thực hiện công việc theo báo giá đã thỏa thuận. </p><div class="flex gap-3" data-v-62db03a8${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              size: "md",
              class: "flex-1",
              disabled: vueExports.unref(isQuoteSubmitting),
              onClick: ($event) => showApproveModal.value = false
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Huỷ `);
                } else {
                  return [
                    vueExports.createTextVNode(" Huỷ ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "success",
              size: "md",
              class: "flex-1",
              loading: vueExports.unref(isQuoteSubmitting),
              onClick: handleApprove
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Xác nhận đồng ý `);
                } else {
                  return [
                    vueExports.createTextVNode(" Xác nhận đồng ý ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "p-6" }, [
                vueExports.createVNode("div", { class: "flex items-center gap-3 mb-4" }, [
                  vueExports.createVNode("div", { class: "size-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0" }, [
                    vueExports.createVNode("span", {
                      class: "material-symbols-outlined text-emerald-500",
                      style: { "font-size": "20px", "font-variation-settings": "'FILL' 1" }
                    }, "check_circle")
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("h3", { class: "text-base font-bold text-slate-900" }, " Xác nhận chấp thuận báo giá "),
                    vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-0.5" }, " Hành động này không thể hoàn tác. ")
                  ])
                ]),
                vueExports.unref(ticket)?.quote ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "bg-slate-50 rounded-xl px-4 py-3 mb-5"
                }, [
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mb-1" }, " Tổng giá trị báo giá "),
                  vueExports.createVNode("p", { class: "text-xl font-extrabold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ticket).quote.total_amount)), 1)
                ])) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("p", { class: "text-sm text-slate-600 mb-5" }, " Sau khi chấp thuận, đội ngũ kỹ thuật sẽ tiến hành thực hiện công việc theo báo giá đã thỏa thuận. "),
                vueExports.createVNode("div", { class: "flex gap-3" }, [
                  vueExports.createVNode(_component_UButton, {
                    color: "neutral",
                    variant: "outline",
                    size: "md",
                    class: "flex-1",
                    disabled: vueExports.unref(isQuoteSubmitting),
                    onClick: ($event) => showApproveModal.value = false
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Huỷ ")
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    color: "success",
                    size: "md",
                    class: "flex-1",
                    loading: vueExports.unref(isQuoteSubmitting),
                    onClick: handleApprove
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Xác nhận đồng ý ")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showRejectModal),
        "onUpdate:open": ($event) => vueExports.isRef(showRejectModal) ? showRejectModal.value = $event : null
      }, {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6" data-v-62db03a8${_scopeId}><div class="flex items-center gap-3 mb-4" data-v-62db03a8${_scopeId}><div class="size-10 rounded-full bg-red-50 flex items-center justify-center shrink-0" data-v-62db03a8${_scopeId}><span class="material-symbols-outlined text-red-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "20px", "font-variation-settings": "'FILL' 1" })}" data-v-62db03a8${_scopeId}>cancel</span></div><div data-v-62db03a8${_scopeId}><h3 class="text-base font-bold text-slate-900" data-v-62db03a8${_scopeId}> Từ chối báo giá </h3><p class="text-xs text-slate-500 mt-0.5" data-v-62db03a8${_scopeId}> Hành động này không thể hoàn tác. </p></div></div><div class="mb-4" data-v-62db03a8${_scopeId}><label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" data-v-62db03a8${_scopeId}> Lý do từ chối <span class="text-red-400" data-v-62db03a8${_scopeId}>*</span></label>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
              modelValue: vueExports.unref(rejectReason),
              "onUpdate:modelValue": ($event) => vueExports.isRef(rejectReason) ? rejectReason.value = $event : null,
              placeholder: "Vui lòng cho chúng tôi biết lý do bạn từ chối báo giá này...",
              rows: 4,
              maxlength: 1e3,
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex items-center justify-between mt-1" data-v-62db03a8${_scopeId}>`);
            if (vueExports.unref(rejectReason).trim().length > 0 && vueExports.unref(rejectReason).trim().length < 5) {
              _push2(`<p class="text-[11px] text-red-400" data-v-62db03a8${_scopeId}> Tối thiểu 5 ký tự </p>`);
            } else {
              _push2(`<span data-v-62db03a8${_scopeId}></span>`);
            }
            _push2(`<p class="text-[11px] text-slate-300" data-v-62db03a8${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(rejectReason).length)}/1000 </p></div></div><div class="flex gap-3" data-v-62db03a8${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              size: "md",
              class: "flex-1",
              disabled: vueExports.unref(isQuoteSubmitting),
              onClick: ($event) => {
                showRejectModal.value = false;
                rejectReason.value = "";
              }
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Huỷ `);
                } else {
                  return [
                    vueExports.createTextVNode(" Huỷ ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "error",
              size: "md",
              class: "flex-1",
              loading: vueExports.unref(isQuoteSubmitting),
              disabled: vueExports.unref(rejectReason).trim().length < 5,
              onClick: handleReject
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Xác nhận từ chối `);
                } else {
                  return [
                    vueExports.createTextVNode(" Xác nhận từ chối ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "p-6" }, [
                vueExports.createVNode("div", { class: "flex items-center gap-3 mb-4" }, [
                  vueExports.createVNode("div", { class: "size-10 rounded-full bg-red-50 flex items-center justify-center shrink-0" }, [
                    vueExports.createVNode("span", {
                      class: "material-symbols-outlined text-red-500",
                      style: { "font-size": "20px", "font-variation-settings": "'FILL' 1" }
                    }, "cancel")
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("h3", { class: "text-base font-bold text-slate-900" }, " Từ chối báo giá "),
                    vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-0.5" }, " Hành động này không thể hoàn tác. ")
                  ])
                ]),
                vueExports.createVNode("div", { class: "mb-4" }, [
                  vueExports.createVNode("label", { class: "block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" }, [
                    vueExports.createTextVNode(" Lý do từ chối "),
                    vueExports.createVNode("span", { class: "text-red-400" }, "*")
                  ]),
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(rejectReason),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(rejectReason) ? rejectReason.value = $event : null,
                    placeholder: "Vui lòng cho chúng tôi biết lý do bạn từ chối báo giá này...",
                    rows: 4,
                    maxlength: 1e3,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode("div", { class: "flex items-center justify-between mt-1" }, [
                    vueExports.unref(rejectReason).trim().length > 0 && vueExports.unref(rejectReason).trim().length < 5 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-[11px] text-red-400"
                    }, " Tối thiểu 5 ký tự ")) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 })),
                    vueExports.createVNode("p", { class: "text-[11px] text-slate-300" }, vueExports.toDisplayString(vueExports.unref(rejectReason).length) + "/1000 ", 1)
                  ])
                ]),
                vueExports.createVNode("div", { class: "flex gap-3" }, [
                  vueExports.createVNode(_component_UButton, {
                    color: "neutral",
                    variant: "outline",
                    size: "md",
                    class: "flex-1",
                    disabled: vueExports.unref(isQuoteSubmitting),
                    onClick: ($event) => {
                      showRejectModal.value = false;
                      rejectReason.value = "";
                    }
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Huỷ ")
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    color: "error",
                    size: "md",
                    class: "flex-1",
                    loading: vueExports.unref(isQuoteSubmitting),
                    disabled: vueExports.unref(rejectReason).trim().length < 5,
                    onClick: handleReject
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Xác nhận từ chối ")
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showAcceptanceConfirmModal),
        "onUpdate:open": ($event) => vueExports.isRef(showAcceptanceConfirmModal) ? showAcceptanceConfirmModal.value = $event : null
      }, {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6" data-v-62db03a8${_scopeId}><div class="flex items-center gap-3 mb-4" data-v-62db03a8${_scopeId}><div class="size-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0" data-v-62db03a8${_scopeId}><span class="material-symbols-outlined text-emerald-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "20px", "font-variation-settings": "'FILL' 1" })}" data-v-62db03a8${_scopeId}>assignment_turned_in</span></div><div data-v-62db03a8${_scopeId}><h3 class="text-base font-bold text-slate-900" data-v-62db03a8${_scopeId}> Xác nhận biên bản nghiệm thu </h3><p class="text-xs text-slate-500 mt-0.5" data-v-62db03a8${_scopeId}> Ký tên để xác nhận công việc đã được hoàn tất. </p></div></div><div class="space-y-4" data-v-62db03a8${_scopeId}><div data-v-62db03a8${_scopeId}><label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" data-v-62db03a8${_scopeId}> Họ và tên <span class="text-red-400" data-v-62db03a8${_scopeId}>*</span></label>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
              modelValue: vueExports.unref(acceptanceSignatureName),
              "onUpdate:modelValue": ($event) => vueExports.isRef(acceptanceSignatureName) ? acceptanceSignatureName.value = $event : null,
              placeholder: "Nhập họ tên người xác nhận",
              maxlength: 255,
              class: "w-full"
            }, null, _parent2, _scopeId));
            if (vueExports.unref(acceptanceSignatureName).trim().length > 0 && vueExports.unref(acceptanceSignatureName).trim().length < 2) {
              _push2(`<p class="text-[11px] text-red-400 mt-1" data-v-62db03a8${_scopeId}> Tối thiểu 2 ký tự </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-62db03a8${_scopeId}><label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" data-v-62db03a8${_scopeId}> Ghi chú (không bắt buộc) </label>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
              modelValue: vueExports.unref(acceptanceNote),
              "onUpdate:modelValue": ($event) => vueExports.isRef(acceptanceNote) ? acceptanceNote.value = $event : null,
              placeholder: "Ghi chú thêm về quá trình nghiệm thu...",
              rows: 3,
              maxlength: 2e3,
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex gap-3 mt-5" data-v-62db03a8${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              size: "md",
              class: "flex-1",
              disabled: vueExports.unref(isAcceptanceSubmitting),
              onClick: ($event) => showAcceptanceConfirmModal.value = false
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Huỷ `);
                } else {
                  return [
                    vueExports.createTextVNode(" Huỷ ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "success",
              size: "md",
              class: "flex-1",
              loading: vueExports.unref(isAcceptanceSubmitting),
              disabled: vueExports.unref(acceptanceSignatureName).trim().length < 2,
              onClick: handleAcceptanceConfirm
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Xác nhận `);
                } else {
                  return [
                    vueExports.createTextVNode(" Xác nhận ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "p-6" }, [
                vueExports.createVNode("div", { class: "flex items-center gap-3 mb-4" }, [
                  vueExports.createVNode("div", { class: "size-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0" }, [
                    vueExports.createVNode("span", {
                      class: "material-symbols-outlined text-emerald-500",
                      style: { "font-size": "20px", "font-variation-settings": "'FILL' 1" }
                    }, "assignment_turned_in")
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("h3", { class: "text-base font-bold text-slate-900" }, " Xác nhận biên bản nghiệm thu "),
                    vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-0.5" }, " Ký tên để xác nhận công việc đã được hoàn tất. ")
                  ])
                ]),
                vueExports.createVNode("div", { class: "space-y-4" }, [
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("label", { class: "block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" }, [
                      vueExports.createTextVNode(" Họ và tên "),
                      vueExports.createVNode("span", { class: "text-red-400" }, "*")
                    ]),
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(acceptanceSignatureName),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(acceptanceSignatureName) ? acceptanceSignatureName.value = $event : null,
                      placeholder: "Nhập họ tên người xác nhận",
                      maxlength: 255,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.unref(acceptanceSignatureName).trim().length > 0 && vueExports.unref(acceptanceSignatureName).trim().length < 2 ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-[11px] text-red-400 mt-1"
                    }, " Tối thiểu 2 ký tự ")) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("div", null, [
                    vueExports.createVNode("label", { class: "block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" }, " Ghi chú (không bắt buộc) "),
                    vueExports.createVNode(_component_UTextarea, {
                      modelValue: vueExports.unref(acceptanceNote),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(acceptanceNote) ? acceptanceNote.value = $event : null,
                      placeholder: "Ghi chú thêm về quá trình nghiệm thu...",
                      rows: 3,
                      maxlength: 2e3,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                vueExports.createVNode("div", { class: "flex gap-3 mt-5" }, [
                  vueExports.createVNode(_component_UButton, {
                    color: "neutral",
                    variant: "outline",
                    size: "md",
                    class: "flex-1",
                    disabled: vueExports.unref(isAcceptanceSubmitting),
                    onClick: ($event) => showAcceptanceConfirmModal.value = false
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Huỷ ")
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    color: "success",
                    size: "md",
                    class: "flex-1",
                    loading: vueExports.unref(isAcceptanceSubmitting),
                    disabled: vueExports.unref(acceptanceSignatureName).trim().length < 2,
                    onClick: handleAcceptanceConfirm
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Xác nhận ")
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedTicketWarrantyRequestModal, {
        open: vueExports.unref(showWarrantyCreateModal),
        "onUpdate:open": ($event) => vueExports.isRef(showWarrantyCreateModal) ? showWarrantyCreateModal.value = $event : null,
        mode: "create",
        "ticket-code": vueExports.unref(code),
        onSubmitted: handleWarrantySubmitted
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedTicketWarrantyRequestModal, {
        open: vueExports.unref(showWarrantyViewModal),
        "onUpdate:open": ($event) => vueExports.isRef(showWarrantyViewModal) ? showWarrantyViewModal.value = $event : null,
        mode: "view",
        "ticket-code": vueExports.unref(code),
        request: vueExports.unref(selectedWarrantyRequest)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tickets/[code].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _code_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-62db03a8"]]);

export { _code_ as default };
//# sourceMappingURL=_code_-BTFyylv1.mjs.map
