import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$3 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$4 } from './DropdownMenu-67h96A8X.mjs';
import { v as vueExports, j as useToast, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as __nuxt_component_7 } from './RichTextEditor-CeP76v4Q.mjs';
import { _ as _sfc_main$5 } from './Modal-BimZZbNl.mjs';
import { u as useSettingsGroup, a as apiSaveSettings } from './useSettings-Bc7XNrjh.mjs';
import { A as ACCEPTANCE_REPORT_PLACEHOLDERS } from './useAcceptanceReports-lSZWdtC6.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import './Label-BBgw4vHh.mjs';
import './index-QmZAbLx-.mjs';
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
import './index-Bkkr_xbW.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './utils-DY0Zag2O.mjs';
import './useDirection-CXYby7CP.mjs';
import './useArrowNavigation-m9a1sGcE.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './useGraceArea-B6BTYtpN.mjs';
import './Kbd-T8yC2vfh.mjs';
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
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "acceptance-report",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const { data, status, error, refresh } = useSettingsGroup("acceptance_report");
    const settings = vueExports.computed(() => data.value?.data ?? {});
    const form = vueExports.reactive({
      template_title: "",
      template_html: ""
    });
    const formInitialized = vueExports.ref(false);
    const isSaving = vueExports.ref(false);
    vueExports.watch(settings, (val) => {
      if (!val || formInitialized.value) return;
      form.template_title = String(val.template_title ?? "Biên bản nghiệm thu");
      form.template_html = String(val.template_html ?? "");
      formInitialized.value = true;
    });
    function hasChanges() {
      const current = settings.value;
      const origTitle = current.template_title ?? "Biên bản nghiệm thu";
      const origHtml = current.template_html ?? "";
      return form.template_title !== origTitle || form.template_html !== origHtml;
    }
    const placeholderOptions = vueExports.computed(
      () => ACCEPTANCE_REPORT_PLACEHOLDERS.map((p) => ({
        label: `${p.label}  ·  ${p.token}`,
        onSelect: () => insertAtCaret(p.token)
      }))
    );
    function insertAtCaret(token) {
      form.template_html = (form.template_html ?? "") + ` ${token}`;
    }
    const isPreviewOpen = vueExports.ref(false);
    async function handleSave() {
      if (!hasChanges()) {
        toast.add({ title: "Không có thay đổi.", color: "neutral" });
        return;
      }
      isSaving.value = true;
      try {
        await apiSaveSettings("acceptance_report", [
          { key: "template_title", value: form.template_title },
          { key: "template_html", value: form.template_html ?? "" }
        ]);
        toast.add({ title: "Lưu template thành công.", color: "success" });
        await refresh();
        formInitialized.value = false;
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu template thất bại."), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    function handleReset() {
      formInitialized.value = false;
      const current = settings.value;
      form.template_title = String(current.template_title ?? "Biên bản nghiệm thu");
      form.template_html = String(current.template_html ?? "");
      formInitialized.value = true;
    }
    useSeoMeta({ title: "Template biên bản nghiệm thu" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UAlert = _sfc_main$3;
      const _component_UDropdownMenu = _sfc_main$4;
      const _component_UButton = _sfc_main$c;
      const _component_SharedRichTextEditor = __nuxt_component_7;
      const _component_UModal = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-5 sm:gap-6" }, _attrs))}><div class="flex items-center gap-3"><div class="min-w-0"><h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight"> Template biên bản nghiệm thu </h1><p class="text-slate-500 text-sm mt-0.5"> Template dùng khi lập biên bản nghiệm thu cho đơn hàng. Sử dụng các biến <code>{{biến}}</code> để chèn thông tin. </p></div></div>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="flex flex-col gap-4"><div class="h-64 bg-slate-100 rounded-xl animate-pulse"></div></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else {
        _push(`<div class="flex flex-col gap-4 sm:gap-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Tiêu đề" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Tiêu đề biên bản",
                name: "template_title"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(form).template_title,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).template_title = $event,
                      placeholder: "Biên bản nghiệm thu"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).template_title,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).template_title = $event,
                        placeholder: "Biên bản nghiệm thu"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UFormField, {
                  label: "Tiêu đề biên bản",
                  name: "template_title"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(form).template_title,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).template_title = $event,
                      placeholder: "Biên bản nghiệm thu"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Nội dung template" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-info",
                color: "info",
                variant: "subtle"
              }, {
                description: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Chèn biến bằng menu &quot;Chèn biến&quot; bên dưới. Khi lập biên bản cho một đơn hàng, các biến sẽ tự động được thay bằng thông tin của đơn. `);
                  } else {
                    return [
                      vueExports.createTextVNode(' Chèn biến bằng menu "Chèn biến" bên dưới. Khi lập biên bản cho một đơn hàng, các biến sẽ tự động được thay bằng thông tin của đơn. ')
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex items-center gap-2 flex-wrap"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UDropdownMenu, {
                items: [vueExports.unref(placeholderOptions)],
                popper: { placement: "bottom-start" }
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      label: "Chèn biến",
                      icon: "i-lucide-braces",
                      color: "primary",
                      variant: "soft",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        label: "Chèn biến",
                        icon: "i-lucide-braces",
                        color: "primary",
                        variant: "soft",
                        size: "sm"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Xem trước",
                icon: "i-lucide-eye",
                color: "neutral",
                variant: "soft",
                size: "sm",
                onClick: ($event) => isPreviewOpen.value = true
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-xs text-slate-500"${_scopeId}>Biến sẽ được thêm vào cuối. Bạn có thể cắt/dán đến vị trí mong muốn.</span></div><div class="border border-slate-200 rounded-lg"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedRichTextEditor, {
                modelValue: vueExports.unref(form).template_html,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).template_html = $event,
                placeholder: "Nhập nội dung template biên bản nghiệm thu...",
                "min-height": "420px"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "space-y-3" }, [
                  vueExports.createVNode(_component_UAlert, {
                    icon: "i-lucide-info",
                    color: "info",
                    variant: "subtle"
                  }, {
                    description: vueExports.withCtx(() => [
                      vueExports.createTextVNode(' Chèn biến bằng menu "Chèn biến" bên dưới. Khi lập biên bản cho một đơn hàng, các biến sẽ tự động được thay bằng thông tin của đơn. ')
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode("div", { class: "flex items-center gap-2 flex-wrap" }, [
                    vueExports.createVNode(_component_UDropdownMenu, {
                      items: [vueExports.unref(placeholderOptions)],
                      popper: { placement: "bottom-start" }
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UButton, {
                          label: "Chèn biến",
                          icon: "i-lucide-braces",
                          color: "primary",
                          variant: "soft",
                          size: "sm"
                        })
                      ]),
                      _: 1
                    }, 8, ["items"]),
                    vueExports.createVNode(_component_UButton, {
                      label: "Xem trước",
                      icon: "i-lucide-eye",
                      color: "neutral",
                      variant: "soft",
                      size: "sm",
                      onClick: ($event) => isPreviewOpen.value = true
                    }, null, 8, ["onClick"]),
                    vueExports.createVNode("span", { class: "text-xs text-slate-500" }, "Biến sẽ được thêm vào cuối. Bạn có thể cắt/dán đến vị trí mong muốn.")
                  ]),
                  vueExports.createVNode("div", { class: "border border-slate-200 rounded-lg" }, [
                    vueExports.createVNode(_component_SharedRichTextEditor, {
                      modelValue: vueExports.unref(form).template_html,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).template_html = $event,
                      placeholder: "Nhập nội dung template biên bản nghiệm thu...",
                      "min-height": "420px"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 flex items-center justify-end gap-3 z-10">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Đặt lại",
          color: "neutral",
          variant: "ghost",
          disabled: !hasChanges() || vueExports.unref(isSaving),
          onClick: handleReset
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Lưu template",
          icon: "i-lucide-save",
          color: "primary",
          loading: vueExports.unref(isSaving),
          disabled: !hasChanges(),
          onClick: handleSave
        }, null, _parent));
        _push(`</div></div>`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(isPreviewOpen),
        "onUpdate:open": ($event) => vueExports.isRef(isPreviewOpen) ? isPreviewOpen.value = $event : null,
        title: "Xem trước biên bản nghiệm thu",
        ui: { content: "max-w-4xl" }
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="prose prose-sm max-w-none max-h-[70vh] overflow-y-auto p-2"${_scopeId}>${vueExports.unref(form).template_html ?? ""}</div>`);
          } else {
            return [
              vueExports.createVNode("div", {
                class: "prose prose-sm max-w-none max-h-[70vh] overflow-y-auto p-2",
                innerHTML: vueExports.unref(form).template_html
              }, null, 8, ["innerHTML"])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-end w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Đóng",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => isPreviewOpen.value = false
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center justify-end w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Đóng",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => isPreviewOpen.value = false
                }, null, 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/settings/acceptance-report.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=acceptance-report-CjreEej8.mjs.map
