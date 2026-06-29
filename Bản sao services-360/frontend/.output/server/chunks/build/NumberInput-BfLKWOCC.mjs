import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "NumberInput",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    placeholder: { default: "" },
    min: { default: void 0 },
    max: { default: void 0 },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function formatDisplay(value) {
      if (value == null || value === 0) return "";
      return new Intl.NumberFormat("vi-VN").format(value);
    }
    const displayValue = vueExports.ref(formatDisplay(props.modelValue));
    vueExports.watch(() => props.modelValue, (val) => {
      const parsed = parseInput(displayValue.value);
      if (parsed !== val) {
        displayValue.value = formatDisplay(val);
      }
    });
    function parseInput(raw) {
      const cleaned = raw.replace(/\./g, "").replace(/,/g, ".").trim();
      if (cleaned === "") return null;
      const num = Number(cleaned);
      return isNaN(num) ? null : num;
    }
    function onInput(value) {
      const raw = String(value);
      const cleaned = raw.replace(/[^\d]/g, "");
      const num = cleaned === "" ? null : Number(cleaned);
      if (num !== null) {
        displayValue.value = new Intl.NumberFormat("vi-VN").format(num);
      } else {
        displayValue.value = "";
      }
      emit("update:modelValue", num);
    }
    function onBlur() {
      const num = parseInput(displayValue.value);
      displayValue.value = formatDisplay(num);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, vueExports.mergeProps({
        "model-value": vueExports.unref(displayValue),
        inputmode: "numeric",
        placeholder: __props.placeholder,
        disabled: __props.disabled,
        "onUpdate:modelValue": onInput,
        onBlur
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/NumberInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "SharedNumberInput" });

export { __nuxt_component_5 as _ };
//# sourceMappingURL=NumberInput-BfLKWOCC.mjs.map
