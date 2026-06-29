import { v as vueExports, a as useAppConfig, W as useForwardPropsEmits, X as reactivePick, B as useFormField, t as tv, s as serverRenderer_cjs_prodExports, Y as get, R as useForwardExpose, S as useVModel, P as Primitive, aN as useEventListener, U as Presence_default, T as createContext } from './server.mjs';
import { L as Label_default } from './Label-BBgw4vHh.mjs';
import { u as useDirection } from './useDirection-CXYby7CP.mjs';
import { u as useFormControl } from './useFormControl-_Lqv8ipK.mjs';
import { R as RovingFocusGroup_default } from './RovingFocusGroup-Vsbo7D6E.mjs';
import { V as VisuallyHiddenInput_default } from './VisuallyHiddenInput-q6Pz-w0i.mjs';
import { R as RovingFocusItem_default } from './RovingFocusItem-DwKRAYZk.mjs';
import { h as handleAndDispatchCustomEvent } from './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import { G as isEqual } from '../nitro/nitro.mjs';

const RADIO_SELECT = "radio.select";
function handleSelect(event, value, callback) {
  const eventDetail = {
    originalEvent: event,
    value
  };
  handleAndDispatchCustomEvent(RADIO_SELECT, callback, eventDetail);
}
var Radio_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Radio",
  props: {
    id: {
      type: String,
      required: false
    },
    value: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    checked: {
      type: Boolean,
      required: false,
      default: void 0
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: ["update:checked", "select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const checked = useVModel(props, "checked", emits, { passive: props.checked === void 0 });
    const { value } = vueExports.toRefs(props);
    const { forwardRef, currentElement: triggerElement } = useForwardExpose();
    const isFormControl = useFormControl(triggerElement);
    const ariaLabel = vueExports.computed(() => props.id && triggerElement.value ? (void 0).querySelector(`[for="${props.id}"]`)?.innerText ?? props.value : void 0);
    function handleClick(event) {
      if (props.disabled) return;
      handleSelect(event, props.value, (ev) => {
        emits("select", ev);
        if (ev?.defaultPrevented) return;
        checked.value = true;
        if (isFormControl.value) ev.stopPropagation();
      });
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(_ctx.$attrs, {
        id: _ctx.id,
        ref: vueExports.unref(forwardRef),
        role: "radio",
        type: _ctx.as === "button" ? "button" : void 0,
        as: _ctx.as,
        "aria-checked": vueExports.unref(checked),
        "aria-label": ariaLabel.value,
        "as-child": _ctx.asChild,
        disabled: _ctx.disabled ? "" : void 0,
        "data-state": vueExports.unref(checked) ? "checked" : "unchecked",
        "data-disabled": _ctx.disabled ? "" : void 0,
        value: vueExports.unref(value),
        required: _ctx.required,
        name: _ctx.name,
        onClick: vueExports.withModifiers(handleClick, ["stop"])
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", { checked: vueExports.unref(checked) }), vueExports.unref(isFormControl) && _ctx.name ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHiddenInput_default), {
          key: 0,
          type: "radio",
          tabindex: "-1",
          value: vueExports.unref(value),
          checked: !!vueExports.unref(checked),
          name: _ctx.name,
          disabled: _ctx.disabled,
          required: _ctx.required
        }, null, 8, [
          "value",
          "checked",
          "name",
          "disabled",
          "required"
        ])) : vueExports.createCommentVNode("v-if", true)]),
        _: 3
      }, 16, [
        "id",
        "type",
        "as",
        "aria-checked",
        "aria-label",
        "as-child",
        "disabled",
        "data-state",
        "data-disabled",
        "value",
        "required",
        "name"
      ]);
    };
  }
});
var Radio_default = Radio_vue_vue_type_script_setup_true_lang_default;
const [injectRadioGroupRootContext, provideRadioGroupRootContext] = createContext("RadioGroupRoot");
var RadioGroupRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "RadioGroupRoot",
  props: {
    modelValue: {
      type: null,
      required: false
    },
    defaultValue: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    orientation: {
      type: String,
      required: false,
      default: void 0
    },
    dir: {
      type: String,
      required: false
    },
    loop: {
      type: Boolean,
      required: false,
      default: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { forwardRef, currentElement } = useForwardExpose();
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue,
      passive: props.modelValue === void 0
    });
    const { disabled, loop, orientation, name, required, dir: propDir } = vueExports.toRefs(props);
    const dir = useDirection(propDir);
    const isFormControl = useFormControl(currentElement);
    provideRadioGroupRootContext({
      modelValue,
      changeModelValue: (value) => {
        modelValue.value = value;
      },
      disabled,
      loop,
      orientation,
      name: name?.value,
      required
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(RovingFocusGroup_default), {
        "as-child": "",
        orientation: vueExports.unref(orientation),
        dir: vueExports.unref(dir),
        loop: vueExports.unref(loop)
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          ref: vueExports.unref(forwardRef),
          role: "radiogroup",
          "data-disabled": vueExports.unref(disabled) ? "" : void 0,
          "as-child": _ctx.asChild,
          as: _ctx.as,
          "aria-orientation": vueExports.unref(orientation),
          "aria-required": vueExports.unref(required),
          dir: vueExports.unref(dir)
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", { modelValue: vueExports.unref(modelValue) }), vueExports.unref(isFormControl) && vueExports.unref(name) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHiddenInput_default), {
            key: 0,
            required: vueExports.unref(required),
            disabled: vueExports.unref(disabled),
            value: vueExports.unref(modelValue),
            name: vueExports.unref(name)
          }, null, 8, [
            "required",
            "disabled",
            "value",
            "name"
          ])) : vueExports.createCommentVNode("v-if", true)]),
          _: 3
        }, 8, [
          "data-disabled",
          "as-child",
          "as",
          "aria-orientation",
          "aria-required",
          "dir"
        ])]),
        _: 3
      }, 8, [
        "orientation",
        "dir",
        "loop"
      ]);
    };
  }
});
var RadioGroupRoot_default = RadioGroupRoot_vue_vue_type_script_setup_true_lang_default;
const [injectRadioGroupItemContext, provideRadiogroupItemContext] = createContext("RadioGroupItem");
var RadioGroupItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "RadioGroupItem",
  props: {
    id: {
      type: String,
      required: false
    },
    value: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { forwardRef, currentElement } = useForwardExpose();
    const rootContext = injectRadioGroupRootContext();
    const disabled = vueExports.computed(() => rootContext.disabled.value || props.disabled);
    const required = vueExports.computed(() => rootContext.required.value || props.required);
    const checked = vueExports.computed(() => isEqual(rootContext.modelValue?.value, props.value));
    provideRadiogroupItemContext({
      disabled,
      checked
    });
    const isArrowKeyPressed = vueExports.ref(false);
    const ARROW_KEYS = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight"
    ];
    useEventListener("keydown", (event) => {
      if (ARROW_KEYS.includes(event.key)) isArrowKeyPressed.value = true;
    });
    useEventListener("keyup", () => {
      isArrowKeyPressed.value = false;
    });
    function handleFocus() {
      setTimeout(() => {
        if (isArrowKeyPressed.value) currentElement.value?.click();
      }, 0);
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(RovingFocusItem_default), {
        checked: checked.value,
        disabled: disabled.value,
        "as-child": "",
        focusable: !disabled.value,
        active: checked.value
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(Radio_default, vueExports.mergeProps({
          ..._ctx.$attrs,
          ...props
        }, {
          ref: vueExports.unref(forwardRef),
          checked: checked.value,
          required: required.value,
          disabled: disabled.value,
          "onUpdate:checked": _cache[0] || (_cache[0] = ($event) => vueExports.unref(rootContext).changeModelValue(_ctx.value)),
          onSelect: _cache[1] || (_cache[1] = ($event) => emits("select", $event)),
          onKeydown: _cache[2] || (_cache[2] = vueExports.withKeys(vueExports.withModifiers(() => {
          }, ["prevent"]), ["enter"])),
          onFocus: handleFocus
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", {
            checked: checked.value,
            required: required.value,
            disabled: disabled.value
          })]),
          _: 3
        }, 16, [
          "checked",
          "required",
          "disabled"
        ])]),
        _: 3
      }, 8, [
        "checked",
        "disabled",
        "focusable",
        "active"
      ]);
    };
  }
});
var RadioGroupItem_default = RadioGroupItem_vue_vue_type_script_setup_true_lang_default;
var RadioGroupIndicator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "RadioGroupIndicator",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "span"
    }
  },
  setup(__props) {
    const { forwardRef } = useForwardExpose();
    const itemContext = injectRadioGroupItemContext();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Presence_default), { present: _ctx.forceMount || vueExports.unref(itemContext).checked.value }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), vueExports.mergeProps({
          ref: vueExports.unref(forwardRef),
          "data-state": vueExports.unref(itemContext).checked.value ? "checked" : "unchecked",
          "data-disabled": vueExports.unref(itemContext).disabled.value ? "" : void 0,
          "as-child": _ctx.asChild,
          as: _ctx.as
        }, _ctx.$attrs), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "data-state",
          "data-disabled",
          "as-child",
          "as"
        ])]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var RadioGroupIndicator_default = RadioGroupIndicator_vue_vue_type_script_setup_true_lang_default;
