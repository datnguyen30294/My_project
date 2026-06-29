import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$2 } from './Badge-W93D3Jpz.mjs';
import { v as vueExports, j as useToast, u as useSeoMeta, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$3 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$4 } from './Input-JXN8po_F.mjs';
import { e as formatDurationMinutes } from './date-R5YK0ast.mjs';
import { u as useSettingsGroup, S as SLA_DEFAULTS, a as apiSaveSettings } from './useSettings-Bc7XNrjh.mjs';
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

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const { data, status, error, refresh } = useSettingsGroup("og_ticket");
    const settings = vueExports.computed(() => data.value?.data ?? {});
    const form = vueExports.reactive({
      sla_quote_minutes: "",
      sla_completion_minutes: ""
    });
    const formInitialized = vueExports.ref(false);
    const isSaving = vueExports.ref(false);
    vueExports.watch(settings, (val) => {
      if (!val || formInitialized.value) return;
      form.sla_quote_minutes = String(val.sla_quote_minutes ?? SLA_DEFAULTS.sla_quote_minutes);
      form.sla_completion_minutes = String(val.sla_completion_minutes ?? SLA_DEFAULTS.sla_completion_minutes);
      formInitialized.value = true;
    });
    function hasChanges() {
      const current = settings.value;
      const origQuote = current.sla_quote_minutes ?? SLA_DEFAULTS.sla_quote_minutes;
      const origCompletion = current.sla_completion_minutes ?? SLA_DEFAULTS.sla_completion_minutes;
      return form.sla_quote_minutes !== origQuote || form.sla_completion_minutes !== origCompletion;
    }
    const validationErrors = vueExports.computed(() => {
      const errors = [];
      const quote = parseInt(form.sla_quote_minutes, 10);
      const completion = parseInt(form.sla_completion_minutes, 10);
      if (isNaN(quote) || quote < 1) errors.push("SLA Báo giá phải lớn hơn 0 phút.");
      if (isNaN(completion) || completion < 1) errors.push("SLA Hoàn thành phải lớn hơn 0 phút.");
      return errors;
    });
    async function handleSave() {
      if (validationErrors.value.length > 0) return;
      if (!hasChanges()) {
        toast.add({ title: "Không có thay đổi.", color: "neutral" });
        return;
      }
      isSaving.value = true;
      try {
        await apiSaveSettings("og_ticket", [
          { key: "sla_quote_minutes", value: Number(form.sla_quote_minutes) },
          { key: "sla_completion_minutes", value: Number(form.sla_completion_minutes) }
        ]);
        toast.add({ title: "Cập nhật cài đặt SLA thành công.", color: "success" });
        await refresh();
        formInitialized.value = false;
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu cài đặt thất bại."), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    function handleReset() {
      formInitialized.value = false;
      const current = settings.value;
      form.sla_quote_minutes = String(current.sla_quote_minutes ?? SLA_DEFAULTS.sla_quote_minutes);
      form.sla_completion_minutes = String(current.sla_completion_minutes ?? SLA_DEFAULTS.sla_completion_minutes);
      formInitialized.value = true;
    }
    useSeoMeta({ title: "Cài đặt SLA" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UBadge = _sfc_main$2;
      const _component_UIcon = _sfc_main$h;
      const _component_UFormField = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_UButton = _sfc_main$c;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-5 sm:gap-6" }, _attrs))}><div class="flex items-center gap-3"><div class="min-w-0"><h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight"> Cài đặt SLA </h1><p class="text-slate-500 text-sm mt-0.5"> Cấu hình thời gian cam kết xử lý mặc định cho OG Ticket. </p></div></div>`);
      if (vueExports.unref(status) === "pending") {
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
        _push(`<div class="flex flex-col gap-4 sm:gap-6">`);
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
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "SLA Báo giá" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-info",
                color: "info",
                variant: "subtle"
              }, {
                description: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Thời gian tối đa từ khi <span class="font-semibold"${_scopeId2}>Tiếp nhận</span> ticket đến khi có <span class="font-semibold"${_scopeId2}>Báo giá</span>. SLA được tính tự động khi ticket được nhận vào hệ thống. `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Thời gian tối đa từ khi "),
                      vueExports.createVNode("span", { class: "font-semibold" }, "Tiếp nhận"),
                      vueExports.createTextVNode(" ticket đến khi có "),
                      vueExports.createVNode("span", { class: "font-semibold" }, "Báo giá"),
                      vueExports.createTextVNode(". SLA được tính tự động khi ticket được nhận vào hệ thống. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex items-center gap-2 text-sm"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                label: "Tiếp nhận",
                color: "info",
                variant: "subtle"
              }, null, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "size-4 text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-slate-400"${_scopeId}>...</span>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "size-4 text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                label: "Báo giá",
                color: "primary",
                variant: "subtle"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="max-w-sm"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Thời gian SLA (phút)",
                name: "sla_quote_minutes",
                required: ""
              }, {
                hint: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_quote_minutes)) {
                      _push3(`<span class="text-xs text-slate-500"${_scopeId2}> = ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_quote_minutes))}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      ("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_quote_minutes) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-xs text-slate-500"
                      }, " = " + vueExports.toDisplayString(("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_quote_minutes)), 1)) : vueExports.createCommentVNode("", true)
                    ];
                  }
                }),
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(form).sla_quote_minutes,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).sla_quote_minutes = $event,
                      type: "number",
                      min: "1",
                      placeholder: "60",
                      "trailing-icon": vueExports.unref(form).sla_quote_minutes ? void 0 : "i-lucide-clock"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).sla_quote_minutes,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).sla_quote_minutes = $event,
                        type: "number",
                        min: "1",
                        placeholder: "60",
                        "trailing-icon": vueExports.unref(form).sla_quote_minutes ? void 0 : "i-lucide-clock"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "trailing-icon"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "space-y-4" }, [
                  vueExports.createVNode(_component_UAlert, {
                    icon: "i-lucide-info",
                    color: "info",
                    variant: "subtle"
                  }, {
                    description: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Thời gian tối đa từ khi "),
                      vueExports.createVNode("span", { class: "font-semibold" }, "Tiếp nhận"),
                      vueExports.createTextVNode(" ticket đến khi có "),
                      vueExports.createVNode("span", { class: "font-semibold" }, "Báo giá"),
                      vueExports.createTextVNode(". SLA được tính tự động khi ticket được nhận vào hệ thống. ")
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode("div", { class: "flex items-center gap-2 text-sm" }, [
                    vueExports.createVNode(_component_UBadge, {
                      label: "Tiếp nhận",
                      color: "info",
                      variant: "subtle"
                    }),
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "size-4 text-slate-400"
                    }),
                    vueExports.createVNode("span", { class: "text-slate-400" }, "..."),
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "size-4 text-slate-400"
                    }),
                    vueExports.createVNode(_component_UBadge, {
                      label: "Báo giá",
                      color: "primary",
                      variant: "subtle"
                    })
                  ]),
                  vueExports.createVNode("div", { class: "max-w-sm" }, [
                    vueExports.createVNode(_component_UFormField, {
                      label: "Thời gian SLA (phút)",
                      name: "sla_quote_minutes",
                      required: ""
                    }, {
                      hint: vueExports.withCtx(() => [
                        ("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_quote_minutes) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "text-xs text-slate-500"
                        }, " = " + vueExports.toDisplayString(("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_quote_minutes)), 1)) : vueExports.createCommentVNode("", true)
                      ]),
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(form).sla_quote_minutes,
                          "onUpdate:modelValue": ($event) => vueExports.unref(form).sla_quote_minutes = $event,
                          type: "number",
                          min: "1",
                          placeholder: "60",
                          "trailing-icon": vueExports.unref(form).sla_quote_minutes ? void 0 : "i-lucide-clock"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "trailing-icon"])
                      ]),
                      _: 1
                    })
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "SLA Hoàn thành" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-info",
                color: "success",
                variant: "subtle"
              }, {
                description: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Thời gian tối đa từ khi cư dân <span class="font-semibold"${_scopeId2}>Chấp thuận</span> báo giá đến khi đơn hàng <span class="font-semibold"${_scopeId2}>Hoàn thành</span>. SLA được tính lại khi phát sinh vòng mới (backtrack). `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Thời gian tối đa từ khi cư dân "),
                      vueExports.createVNode("span", { class: "font-semibold" }, "Chấp thuận"),
                      vueExports.createTextVNode(" báo giá đến khi đơn hàng "),
                      vueExports.createVNode("span", { class: "font-semibold" }, "Hoàn thành"),
                      vueExports.createTextVNode(". SLA được tính lại khi phát sinh vòng mới (backtrack). ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex items-center gap-2 text-sm"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                label: "Chấp thuận",
                color: "success",
                variant: "subtle"
              }, null, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "size-4 text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-slate-400"${_scopeId}>...</span>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "size-4 text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                label: "Hoàn thành",
                color: "success",
                variant: "subtle"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="max-w-sm"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Thời gian SLA (phút)",
                name: "sla_completion_minutes",
                required: ""
              }, {
                hint: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_completion_minutes)) {
                      _push3(`<span class="text-xs text-slate-500"${_scopeId2}> = ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_completion_minutes))}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      ("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_completion_minutes) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-xs text-slate-500"
                      }, " = " + vueExports.toDisplayString(("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_completion_minutes)), 1)) : vueExports.createCommentVNode("", true)
                    ];
                  }
                }),
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      modelValue: vueExports.unref(form).sla_completion_minutes,
                      "onUpdate:modelValue": ($event) => vueExports.unref(form).sla_completion_minutes = $event,
                      type: "number",
                      min: "1",
                      placeholder: "1440",
                      "trailing-icon": vueExports.unref(form).sla_completion_minutes ? void 0 : "i-lucide-clock"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        modelValue: vueExports.unref(form).sla_completion_minutes,
                        "onUpdate:modelValue": ($event) => vueExports.unref(form).sla_completion_minutes = $event,
                        type: "number",
                        min: "1",
                        placeholder: "1440",
                        "trailing-icon": vueExports.unref(form).sla_completion_minutes ? void 0 : "i-lucide-clock"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "trailing-icon"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "space-y-4" }, [
                  vueExports.createVNode(_component_UAlert, {
                    icon: "i-lucide-info",
                    color: "success",
                    variant: "subtle"
                  }, {
                    description: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Thời gian tối đa từ khi cư dân "),
                      vueExports.createVNode("span", { class: "font-semibold" }, "Chấp thuận"),
                      vueExports.createTextVNode(" báo giá đến khi đơn hàng "),
                      vueExports.createVNode("span", { class: "font-semibold" }, "Hoàn thành"),
                      vueExports.createTextVNode(". SLA được tính lại khi phát sinh vòng mới (backtrack). ")
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode("div", { class: "flex items-center gap-2 text-sm" }, [
                    vueExports.createVNode(_component_UBadge, {
                      label: "Chấp thuận",
                      color: "success",
                      variant: "subtle"
                    }),
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "size-4 text-slate-400"
                    }),
                    vueExports.createVNode("span", { class: "text-slate-400" }, "..."),
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "size-4 text-slate-400"
                    }),
                    vueExports.createVNode(_component_UBadge, {
                      label: "Hoàn thành",
                      color: "success",
                      variant: "subtle"
                    })
                  ]),
                  vueExports.createVNode("div", { class: "max-w-sm" }, [
                    vueExports.createVNode(_component_UFormField, {
                      label: "Thời gian SLA (phút)",
                      name: "sla_completion_minutes",
                      required: ""
                    }, {
                      hint: vueExports.withCtx(() => [
                        ("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_completion_minutes) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "text-xs text-slate-500"
                        }, " = " + vueExports.toDisplayString(("formatDurationMinutes" in _ctx ? _ctx.formatDurationMinutes : vueExports.unref(formatDurationMinutes))(vueExports.unref(form).sla_completion_minutes)), 1)) : vueExports.createCommentVNode("", true)
                      ]),
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UInput, {
                          modelValue: vueExports.unref(form).sla_completion_minutes,
                          "onUpdate:modelValue": ($event) => vueExports.unref(form).sla_completion_minutes = $event,
                          type: "number",
                          min: "1",
                          placeholder: "1440",
                          "trailing-icon": vueExports.unref(form).sla_completion_minutes ? void 0 : "i-lucide-clock"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "trailing-icon"])
                      ]),
                      _: 1
                    })
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
          label: "Lưu cài đặt",
          icon: "i-lucide-save",
          color: "primary",
          loading: vueExports.unref(isSaving),
          disabled: vueExports.unref(validationErrors).length > 0 || !hasChanges(),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/settings/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-0nMejHk-.mjs.map
