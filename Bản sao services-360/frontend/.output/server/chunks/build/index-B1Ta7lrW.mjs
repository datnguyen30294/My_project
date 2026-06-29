import { v as vueExports, p as useRoute$1, I as useRequestURL, u as useSeoMeta, j as useToast, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, _ as __nuxt_component_0$4, w as __nuxt_component_5$2, r as _sfc_main$d, q as navigateTo } from './server.mjs';
import { _ as _sfc_main$5 } from './Badge-W93D3Jpz.mjs';
import { _ as _sfc_main$6 } from './DropdownMenu-67h96A8X.mjs';
import { _ as __nuxt_component_2$1 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_16, a as _sfc_main$1$1 } from './OrderAcceptanceReportModal-BlOKlq6u.mjs';
import { _ as _sfc_main$a } from './Separator-DeO-OPIs.mjs';
import { _ as _sfc_main$e } from './SelectMenu-DKHEMZj7.mjs';
import { _ as __nuxt_component_1 } from './CapabilityRatingBadge-BBWBj9qN.mjs';
import { _ as _sfc_main$7 } from './Alert-tTsPKADX.mjs';
import { f as formatDateTime, u as utcToLocal, l as localToUtc, g as formatDuration, d as formatShortDateTime } from './date-R5YK0ast.mjs';
import { i as useQuoteVersions, q as quoteStatusColor, j as apiGetQuoteVersions, k as isQuoteRejected } from './useQuotes-C1-4FXSr.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { o as orderStatusColor, b as apiCreateOrder } from './useOrders-Da-CMLMo.mjs';
import { b as useOgTicketDetail, d as useOgTicketAudits, a as ogTicketStatusColor, o as ogTicketPriorityColor, e as apiCheckDeleteOgTicket, c as apiUpdateOgTicket, f as apiTransitionOgTicket, g as apiReleaseOgTicket, h as OG_TICKET_WORKFLOW_STEPS, i as ogTicketStatusToStepIndex, j as apiDeleteOgTicket } from './useOgTickets-DPRh9tlL.mjs';
import { _ as __nuxt_component_5$1 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as __nuxt_component_7$1 } from './RichTextEditor-CeP76v4Q.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
import { d as useOgTicketSurvey, S as SURVEY_MAX_FILES, a as SURVEY_ALLOWED_MIMES, e as apiDeleteOgTicketSurveyAttachment, f as apiUpsertOgTicketSurvey, g as SURVEY_MAX_FILE_BYTES } from './useOgTicketSurvey-DrNJ8Z2q.mjs';
import { i as isImageMime, f as formatFileSize } from './file-DEnEYJZ3.mjs';
import { _ as __nuxt_component_7 } from './RatingDisplay-BKbNjbBW.mjs';
import { _ as __nuxt_component_2$2 } from './QrCode-B1G5K_8N.mjs';
import { _ as _sfc_main$8 } from './Modal-BimZZbNl.mjs';
import { _ as _sfc_main$b } from './FormField-DFdmv6Lu.mjs';
import { _ as _sfc_main$9 } from './Textarea-DTCNHwKm.mjs';
import { _ as __nuxt_component_11 } from './DeleteModal-B4AevDGU.mjs';
import { _ as __nuxt_component_21 } from './OgTicketCategoryModal-vqxLvQYn.mjs';
import { f as formatPhone } from './phone-DErPjpTB.mjs';
import { A as AUDIT_EVENT_COLORS, a as AUDIT_EVENT_LABELS, g as getAuditChangedFields } from './audit-BekS3Wny.mjs';
import { Z as Zl } from './vue-datepicker-6F5-CyxW.mjs';
import { d as useAccountList } from './useAccounts-BDWM8ZpB.mjs';
import { S as SELECT_ALL_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useCrudModals } from './useCrudModals-BUUQWYeI.mjs';
import { u as useCrudSubmit } from './useCrudSubmit-gMGxLTGY.mjs';
import { u as useCheckDelete } from './useCheckDelete-ka2wDn0T.mjs';
import { u as useAcceptanceReport } from './useAcceptanceReports-lSZWdtC6.mjs';
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
import './index-Bkkr_xbW.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './utils-DY0Zag2O.mjs';
import './useDirection-CXYby7CP.mjs';
import './useArrowNavigation-m9a1sGcE.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './RovingFocusGroup-Vsbo7D6E.mjs';
import './utils-BgcT7rQQ.mjs';
import './useGraceArea-B6BTYtpN.mjs';
import './index-QmZAbLx-.mjs';
import './Kbd-T8yC2vfh.mjs';
import './Input-JXN8po_F.mjs';
import './Separator-DtmsHEyk.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import '@tiptap/vue-3';
import '@tiptap/starter-kit';
import '@tiptap/extension-underline';
import '@tiptap/extension-text-align';
import '@tiptap/extension-link';
import '@tiptap/extension-image';
import '@tiptap/extension-placeholder';
import '@tiptap/extension-table';
import '@tiptap/extension-table-row';
import '@tiptap/extension-table-header';
import '@tiptap/extension-table-cell';
import './DialogTrigger-C3iwCYMu.mjs';
import './DialogClose-DGkUxau7.mjs';
import './Label-BBgw4vHh.mjs';
import './Checkbox-Cp_FPUkd.mjs';
import './RovingFocusItem-DwKRAYZk.mjs';

