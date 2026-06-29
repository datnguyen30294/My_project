import { d as useCommissionAllocationReport, _ as __nuxt_component_0, a as __nuxt_component_2 } from './usePlatformReports-BrU8H7Za.mjs';
import { _ as _sfc_main$1 } from './Alert-tTsPKADX.mjs';
import { _ as __nuxt_component_3 } from './KpiCard-rAAySggO.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$2 } from './Table-17SH0cIR.mjs';
import { f as formatCurrency, a as formatNumber } from './currency-DEb2TrW3.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports } from './server.mjs';
import './Select-CZE7Ef6n.mjs';
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
import './Card-ywPiICev.mjs';
import './Skeleton-CKN2C2Mt.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
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
  __name: "hoa-hong-phan-bo",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Hoa hồng & phân bổ - Báo cáo tổng hợp" });
    const months = vueExports.ref(6);
    const { data, status, error } = useCommissionAllocationReport(vueExports.computed(() => ({ months: months.value })));
    const report = vueExports.computed(() => data.value?.data ?? null);
    const kpis = vueExports.computed(() => report.value?.kpis ?? null);
    const isLoading = vueExports.computed(() => status.value === "pending");
    const recipientColumns = [
      { accessorKey: "label", header: "Đối tượng nhận" },
      { id: "order_count", header: "Số đơn" },
      { id: "amount", header: "Số tiền" }
    ];
    const vendorColumns = [
      { accessorKey: "partner_name", header: "Vendor" },
      { id: "order_count", header: "Đơn" },
      { id: "commission", header: "Hoa hồng" },
      { id: "platform_share", header: "Platform" },
      { id: "vh_share", header: "VH" }
    ];
    const projectColumns = [
      { accessorKey: "project_name", header: "Dự án" },
      { id: "order_count", header: "Đơn" },
      { id: "platform_share", header: "Platform" },
      { id: "vh_share", header: "VH" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PlatformReportPageHeader = __nuxt_component_0;
      const _component_PlatformReportPeriodSelect = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_PlatformReportKpiCard = __nuxt_component_3;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UTable = _sfc_main$2;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPageHeader, {
        title: "Hoa hồng & phân bổ",
        description: "Tổng hoa hồng vendor toàn nền tảng và cách chia về Platform (TNP) vs công ty vận hành — chỉ tính trên đơn marketplace."
      }, {
        filters: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportPeriodSelect, {
              modelValue: vueExports.unref(months),
              "onUpdate:modelValue": ($event) => vueExports.isRef(months) ? months.value = $event : null
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_PlatformReportPeriodSelect, {
                modelValue: vueExports.unref(months),
                "onUpdate:modelValue": ($event) => vueExports.isRef(months) ? months.value = $event : null
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (vueExports.unref(error)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
          icon: "i-lucide-alert-circle",
          color: "error",
          variant: "subtle",
          title: "Không tải được báo cáo",
          description: "Đã xảy ra lỗi khi tải hoa hồng & phân bổ. Vui lòng thử lại.",
          class: "mb-6"
        }, null, _parent));
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Tổng hoa hồng / phí",
          value: ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.commission_total ?? 0),
          sub: "Toàn bộ đơn active",
          icon: "i-lucide-coins",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Platform nhận",
          value: ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.platform_total ?? 0),
          sub: `${vueExports.unref(kpis)?.platform_share_pct ?? 0}% tổng hoa hồng`,
          icon: "i-lucide-landmark",
          accent: "success",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "VH nhận",
          value: ("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.vh_total ?? 0),
          sub: `${vueExports.unref(kpis)?.vh_share_pct ?? 0}% tổng hoa hồng`,
          icon: "i-lucide-building-2",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_PlatformReportKpiCard, {
          label: "Tỷ lệ platform",
          value: `${vueExports.unref(kpis)?.platform_share_pct ?? 0}%`,
          sub: "Phần nền tảng giữ",
          icon: "i-lucide-percent",
          accent: "success",
          pending: vueExports.unref(isLoading)
        }, null, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Phân bổ theo đối tượng nhận",
          icon: "i-lucide-split",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5"${_scopeId}><div class="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4"${_scopeId}><div class="text-sm text-slate-600"${_scopeId}> Platform </div><div class="mt-1 text-2xl font-bold text-emerald-600 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.platform_total ?? 0))}</div><div class="text-xs text-slate-500 mt-0.5"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(kpis)?.platform_share_pct ?? 0)}% tổng hoa hồng </div></div><div class="rounded-lg border border-slate-200 p-4"${_scopeId}><div class="text-sm text-slate-600"${_scopeId}> Công ty VH </div><div class="mt-1 text-2xl font-bold text-slate-900 tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.vh_total ?? 0))}</div><div class="text-xs text-slate-500 mt-0.5"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(kpis)?.vh_share_pct ?? 0)}% tổng hoa hồng </div></div></div>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(report)?.by_recipient ?? [],
                columns: recipientColumns,
                loading: vueExports.unref(isLoading)
              }, {
                "label-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.label)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.label), 1)
                    ];
                  }
                }),
                "order_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                    ];
                  }
                }),
                "amount-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                    ];
                  }
                }),
                empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Chưa có hoa hồng phát sinh trong kỳ. </div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có hoa hồng phát sinh trong kỳ. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5" }, [
                  vueExports.createVNode("div", { class: "rounded-lg border border-emerald-200 bg-emerald-50/50 p-4" }, [
                    vueExports.createVNode("div", { class: "text-sm text-slate-600" }, " Platform "),
                    vueExports.createVNode("div", { class: "mt-1 text-2xl font-bold text-emerald-600 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.platform_total ?? 0)), 1),
                    vueExports.createVNode("div", { class: "text-xs text-slate-500 mt-0.5" }, vueExports.toDisplayString(vueExports.unref(kpis)?.platform_share_pct ?? 0) + "% tổng hoa hồng ", 1)
                  ]),
                  vueExports.createVNode("div", { class: "rounded-lg border border-slate-200 p-4" }, [
                    vueExports.createVNode("div", { class: "text-sm text-slate-600" }, " Công ty VH "),
                    vueExports.createVNode("div", { class: "mt-1 text-2xl font-bold text-slate-900 tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(kpis)?.vh_total ?? 0)), 1),
                    vueExports.createVNode("div", { class: "text-xs text-slate-500 mt-0.5" }, vueExports.toDisplayString(vueExports.unref(kpis)?.vh_share_pct ?? 0) + "% tổng hoa hồng ", 1)
                  ])
                ]),
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(report)?.by_recipient ?? [],
                  columns: recipientColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "label-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.label), 1)
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "amount-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.amount)), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có hoa hồng phát sinh trong kỳ. ")
                  ]),
                  _: 1
                }, 8, ["data", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Theo vendor",
          icon: "i-lucide-store",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(report)?.by_vendor ?? [],
                columns: vendorColumns,
                loading: vueExports.unref(isLoading)
              }, {
                "partner_name-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.partner_name)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.partner_name), 1)
                    ];
                  }
                }),
                "order_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                    ];
                  }
                }),
                "commission-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission)), 1)
                    ];
                  }
                }),
                "platform_share-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums text-emerald-600"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_share))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_share)), 1)
                    ];
                  }
                }),
                "vh_share-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.vh_share))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.vh_share)), 1)
                    ];
                  }
                }),
                empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Chưa có vendor phát sinh hoa hồng. </div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có vendor phát sinh hoa hồng. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(report)?.by_vendor ?? [],
                  columns: vendorColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "partner_name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.partner_name), 1)
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "commission-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission)), 1)
                  ]),
                  "platform_share-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_share)), 1)
                  ]),
                  "vh_share-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.vh_share)), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có vendor phát sinh hoa hồng. ")
                  ]),
                  _: 1
                }, 8, ["data", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Theo dự án",
          icon: "i-lucide-folder-kanban",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                data: vueExports.unref(report)?.by_project ?? [],
                columns: projectColumns,
                loading: vueExports.unref(isLoading)
              }, {
                "project_name-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="font-medium text-slate-900"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(row.original.project_name)}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.project_name), 1)
                    ];
                  }
                }),
                "order_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                    ];
                  }
                }),
                "platform_share-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums text-emerald-600"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_share))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_share)), 1)
                    ];
                  }
                }),
                "vh_share-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.vh_share))}</span>`);
                  } else {
                    return [
                      vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.vh_share)), 1)
                    ];
                  }
                }),
                empty: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="py-8 text-center text-sm text-slate-500"${_scopeId2}> Chưa có dự án phát sinh hoa hồng. </div>`);
                  } else {
                    return [
                      vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có dự án phát sinh hoa hồng. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                vueExports.createVNode(_component_UTable, {
                  data: vueExports.unref(report)?.by_project ?? [],
                  columns: projectColumns,
                  loading: vueExports.unref(isLoading)
                }, {
                  "project_name-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "font-medium text-slate-900" }, vueExports.toDisplayString(row.original.project_name), 1)
                  ]),
                  "order_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.order_count)), 1)
                  ]),
                  "platform_share-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.platform_share)), 1)
                  ]),
                  "vh_share-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.vh_share)), 1)
                  ]),
                  empty: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "py-8 text-center text-sm text-slate-500" }, " Chưa có dự án phát sinh hoa hồng. ")
                  ]),
                  _: 1
                }, 8, ["data", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/modules/bao-cao-tong-hop/hoa-hong-phan-bo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=hoa-hong-phan-bo-CG78Ugjh.mjs.map
