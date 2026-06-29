<script setup lang="ts">
interface Props {
  rating: number | null | undefined
  size?: 'xs' | 'sm' | 'md'
  showWhenNull?: boolean
  nullLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  showWhenNull: false,
  nullLabel: 'Chưa đánh giá'
})

const color = computed<'success' | 'primary' | 'warning' | 'neutral'>(() => {
  const r = props.rating
  if (r == null) return 'neutral'
  if (r >= 8) return 'success'
  if (r >= 5) return 'primary'
  return 'warning'
})

const label = computed(() =>
  props.rating == null ? props.nullLabel : `${props.rating}/10`
)
</script>

<template>
  <UBadge
    v-if="rating != null || showWhenNull"
    :label="label"
    :color="color"
    variant="subtle"
    :size="size"
    icon="i-lucide-star"
  />
</template>
