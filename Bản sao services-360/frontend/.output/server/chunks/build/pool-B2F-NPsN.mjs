import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { v as vueExports, u as useSeoMeta, j as useToast, i as useRouter, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, k as _sfc_main$h, w as __nuxt_component_5$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './Input-JXN8po_F.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$2 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$3 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { _ as _sfc_main$4 } from './Slideover-C_jHRSNJ.mjs';
import { _ as __nuxt_component_5 } from './FieldDisplay-BM6nmr2i.mjs';
import { _ as _sfc_main$5 } from './Modal-BimZZbNl.mjs';
import { a as formatDate, h as formatTime, t as timeAgo } from './date-R5YK0ast.mjs';
import { f as formatFileSize } from './file-DEnEYJZ3.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { k as usePoolTicketList, l as apiClaimTicket } from './useOgTickets-DPRh9tlL.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';
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
import './PageError-kZWsA9dh.mjs';
import './index-CSThDD3J.mjs';
import './Pagination-fZq_Msxb.mjs';
import './DialogTrigger-C3iwCYMu.mjs';
import './FocusScope-BZehoQSg.mjs';
import './utils-DY0Zag2O.mjs';
import './DialogClose-DGkUxau7.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "pool",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Ticket Pool - Thần Nông" });
    const params = vueExports.reactive({ per_page: DEFAULT_PER_PAGE });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = usePoolTicketList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const tickets = vueExports.computed(() => data.value?.data ?? []);
    const columns = [
      { id: "actions", header: "Tiếp nhận" },
      { id: "code", header: "Mã" },
      { id: "content", header: "Nội dung" },
      { id: "requester", header: "Cư dân" },
      { id: "meta", header: "Phân loại" },
      { id: "time", header: "Thời gian" }
    ];
    const expandedDescs = vueExports.ref(/* @__PURE__ */ new Set());
    const STATUS_COLOR = {
      pending: "warning",
      received: "info",
      in_progress: "primary",
      completed: "success",
      cancelled: "neutral"
    };
    function getStatusColor(value) {
      return STATUS_COLOR[value] ?? "neutral";
    }
    const LMap = vueExports.shallowRef(null);
    const LTileLayer = vueExports.shallowRef(null);
    const LMarker = vueExports.shallowRef(null);
    const detailTarget = vueExports.ref(null);
    const showDetail = vueExports.ref(false);
    const detailHasLocation = vueExports.computed(
      () => detailTarget.value?.latitude != null && detailTarget.value?.longitude != null
    );
    const detailMapCenter = vueExports.computed(
      () => detailHasLocation.value ? [Number(detailTarget.value.latitude), Number(detailTarget.value.longitude)] : [10.7769, 106.7009]
    );
    const detailImages = vueExports.computed(
      () => detailTarget.value?.attachments?.filter((a) => a.mime_type.startsWith("image/")) ?? []
    );
    const detailDocs = vueExports.computed(
      () => detailTarget.value?.attachments?.filter((a) => !a.mime_type.startsWith("image/")) ?? []
    );
    function openDetail(ticket) {
      detailTarget.value = ticket;
      showDetail.value = true;
    }
    const claimTarget = vueExports.ref(null);
    const showClaimDialog = vueExports.ref(false);
    const isClaiming = vueExports.ref(false);
    const toast = useToast();
    const router = useRouter();
    function openClaimDialog(ticket) {
      claimTarget.value = ticket;
      showClaimDialog.value = true;
    }
    function claimFromDetail() {
      if (!detailTarget.value) return;
      showDetail.value = false;
      openClaimDialog(detailTarget.value);
    }
    async function handleClaim() {
      if (!claimTarget.value) return;
      isClaiming.value = true;
      try {
        const result = await apiClaimTicket({ ticket_id: claimTarget.value.id });
        showClaimDialog.value = false;
        toast.add({ title: "Nhận ticket thành công", color: "success" });
        router.push(`/pmc/og-tickets/${result.data.id}`);
      } catch (err) {
        const msg = getApiErrorMessage(err, "Không thể nhận ticket. Vui lòng thử lại.");
        toast.add({ title: "Lỗi", description: msg, color: "error" });
      } finally {
        isClaiming.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$c;
      const _component_UInput = _sfc_main$1;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$2;
      const _component_UIcon = _sfc_main$h;
      const _component_UBadge = _sfc_main$3;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      const _component_USlideover = _sfc_main$4;
      const _component_SharedFieldDisplay = __nuxt_component_5;
      const _component_ClientOnly = __nuxt_component_5$1;
      const _component_UModal = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Ticket Pool",
        description: "Danh sách ticket chờ tiếp nhận từ cư dân"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              icon: "i-lucide-list",
              label: "Danh sách OG Ticket",
              color: "neutral",
              variant: "ghost",
              to: "/pmc/og-tickets"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_UButton, {
                icon: "i-lucide-list",
                label: "Danh sách OG Ticket",
                color: "neutral",
                variant: "ghost",
                to: "/pmc/og-tickets"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mb-5 flex items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo tiêu đề, tên, SĐT...",
        class: "max-w-xs"
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
      _push(`<div class="flex-1"></div>`);
      if (vueExports.unref(data)?.meta) {
        _push(`<span class="text-xs text-slate-400 tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(data).meta.total)} ticket </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-refresh-cw",
        color: "neutral",
        variant: "ghost",
        size: "sm",
        loading: vueExports.unref(status) === "pending",
        onClick: ($event) => vueExports.unref(refresh)()
      }, null, _parent));
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
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(tickets),
              columns
            }, {
              "code-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<button class="inline-flex items-center gap-1.5 w-fit group cursor-pointer"${_scopeId2}><span class="font-mono text-xs font-bold tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded group-hover:bg-slate-800 group-hover:text-white transition-colors"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.code)}</span>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-up-right",
                    class: "size-3 text-slate-300 group-hover:text-slate-600 transition-colors"
                  }, null, _parent3, _scopeId2));
                  _push3(`</button>`);
                } else {
                  return [
                    vueExports.createVNode("button", {
                      class: "inline-flex items-center gap-1.5 w-fit group cursor-pointer",
                      onClick: ($event) => openDetail(row.original)
                    }, [
                      vueExports.createVNode("span", { class: "font-mono text-xs font-bold tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded group-hover:bg-slate-800 group-hover:text-white transition-colors" }, vueExports.toDisplayString(row.original.code), 1),
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-arrow-up-right",
                        class: "size-3 text-slate-300 group-hover:text-slate-600 transition-colors"
                      })
                    ], 8, ["onClick"])
                  ];
                }
              }),
              "content-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col gap-1 min-w-0 max-w-sm"${_scopeId2}><p class="text-sm text-slate-800 font-semibold leading-snug line-clamp-1"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.subject)}</p>`);
                  if (row.original.description) {
                    _push3(`<!--[--><p class="${serverRenderer_cjs_prodExports.ssrRenderClass([vueExports.unref(expandedDescs).has(row.original.id) ? "" : "line-clamp-2", "text-xs text-slate-500 leading-relaxed whitespace-pre-line"])}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.description)}</p>`);
                    if (row.original.description.length > 80) {
                      _push3(`<button class="text-xs text-slate-400 hover:text-slate-700 cursor-pointer w-fit transition-colors"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(expandedDescs).has(row.original.id) ? "Thu gọn" : "Xem thêm")}</button>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--]-->`);
                  } else {
                    _push3(`<span class="text-xs text-slate-300 italic"${_scopeId2}>Không có mô tả</span>`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col gap-1 min-w-0 max-w-sm" }, [
                      vueExports.createVNode("p", { class: "text-sm text-slate-800 font-semibold leading-snug line-clamp-1" }, vueExports.toDisplayString(row.original.subject), 1),
                      row.original.description ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                        vueExports.createVNode("p", {
                          class: ["text-xs text-slate-500 leading-relaxed whitespace-pre-line", vueExports.unref(expandedDescs).has(row.original.id) ? "" : "line-clamp-2"]
                        }, vueExports.toDisplayString(row.original.description), 3),
                        row.original.description.length > 80 ? (vueExports.openBlock(), vueExports.createBlock("button", {
                          key: 0,
                          class: "text-xs text-slate-400 hover:text-slate-700 cursor-pointer w-fit transition-colors",
                          onClick: ($event) => vueExports.unref(expandedDescs).has(row.original.id) ? vueExports.unref(expandedDescs).delete(row.original.id) : vueExports.unref(expandedDescs).add(row.original.id)
                        }, vueExports.toDisplayString(vueExports.unref(expandedDescs).has(row.original.id) ? "Thu gọn" : "Xem thêm"), 9, ["onClick"])) : vueExports.createCommentVNode("", true)
                      ], 64)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-xs text-slate-300 italic"
                      }, "Không có mô tả"))
                    ])
                  ];
                }
              }),
              "requester-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col gap-0.5 min-w-0"${_scopeId2}><span class="text-sm font-medium text-slate-800 truncate"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.requester_name)}</span><div class="flex items-center gap-1.5 text-xs text-slate-400"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-phone",
                    class: "size-3 shrink-0"
                  }, null, _parent3, _scopeId2));
                  _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.requester_phone)}</span>`);
                  if (row.original.apartment_name) {
                    _push3(`<!--[--><span class="text-slate-200"${_scopeId2}>|</span>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-building-2",
                      class: "size-3 shrink-0"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="truncate"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.apartment_name)}</span><!--]-->`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  if (row.original.address) {
                    _push3(`<div class="flex items-center gap-1.5 text-xs text-slate-400"${_scopeId2}>`);
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-map-pin",
                      class: "size-3 shrink-0"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="truncate max-w-[200px]"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", row.original.address)}${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.address)}</span></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col gap-0.5 min-w-0" }, [
                      vueExports.createVNode("span", { class: "text-sm font-medium text-slate-800 truncate" }, vueExports.toDisplayString(row.original.requester_name), 1),
                      vueExports.createVNode("div", { class: "flex items-center gap-1.5 text-xs text-slate-400" }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-phone",
                          class: "size-3 shrink-0"
                        }),
                        vueExports.createVNode("span", null, vueExports.toDisplayString(row.original.requester_phone), 1),
                        row.original.apartment_name ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createVNode("span", { class: "text-slate-200" }, "|"),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-building-2",
                            class: "size-3 shrink-0"
                          }),
                          vueExports.createVNode("span", { class: "truncate" }, vueExports.toDisplayString(row.original.apartment_name), 1)
                        ], 64)) : vueExports.createCommentVNode("", true)
                      ]),
                      row.original.address ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex items-center gap-1.5 text-xs text-slate-400"
                      }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-map-pin",
                          class: "size-3 shrink-0"
                        }),
                        vueExports.createVNode("span", {
                          class: "truncate max-w-[200px]",
                          title: row.original.address
                        }, vueExports.toDisplayString(row.original.address), 9, ["title"])
                      ])) : vueExports.createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              "meta-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col gap-1.5"${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.status.label,
                    color: getStatusColor(row.original.status.value),
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                  _push3(`<span class="text-xs text-slate-400"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.channel.label)}</span></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col gap-1.5" }, [
                      vueExports.createVNode(_component_UBadge, {
                        label: row.original.status.label,
                        color: getStatusColor(row.original.status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"]),
                      vueExports.createVNode("span", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(row.original.channel.label), 1)
                    ])
                  ];
                }
              }),
              "time-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col gap-0.5"${_scopeId2}><span class="text-sm text-slate-700 tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at))}</span><span class="text-xs text-slate-400 tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatTime" in _ctx ? _ctx.formatTime : vueExports.unref(formatTime))(row.original.created_at))}</span></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col gap-0.5" }, [
                      vueExports.createVNode("span", { class: "text-sm text-slate-700 tabular-nums" }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at)), 1),
                      vueExports.createVNode("span", { class: "text-xs text-slate-400 tabular-nums" }, vueExports.toDisplayString(("formatTime" in _ctx ? _ctx.formatTime : vueExports.unref(formatTime))(row.original.created_at)), 1)
                    ])
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    label: "Nhận",
                    icon: "i-lucide-hand",
                    size: "sm",
                    color: row.original.status.value === "pending" ? "primary" : "neutral",
                    variant: row.original.status.value === "pending" ? "solid" : "soft",
                    disabled: row.original.status.value !== "pending",
                    onClick: ($event) => openClaimDialog(row.original)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UButton, {
                      label: "Nhận",
                      icon: "i-lucide-hand",
                      size: "sm",
                      color: row.original.status.value === "pending" ? "primary" : "neutral",
                      variant: row.original.status.value === "pending" ? "solid" : "soft",
                      disabled: row.original.status.value !== "pending",
                      onClick: ($event) => openClaimDialog(row.original)
                    }, null, 8, ["color", "variant", "disabled", "onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudTablePagination, {
              page: vueExports.unref(page),
              "onUpdate:page": ($event) => vueExports.isRef(page) ? page.value = $event : null,
              meta: vueExports.unref(data)?.meta
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm" }, [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(tickets),
                  columns
                }, {
                  "code-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("button", {
                      class: "inline-flex items-center gap-1.5 w-fit group cursor-pointer",
                      onClick: ($event) => openDetail(row.original)
                    }, [
                      vueExports.createVNode("span", { class: "font-mono text-xs font-bold tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded group-hover:bg-slate-800 group-hover:text-white transition-colors" }, vueExports.toDisplayString(row.original.code), 1),
                      vueExports.createVNode(_component_UIcon, {
                        name: "i-lucide-arrow-up-right",
                        class: "size-3 text-slate-300 group-hover:text-slate-600 transition-colors"
                      })
                    ], 8, ["onClick"])
                  ]),
                  "content-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex flex-col gap-1 min-w-0 max-w-sm" }, [
                      vueExports.createVNode("p", { class: "text-sm text-slate-800 font-semibold leading-snug line-clamp-1" }, vueExports.toDisplayString(row.original.subject), 1),
                      row.original.description ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                        vueExports.createVNode("p", {
                          class: ["text-xs text-slate-500 leading-relaxed whitespace-pre-line", vueExports.unref(expandedDescs).has(row.original.id) ? "" : "line-clamp-2"]
                        }, vueExports.toDisplayString(row.original.description), 3),
                        row.original.description.length > 80 ? (vueExports.openBlock(), vueExports.createBlock("button", {
                          key: 0,
                          class: "text-xs text-slate-400 hover:text-slate-700 cursor-pointer w-fit transition-colors",
                          onClick: ($event) => vueExports.unref(expandedDescs).has(row.original.id) ? vueExports.unref(expandedDescs).delete(row.original.id) : vueExports.unref(expandedDescs).add(row.original.id)
                        }, vueExports.toDisplayString(vueExports.unref(expandedDescs).has(row.original.id) ? "Thu gọn" : "Xem thêm"), 9, ["onClick"])) : vueExports.createCommentVNode("", true)
                      ], 64)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-xs text-slate-300 italic"
                      }, "Không có mô tả"))
                    ])
                  ]),
                  "requester-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex flex-col gap-0.5 min-w-0" }, [
                      vueExports.createVNode("span", { class: "text-sm font-medium text-slate-800 truncate" }, vueExports.toDisplayString(row.original.requester_name), 1),
                      vueExports.createVNode("div", { class: "flex items-center gap-1.5 text-xs text-slate-400" }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-phone",
                          class: "size-3 shrink-0"
                        }),
                        vueExports.createVNode("span", null, vueExports.toDisplayString(row.original.requester_phone), 1),
                        row.original.apartment_name ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createVNode("span", { class: "text-slate-200" }, "|"),
                          vueExports.createVNode(_component_UIcon, {
                            name: "i-lucide-building-2",
                            class: "size-3 shrink-0"
                          }),
                          vueExports.createVNode("span", { class: "truncate" }, vueExports.toDisplayString(row.original.apartment_name), 1)
                        ], 64)) : vueExports.createCommentVNode("", true)
                      ]),
                      row.original.address ? (vueExports.openBlock(), vueExports.createBlock("div", {
                        key: 0,
                        class: "flex items-center gap-1.5 text-xs text-slate-400"
                      }, [
                        vueExports.createVNode(_component_UIcon, {
                          name: "i-lucide-map-pin",
                          class: "size-3 shrink-0"
                        }),
                        vueExports.createVNode("span", {
                          class: "truncate max-w-[200px]",
                          title: row.original.address
                        }, vueExports.toDisplayString(row.original.address), 9, ["title"])
                      ])) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  "meta-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex flex-col gap-1.5" }, [
                      vueExports.createVNode(_component_UBadge, {
                        label: row.original.status.label,
                        color: getStatusColor(row.original.status.value),
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label", "color"]),
                      vueExports.createVNode("span", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(row.original.channel.label), 1)
                    ])
                  ]),
                  "time-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex flex-col gap-0.5" }, [
                      vueExports.createVNode("span", { class: "text-sm text-slate-700 tabular-nums" }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.created_at)), 1),
                      vueExports.createVNode("span", { class: "text-xs text-slate-400 tabular-nums" }, vueExports.toDisplayString(("formatTime" in _ctx ? _ctx.formatTime : vueExports.unref(formatTime))(row.original.created_at)), 1)
                    ])
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UButton, {
                      label: "Nhận",
                      icon: "i-lucide-hand",
                      size: "sm",
                      color: row.original.status.value === "pending" ? "primary" : "neutral",
                      variant: row.original.status.value === "pending" ? "solid" : "soft",
                      disabled: row.original.status.value !== "pending",
                      onClick: ($event) => openClaimDialog(row.original)
                    }, null, 8, ["color", "variant", "disabled", "onClick"])
                  ]),
                  _: 1
                }, 8, ["data"]),
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
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USlideover, {
        open: vueExports.unref(showDetail),
        "onUpdate:open": ($event) => vueExports.isRef(showDetail) ? showDetail.value = $event : null,
        side: "right",
        ui: { content: "max-w-md" }
      }, {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(detailTarget)) {
              _push2(`<div class="flex items-center justify-between w-full"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><span class="font-mono text-sm font-bold tracking-wide bg-slate-100 text-slate-600 px-2.5 py-1 rounded"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(detailTarget).code)}</span>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                label: vueExports.unref(detailTarget).status.label,
                color: getStatusColor(vueExports.unref(detailTarget).status.value),
                variant: "subtle",
                size: "sm"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                icon: "i-lucide-x",
                color: "neutral",
                variant: "ghost",
                size: "sm",
                onClick: ($event) => showDetail.value = false
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.unref(detailTarget) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "flex items-center justify-between w-full"
              }, [
                vueExports.createVNode("div", { class: "flex items-center gap-3" }, [
                  vueExports.createVNode("span", { class: "font-mono text-sm font-bold tracking-wide bg-slate-100 text-slate-600 px-2.5 py-1 rounded" }, vueExports.toDisplayString(vueExports.unref(detailTarget).code), 1),
                  vueExports.createVNode(_component_UBadge, {
                    label: vueExports.unref(detailTarget).status.label,
                    color: getStatusColor(vueExports.unref(detailTarget).status.value),
                    variant: "subtle",
                    size: "sm"
                  }, null, 8, ["label", "color"])
                ]),
                vueExports.createVNode(_component_UButton, {
                  icon: "i-lucide-x",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  onClick: ($event) => showDetail.value = false
                }, null, 8, ["onClick"])
              ])) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(detailTarget)) {
              _push2(`<div class="space-y-6"${_scopeId}><div${_scopeId}><h3 class="text-lg font-bold text-slate-900 leading-snug"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(detailTarget).subject)}</h3><p class="text-xs text-slate-400 mt-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("timeAgo" in _ctx ? _ctx.timeAgo : vueExports.unref(timeAgo))(vueExports.unref(detailTarget).created_at))}</p></div><div class="bg-slate-50 rounded-lg p-4 border border-slate-100"${_scopeId}><p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"${_scopeId}> Mô tả từ cư dân </p>`);
              if (vueExports.unref(detailTarget).description) {
                _push2(`<p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(detailTarget).description)}</p>`);
              } else {
                _push2(`<p class="text-sm text-slate-400 italic"${_scopeId}> Không có mô tả </p>`);
              }
              _push2(`</div><div class="grid grid-cols-2 gap-x-6 gap-y-4"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Người gửi" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(detailTarget).requester_name)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(detailTarget).requester_name), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(detailTarget).requester_phone)}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(detailTarget).requester_phone), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Căn hộ" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(detailTarget).apartment_name ?? "—")}`);
                  } else {
                    return [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(detailTarget).apartment_name ?? "—"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Kênh tiếp nhận" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                      label: vueExports.unref(detailTarget).channel.label,
                      color: "neutral",
                      variant: "subtle",
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(detailTarget).channel.label,
                        color: "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedFieldDisplay, { label: "Ngày gửi" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(detailTarget).created_at))}</span><span class="text-slate-400 ml-1 tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatTime" in _ctx ? _ctx.formatTime : vueExports.unref(formatTime))(vueExports.unref(detailTarget).created_at))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(detailTarget).created_at)), 1),
                      vueExports.createVNode("span", { class: "text-slate-400 ml-1 tabular-nums" }, vueExports.toDisplayString(("formatTime" in _ctx ? _ctx.formatTime : vueExports.unref(formatTime))(vueExports.unref(detailTarget).created_at)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              if (vueExports.unref(detailTarget).address || vueExports.unref(detailHasLocation)) {
                _push2(`<div${_scopeId}><p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"${_scopeId}> Vị trí </p><div class="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-3"${_scopeId}>`);
                if (vueExports.unref(detailTarget).address) {
                  _push2(`<p class="text-sm text-slate-700"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(detailTarget).address)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(detailHasLocation)) {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, null, {}, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (vueExports.unref(detailTarget).attachments && vueExports.unref(detailTarget).attachments.length > 0) {
                _push2(`<div${_scopeId}><p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"${_scopeId}> Tệp đính kèm (${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(detailTarget).attachments.length)}) </p>`);
                if (vueExports.unref(detailImages).length > 0) {
                  _push2(`<div class="grid grid-cols-3 gap-2 mb-3"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(detailImages), (img) => {
                    _push2(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", img.url ?? "#")} target="_blank" class="group relative rounded-lg border border-slate-200 overflow-hidden aspect-square bg-slate-50 hover:shadow-md transition-shadow"${_scopeId}><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", img.url ?? "")}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", img.original_name)} class="w-full h-full object-cover"${_scopeId}><div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"${_scopeId}><p class="text-white text-[9px] truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(img.original_name)}</p></div></a>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (vueExports.unref(detailDocs).length > 0) {
                  _push2(`<div class="flex flex-col gap-2"${_scopeId}><!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(detailDocs), (doc) => {
                    _push2(`<a${serverRenderer_cjs_prodExports.ssrRenderAttr("href", doc.url ?? "#")} target="_blank" class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"${_scopeId}><div class="size-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"${_scopeId}><span class="material-symbols-outlined text-amber-600" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}"${_scopeId}>description</span></div><div class="flex-1 min-w-0"${_scopeId}><p class="text-xs font-medium text-slate-700 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(doc.original_name)}</p><p class="text-[10px] text-slate-400"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(doc.size_bytes))}</p></div><span class="material-symbols-outlined text-slate-400" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "font-size": "16px" })}"${_scopeId}>download</span></a>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.unref(detailTarget) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "space-y-6"
              }, [
                vueExports.createVNode("div", null, [
                  vueExports.createVNode("h3", { class: "text-lg font-bold text-slate-900 leading-snug" }, vueExports.toDisplayString(vueExports.unref(detailTarget).subject), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-400 mt-1" }, vueExports.toDisplayString(("timeAgo" in _ctx ? _ctx.timeAgo : vueExports.unref(timeAgo))(vueExports.unref(detailTarget).created_at)), 1)
                ]),
                vueExports.createVNode("div", { class: "bg-slate-50 rounded-lg p-4 border border-slate-100" }, [
                  vueExports.createVNode("p", { class: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2" }, " Mô tả từ cư dân "),
                  vueExports.unref(detailTarget).description ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 0,
                    class: "text-sm text-slate-700 leading-relaxed whitespace-pre-line"
                  }, vueExports.toDisplayString(vueExports.unref(detailTarget).description), 1)) : (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 1,
                    class: "text-sm text-slate-400 italic"
                  }, " Không có mô tả "))
                ]),
                vueExports.createVNode("div", { class: "grid grid-cols-2 gap-x-6 gap-y-4" }, [
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Người gửi" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(vueExports.unref(detailTarget).requester_name), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Số điện thoại" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(detailTarget).requester_phone), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Căn hộ" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(detailTarget).apartment_name ?? "—"), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Kênh tiếp nhận" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_UBadge, {
                        label: vueExports.unref(detailTarget).channel.label,
                        color: "neutral",
                        variant: "subtle",
                        size: "sm"
                      }, null, 8, ["label"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_SharedFieldDisplay, { label: "Ngày gửi" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(vueExports.unref(detailTarget).created_at)), 1),
                      vueExports.createVNode("span", { class: "text-slate-400 ml-1 tabular-nums" }, vueExports.toDisplayString(("formatTime" in _ctx ? _ctx.formatTime : vueExports.unref(formatTime))(vueExports.unref(detailTarget).created_at)), 1)
                    ]),
                    _: 1
                  })
                ]),
                vueExports.unref(detailTarget).address || vueExports.unref(detailHasLocation) ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 0 }, [
                  vueExports.createVNode("p", { class: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2" }, " Vị trí "),
                  vueExports.createVNode("div", { class: "bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-3" }, [
                    vueExports.unref(detailTarget).address ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "text-sm text-slate-700"
                    }, vueExports.toDisplayString(vueExports.unref(detailTarget).address), 1)) : vueExports.createCommentVNode("", true),
                    vueExports.unref(detailHasLocation) ? (vueExports.openBlock(), vueExports.createBlock(_component_ClientOnly, { key: 1 }, {
                      default: vueExports.withCtx(() => [
                        vueExports.unref(LMap) && vueExports.unref(LTileLayer) && vueExports.unref(LMarker) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                          key: 0,
                          class: "rounded-lg border border-slate-200 overflow-hidden h-[200px]"
                        }, [
                          (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(vueExports.unref(LMap)), {
                            center: vueExports.unref(detailMapCenter),
                            zoom: 15,
                            "use-global-leaflet": false,
                            style: { "width": "100%", "height": "100%" }
                          }, {
                            default: vueExports.withCtx(() => [
                              (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(vueExports.unref(LTileLayer)), {
                                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                              })),
                              (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(vueExports.unref(LMarker)), { "lat-lng": vueExports.unref(detailMapCenter) }, null, 8, ["lat-lng"]))
                            ]),
                            _: 1
                          }, 8, ["center"]))
                        ])) : vueExports.createCommentVNode("", true)
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true)
                  ])
                ])) : vueExports.createCommentVNode("", true),
                vueExports.unref(detailTarget).attachments && vueExports.unref(detailTarget).attachments.length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2" }, " Tệp đính kèm (" + vueExports.toDisplayString(vueExports.unref(detailTarget).attachments.length) + ") ", 1),
                  vueExports.unref(detailImages).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "grid grid-cols-3 gap-2 mb-3"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(detailImages), (img) => {
                      return vueExports.openBlock(), vueExports.createBlock("a", {
                        key: img.id,
                        href: img.url ?? "#",
                        target: "_blank",
                        class: "group relative rounded-lg border border-slate-200 overflow-hidden aspect-square bg-slate-50 hover:shadow-md transition-shadow"
                      }, [
                        vueExports.createVNode("img", {
                          src: img.url ?? "",
                          alt: img.original_name,
                          class: "w-full h-full object-cover"
                        }, null, 8, ["src", "alt"]),
                        vueExports.createVNode("div", { class: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" }, [
                          vueExports.createVNode("p", { class: "text-white text-[9px] truncate" }, vueExports.toDisplayString(img.original_name), 1)
                        ])
                      ], 8, ["href"]);
                    }), 128))
                  ])) : vueExports.createCommentVNode("", true),
                  vueExports.unref(detailDocs).length > 0 ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "flex flex-col gap-2"
                  }, [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(vueExports.unref(detailDocs), (doc) => {
                      return vueExports.openBlock(), vueExports.createBlock("a", {
                        key: doc.id,
                        href: doc.url ?? "#",
                        target: "_blank",
                        class: "flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"
                      }, [
                        vueExports.createVNode("div", { class: "size-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0" }, [
                          vueExports.createVNode("span", {
                            class: "material-symbols-outlined text-amber-600",
                            style: { "font-size": "16px" }
                          }, "description")
                        ]),
                        vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                          vueExports.createVNode("p", { class: "text-xs font-medium text-slate-700 truncate" }, vueExports.toDisplayString(doc.original_name), 1),
                          vueExports.createVNode("p", { class: "text-[10px] text-slate-400" }, vueExports.toDisplayString(("formatFileSize" in _ctx ? _ctx.formatFileSize : vueExports.unref(formatFileSize))(doc.size_bytes)), 1)
                        ]),
                        vueExports.createVNode("span", {
                          class: "material-symbols-outlined text-slate-400",
                          style: { "font-size": "16px" }
                        }, "download")
                      ], 8, ["href"]);
                    }), 128))
                  ])) : vueExports.createCommentVNode("", true)
                ])) : vueExports.createCommentVNode("", true)
              ])) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2 w-full"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Đóng",
              color: "neutral",
              variant: "ghost",
              onClick: ($event) => showDetail.value = false
            }, null, _parent2, _scopeId));
            if (vueExports.unref(detailTarget)?.status.value === "pending") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                label: "Nhận ticket này",
                icon: "i-lucide-hand",
                color: "primary",
                onClick: claimFromDetail
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Đóng",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showDetail.value = false
                }, null, 8, ["onClick"]),
                vueExports.unref(detailTarget)?.status.value === "pending" ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                  key: 0,
                  label: "Nhận ticket này",
                  icon: "i-lucide-hand",
                  color: "primary",
                  onClick: claimFromDetail
                })) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UModal, {
        open: vueExports.unref(showClaimDialog),
        "onUpdate:open": ($event) => vueExports.isRef(showClaimDialog) ? showClaimDialog.value = $event : null,
        title: "Xác nhận nhận ticket"
      }, {
        body: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vueExports.unref(claimTarget)) {
              _push2(`<div class="space-y-3"${_scopeId}><p class="text-slate-700"${_scopeId}> Bạn muốn nhận ticket này? </p><div class="bg-slate-50 rounded-lg p-3 border border-slate-100"${_scopeId}><div class="flex items-center gap-2 mb-1"${_scopeId}><span class="font-mono text-xs font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(claimTarget).code)}</span></div><p class="text-sm font-medium text-slate-800"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(claimTarget).subject)}</p></div><p class="text-xs text-slate-400"${_scopeId}> Ticket sẽ được gán cho tổ chức của bạn và chuyển sang trạng thái tiếp nhận. </p></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vueExports.unref(claimTarget) ? (vueExports.openBlock(), vueExports.createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                vueExports.createVNode("p", { class: "text-slate-700" }, " Bạn muốn nhận ticket này? "),
                vueExports.createVNode("div", { class: "bg-slate-50 rounded-lg p-3 border border-slate-100" }, [
                  vueExports.createVNode("div", { class: "flex items-center gap-2 mb-1" }, [
                    vueExports.createVNode("span", { class: "font-mono text-xs font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded" }, vueExports.toDisplayString(vueExports.unref(claimTarget).code), 1)
                  ]),
                  vueExports.createVNode("p", { class: "text-sm font-medium text-slate-800" }, vueExports.toDisplayString(vueExports.unref(claimTarget).subject), 1)
                ]),
                vueExports.createVNode("p", { class: "text-xs text-slate-400" }, " Ticket sẽ được gán cho tổ chức của bạn và chuyển sang trạng thái tiếp nhận. ")
              ])) : vueExports.createCommentVNode("", true)
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
              onClick: ($event) => showClaimDialog.value = false
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
              label: "Xác nhận",
              icon: "i-lucide-check",
              color: "primary",
              loading: vueExports.unref(isClaiming),
              onClick: handleClaim
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "flex justify-end gap-2 w-full" }, [
                vueExports.createVNode(_component_UButton, {
                  label: "Hủy",
                  color: "neutral",
                  variant: "ghost",
                  onClick: ($event) => showClaimDialog.value = false
                }, null, 8, ["onClick"]),
                vueExports.createVNode(_component_UButton, {
                  label: "Xác nhận",
                  icon: "i-lucide-check",
                  color: "primary",
                  loading: vueExports.unref(isClaiming),
                  onClick: handleClaim
                }, null, 8, ["loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/og-tickets/pool.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=pool-B2F-NPsN.mjs.map
