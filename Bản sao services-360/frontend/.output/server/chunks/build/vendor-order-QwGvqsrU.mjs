import { _ as __nuxt_component_0 } from './PageHeader-BJhealxW.mjs';
import { _ as __nuxt_component_2 } from './PageError-kZWsA9dh.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CH-mG9Mf.mjs';
import { _ as _sfc_main$2 } from './FormField-DFdmv6Lu.mjs';
import { v as vueExports, u as useSeoMeta, s as serverRenderer_cjs_prodExports, w as __nuxt_component_5, l as _sfc_main$c, k as _sfc_main$h, o as useApiFetch } from './server.mjs';
import { _ as __nuxt_component_3 } from './ProjectSelect-BTBiFCd5.mjs';
import { _ as _sfc_main$3 } from './Alert-tTsPKADX.mjs';
import { _ as _sfc_main$4 } from './Skeleton-CKN2C2Mt.mjs';
import { _ as __nuxt_component_10 } from './StackedColumnChart-Co01WETk.mjs';
import { _ as _sfc_main$5 } from './Table-17SH0cIR.mjs';
import { a as formatNumber, f as formatCurrency } from './currency-DEb2TrW3.mjs';
import { Z as Zl } from './vue-datepicker-6F5-CyxW.mjs';
import { u as useReportDateRange } from './useReportDateRange-TMS_xfWx.mjs';
import { u as useUrlFilters } from './useUrlFilters-D9dcjQcy.mjs';
import './apiError-DBrxF9au.mjs';
import './Label-BBgw4vHh.mjs';
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
import './SelectMenu-DKHEMZj7.mjs';
import './FocusScope-BZehoQSg.mjs';
import './PopperArrow-C9hHWuSZ.mjs';
import './useDirection-CXYby7CP.mjs';
import './useFormControl-_Lqv8ipK.mjs';
import './useKbd-JjFOu4f7.mjs';
import './utils-BgcT7rQQ.mjs';
import './VisuallyHiddenInput-q6Pz-w0i.mjs';
import './handleAndDispatchCustomEvent-Bk_AVSSo.mjs';
import './index-CSThDD3J.mjs';
import './index-QmZAbLx-.mjs';
import './Input-JXN8po_F.mjs';
import './useEntitySelect-DG9pQ_n0.mjs';
import './constants-G9YmtWtp.mjs';
import './useProjects-D4K3VYdb.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "LineChart",
  __ssrInlineRender: true,
  props: {
    points: {},
    series: {},
    emptyText: { default: "Chưa có dữ liệu" },
    height: { default: 320 },
    valueSuffix: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const PAD = { top: 20, right: 20, bottom: 36, left: 60 };
    vueExports.ref(null);
    const width = vueExports.ref(720);
    const seriesList = vueExports.computed(() => [...props.series]);
    const pointList = vueExports.computed(() => [...props.points]);
    const hasData = vueExports.computed(() => pointList.value.length > 0);
    const plotW = vueExports.computed(() => Math.max(0, width.value - PAD.left - PAD.right));
    const plotH = vueExports.computed(() => props.height - PAD.top - PAD.bottom);
    const maxValue = vueExports.computed(() => {
      let max = 0;
      for (const p of pointList.value) {
        for (const s of seriesList.value) {
          const v = p.values[s.key] ?? 0;
          if (v > max) max = v;
        }
      }
      return max > 0 ? max : 1;
    });
    function xAt(i) {
      const n = pointList.value.length;
      if (n <= 1) return PAD.left + plotW.value / 2;
      return PAD.left + i / (n - 1) * plotW.value;
    }
    function yAt(v) {
      return PAD.top + plotH.value - v / maxValue.value * plotH.value;
    }
    function smoothPath(coords) {
      const n = coords.length;
      if (n === 0) return "";
      if (n === 1) return `M ${coords[0][0]} ${coords[0][1]}`;
      let d = `M ${coords[0][0]} ${coords[0][1]}`;
      for (let i = 0; i < n - 1; i++) {
        const p0 = coords[i - 1] ?? coords[i];
        const p1 = coords[i];
        const p2 = coords[i + 1];
        const p3 = coords[i + 2] ?? p2;
        const t = 0.18;
        const c1x = p1[0] + (p2[0] - p0[0]) * t;
        const c1y = p1[1] + (p2[1] - p0[1]) * t;
        const c2x = p2[0] - (p3[0] - p1[0]) * t;
        const c2y = p2[1] - (p3[1] - p1[1]) * t;
        d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
      }
      return d;
    }
    const renderedSeries = vueExports.computed(
      () => seriesList.value.map((s) => {
        const coords = pointList.value.map(
          (p, i) => [xAt(i), yAt(p.values[s.key] ?? 0)]
        );
        const line = smoothPath(coords);
        const baseY = PAD.top + plotH.value;
        const first = coords[0];
        const last = coords[coords.length - 1];
        const area = line && first && last ? `${line} L ${last[0]} ${baseY} L ${first[0]} ${baseY} Z` : "";
        return {
          key: s.key,
          label: s.label,
          color: s.color,
          fill: s.fill ?? false,
          line,
          area
        };
      })
    );
    const yTicks = vueExports.computed(() => {
      const steps = 4;
      return Array.from({ length: steps + 1 }, (_, i) => {
        const v = maxValue.value / steps * i;
        return { value: v, y: yAt(v) };
      });
    });
    const xLabels = vueExports.computed(() => {
      const n = pointList.value.length;
      if (n === 0) return [];
      const maxLabels = Math.max(2, Math.floor(plotW.value / 56));
      const step = Math.max(1, Math.ceil(n / maxLabels));
      return pointList.value.map((p, i) => ({ i, x: xAt(i), label: formatDayLabel(p.label) })).filter((item) => item.i % step === 0 || item.i === n - 1);
    });
    function formatDayLabel(raw) {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return raw;
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    }
    function formatFullDate(raw) {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return raw;
      return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
    }
    function formatShort(n) {
      const abs = Math.abs(n);
      if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
      if (abs >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
      if (abs >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
      return new Intl.NumberFormat("vi-VN").format(Math.round(n));
    }
    function formatFull(n) {
      return `${new Intl.NumberFormat("vi-VN").format(Math.round(n))}${props.valueSuffix}`;
    }
    const hoverIndex = vueExports.ref(null);
    const hoverPoint = vueExports.computed(() => {
      if (hoverIndex.value == null) return null;
      const p = pointList.value[hoverIndex.value];
      if (!p) return null;
      return { index: hoverIndex.value, x: xAt(hoverIndex.value), point: p };
    });
    const tooltipStyle = vueExports.computed(() => {
      if (!hoverPoint.value) return {};
      const half = width.value / 2;
      const onLeftHalf = hoverPoint.value.x <= half;
      return onLeftHalf ? { left: `${hoverPoint.value.x + 12}px` } : { right: `${width.value - hoverPoint.value.x + 12}px` };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="flex flex-wrap gap-4 text-xs mb-3"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(seriesList), (s) => {
        _push(`<span class="flex items-center gap-1.5"><span class="inline-block w-3 h-[3px] rounded-full" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundColor: s.color })}"></span><span class="text-slate-600">${serverRenderer_cjs_prodExports.ssrInterpolate(s.label)}</span></span>`);
      });
      _push(`<!--]--></div>`);
      if (!vueExports.unref(hasData)) {
        _push(`<p class="py-12 text-center text-sm text-slate-500">${serverRenderer_cjs_prodExports.ssrInterpolate(props.emptyText)}</p>`);
      } else {
        _push(`<div class="relative w-full select-none" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ height: `${props.height}px` })}"><svg${serverRenderer_cjs_prodExports.ssrRenderAttr("width", vueExports.unref(width))}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", props.height)}${serverRenderer_cjs_prodExports.ssrRenderAttr("viewBox", `0 0 ${vueExports.unref(width)} ${props.height}`)} class="text-slate-400" role="img" aria-label="Biểu đồ doanh thu theo ngày"><defs><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(renderedSeries), (s) => {
          _push(`<linearGradient${serverRenderer_cjs_prodExports.ssrRenderAttr("id", `grad-${s.key}`)} x1="0" y1="0" x2="0" y2="1"><stop offset="0%"${serverRenderer_cjs_prodExports.ssrRenderAttr("stop-color", s.color)} stop-opacity="0.22"></stop><stop offset="100%"${serverRenderer_cjs_prodExports.ssrRenderAttr("stop-color", s.color)} stop-opacity="0"></stop></linearGradient>`);
        });
        _push(`<!--]--></defs><g><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(yTicks), (t, i) => {
          _push(`<line${serverRenderer_cjs_prodExports.ssrRenderAttr("x1", PAD.left)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y1", t.y)}${serverRenderer_cjs_prodExports.ssrRenderAttr("x2", vueExports.unref(width) - PAD.right)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y2", t.y)} stroke="currentColor"${serverRenderer_cjs_prodExports.ssrRenderAttr("stroke-opacity", i === 0 ? 0.35 : 0.12)}></line>`);
        });
        _push(`<!--]--><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(yTicks), (t, i) => {
          _push(`<text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", PAD.left - 10)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", t.y + 3)} text-anchor="end" class="fill-slate-400 text-[10px] tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(formatShort(t.value))}</text>`);
        });
        _push(`<!--]--></g><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(renderedSeries), (s) => {
          _push(`<path${serverRenderer_cjs_prodExports.ssrRenderAttr("d", s.area)}${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", `url(#grad-${s.key})`)} stroke="none" style="${serverRenderer_cjs_prodExports.ssrRenderStyle(s.fill ? null : { display: "none" })}"></path>`);
        });
        _push(`<!--]--><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(renderedSeries), (s) => {
          _push(`<path${serverRenderer_cjs_prodExports.ssrRenderAttr("d", s.line)} fill="none"${serverRenderer_cjs_prodExports.ssrRenderAttr("stroke", s.color)} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>`);
        });
        _push(`<!--]-->`);
        if (vueExports.unref(hoverPoint)) {
          _push(`<!--[--><line${serverRenderer_cjs_prodExports.ssrRenderAttr("x1", vueExports.unref(hoverPoint).x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y1", PAD.top)}${serverRenderer_cjs_prodExports.ssrRenderAttr("x2", vueExports.unref(hoverPoint).x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y2", props.height - PAD.bottom)} stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="3,3"></line><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(renderedSeries), (s) => {
            _push(`<circle${serverRenderer_cjs_prodExports.ssrRenderAttr("cx", vueExports.unref(hoverPoint).x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("cy", yAt(vueExports.unref(hoverPoint).point.values[s.key] ?? 0))} r="4"${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", s.color)} stroke="#fff" stroke-width="2"></circle>`);
          });
          _push(`<!--]--><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(xLabels), (xl) => {
          _push(`<text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", xl.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", props.height - PAD.bottom + 18)} text-anchor="middle" class="fill-slate-400 text-[10px] tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(xl.label)}</text>`);
        });
        _push(`<!--]--></svg>`);
        if (vueExports.unref(hoverPoint)) {
          _push(`<div class="pointer-events-none absolute top-2 z-10 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg" style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(tooltipStyle))}"><p class="font-semibold mb-1">${serverRenderer_cjs_prodExports.ssrInterpolate(formatFullDate(vueExports.unref(hoverPoint).point.label))}</p><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(seriesList), (s) => {
            _push(`<p class="flex items-center gap-2 whitespace-nowrap"><span class="inline-block size-2 rounded-full" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundColor: s.color })}"></span><span class="text-slate-300">${serverRenderer_cjs_prodExports.ssrInterpolate(s.label)}:</span><span class="font-medium tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(formatFull(vueExports.unref(hoverPoint).point.values[s.key] ?? 0))}</span></p>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/report/LineChart.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main$1, { __name: "SharedReportLineChart" });
