import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as _sfc_main$1 } from './Card-ywPiICev.mjs';
import { _ as _sfc_main$2 } from './Input-JXN8po_F.mjs';
import { _ as _sfc_main$3 } from './Select-CZE7Ef6n.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, l as _sfc_main$c, _ as __nuxt_component_0$4 } from './server.mjs';
import { _ as __nuxt_component_2 } from './TableWrapper-VwUckvcF.mjs';
import { _ as _sfc_main$4 } from './Table-17SH0cIR.mjs';
import { _ as _sfc_main$5 } from './Badge-W93D3Jpz.mjs';
import { _ as __nuxt_component_10 } from './TablePagination-CZYWB-qm.mjs';
import { f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { u as useReceivableList, a as useReceivableSummary, R as RECEIVABLE_STATUS_OPTIONS, f as formatAgingDays, r as receivableStatusColor } from './useReceivables-eUxCdlsS.mjs';
import { a as formatDate } from './date-R5YK0ast.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';
import { u as useTableSearch } from './useTableSearch-BhG9s2Ie.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import { s as stickyRight } from './table-z_7x7CvB.mjs';
import './index-QmZAbLx-.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './FocusScope-BZehoQSg.mjs';
import './useFocusGuards-CJykkUFH.mjs';
import './utils-DY0Zag2O.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
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
import './SelectMenu-DKHEMZj7.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './index-CSThDD3J.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './useProjects-D4K3VYdb.mjs';
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
import './PageError-kZWsA9dh.mjs';
import './apiError-DBrxF9au.mjs';
import './Pagination-fZq_Msxb.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Công nợ phải thu - Thần Nông" });
    const params = vueExports.reactive({
      per_page: DEFAULT_PER_PAGE
    });
    const page = vueExports.ref(1);
    const { searchInput, onSearch } = useTableSearch((value) => {
      params.search = value || void 0;
      page.value = 1;
    });
    const selectedStatus = vueExports.ref(void 0);
    const selectedProjectId = vueExports.ref(void 0);
    const { isInitFromUrl } = useUrlFilters({
      search: { ref: vueExports.toRef(params, "search"), type: "string", onInit: (v) => {
        searchInput.value = String(v);
      } },
      page: { ref: page, type: "number", defaultValue: 1 },
      status: { ref: selectedStatus, type: "string", onInit: (v) => {
        params.status = String(v);
      } },
      project_id: { ref: selectedProjectId, type: "number", onInit: (v) => {
        selectedProjectId.value = Number(v);
        params.project_id = Number(v);
      } }
    });
    vueExports.watch(selectedStatus, (val) => {
      params.status = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    vueExports.watch(selectedProjectId, (val) => {
      params.project_id = val || void 0;
      if (!isInitFromUrl.value) page.value = 1;
    });
    const hasFilters = vueExports.computed(() => !!searchInput.value || !!selectedStatus.value || selectedProjectId.value != null);
    function clearFilters() {
      searchInput.value = "";
      params.search = void 0;
      selectedStatus.value = void 0;
      selectedProjectId.value = void 0;
      page.value = 1;
    }
    const { data, status, error, refresh } = useReceivableList(
      vueExports.computed(() => ({ ...params, page: page.value }))
    );
    const receivables = vueExports.computed(() => data.value?.data ?? []);
    const summaryParams = vueExports.computed(() => ({
      project_id: selectedProjectId.value ?? void 0
    }));
    const { data: summaryData } = useReceivableSummary(summaryParams);
    const kpi = vueExports.computed(() => summaryData.value?.data?.kpi);
    const aging = vueExports.computed(() => summaryData.value?.data?.aging ?? []);
    const columns = [
      { id: "order_info", header: "Đơn hàng" },
      { id: "project", header: "Dự án" },
      { id: "amount", header: "Phải thu" },
      { id: "paid_amount", header: "Đã thu" },
      { id: "outstanding", header: "Còn nợ" },
      { id: "status", header: "Trạng thái" },
      { id: "due_date", header: "Hạn TT" },
      { id: "aging", header: "Tuổi nợ" },
      stickyRight({ id: "actions", header: "Thao tác" }, { width: "w-[80px] min-w-[80px]" })
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_UCard = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_USelect = _sfc_main$3;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_SharedCrudTableWrapper = __nuxt_component_2;
      const _component_UTable = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UBadge = _sfc_main$5;
      const _component_SharedCrudTablePagination = __nuxt_component_10;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Công nợ phải thu",
        description: "Quản lý công nợ phải thu từ đơn hàng"
      }, {
        actions: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}></span>`);
          } else {
            return [
              vueExports.createVNode("span")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (vueExports.unref(kpi)) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-xs text-slate-500 mb-1"${_scopeId}> Tổng phải thu </div><div class="text-lg font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpi).total_amount))}</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Tổng phải thu "),
                vueExports.createVNode("div", { class: "text-lg font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpi).total_amount)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-xs text-slate-500 mb-1"${_scopeId}> Đã thu </div><div class="text-lg font-bold text-[var(--ui-success)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpi).total_paid))}</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Đã thu "),
                vueExports.createVNode("div", { class: "text-lg font-bold text-[var(--ui-success)]" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpi).total_paid)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-xs text-slate-500 mb-1"${_scopeId}> Còn nợ </div><div class="text-lg font-bold text-[var(--ui-warning)]"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpi).total_outstanding))}</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Còn nợ "),
                vueExports.createVNode("div", { class: "text-lg font-bold text-[var(--ui-warning)]" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpi).total_outstanding)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, null, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-xs text-slate-500 mb-1"${_scopeId}> Số khoản </div><div class="text-lg font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(kpi).count)}</div>`);
            } else {
              return [
                vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, " Số khoản "),
                vueExports.createVNode("div", { class: "text-lg font-bold text-slate-900" }, vueExports.toDisplayString(vueExports.unref(kpi).count), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(aging).length > 0) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6"><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(aging), (bucket) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UCard, {
            key: bucket.bucket
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-xs text-slate-500 mb-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(bucket.label)}</div><div class="text-sm font-bold text-slate-900"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(bucket.total))}</div><div class="text-xs text-slate-400"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(bucket.count)} khoản </div>`);
              } else {
                return [
                  vueExports.createVNode("div", { class: "text-xs text-slate-500 mb-1" }, vueExports.toDisplayString(bucket.label), 1),
                  vueExports.createVNode("div", { class: "text-sm font-bold text-slate-900" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(bucket.total)), 1),
                  vueExports.createVNode("div", { class: "text-xs text-slate-400" }, vueExports.toDisplayString(bucket.count) + " khoản ", 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-4 flex flex-wrap items-center gap-3">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UInput, {
        modelValue: vueExports.unref(searchInput),
        "onUpdate:modelValue": [($event) => vueExports.isRef(searchInput) ? searchInput.value = $event : null, vueExports.unref(onSearch)],
        icon: "i-lucide-search",
        placeholder: "Tìm theo mã đơn, khách hàng...",
        class: "max-w-sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USelect, {
        modelValue: vueExports.unref(selectedStatus),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedStatus) ? selectedStatus.value = $event : null,
        items: "RECEIVABLE_STATUS_OPTIONS" in _ctx ? _ctx.RECEIVABLE_STATUS_OPTIONS : vueExports.unref(RECEIVABLE_STATUS_OPTIONS),
        placeholder: "Trạng thái",
        class: "w-44"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
        modelValue: vueExports.unref(selectedProjectId),
        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
        placeholder: "Dự án",
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
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
              data: vueExports.unref(receivables),
              columns
            }, {
              "order_info-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col gap-0.5"${_scopeId2}><div class="flex items-center gap-1.5"${_scopeId2}>`);
                  if (row.original.order) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/receivables/${row.original.id}`,
                      class: "text-primary hover:underline font-mono text-xs font-semibold"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.order.code)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.order.code), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  if (row.original.og_ticket?.subject) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                      to: `/pmc/receivables/${row.original.id}`,
                      class: "text-xs text-slate-700 line-clamp-1 hover:text-primary-700 hover:underline"
                    }, {
                      default: vueExports.withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.og_ticket.subject)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.og_ticket.subject), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (row.original.og_ticket?.customer?.full_name ?? row.original.og_ticket?.requester_name) {
                    _push3(`<span class="text-[11px] text-slate-400"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.og_ticket?.customer?.full_name ?? row.original.og_ticket?.requester_name)} `);
                    if (row.original.og_ticket?.apartment_name) {
                      _push3(`<!--[--> · ${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.og_ticket.apartment_name)}<!--]-->`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "flex flex-col gap-0.5" }, [
                      vueExports.createVNode("div", { class: "flex items-center gap-1.5" }, [
                        row.original.order ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/receivables/${row.original.id}`,
                          class: "text-primary hover:underline font-mono text-xs font-semibold"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.order.code), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])) : vueExports.createCommentVNode("", true)
                      ]),
                      row.original.og_ticket?.subject ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/receivables/${row.original.id}`,
                        class: "text-xs text-slate-700 line-clamp-1 hover:text-primary-700 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.og_ticket.subject), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])) : vueExports.createCommentVNode("", true),
                      row.original.og_ticket?.customer?.full_name ?? row.original.og_ticket?.requester_name ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-[11px] text-slate-400"
                      }, [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.og_ticket?.customer?.full_name ?? row.original.og_ticket?.requester_name) + " ", 1),
                        row.original.og_ticket?.apartment_name ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createTextVNode(" · " + vueExports.toDisplayString(row.original.og_ticket.apartment_name), 1)
                        ], 64)) : vueExports.createCommentVNode("", true)
                      ])) : vueExports.createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              "project-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project?.name ?? "—")}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.project?.name ?? "—"), 1)
                  ];
                }
              }),
              "amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount))}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                  ];
                }
              }),
              "paid_amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.paid_amount))}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.paid_amount)), 1)
                  ];
                }
              }),
              "outstanding-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass({ "font-bold": parseFloat(row.original.outstanding) > 0 })}"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.outstanding))}</span>`);
                } else {
                  return [
                    vueExports.createVNode("span", {
                      class: { "font-bold": parseFloat(row.original.outstanding) > 0 }
                    }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.outstanding)), 3)
                  ];
                }
              }),
              "status-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UBadge, {
                    label: row.original.status.label,
                    color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(row.original.status.value),
                    variant: "subtle",
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(row.original.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ];
                }
              }),
              "due_date-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.due_date))}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.due_date)), 1)
                  ];
                }
              }),
              "aging-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(("formatAgingDays" in _ctx ? _ctx.formatAgingDays : vueExports.unref(formatAgingDays))(row.original.aging_days, row.original.status.value))}`);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatAgingDays" in _ctx ? _ctx.formatAgingDays : vueExports.unref(formatAgingDays))(row.original.aging_days, row.original.status.value)), 1)
                  ];
                }
              }),
              "actions-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-eye",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    title: "Chi tiết",
                    to: `/pmc/receivables/${row.original.id}`
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-eye",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      title: "Chi tiết",
                      to: `/pmc/receivables/${row.original.id}`
                    }, null, 8, ["to"])
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
                  data: vueExports.unref(receivables),
                  columns
                }, {
                  "order_info-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("div", { class: "flex flex-col gap-0.5" }, [
                      vueExports.createVNode("div", { class: "flex items-center gap-1.5" }, [
                        row.original.order ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                          key: 0,
                          to: `/pmc/receivables/${row.original.id}`,
                          class: "text-primary hover:underline font-mono text-xs font-semibold"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.original.order.code), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])) : vueExports.createCommentVNode("", true)
                      ]),
                      row.original.og_ticket?.subject ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/pmc/receivables/${row.original.id}`,
                        class: "text-xs text-slate-700 line-clamp-1 hover:text-primary-700 hover:underline"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.original.og_ticket.subject), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])) : vueExports.createCommentVNode("", true),
                      row.original.og_ticket?.customer?.full_name ?? row.original.og_ticket?.requester_name ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "text-[11px] text-slate-400"
                      }, [
                        vueExports.createTextVNode(vueExports.toDisplayString(row.original.og_ticket?.customer?.full_name ?? row.original.og_ticket?.requester_name) + " ", 1),
                        row.original.og_ticket?.apartment_name ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createTextVNode(" · " + vueExports.toDisplayString(row.original.og_ticket.apartment_name), 1)
                        ], 64)) : vueExports.createCommentVNode("", true)
                      ])) : vueExports.createCommentVNode("", true)
                    ])
                  ]),
                  "project-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(row.original.project?.name ?? "—"), 1)
                  ]),
                  "amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                  ]),
                  "paid_amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.paid_amount)), 1)
                  ]),
                  "outstanding-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", {
                      class: { "font-bold": parseFloat(row.original.outstanding) > 0 }
                    }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.outstanding)), 3)
                  ]),
                  "status-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UBadge, {
                      label: row.original.status.label,
                      color: ("receivableStatusColor" in _ctx ? _ctx.receivableStatusColor : vueExports.unref(receivableStatusColor))(row.original.status.value),
                      variant: "subtle",
                      size: "sm"
                    }, null, 8, ["label", "color"])
                  ]),
                  "due_date-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatDate" in _ctx ? _ctx.formatDate : vueExports.unref(formatDate))(row.original.due_date)), 1)
                  ]),
                  "aging-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createTextVNode(vueExports.toDisplayString(("formatAgingDays" in _ctx ? _ctx.formatAgingDays : vueExports.unref(formatAgingDays))(row.original.aging_days, row.original.status.value)), 1)
                  ]),
                  "actions-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode(_component_UButton, {
                      icon: "i-lucide-eye",
                      color: "neutral",
                      variant: "ghost",
                      size: "sm",
                      title: "Chi tiết",
                      to: `/pmc/receivables/${row.original.id}`
                    }, null, 8, ["to"])
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pmc/receivables/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-rLP7bFcX.mjs.map