const theme = {
  "slots": {
    "root": "relative",
    "fieldset": "flex gap-x-2",
    "legend": "mb-1 block font-medium text-default",
    "item": "flex items-start",
    "container": "flex items-center",
    "base": "rounded-full ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
    "indicator": "flex items-center justify-center size-full after:bg-default after:rounded-full",
    "wrapper": "w-full",
    "label": "block font-medium text-default",
    "description": "text-muted"
  },
  "variants": {
    "color": {
      "primary": {
        "base": "focus-visible:outline-primary",
        "indicator": "bg-primary"
      },
      "secondary": {
        "base": "focus-visible:outline-secondary",
        "indicator": "bg-secondary"
      },
      "success": {
        "base": "focus-visible:outline-success",
        "indicator": "bg-success"
      },
      "info": {
        "base": "focus-visible:outline-info",
        "indicator": "bg-info"
      },
      "warning": {
        "base": "focus-visible:outline-warning",
        "indicator": "bg-warning"
      },
      "error": {
        "base": "focus-visible:outline-error",
        "indicator": "bg-error"
      },
      "neutral": {
        "base": "focus-visible:outline-inverted",
        "indicator": "bg-inverted"
      }
    },
    "variant": {
      "list": {
        "item": ""
      },
      "card": {
        "item": "border border-muted rounded-lg"
      },
      "table": {
        "item": "border border-muted"
      }
    },
    "orientation": {
      "horizontal": {
        "fieldset": "flex-row"
      },
      "vertical": {
        "fieldset": "flex-col"
      }
    },
    "indicator": {
      "start": {
        "item": "flex-row",
        "wrapper": "ms-2"
      },
      "end": {
        "item": "flex-row-reverse",
        "wrapper": "me-2"
      },
      "hidden": {
        "base": "sr-only",
        "wrapper": "text-center"
      }
    },
    "size": {
      "xs": {
        "fieldset": "gap-y-0.5",
        "legend": "text-xs",
        "base": "size-3",
        "item": "text-xs",
        "container": "h-4",
        "indicator": "after:size-1"
      },
      "sm": {
        "fieldset": "gap-y-0.5",
        "legend": "text-xs",
        "base": "size-3.5",
        "item": "text-xs",
        "container": "h-4",
        "indicator": "after:size-1"
      },
      "md": {
        "fieldset": "gap-y-1",
        "legend": "text-sm",
        "base": "size-4",
        "item": "text-sm",
        "container": "h-5",
        "indicator": "after:size-1.5"
      },
      "lg": {
        "fieldset": "gap-y-1",
        "legend": "text-sm",
        "base": "size-4.5",
        "item": "text-sm",
        "container": "h-5",
        "indicator": "after:size-1.5"
      },
      "xl": {
        "fieldset": "gap-y-1.5",
        "legend": "text-base",
        "base": "size-5",
        "item": "text-base",
        "container": "h-6",
        "indicator": "after:size-2"
      }
    },
    "disabled": {
      "true": {
        "item": "opacity-75",
        "base": "cursor-not-allowed",
        "label": "cursor-not-allowed",
        "description": "cursor-not-allowed"
      }
    },
    "required": {
      "true": {
        "legend": "after:content-['*'] after:ms-0.5 after:text-error"
      }
    }
  },
  "compoundVariants": [
    {
      "size": "xs",
      "variant": [
        "card",
        "table"
      ],
      "class": {
        "item": "p-2.5"
      }
    },
    {
      "size": "sm",
      "variant": [
        "card",
        "table"
      ],
      "class": {
        "item": "p-3"
      }
    },
    {
      "size": "md",
      "variant": [
        "card",
        "table"
      ],
      "class": {
        "item": "p-3.5"
      }
    },
    {
      "size": "lg",
      "variant": [
        "card",
        "table"
      ],
      "class": {
        "item": "p-4"
      }
    },
    {
      "size": "xl",
      "variant": [
        "card",
        "table"
      ],
      "class": {
        "item": "p-4.5"
      }
    },
    {
      "orientation": "horizontal",
      "variant": "table",
      "class": {
        "item": "first-of-type:rounded-s-lg last-of-type:rounded-e-lg",
        "fieldset": "gap-0 -space-x-px"
      }
    },
    {
      "orientation": "vertical",
      "variant": "table",
      "class": {
        "item": "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
        "fieldset": "gap-0 -space-y-px"
      }
    },
    {
      "color": "primary",
      "variant": "card",
      "class": {
        "item": "has-data-[state=checked]:border-primary"
      }
    },
    {
      "color": "secondary",
      "variant": "card",
      "class": {
        "item": "has-data-[state=checked]:border-secondary"
      }
    },
    {
      "color": "success",
      "variant": "card",
      "class": {
        "item": "has-data-[state=checked]:border-success"
      }
    },
    {
      "color": "info",
      "variant": "card",
      "class": {
        "item": "has-data-[state=checked]:border-info"
      }
    },
    {
      "color": "warning",
      "variant": "card",
      "class": {
        "item": "has-data-[state=checked]:border-warning"
      }
    },
    {
      "color": "error",
      "variant": "card",
      "class": {
        "item": "has-data-[state=checked]:border-error"
      }
    },
    {
      "color": "neutral",
      "variant": "card",
      "class": {
        "item": "has-data-[state=checked]:border-inverted"
      }
    },
    {
      "color": "primary",
      "variant": "table",
      "class": {
        "item": "has-data-[state=checked]:bg-primary/10 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      "color": "secondary",
      "variant": "table",
      "class": {
        "item": "has-data-[state=checked]:bg-secondary/10 has-data-[state=checked]:border-secondary/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      "color": "success",
      "variant": "table",
      "class": {
        "item": "has-data-[state=checked]:bg-success/10 has-data-[state=checked]:border-success/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      "color": "info",
      "variant": "table",
      "class": {
        "item": "has-data-[state=checked]:bg-info/10 has-data-[state=checked]:border-info/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      "color": "warning",
      "variant": "table",
      "class": {
        "item": "has-data-[state=checked]:bg-warning/10 has-data-[state=checked]:border-warning/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      "color": "error",
      "variant": "table",
      "class": {
        "item": "has-data-[state=checked]:bg-error/10 has-data-[state=checked]:border-error/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      "color": "neutral",
      "variant": "table",
      "class": {
        "item": "has-data-[state=checked]:bg-elevated has-data-[state=checked]:border-inverted/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      "variant": [
        "card",
        "table"
      ],
      "disabled": true,
      "class": {
        "item": "cursor-not-allowed"
      }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "list",
    "orientation": "vertical",
    "indicator": "start"
  }
};
const _sfc_main = {
  __name: "URadioGroup",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    legend: { type: String, required: false },
    valueKey: { type: null, required: false, default: "value" },
    labelKey: { type: null, required: false, default: "label" },
    descriptionKey: { type: null, required: false, default: "description" },
    items: { type: null, required: false },
    modelValue: { type: null, required: false },
    defaultValue: { type: null, required: false },
    size: { type: null, required: false },
    variant: { type: null, required: false },
    color: { type: null, required: false },
    orientation: { type: null, required: false, default: "vertical" },
    indicator: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    loop: { type: Boolean, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false }
  },
  emits: ["change", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = vueExports.useSlots();
    const appConfig = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "as", "loop", "required"), emits);
    const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled, ariaAttrs } = useFormField(props, { bind: false });
    const id = _id.value ?? vueExports.useId();
    const ui = vueExports.computed(() => tv({ extend: tv(theme), ...appConfig.ui?.radioGroup || {} })({
      size: size.value,
      color: color.value,
      disabled: disabled.value,
      required: props.required,
      orientation: props.orientation,
      variant: props.variant,
      indicator: props.indicator
    }));
    function normalizeItem(item) {
      if (item === null) {
        return {
          id: `${id}:null`,
          value: void 0,
          label: void 0
        };
      }
      if (typeof item === "string" || typeof item === "number" || typeof item === "bigint") {
        return {
          id: `${id}:${item}`,
          value: String(item),
          label: String(item)
        };
      }
      const value = get(item, props.valueKey);
      const label = get(item, props.labelKey);
      const description = get(item, props.descriptionKey);
      return {
        ...item,
        value,
        label,
        description,
        id: `${id}:${value}`
      };
    }
    const normalizedItems = vueExports.computed(() => {
      if (!props.items) {
        return [];
      }
      return props.items.map(normalizeItem);
    });
    function onUpdate(value) {
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(RadioGroupRoot_default), vueExports.mergeProps({ id: vueExports.unref(id) }, vueExports.unref(rootProps), {
        "model-value": __props.modelValue,
        "default-value": __props.defaultValue,
        orientation: __props.orientation,
        name: vueExports.unref(name),
        disabled: vueExports.unref(disabled),
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] }),
        "onUpdate:modelValue": onUpdate
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<fieldset${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
              "data-slot": "fieldset",
              class: ui.value.fieldset({ class: props.ui?.fieldset })
            }, vueExports.unref(ariaAttrs)))}${_scopeId}>`);
            if (__props.legend || !!slots.legend) {
              _push2(`<legend data-slot="legend" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.legend({ class: props.ui?.legend }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "legend", {}, () => {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.legend)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</legend>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(normalizedItems.value, (item) => {
              serverRenderer_cjs_prodExports.ssrRenderVNode(_push2, vueExports.createVNode(vueExports.resolveDynamicComponent(!__props.variant || __props.variant === "list" ? "div" : vueExports.unref(Label_default)), {
                key: item.value,
                "data-slot": "item",
                class: ui.value.item({ class: [props.ui?.item, item.ui?.item, item.class], disabled: item.disabled || vueExports.unref(disabled) })
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div data-slot="container" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.container({ class: [props.ui?.container, item.ui?.container] }))}"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(RadioGroupItem_default), {
                      id: item.id,
                      value: item.value,
                      disabled: item.disabled || vueExports.unref(disabled),
                      "data-slot": "base",
                      class: ui.value.base({ class: [props.ui?.base, item.ui?.base], disabled: item.disabled || vueExports.unref(disabled) })
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(RadioGroupIndicator_default), {
                            "data-slot": "indicator",
                            class: ui.value.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(vueExports.unref(RadioGroupIndicator_default), {
                              "data-slot": "indicator",
                              class: ui.value.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })
                            }, null, 8, ["class"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                    if (item.label || !!slots.label || (item.description || !!slots.description)) {
                      _push3(`<div data-slot="wrapper" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] }))}"${_scopeId2}>`);
                      if (item.label || !!slots.label) {
                        serverRenderer_cjs_prodExports.ssrRenderVNode(_push3, vueExports.createVNode(vueExports.resolveDynamicComponent(!__props.variant || __props.variant === "list" ? vueExports.unref(Label_default) : "p"), {
                          for: item.id,
                          "data-slot": "label",
                          class: ui.value.label({ class: [props.ui?.label, item.ui?.label], disabled: item.disabled || vueExports.unref(disabled) })
                        }, {
                          default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "label", {
                                item,
                                modelValue: __props.modelValue
                              }, () => {
                                _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}`);
                              }, _push4, _parent4, _scopeId3);
                            } else {
                              return [
                                vueExports.renderSlot(_ctx.$slots, "label", {
                                  item,
                                  modelValue: __props.modelValue
                                }, () => [
                                  vueExports.createTextVNode(vueExports.toDisplayString(item.label), 1)
                                ])
                              ];
                            }
                          }),
                          _: 2
                        }), _parent3, _scopeId2);
                      } else {
                        _push3(`<!---->`);
                      }
                      if (item.description || !!slots.description) {
                        _push3(`<p data-slot="description" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.description({ class: [props.ui?.description, item.ui?.description], disabled: item.disabled || vueExports.unref(disabled) }))}"${_scopeId2}>`);
                        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "description", {
                          item,
                          modelValue: __props.modelValue
                        }, () => {
                          _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(item.description)}`);
                        }, _push3, _parent3, _scopeId2);
                        _push3(`</p>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      vueExports.createVNode("div", {
                        "data-slot": "container",
                        class: ui.value.container({ class: [props.ui?.container, item.ui?.container] })
                      }, [
                        vueExports.createVNode(vueExports.unref(RadioGroupItem_default), {
                          id: item.id,
                          value: item.value,
                          disabled: item.disabled || vueExports.unref(disabled),
                          "data-slot": "base",
                          class: ui.value.base({ class: [props.ui?.base, item.ui?.base], disabled: item.disabled || vueExports.unref(disabled) })
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(vueExports.unref(RadioGroupIndicator_default), {
                              "data-slot": "indicator",
                              class: ui.value.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })
                            }, null, 8, ["class"])
                          ]),
                          _: 2
                        }, 1032, ["id", "value", "disabled", "class"])
                      ], 2),
                      item.label || !!slots.label || (item.description || !!slots.description) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        "data-slot": "wrapper",
                        class: ui.value.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })
                      }, [
                        item.label || !!slots.label ? (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(!__props.variant || __props.variant === "list" ? vueExports.unref(Label_default) : "p"), {
                          key: 0,
                          for: item.id,
                          "data-slot": "label",
                          class: ui.value.label({ class: [props.ui?.label, item.ui?.label], disabled: item.disabled || vueExports.unref(disabled) })
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.renderSlot(_ctx.$slots, "label", {
                              item,
                              modelValue: __props.modelValue
                            }, () => [
                              vueExports.createTextVNode(vueExports.toDisplayString(item.label), 1)
                            ])
                          ]),
                          _: 2
                        }, 1032, ["for", "class"])) : vueExports.createCommentVNode("", true),
                        item.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock("p", {
                          key: 1,
                          "data-slot": "description",
                          class: ui.value.description({ class: [props.ui?.description, item.ui?.description], disabled: item.disabled || vueExports.unref(disabled) })
                        }, [
                          vueExports.renderSlot(_ctx.$slots, "description", {
                            item,
                            modelValue: __props.modelValue
                          }, () => [
                            vueExports.createTextVNode(vueExports.toDisplayString(item.description), 1)
                          ])
                        ], 2)) : vueExports.createCommentVNode("", true)
                      ], 2)) : vueExports.createCommentVNode("", true)
                    ];
                  }
                }),
                _: 2
              }), _parent2, _scopeId);
            });
            _push2(`<!--]--></fieldset>`);
          } else {
            return [
              vueExports.createVNode("fieldset", vueExports.mergeProps({
                "data-slot": "fieldset",
                class: ui.value.fieldset({ class: props.ui?.fieldset })
              }, vueExports.unref(ariaAttrs)), [
                __props.legend || !!slots.legend ? (vueExports.openBlock(), vueExports.createBlock("legend", {
                  key: 0,
                  "data-slot": "legend",
                  class: ui.value.legend({ class: props.ui?.legend })
                }, [
                  vueExports.renderSlot(_ctx.$slots, "legend", {}, () => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.legend), 1)
                  ])
                ], 2)) : vueExports.createCommentVNode("", true),
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(normalizedItems.value, (item) => {
                  return vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(!__props.variant || __props.variant === "list" ? "div" : vueExports.unref(Label_default)), {
                    key: item.value,
                    "data-slot": "item",
                    class: ui.value.item({ class: [props.ui?.item, item.ui?.item, item.class], disabled: item.disabled || vueExports.unref(disabled) })
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", {
                        "data-slot": "container",
                        class: ui.value.container({ class: [props.ui?.container, item.ui?.container] })
                      }, [
                        vueExports.createVNode(vueExports.unref(RadioGroupItem_default), {
                          id: item.id,
                          value: item.value,
                          disabled: item.disabled || vueExports.unref(disabled),
                          "data-slot": "base",
                          class: ui.value.base({ class: [props.ui?.base, item.ui?.base], disabled: item.disabled || vueExports.unref(disabled) })
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(vueExports.unref(RadioGroupIndicator_default), {
                              "data-slot": "indicator",
                              class: ui.value.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })
                            }, null, 8, ["class"])
                          ]),
                          _: 2
                        }, 1032, ["id", "value", "disabled", "class"])
                      ], 2),
                      item.label || !!slots.label || (item.description || !!slots.description) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        "data-slot": "wrapper",
                        class: ui.value.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })
                      }, [
                        item.label || !!slots.label ? (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(!__props.variant || __props.variant === "list" ? vueExports.unref(Label_default) : "p"), {
                          key: 0,
                          for: item.id,
                          "data-slot": "label",
                          class: ui.value.label({ class: [props.ui?.label, item.ui?.label], disabled: item.disabled || vueExports.unref(disabled) })
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.renderSlot(_ctx.$slots, "label", {
                              item,
                              modelValue: __props.modelValue
                            }, () => [
                              vueExports.createTextVNode(vueExports.toDisplayString(item.label), 1)
                            ])
                          ]),
                          _: 2
                        }, 1032, ["for", "class"])) : vueExports.createCommentVNode("", true),
                        item.description || !!slots.description ? (vueExports.openBlock(), vueExports.createBlock("p", {
                          key: 1,
                          "data-slot": "description",
                          class: ui.value.description({ class: [props.ui?.description, item.ui?.description], disabled: item.disabled || vueExports.unref(disabled) })
                        }, [
                          vueExports.renderSlot(_ctx.$slots, "description", {
                            item,
                            modelValue: __props.modelValue
                          }, () => [
                            vueExports.createTextVNode(vueExports.toDisplayString(item.description), 1)
                          ])
                        ], 2)) : vueExports.createCommentVNode("", true)
                      ], 2)) : vueExports.createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1032, ["class"]);
                }), 128))
              ], 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.4.0_@tiptap+extensions@3.22.2_@tiptap+core@3.22.2_@tiptap+pm@3.22.2__@tiptap_ff602f8142f0ba128c11c1e82cd47490/node_modules/@nuxt/ui/dist/runtime/components/RadioGroup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=RadioGroup-DnRwe9KX.mjs.map
