import { v as vueExports, p as useRoute$1, i as useRouter, j as useToast, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c } from './server.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_2 } from './VendorForm-wq_RZVmI.mjs';
import { f as useTenantPartnerDetail, g as apiUpdateTenantPartner, h as clearTenantPartnerCache } from './usePartners-DhKs6EM6.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
import { a as getApiValidationErrors, g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './SectionCard-CH-mG9Mf.mjs';
import './FormField-DFdmv6Lu.mjs';
import './Label-BBgw4vHh.mjs';
import './Input-JXN8po_F.mjs';
import './index-QmZAbLx-.mjs';
import './FormFieldError-cu7WK1i1.mjs';
import './Select-CZE7Ef6n.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './Badge-W93D3Jpz.mjs';
import './Textarea-DTCNHwKm.mjs';
import './SelectMenu-DKHEMZj7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './index-CSThDD3J.mjs';
import './useProjects-D4K3VYdb.mjs';
import './constants-G9YmtWtp.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter();
    const toast = useToast();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error } = useTenantPartnerDetail(id);
    const vendor = vueExports.computed(() => data.value?.data ?? null);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => vendor.value?.display_name ?? vendor.value?.name ?? null));
    useSeoMeta({
      title: vueExports.computed(() => vendor.value ? `Sửa ${vendor.value.display_name ?? vendor.value.name}` : "Chỉnh sửa vendor")
    });
    vueExports.watch(error, (e) => {
      if (!e) return;
      const apiErr = e;
      const status2 = apiErr?.status ?? apiErr?.statusCode;
      if (status2 === 404) {
        toast.add({
          title: "Không tìm thấy vendor",
          description: "Vendor không tồn tại hoặc không thuộc tenant của bạn.",
          color: "error"
        });
        router.replace("/pmc/vendors");
      } else if (status2 === 403 && apiErr?.data?.error_code === "VENDOR_FEATURE_DISABLED") {
        toast.add({ title: "Tenant chưa kích hoạt gói vendor", color: "warning" });
        router.replace("/pmc/dashboard");
      }
    });
    vueExports.watch(vendor, (v) => {
      if (v && !v.is_owned) {
        toast.add({
          title: "Không thể chỉnh sửa vendor dùng chung",
          description: "Vendor này không thuộc PMC của bạn. Bạn chỉ có thể gắn dự án và tạo hợp đồng hoa hồng.",
          color: "warning",
          icon: "i-lucide-shield-alert"
        });
        router.replace(`/pmc/vendors/${v.id}`);
      }
    }, { immediate: true });
    const isSubmitting = vueExports.ref(false);
    const apiErrors = vueExports.ref({});
    async function handleSubmit(payload) {
      if (!vendor.value) return;
      isSubmitting.value = true;
      apiErrors.value = {};
      try {
        const { slug: _slug, ...updatable } = payload;
        void _slug;
        await apiUpdateTenantPartner(vendor.value.id, updatable);
        clearTenantPartnerCache(vendor.value.id);
        toast.add({
          title: "Cập nhật vendor thành công",
          color: "success",
          icon: "i-lucide-check-circle"
        });
        router.push(`/pmc/vendors/${vendor.value.id}`);
      } catch (err) {
        const validation = getApiValidationErrors(err);
        if (validation) {
          apiErrors.value = validation;
        }
        toast.add({
          title: getApiErrorMessage(err, "Cập nhật vendor thất bại"),
          color: "error",
          icon: "i-lucide-alert-circle"
        });
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$1;
      const _component_VendorForm = __nuxt_component_2;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-center gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: vueExports.unref(vendor) ? `/pmc/vendors/${vueExports.unref(vendor).id}` : "/pmc/vendors",
        class: "shrink-0"
      }, null, _parent));
      _push(`<div><h1 class="text-xl font-bold text-slate-900"> Chỉnh sửa vendor </h1><p class="text-sm text-slate-500 mt-0.5"> Slug không thể đổi sau khi đăng ký. </p></div></div>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(vendor)) {
        _push(`<div class="h-64 bg-slate-100 rounded-xl animate-pulse"></div>`);
      } else if (vueExports.unref(error) && !vueExports.unref(vendor)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          icon: "i-lucide-alert-circle",
          description: "Không tải được thông tin vendor."
        }, null, _parent));
      } else if (vueExports.unref(vendor)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_VendorForm, {
          mode: "edit",
          item: vueExports.unref(vendor),
          loading: vueExports.unref(isSubmitting),
          "api-errors": vueExports.unref(apiErrors),
          "cancel-to": `/pmc/vendors/${vueExports.unref(vendor).id}`,
          onSubmit: handleSubmit
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/vendors/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-8q0hobp_.mjs.map
