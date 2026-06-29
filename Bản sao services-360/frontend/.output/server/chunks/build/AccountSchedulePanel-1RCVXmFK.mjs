import { _ as _sfc_main$3 } from './FormField-DFdmv6Lu.mjs';
import { b as usePersonalSchedule, _ as __nuxt_component_4, a as __nuxt_component_11, d as detectShiftConflicts, c as computeOverlapOffsets, e as __nuxt_component_0$1, f as cardConflictKey, g as __nuxt_component_1 } from './SlotDetailDrawer-LTINo05F.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$4 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$5 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_12 } from './UnscheduledDetailDrawer-2sLtSk2r.mjs';
import { c as currentYearMonth, b as formatMonthTitle } from './date-R5YK0ast.mjs';

const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PersonalDayCell",
  __ssrInlineRender: true,
  props: {
    day: {},
    cards: { default: () => [] },
    unscheduled: { default: () => [] }
  },
  emits: ["click-slot", "click-unscheduled"],
  setup(__props) {
    const props = __props;
    const hasContent = vueExports.computed(() => props.cards.length > 0 || props.unscheduled.length > 0);
    const conflictKeys = vueExports.computed(() => detectShiftConflicts(props.cards));
    const overlapOffsets = vueExports.computed(() => computeOverlapOffsets(props.cards));
    const cellClasses = vueExports.computed(() => {
      if (!props.day.isCurrentMonth) return "bg-neutral-50/50 opacity-60";
      if (conflictKeys.value.size > 0) return "ring-2 ring-rose-400 bg-rose-50/60";
      if (props.day.isToday) return "ring-2 ring-primary/60 bg-primary-50/60";
      if (props.day.isWeekend) return "bg-rose-50/40";
      return "bg-neutral-50/50";
    });
    const dayNumberClasses = vueExports.computed(() => {
      if (props.day.isToday) return "text-primary font-bold";
      if (props.day.isWeekend) return "text-rose-500";
      return "text-neutral-600";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SchedulePersonalShiftCard = __nuxt_component_0$1;
      const _component_ScheduleUnscheduledTicketList = __nuxt_component_1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: ["min-h-[110px] rounded-lg border border-neutral-100 p-2", vueExports.unref(cellClasses)]
      }, _attrs))}>`);
      if (__props.day.isCurrentMonth && __props.day.dayNumber !== null) {
        _push(`<!--[--><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(dayNumberClasses), "mb-1.5 text-right text-sm font-medium"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.day.dayNumber)}</div>`);
        if (vueExports.unref(hasContent)) {
          _push(`<div class="space-y-1.5"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(__props.cards, (card) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SchedulePersonalShiftCard, {
              key: ("cardConflictKey" in _ctx ? _ctx.cardConflictKey : vueExports.unref(cardConflictKey))(card),
              card,
              conflict: vueExports.unref(conflictKeys).has(("cardConflictKey" in _ctx ? _ctx.cardConflictKey : vueExports.unref(cardConflictKey))(card)),
              "overlap-offset-px": vueExports.unref(overlapOffsets).get(("cardConflictKey" in _ctx ? _ctx.cardConflictKey : vueExports.unref(cardConflictKey))(card)) ?? 0,
              onClick: ($event) => _ctx.$emit("click-slot", card.shift.id)
            }, null, _parent));
          });
          _push(`<!--]-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleUnscheduledTicketList, {
            tickets: __props.unscheduled,
            onClick: ($event) => _ctx.$emit("click-unscheduled")
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<p class="text-xs text-muted"> — </p>`);
        }
        _push(`<!--]-->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/schedule/PersonalDayCell.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "SchedulePersonalDayCell" });
function parseYearMonth(yearMonth) {
  const [y, m] = yearMonth.split("-").map(Number);
  return { year: y, month: m };
}
function formatISODate(year, month, day) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}
function useCalendarMonth(yearMonth, days) {
  return vueExports.computed(() => {
    const ym = vueExports.toValue(yearMonth);
    const meta = vueExports.toValue(days);
    if (!ym) return [];
    const { year, month } = parseYearMonth(ym);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const rawWeekday = firstDay.getDay();
    const leadingBlanks = (rawWeekday + 6) % 7;
    const metaByDate = new Map(meta.map((d) => [d.date, d]));
    const cells = [];
    for (let i = 0; i < leadingBlanks; i++) {
      cells.push({ date: null, dayNumber: null, weekday: i, isCurrentMonth: false, isWeekend: false, isToday: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatISODate(year, month, d);
      const dm = metaByDate.get(dateStr);
      const wd = dm?.weekday ?? new Date(year, month - 1, d).getDay();
      cells.push({
        date: dateStr,
        dayNumber: d,
        weekday: wd,
        isCurrentMonth: true,
        isWeekend: dm?.is_weekend ?? (wd === 0 || wd === 6),
        isToday: dm?.is_today ?? false
      });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ date: null, dayNumber: null, weekday: cells.length % 7, isCurrentMonth: false, isWeekend: false, isToday: false });
    }
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  });
}
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "PersonalCalendarGrid",
  __ssrInlineRender: true,
  props: {
    payload: {},
    month: {},
    monthTitle: {}
  },
  emits: ["click-slot", "click-unscheduled"],
  setup(__props) {
    const props = __props;
    const days = vueExports.computed(() => props.payload?.days ?? []);
    const dayCards = vueExports.computed(() => props.payload?.day_cards ?? {});
    const unscheduledCards = vueExports.computed(() => props.payload?.unscheduled_cards ?? {});
    const weeks = useCalendarMonth(() => props.month, days);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SchedulePersonalDayCell = __nuxt_component_0;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "rounded-xl border border-neutral-200 bg-white shadow-sm" }, _attrs))}><div class="border-b border-neutral-200 px-4 py-3 text-center font-semibold text-neutral-800">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.monthTitle)}</div><div class="overflow-x-auto p-4"><div class="min-w-[840px] grid grid-cols-7 gap-px text-center text-xs font-medium text-muted"><div class="py-2"> T2 </div><div class="py-2"> T3 </div><div class="py-2"> T4 </div><div class="py-2"> T5 </div><div class="py-2"> T6 </div><div class="py-2 text-rose-500"> T7 </div><div class="py-2 text-rose-500"> CN </div></div><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(weeks), (week, wi) => {
        _push(`<div class="min-w-[840px] grid grid-cols-7 gap-px"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(week, (cell, ci) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SchedulePersonalDayCell, {
            key: ci,
            day: cell,
            cards: cell.date ? vueExports.unref(dayCards)[cell.date] ?? [] : [],
            unscheduled: cell.date ? vueExports.unref(unscheduledCards)[cell.date] ?? [] : [],
            onClickSlot: (shiftId) => cell.date && _ctx.$emit("click-slot", { date: cell.date, shift_id: shiftId }),
            onClickUnscheduled: ($event) => cell.date && _ctx.$emit("click-unscheduled", cell.date)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/schedule/PersonalCalendarGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5$1 = Object.assign(_sfc_main$1, { __name: "SchedulePersonalCalendarGrid" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AccountSchedulePanel",
  __ssrInlineRender: true,
  props: {
    accountId: {},
    showAccountSummary: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const selectedMonth = vueExports.ref(currentYearMonth());
    const scheduleParams = vueExports.computed(() => {
      if (!props.accountId) return null;
      return {
        account_id: props.accountId,
        month: selectedMonth.value
      };
    });
    const { data, status, error, execute } = usePersonalSchedule(scheduleParams);
    vueExports.watch(scheduleParams, async (next) => {
      if (next) await execute();
    }, { immediate: true });
    const payload = vueExports.computed(() => data.value?.data ?? null);
    const monthTitle = vueExports.computed(() => formatMonthTitle(selectedMonth.value));
    const scheduleAccount = vueExports.computed(() => payload.value?.account ?? null);
    const drawerOpen = vueExports.ref(false);
    const drawerParams = vueExports.ref(null);
    function openSlotDrawer(params) {
      if (!props.accountId) return;
      drawerParams.value = {
        account_id: props.accountId,
        date: params.date,
        shift_id: params.shift_id
      };
      drawerOpen.value = true;
    }
    const unscheduledDrawerOpen = vueExports.ref(false);
    const unscheduledDate = vueExports.ref(null);
    const unscheduledTickets = vueExports.computed(
      () => unscheduledDate.value ? payload.value?.unscheduled_cards?.[unscheduledDate.value] ?? [] : []
    );
    function openUnscheduledDrawer(date) {
      unscheduledDate.value = date;
      unscheduledDrawerOpen.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UFormField = _sfc_main$3;
      const _component_ScheduleMonthPicker = __nuxt_component_4;
      const _component_UIcon = _sfc_main$h;
      const _component_UAlert = _sfc_main$4;
      const _component_USkeleton = _sfc_main$5;
      const _component_SchedulePersonalCalendarGrid = __nuxt_component_5$1;
      const _component_ScheduleSlotDetailDrawer = __nuxt_component_11;
      const _component_ScheduleUnscheduledDetailDrawer = __nuxt_component_12;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "space-y-4" }, _attrs))}>`);
      if (__props.showAccountSummary && vueExports.unref(scheduleAccount)) {
        _push(`<div class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4"><div class="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(scheduleAccount).name.charAt(0).toUpperCase())}</div><div class="flex-1 min-w-0"><div class="font-medium text-default">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(scheduleAccount).name)}</div><div class="text-sm text-muted"> Mã NV: <span class="font-mono">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(scheduleAccount).employee_code || "—")}</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Tháng" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleMonthPicker, {
              modelValue: vueExports.unref(selectedMonth),
              "onUpdate:modelValue": ($event) => vueExports.isRef(selectedMonth) ? selectedMonth.value = $event : null
            }, null, _parent2, _scopeId));
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
      }, _parent));
      _push(`<div class="sm:ml-auto sm:mb-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600"><span class="inline-flex items-center gap-1.5"><span class="inline-block size-3 rounded-sm border border-sky-300 bg-sky-50"></span> Ca sáng </span><span class="inline-flex items-center gap-1.5"><span class="inline-block size-3 rounded-sm border border-amber-300 bg-amber-50"></span> Ca chiều </span><span class="inline-flex items-center gap-1.5"><span class="inline-block size-3 rounded-sm border border-violet-300 bg-violet-50"></span> Ca tối </span><span class="inline-flex items-center gap-1"><span class="inline-flex items-center gap-0.5 rounded bg-white border border-slate-200 px-1 py-[1px] text-[9px] font-bold tracking-wide">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-building-2",
        class: "size-2.5"
      }, null, _parent));
      _push(` HR </span> đã đăng ký </span><span class="inline-flex items-center gap-1.5"><span class="inline-block size-3 rounded-sm border border-rose-400 bg-rose-50 ring-1 ring-rose-300"></span><span class="text-rose-600 font-medium">Chồng chéo thời gian</span></span></div></div>`);
      if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "subtle",
          title: "Không tải được lịch",
          description: vueExports.unref(error).message
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="rounded-xl border border-neutral-200 bg-white p-4"><div class="grid grid-cols-7 gap-1 min-w-[840px]"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(35, (n) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, {
            key: n,
            class: "h-[110px] w-full"
          }, null, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SchedulePersonalCalendarGrid, {
          payload: vueExports.unref(payload),
          month: vueExports.unref(selectedMonth),
          "month-title": vueExports.unref(monthTitle),
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
        date: vueExports.unref(unscheduledDate),
        tickets: vueExports.unref(unscheduledTickets),
        "account-name": vueExports.unref(scheduleAccount)?.name ?? null
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/account/AccountSchedulePanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "SharedAccountSchedulePanel" });

export { __nuxt_component_5 as _ };
//# sourceMappingURL=AccountSchedulePanel-1RCVXmFK.mjs.map
