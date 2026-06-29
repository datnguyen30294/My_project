import { v as vueExports, p as useRoute$1, j as useToast, u as useSeoMeta, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4, k as _sfc_main$h, l as _sfc_main$c } from './server.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$1 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$3 } from './Switch-1cJNH-6C.mjs';
import { _ as __nuxt_component_7 } from './RichTextEditor-CeP76v4Q.mjs';
import { b as POLICY_TYPE_LABELS, c as usePolicyDetail, d as apiUploadPolicyImage, e as apiUpdatePolicy } from './usePolicies-fLtp10Zn.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './Label-BBgw4vHh.mjs';
import './index-QmZAbLx-.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
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

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[type]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const toast = useToast();
    const policyType = vueExports.computed(() => route.params.type);
    const typeLabel = vueExports.computed(() => POLICY_TYPE_LABELS[policyType.value] ?? policyType.value);
    useSeoMeta({ title: vueExports.computed(() => `Chỉnh sửa ${typeLabel.value}`) });
    const { data, status, error, refresh } = usePolicyDetail(policyType);
    const policy = vueExports.computed(() => data.value?.data);
    const form = vueExports.reactive({
      title: "",
      content: "",
      is_published: false
    });
    const formInitialized = vueExports.ref(false);
    const isSaving = vueExports.ref(false);
    vueExports.watch(policy, (val) => {
      if (!val || formInitialized.value) return;
      form.title = val.title ?? "";
      form.content = val.content ?? "";
      form.is_published = val.is_published ?? false;
      formInitialized.value = true;
    });
    async function handleUploadImage(file) {
      const res = await apiUploadPolicyImage(file);
      return res.data.url;
    }
    async function handleSave() {
      if (!form.title.trim()) {
        toast.add({ title: "Vui lòng nhập tiêu đề.", color: "error" });
        return;
      }
      if (!form.content?.trim()) {
        toast.add({ title: "Vui lòng nhập nội dung.", color: "error" });
        return;
      }
      isSaving.value = true;
      try {
        await apiUpdatePolicy(policyType.value, {
          title: form.title,
          content: form.content ?? "",
          is_published: form.is_published
        });
        toast.add({ title: "Lưu chính sách thành công.", color: "success" });
        formInitialized.value = false;
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu chính sách thất bại."), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_USwitch = _sfc_main$3;
      const _component_SharedRichTextEditor = __nuxt_component_7;
      const _component_UButton = _sfc_main$c;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-5 sm:gap-6" }, _attrs))}><div class="flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/pmc/policies",
        class: "p-2 rounded-lg hover:bg-slate-100 transition-colors"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "size-5 text-slate-600"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "size-5 text-slate-600"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="min-w-0"><h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(typeLabel))}</h1><p class="text-slate-500 text-sm mt-0.5"> Chỉnh sửa nội dung ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(typeLabel).toLowerCase())}. </p></div></div>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="flex flex-col gap-4"><div class="h-16 bg-slate-100 rounded-xl animate-pulse"></div><div class="h-80 bg-slate-100 rounded-xl animate-pulse"></div></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else {
        _push(`<div class="flex flex-col gap-4 sm:gap-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: `Thông tin ${vueExports.unref(typeLabel).toLowerCase()}`
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Tiêu đề",
                name: "title",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(form).title,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).title = $event,
                      placeholder: "Nhập tiêu đề...",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).title,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).title = $event,
                        placeholder: "Nhập tiêu đề...",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Xuất bản",
                name: "is_published"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USwitch, {
                      modelValue: vueExports.unref(form).is_published,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).is_published = $event,
                      label: "Hiển thị trên trang công khai"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USwitch, {
                        modelValue: vueExports.unref(form).is_published,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).is_published = $event,
                        label: "Hiển thị trên trang công khai"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "space-y-4" }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Tiêu đề",
                    name: "title",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).title,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).title = $event,
                        placeholder: "Nhập tiêu đề...",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, {
                    label: "Xuất bản",
                    name: "is_published"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_USwitch, {
                        modelValue: vueExports.unref(form).is_published,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).is_published = $event,
                        label: "Hiển thị trên trang công khai"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Nội dung" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedRichTextEditor, {
                modelValue: vueExports.unref(form).content,
                "onUpdate:modelValue": ($event) => vueExports.unref(form).content = $event,
                placeholder: "Nhập nội dung chính sách...",
                "min-height": "400px",
                "upload-image": handleUploadImage
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedRichTextEditor, {
                  modelValue: vueExports.unref(form).content,
                  "onUpdate:modelValue": ($event) => vueExports.unref(form).content = $event,
                  placeholder: "Nhập nội dung chính sách...",
                  "min-height": "400px",
                  "upload-image": handleUploadImage
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 flex items-center justify-end gap-3 z-10">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, { to: "/pmc/policies" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Hủy",
                color: "neutral",
                variant: "ghost"
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Lưu chính sách",
          icon: "i-lucide-save",
          color: "primary",
          loading: vueExports.unref(isSaving),
          onClick: handleSave
        }, null, _parent));
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/policies/[type].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_type_-BIbHlkR7.mjs.map
