<script setup lang="ts">
export interface LineChartSeries {
  key: string
  label: string
  color: string
  fill?: boolean
}

export interface LineChartPoint {
  label: string
  values: Record<string, number>
}

const props = withDefaults(
  defineProps<{
    points: readonly LineChartPoint[] | LineChartPoint[]
    series: readonly LineChartSeries[] | LineChartSeries[]
    emptyText?: string
    height?: number
    valueSuffix?: string
  }>(),
  {
    emptyText: 'Chưa có dữ liệu',
    height: 320,
    valueSuffix: ''
  }
)

const PAD = { top: 20, right: 20, bottom: 36, left: 60 }

const wrapper = ref<HTMLElement | null>(null)
const width = ref(720)
let observer: ResizeObserver | null = null

onMounted(() => {
  if (!wrapper.value) return
  observer = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect.width
    if (w && w > 0) width.value = w
  })
  observer.observe(wrapper.value)
  width.value = wrapper.value.clientWidth || width.value
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

const seriesList = computed(() => [...props.series] as LineChartSeries[])
const pointList = computed(() => [...props.points] as LineChartPoint[])
const hasData = computed(() => pointList.value.length > 0)

const plotW = computed(() => Math.max(0, width.value - PAD.left - PAD.right))
const plotH = computed(() => props.height - PAD.top - PAD.bottom)

const maxValue = computed(() => {
  let max = 0
  for (const p of pointList.value) {
    for (const s of seriesList.value) {
      const v = p.values[s.key] ?? 0
      if (v > max) max = v
    }
  }
  return max > 0 ? max : 1
})

function xAt(i: number): number {
  const n = pointList.value.length
  if (n <= 1) return PAD.left + plotW.value / 2
  return PAD.left + (i / (n - 1)) * plotW.value
}

function yAt(v: number): number {
  return PAD.top + plotH.value - (v / maxValue.value) * plotH.value
}

/** Catmull-Rom → cubic bezier smoothing for a list of [x,y] points. */
function smoothPath(coords: Array<[number, number]>): string {
  const n = coords.length
  if (n === 0) return ''
  if (n === 1) return `M ${coords[0]![0]} ${coords[0]![1]}`

  let d = `M ${coords[0]![0]} ${coords[0]![1]}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = coords[i - 1] ?? coords[i]!
    const p1 = coords[i]!
    const p2 = coords[i + 1]!
    const p3 = coords[i + 2] ?? p2
    const t = 0.18
    const c1x = p1[0] + (p2[0] - p0[0]) * t
    const c1y = p1[1] + (p2[1] - p0[1]) * t
    const c2x = p2[0] - (p3[0] - p1[0]) * t
    const c2y = p2[1] - (p3[1] - p1[1]) * t
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`
  }
  return d
}

interface RenderedSeries {
  key: string
  label: string
  color: string
  fill: boolean
  line: string
  area: string
}

const renderedSeries = computed<RenderedSeries[]>(() =>
  seriesList.value.map((s) => {
    const coords = pointList.value.map(
      (p, i) => [xAt(i), yAt(p.values[s.key] ?? 0)] as [number, number]
    )
    const line = smoothPath(coords)
    const baseY = PAD.top + plotH.value
    const first = coords[0]
    const last = coords[coords.length - 1]
    const area = line && first && last
      ? `${line} L ${last[0]} ${baseY} L ${first[0]} ${baseY} Z`
      : ''
    return {
      key: s.key,
      label: s.label,
      color: s.color,
      fill: s.fill ?? false,
      line,
      area
    }
  })
)

const yTicks = computed(() => {
  const steps = 4
  return Array.from({ length: steps + 1 }, (_, i) => {
    const v = (maxValue.value / steps) * i
    return { value: v, y: yAt(v) }
  })
})

const xLabels = computed(() => {
  const n = pointList.value.length
  if (n === 0) return []
  const maxLabels = Math.max(2, Math.floor(plotW.value / 56))
  const step = Math.max(1, Math.ceil(n / maxLabels))
  return pointList.value
    .map((p, i) => ({ i, x: xAt(i), label: formatDayLabel(p.label) }))
    .filter(item => item.i % step === 0 || item.i === n - 1)
})

