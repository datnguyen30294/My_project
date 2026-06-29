import { v as vueExports, a as useAppConfig, a0 as useForwardProps, X as reactivePick, t as tv, Y as get, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, S as useVModel, R as useForwardExpose, P as Primitive, T as createContext, a6 as getActiveElement } from './server.mjs';
import { u as useDirection } from './useDirection-CXYby7CP.mjs';
import { u as useId } from './FocusScope-BZehoQSg.mjs';
import { S as Separator_default } from './Separator-DtmsHEyk.mjs';
import { u as useArrowNavigation } from './useArrowNavigation-m9a1sGcE.mjs';
import { u as useKbd } from './useKbd-JjFOu4f7.mjs';

const _hoisted_1 = {
  "aria-live": "polite",
  "aria-atomic": "true",
  role: "status",
  style: {
    transform: "translateX(-100%)",
    position: "absolute",
    pointerEvents: "none",
    opacity: 0,
    margin: 0
  }
};
const [injectStepperRootContext, provideStepperRootContext] = createContext("StepperRoot");
var StepperRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StepperRoot",
  props: {
    defaultValue: {
      type: Number,
      required: false,
      default: 1
    },
    orientation: {
      type: String,
      required: false,
      default: "horizontal"
    },
    dir: {
      type: String,
      required: false
    },
    modelValue: {
      type: Number,
      required: false
    },
    linear: {
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
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { dir: propDir, orientation: propOrientation, linear } = vueExports.toRefs(props);
    const dir = useDirection(propDir);
    const totalStepperItems = vueExports.ref(/* @__PURE__ */ new Set());
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue,
      passive: props.modelValue === void 0
    });
    const totalStepperItemsArray = vueExports.computed(() => Array.from(totalStepperItems.value));
    const isFirstStep = vueExports.computed(() => modelValue.value === 1);
    const isLastStep = vueExports.computed(() => modelValue.value === totalStepperItemsArray.value.length);
    const totalSteps = vueExports.computed(() => totalStepperItems.value.size);
    function goToStep(step) {
      if (step > totalSteps.value) return;
      if (step < 1) return;
      if (totalStepperItems.value.size && !!totalStepperItemsArray.value[step] && !!totalStepperItemsArray.value[step].getAttribute("disabled")) return;
      if (linear.value) {
        if (step > (modelValue.value ?? 1) + 1) return;
      }
      modelValue.value = step;
    }
    function nextStep() {
      goToStep((modelValue.value ?? 1) + 1);
    }
    function prevStep() {
      goToStep((modelValue.value ?? 1) - 1);
    }
    function hasNext() {
      return (modelValue.value ?? 1) < totalSteps.value;
    }
    function hasPrev() {
      return (modelValue.value ?? 1) > 1;
    }
    const nextStepperItem = vueExports.ref(null);
    const prevStepperItem = vueExports.ref(null);
    const isNextDisabled = vueExports.computed(() => nextStepperItem.value ? nextStepperItem.value.getAttribute("disabled") === "" : true);
    const isPrevDisabled = vueExports.computed(() => prevStepperItem.value ? prevStepperItem.value.getAttribute("disabled") === "" : true);
    vueExports.watch(modelValue, async () => {
      await vueExports.nextTick(() => {
        nextStepperItem.value = totalStepperItemsArray.value.length && modelValue.value < totalStepperItemsArray.value.length ? totalStepperItemsArray.value[modelValue.value] : null;
        prevStepperItem.value = totalStepperItemsArray.value.length && modelValue.value > 1 ? totalStepperItemsArray.value[modelValue.value - 2] : null;
      });
    });
    vueExports.watch(totalStepperItemsArray, async () => {
      await vueExports.nextTick(() => {
        nextStepperItem.value = totalStepperItemsArray.value.length && modelValue.value < totalStepperItemsArray.value.length ? totalStepperItemsArray.value[modelValue.value] : null;
        prevStepperItem.value = totalStepperItemsArray.value.length && modelValue.value > 1 ? totalStepperItemsArray.value[modelValue.value - 2] : null;
      });
    });
    provideStepperRootContext({
      modelValue,
      changeModelValue: (value) => {
        modelValue.value = value;
      },
      orientation: propOrientation,
      dir,
      linear,
      totalStepperItems
    });
    __expose({
      goToStep,
      nextStep,
      prevStep,
      modelValue,
      totalSteps,
      isNextDisabled,
      isPrevDisabled,
      isFirstStep,
      isLastStep,
      hasNext,
      hasPrev
    });
    useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        role: "group",
        "aria-label": "progress",
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "data-linear": vueExports.unref(linear) ? "" : void 0,
        "data-orientation": _ctx.orientation
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", {
          modelValue: vueExports.unref(modelValue),
          totalSteps: totalStepperItems.value.size,
          isNextDisabled: isNextDisabled.value,
          isPrevDisabled: isPrevDisabled.value,
          isFirstStep: isFirstStep.value,
          isLastStep: isLastStep.value,
          goToStep,
          nextStep,
          prevStep,
          hasNext,
          hasPrev
        }), vueExports.createElementVNode("div", _hoisted_1, " Step " + vueExports.toDisplayString(vueExports.unref(modelValue)) + " of " + vueExports.toDisplayString(totalStepperItems.value.size), 1)]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "data-linear",
        "data-orientation"
      ]);
    };
  }
});
var StepperRoot_default = StepperRoot_vue_vue_type_script_setup_true_lang_default;
const [injectStepperItemContext, provideStepperItemContext] = createContext("StepperItem");
var StepperItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StepperItem",
  props: {
    step: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    completed: {
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
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const { disabled, step, completed } = vueExports.toRefs(props);
    const { forwardRef } = useForwardExpose();
    const rootContext = injectStepperRootContext();
    const titleId = useId(void 0, "reka-stepper-item-title");
    const descriptionId = useId(void 0, "reka-stepper-item-description");
    const itemState = vueExports.computed(() => {
      if (completed.value) return "completed";
      if (rootContext.modelValue.value === step.value) return "active";
      if (rootContext.modelValue.value > step.value) return "completed";
      return "inactive";
    });
    const isFocusable = vueExports.computed(() => {
      if (disabled.value) return false;
      if (rootContext.linear.value) return step.value <= rootContext.modelValue.value || step.value === rootContext.modelValue.value + 1;
      return true;
    });
    provideStepperItemContext({
      titleId,
      descriptionId,
      state: itemState,
      disabled,
      step,
      isFocusable
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        ref: vueExports.unref(forwardRef),
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "aria-current": itemState.value === "active" ? "true" : void 0,
        "data-state": itemState.value,
        disabled: vueExports.unref(disabled) || !isFocusable.value ? "" : void 0,
        "data-disabled": vueExports.unref(disabled) || !isFocusable.value ? "" : void 0,
        "data-orientation": vueExports.unref(rootContext).orientation.value
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", { state: itemState.value })]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "aria-current",
        "data-state",
        "disabled",
        "data-disabled",
        "data-orientation"
      ]);
    };
  }
});
var StepperItem_default = StepperItem_vue_vue_type_script_setup_true_lang_default;
var StepperDescription_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StepperDescription",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "p"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const itemContext = injectStepperItemContext();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, { id: vueExports.unref(itemContext).descriptionId }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var StepperDescription_default = StepperDescription_vue_vue_type_script_setup_true_lang_default;
var StepperIndicator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StepperIndicator",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const itemContext = injectStepperItemContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.normalizeProps(vueExports.guardReactiveProps(props)), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", { step: vueExports.unref(itemContext).step.value }, () => [vueExports.createTextVNode(" Step " + vueExports.toDisplayString(vueExports.unref(itemContext).step.value), 1)])]),
        _: 3
      }, 16);
    };
  }
});
var StepperIndicator_default = StepperIndicator_vue_vue_type_script_setup_true_lang_default;
var StepperSeparator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StepperSeparator",
  props: {
    orientation: {
      type: String,
      required: false
    },
    decorative: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectStepperRootContext();
    const itemContext = injectStepperItemContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Separator_default), vueExports.mergeProps(props, {
        decorative: "",
        orientation: vueExports.unref(rootContext).orientation.value,
        "data-state": vueExports.unref(itemContext).state.value
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["orientation", "data-state"]);
    };
  }
});
var StepperSeparator_default = StepperSeparator_vue_vue_type_script_setup_true_lang_default;
var StepperTitle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StepperTitle",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "h4"
    }
  },
  setup(__props) {
    const props = __props;
    const itemContext = injectStepperItemContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, { id: vueExports.unref(itemContext).titleId }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var StepperTitle_default = StepperTitle_vue_vue_type_script_setup_true_lang_default;
var StepperTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StepperTrigger",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const rootContext = injectStepperRootContext();
    const itemContext = injectStepperItemContext();
    const kbd = useKbd();
    const stepperItems = vueExports.computed(() => Array.from(rootContext.totalStepperItems.value));
    function handleMouseDown(event) {
      if (itemContext.disabled.value) return;
      if (rootContext.linear.value) {
        if (itemContext.step.value <= rootContext.modelValue.value || itemContext.step.value === rootContext.modelValue.value + 1) {
          if (event.ctrlKey === false) {
            rootContext.changeModelValue(itemContext.step.value);
            return;
          }
        }
      } else if (event.ctrlKey === false) {
        rootContext.changeModelValue(itemContext.step.value);
        return;
      }
      event.preventDefault();
    }
    function handleKeyDown(event) {
      event.preventDefault();
      if (itemContext.disabled.value) return;
      if ((event.key === kbd.ENTER || event.key === kbd.SPACE) && !event.ctrlKey && !event.shiftKey) rootContext.changeModelValue(itemContext.step.value);
      if ([
        kbd.ARROW_LEFT,
        kbd.ARROW_RIGHT,
        kbd.ARROW_UP,
        kbd.ARROW_DOWN
      ].includes(event.key)) useArrowNavigation(event, getActiveElement(), void 0, {
        itemsArray: stepperItems.value,
        focus: true,
        loop: false,
        arrowKeyOptions: rootContext.orientation.value,
        dir: rootContext.dir.value
      });
    }
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        ref: vueExports.unref(forwardRef),
        type: _ctx.as === "button" ? "button" : void 0,
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "data-state": vueExports.unref(itemContext).state.value,
        disabled: vueExports.unref(itemContext).disabled.value || !vueExports.unref(itemContext).isFocusable.value ? "" : void 0,
        "data-disabled": vueExports.unref(itemContext).disabled.value || !vueExports.unref(itemContext).isFocusable.value ? "" : void 0,
        "data-orientation": vueExports.unref(rootContext).orientation.value,
        tabindex: vueExports.unref(itemContext).isFocusable.value ? 0 : -1,
        "aria-describedby": vueExports.unref(itemContext).descriptionId,
        "aria-labelledby": vueExports.unref(itemContext).titleId,
        onMousedown: vueExports.withModifiers(handleMouseDown, ["left"]),
        onKeydown: vueExports.withKeys(handleKeyDown, [
          "enter",
          "space",
          "left",
          "right",
          "up",
          "down"
        ])
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "type",
        "as",
        "as-child",
        "data-state",
        "disabled",
        "data-disabled",
        "data-orientation",
        "tabindex",
        "aria-describedby",
        "aria-labelledby"
      ]);
    };
  }
});
var StepperTrigger_default = StepperTrigger_vue_vue_type_script_setup_true_lang_default;
const theme = {
  "slots": {
    "root": "flex gap-4",
    "header": "flex",
    "item": "group text-center relative w-full",
    "container": "relative",
    "trigger": "rounded-full font-medium text-center align-middle flex items-center justify-center font-semibold group-data-[state=completed]:text-inverted group-data-[state=active]:text-inverted text-muted bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2",
    "indicator": "flex items-center justify-center size-full",
    "icon": "shrink-0",
    "separator": "absolute rounded-full group-data-[disabled]:opacity-75 bg-accented",
    "wrapper": "",
    "title": "font-medium text-default",
    "description": "text-muted text-wrap",
    "content": "size-full"
  },
  "variants": {
    "orientation": {
      "horizontal": {
        "root": "flex-col",
        "container": "flex justify-center",
        "separator": "top-[calc(50%-2px)] h-0.5",
        "wrapper": "mt-1"
      },
      "vertical": {
        "header": "flex-col gap-4",
        "item": "flex text-start",
        "separator": "start-[calc(50%-1px)] -bottom-[10px] w-0.5"
      }
    },
    "size": {
      "xs": {
        "trigger": "size-6 text-xs",
        "icon": "size-3",
        "title": "text-xs",
        "description": "text-xs",
        "wrapper": "mt-1.5"
      },
      "sm": {
        "trigger": "size-8 text-sm",
        "icon": "size-4",
        "title": "text-xs",
        "description": "text-xs",
        "wrapper": "mt-2"
      },
      "md": {
        "trigger": "size-10 text-base",
        "icon": "size-5",
        "title": "text-sm",
        "description": "text-sm",
        "wrapper": "mt-2.5"
      },
      "lg": {
        "trigger": "size-12 text-lg",
        "icon": "size-6",
        "title": "text-base",
        "description": "text-base",
        "wrapper": "mt-3"
      },
      "xl": {
        "trigger": "size-14 text-xl",
        "icon": "size-7",
        "title": "text-lg",
        "description": "text-lg",
        "wrapper": "mt-3.5"
      }
    },
    "color": {
      "primary": {
        "trigger": "group-data-[state=completed]:bg-primary group-data-[state=active]:bg-primary focus-visible:outline-primary",
        "separator": "group-data-[state=completed]:bg-primary"
      },
      "secondary": {
        "trigger": "group-data-[state=completed]:bg-secondary group-data-[state=active]:bg-secondary focus-visible:outline-secondary",
        "separator": "group-data-[state=completed]:bg-secondary"
      },
      "success": {
        "trigger": "group-data-[state=completed]:bg-success group-data-[state=active]:bg-success focus-visible:outline-success",
        "separator": "group-data-[state=completed]:bg-success"
      },
      "info": {
        "trigger": "group-data-[state=completed]:bg-info group-data-[state=active]:bg-info focus-visible:outline-info",
        "separator": "group-data-[state=completed]:bg-info"
      },
      "warning": {
        "trigger": "group-data-[state=completed]:bg-warning group-data-[state=active]:bg-warning focus-visible:outline-warning",
        "separator": "group-data-[state=completed]:bg-warning"
      },
      "error": {
        "trigger": "group-data-[state=completed]:bg-error group-data-[state=active]:bg-error focus-visible:outline-error",
        "separator": "group-data-[state=completed]:bg-error"
      },
      "neutral": {
        "trigger": "group-data-[state=completed]:bg-inverted group-data-[state=active]:bg-inverted focus-visible:outline-inverted",
        "separator": "group-data-[state=completed]:bg-inverted"
      }
    }
  },
  "compoundVariants": [
    {
      "orientation": "horizontal",
      "size": "xs",
      "class": {
        "separator": "start-[calc(50%+16px)] end-[calc(-50%+16px)]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "sm",
      "class": {
        "separator": "start-[calc(50%+20px)] end-[calc(-50%+20px)]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "md",
      "class": {
        "separator": "start-[calc(50%+28px)] end-[calc(-50%+28px)]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "lg",
      "class": {
        "separator": "start-[calc(50%+32px)] end-[calc(-50%+32px)]"
      }
    },
    {
      "orientation": "horizontal",
      "size": "xl",
      "class": {
        "separator": "start-[calc(50%+36px)] end-[calc(-50%+36px)]"
      }
    },
    {
      "orientation": "vertical",
      "size": "xs",
      "class": {
        "separator": "top-[30px]",
        "item": "gap-1.5"
      }
    },
    {
      "orientation": "vertical",
      "size": "sm",
      "class": {
        "separator": "top-[38px]",
        "item": "gap-2"
      }
    },
    {
      "orientation": "vertical",
      "size": "md",
      "class": {
        "separator": "top-[46px]",
        "item": "gap-2.5"
      }
    },
    {
      "orientation": "vertical",
      "size": "lg",
      "class": {
        "separator": "top-[54px]",
        "item": "gap-3"
      }
    },
    {
      "orientation": "vertical",
      "size": "xl",
      "class": {
        "separator": "top-[62px]",
        "item": "gap-3.5"
      }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary"
  }
};
const _sfc_main = {
  __name: "UStepper",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    as: { type: null, required: false },
    items: { type: Array, required: true },
    size: { type: null, required: false },
    color: { type: null, required: false },
    orientation: { type: null, required: false, default: "horizontal" },
    valueKey: { type: null, required: false, default: "value" },
    defaultValue: { type: [String, Number], required: false },
    disabled: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    linear: { type: Boolean, required: false, default: true }
  }, {
    "modelValue": { type: [String, Number] },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ vueExports.mergeModels(["next", "prev"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = vueExports.useSlots();
    const modelValue = vueExports.useModel(__props, "modelValue");
    const appConfig = useAppConfig();
    const rootProps = useForwardProps(reactivePick(props, "as", "linear"));
    const ui = vueExports.computed(() => tv({ extend: tv(theme), ...appConfig.ui?.stepper || {} })({
      orientation: props.orientation,
      size: props.size,
      color: props.color
    }));
    const currentStepIndex = vueExports.computed({
      get() {
        const value = modelValue.value ?? props.defaultValue;
        return (typeof value === "string" ? props.items.findIndex((item) => get(item, props.valueKey) === value) : value) ?? 0;
      },
      set(value) {
        modelValue.value = get(props.items?.[value], props.valueKey) ?? value;
      }
    });
    const currentStep = vueExports.computed(() => props.items?.[currentStepIndex.value]);
    const hasNext = vueExports.computed(() => currentStepIndex.value < props.items?.length - 1);
    const hasPrev = vueExports.computed(() => currentStepIndex.value > 0);
    __expose({
      next() {
        if (hasNext.value) {
          currentStepIndex.value += 1;
          emits("next", currentStep.value);
        }
      },
      prev() {
        if (hasPrev.value) {
          currentStepIndex.value -= 1;
          emits("prev", currentStep.value);
        }
      },
      hasNext,
      hasPrev
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(StepperRoot_default), vueExports.mergeProps(vueExports.unref(rootProps), {
        modelValue: currentStepIndex.value,
        "onUpdate:modelValue": ($event) => currentStepIndex.value = $event,
        orientation: __props.orientation,
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-slot="header" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.header({ class: props.ui?.header }))}"${_scopeId}><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(__props.items, (item, count) => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(StepperItem_default), {
                key: count,
                step: count,
                disabled: item.disabled || props.disabled,
                "data-slot": "item",
                class: ui.value.item({ class: [props.ui?.item, item.ui?.item, item.class] })
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div data-slot="container" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.container({ class: [props.ui?.container, item.ui?.container] }))}"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(StepperTrigger_default), {
                      "data-slot": "trigger",
                      class: ui.value.trigger({ class: [props.ui?.trigger, item.ui?.trigger] })
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(StepperIndicator_default), {
                            "data-slot": "indicator",
                            class: ui.value.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })
                          }, {
                            default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "indicator", {
                                  item,
                                  ui: ui.value
                                }, () => {
                                  if (item.icon) {
                                    _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$h, {
                                      name: item.icon,
                                      "data-slot": "icon",
                                      class: ui.value.icon({ class: [props.ui?.icon, item.ui?.icon] })
                                    }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!--[-->${serverRenderer_cjs_prodExports.ssrInterpolate(count + 1)}<!--]-->`);
                                  }
                                }, _push5, _parent5, _scopeId4);
                              } else {
                                return [
                                  vueExports.renderSlot(_ctx.$slots, "indicator", {
                                    item,
                                    ui: ui.value
                                  }, () => [
                                    item.icon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$h, {
                                      key: 0,
                                      name: item.icon,
                                      "data-slot": "icon",
                                      class: ui.value.icon({ class: [props.ui?.icon, item.ui?.icon] })
                                    }, null, 8, ["name", "class"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                                      vueExports.createTextVNode(vueExports.toDisplayString(count + 1), 1)
                                    ], 64))
                                  ])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(vueExports.unref(StepperIndicator_default), {
                              "data-slot": "indicator",
                              class: ui.value.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.renderSlot(_ctx.$slots, "indicator", {
                                  item,
                                  ui: ui.value
                                }, () => [
                                  item.icon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$h, {
                                    key: 0,
                                    name: item.icon,
                                    "data-slot": "icon",
                                    class: ui.value.icon({ class: [props.ui?.icon, item.ui?.icon] })
                                  }, null, 8, ["name", "class"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                                    vueExports.createTextVNode(vueExports.toDisplayString(count + 1), 1)
                                  ], 64))
                                ])
                              ]),
                              _: 2
                            }, 1032, ["class"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    if (count < __props.items.length - 1) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(StepperSeparator_default), {
                        "data-slot": "separator",
                        class: ui.value.separator({ class: [props.ui?.separator, item.ui?.separator] })
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><div data-slot="wrapper" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] }))}"${_scopeId2}>`);
                    serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-wrapper` : "wrapper", { item }, () => {
                      if (item.title || !!slots[item.slot ? `${item.slot}-title` : "title"]) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(StepperTitle_default), {
                          as: "div",
                          "data-slot": "title",
                          class: ui.value.title({ class: [props.ui?.title, item.ui?.title] })
                        }, {
                          default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-title` : "title", { item }, () => {
                                _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(item.title)}`);
                              }, _push4, _parent4, _scopeId3);
                            } else {
                              return [
                                vueExports.renderSlot(_ctx.$slots, item.slot ? `${item.slot}-title` : "title", { item }, () => [
                                  vueExports.createTextVNode(vueExports.toDisplayString(item.title), 1)
                                ])
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                      if (item.description || !!slots[item.slot ? `${item.slot}-description` : "description"]) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(StepperDescription_default), {
                          as: "div",
                          "data-slot": "description",
                          class: ui.value.description({ class: [props.ui?.description, item.ui?.description] })
                        }, {
                          default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, item.slot ? `${item.slot}-description` : "description", { item }, () => {
                                _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(item.description)}`);
                              }, _push4, _parent4, _scopeId3);
                            } else {
                              return [
                                vueExports.renderSlot(_ctx.$slots, item.slot ? `${item.slot}-description` : "description", { item }, () => [
                                  vueExports.createTextVNode(vueExports.toDisplayString(item.description), 1)
                                ])
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                    }, _push3, _parent3, _scopeId2);
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", {
                        "data-slot": "container",
                        class: ui.value.container({ class: [props.ui?.container, item.ui?.container] })
                      }, [
                        vueExports.createVNode(vueExports.unref(StepperTrigger_default), {
                          "data-slot": "trigger",
                          class: ui.value.trigger({ class: [props.ui?.trigger, item.ui?.trigger] })
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(vueExports.unref(StepperIndicator_default), {
                              "data-slot": "indicator",
                              class: ui.value.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.renderSlot(_ctx.$slots, "indicator", {
                                  item,
                                  ui: ui.value
                                }, () => [
                                  item.icon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$h, {
                                    key: 0,
                                    name: item.icon,
                                    "data-slot": "icon",
                                    class: ui.value.icon({ class: [props.ui?.icon, item.ui?.icon] })
                                  }, null, 8, ["name", "class"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                                    vueExports.createTextVNode(vueExports.toDisplayString(count + 1), 1)
                                  ], 64))
                                ])
                              ]),
                              _: 2
                            }, 1032, ["class"])
                          ]),
                          _: 2
                        }, 1032, ["class"]),
                        count < __props.items.length - 1 ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(StepperSeparator_default), {
                          key: 0,
                          "data-slot": "separator",
                          class: ui.value.separator({ class: [props.ui?.separator, item.ui?.separator] })
                        }, null, 8, ["class"])) : vueExports.createCommentVNode("", true)
                      ], 2),
                      vueExports.createVNode("div", {
                        "data-slot": "wrapper",
                        class: ui.value.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })
                      }, [
                        vueExports.renderSlot(_ctx.$slots, item.slot ? `${item.slot}-wrapper` : "wrapper", { item }, () => [
                          item.title || !!slots[item.slot ? `${item.slot}-title` : "title"] ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(StepperTitle_default), {
                            key: 0,
                            as: "div",
                            "data-slot": "title",
                            class: ui.value.title({ class: [props.ui?.title, item.ui?.title] })
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.renderSlot(_ctx.$slots, item.slot ? `${item.slot}-title` : "title", { item }, () => [
                                vueExports.createTextVNode(vueExports.toDisplayString(item.title), 1)
                              ])
                            ]),
                            _: 2
                          }, 1032, ["class"])) : vueExports.createCommentVNode("", true),
                          item.description || !!slots[item.slot ? `${item.slot}-description` : "description"] ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(StepperDescription_default), {
                            key: 1,
                            as: "div",
                            "data-slot": "description",
                            class: ui.value.description({ class: [props.ui?.description, item.ui?.description] })
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.renderSlot(_ctx.$slots, item.slot ? `${item.slot}-description` : "description", { item }, () => [
                                vueExports.createTextVNode(vueExports.toDisplayString(item.description), 1)
                              ])
                            ]),
                            _: 2
                          }, 1032, ["class"])) : vueExports.createCommentVNode("", true)
                        ])
                      ], 2)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
            if (currentStep.value?.content || !!slots.content || currentStep.value?.slot && !!slots[currentStep.value.slot]) {
              _push2(`<div data-slot="content" class="${serverRenderer_cjs_prodExports.ssrRenderClass(ui.value.content({ class: props.ui?.content }))}"${_scopeId}>`);
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, currentStep.value?.slot || "content", { item: currentStep.value }, () => {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(currentStep.value?.content)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.createVNode("div", {
                "data-slot": "header",
                class: ui.value.header({ class: props.ui?.header })
              }, [
                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.items, (item, count) => {
                  return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(StepperItem_default), {
                    key: count,
                    step: count,
                    disabled: item.disabled || props.disabled,
                    "data-slot": "item",
                    class: ui.value.item({ class: [props.ui?.item, item.ui?.item, item.class] })
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", {
                        "data-slot": "container",
                        class: ui.value.container({ class: [props.ui?.container, item.ui?.container] })
                      }, [
                        vueExports.createVNode(vueExports.unref(StepperTrigger_default), {
                          "data-slot": "trigger",
                          class: ui.value.trigger({ class: [props.ui?.trigger, item.ui?.trigger] })
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(vueExports.unref(StepperIndicator_default), {
                              "data-slot": "indicator",
                              class: ui.value.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.renderSlot(_ctx.$slots, "indicator", {
                                  item,
                                  ui: ui.value
                                }, () => [
                                  item.icon ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$h, {
                                    key: 0,
                                    name: item.icon,
                                    "data-slot": "icon",
                                    class: ui.value.icon({ class: [props.ui?.icon, item.ui?.icon] })
                                  }, null, 8, ["name", "class"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                                    vueExports.createTextVNode(vueExports.toDisplayString(count + 1), 1)
                                  ], 64))
                                ])
                              ]),
                              _: 2
                            }, 1032, ["class"])
                          ]),
                          _: 2
                        }, 1032, ["class"]),
                        count < __props.items.length - 1 ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(StepperSeparator_default), {
                          key: 0,
                          "data-slot": "separator",
                          class: ui.value.separator({ class: [props.ui?.separator, item.ui?.separator] })
                        }, null, 8, ["class"])) : vueExports.createCommentVNode("", true)
                      ], 2),
                      vueExports.createVNode("div", {
                        "data-slot": "wrapper",
                        class: ui.value.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })
                      }, [
                        vueExports.renderSlot(_ctx.$slots, item.slot ? `${item.slot}-wrapper` : "wrapper", { item }, () => [
                          item.title || !!slots[item.slot ? `${item.slot}-title` : "title"] ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(StepperTitle_default), {
                            key: 0,
                            as: "div",
                            "data-slot": "title",
                            class: ui.value.title({ class: [props.ui?.title, item.ui?.title] })
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.renderSlot(_ctx.$slots, item.slot ? `${item.slot}-title` : "title", { item }, () => [
                                vueExports.createTextVNode(vueExports.toDisplayString(item.title), 1)
                              ])
                            ]),
                            _: 2
                          }, 1032, ["class"])) : vueExports.createCommentVNode("", true),
                          item.description || !!slots[item.slot ? `${item.slot}-description` : "description"] ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(StepperDescription_default), {
                            key: 1,
                            as: "div",
                            "data-slot": "description",
                            class: ui.value.description({ class: [props.ui?.description, item.ui?.description] })
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.renderSlot(_ctx.$slots, item.slot ? `${item.slot}-description` : "description", { item }, () => [
                                vueExports.createTextVNode(vueExports.toDisplayString(item.description), 1)
                              ])
                            ]),
                            _: 2
                          }, 1032, ["class"])) : vueExports.createCommentVNode("", true)
                        ])
                      ], 2)
                    ]),
                    _: 2
                  }, 1032, ["step", "disabled", "class"]);
                }), 128))
              ], 2),
              currentStep.value?.content || !!slots.content || currentStep.value?.slot && !!slots[currentStep.value.slot] ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                "data-slot": "content",
                class: ui.value.content({ class: props.ui?.content })
              }, [
                vueExports.renderSlot(_ctx.$slots, currentStep.value?.slot || "content", { item: currentStep.value }, () => [
                  vueExports.createTextVNode(vueExports.toDisplayString(currentStep.value?.content), 1)
                ])
              ], 2)) : vueExports.createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.4.0_@tiptap+extensions@3.22.2_@tiptap+core@3.22.2_@tiptap+pm@3.22.2__@tiptap_ff602f8142f0ba128c11c1e82cd47490/node_modules/@nuxt/ui/dist/runtime/components/Stepper.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Stepper-Bzh3Mxt9.mjs.map
