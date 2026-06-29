<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { TenantResidentRatingResource } from '~/composables/api/useTenants'
import { useTenantResidentRatings } from '~/composables/api/useTenants'
import { useProjectResidentRatings } from '~/composables/api/usePlatformProjects'

interface Props {
  tenantId: string
  /** Khi có: lọc đánh giá theo một dự án thay vì toàn tenant. */
  projectId?: number
}

const props = defineProps<Props>()

const isProjectScope = props.projectId != null

const page = ref(1)
const ratingFilter = ref<number>(0)

const RATING_FILTER_OPTIONS = [
  { label: 'Tất cả số sao', value: 0 },
  { label: '5 ★', value: 5 },
  { label: '4 ★', value: 4 },
  { label: '3 ★', value: 3 },
  { label: '2 ★', value: 2 },
  { label: '1 ★', value: 1 }
]

watch(ratingFilter, () => {
  page.value = 1
})

const ratingParams = computed(() => ({
  rating: ratingFilter.value || undefined,
  page: page.value
}))

const { data, status, error, refresh } = isProjectScope
  ? useProjectResidentRatings(() => props.tenantId, () => props.projectId!, ratingParams)
  : useTenantResidentRatings(() => props.tenantId, ratingParams)

const introText = isProjectScope
  ? 'Tổng hợp đánh giá của cư dân trên các ticket đã xử lý của dự án.'
  : 'Tổng hợp đánh giá của cư dân trên các ticket đã xử lý của tenant.'

const ratings = computed<TenantResidentRatingResource[]>(() => data.value?.data ?? [])
const summary = computed(() => data.value?.summary ?? null)

const summaryLabel = computed(() => {
  if (!summary.value || summary.value.count === 0) return null
  return `TB ${summary.value.average}/5 · ${summary.value.count} lượt`
})

const columns: TableColumn<TenantResidentRatingResource>[] = [
  { id: 'ticket', header: 'Ticket' },
  { id: 'project', header: 'Dự án' },
  { accessorKey: 'resident_name', header: 'Cư dân' },
  { id: 'rating', header: 'Điểm' },
  { id: 'comment', header: 'Nhận xét' },
  { id: 'rated_at', header: 'Thời điểm' }
]
</script>

<template>
  <SharedSectionCard
    title="Đánh giá của cư dân"
    icon="i-lucide-star"
  >
    <template #header-actions>
      <UBadge
        v-if="summaryLabel"
        color="warning"
        variant="subtle"
        icon="i-lucide-star"
        :label="summaryLabel"
      />
      <USelect
        v-model="ratingFilter"
        :items="RATING_FILTER_OPTIONS"
        size="sm"
        class="w-36"
      />
    </template>

    <p class="text-sm text-slate-500 mb-4">
      {{ introText }}
    </p>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải danh sách đánh giá. Vui lòng thử lại."
      class="mb-4"
    >
      <template #actions>
        <UButton
          label="Thử lại"
          color="error"
          variant="soft"
          size="xs"
          icon="i-lucide-refresh-cw"
          @click="refresh()"
        />
      </template>
    </UAlert>

    <div class="border border-slate-200 rounded-xl overflow-hidden">
      <UTable
        :data="ratings"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #ticket-cell="{ row }">
          <div class="min-w-0">
            <p
              v-if="row.original.ticket_code"
              class="text-sm font-medium text-slate-900 font-mono"
            >
              {{ row.original.ticket_code }}
            </p>
            <p class="text-xs text-slate-500 truncate max-w-48">
              {{ row.original.subject }}
            </p>
          </div>
        </template>

        <template #project-cell="{ row }">
          <span
            v-if="row.original.project_name"
            class="text-sm text-slate-700"
          >{{ row.original.project_name }}</span>
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #rating-cell="{ row }">
          <div class="flex items-center gap-0.5 text-base leading-none">
            <span
              v-for="star in 5"
              :key="star"
              :class="star <= row.original.rating ? 'text-amber-400' : 'text-slate-300'"
            >★</span>
          </div>
        </template>

        <template #comment-cell="{ row }">
          <span
            v-if="row.original.comment"
            class="text-sm text-slate-700 line-clamp-2 max-w-64"
          >{{ row.original.comment }}</span>
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #rated_at-cell="{ row }">
          <span class="text-sm text-slate-500 whitespace-nowrap">
            {{ formatDateTime(row.original.rated_at) }}
          </span>
        </template>

        <template #empty>
          <UEmpty
            title="Chưa có đánh giá nào từ cư dân"
            description="Đánh giá xuất hiện sau khi cư dân chấm điểm ticket đã xử lý."
            icon="i-lucide-star"
          />
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>
  </SharedSectionCard>
</template>
