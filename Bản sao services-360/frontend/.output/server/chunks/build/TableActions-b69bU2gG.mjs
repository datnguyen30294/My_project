import { v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TableActions",
  __ssrInlineRender: true,
  props: {
    detailTo: {},
    showDelete: { type: Boolean, default: true }
  },
  emits: ["edit", "delete"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex items-center justify-end gap-1" }, _attrs))}>`);
      if (__props.detailTo) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          to: __props.detailTo,
          icon: "i-lucide-eye",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          title: "Xem chi tiết"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-pencil",
        color: "neutral",
        variant: "ghost",
        size: "sm",
        title: "Sửa",
        onClick: ($event) => _ctx.$emit("edit")
      }, null, _parent));
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "extra", {}, null, _push, _parent);
      if (__props.showDelete) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-trash-2",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          class: "hover:!text-red-500 hover:!bg-red-50",
          title: "Xóa",
          onClick: ($event) => _ctx.$emit("delete")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/crud/TableActions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "SharedCrudTableActions" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=TableActions-b69bU2gG.mjs.map