function useVendorOrderReportSummary(params) {
  return useApiFetch("/pmc/reports/vendor-order/summary", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useVendorOrderReportByVendor(params) {
  return useApiFetch("/pmc/reports/vendor-order/by-vendor", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useVendorOrderReportByProject(params) {
  return useApiFetch("/pmc/reports/vendor-order/by-project", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useVendorOrderReportTrend(params) {
  return useApiFetch("/pmc/reports/vendor-order/trend", {
    query: params,
    watch: params ? [params] : void 0
  });
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "vendor-order",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Báo cáo Đơn hàng vendor" });
    const {
      dateRange,
      dateFromRef,
      dateToRef,
      formatDateRange,
      syncRangeFromRefs,
      clearRange
    } = useReportDateRange();
    const selectedProjectId = vueExports.ref(void 0);
    useUrlFilters({
      date_from: { ref: dateFromRef, type: "string" },
      date_to: { ref: dateToRef, type: "string" },
      project_id: { ref: selectedProjectId, type: "number" }
    });
    syncRangeFromRefs();
    const hasFilters = vueExports.computed(
      () => selectedProjectId.value != null || !!dateFromRef.value || !!dateToRef.value
    );
    function clearFilters() {
      selectedProjectId.value = void 0;
      clearRange();
    }
    const filterParams = vueExports.computed(() => ({
      date_from: dateFromRef.value || void 0,
      date_to: dateToRef.value || void 0,
      project_id: selectedProjectId.value || void 0
    }));
    const {
      data: summaryData,
      status: summaryStatus,
      error: summaryError
    } = useVendorOrderReportSummary(filterParams);
    const summary = vueExports.computed(() => summaryData.value?.data ?? null);
    const { data: byVendorData, status: byVendorStatus } = useVendorOrderReportByVendor(filterParams);
    const byVendorRows = vueExports.computed(() => byVendorData.value?.data ?? []);
    const { data: byProjectData, status: byProjectStatus } = useVendorOrderReportByProject(filterParams);
    const byProjectRows = vueExports.computed(() => byProjectData.value?.data ?? []);
    const { data: trendData, status: trendStatus } = useVendorOrderReportTrend(filterParams);
    const trendRows = vueExports.computed(() => trendData.value?.data ?? []);
    const isLoading = (status) => status === "pending";
    function toNum(value) {
      if (value == null) return 0;
      return parseFloat(value) || 0;
    }
    const hasNonPerOrderContractOrders = vueExports.computed(
      () => !!summary.value && summary.value.warnings.non_per_order_orders_count > 0
    );
    const REVENUE_SERIES = [
      { key: "revenue", label: "Doanh thu", color: "#2563eb" },
      { key: "commission", label: "Hoa hồng", color: "#16a34a" }
    ];
    const chartByVendor = vueExports.computed(
      () => byVendorRows.value.map((r) => ({
        label: r.vendor_name,
        values: { revenue: toNum(r.revenue_total), commission: toNum(r.commission_total) }
      }))
    );
    const chartByProject = vueExports.computed(
      () => byProjectRows.value.map((r) => ({
        label: r.project_name,
        values: { revenue: toNum(r.revenue_total), commission: toNum(r.commission_total) }
      }))
    );
    const TREND_LINE_SERIES = [
      { key: "revenue", label: "Doanh thu", color: "#f97316", fill: true },
      { key: "commission", label: "Hoa hồng", color: "#10b981", fill: true }
    ];
    const trendPoints = vueExports.computed(
      () => trendRows.value.map((r) => ({
        label: r.date,
        values: { revenue: toNum(r.revenue_total), commission: toNum(r.commission_total) }
      }))
    );
    const vendorColumns = [
      { accessorKey: "vendor_name", header: "Vendor" },
      { accessorKey: "orders_count", header: "Số đơn" },
      { accessorKey: "revenue_total", header: "Doanh thu" },
      { accessorKey: "commission_total", header: "Hoa hồng" }
    ];
    const projectColumns = [
      { accessorKey: "project_name", header: "Dự án" },
      { accessorKey: "orders_count", header: "Số đơn" },
      { accessorKey: "revenue_total", header: "Doanh thu" },
      { accessorKey: "commission_total", header: "Hoa hồng" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedCrudPageHeader = __nuxt_component_0;
      const _component_SharedCrudPageError = __nuxt_component_2;
      const _component_SharedSectionCard = __nuxt_component_4;
      const _component_UFormField = _sfc_main$2;
      const _component_ClientOnly = __nuxt_component_5;
      const _component_SharedProjectSelect = __nuxt_component_3;
      const _component_UButton = _sfc_main$c;
      const _component_UIcon = _sfc_main$h;
      const _component_UAlert = _sfc_main$3;
      const _component_USkeleton = _sfc_main$4;
      const _component_SharedReportStackedColumnChart = __nuxt_component_10;
      const _component_SharedReportLineChart = __nuxt_component_11;
      const _component_UTable = _sfc_main$5;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageHeader, {
        title: "Báo cáo Đơn hàng vendor",
        description: "Tổng hợp đơn hàng hoàn thành từ các vendor Marketplace (đúng tenant & dự án) — doanh thu và hoa hồng theo vendor, dự án, thời gian"
      }, null, _parent));
      if (vueExports.unref(summaryError)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedCrudPageError, { error: vueExports.unref(summaryError) }, null, _parent));
      } else {
        _push(`<!--[-->`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Bộ lọc",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-4 items-end"${_scopeId}>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Khoảng thời gian" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, null, {}, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_ClientOnly, null, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(vueExports.unref(Zl), {
                            modelValue: vueExports.unref(dateRange),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(dateRange) ? dateRange.value = $event : null,
                            range: "",
                            "partial-range": false,
                            "time-config": { enableTimePicker: false },
                            "model-type": "yyyy-MM-dd",
                            format: vueExports.unref(formatDateRange),
                            "auto-apply": "",
                            "max-date": /* @__PURE__ */ new Date(),
                            "input-class-name": "dp-custom-input",
                            teleport: true,
                            class: "w-64"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "format", "max-date"])
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UFormField, { label: "Dự án" }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedProjectSelect, {
                      modelValue: vueExports.unref(selectedProjectId),
                      "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                      placeholder: "Tất cả dự án",
                      class: "w-48"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án",
                        class: "w-48"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (vueExports.unref(hasFilters)) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UButton, {
                  icon: "i-lucide-x",
                  label: "Xóa bộ lọc",
                  color: "neutral",
                  variant: "ghost",
                  size: "sm",
                  onClick: clearFilters
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (vueExports.unref(summary)) {
                _push2(`<p class="text-xs text-slate-500 mt-3"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-calendar",
                  class: "size-3.5 align-[-2px]"
                }, null, _parent2, _scopeId));
                _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).period_label)}</p>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                vueExports.createVNode("div", { class: "flex flex-wrap gap-4 items-end" }, [
                  vueExports.createVNode(_component_UFormField, { label: "Khoảng thời gian" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_ClientOnly, null, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(vueExports.unref(Zl), {
                            modelValue: vueExports.unref(dateRange),
                            "onUpdate:modelValue": ($event) => vueExports.isRef(dateRange) ? dateRange.value = $event : null,
                            range: "",
                            "partial-range": false,
                            "time-config": { enableTimePicker: false },
                            "model-type": "yyyy-MM-dd",
                            format: vueExports.unref(formatDateRange),
                            "auto-apply": "",
                            "max-date": /* @__PURE__ */ new Date(),
                            "input-class-name": "dp-custom-input",
                            teleport: true,
                            class: "w-64"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "format", "max-date"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_UFormField, { label: "Dự án" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_SharedProjectSelect, {
                        modelValue: vueExports.unref(selectedProjectId),
                        "onUpdate:modelValue": ($event) => vueExports.isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                        placeholder: "Tất cả dự án",
                        class: "w-48"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  vueExports.unref(hasFilters) ? (vueExports.openBlock(), vueExports.createBlock(_component_UButton, {
                    key: 0,
                    icon: "i-lucide-x",
                    label: "Xóa bộ lọc",
                    color: "neutral",
                    variant: "ghost",
                    size: "sm",
                    onClick: clearFilters
                  })) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "text-xs text-slate-500 mt-3"
                }, [
                  vueExports.createVNode(_component_UIcon, {
                    name: "i-lucide-calendar",
                    class: "size-3.5 align-[-2px]"
                  }),
                  vueExports.createTextVNode(" " + vueExports.toDisplayString(vueExports.unref(summary).period_label), 1)
                ])) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (vueExports.unref(hasNonPerOrderContractOrders)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UAlert, {
            color: "info",
            variant: "subtle",
            icon: "i-lucide-info",
            title: "Một số đơn dùng hợp đồng không tính theo đơn",
            description: `Có ${vueExports.unref(summary)?.warnings.non_per_order_orders_count} đơn thuộc hợp đồng chia doanh thu / thuê bao — hoa hồng = 0đ ở số liệu theo đơn bên dưới.`,
            class: "mb-6"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tổng đơn hoàn thành",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-24 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-40" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(summary).orders_count))}</p><p class="text-xs text-slate-500 mt-2"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).vendors_count)} vendor · ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary).projects_count)} dự án </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-24 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-40" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(vueExports.unref(summary).orders_count)), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, vueExports.toDisplayString(vueExports.unref(summary).vendors_count) + " vendor · " + vueExports.toDisplayString(vueExports.unref(summary).projects_count) + " dự án ", 1)
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tổng doanh thu",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-40" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums text-blue-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).revenue_total))}</p><p class="text-xs text-slate-500 mt-2"${_scopeId}> Đơn hoàn thành trong kỳ </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-40" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums text-blue-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).revenue_total)), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, " Đơn hoàn thành trong kỳ ")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Tổng hoa hồng",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-40" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums text-emerald-600"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission_total))}</p><p class="text-xs text-slate-500 mt-2"${_scopeId}> Theo hợp đồng hoa hồng vendor </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-40" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).commission_total)), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, " Theo hợp đồng hoa hồng vendor ")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Hoa hồng TB / đơn",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(summaryStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-32 mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-4 w-40" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else if (vueExports.unref(summary)) {
                _push2(`<!--[--><p class="text-2xl font-bold tabular-nums"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).average_commission_per_order))}</p><p class="text-xs text-slate-500 mt-2"${_scopeId}> Trung bình mỗi đơn hoàn thành </p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isLoading(vueExports.unref(summaryStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-32 mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-4 w-40" })
                ], 64)) : vueExports.unref(summary) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 1 }, [
                  vueExports.createVNode("p", { class: "text-2xl font-bold tabular-nums" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(vueExports.unref(summary).average_commission_per_order)), 1),
                  vueExports.createVNode("p", { class: "text-xs text-slate-500 mt-2" }, " Trung bình mỗi đơn hoàn thành ")
                ], 64)) : vueExports.createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Doanh thu & hoa hồng theo vendor",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byVendorStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[320px] w-full" }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportStackedColumnChart, {
                  categories: vueExports.unref(chartByVendor),
                  series: REVENUE_SERIES,
                  "max-bars": 12,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có đơn hoàn thành trong kỳ đã chọn"
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(byVendorStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[320px] w-full"
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportStackedColumnChart, {
                  key: 1,
                  categories: vueExports.unref(chartByVendor),
                  series: REVENUE_SERIES,
                  "max-bars": 12,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có đơn hoàn thành trong kỳ đã chọn"
                }, null, 8, ["categories"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Doanh thu & hoa hồng theo dự án",
          compact: ""
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byProjectStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[320px] w-full" }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportStackedColumnChart, {
                  categories: vueExports.unref(chartByProject),
                  series: REVENUE_SERIES,
                  "max-bars": 12,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có đơn hoàn thành trong kỳ đã chọn"
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(byProjectStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[320px] w-full"
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportStackedColumnChart, {
                  key: 1,
                  categories: vueExports.unref(chartByProject),
                  series: REVENUE_SERIES,
                  "max-bars": 12,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có đơn hoàn thành trong kỳ đã chọn"
                }, null, 8, ["categories"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Doanh thu & hoa hồng theo ngày",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(trendStatus))) {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-[320px] w-full" }, null, _parent2, _scopeId));
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedReportLineChart, {
                  points: vueExports.unref(trendPoints),
                  series: TREND_LINE_SERIES,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có đơn hoàn thành trong kỳ đã chọn"
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(trendStatus)) ? (vueExports.openBlock(), vueExports.createBlock(_component_USkeleton, {
                  key: 0,
                  class: "h-[320px] w-full"
                })) : (vueExports.openBlock(), vueExports.createBlock(_component_SharedReportLineChart, {
                  key: 1,
                  points: vueExports.unref(trendPoints),
                  series: TREND_LINE_SERIES,
                  "value-suffix": " đ",
                  "empty-text": "Chưa có đơn hoàn thành trong kỳ đã chọn"
                }, null, 8, ["points"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Chi tiết theo vendor",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byVendorStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-full mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-full mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-full" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                  data: vueExports.unref(byVendorRows),
                  columns: vendorColumns,
                  "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                }, {
                  "orders_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.orders_count))}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.orders_count)), 1)
                      ];
                    }
                  }),
                  "revenue_total-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="tabular-nums font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue_total))}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "tabular-nums font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue_total)), 1)
                      ];
                    }
                  }),
                  "commission_total-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="tabular-nums text-emerald-600"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission_total))}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission_total)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(byVendorStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-full mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-full mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-full" })
                ], 64)) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                  key: 1,
                  data: vueExports.unref(byVendorRows),
                  columns: vendorColumns,
                  "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                }, {
                  "orders_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.orders_count)), 1)
                  ]),
                  "revenue_total-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue_total)), 1)
                  ]),
                  "commission_total-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission_total)), 1)
                  ]),
                  _: 1
                }, 8, ["data"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SharedSectionCard, {
          title: "Chi tiết theo dự án",
          compact: "",
          class: "mb-6"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading(vueExports.unref(byProjectStatus))) {
                _push2(`<!--[-->`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-full mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-full mb-2" }, null, _parent2, _scopeId));
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_USkeleton, { class: "h-8 w-full" }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              } else {
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_UTable, {
                  data: vueExports.unref(byProjectRows),
                  columns: projectColumns,
                  "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                }, {
                  "orders_count-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="tabular-nums"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.orders_count))}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.orders_count)), 1)
                      ];
                    }
                  }),
                  "revenue_total-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="tabular-nums font-medium"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue_total))}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "tabular-nums font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue_total)), 1)
                      ];
                    }
                  }),
                  "commission_total-cell": vueExports.withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="tabular-nums text-emerald-600"${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission_total))}</span>`);
                    } else {
                      return [
                        vueExports.createVNode("span", { class: "tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission_total)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              }
            } else {
              return [
                isLoading(vueExports.unref(byProjectStatus)) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-full mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-full mb-2" }),
                  vueExports.createVNode(_component_USkeleton, { class: "h-8 w-full" })
                ], 64)) : (vueExports.openBlock(), vueExports.createBlock(_component_UTable, {
                  key: 1,
                  data: vueExports.unref(byProjectRows),
                  columns: projectColumns,
                  "empty-state": { icon: "i-lucide-inbox", label: "Không có dữ liệu" }
                }, {
                  "orders_count-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums" }, vueExports.toDisplayString(("formatNumber" in _ctx ? _ctx.formatNumber : vueExports.unref(formatNumber))(row.original.orders_count)), 1)
                  ]),
                  "revenue_total-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums font-medium" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.revenue_total)), 1)
                  ]),
                  "commission_total-cell": vueExports.withCtx(({ row }) => [
                    vueExports.createVNode("span", { class: "tabular-nums text-emerald-600" }, vueExports.toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : vueExports.unref(formatCurrency))(row.original.commission_total)), 1)
                  ]),
                  _: 1
                }, 8, ["data"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/vendor-order.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=vendor-order-QwGvqsrU.mjs.map
