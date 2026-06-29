import { _ as _sfc_main$1 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';
import { j as useToast, v as vueExports, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { f as apiToggleTenantActive } from './useTenants-BTW8z9Mm.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TenantToggleActiveModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    tenantName: { default: null },
    activating: { type: Boolean },
    loading: { type: Boolean, default: false }
  },
  emits: ["update:open", "confirm"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$1;
      const _component_UAlert = _sfc_main$2;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: __props.open,
        title: __props.activating ? "Kích hoạt lại công ty vận hành" : "Vô hiệu hoá công ty vận hành",
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3 text-sm text-slate-700"${_scopeId}>`);
            if (__props.activating) {
              _push2(`<p${_scopeId}> Kích hoạt lại công ty <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.tenantName)}</strong>? Công ty sẽ có thể đăng nhập và vận hành trở lại bình thường. </p>`);
            } else {
              _push2(`<!--[--><p${_scopeId}> Vô hiệu hoá công ty <strong${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.tenantName)}</strong>? </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "warning",
                variant: "subtle",
                icon: "i-lucide-alert-triangle",
                description: "Công ty sẽ không thể đăng nhập và vận hành. Dữ liệu lịch sử được giữ nguyên, có thể kích hoạt lại bất kỳ lúc nào."
              }, null, _parent2, _scopeId));
              _push2(`<!--]-->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-3 text-sm text-slate-700" }, [
                __props.activating ? (vueExports.openBlock(), vueExports.createBlock("p", { key: 0 }, [
                  vueExports.createTextVNode(" Kích hoạt lại công ty "),
                  vueExports.createVNode("strong", null, vueExports.toDisplayString(__props.tenantName), 1),
                  vueExports.createTextVNode("? Công ty sẽ có thể đăng nhập và vận hành trở lại bình thường. ")
                ])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", null, [
                    vueExports.createTextVNode(" Vô hiệu hoá công ty "),
                    vueExports.createVNode("strong", null, vueExports.toDisplayString(__props.tenantName), 1),
                    vueExports.createTextVNode("? ")
                  ]),
                  vueExports.createVNode(_component_UAlert, {
                    color: "warning",
                    variant: "subtle",
                    icon: "i-lucide-alert-triangle",
                    description: "Công ty sẽ không thể đăng nhập và vận hành. Dữ liệu lịch sử được giữ nguyên, có thể kích hoạt lại bất kỳ lúc nào."
                  })
                ], 64))
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "ghost",
              disabled: __props.loading,
              onClick: ($event) => emit("update:open", false)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: __props.activating ? "Kích hoạt lại" : "Vô hiệu hoá",
              color: __props.activating ? "primary" : "warning",
              loading: __props.loading,
              onClick: ($event) => emit("confirm")
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "ghost",
                  disabled: __props.loading,
                  onClick: ($event) => emit("update:open", false)
                }, null, 8, ["disabled", "onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: __props.activating ? "Kích hoạt lại" : "Vô hiệu hoá",
                  color: __props.activating ? "primary" : "warning",
                  loading: __props.loading,
                  onClick: ($event) => emit("confirm")
                }, null, 8, ["label", "color", "loading", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tenant/TenantToggleActiveModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main, { __name: "TenantToggleActiveModal" });
function useTenantToggleActive(refresh) {
  const toast = useToast();
  const showActiveConfirm = vueExports.ref(false);
  const activeTarget = vueExports.ref(null);
  const isTogglingActive = vueExports.ref(false);
  const activating = vueExports.computed(() => !(activeTarget.value?.is_active ?? true));
  function openActiveConfirm(item) {
    activeTarget.value = item;
    showActiveConfirm.value = true;
  }
  async function confirmToggleActive() {
    if (!activeTarget.value) return;
    isTogglingActive.value = true;
    try {
      await apiToggleTenantActive(activeTarget.value.id, activating.value);
      toast.add({
        title: activating.value ? "Đã kích hoạt lại công ty vận hành" : "Đã vô hiệu hoá công ty vận hành",
        color: "success",
        icon: "i-lucide-check-circle"
      });
      showActiveConfirm.value = false;
      await refresh();
    } catch (err) {
      toast.add({
        title: getApiErrorMessage(err, "Không thể cập nhật trạng thái"),
        color: "error",
        icon: "i-lucide-alert-circle"
      });
    } finally {
      isTogglingActive.value = false;
    }
  }
  return {
    showActiveConfirm,
    activeTarget,
    activating,
    isTogglingActive,
    openActiveConfirm,
    confirmToggleActive
  };
}

export { __nuxt_component_10 as _, useTenantToggleActive as u };
//# sourceMappingURL=useTenantToggleActive-CA9cCr0b.mjs.map
