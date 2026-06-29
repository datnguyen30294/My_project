<script setup lang="ts">
export interface DonutSlice {
  label: string
  value: number
  color?: string
}

const props = withDefaults(
  defineProps<{
    title: string
    slices: readonly DonutSlice[] | DonutSlice[]
    centerLabel?: string
    valueSuffix?: string
    size?: number
    rOuter?: number
    rInner?: number
  }>(),
  {
    centerLabel: 'Tổng',
    valueSuffix: '',
    size: 220,
    rOuter: 88,
    rInner: 52
  }
)

const DEFAULT_COLORS = [
  '#16a34a',
  '#2563eb',
  '#d97706',
  '#7c3aed',
  '#0d9488',
  '#dc2626',
  '#64748b'
] as const

const total = computed((): number => {
  let sum = 0
  for (const s of props.slices as DonutSlice[]) {
    sum += s.value
  }
  return sum
})

const centerValue = computed(() => {
  const formatted = new Intl.NumberFormat('vi-VN').format(total.value)
  return `${formatted}${props.valueSuffix}`
})

function donutPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number
): string {
  const x1 = cx + rOuter * Math.cos(startAngle)
  const y1 = cy + rOuter * Math.sin(startAngle)
  const x2 = cx + rOuter * Math.cos(endAngle)
  const y2 = cy + rOuter * Math.sin(endAngle)
  const x3 = cx + rInner * Math.cos(endAngle)
  const y3 = cy + rInner * Math.sin(endAngle)
  const x4 = cx + rInner * Math.cos(startAngle)
  const y4 = cy + rInner * Math.sin(startAngle)
  const sweep = endAngle - startAngle
  const large = Math.abs(sweep) > Math.PI ? 1 : 0
  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4}`,
    'Z'
  ].join(' ')
}

function fullDonutPath(rOuter: number, rInner: number): string {
  // Two half-arcs to avoid SVG degenerate full-circle arc bug.
  return [
    `M ${rOuter} 0`,
    `A ${rOuter} ${rOuter} 0 1 1 ${-rOuter} 0`,
    `A ${rOuter} ${rOuter} 0 1 1 ${rOuter} 0`,
    `Z`,
    `M ${rInner} 0`,
    `A ${rInner} ${rInner} 0 1 0 ${-rInner} 0`,
    `A ${rInner} ${rInner} 0 1 0 ${rInner} 0`,
    `Z`
  ].join(' ')
}

const segments = computed(() => {
  const t = total.value
  if (t <= 0) return []
  const cx = 0
  const cy = 0
  const list = props.slices as DonutSlice[]
  const nonZero = list.filter(s => s.value > 0)

  // Single-slice 100% case: render full ring to avoid degenerate SVG arc.
  if (nonZero.length === 1) {
    const only = nonZero[0]!
    const idx = list.indexOf(only)
    return [{
      label: only.label,
      value: only.value,
      color: only.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length]!,
      pct: 100,
      path: fullDonutPath(props.rOuter, props.rInner)
    }]
  }

  let angle = -Math.PI / 2
  return list.map((s, i) => {
    const sweep = (s.value / t) * Math.PI * 2
    const start = angle
    const end = angle + sweep
    angle = end
    const pct = Math.round((s.value / t) * 1000) / 10
    return {
      label: s.label,
      value: s.value,
      color: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]!,
      pct,
      path: s.value > 0 ? donutPath(cx, cy, props.rOuter, props.rInner, start, end) : ''
    }
  })
})

function formatNum(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center gap-6">
    <div class="relative shrink-0">
      <svg
        :viewBox="`0 0 ${props.size} ${props.size}`"
        class="size-[200px] sm:size-[220px] text-slate-500"
        role="img"
        :aria-label="props.title"
      >
        <g :transform="`translate(${props.size / 2} ${props.size / 2})`">
          <path
            v-for="(seg, i) in segments"
            :key="i"
            :d="seg.path"
            :fill="seg.color"
            fill-rule="evenodd"
            stroke="white"
            stroke-width="1"
            class="transition-opacity hover:opacity-90"
          />
        </g>
        <text
          x="50%"
          y="48%"
          text-anchor="middle"
          class="fill-current text-[11px]"
        >
          {{ props.centerLabel }}
        </text>
        <text
          x="50%"
          y="56%"
          text-anchor="middle"
          class="fill-slate-900 text-sm font-bold tabular-nums"
        >
          {{ centerValue }}
        </text>
      </svg>
    </div>
    <ul class="flex-1 space-y-2 min-w-0 w-full text-sm">
      <li
        v-for="(seg, i) in segments"
        :key="'leg-' + i"
        class="flex items-start gap-2"
      >
        <span
          class="mt-1.5 size-2.5 shrink-0 rounded-sm"
          :style="{ backgroundColor: seg.color }"
        />
        <div class="min-w-0 flex-1">
          <span class="text-slate-900">{{ seg.label }}</span>
          <span class="text-slate-500"> — {{ formatNum(seg.value) }}{{ props.valueSuffix }} ({{ seg.pct }}%)</span>
        </div>
      </li>
    </ul>
  </div>
</template>
