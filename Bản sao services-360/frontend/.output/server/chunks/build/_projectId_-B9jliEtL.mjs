import { v as vueExports, p as useRoute$1, j as useToast, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, w as __nuxt_component_5, aL as __nuxt_component_6$1, $ as $api } from './server.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as _sfc_main$4 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$5 } from './Tabs-Djlffbcc.mjs';
import { _ as _sfc_main$6 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$7 } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$8 } from './Select-CZE7Ef6n.mjs';
import { _ as _sfc_main$9 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_5$1 } from './NumberInput-BfLKWOCC.mjs';
import { _ as _sfc_main$a } from './Checkbox-Cp_FPUkd.mjs';
import { a as useCommissionConfig, b as useAvailableDepartments, C as COMMISSION_PARTY_ORDER, c as COMMISSION_PARTY_LABELS, d as COMMISSION_VALUE_TYPE_OPTIONS, e as apiSaveCommissionConfig, f as apiSaveCommissionAdjusters } from './useCommissionConfig-CzVSCENv.mjs';
import { _ as _sfc_main$b } from './SelectMenu-DKHEMZj7.mjs';
import { _ as _sfc_main$d } from './Table-17SH0cIR.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { a as getApiValidationErrors, g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { u as useBreadcrumb } from './useBreadcrumb-zkNa_uJG.mjs';
import { u as useCommissionMindmap } from './useCommissionMindmap-DoF1JQcV.mjs';
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
import './useDirection-CXYby7CP.mjs';
import './FocusScope-BZehoQSg.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';
import './Label-BBgw4vHh.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-QmZAbLx-.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './useKbd-JjFOu4f7.mjs';
import './index-CSThDD3J.mjs';

