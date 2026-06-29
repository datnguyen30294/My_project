import { _ as _sfc_main$1 } from './Modal-BimZZbNl.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DeleteModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    title: {},
    itemName: {},
    description: {},
    blockedMessage: {},
    loading: { type: Boolean },
    checking: { type: Boolean }
  },
  emits: ["update:open", "confirm"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$1;
      const _component_UIcon = _sfc_main$h;
      const _component_UAlert = _sfc_main$2;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: __props.title,
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.checking) {
              _push2(`<div class="flex items-center justify-center py-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-loader-circle",
                class: "size-5 animate-spin text-[var(--ui-text-muted)]"
              }, null, _parent2, _scopeId));
              _push2(`<span class="ml-2 text-sm text-[var(--ui-text-muted)]"${_scopeId}>Đang kiểm tra...</span></div>`);
            } else if (__props.blockedMessage) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "error",
                description: __props.blockedMessage,
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!--[--><p${_scopeId}> Bạn có chắc muốn xoá `);
              if (__props.itemName) {
                _push2(`<strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.itemName)}</strong>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`? </p>`);
              if (__props.description) {
                _push2(`<p class="mt-2 text-sm text-[var(--ui-text-muted)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            }
          } else {
            return [
              __props.checking ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "flex items-center justify-center py-4"
              }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-loader-circle",
                  class: "size-5 animate-spin text-[var(--ui-text-muted)]"
                }),
                vueExports.createVNode("span", { class: "ml-2 text-sm text-[var(--ui-text-muted)]" }, "Đang kiểm tra...")
              ])) : __props.blockedMessage ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 1,
                color: "error",
                description: __props.blockedMessage,
                icon: "i-lucide-alert-circle"
              }, null, 8, ["description"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                vueExports.createVNode("p", null, [
                  vueExports.createTextVNode(" Bạn có chắc muốn xoá "),
                  __props.itemName ? (vueExports.openBlock(), vueExports.createBlock("strong", { key: 0 }, vueExports.toDisplayString(__props.itemName), 1)) : vueExports.createCommentVNode("", true),
                  vueExports.createTextVNode("? ")
                ]),
                __props.description ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "mt-2 text-sm text-[var(--ui-text-muted)]"
                }, vueExports.toDisplayString(__props.description), 1)) : vueExports.createCommentVNode("", true)
              ], 64))
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              label: "Huỷ",
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "error",
              label: __props.loading ? "Đang xóa..." : "Xóa",
              disabled: !!__props.blockedMessage || __props.checking || __props.loading,
              onClick: ($event) => emit("confirm")
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Huỷ",
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "error",
                  label: __props.loading ? "Đang xóa..." : "Xóa",
                  disabled: !!__props.blockedMessage || __props.checking || __props.loading,
                  onClick: ($event) => emit("confirm")
                }, null, 8, ["label", "disabled", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/crud/DeleteModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main, { __name: "SharedCrudDeleteModal" });

export { __nuxt_component_11 as _ };
//# sourceMappingURL=DeleteModal-B4AevDGU.mjs.map
