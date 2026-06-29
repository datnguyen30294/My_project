<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ProjectOrderResource } from '~/composables/api/usePlatformProjects'
import { useProjectOrders } from '~/composables/api/usePlatformProjects'

interface Props {
  tenantId: string
  projectId: number
}

const props = defineProps<Props>()

const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  searchTerm.value = value || undefined
  page.value = 1
})
const searchTerm = ref<string | undefined>(undefined)

const { data, status, error, refresh } = useProjectOrders(
  () => props.tenantId,
  () => props.projectId,
  computed(() => ({ search: searchTerm.value, page: page.value }))
)

const orders = computed<ProjectOrderResource[]>(() => data.value?.data ?? [])

const pageTotals = computed(() => orders.value.reduce(
  (acc, order) => {
    acc.totalValue += Number(order.total_amount)
    acc.totalFee += Number(order.platform_fee)
    return acc
  },
  { totalValue: 0, totalFee: 0 }
))

const columns: TableColumn<ProjectOrderResource>[] = [
  { accessorKey: 'code', header: 'Mã đơn' },
  { id: 'total_amount', header: 'Giá trị đơn' },
  { id: 'platform_fee', header: 'Phí platform' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'completed_at', header: 'Thời gian' }
]

const selectedOrder = ref<ProjectOrderResource | null>(null)
const showOrderDetail = ref(false)

function openOrderDetail(order: ProjectOrderResource) {
  selectedOrder.value = order
  showOrderDetail.value = true
}
</script>

<template>
  <SharedSectionCard
    title="Đơn hàng dự án"
    icon="i-lucide-shopping-cart"
  >
    <template #header-actions>
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <UBadge
          color="neutral"
          variant="subtle"
          :label="`Tổng giá trị (trang này): ${formatCurrency(pageTotals.totalValue)}`"
        />
        <UBadge
          color="success"
          variant="subtle"
          :label="`Tổng phí platform (trang này): ${formatCurrency(pageTotals.totalFee)}`"
        />
      </div>
    </template>

    <p class="text-sm text-slate-500 mb-4">
      Đơn hàng PMC của dự án kèm phí nền tảng đã đóng băng tại kỳ chốt phí (đơn chưa vào kỳ hiển thị 0).
    </p>

    <div class="mb-4">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo mã đơn..."
        class="max-w-xs"
        @update:model-value="onSearch"
      />
    </div>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải danh sách đơn hàng. Vui lòng thử lại."
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
        :data="orders"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #code-cell="{ row }">
          <button
            type="button"
            class="font-mono text-primary-600 hover:underline"
            @click="openOrderDetail(row.original)"
          >
            {{ row.original.code }}
          </button>
        </template>

        <template #total_amount-cell="{ row }">
          <span class="tabular-nums text-slate-900">{{ formatCurrency(Number(row.original.total_amount)) }}</span>
        </template>

        <template #platform_fee-cell="{ row }">
          <span class="tabular-nums text-emerald-600">{{ formatCurrency(Number(row.original.platform_fee)) }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            color="neutral"
            variant="subtle"
            :label="row.original.status.label"
          />
        </template>

        <template #completed_at-cell="{ row }">
          <span
            v-if="row.original.completed_at"
            class="text-sm text-slate-500 whitespace-nowrap"
          >{{ formatDateTime(row.original.completed_at) }}</span>
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #empty>
          <UEmpty
            icon="i-lucide-shopping-cart"
            title="Chưa có đơn hàng nào"
            description="Đơn hàng PMC của dự án sẽ hiển thị tại đây."
          />
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>

    <PlatformProjectOrderDetailModal
      v-model:open="showOrderDetail"
      :order="selectedOrder"
    />
  </SharedSectionCard>
</template>
