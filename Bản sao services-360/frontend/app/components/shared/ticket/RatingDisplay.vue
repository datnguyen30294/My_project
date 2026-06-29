<script setup lang="ts">
interface Props {
  rating: number | null
  comment: string | null
  ratedAt: string | null
}

const props = defineProps<Props>()

const stars = computed(() => {
  if (!props.rating || props.rating < 1) return 0
  return Math.min(5, Math.max(1, Math.round(props.rating)))
})
</script>

<template>
  <div
    v-if="rating"
    class="space-y-2"
  >
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-0.5 text-lg">
        <span
          v-for="star in 5"
          :key="star"
          :class="star <= stars ? 'text-amber-400' : 'text-gray-300'"
        >&#9733;</span>
      </div>
      <span class="text-sm font-semibold text-gray-700">{{ rating }}/5</span>
    </div>
    <p
      v-if="comment"
      class="text-sm text-gray-700"
    >
      "{{ comment }}"
    </p>
    <p
      v-else
      class="text-sm text-gray-400 italic"
    >
      Không có nhận xét
    </p>
    <p
      v-if="ratedAt"
      class="text-xs text-gray-400"
    >
      Đánh giá lúc: {{ formatDateTime(ratedAt) }}
    </p>
  </div>
  <p
    v-else
    class="text-sm text-gray-400 italic"
  >
    Chưa có đánh giá
  </p>
</template>