function formatDayLabel(raw: string): string {
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatFullDate(raw: string): string {
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

function formatShort(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return new Intl.NumberFormat('vi-VN').format(Math.round(n))
}

function formatFull(n: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(Math.round(n))}${props.valueSuffix}`
}

// ─── Hover interaction ───

const hoverIndex = ref<number | null>(null)

function onMove(event: MouseEvent) {
  const n = pointList.value.length
  if (n === 0 || !wrapper.value) return
  const rect = wrapper.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const rel = (x - PAD.left) / (plotW.value || 1)
  const idx = Math.round(rel * (n - 1))
  hoverIndex.value = Math.min(n - 1, Math.max(0, idx))
}

function onLeave() {
  hoverIndex.value = null
}

const hoverPoint = computed(() => {
  if (hoverIndex.value == null) return null
  const p = pointList.value[hoverIndex.value]
  if (!p) return null
  return { index: hoverIndex.value, x: xAt(hoverIndex.value), point: p }
})

const tooltipStyle = computed(() => {
  if (!hoverPoint.value) return {}
  const half = width.value / 2
  const onLeftHalf = hoverPoint.value.x <= half
  return onLeftHalf
    ? { left: `${hoverPoint.value.x + 12}px` }
    : { right: `${width.value - hoverPoint.value.x + 12}px` }
})
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-4 text-xs mb-3">
      <span
        v-for="s in seriesList"
        :key="s.key"
        class="flex items-center gap-1.5"
      >
        <span
          class="inline-block w-3 h-[3px] rounded-full"
          :style="{ backgroundColor: s.color }"
        />
        <span class="text-slate-600">{{ s.label }}</span>
      </span>
    </div>

    <p
      v-if="!hasData"
      class="py-12 text-center text-sm text-slate-500"
    >
      {{ props.emptyText }}
    </p>

    <div
      v-else
      ref="wrapper"
      class="relative w-full select-none"
      :style="{ height: `${props.height}px` }"
      @mousemove="onMove"
      @mouseleave="onLeave"
    >
      <svg
        :width="width"
        :height="props.height"
        :viewBox="`0 0 ${width} ${props.height}`"
        class="text-slate-400"
        role="img"
        aria-label="Biểu đồ doanh thu theo ngày"
      >
        <defs>
          <linearGradient
            v-for="s in renderedSeries"
            :id="`grad-${s.key}`"
            :key="`grad-${s.key}`"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              :stop-color="s.color"
              stop-opacity="0.22"
            />
            <stop
              offset="100%"
              :stop-color="s.color"
              stop-opacity="0"
            />
          </linearGradient>
        </defs>

        <!-- grid + y labels -->
        <g>
          <line
            v-for="(t, i) in yTicks"
            :key="'grid-' + i"
            :x1="PAD.left"
            :y1="t.y"
            :x2="width - PAD.right"
            :y2="t.y"
            stroke="currentColor"
            :stroke-opacity="i === 0 ? 0.35 : 0.12"
          />
          <text
            v-for="(t, i) in yTicks"
            :key="'yl-' + i"
            :x="PAD.left - 10"
            :y="t.y + 3"
            text-anchor="end"
            class="fill-slate-400 text-[10px] tabular-nums"
          >
            {{ formatShort(t.value) }}
          </text>
        </g>

        <!-- area fills -->
        <path
          v-for="s in renderedSeries"
          v-show="s.fill"
          :key="'area-' + s.key"
          :d="s.area"
          :fill="`url(#grad-${s.key})`"
          stroke="none"
        />

        <!-- lines -->
        <path
          v-for="s in renderedSeries"
          :key="'line-' + s.key"
          :d="s.line"
          fill="none"
          :stroke="s.color"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- hover guide + markers -->
        <template v-if="hoverPoint">
          <line
            :x1="hoverPoint.x"
            :y1="PAD.top"
            :x2="hoverPoint.x"
            :y2="props.height - PAD.bottom"
            stroke="currentColor"
            stroke-opacity="0.35"
            stroke-dasharray="3,3"
          />
          <circle
            v-for="s in renderedSeries"
            :key="'dot-' + s.key"
            :cx="hoverPoint.x"
            :cy="yAt(hoverPoint.point.values[s.key] ?? 0)"
            r="4"
            :fill="s.color"
            stroke="#fff"
            stroke-width="2"
          />
        </template>

        <!-- x labels -->
        <text
          v-for="xl in xLabels"
          :key="'xl-' + xl.i"
          :x="xl.x"
          :y="props.height - PAD.bottom + 18"
          text-anchor="middle"
          class="fill-slate-400 text-[10px] tabular-nums"
        >
          {{ xl.label }}
        </text>
      </svg>

      <!-- tooltip -->
      <div
        v-if="hoverPoint"
        class="pointer-events-none absolute top-2 z-10 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
        :style="tooltipStyle"
      >
        <p class="font-semibold mb-1">
          {{ formatFullDate(hoverPoint.point.label) }}
        </p>
        <p
          v-for="s in seriesList"
          :key="'tt-' + s.key"
          class="flex items-center gap-2 whitespace-nowrap"
        >
          <span
            class="inline-block size-2 rounded-full"
            :style="{ backgroundColor: s.color }"
          />
          <span class="text-slate-300">{{ s.label }}:</span>
          <span class="font-medium tabular-nums">{{ formatFull(hoverPoint.point.values[s.key] ?? 0) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
