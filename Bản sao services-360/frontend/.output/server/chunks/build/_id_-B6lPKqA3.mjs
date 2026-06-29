import { v as vueExports, p as useRoute$1, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, w as __nuxt_component_5$1, k as _sfc_main$h } from './server.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$2 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as __nuxt_component_7 } from './RatingDisplay-BKbNjbBW.mjs';
import { f as formatDateTime } from './date-R5YK0ast.mjs';
import { f as formatFileSize } from './file-DEnEYJZ3.mjs';
import { c as usePlatformTicketDetail } from './useTickets-ChvwqcYd.mjs';
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

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const id = vueExports.computed(() => Number(route.params.id));
    const { data, status, error } = usePlatformTicketDetail(id);
    const ticket = vueExports.computed(() => data.value?.data);
    const pmc = vueExports.computed(() => ticket.value?.pmc_processing);
    vueExports.shallowRef(null);
    vueExports.shallowRef(null);
    vueExports.shallowRef(null);
    const hasLocation = vueExports.computed(() => ticket.value?.latitude != null && ticket.value?.longitude != null);
    vueExports.computed(
      () => hasLocation.value ? [Number(ticket.value.latitude), Number(ticket.value.longitude)] : [10.7769, 106.7009]
    );
    const imageAttachments = vueExports.computed(
      () => ticket.value?.attachments?.filter((a) => a.mime_type.startsWith("image/")) ?? []
    );
    const docAttachments = vueExports.computed(
      () => ticket.value?.attachments?.filter((a) => !a.mime_type.startsWith("image/")) ?? []
    );
    useSeoMeta({
      title: vueExports.computed(() => ticket.value ? `${ticket.value.code} - Thần Nông` : "Chi tiết yêu cầu")
    });
    function statusColor(value) {
      switch (value) {
        case "pending":
          return "warning";
        case "received":
          return "info";
        case "in_progress":
          return "primary";
        case "completed":
          return "success";
        case "cancelled":
          return "neutral";
        default:
          return "neutral";
      }
    }
    function pmcStatusColor(value) {
      switch (value) {
        case "received":
          return "info";
        case "assigned":
          return "primary";
        case "surveying":
          return "primary";
        case "quoted":
          return "warning";
        case "approved":
          return "success";
        case "rejected":
          return "error";
        case "ordered":
          return "info";
        case "in_progress":
          return "primary";
        case "completed":
          return "success";
        case "cancelled":
          return "neutral";
        default:
          return "neutral";
      }
    }
    function priorityColor(value) {
      switch (value) {
        case "low":
          return "neutral";
        case "normal":
          return "info";
        case "high":
          return "warning";
        case "urgent":
          return "error";
        default:
          return "neutral";
      }
    }
    const isSlaOverdue = vueExports.computed(() => {
      if (!pmc.value?.sla_due_at) return false;
      return new Date(pmc.value.sla_due_at) < /* @__PURE__ */ new Date();
    });
    const pmcWorkflowSteps = ["received", "assigned", "surveying", "quoted", "approved", "ordered", "in_progress", "completed"];
    const currentStepIndex = vueExports.computed(() => {
      if (!pmc.value) return -1;
      return pmcWorkflowSteps.indexOf(pmc.value.status.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$c;
      const _component_UAlert = _sfc_main$1;
      const _component_UBadge = _sfc_main$2;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_ClientOnly = __nuxt_component_5$1;
      const _component_UIcon = _sfc_main$h;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_SharedTicketRatingDisplay = __nuxt_component_7;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="mb-6 flex items-center gap-4">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-arrow-left",
        color: "neutral",
        variant: "ghost",
        to: "/platform/tickets"
      }, null, _parent));
      _push(`<div><h1 class="text-2xl font-black text-slate-900 tracking-tight"> Chi tiết yêu cầu </h1><p class="text-slate-500 text-sm mt-0.5">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket)?.code ?? "...")}</p></div></div>`);
      if (vueExports.unref(status) === "pending") {
        _push(`<div class="flex flex-col gap-4"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(4, (i) => {
          _push(`<div class="h-20 bg-slate-100 rounded-xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          description: "Không tìm thấy yêu cầu này."
        }, null, _parent));
      } else if (vueExports.unref(ticket)) {
        _push(`<div class="flex flex-col gap-6"><div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between"><h2 class="font-bold text-slate-900"> Thông tin yêu cầu </h2>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
          color: statusColor(vueExports.unref(ticket).status.value),
          variant: "subtle",
          label: vueExports.unref(ticket).status.label,
          size: "md"
        }, null, _parent));
        _push(`</div><div class="px-6 py-5 flex flex-col gap-5">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Tiêu đề" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).subject)}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(ticket).subject), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(ticket).description) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mô tả" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<p class="leading-relaxed whitespace-pre-wrap"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).description)}</p>`);
              } else {
                return [
                  vueExports.createVNode("p", { class: "leading-relaxed whitespace-pre-wrap" }, vueExports.toDisplayString(vueExports.unref(ticket).description), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-2 gap-4">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Kênh tiếp nhận" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).channel.label)}`);
            } else {
              return [
                vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ticket).channel.label), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày gửi" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ticket).created_at))}`);
            } else {
              return [
                vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ticket).created_at)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (vueExports.unref(ticket).claimed_at) {
          _push(`<div class="grid grid-cols-2 gap-4">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày tiếp nhận" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ticket).claimed_at))}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(ticket).claimed_at)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="flex flex-col gap-4"><div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-5 py-4 border-b border-slate-100"><h3 class="font-bold text-slate-900 text-sm"> Người gửi </h3></div><div class="px-5 py-4 flex flex-col gap-3">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Họ tên" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).requester_name)}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(ticket).requester_name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).requester_phone)}`);
            } else {
              return [
                vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ticket).requester_phone), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(ticket).apartment_name) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Căn hộ" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).apartment_name)}`);
              } else {
                return [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ticket).apartment_name), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-5 py-4 border-b border-slate-100"><h3 class="font-bold text-slate-900 text-sm"> Thông tin mã </h3></div><div class="px-5 py-4 flex flex-col gap-3">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mã yêu cầu" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-mono font-bold"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).code)}</span>`);
            } else {
              return [
                vueExports.createVNode("span", { class: "font-mono font-bold" }, vueExports.toDisplayString(vueExports.unref(ticket).code), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(ticket).project_id) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Dự án" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` #${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).project_id)}`);
              } else {
                return [
                  vueExports.createTextVNode(" #" + vueExports.toDisplayString(vueExports.unref(ticket).project_id), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
        if (vueExports.unref(ticket).address || vueExports.unref(hasLocation)) {
          _push(`<div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-6 py-4 border-b border-slate-100"><h2 class="font-bold text-slate-900"> Vị trí </h2></div><div class="px-6 py-5 flex flex-col gap-4">`);
          if (vueExports.unref(ticket).address) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Địa chỉ" }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).address)}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(ticket).address), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(hasLocation)) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, null, {
              fallback: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="rounded-xl border border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center"${_scopeId}><span class="material-symbols-outlined text-slate-300 animate-spin" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "24px" })}"${_scopeId}>progress_activity</span></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "rounded-xl border border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center" }, [
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
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(ticket).attachments && vueExports.unref(ticket).attachments.length > 0) {
          _push(`<div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-6 py-4 border-b border-slate-100"><h2 class="font-bold text-slate-900"> Tệp đính kèm <span class="text-slate-400 font-normal text-sm ml-1">(${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(ticket).attachments.length)})</span></h2></div><div class="px-6 py-5 flex flex-col gap-5">`);
          if (vueExports.unref(imageAttachments).length > 0) {
            _push(`<div><p class="text-xs font-medium text-slate-500 mb-3"> Hình ảnh </p><div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(imageAttachments), (img) => {
              _push(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", img.url ?? "#")} target="_blank" class="group relative rounded-xl border border-slate-200 overflow-hidden aspect-square bg-slate-50 hover:shadow-md transition-shadow"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", img.url ?? "")}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", img.original_name)} class="w-full h-full object-cover"><div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity"><p class="text-white text-[10px] truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(img.original_name)}</p></div></a>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (vueExports.unref(docAttachments).length > 0) {
            _push(`<div><p class="text-xs font-medium text-slate-500 mb-3"> Tài liệu </p><div class="flex flex-col gap-2"><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(docAttachments), (doc) => {
              _push(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", doc.url ?? "#")} target="_blank" class="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50 transition-colors"><div class="size-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-amber-600" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}">description</span></div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-slate-700 truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(doc.original_name)}</p><p class="text-xs text-slate-400">${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(doc.size_bytes))}</p></div><span class="material-symbols-outlined text-slate-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "18px" })}">download</span></a>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(pmc)) {
          _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-5 py-4 border-b border-slate-100"><h3 class="font-bold text-slate-900 text-sm"> Trạng thái xử lý PMC </h3></div><div class="px-5 py-4 flex flex-col gap-3">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Trạng thái xử lý" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  color: pmcStatusColor(vueExports.unref(pmc).status.value),
                  variant: "subtle",
                  label: vueExports.unref(pmc).status.label,
                  size: "sm"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_UBadge, {
                    color: pmcStatusColor(vueExports.unref(pmc).status.value),
                    variant: "subtle",
                    label: vueExports.unref(pmc).status.label,
                    size: "sm"
                  }, null, 8, ["color", "label"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Mức ưu tiên" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                  color: priorityColor(vueExports.unref(pmc).priority.value),
                  variant: "subtle",
                  label: vueExports.unref(pmc).priority.label,
                  size: "sm"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  vueExports.createVNode(_component_UBadge, {
                    color: priorityColor(vueExports.unref(pmc).priority.value),
                    variant: "subtle",
                    label: vueExports.unref(pmc).priority.label,
                    size: "sm"
                  }, null, 8, ["color", "label"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người tiếp nhận" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(pmc).received_by) {
                  _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(pmc).received_by.name)}</span>`);
                } else {
                  _push2(`<span class="text-slate-400"${_scopeId}>Chưa có</span>`);
                }
              } else {
                return [
                  vueExports.unref(pmc).received_by ? (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 0,
                    class: "font-medium"
                  }, vueExports.toDisplayString(vueExports.unref(pmc).received_by.name), 1)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 1,
                    class: "text-slate-400"
                  }, "Chưa có"))
                ];
              }
            }),
            _: 1
          }, _parent));
          if (vueExports.unref(pmc).received_at) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Thời điểm tiếp nhận" }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(pmc).received_at))}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(pmc).received_at)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-5 py-4 border-b border-slate-100"><h3 class="font-bold text-slate-900 text-sm"> Phân công &amp; SLA </h3></div><div class="px-5 py-4 flex flex-col gap-3">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Nhân viên phụ trách" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(pmc).assignees?.length) {
                  _push2(`<div class="flex flex-col gap-1"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(pmc).assignees, (a) => {
                    _push2(`<span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(a.name)}</span>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<span class="text-slate-400"${_scopeId}>Chưa phân công</span>`);
                }
              } else {
                return [
                  vueExports.unref(pmc).assignees?.length ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "flex flex-col gap-1"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(pmc).assignees, (a) => {
                      return vueExports.openBlock(), vueExports.createBlock("span", {
                        key: a.id,
                        class: "font-medium"
                      }, vueExports.toDisplayString(a.name), 1);
                    }), 128))
                  ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 1,
                    class: "text-slate-400"
                  }, "Chưa phân công"))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Hạn SLA" }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (vueExports.unref(pmc).sla_due_at) {
                  _push2(`<!--[--><span class="${serverRenderer_cjs_prodExports.ssrRenderClass(vueExports.unref(isSlaOverdue) ? "text-red-600 font-semibold" : "")}"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(pmc).sla_due_at))}</span>`);
                  if (vueExports.unref(isSlaOverdue)) {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      color: "error",
                      variant: "subtle",
                      label: "Quá hạn",
                      size: "xs",
                      class: "ml-2"
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<!--]-->`);
                } else {
                  _push2(`<span class="text-slate-400"${_scopeId}>Chưa thiết lập</span>`);
                }
              } else {
                return [
                  vueExports.unref(pmc).sla_due_at ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                    vueExports.createVNode("span", {
                      class: vueExports.unref(isSlaOverdue) ? "text-red-600 font-semibold" : ""
                    }, vueExports.toDisplayString(("formatDateTime" in _ctx ? _ctx.formatDateTime : vueExports.unref(formatDateTime))(vueExports.unref(pmc).sla_due_at)), 3),
                    vueExports.unref(isSlaOverdue) ? (vueExports.openBlock(), vueExports.createBlock(_component_UBadge, {
                      key: 0,
                      color: "error",
                      variant: "subtle",
                      label: "Quá hạn",
                      size: "xs",
                      class: "ml-2"
                    })) : vueExports.createCommentVNode("", true)
                  ], 64)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 1,
                    class: "text-slate-400"
                  }, "Chưa thiết lập"))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div><div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"><div class="px-5 py-4 border-b border-slate-100"><h3 class="font-bold text-slate-900 text-sm"> Tiến trình xử lý </h3></div><div class="px-5 py-4"><div class="flex flex-col gap-1.5"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(pmcWorkflowSteps, (step, index) => {
            _push(`<div class="flex items-center gap-3"><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([index <= vueExports.unref(currentStepIndex) ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-400", "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"])}">`);
            if (index < vueExports.unref(currentStepIndex)) {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-check",
                class: "w-3 h-3"
              }, null, _parent));
            } else {
              _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(index + 1)}</span>`);
            }
            _push(`</div><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([index <= vueExports.unref(currentStepIndex) ? "text-slate-900 font-medium" : "text-slate-400", "text-sm"])}">${serverRenderer_cjs_prodExports.ssrInterpolate({
              received: "Đã tiếp nhận",
              assigned: "Đã phân công",
              surveying: "Đang khảo sát",
              quoted: "Đã báo giá",
              approved: "Đã chấp thuận",
              ordered: "Đã lên đơn",
              in_progress: "Đang thực hiện",
              completed: "Hoàn thành"
            }[step])}</span></div>`);
          });
          _push(`<!--]--></div></div></div></div>`);
        } else if (vueExports.unref(ticket).status.value === "pending") {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            icon: "i-lucide-clock",
            color: "warning",
            variant: "subtle",
            description: "Yêu cầu đang chờ được tiếp nhận bởi đơn vị quản lý."
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, { title: "Rating cư dân" }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedTicketRatingDisplay, {
                rating: vueExports.unref(ticket).resident_rating ?? null,
                comment: vueExports.unref(ticket).resident_rating_comment ?? null,
                "rated-at": vueExports.unref(ticket).resident_rated_at ?? null
              }, null, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_SharedTicketRatingDisplay, {
                  rating: vueExports.unref(ticket).resident_rating ?? null,
                  comment: vueExports.unref(ticket).resident_rating_comment ?? null,
                  "rated-at": vueExports.unref(ticket).resident_rated_at ?? null
                }, null, 8, ["rating", "comment", "rated-at"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/tickets/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-B6lPKqA3.mjs.map
