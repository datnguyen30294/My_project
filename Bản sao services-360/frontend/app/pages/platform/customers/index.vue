<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { PlatformCustomerListResource, PlatformCustomerIndexParams } from '~/composables/api/useCustomers'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Quản lý cư dân - Thần Nông' })

const params = reactive<PlatformCustomerIndexParams>({
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

const { data, status, error, refresh } = usePlatformCustomerList(
  computed(() => ({ ...params, page: page.value }))
)

const customers = computed<PlatformCustomerListResource[]>(() => data.value?.data ?? [])

const columns: TableColumn<PlatformCustomerListResource>[] = [
  { accessorKey: 'name', header: 'Họ tên' },
  { accessorKey: 'phone', header: 'Số điện thoại' },
  { accessorKey: 'address', header: 'Địa chỉ' },
  { accessorKey: 'tickets_count', header: 'Số yêu cầu' },
  { accessorKey: 'created_at', header: 'Ngày tạo' },
  stickyRight<PlatformCustomerListResource>({ id: 'actions', header: '' }, { width: 'w-[80px] min-w-[80px]' })
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Quản lý cư dân
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Danh sách cư dân đã gửi yêu cầu hỗ trợ.
      </p>
    </div>

    <!-- Search -->
    <div class="mb-4 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo tên, SĐT..."
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
        :data="customers"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #address-cell="{ row }">
          <span class="text-slate-500">{{ row.original.address || '—' }}</span>
        </template>

        <template #tickets_count-cell="{ row }">
          <UBadge
            :label="String(row.original.tickets_count)"
            color="primary"
            variant="subtle"
            size="sm"
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
            :to="`/platform/customers/${row.original.id}`"
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
