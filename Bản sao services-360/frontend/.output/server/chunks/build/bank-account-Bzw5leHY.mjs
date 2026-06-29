import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$2 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$3 } from './SelectMenu-DKHEMZj7.mjs';
import { _ as _sfc_main$4 } from './Input-JXN8po_F.mjs';
import { v as vueExports, u as useSeoMeta, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as __nuxt_component_5 } from './NumberInput-BfLKWOCC.mjs';
import { _ as __nuxt_component_2$1 } from './QrCode-B1G5K_8N.mjs';
import { V as VIETNAM_BANKS, f as findBankByBin, a as buildVietQrPayload } from './vietqr-D50vgfgj.mjs';
import { u as useSettingsGroup, p as parseBankAccountSettings, a as apiSaveSettings } from './useSettings-Bc7XNrjh.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import './Label-BBgw4vHh.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
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
import './index-QmZAbLx-.mjs';
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

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "bank-account",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Cài đặt tài khoản nhận chuyển khoản" });
    const toast = useToast();
    const { data, status, error, refresh } = useSettingsGroup("bank_account");
    const settings = vueExports.computed(() => parseBankAccountSettings(data.value?.data));
    const form = vueExports.reactive({
      bank_bin: "",
      account_number: "",
      account_holder: ""
    });
    const formInitialized = vueExports.ref(false);
    const isSaving = vueExports.ref(false);
    function syncFormFromSettings(val) {
      form.bank_bin = val.bank_bin;
      form.account_number = val.account_number;
      form.account_holder = val.account_holder;
      formInitialized.value = true;
    }
    if (data.value?.data) {
      syncFormFromSettings(settings.value);
    }
    vueExports.watch(
      () => data.value?.data,
      (val) => {
        if (!val || formInitialized.value) return;
        syncFormFromSettings(parseBankAccountSettings(val));
      }
    );
    const bankOptions = vueExports.computed(
      () => VIETNAM_BANKS.map((b) => ({
        label: `${b.shortName} — ${b.name}`,
        value: b.bin
      }))
    );
    const selectedBank = vueExports.computed(() => findBankByBin(form.bank_bin));
    const validationErrors = vueExports.computed(() => {
      const errors = [];
      if (!form.bank_bin) errors.push("Vui lòng chọn ngân hàng.");
      if (!form.account_number.trim()) errors.push("Vui lòng nhập số tài khoản.");
      else if (!/^\d+$/.test(form.account_number.trim())) errors.push("Số tài khoản chỉ được chứa chữ số.");
      if (!form.account_holder.trim()) errors.push("Vui lòng nhập tên chủ tài khoản.");
      return errors;
    });
    function hasChanges() {
      return form.bank_bin !== settings.value.bank_bin || form.account_number.trim() !== settings.value.account_number || form.account_holder.trim() !== settings.value.account_holder;
    }
    const previewAmount = vueExports.ref(5e5);
    const previewPayload = vueExports.computed(() => {
      if (validationErrors.value.length > 0) return "";
      return buildVietQrPayload({
        bankBin: form.bank_bin,
        accountNumber: form.account_number.trim(),
        amount: previewAmount.value,
        description: `TEST ${form.account_holder.trim()}`
      });
    });
    async function handleSave() {
      if (validationErrors.value.length > 0) return;
      if (!hasChanges()) {
        toast.add({ title: "Không có thay đổi.", color: "neutral" });
        return;
      }
      isSaving.value = true;
      try {
        const bank = findBankByBin(form.bank_bin);
        await apiSaveSettings("bank_account", [
          { key: "bank_bin", value: form.bank_bin },
          { key: "bank_name", value: bank?.shortName ?? "" },
          { key: "account_number", value: form.account_number.trim() },
          { key: "account_holder", value: form.account_holder.trim() }
        ]);
        toast.add({ title: "Đã lưu cài đặt tài khoản ngân hàng.", color: "success" });
        formInitialized.value = false;
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu cài đặt thất bại."), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    function handleReset() {
      formInitialized.value = false;
      form.bank_bin = settings.value.bank_bin;
      form.account_number = settings.value.account_number;
      form.account_holder = settings.value.account_holder;
      formInitialized.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$2;
      const _component_USelectMenu = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_UButton = _sfc_main$c;
      const _component_SharedNumberInput = __nuxt_component_5;
      const _component_SharedQrCode = __nuxt_component_2$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-5 sm:gap-6" }, _attrs))}><div class="flex items-center gap-3"><div class="min-w-0"><h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight"> Tài khoản nhận chuyển khoản </h1><p class="text-slate-500 text-sm mt-0.5"> Cấu hình thông tin tài khoản ngân hàng dùng để tạo mã QR chuyển khoản trên các trang công nợ. </p></div></div>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(data)) {
        _push(`<div class="flex flex-col gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(2, (i) => {
          _push(`<div class="h-40 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6"><div class="lg:col-span-3 flex flex-col gap-4 sm:gap-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-info",
          color: "info",
          variant: "subtle",
          title: "Thông tin này sẽ được dùng trên toàn hệ thống",
          description: "Mã QR chuyển khoản trong Lịch sử dòng tiền của từng khoản công nợ sẽ được tạo tự động dựa trên tài khoản cấu hình ở đây."
        }, null, _parent));
        if (vueExports.unref(validationErrors).length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            icon: "i-lucide-alert-triangle",
            color: "error",
            variant: "subtle",
            title: "Lỗi cấu hình"
          }, {
            description: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<ul class="list-disc pl-4 text-sm space-y-0.5"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(validationErrors), (err, idx) => {
                  _push2(`<li${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(err)}</li>`);
                });
                _push2(`<!--]--></ul>`);
              } else {
                return [
                  vueExports.createVNode("ul", { class: "list-disc pl-4 text-sm space-y-0.5" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(validationErrors), (err, idx) => {
                      return vueExports.openBlock(), vueExports.createBlock("li", { key: idx }, vueExports.toDisplayString(err), 1);
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
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Thông tin tài khoản" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Ngân hàng",
                name: "bank_bin",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                      modelValue: vueExports.unref(form).bank_bin,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).bank_bin = $event,
                      items: vueExports.unref(bankOptions),
                      "value-key": "value",
                      placeholder: "Chọn ngân hàng",
                      "search-input": { placeholder: "Tìm theo tên ngân hàng..." },
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_USelectMenu, {
                        modelValue: vueExports.unref(form).bank_bin,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).bank_bin = $event,
                        items: vueExports.unref(bankOptions),
                        "value-key": "value",
                        placeholder: "Chọn ngân hàng",
                        "search-input": { placeholder: "Tìm theo tên ngân hàng..." },
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Số tài khoản",
                name: "account_number",
                required: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(form).account_number,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).account_number = $event,
                      placeholder: "Nhập số tài khoản",
                      maxlength: 30,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).account_number,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).account_number = $event,
                        placeholder: "Nhập số tài khoản",
                        maxlength: 30,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Tên chủ tài khoản",
                name: "account_holder",
                required: "",
                hint: "Viết hoa không dấu (sẽ hiển thị trên app ngân hàng của người chuyển)"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(form).account_holder,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).account_holder = $event,
                      placeholder: "Ví dụ: CONG TY TNHH TNP",
                      maxlength: 100,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).account_holder,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).account_holder = $event,
                        placeholder: "Ví dụ: CONG TY TNHH TNP",
                        maxlength: 100,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                  vueExports.createVNode(_component_UFormField, {
                    label: "Ngân hàng",
                    name: "bank_bin",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_USelectMenu, {
                        modelValue: vueExports.unref(form).bank_bin,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).bank_bin = $event,
                        items: vueExports.unref(bankOptions),
                        "value-key": "value",
                        placeholder: "Chọn ngân hàng",
                        "search-input": { placeholder: "Tìm theo tên ngân hàng..." },
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, {
                    label: "Số tài khoản",
                    name: "account_number",
                    required: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).account_number,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).account_number = $event,
                        placeholder: "Nhập số tài khoản",
                        maxlength: 30,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, {
                    label: "Tên chủ tài khoản",
                    name: "account_holder",
                    required: "",
                    hint: "Viết hoa không dấu (sẽ hiển thị trên app ngân hàng của người chuyển)"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).account_holder,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).account_holder = $event,
                        placeholder: "Ví dụ: CONG TY TNHH TNP",
                        maxlength: 100,
                        class: "w-full"
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
        _push(`<div class="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 flex items-center justify-end gap-3 z-10">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Đặt lại",
          color: "neutral",
          variant: "ghost",
          disabled: !hasChanges() || vueExports.unref(isSaving),
          onClick: handleReset
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Lưu cài đặt",
          icon: "i-lucide-save",
          color: "primary",
          loading: vueExports.unref(isSaving),
          disabled: vueExports.unref(validationErrors).length > 0 || !hasChanges(),
          onClick: handleSave
        }, null, _parent));
        _push(`</div></div><div class="lg:col-span-2">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Xem trước mã QR" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-4 items-center"${_scopeId}><div class="w-full"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Số tiền xem trước (đ)" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                      modelValue: vueExports.unref(previewAmount),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(previewAmount) ? previewAmount.value = $event : null,
                      placeholder: "Nhập số tiền để xem trước",
                      min: 0,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedNumberInput, {
                        modelValue: vueExports.unref(previewAmount),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(previewAmount) ? previewAmount.value = $event : null,
                        placeholder: "Nhập số tiền để xem trước",
                        min: 0,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              if (vueExports.unref(previewPayload)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedQrCode, {
                  value: vueExports.unref(previewPayload),
                  size: 220,
                  "file-name": "vietqr-preview.png"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<div class="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 w-[220px] h-[220px] text-center px-4"${_scopeId}><p class="text-xs text-slate-400"${_scopeId}> Điền đầy đủ thông tin tài khoản để xem mã QR. </p></div>`);
              }
              if (vueExports.unref(selectedBank) && vueExports.unref(form).account_number) {
                _push2(`<div class="w-full text-center text-sm text-slate-600 space-y-0.5"${_scopeId}><p class="font-semibold"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(selectedBank).shortName)}</p><p class="font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(form).account_number)}</p><p class="uppercase"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(form).account_holder || "—")}</p></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-col gap-4 items-center" }, [
                  vueExports.createVNode("div", { class: "w-full" }, [
                    vueExports.createVNode(_component_UFormField, { label: "Số tiền xem trước (đ)" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_SharedNumberInput, {
                          modelValue: vueExports.unref(previewAmount),
                          "onUpdate:modelValue": ($event) => vueExports.isRef(previewAmount) ? previewAmount.value = $event : null,
                          placeholder: "Nhập số tiền để xem trước",
                          min: 0,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  vueExports.unref(previewPayload) ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedQrCode, {
                    key: 0,
                    value: vueExports.unref(previewPayload),
                    size: 220,
                    "file-name": "vietqr-preview.png"
                  }, null, 8, ["value"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 w-[220px] h-[220px] text-center px-4"
                  }, [
                    vueExports.createVNode("p", { class: "text-xs text-slate-400" }, " Điền đầy đủ thông tin tài khoản để xem mã QR. ")
                  ])),
                  vueExports.unref(selectedBank) && vueExports.unref(form).account_number ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 2,
                    class: "w-full text-center text-sm text-slate-600 space-y-0.5"
                  }, [
                    vueExports.createVNode("p", { class: "font-semibold" }, vueExports.toDisplayString(vueExports.unref(selectedBank).shortName), 1),
                    vueExports.createVNode("p", { class: "font-mono" }, vueExports.toDisplayString(vueExports.unref(form).account_number), 1),
                    vueExports.createVNode("p", { class: "uppercase" }, vueExports.toDisplayString(vueExports.unref(form).account_holder || "—"), 1)
                  ])) : vueExports.createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/settings/bank-account.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=bank-account-Bzw5leHY.mjs.map
