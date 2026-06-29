<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { TicketResource, TicketIndexParams } from '~/composables/api/useTickets'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Quản lý yêu cầu - Thần Nông' })

const params = reactive<TicketIndexParams>({
  search: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const hasFilters = computed(() => !!searchInput.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  page.value = 1
}

const { data, status, error, refresh } = usePlatformTicketList(
  computed(() => ({ ...params, page: page.value }))
)

const tickets = computed<TicketResource[]>(() => data.value?.data ?? [])

const columns: TableColumn<TicketResource>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'subject', header: 'Tiêu đề' },
  { accessorKey: 'requester_name', header: 'Người gửi' },
  { accessorKey: 'requester_phone', header: 'SĐT' },
  { accessorKey: 'status', header: 'Trạng thái' },
  { accessorKey: 'created_at', header: 'Ngày gửi' },
  stickyRight<TicketResource>({ id: 'actions', header: '' }, { width: 'w-[80px] min-w-[80px]' })
]

function statusColor(value: string) {
  switch (value) {
    case 'pending': return 'warning'
    case 'received': return 'info'
    case 'in_progress': return 'primary'
    case 'completed': return 'success'
    case 'cancelled': return 'neutral'
    default: return 'neutral'
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Quản lý yêu cầu
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Danh sách các yêu cầu hỗ trợ đã được ghi nhận.
      </p>
    </div>

    <!-- Search -->
    <div class="mb-4 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo tiêu đề, tên, SĐT..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <UButton
        v-if="hasFilters"
        icon="i-lucide-x"
        label="Xóa bộ lọc"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="clearFilters"
      />
      <UButton
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="ghost"
        size="sm"
        :loading="status === 'pending'"
        @click="refresh()"
      />
    </div>

    <!-- Error state -->
    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải dữ liệu. Vui lòng thử lại."
      class="mb-4"
    />

    <!-- Table -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="tickets"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #status-cell="{ row }">
          <UBadge
            :color="statusColor(row.original.status.value)"
            variant="subtle"
            :label="row.original.status.label"
          />
        </template>

        <template #created_at-cell="{ row }">
          {{ formatDate(row.original.created_at) }}
        </template>

        <template #actions-cell="{ row }">
          <UButton
            icon="i-lucide-eye"
            color="neutral"
            variant="ghost"
            size="sm"
            :to="`/platform/tickets/${row.original.id}`"
          />
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>
  </div>
</template>