const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StaffRuleRow",
  __ssrInlineRender: true,
  props: {
    "modelValue": { required: true },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const model = vueExports.useModel(__props, "modelValue");
    const showPercent = vueExports.computed(
      () => model.value.value_type === "percent" || model.value.value_type === "both"
    );
    const showFixed = vueExports.computed(
      () => model.value.value_type === "fixed" || model.value.value_type === "both"
    );
    function onSelectedChange(checked) {
      model.value.selected = checked === true;
    }
    function onValueTypeChange(val) {
      model.value.value_type = val;
      if (val === "percent") model.value.value_fixed = null;
      if (val === "fixed") model.value.percent = null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCheckbox = _sfc_main$a;
      const _component_UFormField = _sfc_main$7;
      const _component_UInput = _sfc_main$9;
      const _component_USelect = _sfc_main$8;
      const _component_SharedNumberInput = __nuxt_component_5$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: ["rounded-lg border p-3", model.value.selected ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/50"]
      }, _attrs))}><div class="flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
        "model-value": model.value.selected,
        "onUpdate:modelValue": onSelectedChange
      }, null, _parent));
      _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([model.value.selected ? "font-medium text-slate-900" : "text-slate-400", "text-sm"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(model.value.account_name)} `);
      if (model.value.employee_code) {
        _push(`<span class="text-xs text-slate-400 font-mono">(${serverRenderer_cjs_prodExports.ssrInterpolate(model.value.employee_code)})</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span></div>`);
      if (model.value.selected) {
        _push(`<div class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pl-7">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Thứ tự" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                modelValue: model.value.sort_order,
                "onUpdate:modelValue": ($event) => model.value.sort_order = $event,
                modelModifiers: { number: true },
                type: "number",
                min: 1,
                size: "sm"
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UInput, {
                  modelValue: model.value.sort_order,
                  "onUpdate:modelValue": ($event) => model.value.sort_order = $event,
                  modelModifiers: { number: true },
                  type: "number",
                  min: 1,
                  size: "sm"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Loại" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                "model-value": model.value.value_type,
                items: "COMMISSION_VALUE_TYPE_OPTIONS" in _ctx ? _ctx.COMMISSION_VALUE_TYPE_OPTIONS : vueExports.unref(COMMISSION_VALUE_TYPE_OPTIONS),
                "value-key": "value",
                size: "sm",
                "onUpdate:modelValue": onValueTypeChange
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_USelect, {
                  "model-value": model.value.value_type,
                  items: "COMMISSION_VALUE_TYPE_OPTIONS" in _ctx ? _ctx.COMMISSION_VALUE_TYPE_OPTIONS : vueExports.unref(COMMISSION_VALUE_TYPE_OPTIONS),
                  "value-key": "value",
                  size: "sm",
                  "onUpdate:modelValue": onValueTypeChange
                }, null, 8, ["model-value", "items"])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(showPercent)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Phần trăm (%)" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                  modelValue: model.value.percent,
                  "onUpdate:modelValue": ($event) => model.value.percent = $event,
                  modelModifiers: { number: true },
                  type: "number",
                  min: 0,
                  max: 100,
                  step: 0.01,
                  size: "sm"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: model.value.percent,
                    "onUpdate:modelValue": ($event) => model.value.percent = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: 0,
                    max: 100,
                    step: 0.01,
                    size: "sm"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(showFixed)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tiền cứng (đ)" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                  modelValue: model.value.value_fixed,
                  "onUpdate:modelValue": ($event) => model.value.value_fixed = $event,
                  min: 0
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_SharedNumberInput, {
                    modelValue: model.value.value_fixed,
                    "onUpdate:modelValue": ($event) => model.value.value_fixed = $event,
                    min: 0
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/commission/StaffRuleRow.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$3, { __name: "CommissionStaffRuleRow" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DeptRuleRow",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    availableAccounts: {}
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const model = vueExports.useModel(__props, "modelValue");
    const showPercent = vueExports.computed(
      () => model.value.value_type === "percent" || model.value.value_type === "both"
    );
    const showFixed = vueExports.computed(
      () => model.value.value_type === "fixed" || model.value.value_type === "both"
    );
    const selectedStaff = vueExports.computed(
      () => model.value.staff_rules.filter((s) => s.selected)
    );
    const staffPercentSum = vueExports.computed(
      () => selectedStaff.value.filter((s) => s.value_type === "percent" || s.value_type === "both").reduce((sum, s) => sum + (s.percent ?? 0), 0)
    );
    function onSelectedChange(checked) {
      model.value.selected = checked === true;
    }
    function onValueTypeChange(val) {
      model.value.value_type = val;
      if (val === "percent") model.value.value_fixed = null;
      if (val === "fixed") model.value.percent = null;
    }
    function toggleExpand() {
      model.value.expanded = !model.value.expanded;
      if (model.value.expanded && model.value.staff_rules.length === 0) {
        initStaffRules();
      }
    }
    function initStaffRules() {
      const accounts = props.availableAccounts;
      if (accounts.length === 0) return;
      const evenPercent = Math.round(100 / accounts.length * 100) / 100;
      model.value.staff_rules = accounts.map((acc, idx) => {
        const isLast = idx === accounts.length - 1;
        const percent = isLast ? Math.round((100 - evenPercent * (accounts.length - 1)) * 100) / 100 : evenPercent;
        return {
          account_id: acc.id,
          account_name: acc.name,
          employee_code: acc.employee_code,
          selected: true,
          sort_order: idx + 1,
          value_type: "percent",
          percent,
          value_fixed: null
        };
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCheckbox = _sfc_main$a;
      const _component_UFormField = _sfc_main$7;
      const _component_UInput = _sfc_main$9;
      const _component_USelect = _sfc_main$8;
      const _component_SharedNumberInput = __nuxt_component_5$1;
      const _component_UButton = _sfc_main$c;
      const _component_CommissionStaffRuleRow = __nuxt_component_6;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: ["rounded-xl border", model.value.selected ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/50"]
      }, _attrs))}><div class="p-4"><div class="flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCheckbox, {
        "model-value": model.value.selected,
        "onUpdate:modelValue": onSelectedChange
      }, null, _parent));
      _push(`<span class="text-sm font-semibold cursor-pointer select-none hover:text-primary-600 transition-colors text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(model.value.department_name)}</span></div>`);
      if (model.value.selected) {
        _push(`<div class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pl-7">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Thứ tự" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                modelValue: model.value.sort_order,
                "onUpdate:modelValue": ($event) => model.value.sort_order = $event,
                modelModifiers: { number: true },
                type: "number",
                min: 1,
                size: "sm"
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UInput, {
                  modelValue: model.value.sort_order,
                  "onUpdate:modelValue": ($event) => model.value.sort_order = $event,
                  modelModifiers: { number: true },
                  type: "number",
                  min: 1,
                  size: "sm"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Loại" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                "model-value": model.value.value_type,
                items: "COMMISSION_VALUE_TYPE_OPTIONS" in _ctx ? _ctx.COMMISSION_VALUE_TYPE_OPTIONS : vueExports.unref(COMMISSION_VALUE_TYPE_OPTIONS),
                "value-key": "value",
                size: "sm",
                "onUpdate:modelValue": onValueTypeChange
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_USelect, {
                  "model-value": model.value.value_type,
                  items: "COMMISSION_VALUE_TYPE_OPTIONS" in _ctx ? _ctx.COMMISSION_VALUE_TYPE_OPTIONS : vueExports.unref(COMMISSION_VALUE_TYPE_OPTIONS),
                  "value-key": "value",
                  size: "sm",
                  "onUpdate:modelValue": onValueTypeChange
                }, null, 8, ["model-value", "items"])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(showPercent)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Phần trăm (%)" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                  modelValue: model.value.percent,
                  "onUpdate:modelValue": ($event) => model.value.percent = $event,
                  modelModifiers: { number: true },
                  type: "number",
                  min: 0,
                  max: 100,
                  step: 0.01,
                  size: "sm"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_UInput, {
                    modelValue: model.value.percent,
                    "onUpdate:modelValue": ($event) => model.value.percent = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: 0,
                    max: 100,
                    step: 0.01,
                    size: "sm"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(showFixed)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tiền cứng (đ)" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                  modelValue: model.value.value_fixed,
                  "onUpdate:modelValue": ($event) => model.value.value_fixed = $event,
                  min: 0
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_SharedNumberInput, {
                    modelValue: model.value.value_fixed,
                    "onUpdate:modelValue": ($event) => model.value.value_fixed = $event,
                    min: 0
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (model.value.selected) {
        _push(`<div class="mt-3 pl-7">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: model.value.expanded ? "i-lucide-chevron-down" : "i-lucide-chevron-right",
          label: `Chỉ định cá nhân (${__props.availableAccounts.length} NV)`,
          variant: "ghost",
          color: "neutral",
          size: "sm",
          onClick: toggleExpand
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (model.value.selected && model.value.expanded) {
        _push(`<div class="border-t border-slate-100 p-4 bg-slate-50/30">`);
        if (model.value.staff_rules.length === 0) {
          _push(`<div class="text-sm text-slate-400 italic"> Không có nhân viên nào thuộc phòng ban này trong dự án. </div>`);
        } else {
          _push(`<div class="flex flex-col gap-2"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(model.value.staff_rules, (staff, idx) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CommissionStaffRuleRow, {
              key: staff.account_id,
              modelValue: model.value.staff_rules[idx],
              "onUpdate:modelValue": ($event) => model.value.staff_rules[idx] = $event
            }, null, _parent));
          });
          _push(`<!--]--><div class="mt-2 text-xs font-medium">`);
          if (vueExports.unref(staffPercentSum) === 100) {
            _push(`<span class="text-emerald-600"> Tổng %: 100% ✓ </span>`);
          } else if (vueExports.unref(selectedStaff).some((s) => s.value_type === "percent" || s.value_type === "both")) {
            _push(`<span class="text-red-500"> Tổng %: ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(staffPercentSum))}% (phải bằng 100%) </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/commission/DeptRuleRow.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_12 = Object.assign(_sfc_main$2, { __name: "CommissionDeptRuleRow" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AdjusterSection",
  __ssrInlineRender: true,
  props: {
    projectId: {},
    adjusters: {}
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = useToast();
    const isSaving = vueExports.ref(false);
    const localAdjusters = vueExports.ref([...props.adjusters]);
    vueExports.watch(() => props.adjusters, (val) => {
      localAdjusters.value = [...val];
    });
    const addedAccountIds = vueExports.computed(
      () => new Set(localAdjusters.value.map((a) => a.account?.id).filter(Boolean))
    );
    const searchTerm = vueExports.ref("");
    const fetchedAccounts = vueExports.ref([]);
    const isSearching = vueExports.ref(false);
    let searchTimeout;
    async function fetchAccounts(search) {
      isSearching.value = true;
      try {
        const query = { is_active: 1, per_page: 20 };
        if (search) query.search = search;
        const res = await $api("/pmc/accounts", { query });
        fetchedAccounts.value = (res.data ?? []).map((acc) => ({
          label: `${acc.name}${acc.employee_code ? ` (${acc.employee_code})` : ""}`,
          value: acc.id,
          name: acc.name,
          employeeCode: acc.employee_code ?? null
        }));
      } catch {
        fetchedAccounts.value = [];
      } finally {
        isSearching.value = false;
      }
    }
    fetchAccounts();
    vueExports.watch(searchTerm, (val) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => fetchAccounts(val || void 0), 300);
    });
    const selectItems = vueExports.computed(
      () => fetchedAccounts.value.filter((acc) => !addedAccountIds.value.has(acc.value))
    );
    const selectedAccountIds = vueExports.ref([]);
    function addAdjusters() {
      if (selectedAccountIds.value.length === 0) return;
      for (const accId of selectedAccountIds.value) {
        const acc = fetchedAccounts.value.find((a) => a.value === accId);
        if (!acc) continue;
        localAdjusters.value.push({
          id: 0,
          account: { id: acc.value, name: acc.name, employee_code: acc.employeeCode }
        });
      }
      selectedAccountIds.value = [];
      searchTerm.value = "";
      fetchedAccounts.value = [];
    }
    function removeAdjuster(index) {
      localAdjusters.value.splice(index, 1);
    }
    const columns = [
      { id: "name", header: "Tên" },
      { id: "employee_code", header: "Mã NV" },
      stickyRight({ id: "actions", header: "" }, { width: "w-[80px] min-w-[80px]" })
    ];
    async function save() {
      isSaving.value = true;
      try {
        const accountIds = localAdjusters.value.map((a) => a.account?.id).filter((id) => id != null);
        await apiSaveCommissionAdjusters(props.projectId, { account_ids: accountIds });
        toast.add({ title: "Đã lưu danh sách người điều chỉnh", color: "success" });
        emit("saved");
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Lưu thất bại"), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$7;
      const _component_USelectMenu = _sfc_main$b;
      const _component_UButton = _sfc_main$c;
      const _component_UTable = _sfc_main$d;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({ title: "Người được phép điều chỉnh hoa hồng theo đơn" }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-end gap-3 mb-4"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Chọn nhân viên",
              class: "flex-1"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(selectedAccountIds),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(selectedAccountIds) ? selectedAccountIds.value = $event : null,
                    "search-term": vueExports.unref(searchTerm),
                    "onUpdate:searchTerm": ($event) => vueExports.isRef(searchTerm) ? searchTerm.value = $event : null,
                    multiple: "",
                    items: vueExports.unref(selectItems),
                    "value-key": "value",
                    "ignore-filter": "",
                    loading: vueExports.unref(isSearching),
                    "search-input": { placeholder: "Gõ tên hoặc mã NV để tìm..." },
                    placeholder: "Chọn nhân viên..."
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(selectedAccountIds),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedAccountIds) ? selectedAccountIds.value = $event : null,
                      "search-term": vueExports.unref(searchTerm),
                      "onUpdate:searchTerm": ($event) => vueExports.isRef(searchTerm) ? searchTerm.value = $event : null,
                      multiple: "",
                      items: vueExports.unref(selectItems),
                      "value-key": "value",
                      "ignore-filter": "",
                      loading: vueExports.unref(isSearching),
                      "search-input": { placeholder: "Gõ tên hoặc mã NV để tìm..." },
                      placeholder: "Chọn nhân viên..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "search-term", "onUpdate:searchTerm", "items", "loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Thêm",
              icon: "i-lucide-plus",
              size: "sm",
              disabled: vueExports.unref(selectedAccountIds).length === 0,
              onClick: addAdjusters
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (vueExports.unref(localAdjusters).length > 0) {
              _push2(`<div${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(localAdjusters),
                columns
              }, {
                "name-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.account?.name ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(row.original.account?.name ?? "—"), 1)
                    ];
                  }
                }),
                "employee_code-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-mono text-sm text-slate-500"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.account?.employee_code ?? "—")}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-mono text-sm text-slate-500" }, vueExports.toDisplayString(row.original.account?.employee_code ?? "—"), 1)
                    ];
                  }
                }),
                "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                      icon: "i-lucide-trash-2",
                      variant: "ghost",
                      color: "error",
                      size: "xs",
                      onClick: ($event) => removeAdjuster(row.index)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-trash-2",
                        variant: "ghost",
                        color: "error",
                        size: "xs",
                        onClick: ($event) => removeAdjuster(row.index)
                      }, null, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<p class="text-sm text-slate-400 italic"${_scopeId}> Chưa có người điều chỉnh nào. </p>`);
            }
            _push2(`<div class="mt-4 flex justify-end"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Lưu danh sách",
              icon: "i-lucide-save",
              color: "primary",
              variant: "soft",
              size: "sm",
              loading: vueExports.unref(isSaving),
              onClick: save
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-end gap-3 mb-4" }, [
                vueExports.createVNode(_component_UFormField, {
                  label: "Chọn nhân viên",
                  class: "flex-1"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(selectedAccountIds),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedAccountIds) ? selectedAccountIds.value = $event : null,
                      "search-term": vueExports.unref(searchTerm),
                      "onUpdate:searchTerm": ($event) => vueExports.isRef(searchTerm) ? searchTerm.value = $event : null,
                      multiple: "",
                      items: vueExports.unref(selectItems),
                      "value-key": "value",
                      "ignore-filter": "",
                      loading: vueExports.unref(isSearching),
                      "search-input": { placeholder: "Gõ tên hoặc mã NV để tìm..." },
                      placeholder: "Chọn nhân viên..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "search-term", "onUpdate:searchTerm", "items", "loading"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UButton, {
                  label: "Thêm",
                  icon: "i-lucide-plus",
                  size: "sm",
                  disabled: vueExports.unref(selectedAccountIds).length === 0,
                  onClick: addAdjusters
                }, null, 8, ["disabled"])
              ]),
              vueExports.unref(localAdjusters).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 0 }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(localAdjusters),
                  columns
                }, {
                  "name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.account?.name ?? "—"), 1)
                  ]),
                  "employee_code-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-mono text-sm text-slate-500" }, vueExports.toDisplayString(row.original.account?.employee_code ?? "—"), 1)
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-trash-2",
                      variant: "ghost",
                      color: "error",
                      size: "xs",
                      onClick: ($event) => removeAdjuster(row.index)
                    }, null, 8, ["onClick"])
                  ]),
                  _: 1
                }, 8, ["data"])
              ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                key: 1,
                class: "text-sm text-slate-400 italic"
              }, " Chưa có người điều chỉnh nào. ")),
              vueExports.createVNode("div", { class: "mt-4 flex justify-end" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Lưu danh sách",
                  icon: "i-lucide-save",
                  color: "primary",
                  variant: "soft",
                  size: "sm",
                  loading: vueExports.unref(isSaving),
                  onClick: save
                }, null, 8, ["loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/commission/AdjusterSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_13 = Object.assign(_sfc_main$1, { __name: "CommissionAdjusterSection" });
const EXAMPLE_BASE = 4e5;
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[projectId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const toast = useToast();
    const projectId = vueExports.computed(() => Number(route.params.projectId));
    const { data: configData, status: configStatus, error: configError, refresh: refreshConfig } = useCommissionConfig(projectId);
    const { data: deptsData, status: deptsStatus } = useAvailableDepartments(projectId);
    const isLoading = vueExports.computed(() => configStatus.value === "pending" || deptsStatus.value === "pending");
    const configDetail = vueExports.computed(() => configData.value?.data);
    const project = vueExports.computed(() => configDetail.value?.project);
    const platformConfig = vueExports.computed(() => configDetail.value?.platform ?? { percent: 5, value_fixed: 1e3, source: "fallback" });
    const availableDepartments = vueExports.computed(() => deptsData.value?.data ?? []);
    const { useDynamicLabel } = useBreadcrumb();
    useDynamicLabel(vueExports.computed(() => project.value?.name ?? null));
    useSeoMeta({
      title: vueExports.computed(
        () => project.value ? `${project.value.code} - Cấu hình hoa hồng` : "Cấu hình hoa hồng"
      )
    });
    const partyRules = vueExports.ref([]);
    const deptRules = vueExports.ref([]);
    const formInitialized = vueExports.ref(false);
    vueExports.watch([configDetail, deptsData], ([config, rawDepts]) => {
      if (!config || !rawDepts || formInitialized.value) return;
      initForm(config, rawDepts.data ?? []);
      formInitialized.value = true;
    });
    function initForm(config, depts) {
      partyRules.value = COMMISSION_PARTY_ORDER.map((partyType) => {
        const existing = config.party_rules?.find((r) => r.party_type.value === partyType);
        return {
          party_type: partyType,
          label: COMMISSION_PARTY_LABELS[partyType],
          value_type: existing?.value_type?.value ?? "percent",
          percent: existing?.percent ? parseFloat(existing.percent) : null,
          value_fixed: existing?.value_fixed ? parseFloat(existing.value_fixed) : null
        };
      });
      deptRules.value = depts.map((dept, deptIdx) => {
        const existing = config.dept_rules?.find((r) => r.department.id === dept.id);
        if (existing) {
          const existingAccountIds = new Set(existing.staff_rules.map((s) => s.account.id));
          const staffRules = [
            ...existing.staff_rules.map((s) => ({
              account_id: s.account.id,
              account_name: s.account.name,
              employee_code: s.account.employee_code,
              selected: true,
              sort_order: s.sort_order,
              value_type: s.value_type.value,
              percent: s.percent ? parseFloat(s.percent) : null,
              value_fixed: s.value_fixed ? parseFloat(s.value_fixed) : null
            })),
            ...dept.accounts.filter((acc) => !existingAccountIds.has(acc.id)).map((acc) => ({
              account_id: acc.id,
              account_name: acc.name,
              employee_code: acc.employee_code,
              selected: false,
              sort_order: existing.staff_rules.length + 1,
              value_type: "percent",
              percent: null,
              value_fixed: null
            }))
          ];
          return {
            department_id: dept.id,
            department_name: dept.name,
            selected: true,
            sort_order: existing.sort_order,
            value_type: existing.value_type.value,
            percent: existing.percent ? parseFloat(existing.percent) : null,
            value_fixed: existing.value_fixed ? parseFloat(existing.value_fixed) : null,
            expanded: false,
            staff_rules: staffRules
          };
        }
        return {
          department_id: dept.id,
          department_name: dept.name,
          selected: false,
          sort_order: deptIdx + 1,
          value_type: "percent",
          percent: null,
          value_fixed: null,
          expanded: false,
          staff_rules: []
        };
      });
    }
    const totalPartyPercent = vueExports.computed(() => {
      let sum = platformConfig.value.percent;
      for (const p of partyRules.value) {
        if (p.value_type === "percent" || p.value_type === "both") {
          sum += p.percent ?? 0;
        }
      }
      return sum;
    });
    const totalLevel1Fixed = vueExports.computed(() => {
      let sum = platformConfig.value.value_fixed ?? 0;
      for (const p of partyRules.value) {
        if (p.value_type === "fixed" || p.value_type === "both") {
          sum += p.value_fixed ?? 0;
        }
      }
      return sum;
    });
    const hasManagement = vueExports.computed(() => partyRules.value.some((p) => p.party_type === "management"));
    const checkedDepts = vueExports.computed(() => deptRules.value.filter((d) => d.selected));
    const totalDeptPercent = vueExports.computed(
      () => checkedDepts.value.filter((d) => d.value_type === "percent" || d.value_type === "both").reduce((sum, d) => sum + (d.percent ?? 0), 0)
    );
    const totalDeptFixed = vueExports.computed(
      () => checkedDepts.value.filter((d) => d.value_type === "fixed" || d.value_type === "both").reduce((sum, d) => sum + (d.value_fixed ?? 0), 0)
    );
    function getAccountsForDept(departmentId) {
      return availableDepartments.value.find((d) => d.id === departmentId)?.accounts ?? [];
    }
    function formatPartyLabel(p) {
      if (p.value_type === "percent") return `${p.percent ?? 0}%`;
      if (p.value_type === "fixed") return `${formatCurrency(p.value_fixed ?? 0)}/đơn`;
      return `${p.percent ?? 0}% + ${formatCurrency(p.value_fixed ?? 0)}/đơn`;
    }
    const mindmapConfig = vueExports.computed(() => {
      const pf = platformConfig.value;
      const deptChildren = checkedDepts.value.map((dept) => {
        let deptLabel = dept.department_name;
        if (dept.value_type === "percent") deptLabel += `: ${dept.percent ?? 0}%`;
        else if (dept.value_type === "fixed") deptLabel += `: ${formatCurrency(dept.value_fixed ?? 0)}/đơn`;
        else deptLabel += `: ${dept.percent ?? 0}% + ${formatCurrency(dept.value_fixed ?? 0)}/đơn`;
        const staffChildren = dept.staff_rules.filter((s) => s.selected).map((s) => {
          let staffLabel = s.account_name;
          if (s.value_type === "percent") staffLabel += `: ${s.percent ?? 0}%`;
          else if (s.value_type === "fixed") staffLabel += `: ${formatCurrency(s.value_fixed ?? 0)}/đơn`;
          else staffLabel += `: ${s.percent ?? 0}% + ${formatCurrency(s.value_fixed ?? 0)}/đơn`;
          return { name: staffLabel };
        });
        return { name: deptLabel, children: staffChildren.length > 0 ? staffChildren : void 0 };
      });
      const children = [];
      children.push({ name: `Platform: ${pf.percent}% + ${formatCurrency(pf.value_fixed)}/đơn` });
      for (const p of partyRules.value) {
        const node = { name: `${p.label}: ${formatPartyLabel(p)}` };
        if (p.party_type === "management") {
          node.children = deptChildren.length > 0 ? deptChildren : [{ name: "(Chưa chọn phòng ban)" }];
        }
        children.push(node);
      }
      const rootLabel = totalLevel1Fixed.value > 0 ? `Tổng HH (100% + ${formatCurrency(totalLevel1Fixed.value)}/đơn)` : "Tổng hoa hồng (100%)";
      return [{ name: rootLabel, children }];
    });
    const distributeInput = vueExports.computed(() => {
      return {
        total: EXAMPLE_BASE,
        platform: {
          percent: platformConfig.value.percent,
          valueFixed: platformConfig.value.value_fixed
        },
        partyRules: partyRules.value.map((p) => ({
          id: p.party_type,
          name: p.label,
          valueType: p.value_type,
          percent: p.percent,
          valueFixed: p.value_fixed
        })),
        deptRules: checkedDepts.value.map((dept) => ({
          id: dept.department_id,
          name: dept.department_name,
          sortOrder: dept.sort_order,
          valueType: dept.value_type,
          percent: dept.percent,
          valueFixed: dept.value_fixed,
          staff: dept.staff_rules.filter((s) => s.selected).map((s) => ({
            id: s.account_id,
            name: s.account_name,
            sortOrder: s.sort_order,
            valueType: s.value_type,
            percent: s.percent,
            valueFixed: s.value_fixed
          }))
        }))
      };
    });
    const { mindmap: mindmapExample, diagramKey } = useCommissionMindmap(distributeInput);
    const isTopPercentValid = vueExports.computed(() => Math.abs(totalPartyPercent.value - 100) < 1e-3);
    const hasDeptPercent = vueExports.computed(() => checkedDepts.value.some((d) => d.value_type === "percent" || d.value_type === "both"));
    const hasDeptFixed = vueExports.computed(() => checkedDepts.value.some((d) => d.value_type === "fixed" || d.value_type === "both"));
    const isDeptPercentSumValid = vueExports.computed(() => Math.abs(totalDeptPercent.value - 100) < 1e-3);
    const isDeptPercentValid = vueExports.computed(() => {
      if (!hasManagement.value) return true;
      if (!hasDeptPercent.value) return true;
      return isDeptPercentSumValid.value;
    });
    const isStaffPercentValid = vueExports.computed(() => {
      for (const dept of checkedDepts.value) {
        const checked = dept.staff_rules.filter((s) => s.selected);
        const hasPercent = checked.some((s) => s.value_type === "percent" || s.value_type === "both");
        if (!hasPercent) continue;
        const sum = checked.filter((s) => s.value_type === "percent" || s.value_type === "both").reduce((acc, s) => acc + (s.percent ?? 0), 0);
        if (Math.abs(sum - 100) > 1e-3) return false;
      }
      return true;
    });
    const isDiagramValid = vueExports.computed(() => isTopPercentValid.value && isDeptPercentValid.value && isStaffPercentValid.value);
    const configDiagramKey = vueExports.computed(() => JSON.stringify(mindmapConfig.value));
    const validationErrors = vueExports.ref([]);
    function validate() {
      const errors = [];
      if (Math.abs(totalPartyPercent.value - 100) > 1e-3) {
        errors.push(`Tổng phần trăm các bên (bao gồm Platform ${platformConfig.value.percent}%) phải bằng 100%. Hiện tại: ${totalPartyPercent.value}%`);
      }
      for (const p of partyRules.value) {
        if ((p.value_type === "percent" || p.value_type === "both") && (p.percent == null || p.percent < 0)) {
          errors.push(`${p.label}: Phần trăm là bắt buộc`);
        }
        if ((p.value_type === "fixed" || p.value_type === "both") && (p.value_fixed == null || p.value_fixed < 0)) {
          errors.push(`${p.label}: Tiền cứng là bắt buộc`);
        }
      }
      if (hasManagement.value) {
        if (checkedDepts.value.length === 0) {
          errors.push("Khi có Ban quản lý, phải chọn ít nhất 1 phòng ban");
        }
        const deptPercentDepts = checkedDepts.value.filter((d) => d.value_type === "percent" || d.value_type === "both");
        if (deptPercentDepts.length > 0 && Math.abs(totalDeptPercent.value - 100) > 1e-3) {
          errors.push("Tổng % phòng ban phải bằng 100%");
        }
        const managementRule = partyRules.value.find((p) => p.party_type === "management");
        const managementHasFixed = managementRule && (managementRule.value_type === "fixed" || managementRule.value_type === "both");
        const managementFixed = managementHasFixed ? managementRule.value_fixed ?? 0 : 0;
        const deptsWithFixed = checkedDepts.value.filter((d) => d.value_type === "fixed" || d.value_type === "both");
        if (!managementHasFixed && deptsWithFixed.length > 0) {
          errors.push("Ban quản lý không có tiền cứng — phòng ban không được dùng tiền cứng");
        }
        if (managementHasFixed && deptsWithFixed.length > 0) {
          const totalDeptFixedAmt = deptsWithFixed.reduce((sum, d) => sum + (d.value_fixed ?? 0), 0);
          if (totalDeptFixedAmt > managementFixed) {
            errors.push(`Tổng tiền cứng phòng ban (${formatCurrency(totalDeptFixedAmt)}) vượt quá tiền cứng Ban quản lý (${formatCurrency(managementFixed)})`);
          }
        }
        const deptSortOrders = checkedDepts.value.map((d) => d.sort_order);
        if (new Set(deptSortOrders).size !== deptSortOrders.length) {
          errors.push("Thứ tự ưu tiên phòng ban không được trùng");
        }
        for (const dept of checkedDepts.value) {
          if ((dept.value_type === "percent" || dept.value_type === "both") && (dept.percent == null || dept.percent < 0)) {
            errors.push(`Phòng ban ${dept.department_name}: Phần trăm là bắt buộc`);
          }
          if ((dept.value_type === "fixed" || dept.value_type === "both") && (dept.value_fixed == null || dept.value_fixed < 0)) {
            errors.push(`Phòng ban ${dept.department_name}: Tiền cứng là bắt buộc`);
          }
          const checkedStaff = dept.staff_rules.filter((s) => s.selected);
          if (checkedStaff.length === 0) {
            errors.push(`Phòng ban ${dept.department_name} phải có ít nhất 1 nhân viên`);
          }
          const deptHasFixed = dept.value_type === "fixed" || dept.value_type === "both";
          const staffWithFixed = checkedStaff.filter((s) => s.value_type === "fixed" || s.value_type === "both");
          if (!deptHasFixed && staffWithFixed.length > 0) {
            errors.push(`${dept.department_name} không có tiền cứng — nhân viên không được dùng tiền cứng`);
          }
          if (deptHasFixed && staffWithFixed.length > 0) {
            const totalStaffFixed = staffWithFixed.reduce((sum, s) => sum + (s.value_fixed ?? 0), 0);
            if (totalStaffFixed > (dept.value_fixed ?? 0)) {
              errors.push(`Tổng tiền cứng NV trong ${dept.department_name} (${formatCurrency(totalStaffFixed)}) vượt quá tiền cứng phòng ban (${formatCurrency(dept.value_fixed ?? 0)})`);
            }
          }
          const staffPercentStaff = checkedStaff.filter((s) => s.value_type === "percent" || s.value_type === "both");
          if (staffPercentStaff.length > 0) {
            const staffPercentSum = staffPercentStaff.reduce((sum, s) => sum + (s.percent ?? 0), 0);
            if (Math.abs(staffPercentSum - 100) > 1e-3) {
              errors.push(`Tổng % nhân viên trong ${dept.department_name} phải bằng 100%`);
            }
          }
          const staffSortOrders = checkedStaff.map((s) => s.sort_order);
          if (new Set(staffSortOrders).size !== staffSortOrders.length) {
            errors.push(`Thứ tự ưu tiên nhân viên trong ${dept.department_name} không được trùng`);
          }
          for (const staff of checkedStaff) {
            if ((staff.value_type === "percent" || staff.value_type === "both") && (staff.percent == null || staff.percent < 0)) {
              errors.push(`NV ${staff.account_name}: Phần trăm là bắt buộc`);
            }
            if ((staff.value_type === "fixed" || staff.value_type === "both") && (staff.value_fixed == null || staff.value_fixed < 0)) {
              errors.push(`NV ${staff.account_name}: Tiền cứng là bắt buộc`);
            }
          }
        }
      }
      validationErrors.value = errors;
      return errors.length === 0;
    }
    const isSaving = vueExports.ref(false);
    async function handleSave() {
      if (!validate()) {
        toast.add({ title: "Vui lòng kiểm tra lại thông tin", color: "error" });
        return;
      }
      isSaving.value = true;
      try {
        await apiSaveCommissionConfig(projectId.value, {
          party_rules: partyRules.value.map((p) => ({
            party_type: p.party_type,
            value_type: p.value_type,
            percent: p.value_type === "percent" || p.value_type === "both" ? p.percent : null,
            value_fixed: p.value_type === "fixed" || p.value_type === "both" ? p.value_fixed : null
          })),
          dept_rules: hasManagement.value ? checkedDepts.value.map((dept) => ({
            department_id: dept.department_id,
            sort_order: dept.sort_order,
            value_type: dept.value_type,
            percent: dept.value_type === "percent" || dept.value_type === "both" ? dept.percent : null,
            value_fixed: dept.value_type === "fixed" || dept.value_type === "both" ? dept.value_fixed : null,
            staff_rules: dept.staff_rules.filter((s) => s.selected).map((s) => ({
              account_id: s.account_id,
              sort_order: s.sort_order,
              value_type: s.value_type,
              percent: s.value_type === "percent" || s.value_type === "both" ? s.percent : null,
              value_fixed: s.value_type === "fixed" || s.value_type === "both" ? s.value_fixed : null
            }))
          })) : void 0
        });
        toast.add({ title: "Đã lưu cấu hình hoa hồng", color: "success" });
        formInitialized.value = false;
        await refreshConfig();
      } catch (err) {
        const serverErrors = getApiValidationErrors(err);
        if (serverErrors) {
          validationErrors.value = Object.values(serverErrors).flat();
        }
        toast.add({ title: getApiErrorMessage(err, "Lưu cấu hình thất bại"), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_UAlert = _sfc_main$4;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UTabs = _sfc_main$5;
      const _component_ClientOnly = __nuxt_component_5;
      const _component_CommissionPreviewDiagram = __nuxt_component_6$1;
      const _component_UBadge = _sfc_main$6;
      const _component_UFormField = _sfc_main$7;
      const _component_USelect = _sfc_main$8;
      const _component_UInput = _sfc_main$9;
      const _component_SharedNumberInput = __nuxt_component_5$1;
      const _component_CommissionDeptRuleRow = __nuxt_component_12;
      const _component_CommissionAdjusterSection = __nuxt_component_13;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "pb-20 lg:pb-0" }, _attrs))}><div class="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/commission",
        class: "shrink-0"
      }, null, _parent));
      _push(`<div class="min-w-0"><h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight"> Cấu hình hoa hồng </h1>`);
      if (vueExports.unref(project)) {
        _push(`<p class="text-slate-500 text-sm mt-0.5"><span class="font-mono font-semibold">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).code)}</span> — ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(project).name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (vueExports.unref(isLoading)) {
        _push(`<div class="flex flex-col gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(3, (i) => {
          _push(`<div class="h-32 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(configError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(configError),
          retry: vueExports.unref(refreshConfig)
        }, null, _parent));
      } else if (vueExports.unref(configDetail)) {
        _push(`<div class="flex flex-col gap-4 sm:gap-6">`);
        if (vueExports.unref(validationErrors).length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            icon: "i-lucide-alert-triangle",
            color: "error",
            variant: "subtle",
            title: "Lỗi cấu hình"
          }, {
            description: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<ul class="list-disc pl-4 text-sm space-y-0.5"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(validationErrors), (err, idx) => {
                  _push2(`<li${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(err)}</li>`);
                });
                _push2(`<!--]--></ul>`);
              } else {
                return [
                  vueExports.createVNode("ul", { class: "list-disc pl-4 text-sm space-y-0.5" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(validationErrors), (err, idx) => {
                      return vueExports.openBlock(), vueExports.createBlock("li", { key: idx }, vueExports.toDisplayString(err), 1);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Sơ đồ phân bổ hoa hồng" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTabs, {
                items: [
                  { label: "Cấu hình tỷ lệ", value: "config" },
                  { label: "Ví dụ phân phối", value: "example" }
                ],
                "default-value": "config",
                class: "w-full"
              }, {
                content: vueExports.withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="pt-3"${_scopeId2}>`);
                    if (!vueExports.unref(isDiagramValid)) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                        icon: "i-lucide-triangle-alert",
                        color: "warning",
                        variant: "subtle",
                        title: "Tỷ lệ phân bổ chưa đúng — tổng % các cấp phải bằng 100%.",
                        class: "mb-3"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, null, {
                      fallback: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50/30 py-12 text-slate-400 text-sm"${_scopeId3}> Đang tải sơ đồ... </div>`);
                        } else {
                          return [
                            vueExports.createVNode("div", { class: "flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50/30 py-12 text-slate-400 text-sm" }, " Đang tải sơ đồ... ")
                          ];
                        }
                      })
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "pt-3" }, [
                        !vueExports.unref(isDiagramValid) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                          key: 0,
                          icon: "i-lucide-triangle-alert",
                          color: "warning",
                          variant: "subtle",
                          title: "Tỷ lệ phân bổ chưa đúng — tổng % các cấp phải bằng 100%.",
                          class: "mb-3"
                        })) : vueExports.createCommentVNode("", true),
                        vueExports.createVNode(_component_ClientOnly, null, {
                          fallback: vueExports.withCtx(() => [
                            vueExports.createVNode("div", { class: "flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50/30 py-12 text-slate-400 text-sm" }, " Đang tải sơ đồ... ")
                          ]),
                          default: vueExports.withCtx(() => [
                            (vueExports.openBlock(), vueExports.createBlock(_component_CommissionPreviewDiagram, {
                              key: `${item.value}-${item.value === "config" ? vueExports.unref(configDiagramKey) : vueExports.unref(diagramKey)}`,
                              data: item.value === "config" ? vueExports.unref(mindmapConfig) : vueExports.unref(mindmapExample)
                            }, null, 8, ["data"]))
                          ]),
                          _: 2
                        }, 1024)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTabs, {
                  items: [
                    { label: "Cấu hình tỷ lệ", value: "config" },
                    { label: "Ví dụ phân phối", value: "example" }
                  ],
                  "default-value": "config",
                  class: "w-full"
                }, {
                  content: vueExports.withCtx(({ item }) => [
                    vueExports.createVNode("div", { class: "pt-3" }, [
                      !vueExports.unref(isDiagramValid) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                        key: 0,
                        icon: "i-lucide-triangle-alert",
                        color: "warning",
                        variant: "subtle",
                        title: "Tỷ lệ phân bổ chưa đúng — tổng % các cấp phải bằng 100%.",
                        class: "mb-3"
                      })) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode(_component_ClientOnly, null, {
                        fallback: vueExports.withCtx(() => [
                          vueExports.createVNode("div", { class: "flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50/30 py-12 text-slate-400 text-sm" }, " Đang tải sơ đồ... ")
                        ]),
                        default: vueExports.withCtx(() => [
                          (vueExports.openBlock(), vueExports.createBlock(_component_CommissionPreviewDiagram, {
                            key: `${item.value}-${item.value === "config" ? vueExports.unref(configDiagramKey) : vueExports.unref(diagramKey)}`,
                            data: item.value === "config" ? vueExports.unref(mindmapConfig) : vueExports.unref(mindmapExample)
                          }, null, 8, ["data"]))
                        ]),
                        _: 2
                      }, 1024)
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Phân bổ hoa hồng (tổng % = 100%)" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200"${_scopeId}><div class="flex items-center gap-2 mb-1"${_scopeId}><span class="text-sm font-semibold text-slate-700"${_scopeId}>1. Platform</span>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                label: vueExports.unref(platformConfig).source === "api" ? "Từ API" : "Mặc định",
                color: vueExports.unref(platformConfig).source === "api" ? "primary" : "neutral",
                size: "xs"
              }, null, _parent2, _scopeId));
              _push2(`</div><p class="text-sm text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(platformConfig).percent)}% + ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(platformConfig).value_fixed))}/đơn <span class="text-xs text-slate-400"${_scopeId}>(không chỉnh được — lấy từ platform service)</span></p></div><div class="flex flex-col gap-4"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(partyRules), (party, idx) => {
                _push2(`<div class="p-3 bg-white rounded-lg border border-slate-200"${_scopeId}><div class="text-sm font-semibold text-slate-700 mb-2"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(idx + 2)}. ${serverRenderer_cjs_prodExports.ssrInterpolate(party.label)}</div><div class="grid grid-cols-1 sm:grid-cols-3 gap-3"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Loại giá trị" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
                        modelValue: party.value_type,
                        "onUpdate:modelValue": ($event) => party.value_type = $event,
                        items: "COMMISSION_VALUE_TYPE_OPTIONS" in _ctx ? _ctx.COMMISSION_VALUE_TYPE_OPTIONS : vueExports.unref(COMMISSION_VALUE_TYPE_OPTIONS),
                        "value-key": "value",
                        "label-key": "label"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_USelect, {
                          modelValue: party.value_type,
                          "onUpdate:modelValue": ($event) => party.value_type = $event,
                          items: "COMMISSION_VALUE_TYPE_OPTIONS" in _ctx ? _ctx.COMMISSION_VALUE_TYPE_OPTIONS : vueExports.unref(COMMISSION_VALUE_TYPE_OPTIONS),
                          "value-key": "value",
                          "label-key": "label"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                if (party.value_type === "percent" || party.value_type === "both") {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Phần trăm (%)" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                          modelValue: party.percent,
                          "onUpdate:modelValue": ($event) => party.percent = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: 0,
                          max: 100,
                          step: 0.01
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UInput, {
                            modelValue: party.percent,
                            "onUpdate:modelValue": ($event) => party.percent = $event,
                            modelModifiers: { number: true },
                            type: "number",
                            min: 0,
                            max: 100,
                            step: 0.01
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (party.value_type === "fixed" || party.value_type === "both") {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tiền cứng (đ/đơn)" }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedNumberInput, {
                          modelValue: party.value_fixed,
                          "onUpdate:modelValue": ($event) => party.value_fixed = $event,
                          min: 0
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_SharedNumberInput, {
                            modelValue: party.value_fixed,
                            "onUpdate:modelValue": ($event) => party.value_fixed = $event,
                            min: 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div><div class="mt-3 text-sm font-medium"${_scopeId}>`);
              if (vueExports.unref(isTopPercentValid)) {
                _push2(`<span class="text-emerald-600"${_scopeId}> Tổng %: 100% (Platform ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(platformConfig).percent)}% + các bên ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(totalPartyPercent) - vueExports.unref(platformConfig).percent)}%) </span>`);
              } else {
                _push2(`<span class="text-red-500"${_scopeId}> Tổng %: ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(totalPartyPercent))}% — ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(totalPartyPercent) < 100 ? `thiếu ${Math.round((100 - vueExports.unref(totalPartyPercent)) * 100) / 100}%` : `dư ${Math.round((vueExports.unref(totalPartyPercent) - 100) * 100) / 100}%`)}</span>`);
              }
              _push2(`</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200" }, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2 mb-1" }, [
                    vueExports.createVNode("span", { class: "text-sm font-semibold text-slate-700" }, "1. Platform"),
                    vueExports.createVNode(_component_UBadge, {
                      label: vueExports.unref(platformConfig).source === "api" ? "Từ API" : "Mặc định",
                      color: vueExports.unref(platformConfig).source === "api" ? "primary" : "neutral",
                      size: "xs"
                    }, null, 8, ["label", "color"])
                  ]),
                  vueExports.createVNode("p", { class: "text-sm text-slate-500" }, [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(platformConfig).percent) + "% + " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(platformConfig).value_fixed)) + "/đơn ", 1),
                    vueExports.createVNode("span", { class: "text-xs text-slate-400" }, "(không chỉnh được — lấy từ platform service)")
                  ])
                ]),
                vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(partyRules), (party, idx) => {
                    return vueExports.openBlock(), vueExports.createBlock("div", {
                      key: party.party_type,
                      class: "p-3 bg-white rounded-lg border border-slate-200"
                    }, [
                      vueExports.createVNode("div", { class: "text-sm font-semibold text-slate-700 mb-2" }, vueExports.toDisplayString(idx + 2) + ". " + vueExports.toDisplayString(party.label), 1),
                      vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, [
                        vueExports.createVNode(_component_UFormField, { label: "Loại giá trị" }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_USelect, {
                              modelValue: party.value_type,
                              "onUpdate:modelValue": ($event) => party.value_type = $event,
                              items: "COMMISSION_VALUE_TYPE_OPTIONS" in _ctx ? _ctx.COMMISSION_VALUE_TYPE_OPTIONS : vueExports.unref(COMMISSION_VALUE_TYPE_OPTIONS),
                              "value-key": "value",
                              "label-key": "label"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 2
                        }, 1024),
                        party.value_type === "percent" || party.value_type === "both" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                          key: 0,
                          label: "Phần trăm (%)"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_UInput, {
                              modelValue: party.percent,
                              "onUpdate:modelValue": ($event) => party.percent = $event,
                              modelModifiers: { number: true },
                              type: "number",
                              min: 0,
                              max: 100,
                              step: 0.01
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 2
                        }, 1024)) : vueExports.createCommentVNode("", true),
                        party.value_type === "fixed" || party.value_type === "both" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                          key: 1,
                          label: "Tiền cứng (đ/đơn)"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_SharedNumberInput, {
                              modelValue: party.value_fixed,
                              "onUpdate:modelValue": ($event) => party.value_fixed = $event,
                              min: 0
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 2
                        }, 1024)) : vueExports.createCommentVNode("", true)
                      ])
                    ]);
                  }), 128))
                ]),
                vueExports.createVNode("div", { class: "mt-3 text-sm font-medium" }, [
                  vueExports.unref(isTopPercentValid) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 0,
                    class: "text-emerald-600"
                  }, " Tổng %: 100% (Platform " + vueExports.toDisplayString(vueExports.unref(platformConfig).percent) + "% + các bên " + vueExports.toDisplayString(vueExports.unref(totalPartyPercent) - vueExports.unref(platformConfig).percent) + "%) ", 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 1,
                    class: "text-red-500"
                  }, " Tổng %: " + vueExports.toDisplayString(vueExports.unref(totalPartyPercent)) + "% — " + vueExports.toDisplayString(vueExports.unref(totalPartyPercent) < 100 ? `thiếu ${Math.round((100 - vueExports.unref(totalPartyPercent)) * 100) / 100}%` : `dư ${Math.round((vueExports.unref(totalPartyPercent) - 100) * 100) / 100}%`), 1))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Phân bổ theo phòng ban" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-4 mb-4 text-sm"${_scopeId}>`);
              if (vueExports.unref(hasDeptPercent)) {
                _push2(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass(vueExports.unref(isDeptPercentSumValid) ? "text-emerald-600 font-medium" : "text-red-500 font-medium")}"${_scopeId}> Tổng %: ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(totalDeptPercent))}% ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isDeptPercentSumValid) ? "✓" : "(phải bằng 100%)")}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(hasDeptFixed)) {
                _push2(`<span class="text-slate-600"${_scopeId}> Tổng tiền cứng: ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalDeptFixed)))}/đơn </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex flex-col gap-3"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(deptRules), (dept, idx) => {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CommissionDeptRuleRow, {
                  key: dept.department_id,
                  modelValue: vueExports.unref(deptRules)[idx],
                  "onUpdate:modelValue": ($event) => vueExports.unref(deptRules)[idx] = $event,
                  "available-accounts": getAccountsForDept(dept.department_id)
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
              if (vueExports.unref(deptRules).length === 0) {
                _push2(`<div class="text-sm text-slate-400 italic"${_scopeId}> Không có phòng ban nào thuộc dự án này. </div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap gap-4 mb-4 text-sm" }, [
                  vueExports.unref(hasDeptPercent) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 0,
                    class: vueExports.unref(isDeptPercentSumValid) ? "text-emerald-600 font-medium" : "text-red-500 font-medium"
                  }, " Tổng %: " + vueExports.toDisplayString(vueExports.unref(totalDeptPercent)) + "% " + vueExports.toDisplayString(vueExports.unref(isDeptPercentSumValid) ? "✓" : "(phải bằng 100%)"), 3)) : vueExports.createCommentVNode("", true),
                  vueExports.unref(hasDeptFixed) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 1,
                    class: "text-slate-600"
                  }, " Tổng tiền cứng: " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(totalDeptFixed))) + "/đơn ", 1)) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.createVNode("div", { class: "flex flex-col gap-3" }, [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(deptRules), (dept, idx) => {
                    return vueExports.openBlock(), vueExports.createBlock(_component_CommissionDeptRuleRow, {
                      key: dept.department_id,
                      modelValue: vueExports.unref(deptRules)[idx],
                      "onUpdate:modelValue": ($event) => vueExports.unref(deptRules)[idx] = $event,
                      "available-accounts": getAccountsForDept(dept.department_id)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "available-accounts"]);
                  }), 128))
                ]),
                vueExports.unref(deptRules).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "text-sm text-slate-400 italic"
                }, " Không có phòng ban nào thuộc dự án này. ")) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_CommissionAdjusterSection, {
          "project-id": vueExports.unref(projectId),
          adjusters: vueExports.unref(configDetail).adjusters,
          onSaved: ($event) => vueExports.unref(refreshConfig)()
        }, null, _parent));
        _push(`<div class="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 flex items-center justify-end gap-3 z-10">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Hủy",
          color: "neutral",
          variant: "ghost",
          to: "/pmc/commission"
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: "Lưu cấu hình",
          icon: "i-lucide-save",
          color: "primary",
          loading: vueExports.unref(isSaving),
          onClick: handleSave
        }, null, _parent));
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/commission/[projectId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_projectId_-B9jliEtL.mjs.map
