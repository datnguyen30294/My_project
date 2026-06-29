import { _ as _sfc_main$1 } from './Slideover-C_jHRSNJ.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports, _ as __nuxt_component_0$4, k as _sfc_main$h, l as _sfc_main$c } from './server.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$2 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$3 } from './Badge-W93D3Jpz.mjs';
import { o as ogTicketPriorityColor, a as ogTicketStatusColor } from './useOgTickets-DPRh9tlL.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "UnscheduledDetailDrawer",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    date: {},
    tickets: { default: () => [] },
    accountName: { default: null }
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  }),
  emits: ["update:open"],
  setup(__props) {
    const open = vueExports.useModel(__props, "open");
    const props = __props;
    const formattedDate = vueExports.computed(() => {
      if (!props.date) {
        return "";
      }
      const [y, m, d] = props.date.split("-");
      return `${d}/${m}/${y}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USlideover = _sfc_main$1;
      const _component_UIcon = _sfc_main$h;
      const _component_UButton = _sfc_main$c;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UAlert = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$3;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USlideover, vueExports.mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        side: "right",
        ui: { content: "max-w-md" }
      }, _attrs), {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start justify-between w-full gap-3"${_scopeId}><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-ticket",
              class: "size-4 text-primary"
            }, null, _parent2, _scopeId));
            _push2(`<h3 class="font-bold text-slate-900 text-base truncate"${_scopeId}> Không thuộc ca `);
            if (vueExports.unref(formattedDate)) {
              _push2(`<span class="font-normal text-slate-500"${_scopeId}>· ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formattedDate))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</h3></div>`);
            if (__props.accountName) {
              _push2(`<div class="mt-1 text-xs text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.accountName)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-x",
              color: "neutral",
              variant: "ghost",
              size: "sm",
              onClick: ($event) => open.value = false
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex items-start justify-between w-full gap-3" }, [
                vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-ticket",
                      class: "size-4 text-primary"
                    }),
                    vueExports.createVNode("h3", { class: "font-bold text-slate-900 text-base truncate" }, [
                      vueExports.createTextVNode(" Không thuộc ca "),
                      vueExports.unref(formattedDate) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "font-normal text-slate-500"
                      }, "· " + vueExports.toDisplayString(vueExports.unref(formattedDate)), 1)) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  __props.accountName ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "mt-1 text-xs text-slate-500"
                  }, vueExports.toDisplayString(__props.accountName), 1)) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-x",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  onClick: ($event) => open.value = false
                }, null, 8, ["onClick"])
              ])
            ];
          }
        }),
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
              title: `Ticket không thuộc ca (${__props.tickets.length})`,
              icon: "i-lucide-ticket",
              compact: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.tickets.length === 0) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                      color: "neutral",
                      variant: "subtle",
                      icon: "i-lucide-info",
                      description: "Không có ticket nào không thuộc ca trong ngày này."
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<div class="flex flex-col gap-2"${_scopeId2}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(__props.tickets, (ticket) => {
                      _push3(`<div class="rounded-lg border border-border-gray p-3"${_scopeId2}><div class="flex items-start justify-between gap-2"${_scopeId2}>`);
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
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        label: ticket.priority.label,
                        color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(ticket.priority.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                      _push3(`</div><div class="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500"${_scopeId2}><span${_scopeId2}>Trạng thái:</span>`);
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                        label: ticket.status.label,
                        color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(ticket.status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                      _push3(`</div></div>`);
                    });
                    _push3(`<!--]--></div>`);
                  }
                } else {
                  return [
                    __props.tickets.length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                      key: 0,
                      color: "neutral",
                      variant: "subtle",
                      icon: "i-lucide-info",
                      description: "Không có ticket nào không thuộc ca trong ngày này."
                    })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "flex flex-col gap-2"
                    }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.tickets, (ticket) => {
                        return vueExports.openBlock(), vueExports.createBlock("div", {
                          key: ticket.id,
                          class: "rounded-lg border border-border-gray p-3"
                        }, [
                          vueExports.createVNode("div", { class: "flex items-start justify-between gap-2" }, [
                            vueExports.createVNode(_component_NuxtLink, {
                              to: `/pmc/og-tickets/${ticket.id}`,
                              class: "font-medium text-sm text-primary hover:underline"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(" #" + vueExports.toDisplayString(ticket.id) + " · " + vueExports.toDisplayString(ticket.subject), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"]),
                            vueExports.createVNode(_component_UBadge, {
                              label: ticket.priority.label,
                              color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(ticket.priority.value),
                              variant: "subtle",
                              size: "sm"
                            }, null, 8, ["label", "color"])
                          ]),
                          vueExports.createVNode("div", { class: "mt-2 flex items-center gap-1.5 text-[11px] text-slate-500" }, [
                            vueExports.createVNode("span", null, "Trạng thái:"),
                            vueExports.createVNode(_component_UBadge, {
                              label: ticket.status.label,
                              color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(ticket.status.value),
                              variant: "subtle",
                              size: "sm"
                            }, null, 8, ["label", "color"])
                          ])
                        ]);
                      }), 128))
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_SharedSectionCard, {
                title: `Ticket không thuộc ca (${__props.tickets.length})`,
                icon: "i-lucide-ticket",
                compact: ""
              }, {
                default: vueExports.withCtx(() => [
                  __props.tickets.length === 0 ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 0,
                    color: "neutral",
                    variant: "subtle",
                    icon: "i-lucide-info",
                    description: "Không có ticket nào không thuộc ca trong ngày này."
                  })) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "flex flex-col gap-2"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.tickets, (ticket) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: ticket.id,
                        class: "rounded-lg border border-border-gray p-3"
                      }, [
                        vueExports.createVNode("div", { class: "flex items-start justify-between gap-2" }, [
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/og-tickets/${ticket.id}`,
                            class: "font-medium text-sm text-primary hover:underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(" #" + vueExports.toDisplayString(ticket.id) + " · " + vueExports.toDisplayString(ticket.subject), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"]),
                          vueExports.createVNode(_component_UBadge, {
                            label: ticket.priority.label,
                            color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(ticket.priority.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])
                        ]),
                        vueExports.createVNode("div", { class: "mt-2 flex items-center gap-1.5 text-[11px] text-slate-500" }, [
                          vueExports.createVNode("span", null, "Trạng thái:"),
                          vueExports.createVNode(_component_UBadge, {
                            label: ticket.status.label,
                            color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(ticket.status.value),
                            variant: "subtle",
                            size: "sm"
                          }, null, 8, ["label", "color"])
                        ])
                      ]);
                    }), 128))
                  ]))
                ]),
                _: 1
              }, 8, ["title"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/schedule/UnscheduledDetailDrawer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_12 = Object.assign(_sfc_main, { __name: "ScheduleUnscheduledDetailDrawer" });

export { __nuxt_component_12 as _ };
//# sourceMappingURL=UnscheduledDetailDrawer-2sLtSk2r.mjs.map
