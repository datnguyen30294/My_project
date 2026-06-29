import { v as vueExports, s as serverRenderer_cjs_prodExports, w as __nuxt_component_5 } from './server.mjs';

/* empty css                 */
const DEFAULT_ZOOM = 15;
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AddressMapPicker",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: "" },
    latitude: { default: null },
    longitude: { default: null },
    disabled: { type: Boolean, default: false },
    collapsible: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "update:latitude", "update:longitude"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const showMap = vueExports.ref(!props.collapsible);
    const DEFAULT_CENTER = [10.7769, 106.7009];
    const mapCenter = vueExports.ref([...DEFAULT_CENTER]);
    const markerLatLng = vueExports.ref(null);
    vueExports.ref(DEFAULT_ZOOM);
    const addressInput = vueExports.ref(props.modelValue);
    const isGeocoding = vueExports.ref(false);
    const isLocating = vueExports.ref(false);
    const locationError = vueExports.ref("");
    vueExports.shallowRef(null);
    vueExports.shallowRef(null);
    vueExports.shallowRef(null);
    vueExports.watch(() => props.modelValue, (val) => {
      addressInput.value = val;
    });
    vueExports.watch(() => [props.latitude, props.longitude], ([lat, lng]) => {
      if (lat != null && lng != null) {
        markerLatLng.value = [Number(lat), Number(lng)];
        mapCenter.value = [Number(lat), Number(lng)];
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col gap-1.5" }, _attrs))}><label class="text-xs font-bold text-slate-600"><span class="material-symbols-outlined align-middle mr-1" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}">location_on</span> Địa chỉ </label><div class="relative"><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(addressInput))} type="text" placeholder="Nhập địa chỉ hoặc kéo marker trên bản đồ..."${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} class="w-full h-10 rounded-xl border px-3.5 pr-16 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500">`);
      if (!__props.disabled) {
        _push(`<button type="button" class="absolute right-8 top-1/2 -translate-y-1/2 size-6 rounded-md hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer" title="Dùng vị trí hiện tại"><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(isLocating) ? "text-indigo-500 animate-pulse" : "text-slate-400 hover:text-indigo-500", "material-symbols-outlined transition-colors"])}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}"> my_location </span></button>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(isGeocoding) || vueExports.unref(isLocating)) {
        _push(`<span class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-indigo-400 animate-spin" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}"> progress_activity </span>`);
      } else if (vueExports.unref(markerLatLng)) {
        _push(`<span class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-emerald-500" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}"> check_circle </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(locationError)) {
        _push(`<p class="text-[11px] text-amber-600 flex items-center gap-1"><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}">warning</span> ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(locationError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.collapsible) {
        _push(`<button type="button" class="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}">map</span><span>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(showMap) ? "Ẩn bản đồ" : "Chọn trên bản đồ")}</span><span class="material-symbols-outlined" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "14px" })}">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(showMap) ? "expand_less" : "expand_more")}</span></button>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(showMap)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, null, {
          fallback: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="rounded-xl border border-slate-200 bg-slate-50 h-[250px] flex items-center justify-center"${_scopeId}><span class="material-symbols-outlined text-slate-300 animate-spin" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}"${_scopeId}>progress_activity</span></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "rounded-xl border border-slate-200 bg-slate-50 h-[250px] flex items-center justify-center" }, [
                  vueExports.createVNode("span", {
                    class: "material-symbols-outlined text-slate-300 animate-spin",
                    style: { "font-size": "24px" }
                  }, "progress_activity")
                ])
              ];
            }
          })
        }, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/AddressMapPicker.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main, { __name: "SharedAddressMapPicker" });

export { __nuxt_component_9 as _ };
//# sourceMappingURL=AddressMapPicker-jpXrfuln.mjs.map
