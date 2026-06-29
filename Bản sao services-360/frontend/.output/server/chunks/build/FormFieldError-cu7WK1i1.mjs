import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "FormFieldError",
  __ssrInlineRender: true,
  props: {
    errors: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.errors?.length) {
        _push(`<p${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "text-sm text-[var(--ui-error)] mt-1" }, _attrs))}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.errors[0])}</p>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/crud/FormFieldError.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "SharedCrudFormFieldError" });

export { __nuxt_component_4 as _ };
//# sourceMappingURL=FormFieldError-cu7WK1i1.mjs.map
