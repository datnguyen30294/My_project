import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, aO as useHead, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, o as useApiFetch, k as _sfc_main$h, $ as $api } from './server.mjs';
import { _ as _sfc_main$6 } from './Card-ywPiICev.mjs';
import { _ as _sfc_main$7 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$4 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$5 } from './SelectMenu-DKHEMZj7.mjs';
import { _ as __nuxt_component_2$1 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$8 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$9 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_3 } from './TableActions-b69bU2gG.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as __nuxt_component_0$1 } from './BaseFormModal-CG7aCaIV.mjs';
import { _ as _sfc_main$a } from './FormField-DFdmv6Lu.mjs';
import { _ as __nuxt_component_3$1 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as __nuxt_component_4 } from './FormFieldError-cu7WK1i1.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { u as useCheckDelete } from './useCheckDelete-ka2wDn0T.mjs';
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
import './index-QmZAbLx-.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './PageError-kZWsA9dh.mjs';
import './apiError-DBrxF9au.mjs';
import './Pagination-fZq_Msxb.mjs';
import './Modal-BimZZbNl.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Alert-tTsPKADX.mjs';
import './Label-BBgw4vHh.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useProjects-D4K3VYdb.mjs';

const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ShiftStatsBar",
  __ssrInlineRender: true,
  props: {
    stats: {},
    pending: { type: Boolean, default: false }
  },
  setup(__props) {
    const items = [
      { key: "total", label: "Tổng số ca", icon: "i-lucide-clock", color: "text-primary" },
      { key: "active", label: "Đang sử dụng", icon: "i-lucide-circle-check", color: "text-emerald-600" },
      { key: "inactive", label: "Tạm ẩn", icon: "i-lucide-circle-pause", color: "text-slate-500" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$6;
      const _component_UIcon = _sfc_main$h;
      const _component_USkeleton = _sfc_main$7;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        role: "group",
        "aria-label": "Thống kê ca làm việc",
        class: "grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6"
      }, _attrs))}><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(items, (item) => {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, {
          key: item.key,
          ui: { body: "px-5 py-4" }
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-4"${_scopeId}><div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: item.icon,
                class: ["size-5", item.color]
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="min-w-0"${_scopeId}><div class="text-sm text-[var(--ui-text-muted)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</div>`);
              if (__props.pending) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "mt-1 h-7 w-10" }, null, _parent2, _scopeId));
              } else {
                _push2(`<div class="mt-1 text-2xl font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.stats?.[item.key] ?? 0)}</div>`);
              }
              _push2(`</div></div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "flex items-center gap-4" }, [
                  vueExports.createVNode("div", { class: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: item.icon,
                      class: ["size-5", item.color]
                    }, null, 8, ["name", "class"])
                  ]),
                  vueExports.createVNode("div", { class: "min-w-0" }, [
                    vueExports.createVNode("div", { class: "text-sm text-[var(--ui-text-muted)]" }, vueExports.toDisplayString(item.label), 1),
                    __props.pending ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                      key: 0,
                      class: "mt-1 h-7 w-10"
                    })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "mt-1 text-2xl font-bold text-slate-900"
                    }, vueExports.toDisplayString(__props.stats?.[item.key] ?? 0), 1))
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/shift/ShiftStatsBar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$3, { __name: "SharedShiftStatsBar" });
const SHIFT_TYPE_SUGGESTIONS = [
  "Ngày thường",
  "Cuối tuần",
  "Ngày lễ",
  "Cả tuần"
];
const WORK_GROUP_SUGGESTIONS = [
  "Làm việc",
  "Nghỉ phép",
  "Tăng ca",
  "Đào tạo",
  "Chờ việc"
];
const SHIFT_STATUS_OPTIONS = [
  { value: "active", label: "Đang sử dụng" },
  { value: "inactive", label: "Tạm ẩn" }
];
const SHIFT_STATUS_BADGE_COLOR = {
  active: "success",
  inactive: "neutral"
};
function computeWorkHours(startTime, endTime, breakHours) {
  const toSeconds = (time) => {
    const [h = "0", m = "0"] = time.split(":");
    return Number(h) * 3600 + Number(m) * 60;
  };
  const start = toSeconds(startTime);
  const end = toSeconds(endTime);
  const spanSeconds = end > start ? end - start : 24 * 3600 - start + end;
  const hours = spanSeconds / 3600 - breakHours;
  return Math.max(0, Number(hours.toFixed(2)));
}
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ShiftTable",
  __ssrInlineRender: true,
  props: {
    shifts: {}
  },
  emits: ["edit", "delete"],
  setup(__props) {
    const columns = [
      { accessorKey: "code", header: "Mã ca" },
      { accessorKey: "name", header: "Tên" },
      { id: "project", header: "Dự án" },
      { accessorKey: "type", header: "Kiểu ca" },
      { accessorKey: "work_group", header: "Nhóm xử lý" },
      { id: "time_range", header: "Khung giờ" },
      { accessorKey: "break_hours", header: "Giờ nghỉ" },
      { accessorKey: "work_hours", header: "Giờ công" },
      { accessorKey: "status", header: "Trạng thái" },
      stickyRight({ id: "actions", header: "Tác vụ" })
    ];
    const formatHours = (value) => {
      const rounded = Math.round(value * 10) / 10;
      return `${rounded.toFixed(1)} giờ`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UTable = _sfc_main$8;
      const _component_UBadge = _sfc_main$9;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedCrudTableActions = __nuxt_component_3;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, vueExports.mergeProps({
        data: __props.shifts,
        columns
      }, _attrs), {
        "code-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-semibold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "font-semibold text-slate-900" }, vueExports.toDisplayString(row.original.code), 1)
            ];
          }
        }),
        "project-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (row.original.project) {
              _push2(`<span class="text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project.name)}</span>`);
            } else {
              _push2(`<span class="text-slate-400"${_scopeId}>—</span>`);
            }
          } else {
            return [
              row.original.project ? (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 0,
                class: "text-slate-700"
              }, vueExports.toDisplayString(row.original.project.name), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                key: 1,
                class: "text-slate-400"
              }, "—"))
            ];
          }
        }),
        "type-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: "primary",
              variant: "subtle"
            }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.type)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.type), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: "primary",
                variant: "subtle"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.type), 1)
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        "work_group-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: "success",
              variant: "subtle"
            }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.work_group)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.work_group), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: "success",
                variant: "subtle"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.work_group), 1)
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        "time_range-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="inline-flex items-center gap-1.5 text-slate-700"${_scopeId}><span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.start_time)} - ${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.end_time)}</span>`);
            if (row.original.is_overnight) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-moon",
                class: "size-4 text-indigo-500",
                title: "Ca qua đêm"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "inline-flex items-center gap-1.5 text-slate-700" }, [
                vueExports.createVNode("span", null, vueExports.toDisplayString(row.original.start_time) + " - " + vueExports.toDisplayString(row.original.end_time), 1),
                row.original.is_overnight ? (vueExports.openBlock(), vueExports.createBlock(_component_UIcon, {
                  key: 0,
                  name: "i-lucide-moon",
                  class: "size-4 text-indigo-500",
                  title: "Ca qua đêm"
                })) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        "break_hours-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(formatHours(row.original.break_hours))}`);
          } else {
            return [
              vueExports.createTextVNode(vueExports.toDisplayString(formatHours(row.original.break_hours)), 1)
            ];
          }
        }),
        "work_hours-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatHours(row.original.work_hours))}</span>`);
          } else {
            return [
              vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(formatHours(row.original.work_hours)), 1)
            ];
          }
        }),
        "status-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              color: ("SHIFT_STATUS_BADGE_COLOR" in _ctx ? _ctx.SHIFT_STATUS_BADGE_COLOR : vueExports.unref(SHIFT_STATUS_BADGE_COLOR))[row.original.status.value] ?? "neutral",
              variant: "subtle"
            }, {
              default: vueExports.withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.status.label)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.status.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UBadge, {
                color: ("SHIFT_STATUS_BADGE_COLOR" in _ctx ? _ctx.SHIFT_STATUS_BADGE_COLOR : vueExports.unref(SHIFT_STATUS_BADGE_COLOR))[row.original.status.value] ?? "neutral",
                variant: "subtle"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(row.original.status.label), 1)
                ]),
                _: 2
              }, 1032, ["color"])
            ];
          }
        }),
        "actions-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableActions, {
              onEdit: ($event) => _ctx.$emit("edit", row.original),
              onDelete: ($event) => _ctx.$emit("delete", row.original)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_SharedCrudTableActions, {
                onEdit: ($event) => _ctx.$emit("edit", row.original),
                onDelete: ($event) => _ctx.$emit("delete", row.original)
              }, null, 8, ["onEdit", "onDelete"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/shift/ShiftTable.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$2, { __name: "SharedShiftTable" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ShiftFormDialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    mode: {},
    shift: { default: null },
    loading: { type: Boolean, default: false },
    apiErrors: { default: () => ({}) },
    errorMessage: { default: null }
  },
  emits: ["update:open", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formState = vueExports.reactive({
      project_id: null,
      code: "",
      name: "",
      type: "",
      work_group: "",
      start_time: "08:00",
      end_time: "17:00",
      break_hours: 0,
      status: "active",
      sort_order: 0
    });
    function resetForm() {
      formState.project_id = null;
      formState.code = "";
      formState.name = "";
      formState.type = "";
      formState.work_group = "";
      formState.start_time = "08:00";
      formState.end_time = "17:00";
      formState.break_hours = 0;
      formState.status = "active";
      formState.sort_order = 0;
    }
    function hydrateFromShift(shift) {
      formState.project_id = shift.project_id;
      formState.code = shift.code;
      formState.name = shift.name;
      formState.type = shift.type;
      formState.work_group = shift.work_group;
      formState.start_time = shift.start_time;
      formState.end_time = shift.end_time;
      formState.break_hours = shift.break_hours;
      formState.status = shift.status.value;
      formState.sort_order = shift.sort_order;
    }
    vueExports.watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        if (props.mode === "edit" && props.shift) {
          hydrateFromShift(props.shift);
        } else {
          resetForm();
        }
      }
    );
    const typeSuggestions = [...SHIFT_TYPE_SUGGESTIONS];
    const workGroupSuggestions = [...WORK_GROUP_SUGGESTIONS];
    const statusItems = SHIFT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
    vueExports.computed(
      () => computeWorkHours(formState.start_time, formState.end_time, formState.break_hours)
    );
    vueExports.computed(() => {
      const [sh = "0", sm = "0"] = formState.start_time.split(":");
      const [eh = "0", em = "0"] = formState.end_time.split(":");
      const startMin = Number(sh) * 60 + Number(sm);
      const endMin = Number(eh) * 60 + Number(em);
      return endMin <= startMin;
    });
    function handleSubmit() {
      const payload = {
        ...props.mode === "create" ? { project_id: formState.project_id } : {},
        code: formState.code.trim(),
        name: formState.name.trim(),
        type: formState.type.trim(),
        work_group: formState.work_group.trim(),
        start_time: formState.start_time,
        end_time: formState.end_time,
        break_hours: formState.break_hours,
        status: formState.status,
        sort_order: formState.sort_order
      };
      emit("submit", payload);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudBaseFormModal = __nuxt_component_0$1;
      const _component_UFormField = _sfc_main$a;
      const _component_SharedProjectSelect = __nuxt_component_3$1;
      const _component_SharedCrudFormFieldError = __nuxt_component_4;
      const _component_UInput = _sfc_main$4;
      const _component_USelectMenu = _sfc_main$5;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudBaseFormModal, vueExports.mergeProps({
        open: __props.open,
        mode: __props.mode,
        loading: __props.loading,
        "error-message": __props.errorMessage,
        titles: { create: "Thêm ca mới", edit: "Sửa ca làm việc" },
        "onUpdate:open": ($event) => emit("update:open", $event),
        onSubmit: handleSubmit
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2"${_scopeId}>`);
            if (__props.mode === "create") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Dự án",
                name: "project_id",
                required: "",
                class: "sm:col-span-2"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
                      modelValue: vueExports.unref(formState).project_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_id = $event,
                      placeholder: "Chọn dự án"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.project_id
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(formState).project_id,
                        "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_id = $event,
                        placeholder: "Chọn dự án"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode(_component_SharedCrudFormFieldError, {
                        errors: __props.apiErrors.project_id
                      }, null, 8, ["errors"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
                label: "Dự án",
                name: "project_id",
                class: "sm:col-span-2"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                      "model-value": __props.shift?.project?.name ?? "",
                      disabled: "",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UInput, {
                        "model-value": __props.shift?.project?.name ?? "",
                        disabled: "",
                        class: "w-full"
                      }, null, 8, ["model-value"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Mã ca",
              name: "code",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).code,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                    placeholder: "VD: CS1",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.code
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).code,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                      placeholder: "VD: CS1",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.code
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Tên hiển thị",
              name: "name",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).name,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                    placeholder: "VD: Ca sáng",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.name
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                      placeholder: "VD: Ca sáng",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.name
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Kiểu ca",
              name: "type",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).type,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).type = $event,
                    list: "shift-type-suggestions",
                    placeholder: "VD: Ngày thường",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(`<datalist id="shift-type-suggestions"${_scopeId2}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(typeSuggestions, (item) => {
                    _push3(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", item)}${_scopeId2}></option>`);
                  });
                  _push3(`<!--]--></datalist>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.type
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).type,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).type = $event,
                      list: "shift-type-suggestions",
                      placeholder: "VD: Ngày thường",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode("datalist", { id: "shift-type-suggestions" }, [
                      (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(typeSuggestions, (item) => {
                        return vueExports.createVNode("option", {
                          key: item,
                          value: item
                        }, null, 8, ["value"]);
                      }), 64))
                    ]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.type
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Nhóm xử lý",
              name: "work_group",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).work_group,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).work_group = $event,
                    list: "work-group-suggestions",
                    placeholder: "VD: Làm việc",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(`<datalist id="work-group-suggestions"${_scopeId2}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(workGroupSuggestions, (item) => {
                    _push3(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", item)}${_scopeId2}></option>`);
                  });
                  _push3(`<!--]--></datalist>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.work_group
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).work_group,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).work_group = $event,
                      list: "work-group-suggestions",
                      placeholder: "VD: Làm việc",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode("datalist", { id: "work-group-suggestions" }, [
                      (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(workGroupSuggestions, (item) => {
                        return vueExports.createVNode("option", {
                          key: item,
                          value: item
                        }, null, 8, ["value"]);
                      }), 64))
                    ]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.work_group
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Giờ bắt đầu",
              name: "start_time",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).start_time,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).start_time = $event,
                    type: "time",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.start_time
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).start_time,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).start_time = $event,
                      type: "time",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.start_time
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Giờ kết thúc",
              name: "end_time",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).end_time,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).end_time = $event,
                    type: "time",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.end_time
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).end_time,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).end_time = $event,
                      type: "time",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.end_time
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Giờ nghỉ",
              name: "break_hours"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).break_hours,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).break_hours = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    step: "0.5",
                    min: "0",
                    max: "24",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.break_hours
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).break_hours,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).break_hours = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      step: "0.5",
                      min: "0",
                      max: "24",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.break_hours
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Thứ tự",
              name: "sort_order"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
                    modelValue: vueExports.unref(formState).sort_order,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).sort_order = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.sort_order
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).sort_order,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).sort_order = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.sort_order
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, {
              label: "Trạng thái",
              name: "status",
              class: "sm:col-span-2",
              required: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
                    modelValue: vueExports.unref(formState).status,
                    "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                    items: vueExports.unref(statusItems),
                    "value-key": "value",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudFormFieldError, {
                    errors: __props.apiErrors.status
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).status,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                      items: vueExports.unref(statusItems),
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.status
                    }, null, 8, ["errors"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "grid grid-cols-1 gap-4 sm:grid-cols-2" }, [
                __props.mode === "create" ? (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 0,
                  label: "Dự án",
                  name: "project_id",
                  required: "",
                  class: "sm:col-span-2"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_SharedProjectSelect, {
                      modelValue: vueExports.unref(formState).project_id,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).project_id = $event,
                      placeholder: "Chọn dự án"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.project_id
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_UFormField, {
                  key: 1,
                  label: "Dự án",
                  name: "project_id",
                  class: "sm:col-span-2"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      "model-value": __props.shift?.project?.name ?? "",
                      disabled: "",
                      class: "w-full"
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                })),
                vueExports.createVNode(_component_UFormField, {
                  label: "Mã ca",
                  name: "code",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).code,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).code = $event,
                      placeholder: "VD: CS1",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.code
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Tên hiển thị",
                  name: "name",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).name,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).name = $event,
                      placeholder: "VD: Ca sáng",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.name
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Kiểu ca",
                  name: "type",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).type,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).type = $event,
                      list: "shift-type-suggestions",
                      placeholder: "VD: Ngày thường",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode("datalist", { id: "shift-type-suggestions" }, [
                      (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(typeSuggestions, (item) => {
                        return vueExports.createVNode("option", {
                          key: item,
                          value: item
                        }, null, 8, ["value"]);
                      }), 64))
                    ]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.type
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Nhóm xử lý",
                  name: "work_group",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).work_group,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).work_group = $event,
                      list: "work-group-suggestions",
                      placeholder: "VD: Làm việc",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode("datalist", { id: "work-group-suggestions" }, [
                      (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(workGroupSuggestions, (item) => {
                        return vueExports.createVNode("option", {
                          key: item,
                          value: item
                        }, null, 8, ["value"]);
                      }), 64))
                    ]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.work_group
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Giờ bắt đầu",
                  name: "start_time",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).start_time,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).start_time = $event,
                      type: "time",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.start_time
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Giờ kết thúc",
                  name: "end_time",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).end_time,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).end_time = $event,
                      type: "time",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.end_time
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Giờ nghỉ",
                  name: "break_hours"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).break_hours,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).break_hours = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      step: "0.5",
                      min: "0",
                      max: "24",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.break_hours
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Thứ tự",
                  name: "sort_order"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_UInput, {
                      modelValue: vueExports.unref(formState).sort_order,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).sort_order = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.sort_order
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_UFormField, {
                  label: "Trạng thái",
                  name: "status",
                  class: "sm:col-span-2",
                  required: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_USelectMenu, {
                      modelValue: vueExports.unref(formState).status,
                      "onUpdate:modelValue": ($event) => vueExports.unref(formState).status = $event,
                      items: vueExports.unref(statusItems),
                      "value-key": "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    vueExports.createVNode(_component_SharedCrudFormFieldError, {
                      errors: __props.apiErrors.status
                    }, null, 8, ["errors"])
                  ]),
                  _: 1
                })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/shift/ShiftFormDialog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$1, { __name: "SharedShiftFormDialog" });
function useShiftList(params = () => ({})) {
  return useApiFetch("/pmc/shifts", {
    query: params,
    watch: [params]
  });
}
function useShiftStats() {
  return useApiFetch("/pmc/shifts/stats");
}
function apiCreateShift(data) {
  return $api("/pmc/shifts", { method: "POST", body: data });
}
function apiUpdateShift(id, data) {
  return $api(`/pmc/shifts/${id}`, { method: "PUT", body: data });
}
function apiDeleteShift(id) {
  return $api(`/pmc/shifts/${id}`, { method: "DELETE" });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Quản lý ca làm việc — TNP Service" });
    const params = vueExports.reactive({
      search: void 0,
      status: void 0,
      type: void 0,
      work_group: void 0,
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value;
      page.value = 1;
    });
    const statusFilter = vueExports.ref(null);
    vueExports.watch(statusFilter, (val) => {
      params.status = val ?? void 0;
      page.value = 1;
    });
    const typeFilter = vueExports.ref(null);
    vueExports.watch(typeFilter, (val) => {
      params.type = val ?? void 0;
      page.value = 1;
    });
    const hasFilters = vueExports.computed(
      () => !!searchInput.value || !!statusFilter.value || !!typeFilter.value
    );
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      statusFilter.value = null;
      typeFilter.value = null;
      page.value = 1;
    }
    const statusFilterItems = [
      { value: null, label: "Tất cả trạng thái" },
      ...SHIFT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))
    ];
    const typeFilterItems = [
      { value: null, label: "Tất cả kiểu ca" },
      ...SHIFT_TYPE_SUGGESTIONS.map((t) => ({ value: t, label: t }))
    ];
    const { data, status, error, refresh } = useShiftList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const { data: statsData, pending: statsPending, refresh: refreshStats } = useShiftStats();
    const shifts = vueExports.computed(() => data.value?.data ?? []);
    const stats = vueExports.computed(() => statsData.value?.data ?? null);
    const crud = useCrudModals();
    const {
      showFormModal,
      formMode,
      editTarget,
      formApiErrors,
      formErrorMessage,
      openCreateModal,
      openEditModal,
      showDeleteModal,
      deleteTarget
    } = crud;
    async function refreshAll() {
      await Promise.all([refresh(), refreshStats()]);
    }
    const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refreshAll);
    function handleFormSubmit(payload) {
      submitForm(
        () => apiCreateShift(payload),
        () => apiUpdateShift(editTarget.value.id, payload),
        { create: "Thêm ca thành công", update: "Cập nhật ca thành công" }
      );
    }
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      deleteFn: apiDeleteShift,
      successMessage: "Đã xoá ca",
      errorFallback: "Không thể xoá ca này"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_SharedShiftStatsBar = __nuxt_component_2;
      const _component_UInput = _sfc_main$4;
      const _component_USelectMenu = _sfc_main$5;
      const _component_SharedCrudTableWrapper = __nuxt_component_2$1;
      const _component_SharedShiftTable = __nuxt_component_6;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_SharedShiftFormDialog = __nuxt_component_8;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Quản lý ca làm việc",
        description: "Tạo và quản lý các ca làm việc template áp dụng cho lịch việc của nhân sự."
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-plus",
              label: "Thêm ca mới",
              onClick: vueExports.unref(openCreateModal)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-plus",
                label: "Thêm ca mới",
                onClick: vueExports.unref(openCreateModal)
              }, null, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedShiftStatsBar, {
        stats: vueExports.unref(stats),
        pending: vueExports.unref(statsPending)
      }, null, _parent));
      _push(`<div class="flex flex-wrap items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo mã hoặc tên ca...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
        modelValue: vueExports.unref(statusFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(statusFilter) ? statusFilter.value = $event : null,
        items: statusFilterItems,
        "value-key": "value",
        placeholder: "Trạng thái",
        class: "w-48"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
        modelValue: vueExports.unref(typeFilter),
        "onUpdate:modelValue": ($event) => vueExports.isRef(typeFilter) ? typeFilter.value = $event : null,
        items: typeFilterItems,
        "value-key": "value",
        placeholder: "Kiểu ca",
        class: "w-48"
      }, null, _parent));
      if (vueExports.unref(hasFilters)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-x",
          label: "Xóa bộ lọc",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          onClick: clearFilters
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTableWrapper, {
        status: vueExports.unref(status),
        error: vueExports.unref(error),
        data: vueExports.unref(data),
        refresh: vueExports.unref(refresh)
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedShiftTable, {
              shifts: vueExports.unref(shifts),
              onEdit: vueExports.unref(openEditModal),
              onDelete: vueExports.unref(openDeleteModal)
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
              page: vueExports.unref(page),
              "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
              meta: vueExports.unref(data)?.meta
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm" }, [
                vueExports.createVNode(_component_SharedShiftTable, {
                  shifts: vueExports.unref(shifts),
                  onEdit: vueExports.unref(openEditModal),
                  onDelete: vueExports.unref(openDeleteModal)
                }, null, 8, ["shifts", "onEdit", "onDelete"]),
                vueExports.createVNode(_component_SharedCrudTablePagination, {
                  page: vueExports.unref(page),
                  "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
                  meta: vueExports.unref(data)?.meta
                }, null, 8, ["page", "onUpdate:page", "meta"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedShiftFormDialog, {
        open: vueExports.unref(showFormModal),
        "onUpdate:open": ($event) => vueExports.isRef(showFormModal) ? showFormModal.value = $event : null,
        mode: vueExports.unref(formMode),
        shift: vueExports.unref(editTarget),
        loading: vueExports.unref(isSubmitting),
        "api-errors": vueExports.unref(formApiErrors),
        "error-message": vueExports.unref(formErrorMessage),
        onSubmit: handleFormSubmit
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteModal),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteModal) ? showDeleteModal.value = $event : null,
        title: "Xoá ca làm việc",
        "item-name": vueExports.unref(deleteTarget) ? `${vueExports.unref(deleteTarget).code} — ${vueExports.unref(deleteTarget).name}` : "",
        "blocked-message": vueExports.unref(deleteBlockedMessage),
        loading: vueExports.unref(isDeleting),
        checking: vueExports.unref(isCheckingDelete),
        onConfirm: vueExports.unref(handleDelete)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quan-ly-cong-viec/shifts/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C7PCgqqV.mjs.map
