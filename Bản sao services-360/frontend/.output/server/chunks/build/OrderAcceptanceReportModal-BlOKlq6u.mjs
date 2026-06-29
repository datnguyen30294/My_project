import { v as vueExports, a as useAppConfig, X as reactivePick, W as useForwardPropsEmits, a8 as usePortal, t as tv, s as serverRenderer_cjs_prodExports, j as useToast, l as _sfc_main$c, k as _sfc_main$h } from './server.mjs';
import { n as defu } from '../nitro/nitro.mjs';
import { H as HoverCard, P as Popover } from './index-Bkkr_xbW.mjs';
import { _ as _sfc_main$2 } from './Modal-BimZZbNl.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as _sfc_main$3 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$4 } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_7 } from './RichTextEditor-CeP76v4Q.mjs';
import { _ as _sfc_main$5 } from './Textarea-DTCNHwKm.mjs';
import { _ as _sfc_main$6 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$7 } from './Alert-tTsPKADX.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { u as useAcceptanceReport, b as apiUpdateAcceptanceReport, c as apiDeleteSignedAcceptanceReport, d as apiRegenerateAcceptanceReport, e as apiUploadSignedAcceptanceReport } from './useAcceptanceReports-lSZWdtC6.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';

const theme = {
  "slots": {
    "content": "bg-default shadow-lg rounded-md ring ring-default data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-popover-content-transform-origin) focus:outline-none pointer-events-auto",
    "arrow": "fill-default"
  }
};
const _sfc_main$1 = {
  __name: "UPopover",
  __ssrInlineRender: true,
  props: {
    mode: { type: null, required: false, default: "click" },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    reference: { type: null, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false },
    modal: { type: Boolean, required: false },
    openDelay: { type: Number, required: false, default: 0 },
    closeDelay: { type: Number, required: false, default: 0 }
  },
  emits: ["close:prevent", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = vueExports.useSlots();
    const appConfig = useAppConfig();
    const pick = props.mode === "hover" ? reactivePick(props, "defaultOpen", "open", "openDelay", "closeDelay") : reactivePick(props, "defaultOpen", "open", "modal");
    const rootProps = useForwardPropsEmits(pick, emits);
    const portalProps = usePortal(vueExports.toRef(() => props.portal));
    const contentProps = vueExports.toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
    const contentEvents = vueExports.computed(() => {
      if (!props.dismissible) {
        const events = ["pointerDownOutside", "interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, {});
      }
      return {};
    });
    const arrowProps = vueExports.toRef(() => props.arrow);
    const ui = vueExports.computed(() => tv({ extend: tv(theme), ...appConfig.ui?.popover || {} })({
      side: contentProps.value.side
    }));
    const Component = vueExports.computed(() => props.mode === "hover" ? HoverCard : Popover);
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Component).Root, vueExports.mergeProps(vueExports.unref(rootProps), _attrs), {
        default: vueExports.withCtx(({ open, close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default || !!__props.reference) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Component).Trigger, {
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }, {
                default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      vueExports.renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if ("Anchor" in Component.value && !!slots.anchor) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Component).Anchor, { "as-child": "" }, {
                default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "anchor", close ? { close } : {}, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      vueExports.renderSlot(_ctx.$slots, "anchor", close ? { close } : {})
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Component).Portal, vueExports.unref(portalProps), {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Component).Content, vueExports.mergeProps(contentProps.value, {
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, vueExports.toHandlers(contentEvents.value)), {
                    default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "content", close ? { close } : {}, null, _push4, _parent4, _scopeId3);
                        if (!!__props.arrow) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Component).Arrow, vueExports.mergeProps(arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: props.ui?.arrow })
                          }), null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          vueExports.renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                          !!__props.arrow ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Component).Arrow, vueExports.mergeProps({ key: 0 }, arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: props.ui?.arrow })
                          }), null, 16, ["class"])) : vueExports.createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(vueExports.unref(Component).Content, vueExports.mergeProps(contentProps.value, {
                      "data-slot": "content",
                      class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                    }, vueExports.toHandlers(contentEvents.value)), {
                      default: vueExports.withCtx(() => [
                        vueExports.renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                        !!__props.arrow ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Component).Arrow, vueExports.mergeProps({ key: 0 }, arrowProps.value, {
                          "data-slot": "arrow",
                          class: ui.value.arrow({ class: props.ui?.arrow })
                        }), null, 16, ["class"])) : vueExports.createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1040, ["class"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default || !!__props.reference ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Component).Trigger, {
                key: 0,
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1032, ["reference", "class"])) : vueExports.createCommentVNode("", true),
              "Anchor" in Component.value && !!slots.anchor ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Component).Anchor, {
                key: 1,
                "as-child": ""
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.renderSlot(_ctx.$slots, "anchor", close ? { close } : {})
                ]),
                _: 2
              }, 1024)) : vueExports.createCommentVNode("", true),
              vueExports.createVNode(vueExports.unref(Component).Portal, vueExports.unref(portalProps), {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(vueExports.unref(Component).Content, vueExports.mergeProps(contentProps.value, {
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, vueExports.toHandlers(contentEvents.value)), {
                    default: vueExports.withCtx(() => [
                      vueExports.renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                      !!__props.arrow ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Component).Arrow, vueExports.mergeProps({ key: 0 }, arrowProps.value, {
                        "data-slot": "arrow",
                        class: ui.value.arrow({ class: props.ui?.arrow })
                      }), null, 16, ["class"])) : vueExports.createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1040, ["class"])
                ]),
                _: 2
              }, 1040)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.4.0_@tiptap+extensions@3.22.2_@tiptap+core@3.22.2_@tiptap+pm@3.22.2__@tiptap_ff602f8142f0ba128c11c1e82cd47490/node_modules/@nuxt/ui/dist/runtime/components/Popover.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ACCEPTED_SIGNED_MIME = "application/pdf,image/jpeg,image/png";
