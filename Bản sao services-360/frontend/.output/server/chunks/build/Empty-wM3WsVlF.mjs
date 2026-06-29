import { v as vueExports, a as useAppConfig, t as tv, s as serverRenderer_cjs_prodExports, P as Primitive, y as _sfc_main$f, l as _sfc_main$c } from './server.mjs';

const theme = {
  "slots": {
    "root": "relative flex flex-col items-center justify-center gap-4 rounded-lg p-4 sm:p-6 lg:p-8 min-w-0",
    "header": "flex flex-col items-center gap-2 max-w-sm text-center",
    "avatar": "shrink-0 mb-2",
    "title": "text-highlighted text-pretty font-medium",
    "description": "text-balance text-center",
    "body": "flex flex-col items-center gap-4 max-w-sm",
    "actions": "flex flex-wrap justify-center gap-2 shrink-0",
    "footer": "flex flex-col items-center gap-2 max-w-sm"
  },
  "variants": {
    "size": {
      "xs": {
        "avatar": "size-8 text-base",
        "title": "text-sm",
        "description": "text-xs"
      },
      "sm": {
        "avatar": "size-9 text-lg",
        "title": "text-sm",
        "description": "text-xs"
      },
      "md": {
        "avatar": "size-10 text-xl",
        "title": "text-base",
        "description": "text-sm"
      },
      "lg": {
        "avatar": "size-11 text-[22px]",
        "title": "text-base",
        "description": "text-sm"
      },
      "xl": {
        "avatar": "size-12 text-2xl",
        "title": "text-lg",
        "description": "text-base"
      }
    },
    "variant": {
      "solid": {
        "root": "bg-inverted",
        "title": "text-inverted",
        "description": "text-dimmed"
      },
      "outline": {
        "root": "bg-default ring ring-default",
        "description": "text-muted"
      },
      "soft": {
        "root": "bg-elevated/50",
        "description": "text-toned"
      },
      "subtle": {
        "root": "bg-elevated/50 ring ring-default",
        "description": "text-toned"
      },
      "naked": {
        "description": "text-muted"
      }
    }
  },
  "defaultVariants": {
    "variant": "outline",
    "size": "md"
  }
};
const _sfc_main = {
  __name: "UEmpty",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    actions: { type: Array, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = vueExports.useSlots();
    const appConfig = useAppConfig();
    const ui = vueExports.computed(() => tv({ extend: tv(theme), ...appConfig.ui?.empty || {} })({
      variant: props.variant,
      size: props.size
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Primitive), vueExports.mergeProps({
        as: __props.as,
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.header || (__props.icon || __props.avatar || !!slots.leading) || (__props.title || !!slots.title) || (__props.description || !!slots.description)) {
              _push2(`<div data-slot="header" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.header({ class: props.ui?.header }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "header", {}, () => {
                serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
                  if (__props.icon || __props.avatar) {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$f, vueExports.mergeProps({ icon: __props.icon }, typeof __props.avatar === "object" ? __props.avatar : {}, {
                      "data-slot": "avatar",
                      class: ui.value.avatar({ class: props.ui?.avatar })
                    }), null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                }, _push2, _parent2, _scopeId);
                if (__props.title || !!slots.title) {
                  _push2(`<h2 data-slot="title" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.title({ class: props.ui?.title }))}"${_scopeId}>`);
                  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                    _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}`);
                  }, _push2, _parent2, _scopeId);
                  _push2(`</h2>`);
                } else {
                  _push2(`<!---->`);
                }
                if (__props.description || !!slots.description) {
                  _push2(`<div data-slot="description" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.description({ class: props.ui?.description }))}"${_scopeId}>`);
                  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                    _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}`);
                  }, _push2, _parent2, _scopeId);
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!!slots.body || (__props.actions?.length || !!slots.actions)) {
              _push2(`<div data-slot="body" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.body({ class: props.ui?.body }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "body", {}, () => {
                if (__props.actions?.length || !!slots.actions) {
                  _push2(`<div data-slot="actions" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.actions({ class: props.ui?.actions }))}"${_scopeId}>`);
                  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
                    _push2(`<!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(__props.actions, (action, index) => {
                      _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$c, vueExports.mergeProps({
                        key: index,
                        size: __props.size
                      }, { ref_for: true }, action), null, _parent2, _scopeId));
                    });
                    _push2(`<!--]-->`);
                  }, _push2, _parent2, _scopeId);
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!!slots.footer) {
              _push2(`<div data-slot="footer" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.footer({ class: props.ui?.footer }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              !!slots.header || (__props.icon || __props.avatar || !!slots.leading) || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                "data-slot": "header",
                class: ui.value.header({ class: props.ui?.header })
              }, [
                vueExports.renderSlot(_ctx.$slots, "header", {}, () => [
                  vueExports.renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [
                    __props.icon || __props.avatar ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$f, vueExports.mergeProps({
                      key: 0,
                      icon: __props.icon
                    }, typeof __props.avatar === "object" ? __props.avatar : {}, {
                      "data-slot": "avatar",
                      class: ui.value.avatar({ class: props.ui?.avatar })
                    }), null, 16, ["icon", "class"])) : vueExports.createCommentVNode("", true)
                  ]),
                  __props.title || !!slots.title ? (vueExports.openBlock(), vueExports.createBlock("h2", {
                    key: 0,
                    "data-slot": "title",
                    class: ui.value.title({ class: props.ui?.title })
                  }, [
                    vueExports.renderSlot(_ctx.$slots, "title", {}, () => [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                    ])
                  ], 2)) : vueExports.createCommentVNode("", true),
                  __props.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    "data-slot": "description",
                    class: ui.value.description({ class: props.ui?.description })
                  }, [
                    vueExports.renderSlot(_ctx.$slots, "description", {}, () => [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                    ])
                  ], 2)) : vueExports.createCommentVNode("", true)
                ])
              ], 2)) : vueExports.createCommentVNode("", true),
              !!slots.body || (__props.actions?.length || !!slots.actions) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 1,
                "data-slot": "body",
                class: ui.value.body({ class: props.ui?.body })
              }, [
                vueExports.renderSlot(_ctx.$slots, "body", {}, () => [
                  __props.actions?.length || !!slots.actions ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    "data-slot": "actions",
                    class: ui.value.actions({ class: props.ui?.actions })
                  }, [
                    vueExports.renderSlot(_ctx.$slots, "actions", {}, () => [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.actions, (action, index) => {
                        return vueExports.openBlock(), vueExports.createBlock(_sfc_main$c, vueExports.mergeProps({
                          key: index,
                          size: __props.size
                        }, { ref_for: true }, action), null, 16, ["size"]);
                      }), 128))
                    ])
                  ], 2)) : vueExports.createCommentVNode("", true)
                ])
              ], 2)) : vueExports.createCommentVNode("", true),
              !!slots.footer ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 2,
                "data-slot": "footer",
                class: ui.value.footer({ class: props.ui?.footer })
              }, [
                vueExports.renderSlot(_ctx.$slots, "footer")
              ], 2)) : vueExports.createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.4.0_@tiptap+extensions@3.22.2_@tiptap+core@3.22.2_@tiptap+pm@3.22.2__@tiptap_ff602f8142f0ba128c11c1e82cd47490/node_modules/@nuxt/ui/dist/runtime/components/Empty.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Empty-wM3WsVlF.mjs.map
