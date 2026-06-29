import { d as detectShiftConflicts, e as __nuxt_component_0, f as cardConflictKey, g as __nuxt_component_1, c as computeOverlapOffsets } from './SlotDetailDrawer-LTINo05F.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, $ as $api } from './server.mjs';
import { W as WEEKDAY_LABELS_VI } from './date-R5YK0ast.mjs';
import { _ as _sfc_main$2 } from './SelectMenu-DKHEMZj7.mjs';
import { _ as __nuxt_component_1$1 } from './CapabilityRatingBadge-BBWBj9qN.mjs';
import { a as useEntityMultiSelect } from './useEntitySelect-DG9pQ_n0.mjs';
import { d as useAccountList } from './useAccounts-BDWM8ZpB.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TeamMatrixTable",
  __ssrInlineRender: true,
  props: {
    payload: {},
    onlyConflicts: { type: Boolean, default: false }
  },
  emits: ["click-slot", "click-unscheduled"],
  setup(__props) {
    const props = __props;
    const days = vueExports.computed(() => props.payload?.days ?? []);
    const allAccounts = vueExports.computed(() => props.payload?.accounts ?? []);
    const dayCardsByAccount = vueExports.computed(() => props.payload?.day_cards_by_account ?? {});
    const unscheduledByAccount = vueExports.computed(() => props.payload?.unscheduled_cards_by_account ?? {});
    const accountsWithConflict = vueExports.computed(() => {
      const result = /* @__PURE__ */ new Set();
      for (const account of allAccounts.value) {
        const byDate = dayCardsByAccount.value[account.id];
        if (!byDate) continue;
        for (const date of Object.keys(byDate)) {
          if (detectShiftConflicts(byDate[date] ?? []).size > 0) {
            result.add(account.id);
            break;
          }
        }
      }
      return result;
    });
    const accounts = vueExports.computed(() => {
      if (!props.onlyConflicts) return allAccounts.value;
      return allAccounts.value.filter((a) => accountsWithConflict.value.has(a.id));
    });
    function dayHeaderLabel(date) {
      const d = new Date(date);
      return String(d.getDate()).padStart(2, "0");
    }
    function dayHeaderWeekday(weekday) {
      return WEEKDAY_LABELS_VI[weekday] ?? "";
    }
    function cardsFor(accountId, date) {
      return dayCardsByAccount.value[accountId]?.[date] ?? [];
    }
    function unscheduledFor(accountId, date) {
      return unscheduledByAccount.value[accountId]?.[date] ?? [];
    }
    function conflictsFor(accountId, date) {
      return detectShiftConflicts(cardsFor(accountId, date));
    }
    function overlapOffsetsFor(accountId, date) {
      return computeOverlapOffsets(cardsFor(accountId, date));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SchedulePersonalShiftCard = __nuxt_component_0;
      const _component_ScheduleUnscheduledTicketList = __nuxt_component_1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "overflow-auto rounded-xl border border-neutral-200 bg-white shadow-sm max-h-[calc(100vh-260px)]" }, _attrs))}><table class="border-collapse text-xs w-max"><thead><tr class="bg-neutral-50"><th class="sticky top-0 left-0 z-30 border-b border-r border-neutral-200 bg-neutral-50 px-3 py-2 text-left text-[12px] font-semibold text-neutral-700 min-w-[180px]"> Nhân viên </th><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(days), (day) => {
        _push(`<th class="${serverRenderer_cjs_prodExports.ssrRenderClass([[
          day.is_weekend ? "bg-rose-50/60 text-rose-500" : "bg-neutral-50 text-neutral-700",
          day.is_today ? "bg-primary/10 text-primary" : ""
        ], "sticky top-0 z-20 border-b border-r border-neutral-200 px-2 py-1 text-center font-semibold min-w-[220px]"])}"><div class="leading-tight"><div class="text-[13px]">${serverRenderer_cjs_prodExports.ssrInterpolate(dayHeaderLabel(day.date))}</div><div class="text-[10px] font-normal">${serverRenderer_cjs_prodExports.ssrInterpolate(dayHeaderWeekday(day.weekday))}</div></div></th>`);
      });
      _push(`<!--]--></tr></thead><tbody><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(accounts), (account) => {
        _push(`<tr class="hover:bg-neutral-50/50"><td class="sticky left-0 z-10 border-b border-r border-neutral-200 bg-white px-3 py-2 min-w-[180px]"><div class="font-medium text-neutral-900 text-[13px]">${serverRenderer_cjs_prodExports.ssrInterpolate(account.name)}</div><div class="font-mono text-[11px] text-neutral-500">${serverRenderer_cjs_prodExports.ssrInterpolate(account.employee_code)}</div></td><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(days), (day) => {
          _push(`<td class="${serverRenderer_cjs_prodExports.ssrRenderClass([day.is_weekend ? "bg-rose-50/30" : "", "border-b border-r border-neutral-200 align-top p-1.5 min-w-[220px]"])}"><div class="flex flex-col gap-1.5"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(cardsFor(account.id, day.date), (card) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SchedulePersonalShiftCard, {
              key: ("cardConflictKey" in _ctx ? _ctx.cardConflictKey : vueExports.unref(cardConflictKey))(card),
              card,
              conflict: conflictsFor(account.id, day.date).has(("cardConflictKey" in _ctx ? _ctx.cardConflictKey : vueExports.unref(cardConflictKey))(card)),
              "overlap-offset-px": overlapOffsetsFor(account.id, day.date).get(("cardConflictKey" in _ctx ? _ctx.cardConflictKey : vueExports.unref(cardConflictKey))(card)) ?? 0,
              onClick: ($event) => _ctx.$emit("click-slot", { account_id: account.id, date: day.date, shift_id: card.shift.id })
            }, null, _parent));
          });
          _push(`<!--]-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ScheduleUnscheduledTicketList, {
            tickets: unscheduledFor(account.id, day.date),
            onClick: ($event) => _ctx.$emit("click-unscheduled", { account_id: account.id, date: day.date })
          }, null, _parent));
          _push(`</div></td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]-->`);
      if (vueExports.unref(accounts).length === 0) {
        _push(`<tr><td${serverRenderer_cjs_prodExports.ssrRenderAttr("colspan", vueExports.unref(days).length + 1)} class="px-4 py-6 text-center text-neutral-400">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.onlyConflicts ? "Không có nhân sự nào bị chồng chéo lịch trong tháng." : "Không có nhân viên nào khớp tiêu chí.")}</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/schedule/TeamMatrixTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main$1, { __name: "ScheduleTeamMatrixTable" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AccountMultiSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: () => [] },
    placeholder: { default: "Chọn nhân viên" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { selectedItems, items, loading, onSearchTerm } = useEntityMultiSelect(
      () => props.modelValue,
      (val) => emit("update:modelValue", val),
      {
        fetchList: useAccountList,
        resolveItem: async (id) => {
          const r = await $api(`/pmc/accounts/${id}`);
          return { id: r.data.id, label: r.data.name };
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$2;
      const _component_SharedCapabilityRatingBadge = __nuxt_component_1$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, vueExports.mergeProps({
        modelValue: vueExports.unref(selectedItems),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedItems) ? selectedItems.value = $event : null,
        multiple: "",
        items: vueExports.unref(items),
        loading: vueExports.unref(loading),
        "ignore-filter": true,
        "search-input": { placeholder: "Tìm nhân viên..." },
        placeholder: __props.placeholder,
        class: "w-full",
        "onUpdate:searchTerm": vueExports.unref(onSearchTerm)
      }, _attrs), {
        "item-label": vueExports.withCtx(({ item }, _push2, _parent2, _scopeId) => {
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/account/AccountMultiSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "SharedAccountMultiSelect" });

export { __nuxt_component_10 as _, __nuxt_component_5 as a };
//# sourceMappingURL=AccountMultiSelect-C48Ujkod.mjs.map
