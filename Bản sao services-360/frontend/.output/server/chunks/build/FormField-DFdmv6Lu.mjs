import { v as vueExports, a as useAppConfig, t as tv, c as formErrorsInjectionKey, d as formInputsInjectionKey, z as inputIdInjectionKey, A as formFieldInjectionKey, s as serverRenderer_cjs_prodExports, P as Primitive } from './server.mjs';
import { L as Label_default } from './Label-BBgw4vHh.mjs';

const theme = {
  "slots": {
    "root": "",
    "wrapper": "",
    "labelWrapper": "flex content-center items-center justify-between gap-1",
    "label": "block font-medium text-default",
    "container": "relative",
    "description": "text-muted",
    "error": "mt-2 text-error",
    "hint": "text-muted",
    "help": "mt-2 text-muted"
  },
  "variants": {
    "size": {
      "xs": {
        "root": "text-xs"
      },
      "sm": {
        "root": "text-xs"
      },
      "md": {
        "root": "text-sm"
      },
      "lg": {
        "root": "text-sm"
      },
      "xl": {
        "root": "text-base"
      }
    },
    "required": {
      "true": {
        "label": "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    "orientation": {
      "vertical": {
        "container": "mt-1"
      },
      "horizontal": {
        "root": "flex justify-between place-items-baseline gap-2"
      }
    }
  },
  "defaultVariants": {
    "size": "md",
    "orientation": "vertical"
  }
};
const _sfc_main = {
  __name: "UFormField",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    name: { type: String, required: false },
    errorPattern: { type: null, required: false },
    label: { type: String, required: false },
    description: { type: String, required: false },
    help: { type: String, required: false },
    error: { type: [Boolean, String], required: false, default: void 0 },
    hint: { type: String, required: false },
    size: { type: null, required: false },
    required: { type: Boolean, required: false },
    eagerValidation: { type: Boolean, required: false },
    validateOnInputDelay: { type: Number, required: false },
    orientation: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = vueExports.useSlots();
    const appConfig = useAppConfig();
    const ui = vueExports.computed(() => tv({ extend: tv(theme), ...appConfig.ui?.formField || {} })({
      size: props.size,
      required: props.required,
      orientation: props.orientation
    }));
    const formErrors = vueExports.inject(formErrorsInjectionKey, null);
    const error = vueExports.computed(() => props.error || formErrors?.value?.find((error2) => error2.name === props.name || props.errorPattern && error2.name?.match(props.errorPattern))?.message);
    const id = vueExports.ref(vueExports.useId());
    const ariaId = id.value;
    const formInputs = vueExports.inject(formInputsInjectionKey, void 0);
    vueExports.watch(id, () => {
      if (formInputs && props.name) {
        formInputs.value[props.name] = { id: id.value, pattern: props.errorPattern };
      }
    }, { immediate: true });
    vueExports.provide(inputIdInjectionKey, id);
    vueExports.provide(formFieldInjectionKey, vueExports.computed(() => ({
      error: error.value,
      name: props.name,
      size: props.size,
      eagerValidation: props.eagerValidation,
      validateOnInputDelay: props.validateOnInputDelay,
      errorPattern: props.errorPattern,
      hint: props.hint,
      description: props.description,
      help: props.help,
      ariaId
    })));
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Primitive), vueExports.mergeProps({
        as: __props.as,
        "data-orientation": __props.orientation,
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-slot="wrapper" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.wrapper({ class: props.ui?.wrapper }))}"${_scopeId}>`);
            if (__props.label || !!slots.label) {
              _push2(`<div data-slot="labelWrapper" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.labelWrapper({ class: props.ui?.labelWrapper }))}"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Label_default), {
                for: id.value,
                "data-slot": "label",
                class: ui.value.label({ class: props.ui?.label })
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "label", { label: __props.label }, () => {
                      _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}`);
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      vueExports.renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                        vueExports.createTextVNode(vueExports.toDisplayString(__props.label), 1)
                      ])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
              if (__props.hint || !!slots.hint) {
                _push2(`<span${serverRenderer_cjs_prodExports.ssrRenderAttr("id", `${vueExports.unref(ariaId)}-hint`)} data-slot="hint" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.hint({ class: props.ui?.hint }))}"${_scopeId}>`);
                serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "hint", { hint: __props.hint }, () => {
                  _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.hint)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.description || !!slots.description) {
              _push2(`<p${serverRenderer_cjs_prodExports.ssrRenderAttr("id", `${vueExports.unref(ariaId)}-description`)} data-slot="description" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.description({ class: props.ui?.description }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "description", { description: __props.description }, () => {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([(__props.label || !!slots.label || __props.description || !!slots.description) && ui.value.container({ class: props.ui?.container })])}"${_scopeId}>`);
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", { error: error.value }, null, _push2, _parent2, _scopeId);
            if (props.error !== false && (typeof error.value === "string" && error.value || !!slots.error)) {
              _push2(`<div${serverRenderer_cjs_prodExports.ssrRenderAttr("id", `${vueExports.unref(ariaId)}-error`)} data-slot="error" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.error({ class: props.ui?.error }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "error", { error: error.value }, () => {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(error.value)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else if (__props.help || !!slots.help) {
              _push2(`<div${serverRenderer_cjs_prodExports.ssrRenderAttr("id", `${vueExports.unref(ariaId)}-help`)} data-slot="help" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.help({ class: props.ui?.help }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "help", { help: __props.help }, () => {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.help)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", {
                "data-slot": "wrapper",
                class: ui.value.wrapper({ class: props.ui?.wrapper })
              }, [
                __props.label || !!slots.label ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  "data-slot": "labelWrapper",
                  class: ui.value.labelWrapper({ class: props.ui?.labelWrapper })
                }, [
                  vueExports.createVNode(vueExports.unref(Label_default), {
                    for: id.value,
                    "data-slot": "label",
                    class: ui.value.label({ class: props.ui?.label })
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.renderSlot(_ctx.$slots, "label", { label: __props.label }, () => [
                        vueExports.createTextVNode(vueExports.toDisplayString(__props.label), 1)
                      ])
                    ]),
                    _: 3
                  }, 8, ["for", "class"]),
                  __props.hint || !!slots.hint ? (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 0,
                    id: `${vueExports.unref(ariaId)}-hint`,
                    "data-slot": "hint",
                    class: ui.value.hint({ class: props.ui?.hint })
                  }, [
                    vueExports.renderSlot(_ctx.$slots, "hint", { hint: __props.hint }, () => [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.hint), 1)
                    ])
                  ], 10, ["id"])) : vueExports.createCommentVNode("", true)
                ], 2)) : vueExports.createCommentVNode("", true),
                __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 1,
                  id: `${vueExports.unref(ariaId)}-description`,
                  "data-slot": "description",
                  class: ui.value.description({ class: props.ui?.description })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "description", { description: __props.description }, () => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                  ])
                ], 10, ["id"])) : vueExports.createCommentVNode("", true)
              ], 2),
              vueExports.createVNode("div", {
                class: [(__props.label || !!slots.label || __props.description || !!slots.description) && ui.value.container({ class: props.ui?.container })]
              }, [
                vueExports.renderSlot(_ctx.$slots, "default", { error: error.value }),
                props.error !== false && (typeof error.value === "string" && error.value || !!slots.error) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  id: `${vueExports.unref(ariaId)}-error`,
                  "data-slot": "error",
                  class: ui.value.error({ class: props.ui?.error })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "error", { error: error.value }, () => [
                    vueExports.createTextVNode(vueExports.toDisplayString(error.value), 1)
                  ])
                ], 10, ["id"])) : __props.help || !!slots.help ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  id: `${vueExports.unref(ariaId)}-help`,
                  "data-slot": "help",
                  class: ui.value.help({ class: props.ui?.help })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "help", { help: __props.help }, () => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.help), 1)
                  ])
                ], 10, ["id"])) : vueExports.createCommentVNode("", true)
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.4.0_@tiptap+extensions@3.22.2_@tiptap+core@3.22.2_@tiptap+pm@3.22.2__@tiptap_ff602f8142f0ba128c11c1e82cd47490/node_modules/@nuxt/ui/dist/runtime/components/FormField.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=FormField-DFdmv6Lu.mjs.map
