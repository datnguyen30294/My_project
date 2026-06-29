<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { WorkforceCapacityRow } from '~/composables/api/useWorkforce'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

const filterProjectId = ref<number | null>(null)
const searchInput = ref('')
const searchValue = ref<string | undefined>(undefined)

if (route.query.project_id) {
  const n = Number(route.query.project_id)
  if (!Number.isNaN(n)) filterProjectId.value = n
}
if (typeof route.query.search === 'string' && route.query.search.length <= 100) {
  searchInput.value = route.query.search
  searchValue.value = route.query.search
}

const isInit = ref(true)
nextTick(() => {
  isInit.value = false
})

watch([filterProjectId, searchValue], () => {
  if (isInit.value) return
  const query: Record<string, string> = {}
  if (filterProjectId.value != null) query.project_id = String(filterProjectId.value)
  if (searchValue.value) query.search = searchValue.value
  router.replace({ query })
})

const { onSearch } = useTableSearch((value) => {
  searchValue.value = value
})

const hasFilters = computed(() =>
  filterProjectId.value != null || !!searchValue.value
)

function clearFilters() {
  filterProjectId.value = null
  searchInput.value = ''
  searchValue.value = undefined
}

const { data, status, error, refresh } = useWorkforceCapacityList(
  computed(() => ({ projectId: filterProjectId.value, search: searchValue.value ?? null }))
)

const payload = computed(() => data.value?.data ?? null)
const rows = computed<WorkforceCapacityRow[]>(() => payload.value?.rows ?? [])
const summary = computed(() => payload.value?.summary ?? null)

const toast = useToast()
const tooManyStaff = ref(false)

watch(error, (err) => {
  if (!err) {
    tooManyStaff.value = false
    return
  }
  const statusCode = (err as { statusCode?: number, status?: number }).statusCode
    ?? (err as { status?: number }).status
  const errData = (err as { data?: { message?: string, errors?: Record<string, string[]> } }).data
  if (statusCode === 422) {
    if (errData?.errors?.search) {
      toast.add({
        color: 'warning',
        title: 'Từ khóa tối đa 100 ký tự',
        description: errData.errors.search[0]
      })
    } else {
      tooManyStaff.value = true
    }
  } else {
    tooManyStaff.value = false
  }
})

const columns: TableColumn<WorkforceCapacityRow>[] = [
  {
    accessorKey: 'full_name',
    header: 'Nhân sự',
    cell: ({ row }) =>
      h('div', {}, [
        h('div', { class: 'font-medium text-[var(--ui-text)]' }, row.original.full_name),
        row.original.employee_code
          ? h('div', { class: 'text-xs text-[var(--ui-text-muted)]' }, row.original.employee_code)
          : null
      ])
  },
  {
    accessorKey: 'job_title_name',
    header: 'Chức danh',
    cell: ({ row }) => row.original.job_title_name ?? '—'
  },
  {
    accessorKey: 'project_names',
    header: 'Dự án',
    meta: { class: { td: 'max-w-[200px] text-sm whitespace-normal' } },
    cell: ({ row }) =>
      row.original.project_names.length > 0
        ? row.original.project_names.join(', ')
        : '—'
  },
  { accessorKey: 'pending', header: 'Chờ' },
  { accessorKey: 'in_progress', header: 'Đang làm' },
  { accessorKey: 'completed', header: 'Xong' },
  {
    id: 'rating',
    header: 'ĐTB đánh giá',
    meta: { class: { td: 'text-sm tabular-nums' } },
    cell: ({ row }) => {
      const r = row.original
      if (r.avg_rating == null) return '—'
      return `${r.avg_rating} / 5 · ${r.rating_count} lượt`
    }
  },
  {
    id: 'capability_rating',
    header: 'Năng lực nhân sự',
    meta: { class: { td: 'text-sm' } },
    cell: ({ row }) =>
      h(resolveComponent('SharedCapabilityRatingBadge'), {
        rating: row.original.capability_rating,
        showWhenNull: true,
        nullLabel: '—'
      })
  },
  {
    id: 'link',
    header: '',
    meta: { class: { td: 'text-right' } },
    cell: ({ row }) =>
      h(resolveComponent('NuxtLink'), { to: `/pmc/accounts/${row.original.account_id}` }, () =>
        h(resolveComponent('UButton'), {
          variant: 'link',
          size: 'xs',
          label: 'Hồ sơ',
          icon: 'i-lucide-external-link'
        })
      )
  }
]

