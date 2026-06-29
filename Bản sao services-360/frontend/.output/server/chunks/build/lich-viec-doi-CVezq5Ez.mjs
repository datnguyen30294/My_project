import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, p as useRoute$1, i as useRouter, j as useToast, s as serverRenderer_cjs_prodExports, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$2 } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { u as useTeamSchedule, _ as __nuxt_component_4, a as __nuxt_component_11 } from './SlotDetailDrawer-LTINo05F.mjs';
import { a as __nuxt_component_5, _ as __nuxt_component_10 } from './AccountMultiSelect-C48Ujkod.mjs';
import { _ as _sfc_main$3 } from './Checkbox-Cp_FPUkd.mjs';
import { _ as _sfc_main$4 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$5 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_12 } from './UnscheduledDetailDrawer-2sLtSk2r.mjs';
import { c as currentYearMonth } from './date-R5YK0ast.mjs';
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
import './SelectMenu-DKHEMZj7.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
import './Input-JXN8po_F.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './constants-G9YmtWtp.mjs';
import './useProjects-D4K3VYdb.mjs';
import './Badge-W93D3Jpz.mjs';
import './useOgTickets-DPRh9tlL.mjs';
import './Slideover-C_jHRSNJ.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './SectionCard-CH-mG9Mf.mjs';
import './CapabilityRatingBadge-BBWBj9qN.mjs';
import './useAccounts-BDWM8ZpB.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ScheduleFilterBar",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-wrap items-center gap-3 rounded-lg border border-border-gray bg-white p-3" }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/schedule/ScheduleFilterBar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "ScheduleFilterBar" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "lich-viec-doi",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter();
    const selectedMonth = vueExports.ref(currentYearMonth());
    const selectedProjectId = vueExports.ref(null);
    const selectedAccountIds = vueExports.ref([]);
    const onlyConflicts = vueExports.ref(false);
    if (typeof route.query.month === "string" && /^\d{4}-\d{2}$/.test(route.query.month)) {
      selectedMonth.value = route.query.month;
    }
    if (route.query.project_id) {
      const n = Number(route.query.project_id);
      if (!Number.isNaN(n)) selectedProjectId.value = n;
    }
    if (route.query.account_ids) {
      const raw = Array.isArray(route.query.account_ids) ? route.query.account_ids : [route.query.account_ids];
      selectedAccountIds.value = raw.map((v) => Number(v)).filter((n) => !Number.isNaN(n));
    }
    if (route.query.only_conflicts === "1") {
      onlyConflicts.value = true;
    }
    const isInit = vueExports.ref(true);
    vueExports.nextTick(() => {
      isInit.value = false;
    });
    vueExports.watch(
      [selectedMonth, selectedProjectId, selectedAccountIds, onlyConflicts],
      () => {
        if (isInit.value) return;
        const query = {};
        if (selectedMonth.value && selectedMonth.value !== currentYearMonth()) {
          query.month = selectedMonth.value;
        }
        if (selectedProjectId.value != null) {
          query.project_id = String(selectedProjectId.value);
        }
        if (selectedAccountIds.value.length > 0) {
          query.account_ids = selectedAccountIds.value.map(String);
        }
        if (onlyConflicts.value) {
          query.only_conflicts = "1";
        }
        router.replace({ query });
      },
      { deep: true }
    );
    const scheduleParams = vueExports.computed(() => ({
      month: selectedMonth.value,
      project_id: selectedProjectId.value ?? void 0,
      account_ids: selectedAccountIds.value.length ? selectedAccountIds.value : void 0
    }));
    const { data, status, error } = useTeamSchedule(scheduleParams);
    const payload = vueExports.computed(() => data.value?.data ?? null);
    const toast = useToast();
    const tooManyAccounts = vueExports.ref(false);
    vueExports.watch(error, (err) => {
      if (!err) {
        tooManyAccounts.value = false;
        return;
      }
      const status2 = err.statusCode ?? err.status;
      if (status2 === 422) {
        tooManyAccounts.value = true;
        const data2 = err.data;
        toast.add({
          color: "warning",
          title: "Quá nhiều nhân viên",
          description: data2?.message ?? "Vui lòng lọc theo dự án hoặc chọn nhân viên cụ thể."
        });
      } else {
        tooManyAccounts.value = false;
      }
    });
    const drawerOpen = vueExports.ref(false);
    const drawerParams = vueExports.ref(null);
    function openSlotDrawer(params) {
      drawerParams.value = params;
      drawerOpen.value = true;
    }
    const unscheduledDrawerOpen = vueExports.ref(false);
    const unscheduledCtx = vueExports.ref(null);
    const unscheduledTickets = vueExports.computed(() => {
      const ctx = unscheduledCtx.value;
      if (!ctx) return [];
      return payload.value?.unscheduled_cards_by_account?.[ctx.account_id]?.[ctx.date] ?? [];
    });
    const unscheduledAccountName = vueExports.computed(() => {
      const ctx = unscheduledCtx.value;
      if (!ctx) return null;
      return payload.value?.accounts.find((a) => a.id === ctx.account_id)?.name ?? null;
    });
    function openUnscheduledDrawer(ctx) {
      unscheduledCtx.value = ctx;
      unscheduledDrawerOpen.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_ScheduleFilterBar = __nuxt_component_1;
      const _component_UFormField = _sfc_main$2;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_ScheduleMonthPicker = __nuxt_component_4;
      const _component_SharedAccountMultiSelect = __nuxt_component_5;
      const _component_UCheckbox = _sfc_main$3;
      const _component_UIcon = _sfc_main$h;
      const _component_UAlert = _sfc_main$4;
      const _component_USkeleton = _sfc_main$5;
      const _component_ScheduleTeamMatrixTable = __nuxt_component_10;
      const _component_ScheduleSlotDetailDrawer = __nuxt_component_11;
      const _component_ScheduleUnscheduledDetailDrawer = __nuxt_component_12;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Lịch việc đội",
        description: "Ma trận lịch của tất cả nhân sự theo ngày × ca trong tháng"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleFilterBar, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Dự án",
              class: "min-w-[220px]"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
                    "model-value": vueExports.unref(selectedProjectId),
                    placeholder: "Tất cả dự án",
                    "onUpdate:modelValue": ($event) => selectedProjectId.value = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedProjectSelect, {
                      "model-value": vueExports.unref(selectedProjectId),
                      placeholder: "Tất cả dự án",
                      "onUpdate:modelValue": ($event) => selectedProjectId.value = $event
                    }, null, 8, ["model-value", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tháng" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleMonthPicker, {
                    modelValue: vueExports.unref(selectedMonth),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(selectedMonth) ? selectedMonth.value = $event : null
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_ScheduleMonthPicker, {
                      modelValue: vueExports.unref(selectedMonth),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedMonth) ? selectedMonth.value = $event : null
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Nhân sự",
              class: "min-w-[260px]"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedAccountMultiSelect, {
                    "model-value": vueExports.unref(selectedAccountIds),
                    placeholder: "Tất cả nhân sự",
                    "onUpdate:modelValue": ($event) => selectedAccountIds.value = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SharedAccountMultiSelect, {
                      "model-value": vueExports.unref(selectedAccountIds),
                      placeholder: "Tất cả nhân sự",
                      "onUpdate:modelValue": ($event) => selectedAccountIds.value = $event
                    }, null, 8, ["model-value", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Lọc chồng chéo" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
                    modelValue: vueExports.unref(onlyConflicts),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(onlyConflicts) ? onlyConflicts.value = $event : null,
                    label: "Chỉ nhân sự có ca chồng chéo"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UCheckbox, {
                      modelValue: vueExports.unref(onlyConflicts),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(onlyConflicts) ? onlyConflicts.value = $event : null,
                      label: "Chỉ nhân sự có ca chồng chéo"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="ml-auto mb-1 flex flex-wrap items-center gap-3 text-xs text-slate-600"${_scopeId}><span class="inline-flex items-center gap-1.5"${_scopeId}><span class="inline-block size-3 rounded-sm border border-sky-300 bg-sky-50"${_scopeId}></span> Ca sáng </span><span class="inline-flex items-center gap-1.5"${_scopeId}><span class="inline-block size-3 rounded-sm border border-amber-300 bg-amber-50"${_scopeId}></span> Ca chiều </span><span class="inline-flex items-center gap-1.5"${_scopeId}><span class="inline-block size-3 rounded-sm border border-violet-300 bg-violet-50"${_scopeId}></span> Ca tối </span><span class="inline-flex items-center gap-1"${_scopeId}><span class="inline-flex items-center gap-0.5 rounded bg-white/90 border border-slate-200 px-1 py-[1px] text-[9px] font-bold tracking-wide"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-building-2",
              class: "size-2.5"
            }, null, _parent2, _scopeId));
            _push2(` HR </span> đã đăng ký </span><span class="inline-flex items-center gap-1.5"${_scopeId}><span class="inline-block size-3 rounded-sm border border-rose-400 bg-rose-50 ring-1 ring-rose-300"${_scopeId}></span><span class="text-rose-600 font-medium"${_scopeId}>Chồng chéo thời gian</span></span></div>`);
          } else {
            return [
              vueExports.createVNode(_component_UFormField, {
                label: "Dự án",
                class: "min-w-[220px]"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SharedProjectSelect, {
                    "model-value": vueExports.unref(selectedProjectId),
                    placeholder: "Tất cả dự án",
                    "onUpdate:modelValue": ($event) => selectedProjectId.value = $event
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, { label: "Tháng" }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_ScheduleMonthPicker, {
                    modelValue: vueExports.unref(selectedMonth),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(selectedMonth) ? selectedMonth.value = $event : null
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, {
                label: "Nhân sự",
                class: "min-w-[260px]"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SharedAccountMultiSelect, {
                    "model-value": vueExports.unref(selectedAccountIds),
                    placeholder: "Tất cả nhân sự",
                    "onUpdate:modelValue": ($event) => selectedAccountIds.value = $event
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_UFormField, { label: "Lọc chồng chéo" }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_UCheckbox, {
                    modelValue: vueExports.unref(onlyConflicts),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(onlyConflicts) ? onlyConflicts.value = $event : null,
                    label: "Chỉ nhân sự có ca chồng chéo"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              vueExports.createVNode("div", { class: "ml-auto mb-1 flex flex-wrap items-center gap-3 text-xs text-slate-600" }, [
                vueExports.createVNode("span", { class: "inline-flex items-center gap-1.5" }, [
                  vueExports.createVNode("span", { class: "inline-block size-3 rounded-sm border border-sky-300 bg-sky-50" }),
                  vueExports.createTextVNode(" Ca sáng ")
                ]),
                vueExports.createVNode("span", { class: "inline-flex items-center gap-1.5" }, [
                  vueExports.createVNode("span", { class: "inline-block size-3 rounded-sm border border-amber-300 bg-amber-50" }),
                  vueExports.createTextVNode(" Ca chiều ")
                ]),
                vueExports.createVNode("span", { class: "inline-flex items-center gap-1.5" }, [
                  vueExports.createVNode("span", { class: "inline-block size-3 rounded-sm border border-violet-300 bg-violet-50" }),
                  vueExports.createTextVNode(" Ca tối ")
                ]),
                vueExports.createVNode("span", { class: "inline-flex items-center gap-1" }, [
                  vueExports.createVNode("span", { class: "inline-flex items-center gap-0.5 rounded bg-white/90 border border-slate-200 px-1 py-[1px] text-[9px] font-bold tracking-wide" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-building-2",
                      class: "size-2.5"
                    }),
                    vueExports.createTextVNode(" HR ")
                  ]),
                  vueExports.createTextVNode(" đã đăng ký ")
                ]),
                vueExports.createVNode("span", { class: "inline-flex items-center gap-1.5" }, [
                  vueExports.createVNode("span", { class: "inline-block size-3 rounded-sm border border-rose-400 bg-rose-50 ring-1 ring-rose-300" }),
                  vueExports.createVNode("span", { class: "text-rose-600 font-medium" }, "Chồng chéo thời gian")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (vueExports.unref(tooManyAccounts)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "warning",
          variant: "subtle",
          icon: "i-lucide-triangle-alert",
          title: "Quá nhiều nhân viên",
          description: "Vui lòng lọc theo dự án hoặc chọn nhân viên cụ thể để thu hẹp danh sách."
        }, null, _parent));
      } else if (vueExports.unref(error) && !vueExports.unref(tooManyAccounts)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          title: "Không tải được lịch đội",
          description: vueExports.unref(error).message
        }, null, _parent));
      } else if (vueExports.unref(status) === "pending") {
        _push(`<div class="flex flex-col gap-1 rounded-xl border border-border-gray bg-white p-2"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(6, (n) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, {
            key: n,
            class: "h-[72px] w-full"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleTeamMatrixTable, {
          payload: vueExports.unref(payload),
          "only-conflicts": vueExports.unref(onlyConflicts),
          onClickSlot: openSlotDrawer,
          onClickUnscheduled: openUnscheduledDrawer
        }, null, _parent));
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleSlotDetailDrawer, {
        open: vueExports.unref(drawerOpen),
        "onUpdate:open": ($event) => vueExports.isRef(drawerOpen) ? drawerOpen.value = $event : null,
        params: vueExports.unref(drawerParams)
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleUnscheduledDetailDrawer, {
        open: vueExports.unref(unscheduledDrawerOpen),
        "onUpdate:open": ($event) => vueExports.isRef(unscheduledDrawerOpen) ? unscheduledDrawerOpen.value = $event : null,
        date: vueExports.unref(unscheduledCtx)?.date ?? null,
        tickets: vueExports.unref(unscheduledTickets),
        "account-name": vueExports.unref(unscheduledAccountName)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quan-ly-cong-viec/lich-viec-doi.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=lich-viec-doi-CVezq5Ez.mjs.map
