import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DonutChart",
  __ssrInlineRender: true,
  props: {
    title: {},
    slices: {},
    centerLabel: { default: "Tổng" },
    valueSuffix: { default: "" },
    size: { default: 220 },
    rOuter: { default: 88 },
    rInner: { default: 52 }
  },
  setup(__props) {
    const props = __props;
    const DEFAULT_COLORS = [
      "#16a34a",
      "#2563eb",
      "#d97706",
      "#7c3aed",
      "#0d9488",
      "#dc2626",
      "#64748b"
    ];
    const total = vueExports.computed(() => {
      let sum = 0;
      for (const s of props.slices) {
        sum += s.value;
      }
      return sum;
    });
    const centerValue = vueExports.computed(() => {
      const formatted = new Intl.NumberFormat("vi-VN").format(total.value);
      return `${formatted}${props.valueSuffix}`;
    });
    function donutPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
      const x1 = cx + rOuter * Math.cos(startAngle);
      const y1 = cy + rOuter * Math.sin(startAngle);
      const x2 = cx + rOuter * Math.cos(endAngle);
      const y2 = cy + rOuter * Math.sin(endAngle);
      const x3 = cx + rInner * Math.cos(endAngle);
      const y3 = cy + rInner * Math.sin(endAngle);
      const x4 = cx + rInner * Math.cos(startAngle);
      const y4 = cy + rInner * Math.sin(startAngle);
      const sweep = endAngle - startAngle;
      const large = Math.abs(sweep) > Math.PI ? 1 : 0;
      return [
        `M ${x1} ${y1}`,
        `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4}`,
        "Z"
      ].join(" ");
    }
    function fullDonutPath(rOuter, rInner) {
      return [
        `M ${rOuter} 0`,
        `A ${rOuter} ${rOuter} 0 1 1 ${-rOuter} 0`,
        `A ${rOuter} ${rOuter} 0 1 1 ${rOuter} 0`,
        `Z`,
        `M ${rInner} 0`,
        `A ${rInner} ${rInner} 0 1 0 ${-rInner} 0`,
        `A ${rInner} ${rInner} 0 1 0 ${rInner} 0`,
        `Z`
      ].join(" ");
    }
    const segments = vueExports.computed(() => {
      const t = total.value;
      if (t <= 0) return [];
      const cx = 0;
      const cy = 0;
      const list = props.slices;
      const nonZero = list.filter((s) => s.value > 0);
      if (nonZero.length === 1) {
        const only = nonZero[0];
        const idx = list.indexOf(only);
        return [{
          label: only.label,
          value: only.value,
          color: only.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
          pct: 100,
          path: fullDonutPath(props.rOuter, props.rInner)
        }];
      }
      let angle = -Math.PI / 2;
      return list.map((s, i) => {
        const sweep = s.value / t * Math.PI * 2;
        const start = angle;
        const end = angle + sweep;
        angle = end;
        const pct = Math.round(s.value / t * 1e3) / 10;
        return {
          label: s.label,
          value: s.value,
          color: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
          pct,
          path: s.value > 0 ? donutPath(cx, cy, props.rOuter, props.rInner, start, end) : ""
        };
      });
    });
    function formatNum(n) {
      return new Intl.NumberFormat("vi-VN").format(n);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col sm:flex-row items-center gap-6" }, _attrs))}><div class="relative shrink-0"><svg${serverRenderer_cjs_prodExports.ssrRenderAttr("viewBox", `0 0 ${props.size} ${props.size}`)} class="size-[200px] sm:size-[220px] text-slate-500" role="img"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-label", props.title)}><g${serverRenderer_cjs_prodExports.ssrRenderAttr("transform", `translate(${props.size / 2} ${props.size / 2})`)}><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(segments), (seg, i) => {
        _push(`<path${serverRenderer_cjs_prodExports.ssrRenderAttr("d", seg.path)}${serverRenderer_cjs_prodExports.ssrRenderAttr("fill", seg.color)} fill-rule="evenodd" stroke="white" stroke-width="1" class="transition-opacity hover:opacity-90"></path>`);
      });
      _push(`<!--]--></g><text x="50%" y="48%" text-anchor="middle" class="fill-current text-[11px]">${serverRenderer_cjs_prodExports.ssrInterpolate(props.centerLabel)}</text><text x="50%" y="56%" text-anchor="middle" class="fill-slate-900 text-sm font-bold tabular-nums">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(centerValue))}</text></svg></div><ul class="flex-1 space-y-2 min-w-0 w-full text-sm"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(segments), (seg, i) => {
        _push(`<li class="flex items-start gap-2"><span class="mt-1.5 size-2.5 shrink-0 rounded-sm" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundColor: seg.color })}"></span><div class="min-w-0 flex-1"><span class="text-slate-900">${serverRenderer_cjs_prodExports.ssrInterpolate(seg.label)}</span><span class="text-slate-500"> — ${serverRenderer_cjs_prodExports.ssrInterpolate(formatNum(seg.value))}${serverRenderer_cjs_prodExports.ssrInterpolate(props.valueSuffix)} (${serverRenderer_cjs_prodExports.ssrInterpolate(seg.pct)}%)</span></div></li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/report/DonutChart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_13 = Object.assign(_sfc_main, { __name: "SharedReportDonutChart" });

export { __nuxt_component_13 as _ };
//# sourceMappingURL=DonutChart-DD8U5f6E.mjs.map
