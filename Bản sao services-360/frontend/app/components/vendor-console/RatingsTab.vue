<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { PartnerRating } from '~/composables/api/usePartners'
import { usePlatformPartnerRatings } from '~/composables/api/usePartners'

interface Props {
  partnerId: number | string
}

const props = defineProps<Props>()

const page = ref(1)

const { data, status, error } = usePlatformPartnerRatings(
  () => props.partnerId,
  computed(() => ({ page: page.value, per_page: DEFAULT_PER_PAGE }))
)

const ratings = computed<PartnerRating[]>(() => data.value?.data ?? [])
const summary = computed(() => data.value?.summary ?? null)

const columns: TableColumn<PartnerRating>[] = [
  { id: 'order', header: 'Mã đơn' },
  { id: 'project', header: 'Dự án' },
  { id: 'resident', header: 'Cư dân' },
  { id: 'score', header: 'Điểm' },
  { id: 'comment', header: 'Nhận xét' },
  { id: 'rated_at', header: 'Thời điểm' }
]
</script>

<template>
  <div class="space-y-4">
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      description="Không thể tải đánh giá."
    />

    <div
      v-if="summary && summary.count > 0"
      class="flex items-center gap-2 text-sm text-slate-600"
    >
      <UIcon
        name="i-lucide-star"
        class="size-4 text-amber-500"
      />
      <span class="font-semibold text-slate-900">{{ summary.average?.toFixed(1) ?? '—' }}</span>
      <span>· {{ summary.count }} lượt đánh giá</span>
    </div>

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="ratings"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #order-cell="{ row }">
          <span class="font-mono text-sm">{{ row.original.order_code }}</span>
        </template>

        <template #project-cell="{ row }">
          <span class="text-sm">{{ row.original.project?.name ?? '—' }}</span>
        </template>

        <template #resident-cell="{ row }">
          <span class="text-sm">{{ row.original.resident_name }}</span>
        </template>

        <template #score-cell="{ row }">
          <div class="flex items-center gap-1 text-amber-500">
            <UIcon
              name="i-lucide-star"
              class="size-4"
            />
            <span class="font-medium text-slate-900">{{ row.original.score }}</span>
          </div>
        </template>

        <template #comment-cell="{ row }">
          <span class="text-sm text-slate-600 line-clamp-2">{{ row.original.comment ?? '—' }}</span>
        </template>

        <template #rated_at-cell="{ row }">
          <span class="text-sm">{{ row.original.rated_at ? formatDateTime(row.original.rated_at) : '—' }}</span>
        </template>

        <template #empty>
          <div class="py-8 text-center text-sm text-slate-500">
            Chưa có đánh giá.
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>
