import { _ as _sfc_main$1 } from './Badge-W93D3Jpz.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "CapabilityRatingBadge",
  __ssrInlineRender: true,
  props: {
    rating: {},
    size: { default: "sm" },
    showWhenNull: { type: Boolean, default: false },
    nullLabel: { default: "Chưa đánh giá" }
  },
  setup(__props) {
    const props = __props;
    const color = vueExports.computed(() => {
      const r = props.rating;
      if (r == null) return "neutral";
      if (r >= 8) return "success";
      if (r >= 5) return "primary";
      return "warning";
    });
    const label = vueExports.computed(
      () => props.rating == null ? props.nullLabel : `${props.rating}/10`
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = _sfc_main$1;
      if (__props.rating != null || __props.showWhenNull) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, vueExports.mergeProps({
          label: vueExports.unref(label),
          color: vueExports.unref(color),
          variant: "subtle",
          size: __props.size,
          icon: "i-lucide-star"
        }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/CapabilityRatingBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SharedCapabilityRatingBadge" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=CapabilityRatingBadge-BBWBj9qN.mjs.map
