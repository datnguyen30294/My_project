import { _ as _sfc_main$1 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "BaseFormModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    loading: { type: Boolean, default: false },
    errorMessage: { default: null },
    titles: {}
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const modalTitle = vueExports.computed(
      () => props.mode === "create" ? props.titles.create : props.titles.edit
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$1;
      const _component_UAlert = _sfc_main$2;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: vueExports.unref(modalTitle),
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (__props.errorMessage) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "subtle",
                icon: "i-lucide-circle-alert",
                description: __props.errorMessage
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-4" }, [
                __props.errorMessage ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  variant: "subtle",
                  icon: "i-lucide-circle-alert",
                  description: __props.errorMessage
                }, null, 8, ["description"])) : vueExports.createCommentVNode("", true),
                vueExports.renderSlot(_ctx.$slots, "default")
              ])
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
              color: "primary",
              icon: __props.loading ? "i-lucide-loader-circle" : "i-lucide-check",
              label: __props.loading ? "Đang lưu..." : "Lưu",
              disabled: __props.loading,
              onClick: ($event) => emit("submit")
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
                  color: "primary",
                  icon: __props.loading ? "i-lucide-loader-circle" : "i-lucide-check",
                  label: __props.loading ? "Đang lưu..." : "Lưu",
                  disabled: __props.loading,
                  onClick: ($event) => emit("submit")
                }, null, 8, ["icon", "label", "disabled", "onClick"])
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/crud/BaseFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SharedCrudBaseFormModal" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=BaseFormModal-CG7aCaIV.mjs.map
