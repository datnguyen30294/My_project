<script setup lang="ts">
export interface StackedColumnSeries {
  key: string
  label: string
  color: string
}

export interface StackedColumnCategory {
  label: string
  values: Record<string, number>
}

const props = withDefaults(
  defineProps<{
    categories: readonly StackedColumnCategory[] | StackedColumnCategory[]
    series: readonly StackedColumnSeries[] | StackedColumnSeries[]
    emptyText?: string
    maxBars?: number
    barWidth?: number
    barGap?: number
    height?: number
    valueSuffix?: string
  }>(),
  {
    emptyText: 'Chưa có dữ liệu',
    maxBars: 20,
    barWidth: 48,
    barGap: 24,
    height: 320,
    valueSuffix: ''
  }
)

const PAD = { top: 24, right: 16, bottom: 96, left: 72 }

const seriesList = computed(() => [...props.series] as StackedColumnSeries[])

const sortedCategories = computed(() => {
  const list = [...props.categories] as StackedColumnCategory[]
  const withTotals = list.map((c) => {
    let total = 0
    for (const s of seriesList.value) {
      total += c.values[s.key] ?? 0
    }
    return { category: c, total }
  })
  withTotals.sort((a, b) => b.total - a.total)
  return withTotals.slice(0, props.maxBars).filter(x => x.total > 0)
})

const maxValue = computed(() => {
  let max = 0
  for (const { total } of sortedCategories.value) {
    if (total > max) max = total
  }
  return max > 0 ? max : 1
})

const chartWidth = computed(() => {
  const n = sortedCategories.value.length
  const inner = n * props.barWidth + Math.max(0, n - 1) * props.barGap
  return PAD.left + inner + PAD.right
})

const plotHeight = computed(() => props.height - PAD.top - PAD.bottom)

const bars = computed(() => {
  const scale = plotHeight.value / maxValue.value
  const zeroY = props.height - PAD.bottom
  return sortedCategories.value.map(({ category, total }, i) => {
    const x = PAD.left + i * (props.barWidth + props.barGap)
    const cx = x + props.barWidth / 2
    let cursorY = zeroY
    const segments: {
      key: string
      label: string
      color: string
      y: number
      h: number
      value: number
    }[] = []
    for (const s of seriesList.value) {
      const v = category.values[s.key] ?? 0
      if (v <= 0) continue
      const h = v * scale
      cursorY -= h
      segments.push({
        key: s.key,
        label: s.label,
        color: s.color,
        y: cursorY,
        h,
        value: v
      })
    }
    return {
      x,
      cx,
      w: props.barWidth,
      label: category.label,
      total,
      totalY: cursorY - 6,
      segments
    }
  })
})

const yTicks = computed(() => {
  const max = maxValue.value
  const steps = 4
  return Array.from({ length: steps + 1 }, (_, i) => {
    const v = (max / steps) * i
    return {
      value: v,
      y: props.height - PAD.bottom - (v / max) * plotHeight.value
    }
  })
})

function formatShort(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return new Intl.NumberFormat('vi-VN').format(Math.round(n))
}

function formatTooltip(n: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(Math.round(n))}${props.valueSuffix}`
}
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
          class="inline-block size-2.5 rounded-sm"
          :style="{ backgroundColor: s.color }"
        />
        <span class="text-slate-600">{{ s.label }}</span>
      </span>
    </div>

    <template v-if="sortedCategories.length === 0">
      <p class="py-12 text-center text-sm text-slate-500">
        {{ props.emptyText }}
      </p>
    </template>

    <template v-else>
      <div class="w-full overflow-x-auto">
        <svg
          :viewBox="`0 0 ${chartWidth} ${props.height}`"
          :width="chartWidth"
          :height="props.height"
          class="text-slate-500"
          role="img"
          aria-label="Biểu đồ cột"
        >
          <g>
            <line
              v-for="(t, i) in yTicks"
              :key="'grid-' + i"
              :x1="PAD.left"
              :y1="t.y"
              :x2="chartWidth - PAD.right"
              :y2="t.y"
              stroke="currentColor"
              :stroke-opacity="i === 0 ? 0.3 : 0.08"
              stroke-dasharray="3,3"
            />
            <text
              v-for="(t, i) in yTicks"
              :key="'yl-' + i"
              :x="PAD.left - 8"
              :y="t.y + 3"
              text-anchor="end"
              class="fill-current text-[10px] tabular-nums"
            >
              {{ formatShort(t.value) }}
            </text>
          </g>

          <g
            v-for="(b, i) in bars"
            :key="'bar-' + i"
          >
            <rect
              v-for="seg in b.segments"
              :key="seg.key"
              :x="b.x"
              :y="seg.y"
              :width="b.w"
              :height="seg.h"
              :fill="seg.color"
              rx="2"
            >
              <title>{{ seg.label }}: {{ formatTooltip(seg.value) }}</title>
            </rect>

            <text
              v-if="b.total > 0"
              :x="b.cx"
              :y="b.totalY"
              text-anchor="middle"
              class="fill-slate-800 text-[10px] font-semibold tabular-nums"
            >
              {{ formatShort(b.total) }}
            </text>

            <text
              :x="b.cx"
              :y="props.height - PAD.bottom + 16"
              :transform="`rotate(-35 ${b.cx} ${props.height - PAD.bottom + 16})`"
              text-anchor="end"
              class="fill-current text-[10px]"
            >
              <title>{{ b.label }}</title>
              {{ b.label.length > 20 ? b.label.slice(0, 19) + '…' : b.label }}
            </text>
          </g>
        </svg>
      </div>
    </template>
  </div>
</template>