useHead({ title: 'Năng lực nhân sự — TNP Service' })
</script>

<template>
  <div class="space-y-4">
    <SharedCrudPageHeader
      title="Năng lực nhân sự"
      description="Theo dõi tải việc và điểm đánh giá của nhân sự theo dự án"
    />

    <!-- KPI row -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <UCard>
        <p class="text-xs text-[var(--ui-text-muted)] mb-1">
          Nhân sự (theo bộ lọc)
        </p>
        <USkeleton
          v-if="status === 'pending' && !summary"
          class="h-8 w-16"
        />
        <p
          v-else
          class="text-2xl font-bold tabular-nums"
        >
          {{ summary?.staff_count ?? 0 }}
        </p>
      </UCard>
      <UCard>
        <p class="text-xs text-[var(--ui-text-muted)] mb-1">
          Đang xử lý
        </p>
        <USkeleton
          v-if="status === 'pending' && !summary"
          class="h-8 w-16"
        />
        <p
          v-else
          class="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400"
        >
          {{ summary?.total_in_progress ?? 0 }}
        </p>
      </UCard>
      <UCard>
        <p class="text-xs text-[var(--ui-text-muted)] mb-1">
          Chờ xử lý
        </p>
        <USkeleton
          v-if="status === 'pending' && !summary"
          class="h-8 w-16"
        />
        <p
          v-else
          class="text-2xl font-bold tabular-nums text-[var(--ui-primary)]"
        >
          {{ summary?.total_pending ?? 0 }}
        </p>
      </UCard>
      <UCard>
        <p class="text-xs text-[var(--ui-text-muted)] mb-1">
          TB đánh giá (nhóm)
        </p>
        <USkeleton
          v-if="status === 'pending' && !summary"
          class="h-8 w-16"
        />
        <template v-else>
          <p class="text-2xl font-bold tabular-nums">
            {{ summary?.pooled_avg_rating != null ? `${summary.pooled_avg_rating} / 5` : '—' }}
          </p>
          <p class="text-[11px] text-[var(--ui-text-muted)] mt-1">
            {{ summary?.total_rating_events ?? 0 }} lượt · {{ summary?.staff_with_ratings ?? 0 }} nhân sự có điểm
          </p>
        </template>
      </UCard>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-end gap-4">
      <UFormField
        label="Dự án"
        class="min-w-56"
      >
        <SharedProjectSelect
          v-model="filterProjectId"
          placeholder="Tất cả dự án"
        />
      </UFormField>
      <UFormField
        label="Tìm nhân sự"
        class="min-w-64"
      >
        <UInput
          v-model="searchInput"
          icon="i-lucide-search"
          placeholder="Tên hoặc mã NV..."
          autocomplete="nope"
          @update:model-value="onSearch"
        />
      </UFormField>
      <UButton
        v-if="hasFilters"
        icon="i-lucide-x"
        label="Xóa bộ lọc"
        color="neutral"
        variant="ghost"
        size="sm"
        class="mb-1"
        @click="clearFilters"
      />
    </div>

    <!-- Warning: too many staff -->
    <UAlert
      v-if="tooManyStaff"
      color="warning"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="Quá nhiều nhân sự"
      description="Vui lòng lọc theo dự án để thu hẹp danh sách."
    />

    <!-- Table -->
    <SharedCrudTableWrapper
      v-else
      :status="status"
      :error="error"
      :data="data"
      :refresh="refresh"
    >
      <div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm">
        <UTable
          :data="rows"
          :columns="columns"
          :empty-state="{ icon: 'i-lucide-users', label: 'Không có nhân sự khớp bộ lọc.' }"
        />
      </div>

      <p class="text-xs text-[var(--ui-text-muted)] mt-4">
        Đã hoàn thành:
        <strong>{{ summary?.total_completed ?? 0 }}</strong> phân công.
        Xem chi tiết lịch:
        <NuxtLink
          to="/quan-ly-cong-viec/lich-viec-doi"
          class="text-[var(--ui-primary)] underline"
        >
          Lịch việc đội
        </NuxtLink>,
        <NuxtLink
          to="/quan-ly-cong-viec/lich-viec-ca-nhan"
          class="text-[var(--ui-primary)] underline"
        >
          Lịch việc cá nhân
        </NuxtLink>.
      </p>
    </SharedCrudTableWrapper>
  </div>
</template>
