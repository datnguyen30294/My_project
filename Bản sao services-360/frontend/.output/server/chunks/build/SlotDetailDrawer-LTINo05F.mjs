import { v as vueExports, o as useApiFetch, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4, x as _export_sfc } from './server.mjs';
import { b as formatMonthTitle, d as formatShortDateTime } from './date-R5YK0ast.mjs';
import { _ as _sfc_main$7 } from './Badge-W93D3Jpz.mjs';
import { o as ogTicketPriorityColor } from './useOgTickets-DPRh9tlL.mjs';
import { _ as _sfc_main$4 } from './Slideover-C_jHRSNJ.mjs';
import { _ as _sfc_main$5 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as _sfc_main$6 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_4$1 } from './SectionCard-CH-mG9Mf.mjs';

const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ScheduleMonthPicker",
  __ssrInlineRender: true,
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const value = vueExports.computed({
      get: () => props.modelValue,
      set: (v) => emit("update:modelValue", v)
    });
    const label = vueExports.computed(() => formatMonthTitle(value.value));
    function shiftMonth(delta) {
      const [y, m] = value.value.split("-").map(Number);
      const next = new Date(y, m - 1 + delta, 1);
      const yy = next.getFullYear();
      const mm = String(next.getMonth() + 1).padStart(2, "0");
      value.value = `${yy}-${mm}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "inline-flex items-center gap-1 rounded-md border border-border-gray bg-white" }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-chevron-left",
        variant: "ghost",
        color: "neutral",
        size: "sm",
        "aria-label": "Tháng trước",
        onClick: ($event) => shiftMonth(-1)
      }, null, _parent));
      _push(`<label class="relative cursor-pointer px-2 py-1 text-sm font-medium text-slate-700 select-none">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(label))} <input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(value))} type="month" class="absolute inset-0 opacity-0 cursor-pointer"></label>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-chevron-right",
        variant: "ghost",
        color: "neutral",
        size: "sm",
        "aria-label": "Tháng sau",
        onClick: ($event) => shiftMonth(1)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/schedule/ScheduleMonthPicker.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$3, { __name: "ScheduleMonthPicker" });
