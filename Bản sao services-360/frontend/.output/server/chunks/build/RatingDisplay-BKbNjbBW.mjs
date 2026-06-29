import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "RatingDisplay",
  __ssrInlineRender: true,
  props: {
    rating: {},
    comment: {},
    ratedAt: {}
  },
  setup(__props) {
    const props = __props;
    const stars = vueExports.computed(() => {
      if (!props.rating || props.rating < 1) return 0;
      return Math.min(5, Math.max(1, Math.round(props.rating)));
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.rating) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-2" }, _attrs))}><div class="flex items-center gap-2"><div class="flex items-center gap-0.5 text-lg"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(5, (star) => {
          _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass(star <= vueExports.unref(stars) ? "text-amber-400" : "text-gray-300")}">★</span>`);
        });
        _push(`<!--]--></div><span class="text-sm font-semibold text-gray-700">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.rating)}/5</span></div>`);
        if (__props.comment) {
          _push(`<p class="text-sm text-gray-700"> &quot;${serverRenderer_cjs_prodExports.ssrInterpolate(__props.comment)}&quot; </p>`);
        } else {
          _push(`<p class="text-sm text-gray-400 italic"> Không có nhận xét </p>`);
        }
        if (__props.ratedAt) {
          _push(`<p class="text-xs text-gray-400"> Đánh giá lúc: ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(__props.ratedAt))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<p${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "text-sm text-gray-400 italic" }, _attrs))}> Chưa có đánh giá </p>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/ticket/RatingDisplay.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main, { __name: "SharedTicketRatingDisplay" });

export { __nuxt_component_7 as _ };
//# sourceMappingURL=RatingDisplay-BKbNjbBW.mjs.map
