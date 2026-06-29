import { v as vueExports, h as useAuth, i as useRouter, j as useToast, s as serverRenderer_cjs_prodExports, k as _sfc_main$h, l as _sfc_main$c, a as useAppConfig, t as tv, f as formBusInjectionKey, b as formStateInjectionKey, c as formErrorsInjectionKey, d as formInputsInjectionKey, e as formLoadingInjectionKey, g as formOptionsInjectionKey, m as apiLogin, n as apiPlatformLogin } from './server.mjs';
import { u as useEventBus } from './index-QmZAbLx-.mjs';
import { _ as _sfc_main$2 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$3 } from './Input-JXN8po_F.mjs';
import { u as usePlatformAuth } from './usePlatformAuth-xR_pVxir.mjs';
import { u as useAppContext } from './useAppContext-qiCJKBCF.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './Label-BBgw4vHh.mjs';

function isSuperStructSchema(schema) {
  return "schema" in schema && typeof schema.coercer === "function" && typeof schema.validator === "function" && typeof schema.refiner === "function";
}
function isStandardSchema(schema) {
  return "~standard" in schema;
}
async function validateStandardSchema(state, schema) {
  const result = await schema["~standard"].validate(state);
  if (result.issues) {
    return {
      errors: result.issues?.map((issue) => ({
        name: issue.path?.map((item) => typeof item === "object" ? item.key : item).join(".") || "",
        message: issue.message
      })) || [],
      result: null
    };
  }
  return {
    errors: null,
    result: result.value
  };
}
async function validateSuperstructSchema(state, schema) {
  const [err, result] = schema.validate(state);
  if (err) {
    const errors = err.failures().map((error) => ({
      message: error.message,
      name: error.path.join(".")
    }));
    return {
      errors,
      result: null
    };
  }
  return {
    errors: null,
    result
  };
}
function validateSchema(state, schema) {
  if (isStandardSchema(schema)) {
    return validateStandardSchema(state, schema);
  } else if (isSuperStructSchema(schema)) {
    return validateSuperstructSchema(state, schema);
  } else {
    throw new Error("Form validation failed: Unsupported form schema");
  }
}
function getAtPath(data, path) {
  if (!path) return data;
  const value = path.split(".").reduce(
    (value2, key) => value2?.[key],
    data
  );
  return value;
}
function setAtPath(data, path, value) {
  if (!path) return Object.assign(data, value);
  if (!data) return data;
  const keys = path.split(".");
  let current = data;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === void 0 || current[key] === null) {
      if (i + 1 < keys.length && !Number.isNaN(Number(keys[i + 1]))) {
        current[key] = [];
      } else {
        current[key] = {};
      }
    }
    current = current[key];
  }
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  return data;
}
class FormValidationException extends Error {
  formId;
  errors;
  constructor(formId, errors) {
    super("Form validation exception");
    this.formId = formId;
    this.errors = errors;
    Object.setPrototypeOf(this, FormValidationException.prototype);
  }
}
const theme = {
  "base": ""
};
const _sfc_main$1 = {
  __name: "UForm",
  __ssrInlineRender: true,
  props: {
    id: { type: [String, Number], required: false },
    schema: { type: null, required: false },
    state: { type: null, required: false },
    validate: { type: Function, required: false },
    validateOn: { type: Array, required: false, default() {
      return ["input", "blur", "change"];
    } },
    disabled: { type: Boolean, required: false },
    name: { type: null, required: false },
    validateOnInputDelay: { type: Number, required: false, default: 300 },
    transform: { type: null, required: false, default: () => true },
    nested: { type: Boolean, required: false },
    loadingAuto: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    onSubmit: { type: Function, required: false }
  },
  emits: ["submit", "error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const appConfig = useAppConfig();
    const ui = vueExports.computed(() => tv({ extend: tv(theme), ...appConfig.ui?.form || {} }));
    const formId = props.id ?? vueExports.useId();
    const bus = useEventBus(`form-${formId}`);
    const parentBus = props.nested === true && vueExports.inject(
      formBusInjectionKey,
      void 0
    );
    const parentState = props.nested === true ? vueExports.inject(formStateInjectionKey, void 0) : void 0;
    const state = vueExports.computed(() => {
      if (parentState?.value) {
        return props.name ? getAtPath(parentState.value, props.name) : parentState.value;
      }
      return props.state;
    });
    vueExports.provide(formBusInjectionKey, bus);
    vueExports.provide(formStateInjectionKey, state);
    const nestedForms = vueExports.ref(/* @__PURE__ */ new Map());
    const errors = vueExports.ref([]);
    vueExports.provide(formErrorsInjectionKey, errors);
    const inputs = vueExports.ref({});
    vueExports.provide(formInputsInjectionKey, inputs);
    const dirtyFields = vueExports.reactive(/* @__PURE__ */ new Set());
    const touchedFields = vueExports.reactive(/* @__PURE__ */ new Set());
    const blurredFields = vueExports.reactive(/* @__PURE__ */ new Set());
    function resolveErrorIds(errs) {
      return errs.map((err) => ({
        ...err,
        id: err?.name ? inputs.value[err.name]?.id : void 0
      }));
    }
    const transformedState = vueExports.ref(null);
    async function getErrors() {
      let errs = props.validate ? await props.validate(state.value) ?? [] : [];
      if (props.schema) {
        const { errors: errors2, result } = await validateSchema(state.value, props.schema);
        if (errors2) {
          errs = errs.concat(errors2);
        } else {
          transformedState.value = result;
        }
      }
      return resolveErrorIds(errs);
    }
    async function _validate(opts = { silent: false, nested: false, transform: false }) {
      const names = opts.name && !Array.isArray(opts.name) ? [opts.name] : opts.name;
      let nestedResults = [];
      let nestedErrors = [];
      if (!names && opts.nested) {
        const validations = Array.from(nestedForms.value.values()).map(
          (form) => validateNestedForm(form, opts)
        );
        const results = await Promise.all(validations);
        nestedErrors = results.filter((r) => r.error).flatMap((r) => r.error.errors.map((e) => addFormPath(e, r.name)));
        nestedResults = results.filter((r) => r.output !== void 0);
      }
      const currentErrors = await getErrors();
      const allErrors = [...currentErrors, ...nestedErrors];
      if (names) {
        errors.value = filterErrorsByNames(allErrors, names);
      } else {
        errors.value = allErrors;
      }
      if (errors.value?.length) {
        if (opts.silent) return false;
        throw new FormValidationException(formId, errors.value);
      }
      if (opts.transform) {
        nestedResults.forEach((result) => {
          if (result.name) {
            setAtPath(transformedState.value, result.name, result.output);
          } else {
            Object.assign(transformedState.value, result.output);
          }
        });
        return transformedState.value ?? state.value;
      }
      return state.value;
    }
    const loading = vueExports.ref(false);
    vueExports.provide(formLoadingInjectionKey, vueExports.readonly(loading));
    async function onSubmitWrapper(payload) {
      loading.value = props.loadingAuto && true;
      const event = payload;
      try {
        event.data = await _validate({ nested: true, transform: props.transform });
        await props.onSubmit?.(event);
        dirtyFields.clear();
      } catch (error) {
        if (!(error instanceof FormValidationException)) {
          throw error;
        }
        const errorEvent = {
          ...event,
          errors: error.errors
        };
        emits("error", errorEvent);
      } finally {
        loading.value = false;
      }
    }
    const disabled = vueExports.computed(() => props.disabled || loading.value);
    vueExports.provide(formOptionsInjectionKey, vueExports.computed(() => ({
      disabled: disabled.value,
      validateOnInputDelay: props.validateOnInputDelay
    })));
    async function validateNestedForm(form, opts) {
      try {
        const result = await form.validate({ ...opts, silent: false });
        return { name: form.name, output: result };
      } catch (error) {
        if (!(error instanceof FormValidationException)) throw error;
        return { name: form.name, error };
      }
    }
    function addFormPath(error, formPath) {
      if (!formPath || !error.name) return error;
      return { ...error, name: formPath + "." + error.name };
    }
    function stripFormPath(error, formPath) {
      const prefix = formPath + ".";
      const name = error?.name?.startsWith(prefix) ? error.name.substring(prefix.length) : error.name;
      return { ...error, name };
    }
    function filterFormErrors(errors2, formPath) {
      if (!formPath) return errors2;
      return errors2.filter((e) => e?.name?.startsWith(formPath + ".")).map((e) => stripFormPath(e, formPath));
    }
    function getFormErrors(form) {
      return form.api.getErrors().map(
        (e) => form.name ? { ...e, name: form.name + "." + e.name } : e
      );
    }
    function matchesTarget(target, path) {
      if (!target || !path) return true;
      if (target instanceof RegExp) return target.test(path);
      return path === target || typeof target === "string" && target.startsWith(path + ".");
    }
    function getNestedTarget(target, formPath) {
      if (!target || target instanceof RegExp) return target;
      if (formPath === target) return void 0;
      if (typeof target === "string" && target.startsWith(formPath + ".")) {
        return target.substring(formPath.length + 1);
      }
      return target;
    }
    function filterErrorsByNames(allErrors, names) {
      const nameSet = new Set(names);
      const patterns = names.map((name) => inputs.value?.[name]?.pattern).filter(Boolean);
      const matchesNames = (error) => {
        if (!error.name) return false;
        if (nameSet.has(error.name)) return true;
        return patterns.some((pattern) => pattern.test(error.name));
      };
      const keepErrors = errors.value.filter((error) => !matchesNames(error));
      const newErrors = allErrors.filter(matchesNames);
      return [...keepErrors, ...newErrors];
    }
    function filterErrorsByTarget(currentErrors, target) {
      return currentErrors.filter(
        (err) => target instanceof RegExp ? !(err.name && target.test(err.name)) : !err.name || err.name !== target
      );
    }
    function isLocalError(error) {
      return !error.name || !!inputs.value[error.name];
    }
    const api = {
      validate: _validate,
      errors,
      setErrors(errs, name) {
        const localErrors = resolveErrorIds(errs.filter(isLocalError));
        const nestedErrors = [];
        for (const form of nestedForms.value.values()) {
          if (matchesTarget(name, form.name)) {
            const formErrors = filterFormErrors(errs, form.name);
            form.api.setErrors(formErrors, getNestedTarget(name, form.name || ""));
            nestedErrors.push(...getFormErrors(form));
          }
        }
        if (name) {
          const keepErrors = filterErrorsByTarget(errors.value, name);
          errors.value = [...keepErrors, ...localErrors, ...nestedErrors];
        } else {
          errors.value = [...localErrors, ...nestedErrors];
        }
      },
      async submit() {
        await onSubmitWrapper(new Event("submit"));
      },
      getErrors(name) {
        if (!name) return errors.value;
        return errors.value.filter(
          (err) => name instanceof RegExp ? err.name && name.test(err.name) : err.name === name
        );
      },
      clear(name) {
        const localErrors = name ? errors.value.filter(
          (err) => isLocalError(err) && (name instanceof RegExp ? !(err.name && name.test(err.name)) : err.name !== name)
        ) : [];
        const nestedErrors = [];
        for (const form of nestedForms.value.values()) {
          if (matchesTarget(name, form.name)) form.api.clear();
          nestedErrors.push(...getFormErrors(form));
        }
        errors.value = [...localErrors, ...nestedErrors];
      },
      disabled,
      loading,
      dirty: vueExports.computed(() => !!dirtyFields.size),
      dirtyFields: vueExports.readonly(dirtyFields),
      blurredFields: vueExports.readonly(blurredFields),
      touchedFields: vueExports.readonly(touchedFields)
    };
    __expose(api);
    return (_ctx, _push, _parent, _attrs) => {
      serverRenderer_cjs_prodExports.ssrRenderVNode(_push, vueExports.createVNode(vueExports.resolveDynamicComponent(vueExports.unref(parentBus) ? "div" : "form"), vueExports.mergeProps({
        id: vueExports.unref(formId),
        class: ui.value({ class: props.class }),
        onSubmit: onSubmitWrapper
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {
              errors: errors.value,
              loading: loading.value
            }, null, _push2, _parent2, _scopeId);
          } else {
            return [
              vueExports.renderSlot(_ctx.$slots, "default", {
                errors: errors.value,
                loading: loading.value
              })
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.4.0_@tiptap+extensions@3.22.2_@tiptap+core@3.22.2_@tiptap+pm@3.22.2__@tiptap_ff602f8142f0ba128c11c1e82cd47490/node_modules/@nuxt/ui/dist/runtime/components/Form.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const { setAuth } = useAuth();
    const { setAuth: setPlatformAuth } = usePlatformAuth();
    const { isTenantDomain } = useAppContext();
    const router = useRouter();
    const toast = useToast();
    const state = vueExports.reactive({
      email: "",
      password: ""
    });
    const apiError = vueExports.ref("");
    const isPending = vueExports.ref(false);
    function validate(st) {
      const errors = [];
      if (!st.email) errors.push({ name: "email", message: "Vui lòng nhập email" });
      if (!st.password) errors.push({ name: "password", message: "Vui lòng nhập mật khẩu" });
      return errors;
    }
    async function onSubmit(event) {
      apiError.value = "";
      isPending.value = true;
      try {
        if (isTenantDomain.value) {
          const response = await apiLogin({
            email: event.data.email,
            password: event.data.password
          });
          setAuth(response.data);
          toast.add({ title: "Đăng nhập thành công", color: "success" });
          router.push("/pmc/dashboard");
        } else {
          const response = await apiPlatformLogin({
            email: event.data.email,
            password: event.data.password
          });
          setPlatformAuth(response.data);
          toast.add({ title: "Đăng nhập thành công", color: "success" });
          router.push("/platform");
        }
      } catch (err) {
        apiError.value = getApiErrorMessage(err, "Đăng nhập thất bại");
      } finally {
        isPending.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      const _component_UForm = _sfc_main$1;
      const _component_UFormField = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_UButton = _sfc_main$c;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-8 text-center"><div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-[var(--ui-primary)] text-white">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
        name: vueExports.unref(isTenantDomain) ? "i-lucide-building-2" : "i-lucide-globe",
        class: "size-7"
      }, null, _parent));
      _push(`</div><h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isTenantDomain) ? "Residential Management" : "Platform Management")}</h1><p class="mt-1 text-sm text-[var(--ui-text-muted)]">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isTenantDomain) ? "Đăng nhập vào hệ thống quản lý" : "Đăng nhập vào hệ thống Platform")}</p></div><div class="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6 shadow-sm">`);
      if (vueExports.unref(apiError)) {
        _push(`<div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(apiError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UForm, {
        validate,
        state: vueExports.unref(state),
        class: "space-y-4",
        onSubmit
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Email",
              name: "email"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(state).email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(state).email = $event,
                    type: "email",
                    placeholder: "email@example.com",
                    icon: "i-lucide-mail",
                    size: "lg",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(state).email,
                      "onUpdate:modelValue": ($event) => vueExports.unref(state).email = $event,
                      type: "email",
                      placeholder: "email@example.com",
                      icon: "i-lucide-mail",
                      size: "lg",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mật khẩu",
              name: "password"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(state).password,
                    "onUpdate:modelValue": ($event) => vueExports.unref(state).password = $event,
                    type: "password",
                    placeholder: "Nhập mật khẩu",
                    icon: "i-lucide-lock",
                    size: "lg",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(state).password,
                      "onUpdate:modelValue": ($event) => vueExports.unref(state).password = $event,
                      type: "password",
                      placeholder: "Nhập mật khẩu",
                      icon: "i-lucide-lock",
                      size: "lg",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              type: "submit",
              label: "Đăng nhập",
              icon: "i-lucide-log-in",
              size: "lg",
              block: "",
              loading: vueExports.unref(isPending)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UFormField, {
                label: "Email",
                name: "email"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(state).email,
                    "onUpdate:modelValue": ($event) => vueExports.unref(state).email = $event,
                    type: "email",
                    placeholder: "email@example.com",
                    icon: "i-lucide-mail",
                    size: "lg",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Mật khẩu",
                name: "password"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: vueExports.unref(state).password,
                    "onUpdate:modelValue": ($event) => vueExports.unref(state).password = $event,
                    type: "password",
                    placeholder: "Nhập mật khẩu",
                    icon: "i-lucide-lock",
                    size: "lg",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UButton, {
                type: "submit",
                label: "Đăng nhập",
                icon: "i-lucide-log-in",
                size: "lg",
                block: "",
                loading: vueExports.unref(isPending)
              }, null, 8, ["loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><p class="mt-6 text-center text-xs text-[var(--ui-text-muted)]"> Residential Management System © ${serverRenderer_cjs_prodExports.ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())}</p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-Cl84dQHF.mjs.map
