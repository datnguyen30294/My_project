import { v as vueExports, J as makeDestructurable, K as isDef, L as camelize, M as noop, N as toArray, O as watchImmediate, Q as isObject } from './server.mjs';

// @__NO_SIDE_EFFECTS__
function createReusableTemplate(options = {}) {
  const { inheritAttrs = true } = options;
  const render = vueExports.shallowRef();
  const define = vueExports.defineComponent({ setup(_, { slots }) {
    return () => {
      render.value = slots.default;
    };
  } });
  const reuse = vueExports.defineComponent({
    inheritAttrs,
    props: options.props,
    setup(props, { attrs, slots }) {
      return () => {
        var _render$value;
        if (!render.value && true) throw new Error("[VueUse] Failed to find the definition of reusable template");
        const vnode = (_render$value = render.value) === null || _render$value === void 0 ? void 0 : _render$value.call(render, {
          ...options.props == null ? keysToCamelKebabCase(attrs) : props,
          $slots: slots
        });
        return inheritAttrs && (vnode === null || vnode === void 0 ? void 0 : vnode.length) === 1 ? vnode[0] : vnode;
      };
    }
  });
  return makeDestructurable({
    define,
    reuse
  }, [define, reuse]);
}
function keysToCamelKebabCase(obj) {
  const newObj = {};
  for (const key in obj) newObj[camelize(key)] = obj[key];
  return newObj;
}
const defaultWindow = void 0;
function unrefElement(elRef) {
  var _$el;
  const plain = vueExports.toValue(elRef);
  return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
function useEventListener(...args) {
  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };
  const firstParamTargets = vueExports.computed(() => {
    const test = toArray(vueExports.toValue(args[0])).filter((e) => e != null);
    return test.every((e) => typeof e !== "string") ? test : void 0;
  });
  return watchImmediate(() => {
    var _firstParamTargets$va, _firstParamTargets$va2;
    return [
      (_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
      toArray(vueExports.toValue(firstParamTargets.value ? args[1] : args[0])),
      toArray(vueExports.unref(firstParamTargets.value ? args[2] : args[1])),
      vueExports.toValue(firstParamTargets.value ? args[3] : args[2])
    ];
  }, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
    if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
    const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
    const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
    onCleanup(() => {
      cleanups.forEach((fn) => fn());
    });
  }, { flush: "post" });
}
function onClickOutside(target, handler, options = {}) {
  const { window: window$1 = defaultWindow, ignore = [], capture = true, detectIframe = false, controls = false } = options;
  if (!window$1) return controls ? {
    stop: noop,
    cancel: noop,
    trigger: noop
  } : noop;
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return vueExports.toValue(ignore).some((target$1) => {
      if (typeof target$1 === "string") return Array.from(window$1.document.querySelectorAll(target$1)).some((el) => el === event.target || event.composedPath().includes(el));
      else {
        const el = unrefElement(target$1);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  function hasMultipleRoots(target$1) {
    const vm = vueExports.toValue(target$1);
    return vm && vm.$.subTree.shapeFlag === 16;
  }
  function checkMultipleRoots(target$1, event) {
    const vm = vueExports.toValue(target$1);
    const children = vm.$.subTree && vm.$.subTree.children;
    if (children == null || !Array.isArray(children)) return false;
    return children.some((child) => child.el === event.target || event.composedPath().includes(child.el));
  }
  const listener = (event) => {
    const el = unrefElement(target);
    if (event.target == null) return;
    if (!(el instanceof Element) && hasMultipleRoots(target) && checkMultipleRoots(target, event)) return;
    if (!el || el === event.target || event.composedPath().includes(el)) return;
    if ("detail" in event && event.detail === 0) shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  let isProcessingClick = false;
  const cleanup = [
    useEventListener(window$1, "click", (event) => {
      if (!isProcessingClick) {
        isProcessingClick = true;
        setTimeout(() => {
          isProcessingClick = false;
        }, 0);
        listener(event);
      }
    }, {
      passive: true,
      capture
    }),
    useEventListener(window$1, "pointerdown", (e) => {
      const el = unrefElement(target);
      shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
    }, { passive: true }),
    detectIframe && useEventListener(window$1, "blur", (event) => {
      setTimeout(() => {
        var _window$document$acti;
        const el = unrefElement(target);
        if (((_window$document$acti = window$1.document.activeElement) === null || _window$document$acti === void 0 ? void 0 : _window$document$acti.tagName) === "IFRAME" && !(el === null || el === void 0 ? void 0 : el.contains(window$1.document.activeElement))) handler(event);
      }, 0);
    }, { passive: true })
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn) => fn());
  if (controls) return {
    stop,
    cancel: () => {
      shouldListen = false;
    },
    trigger: (event) => {
      shouldListen = true;
      listener(event);
      shouldListen = false;
    }
  };
  return stop;
}
function cloneFnJSON(source) {
  return JSON.parse(JSON.stringify(source));
}
const events = /* @__PURE__ */ new Map();
// @__NO_SIDE_EFFECTS__
function useEventBus(key) {
  const scope = vueExports.getCurrentScope();
  function on(listener) {
    var _scope$cleanups;
    const listeners = events.get(key) || /* @__PURE__ */ new Set();
    listeners.add(listener);
    events.set(key, listeners);
    const _off = () => off(listener);
    scope === null || scope === void 0 || (_scope$cleanups = scope.cleanups) === null || _scope$cleanups === void 0 || _scope$cleanups.push(_off);
    return _off;
  }
  function once(listener) {
    function _listener(...args) {
      off(_listener);
      listener(...args);
    }
    return on(_listener);
  }
  function off(listener) {
    const listeners = events.get(key);
    if (!listeners) return;
    listeners.delete(listener);
    if (!listeners.size) reset();
  }
  function reset() {
    events.delete(key);
  }
  function emit(event, payload) {
    var _events$get;
    (_events$get = events.get(key)) === null || _events$get === void 0 || _events$get.forEach((v) => v(event, payload));
  }
  return {
    on,
    once,
    off,
    emit,
    reset
  };
}
function useSwipe(target, options = {}) {
  const { threshold = 50, onSwipe, onSwipeEnd, onSwipeStart, passive = true } = options;
  const coordsStart = vueExports.reactive({
    x: 0,
    y: 0
  });
  const coordsEnd = vueExports.reactive({
    x: 0,
    y: 0
  });
  const diffX = vueExports.computed(() => coordsStart.x - coordsEnd.x);
  const diffY = vueExports.computed(() => coordsStart.y - coordsEnd.y);
  const { max, abs } = Math;
  const isThresholdExceeded = vueExports.computed(() => max(abs(diffX.value), abs(diffY.value)) >= threshold);
  const isSwiping = vueExports.shallowRef(false);
  const direction = vueExports.computed(() => {
    if (!isThresholdExceeded.value) return "none";
    if (abs(diffX.value) > abs(diffY.value)) return diffX.value > 0 ? "left" : "right";
    else return diffY.value > 0 ? "up" : "down";
  });
  const getTouchEventCoords = (e) => [e.touches[0].clientX, e.touches[0].clientY];
  const updateCoordsStart = (x, y) => {
    coordsStart.x = x;
    coordsStart.y = y;
  };
  const updateCoordsEnd = (x, y) => {
    coordsEnd.x = x;
    coordsEnd.y = y;
  };
  const listenerOptions = {
    passive,
    capture: !passive
  };
  const onTouchEnd = (e) => {
    if (isSwiping.value) onSwipeEnd === null || onSwipeEnd === void 0 || onSwipeEnd(e, direction.value);
    isSwiping.value = false;
  };
  const stops = [
    useEventListener(target, "touchstart", (e) => {
      if (e.touches.length !== 1) return;
      const [x, y] = getTouchEventCoords(e);
      updateCoordsStart(x, y);
      updateCoordsEnd(x, y);
      onSwipeStart === null || onSwipeStart === void 0 || onSwipeStart(e);
    }, listenerOptions),
    useEventListener(target, "touchmove", (e) => {
      if (e.touches.length !== 1) return;
      const [x, y] = getTouchEventCoords(e);
      updateCoordsEnd(x, y);
      if (listenerOptions.capture && !listenerOptions.passive && Math.abs(diffX.value) > Math.abs(diffY.value)) e.preventDefault();
      if (!isSwiping.value && isThresholdExceeded.value) isSwiping.value = true;
      if (isSwiping.value) onSwipe === null || onSwipe === void 0 || onSwipe(e);
    }, listenerOptions),
    useEventListener(target, ["touchend", "touchcancel"], onTouchEnd, listenerOptions)
  ];
  const stop = () => stops.forEach((s) => s());
  return {
    isSwiping,
    direction,
    coordsStart,
    coordsEnd,
    lengthX: diffX,
    lengthY: diffY,
    stop
  };
}
// @__NO_SIDE_EFFECTS__
function useVModel(props, key, emit, options = {}) {
  var _vm$$emit, _vm$proxy;
  const { clone = false, passive = false, eventName, deep = false, defaultValue, shouldEmit } = options;
  const vm = vueExports.getCurrentInstance();
  const _emit = emit || (vm === null || vm === void 0 ? void 0 : vm.emit) || (vm === null || vm === void 0 || (_vm$$emit = vm.$emit) === null || _vm$$emit === void 0 ? void 0 : _vm$$emit.bind(vm)) || (vm === null || vm === void 0 || (_vm$proxy = vm.proxy) === null || _vm$proxy === void 0 || (_vm$proxy = _vm$proxy.$emit) === null || _vm$proxy === void 0 ? void 0 : _vm$proxy.bind(vm === null || vm === void 0 ? void 0 : vm.proxy));
  let event = eventName;
  event = event || `update:${key.toString()}`;
  const cloneFn = (val) => !clone ? val : typeof clone === "function" ? clone(val) : cloneFnJSON(val);
  const getValue$1 = () => isDef(props[key]) ? cloneFn(props[key]) : defaultValue;
  const triggerEmit = (value) => {
    if (shouldEmit) {
      if (shouldEmit(value)) _emit(event, value);
    } else _emit(event, value);
  };
  if (passive) {
    const proxy = vueExports.ref(getValue$1());
    let isUpdating = false;
    vueExports.watch(() => props[key], (v) => {
      if (!isUpdating) {
        isUpdating = true;
        proxy.value = cloneFn(v);
        vueExports.nextTick(() => isUpdating = false);
      }
    });
    vueExports.watch(proxy, (v) => {
      if (!isUpdating && (v !== props[key] || deep)) triggerEmit(v);
    }, { deep });
    return proxy;
  } else return vueExports.computed({
    get() {
      return getValue$1();
    },
    set(value) {
      triggerEmit(value);
    }
  });
}

export { useVModel as a, unrefElement as b, createReusableTemplate as c, useSwipe as d, onClickOutside as o, useEventBus as u };
//# sourceMappingURL=index-QmZAbLx-.mjs.map