const MAX_SIGNED_SIZE = 20 * 1024 * 1024;
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "OrderAcceptanceReportModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    orderId: {}
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const orderIdRef = vueExports.computed(() => props.orderId);
    const { data, status, error, refresh } = useAcceptanceReport(orderIdRef);
    const report = vueExports.computed(() => data.value?.data);
    const form = vueExports.reactive({
      content_html: "",
      customer_name: "",
      customer_phone: "",
      note: ""
    });
    const initialized = vueExports.ref(false);
    const isSaving = vueExports.ref(false);
    const isRegenerating = vueExports.ref(false);
    const confirmRegenerateOpen = vueExports.ref(false);
    const signedFileInput = vueExports.ref(null);
    const isUploadingSigned = vueExports.ref(false);
    const isDeletingSigned = vueExports.ref(false);
    const confirmDeleteSignedOpen = vueExports.ref(false);
    const isDraggingSigned = vueExports.ref(false);
    function formatBytes(bytes) {
      if (!bytes) return "";
      if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
      return `${bytes} B`;
    }
    const signedFileIsImage = vueExports.computed(() => {
      const mime = report.value?.signed_file_mime;
      return !!mime && mime.startsWith("image/");
    });
    const signedFileIsPdf = vueExports.computed(() => report.value?.signed_file_mime === "application/pdf");
    function triggerUploadSigned() {
      signedFileInput.value?.click();
    }
    async function uploadSignedFile(file) {
      if (file.size > MAX_SIGNED_SIZE) {
        toast.add({ title: "Kích thước tệp tối đa 20MB.", color: "error" });
        return;
      }
      const allowed = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowed.includes(file.type)) {
        toast.add({ title: "Chỉ chấp nhận PDF, JPG hoặc PNG.", color: "error" });
        return;
      }
      isUploadingSigned.value = true;
      try {
        await apiUploadSignedAcceptanceReport(props.orderId, file);
        toast.add({ title: "Đã tải lên biên bản đã ký.", color: "success" });
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Tải lên thất bại."), color: "error" });
      } finally {
        isUploadingSigned.value = false;
      }
    }
    function handleSignedDrop(event) {
      isDraggingSigned.value = false;
      const file = event.dataTransfer?.files?.[0];
      if (file) void uploadSignedFile(file);
    }
    async function handleSignedFileSelected(event) {
      const target = event.target;
      const file = target.files?.[0];
      if (!file) return;
      await uploadSignedFile(file);
      target.value = "";
    }
    async function handleDeleteSigned() {
      isDeletingSigned.value = true;
      try {
        await apiDeleteSignedAcceptanceReport(props.orderId);
        toast.add({ title: "Đã xoá biên bản đã ký.", color: "success" });
        confirmDeleteSignedOpen.value = false;
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Xoá thất bại."), color: "error" });
      } finally {
        isDeletingSigned.value = false;
      }
    }
    vueExports.watch(report, (val) => {
      if (!val || initialized.value) return;
      form.content_html = val.content_html ?? "";
      form.customer_name = val.customer_name ?? "";
      form.customer_phone = val.customer_phone ?? "";
      form.note = val.note ?? "";
      initialized.value = true;
    }, { immediate: true });
    vueExports.watch(() => props.open, (val) => {
      if (!val) {
        initialized.value = false;
      }
    });
    const shareUrl = vueExports.computed(() => {
      report.value?.share_token;
      return "";
    });
    async function handleSave() {
      isSaving.value = true;
      try {
        await apiUpdateAcceptanceReport(props.orderId, {
          content_html: form.content_html,
          customer_name: form.customer_name || null,
          customer_phone: form.customer_phone || null,
          note: form.note || null
        });
        toast.add({ title: "Đã lưu biên bản.", color: "success" });
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu biên bản thất bại."), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    async function handleRegenerate() {
      isRegenerating.value = true;
      try {
        const res = await apiRegenerateAcceptanceReport(props.orderId);
        form.content_html = res.data?.content_html ?? "";
        toast.add({ title: "Đã tạo lại biên bản từ template.", color: "success" });
        await refresh();
        confirmRegenerateOpen.value = false;
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Tạo lại biên bản thất bại."), color: "error" });
      } finally {
        isRegenerating.value = false;
      }
    }
    async function handleCopyShareLink() {
      if (!shareUrl.value) return;
      try {
        await (void 0).clipboard.writeText(shareUrl.value);
        toast.add({ title: "Đã sao chép link chia sẻ.", color: "success" });
      } catch {
        toast.add({ title: "Không sao chép được. Vui lòng copy thủ công.", color: "warning" });
      }
    }
    function handleOpenShareLink() {
      if (!shareUrl.value) return;
      (void 0).open(shareUrl.value, "_blank", "noopener");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$2;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UIcon = _sfc_main$h;
      const _component_UInput = _sfc_main$3;
      const _component_UButton = _sfc_main$c;
      const _component_UFormField = _sfc_main$4;
      const _component_SharedRichTextEditor = __nuxt_component_7;
      const _component_UTextarea = _sfc_main$5;
      const _component_UBadge = _sfc_main$6;
      const _component_UAlert = _sfc_main$7;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: __props.open,
        title: "Biên bản nghiệm thu",
        ui: { content: "max-w-[1200px]" },
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(status) === "pending") {
              _push2(`<div class="space-y-3"${_scopeId}><div class="h-6 bg-slate-100 rounded animate-pulse"${_scopeId}></div><div class="h-48 bg-slate-100 rounded animate-pulse"${_scopeId}></div></div>`);
            } else if (vueExports.unref(error)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
                error: vueExports.unref(error),
                retry: vueExports.unref(refresh)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="grid grid-cols-1 lg:grid-cols-5 gap-6"${_scopeId}><section class="lg:col-span-3 space-y-4"${_scopeId}><div class="flex items-center gap-2 pb-2 border-b border-slate-100"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-file-pen",
                class: "text-slate-400 size-4"
              }, null, _parent2, _scopeId));
              _push2(`<h3 class="text-sm font-bold text-slate-800"${_scopeId}> Nội dung biên bản </h3></div>`);
              if (vueExports.unref(shareUrl)) {
                _push2(`<div class="flex items-center gap-2 text-sm"${_scopeId}><span class="text-slate-500 shrink-0 text-xs font-semibold uppercase tracking-wider"${_scopeId}> Link chia sẻ </span>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                  "model-value": vueExports.unref(shareUrl),
                  readonly: "",
                  class: "flex-1 min-w-0",
                  size: "sm"
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-copy",
                  color: "primary",
                  variant: "soft",
                  size: "sm",
                  onClick: handleCopyShareLink
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-external-link",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  onClick: handleOpenShareLink
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Họ tên bên A" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(form).customer_name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).customer_name = $event,
                      placeholder: "Nguyễn Văn A"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).customer_name,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).customer_name = $event,
                        placeholder: "Nguyễn Văn A"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Điện thoại bên A" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(form).customer_phone,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).customer_phone = $event,
                      placeholder: "0912xxxxxx"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).customer_phone,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).customer_phone = $event,
                        placeholder: "0912xxxxxx"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Nội dung biên bản" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="border border-slate-200 rounded-lg"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedRichTextEditor, {
                      modelValue: vueExports.unref(form).content_html,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).content_html = $event,
                      placeholder: "Nội dung biên bản nghiệm thu...",
                      "min-height": "420px"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "border border-slate-200 rounded-lg" }, [
                        vueExports.createVNode(_component_SharedRichTextEditor, {
                          modelValue: vueExports.unref(form).content_html,
                          "onUpdate:modelValue": ($event) => vueExports.unref(form).content_html = $event,
                          placeholder: "Nội dung biên bản nghiệm thu...",
                          "min-height": "420px"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                      modelValue: vueExports.unref(form).note,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
                      rows: 2,
                      placeholder: "Ghi chú bổ sung nếu có..."
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(form).note,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
                        rows: 2,
                        placeholder: "Ghi chú bổ sung nếu có..."
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</section><aside class="lg:col-span-2 flex flex-col"${_scopeId}><div class="flex items-center justify-between pb-2 border-b border-slate-100 mb-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-file-signature",
                class: "text-slate-400 size-4"
              }, null, _parent2, _scopeId));
              _push2(`<h3 class="text-sm font-bold text-slate-800"${_scopeId}> Biên bản đã ký </h3></div>`);
              if (vueExports.unref(report)?.is_confirmed) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  color: "success",
                  variant: "subtle",
                  size: "xs",
                  icon: "i-lucide-check-circle"
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Cư dân đã xác nhận `);
                    } else {
                      return [
                        vueExports.createTextVNode(" Cư dân đã xác nhận ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (vueExports.unref(report)?.is_confirmed && vueExports.unref(report)?.confirmed_signature_name) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  color: "success",
                  variant: "subtle",
                  icon: "i-lucide-user-check",
                  title: vueExports.unref(report).confirmed_signature_name,
                  description: vueExports.unref(report).confirmed_at ? `Xác nhận online lúc ${("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(report).confirmed_at)}` : void 0,
                  class: "mb-4"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<input type="file"${serverRenderer_cjs_prodExports.ssrRenderAttr("accept", ACCEPTED_SIGNED_MIME)} class="hidden"${_scopeId}>`);
              if (vueExports.unref(report)?.has_signed_file && vueExports.unref(report)?.signed_file_url) {
                _push2(`<div class="flex flex-col gap-3 flex-1"${_scopeId}><div class="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden"${_scopeId}>`);
                if (vueExports.unref(signedFileIsPdf)) {
                  _push2(`<iframe${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(report).signed_file_url)} class="w-full h-[420px] bg-white" title="Biên bản đã ký"${_scopeId}></iframe>`);
                } else if (vueExports.unref(signedFileIsImage)) {
                  _push2(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", vueExports.unref(report).signed_file_url)} target="_blank" rel="noopener" class="block"${_scopeId}><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(report).signed_file_url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", vueExports.unref(report).signed_file_original_name ?? "Biên bản đã ký")} class="w-full max-h-[420px] object-contain bg-white"${_scopeId}></a>`);
                } else {
                  _push2(`<div class="flex items-center justify-center h-[420px] text-slate-400 text-sm"${_scopeId}> Không hỗ trợ xem trước định dạng này. </div>`);
                }
                _push2(`</div><div class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50"${_scopeId}><div class="size-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-file-check",
                  class: "text-emerald-500 size-4"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><p class="text-sm font-semibold text-slate-800 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(report).signed_file_original_name ?? "Biên bản đã ký")}</p><p class="text-xs text-slate-500 mt-0.5"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatBytes(vueExports.unref(report).signed_file_size))} `);
                if (vueExports.unref(report).signed_uploaded_at) {
                  _push2(`<!--[--> · ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(report).signed_uploaded_at))}<!--]-->`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</p></div></div><div class="flex gap-2"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  to: vueExports.unref(report).signed_file_url,
                  target: "_blank",
                  icon: "i-lucide-external-link",
                  color: "neutral",
                  variant: "outline",
                  size: "sm",
                  label: "Mở tab mới",
                  class: "flex-1 justify-center"
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-refresh-cw",
                  color: "primary",
                  variant: "soft",
                  size: "sm",
                  loading: vueExports.unref(isUploadingSigned),
                  label: "Thay thế",
                  class: "flex-1 justify-center",
                  onClick: triggerUploadSigned
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-trash-2",
                  color: "error",
                  variant: "ghost",
                  size: "sm",
                  loading: vueExports.unref(isDeletingSigned),
                  onClick: ($event) => confirmDeleteSignedOpen.value = true
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                _push2(`<button type="button" class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(isDraggingSigned) ? "border-primary-400 bg-primary-50/50" : "border-slate-200 bg-slate-50/50 hover:border-primary-300 hover:bg-primary-50/30", "group flex-1 flex flex-col items-center justify-center gap-3 min-h-[420px] rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors"])}"${_scopeId}><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(isDraggingSigned) ? "bg-primary-100" : "bg-white border border-slate-200 group-hover:border-primary-300", "size-14 rounded-2xl flex items-center justify-center transition-colors"])}"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-cloud-upload",
                  class: ["size-7", vueExports.unref(isDraggingSigned) ? "text-primary-500" : "text-slate-400 group-hover:text-primary-500"]
                }, null, _parent2, _scopeId));
                _push2(`</div><div${_scopeId}><p class="text-sm font-semibold text-slate-700"${_scopeId}> Kéo-thả hoặc bấm để tải lên </p><p class="text-xs text-slate-500 mt-1"${_scopeId}> PDF, JPG hoặc PNG — tối đa 20MB </p></div>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-upload",
                  color: "primary",
                  variant: "solid",
                  size: "sm",
                  loading: vueExports.unref(isUploadingSigned),
                  label: "Chọn tệp",
                  as: "span"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              }
              _push2(`</aside></div>`);
            }
          } else {
            return [
              vueExports.unref(status) === "pending" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                vueExports.createVNode("div", { class: "h-6 bg-slate-100 rounded animate-pulse" }),
                vueExports.createVNode("div", { class: "h-48 bg-slate-100 rounded animate-pulse" })
              ])) : vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedCrudPageError, {
                key: 1,
                error: vueExports.unref(error),
                retry: vueExports.unref(refresh)
              }, null, 8, ["error", "retry"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 2,
                class: "grid grid-cols-1 lg:grid-cols-5 gap-6"
              }, [
                vueExports.createVNode("section", { class: "lg:col-span-3 space-y-4" }, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2 pb-2 border-b border-slate-100" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-file-pen",
                      class: "text-slate-400 size-4"
                    }),
                    vueExports.createVNode("h3", { class: "text-sm font-bold text-slate-800" }, " Nội dung biên bản ")
                  ]),
                  vueExports.unref(shareUrl) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "flex items-center gap-2 text-sm"
                  }, [
                    vueExports.createVNode("span", { class: "text-slate-500 shrink-0 text-xs font-semibold uppercase tracking-wider" }, " Link chia sẻ "),
                    vueExports.createVNode(_component_UInput, {
                      "model-value": vueExports.unref(shareUrl),
                      readonly: "",
                      class: "flex-1 min-w-0",
                      size: "sm"
                    }, null, 8, ["model-value"]),
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-copy",
                      color: "primary",
                      variant: "soft",
                      size: "sm",
                      onClick: handleCopyShareLink
                    }),
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-external-link",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      onClick: handleOpenShareLink
                    })
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, [
                    vueExports.createVNode(_component_UFormField, { label: "Họ tên bên A" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(form).customer_name,
                          "onUpdate:modelValue": ($event) => vueExports.unref(form).customer_name = $event,
                          placeholder: "Nguyễn Văn A"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_UFormField, { label: "Điện thoại bên A" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(form).customer_phone,
                          "onUpdate:modelValue": ($event) => vueExports.unref(form).customer_phone = $event,
                          placeholder: "0912xxxxxx"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  vueExports.createVNode(_component_UFormField, { label: "Nội dung biên bản" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", { class: "border border-slate-200 rounded-lg" }, [
                        vueExports.createVNode(_component_SharedRichTextEditor, {
                          modelValue: vueExports.unref(form).content_html,
                          "onUpdate:modelValue": ($event) => vueExports.unref(form).content_html = $event,
                          placeholder: "Nội dung biên bản nghiệm thu...",
                          "min-height": "420px"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, { label: "Ghi chú" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(form).note,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).note = $event,
                        rows: 2,
                        placeholder: "Ghi chú bổ sung nếu có..."
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                vueExports.createVNode("aside", { class: "lg:col-span-2 flex flex-col" }, [
                  vueExports.createVNode("div", { class: "flex items-center justify-between pb-2 border-b border-slate-100 mb-4" }, [
                    vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-file-signature",
                        class: "text-slate-400 size-4"
                      }),
                      vueExports.createVNode("h3", { class: "text-sm font-bold text-slate-800" }, " Biên bản đã ký ")
                    ]),
                    vueExports.unref(report)?.is_confirmed ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      color: "success",
                      variant: "subtle",
                      size: "xs",
                      icon: "i-lucide-check-circle"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" Cư dân đã xác nhận ")
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.unref(report)?.is_confirmed && vueExports.unref(report)?.confirmed_signature_name ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 0,
                    color: "success",
                    variant: "subtle",
                    icon: "i-lucide-user-check",
                    title: vueExports.unref(report).confirmed_signature_name,
                    description: vueExports.unref(report).confirmed_at ? `Xác nhận online lúc ${("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(report).confirmed_at)}` : void 0,
                    class: "mb-4"
                  }, null, 8, ["title", "description"])) : vueExports.createCommentVNode("", true),
                  vueExports.createVNode("input", {
                    ref_key: "signedFileInput",
                    ref: signedFileInput,
                    type: "file",
                    accept: ACCEPTED_SIGNED_MIME,
                    class: "hidden",
                    onChange: handleSignedFileSelected
                  }, null, 544),
                  vueExports.unref(report)?.has_signed_file && vueExports.unref(report)?.signed_file_url ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "flex flex-col gap-3 flex-1"
                  }, [
                    vueExports.createVNode("div", { class: "rounded-xl border border-slate-200 bg-slate-50 overflow-hidden" }, [
                      vueExports.unref(signedFileIsPdf) ? (vueExports.openBlock(), vueExports.createBlock("iframe", {
                        key: 0,
                        src: vueExports.unref(report).signed_file_url,
                        class: "w-full h-[420px] bg-white",
                        title: "Biên bản đã ký"
                      }, null, 8, ["src"])) : vueExports.unref(signedFileIsImage) ? (vueExports.openBlock(), vueExports.createBlock("a", {
                        key: 1,
                        href: vueExports.unref(report).signed_file_url,
                        target: "_blank",
                        rel: "noopener",
                        class: "block"
                      }, [
                        vueExports.createVNode("img", {
                          src: vueExports.unref(report).signed_file_url,
                          alt: vueExports.unref(report).signed_file_original_name ?? "Biên bản đã ký",
                          class: "w-full max-h-[420px] object-contain bg-white"
                        }, null, 8, ["src", "alt"])
                      ], 8, ["href"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 2,
                        class: "flex items-center justify-center h-[420px] text-slate-400 text-sm"
                      }, " Không hỗ trợ xem trước định dạng này. "))
                    ]),
                    vueExports.createVNode("div", { class: "flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50" }, [
                      vueExports.createVNode("div", { class: "size-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0" }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-file-check",
                          class: "text-emerald-500 size-4"
                        })
                      ]),
                      vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                        vueExports.createVNode("p", { class: "text-sm font-semibold text-slate-800 truncate" }, vueExports.toDisplayString(vueExports.unref(report).signed_file_original_name ?? "Biên bản đã ký"), 1),
                        vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-0.5" }, [
                          vueExports.createTextVNode(vueExports.toDisplayString(formatBytes(vueExports.unref(report).signed_file_size)) + " ", 1),
                          vueExports.unref(report).signed_uploaded_at ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                            vueExports.createTextVNode(" · " + vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(report).signed_uploaded_at)), 1)
                          ], 64)) : vueExports.createCommentVNode("", true)
                        ])
                      ])
                    ]),
                    vueExports.createVNode("div", { class: "flex gap-2" }, [
                      vueExports.createVNode(_component_UButton, {
                        to: vueExports.unref(report).signed_file_url,
                        target: "_blank",
                        icon: "i-lucide-external-link",
                        color: "neutral",
                        variant: "outline",
                        size: "sm",
                        label: "Mở tab mới",
                        class: "flex-1 justify-center"
                      }, null, 8, ["to"]),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-refresh-cw",
                        color: "primary",
                        variant: "soft",
                        size: "sm",
                        loading: vueExports.unref(isUploadingSigned),
                        label: "Thay thế",
                        class: "flex-1 justify-center",
                        onClick: triggerUploadSigned
                      }, null, 8, ["loading"]),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-trash-2",
                        color: "error",
                        variant: "ghost",
                        size: "sm",
                        loading: vueExports.unref(isDeletingSigned),
                        onClick: ($event) => confirmDeleteSignedOpen.value = true
                      }, null, 8, ["loading", "onClick"])
                    ])
                  ])) : (vueExports.openBlock(), vueExports.createBlock("button", {
                    key: 2,
                    type: "button",
                    class: ["group flex-1 flex flex-col items-center justify-center gap-3 min-h-[420px] rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors", vueExports.unref(isDraggingSigned) ? "border-primary-400 bg-primary-50/50" : "border-slate-200 bg-slate-50/50 hover:border-primary-300 hover:bg-primary-50/30"],
                    onClick: triggerUploadSigned,
                    onDragover: vueExports.withModifiers(($event) => isDraggingSigned.value = true, ["prevent"]),
                    onDragenter: vueExports.withModifiers(($event) => isDraggingSigned.value = true, ["prevent"]),
                    onDragleave: vueExports.withModifiers(($event) => isDraggingSigned.value = false, ["prevent"]),
                    onDrop: vueExports.withModifiers(handleSignedDrop, ["prevent"])
                  }, [
                    vueExports.createVNode("div", {
                      class: ["size-14 rounded-2xl flex items-center justify-center transition-colors", vueExports.unref(isDraggingSigned) ? "bg-primary-100" : "bg-white border border-slate-200 group-hover:border-primary-300"]
                    }, [
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-cloud-upload",
                        class: ["size-7", vueExports.unref(isDraggingSigned) ? "text-primary-500" : "text-slate-400 group-hover:text-primary-500"]
                      }, null, 8, ["class"])
                    ], 2),
                    vueExports.createVNode("div", null, [
                      vueExports.createVNode("p", { class: "text-sm font-semibold text-slate-700" }, " Kéo-thả hoặc bấm để tải lên "),
                      vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " PDF, JPG hoặc PNG — tối đa 20MB ")
                    ]),
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-upload",
                      color: "primary",
                      variant: "solid",
                      size: "sm",
                      loading: vueExports.unref(isUploadingSigned),
                      label: "Chọn tệp",
                      as: "span"
                    }, null, 8, ["loading"])
                  ], 42, ["onDragover", "onDragenter", "onDragleave"]))
                ])
              ]))
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Đóng",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Tạo lại từ template",
              icon: "i-lucide-refresh-cw",
              color: "neutral",
              variant: "outline",
              disabled: !vueExports.unref(report),
              onClick: ($event) => confirmRegenerateOpen.value = true
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Lưu",
              icon: "i-lucide-save",
              color: "primary",
              loading: vueExports.unref(isSaving),
              onClick: handleSave
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Mở trang in",
              icon: "i-lucide-printer",
              color: "success",
              disabled: !vueExports.unref(shareUrl),
              onClick: handleOpenShareLink
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center justify-between gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Đóng",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["onClick"]),
                vueExports.createVNode("div", { class: "flex gap-2" }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Tạo lại từ template",
                    icon: "i-lucide-refresh-cw",
                    color: "neutral",
                    variant: "outline",
                    disabled: !vueExports.unref(report),
                    onClick: ($event) => confirmRegenerateOpen.value = true
                  }, null, 8, ["disabled", "onClick"]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Lưu",
                    icon: "i-lucide-save",
                    color: "primary",
                    loading: vueExports.unref(isSaving),
                    onClick: handleSave
                  }, null, 8, ["loading"]),
                  vueExports.createVNode(_component_UButton, {
                    label: "Mở trang in",
                    icon: "i-lucide-printer",
                    color: "success",
                    disabled: !vueExports.unref(shareUrl),
                    onClick: handleOpenShareLink
                  }, null, 8, ["disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(confirmDeleteSignedOpen),
        "onUpdate:open": ($event) => vueExports.isRef(confirmDeleteSignedOpen) ? confirmDeleteSignedOpen.value = $event : null,
        title: "Xoá biên bản đã ký?",
        ui: { content: "max-w-md" }
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "warning",
              variant: "subtle",
              icon: "i-lucide-triangle-alert",
              title: "Tệp đã tải lên sẽ bị xoá",
              description: "Hành động này không thể hoàn tác."
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UAlert, {
                color: "warning",
                variant: "subtle",
                icon: "i-lucide-triangle-alert",
                title: "Tệp đã tải lên sẽ bị xoá",
                description: "Hành động này không thể hoàn tác."
              })
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "ghost",
              disabled: vueExports.unref(isDeletingSigned),
              onClick: ($event) => confirmDeleteSignedOpen.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xoá",
              icon: "i-lucide-trash-2",
              color: "error",
              loading: vueExports.unref(isDeletingSigned),
              onClick: handleDeleteSigned
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "ghost",
                  disabled: vueExports.unref(isDeletingSigned),
                  onClick: ($event) => confirmDeleteSignedOpen.value = false
                }, null, 8, ["disabled", "onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xoá",
                  icon: "i-lucide-trash-2",
                  color: "error",
                  loading: vueExports.unref(isDeletingSigned),
                  onClick: handleDeleteSigned
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(confirmRegenerateOpen),
        "onUpdate:open": ($event) => vueExports.isRef(confirmRegenerateOpen) ? confirmRegenerateOpen.value = $event : null,
        title: "Tạo lại biên bản từ template?",
        ui: { content: "max-w-md" }
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
              color: "warning",
              variant: "subtle",
              icon: "i-lucide-triangle-alert",
              title: "Nội dung biên bản hiện tại sẽ bị ghi đè",
              description: "Toàn bộ nội dung đã chỉnh sửa tay trong biên bản sẽ bị thay thế bằng template hiện hành. Họ tên bên A, điện thoại, ghi chú và link chia sẻ được giữ nguyên."
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UAlert, {
                color: "warning",
                variant: "subtle",
                icon: "i-lucide-triangle-alert",
                title: "Nội dung biên bản hiện tại sẽ bị ghi đè",
                description: "Toàn bộ nội dung đã chỉnh sửa tay trong biên bản sẽ bị thay thế bằng template hiện hành. Họ tên bên A, điện thoại, ghi chú và link chia sẻ được giữ nguyên."
              })
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "ghost",
              disabled: vueExports.unref(isRegenerating),
              onClick: ($event) => confirmRegenerateOpen.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Tạo lại",
              icon: "i-lucide-refresh-cw",
              color: "warning",
              loading: vueExports.unref(isRegenerating),
              onClick: handleRegenerate
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "ghost",
                  disabled: vueExports.unref(isRegenerating),
                  onClick: ($event) => confirmRegenerateOpen.value = false
                }, null, 8, ["disabled", "onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Tạo lại",
                  icon: "i-lucide-refresh-cw",
                  color: "warning",
                  loading: vueExports.unref(isRegenerating),
                  onClick: handleRegenerate
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/order/OrderAcceptanceReportModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_16 = Object.assign(_sfc_main, { __name: "SharedOrderAcceptanceReportModal" });

export { __nuxt_component_16 as _, _sfc_main$1 as a };
//# sourceMappingURL=OrderAcceptanceReportModal-BlOKlq6u.mjs.map
