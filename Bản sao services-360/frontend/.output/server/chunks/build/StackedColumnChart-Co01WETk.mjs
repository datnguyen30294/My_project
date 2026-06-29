import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "StackedColumnChart",
  __ssrInlineRender: true,
  props: {
    categories: {},
    series: {},
    emptyText: { default: "Chưa có dữ liệu" },
    maxBars: { default: 20 },
    barWidth: { default: 48 },
    barGap: { default: 24 },
    height: { default: 320 },
    valueSuffix: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const PAD = { top: 24, right: 16, bottom: 96, left: 72 };
    const seriesList = vueExports.computed(() => [...props.series]);
    const sortedCategories = vueExports.computed(() => {
      const list = [...props.categories];
      const withTotals = list.map((c) => {
        let total = 0;
        for (const s of seriesList.value) {
          total += c.values[s.key] ?? 0;
        }
        return { category: c, total };
      });
      withTotals.sort((a, b) => b.total - a.total);
      return withTotals.slice(0, props.maxBars).filter((x) => x.total > 0);
    });
    const maxValue = vueExports.computed(() => {
      let max = 0;
      for (const { total } of sortedCategories.value) {
        if (total > max) max = total;
      }
      return max > 0 ? max : 1;
    });
    const chartWidth = vueExports.computed(() => {
      const n = sortedCategories.value.length;
      const inner = n * props.barWidth + Math.max(0, n - 1) * props.barGap;
      return PAD.left + inner + PAD.right;
    });
    const plotHeight = vueExports.computed(() => props.height - PAD.top - PAD.bottom);
    const bars = vueExports.computed(() => {
      const scale = plotHeight.value / maxValue.value;
      const zeroY = props.height - PAD.bottom;
      return sortedCategories.value.map(({ category, total }, i) => {
        const x = PAD.left + i * (props.barWidth + props.barGap);
        const cx = x + props.barWidth / 2;
        let cursorY = zeroY;
        const segments = [];
        for (const s of seriesList.value) {
          const v = category.values[s.key] ?? 0;
          if (v <= 0) continue;
          const h = v * scale;
          cursorY -= h;
          segments.push({
            key: s.key,
            label: s.label,
            color: s.color,
            y: cursorY,
            h,
            value: v
          });
        }
        return {
          x,
          cx,
          w: props.barWidth,
          label: category.label,
          total,
          totalY: cursorY - 6,
          segments
        };
      });
    });
    const yTicks = vueExports.computed(() => {
      const max = maxValue.value;
      const steps = 4;
      return Array.from({ length: steps + 1 }, (_, i) => {
        const v = max / steps * i;
        return {
          value: v,
          y: props.height - PAD.bottom - v / max * plotHeight.value
        };
      });
    });
    function formatShort(n) {
      const abs = Math.abs(n);
      if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
      if (abs >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
      if (abs >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
      return new Intl.NumberFormat("vi-VN").format(Math.round(n));
    }
    function formatTooltip(n) {
      return `${new Intl.NumberFormat("vi-VN").format(Math.round(n))}${props.valueSuffix}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}><div class="flex flex-wrap gap-4 text-xs mb-3"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(seriesList), (s) => {
        _push(`<span class="flex items-center gap-1.5"><span class="inline-block size-2.5 rounded-sm" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundColor: s.color })}"></span><span class="text-slate-600">${serverRenderer_cjs_prodExports.ssrInterpolate(s.label)}</span></span>`);
      });
      _push(`<!--]--></div>`);
      if (vueExports.unref(sortedCategories).length === 0) {
        _push(`<p class="py-12 text-center text-sm text-slate-500">${serverRenderer_cjs_prodExports.ssrInterpolate(props.emptyText)}</p>`);
      } else {
        _push(`<div class="w-full overflow-x-auto"><svg${serverRenderer_cjs_prodExports.ssrRenderAttr("viewBox", `0 0 ${vueExports.unref(chartWidth)} ${props.height}`)}${serverRenderer_cjs_prodExports.ssrRenderAttr("width", vueExports.unref(chartWidth))}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", props.height)} class="text-slate-500" role="img" aria-label="Biểu đồ cột"><g><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(yTicks), (t, i) => {
          _push(`<line${serverRenderer_cjs_prodExports.ssrRenderAttr("x1", PAD.left)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y1", t.y)}${serverRenderer_cjs_prodExports.ssrRenderAttr("x2", vueExports.unref(chartWidth) - PAD.right)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y2", t.y)} stroke="currentColor"${serverRenderer_cjs_prodExports.ssrRenderAttr("stroke-opacity", i === 0 ? 0.3 : 0.08)} stroke-dasharray="3,3"></line>`);
        });
        _push(`<!--]--><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(yTicks), (t, i) => {
          _push(`<text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", PAD.left - 8)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", t.y + 3)} text-anchor="end" class="fill-current text-[10px] tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(formatShort(t.value))}</text>`);
        });
        _push(`<!--]--></g><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(bars), (b, i) => {
          _push(`<g><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(b.segments, (seg) => {
            _push(`<rect${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.x)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", seg.y)}${serverRenderer_cjs_prodExports.ssrRenderAttr("width", b.w)}${serverRenderer_cjs_prodExports.ssrRenderAttr("height", seg.h)}${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", seg.color)} rx="2"><title>${serverRenderer_cjs_prodExports.ssrInterpolate(seg.label)}: ${serverRenderer_cjs_prodExports.ssrInterpolate(formatTooltip(seg.value))}</title></rect>`);
          });
          _push(`<!--]-->`);
          if (b.total > 0) {
            _push(`<text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.cx)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", b.totalY)} text-anchor="middle" class="fill-slate-800 text-[10px] font-semibold tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(formatShort(b.total))}</text>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<text${serverRenderer_cjs_prodExports.ssrRenderAttr("x", b.cx)}${serverRenderer_cjs_prodExports.ssrRenderAttr("y", props.height - PAD.bottom + 16)}${serverRenderer_cjs_prodExports.ssrRenderAttr("transform", `rotate(-35 ${b.cx} ${props.height - PAD.bottom + 16})`)} text-anchor="end" class="fill-current text-[10px]"><title>${serverRenderer_cjs_prodExports.ssrInterpolate(b.label)}</title> ${serverRenderer_cjs_prodExports.ssrInterpolate(b.label.length > 20 ? b.label.slice(0, 19) + "…" : b.label)}</text></g>`);
        });
        _push(`<!--]--></svg></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/report/StackedColumnChart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main, { __name: "SharedReportStackedColumnChart" });

export { __nuxt_component_10 as _ };
//# sourceMappingURL=StackedColumnChart-Co01WETk.mjs.map
