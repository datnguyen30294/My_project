import { _ as __nuxt_component_0 } from './LandingPolicyPage-sL-opSnR.mjs';
import { P as POLICY_TYPES } from './usePolicies-fLtp10Zn.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports } from './server.mjs';
import './LandingFooter-ButK23zG.mjs';
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

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "chinh-sach",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Điều khoản sử dụng - Thần Nông",
      description: "Điều khoản sử dụng dịch vụ của Thần Nông."
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LandingPolicyPage = __nuxt_component_0;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_LandingPolicyPage, vueExports.mergeProps({
        "policy-type": ("POLICY_TYPES" in _ctx ? _ctx.POLICY_TYPES : vueExports.unref(POLICY_TYPES)).TERMS_OF_SERVICE
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chinh-sach.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=chinh-sach-CUf5WXad.mjs.map
