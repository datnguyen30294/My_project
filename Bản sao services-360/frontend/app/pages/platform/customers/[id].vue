<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { PlatformCustomerTicketsItem } from '~/composables/api/useCustomers'

definePageMeta({ layout: 'platform' })

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error } = usePlatformCustomerDetail(id)
const customer = computed(() => data.value?.data)
const tickets = computed(() => customer.value?.tickets ?? [])

useSeoMeta({
  title: computed(() => customer.value ? `${customer.value.name} - Thần Nông` : 'Chi tiết cư dân')
})

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

const ticketColumns: TableColumn<PlatformCustomerTicketsItem>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'subject', header: 'Tiêu đề' },
  { accessorKey: 'status', header: 'Trạng thái' },
  { accessorKey: 'channel', header: 'Kênh' },
  { accessorKey: 'created_at', header: 'Ngày gửi' },
  stickyRight<PlatformCustomerTicketsItem>({ id: 'actions', header: '' }, { width: 'w-[80px] min-w-[80px]' })
]
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        to="/platform/customers"
      />
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">
          Chi tiết cư dân
        </h1>
        <p class="text-slate-500 text-sm mt-0.5">
          {{ customer?.name ?? '...' }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex flex-col gap-4"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="h-20 bg-slate-100 rounded-xl animate-pulse"
      />
    </div>

    <!-- Error -->
    <UAlert
      v-else-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không tìm thấy cư dân này."
    />

    <!-- Content -->
    <div
      v-else-if="customer"
      class="flex flex-col gap-6"
    >
      <!-- Customer info -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100">
            <h2 class="font-bold text-slate-900">
              Thông tin cư dân
            </h2>
          </div>
          <div class="px-6 py-5 flex flex-col gap-5">
            <div class="grid grid-cols-2 gap-4">
              <SharedFieldDisplay label="Họ tên">
                <span class="font-medium">{{ customer.name }}</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Số điện thoại">
                <span class="font-mono">{{ customer.phone }}</span>
              </SharedFieldDisplay>
            </div>
            <SharedFieldDisplay
              v-if="customer.address"
              label="Địa chỉ"
            >
              {{ customer.address }}
            </SharedFieldDisplay>
            <div class="grid grid-cols-2 gap-4">
              <SharedFieldDisplay label="Ngày tạo">
                {{ formatDateTime(customer.created_at) }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Cập nhật lần cuối">
                {{ formatDateTime(customer.updated_at) }}
              </SharedFieldDisplay>
            </div>
          </div>
        </div>

        <!-- Stats sidebar -->
        <div class="flex flex-col gap-4">
          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm">
                Thống kê
              </h3>
            </div>
            <div class="px-5 py-4 flex flex-col gap-3">
              <SharedFieldDisplay label="Tổng số yêu cầu">
                <span class="text-lg font-bold text-primary-600">{{ tickets.length }}</span>
              </SharedFieldDisplay>
            </div>
          </div>
        </div>
      </div>

      <!-- Tickets table -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100">
          <h2 class="font-bold text-slate-900">
            Danh sách yêu cầu
            <span class="text-slate-400 font-normal text-sm ml-1">({{ tickets.length }})</span>
          </h2>
        </div>

        <UTable
          :data="tickets"
          :columns="ticketColumns"
        >
          <template #status-cell="{ row }">
            <UBadge
              :color="statusColor(row.original.status.value)"
              variant="subtle"
              :label="row.original.status.label"
            />
          </template>

          <template #channel-cell="{ row }">
            {{ row.original.channel.label }}
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

        <div
          v-if="tickets.length === 0"
          class="px-6 py-8 text-center text-slate-400 text-sm"
        >
          Chưa có yêu cầu nào.
        </div>
      </div>
    </div>
  </div>
</template>
