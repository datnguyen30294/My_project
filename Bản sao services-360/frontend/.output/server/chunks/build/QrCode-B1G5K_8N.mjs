import { v as vueExports, s as serverRenderer_cjs_prodExports, k as _sfc_main$h } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "QrCode",
  __ssrInlineRender: true,
  props: {
    value: {},
    size: { default: 200 },
    margin: { default: 2 },
    fileName: { default: "qrcode.png" }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const dataUrl = vueExports.ref("");
    const isGenerating = vueExports.ref(false);
    vueExports.watchEffect(async () => {
      {
        dataUrl.value = "";
        return;
      }
    });
    function downloadPng() {
      if (!dataUrl.value) return;
      const link = (void 0).createElement("a");
      link.href = dataUrl.value;
      link.download = props.fileName;
      (void 0).body.appendChild(link);
      link.click();
      (void 0).body.removeChild(link);
    }
    __expose({ downloadPng });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex items-center justify-center" }, _attrs))}>`);
      if (vueExports.unref(dataUrl)) {
        _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(dataUrl))}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", __props.value)}${serverRenderer_cjs_prodExports.ssrRenderAttr("width", __props.size)}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", __props.size)} class="rounded-lg border border-slate-200 bg-white">`);
      } else {
        _push(`<div class="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${__props.size}px`, height: `${__props.size}px` })}">`);
        if (vueExports.unref(isGenerating)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-loader-circle",
            class: "size-6 text-slate-400 animate-spin"
          }, null, _parent));
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-qr-code",
            class: "size-8 text-slate-300"
          }, null, _parent));
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/QrCode.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "SharedQrCode" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=QrCode-B1G5K_8N.mjs.map