function useScheduleColors() {
  function shiftColor(code) {
    if (code === "SANG") return "primary";
    if (code === "CHIEU") return "warning";
    return "neutral";
  }
  function shiftShortLabel(code) {
    if (code === "SANG") return "S";
    if (code === "CHIEU") return "C";
    if (code === "TOI") return "T";
    return code.slice(0, 1);
  }
  return {
    shiftColor,
    shiftShortLabel,
    indicatorExternal: "text-blue-600 dark:text-blue-400",
    indicatorTicket: "text-orange-600 dark:text-orange-400"
  };
}
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PersonalShiftCard",
  __ssrInlineRender: true,
  props: {
    card: {},
    conflict: { type: Boolean, default: false },
    overlapOffsetPx: { default: 0 }
  },
  emits: ["click"],
  setup(__props) {
    const props = __props;
    const overlapStyle = vueExports.computed(() => {
      if (!props.conflict || props.overlapOffsetPx <= 0) return void 0;
      return {
        marginTop: `-${props.overlapOffsetPx}px`
      };
    });
    const { shiftColor } = useScheduleColors();
    const timeRange = vueExports.computed(() => {
      const s = props.card.shift.start_time?.slice(0, 5) ?? "";
      const e = props.card.shift.end_time?.slice(0, 5) ?? "";
      if (!s || !e) return "—";
      if (props.card.shift.is_overnight) return `${s} – ${e} · qua đêm`;
      return `${s} – ${e}`;
    });
    const cardClasses = vueExports.computed(() => {
      if (props.conflict) {
        return "border-rose-400 bg-rose-50 text-rose-900 hover:bg-rose-100 hover:border-rose-500 ring-1 ring-rose-300";
      }
      const color = shiftColor(props.card.shift.code);
      if (color === "primary") {
        return "border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 hover:border-sky-400";
      }
      if (color === "warning") {
        return "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:border-amber-400";
      }
      return "border-violet-300 bg-violet-50 text-violet-900 hover:bg-violet-100 hover:border-violet-400";
    });
    const ticketCount = vueExports.computed(() => props.card.ticket_count);
    const hasHr = vueExports.computed(() => props.card.has_workschedule);
    const projectName = vueExports.computed(() => props.card.project?.name ?? "");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      _push(`<button${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        type: "button",
        class: ["shift-card relative block w-full rounded border px-2 py-1.5 text-left text-xs transition-all cursor-pointer hover:shadow-xl hover:ring-2 hover:ring-rose-500 hover:brightness-105", [vueExports.unref(cardClasses), __props.conflict && __props.overlapOffsetPx > 0 ? "shadow-md" : ""]],
        style: vueExports.unref(overlapStyle)
      }, _attrs))} data-v-48bac780>`);
      if (vueExports.unref(hasHr)) {
        _push(`<span class="absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 rounded bg-white/70 px-1 py-[1px] text-[9px] font-bold tracking-wide" title="Đã đăng ký từ HR" data-v-48bac780>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-building-2",
          class: "size-2.5"
        }, null, _parent));
        _push(` HR </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="font-semibold leading-tight pr-8" data-v-48bac780>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.card.shift.name)}</div><div class="mt-0.5 font-mono text-[10px] opacity-75" data-v-48bac780>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(timeRange))}</div>`);
      if (__props.conflict) {
        _push(`<div class="mt-0.5 flex items-center gap-1 rounded bg-rose-100 px-1 py-[1px] text-[10px] font-semibold text-rose-700" title="Ca này bị chồng chéo thời gian với ca khác trong cùng ngày" data-v-48bac780>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-triangle-alert",
          class: "size-3"
        }, null, _parent));
        _push(` Chồng chéo thời gian </div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(projectName)) {
        _push(`<div class="mt-0.5 flex items-start gap-1 text-[11px] leading-snug" data-v-48bac780>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-briefcase",
          class: "mt-px size-3 shrink-0 opacity-70"
        }, null, _parent));
        _push(`<span class="line-clamp-2" data-v-48bac780>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(projectName))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!vueExports.unref(hasHr)) {
        _push(`<div class="mt-0.5 text-[10px] italic opacity-70" data-v-48bac780> Chỉ có ticket (chưa đăng ký HR) </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-1 text-[10px] leading-snug opacity-80" data-v-48bac780> Số ticket xử lý: <span class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(ticketCount) > 0 ? "underline underline-offset-2" : "", "ml-0.5 font-semibold tabular-nums"])}" data-v-48bac780>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticketCount))}</span></div></button>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/schedule/PersonalShiftCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-48bac780"]]), { __name: "SchedulePersonalShiftCard" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "UnscheduledTicketList",
  __ssrInlineRender: true,
  props: {
    tickets: { default: () => [] }
  },
  emits: ["click"],
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$h;
      const _component_UBadge = _sfc_main$7;
      if (props.tickets.length) {
        _push(`<button${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
          type: "button",
          class: "w-full rounded border border-dashed border-neutral-300 bg-neutral-50/80 px-1.5 py-1 text-left transition-all cursor-pointer hover:border-neutral-400 hover:bg-neutral-100 hover:shadow-sm"
        }, _attrs))}><div class="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-neutral-500">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-ticket",
          class: "size-3"
        }, null, _parent));
        _push(` Không thuộc ca </div><div class="flex flex-col gap-1"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(props.tickets, (ticket) => {
          _push(`<div class="flex items-center justify-between gap-1"><span class="line-clamp-1 flex-1 text-[11px] text-neutral-700">${serverRenderer_cjs_prodExports.ssrInterpolate(ticket.subject)}</span>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(ticket.priority.value),
            variant: "subtle",
            size: "sm"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(ticket.priority.label)}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(ticket.priority.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div></button>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/schedule/UnscheduledTicketList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "ScheduleUnscheduledTicketList" });
function cardConflictKey(card) {
  return `${card.shift.id}-${card.project?.id ?? "np"}`;
}
function toMinutes(time) {
  const [h = "0", m = "0"] = time.split(":");
  return Number(h) * 60 + Number(m);
}
function toInterval(card) {
  const start = toMinutes(card.shift.start_time);
  let end = toMinutes(card.shift.end_time);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  if (card.shift.is_overnight || end <= start) {
    end += 24 * 60;
  }
  return { key: cardConflictKey(card), start, end };
}
function detectShiftConflicts(cards) {
  const conflicted = /* @__PURE__ */ new Set();
  if (cards.length < 2) return conflicted;
  const intervals = cards.map(toInterval).filter((i) => i !== null);
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const a = intervals[i];
      const b = intervals[j];
      if (a.start < b.end && b.start < a.end) {
        conflicted.add(a.key);
        conflicted.add(b.key);
      }
    }
  }
  return conflicted;
}
const OVERLAP_MAX_PX = 64;
const OVERLAP_PEEK_PX = 14;
function computeOverlapOffsets(cards) {
  const offsets = /* @__PURE__ */ new Map();
  if (cards.length < 2) return offsets;
  const intervals = cards.map(toInterval);
  for (let i = 1; i < cards.length; i++) {
    const current = intervals[i];
    if (!current) continue;
    let maxRatio = 0;
    for (let j = 0; j < i; j++) {
      const prev = intervals[j];
      if (!prev) continue;
      const overlap = Math.min(current.end, prev.end) - Math.max(current.start, prev.start);
      if (overlap <= 0) continue;
      const refDuration = Math.min(current.end - current.start, prev.end - prev.start);
      if (refDuration <= 0) continue;
      const ratio = Math.min(1, overlap / refDuration);
      if (ratio > maxRatio) maxRatio = ratio;
    }
    if (maxRatio > 0) {
      const px = Math.min(maxRatio * OVERLAP_MAX_PX, OVERLAP_MAX_PX - OVERLAP_PEEK_PX);
      offsets.set(cardConflictKey(cards[i]), Math.round(px));
    }
  }
  return offsets;
}
function usePersonalSchedule(params, opts = {}) {
  return useApiFetch("/pmc/schedule-slots/personal", {
    query: vueExports.computed(() => vueExports.toValue(params) ?? {}),
    watch: [() => vueExports.toValue(params)],
    immediate: opts.immediate ?? false
  });
}
function useTeamSchedule(params) {
  const requestUrl = vueExports.computed(() => {
    const p = vueExports.toValue(params);
    const qs = new URLSearchParams();
    qs.set("month", p.month);
    if (p.project_id != null) qs.set("project_id", String(p.project_id));
    if (p.account_ids?.length) {
      for (const id of p.account_ids) qs.append("account_ids[]", String(id));
    }
    if (p.strict_project) qs.set("strict_project", "1");
    return `/pmc/schedule-slots/team?${qs.toString()}`;
  });
  return useApiFetch(requestUrl, {
    watch: [requestUrl]
  });
}
function useSlotDetail(params) {
  return useApiFetch("/pmc/schedule-slots/detail", {
    query: vueExports.computed(() => vueExports.toValue(params) ?? {}),
    watch: [() => vueExports.toValue(params)],
    immediate: false
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SlotDetailDrawer",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    params: {}
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const openModel = vueExports.computed({
      get: () => props.open,
      set: (v) => emit("update:open", v)
    });
    const paramsRef = vueExports.computed(() => props.params);
    const { data, status, error, execute } = useSlotDetail(paramsRef);
    vueExports.watch(paramsRef, async (next) => {
      if (next) await execute();
    });
    const detail = vueExports.computed(() => data.value?.data ?? null);
    const shiftTitle = vueExports.computed(() => {
      const d = detail.value;
      if (!d) return "";
      return d.shift.name;
    });
    const formattedDate = vueExports.computed(() => {
      const d = detail.value;
      if (!d) return "";
      const [y, m, day] = d.date.split("-");
      return `${day}/${m}/${y}`;
    });
    const shiftWindow = vueExports.computed(() => {
      const d = detail.value;
      if (!d) return "";
      return `${d.shift_window.start} – ${d.shift_window.end}`;
    });
    function statusColor(value) {
      const v = value.toUpperCase();
      if (v.includes("COMPLETED") || v === "DONE" || v === "RESOLVED") return "success";
      if (v.includes("CANCEL")) return "error";
      if (v.includes("PENDING") || v.includes("WAITING")) return "warning";
      if (v.includes("PROGRESS") || v.includes("DOING")) return "info";
      return "neutral";
    }
    function priorityColor(value) {
      const v = value.toUpperCase();
      if (v.includes("URGENT") || v.includes("CRITICAL")) return "error";
      if (v.includes("HIGH")) return "warning";
      if (v.includes("LOW")) return "neutral";
      return "info";
    }
    function formatAssignedAt(iso) {
      return formatShortDateTime(iso);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USlideover = _sfc_main$4;
      const _component_UIcon = _sfc_main$h;
      const _component_UButton = _sfc_main$c;
      const _component_USkeleton = _sfc_main$5;
      const _component_UAlert = _sfc_main$6;
      const _component_SharedSectionCard = __nuxt_component_4$1;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$7;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USlideover, vueExports.mergeProps({
        open: vueExports.unref(openModel),
        "onUpdate:open": ($event) => vueExports.isRef(openModel) ? openModel.value = $event : null,
        side: "right",
        ui: { content: "max-w-lg" }
      }, _attrs), {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start justify-between w-full gap-3"${_scopeId}><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-calendar-clock",
              class: "size-4 text-primary"
            }, null, _parent2, _scopeId));
            _push2(`<h3 class="font-bold text-slate-900 text-base truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(shiftTitle) || "Chi tiết ca")} `);
            if (vueExports.unref(formattedDate)) {
              _push2(`<span class="font-normal text-slate-500"${_scopeId}>· ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formattedDate))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</h3></div>`);
            if (vueExports.unref(detail)) {
              _push2(`<div class="mt-1 text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(detail).account.name)} (${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(detail).account.employee_code)}) · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(shiftWindow))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-x",
              color: "neutral",
              variant: "ghost",
              size: "sm",
              onClick: ($event) => openModel.value = false
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-start justify-between w-full gap-3" }, [
                vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-calendar-clock",
                      class: "size-4 text-primary"
                    }),
                    vueExports.createVNode("h3", { class: "font-bold text-slate-900 text-base truncate" }, [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(shiftTitle) || "Chi tiết ca") + " ", 1),
                      vueExports.unref(formattedDate) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "font-normal text-slate-500"
                      }, "· " + vueExports.toDisplayString(vueExports.unref(formattedDate)), 1)) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  vueExports.unref(detail) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "mt-1 text-xs text-slate-500"
                  }, vueExports.toDisplayString(vueExports.unref(detail).account.name) + " (" + vueExports.toDisplayString(vueExports.unref(detail).account.employee_code) + ") · " + vueExports.toDisplayString(vueExports.unref(shiftWindow)), 1)) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-x",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  onClick: ($event) => openModel.value = false
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(status) === "pending") {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-24 w-full" }, null, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-24 w-full" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (vueExports.unref(error)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "subtle",
                title: "Không tải được chi tiết ca",
                description: vueExports.unref(error).message
              }, null, _parent2, _scopeId));
            } else if (vueExports.unref(detail)) {
              _push2(`<div class="space-y-5"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: "Lịch làm việc (HR)",
                icon: "i-lucide-building-2",
                compact: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(detail).external.length === 0) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                        color: "neutral",
                        variant: "subtle",
                        icon: "i-lucide-info",
                        description: "Không có lịch từ HR cho ca này."
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<div class="flex flex-col gap-2"${_scopeId2}><!--[-->`);
                      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(detail).external, (item) => {
                        _push3(`<div class="rounded-lg border border-border-gray p-3"${_scopeId2}><div class="flex items-center gap-2"${_scopeId2}>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-briefcase",
                          class: "size-4 text-slate-500"
                        }, null, _parent3, _scopeId2));
                        _push3(`<span class="font-medium text-slate-900 text-sm"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.project.name)} `);
                        if (item.project.code) {
                          _push3(`<span class="font-mono text-xs text-slate-500"${_scopeId2}>· ${serverRenderer_cjs_prodExports.ssrInterpolate(item.project.code)}</span>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</span></div>`);
                        if (item.note) {
                          _push3(`<p class="mt-1.5 text-xs text-slate-600 whitespace-pre-line"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.note)}</p>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        if (item.external_ref) {
                          _push3(`<p class="mt-1 font-mono text-[11px] text-slate-400"${_scopeId2}> Ref: ${serverRenderer_cjs_prodExports.ssrInterpolate(item.external_ref)}</p>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div>`);
                      });
                      _push3(`<!--]--></div>`);
                    }
                  } else {
                    return [
                      vueExports.unref(detail).external.length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                        key: 0,
                        color: "neutral",
                        variant: "subtle",
                        icon: "i-lucide-info",
                        description: "Không có lịch từ HR cho ca này."
                      })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 1,
                        class: "flex flex-col gap-2"
                      }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(detail).external, (item) => {
                          return vueExports.openBlock(), vueExports.createBlock("div", {
                            key: item.id,
                            class: "rounded-lg border border-border-gray p-3"
                          }, [
                            vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                              vueExports.createVNode(_component_UIcon, {
                                name: "i-lucide-briefcase",
                                class: "size-4 text-slate-500"
                              }),
                              vueExports.createVNode("span", { class: "font-medium text-slate-900 text-sm" }, [
                                vueExports.createTextVNode(vueExports.toDisplayString(item.project.name) + " ", 1),
                                item.project.code ? (vueExports.openBlock(), vueExports.createBlock("span", {
                                  key: 0,
                                  class: "font-mono text-xs text-slate-500"
                                }, "· " + vueExports.toDisplayString(item.project.code), 1)) : vueExports.createCommentVNode("", true)
                              ])
                            ]),
                            item.note ? (vueExports.openBlock(), vueExports.createBlock("p", {
                              key: 0,
                              class: "mt-1.5 text-xs text-slate-600 whitespace-pre-line"
                            }, vueExports.toDisplayString(item.note), 1)) : vueExports.createCommentVNode("", true),
                            item.external_ref ? (vueExports.openBlock(), vueExports.createBlock("p", {
                              key: 1,
                              class: "mt-1 font-mono text-[11px] text-slate-400"
                            }, " Ref: " + vueExports.toDisplayString(item.external_ref), 1)) : vueExports.createCommentVNode("", true)
                          ]);
                        }), 128))
                      ]))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
                title: `Ticket đang xử lý (${vueExports.unref(detail).tickets.length})`,
                icon: "i-lucide-ticket",
                compact: ""
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(detail).tickets.length === 0) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                        color: "neutral",
                        variant: "subtle",
                        icon: "i-lucide-info",
                        description: "Không có ticket nào trong ca này."
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<div class="flex flex-col gap-2"${_scopeId2}><!--[-->`);
                      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(detail).tickets, (ticket) => {
                        _push3(`<div class="rounded-lg border border-border-gray p-3"${_scopeId2}><div class="flex items-start justify-between gap-2"${_scopeId2}><div class="flex-1 min-w-0"${_scopeId2}>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                          to: `/pmc/og-tickets/${ticket.id}`,
                          class: "font-medium text-sm text-primary hover:underline"
                        }, {
                          default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(` #${serverRenderer_cjs_prodExports.ssrInterpolate(ticket.id)} · ${serverRenderer_cjs_prodExports.ssrInterpolate(ticket.subject)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(" #" + vueExports.toDisplayString(ticket.id) + " · " + vueExports.toDisplayString(ticket.subject), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`<div class="mt-1 text-xs text-slate-500"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(ticket.project.name)}</div></div>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: ticket.priority.label,
                          color: priorityColor(ticket.priority.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                        _push3(`</div><div class="mt-2 grid grid-cols-1 gap-1 text-[11px] text-slate-500"${_scopeId2}><div${_scopeId2}>Giao lúc: <span class="text-slate-700"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatAssignedAt(ticket.assigned_at))}</span></div><div class="flex items-center gap-1.5"${_scopeId2}><span${_scopeId2}>Trạng thái lúc đó:</span>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: ticket.status_at_slot.label,
                          color: statusColor(ticket.status_at_slot.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                        _push3(`</div><div class="flex items-center gap-1.5"${_scopeId2}><span${_scopeId2}>Hiện tại:</span>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                          label: ticket.status_now.label,
                          color: statusColor(ticket.status_now.value),
                          variant: "subtle",
                          size: "sm"
                        }, null, _parent3, _scopeId2));
                        if (ticket.is_status_changed) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                            name: "i-lucide-triangle-alert",
                            class: "size-3.5 text-amber-500"
                          }, null, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div></div>`);
                        if (ticket.is_status_changed) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                            class: "mt-2",
                            color: "warning",
                            variant: "subtle",
                            size: "sm",
                            icon: "i-lucide-triangle-alert",
                            description: "Trạng thái đã thay đổi sau ca."
                          }, null, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div>`);
                      });
                      _push3(`<!--]--></div>`);
                    }
                  } else {
                    return [
                      vueExports.unref(detail).tickets.length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                        key: 0,
                        color: "neutral",
                        variant: "subtle",
                        icon: "i-lucide-info",
                        description: "Không có ticket nào trong ca này."
                      })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 1,
                        class: "flex flex-col gap-2"
                      }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(detail).tickets, (ticket) => {
                          return vueExports.openBlock(), vueExports.createBlock("div", {
                            key: ticket.id,
                            class: "rounded-lg border border-border-gray p-3"
                          }, [
                            vueExports.createVNode("div", { class: "flex items-start justify-between gap-2" }, [
                              vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                                vueExports.createVNode(_component_NuxtLink, {
                                  to: `/pmc/og-tickets/${ticket.id}`,
                                  class: "font-medium text-sm text-primary hover:underline"
                                }, {
                                  default: vueExports.withCtx(() => [
                                    vueExports.createTextVNode(" #" + vueExports.toDisplayString(ticket.id) + " · " + vueExports.toDisplayString(ticket.subject), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["to"]),
                                vueExports.createVNode("div", { class: "mt-1 text-xs text-slate-500" }, vueExports.toDisplayString(ticket.project.name), 1)
                              ]),
                              vueExports.createVNode(_component_UBadge, {
                                label: ticket.priority.label,
                                color: priorityColor(ticket.priority.value),
                                variant: "subtle",
                                size: "sm"
                              }, null, 8, ["label", "color"])
                            ]),
                            vueExports.createVNode("div", { class: "mt-2 grid grid-cols-1 gap-1 text-[11px] text-slate-500" }, [
                              vueExports.createVNode("div", null, [
                                vueExports.createTextVNode("Giao lúc: "),
                                vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(formatAssignedAt(ticket.assigned_at)), 1)
                              ]),
                              vueExports.createVNode("div", { class: "flex items-center gap-1.5" }, [
                                vueExports.createVNode("span", null, "Trạng thái lúc đó:"),
                                vueExports.createVNode(_component_UBadge, {
                                  label: ticket.status_at_slot.label,
                                  color: statusColor(ticket.status_at_slot.value),
                                  variant: "subtle",
                                  size: "sm"
                                }, null, 8, ["label", "color"])
                              ]),
                              vueExports.createVNode("div", { class: "flex items-center gap-1.5" }, [
                                vueExports.createVNode("span", null, "Hiện tại:"),
                                vueExports.createVNode(_component_UBadge, {
                                  label: ticket.status_now.label,
                                  color: statusColor(ticket.status_now.value),
                                  variant: "subtle",
                                  size: "sm"
                                }, null, 8, ["label", "color"]),
                                ticket.is_status_changed ? (vueExports.openBlock(), vueExports.createBlock(_component_UIcon, {
                                  key: 0,
                                  name: "i-lucide-triangle-alert",
                                  class: "size-3.5 text-amber-500"
                                })) : vueExports.createCommentVNode("", true)
                              ])
                            ]),
                            ticket.is_status_changed ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                              key: 0,
                              class: "mt-2",
                              color: "warning",
                              variant: "subtle",
                              size: "sm",
                              icon: "i-lucide-triangle-alert",
                              description: "Trạng thái đã thay đổi sau ca."
                            })) : vueExports.createCommentVNode("", true)
                          ]);
                        }), 128))
                      ]))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.unref(status) === "pending" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                vueExports.createVNode(_component_USkeleton, { class: "h-24 w-full" }),
                vueExports.createVNode(_component_USkeleton, { class: "h-24 w-full" })
              ])) : vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 1,
                color: "error",
                variant: "subtle",
                title: "Không tải được chi tiết ca",
                description: vueExports.unref(error).message
              }, null, 8, ["description"])) : vueExports.unref(detail) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 2,
                class: "space-y-5"
              }, [
                vueExports.createVNode(_component_SharedSectionCard, {
                  title: "Lịch làm việc (HR)",
                  icon: "i-lucide-building-2",
                  compact: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.unref(detail).external.length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                      key: 0,
                      color: "neutral",
                      variant: "subtle",
                      icon: "i-lucide-info",
                      description: "Không có lịch từ HR cho ca này."
                    })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "flex flex-col gap-2"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(detail).external, (item) => {
                        return vueExports.openBlock(), vueExports.createBlock("div", {
                          key: item.id,
                          class: "rounded-lg border border-border-gray p-3"
                        }, [
                          vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                            vueExports.createVNode(_component_UIcon, {
                              name: "i-lucide-briefcase",
                              class: "size-4 text-slate-500"
                            }),
                            vueExports.createVNode("span", { class: "font-medium text-slate-900 text-sm" }, [
                              vueExports.createTextVNode(vueExports.toDisplayString(item.project.name) + " ", 1),
                              item.project.code ? (vueExports.openBlock(), vueExports.createBlock("span", {
                                key: 0,
                                class: "font-mono text-xs text-slate-500"
                              }, "· " + vueExports.toDisplayString(item.project.code), 1)) : vueExports.createCommentVNode("", true)
                            ])
                          ]),
                          item.note ? (vueExports.openBlock(), vueExports.createBlock("p", {
                            key: 0,
                            class: "mt-1.5 text-xs text-slate-600 whitespace-pre-line"
                          }, vueExports.toDisplayString(item.note), 1)) : vueExports.createCommentVNode("", true),
                          item.external_ref ? (vueExports.openBlock(), vueExports.createBlock("p", {
                            key: 1,
                            class: "mt-1 font-mono text-[11px] text-slate-400"
                          }, " Ref: " + vueExports.toDisplayString(item.external_ref), 1)) : vueExports.createCommentVNode("", true)
                        ]);
                      }), 128))
                    ]))
                  ]),
                  _: 1
                }),
                vueExports.createVNode(_component_SharedSectionCard, {
                  title: `Ticket đang xử lý (${vueExports.unref(detail).tickets.length})`,
                  icon: "i-lucide-ticket",
                  compact: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.unref(detail).tickets.length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                      key: 0,
                      color: "neutral",
                      variant: "subtle",
                      icon: "i-lucide-info",
                      description: "Không có ticket nào trong ca này."
                    })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "flex flex-col gap-2"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(detail).tickets, (ticket) => {
                        return vueExports.openBlock(), vueExports.createBlock("div", {
                          key: ticket.id,
                          class: "rounded-lg border border-border-gray p-3"
                        }, [
                          vueExports.createVNode("div", { class: "flex items-start justify-between gap-2" }, [
                            vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                              vueExports.createVNode(_component_NuxtLink, {
                                to: `/pmc/og-tickets/${ticket.id}`,
                                class: "font-medium text-sm text-primary hover:underline"
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.createTextVNode(" #" + vueExports.toDisplayString(ticket.id) + " · " + vueExports.toDisplayString(ticket.subject), 1)
                                ]),
                                _: 2
                              }, 1032, ["to"]),
                              vueExports.createVNode("div", { class: "mt-1 text-xs text-slate-500" }, vueExports.toDisplayString(ticket.project.name), 1)
                            ]),
                            vueExports.createVNode(_component_UBadge, {
                              label: ticket.priority.label,
                              color: priorityColor(ticket.priority.value),
                              variant: "subtle",
                              size: "sm"
                            }, null, 8, ["label", "color"])
                          ]),
                          vueExports.createVNode("div", { class: "mt-2 grid grid-cols-1 gap-1 text-[11px] text-slate-500" }, [
                            vueExports.createVNode("div", null, [
                              vueExports.createTextVNode("Giao lúc: "),
                              vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(formatAssignedAt(ticket.assigned_at)), 1)
                            ]),
                            vueExports.createVNode("div", { class: "flex items-center gap-1.5" }, [
                              vueExports.createVNode("span", null, "Trạng thái lúc đó:"),
                              vueExports.createVNode(_component_UBadge, {
                                label: ticket.status_at_slot.label,
                                color: statusColor(ticket.status_at_slot.value),
                                variant: "subtle",
                                size: "sm"
                              }, null, 8, ["label", "color"])
                            ]),
                            vueExports.createVNode("div", { class: "flex items-center gap-1.5" }, [
                              vueExports.createVNode("span", null, "Hiện tại:"),
                              vueExports.createVNode(_component_UBadge, {
                                label: ticket.status_now.label,
                                color: statusColor(ticket.status_now.value),
                                variant: "subtle",
                                size: "sm"
                              }, null, 8, ["label", "color"]),
                              ticket.is_status_changed ? (vueExports.openBlock(), vueExports.createBlock(_component_UIcon, {
                                key: 0,
                                name: "i-lucide-triangle-alert",
                                class: "size-3.5 text-amber-500"
                              })) : vueExports.createCommentVNode("", true)
                            ])
                          ]),
                          ticket.is_status_changed ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                            key: 0,
                            class: "mt-2",
                            color: "warning",
                            variant: "subtle",
                            size: "sm",
                            icon: "i-lucide-triangle-alert",
                            description: "Trạng thái đã thay đổi sau ca."
                          })) : vueExports.createCommentVNode("", true)
                        ]);
                      }), 128))
                    ]))
                  ]),
                  _: 1
                }, 8, ["title"])
              ])) : vueExports.createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/schedule/SlotDetailDrawer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main, { __name: "ScheduleSlotDetailDrawer" });

export { __nuxt_component_4 as _, __nuxt_component_11 as a, usePersonalSchedule as b, computeOverlapOffsets as c, detectShiftConflicts as d, __nuxt_component_0 as e, cardConflictKey as f, __nuxt_component_1 as g, useTeamSchedule as u };
//# sourceMappingURL=SlotDetailDrawer-LTINo05F.mjs.map
