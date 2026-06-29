import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { f as formatCurrency, a as formatNumber, c as formatCurrencyShort } from './currency-DEb2TrW3.mjs';

const REVENUE_COLOR = "#34d399";
const ORDER_COLOR = "#f59e0b";
const FEE_COLOR = "#059669";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DualAxisChart",
  __ssrInlineRender: true,
  props: {
    points: {},
    barLabel: { default: "Doanh thu" },
    lineLabel: { default: "Số đơn" },
    dashLabel: { default: "Phí" },
    lineUnit: { default: " đơn" }
  },
  setup(__props) {
    const props = __props;
    const VIEW = { w: 640, h: 280 };
    const INNER = { left: 56, right: 600, top: 32, bottom: 220 };
    const chart = vueExports.computed(() => {
      const points = props.points;
      const n = points.length;
      const plotW = INNER.right - INNER.left;
      const plotH = INNER.bottom - INNER.top;
      const maxRevenue = Math.max(...points.map((p) => p.bar), 1);
      const maxOrders = Math.max(...points.map((p) => p.line), 1);
      const barW = Math.min(36, plotW / Math.max(n, 1) * 0.45);
      const stepW = n > 1 ? plotW / (n - 1) : plotW;
      const revenueY = (v) => INNER.bottom - v / maxRevenue * plotH * 0.9;
      const orderY = (v) => INNER.bottom - v / maxOrders * plotH * 0.9;
      const cxAt = (i) => INNER.left + (n <= 1 ? plotW / 2 : i / (n - 1) * plotW);
      const bars = [];
      const labels = [];
      const orderPoints = [];
      const feePoints = [];
      const columns = [];
      points.forEach((p, i) => {
        const cx = cxAt(i);
        bars.push({
          x: cx - barW / 2,
          y: revenueY(p.bar),
          w: barW,
          h: INNER.bottom - revenueY(p.bar)
        });
        labels.push({ x: cx, text: p.label });
        orderPoints.push({ x: cx, y: orderY(p.line) });
        feePoints.push({ x: cx, y: revenueY(p.dash) });
        columns.push({
          x: Math.max(INNER.left, cx - stepW / 2),
          w: stepW,
          title: `${p.label}
${props.barLabel}: ${formatCurrency(p.bar)}
${props.lineLabel}: ${formatNumber(p.line)}
${props.dashLabel}: ${formatCurrency(p.dash)}`
        });
      });
      const toLine = (pts) => pts.map((p) => `${p.x},${p.y}`).join(" ");
      const gridLines = [0.25, 0.5, 0.75].map((r) => INNER.bottom - plotH * 0.9 * r);
      return {
        bars,
        labels,
        orderPoints,
        feePoints,
        columns,
        orderLine: toLine(orderPoints),
        feeLine: toLine(feePoints),
        gridLines,
        revenueMaxLabel: formatCurrencyShort(maxRevenue),
        orderMaxLabel: maxOrders
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "w-full overflow-x-auto" }, _attrs))}><svg class="h-[280px] w-full min-w-[520px] text-slate-400"${serverRenderer_cjs_prodExports.ssrRenderAttr("viewBox", `0 0 ${VIEW.w} ${VIEW.h}`)} preserveAspectRatio="xMidYMid meet" role="img"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-label", `Biểu đồ ${__props.barLabel} theo tháng`)}><line${serverRenderer_cjs_prodExports.ssrRenderAttr("x1", INNER.left)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y1", INNER.bottom)}${serverRenderer_cjs_prodExports.ssrRenderAttr("x2", INNER.right)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y2", INNER.bottom)} stroke="currentColor" stroke-opacity="0.25"></line><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(chart).gridLines, (gy, i) => {
        _push(`<line${serverRenderer_cjs_prodExports.ssrRenderAttr("x1", INNER.left)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y1", gy)}${serverRenderer_cjs_prodExports.ssrRenderAttr("x2", INNER.right)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y2", gy)} stroke="currentColor" stroke-opacity="0.08"></line>`);
      });
      _push(`<!--]--><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(chart).bars, (b, i) => {
        _push(`<rect${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", b.y)}${serverRenderer_cjs_prodExports.ssrRenderAttr("width", b.w)}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", b.h)}${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", REVENUE_COLOR)} fill-opacity="0.85" rx="3"></rect>`);
      });
      _push(`<!--]--><polyline${serverRenderer_cjs_prodExports.ssrRenderAttr("points", vueExports.unref(chart).feeLine)} fill="none"${serverRenderer_cjs_prodExports.ssrRenderAttr("stroke", FEE_COLOR)} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 4"></polyline><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(chart).feePoints, (p, i) => {
        _push(`<circle${serverRenderer_cjs_prodExports.ssrRenderAttr("cx", p.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("cy", p.y)} r="3.5"${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", FEE_COLOR)}></circle>`);
      });
      _push(`<!--]--><polyline${serverRenderer_cjs_prodExports.ssrRenderAttr("points", vueExports.unref(chart).orderLine)} fill="none"${serverRenderer_cjs_prodExports.ssrRenderAttr("stroke", ORDER_COLOR)} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(chart).orderPoints, (p, i) => {
        _push(`<circle${serverRenderer_cjs_prodExports.ssrRenderAttr("cx", p.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("cy", p.y)} r="3.5"${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", ORDER_COLOR)}></circle>`);
      });
      _push(`<!--]--><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(chart).labels, (l, i) => {
        _push(`<text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", l.x)} y="238" text-anchor="middle" class="fill-current text-[11px]">${serverRenderer_cjs_prodExports.ssrInterpolate(l.text)}</text>`);
      });
      _push(`<!--]--><text x="8"${serverRenderer_cjs_prodExports.ssrRenderAttr("y", INNER.bottom - (INNER.bottom - INNER.top) * 0.9 + 4)} class="fill-current text-[10px] tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(chart).revenueMaxLabel)}</text><text x="8"${serverRenderer_cjs_prodExports.ssrRenderAttr("y", INNER.bottom - 2)} class="fill-current text-[10px]"> 0 </text><text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", VIEW.w - 4)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", INNER.bottom - (INNER.bottom - INNER.top) * 0.9 + 4)} text-anchor="end" class="fill-current text-[10px] tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(chart).orderMaxLabel)}${serverRenderer_cjs_prodExports.ssrInterpolate(__props.lineUnit)}</text><text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", VIEW.w - 4)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", INNER.bottom - 2)} text-anchor="end" class="fill-current text-[10px]"> 0${serverRenderer_cjs_prodExports.ssrInterpolate(__props.lineUnit)}</text><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(chart).columns, (c, i) => {
        _push(`<rect${serverRenderer_cjs_prodExports.ssrRenderAttr("x", c.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", INNER.top)}${serverRenderer_cjs_prodExports.ssrRenderAttr("width", c.w)}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", INNER.bottom - INNER.top)} fill="transparent"><title>${serverRenderer_cjs_prodExports.ssrInterpolate(c.title)}</title></rect>`);
      });
      _push(`<!--]--></svg></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/DualAxisChart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main, { __name: "SharedDualAxisChart" });

export { __nuxt_component_6 as _ };
//# sourceMappingURL=DualAxisChart-BTWuRjT1.mjs.map
