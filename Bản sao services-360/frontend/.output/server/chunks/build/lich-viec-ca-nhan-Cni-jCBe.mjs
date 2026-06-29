import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as _sfc_main$2 } from './Card-ywPiICev.mjs';
import { _ as _sfc_main$3 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-DKHEMZj7.mjs';
import { _ as __nuxt_component_1 } from './CapabilityRatingBadge-BBWBj9qN.mjs';
import { v as vueExports, p as useRoute$1, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, $ as $api } from './server.mjs';
import { u as useEntitySelect } from './useEntitySelect-DG9pQ_n0.mjs';
import { d as useAccountList } from './useAccounts-BDWM8ZpB.mjs';
import { _ as __nuxt_component_5 } from './AccountSchedulePanel-1RCVXmFK.mjs';
import './Label-BBgw4vHh.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
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
import './index-QmZAbLx-.mjs';
import './Input-JXN8po_F.mjs';
import './Badge-W93D3Jpz.mjs';
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
import './constants-G9YmtWtp.mjs';
import './SlotDetailDrawer-LTINo05F.mjs';
import './date-R5YK0ast.mjs';
import './useOgTickets-DPRh9tlL.mjs';
import './Slideover-C_jHRSNJ.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Skeleton-CKN2C2Mt.mjs';
import './Alert-tTsPKADX.mjs';
import './SectionCard-CH-mG9Mf.mjs';
import './UnscheduledDetailDrawer-2sLtSk2r.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AccountSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: null },
    placeholder: { default: "Chọn nhân viên" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { selectedItem, items, loading, onSearchTerm } = useEntitySelect(
      () => props.modelValue,
      (val) => emit("update:modelValue", val),
      {
        fetchList: useAccountList,
        resolveItem: async (id) => {
          const r = await $api(`/pmc/accounts/${id}`);
          return { id: r.data.id, label: r.data.name };
        },
        syncExternalChanges: true
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$4;
      const _component_SharedCapabilityRatingBadge = __nuxt_component_1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItem),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItem) ? selectedItem.value = $event : null,
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm nhân viên..." },
        placeholder: __props.placeholder,
        clear: "",
        class: "w-full",
        "onUpdate:searchTerm": vueExports.unref(onSearchTerm)
      }, _attrs), {
        item: vueExports.withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between gap-2 w-full"${_scopeId}><span class="truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</span>`);
            if (item.capability_rating != null) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCapabilityRatingBadge, {
                rating: item.capability_rating,
                size: "xs"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-center justify-between gap-2 w-full" }, [
                vueExports.createVNode("span", { class: "truncate" }, vueExports.toDisplayString(item.label), 1),
                item.capability_rating != null ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedCapabilityRatingBadge, {
                  key: 0,
                  rating: item.capability_rating,
                  size: "xs"
                }, null, 8, ["rating"])) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/account/AccountSelect.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "SharedAccountSelect" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "lich-viec-ca-nhan",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const selectedAccountId = vueExports.ref(
      route.query.accountId ? Number(route.query.accountId) : null
    );
    function clearSelection() {
      selectedAccountId.value = null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UCard = _sfc_main$2;
      const _component_UFormField = _sfc_main$3;
      const _component_SharedAccountSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_SharedAccountSchedulePanel = __nuxt_component_5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Lịch việc cá nhân",
        description: "Xem lịch đăng ký ca, dự án đang làm và ticket xử lý theo ngày"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, { ui: { body: "p-0 sm:p-0" } }, {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap items-end gap-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Nhân sự",
              class: "min-w-[240px]"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedAccountSelect, {
                    "model-value": vueExports.unref(selectedAccountId),
                    placeholder: "Chọn nhân sự",
                    "onUpdate:modelValue": ($event) => selectedAccountId.value = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedAccountSelect, {
                      "model-value": vueExports.unref(selectedAccountId),
                      placeholder: "Chọn nhân sự",
                      "onUpdate:modelValue": ($event) => selectedAccountId.value = $event
                    }, null, 8, ["model-value", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(selectedAccountId)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                variant: "subtle",
                size: "sm",
                icon: "i-lucide-x",
                class: "mb-1",
                onClick: clearSelection
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Bỏ chọn `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Bỏ chọn ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (vueExports.unref(selectedAccountId)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                variant: "outline",
                size: "sm",
                icon: "i-lucide-user",
                class: "mb-1",
                to: `/pmc/accounts/${vueExports.unref(selectedAccountId)}?tab=schedule`
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Chi tiết nhân sự `);
                  } else {
                    return [
                      vueExports.createTextVNode(" Chi tiết nhân sự ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-wrap items-end gap-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Nhân sự",
                  class: "min-w-[240px]"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_SharedAccountSelect, {
                      "model-value": vueExports.unref(selectedAccountId),
                      placeholder: "Chọn nhân sự",
                      "onUpdate:modelValue": ($event) => selectedAccountId.value = $event
                    }, null, 8, ["model-value", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                vueExports.unref(selectedAccountId) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 0,
                  variant: "subtle",
                  size: "sm",
                  icon: "i-lucide-x",
                  class: "mb-1",
                  onClick: clearSelection
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Bỏ chọn ")
                  ]),
                  _: 1
                })) : vueExports.createCommentVNode("", true),
                vueExports.unref(selectedAccountId) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 1,
                  variant: "outline",
                  size: "sm",
                  icon: "i-lucide-user",
                  class: "mb-1",
                  to: `/pmc/accounts/${vueExports.unref(selectedAccountId)}?tab=schedule`
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode(" Chi tiết nhân sự ")
                  ]),
                  _: 1
                }, 8, ["to"])) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-4 sm:p-6"${_scopeId}>`);
            if (!vueExports.unref(selectedAccountId)) {
              _push2(`<p class="text-muted text-sm"${_scopeId}> Chọn nhân sự để xem lịch ca đăng ký, dự án và ticket xử lý theo ngày. </p>`);
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedAccountSchedulePanel, {
                "account-id": vueExports.unref(selectedAccountId),
                "show-account-summary": ""
              }, null, _parent2, _scopeId));
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "p-4 sm:p-6" }, [
                !vueExports.unref(selectedAccountId) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "text-muted text-sm"
                }, " Chọn nhân sự để xem lịch ca đăng ký, dự án và ticket xử lý theo ngày. ")) : (vueExports.openBlock(), vueExports.createBlock(_component_SharedAccountSchedulePanel, {
                  key: 1,
                  "account-id": vueExports.unref(selectedAccountId),
                  "show-account-summary": ""
                }, null, 8, ["account-id"]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quan-ly-cong-viec/lich-viec-ca-nhan.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=lich-viec-ca-nhan-Cni-jCBe.mjs.map
