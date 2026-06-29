import { _ as __nuxt_component_0$1, a as __nuxt_component_2 } from './LandingFooter-ButK23zG.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, k as _sfc_main$h } from './server.mjs';
import { u as usePublicPolicy } from './usePolicies-fLtp10Zn.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "LandingPolicyPage",
  __ssrInlineRender: true,
  props: {
    policyType: {}
  },
  setup(__props) {
    const props = __props;
    const { data, status } = usePublicPolicy(props.policyType);
    const policy = vueExports.computed(() => data.value?.data);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LandingHeader = __nuxt_component_0$1;
      const _component_UIcon = _sfc_main$h;
      const _component_LandingFooter = __nuxt_component_2;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8]" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LandingHeader, null, null, _parent));
      _push(`<main class="flex-1 max-w-4xl mx-auto w-full px-6 lg:px-20 py-10">`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="flex justify-center py-20">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-circle",
          class: "animate-spin text-4xl text-slate-400"
        }, null, _parent));
        _push(`</div>`);
      } else if (!vueExports.unref(policy)) {
        _push(`<div class="flex flex-col items-center justify-center py-20">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-file-x",
          class: "text-6xl text-slate-300 mb-4"
        }, null, _parent));
        _push(`<p class="text-slate-500 text-lg"> Nội dung chưa được cập nhật. </p></div>`);
      } else {
        _push(`<article class="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12"><h1 class="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight mb-2">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(policy).title)}</h1>`);
        if (vueExports.unref(policy).updated_at) {
          _push(`<p class="text-sm text-slate-400 mb-8"> Cập nhật lần cuối: ${serverRenderer_cjs_prodExports.ssrInterpolate(new Date(vueExports.unref(policy).updated_at).toLocaleDateString("vi-VN"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="prose prose-slate max-w-none">${vueExports.unref(policy).content ?? ""}</div></article>`);
      }
      _push(`</main>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LandingFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/LandingPolicyPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "LandingPolicyPage" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=LandingPolicyPage-sL-opSnR.mjs.map
