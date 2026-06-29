import { v as vueExports, s as serverRenderer_cjs_prodExports, y as _sfc_main$f, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$1 } from './Modal-BimZZbNl.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AvatarUpload",
  __ssrInlineRender: true,
  props: {
    currentUrl: { default: null },
    alt: { default: "" },
    loading: { type: Boolean, default: false },
    maxSizeMb: { default: 10 }
  },
  emits: ["upload", "delete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const fileInput = vueExports.ref(null);
    const previewUrl = vueExports.ref(null);
    const deleted = vueExports.ref(false);
    const showConfirmDelete = vueExports.ref(false);
    const displayUrl = vueExports.computed(() => {
      if (deleted.value) return null;
      return previewUrl.value || props.currentUrl;
    });
    const hasAvatar = vueExports.computed(() => !!displayUrl.value);
    function openFilePicker() {
      fileInput.value?.click();
    }
    function confirmDelete() {
      showConfirmDelete.value = true;
    }
    function handleDelete() {
      showConfirmDelete.value = false;
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
        previewUrl.value = null;
      }
      deleted.value = true;
      emit("delete");
    }
    vueExports.watch(() => props.currentUrl, () => {
      deleted.value = false;
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
        previewUrl.value = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAvatar = _sfc_main$f;
      const _component_UButton = _sfc_main$c;
      const _component_UModal = _sfc_main$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex items-center gap-4" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAvatar, {
        src: vueExports.unref(displayUrl) ?? void 0,
        alt: __props.alt,
        size: "xl"
      }, null, _parent));
      _push(`<div class="flex gap-2">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-upload",
        label: vueExports.unref(hasAvatar) ? "Đổi ảnh" : "Tải ảnh lên",
        variant: "outline",
        size: "sm",
        loading: __props.loading,
        onClick: openFilePicker
      }, null, _parent));
      if (vueExports.unref(hasAvatar)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-trash-2",
          label: "Xóa",
          color: "error",
          variant: "outline",
          size: "sm",
          loading: __props.loading,
          onClick: confirmDelete
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><input type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showConfirmDelete),
        "onUpdate:open": ($event) => vueExports.isRef(showConfirmDelete) ? showConfirmDelete.value = $event : null,
        title: "Xóa ảnh đại diện"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p${_scopeId}>Bạn có chắc chắn muốn xóa ảnh đại diện không?</p>`);
          } else {
            return [
              vueExports.createVNode("p", null, "Bạn có chắc chắn muốn xóa ảnh đại diện không?")
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              label: "Huỷ",
              onClick: ($event) => showConfirmDelete.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              color: "error",
              label: "Xóa",
              icon: "i-lucide-trash-2",
              loading: __props.loading,
              onClick: handleDelete
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2" }, [
                vueExports.createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Huỷ",
                  onClick: ($event) => showConfirmDelete.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  color: "error",
                  label: "Xóa",
                  icon: "i-lucide-trash-2",
                  loading: __props.loading,
                  onClick: handleDelete
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/avatar/AvatarUpload.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "SharedAvatarUpload" });

export { __nuxt_component_5 as _ };
//# sourceMappingURL=AvatarUpload-CsEPx2JP.mjs.map
