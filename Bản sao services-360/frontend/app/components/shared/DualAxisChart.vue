<script setup lang="ts">
/**
 * Generic dual-axis monthly chart: revenue-style bars + a dashed money line
 * (left/money axis) + a solid count line (right/count axis). Hand-drawn SVG,
 * no charting dependency. Used by tenant business summary and vendor revenue.
 */
interface DualAxisPoint {
  label: string
  /** Bar value (money, left axis). */
  bar: number
  /** Solid line value (count, right axis). */
  line: number
  /** Dashed line value (money, left axis). */
  dash: number
}

interface Props {
  points: DualAxisPoint[]
  barLabel?: string
  lineLabel?: string
  dashLabel?: string
  /** Suffix on the right (count) axis labels, e.g. " đơn". */
  lineUnit?: string
}

const props = withDefaults(defineProps<Props>(), {
  barLabel: 'Doanh thu',
  lineLabel: 'Số đơn',
  dashLabel: 'Phí',
  lineUnit: ' đơn'
})

const REVENUE_COLOR = '#34d399'
const ORDER_COLOR = '#f59e0b'
const FEE_COLOR = '#059669'

const VIEW = { w: 640, h: 280 }
const INNER = { left: 56, right: 600, top: 32, bottom: 220 }

interface Bar {
  x: number
  y: number
  w: number
  h: number
}

interface Point {
  x: number
  y: number
}

interface ColumnHit {
  x: number
  w: number
  title: string
}

const chart = computed(() => {
  const points = props.points
  const n = points.length
  const plotW = INNER.right - INNER.left
  const plotH = INNER.bottom - INNER.top

  const maxRevenue = Math.max(...points.map(p => p.bar), 1)
  const maxOrders = Math.max(...points.map(p => p.line), 1)
  const barW = Math.min(36, (plotW / Math.max(n, 1)) * 0.45)
  const stepW = n > 1 ? plotW / (n - 1) : plotW

  const revenueY = (v: number): number => INNER.bottom - (v / maxRevenue) * plotH * 0.9
  const orderY = (v: number): number => INNER.bottom - (v / maxOrders) * plotH * 0.9
  const cxAt = (i: number): number => INNER.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW)

  const bars: Bar[] = []
  const labels: Array<{ x: number, text: string }> = []
  const orderPoints: Point[] = []
  const feePoints: Point[] = []
  const columns: ColumnHit[] = []

  points.forEach((p, i) => {
    const cx = cxAt(i)
    bars.push({
      x: cx - barW / 2,
      y: revenueY(p.bar),
      w: barW,
      h: INNER.bottom - revenueY(p.bar)
    })
    labels.push({ x: cx, text: p.label })
    orderPoints.push({ x: cx, y: orderY(p.line) })
    feePoints.push({ x: cx, y: revenueY(p.dash) })
    columns.push({
      x: Math.max(INNER.left, cx - stepW / 2),
      w: stepW,
      title: `${p.label}\n${props.barLabel}: ${formatCurrency(p.bar)}\n${props.lineLabel}: ${formatNumber(p.line)}\n${props.dashLabel}: ${formatCurrency(p.dash)}`
    })
  })

  const toLine = (pts: Point[]): string => pts.map(p => `${p.x},${p.y}`).join(' ')
  const gridLines = [0.25, 0.5, 0.75].map(r => INNER.bottom - plotH * 0.9 * r)

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
  }
})
</script>

<template>
  <div class="w-full overflow-x-auto">
    <svg
      class="h-[280px] w-full min-w-[520px] text-slate-400"
      :viewBox="`0 0 ${VIEW.w} ${VIEW.h}`"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="`Biểu đồ ${barLabel} theo tháng`"
    >
      <!-- baseline + grid -->
      <line
        :x1="INNER.left"
        :y1="INNER.bottom"
        :x2="INNER.right"
        :y2="INNER.bottom"
        stroke="currentColor"
        stroke-opacity="0.25"
      />
      <line
        v-for="(gy, i) in chart.gridLines"
        :key="'grid-' + i"
        :x1="INNER.left"
        :y1="gy"
        :x2="INNER.right"
        :y2="gy"
        stroke="currentColor"
        stroke-opacity="0.08"
      />

      <!-- revenue bars -->
      <rect
        v-for="(b, i) in chart.bars"
        :key="'bar-' + i"
        :x="b.x"
        :y="b.y"
        :width="b.w"
        :height="b.h"
        :fill="REVENUE_COLOR"
        fill-opacity="0.85"
        rx="3"
      />

      <!-- dashed money line (left/money axis) -->
      <polyline
        :points="chart.feeLine"
        fill="none"
        :stroke="FEE_COLOR"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="6 4"
      />
      <circle
        v-for="(p, i) in chart.feePoints"
        :key="'fee-' + i"
        :cx="p.x"
        :cy="p.y"
        r="3.5"
        :fill="FEE_COLOR"
      />

      <!-- count line (right/count axis) -->
      <polyline
        :points="chart.orderLine"
        fill="none"
        :stroke="ORDER_COLOR"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        v-for="(p, i) in chart.orderPoints"
        :key="'order-' + i"
        :cx="p.x"
        :cy="p.y"
        r="3.5"
        :fill="ORDER_COLOR"
      />

      <!-- x labels -->
      <text
        v-for="(l, i) in chart.labels"
        :key="'lbl-' + i"
        :x="l.x"
        y="238"
        text-anchor="middle"
        class="fill-current text-[11px]"
      >
        {{ l.text }}
      </text>

      <!-- left axis (money) -->
      <text
        x="8"
        :y="INNER.bottom - (INNER.bottom - INNER.top) * 0.9 + 4"
        class="fill-current text-[10px] tabular-nums"
      >
        {{ chart.revenueMaxLabel }}
      </text>
      <text
        x="8"
        :y="INNER.bottom - 2"
        class="fill-current text-[10px]"
      >
        0
      </text>

      <!-- right axis (count) -->
      <text
        :x="VIEW.w - 4"
        :y="INNER.bottom - (INNER.bottom - INNER.top) * 0.9 + 4"
        text-anchor="end"
        class="fill-current text-[10px] tabular-nums"
      >
        {{ chart.orderMaxLabel }}{{ lineUnit }}
      </text>
      <text
        :x="VIEW.w - 4"
        :y="INNER.bottom - 2"
        text-anchor="end"
        class="fill-current text-[10px]"
      >
        0{{ lineUnit }}
      </text>

      <!-- per-month hover hit areas (native tooltip with all 3 values) -->
      <rect
        v-for="(c, i) in chart.columns"
        :key="'hit-' + i"
        :x="c.x"
        :y="INNER.top"
        :width="c.w"
        :height="INNER.bottom - INNER.top"
        fill="transparent"
      >
        <title>{{ c.title }}</title>
      </rect>
    </svg>
  </div>
</template>