const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StepPopoverContent",
  __ssrInlineRender: true,
  props: {
    step: {},
    stepData: {},
    currentStatus: {},
    canTransition: { type: Boolean },
    isBacktrack: { type: Boolean },
    ogTicketId: {},
    activeQuoteId: {},
    needsAssignment: { type: Boolean },
    accountOptions: {},
    currentAssigneeIds: {},
    hasActiveOrder: { type: Boolean },
    isTerminal: { type: Boolean }
  },
  emits: ["transition", "assign", "create-order"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const reversedVisits = vueExports.computed(
      () => [...props.stepData?.visits ?? []].reverse()
    );
    const emit = __emit;
    function sameIds(a, b) {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort((x, y) => x - y);
      const sortedB = [...b].sort((x, y) => x - y);
      return sortedA.every((v, i) => v === sortedB[i]);
    }
    function onAssigneesChange(ids) {
      if (ids.length === 0) return;
      if (sameIds(ids, props.currentAssigneeIds)) return;
      emit("assign", ids);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$5;
      const _component_UIcon = _sfc_main$h;
      const _component_USeparator = _sfc_main$a;
      const _component_USelectMenu = _sfc_main$e;
      const _component_SharedCapabilityRatingBadge = __nuxt_component_1;
      const _component_UAlert = _sfc_main$7;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "w-72 p-3" }, _attrs))}><div class="flex items-center justify-between mb-2"><span class="font-semibold text-sm text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.step.title)}</span>`);
      if (__props.stepData && __props.stepData.totalVisits > 0) {
        _push(`<span class="text-xs text-slate-500">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.stepData.totalVisits)} lần</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (!__props.stepData || __props.stepData.totalVisits === 0) {
        _push(`<!--[--><p class="text-xs text-slate-400 italic"> Chưa tới giai đoạn này </p>`);
        if (__props.step.value === "quoted" && !__props.activeQuoteId && !__props.isTerminal) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: `/pmc/quotes/create?og_ticket_id=${__props.ogTicketId}`
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Tạo báo giá",
                  icon: "i-lucide-file-plus",
                  color: "primary",
                  size: "sm",
                  block: "",
                  class: "mt-2"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_UButton, {
                    label: "Tạo báo giá",
                    icon: "i-lucide-file-plus",
                    color: "primary",
                    size: "sm",
                    block: "",
                    class: "mt-2"
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (__props.step.value === "quoted" && __props.activeQuoteId) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: `/pmc/quotes/${__props.activeQuoteId}`
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  label: "Xem báo giá hiện tại",
                  icon: "i-lucide-external-link",
                  color: "primary",
                  variant: "soft",
                  size: "sm",
                  block: "",
                  class: "mt-2"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_UButton, {
                    label: "Xem báo giá hiện tại",
                    icon: "i-lucide-external-link",
                    color: "primary",
                    variant: "soft",
                    size: "sm",
                    block: "",
                    class: "mt-2"
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (__props.step.value === "ordered" && !__props.hasActiveOrder) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Tạo đơn hàng",
            icon: "i-lucide-shopping-cart",
            color: "primary",
            size: "sm",
            block: "",
            class: "mt-2",
            onClick: ($event) => emit("create-order", "")
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<div class="flex flex-col gap-3"><div><div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5"> Vòng đời </div><div class="max-h-36 overflow-y-auto flex flex-col gap-1.5"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(reversedVisits), (visit, vi) => {
          _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([visit.isActive ? "border-primary-200 bg-primary-50/50" : "border-slate-200 bg-slate-50/50 opacity-50", "rounded-lg border p-2 text-xs transition-opacity"])}"><div class="flex items-center justify-between mb-1"><span class="font-medium text-slate-700">Lần ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(reversedVisits).length - vi)}</span>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            label: visit.isActive ? "Đang diễn ra" : "Đã qua",
            color: visit.isActive ? "primary" : "neutral",
            variant: "subtle",
            size: "xs"
          }, null, _parent));
          _push(`</div><div class="flex flex-col gap-0.5 text-slate-600"><div class="flex items-center gap-1.5">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-clock",
            class: "size-3 text-slate-400 shrink-0"
          }, null, _parent));
          _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatShortDateTime" in _ctx ? _ctx.formatShortDateTime : vueExports.unref(formatShortDateTime))(visit.segment.started_at))} → ${serverRenderer_cjs_prodExports.ssrInterpolate(visit.isActive ? "đang mở" : ("formatShortDateTime" in _ctx ? _ctx.formatShortDateTime : vueExports.unref(formatShortDateTime))(visit.segment.ended_at))}</span></div><div class="flex items-center gap-1.5">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-timer",
            class: "size-3 text-slate-400 shrink-0"
          }, null, _parent));
          _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(visit.durationLabel)}</span></div>`);
          if (visit.segment.assignee) {
            _push(`<div class="flex items-center gap-1.5">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-user",
              class: "size-3 text-slate-400 shrink-0"
            }, null, _parent));
            _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(visit.segment.assignee.name)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (visit.segment.note) {
            _push(`<div class="flex items-start gap-1.5 mt-0.5">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-message-square",
              class: "size-3 text-slate-400 shrink-0 mt-0.5"
            }, null, _parent));
            _push(`<span class="text-slate-500 italic">${serverRenderer_cjs_prodExports.ssrInterpolate(visit.segment.note)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div>`);
        if (__props.stepData.quotes && __props.stepData.quotes.length > 0 && (__props.step.value === "quoted" || __props.step.value === "approved")) {
          _push(`<!--[-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, null, null, _parent));
          _push(`<div><div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5"> Lịch sử báo giá </div><div class="max-h-36 overflow-y-auto flex flex-col gap-1.5"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(__props.stepData.quotes, (quote) => {
            _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([quote.is_active ? "" : "opacity-50", "rounded-lg border border-slate-200 p-2 text-xs transition-opacity"])}"><div class="flex items-center justify-between">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: `/pmc/quotes/${quote.id}`,
              class: "font-mono font-semibold text-primary-600 hover:underline"
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(quote.code)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(quote.code), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              label: quote.status.label,
              color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(quote.status.value),
              variant: "subtle",
              size: "xs"
            }, null, _parent));
            _push(`</div><div class="flex items-center justify-between mt-1"><span class="text-slate-600">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(quote.total_amount))}</span>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              label: quote.is_active ? "Còn hiệu lực" : "Hết hiệu lực",
              color: quote.is_active ? "success" : "neutral",
              variant: "subtle",
              size: "xs"
            }, null, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (__props.step.value === "quoted") {
          _push(`<div class="flex flex-col gap-1.5 mt-2">`);
          if (__props.activeQuoteId) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: `/pmc/quotes/${__props.activeQuoteId}`
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: "Xem báo giá hiện tại",
                    icon: "i-lucide-external-link",
                    color: "primary",
                    variant: "soft",
                    size: "xs",
                    block: ""
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    vueExports.createVNode(_component_UButton, {
                      label: "Xem báo giá hiện tại",
                      icon: "i-lucide-external-link",
                      color: "primary",
                      variant: "soft",
                      size: "xs",
                      block: ""
                    })
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          if (!__props.isTerminal) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: `/pmc/quotes/create?og_ticket_id=${__props.ogTicketId}`
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: __props.activeQuoteId ? "Tạo báo giá mới" : "Tạo báo giá",
                    icon: "i-lucide-file-plus",
                    color: __props.activeQuoteId ? "warning" : "primary",
                    variant: __props.activeQuoteId ? "soft" : "solid",
                    size: "xs",
                    block: ""
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    vueExports.createVNode(_component_UButton, {
                      label: __props.activeQuoteId ? "Tạo báo giá mới" : "Tạo báo giá",
                      icon: "i-lucide-file-plus",
                      color: __props.activeQuoteId ? "warning" : "primary",
                      variant: __props.activeQuoteId ? "soft" : "solid",
                      size: "xs",
                      block: ""
                    }, null, 8, ["label", "color", "variant"])
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
        if (__props.stepData.orders && __props.stepData.orders.length > 0 && __props.step.value === "ordered") {
          _push(`<!--[-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, null, null, _parent));
          _push(`<div><div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5"> Lịch sử đơn hàng </div><div class="max-h-36 overflow-y-auto flex flex-col gap-1.5"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(__props.stepData.orders, (order) => {
            _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([order.status.value === "cancelled" ? "opacity-50" : "", "rounded-lg border border-slate-200 p-2 text-xs transition-opacity"])}"><div class="flex items-center justify-between"><span class="font-mono font-semibold text-slate-700">${serverRenderer_cjs_prodExports.ssrInterpolate(order.code)}</span>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              label: order.status.label,
              color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(order.status.value),
              variant: "subtle",
              size: "xs"
            }, null, _parent));
            _push(`</div>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: `/pmc/orders/${order.id}`,
              class: "text-primary-500 hover:text-primary-600 text-[11px] mt-1 inline-flex items-center gap-0.5"
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Xem chi tiết `);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-external-link",
                    class: "size-3"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    vueExports.createTextVNode(" Xem chi tiết "),
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-external-link",
                      class: "size-3"
                    })
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          });
          _push(`<!--]--></div></div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (__props.step.value === "ordered" && !__props.hasActiveOrder) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Tạo đơn hàng",
            icon: "i-lucide-shopping-cart",
            color: "primary",
            size: "xs",
            block: "",
            class: "mt-2",
            onClick: ($event) => emit("create-order", "")
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      if (__props.needsAssignment) {
        _push(`<div class="mt-3 pt-3 border-t border-slate-200"><p class="text-xs font-medium text-slate-700 mb-1.5"> Chọn người thi công </p>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelectMenu, {
          "model-value": __props.currentAssigneeIds,
          items: __props.accountOptions,
          "value-key": "value",
          multiple: "",
          placeholder: "Chọn người thi công...",
          class: "w-full",
          size: "sm",
          "onUpdate:modelValue": onAssigneesChange
        }, {
          "item-trailing": vueExports.withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.capability_rating != null) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCapabilityRatingBadge, {
                  rating: item.capability_rating,
                  size: "xs"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                item.capability_rating != null ? (vueExports.openBlock(), vueExports.createBlock(_component_SharedCapabilityRatingBadge, {
                  key: 0,
                  rating: item.capability_rating,
                  size: "xs"
                }, null, 8, ["rating"])) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.canTransition) {
        _push(`<div class="mt-3 pt-3 border-t border-slate-200">`);
        if (__props.isBacktrack && __props.step.value !== "quoted") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            icon: "i-lucide-alert-triangle",
            color: "warning",
            variant: "subtle",
            description: "Báo giá và đơn hàng hiện tại sẽ bị huỷ.",
            class: "mb-2"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
          label: __props.isBacktrack ? `Quay lại ${__props.step.title}` : `Chuyển sang ${__props.step.title}`,
          icon: __props.isBacktrack ? "i-lucide-undo-2" : "i-lucide-arrow-right",
          color: __props.isBacktrack ? "warning" : "primary",
          size: "sm",
          block: "",
          onClick: ($event) => emit("transition")
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/og-ticket/StepPopoverContent.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$4, { __name: "SharedOgTicketStepPopoverContent" });
function useOgTicketLifecycle(segments, quoteVersions) {
  const stepDataMap = vueExports.computed(() => {
    const map = /* @__PURE__ */ new Map();
    const segs = segments.value;
    for (const seg of segs) {
      const status = seg.status.value;
      if (!map.has(status)) {
        map.set(status, { visits: [], totalVisits: 0, latestVisit: null });
      }
      const now = Date.now();
      const startMs = new Date(seg.started_at).getTime();
      const endMs = seg.ended_at ? new Date(seg.ended_at).getTime() : now;
      const durationMs = endMs - startMs;
      const visit = {
        segment: seg,
        cycle: seg.cycle,
        isActive: seg.ended_at === null,
        durationMs,
        durationLabel: formatDuration(durationMs)
      };
      const step = map.get(status);
      step.visits.push(visit);
      step.totalVisits = step.visits.length;
      step.latestVisit = visit;
    }
    const quotedStep = map.get("quoted");
    if (quotedStep) {
      quotedStep.quotes = quoteVersions.value;
    }
    const approvedStep = map.get("approved");
    if (approvedStep) {
      approvedStep.quotes = quoteVersions.value;
    }
    const orderedStep = map.get("ordered");
    if (orderedStep) {
      const orders = [];
      for (const q of quoteVersions.value) {
        if (q.order) {
          orders.push({
            id: q.order.id,
            code: q.order.code,
            status: q.order.status
          });
        }
      }
      orderedStep.orders = orders;
    }
    return map;
  });
  function getStepVisits(status) {
    return stepDataMap.value.get(status)?.visits ?? [];
  }
  function getStepData(status) {
    return stepDataMap.value.get(status);
  }
  const backtracks = vueExports.computed(() => {
    const result = [];
    const segs = segments.value;
    for (let i = 1; i < segs.length; i++) {
      const prev = segs[i - 1];
      const curr = segs[i];
      if (curr.cycle > prev.cycle && curr.cycle_confirmed) {
        const fromIdx = OG_TICKET_WORKFLOW_STEPS.findIndex((s) => s.value === prev.status.value);
        const toIdx = OG_TICKET_WORKFLOW_STEPS.findIndex((s) => s.value === curr.status.value);
        if (fromIdx >= 0 && toIdx >= 0) {
          result.push({ from: fromIdx, to: toIdx, cycle: curr.cycle });
        }
      }
    }
    return result;
  });
  return { stepDataMap, getStepVisits, getStepData, backtracks };
}
const LANE_H = 28;
const LANE_PAD = 8;
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "LifecycleStepper",
  __ssrInlineRender: true,
  props: {
    ogTicketId: {},
    currentStatus: {},
    segments: {},
    quoteVersions: {},
    activeQuoteId: {},
    activeQuoteStatus: {},
    activeOrderStatus: {},
    hasActiveOrder: { type: Boolean },
    accountOptions: {},
    currentAssigneeIds: {},
    currentAssignees: {},
    isTerminal: { type: Boolean }
  },
  emits: ["transition", "assign", "create-order"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const segmentsRef = vueExports.computed(() => props.segments);
    const versionsRef = vueExports.computed(() => props.quoteVersions);
    const { stepDataMap, backtracks } = useOgTicketLifecycle(segmentsRef, versionsRef);
    const STEPS = OG_TICKET_WORKFLOW_STEPS.length;
    const SVG_W = STEPS * 100;
    function stepCenterX(stepIdx) {
      return (stepIdx + 0.5) / STEPS * SVG_W;
    }
    const svgHeight = vueExports.computed(() => LANE_PAD + backtracks.value.length * LANE_H + LANE_PAD);
    function backtrackPath(bt, lane) {
      const x1 = stepCenterX(bt.from);
      const x2 = stepCenterX(bt.to);
      const yTop = LANE_PAD;
      const yBot = yTop + (lane + 1) * LANE_H;
      return `M ${x1} ${yTop} L ${x1} ${yBot} L ${x2} ${yBot} L ${x2} ${yTop}`;
    }
    const activePopover = vueExports.ref(null);
    function formatStepTime(dateStr) {
      const d = new Date(dateStr);
      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    function togglePopover(stepValue) {
      activePopover.value = activePopover.value === stepValue ? null : stepValue;
    }
    function getInitials(name) {
      return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    }
    const assignees = vueExports.computed(() => props.currentAssignees ?? []);
    function getStepColor(step, index) {
      const status = props.currentStatus;
      const stepValue = step.value;
      if (status === "cancelled") return "default";
      if (stepValue === "quoted" && props.activeQuoteStatus && isQuoteRejected(props.activeQuoteStatus)) return "error";
      if (stepValue === "ordered" && props.activeOrderStatus === "cancelled") return "error";
      if (stepValue === "approved" && status === "rejected") return "error";
      const currentIdx = ogTicketStatusToStepIndex(status);
      if (stepValue === status || status === "rejected" && stepValue === "approved") return "active";
      if (index < currentIdx) return "completed";
      return "default";
    }
    function needsAssignment(stepValue) {
      if (props.isTerminal || stepValue !== "assigned") return false;
      return true;
    }
    function canTransitionTo(stepValue) {
      if (props.isTerminal) return false;
      if (needsAssignment(stepValue)) return false;
      const currentIdx = ogTicketStatusToStepIndex(props.currentStatus);
      const targetIdx = OG_TICKET_WORKFLOW_STEPS.findIndex((s) => s.value === stepValue);
      if (targetIdx < 0 || targetIdx === currentIdx) return false;
      if (targetIdx > currentIdx) {
        return props.currentStatus === "assigned" && stepValue === "surveying";
      }
      return stepValue === "surveying" && targetIdx < currentIdx;
    }
    function isBacktrack(stepValue) {
      const currentIdx = ogTicketStatusToStepIndex(props.currentStatus);
      const targetIdx = OG_TICKET_WORKFLOW_STEPS.findIndex((s) => s.value === stepValue);
      return targetIdx < currentIdx;
    }
    function handleTransition(stepValue) {
      activePopover.value = null;
      emit("transition", stepValue);
    }
    const colorClasses = {
      completed: {
        indicator: "bg-green-500 text-white border-green-500",
        separator: "bg-green-500"
      },
      active: {
        indicator: "bg-green-500 text-white border-green-500 ring-2 ring-green-200 shadow-sm",
        separator: "bg-green-500"
      },
      error: {
        indicator: "bg-red-500 text-white border-red-500",
        separator: "bg-red-300"
      },
      default: {
        indicator: "bg-white text-slate-400 border-slate-300",
        separator: "bg-slate-200"
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UPopover = _sfc_main$1$1;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedOgTicketStepPopoverContent = __nuxt_component_2;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "overflow-x-auto overflow-y-visible -mx-1 px-1 py-2" }, _attrs))}><div class="flex items-start min-w-[600px]"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList("OG_TICKET_WORKFLOW_STEPS" in _ctx ? _ctx.OG_TICKET_WORKFLOW_STEPS : vueExports.unref(OG_TICKET_WORKFLOW_STEPS), (step, index) => {
        _push(`<div class="flex flex-col items-center flex-1 relative"><div class="flex items-center w-full">`);
        if (index > 0) {
          _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([colorClasses[getStepColor(step, index)].separator, "h-0.5 flex-1 transition-colors"])}"></div>`);
        } else {
          _push(`<div class="flex-1"></div>`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UPopover, {
          open: vueExports.unref(activePopover) === step.value,
          content: { side: "bottom", align: "center" },
          "onUpdate:open": (v) => {
            if (!v) activePopover.value = null;
          }
        }, {
          content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOgTicketStepPopoverContent, {
                step,
                "step-data": vueExports.unref(stepDataMap).get(step.value),
                "current-status": __props.currentStatus,
                "can-transition": canTransitionTo(step.value),
                "is-backtrack": isBacktrack(step.value),
                "og-ticket-id": __props.ogTicketId,
                "active-quote-id": __props.activeQuoteId ?? null,
                "needs-assignment": needsAssignment(step.value),
                "account-options": __props.accountOptions ?? [],
                "current-assignee-ids": __props.currentAssigneeIds ?? [],
                "has-active-order": __props.hasActiveOrder ?? false,
                "is-terminal": __props.isTerminal ?? false,
                onTransition: ($event) => handleTransition(step.value),
                onAssign: (ids) => emit("assign", ids),
                onCreateOrder: (note) => emit("create-order", note)
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedOgTicketStepPopoverContent, {
                  step,
                  "step-data": vueExports.unref(stepDataMap).get(step.value),
                  "current-status": __props.currentStatus,
                  "can-transition": canTransitionTo(step.value),
                  "is-backtrack": isBacktrack(step.value),
                  "og-ticket-id": __props.ogTicketId,
                  "active-quote-id": __props.activeQuoteId ?? null,
                  "needs-assignment": needsAssignment(step.value),
                  "account-options": __props.accountOptions ?? [],
                  "current-assignee-ids": __props.currentAssigneeIds ?? [],
                  "has-active-order": __props.hasActiveOrder ?? false,
                  "is-terminal": __props.isTerminal ?? false,
                  onTransition: ($event) => handleTransition(step.value),
                  onAssign: (ids) => emit("assign", ids),
                  onCreateOrder: (note) => emit("create-order", note)
                }, null, 8, ["step", "step-data", "current-status", "can-transition", "is-backtrack", "og-ticket-id", "active-quote-id", "needs-assignment", "account-options", "current-assignee-ids", "has-active-order", "is-terminal", "onTransition", "onAssign", "onCreateOrder"])
              ];
            }
          }),
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([colorClasses[getStepColor(step, index)].indicator, "relative size-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer hover:scale-110"])}"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: step.icon,
                class: "size-4"
              }, null, _parent2, _scopeId));
              if ((vueExports.unref(stepDataMap).get(step.value)?.totalVisits ?? 0) > 1) {
                _push2(`<span class="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(stepDataMap).get(step.value).totalVisits)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</button>`);
            } else {
              return [
                vueExports.createVNode("button", {
                  class: ["relative size-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer hover:scale-110", colorClasses[getStepColor(step, index)].indicator],
                  onClick: ($event) => togglePopover(step.value)
                }, [
                  vueExports.createVNode(_component_UIcon, {
                    name: step.icon,
                    class: "size-4"
                  }, null, 8, ["name"]),
                  (vueExports.unref(stepDataMap).get(step.value)?.totalVisits ?? 0) > 1 ? (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 0,
                    class: "absolute -top-1.5 -right-1.5 size-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center"
                  }, vueExports.toDisplayString(vueExports.unref(stepDataMap).get(step.value).totalVisits), 1)) : vueExports.createCommentVNode("", true)
                ], 10, ["onClick"])
              ];
            }
          }),
          _: 2
        }, _parent));
        if (index < ("OG_TICKET_WORKFLOW_STEPS" in _ctx ? _ctx.OG_TICKET_WORKFLOW_STEPS : vueExports.unref(OG_TICKET_WORKFLOW_STEPS)).length - 1) {
          _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([colorClasses[getStepColor(("OG_TICKET_WORKFLOW_STEPS" in _ctx ? _ctx.OG_TICKET_WORKFLOW_STEPS : vueExports.unref(OG_TICKET_WORKFLOW_STEPS))[index + 1], index + 1)].separator, "h-0.5 flex-1 transition-colors"])}"></div>`);
        } else {
          _push(`<div class="flex-1"></div>`);
        }
        _push(`</div><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([getStepColor(step, index) === "default" ? "text-slate-400" : "text-slate-700", "text-xs font-medium mt-1.5 text-center leading-tight"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(step.title)}</span>`);
        if (vueExports.unref(stepDataMap).get(step.value)?.latestVisit) {
          _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([getStepColor(step, index) === "default" ? "text-slate-300" : "text-slate-400", "text-[11px] text-center leading-tight mt-0.5"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(formatStepTime(vueExports.unref(stepDataMap).get(step.value).latestVisit.segment.started_at))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (step.value === "assigned" && vueExports.unref(assignees).length > 0) {
          _push(`<div class="mt-1.5 flex -space-x-2"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(assignees).slice(0, 3), (a) => {
            _push(`<!--[-->`);
            if (a.avatar_url) {
              _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", a.avatar_url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", a.name)}${serverRenderer_cjs_prodExports.ssrRenderAttr("title", a.name)} class="size-7 rounded-full border border-white object-cover shadow-sm">`);
            } else {
              _push(`<span class="size-7 rounded-full border border-white flex items-center justify-center text-[10px] font-bold bg-slate-200 text-slate-700 shadow-sm"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", a.name)}>${serverRenderer_cjs_prodExports.ssrInterpolate(getInitials(a.name))}</span>`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]-->`);
          if (vueExports.unref(assignees).length > 3) {
            _push(`<span class="size-7 rounded-full border border-white flex items-center justify-center text-[10px] font-bold bg-slate-100 text-slate-600 shadow-sm"> +${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(assignees).length - 3)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      if (vueExports.unref(backtracks).length > 0) {
        _push(`<svg class="block w-full min-w-[600px] mt-1"${serverRenderer_cjs_prodExports.ssrRenderAttr("viewBox", `0 0 ${SVG_W} ${vueExports.unref(svgHeight)}`)}><defs><marker id="bt-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><polyline points="2,2 8,5 2,8" stroke="#d97706" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></polyline></marker></defs><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(backtracks), (bt, i) => {
          _push(`<g><path${serverRenderer_cjs_prodExports.ssrRenderAttr("d", backtrackPath(bt, i))} stroke="#d97706" fill="none" stroke-width="1.5" stroke-dasharray="5,4" stroke-linecap="round" marker-end="url(#bt-arrow)"></path><text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", (stepCenterX(bt.from) + stepCenterX(bt.to)) / 2)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", LANE_PAD + (i + 1) * LANE_H - LANE_H / 2 + 4)} text-anchor="middle" font-size="10" font-weight="600" fill="#d97706">Phát sinh lần ${serverRenderer_cjs_prodExports.ssrInterpolate(bt.cycle)}</text></g>`);
        });
        _push(`<!--]--></svg>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/og-ticket/LifecycleStepper.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$3, { __name: "SharedOgTicketLifecycleStepper" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SurveyTab",
  __ssrInlineRender: true,
  props: {
    ogTicketId: {}
  },
  setup(__props) {
    const props = __props;
    const toast = useToast();
    const { data, status, error, refresh } = useOgTicketSurvey(() => props.ogTicketId);
    const survey = vueExports.computed(() => data.value?.data ?? null);
    const noteInput = vueExports.ref(null);
    const pendingFiles = vueExports.ref([]);
    const pendingPreviews = vueExports.ref(/* @__PURE__ */ new Map());
    const fileInputRef = vueExports.ref(null);
    const isSaving = vueExports.ref(false);
    const deletingAttachmentId = vueExports.ref(null);
    function previewUrl(file) {
      return pendingPreviews.value.get(file) ?? null;
    }
    function trackPreview(file) {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        pendingPreviews.value.set(file, URL.createObjectURL(file));
      }
    }
    function untrackPreview(file) {
      const url = pendingPreviews.value.get(file);
      if (url) {
        URL.revokeObjectURL(url);
        pendingPreviews.value.delete(file);
      }
    }
    function clearAllPreviews() {
      for (const url of pendingPreviews.value.values()) {
        URL.revokeObjectURL(url);
      }
      pendingPreviews.value.clear();
    }
    vueExports.watch(
      survey,
      (val) => {
        noteInput.value = val?.note ?? null;
      },
      { immediate: true }
    );
    const isDirty = vueExports.computed(() => {
      if ((noteInput.value ?? "") !== (survey.value?.note ?? "")) {
        return true;
      }
      if (pendingFiles.value.length > 0) return true;
      return false;
    });
    function isVideoMime(mime) {
      return mime.startsWith("video/");
    }
    function fileIcon(mime) {
      if (isImageMime(mime)) return "i-lucide-image";
      if (isVideoMime(mime)) return "i-lucide-video";
      if (mime === "application/pdf") return "i-lucide-file-text";
      return "i-lucide-file";
    }
    function onPickFiles() {
      fileInputRef.value?.click();
    }
    function onFileChange(event) {
      const input = event.target;
      const files = Array.from(input.files ?? []);
      const existingCount = (survey.value?.attachments.length ?? 0) + pendingFiles.value.length;
      const accepted = [];
      for (const f of files) {
        if (existingCount + accepted.length >= SURVEY_MAX_FILES) {
          toast.add({ title: `Tối đa ${SURVEY_MAX_FILES} tệp`, color: "warning" });
          break;
        }
        if (f.size > SURVEY_MAX_FILE_BYTES) {
          toast.add({ title: `Tệp ${f.name} vượt 100MB`, color: "warning" });
          continue;
        }
        if (!SURVEY_ALLOWED_MIMES.includes(f.type)) {
          toast.add({ title: `Định dạng ${f.name} không hợp lệ`, color: "warning" });
          continue;
        }
        accepted.push(f);
      }
      for (const f of accepted) trackPreview(f);
      pendingFiles.value = [...pendingFiles.value, ...accepted];
      input.value = "";
    }
    function removePendingFile(index) {
      const file = pendingFiles.value[index];
      if (file) untrackPreview(file);
      pendingFiles.value = pendingFiles.value.filter((_, i) => i !== index);
    }
    async function onSave() {
      if (!isDirty.value) return;
      isSaving.value = true;
      try {
        await apiUpsertOgTicketSurvey(props.ogTicketId, {
          note: noteInput.value,
          attachments: pendingFiles.value
        });
        clearAllPreviews();
        pendingFiles.value = [];
        await refresh();
        toast.add({ title: "Đã lưu khảo sát", color: "success" });
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Không thể lưu khảo sát"), color: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    async function onDeleteAttachment(attachmentId) {
      if (!confirm("Xoá tệp đính kèm này?")) return;
      deletingAttachmentId.value = attachmentId;
      try {
        await apiDeleteOgTicketSurveyAttachment(props.ogTicketId, attachmentId);
        await refresh();
        toast.add({ title: "Đã xoá tệp", color: "success" });
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Không thể xoá tệp"), color: "error" });
      } finally {
        deletingAttachmentId.value = null;
      }
    }
    const formattedSurveyedAt = vueExports.computed(() => {
      if (!survey.value?.surveyed_at) return null;
      return new Date(survey.value.surveyed_at).toLocaleString("vi-VN");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UAlert = _sfc_main$7;
      const _component_SharedRichTextEditor = __nuxt_component_7$1;
      const _component_UButton = _sfc_main$c;
      const _component_UIcon = _sfc_main$h;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, vueExports.mergeProps({ title: "Khảo sát hiện trạng" }, _attrs), {
        "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(survey)?.surveyor && vueExports.unref(formattedSurveyedAt)) {
              _push2(`<div class="text-xs text-slate-500"${_scopeId}> Cập nhật bởi <span class="font-medium text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(survey).surveyor.name)}</span> lúc ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formattedSurveyedAt))}</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.unref(survey)?.surveyor && vueExports.unref(formattedSurveyedAt) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "text-xs text-slate-500"
              }, [
                vueExports.createTextVNode(" Cập nhật bởi "),
                vueExports.createVNode("span", { class: "font-medium text-slate-700" }, vueExports.toDisplayString(vueExports.unref(survey).surveyor.name), 1),
                vueExports.createTextVNode(" lúc " + vueExports.toDisplayString(vueExports.unref(formattedSurveyedAt)), 1)
              ])) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(status) === "pending") {
              _push2(`<div class="text-sm text-slate-500 py-6 text-center"${_scopeId}> Đang tải... </div>`);
            } else if (vueExports.unref(error)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "subtle",
                title: "Không tải được khảo sát",
                description: ("getApiErrorMessage" in _ctx ? _ctx.getApiErrorMessage : vueExports.unref(getApiErrorMessage))(vueExports.unref(error))
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="flex flex-col gap-4"${_scopeId}><div class="flex flex-col gap-2"${_scopeId}><label class="text-sm font-medium text-slate-700"${_scopeId}>Ghi chú khảo sát</label>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedRichTextEditor, {
                modelValue: vueExports.unref(noteInput),
                "onUpdate:modelValue": ($event) => vueExports.isRef(noteInput) ? noteInput.value = $event : null,
                placeholder: "Mô tả hiện trạng: vết nứt, vị trí hư hỏng, tình trạng thiết bị...",
                "min-height": "180px"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex flex-col gap-2"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><label class="text-sm font-medium text-slate-700"${_scopeId}> Tệp đính kèm <span class="text-xs font-normal text-slate-400"${_scopeId}> (${serverRenderer_cjs_prodExports.ssrInterpolate((vueExports.unref(survey)?.attachments.length ?? 0) + vueExports.unref(pendingFiles).length)} / ${serverRenderer_cjs_prodExports.ssrInterpolate("SURVEY_MAX_FILES" in _ctx ? _ctx.SURVEY_MAX_FILES : vueExports.unref(SURVEY_MAX_FILES))}) </span></label>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-upload",
                label: "Chọn tệp",
                size: "xs",
                variant: "soft",
                onClick: onPickFiles
              }, null, _parent2, _scopeId));
              _push2(`<input type="file" multiple class="hidden"${serverRenderer_cjs_prodExports.ssrRenderAttr("accept", ("SURVEY_ALLOWED_MIMES" in _ctx ? _ctx.SURVEY_ALLOWED_MIMES : vueExports.unref(SURVEY_ALLOWED_MIMES)).join(","))}${_scopeId}></div><div class="text-xs text-slate-400"${_scopeId}> Hỗ trợ ảnh, video, PDF, Word, Excel, văn bản. Mỗi tệp tối đa 100MB. </div>`);
              if ((vueExports.unref(survey)?.attachments.length ?? 0) === 0 && vueExports.unref(pendingFiles).length === 0) {
                _push2(`<div class="text-sm text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-lg"${_scopeId}> Chưa có tệp nào </div>`);
              } else {
                _push2(`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(survey)?.attachments ?? [], (att) => {
                  _push2(`<div class="relative border border-slate-200 rounded-lg overflow-hidden bg-white group"${_scopeId}><div class="aspect-square flex items-center justify-center bg-slate-50"${_scopeId}>`);
                  if (("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) && att.url) {
                    _push2(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", att.url)} target="_blank" rel="noopener" class="block w-full h-full"${_scopeId}><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", att.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", att.original_name)} class="w-full h-full object-cover"${_scopeId}></a>`);
                  } else if (isVideoMime(att.mime_type) && att.url) {
                    _push2(`<video${serverRenderer_cjs_prodExports.ssrRenderAttr("src", att.url)} controls preload="metadata" class="w-full h-full object-cover"${_scopeId}></video>`);
                  } else if (att.url) {
                    _push2(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", att.url)} target="_blank" rel="noopener" class="flex flex-col items-center gap-1 text-slate-500 hover:text-primary"${_scopeId}>`);
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: fileIcon(att.mime_type),
                      class: "size-10"
                    }, null, _parent2, _scopeId));
                    _push2(`<span class="text-xs"${_scopeId}>Mở tệp</span></a>`);
                  } else {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: fileIcon(att.mime_type),
                      class: "size-10 text-slate-400"
                    }, null, _parent2, _scopeId));
                  }
                  _push2(`</div><div class="px-2 py-1.5 text-xs"${_scopeId}><div class="truncate font-medium text-slate-700"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", att.original_name)}${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(att.original_name)}</div><div class="text-slate-400"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(att.size_bytes))}</div></div>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-trash-2",
                    color: "error",
                    variant: "solid",
                    size: "sm",
                    square: "",
                    class: "absolute top-1 right-1 shadow-md",
                    "aria-label": "Xoá tệp",
                    loading: vueExports.unref(deletingAttachmentId) === att.id,
                    onClick: ($event) => onDeleteAttachment(att.id)
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                });
                _push2(`<!--]--><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(pendingFiles), (file, idx) => {
                  _push2(`<div class="relative border-2 border-dashed border-emerald-400 rounded-lg overflow-hidden bg-emerald-50 group"${_scopeId}><div class="aspect-square flex items-center justify-center bg-slate-50"${_scopeId}>`);
                  if (("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) && previewUrl(file)) {
                    _push2(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", previewUrl(file))}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", file.name)} class="w-full h-full object-cover"${_scopeId}>`);
                  } else if (isVideoMime(file.type) && previewUrl(file)) {
                    _push2(`<video${serverRenderer_cjs_prodExports.ssrRenderAttr("src", previewUrl(file))} controls preload="metadata" class="w-full h-full object-cover"${_scopeId}></video>`);
                  } else {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: fileIcon(file.type),
                      class: "size-10 text-emerald-500"
                    }, null, _parent2, _scopeId));
                  }
                  _push2(`</div><div class="px-2 py-1.5 text-xs"${_scopeId}><div class="truncate font-medium text-slate-700"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", file.name)}${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(file.name)}</div><div class="text-emerald-600"${_scopeId}> Chưa lưu · ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(file.size))}</div></div>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-trash-2",
                    color: "error",
                    variant: "solid",
                    size: "sm",
                    square: "",
                    class: "absolute top-1 right-1 shadow-md",
                    "aria-label": "Xoá tệp",
                    onClick: ($event) => removePendingFile(idx)
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                });
                _push2(`<!--]--></div>`);
              }
              _push2(`</div><div class="flex justify-end gap-2 pt-2 border-t border-slate-100"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Lưu khảo sát",
                icon: "i-lucide-save",
                color: "primary",
                disabled: !vueExports.unref(isDirty),
                loading: vueExports.unref(isSaving),
                onClick: onSave
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            }
          } else {
            return [
              vueExports.unref(status) === "pending" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "text-sm text-slate-500 py-6 text-center"
              }, " Đang tải... ")) : vueExports.unref(error) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 1,
                color: "error",
                variant: "subtle",
                title: "Không tải được khảo sát",
                description: ("getApiErrorMessage" in _ctx ? _ctx.getApiErrorMessage : vueExports.unref(getApiErrorMessage))(vueExports.unref(error))
              }, null, 8, ["description"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 2,
                class: "flex flex-col gap-4"
              }, [
                vueExports.createVNode("div", { class: "flex flex-col gap-2" }, [
                  vueExports.createVNode("label", { class: "text-sm font-medium text-slate-700" }, "Ghi chú khảo sát"),
                  vueExports.createVNode(_component_SharedRichTextEditor, {
                    modelValue: vueExports.unref(noteInput),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(noteInput) ? noteInput.value = $event : null,
                    placeholder: "Mô tả hiện trạng: vết nứt, vị trí hư hỏng, tình trạng thiết bị...",
                    "min-height": "180px"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                vueExports.createVNode("div", { class: "flex flex-col gap-2" }, [
                  vueExports.createVNode("div", { class: "flex items-center justify-between" }, [
                    vueExports.createVNode("label", { class: "text-sm font-medium text-slate-700" }, [
                      vueExports.createTextVNode(" Tệp đính kèm "),
                      vueExports.createVNode("span", { class: "text-xs font-normal text-slate-400" }, " (" + vueExports.toDisplayString((vueExports.unref(survey)?.attachments.length ?? 0) + vueExports.unref(pendingFiles).length) + " / " + vueExports.toDisplayString("SURVEY_MAX_FILES" in _ctx ? _ctx.SURVEY_MAX_FILES : vueExports.unref(SURVEY_MAX_FILES)) + ") ", 1)
                    ]),
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-upload",
                      label: "Chọn tệp",
                      size: "xs",
                      variant: "soft",
                      onClick: onPickFiles
                    }),
                    vueExports.createVNode("input", {
                      ref_key: "fileInputRef",
                      ref: fileInputRef,
                      type: "file",
                      multiple: "",
                      class: "hidden",
                      accept: ("SURVEY_ALLOWED_MIMES" in _ctx ? _ctx.SURVEY_ALLOWED_MIMES : vueExports.unref(SURVEY_ALLOWED_MIMES)).join(","),
                      onChange: onFileChange
                    }, null, 40, ["accept"])
                  ]),
                  vueExports.createVNode("div", { class: "text-xs text-slate-400" }, " Hỗ trợ ảnh, video, PDF, Word, Excel, văn bản. Mỗi tệp tối đa 100MB. "),
                  (vueExports.unref(survey)?.attachments.length ?? 0) === 0 && vueExports.unref(pendingFiles).length === 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "text-sm text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-lg"
                  }, " Chưa có tệp nào ")) : (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(survey)?.attachments ?? [], (att) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: `saved-${att.id}`,
                        class: "relative border border-slate-200 rounded-lg overflow-hidden bg-white group"
                      }, [
                        vueExports.createVNode("div", { class: "aspect-square flex items-center justify-center bg-slate-50" }, [
                          ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) && att.url ? (vueExports.openBlock(), vueExports.createBlock("a", {
                            key: 0,
                            href: att.url,
                            target: "_blank",
                            rel: "noopener",
                            class: "block w-full h-full"
                          }, [
                            vueExports.createVNode("img", {
                              src: att.url,
                              alt: att.original_name,
                              class: "w-full h-full object-cover"
                            }, null, 8, ["src", "alt"])
                          ], 8, ["href"])) : isVideoMime(att.mime_type) && att.url ? (vueExports.openBlock(), vueExports.createBlock("video", {
                            key: 1,
                            src: att.url,
                            controls: "",
                            preload: "metadata",
                            class: "w-full h-full object-cover"
                          }, null, 8, ["src"])) : att.url ? (vueExports.openBlock(), vueExports.createBlock("a", {
                            key: 2,
                            href: att.url,
                            target: "_blank",
                            rel: "noopener",
                            class: "flex flex-col items-center gap-1 text-slate-500 hover:text-primary"
                          }, [
                            vueExports.createVNode(_component_UIcon, {
                              name: fileIcon(att.mime_type),
                              class: "size-10"
                            }, null, 8, ["name"]),
                            vueExports.createVNode("span", { class: "text-xs" }, "Mở tệp")
                          ], 8, ["href"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UIcon, {
                            key: 3,
                            name: fileIcon(att.mime_type),
                            class: "size-10 text-slate-400"
                          }, null, 8, ["name"]))
                        ]),
                        vueExports.createVNode("div", { class: "px-2 py-1.5 text-xs" }, [
                          vueExports.createVNode("div", {
                            class: "truncate font-medium text-slate-700",
                            title: att.original_name
                          }, vueExports.toDisplayString(att.original_name), 9, ["title"]),
                          vueExports.createVNode("div", { class: "text-slate-400" }, vueExports.toDisplayString(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(att.size_bytes)), 1)
                        ]),
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-trash-2",
                          color: "error",
                          variant: "solid",
                          size: "sm",
                          square: "",
                          class: "absolute top-1 right-1 shadow-md",
                          "aria-label": "Xoá tệp",
                          loading: vueExports.unref(deletingAttachmentId) === att.id,
                          onClick: ($event) => onDeleteAttachment(att.id)
                        }, null, 8, ["loading", "onClick"])
                      ]);
                    }), 128)),
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(pendingFiles), (file, idx) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: `pending-${idx}`,
                        class: "relative border-2 border-dashed border-emerald-400 rounded-lg overflow-hidden bg-emerald-50 group"
                      }, [
                        vueExports.createVNode("div", { class: "aspect-square flex items-center justify-center bg-slate-50" }, [
                          ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(file.type) && previewUrl(file) ? (vueExports.openBlock(), vueExports.createBlock("img", {
                            key: 0,
                            src: previewUrl(file),
                            alt: file.name,
                            class: "w-full h-full object-cover"
                          }, null, 8, ["src", "alt"])) : isVideoMime(file.type) && previewUrl(file) ? (vueExports.openBlock(), vueExports.createBlock("video", {
                            key: 1,
                            src: previewUrl(file),
                            controls: "",
                            preload: "metadata",
                            class: "w-full h-full object-cover"
                          }, null, 8, ["src"])) : (vueExports.openBlock(), vueExports.createBlock(_component_UIcon, {
                            key: 2,
                            name: fileIcon(file.type),
                            class: "size-10 text-emerald-500"
                          }, null, 8, ["name"]))
                        ]),
                        vueExports.createVNode("div", { class: "px-2 py-1.5 text-xs" }, [
                          vueExports.createVNode("div", {
                            class: "truncate font-medium text-slate-700",
                            title: file.name
                          }, vueExports.toDisplayString(file.name), 9, ["title"]),
                          vueExports.createVNode("div", { class: "text-emerald-600" }, " Chưa lưu · " + vueExports.toDisplayString(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(file.size)), 1)
                        ]),
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-trash-2",
                          color: "error",
                          variant: "solid",
                          size: "sm",
                          square: "",
                          class: "absolute top-1 right-1 shadow-md",
                          "aria-label": "Xoá tệp",
                          onClick: ($event) => removePendingFile(idx)
                        }, null, 8, ["onClick"])
                      ]);
                    }), 128))
                  ]))
                ]),
                vueExports.createVNode("div", { class: "flex justify-end gap-2 pt-2 border-t border-slate-100" }, [
                  vueExports.createVNode(_component_UButton, {
                    label: "Lưu khảo sát",
                    icon: "i-lucide-save",
                    color: "primary",
                    disabled: !vueExports.unref(isDirty),
                    loading: vueExports.unref(isSaving),
                    onClick: onSave
                  }, null, 8, ["disabled", "loading"])
                ])
              ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/og-ticket/SurveyTab.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_12 = Object.assign(_sfc_main$2, { __name: "OgTicketSurveyTab" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "CreateOrderModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    ogTicketSubject: {},
    ogTicketCode: {},
    quote: {}
  },
  emits: ["update:open", "created"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const modelOpen = vueExports.computed({
      get: () => props.open,
      set: (v) => emit("update:open", v)
    });
    const toast = useToast();
    const note = vueExports.ref("");
    const isSubmitting = vueExports.ref(false);
    function resetForm() {
      note.value = "";
    }
    async function handleSubmit() {
      if (!props.quote) return;
      isSubmitting.value = true;
      try {
        await apiCreateOrder({
          quote_id: props.quote.id,
          note: note.value || null
        });
        toast.add({ title: "Tạo đơn hàng thành công", color: "success" });
        emit("update:open", false);
        emit("created");
        resetForm();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Tạo đơn hàng thất bại"), color: "error" });
      } finally {
        isSubmitting.value = false;
      }
    }
    function handleClose() {
      emit("update:open", false);
      resetForm();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$8;
      const _component_UAlert = _sfc_main$7;
      const _component_UBadge = _sfc_main$5;
      const _component_USeparator = _sfc_main$a;
      const _component_UFormField = _sfc_main$b;
      const _component_UTextarea = _sfc_main$9;
      const _component_UButton = _sfc_main$c;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, vueExports.mergeProps({
        open: vueExports.unref(modelOpen),
        "onUpdate:open": ($event) => vueExports.isRef(modelOpen) ? modelOpen.value = $event : null,
        title: "Tạo đơn hàng"
      }, _attrs), {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4"${_scopeId}>`);
            if (!__props.quote) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                color: "warning",
                variant: "subtle",
                icon: "i-lucide-alert-triangle",
                title: "Không có báo giá active đã chấp thuận."
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!--[--><div class="rounded-lg bg-slate-50 border border-slate-200 p-3"${_scopeId}><div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2"${_scopeId}> OG Ticket </div><div class="flex flex-col gap-1"${_scopeId}><div class="flex items-center justify-between text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Tiêu đề</span><span class="font-medium text-slate-900 text-right max-w-[60%] truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.ogTicketSubject)}</span></div>`);
              if (__props.ogTicketCode) {
                _push2(`<div class="flex items-center justify-between text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Mã ticket</span><span class="font-mono font-semibold text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.ogTicketCode)}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="rounded-lg bg-slate-50 border border-slate-200 p-3"${_scopeId}><div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2"${_scopeId}> Báo giá </div><div class="flex flex-col gap-1"${_scopeId}><div class="flex items-center justify-between text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Mã báo giá</span><span class="font-mono font-semibold text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.quote.code)}</span></div><div class="flex items-center justify-between text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Trạng thái</span>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                label: __props.quote.status.label,
                color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(__props.quote.status.value),
                variant: "subtle",
                size: "xs"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USeparator, { class: "my-2" }, null, _parent2, _scopeId));
              _push2(`<div class="flex flex-col gap-1"${_scopeId}><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(__props.quote.lines, (line) => {
                _push2(`<div class="flex items-center justify-between text-xs"${_scopeId}><span class="text-slate-600 truncate max-w-[50%]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(line.name)}</span><span class="text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(line.quantity)} ${serverRenderer_cjs_prodExports.ssrInterpolate(line.unit)} × ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.unit_price))} = <span class="font-medium text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.line_amount))}</span></span></div>`);
              });
              _push2(`<!--]--></div><div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-200"${_scopeId}><span class="text-sm font-medium text-slate-600"${_scopeId}>Tổng tiền</span><span class="text-sm font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.quote.total_amount))}</span></div></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Ghi chú đơn hàng" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                      modelValue: vueExports.unref(note),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(note) ? note.value = $event : null,
                      placeholder: "Ghi chú (không bắt buộc)...",
                      rows: 3,
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(note),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(note) ? note.value = $event : null,
                        placeholder: "Ghi chú (không bắt buộc)...",
                        rows: 3,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                !__props.quote ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  color: "warning",
                  variant: "subtle",
                  icon: "i-lucide-alert-triangle",
                  title: "Không có báo giá active đã chấp thuận."
                })) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("div", { class: "rounded-lg bg-slate-50 border border-slate-200 p-3" }, [
                    vueExports.createVNode("div", { class: "text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2" }, " OG Ticket "),
                    vueExports.createVNode("div", { class: "flex flex-col gap-1" }, [
                      vueExports.createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                        vueExports.createVNode("span", { class: "text-slate-500" }, "Tiêu đề"),
                        vueExports.createVNode("span", { class: "font-medium text-slate-900 text-right max-w-[60%] truncate" }, vueExports.toDisplayString(__props.ogTicketSubject), 1)
                      ]),
                      __props.ogTicketCode ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex items-center justify-between text-sm"
                      }, [
                        vueExports.createVNode("span", { class: "text-slate-500" }, "Mã ticket"),
                        vueExports.createVNode("span", { class: "font-mono font-semibold text-slate-700" }, vueExports.toDisplayString(__props.ogTicketCode), 1)
                      ])) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  vueExports.createVNode("div", { class: "rounded-lg bg-slate-50 border border-slate-200 p-3" }, [
                    vueExports.createVNode("div", { class: "text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2" }, " Báo giá "),
                    vueExports.createVNode("div", { class: "flex flex-col gap-1" }, [
                      vueExports.createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                        vueExports.createVNode("span", { class: "text-slate-500" }, "Mã báo giá"),
                        vueExports.createVNode("span", { class: "font-mono font-semibold text-slate-700" }, vueExports.toDisplayString(__props.quote.code), 1)
                      ]),
                      vueExports.createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                        vueExports.createVNode("span", { class: "text-slate-500" }, "Trạng thái"),
                        vueExports.createVNode(_component_UBadge, {
                          label: __props.quote.status.label,
                          color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(__props.quote.status.value),
                          variant: "subtle",
                          size: "xs"
                        }, null, 8, ["label", "color"])
                      ])
                    ]),
                    vueExports.createVNode(_component_USeparator, { class: "my-2" }),
                    vueExports.createVNode("div", { class: "flex flex-col gap-1" }, [
                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.quote.lines, (line) => {
                        return vueExports.openBlock(), vueExports.createBlock("div", {
                          key: line.id,
                          class: "flex items-center justify-between text-xs"
                        }, [
                          vueExports.createVNode("span", { class: "text-slate-600 truncate max-w-[50%]" }, vueExports.toDisplayString(line.name), 1),
                          vueExports.createVNode("span", { class: "text-slate-500" }, [
                            vueExports.createTextVNode(vueExports.toDisplayString(line.quantity) + " " + vueExports.toDisplayString(line.unit) + " × " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.unit_price)) + " = ", 1),
                            vueExports.createVNode("span", { class: "font-medium text-slate-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.line_amount)), 1)
                          ])
                        ]);
                      }), 128))
                    ]),
                    vueExports.createVNode("div", { class: "flex items-center justify-between mt-2 pt-2 border-t border-slate-200" }, [
                      vueExports.createVNode("span", { class: "text-sm font-medium text-slate-600" }, "Tổng tiền"),
                      vueExports.createVNode("span", { class: "text-sm font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(__props.quote.total_amount)), 1)
                    ])
                  ]),
                  vueExports.createVNode(_component_UFormField, { label: "Ghi chú đơn hàng" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UTextarea, {
                        modelValue: vueExports.unref(note),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(note) ? note.value = $event : null,
                        placeholder: "Ghi chú (không bắt buộc)...",
                        rows: 3,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ], 64))
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Hủy",
              color: "neutral",
              variant: "ghost",
              onClick: handleClose
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Tạo đơn hàng",
              color: "primary",
              icon: "i-lucide-shopping-cart",
              disabled: !__props.quote,
              loading: vueExports.unref(isSubmitting),
              onClick: handleSubmit
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: handleClose
                }),
                vueExports.createVNode(_component_UButton, {
                  label: "Tạo đơn hàng",
                  color: "primary",
                  icon: "i-lucide-shopping-cart",
                  disabled: !__props.quote,
                  loading: vueExports.unref(isSubmitting),
                  onClick: handleSubmit
                }, null, 8, ["disabled", "loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/og-ticket/CreateOrderModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_17 = Object.assign(_sfc_main$1, { __name: "SharedOgTicketCreateOrderModal" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error, refresh } = useOgTicketDetail(id);
    const ogTicket = vueExports.computed(() => data.value?.data);
    const requestURL = useRequestURL();
    const ticketCode = vueExports.computed(() => ogTicket.value?.ticket?.code ?? "");
    const residentTicketPath = vueExports.computed(
      () => ticketCode.value ? `/tickets/${ticketCode.value}` : ""
    );
    const absoluteResidentUrl = vueExports.computed(
      () => ticketCode.value ? `${requestURL.origin}${residentTicketPath.value}` : ""
    );
    const qrCodeRef = vueExports.ref(null);
    async function copyResidentUrl() {
      if (!absoluteResidentUrl.value) return;
      try {
        await (void 0).clipboard.writeText(absoluteResidentUrl.value);
        toast.add({ title: "Đã sao chép link", color: "success" });
      } catch {
        toast.add({ title: "Không thể sao chép link", color: "error" });
      }
    }
    function downloadResidentQr() {
      qrCodeRef.value?.downloadPng();
    }
    const { data: versionsData } = useQuoteVersions(id);
    const EFFECTIVE_STATUSES = ["manager_approved", "approved"];
    const activeQuote = vueExports.computed(() => {
      const quotes = versionsData.value?.data ?? [];
      return quotes.find((q) => q.is_active && EFFECTIVE_STATUSES.includes(q.status.value)) ?? quotes.find((q) => q.is_active) ?? null;
    });
    const draftReplacement = vueExports.computed(() => {
      if (!activeQuote.value) return null;
      const quotes = versionsData.value?.data ?? [];
      return quotes.find((q) => q.is_active && q.id !== activeQuote.value.id) ?? null;
    });
    const { data: auditsData } = useOgTicketAudits(id);
    const audits = vueExports.computed(() => auditsData.value?.data ?? []);
    const stepperKey = vueExports.ref(0);
    async function refreshAll() {
      const [, freshVersions] = await Promise.all([
        refresh(),
        apiGetQuoteVersions(id.value)
      ]);
      versionsData.value = freshVersions;
      stepperKey.value++;
    }
    const OG_TICKET_AUDIT_FIELD_LABELS = {
      subject: "Tiêu đề",
      description: "Mô tả",
      requester_name: "Người gửi",
      requester_phone: "Số điện thoại",
      apartment_name: "Căn hộ",
      address: "Địa chỉ",
      status: "Trạng thái",
      priority: "Ưu tiên",
      channel: "Kênh tiếp nhận",
      internal_note: "Ghi chú nội bộ",
      received_at: "Thời gian nhận",
      received_by_id: "Người tiếp nhận",
      project_id: "Dự án",
      sla_quote_due_at: "SLA Báo giá",
      sla_completion_due_at: "SLA Hoàn thành",
      latitude: "Vĩ độ",
      longitude: "Kinh độ",
      ticket_id: "Ticket ID",
      attachments: "Tệp đính kèm"
    };
    const OG_TICKET_AUDIT_DATETIME_FIELDS = /* @__PURE__ */ new Set(["received_at", "sla_quote_due_at", "sla_completion_due_at"]);
    function getChangedFields(audit) {
      return getAuditChangedFields(audit, OG_TICKET_AUDIT_FIELD_LABELS, OG_TICKET_AUDIT_DATETIME_FIELDS);
    }
    useSeoMeta({
      title: vueExports.computed(
        () => ogTicket.value ? `${ogTicket.value.subject} - Thần Nông` : "Chi tiết OG Ticket"
      )
    });
    const infoTab = vueExports.ref("og");
    const mainTab = vueExports.ref("overview");
    const showAuditHistory = vueExports.ref(false);
    const lifecycleSegments = vueExports.computed(() => {
      const raw = data.value?.data;
      return raw?.lifecycle_segments ?? [];
    });
    const quoteVersionsList = vueExports.computed(() => versionsData.value?.data ?? []);
    const activeOrderStatus = vueExports.computed(() => {
      const aq = activeQuote.value;
      return aq?.order?.status?.value ?? null;
    });
    const toast = useToast();
    async function handleTransition(targetStatus) {
      try {
        await apiTransitionOgTicket(id.value, { target_status: targetStatus });
        toast.add({ title: "Đã chuyển trạng thái", color: "success" });
        await refreshAll();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Không thể chuyển trạng thái"), color: "error" });
      }
    }
    const { data: accountsData } = useAccountList(vueExports.computed(() => ({ per_page: SELECT_ALL_PER_PAGE })));
    const accountOptions = vueExports.computed(
      () => (accountsData.value?.data ?? []).map((acc) => ({
        label: acc.name,
        value: acc.id,
        capability_rating: acc.capability_rating ?? null
      }))
    );
    async function handleAssign(assigneeIds) {
      try {
        await apiUpdateOgTicket(id.value, {
          priority: ogTicket.value.priority.value,
          assigned_to_ids: assigneeIds
        });
        toast.add({ title: "Đã phân công", color: "success" });
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Không thể phân công"), color: "error" });
      }
    }
    const showCreateOrderModal = vueExports.ref(false);
    function handleOpenCreateOrder() {
      showCreateOrderModal.value = true;
    }
    function handleOrderCreated() {
      refreshAll();
    }
    const slaQuoteFulfilledStatuses = ["quoted", "approved", "rejected", "ordered", "in_progress", "completed"];
    const isSlaQuoteViolated = vueExports.computed(() => {
      if (!ogTicket.value?.sla_quote_due_at) return false;
      if (slaQuoteFulfilledStatuses.includes(ogTicket.value.status.value)) return false;
      return new Date(ogTicket.value.sla_quote_due_at) < /* @__PURE__ */ new Date();
    });
    const isSlaCompletionViolated = vueExports.computed(() => {
      if (!ogTicket.value?.sla_completion_due_at) return false;
      if (ogTicket.value.status.value === "completed") return false;
      return new Date(ogTicket.value.sla_completion_due_at) < /* @__PURE__ */ new Date();
    });
    const isCancelled = vueExports.computed(() => ogTicket.value?.status.value === "cancelled");
    const isRejected = vueExports.computed(() => ogTicket.value?.status.value === "rejected");
    const isCompleted = vueExports.computed(() => ogTicket.value?.status.value === "completed");
    const canEdit = vueExports.computed(() => !isCancelled.value);
    const categoriesModalOpen = vueExports.ref(false);
    const selectedCategoryIds = vueExports.computed(() => (ogTicket.value?.categories ?? []).map((c) => c.id));
    function openCategoriesModal() {
      categoriesModalOpen.value = true;
    }
    async function handleCategoriesSaved() {
      await refresh();
    }
    const showSlaModal = vueExports.ref(false);
    const isSlaUpdating = vueExports.ref(false);
    const slaForm = vueExports.reactive({
      sla_quote_due_at: null,
      sla_completion_due_at: null
    });
    function openSlaModal() {
      slaForm.sla_quote_due_at = utcToLocal(ogTicket.value?.sla_quote_due_at ?? null);
      slaForm.sla_completion_due_at = utcToLocal(ogTicket.value?.sla_completion_due_at ?? null);
      showSlaModal.value = true;
    }
    async function handleSlaUpdate() {
      isSlaUpdating.value = true;
      try {
        await apiUpdateOgTicket(id.value, {
          priority: ogTicket.value.priority.value,
          sla_quote_due_at: localToUtc(slaForm.sla_quote_due_at),
          sla_completion_due_at: localToUtc(slaForm.sla_completion_due_at)
        });
        toast.add({ title: "Đã cập nhật SLA", color: "success" });
        showSlaModal.value = false;
        await refresh();
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Không thể cập nhật SLA"), color: "error" });
      } finally {
        isSlaUpdating.value = false;
      }
    }
    vueExports.shallowRef(null);
    vueExports.shallowRef(null);
    vueExports.shallowRef(null);
    const hasLocation = vueExports.computed(() => ogTicket.value?.latitude != null && ogTicket.value?.longitude != null);
    vueExports.computed(
      () => hasLocation.value ? [Number(ogTicket.value.latitude), Number(ogTicket.value.longitude)] : [10.7769, 106.7009]
    );
    const showMap = vueExports.ref(false);
    const ticketAttachments = vueExports.computed(() => ogTicket.value?.ticket?.attachments ?? []);
    const warrantyRequests = vueExports.computed(() => ogTicket.value?.warranty_requests ?? []);
    const mainTabItems = vueExports.computed(() => {
      const acceptanceBadge = hasAcceptanceReportOrder.value ? acceptanceReport.value?.is_confirmed ? { label: "Đã xong", color: "success" } : { label: "Chờ ký", color: "warning" } : void 0;
      return [
        { key: "overview", label: "Tổng quan", icon: "i-lucide-file-text" },
        { key: "survey", label: "Khảo sát", icon: "i-lucide-search" },
        { key: "commerce", label: "Thương mại", icon: "i-lucide-receipt" },
        {
          key: "acceptance",
          label: "Nghiệm thu",
          icon: "i-lucide-clipboard-check",
          badge: acceptanceBadge
        },
        {
          key: "warranty",
          label: "Bảo hành",
          icon: "i-lucide-shield",
          badge: warrantyRequests.value.length > 0 ? { label: String(warrantyRequests.value.length), color: "warning" } : void 0
        }
      ];
    });
    const imageAttachments = vueExports.computed(() => ticketAttachments.value.filter((a) => a.mime_type.startsWith("image/")));
    const docAttachments = vueExports.computed(() => ticketAttachments.value.filter((a) => !a.mime_type.startsWith("image/")));
    const crud = useCrudModals();
    const { showDeleteModal: showDeleteDialog, deleteTarget } = crud;
    const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh);
    const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
      crud,
      submitDelete,
      checkFn: apiCheckDeleteOgTicket,
      deleteFn: apiDeleteOgTicket,
      successMessage: "Đã huỷ OG Ticket",
      navigateAfter: "/pmc/og-tickets"
    });
    const deleteWarning = vueExports.computed(() => {
      const warnings = [ogTicket.value?.is_from_pool ? "OG Ticket sẽ bị huỷ. Ticket gốc sẽ được trả về pool." : "OG Ticket s�� bị huỷ."];
      if (activeQuote.value) {
        warnings.push(`Báo giá ${activeQuote.value.code} (${activeQuote.value.status.label}) sẽ bị huỷ.`);
        if (activeQuote.value.order) {
          warnings.push(`Đơn hàng ${activeQuote.value.order.code} (${activeQuote.value.order.status.label}) sẽ bị huỷ.`);
        }
      }
      if (draftReplacement.value) {
        warnings.push(`Báo giá nháp ${draftReplacement.value.code} sẽ bị huỷ.`);
      }
      return warnings.join(" ");
    });
    const showReleaseDialog = vueExports.ref(false);
    const showAcceptanceReport = vueExports.ref(false);
    const acceptanceReportOrderId = vueExports.computed(() => activeQuote.value?.order?.id ?? null);
    const hasAcceptanceReportOrder = vueExports.computed(() => acceptanceReportOrderId.value != null);
    const {
      data: acceptanceReportData,
      refresh: refreshAcceptanceReport
    } = useAcceptanceReport(
      vueExports.computed(() => acceptanceReportOrderId.value ?? 0),
      { immediate: false }
    );
    const acceptanceReport = vueExports.computed(() => acceptanceReportData.value?.data ?? null);
    vueExports.watch(acceptanceReportOrderId, async (orderId) => {
      if (orderId != null) {
        await refreshAcceptanceReport();
      }
    }, { immediate: true });
    vueExports.watch(showAcceptanceReport, async (val, prev) => {
      if (prev && !val && hasAcceptanceReportOrder.value) {
        await refreshAcceptanceReport();
      }
    });
    const releaseNote = vueExports.ref("");
    const isReleasing = vueExports.ref(false);
    const isCheckingRelease = vueExports.ref(false);
    const releaseBlockedMessage = vueExports.ref("");
    async function openReleaseDialog() {
      isCheckingRelease.value = true;
      releaseBlockedMessage.value = "";
      showReleaseDialog.value = true;
      try {
        const result = await apiCheckDeleteOgTicket(id.value);
        if (!result.can_delete) {
          releaseBlockedMessage.value = result.message;
        }
      } catch {
        releaseBlockedMessage.value = "Không thể kiểm tra. Vui lòng thử lại.";
      } finally {
        isCheckingRelease.value = false;
      }
    }
    async function handleRelease() {
      isReleasing.value = true;
      try {
        await apiReleaseOgTicket(id.value, releaseNote.value ? { note: releaseNote.value } : void 0);
        showReleaseDialog.value = false;
        toast.add({ title: "Đã trả ticket về pool", color: "success" });
        navigateTo("/pmc/og-tickets");
      } catch (err) {
        toast.add({ title: getApiErrorMessage(err, "Không thể trả ticket. Vui lòng thử lại."), color: "error" });
      } finally {
        isReleasing.value = false;
      }
    }
    function toBadgeColor(color) {
      const allowed = ["error", "success", "warning", "info", "primary", "neutral", "secondary"];
      return allowed.includes(color ?? "") ? color : "neutral";
    }
    function paymentAccentBar(color) {
      switch (color) {
        case "success":
          return "bg-gradient-to-r from-emerald-400 to-green-500";
        case "warning":
          return "bg-gradient-to-r from-amber-400 to-orange-500";
        case "error":
          return "bg-gradient-to-r from-rose-500 to-red-600";
        case "info":
          return "bg-gradient-to-r from-sky-400 to-blue-500";
        default:
          return "bg-gradient-to-r from-slate-300 to-slate-400";
      }
    }
    function paymentIconBg(color) {
      switch (color) {
        case "success":
          return "bg-emerald-50";
        case "warning":
          return "bg-amber-50";
        case "error":
          return "bg-rose-50";
        case "info":
          return "bg-sky-50";
        default:
          return "bg-slate-100";
      }
    }
    function paymentIconFg(color) {
      switch (color) {
        case "success":
          return "text-emerald-600";
        case "warning":
          return "text-amber-600";
        case "error":
          return "text-rose-600";
        case "info":
          return "text-sky-600";
        default:
          return "text-slate-500";
      }
    }
    function paymentBarFill(color) {
      switch (color) {
        case "success":
          return "bg-emerald-500";
        case "warning":
          return "bg-amber-500";
        case "error":
          return "bg-rose-500";
        case "info":
          return "bg-sky-500";
        default:
          return "bg-slate-400";
      }
    }
    function paymentProgress(paid, total) {
      const p = Number(paid ?? 0);
      const t = Number(total ?? 0);
      if (!t || t <= 0) return 0;
      return Math.min(100, Math.max(0, p / t * 100));
    }
    function reconciliationAccentBar(value) {
      if (value === "full") return "bg-gradient-to-r from-emerald-400 to-teal-500";
      if (value === "partial") return "bg-gradient-to-r from-amber-400 to-orange-500";
      return "bg-gradient-to-r from-slate-300 to-slate-400";
    }
    function reconciliationIconBg(value) {
      if (value === "full") return "bg-emerald-50";
      if (value === "partial") return "bg-amber-50";
      return "bg-slate-100";
    }
    function reconciliationIconFg(value) {
      if (value === "full") return "text-emerald-600";
      if (value === "partial") return "text-amber-600";
      return "text-slate-400";
    }
    function reconciliationBarFill(value) {
      if (value === "full") return "bg-emerald-500";
      if (value === "partial") return "bg-amber-500";
      return "bg-slate-300";
    }
    function reconciliationIcon(value) {
      if (value === "full") return "i-lucide-check-check";
      if (value === "partial") return "i-lucide-scale";
      return "i-lucide-clock";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UBadge = _sfc_main$5;
      const _component_UDropdownMenu = _sfc_main$6;
      const _component_SharedCrudPageError = __nuxt_component_2$1;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedOgTicketLifecycleStepper = __nuxt_component_5;
      const _component_UIcon = _sfc_main$h;
      const _component_UAlert = _sfc_main$7;
      const _component_SharedFieldDisplay = __nuxt_component_5$1;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_ClientOnly = __nuxt_component_5$2;
      const _component_ULink = _sfc_main$d;
      const _component_OgTicketSurveyTab = __nuxt_component_12;
      const _component_SharedTicketRatingDisplay = __nuxt_component_7;
      const _component_SharedCapabilityRatingBadge = __nuxt_component_1;
      const _component_SharedQrCode = __nuxt_component_2$2;
      const _component_SharedOrderAcceptanceReportModal = __nuxt_component_16;
      const _component_SharedOgTicketCreateOrderModal = __nuxt_component_17;
      const _component_SharedCrudDeleteModal = __nuxt_component_11;
      const _component_UModal = _sfc_main$8;
      const _component_UTextarea = _sfc_main$9;
      const _component_SharedOgTicketCategoryModal = __nuxt_component_21;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6"><div class="flex items-center gap-3 min-w-0">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/pmc/og-tickets",
        size: "sm",
        class: "shrink-0"
      }, null, _parent));
      _push(`<div class="flex items-center gap-2 min-w-0 flex-1"><span class="font-mono text-xs font-semibold text-slate-500 shrink-0 tracking-wide">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket)?.ticket?.code ?? `OG#${vueExports.unref(id)}`)}</span><span class="text-slate-300 shrink-0">/</span><h1 class="font-bold text-slate-900 text-sm sm:text-base truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket)?.subject ?? "...")}</h1>`);
      if (vueExports.unref(ogTicket)) {
        _push(`<!--[-->`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          label: vueExports.unref(ogTicket).status.label,
          color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(vueExports.unref(ogTicket).status.value),
          variant: "subtle",
          size: "xs",
          class: "shrink-0"
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          label: vueExports.unref(ogTicket).priority.label,
          color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(vueExports.unref(ogTicket).priority.value),
          variant: "soft",
          size: "xs",
          class: "shrink-0"
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(ogTicket)) {
        _push(`<div class="flex items-center gap-1.5 shrink-0">`);
        if (vueExports.unref(canEdit)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Chỉnh sửa",
            icon: "i-lucide-pencil",
            color: "neutral",
            variant: "soft",
            size: "sm",
            to: `/pmc/og-tickets/${vueExports.unref(id)}/edit`
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(canEdit)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Báo giá",
            icon: "i-lucide-file-plus",
            color: "success",
            variant: "soft",
            size: "sm",
            to: `/pmc/quotes/create?og_ticket_id=${vueExports.unref(id)}`
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(isCompleted)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Cập nhật SLA",
            icon: "i-lucide-clock-arrow-up",
            color: "neutral",
            variant: "soft",
            size: "sm",
            onClick: openSlaModal
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(acceptanceReportOrderId)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
            label: "Biên bản",
            icon: "i-lucide-clipboard-check",
            color: "primary",
            variant: "solid",
            size: "sm",
            onClick: ($event) => showAcceptanceReport.value = true
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UDropdownMenu, {
          items: [[
            ...vueExports.unref(canEdit) && !vueExports.unref(isCompleted) && vueExports.unref(ogTicket)?.is_from_pool ? [{ label: "Trả lại pool", icon: "i-lucide-undo-2", onSelect: openReleaseDialog }] : [],
            { label: "Xoá ticket", icon: "i-lucide-trash-2", color: "error", onSelect: () => vueExports.unref(openDeleteModal)(vueExports.unref(ogTicket)) }
          ]]
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-more-horizontal",
                color: "neutral",
                variant: "outline",
                size: "sm"
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-more-horizontal",
                  color: "neutral",
                  variant: "outline",
                  size: "sm"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (vueExports.unref(status) === "pending" && !vueExports.unref(ogTicket)) {
        _push(`<div class="flex flex-col gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(4, (i) => {
          _push(`<div class="h-24 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error) && !vueExports.unref(ogTicket)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, {
          error: vueExports.unref(error),
          retry: vueExports.unref(refresh)
        }, null, _parent));
      } else if (vueExports.unref(ogTicket)) {
        _push(`<div class="flex flex-col gap-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Giai đoạn xử lý" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOgTicketLifecycleStepper, {
                key: vueExports.unref(stepperKey),
                "og-ticket-id": vueExports.unref(ogTicket).id,
                "current-status": vueExports.unref(ogTicket).status.value,
                segments: vueExports.unref(lifecycleSegments),
                "quote-versions": vueExports.unref(quoteVersionsList),
                "active-quote-id": vueExports.unref(activeQuote)?.id ?? null,
                "active-quote-status": vueExports.unref(activeQuote)?.status?.value ?? null,
                "active-order-status": vueExports.unref(activeOrderStatus),
                "has-active-order": !!vueExports.unref(activeQuote)?.order,
                "account-options": vueExports.unref(accountOptions),
                "current-assignee-ids": (vueExports.unref(ogTicket).assignees ?? []).map((a) => a.id),
                "current-assignees": vueExports.unref(ogTicket).assignees ?? [],
                "is-terminal": vueExports.unref(isCancelled) || vueExports.unref(isCompleted),
                onTransition: handleTransition,
                onAssign: handleAssign,
                onCreateOrder: handleOpenCreateOrder
              }, null, _parent2, _scopeId));
              _push2(`<div class="mt-4 flex flex-wrap gap-4"${_scopeId}><div class="flex items-center gap-2 text-sm"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-clock",
                class: "size-4 text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-slate-600"${_scopeId}>SLA Báo giá:</span>`);
              if (vueExports.unref(ogTicket).sla_quote_due_at) {
                _push2(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass(vueExports.unref(isSlaQuoteViolated) ? "text-red-600 font-semibold" : "text-slate-900")}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).sla_quote_due_at))} `);
                if (vueExports.unref(isSlaQuoteViolated)) {
                  _push2(`<span class="text-red-500 text-xs ml-1"${_scopeId}>(Quá hạn)</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</span>`);
              } else {
                _push2(`<span class="text-slate-400"${_scopeId}>—</span>`);
              }
              _push2(`</div><div class="flex items-center gap-2 text-sm"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-calendar-check",
                class: "size-4 text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-slate-600"${_scopeId}>SLA Hoàn thành:</span>`);
              if (vueExports.unref(ogTicket).sla_completion_due_at) {
                _push2(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass(vueExports.unref(isSlaCompletionViolated) ? "text-red-600 font-semibold" : "text-slate-900")}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).sla_completion_due_at))} `);
                if (vueExports.unref(isSlaCompletionViolated)) {
                  _push2(`<span class="text-red-500 text-xs ml-1"${_scopeId}>(Quá hạn)</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</span>`);
              } else {
                _push2(`<span class="text-slate-400"${_scopeId}>—</span>`);
              }
              _push2(`</div></div>`);
              if (vueExports.unref(isRejected)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  icon: "i-lucide-x-circle",
                  color: "error",
                  title: "Báo giá bị từ chối",
                  description: "Cư dân đã từ chối báo giá. Vui lòng liên hệ lại hoặc cập nhật báo giá mới.",
                  variant: "subtle",
                  class: "mt-4"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(isCancelled)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                  icon: "i-lucide-ban",
                  color: "neutral",
                  title: "Ticket đã hủy",
                  description: vueExports.unref(ogTicket)?.is_from_pool ? "Ticket này đã được trả về pool và không thể chỉnh sửa." : "Ticket này đã bị huỷ và không thể chỉnh sửa.",
                  variant: "subtle",
                  class: "mt-4"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                (vueExports.openBlock(), vueExports.createBlock(_component_SharedOgTicketLifecycleStepper, {
                  key: vueExports.unref(stepperKey),
                  "og-ticket-id": vueExports.unref(ogTicket).id,
                  "current-status": vueExports.unref(ogTicket).status.value,
                  segments: vueExports.unref(lifecycleSegments),
                  "quote-versions": vueExports.unref(quoteVersionsList),
                  "active-quote-id": vueExports.unref(activeQuote)?.id ?? null,
                  "active-quote-status": vueExports.unref(activeQuote)?.status?.value ?? null,
                  "active-order-status": vueExports.unref(activeOrderStatus),
                  "has-active-order": !!vueExports.unref(activeQuote)?.order,
                  "account-options": vueExports.unref(accountOptions),
                  "current-assignee-ids": (vueExports.unref(ogTicket).assignees ?? []).map((a) => a.id),
                  "current-assignees": vueExports.unref(ogTicket).assignees ?? [],
                  "is-terminal": vueExports.unref(isCancelled) || vueExports.unref(isCompleted),
                  onTransition: handleTransition,
                  onAssign: handleAssign,
                  onCreateOrder: handleOpenCreateOrder
                }, null, 8, ["og-ticket-id", "current-status", "segments", "quote-versions", "active-quote-id", "active-quote-status", "active-order-status", "has-active-order", "account-options", "current-assignee-ids", "current-assignees", "is-terminal"])),
                vueExports.createVNode("div", { class: "mt-4 flex flex-wrap gap-4" }, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2 text-sm" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-clock",
                      class: "size-4 text-slate-400"
                    }),
                    vueExports.createVNode("span", { class: "text-slate-600" }, "SLA Báo giá:"),
                    vueExports.unref(ogTicket).sla_quote_due_at ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: vueExports.unref(isSlaQuoteViolated) ? "text-red-600 font-semibold" : "text-slate-900"
                    }, [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).sla_quote_due_at)) + " ", 1),
                      vueExports.unref(isSlaQuoteViolated) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-red-500 text-xs ml-1"
                      }, "(Quá hạn)")) : vueExports.createCommentVNode("", true)
                    ], 2)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ]),
                  vueExports.createVNode("div", { class: "flex items-center gap-2 text-sm" }, [
                    vueExports.createVNode(_component_UIcon, {
                      name: "i-lucide-calendar-check",
                      class: "size-4 text-slate-400"
                    }),
                    vueExports.createVNode("span", { class: "text-slate-600" }, "SLA Hoàn thành:"),
                    vueExports.unref(ogTicket).sla_completion_due_at ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: vueExports.unref(isSlaCompletionViolated) ? "text-red-600 font-semibold" : "text-slate-900"
                    }, [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).sla_completion_due_at)) + " ", 1),
                      vueExports.unref(isSlaCompletionViolated) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "text-red-500 text-xs ml-1"
                      }, "(Quá hạn)")) : vueExports.createCommentVNode("", true)
                    ], 2)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ])
                ]),
                vueExports.unref(isRejected) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 0,
                  icon: "i-lucide-x-circle",
                  color: "error",
                  title: "Báo giá bị từ chối",
                  description: "Cư dân đã từ chối báo giá. Vui lòng liên hệ lại hoặc cập nhật báo giá mới.",
                  variant: "subtle",
                  class: "mt-4"
                })) : vueExports.createCommentVNode("", true),
                vueExports.unref(isCancelled) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                  key: 1,
                  icon: "i-lucide-ban",
                  color: "neutral",
                  title: "Ticket đã hủy",
                  description: vueExports.unref(ogTicket)?.is_from_pool ? "Ticket này đã được trả về pool và không thể chỉnh sửa." : "Ticket này đã bị huỷ và không thể chỉnh sửa.",
                  variant: "subtle",
                  class: "mt-4"
                }, null, 8, ["description"])) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 flex flex-col gap-4"><div class="bg-white border border-border-gray rounded-xl shadow-sm p-1.5 flex items-center gap-1 overflow-x-auto"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(mainTabItems), (tab) => {
          _push(`<button type="button" class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(mainTab) === tab.key ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50", "group relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer"])}">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: tab.icon,
            class: "size-4"
          }, null, _parent));
          _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(tab.label)}</span>`);
          if (tab.badge) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              label: tab.badge.label,
              color: tab.badge.color,
              variant: vueExports.unref(mainTab) === tab.key ? "solid" : "subtle",
              size: "xs"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div><div class="bg-white border border-border-gray rounded-xl shadow-sm overflow-hidden" style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(mainTab) === "overview" ? null : { display: "none" })}"><div class="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div class="flex items-center gap-3"><h2 class="font-bold text-slate-900"> Thông tin ticket </h2><span class="font-mono text-xs font-semibold text-slate-500">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).ticket?.code ?? `#${vueExports.unref(ogTicket).ticket_id}`)}</span></div><div class="flex rounded-lg bg-slate-100 p-0.5 self-start sm:self-auto"><button class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(infoTab) === "og" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700", "px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer"])}"> OG Ticket </button><button class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(infoTab) === "original" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700", "px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer"])}"> Ticket gốc </button></div></div>`);
        if (vueExports.unref(infoTab) === "og") {
          _push(`<div class="px-4 sm:px-6 py-5 flex flex-col gap-5"><div class="grid grid-cols-1 sm:grid-cols-2 gap-5">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tiêu đề" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).subject)}</span>`);
              } else {
                return [
                  vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(ogTicket).subject), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Kênh tiếp nhận" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  label: vueExports.unref(ogTicket).channel?.label,
                  color: "neutral",
                  variant: "subtle",
                  size: "sm"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_UBadge, {
                    label: vueExports.unref(ogTicket).channel?.label,
                    color: "neutral",
                    variant: "subtle",
                    size: "sm"
                  }, null, 8, ["label"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<div class="sm:col-span-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mô tả" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="whitespace-pre-line"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).description || "—")}</span>`);
              } else {
                return [
                  vueExports.createVNode("span", { class: "whitespace-pre-line" }, vueExports.toDisplayString(vueExports.unref(ogTicket).description || "—"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Khách hàng" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(ogTicket).customer) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/customers/${vueExports.unref(ogTicket).customer.id}`,
                    class: "inline-flex items-center gap-1 font-medium text-primary-600 hover:underline"
                  }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).customer.full_name)} `);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-external-link",
                          class: "size-3.5"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).customer.full_name) + " ", 1),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-external-link",
                            class: "size-3.5"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).requester_name)}</span>`);
                }
              } else {
                return [
                  vueExports.unref(ogTicket).customer ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                    key: 0,
                    to: `/pmc/customers/${vueExports.unref(ogTicket).customer.id}`,
                    class: "inline-flex items-center gap-1 font-medium text-primary-600 hover:underline"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).customer.full_name) + " ", 1),
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-external-link",
                        class: "size-3.5"
                      })
                    ]),
                    _: 1
                  }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, vueExports.toDisplayString(vueExports.unref(ogTicket).requester_name), 1))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="font-mono"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(ogTicket).customer?.phone ?? vueExports.unref(ogTicket).requester_phone))}</span>`);
              } else {
                return [
                  vueExports.createVNode("span", { class: "font-mono" }, vueExports.toDisplayString(("formatPhone" in _ctx ? _ctx.formatPhone : vueExports.unref(formatPhone))(vueExports.unref(ogTicket).customer?.phone ?? vueExports.unref(ogTicket).requester_phone)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Căn hộ" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).apartment_name || "—")}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).apartment_name || "—"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Dự án" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).project?.name ?? "—")}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).project?.name ?? "—"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<div class="sm:col-span-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Danh mục" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center flex-wrap gap-1.5"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ogTicket).categories, (cat) => {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    key: cat.id,
                    label: cat.name,
                    color: "primary",
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
                if (!vueExports.unref(ogTicket).categories || vueExports.unref(ogTicket).categories.length === 0) {
                  _push2(`<span class="text-slate-400 text-sm"${_scopeId}>—</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-pencil",
                  size: "xs",
                  color: "neutral",
                  variant: "ghost",
                  class: "ml-1",
                  onClick: openCategoriesModal
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "flex items-center flex-wrap gap-1.5" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ogTicket).categories, (cat) => {
                      return vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                        key: cat.id,
                        label: cat.name,
                        color: "primary",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label"]);
                    }), 128)),
                    !vueExports.unref(ogTicket).categories || vueExports.unref(ogTicket).categories.length === 0 ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      class: "text-slate-400 text-sm"
                    }, "—")) : vueExports.createCommentVNode("", true),
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-pencil",
                      size: "xs",
                      color: "neutral",
                      variant: "ghost",
                      class: "ml-1",
                      onClick: openCategoriesModal
                    })
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
          if (vueExports.unref(ogTicket).address || vueExports.unref(hasLocation)) {
            _push(`<div class="border-t border-slate-100 pt-5">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Địa chỉ" }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).address || "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).address || "—"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
            if (vueExports.unref(hasLocation)) {
              _push(`<div class="mt-3"><button class="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer group">`);
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-map",
                class: "size-3.5"
              }, null, _parent));
              _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(showMap) ? "Ẩn bản đồ" : "Xem bản đồ")}</span>`);
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: vueExports.unref(showMap) ? "i-lucide-chevron-up" : "i-lucide-chevron-down",
                class: "size-3.5"
              }, null, _parent));
              _push(`</button>`);
              if (vueExports.unref(showMap)) {
                _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, null, {
                  fallback: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`<div class="mt-2 rounded-xl border border-slate-200 bg-slate-50 h-[250px] flex items-center justify-center"${_scopeId}><span class="material-symbols-outlined text-slate-300 animate-spin" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}"${_scopeId}>progress_activity</span></div>`);
                    } else {
                      return [
                        vueExports.createVNode("div", { class: "mt-2 rounded-xl border border-slate-200 bg-slate-50 h-[250px] flex items-center justify-center" }, [
                          vueExports.createVNode("span", {
                            class: "material-symbols-outlined text-slate-300 animate-spin",
                            style: { "font-size": "24px" }
                          }, "progress_activity")
                        ])
                      ];
                    }
                  })
                }, _parent));
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(ogTicket).attachments.length > 0) {
            _push(`<div class="border-t border-slate-100 pt-5"><div class="flex items-center gap-2 mb-3">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-paperclip",
              class: "size-4 text-slate-400"
            }, null, _parent));
            _push(`<span class="text-sm font-semibold text-slate-700">Tệp đính kèm OG</span><span class="text-xs text-slate-400">(${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).attachments.length)})</span></div><div class="flex flex-col gap-2"><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ogTicket).attachments, (att) => {
              _push(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", att.url)} target="_blank" class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 transition-colors"><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "bg-violet-100" : "bg-amber-100", "size-8 rounded-lg flex items-center justify-center shrink-0"])}">`);
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "i-lucide-image" : "i-lucide-file-text",
                class: ["size-4", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "text-violet-500" : "text-amber-600"]
              }, null, _parent));
              _push(`</div><div class="flex-1 min-w-0"><p class="text-xs font-medium text-slate-700 truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(att.original_name)}</p><p class="text-[10px] text-slate-400">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(att.size_bytes))}</p></div>`);
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-download",
                class: "size-4 text-slate-400"
              }, null, _parent));
              _push(`</a>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(infoTab) === "original") {
          _push(`<div class="px-4 sm:px-6 py-5 flex flex-col gap-5"><div class="grid grid-cols-1 sm:grid-cols-2 gap-5">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã ticket" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(ogTicket).ticket?.code) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ULink, {
                    to: vueExports.unref(residentTicketPath),
                    target: "_blank",
                    rel: "noopener",
                    class: "font-mono font-semibold inline-flex items-center gap-1 text-slate-900 hover:text-primary-600 hover:underline"
                  }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).ticket.code)} `);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-external-link",
                          class: "size-3.5"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).ticket.code) + " ", 1),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-external-link",
                            class: "size-3.5"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<span class="font-mono text-slate-400"${_scopeId}>—</span>`);
                }
              } else {
                return [
                  vueExports.unref(ogTicket).ticket?.code ? (vueExports.openBlock(), vueExports.createBlock(_component_ULink, {
                    key: 0,
                    to: vueExports.unref(residentTicketPath),
                    target: "_blank",
                    rel: "noopener",
                    class: "font-mono font-semibold inline-flex items-center gap-1 text-slate-900 hover:text-primary-600 hover:underline"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).ticket.code) + " ", 1),
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-external-link",
                        class: "size-3.5"
                      })
                    ]),
                    _: 1
                  }, 8, ["to"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 1,
                    class: "font-mono text-slate-400"
                  }, "—"))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(ogTicket).ticket) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(vueExports.unref(ogTicket).ticket.status.value),
                    label: vueExports.unref(ogTicket).ticket.status.label,
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  vueExports.unref(ogTicket).ticket ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                    key: 0,
                    color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(vueExports.unref(ogTicket).ticket.status.value),
                    label: vueExports.unref(ogTicket).ticket.status.label,
                    variant: "subtle",
                    size: "sm"
                  }, null, 8, ["color", "label"])) : vueExports.createCommentVNode("", true)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tiêu đề" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).ticket?.subject ?? "—")}</span>`);
              } else {
                return [
                  vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(ogTicket).ticket?.subject ?? "—"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Kênh tiếp nhận" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(ogTicket).ticket?.channel) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: vueExports.unref(ogTicket).ticket.channel.label,
                    color: "neutral",
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<span class="text-slate-400"${_scopeId}>—</span>`);
                }
              } else {
                return [
                  vueExports.unref(ogTicket).ticket?.channel ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                    key: 0,
                    label: vueExports.unref(ogTicket).ticket.channel.label,
                    color: "neutral",
                    variant: "subtle",
                    size: "sm"
                  }, null, 8, ["label"])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 1,
                    class: "text-slate-400"
                  }, "—"))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người gửi" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).ticket?.requester_name ?? "—")}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).ticket?.requester_name ?? "—"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).ticket?.requester_phone ?? "—")}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).ticket?.requester_phone ?? "—"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày gửi" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).ticket?.created_at ?? null))}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).ticket?.created_at ?? null)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
          if (vueExports.unref(ogTicket).ticket?.description) {
            _push(`<div class="border-t border-slate-100 pt-5">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mô tả" }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="whitespace-pre-line"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).ticket.description)}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", { class: "whitespace-pre-line" }, vueExports.toDisplayString(vueExports.unref(ogTicket).ticket.description), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(ogTicket).ticket?.address) {
            _push(`<div class="border-t border-slate-100 pt-5">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Địa chỉ" }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).ticket.address)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).ticket.address), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(ticketAttachments).length > 0) {
            _push(`<div class="border-t border-slate-100 pt-5"><div class="flex items-center gap-2 mb-3">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-paperclip",
              class: "size-4 text-slate-400"
            }, null, _parent));
            _push(`<span class="text-sm font-semibold text-slate-700">Tệp từ cư dân</span><span class="text-xs text-slate-400">(${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticketAttachments).length)})</span></div>`);
            if (vueExports.unref(imageAttachments).length > 0) {
              _push(`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-3"><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(imageAttachments), (img) => {
                _push(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", img.url)} target="_blank" class="group relative rounded-lg border border-slate-200 overflow-hidden aspect-square bg-slate-50 hover:shadow-md transition-shadow"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", img.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", img.original_name)} class="w-full h-full object-cover"><div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><p class="text-white text-[10px] truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(img.original_name)}</p></div></a>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            if (vueExports.unref(docAttachments).length > 0) {
              _push(`<div class="flex flex-col gap-2"><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(docAttachments), (doc) => {
                _push(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", doc.url)} target="_blank" class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"><div class="size-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">`);
                _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-file-text",
                  class: "size-4 text-amber-600"
                }, null, _parent));
                _push(`</div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-slate-700 truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(doc.original_name)}</p><p class="text-xs text-slate-400">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(doc.size_bytes))}</p></div>`);
                _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-download",
                  class: "size-4 text-slate-400"
                }, null, _parent));
                _push(`</a>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<div class="border-t border-slate-100 pt-5"><p class="text-sm text-slate-400 italic"> Không có tệp đính kèm từ cư dân. </p></div>`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-6" style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(mainTab) === "survey" ? null : { display: "none" })}">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_OgTicketSurveyTab, {
          "og-ticket-id": vueExports.unref(ogTicket).id
        }, null, _parent));
        _push(`</div><div class="flex flex-col gap-6" style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(mainTab) === "commerce" ? null : { display: "none" })}">`);
        if (!vueExports.unref(activeQuote) && !vueExports.unref(ogTicket).payment_status && !vueExports.unref(ogTicket).reconciliation_status) {
          _push(`<div class="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center"><div class="size-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-receipt",
            class: "size-6 text-slate-300"
          }, null, _parent));
          _push(`</div><p class="text-sm font-semibold text-slate-600 mb-1"> Chưa có thông tin thương mại </p><p class="text-xs text-slate-400 mb-4"> Tạo báo giá để bắt đầu quy trình báo giá → duyệt → thanh toán. </p>`);
          if (vueExports.unref(canEdit)) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Tạo báo giá",
              icon: "i-lucide-file-plus",
              color: "success",
              variant: "soft",
              size: "sm",
              to: `/pmc/quotes/create?og_ticket_id=${vueExports.unref(id)}`
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(activeQuote)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Báo giá" }, {
            "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                  to: `/pmc/quotes/${vueExports.unref(activeQuote).id}`
                }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                        label: "Xem chi tiết",
                        icon: "i-lucide-external-link",
                        size: "xs",
                        color: "primary",
                        variant: "ghost"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        vueExports.createVNode(_component_UButton, {
                          label: "Xem chi tiết",
                          icon: "i-lucide-external-link",
                          size: "xs",
                          color: "primary",
                          variant: "ghost"
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_NuxtLink, {
                    to: `/pmc/quotes/${vueExports.unref(activeQuote).id}`
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UButton, {
                        label: "Xem chi tiết",
                        icon: "i-lucide-external-link",
                        size: "xs",
                        color: "primary",
                        variant: "ghost"
                      })
                    ]),
                    _: 1
                  }, 8, ["to"])
                ];
              }
            }),
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center gap-2 mb-3"${_scopeId}><span class="font-mono text-xs font-semibold text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activeQuote).code)}</span>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  label: vueExports.unref(activeQuote).status.label,
                  color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(vueExports.unref(activeQuote).status.value),
                  variant: "subtle",
                  size: "xs"
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  label: "Còn hiệu lực",
                  color: "success",
                  variant: "subtle",
                  size: "xs"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="flex flex-col gap-1.5"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(activeQuote).lines, (line) => {
                  _push2(`<div class="flex items-center justify-between text-xs"${_scopeId}><span class="text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(line.name)}</span><span class="text-slate-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(line.quantity)} ${serverRenderer_cjs_prodExports.ssrInterpolate(line.unit)} × ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.unit_price))} = <span class="font-medium text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.line_amount))}</span></span></div>`);
                });
                _push2(`<!--]--></div><div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-100"${_scopeId}><span class="text-sm font-medium text-slate-600"${_scopeId}>Tổng tiền</span><span class="text-sm font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(activeQuote).total_amount))}</span></div>`);
                if (vueExports.unref(draftReplacement)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "warning",
                    variant: "subtle",
                    icon: "i-lucide-file-edit",
                    class: "mt-3"
                  }, {
                    title: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(` Có báo giá mới đang chờ duyệt `);
                      } else {
                        return [
                          vueExports.createTextVNode(" Có báo giá mới đang chờ duyệt ")
                        ];
                      }
                    }),
                    description: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                          to: `/pmc/quotes/${vueExports.unref(draftReplacement).id}`,
                          class: "font-mono text-xs font-semibold underline"
                        }, {
                          default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(draftReplacement).code)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(draftReplacement).code), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent3, _scopeId2));
                        _push3(`<span class="ml-1"${_scopeId2}>(${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(draftReplacement).status.label)})</span> — Báo giá này sẽ thay thế báo giá hiện tại khi được quản lý duyệt. `);
                      } else {
                        return [
                          vueExports.createVNode(_component_NuxtLink, {
                            to: `/pmc/quotes/${vueExports.unref(draftReplacement).id}`,
                            class: "font-mono text-xs font-semibold underline"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(draftReplacement).code), 1)
                            ]),
                            _: 1
                          }, 8, ["to"]),
                          vueExports.createVNode("span", { class: "ml-1" }, "(" + vueExports.toDisplayString(vueExports.unref(draftReplacement).status.label) + ")", 1),
                          vueExports.createTextVNode(" — Báo giá này sẽ thay thế báo giá hiện tại khi được quản lý duyệt. ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(activeQuote).order) {
                  _push2(`<div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="text-sm font-medium text-slate-600"${_scopeId}>Đơn hàng</span><span class="font-mono text-xs font-semibold text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activeQuote).order.code)}</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: vueExports.unref(activeQuote).order.status.label,
                    color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(activeQuote).order.status.value),
                    variant: "subtle",
                    size: "xs"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                    to: `/pmc/orders/${vueExports.unref(activeQuote).order.id}`
                  }, {
                    default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                          icon: "i-lucide-external-link",
                          size: "xs",
                          color: "primary",
                          variant: "ghost"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          vueExports.createVNode(_component_UButton, {
                            icon: "i-lucide-external-link",
                            size: "xs",
                            color: "primary",
                            variant: "ghost"
                          })
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
                  vueExports.createVNode("div", { class: "flex items-center gap-2 mb-3" }, [
                    vueExports.createVNode("span", { class: "font-mono text-xs font-semibold text-slate-700" }, vueExports.toDisplayString(vueExports.unref(activeQuote).code), 1),
                    vueExports.createVNode(_component_UBadge, {
                      label: vueExports.unref(activeQuote).status.label,
                      color: ("quoteStatusColor" in _ctx ? _ctx.quoteStatusColor : vueExports.unref(quoteStatusColor))(vueExports.unref(activeQuote).status.value),
                      variant: "subtle",
                      size: "xs"
                    }, null, 8, ["label", "color"]),
                    vueExports.createVNode(_component_UBadge, {
                      label: "Còn hiệu lực",
                      color: "success",
                      variant: "subtle",
                      size: "xs"
                    })
                  ]),
                  vueExports.createVNode("div", { class: "flex flex-col gap-1.5" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(activeQuote).lines, (line) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: line.id,
                        class: "flex items-center justify-between text-xs"
                      }, [
                        vueExports.createVNode("span", { class: "text-slate-700" }, vueExports.toDisplayString(line.name), 1),
                        vueExports.createVNode("span", { class: "text-slate-500" }, [
                          vueExports.createTextVNode(vueExports.toDisplayString(line.quantity) + " " + vueExports.toDisplayString(line.unit) + " × " + vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.unit_price)) + " = ", 1),
                          vueExports.createVNode("span", { class: "font-medium text-slate-700" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(line.line_amount)), 1)
                        ])
                      ]);
                    }), 128))
                  ]),
                  vueExports.createVNode("div", { class: "flex items-center justify-between mt-3 pt-3 border-t border-slate-100" }, [
                    vueExports.createVNode("span", { class: "text-sm font-medium text-slate-600" }, "Tổng tiền"),
                    vueExports.createVNode("span", { class: "text-sm font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(activeQuote).total_amount)), 1)
                  ]),
                  vueExports.unref(draftReplacement) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                    key: 0,
                    color: "warning",
                    variant: "subtle",
                    icon: "i-lucide-file-edit",
                    class: "mt-3"
                  }, {
                    title: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" Có báo giá mới đang chờ duyệt ")
                    ]),
                    description: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_NuxtLink, {
                        to: `/pmc/quotes/${vueExports.unref(draftReplacement).id}`,
                        class: "font-mono text-xs font-semibold underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(draftReplacement).code), 1)
                        ]),
                        _: 1
                      }, 8, ["to"]),
                      vueExports.createVNode("span", { class: "ml-1" }, "(" + vueExports.toDisplayString(vueExports.unref(draftReplacement).status.label) + ")", 1),
                      vueExports.createTextVNode(" — Báo giá này sẽ thay thế báo giá hiện tại khi được quản lý duyệt. ")
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true),
                  vueExports.unref(activeQuote).order ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "mt-3 pt-3 border-t border-slate-100 flex items-center justify-between"
                  }, [
                    vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                      vueExports.createVNode("span", { class: "text-sm font-medium text-slate-600" }, "Đơn hàng"),
                      vueExports.createVNode("span", { class: "font-mono text-xs font-semibold text-slate-700" }, vueExports.toDisplayString(vueExports.unref(activeQuote).order.code), 1),
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(activeQuote).order.status.label,
                        color: ("orderStatusColor" in _ctx ? _ctx.orderStatusColor : vueExports.unref(orderStatusColor))(vueExports.unref(activeQuote).order.status.value),
                        variant: "subtle",
                        size: "xs"
                      }, null, 8, ["label", "color"])
                    ]),
                    vueExports.createVNode(_component_NuxtLink, {
                      to: `/pmc/orders/${vueExports.unref(activeQuote).order.id}`
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_UButton, {
                          icon: "i-lucide-external-link",
                          size: "xs",
                          color: "primary",
                          variant: "ghost"
                        })
                      ]),
                      _: 1
                    }, 8, ["to"])
                  ])) : vueExports.createCommentVNode("", true)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(ogTicket).payment_status || vueExports.unref(ogTicket).reconciliation_status) {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
          if (vueExports.unref(ogTicket).payment_status && vueExports.unref(ogTicket).payment_status.receivable_id) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              to: `/pmc/receivables/${vueExports.unref(ogTicket).payment_status.receivable_id}`,
              class: "group relative overflow-hidden rounded-xl border border-border-gray bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([paymentAccentBar(vueExports.unref(ogTicket).payment_status.color), "absolute inset-x-0 top-0 h-1"])}"${_scopeId}></div><div class="p-4 sm:p-5"${_scopeId}><div class="flex items-start justify-between gap-3 mb-3"${_scopeId}><div class="flex items-center gap-2.5 min-w-0"${_scopeId}><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([paymentIconBg(vueExports.unref(ogTicket).payment_status.color), "size-9 rounded-lg flex items-center justify-center shrink-0"])}"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-wallet",
                    class: ["size-5", paymentIconFg(vueExports.unref(ogTicket).payment_status.color)]
                  }, null, _parent2, _scopeId));
                  _push2(`</div><div class="min-w-0"${_scopeId}><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-none"${_scopeId}> Thanh toán </p><h3 class="font-bold text-slate-900 text-sm mt-1 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).payment_status.label)}</h3></div></div>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: vueExports.unref(ogTicket).payment_status.label,
                    color: toBadgeColor(vueExports.unref(ogTicket).payment_status.color),
                    variant: "subtle",
                    size: "xs"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                  if (vueExports.unref(ogTicket).payment_status.amount) {
                    _push2(`<div class="mt-3"${_scopeId}><div class="flex items-baseline justify-between mb-1.5"${_scopeId}><span class="text-xs text-slate-500"${_scopeId}>Đã thu</span><span class="font-bold text-slate-900 text-sm"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ogTicket).payment_status.paid_amount ?? "0"))} <span class="text-slate-300 font-normal mx-0.5"${_scopeId}>/</span><span class="text-slate-600 font-semibold"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ogTicket).payment_status.amount))}</span></span></div><div class="h-2 rounded-full bg-slate-100 overflow-hidden"${_scopeId}><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([paymentBarFill(vueExports.unref(ogTicket).payment_status.color), "h-full rounded-full transition-all duration-500"])}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: paymentProgress(vueExports.unref(ogTicket).payment_status.paid_amount, vueExports.unref(ogTicket).payment_status.amount) + "%" })}"${_scopeId}></div></div></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<div class="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-primary-600 transition-colors"${_scopeId}><span${_scopeId}>Xem công nợ</span>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "size-3.5 group-hover:translate-x-0.5 transition-transform"
                  }, null, _parent2, _scopeId));
                  _push2(`</div></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", {
                      class: ["absolute inset-x-0 top-0 h-1", paymentAccentBar(vueExports.unref(ogTicket).payment_status.color)]
                    }, null, 2),
                    vueExports.createVNode("div", { class: "p-4 sm:p-5" }, [
                      vueExports.createVNode("div", { class: "flex items-start justify-between gap-3 mb-3" }, [
                        vueExports.createVNode("div", { class: "flex items-center gap-2.5 min-w-0" }, [
                          vueExports.createVNode("div", {
                            class: ["size-9 rounded-lg flex items-center justify-center shrink-0", paymentIconBg(vueExports.unref(ogTicket).payment_status.color)]
                          }, [
                            vueExports.createVNode(_component_UIcon, {
                              name: "i-lucide-wallet",
                              class: ["size-5", paymentIconFg(vueExports.unref(ogTicket).payment_status.color)]
                            }, null, 8, ["class"])
                          ], 2),
                          vueExports.createVNode("div", { class: "min-w-0" }, [
                            vueExports.createVNode("p", { class: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-none" }, " Thanh toán "),
                            vueExports.createVNode("h3", { class: "font-bold text-slate-900 text-sm mt-1 truncate" }, vueExports.toDisplayString(vueExports.unref(ogTicket).payment_status.label), 1)
                          ])
                        ]),
                        vueExports.createVNode(_component_UBadge, {
                          label: vueExports.unref(ogTicket).payment_status.label,
                          color: toBadgeColor(vueExports.unref(ogTicket).payment_status.color),
                          variant: "subtle",
                          size: "xs"
                        }, null, 8, ["label", "color"])
                      ]),
                      vueExports.unref(ogTicket).payment_status.amount ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "mt-3"
                      }, [
                        vueExports.createVNode("div", { class: "flex items-baseline justify-between mb-1.5" }, [
                          vueExports.createVNode("span", { class: "text-xs text-slate-500" }, "Đã thu"),
                          vueExports.createVNode("span", { class: "font-bold text-slate-900 text-sm" }, [
                            vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ogTicket).payment_status.paid_amount ?? "0")) + " ", 1),
                            vueExports.createVNode("span", { class: "text-slate-300 font-normal mx-0.5" }, "/"),
                            vueExports.createVNode("span", { class: "text-slate-600 font-semibold" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ogTicket).payment_status.amount)), 1)
                          ])
                        ]),
                        vueExports.createVNode("div", { class: "h-2 rounded-full bg-slate-100 overflow-hidden" }, [
                          vueExports.createVNode("div", {
                            class: ["h-full rounded-full transition-all duration-500", paymentBarFill(vueExports.unref(ogTicket).payment_status.color)],
                            style: { width: paymentProgress(vueExports.unref(ogTicket).payment_status.paid_amount, vueExports.unref(ogTicket).payment_status.amount) + "%" }
                          }, null, 6)
                        ])
                      ])) : vueExports.createCommentVNode("", true),
                      vueExports.createVNode("div", { class: "mt-3 flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-primary-600 transition-colors" }, [
                        vueExports.createVNode("span", null, "Xem công nợ"),
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-arrow-right",
                          class: "size-3.5 group-hover:translate-x-0.5 transition-transform"
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else if (vueExports.unref(ogTicket).reconciliation_status) {
            _push(`<div class="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 flex items-center gap-3">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-wallet",
              class: "size-5 text-slate-300"
            }, null, _parent));
            _push(`<div><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider"> Thanh toán </p><p class="text-sm text-slate-400 mt-0.5"> Chưa phát sinh công nợ </p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(ogTicket).reconciliation_status) {
            _push(`<div class="relative overflow-hidden rounded-xl border border-border-gray bg-white shadow-sm"><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([reconciliationAccentBar(vueExports.unref(ogTicket).reconciliation_status.value), "absolute inset-x-0 top-0 h-1"])}"></div><div class="p-4 sm:p-5"><div class="flex items-start justify-between gap-3 mb-3"><div class="flex items-center gap-2.5 min-w-0"><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([reconciliationIconBg(vueExports.unref(ogTicket).reconciliation_status.value), "size-9 rounded-lg flex items-center justify-center shrink-0"])}">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
              name: reconciliationIcon(vueExports.unref(ogTicket).reconciliation_status.value),
              class: ["size-5", reconciliationIconFg(vueExports.unref(ogTicket).reconciliation_status.value)]
            }, null, _parent));
            _push(`</div><div class="min-w-0"><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-none"> Đối soát </p><h3 class="font-bold text-slate-900 text-sm mt-1 truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).reconciliation_status.label)}</h3></div></div>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              label: vueExports.unref(ogTicket).reconciliation_status.label,
              color: toBadgeColor(vueExports.unref(ogTicket).reconciliation_status.color),
              variant: "subtle",
              size: "xs"
            }, null, _parent));
            _push(`</div><div class="mt-3"><div class="flex items-baseline justify-between mb-1.5"><span class="text-xs text-slate-500">Đã đối soát</span><span class="font-bold text-slate-900 text-sm">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ogTicket).reconciliation_status.reconciled_amount))} <span class="text-slate-300 font-normal mx-0.5">/</span><span class="text-slate-600 font-semibold">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ogTicket).reconciliation_status.amount))}</span></span></div><div class="h-2 rounded-full bg-slate-100 overflow-hidden"><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([reconciliationBarFill(vueExports.unref(ogTicket).reconciliation_status.value), "h-full rounded-full transition-all duration-500"])}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: paymentProgress(vueExports.unref(ogTicket).reconciliation_status.reconciled_amount, vueExports.unref(ogTicket).reconciliation_status.amount) + "%" })}"></div></div></div>`);
            if (vueExports.unref(ogTicket).reconciliation_status.count_total > 0) {
              _push(`<div class="mt-3 flex items-center gap-2 text-xs text-slate-500">`);
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-file-check-2",
                class: "size-3.5 shrink-0"
              }, null, _parent));
              _push(`<span class="font-medium">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).reconciliation_status.count_reconciled)}/${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).reconciliation_status.count_total)} chứng từ `);
              if (Number(vueExports.unref(ogTicket).reconciliation_status.pending_amount) > 0) {
                _push(`<span class="text-amber-600 ml-1"> (còn ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(ogTicket).reconciliation_status.pending_amount))} chờ duyệt) </span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-6" style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(mainTab) === "acceptance" ? null : { display: "none" })}">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Rating cư dân" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedTicketRatingDisplay, {
                rating: vueExports.unref(ogTicket).resident_rating ?? null,
                comment: vueExports.unref(ogTicket).resident_rating_comment ?? null,
                "rated-at": vueExports.unref(ogTicket).resident_rated_at ?? null
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedTicketRatingDisplay, {
                  rating: vueExports.unref(ogTicket).resident_rating ?? null,
                  comment: vueExports.unref(ogTicket).resident_rating_comment ?? null,
                  "rated-at": vueExports.unref(ogTicket).resident_rated_at ?? null
                }, null, 8, ["rating", "comment", "rated-at"])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(hasAcceptanceReportOrder)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Biên bản nghiệm thu" }, {
            "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
                if (vueExports.unref(acceptanceReport)?.is_confirmed) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: "success",
                    variant: "subtle",
                    size: "xs",
                    icon: "i-lucide-check-circle",
                    label: "Cư dân đã xác nhận"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: "warning",
                    variant: "subtle",
                    size: "xs",
                    icon: "i-lucide-clock",
                    label: "Chờ xác nhận"
                  }, null, _parent2, _scopeId));
                }
                if (vueExports.unref(acceptanceReport)?.has_signed_file) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    color: "primary",
                    variant: "subtle",
                    size: "xs",
                    icon: "i-lucide-file-signature",
                    label: "Đã có bản ký"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "flex items-center gap-2" }, [
                    vueExports.unref(acceptanceReport)?.is_confirmed ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      color: "success",
                      variant: "subtle",
                      size: "xs",
                      icon: "i-lucide-check-circle",
                      label: "Cư dân đã xác nhận"
                    })) : (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 1,
                      color: "warning",
                      variant: "subtle",
                      size: "xs",
                      icon: "i-lucide-clock",
                      label: "Chờ xác nhận"
                    })),
                    vueExports.unref(acceptanceReport)?.has_signed_file ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 2,
                      color: "primary",
                      variant: "subtle",
                      size: "xs",
                      icon: "i-lucide-file-signature",
                      label: "Đã có bản ký"
                    })) : vueExports.createCommentVNode("", true)
                  ])
                ];
              }
            }),
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex flex-col gap-3"${_scopeId}>`);
                if (vueExports.unref(acceptanceReport)?.is_confirmed && vueExports.unref(acceptanceReport)?.confirmed_signature_name) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "success",
                    variant: "subtle",
                    icon: "i-lucide-user-check",
                    title: `${vueExports.unref(acceptanceReport).confirmed_signature_name} đã xác nhận online`,
                    description: vueExports.unref(acceptanceReport).confirmed_at ? `Thời điểm: ${("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(acceptanceReport).confirmed_at)}${vueExports.unref(acceptanceReport).confirmed_note ? ` — ${vueExports.unref(acceptanceReport).confirmed_note}` : ""}` : void 0
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(acceptanceReport)?.has_signed_file && vueExports.unref(acceptanceReport)?.signed_file_url) {
                  _push2(`<div class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50"${_scopeId}><div class="size-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-file-check",
                    class: "text-emerald-500 size-5"
                  }, null, _parent2, _scopeId));
                  _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><p class="text-sm font-semibold text-slate-800 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(acceptanceReport).signed_file_original_name ?? "Biên bản đã ký")}</p><p class="text-xs text-slate-500 mt-0.5"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(Number(vueExports.unref(acceptanceReport).signed_file_size) || 0))} `);
                  if (vueExports.unref(acceptanceReport).signed_uploaded_at) {
                    _push2(`<!--[--> · Tải lên ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(acceptanceReport).signed_uploaded_at))}<!--]-->`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</p></div>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    to: vueExports.unref(acceptanceReport).signed_file_url,
                    target: "_blank",
                    icon: "i-lucide-external-link",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    label: "Xem"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                    color: "neutral",
                    variant: "subtle",
                    icon: "i-lucide-file-warning",
                    title: "Chưa có bản ký giấy",
                    description: "Sau khi cư dân ký trên giấy, hãy tải lên bản scan/ảnh qua nút bên dưới."
                  }, null, _parent2, _scopeId));
                }
                _push2(`<div class="flex justify-end"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-clipboard-check",
                  color: "primary",
                  variant: "soft",
                  size: "sm",
                  label: "Mở biên bản",
                  onClick: ($event) => showAcceptanceReport.value = true
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "flex flex-col gap-3" }, [
                    vueExports.unref(acceptanceReport)?.is_confirmed && vueExports.unref(acceptanceReport)?.confirmed_signature_name ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                      key: 0,
                      color: "success",
                      variant: "subtle",
                      icon: "i-lucide-user-check",
                      title: `${vueExports.unref(acceptanceReport).confirmed_signature_name} đã xác nhận online`,
                      description: vueExports.unref(acceptanceReport).confirmed_at ? `Thời điểm: ${("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(acceptanceReport).confirmed_at)}${vueExports.unref(acceptanceReport).confirmed_note ? ` — ${vueExports.unref(acceptanceReport).confirmed_note}` : ""}` : void 0
                    }, null, 8, ["title", "description"])) : vueExports.createCommentVNode("", true),
                    vueExports.unref(acceptanceReport)?.has_signed_file && vueExports.unref(acceptanceReport)?.signed_file_url ? (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50"
                    }, [
                      vueExports.createVNode("div", { class: "size-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0" }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-file-check",
                          class: "text-emerald-500 size-5"
                        })
                      ]),
                      vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                        vueExports.createVNode("p", { class: "text-sm font-semibold text-slate-800 truncate" }, vueExports.toDisplayString(vueExports.unref(acceptanceReport).signed_file_original_name ?? "Biên bản đã ký"), 1),
                        vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-0.5" }, [
                          vueExports.createTextVNode(vueExports.toDisplayString(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(Number(vueExports.unref(acceptanceReport).signed_file_size) || 0)) + " ", 1),
                          vueExports.unref(acceptanceReport).signed_uploaded_at ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                            vueExports.createTextVNode(" · Tải lên " + vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(acceptanceReport).signed_uploaded_at)), 1)
                          ], 64)) : vueExports.createCommentVNode("", true)
                        ])
                      ]),
                      vueExports.createVNode(_component_UButton, {
                        to: vueExports.unref(acceptanceReport).signed_file_url,
                        target: "_blank",
                        icon: "i-lucide-external-link",
                        color: "neutral",
                        variant: "ghost",
                        size: "sm",
                        label: "Xem"
                      }, null, 8, ["to"])
                    ])) : (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                      key: 2,
                      color: "neutral",
                      variant: "subtle",
                      icon: "i-lucide-file-warning",
                      title: "Chưa có bản ký giấy",
                      description: "Sau khi cư dân ký trên giấy, hãy tải lên bản scan/ảnh qua nút bên dưới."
                    })),
                    vueExports.createVNode("div", { class: "flex justify-end" }, [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-clipboard-check",
                        color: "primary",
                        variant: "soft",
                        size: "sm",
                        label: "Mở biên bản",
                        onClick: ($event) => showAcceptanceReport.value = true
                      }, null, 8, ["onClick"])
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (!vueExports.unref(hasAcceptanceReportOrder)) {
          _push(`<div class="bg-white border border-dashed border-slate-200 rounded-xl p-8 text-center">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-clipboard-check",
            class: "size-6 text-slate-300 mx-auto mb-3"
          }, null, _parent));
          _push(`<p class="text-sm text-slate-500 font-medium mb-1"> Chưa có biên bản nghiệm thu </p><p class="text-xs text-slate-400"> Biên bản sẽ xuất hiện sau khi có đơn hàng được nghiệm thu. </p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-6" style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(mainTab) === "warranty" ? null : { display: "none" })}">`);
        if (vueExports.unref(warrantyRequests).length === 0) {
          _push(`<div class="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center"><div class="size-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-shield-check",
            class: "size-6 text-slate-300"
          }, null, _parent));
          _push(`</div><p class="text-sm font-semibold text-slate-600 mb-1"> Không có yêu cầu bảo hành </p><p class="text-xs text-slate-400"> Cư dân có thể gửi yêu cầu bảo hành trong 12 tháng sau khi đơn hàng hoàn tất. </p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(warrantyRequests).length > 0) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Yêu cầu bảo hành" }, {
            "header-actions": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  label: `${vueExports.unref(warrantyRequests).length}`,
                  color: "warning",
                  variant: "subtle",
                  size: "xs"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_UBadge, {
                    label: `${vueExports.unref(warrantyRequests).length}`,
                    color: "warning",
                    variant: "subtle",
                    size: "xs"
                  }, null, 8, ["label"])
                ];
              }
            }),
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex flex-col gap-4"${_scopeId}><!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(warrantyRequests), (wr) => {
                  _push2(`<div class="border border-slate-200 rounded-lg p-4"${_scopeId}><div class="flex items-start justify-between gap-3 mb-2"${_scopeId}><div class="flex items-center gap-2 min-w-0"${_scopeId}>`);
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-shield-alert",
                    class: "size-4 text-amber-500 shrink-0"
                  }, null, _parent2, _scopeId));
                  _push2(`<span class="font-semibold text-sm text-slate-900 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(wr.subject)}</span></div><span class="text-[11px] text-slate-400 whitespace-nowrap shrink-0"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(wr.created_at))}</span></div><p class="text-xs text-slate-500 mb-1"${_scopeId}> Người yêu cầu: <span class="font-medium text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(wr.requester_name)}</span></p><p class="text-sm text-slate-700 whitespace-pre-line mt-2"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(wr.description)}</p>`);
                  if (wr.attachments.length > 0) {
                    _push2(`<div class="mt-3 pt-3 border-t border-slate-100"${_scopeId}><div class="flex items-center gap-1.5 mb-2"${_scopeId}>`);
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-paperclip",
                      class: "size-3.5 text-slate-400"
                    }, null, _parent2, _scopeId));
                    _push2(`<span class="text-xs text-slate-500"${_scopeId}>Tệp đính kèm (${serverRenderer_cjs_prodExports.ssrInterpolate(wr.attachments.length)})</span></div><div class="flex flex-col gap-1.5"${_scopeId}><!--[-->`);
                    serverRenderer_cjs_prodExports.ssrRenderList(wr.attachments, (att) => {
                      _push2(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", att.url ?? void 0)} target="_blank" class="flex items-center gap-2.5 rounded-md border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50 transition-colors"${_scopeId}><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "bg-violet-100" : "bg-amber-100", "size-6 rounded flex items-center justify-center shrink-0"])}"${_scopeId}>`);
                      _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                        name: ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "i-lucide-image" : "i-lucide-file-text",
                        class: ["size-3.5", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "text-violet-500" : "text-amber-600"]
                      }, null, _parent2, _scopeId));
                      _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><p class="text-xs font-medium text-slate-700 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(att.original_name)}</p><p class="text-[10px] text-slate-400"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(att.size_bytes))}</p></div>`);
                      _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-download",
                        class: "size-3.5 text-slate-400"
                      }, null, _parent2, _scopeId));
                      _push2(`</a>`);
                    });
                    _push2(`<!--]--></div></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "flex flex-col gap-4" }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(warrantyRequests), (wr) => {
                      return vueExports.openBlock(), vueExports.createBlock("div", {
                        key: wr.id,
                        class: "border border-slate-200 rounded-lg p-4"
                      }, [
                        vueExports.createVNode("div", { class: "flex items-start justify-between gap-3 mb-2" }, [
                          vueExports.createVNode("div", { class: "flex items-center gap-2 min-w-0" }, [
                            vueExports.createVNode(_component_UIcon, {
                              name: "i-lucide-shield-alert",
                              class: "size-4 text-amber-500 shrink-0"
                            }),
                            vueExports.createVNode("span", { class: "font-semibold text-sm text-slate-900 truncate" }, vueExports.toDisplayString(wr.subject), 1)
                          ]),
                          vueExports.createVNode("span", { class: "text-[11px] text-slate-400 whitespace-nowrap shrink-0" }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(wr.created_at)), 1)
                        ]),
                        vueExports.createVNode("p", { class: "text-xs text-slate-500 mb-1" }, [
                          vueExports.createTextVNode(" Người yêu cầu: "),
                          vueExports.createVNode("span", { class: "font-medium text-slate-700" }, vueExports.toDisplayString(wr.requester_name), 1)
                        ]),
                        vueExports.createVNode("p", { class: "text-sm text-slate-700 whitespace-pre-line mt-2" }, vueExports.toDisplayString(wr.description), 1),
                        wr.attachments.length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 0,
                          class: "mt-3 pt-3 border-t border-slate-100"
                        }, [
                          vueExports.createVNode("div", { class: "flex items-center gap-1.5 mb-2" }, [
                            vueExports.createVNode(_component_UIcon, {
                              name: "i-lucide-paperclip",
                              class: "size-3.5 text-slate-400"
                            }),
                            vueExports.createVNode("span", { class: "text-xs text-slate-500" }, "Tệp đính kèm (" + vueExports.toDisplayString(wr.attachments.length) + ")", 1)
                          ]),
                          vueExports.createVNode("div", { class: "flex flex-col gap-1.5" }, [
                            (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(wr.attachments, (att) => {
                              return vueExports.openBlock(), vueExports.createBlock("a", {
                                key: att.id,
                                href: att.url ?? void 0,
                                target: "_blank",
                                class: "flex items-center gap-2.5 rounded-md border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50 transition-colors"
                              }, [
                                vueExports.createVNode("div", {
                                  class: ["size-6 rounded flex items-center justify-center shrink-0", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "bg-violet-100" : "bg-amber-100"]
                                }, [
                                  vueExports.createVNode(_component_UIcon, {
                                    name: ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "i-lucide-image" : "i-lucide-file-text",
                                    class: ["size-3.5", ("isImageMime" in _ctx ? _ctx.isImageMime : vueExports.unref(isImageMime))(att.mime_type) ? "text-violet-500" : "text-amber-600"]
                                  }, null, 8, ["name", "class"])
                                ], 2),
                                vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                                  vueExports.createVNode("p", { class: "text-xs font-medium text-slate-700 truncate" }, vueExports.toDisplayString(att.original_name), 1),
                                  vueExports.createVNode("p", { class: "text-[10px] text-slate-400" }, vueExports.toDisplayString(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(att.size_bytes)), 1)
                                ]),
                                vueExports.createVNode(_component_UIcon, {
                                  name: "i-lucide-download",
                                  class: "size-3.5 text-slate-400"
                                })
                              ], 8, ["href"]);
                            }), 128))
                          ])
                        ])) : vueExports.createCommentVNode("", true)
                      ]);
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
        _push(`</div></div><div class="flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Thông tin xử lý",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-3"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: vueExports.unref(ogTicket).status.label,
                      color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(vueExports.unref(ogTicket).status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(ogTicket).status.label,
                        color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(vueExports.unref(ogTicket).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ưu tiên" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: vueExports.unref(ogTicket).priority.label,
                      color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(vueExports.unref(ogTicket).priority.value),
                      variant: "soft",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(ogTicket).priority.label,
                        color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(vueExports.unref(ogTicket).priority.value),
                        variant: "soft",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người tiếp nhận" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).received_by?.name ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).received_by?.name ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người thi công" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(ogTicket).assignees?.length) {
                      _push3(`<div class="flex flex-col gap-1"${_scopeId2}><!--[-->`);
                      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(ogTicket).assignees, (a) => {
                        _push3(`<div class="flex items-center gap-2"${_scopeId2}><span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(a.name)}</span>`);
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCapabilityRatingBadge, {
                          rating: a.capability_rating,
                          size: "xs"
                        }, null, _parent3, _scopeId2));
                        _push3(`</div>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      _push3(`<span${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(ogTicket).assignees?.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex flex-col gap-1"
                      }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ogTicket).assignees, (a) => {
                          return vueExports.openBlock(), vueExports.createBlock("div", {
                            key: a.id,
                            class: "flex items-center gap-2"
                          }, [
                            vueExports.createVNode("span", null, vueExports.toDisplayString(a.name), 1),
                            vueExports.createVNode(_component_SharedCapabilityRatingBadge, {
                              rating: a.capability_rating,
                              size: "xs"
                            }, null, 8, ["rating"])
                          ]);
                        }), 128))
                      ])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Nhận lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).received_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).received_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Hạn SLA Hoàn thành" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (vueExports.unref(ogTicket).sla_completion_due_at) {
                      _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass(vueExports.unref(isSlaCompletionViolated) ? "text-red-600 font-semibold" : "")}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).sla_completion_due_at))} `);
                      if (vueExports.unref(isSlaCompletionViolated)) {
                        _push3(`<span class="text-red-500 text-xs"${_scopeId2}>(Quá hạn)</span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</span>`);
                    } else {
                      _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      vueExports.unref(ogTicket).sla_completion_due_at ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: vueExports.unref(isSlaCompletionViolated) ? "text-red-600 font-semibold" : ""
                      }, [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).sla_completion_due_at)) + " ", 1),
                        vueExports.unref(isSlaCompletionViolated) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "text-red-500 text-xs"
                        }, "(Quá hạn)")) : vueExports.createCommentVNode("", true)
                      ], 2)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Cập nhật lúc" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).updated_at))}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).updated_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              if (vueExports.unref(ogTicket).internal_note) {
                _push2(`<div class="border-t border-slate-100 pt-3 mt-3"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ghi chú nội bộ" }, {
                  default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="whitespace-pre-line text-xs"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ogTicket).internal_note)}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "whitespace-pre-line text-xs" }, vueExports.toDisplayString(vueExports.unref(ogTicket).internal_note), 1)
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
                vueExports.createVNode("div", { class: "flex flex-col gap-3" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Trạng thái" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(ogTicket).status.label,
                        color: ("ogTicketStatusColor" in _ctx ? _ctx.ogTicketStatusColor : vueExports.unref(ogTicketStatusColor))(vueExports.unref(ogTicket).status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ưu tiên" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(ogTicket).priority.label,
                        color: ("ogTicketPriorityColor" in _ctx ? _ctx.ogTicketPriorityColor : vueExports.unref(ogTicketPriorityColor))(vueExports.unref(ogTicket).priority.value),
                        variant: "soft",
                        size: "sm"
                      }, null, 8, ["label", "color"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Người tiếp nhận" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ogTicket).received_by?.name ?? "—"), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Người thi công" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(ogTicket).assignees?.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex flex-col gap-1"
                      }, [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(ogTicket).assignees, (a) => {
                          return vueExports.openBlock(), vueExports.createBlock("div", {
                            key: a.id,
                            class: "flex items-center gap-2"
                          }, [
                            vueExports.createVNode("span", null, vueExports.toDisplayString(a.name), 1),
                            vueExports.createVNode(_component_SharedCapabilityRatingBadge, {
                              rating: a.capability_rating,
                              size: "xs"
                            }, null, 8, ["rating"])
                          ]);
                        }), 128))
                      ])) : (vueExports.openBlock(), vueExports.createBlock("span", { key: 1 }, "—"))
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Nhận lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).received_at)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Hạn SLA Hoàn thành" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.unref(ogTicket).sla_completion_due_at ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: vueExports.unref(isSlaCompletionViolated) ? "text-red-600 font-semibold" : ""
                      }, [
                        vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).sla_completion_due_at)) + " ", 1),
                        vueExports.unref(isSlaCompletionViolated) ? (vueExports.openBlock(), vueExports.createBlock("span", {
                          key: 0,
                          class: "text-red-500 text-xs"
                        }, "(Quá hạn)")) : vueExports.createCommentVNode("", true)
                      ], 2)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-slate-400"
                      }, "—"))
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Cập nhật lúc" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ogTicket).updated_at)), 1)
                    ]),
                    _: 1
                  })
                ]),
                vueExports.unref(ogTicket).internal_note ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "border-t border-slate-100 pt-3 mt-3"
                }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ghi chú nội bộ" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "whitespace-pre-line text-xs" }, vueExports.toDisplayString(vueExports.unref(ogTicket).internal_note), 1)
                    ]),
                    _: 1
                  })
                ])) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(ticketCode)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
            title: "Mã QR cho cư dân",
            compact: ""
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex flex-col gap-3"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedQrCode, {
                  ref_key: "qrCodeRef",
                  ref: qrCodeRef,
                  value: vueExports.unref(absoluteResidentUrl),
                  size: 180,
                  "file-name": `ticket-${vueExports.unref(ticketCode)}.png`
                }, null, _parent2, _scopeId));
                _push2(`<p class="font-mono text-xs text-slate-500 break-all text-center"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(absoluteResidentUrl))}</p><div class="grid grid-cols-3 gap-2"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-copy",
                  label: "Sao chép",
                  color: "neutral",
                  variant: "soft",
                  size: "xs",
                  block: "",
                  onClick: copyResidentUrl
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-download",
                  label: "Tải QR",
                  color: "neutral",
                  variant: "soft",
                  size: "xs",
                  block: "",
                  onClick: downloadResidentQr
                }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-external-link",
                  label: "Mở tab",
                  color: "neutral",
                  variant: "soft",
                  size: "xs",
                  block: "",
                  to: vueExports.unref(residentTicketPath),
                  target: "_blank",
                  rel: "noopener"
                }, null, _parent2, _scopeId));
                _push2(`</div><p class="text-xs text-slate-400 leading-relaxed"${_scopeId}> Cư dân quét mã để xem thông tin yêu cầu, duyệt báo giá và đánh giá dịch vụ. </p></div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "flex flex-col gap-3" }, [
                    vueExports.createVNode(_component_SharedQrCode, {
                      ref_key: "qrCodeRef",
                      ref: qrCodeRef,
                      value: vueExports.unref(absoluteResidentUrl),
                      size: 180,
                      "file-name": `ticket-${vueExports.unref(ticketCode)}.png`
                    }, null, 8, ["value", "file-name"]),
                    vueExports.createVNode("p", { class: "font-mono text-xs text-slate-500 break-all text-center" }, vueExports.toDisplayString(vueExports.unref(absoluteResidentUrl)), 1),
                    vueExports.createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-copy",
                        label: "Sao chép",
                        color: "neutral",
                        variant: "soft",
                        size: "xs",
                        block: "",
                        onClick: copyResidentUrl
                      }),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-download",
                        label: "Tải QR",
                        color: "neutral",
                        variant: "soft",
                        size: "xs",
                        block: "",
                        onClick: downloadResidentQr
                      }),
                      vueExports.createVNode(_component_UButton, {
                        icon: "i-lucide-external-link",
                        label: "Mở tab",
                        color: "neutral",
                        variant: "soft",
                        size: "xs",
                        block: "",
                        to: vueExports.unref(residentTicketPath),
                        target: "_blank",
                        rel: "noopener"
                      }, null, 8, ["to"])
                    ]),
                    vueExports.createVNode("p", { class: "text-xs text-slate-400 leading-relaxed" }, " Cư dân quét mã để xem thông tin yêu cầu, duyệt báo giá và đánh giá dịch vụ. ")
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(audits).length > 0) {
          _push(`<div class="bg-white border border-border-gray rounded-xl shadow-sm overflow-hidden"><button type="button" class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "border-b-0": !vueExports.unref(showAuditHistory) }, "w-full px-5 py-3.5 border-b border-border-gray flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50/50 transition-colors"])}"><div class="flex items-center gap-2">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-history",
            class: "size-4 text-slate-400"
          }, null, _parent));
          _push(`<h2 class="font-bold text-slate-900 text-sm"> Lịch sử thay đổi </h2>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
            label: String(vueExports.unref(audits).length),
            color: "neutral",
            variant: "subtle",
            size: "xs"
          }, null, _parent));
          _push(`</div>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
            name: vueExports.unref(showAuditHistory) ? "i-lucide-chevron-up" : "i-lucide-chevron-down",
            class: "size-4 text-slate-400"
          }, null, _parent));
          _push(`</button><div class="px-5 py-4 max-h-[500px] overflow-y-auto" style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(showAuditHistory) ? null : { display: "none" })}"><div class="relative"><div class="absolute top-0 bottom-0 left-2.5 w-px bg-slate-200"></div><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(audits), (audit) => {
            _push(`<div class="relative flex gap-3 pb-4 last:pb-0"><div class="relative z-10 flex items-center justify-center size-5 rounded-full bg-white border-2 border-slate-300 shrink-0"><div class="size-1.5 rounded-full bg-slate-400"></div></div><div class="flex-1 min-w-0 -mt-0.5"><div class="flex items-center gap-1.5 flex-wrap">`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
              label: ("AUDIT_EVENT_LABELS" in _ctx ? _ctx.AUDIT_EVENT_LABELS : vueExports.unref(AUDIT_EVENT_LABELS))[audit.event] ?? audit.event,
              color: ("AUDIT_EVENT_COLORS" in _ctx ? _ctx.AUDIT_EVENT_COLORS : vueExports.unref(AUDIT_EVENT_COLORS))[audit.event] ?? "neutral",
              variant: "subtle",
              size: "xs"
            }, null, _parent));
            _push(`</div><p class="text-[11px] text-slate-500 mt-0.5">`);
            if (audit.user) {
              _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(audit.user.name)} · </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(audit.created_at))}</p>`);
            if (audit.event !== "created") {
              _push(`<div class="mt-1.5 flex flex-col gap-1"><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(getChangedFields(audit), (change) => {
                _push(`<div class="text-[11px] leading-relaxed"><span class="font-medium text-slate-600">${serverRenderer_cjs_prodExports.ssrInterpolate(change.field)}:</span><span class="text-red-500 line-through ml-1">${serverRenderer_cjs_prodExports.ssrInterpolate(change.old)}</span>`);
                _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "size-3 text-slate-400 mx-0.5 inline-block align-middle"
                }, null, _parent));
                _push(`<span class="text-emerald-600">${serverRenderer_cjs_prodExports.ssrInterpolate(change.new)}</span></div>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(acceptanceReportOrderId)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOrderAcceptanceReportModal, {
          open: vueExports.unref(showAcceptanceReport),
          "onUpdate:open": ($event) => vueExports.isRef(showAcceptanceReport) ? showAcceptanceReport.value = $event : null,
          "order-id": vueExports.unref(acceptanceReportOrderId)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOgTicketCreateOrderModal, {
        open: vueExports.unref(showCreateOrderModal),
        "onUpdate:open": ($event) => vueExports.isRef(showCreateOrderModal) ? showCreateOrderModal.value = $event : null,
        "og-ticket-subject": vueExports.unref(ogTicket)?.subject ?? "",
        "og-ticket-code": vueExports.unref(ogTicket)?.code ?? null,
        quote: vueExports.unref(activeQuote),
        onCreated: handleOrderCreated
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudDeleteModal, {
        open: vueExports.unref(showDeleteDialog),
        "onUpdate:open": ($event) => vueExports.isRef(showDeleteDialog) ? showDeleteDialog.value = $event : null,
        title: "Huỷ OG Ticket",
        "item-name": vueExports.unref(deleteTarget)?.subject ?? vueExports.unref(ogTicket)?.subject,
        description: vueExports.unref(deleteWarning),
        checking: vueExports.unref(isCheckingDelete),
        "blocked-message": vueExports.unref(deleteBlockedMessage),
        loading: vueExports.unref(isDeleting),
        onConfirm: vueExports.unref(handleDelete)
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showReleaseDialog),
        "onUpdate:open": ($event) => vueExports.isRef(showReleaseDialog) ? showReleaseDialog.value = $event : null,
        title: "Trả ticket về pool?"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(isCheckingRelease)) {
              _push2(`<div class="flex items-center justify-center py-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-loader-2",
                class: "animate-spin text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(`<span class="ml-2 text-sm text-slate-500"${_scopeId}>Đang kiểm tra...</span></div>`);
            } else if (vueExports.unref(releaseBlockedMessage)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
                icon: "i-lucide-ban",
                color: "error",
                variant: "subtle",
                description: vueExports.unref(releaseBlockedMessage)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!--[--><p class="text-slate-700 mb-4"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(deleteWarning))}</p><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Lý do (không bắt buộc) </p>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTextarea, {
                modelValue: vueExports.unref(releaseNote),
                "onUpdate:modelValue": ($event) => vueExports.isRef(releaseNote) ? releaseNote.value = $event : null,
                placeholder: "Nhập lý do trả lại...",
                rows: 3,
                class: "w-full"
              }, null, _parent2, _scopeId));
              _push2(`</div><!--]-->`);
            }
          } else {
            return [
              vueExports.unref(isCheckingRelease) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "flex items-center justify-center py-4"
              }, [
                vueExports.createVNode(_component_UIcon, {
                  name: "i-lucide-loader-2",
                  class: "animate-spin text-slate-400"
                }),
                vueExports.createVNode("span", { class: "ml-2 text-sm text-slate-500" }, "Đang kiểm tra...")
              ])) : vueExports.unref(releaseBlockedMessage) ? (vueExports.openBlock(), vueExports.createBlock(_component_UAlert, {
                key: 1,
                icon: "i-lucide-ban",
                color: "error",
                variant: "subtle",
                description: vueExports.unref(releaseBlockedMessage)
              }, null, 8, ["description"])) : (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 2 }, [
                vueExports.createVNode("p", { class: "text-slate-700 mb-4" }, vueExports.toDisplayString(vueExports.unref(deleteWarning)), 1),
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Lý do (không bắt buộc) "),
                  vueExports.createVNode(_component_UTextarea, {
                    modelValue: vueExports.unref(releaseNote),
                    "onUpdate:modelValue": ($event) => vueExports.isRef(releaseNote) ? releaseNote.value = $event : null,
                    placeholder: "Nhập lý do trả lại...",
                    rows: 3,
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ], 64))
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: vueExports.unref(releaseBlockedMessage) ? "Đóng" : "Hủy",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => showReleaseDialog.value = false
            }, null, _parent2, _scopeId));
            if (!vueExports.unref(releaseBlockedMessage) && !vueExports.unref(isCheckingRelease)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Xác nhận trả lại",
                color: "error",
                loading: vueExports.unref(isReleasing),
                onClick: handleRelease
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: vueExports.unref(releaseBlockedMessage) ? "Đóng" : "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showReleaseDialog.value = false
                }, null, 8, ["label", "onClick"]),
                !vueExports.unref(releaseBlockedMessage) && !vueExports.unref(isCheckingRelease) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 0,
                  label: "Xác nhận trả lại",
                  color: "error",
                  loading: vueExports.unref(isReleasing),
                  onClick: handleRelease
                }, null, 8, ["loading"])) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showSlaModal),
        title: "Cập nhật SLA",
        ui: { body: "overflow-y-visible", content: "overflow-visible" },
        "onUpdate:open": (v) => showSlaModal.value = v
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Hạn SLA Báo giá </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Zl), {
              modelValue: vueExports.unref(slaForm).sla_quote_due_at,
              "onUpdate:modelValue": ($event) => vueExports.unref(slaForm).sla_quote_due_at = $event,
              "model-type": "yyyy-MM-dd HH:mm:ss",
              "enable-time-picker": true,
              is24: true,
              placeholder: "Chọn ngày giờ",
              clearable: true
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1.5"${_scopeId}> Hạn SLA Hoàn thành </p>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(Zl), {
              modelValue: vueExports.unref(slaForm).sla_completion_due_at,
              "onUpdate:modelValue": ($event) => vueExports.unref(slaForm).sla_completion_due_at = $event,
              "model-type": "yyyy-MM-dd HH:mm:ss",
              "enable-time-picker": true,
              is24: true,
              placeholder: "Chọn ngày giờ",
              clearable: true
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "space-y-4" }, [
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Hạn SLA Báo giá "),
                  vueExports.createVNode(vueExports.unref(Zl), {
                    modelValue: vueExports.unref(slaForm).sla_quote_due_at,
                    "onUpdate:modelValue": ($event) => vueExports.unref(slaForm).sla_quote_due_at = $event,
                    "model-type": "yyyy-MM-dd HH:mm:ss",
                    "enable-time-picker": true,
                    is24: true,
                    placeholder: "Chọn ngày giờ",
                    clearable: true
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1.5" }, " Hạn SLA Hoàn thành "),
                  vueExports.createVNode(vueExports.unref(Zl), {
                    modelValue: vueExports.unref(slaForm).sla_completion_due_at,
                    "onUpdate:modelValue": ($event) => vueExports.unref(slaForm).sla_completion_due_at = $event,
                    "model-type": "yyyy-MM-dd HH:mm:ss",
                    "enable-time-picker": true,
                    is24: true,
                    placeholder: "Chọn ngày giờ",
                    clearable: true
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Huỷ",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => showSlaModal.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Lưu",
              icon: "i-lucide-check",
              color: "primary",
              loading: vueExports.unref(isSlaUpdating),
              onClick: handleSlaUpdate
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Huỷ",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showSlaModal.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Lưu",
                  icon: "i-lucide-check",
                  color: "primary",
                  loading: vueExports.unref(isSlaUpdating),
                  onClick: handleSlaUpdate
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (vueExports.unref(ogTicket)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedOgTicketCategoryModal, {
          open: vueExports.unref(categoriesModalOpen),
          "onUpdate:open": ($event) => vueExports.isRef(categoriesModalOpen) ? categoriesModalOpen.value = $event : null,
          "og-ticket-id": vueExports.unref(ogTicket).id,
          "selected-ids": vueExports.unref(selectedCategoryIds),
          onSaved: handleCategoriesSaved
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/og-tickets/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B1Ta7lrW.mjs.map
